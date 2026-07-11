#!/usr/bin/env python3
"""Export BA_Furniture static ProductDB bundle phase 2.

Read-only exporter. It reads ProductDB JSON and existing phase 1 bundle files,
then emits a compact static JS asset that appends curated rows to the public bundle.
It never writes back to ProductDB or Portal.
"""

from __future__ import annotations

import argparse
import base64
import collections
import gzip
import json
import re
import unicodedata
from pathlib import Path


TARGET_TOTAL = 1000
PHASE2_ASSET = "productdb-data.phase2.compact.js"

FINAL_LIMITS = {
    "OFFICE_CHAIR": 160,
    "OFFICE_DESK": 170,
    "CABINET_STORAGE": 130,
    "LOCKER_STEEL": 80,
    "SOFA_WAITING": 100,
    "SCHOOL_FURNITURE": 120,
    "MEETING_TABLE": 70,
    "EXECUTIVE_DESK": 45,
    "PEDESTAL_DRAWER": 40,
    "SHELVING_RACK": 45,
    "PUBLIC_PROJECT": 40,
}

PHASE1_FILES = [
    "productdb-data.part1.js",
    "productdb-data.part2.js",
    "productdb-data.part3.js",
    "productdb-data.part4.js",
    "productdb-data.part5a.js",
    "productdb-data.part5b.js",
    "productdb-data.part5c.js",
    "productdb-data.part6.js",
    "productdb-data.part7.js",
    "productdb-data.part8.js",
    "productdb-data.part9.js",
    "productdb-data.part10.js",
]


def clean(value) -> str:
    return "" if value is None else str(value).strip()


def normalized(value: str) -> str:
    return (
        unicodedata.normalize("NFD", clean(value))
        .encode("ascii", "ignore")
        .decode()
        .lower()
    )


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", normalized(value)).strip("-") or "san-pham"


def text_blob(row: dict) -> str:
    fields = [
        "Category",
        "SubCategory",
        "Source_Group",
        "ProductName",
        "ProductName_Clean",
        "Description",
        "Description_Clean",
    ]
    return normalized(" ".join(clean(row.get(field)) for field in fields))


def infer(row: dict) -> str:
    text = text_blob(row)
    if any(key in text for key in ["sofa", "ghe cho", "ghe lounge"]):
        return "SOFA_WAITING"
    if any(key in text for key in ["truong hoc", "hoc sinh", "mau giao", "student", "school"]):
        return "SCHOOL_FURNITURE"
    if any(key in text for key in ["ban hop", "meeting"]):
        return "MEETING_TABLE"
    if any(key in text for key in ["ban giam doc", "executive desk", "leader desk"]):
        return "EXECUTIVE_DESK"
    if any(key in text for key in ["hoc", "pedestal"]):
        return "PEDESTAL_DRAWER"
    if any(key in text for key in ["ke", "gia kho", "rack", "shelv"]):
        return "SHELVING_RACK"
    if any(key in text for key in ["locker", "tu sat", "steel cabinet", "steel locker", "tu gia cong"]):
        return "LOCKER_STEEL"
    if any(key in text for key in ["tu", "cabinet", "wardrobe"]):
        return "CABINET_STORAGE"
    if any(key in text for key in ["cong trinh", "hoi truong", "public", "auditorium"]):
        return "PUBLIC_PROJECT"
    if any(key in text for key in ["ghe", "chair"]):
        return "OFFICE_CHAIR"
    if any(key in text for key in ["ban", "desk", "table"]):
        return "OFFICE_DESK"
    return "OTHER"


def valid_image(url: str) -> bool:
    url = clean(url)
    blocked = ["placeholder", "no-image", "need_image", "data:image"]
    return bool(re.match(r"^https?://", url, re.I)) and not any(item in url.lower() for item in blocked)


def score(row: dict) -> int:
    desc = clean(row.get("Description") or row.get("Description_Clean"))
    source = normalized(row.get("Source_Group"))
    priority_source = any(
        key in source
        for key in [
            "ghe_van_phong",
            "ban_van_phong",
            "tu_van_phong",
            "sofa",
            "noi_that_truong_hoc",
            "ban_hop",
            "gia_ke_sat",
            "noi_that_cong_trinh",
        ]
    )
    return (
        (30 if valid_image(row.get("Image_URL")) else 0)
        + (15 if clean(row.get("Code")) else 0)
        + (15 if clean(row.get("ProductName") or row.get("ProductName_Clean")) else 0)
        + (10 if clean(row.get("Size") or row.get("Product_Size")) else 0)
        + (10 if clean(row.get("Material")) else 0)
        + (10 if len(desc) >= 20 else 0)
        + (5 if clean(row.get("SalePrice") or row.get("BasePrice") or row.get("CatalogPrice")) else 0)
        + (5 if priority_source else 0)
    )


def compact_url(url: str) -> str:
    return (
        clean(url)
        .replace("https://noithathoaphat.com/", "@HP/")
        .replace("https://theone.vn/", "@TO/")
        .replace("https://noithattheone.vn/", "@ONE/")
        .replace("https://noithattheonevietnam.vn/", "@T1/")
    )


