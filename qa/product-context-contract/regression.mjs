import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4184";
const chromePath = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const productFields = ["product_code", "product_name", "product_category"];
const attributionFields = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

const products = {
  GL430: {
    path: "/san-pham/ghe-luoi-phong-hop/gl430",
    product_code: "GL430",
    product_name: "Ghế Họp Tựa Lưới The One GL430",
    product_category: "ghe-luoi-phong-hop"
  },
  GL427: {
    path: "/san-pham/ghe-luoi-phong-hop/gl427",
    product_code: "GL427",
    product_name: "Ghế Họp Tựa Lưới The One GL427",
    product_category: "ghe-luoi-phong-hop"
  },
  GL402TB: {
    path: "/san-pham/ghe-luoi-phong-hop/gl402tb",
    product_code: "GL402TB",
    product_name: "Ghế Hội Thảo Có Bàn The One GL402TB",
    product_category: "ghe-luoi-phong-hop"
  },
  SL216S: {
    path: "/san-pham/ghe-hop-chan-quy/sl216s",
    product_code: "SL216S",
    product_name: "Ghế Họp Chân Quỳ The One SL216S",
    product_category: "ghe-hop-chan-quy"
  },
  GL304: {
    path: "/san-pham/ghe-luoi-lung-cao/gl304",
    product_code: "GL304",
    product_name: "Ghế Lưới Trưởng Phòng The One GL304",
    product_category: "ghe-luoi-lung-cao"
  },
  TQ34: {
    path: "/san-pham/ghe-giam-doc/tq34",
    product_code: "TQ34",
    product_name: "Ghế giám đốc ngả chân The One TQ34",
    product_category: "ghe-giam-doc"
  }
};

const attribution = {
  google: {
    utm_source: "google",
    utm_medium: "organic",
    utm_campaign: "gl4xx_theone",
    utm_content: "business_post_01",
    utm_term: ""
  },
  facebook: {
    utm_source: "facebook",
    utm_medium: "social",
    utm_campaign: "gl4xx_theone",
    utm_content: "group_post_01",
    utm_term: ""
  },
  zalo: {
    utm_source: "zalo",
    utm_medium: "social",
    utm_campaign: "gl4xx_theone",
    utm_content: "group_post_01",
    utm_term: ""
  },
  direct: Object.fromEntries(attributionFields.map((name) => [name, ""]))
};

function queryString(values) {
  const params = new URLSearchParams();
  attributionFields.forEach((name) => {
    if (values[name]) params.set(name, values[name]);
  });
  return params.toString();
}

async function snapshot(page, stage) {
  return page.evaluate(({ stage, productFields, attributionFields }) => {
    const form = document.querySelector("#quote-form");
    const read = (name) => String(form?.elements?.namedItem(name)?.value || "");
    const persisted = window.BA_LEAD_ATTRIBUTION?.get?.() || {};
    return {
      stage,
      path: location.pathname,
      product: Object.fromEntries(productFields.map((name) => [name, read(name)])),
      body: {
        product_code: document.body.dataset.productCode || "",
        product_name: document.body.dataset.productName || "",
        product_category: document.body.dataset.productCategory || ""
      },
      utm: Object.fromEntries(attributionFields.map((name) => [name, String(persisted[name] || read(name) || "")])),
      storage: sessionStorage.getItem("ba_utm_attribution_v1") || ""
    };
  }, { stage, productFields, attributionFields });
}

function compare(actual, expected, label) {
  for (const [name, value] of Object.entries(expected)) {
    if (String(actual[name] || "") !== String(value || "")) {
      throw new Error(`${label}: ${name} expected ${JSON.stringify(value)} but received ${JSON.stringify(actual[name] || "")}`);
    }
  }
}

