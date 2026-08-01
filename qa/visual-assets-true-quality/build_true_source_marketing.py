"""Rebuild marketing delivery assets from the best native repository sources.

No AI restoration, generative redraw, sharpening or upscale is applied.
WebP fallbacks are copied byte-for-byte from their native 1600 px sources.
AVIF primaries are encoded once from the same decoded native sources.
The mobile hero is a verified crop of the 1600x1000 desktop source and is
downsampled to 1200x900.
"""

from __future__ import annotations

import json
import shutil
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "assets" / "marketing" / "remastered"
METRICS = ROOT / "qa" / "visual-assets-true-quality" / "true-source-build.json"

ASSETS = [
    ("hero-desktop", "images/hero/homepage-1600.webp", 90),
    ("solution-doanh-nghiep", "images/solutions/doanh-nghiep-1600.webp", 88),
    ("solution-truong-hoc", "images/solutions/truong-hoc-1600.webp", 88),
    ("solution-nha-may", "images/solutions/nha-may-1600.webp", 88),
    ("brand-promise-ghe-giam-doc", "images/categories/sub/ghe-giam-doc-1600.webp", 88),
    ("brand-promise-ban-cum-module", "images/categories/sub/ban-cum-module-1600.webp", 88),
    ("brand-promise-ban-hop-nho", "images/categories/sub/ban-hop-nho-1600.webp", 88),
    ("brand-promise-tu-locker", "images/categories/sub/tu-locker-1600.webp", 88),
    ("project-workplace", "images/categories/main/ghe-van-phong-1600.webp", 88),
    ("project-education", "images/categories/main/noi-that-truong-hoc-1600.webp", 88),
    ("project-lounge", "images/categories/main/sofa-ghe-cho-1600.webp", 88),
]


def encode_native(name: str, source_relative: str, quality: int) -> dict[str, object]:
    source = ROOT / source_relative
    destination_webp = OUTPUT / f"{name}.webp"
    destination_avif = OUTPUT / f"{name}.avif"
    with Image.open(source) as opened:
        image = opened.convert("RGB")
    shutil.copyfile(source, destination_webp)
    image.save(destination_avif, "AVIF", quality=quality, speed=6)
    return {
        "name": name,
        "source": source_relative,
        "source_dimension": f"{image.width}x{image.height}",
        "output_dimension": f"{image.width}x{image.height}",
        "upscale_ratio": 1,
        "operation": "native-source-copy-and-avif-encode",
        "source_bytes": source.stat().st_size,
        "webp_bytes": destination_webp.stat().st_size,
        "avif_bytes": destination_avif.stat().st_size,
    }


def encode_mobile_hero() -> dict[str, object]:
    source_relative = "images/hero/homepage-1600.webp"
    source = ROOT / source_relative
    destination_webp = OUTPUT / "hero-mobile.webp"
    destination_avif = OUTPUT / "hero-mobile.avif"
    with Image.open(source) as opened:
        image = opened.convert("RGB")

    # The legacy 720x540 mobile source matches x=72 of a height-normalized
    # 864x540 desktop source (correlation 0.9977). At native resolution this
    # maps to the centered crop x=133..1467, preserving the approved framing.
    crop = image.crop((133, 0, 1467, 1000))
    output = crop.resize((1200, 900), Image.Resampling.LANCZOS)
    output.save(destination_webp, "WEBP", quality=90, method=6)
    output.save(destination_avif, "AVIF", quality=90, speed=6)
    return {
        "name": "hero-mobile",
        "source": source_relative,
        "source_dimension": f"{image.width}x{image.height}",
        "crop_dimension": f"{crop.width}x{crop.height}",
        "output_dimension": f"{output.width}x{output.height}",
        "upscale_ratio": 0.9,
        "operation": "verified-crop-and-downsample",
        "source_bytes": source.stat().st_size,
        "webp_bytes": destination_webp.stat().st_size,
        "avif_bytes": destination_avif.stat().st_size,
    }


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    rows = [encode_native(*asset) for asset in ASSETS]
    rows.insert(1, encode_mobile_hero())
    METRICS.parent.mkdir(parents=True, exist_ok=True)
    METRICS.write_text(
        json.dumps(rows, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Wrote {len(rows)} true-source delivery assets")


if __name__ == "__main__":
    main()