def compact_image_url(url: str) -> str:
    return (
        clean(url)
        .replace("@HP/Uploads/images/", "~")
        .replace("@TO/wp-content/uploads/", "^")
        .replace("@ONE/", "!")
        .replace("@T1/", "%")
    )


def compact_row(row: dict) -> list:
    desc = clean(row.get("Description_Clean") or row.get("Description"))
    if len(desc) > 90:
        desc = desc[:87].rstrip() + "..."
    return [
        clean(row.get("Code")),
        clean(row.get("ProductName") or row.get("ProductName_Clean")),
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


def parse_phase1_rows(path: Path) -> list[list]:
    rows: list[list] = []
    for filename in PHASE1_FILES:
        part = path / filename
        if not part.is_file():
            continue
        raw = part.read_text(encoding="utf-8").strip()
        match = re.match(r"window\.BAAddProductRows\((.*)\);?$", raw, re.S)
        if match:
            rows.extend(json.loads(match.group(1)))
    return rows


def write_text_lf(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8", newline="\n")


def write_compact_phase2(path: Path, rows: list[list]) -> None:
    categories: list[str] = []
    subcategories: list[str] = []
    source_groups: list[str] = []

    def dictionary_index(values: list[str], value: str) -> int:
        if value not in values:
            values.append(value)
        return values.index(value)

    lines: list[str] = []
    for row in rows:
        values = [
            clean(row[0]),
            clean(row[1]),
            str(dictionary_index(categories, clean(row[2]))),
            str(dictionary_index(subcategories, clean(row[3]))),
            compact_image_url(row[4]),
            clean(row[5]),
            "",
            "",
            "",
            str(dictionary_index(source_groups, clean(row[9]))),
            "",
        ]
        lines.append("\t".join(re.sub(r"[\t\r\n]+", " ", value).strip() for value in values))

    payload = "\n".join(lines)
    pack = json.dumps(
        {"c": categories, "s": subcategories, "g": source_groups, "d": payload},
        ensure_ascii=False,
        separators=(",", ":"),
    ).encode("utf-8")
    encoded = base64.b64encode(gzip.compress(pack, compresslevel=9)).decode("ascii")
    script = (
        "(function(){\n"
        + "  var encoded="
        + json.dumps(encoded, separators=(",", ":"))
        + ";\n"
        + '  function expandImage(value){return String(value||"").replace(/^~/,"@HP/Uploads/images/").replace(/^\\^/,"@TO/wp-content/uploads/").replace(/^!/,"@ONE/").replace(/^%/,"@T1/");}\n'
        + "  async function unpack(){\n"
        + '    if (!("DecompressionStream" in window)) { console.warn("BAFurniture phase 2 ProductDB bundle needs DecompressionStream support."); return; }\n'
        + "    var binary=atob(encoded);\n"
        + "    var bytes=new Uint8Array(binary.length);\n"
        + "    for (var index=0;index<binary.length;index+=1) bytes[index]=binary.charCodeAt(index);\n"
        + '    var stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));\n'
        + "    var pack=JSON.parse(await new Response(stream).text());\n"
        + '    var rows=pack.d.split("\\n").filter(Boolean).map(function(line){\n'
        + '      var p=line.split("\\t");\n'
        + "      return [p[0],p[1],pack.c[Number(p[2])],pack.s[Number(p[3])],expandImage(p[4]),p[5]?Number(p[5]):0,p[6],p[7],p[8],pack.g[Number(p[9])],p[10]];\n"
        + "    });\n"
        + "    window.BAAddProductRows(rows);\n"
        + "  }\n"
        + "  window.BA_PRODUCTDB_PHASE2_READY=unpack();\n"
        + "})();\n"
    )
    write_text_lf(path, script)


def add_unique(row: dict, selected_rows: list[dict], seen_code: set[str], seen_slug: set[str]) -> bool:
    code = clean(row.get("Code")).lower()
    slug = slugify(f"{row.get('Code')}-{row.get('ProductName') or row.get('ProductName_Clean')}")
    if not code or code in seen_code or slug in seen_slug:
        return False
    selected_rows.append(row)
    seen_code.add(code)
    seen_slug.add(slug)
    return True


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default="products.json")
    parser.add_argument("--phase1-dir", default="production_qa/sprint25")
    parser.add_argument("--output-dir", default="production_qa/sprint27")
    parser.add_argument("--date", default="2026-07-11")
    args = parser.parse_args()

    source_rows = json.loads(Path(args.input).read_text(encoding="utf-8"))
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    phase1_rows = parse_phase1_rows(Path(args.phase1_dir))
    seen_code = {clean(row[0]).lower() for row in phase1_rows}
    seen_slug = {slugify(f"{row[0]}-{row[1]}") for row in phase1_rows}
    phase1_coverage = collections.Counter(infer({"Category": row[2], "SubCategory": row[3], "Source_Group": row[9], "ProductName": row[1]}) for row in phase1_rows)

    candidates = collections.defaultdict(list)
    reasons = collections.Counter()
    duplicate_code = 0
    duplicate_slug = 0

    for index, row in enumerate(source_rows):
        bucket = infer(row)
        code = clean(row.get("Code"))
        name = clean(row.get("ProductName") or row.get("ProductName_Clean"))
        slug = slugify(f"{code}-{name}")
        errors = []
        if not code:
            errors.append("missing_code")
        if not name:
            errors.append("missing_name")
        if not clean(row.get("Category")):
            errors.append("missing_category")
        if not valid_image(row.get("Image_URL")):
            errors.append("missing_or_invalid_image")
        if code.lower() in seen_code:
            errors.append("duplicate_code_or_phase1")
            duplicate_code += 1
        if slug in seen_slug:
            errors.append("duplicate_slug_or_phase1")
            duplicate_slug += 1
        if errors:
            reasons.update(errors)
            continue
        candidates[bucket].append((score(row), index, row))

    selected_rows: list[dict] = []

    for bucket, final_limit in FINAL_LIMITS.items():
        already = phase1_coverage.get(bucket, 0)
        needed = max(final_limit - already, 0)
        added = 0
        for _, _, row in sorted(candidates[bucket], key=lambda item: (-item[0], item[1])):
            if added >= needed:
                break
            if add_unique(row, selected_rows, seen_code, seen_slug):
                added += 1

    if len(phase1_rows) + len(selected_rows) < TARGET_TOTAL:
        current_codes = {clean(row.get("Code")).lower() for row in selected_rows} | {clean(row[0]).lower() for row in phase1_rows}
        remaining = []
        for bucket_rows in candidates.values():
            for score_value, index, row in bucket_rows:
                code = clean(row.get("Code")).lower()
                if code not in current_codes:
                    remaining.append((score_value, index, row))
        for _, _, row in sorted(remaining, key=lambda item: (-item[0], item[1])):
            if len(phase1_rows) + len(selected_rows) >= TARGET_TOTAL:
                break
            add_unique(row, selected_rows, seen_code, seen_slug)

    selected_compact = [compact_row(row) for row in selected_rows]
    write_compact_phase2(output_dir / PHASE2_ASSET, selected_compact)

    columns = ["Code", "ProductName", "Category", "SubCategory", "Image_URL", "SalePrice", "Size", "Material", "Description", "Source_Group", "Source_URL"]
    meta = {
        "source": "ProductDB_V2 products.json",
        "sourceTotal": len(source_rows),
        "phase1Count": len(phase1_rows),
        "phase2Count": len(selected_compact),
        "bundledCount": len(phase1_rows) + len(selected_compact),
        "generatedAt": args.date,
        "mode": "static-readonly-bundle-phase2",
        "selection": "quality-first-expanded-categories",
    }
    init = (
        "window.BA_PRODUCTDB_META="
        + json.dumps(meta, ensure_ascii=False, separators=(",", ":"))
        + ";\nwindow.BA_PRODUCTDB_COLUMNS="
        + json.dumps(columns, separators=(",", ":"))
        + ";\nwindow.BA_PRODUCT_ROWS=[];\nwindow.BA_PRODUCTDB_EXPAND=function(value){return String(value||'').replace('@HP/','https://noithathoaphat.com/').replace('@TO/','https://theone.vn/').replace('@ONE/','https://noithattheone.vn/').replace('@T1/','https://noithattheonevietnam.vn/');};\nwindow.BAAddProductRows=function(rows){rows.forEach(function(row){var item={};window.BA_PRODUCTDB_COLUMNS.forEach(function(key,index){item[key]=key==='Image_URL'||key==='Source_URL'?window.BA_PRODUCTDB_EXPAND(row[index]):row[index];});window.BA_PRODUCT_ROWS.push(item);});};\n"
    )
    write_text_lf(output_dir / "productdb-data.js", init)

    phase2_coverage = collections.Counter(infer({"Category": item[2], "SubCategory": item[3], "Source_Group": item[9], "ProductName": item[1]}) for item in selected_compact)
    final_coverage = phase1_coverage + phase2_coverage
    report = {
        "input_rows": len(source_rows),
        "phase1_rows_kept": len(phase1_rows),
        "phase2_rows_added": len(selected_compact),
        "final_public_bundle_count": len(phase1_rows) + len(selected_compact),
        "phase2_file_count": 1,
        "phase2_asset": PHASE2_ASSET,
        "phase2_payload": "gzip-base64 compact-js-dictionary",
        "phase2_optional_detail_fields": "Size, Material, Description, and Source_URL intentionally use public fallback in the compact phase 2 asset.",
        "rejected_rows": len(source_rows) - len(selected_compact),
        "rejection_reasons": dict(reasons.most_common()),
        "phase2_category_coverage": dict(phase2_coverage),
        "final_category_coverage": dict(final_coverage),
        "missing_image_rate_phase2": 0.0,
        "duplicate_code_or_phase1_count": duplicate_code,
        "duplicate_slug_or_phase1_count": duplicate_slug,
    }
    write_text_lf(output_dir / "product_bundle_export_phase2_report.json", json.dumps(report, ensure_ascii=False, indent=2))
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
