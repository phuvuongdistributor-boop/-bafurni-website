from __future__ import annotations

import csv
import json
import re
from pathlib import Path


REPO = Path(__file__).resolve().parents[2]
PACKAGE = REPO / "PACKAGE_MESH_HIGHBACK_GL3XX_THEONE"
SOURCE_RESEARCH = PACKAGE / "report" / "OFFICIAL_SOURCE_RESEARCH.json"
IMAGE_AUDIT = PACKAGE / "images" / "SOURCE_IMAGE_AUDIT.json"

EXPECTED_CODES = [
    "GL304", "GL307", "GL309", "GL316", "GL317", "GL320", "GL321",
    "GL322", "GL323", "GL324", "GL326", "GL328", "GL329", "GL331",
    "GL332", "GL333", "GL334", "GL335", "GL336", "GL338", "GL343",
    "GL345",
]

RELATED = {
    "GL304": ["GL307", "GL320", "GL345"],
    "GL307": ["GL304", "GL329", "GL338"],
    "GL309": ["GL332", "GL343", "GL345"],
    "GL316": ["GL324", "GL335", "GL338"],
    "GL317": ["GL304", "GL320", "GL331"],
    "GL320": ["GL304", "GL331", "GL345"],
    "GL321": ["GL322", "GL324", "GL338"],
    "GL322": ["GL321", "GL332", "GL343"],
    "GL323": ["GL326", "GL333", "GL334"],
    "GL324": ["GL316", "GL321", "GL335"],
    "GL326": ["GL323", "GL333", "GL334"],
    "GL328": ["GL332", "GL343", "GL345"],
    "GL329": ["GL307", "GL331", "GL338"],
    "GL331": ["GL320", "GL329", "GL338"],
    "GL332": ["GL309", "GL328", "GL343"],
    "GL333": ["GL323", "GL326", "GL334"],
    "GL334": ["GL323", "GL326", "GL333"],
    "GL335": ["GL316", "GL324", "GL338"],
    "GL336": ["GL323", "GL326", "GL334"],
    "GL338": ["GL307", "GL329", "GL335"],
    "GL343": ["GL309", "GL328", "GL345"],
    "GL345": ["GL309", "GL328", "GL343"],
}


def normalize_name(value: str, code: str) -> str:
    value = re.sub(r"\s*/\s*GL(?:307|309)R\b", "", value, flags=re.I)
    value = value.replace("Nội Thất The One", "The One")
    if code not in value.upper():
        value = f"{value.rstrip()} {code}"
    return value.strip()


def application_for(code: str, features: list[str], material: str) -> str:
    joined = " ".join(features).lower()
    if code == "GL317":
        return "Vị trí quản lý cần dáng ghế lưng cao bọc da CN trong cùng dải GL3xx; đây không phải mẫu tựa lưới."
    if "để chân" in joined:
        return "Vị trí quản lý hoặc nhân sự cần ghế lưng cao có cơ cấu ngả và để chân cho các quãng nghỉ ngắn tại bàn."
    if "tựa đầu" in joined:
        return "Vị trí quản lý hoặc nhân viên ưu tiên tựa đầu trên ghế lưng cao; cần đối chiếu kích thước bàn và khoảng ngả trước khi chọn."
    if "ngả" in joined:
        return "Vị trí làm việc cần ghế lưng cao có cơ cấu ngả; phù hợp khi không gian phía sau đủ cho biên độ công bố."
    if "lưới" in material.lower():
        return "Vị trí quản lý hoặc nhân viên cần ghế lưng cao dùng bề mặt lưới và chân xoay có bánh xe."
    return "Vị trí làm việc cần ghế lưng cao; nên xác nhận vật liệu, kích thước và cấu hình trước khi đặt."


def strength_for(features: list[str], material: str) -> str:
    points = [feature.rstrip(".") for feature in features[:3]]
    if not points:
        points = [material]
    return "; ".join(points) + "."


