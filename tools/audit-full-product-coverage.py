#!/usr/bin/env python3
"""Audit BA_Furniture ProductDB coverage without modifying ProductDB or Portal."""

from __future__ import annotations

import argparse
import collections
import json
import re
import unicodedata
from pathlib import Path


READY = "READY"
READY_WITH_FALLBACK = "READY_WITH_FALLBACK"
NEED_IMAGE = "NEED_IMAGE"
NEED_CATEGORY = "NEED_CATEGORY"
NEED_CONTENT = "NEED_CONTENT"
EXCLUDE = "EXCLUDE"


def clean(value) -> str:
    return "" if value is None else str(value).strip()


def normalized(value: str) -> str:
    return (
        unicodedata.normalize("NFD", clean(value))
        .encode("ascii", "ignore")
        .decode()
        .lower()
    )


def text_blob(row: dict) -> str:
    fields = [
        "Code",
        "ProductName",
        "ProductName_Clean",
        "Category",
        "SubCategory",
        "Source_Group",
        "Description",
        "Description_Clean",
        "Material",
    ]
    return normalized(" ".join(clean(row.get(field)) for field in fields))


def infer_category(row: dict) -> str:
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


def has_price(row: dict) -> bool:
    return any(clean(row.get(field)) for field in ["SalePrice", "BasePrice", "CatalogPrice"])


def has_detail_content(row: dict) -> bool:
    return any(
        clean(row.get(field))
        for field in ["Size", "Product_Size", "Material", "Description", "Description_Clean"]
    )


def classify(row: dict, duplicated_code: bool) -> tuple[str, list[str], str]:
    code = clean(row.get("Code"))
    name = clean(row.get("ProductName") or row.get("ProductName_Clean"))
    category = clean(row.get("Category"))
    inferred = infer_category(row)
    reasons: list[str] = []

    if duplicated_code:
        reasons.append("duplicate_code")
        return EXCLUDE, reasons, inferred
    if not code:
        reasons.append("missing_code")
        return EXCLUDE, reasons, inferred
    if not name:
        reasons.append("missing_name")
        return NEED_CONTENT, reasons, inferred
    if not category and inferred == "OTHER":
        reasons.append("missing_category")
        return NEED_CATEGORY, reasons, inferred
    if not valid_image(row.get("Image_URL")):
        reasons.append("missing_or_invalid_image")
        return NEED_IMAGE, reasons, inferred

    if not category:
        reasons.append("category_inferred")
    if not has_price(row):
        reasons.append("contact_price_fallback")
    if not has_detail_content(row):
        reasons.append("detail_content_fallback")

    if reasons:
        return READY_WITH_FALLBACK, reasons, inferred
    return READY, reasons, inferred


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default="products.json")
    parser.add_argument("--output-dir", default="production_qa/sprint28")
    parser.add_argument("--date", default="2026-07-11")
    args = parser.parse_args()

    rows = json.loads(Path(args.input).read_text(encoding="utf-8"))
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    code_counter = collections.Counter(clean(row.get("Code")).lower() for row in rows if clean(row.get("Code")))
    status_counts = collections.Counter()
    reason_counts = collections.Counter()
    category_counts = collections.Counter()
    samples: dict[str, list[dict]] = collections.defaultdict(list)

    for index, row in enumerate(rows, start=1):
        code = clean(row.get("Code")).lower()
        status, reasons, inferred = classify(row, duplicated_code=bool(code and code_counter[code] > 1))
        status_counts[status] += 1
        category_counts[inferred] += 1
        reason_counts.update(reasons)
        if len(samples[status]) < 10:
            samples[status].append(
                {
                    "row": index,
                    "code": clean(row.get("Code")),
                    "name": clean(row.get("ProductName") or row.get("ProductName_Clean")),
                    "category": clean(row.get("Category")),
                    "inferred_category": inferred,
                    "reasons": reasons,
                }
            )

    total = len(rows)
    ready_total = status_counts[READY] + status_counts[READY_WITH_FALLBACK]
    usable_rate = round(ready_total / total * 100, 2) if total else 0
    report = {
        "generated_at": args.date,
        "source": "local products.json",
        "productdb_modified": False,
        "portal_modified": False,
        "total_rows": total,
        "status_counts": dict(status_counts),
        "ready_or_fallback_total": ready_total,
        "ready_or_fallback_rate_percent": usable_rate,
        "reason_counts": dict(reason_counts.most_common()),
        "category_counts": dict(category_counts.most_common()),
        "samples": samples,
        "recommendation": "Do not expand further in Sprint 28; keep 1,000 public rows stable and prioritize image/category/content cleanup before the next larger expansion.",
    }

    (output_dir / "full_product_coverage_assessment.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8", newline="\n"
    )

    def count(status: str) -> int:
        return int(status_counts.get(status, 0))

    md = [
        "# Sprint 28 - Full Product Coverage Assessment",
        "",
        "## Status",
        "",
        "PASS - Full ProductDB coverage was audited without modifying ProductDB or Portal.",
        "",
        "## Scope",
        "",
        f"- Source: local `products.json`",
        f"- Total rows audited: {total:,}",
        "- ProductDB writeback: not performed",
        "- Portal writeback: not performed",
        "- Public bundle expansion: not performed in Sprint 28",
        "",
        "## Classification Summary",
        "",
        f"- READY: {count(READY):,}",
        f"- READY_WITH_FALLBACK: {count(READY_WITH_FALLBACK):,}",
        f"- NEED_IMAGE: {count(NEED_IMAGE):,}",
        f"- NEED_CATEGORY: {count(NEED_CATEGORY):,}",
        f"- NEED_CONTENT: {count(NEED_CONTENT):,}",
        f"- EXCLUDE: {count(EXCLUDE):,}",
        f"- Ready or fallback usable total: {ready_total:,} ({usable_rate}%)",
        "",
        "## Top Reasons",
        "",
    ]
    for reason, value in reason_counts.most_common(12):
        md.append(f"- {reason}: {value:,}")
    md.extend(["", "## Category Coverage", ""])
    for category, value in category_counts.most_common():
        md.append(f"- {category}: {value:,}")
    md.extend(
        [
            "",
            "## Decision",
            "",
            "No additional expansion was released in Sprint 28. Sprint 27 already moved the public bundle to 1,000 rows; this audit recommends keeping that release stable while BA_Furniture cleans missing images, category gaps, and duplicate codes before a larger public expansion.",
            "",
            "## Deliverables",
            "",
            "- `FULL_PRODUCT_COVERAGE_ASSESSMENT.md`",
            "- `full_product_coverage_assessment.json`",
            "- `tools/audit-full-product-coverage.py`",
        ]
    )
    (output_dir / "FULL_PRODUCT_COVERAGE_ASSESSMENT.md").write_text("\n".join(md) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps(report, ensure_ascii=True, indent=2))


if __name__ == "__main__":
    main()
