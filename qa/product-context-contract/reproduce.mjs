import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4184";
const chromePath = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const path = process.argv[2] || "/san-pham/ghe-luoi-phong-hop/gl430";

const productFields = ["product_code", "product_name", "product_category"];
const attributionFields = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

async function snapshot(page, stage) {
  return page.evaluate(({ stage, productFields, attributionFields }) => {
    const form = document.querySelector("#quote-form");
    const readField = (name) => {
      const field = form?.elements?.namedItem(name);
      return field ? String(field.value || "") : "";
    };
    const attribution = window.BA_LEAD_ATTRIBUTION?.get?.() || {};
    const product = Object.fromEntries(productFields.map((field) => [field, readField(field)]));
    const utm = Object.fromEntries(attributionFields.map((field) => [field, String(attribution[field] || readField(field) || "")]));
    return {
      stage,
      pathname: location.pathname,
      product,
      utm,
      body: {
        product_code: document.body.dataset.productCode || "",
        product_name: document.body.dataset.productName || "",
        product_category: document.body.dataset.productCategory || ""
      }
    };
  }, { stage, productFields, attributionFields });
}

const browser = await chromium.launch({ headless: true, executablePath: chromePath });
const page = await browser.newPage();
const records = [];

try {
  await page.goto(new URL(path, baseUrl).href, { waitUntil: "networkidle" });
  records.push(await snapshot(page, "product-page-load"));

  if (process.env.SIMULATE_STALE_CONTEXT === "1") {
    await page.evaluate((fields) => {
      const form = document.querySelector("#quote-form");
      fields.forEach((name) => {
        const field = form?.elements?.namedItem(name);
        if (!field) return;
        field.value = "";
        field.defaultValue = "";
      });
    }, productFields);
    records.push(await snapshot(page, "stale-context-before-open"));
  }

  await page.locator(".v10-detail-actions [data-open-wizard], main [data-open-wizard]").first().click();
  records.push(await snapshot(page, "wizard-open"));
  records.push(await snapshot(page, "step-1"));

  await page.getByRole("button", { name: /Văn phòng doanh nghiệp/ }).click();
  records.push(await snapshot(page, "step-2"));

  await page.locator('[name="org_type"]').selectOption("business");
  await page.locator('[name="quantity"]').selectOption("10-29");
  await page.locator('[name="timeline"]').selectOption("1-3months");
  await page.locator('[name="budget"]').selectOption("50-200");
  await page.locator('[name="region"]').fill("Nam Định");
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  records.push(await snapshot(page, "step-3"));

  const finalPayloadContract = await page.evaluate(() => {
    const form = document.querySelector("#quote-form");
    return {
      ...Object.fromEntries(new FormData(form).entries()),
      ...(window.BA_LEAD_ATTRIBUTION?.get?.() || {})
    };
  });
  records.push({ stage: "final-payload-construction", product: Object.fromEntries(productFields.map((field) => [field, String(finalPayloadContract[field] || "")])), utm: Object.fromEntries(attributionFields.map((field) => [field, String(finalPayloadContract[field] || "")])) });

  console.log(JSON.stringify(records, null, 2));
} finally {
  await browser.close();
}