def limitation_for(code: str, availability: dict, image_status: str) -> str:
    notes = []
    if availability.get("discontinued"):
        notes.append("Trang nguồn The One ghi ngừng kinh doanh; cần xác nhận khả dụng hoặc mẫu thay thế")
    elif availability.get("quote_required"):
        notes.append("Trang nguồn yêu cầu liên hệ thay vì công bố giá hiện hành")
    else:
        notes.append("Giá hiển thị là giá tham khảo ProductDB, cần xác nhận lại theo cấu hình và thời điểm")
    if image_status == "NO_CLEAN_EXACT":
        notes.append("chưa có ảnh public sạch đúng mã để hiển thị")
    notes.append("nguồn không công bố tải trọng, tồn kho hoặc thời gian giao")
    return "; ".join(notes) + "."


def main() -> None:
    research = json.loads(SOURCE_RESEARCH.read_text(encoding="utf-8"))
    audit = json.loads(IMAGE_AUDIT.read_text(encoding="utf-8"))
    source_products = {item["code"]: item for item in research["products"]}
    selections = {item["Code"]: item for item in audit["SelectionSummary"]}
    assert list(source_products) == EXPECTED_CODES
    assert set(selections) == set(EXPECTED_CODES)

    products = []
    matrix_rows = []
    provenance_rows = []
    for code in EXPECTED_CODES:
        source = source_products[code]
        official = source["official_source"]
        portal = source["portal_source"]
        selection = selections[code]
        has_clean = bool(selection["ProposedMainPath"])
        gallery_count = int(selection["SelectedCount"])
        image_status = "LOW_RES_EXACT" if has_clean else "NO_CLEAN_EXACT"
        image = (
            f"/assets/v10-04/gl3xx-theone/products/{code}/main.jpg"
            if has_clean
            else "/assets/v10-04/gl3xx-theone/products/placeholder.svg"
        )
        gallery = []
        if has_clean:
            gallery = [image] + [
                f"/assets/v10-04/gl3xx-theone/products/{code}/gallery-{index:02d}.jpg"
                for index in range(1, gallery_count)
            ]
        features = official["construction_features"]["value"]
        availability = official["availability"]["value"]
        published_colors = official["published_colors"]["value"]
        availability_note = ""
        if availability.get("discontinued"):
            availability_note = "Nguồn The One đang ghi ngừng kinh doanh; cần xác nhận khả dụng hoặc mẫu thay thế."
        elif availability.get("quote_required"):
            availability_note = "Nguồn The One yêu cầu liên hệ để xác nhận giá và khả dụng."

        name = normalize_name(official["product_name"]["value"], code)
        material = official["materials"]["value"]
        size = official["dimensions"]["value"]
        summary = re.sub(
            r"\s*/\s*GL(?:307|309)R\b",
            "",
            official["description_summary"]["value"],
            flags=re.I,
        )
        item = {
            "code": code,
            "name": name,
            "image": image,
            "imageWidth": 580 if has_clean else 800,
            "imageHeight": 580 if has_clean else 800,
            "gallery": gallery,
            "verifiedGalleryCount": gallery_count,
            "price": int(portal["sale_price_vnd"]["value"]),
            "priceLabel": "Giá tham khảo ProductDB",
            "size": size,
            "material": material,
            "summary": summary,
            "description": f"{summary} Kích thước nguồn công bố: {size}. Vật liệu: {material}.",
            "features": features,
            "colors": ", ".join(published_colors),
            "application": application_for(code, features, material),
            "strength": strength_for(features, material),
            "limitation": limitation_for(code, availability, image_status),
            "availabilityNote": availability_note,
            "relatedCodes": RELATED[code],
            "sourceBrand": "The One",
            "sourceUrl": official["product_page"]["value"],
            "detailUrl": f"/san-pham/ghe-luoi-lung-cao/{code.lower()}",
            "imageStatus": image_status,
            "isPlaceholder": not has_clean,
            "imageNaturalResolution": selection["MaxCleanResolution"],
            "rejectedImageCount": int(selection["RejectedCount"]),
            "fieldProvenance": {
                "membership": "PORTAL_SOURCE",
                "price": "PORTAL_SOURCE",
                "productName": "OFFICIAL_SOURCE",
                "size": "OFFICIAL_SOURCE",
                "material": "OFFICIAL_SOURCE",
                "features": "BA_FURNITURE_EDITORIAL_FROM_OFFICIAL_SOURCE",
                "application": "BA_FURNITURE_EDITORIAL",
                "image": image_status,
            },
        }
        products.append(item)
        matrix_rows.append({
            "Code": code,
            "ProductName": name,
            "ProductDBPriceVND": item["price"],
            "OfficialDimensions": size,
            "OfficialMaterial": material,
            "OfficialSourceURL": item["sourceUrl"],
            "MainImage": image,
            "Resolution": selection["MaxCleanResolution"],
            "GalleryCount": gallery_count,
            "RejectedCount": int(selection["RejectedCount"]),
            "ImageStatus": image_status,
            "DataStatus": "OFFICIAL_CORE_FIELDS_VERIFIED",
        })
        field_map = {
            "Membership": ("PORTAL_SOURCE", "ProductDB/Portal package inventory"),
            "ProductName": ("OFFICIAL_SOURCE", item["sourceUrl"]),
            "Size": ("OFFICIAL_SOURCE", item["sourceUrl"]),
            "Material": ("OFFICIAL_SOURCE", item["sourceUrl"]),
            "Features": ("BA_FURNITURE_EDITORIAL", item["sourceUrl"]),
            "Price": ("PORTAL_SOURCE", "ProductDB SalePrice; public label is reference price"),
            "Application": ("BA_FURNITURE_EDITORIAL", "Derived only from verified construction/features"),
            "Image": (image_status, selection["ProposedMainURL"] or "MISSING"),
        }
        for field, (provenance, evidence) in field_map.items():
            provenance_rows.append({
                "Code": code,
                "Field": field,
                "Provenance": provenance,
                "Evidence": evidence,
            })

    data_path = REPO / "mesh-highback-gl3xx-data.js"
    payload = "window.BA_V10_MESH_HIGHBACK_CHAIRS = " + json.dumps(products, ensure_ascii=False, indent=2) + ";\n"
    data_path.write_text(payload, encoding="utf-8")

    (PACKAGE / "website" / "product-data.json").write_text(
        json.dumps(products, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    with (PACKAGE / "website" / "PRODUCT_MATRIX.csv").open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(matrix_rows[0]))
        writer.writeheader()
        writer.writerows(matrix_rows)
    with (PACKAGE / "report" / "PRODUCT_FIELD_PROVENANCE_V10_04.csv").open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["Code", "Field", "Provenance", "Evidence"])
        writer.writeheader()
        writer.writerows(provenance_rows)

    faq = json.loads((PACKAGE / "faq" / "faq.json").read_text(encoding="utf-8"))
    knowledge = {
        "package": {
            "id": "PACKAGE_MESH_HIGHBACK_GL3XX_THEONE",
            "version": "V10.04",
            "category": "Office Chair",
            "subcategory": "Mesh High-back Chair / GL3xx",
            "source": "The One",
            "product_count": len(products),
        },
        "products": [
            {
                "code": item["code"],
                "product_summary": item["summary"],
                "application": item["application"],
                "verified_features": item["features"],
                "dimensions": item["size"],
                "material": item["material"],
                "price_reference_vnd": item["price"],
                "strength": item["strength"],
                "weakness_or_confirmation_needed": item["limitation"],
                "related": item["relatedCodes"],
                "source_url": item["sourceUrl"],
                "image_status": item["imageStatus"],
                "provenance": item["fieldProvenance"],
            }
            for item in products
        ],
        "comparison": {
            "GL304_vs_GL345": {
                "GL304": "Rộng 585 mm; khung và chân thép mạ bọc lưới; không có tựa đầu được nguồn công bố.",
                "GL345": "Rộng 695 mm; tựa đầu và tay ghế điều chỉnh độ cao; ảnh public sạch đúng mã chưa có.",
                "selection_rule": "Chọn theo khoảng bố trí và nhu cầu điều chỉnh, không chọn theo ảnh thay thế.",
            },
            "headrest_verified": ["GL309", "GL322", "GL332", "GL343", "GL345"],
            "footrest_verified": ["GL323", "GL326", "GL333", "GL334", "GL336"],
            "folding_arm_verified": ["GL331"],
            "adjustable_arm_verified": ["GL328", "GL343", "GL345"],
            "discontinued_at_source": ["GL321", "GL343"],
            "non_mesh_variant": ["GL317"],
        },
        "buying_guide": {
            "file": "../guide/BUYING_GUIDE.md",
            "decision_sequence": [
                "Đo bàn, khoảng dưới bàn, lối đi và khoảng lùi.",
                "Chọn tựa đầu, tay ghế, cơ cấu ngả và để chân chỉ khi cần.",
                "Đối chiếu kích thước theo đúng cấu hình chân.",
                "Chốt Code, vật liệu, màu được công bố, số lượng và tình trạng nguồn.",
            ],
        },
        "faq": faq,
        "keywords": [
            "ghế lưới lưng cao",
            "ghế lưới cao cấp",
            "ghế lưới văn phòng",
            "ghế GL3xx The One",
        ],
        "sales_points": [
            "22 Code có trang chi tiết riêng và thông số nguồn.",
            "So sánh theo kích thước, tựa đầu, tay ghế, cơ cấu và vật liệu.",
            "Giá ProductDB được dán nhãn tham khảo, không giả là giá cuối.",
            "Ảnh sai mã, watermark, QR và logo nhà cung cấp không được public.",
        ],
        "source_provenance": {
            "official_research": "../report/OFFICIAL_SOURCE_RESEARCH.json",
            "field_provenance": "../report/PRODUCT_FIELD_PROVENANCE_V10_04.csv",
            "image_audit": "../images/SOURCE_IMAGE_AUDIT.csv",
            "missing_or_inferred_not_public": [
                "tải trọng",
                "tồn kho",
                "thời gian giao",
                "bảo hành đồng nhất cho package",
                "màu ngoài D16 của GL309",
            ],
        },
    }
    (PACKAGE / "knowledge" / "knowledge.json").write_text(
        json.dumps(knowledge, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    faq_schema = {
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": item["question"],
                "acceptedAnswer": {"@type": "Answer", "text": item["answer"]},
            }
            for item in faq
        ],
    }
    item_list = {
        "@type": "ItemList",
        "name": "22 mẫu ghế lưới lưng cao GL3xx The One",
        "numberOfItems": len(products),
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": index + 1,
                "url": f"https://bafurni.com{item['detailUrl']}",
                "name": item["name"],
            }
            for index, item in enumerate(products)
        ],
    }
    product_schemas = []
    for item in products:
        schema = {
            "@type": "Product",
            "@id": f"https://bafurni.com{item['detailUrl']}#product",
            "url": f"https://bafurni.com{item['detailUrl']}",
            "name": item["name"],
            "sku": item["code"],
            "brand": {"@type": "Brand", "name": "The One"},
            "description": item["description"],
            "material": item["material"],
            "size": item["size"],
            "category": "Ghế lưng cao GL3xx",
        }
        if not item["isPlaceholder"]:
            schema["image"] = [f"https://bafurni.com{image}" for image in item["gallery"]]
        product_schemas.append(schema)
    schema_graph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": "https://bafurni.com/danh-muc/ghe-luoi-lung-cao#page",
                "url": "https://bafurni.com/danh-muc/ghe-luoi-lung-cao",
                "name": "Ghế lưới lưng cao và cao cấp GL3xx The One",
            },
            item_list,
            faq_schema,
            *product_schemas,
        ],
    }
    (PACKAGE / "seo" / "schema.json").write_text(
        json.dumps(schema_graph, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    status_lines = [
        "# Product source, image and data status",
        "",
        "| Code | Source URL | Main image | Resolution | Gallery count | Rejected | Image status | Data status |",
        "|---|---|---|---:|---:|---:|---|---|",
    ]
    for item in products:
        selection = selections[item["code"]]
        main_image = selection["ProposedMainURL"] or "NEUTRAL_PLACEHOLDER"
        status_lines.append(
            "| {code} | {source} | {main} | {resolution} | {gallery} | {rejected} | {image_status} | OFFICIAL_CORE_FIELDS_VERIFIED |".format(
                code=item["code"],
                source=item["sourceUrl"],
                main=main_image,
                resolution=selection["MaxCleanResolution"],
                gallery=item["verifiedGalleryCount"],
                rejected=selection["RejectedCount"],
                image_status=item["imageStatus"],
            )
        )
    (PACKAGE / "report" / "PRODUCT_SOURCE_IMAGE_STATUS.md").write_text(
        "\n".join(status_lines) + "\n", encoding="utf-8"
    )

    print(json.dumps({
        "products": len(products),
        "low_res_exact": sum(item["imageStatus"] == "LOW_RES_EXACT" for item in products),
        "no_clean_exact": sum(item["imageStatus"] == "NO_CLEAN_EXACT" for item in products),
        "runtime": str(data_path),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
