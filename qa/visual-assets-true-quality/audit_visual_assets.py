"""Generate reproducible image metrics and visual inspection sheets.

This script does not alter website assets. It compares the browser-selected
preview assets with the highest-resolution non-remastered source available in
the repository and exports 100% overview/contact sheets plus 200% center crops.
"""

from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "qa" / "visual-assets-true-quality" / "generated"

ASSETS = [
    {
        "section": "Hero desktop",
        "name": "hero-desktop",
        "asset": "assets/marketing/remastered/hero-desktop.avif",
        "source": "images/hero/homepage-1600.webp",
        "remaster_source": "images/hero/homepage-1600.webp",
    },
    {
        "section": "Hero mobile",
        "name": "hero-mobile",
        "asset": "assets/marketing/remastered/hero-mobile.avif",
        "source": "images/hero/homepage-1600.webp",
        "remaster_source": "images/hero/homepage-720.webp",
    },
    {
        "section": "Solution doanh nghiệp",
        "name": "solution-doanh-nghiep",
        "asset": "assets/marketing/remastered/solution-doanh-nghiep.avif",
        "source": "images/solutions/doanh-nghiep-1600.webp",
        "remaster_source": "images/solutions/doanh-nghiep-720.webp",
    },
    {
        "section": "Solution trường học",
        "name": "solution-truong-hoc",
        "asset": "assets/marketing/remastered/solution-truong-hoc.avif",
        "source": "images/solutions/truong-hoc-1600.webp",
        "remaster_source": "images/solutions/truong-hoc-720.webp",
    },
    {
        "section": "Solution nhà máy",
        "name": "solution-nha-may",
        "asset": "assets/marketing/remastered/solution-nha-may.avif",
        "source": "images/solutions/nha-may-1600.webp",
        "remaster_source": "images/solutions/nha-may-720.webp",
    },
    {
        "section": "Brand phòng lãnh đạo",
        "name": "brand-promise-ghe-giam-doc",
        "asset": "assets/marketing/remastered/brand-promise-ghe-giam-doc.avif",
        "source": "images/categories/sub/ghe-giam-doc-1600.webp",
        "remaster_source": "images/categories/sub/ghe-giam-doc.webp",
    },
    {
        "section": "Brand văn phòng đội nhóm",
        "name": "brand-promise-ban-cum-module",
        "asset": "assets/marketing/remastered/brand-promise-ban-cum-module.avif",
        "source": "images/categories/sub/ban-cum-module-1600.webp",
        "remaster_source": "images/categories/sub/ban-cum-module.webp",
    },
    {
        "section": "Brand phòng họp",
        "name": "brand-promise-ban-hop-nho",
        "asset": "assets/marketing/remastered/brand-promise-ban-hop-nho.avif",
        "source": "images/categories/sub/ban-hop-nho-1600.webp",
        "remaster_source": "images/categories/sub/ban-hop-nho.webp",
    },
    {
        "section": "Brand nhà máy và kho",
        "name": "brand-promise-tu-locker",
        "asset": "assets/marketing/remastered/brand-promise-tu-locker.avif",
        "source": "images/categories/sub/tu-locker-1600.webp",
        "remaster_source": "images/categories/sub/tu-locker.webp",
    },
    {
        "section": "Project workplace",
        "name": "project-workplace",
        "asset": "assets/marketing/remastered/project-workplace.avif",
        "source": "images/categories/main/ghe-van-phong-1600.webp",
        "remaster_source": "images/categories/main/ghe-van-phong-1200.webp",
    },
    {
        "section": "Project education",
        "name": "project-education",
        "asset": "assets/marketing/remastered/project-education.avif",
        "source": "images/categories/main/noi-that-truong-hoc-1600.webp",
        "remaster_source": "images/categories/main/noi-that-truong-hoc-1200.webp",
    },
    {
        "section": "Project lounge",
        "name": "project-lounge",
        "asset": "assets/marketing/remastered/project-lounge.avif",
        "source": "images/categories/main/sofa-ghe-cho-1600.webp",
        "remaster_source": "images/categories/main/sofa-ghe-cho-1200.webp",
    },
    {
        "section": "Category ghế văn phòng",
        "name": "category-office-chair",
        "asset": "assets/category/approved/category-office-chair.webp",
        "source": "images/categories/main/ghe-van-phong-1600.webp",
        "remaster_source": "images/categories/main/ghe-van-phong-1600.webp",
    },
    {
        "section": "Category bàn văn phòng",
        "name": "category-office-desk",
        "asset": "assets/category/approved/category-office-desk.webp",
        "source": "images/categories/main/ban-van-phong-1600.webp",
        "remaster_source": "images/categories/main/ban-van-phong-1600.webp",
    },
    {
        "section": "Category bàn họp",
        "name": "category-meeting-table",
        "asset": "assets/category/approved/category-meeting-table.webp",
        "source": "images/categories/main/ban-hop-1600.webp",
        "remaster_source": "images/categories/main/ban-hop-1600.webp",
    },
    {
        "section": "Category tủ và hộc",
        "name": "category-cabinet-pedestal",
        "asset": "assets/category/approved/category-cabinet-pedestal.webp",
        "source": "images/categories/main/tu-hoc-tai-lieu-1600.webp",
        "remaster_source": "images/categories/main/tu-hoc-tai-lieu-1600.webp",
    },
    {
        "section": "Category locker",
        "name": "category-locker",
        "asset": "assets/category/approved/category-locker.webp",
        "source": "images/categories/main/tu-locker-1600.webp",
        "remaster_source": "images/categories/main/tu-locker-1600.webp",
    },
    {
        "section": "Category sofa và ghế chờ",
        "name": "category-sofa-waiting",
        "asset": "assets/category/approved/category-sofa-waiting.webp",
        "source": "images/categories/main/sofa-ghe-cho-1600.webp",
        "remaster_source": "images/categories/main/sofa-ghe-cho-1600.webp",
    },
    {
        "section": "Category trường học",
        "name": "category-school",
        "asset": "assets/category/approved/category-school.webp",
        "source": "images/categories/main/noi-that-truong-hoc-1600.webp",
        "remaster_source": "images/categories/main/noi-that-truong-hoc-1600.webp",
    },
    {
        "section": "Category kệ và giá kho",
        "name": "category-storage-rack",
        "asset": "assets/category/approved/category-storage-rack.webp",
        "source": "images/categories/main/ke-gia-kho-1600.webp",
        "remaster_source": "images/categories/main/ke-gia-kho-1600.webp",
    },
]


