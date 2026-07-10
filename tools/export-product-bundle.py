#!/usr/bin/env python3
"""Export a read-only BA_Furniture product bundle from ProductDB JSON.

This script never writes back to ProductDB or Portal. It reads products.json and
emits browser-safe static JS bundle files for bafurni.com.
"""

from __future__ import annotations

import argparse
import collections
import json
import re
import unicodedata
from pathlib import Path


LIMITS = {
    "OFFICE_CHAIR": 90,
    "OFFICE_DESK": 85,
    "CABINET_STORAGE": 75,
    "LOCKER_STEEL": 50,
}


def clean(value) -> str:
    return "" if value is None else str(value).strip()


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFD", clean(value)).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", normalized).strip("-") or "san-pham"


def infer(row: dict) -> str:
    raw = " ".join(clean(row.get(key)) for key in ["Category", "SubCategory", "Source_Group", "ProductName", "ProductName_Clean"]).lower()
    if re.search(r"gh[eế]|chair", raw):
        return "OFFICE_CHAIR"
    if re.search(r"b[aà]n h[oọ]p|meeting", raw):
        return "MEETING_TABLE"
    if re.search(r"b[aà]n|desk", raw):
        return "OFFICE_DESK"
    if re.search(r"locker|t[uủ] s[aắ]t|tu sat|tủ gia công|tu gia cong", raw):
        return "LOCKER_STEEL"
    if re.search(r"t[uủ]|h[oộ]c|cabinet|pedestal", raw):
        return "CABINET_STORAGE"
    return "OTHER"


def valid_image(url: str) -> bool:
    url = clean(url)
    blocked = ["placeholder", "no-image", "need_image", "data:image"]
    return bool(re.match(r"^https?://", url, re.I)) and not any(item in url.lower() for item in blocked)


def score(row: dict) -> int:
    return (
        (25 if valid_image(row.get("Image_URL")) else 0)
        + (15 if clean(row.get("Code")) else 0)
        + (15 if clean(row.get("ProductName")) else 0)
        + (10 if clean(row.get("Size") or row.get("Product_Size")) else 0)
        + (10 if clean(row.get("Material")) else 0)
        + (10 if len(clean(row.get("Description") or row.get("Description_Clean"))) >= 20 else 0)
        + (5 if clean(row.get("SalePrice") or row.get("BasePrice") or row.get("CatalogPrice")) else 0)
        + (5 if clean(row.get("Source_URL") or row.get("Product_URL")) else 0)
        + (5 if clean(row.get("Quality_Status")) == "READY" else 0)
    )


def compact_url(url: str) -> str:
    return clean(url).replace("https://noithathoaphat.com/", "@HP/").replace("https://theone.vn/", "@TO/").replace("https://noithattheonevietnam.vn/", "@T1/")


