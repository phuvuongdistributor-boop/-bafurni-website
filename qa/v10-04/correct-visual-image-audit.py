from __future__ import annotations

import csv
import json
from collections import Counter
from pathlib import Path


REPO = Path(__file__).resolve().parents[2]
PACKAGE = REPO / "PACKAGE_MESH_HIGHBACK_GL3XX_THEONE"
CSV_PATH = PACKAGE / "images" / "SOURCE_IMAGE_AUDIT.csv"
JSON_PATH = PACKAGE / "images" / "SOURCE_IMAGE_AUDIT.json"

CODE = "GL304"
WATERMARKED_ORIGINALS = {
    "theonevn-GL304L11.jpg",
    "theonevn-GL304L11_1.jpg",
    "theonevn-GL304L11_2.jpg",
}
REASON = (
    "Final preview visual QA found a faint diagonal watermark embedded across "
    "the chair-back mesh; the asset is exact-code but cannot be published."
)
RECOMMENDATION = (
    "DO_NOT_PUBLISH; all exact-code product originals contain a visible watermark. "
    "Use the neutral placeholder until a clean official asset is available."
)


def correct_csv() -> Counter[str]:
    with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        fieldnames = reader.fieldnames
        rows = list(reader)
    if not fieldnames:
        raise ValueError("SOURCE_IMAGE_AUDIT.csv has no header")

    for row in rows:
        if row["Code"] != CODE:
            continue

        if row["SourceFilename"] in WATERMARKED_ORIGINALS:
            row["Classification"] = "WATERMARK"
            row["ClassificationReason"] = REASON
            row["VisualInspection"] = "VISUAL_INSPECTED_CORRECTED_AT_PREVIEW"
            row["SelectedRole"] = ""
            row["SelectedPath"] = ""
            row["SelectedSHA256"] = ""
            row["ExactBytesPreserved"] = "false"

        row["CodeProposedMainURL"] = ""
        row["CodeProposedGalleryURLs"] = ""
        row["CodeMaxCleanResolution"] = "NONE"
        row["CodeSelectedCount"] = "0"
        row["CodeRejectedCount"] = "19"
        row["CodeRecommendation"] = RECOMMENDATION

    with CSV_PATH.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    return Counter(row["Classification"] for row in rows)


def correct_json(classification_totals: Counter[str]) -> None:
    audit = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    for candidate in audit["Candidates"]:
        if candidate["Code"] != CODE:
            continue
        if candidate["SourceFilename"] in WATERMARKED_ORIGINALS:
            candidate["Classification"] = "WATERMARK"
            candidate["ClassificationReason"] = REASON
            candidate["VisualInspection"] = "VISUAL_INSPECTED_CORRECTED_AT_PREVIEW"
            candidate["SelectedRole"] = ""
            candidate["SelectedPath"] = ""
            candidate["SelectedSHA256"] = ""
            candidate["ExactBytesPreserved"] = False

    summary = next(item for item in audit["SelectionSummary"] if item["Code"] == CODE)

    summary.update(
        {
            "LOW_RES_EXACT": 0,
            "WATERMARK": 3,
            "ProposedMainURL": None,
            "ProposedMainPath": None,
            "ProposedGalleryURLs": [],
            "ProposedGalleryPaths": [],
            "SelectedCount": 0,
            "RejectedCount": 19,
            "MaxCleanResolution": "NONE",
            "MaxCleanLongSide": 0,
            "Recommendation": RECOMMENDATION,
        }
    )

    totals = audit["Totals"]
    totals["SelectedExactByteCopies"] = sum(
        int(item["SelectedCount"]) for item in audit["SelectionSummary"]
    )
    totals["CodesWithProposedMain"] = sum(
        bool(item["ProposedMainPath"]) for item in audit["SelectionSummary"]
    )
    totals["CodesWithoutCleanMain"] = totals["Codes"] - totals["CodesWithProposedMain"]
    totals["ClassificationTotals"] = {
        key: classification_totals.get(key, 0)
        for key in [
            "CLEAN_EXACT",
            "LOW_RES_EXACT",
            "WATERMARK",
            "QR",
            "SUPPLIER_LOGO",
            "WRONG_CODE",
            "DUPLICATE",
            "REJECT",
        ]
    }
    audit["VisualCorrection"] = {
        "Code": CODE,
        "AppliedAt": "2026-08-11",
        "Stage": "FINAL_PREVIEW_VISUAL_QA",
        "Reason": REASON,
        "Action": "Removed all GL304 product pixels from public assets and switched the product to the neutral placeholder.",
    }

    JSON_PATH.write_text(
        json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def main() -> None:
    classification_totals = correct_csv()
    correct_json(classification_totals)
    print(
        json.dumps(
            {
                "corrected_code": CODE,
                "selected_exact": 16,
                "codes_with_clean_main": 15,
                "codes_with_placeholder": 7,
                "classification_totals": dict(classification_totals),
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