def load(relative: str) -> Image.Image:
    with Image.open(ROOT / relative) as image:
        return image.convert("RGB")


def laplacian(image: Image.Image) -> float:
    gray = cv2.cvtColor(np.asarray(image), cv2.COLOR_RGB2GRAY)
    return float(cv2.Laplacian(gray, cv2.CV_64F).var())


def edge_density(image: Image.Image) -> float:
    gray = cv2.cvtColor(np.asarray(image), cv2.COLOR_RGB2GRAY)
    edges = cv2.Canny(gray, 90, 180)
    return float(np.count_nonzero(edges) / edges.size)


def center_crop_200(image: Image.Image) -> Image.Image:
    width, height = image.size
    crop_width, crop_height = width // 2, height // 2
    left = (width - crop_width) // 2
    top = (height - crop_height) // 2
    crop = image.crop((left, top, left + crop_width, top + crop_height))
    return crop.resize((crop_width * 2, crop_height * 2), Image.Resampling.NEAREST)


def sheet_preview(image: Image.Image) -> Image.Image:
    preview = image.copy()
    preview.thumbnail((496, 338), Image.Resampling.LANCZOS)
    return preview


def sheet(entries: list[tuple[str, Image.Image]], destination: Path) -> None:
    columns = 3
    cell_width, cell_height = 520, 390
    rows = (len(entries) + columns - 1) // columns
    canvas = Image.new("RGB", (columns * cell_width, rows * cell_height), "#f3f0e9")
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default()
    for index, (label, image) in enumerate(entries):
        x = (index % columns) * cell_width
        y = (index // columns) * cell_height
        preview = image.copy()
        preview.thumbnail((cell_width - 24, cell_height - 52), Image.Resampling.LANCZOS)
        px = x + (cell_width - preview.width) // 2
        py = y + 30 + (cell_height - 52 - preview.height) // 2
        canvas.paste(preview, (px, py))
        draw.text((x + 12, y + 9), label, fill="#17201a", font=font)
    destination.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(destination, "PNG", optimize=True)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "detail-current").mkdir(exist_ok=True)
    (OUT / "detail-source").mkdir(exist_ok=True)
    metrics: list[dict[str, object]] = []
    current_sheet: list[tuple[str, Image.Image]] = []
    source_sheet: list[tuple[str, Image.Image]] = []
    current_detail_sheet: list[tuple[str, Image.Image]] = []
    source_detail_sheet: list[tuple[str, Image.Image]] = []

    for item in ASSETS:
        asset = load(item["asset"])
        source = load(item["source"])
        remaster_source = load(item["remaster_source"])
        downsampled = asset.resize(remaster_source.size, Image.Resampling.LANCZOS)
        upscale_ratio = max(
            asset.width / remaster_source.width,
            asset.height / remaster_source.height,
        )
        row = {
            **item,
            "asset_dimension": f"{asset.width}x{asset.height}",
            "asset_bytes": (ROOT / item["asset"]).stat().st_size,
            "source_dimension": f"{source.width}x{source.height}",
            "source_bytes": (ROOT / item["source"]).stat().st_size,
            "remaster_source_dimension": f"{remaster_source.width}x{remaster_source.height}",
            "upscale_ratio": round(upscale_ratio, 3),
            "asset_laplacian": round(laplacian(asset), 3),
            "source_laplacian": round(laplacian(source), 3),
            "asset_at_remaster_source_laplacian": round(laplacian(downsampled), 3),
            "asset_edge_density": round(edge_density(asset), 6),
            "source_edge_density": round(edge_density(source), 6),
        }
        metrics.append(row)
        current_sheet.append((f"{item['name']} current", sheet_preview(asset)))
        source_sheet.append((f"{item['name']} source", sheet_preview(source)))
        asset_detail = center_crop_200(asset)
        source_detail = center_crop_200(source)
        current_detail_sheet.append(
            (f"{item['name']} current 200%", sheet_preview(asset_detail))
        )
        source_detail_sheet.append(
            (f"{item['name']} source 200%", sheet_preview(source_detail))
        )
        asset_detail.save(
            OUT / "detail-current" / f"{item['name']}-center-200.png",
            "PNG",
            optimize=True,
        )
        source_detail.save(
            OUT / "detail-source" / f"{item['name']}-center-200.png",
            "PNG",
            optimize=True,
        )

    sheet(current_sheet, OUT / "contact-current.png")
    sheet(source_sheet, OUT / "contact-source.png")
    sheet(current_detail_sheet, OUT / "contact-current-200.png")
    sheet(source_detail_sheet, OUT / "contact-source-200.png")
    (OUT / "metrics.json").write_text(
        json.dumps(metrics, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Wrote {len(metrics)} rows to {OUT}")


if __name__ == "__main__":
    main()