def write_text_lf(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8", newline="\n")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default="products.json")
    parser.add_argument("--output-dir", default=".")
    parser.add_argument("--date", default="2026-07-10")
    args = parser.parse_args()

    rows = json.loads(Path(args.input).read_text(encoding="utf-8"))
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    buckets = {key: [] for key in LIMITS}
    reasons = collections.Counter()
    seen_code: set[str] = set()
    seen_slug: set[str] = set()
    duplicate_code = 0
    duplicate_slug = 0

    for index, row in enumerate(rows):
        category = infer(row)
        code = clean(row.get("Code"))
        name = clean(row.get("ProductName") or row.get("ProductName_Clean"))
        if category not in LIMITS:
            reasons["not_phase1_category"] += 1
            continue
        slug = slugify(f"{code}-{name}")
        errors = []
        if not code:
            errors.append("missing_code")
        if not name:
            errors.append("missing_name")
        if not clean(row.get("Category")):
            errors.append("missing_category")
        if not clean(row.get("SubCategory")):
            errors.append("missing_subcategory")
        if not valid_image(row.get("Image_URL")):
            errors.append("missing_or_invalid_image")
        if code.lower() in seen_code:
            errors.append("duplicate_code")
            duplicate_code += 1
        if slug in seen_slug:
            errors.append("duplicate_slug")
            duplicate_slug += 1
        if errors:
            reasons.update(errors)
            continue
        seen_code.add(code.lower())
        seen_slug.add(slug)
        desc = clean(row.get("Description_Clean") or row.get("Description"))
        if len(desc) > 90:
            desc = desc[:87].rstrip() + "..."
        item = [
            code,
            name,
            clean(row.get("Category")),
            clean(row.get("SubCategory")),
            compact_url(row.get("Image_URL")),
            row.get("SalePrice") or row.get("BasePrice") or row.get("CatalogPrice") or "",
            clean(row.get("Size") or row.get("Product_Size")),
            clean(row.get("Material")),
            desc,
            clean(row.get("Source_Group")),
            compact_url(row.get("Source_URL") or row.get("Product_URL") or row.get("Search_URL")),
        ]
        buckets[category].append((score(row), index, item))

    selected = []
    for category, limit in LIMITS.items():
        selected.extend(item for _, _, item in sorted(buckets[category], key=lambda item: (-item[0], item[1]))[:limit])

    columns = ["Code", "ProductName", "Category", "SubCategory", "Image_URL", "SalePrice", "Size", "Material", "Description", "Source_Group", "Source_URL"]
    meta = {
        "source": "ProductDB_V2 products.json",
        "sourceTotal": len(rows),
        "bundledCount": len(selected),
        "generatedAt": args.date,
        "mode": "static-readonly-bundle-phase1",
        "selection": "quality-first-priority-categories",
    }
    init = (
        "window.BA_PRODUCTDB_META="
        + json.dumps(meta, ensure_ascii=False, separators=(",", ":"))
        + ";\nwindow.BA_PRODUCTDB_COLUMNS="
        + json.dumps(columns, separators=(",", ":"))
        + ";\nwindow.BA_PRODUCT_ROWS=[];\nwindow.BA_PRODUCTDB_EXPAND=function(value){return String(value||'').replace('@HP/','https://noithathoaphat.com/').replace('@TO/','https://theone.vn/').replace('@T1/','https://noithattheonevietnam.vn/');};\nwindow.BAAddProductRows=function(rows){rows.forEach(function(row){var item={};window.BA_PRODUCTDB_COLUMNS.forEach(function(key,index){item[key]=key==='Image_URL'||key==='Source_URL'?window.BA_PRODUCTDB_EXPAND(row[index]):row[index];});window.BA_PRODUCT_ROWS.push(item);});};\n"
    )
    write_text_lf(output_dir / "productdb-data.js", init)
    chunk_size = 30
    split_part_overrides = {5: [15, 8, 7]}
    for index in range((len(selected) + chunk_size - 1) // chunk_size):
        chunk = selected[index * chunk_size : (index + 1) * chunk_size]
        part_number = index + 1
        split_sizes = split_part_overrides.get(part_number)
        if split_sizes and sum(split_sizes) == len(chunk):
            chunks = []
            start = 0
            for offset, split_size in enumerate(split_sizes):
                suffix = chr(ord("a") + offset)
                chunks.append((suffix, chunk[start : start + split_size]))
                start += split_size
            for suffix, split_chunk in chunks:
                write_text_lf(output_dir / f"productdb-data.part{part_number}{suffix}.js", "window.BAAddProductRows(" + json.dumps(split_chunk, ensure_ascii=False, separators=(",", ":")) + ");\n")
            continue
        write_text_lf(output_dir / f"productdb-data.part{part_number}.js", "window.BAAddProductRows(" + json.dumps(chunk, ensure_ascii=False, separators=(",", ":")) + ");\n")

    coverage = collections.Counter(infer({"Category": item[2], "SubCategory": item[3], "Source_Group": item[9], "ProductName": item[1]}) for item in selected)
    report = {
        "input_rows": len(rows),
        "selected_rows": len(selected),
        "rejected_rows": len(rows) - len(selected),
        "rejection_reasons": dict(reasons.most_common()),
        "category_coverage": dict(coverage),
        "missing_image_rate": 0.0,
        "duplicate_code_count": duplicate_code,
        "duplicate_slug_count": duplicate_slug,
        "final_public_bundle_count": len(selected),
    }
    write_text_lf(output_dir / "product_bundle_export_report.json", json.dumps(report, ensure_ascii=False, indent=2))
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
