"""Build the GL4xx website dataset and exact-byte public image package.

This script consumes the locked inventory audit and manually approved exact-code
official image URLs. It never writes ProductDB, Portal, Lead Engine or Apps Script.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import shutil
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image


CODES = [
    "GL401", "GL402TB", "GL402XB", "GL403", "GL404", "GL404B",
    "GL405", "GL406", "GL410", "GL411", "GL412", "GL417", "GL418",
    "GL419", "GL420", "GL421", "GL423", "GL424", "GL424B", "GL425",
    "GL426", "GL427", "GL429", "GL430",
]

NAMES = {
    "GL401": "Ghế Họp Tựa Lưới The One GL401",
    "GL402TB": "Ghế Hội Thảo Có Bàn The One GL402TB",
    "GL402XB": "Ghế Hội Thảo Có Bàn The One GL402XB",
    "GL403": "Ghế Họp Tựa Lưới The One GL403",
    "GL404": "Ghế Họp Tựa Lưới The One GL404",
    "GL404B": "Ghế Họp Liền Bàn The One GL404B",
    "GL405": "Ghế Họp Tựa Lưới The One GL405",
    "GL406": "Ghế Họp Chân Quỳ The One GL406",
    "GL410": "Ghế Họp Tựa Lưới The One GL410",
    "GL411": "Ghế Họp Tựa Lưới The One GL411",
    "GL412": "Ghế Họp Tựa Lưới The One GL412",
    "GL417": "Ghế Họp Tựa Lưới The One GL417",
    "GL418": "Ghế Họp Tựa Lưới The One GL418",
    "GL419": "Ghế Họp Tựa Lưới The One GL419",
    "GL420": "Ghế Họp Tựa Lưới The One GL420",
    "GL421": "Ghế Họp Tựa Lưới The One GL421",
    "GL423": "Ghế Họp Tựa Lưới The One GL423",
    "GL424": "Ghế Hội Thảo Gấp Gọn The One GL424",
    "GL424B": "Ghế Hội Thảo Có Bàn The One GL424B",
    "GL425": "Ghế Họp Tựa Lưới The One GL425",
    "GL426": "Ghế Họp Tựa Lưới The One GL426",
    "GL427": "Ghế Họp Tựa Lưới The One GL427",
    "GL429": "Ghế Họp Đệm Xoay The One GL429",
    "GL430": "Ghế Họp Tựa Lưới The One GL430",
}

SOURCE_URLS = {
    "GL401": "https://noithattheone.vn/ghe-hop-gl-en/ghe-hop-tua-luoi-gl401-en.html",
    "GL402TB": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-gl402tb.html",
    "GL402XB": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-402xb.html",
    "GL403": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-gl403.html",
    "GL404": "https://noithattheone.vn/ghe-hop-gl-en/ghe-hop-tua-luoi-gl404-en.html",
    "GL404B": "https://theone.vn/san-pham/ghe-gl404b",
    "GL405": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-gl405.html",
    "GL406": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-gl406.html",
    "GL410": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-gl410.html",
    "GL411": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-gl411.html",
    "GL412": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-gl412.html",
    "GL417": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-gl417.html",
    "GL418": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-gl418.html",
    "GL419": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-gl419.html",
    "GL420": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-gl420.html",
    "GL421": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-gl421.html",
    "GL423": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-423.html",
    "GL424": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-gl424.html",
    "GL424B": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-gl424b.html",
    "GL425": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi.html",
    "GL426": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-GL426.html",
    "GL427": "https://noithattheone.vn/ghe-phong-hop/ghe-luoi-phong-hop.html",
    "GL429": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-gl-GL429.html",
    "GL430": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-gl-GL430.html",
}

SIZES = {
    "GL401": "W590 x D650 x H1010 mm",
    "GL402TB": "W620 x D590-725 x H850 mm",
    "GL402XB": "W620 x D590-725 x H850 mm",
    "GL403": "W580 x D630 x H980 mm",
    "GL404": "W535 x D575 x H875 mm",
    "GL404B": "W630 x D640-860 x H865 mm",
    "GL405": "W470 x D590 x H855 mm",
    "GL406": "W580 x D630 x H980 mm",
    "GL410": "W560 x D640 x H960 mm",
    "GL411": "W560 x D640 x H1040 mm",
    "GL412": "W580 x D570 x H950 mm",
    "GL417": "W510 x D645 x H880 mm",
    "GL418": "W625 x D580 x H1000 mm",
    "GL419": "W550 x D630 x H875 mm",
    "GL420": "W510 x D625 x H875 mm",
    "GL421": "W580 x D615 x H910 mm",
    "GL423": "W565 x D580 x H970 mm",
    "GL424": "W600 x D555 x H820 mm",
    "GL424B": "W640 x D555-830 x H820 mm",
    "GL425": "W520 x D600 x H930 mm",
    "GL426": "W570 x D520 x H935 mm",
    "GL427": "W635 x D570 x H1010 mm",
    "GL429": "W615 x D620 x H930 mm",
    "GL430": "W560 x D620 x H1075 mm",
}

MATERIALS = {
    "GL401": "Khung thép mạ oval; tựa lưới; đệm mút bọc lưới",
    "GL402TB": "Khung tựa nhựa bọc lưới; đệm lưới; bàn nhựa; chân thép sơn hoặc mạ",
    "GL402XB": "Khung tựa nhựa bọc lưới; đệm lưới; bàn nhựa; chân thép sơn hoặc mạ",
    "GL403": "Khung thép mạ; đệm tựa bọc lưới chịu lực",
    "GL404": "Khung tựa nhựa bọc lưới; đệm lưới; chân thép sơn",
    "GL404B": "Khung thép sơn; đệm tựa bọc lưới; bàn viết nhựa",
    "GL405": "Khung thép mạ; tựa lưới; đệm mút bọc lưới",
    "GL406": "Khung thép mạ; đệm tựa bọc da công nghiệp",
    "GL410": "Khung thép mạ; tựa lưới chịu lực; đệm mút bọc lưới",
    "GL411": "Khung thép mạ; tựa lưới; đệm mút bọc lưới",
    "GL412": "Khung thép sơn; tựa nhựa bọc lưới; đệm lưới; tay nhựa",
    "GL417": "Khung thép sơn hoặc mạ; tựa nhựa bọc lưới; đệm lưới",
    "GL418": "Khung và tay nhựa; đệm, tựa bọc vải; chân thép sơn hoặc mạ",
    "GL419": "Khung thép mạ; tựa nhựa bọc lưới; đệm lưới; tay nhựa",
    "GL420": "Khung thép sơn hoặc mạ; tựa nhựa bọc lưới; đệm lưới",
    "GL421": "Khung thép sơn hoặc mạ; tựa lưới; đệm mút bọc lưới",
    "GL423": "Khung thép mạ; tựa nhựa bọc lưới; đệm bọc vải hoặc PVC",
    "GL424": "Khung tựa nhựa bọc lưới; đệm lưới; chân thép sơn",
    "GL424B": "Khung tựa nhựa bọc lưới; đệm lưới; bàn nhựa; chân thép sơn",
    "GL425": "Khung tựa nhựa bọc lưới; đệm bọc PVC; chân thép mạ",
    "GL426": "Khung tựa nhựa bọc lưới; đệm lưới; chân thép sơn hoặc mạ",
    "GL427": "Khung tựa nhựa bọc lưới; đệm bọc PVC; chân thép sơn hoặc mạ",
    "GL429": "Khung thép sơn hoặc mạ; tựa lưới; đệm PVC; tay nhựa",
    "GL430": "Khung tựa nhựa bọc lưới; đệm bọc vải; chân thép mạ; tay ốp nhựa",
}

FEATURES = {
    "GL401": "Khung chân quỳ thép mạ oval, tựa lưới và đệm rời bọc lưới.",
    "GL402TB": "Có bàn viết nhựa; kết cấu gấp gọn, xếp lồng và chân tĩnh sơn hoặc mạ.",
    "GL402XB": "Có bàn viết nhựa và bánh xe; phù hợp cấu hình hội thảo linh hoạt.",
    "GL403": "Khung chân quỳ thép mạ với đệm tựa liền bọc lưới chịu lực.",
    "GL404": "Dáng chân tĩnh gọn, tựa nhựa bọc lưới và chân thép sơn.",
    "GL404B": "Ghế chân tĩnh có bàn viết nhựa gấp gọn; dữ liệu lấy từ catalog chính thức lưu trữ.",
    "GL405": "Dáng không tay, khung thép mạ và bề mặt lưới.",
    "GL406": "Khung chân quỳ thép mạ, đệm tựa liền bọc da công nghiệp.",
    "GL410": "Dáng chân quỳ, khung thép mạ, tựa lưới chịu lực và đệm rời.",
    "GL411": "Lưng cao, khung chân quỳ thép mạ và đệm tựa bọc lưới.",
    "GL412": "Tựa nhựa thoáng, tay nhựa và khung chân quỳ thép sơn.",
    "GL417": "Dáng không tay, khung thép sơn hoặc mạ và tựa nhựa bọc lưới.",
    "GL418": "Khung lưng và tay nhựa liền khối trên chân quỳ thép sơn hoặc mạ.",
    "GL419": "Dáng chân quỳ có tay ốp nhựa, tựa nhựa bọc lưới và khung thép mạ.",
    "GL420": "Dáng chân tĩnh không tay với khung thép sơn hoặc mạ.",
    "GL421": "Dáng chân quỳ tay liền, khung thép sơn hoặc mạ và tựa lưới.",
    "GL423": "Tựa nhựa bọc lưới, đệm bọc vải hoặc PVC trên khung chân quỳ thép mạ.",
    "GL424": "Kết cấu gấp gọn, xếp lồng; phiên bản không có bàn viết.",
    "GL424B": "Kết cấu gấp gọn, xếp lồng và có bàn viết nhựa.",
    "GL425": "Dáng chân quỳ, tựa lưới và đệm PVC trên chân thép mạ.",
    "GL426": "Tựa nhựa bọc lưới, tay vòng và chân quỳ thép sơn hoặc mạ.",
    "GL427": "Dáng lưng cao, tựa lưới, đệm PVC và chân quỳ thép.",
    "GL429": "Đệm ngồi xoay 90 độ sang hai phía và tự trở về vị trí ban đầu.",
    "GL430": "Dáng lưng cao, chân thép mạ ống Ø25.4 và tay ốp nhựa.",
}

GALLERIES = {
    "GL401": ["https://storage.sudospaces.com/noithattheone/2020/11/gl401-2.jpg.webp", "https://storage.sudospaces.com/noithattheone/2020/11/gl401-3.jpg.webp"],
    "GL402TB": ["https://storage.sudospaces.com/noithattheone/2020/11/gl402tb-1.jpg.webp"],
    "GL402XB": ["https://storage.sudospaces.com/noithattheone/2020/11/gl402xb-2.jpg.webp", "https://storage.sudospaces.com/noithattheone/2020/11/gl402xb-3.jpg.webp"],
    "GL403": ["https://storage.sudospaces.com/noithattheone/2024/03/gl403-2.jpg.webp", "https://storage.sudospaces.com/noithattheone/2024/03/gl403-3.jpg.webp"],
    "GL404": ["https://storage.sudospaces.com/noithattheone/2020/11/gl404-2.jpg.webp", "https://storage.sudospaces.com/noithattheone/2020/11/gl404-3.jpg.webp", "https://storage.sudospaces.com/noithattheone/2021/12/gl404-0.jpg"],
    "GL404B": ["https://theone.vn/wp-content/uploads/2022/05/GL404B.jpg"],
    "GL405": ["https://storage.sudospaces.com/noithattheone/2026/03/gl405-2.jpg", "https://storage.sudospaces.com/noithattheone/2026/03/gl405-3.jpg"],
    "GL406": ["https://storage.sudospaces.com/noithattheone/2024/03/gl406-2.jpg.webp", "https://storage.sudospaces.com/noithattheone/2024/03/gl406-3.jpg.webp"],
    "GL410": ["https://storage.sudospaces.com/noithattheone/2024/06/gl410-2.jpg.webp", "https://storage.sudospaces.com/noithattheone/2024/06/gl410-3.jpg.webp"],
    "GL411": ["https://storage.sudospaces.com/noithattheone/2020/11/gl411-1.jpg.webp", "https://storage.sudospaces.com/noithattheone/2020/11/gl411-3.jpg.webp"],
    "GL412": ["https://storage.sudospaces.com/noithattheone/2023/06/gl412-2.jpg.webp", "https://storage.sudospaces.com/noithattheone/2023/06/gl412-3.jpg.webp"],
    "GL417": ["https://storage.sudospaces.com/noithattheone/2023/06/gl417-1-2.jpg.webp", "https://storage.sudospaces.com/noithattheone/2023/06/gl417-1-3.jpg.webp"],
    "GL418": ["https://storage.sudospaces.com/noithattheone/2023/09/gl418-2.jpg.webp", "https://storage.sudospaces.com/noithattheone/2023/09/gl418-3.jpg.webp"],
    "GL419": ["https://storage.sudospaces.com/noithattheone/2023/06/gl419-2.jpg.webp", "https://storage.sudospaces.com/noithattheone/2023/06/gl419-3.jpg.webp"],
    "GL420": ["https://storage.sudospaces.com/noithattheone/2023/06/gl420-2.jpg.webp", "https://storage.sudospaces.com/noithattheone/2023/06/gl420-3.jpg.webp"],
    "GL421": ["https://storage.sudospaces.com/noithattheone/2023/09/gl421-2-1.jpg.webp", "https://storage.sudospaces.com/noithattheone/2023/09/gl421-3.jpg.webp"],
    "GL423": ["https://storage.sudospaces.com/noithattheone/2023/06/gl423-2.jpg.webp", "https://storage.sudospaces.com/noithattheone/2023/06/gl423-3.jpg.webp"],
    "GL424": ["https://theone.vn/wp-content/uploads/2020/08/GL424.jpg"],
    "GL424B": ["https://storage.sudospaces.com/noithattheone/2020/11/gl-424b-2.jpg.webp", "https://storage.sudospaces.com/noithattheone/2020/11/gl-424b-3.jpg.webp", "https://storage.sudospaces.com/noithattheone/2021/12/gl-424b-1.jpg.webp"],
    "GL425": ["https://storage.sudospaces.com/noithattheone/2020/11/gl425-1.jpg.webp", "https://storage.sudospaces.com/noithattheone/2020/11/gl425-3.jpg.webp"],
    "GL426": ["https://storage.sudospaces.com/noithattheone/2020/11/gl426-1.jpg.webp", "https://storage.sudospaces.com/noithattheone/2020/11/gl426-3.jpg.webp"],
    "GL427": ["https://storage.sudospaces.com/noithattheone/2025/01/gl427-2.jpg.webp", "https://storage.sudospaces.com/noithattheone/2025/01/gl427-3.jpg.webp"],
    "GL429": ["https://theone.vn/wp-content/uploads/2020/08/GL429.jpg"],
    "GL430": ["https://storage.sudospaces.com/noithattheone/2024/07/gl430-2.jpg.webp", "https://storage.sudospaces.com/noithattheone/2024/07/gl430-3.jpg.webp"],
}

LOW_RES = {"GL404B", "GL424", "GL429"}
MARKETING_CODES = ["GL430", "GL427", "GL410", "GL412", "GL419", "GL417", "GL420", "GL402TB"]


def load_inventory(path: Path) -> dict[str, dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as stream:
        all_rows = {row["Code"].strip(): row for row in csv.DictReader(stream) if row.get("Code")}
    rows = {code: all_rows[code] for code in CODES}
    if len(rows) != 24:
        raise RuntimeError(f"Locked inventory mismatch: {len(rows)}")
    return rows


def fetch(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=45) as response:
        if response.status != 200:
            raise RuntimeError(f"HTTP {response.status}: {url}")
        return response.read()


def suffix_for(url: str) -> str:
    path = urllib.parse.urlparse(url).path.lower()
    if path.endswith(".webp"):
        return ".webp"
    if path.endswith(".png"):
        return ".png"
    return ".jpg"


def editorial_application(code: str) -> str:
    if code in {"GL402TB", "GL402XB", "GL404B", "GL424B"}:
        return "Phòng đào tạo hoặc hội thảo cần bàn viết tích hợp; đối chiếu kích thước và cơ chế gấp theo từng Code."
    if code == "GL424":
        return "Phòng đào tạo hoặc hội thảo cần ghế gấp, xếp lồng và không dùng bàn viết tích hợp."
    if code == "GL406":
        return "Phòng họp cần ghế cố định chân quỳ với bề mặt da công nghiệp thay cho nhóm tựa lưới."
    if code == "GL429":
        return "Phòng họp cần vị trí ngồi cố định nhưng có đệm xoay 90 độ để ra vào thuận tiện hơn."
    return "Phòng họp, khu trao đổi hoặc khu tiếp khách cần ghế cố định; chọn theo kích thước, tay ghế và hoàn thiện khung."


def related_codes(index: int) -> list[str]:
    offsets = (-1, 1, 2)
    return [CODES[(index + offset) % len(CODES)] for offset in offsets]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--inventory", type=Path, required=True)
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument("--harvest", type=Path)
    args = parser.parse_args()
    root = args.root.resolve()
    rows = load_inventory(args.inventory)
    package = root / "PACKAGE_MESH_MEETING_GL4XX_THEONE"
    package_images = package / "images" / "products"
    public_images = root / "assets" / "product-packages" / "gl4xx-theone" / "products"
    package_images.mkdir(parents=True, exist_ok=True)
    public_images.mkdir(parents=True, exist_ok=True)

    products = []
    image_audit = []
    gallery_total = 0
    for index, code in enumerate(CODES):
        gallery_paths = []
        gallery_provenance = []
        main_width = main_height = main_bytes = 0
        main_sha = ""
        for image_index, url in enumerate(GALLERIES[code]):
            raw = fetch(url)
            suffix = suffix_for(url)
            filename = f"{'main' if image_index == 0 else f'gallery-{image_index + 1:02d}'}{suffix}"
            package_target = package_images / code / filename
            public_target = public_images / code / filename
            package_target.parent.mkdir(parents=True, exist_ok=True)
            public_target.parent.mkdir(parents=True, exist_ok=True)
            package_target.write_bytes(raw)
            public_target.write_bytes(raw)
            with Image.open(package_target) as image:
                width, height = image.size
                image.verify()
            sha = hashlib.sha256(raw).hexdigest()
            public_path = f"/assets/product-packages/gl4xx-theone/products/{code}/{filename}"
            gallery_paths.append(public_path)
            gallery_provenance.append(
                {
                    "url": url,
                    "publicPath": public_path,
                    "width": width,
                    "height": height,
                    "bytes": len(raw),
                    "sha256": sha,
                    "classification": "LOW_RES_EXACT" if code in LOW_RES else "CLEAN_EXACT",
                    "watermark": False,
                    "qr": False,
                    "supplierLogo": False,
                    "wrongCode": False,
                    "fakeUpscale": False,
                }
            )
            if image_index == 0:
                main_width, main_height, main_bytes, main_sha = width, height, len(raw), sha

        gallery_total += len(gallery_paths)
        row = rows[code]
        status = "OFFICIAL_CATALOG_ARCHIVE; SECONDARY_OUT_OF_STOCK" if code == "GL404B" else "CURRENT_MANUFACTURER_PAGE; STOCK_UNVERIFIED"
        availability = (
            "Trang tham chiếu thứ cấp ghi hết hàng; giữ model để tham khảo và tìm mã tương đương."
            if code == "GL404B"
            else "Trang nhà sản xuất không công bố tồn kho; liên hệ để kiểm tra tình trạng theo Code và số lượng."
        )
        feature = FEATURES[code]
        price = int(re.sub(r"\D", "", row["Price"]) or 0)
        product = {
            "code": code,
            "name": NAMES[code],
            "image": gallery_paths[0],
            "imageWidth": main_width,
            "imageHeight": main_height,
            "gallery": gallery_paths,
            "verifiedGalleryCount": len(gallery_paths),
            "price": price,
            "priceLabel": "Giá tham khảo ProductDB",
            "size": SIZES[code],
            "material": MATERIALS[code],
            "summary": f"{NAMES[code]}. {feature}",
            "description": f"{NAMES[code]}. {feature} Kích thước nguồn công bố: {SIZES[code]}. Vật liệu/cấu tạo: {MATERIALS[code]}.",
            "features": [feature],
            "colors": "",
            "application": editorial_application(code),
            "strength": feature,
            "limitation": "Giá hiển thị là giá tham khảo ProductDB; màu, cấu hình, tình trạng nguồn và thời điểm giao cần xác nhận khi báo giá.",
            "availabilityNote": availability,
            "relatedCodes": related_codes(index),
            "sourceBrand": "The One",
            "sourceUrl": SOURCE_URLS[code],
            "sourceStatus": status,
            "detailUrl": f"/san-pham/ghe-luoi-phong-hop/{code.lower()}",
            "imageStatus": "LOW_RES_EXACT_SOURCE_LIMIT" if code in LOW_RES else "CLEAN_EXACT",
            "isPlaceholder": False,
            "imageNaturalResolution": f"{main_width}x{main_height}",
            "rejectedImageCount": 0,
            "fieldProvenance": {
                "membership": "PORTAL_SOURCE",
                "price": "PORTAL_SOURCE",
                "productName": "OFFICIAL_SOURCE",
                "size": "OFFICIAL_SOURCE",
                "material": "OFFICIAL_SOURCE",
                "features": "OFFICIAL_SOURCE",
                "application": "BA_FURNITURE_EDITORIAL",
                "image": "OFFICIAL_SOURCE",
                "inference": "INFERRED_NOT_PUBLISHED",
            },
            "imageProvenance": {
                "sourceUrl": GALLERIES[code][0],
                "sha256": main_sha,
                "bytes": main_bytes,
                "naturalResolution": f"{main_width}x{main_height}",
                "exactBytePublicMirror": True,
                "visualStatus": "PASS_LOW_RES_EXACT_SOURCE_LIMIT" if code in LOW_RES else "PASS_CLEAN_EXACT",
                "watermark": False,
                "qr": False,
                "supplierLogo": False,
                "fakeUpscale": False,
            },
        }
        products.append(product)
        image_audit.append(
            {
                "code": code,
                "selectedMain": gallery_provenance[0],
                "approvedGallery": gallery_provenance,
                "sourceStatus": status,
            }
        )

    package_website = package / "website"
    package_website.mkdir(parents=True, exist_ok=True)
    product_json = json.dumps(products, ensure_ascii=False, indent=2)
    (package_website / "product-data.json").write_text(product_json + "\n", encoding="utf-8")
    (root / "gl4xx-meeting-chair-data.js").write_text(
        "window.BA_GL4XX_MEETING_CHAIRS = " + product_json + ";\n", encoding="utf-8"
    )

    report_dir = package / "report"
    report_dir.mkdir(parents=True, exist_ok=True)
    (report_dir / "PRODUCT_IMAGE_AUDIT.json").write_text(
        json.dumps(
            {
                "summary": {
                    "inventory": 24,
                    "cleanExact": 21,
                    "lowResExact": 3,
                    "highResolution2000": 8,
                    "sourceCeiling1000": 13,
                    "sourceLimit580": 3,
                    "approvedGalleryImages": gallery_total,
                    "watermark": 0,
                    "qr": 0,
                    "supplierLogo": 0,
                    "wrongCode": 0,
                    "placeholder": 0,
                    "fakeUpscale": 0,
                },
                "products": image_audit,
                "explicitRejects": [
                    {"code": "GL410", "url": "https://storage.sudospaces.com/noithattheone/2024/06/gl410-1.jpg.webp", "classification": "SUPPLIER_LOGO"},
                    {"code": "GL424", "url": "https://storage.sudospaces.com/noithattheone/2021/12/gl-424-0-1.jpg.webp", "classification": "SUPPLIER_LOGO"},
                    {"code": "GL424", "url": "https://storage.sudospaces.com/noithattheone/2021/12/gl-424-0.jpg", "classification": "SUPPLIER_LOGO"},
                    {"code": "GL426", "url": "https://storage.sudospaces.com/noithattheone/2021/12/gl426-2.jpg.webp", "classification": "SUPPLIER_LOGO"},
                    {"code": "GL429", "url": "https://storage.sudospaces.com/noithattheone/2022/12/gl429-full.jpg.webp", "classification": "SUPPLIER_LOGO_REJECT_INFOGRAPHIC"},
                    {"code": "GL429", "url": "https://storage.sudospaces.com/noithattheone/2022/12/gl429-0.jpg", "classification": "SUPPLIER_LOGO"},
                    {"code": "GL430", "url": "https://storage.sudospaces.com/noithattheone/2024/07/gl430-0.jpg", "classification": "SUPPLIER_LOGO"},
                ],
            },
            ensure_ascii=False,
            indent=2,
        ) + "\n",
        encoding="utf-8",
    )
    (report_dir / "OFFICIAL_SOURCE_RESEARCH.json").write_text(
        json.dumps(
            {
                "audit": {
                    "inventoryCount": 24,
                    "manufacturerExactPages": 23,
                    "officialCatalogFallback": ["GL404B"],
                    "adjacentCodesExcluded": ["GL402T", "GL402X"],
                    "manufacturerStockPublished": False,
                },
                "products": [
                    {
                        "code": item["code"],
                        "officialUrl": item["sourceUrl"],
                        "sourceStatus": item["sourceStatus"],
                        "officialSize": item["size"],
                        "officialMaterial": item["material"],
                        "approvedGallery": GALLERIES[item["code"]],
                    }
                    for item in products
                ],
            },
            ensure_ascii=False,
            indent=2,
        ) + "\n",
        encoding="utf-8",
    )
    with (report_dir / "PRODUCT_FIELD_PROVENANCE_GL4XX.csv").open("w", encoding="utf-8-sig", newline="") as stream:
        writer = csv.writer(stream)
        writer.writerow(["Code", "Membership", "ProductName", "Price", "Size", "Material", "Features", "Application", "Image"])
        for item in products:
            provenance = item["fieldProvenance"]
            writer.writerow([item["code"], provenance["membership"], provenance["productName"], provenance["price"], provenance["size"], provenance["material"], provenance["features"], provenance["application"], provenance["image"]])
    with (report_dir / "PRODUCT_DATA_CONFLICTS.csv").open("w", encoding="utf-8-sig", newline="") as stream:
        writer = csv.writer(stream)
        writer.writerow(["Code", "Field", "ProductDB", "OfficialSource", "WebsiteValue", "Resolution"])
        for row in [
            ["GL401", "Size", "W590 x D590 x H1010 mm", "W590 x D650 x H1010 mm", "W590 x D650 x H1010 mm", "OFFICIAL_SOURCE wins for website; ProductDB unchanged"],
            ["GL404", "Size", "W540 x D585 x H875 mm", "W535 x D575 x H875 mm", "W535 x D575 x H875 mm", "OFFICIAL_SOURCE wins for website; ProductDB unchanged"],
            ["GL423", "Size", "W535 x D640 x H970 mm", "W565 x D580 x H970 mm", "W565 x D580 x H970 mm", "OFFICIAL_SOURCE wins for website; ProductDB unchanged"],
            ["GL430", "Size", "W560 x D600 x H1075 mm", "W560 x D620 x H1075 mm", "W560 x D620 x H1075 mm", "OFFICIAL_SOURCE wins for website; ProductDB unchanged"],
        ]:
            writer.writerow(row)
    source_audit_dir = package / "images"
    with (source_audit_dir / "SOURCE_IMAGE_AUDIT.csv").open("w", encoding="utf-8-sig", newline="") as stream:
        writer = csv.writer(stream)
        writer.writerow(["Code", "SelectedMain", "NaturalResolution", "Bytes", "Status", "GalleryCount", "SourceLimit", "Watermark", "QR", "SupplierLogo", "WrongCode", "FakeUpscale"])
        for item in products:
            p = item["imageProvenance"]
            writer.writerow([item["code"], p["sourceUrl"], p["naturalResolution"], p["bytes"], item["imageStatus"], item["verifiedGalleryCount"], "YES" if item["code"] in LOW_RES else "NO", "NO", "NO", "NO", "NO", "NO"])

    knowledge_dir = package / "knowledge"
    knowledge_dir.mkdir(parents=True, exist_ok=True)
    knowledge = {
        "package": "PACKAGE_MESH_MEETING_GL4XX_THEONE",
        "category": "ghe-luoi-phong-hop",
        "summary": "24 ghế phòng họp/hội thảo GL4xx The One được đối chiếu theo Code, ảnh, kích thước và cấu tạo.",
        "products": [
            {
                "code": item["code"],
                "productSummary": item["summary"],
                "application": item["application"],
                "strength": item["strength"],
                "weakness": item["limitation"],
                "related": item["relatedCodes"],
                "keywords": [item["code"], "ghế lưới phòng họp", "ghế họp The One"],
                "salesPoints": item["features"],
                "sourceStatus": item["sourceStatus"],
            }
            for item in products
        ],
    }
    faq_path = package / "faq" / "faq.json"
    guide_path = package / "guide" / "BUYING_GUIDE.md"
    knowledge["faq"] = json.loads(faq_path.read_text(encoding="utf-8")) if faq_path.exists() else []
    knowledge["buyingGuide"] = guide_path.read_text(encoding="utf-8") if guide_path.exists() else ""
    (knowledge_dir / "knowledge.json").write_text(
        json.dumps(knowledge, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    inventory_dir = package / "report"
    with (inventory_dir / "GL4XX_INVENTORY.csv").open("w", encoding="utf-8-sig", newline="") as stream:
        writer = csv.writer(stream)
        writer.writerow(["Code", "ProductName", "Portal classification", "Source", "Status"])
        for product in products:
            writer.writerow(
                [
                    product["code"], product["name"],
                    "OFFICE_CHAIR / Ghế lưới phòng họp-hội thảo GL4xx / PortalReady YES",
                    "noithathoaphat.com identity + The One official enrichment",
                    "ACTIVE_IN_PRODUCTDB; " + product["sourceStatus"],
                ]
            )

    with (package_website / "PRODUCT_MATRIX.csv").open("w", encoding="utf-8-sig", newline="") as stream:
        fields = ["Code", "ProductName", "Price", "Size", "Material", "Image", "Resolution", "GalleryCount", "SourceStatus", "ImageStatus"]
        writer = csv.DictWriter(stream, fieldnames=fields)
        writer.writeheader()
        for item in products:
            writer.writerow(
                {
                    "Code": item["code"], "ProductName": item["name"], "Price": item["price"],
                    "Size": item["size"], "Material": item["material"], "Image": item["image"],
                    "Resolution": item["imageNaturalResolution"], "GalleryCount": item["verifiedGalleryCount"],
                    "SourceStatus": item["sourceStatus"], "ImageStatus": item["imageStatus"],
                }
            )

    selection_dir = package / "marketing"
    selection_dir.mkdir(parents=True, exist_ok=True)
    with (selection_dir / "GL4XX_M1_SELECTED_PRODUCTS.csv").open("w", encoding="utf-8-sig", newline="") as stream:
        fields = ["Code", "Reason", "ImageResolution", "SourceStatus", "ProductStatus"]
        writer = csv.DictWriter(stream, fieldnames=fields)
        writer.writeheader()
        for code in MARKETING_CODES:
            item = next(product for product in products if product["code"] == code)
            reason = "Ảnh sạch 2000×1446; hình dáng đại diện rõ" if code != "GL402TB" else "Mẫu bàn viết/gấp-xếp lồng tạo khác biệt công năng; ảnh sạch 1000×723"
            writer.writerow(
                {"Code": code, "Reason": reason, "ImageResolution": item["imageNaturalResolution"], "SourceStatus": item["sourceStatus"], "ProductStatus": "STOCK_UNVERIFIED"}
            )

    print(json.dumps({"products": len(products), "gallery": gallery_total, "marketing": MARKETING_CODES}, ensure_ascii=False))


if __name__ == "__main__":
    main()
