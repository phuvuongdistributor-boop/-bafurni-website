"""Reproducible read-only harvest of the exact GL4xx inventory's official sources.

The script writes only to the ignored .artifact-gl4xx working directory. It does
not alter ProductDB, Portal, the website runtime, or any upstream service.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import html
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

from lxml import etree
from PIL import Image


CODES = [
    "GL401", "GL402TB", "GL402XB", "GL403", "GL404", "GL404B",
    "GL405", "GL406", "GL410", "GL411", "GL412", "GL417", "GL418",
    "GL419", "GL420", "GL421", "GL423", "GL424", "GL424B", "GL425",
    "GL426", "GL427", "GL429", "GL430",
]

CORPORATE_URLS = {
    "GL401": "https://noithattheone.vn/ghe-hop-gl-en/ghe-hop-tua-luoi-gl401-en.html",
    "GL402TB": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-gl402tb.html",
    "GL402XB": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-402xb.html",
    "GL403": "https://noithattheone.vn/ghe-phong-hop/ghe-hop-tua-luoi-gl403.html",
    "GL404": "https://noithattheone.vn/ghe-hop-gl-en/ghe-hop-tua-luoi-gl404-en.html",
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

UA = "Mozilla/5.0 (compatible; BAFurnitureSourceAudit/1.0)"


def fetch(url: str) -> tuple[int, bytes, str]:
    request = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(request, timeout=35) as response:
            return response.status, response.read(), response.geturl()
    except Exception as exc:  # noqa: BLE001 - evidence is retained in output
        return 0, b"", f"ERROR: {type(exc).__name__}: {exc}"


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(value or "")).strip()


def parse_page(raw: bytes, base_url: str) -> dict:
    parser = etree.HTMLParser(recover=True)
    root = etree.fromstring(raw, parser) if raw else None
    if root is None:
        return {"title": "", "h1": "", "description": "", "canonical": "", "images": []}

    def first(xpath: str) -> str:
        values = root.xpath(xpath)
        if not values:
            return ""
        value = values[0]
        if isinstance(value, etree._Element):
            value = " ".join(value.itertext())
        return clean_text(str(value))

    title = first("//title")
    h1 = first("//h1[1]")
    description = first("//meta[@name='description']/@content") or first(
        "//meta[@property='og:description']/@content"
    )
    canonical = first("//link[@rel='canonical']/@href")

    image_values: list[str] = []
    xpaths = [
        "//meta[@property='og:image']/@content",
        "//a[@data-fancybox='gallery']/@href",
        "//div[contains(@class,'woocommerce-product-gallery')]//a/@href",
        "//div[contains(@class,'woocommerce-product-gallery')]//img/@src",
        "//div[contains(@class,'woocommerce-product-gallery')]//img/@data-large_image",
        "//img/@src",
    ]
    for xpath in xpaths:
        for value in root.xpath(xpath):
            absolute = urllib.parse.urljoin(base_url, html.unescape(str(value)))
            if re.search(r"\.(?:jpe?g|png|webp)(?:\?|$)", absolute, re.I):
                image_values.append(absolute)

    seen: set[str] = set()
    images: list[str] = []
    for image_url in image_values:
        normalized = image_url.split("?")[0]
        if normalized not in seen:
            seen.add(normalized)
            images.append(normalized)

    return {
        "title": title,
        "h1": h1,
        "description": description,
        "canonical": canonical,
        "images": images,
    }


def is_code_candidate(code: str, url: str) -> bool:
    name = urllib.parse.unquote(Path(urllib.parse.urlparse(url).path).name).upper()
    compact = re.sub(r"[^A-Z0-9]", "", name)
    exact = re.sub(r"[^A-Z0-9]", "", code.upper())
    return exact in compact


def inventory_rows(path: Path) -> dict[str, dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as stream:
        rows = {row["Code"].strip(): row for row in csv.DictReader(stream) if row.get("Code")}
    missing = [code for code in CODES if code not in rows]
    if missing:
        raise SystemExit(f"Inventory is missing: {', '.join(missing)}")
    return {code: rows[code] for code in CODES}


def download_candidate(code: str, url: str, output: Path, ordinal: int) -> dict:
    status, raw, final_url = fetch(url)
    suffix = Path(urllib.parse.urlparse(url).path).suffix.lower() or ".bin"
    target = output / code / f"{ordinal:02d}{suffix}"
    target.parent.mkdir(parents=True, exist_ok=True)
    record = {
        "url": url,
        "http_status": status,
        "final_url": final_url,
        "bytes": len(raw),
        "sha256": hashlib.sha256(raw).hexdigest() if raw else "",
        "local_file": str(target.as_posix()),
        "width": 0,
        "height": 0,
        "format": "",
        "decode": "FAIL",
    }
    if status == 200 and raw:
        target.write_bytes(raw)
        try:
            with Image.open(target) as image:
                record.update(
                    width=image.width,
                    height=image.height,
                    format=image.format or "",
                    decode="PASS",
                )
        except Exception as exc:  # noqa: BLE001
            record["decode_error"] = f"{type(exc).__name__}: {exc}"
    return record


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--inventory", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=Path(".artifact-gl4xx"))
    args = parser.parse_args()

    rows = inventory_rows(args.inventory)
    args.output.mkdir(parents=True, exist_ok=True)
    products: list[dict] = []

    for code in CODES:
        row = rows[code]
        archive_url = row["Official_Source_URL"].strip()
        sources = []
        for source_type, source_url in (
            ("CORPORATE_OFFICIAL", CORPORATE_URLS.get(code, "")),
            ("AUDIT_OFFICIAL_ARCHIVE", archive_url),
        ):
            if not source_url:
                continue
            status, raw, final_url = fetch(source_url)
            parsed = parse_page(raw, final_url if status else source_url)
            sources.append(
                {
                    "type": source_type,
                    "requested_url": source_url,
                    "http_status": status,
                    "final_url": final_url,
                    **parsed,
                }
            )
            time.sleep(0.08)

        candidate_urls: list[str] = []
        for source in sources:
            for image_url in source["images"]:
                if is_code_candidate(code, image_url):
                    candidate_urls.append(image_url)
        # Inventory visual is evidence only; it is never auto-approved.
        if row.get("Image_URL"):
            candidate_urls.append(row["Image_URL"].strip())

        deduped: list[str] = []
        for url in candidate_urls:
            if url not in deduped:
                deduped.append(url)

        downloads = [
            download_candidate(code, url, args.output / "candidates", index)
            for index, url in enumerate(deduped, start=1)
        ]
        products.append(
            {
                "code": code,
                "inventory": {
                    key: row.get(key, "")
                    for key in (
                        "DerivedMicroGroup", "Source", "SourceHost", "ProductName",
                        "Source_URL", "Official_Source_URL", "Image_URL", "Price",
                        "Size", "Material", "DescriptionCompleteness",
                    )
                },
                "sources": sources,
                "candidate_downloads": downloads,
            }
        )

    output = {
        "audit": {
            "inventory_path": str(args.inventory),
            "exact_count": len(CODES),
            "codes": CODES,
            "excluded_adjacent_codes": ["GL402T", "GL402X"],
            "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        },
        "products": products,
    }
    target = args.output / "official-harvest.json"
    target.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(target)


if __name__ == "__main__":
    main()