async function goto(page, path) {
  await page.goto(new URL(path, baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#quote-form", { state: "attached" });
}

async function productStages(page, expected, expectedAttribution, options = {}) {
  const records = [];
  const expectedProduct = Object.fromEntries(productFields.map((name) => [name, expected[name]]));
  records.push(await snapshot(page, "product-page-load"));

  if (options.simulateMissingHiddenContract) {
    await page.evaluate((fields) => {
      const form = document.querySelector("#quote-form");
      fields.forEach((name) => {
        const field = form?.elements?.namedItem(name);
        if (!field) return;
        field.value = "";
        field.defaultValue = "";
      });
      if (window.BASiteShell) window.BASiteShell.setContext = () => window.BASiteShell.context?.();
    }, productFields);
    records.push(await snapshot(page, "mixed-cache-contract-before-open"));
  }

  await page.locator("main [data-open-wizard], [data-open-wizard]").first().click();
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

  records.push(await page.evaluate(({ productFields, attributionFields }) => {
    const form = document.querySelector("#quote-form");
    const payload = {
      ...Object.fromEntries(new FormData(form).entries()),
      ...(window.BA_LEAD_ATTRIBUTION?.get?.() || {})
    };
    return {
      stage: "final-payload-construction",
      product: Object.fromEntries(productFields.map((name) => [name, String(payload[name] || "")])),
      utm: Object.fromEntries(attributionFields.map((name) => [name, String(payload[name] || "")]))
    };
  }, { productFields, attributionFields }));

  records.filter((record) => record.stage !== "mixed-cache-contract-before-open").forEach((record) => {
    compare(record.product, expectedProduct, `${record.stage} product`);
    compare(record.utm, expectedAttribution, `${record.stage} attribution`);
  });
  return records;
}

async function genericStages(page) {
  const records = [await snapshot(page, "homepage-load")];
  await page.locator("[data-open-wizard]").first().click();
  records.push(await snapshot(page, "wizard-open"));
  records.push(await snapshot(page, "step-1"));
  records.forEach((record) => {
    compare(record.product, { product_code: "", product_name: "", product_category: "" }, `${record.stage} homepage product`);
    compare(record.utm, attribution.direct, `${record.stage} homepage attribution`);
  });
  return records;
}

const browser = await chromium.launch({ headless: true, executablePath: chromePath });
const results = [];

async function runFlow(name, operation) {
  console.error(`RUN ${name}`);
  const context = await browser.newContext();
  await context.route(/\.(?:avif|webp|png|jpe?g)(?:\?.*)?$/i, (route) => route.fulfill({ status: 204, body: "" }));
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.setDefaultNavigationTimeout(15000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  try {
    const records = await operation(page);
    if (errors.length) throw new Error(errors.join(" | "));
    results.push({ name, status: "PASS", records });
    console.error(`PASS ${name}`);
  } catch (error) {
    results.push({ name, status: "FAIL", error: error.message, records: [] });
    console.error(`FAIL ${name}: ${error.message}`);
  } finally {
    await context.close();
  }
}

const landing = "/danh-muc/ghe-luoi-phong-hop";
for (const source of ["google", "facebook", "zalo"]) {
  await runFlow(`${source} -> GL430`, async (page) => {
    await goto(page, `${landing}?${queryString(attribution[source])}`);
    await Promise.all([
      page.waitForURL(/\/san-pham\/ghe-luoi-phong-hop\/gl430$/),
      page.locator(`a[href="${products.GL430.path}"]`).first().click()
    ]);
    await page.waitForSelector("#quote-form", { state: "attached" });
    return productStages(page, products.GL430, attribution[source]);
  });
}

await runFlow("direct -> GL430", async (page) => {
  await goto(page, products.GL430.path);
  return productStages(page, products.GL430, attribution.direct);
});

await runFlow("mixed-cache recovery -> GL430", async (page) => {
  await goto(page, products.GL430.path);
  return productStages(page, products.GL430, attribution.direct, { simulateMissingHiddenContract: true });
});

await runFlow("GL430 -> GL427", async (page) => {
  await goto(page, `${products.GL430.path}?${queryString(attribution.google)}`);
  await goto(page, products.GL427.path);
  return productStages(page, products.GL427, attribution.google);
});

await runFlow("GL427 -> GL402TB", async (page) => {
  await goto(page, `${products.GL427.path}?${queryString(attribution.facebook)}`);
  await goto(page, products.GL402TB.path);
  return productStages(page, products.GL402TB, attribution.facebook);
});

for (const code of ["SL216S", "GL304", "TQ34"]) {
  await runFlow(code, async (page) => {
    await goto(page, products[code].path);
    return productStages(page, products[code], attribution.direct);
  });
}

await runFlow("homepage generic", async (page) => {
  await goto(page, "/");
  return genericStages(page);
});

await browser.close();

const failed = results.filter((result) => result.status !== "PASS");
console.log(JSON.stringify({ baseUrl, passed: results.length - failed.length, failed: failed.length, results }, null, 2));
if (failed.length) process.exitCode = 1;
