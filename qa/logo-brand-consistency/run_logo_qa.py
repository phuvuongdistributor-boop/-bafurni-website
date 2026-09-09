from __future__ import annotations

import json
import os
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = os.environ.get("BA_LOGO_BASE_URL", "http://127.0.0.1:4173").rstrip("/")
ROOT = Path(__file__).resolve().parents[2]
OUTPUT = Path(os.environ.get("BA_LOGO_OUTPUT_DIR", Path(__file__).resolve().parent))
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
EXPECTED_LOGO = "/images/brand/ba-furniture-approved-v2.png"
EXPECTED_FAVICON = "/assets/brand/ba-furniture-approved-v2-512.png"


def inspect_page(browser, path: str, viewport: dict[str, int], screenshot: str | None = None):
    page = browser.new_page(viewport=viewport)
    console_errors: list[str] = []
    runtime_errors: list[str] = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
    page.on("pageerror", lambda error: runtime_errors.append(str(error)))
    response = page.goto(f"{BASE_URL}{path}", wait_until="domcontentloaded", timeout=10_000)
    page.wait_for_timeout(500)

    brand = page.locator(".pf-brand").first
    if brand.count() == 0:
        brand = page.locator(".v6-wordmark").first
    logo = brand.locator("img").first
    brand_name = brand.locator("span").first

    result = {
        "path": path,
        "viewport": viewport,
        "http": response.status if response else None,
        "logo_src": logo.get_attribute("src") if logo.count() else None,
        "logo_natural": logo.evaluate("el => [el.naturalWidth, el.naturalHeight]") if logo.count() else None,
        "logo_rendered": logo.evaluate("el => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }") if logo.count() else None,
        "brand_text": brand_name.inner_text().strip() if brand_name.count() and brand_name.is_visible() else "",
        "favicon": page.locator('link[rel="icon"]').first.get_attribute("href"),
        "broken_images": page.locator("img").evaluate_all("els => els.filter(el => el.complete && el.naturalWidth === 0).map(el => el.currentSrc || el.src)"),
        "overflow": page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth"),
        "console_errors": console_errors,
        "runtime_errors": runtime_errors,
    }

    if screenshot:
        page.screenshot(path=str(OUTPUT / screenshot), full_page=False)
        result["screenshot"] = screenshot

    footer_logo = page.locator(".pf-footer .pf-brand img, .v6-footer .v8-brand-logo--footer").first
    page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
    page.wait_for_timeout(350)
    result["footer_logo_src"] = footer_logo.get_attribute("src") if footer_logo.count() else None
    result["footer_logo_natural"] = footer_logo.evaluate("el => [el.naturalWidth, el.naturalHeight]") if footer_logo.count() else None

    page.close()
    return result


def inspect_wizard(browser, path: str, viewport: dict[str, int]):
    page = browser.new_page(viewport=viewport)
    console_errors: list[str] = []
    runtime_errors: list[str] = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
    page.on("pageerror", lambda error: runtime_errors.append(str(error)))
    response = page.goto(f"{BASE_URL}{path}", wait_until="domcontentloaded", timeout=10_000)
    page.wait_for_timeout(500)
    page.locator("[data-open-wizard]").first.click()
    dialog = page.locator("#quote-wizard")
    dialog.wait_for(state="visible")
    step_1 = dialog.locator('[data-step="1"] .v7-step-count').text_content().strip()
    dialog.locator('[data-field="need_type"][data-value="office"]').click()
    step_2 = dialog.locator('[data-step="2"] .v7-step-count').text_content().strip()
    dialog.locator('select[name="org_type"]').select_option("business")
    dialog.locator('select[name="quantity"]').select_option("under10")
    dialog.locator('select[name="timeline"]').select_option("researching")
    dialog.locator('input[name="region"]').fill("Nam Định")
    dialog.locator('[data-step="2"] [data-next-step]').click()
    step_3 = dialog.locator('[data-step="3"] .v7-step-count').text_content().strip()
    result = {
        "path": path,
        "viewport": viewport,
        "http": response.status if response else None,
        "steps": [step_1, step_2, step_3],
        "dialog_logo_images": dialog.locator("img").count(),
        "submitted": False,
        "overflow": page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth"),
        "console_errors": console_errors,
        "runtime_errors": runtime_errors,
    }
    page.close()
    return result


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    result = {
        "base_url": BASE_URL,
        "expected_logo": EXPECTED_LOGO,
        "expected_favicon": EXPECTED_FAVICON,
        "pages": [],
        "wizard": [],
    }
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True,
            executable_path=str(CHROME),
            args=["--disable-gpu", "--hide-scrollbars"],
        )

        desktop = {"width": 1440, "height": 900}
        mobile_390 = {"width": 390, "height": 844}
        mobile_360 = {"width": 360, "height": 800}

        result["pages"].extend(
            [
                inspect_page(browser, "/", desktop, "homepage-desktop-header.png"),
                inspect_page(browser, "/", mobile_390, "homepage-mobile-header.png"),
                inspect_page(browser, "/", mobile_360),
                inspect_page(browser, "/category.html", desktop, "category-desktop-header.png"),
                inspect_page(browser, "/category.html", mobile_390),
                inspect_page(browser, "/product-detail.html?code=TQ05", desktop, "product-tq05-desktop-header.png"),
                inspect_page(browser, "/product-detail.html?code=TQ05", mobile_390),
                inspect_page(browser, "/case-studies.html", desktop, "case-studies-desktop-header.png"),
                inspect_page(browser, "/case-studies.html", mobile_390),
            ]
        )

        result["wizard"].extend(
            [
                inspect_wizard(browser, "/", desktop),
                inspect_wizard(browser, "/product-detail.html?code=TQ05", mobile_390),
            ]
        )

        icon_page = browser.new_page(viewport={"width": 600, "height": 600})
        icon_response = icon_page.goto(f"{BASE_URL}{EXPECTED_FAVICON}", wait_until="domcontentloaded", timeout=10_000)
        icon_page.screenshot(path=str(OUTPUT / "favicon-asset-preview.png"), full_page=False)
        result["favicon_http"] = icon_response.status if icon_response else None
        icon_page.close()

        browser.close()

    result["pass"] = all(
        page["http"] == 200
        and page["logo_src"] == EXPECTED_LOGO
        and page["favicon"] == EXPECTED_FAVICON
        and page["brand_text"] == "BA_Furniture"
        and page["footer_logo_src"] == EXPECTED_LOGO
        and page["footer_logo_natural"] == [1536, 1024]
        and not page["broken_images"]
        and not page["overflow"]
        and not page["console_errors"]
        and not page["runtime_errors"]
        for page in result["pages"]
    ) and all(
        wizard["http"] == 200
        and wizard["steps"] == ["Bước 1 / 3", "Bước 2 / 3", "Bước 3 / 3"]
        and wizard["dialog_logo_images"] == 0
        and not wizard["submitted"]
        and not wizard["overflow"]
        and not wizard["console_errors"]
        and not wizard["runtime_errors"]
        for wizard in result["wizard"]
    ) and result["favicon_http"] == 200

    (OUTPUT / "browser-qa.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
