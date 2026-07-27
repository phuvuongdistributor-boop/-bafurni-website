"""Deterministic BAFurniture marketing-image remaster pipeline.

The Real-ESRGAN result is blended conservatively with a full-source Lanczos
resize. This keeps the photographed furniture and rooms faithful to the source
while recovering edges lost in the small production derivatives.
"""

from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image, ImageFilter
from torch import nn


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "assets" / "marketing" / "remastered"
WEIGHTS = Path.home() / "Downloads" / "RealESRGAN_x4plus.pth"
METRICS = ROOT / "qa" / "marketing-image-quality" / "remaster-metrics.json"

ASSETS = [
    ("hero-desktop", "images/hero/homepage-1600.webp", (1920, 1200), 90),
    ("hero-mobile", "images/hero/homepage-720.webp", (1200, 900), 90),
    ("solution-doanh-nghiep", "images/solutions/doanh-nghiep-720.webp", (1920, 1200), 88),
    ("solution-truong-hoc", "images/solutions/truong-hoc-720.webp", (1920, 1200), 88),
    ("solution-nha-may", "images/solutions/nha-may-720.webp", (1920, 1200), 88),
    ("brand-promise-ghe-giam-doc", "images/categories/sub/ghe-giam-doc.webp", (1920, 1372), 85),
    ("brand-promise-ban-cum-module", "images/categories/sub/ban-cum-module.webp", (1920, 1372), 85),
    ("brand-promise-ban-hop-nho", "images/categories/sub/ban-hop-nho.webp", (1920, 1372), 85),
    ("brand-promise-tu-locker", "images/categories/sub/tu-locker.webp", (1920, 1372), 85),
    ("project-workplace", "images/categories/main/ghe-van-phong-1200.webp", (1920, 1440), 88),
    ("project-education", "images/categories/main/noi-that-truong-hoc-1200.webp", (1920, 1440), 88),
    ("project-lounge", "images/categories/main/sofa-ghe-cho-1200.webp", (1920, 1440), 88),
]


class ResidualDenseBlock(nn.Module):
    def __init__(self, num_feat: int = 64, num_grow_ch: int = 32):
        super().__init__()
        self.conv1 = nn.Conv2d(num_feat, num_grow_ch, 3, 1, 1)
        self.conv2 = nn.Conv2d(num_feat + num_grow_ch, num_grow_ch, 3, 1, 1)
        self.conv3 = nn.Conv2d(num_feat + 2 * num_grow_ch, num_grow_ch, 3, 1, 1)
        self.conv4 = nn.Conv2d(num_feat + 3 * num_grow_ch, num_grow_ch, 3, 1, 1)
        self.conv5 = nn.Conv2d(num_feat + 4 * num_grow_ch, num_feat, 3, 1, 1)
        self.lrelu = nn.LeakyReLU(negative_slope=0.2, inplace=True)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x1 = self.lrelu(self.conv1(x))
        x2 = self.lrelu(self.conv2(torch.cat((x, x1), 1)))
        x3 = self.lrelu(self.conv3(torch.cat((x, x1, x2), 1)))
        x4 = self.lrelu(self.conv4(torch.cat((x, x1, x2, x3), 1)))
        x5 = self.conv5(torch.cat((x, x1, x2, x3, x4), 1))
        return x5 * 0.2 + x


class RRDB(nn.Module):
    def __init__(self, num_feat: int, num_grow_ch: int = 32):
        super().__init__()
        self.rdb1 = ResidualDenseBlock(num_feat, num_grow_ch)
        self.rdb2 = ResidualDenseBlock(num_feat, num_grow_ch)
        self.rdb3 = ResidualDenseBlock(num_feat, num_grow_ch)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.rdb3(self.rdb2(self.rdb1(x))) * 0.2 + x


class RRDBNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv_first = nn.Conv2d(3, 64, 3, 1, 1)
        self.body = nn.Sequential(*[RRDB(64, 32) for _ in range(23)])
        self.conv_body = nn.Conv2d(64, 64, 3, 1, 1)
        self.conv_up1 = nn.Conv2d(64, 64, 3, 1, 1)
        self.conv_up2 = nn.Conv2d(64, 64, 3, 1, 1)
        self.conv_hr = nn.Conv2d(64, 64, 3, 1, 1)
        self.conv_last = nn.Conv2d(64, 3, 3, 1, 1)
        self.lrelu = nn.LeakyReLU(negative_slope=0.2, inplace=True)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        feat = self.conv_first(x)
        feat = feat + self.conv_body(self.body(feat))
        feat = self.lrelu(self.conv_up1(F.interpolate(feat, scale_factor=2, mode="nearest")))
        feat = self.lrelu(self.conv_up2(F.interpolate(feat, scale_factor=2, mode="nearest")))
        return self.conv_last(self.lrelu(self.conv_hr(feat)))


def laplacian_score(image: Image.Image) -> float:
    gray = cv2.cvtColor(np.asarray(image.convert("RGB")), cv2.COLOR_RGB2GRAY)
    return float(cv2.Laplacian(gray, cv2.CV_64F).var())


def run_model(model: nn.Module, image: Image.Image, target: tuple[int, int]) -> Image.Image:
    # A half-target neural layer is sufficient at the conservative 18% blend,
    # while keeping the CPU-only audit reproducible on production workstations.
    neural_input = image.resize((target[0] // 8, target[1] // 8), Image.Resampling.LANCZOS)
    array = np.asarray(neural_input, dtype=np.float32) / 255.0
    tensor = torch.from_numpy(array.transpose(2, 0, 1)).unsqueeze(0)
    with torch.inference_mode():
        restored = model(tensor).clamp_(0, 1)
    restored = restored.squeeze(0).permute(1, 2, 0).cpu().numpy()
    restored_image = Image.fromarray(np.rint(restored * 255).astype(np.uint8), "RGB")
    return restored_image.resize(target, Image.Resampling.LANCZOS)


def remaster(model: nn.Module, source: Image.Image, target: tuple[int, int]) -> Image.Image:
    base = source.convert("RGB").resize(target, Image.Resampling.LANCZOS)
    neural = run_model(model, source.convert("RGB"), target)
    faithful = Image.blend(base, neural, 0.18)
    return faithful.filter(ImageFilter.UnsharpMask(radius=0.75, percent=38, threshold=3))


def main() -> None:
    if not WEIGHTS.exists():
        raise FileNotFoundError(f"Missing official Real-ESRGAN weights: {WEIGHTS}")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    METRICS.parent.mkdir(parents=True, exist_ok=True)
    torch.set_grad_enabled(False)
    torch.set_num_threads(max(1, min(8, torch.get_num_threads())))
    model = RRDBNet().eval()
    payload = torch.load(WEIGHTS, map_location="cpu", weights_only=True)
    model.load_state_dict(payload["params_ema"], strict=True)

    metrics: list[dict[str, object]] = []
    for index, (name, relative, target, quality) in enumerate(ASSETS, 1):
        source_path = ROOT / relative
        with Image.open(source_path) as opened:
            source = opened.convert("RGB")
        webp = OUTPUT / f"{name}.webp"
        avif = OUTPUT / f"{name}.avif"
        cached = webp.exists() and avif.exists()
        if cached:
            with Image.open(webp) as opened:
                result = opened.convert("RGB")
        else:
            result = remaster(model, source, target)
            result.save(webp, "WEBP", quality=quality, method=6)
            result.save(avif, "AVIF", quality=quality, speed=6)
        row = {
            "name": name,
            "source": relative,
            "source_width": source.width,
            "source_height": source.height,
            "source_bytes": source_path.stat().st_size,
            "source_laplacian": round(laplacian_score(source), 2),
            "output_width": result.width,
            "output_height": result.height,
            "output_laplacian": round(laplacian_score(result), 2),
            "output_laplacian_at_source_size": round(
                laplacian_score(result.resize(source.size, Image.Resampling.LANCZOS)), 2
            ),
            "webp_bytes": webp.stat().st_size,
            "avif_bytes": avif.stat().st_size,
            "quality": quality,
            "real_esrgan_blend": 0.18,
        }
        metrics.append(row)
        cache_label = "cached" if cached else "rendered"
        print(f"[{index:02d}/{len(ASSETS):02d}] {name}: {target[0]}x{target[1]} ({cache_label})", flush=True)

    METRICS.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print(f"Wrote {METRICS}", flush=True)


if __name__ == "__main__":
    main()
