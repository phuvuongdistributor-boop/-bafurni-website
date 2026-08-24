import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = process.cwd();
const BASE = process.env.PREVIEW_BASE || "http://127.0.0.1:4184";
const OUT = path.join(ROOT, "PACKAGE_MESH_MEETING_GL4XX_THEONE", "qa");
const SHOTS = path.join(OUT, "screenshots");
const PRODUCTS = JSON.parse(fs.readFileSync(path.join(ROOT, "PACKAGE_MESH_MEETING_GL4XX_THEONE", "website", "product-data.json"), "utf8"));
const CODES = PRODUCTS.map((product) => product.code);
const UTM = "utm_source=facebook&utm_medium=social&utm_campaign=gl4xx_theone&utm_content=group_post_01";
fs.mkdirSync(SHOTS, { recursive: true });

const defaultBrowser = chromium.executablePath();
const browserRoot = path.join(process.env.LOCALAPPDATA || "", "ms-playwright");
const installedBrowser = fs.existsSync(defaultBrowser)
  ? defaultBrowser
  : fs.readdirSync(browserRoot)
      .filter((name) => name.startsWith("chromium-") && !name.includes("headless"))
      .sort().reverse()
      .map((name) => path.join(browserRoot, name, "chrome-win64", "chrome.exe"))
      .find((candidate) => fs.existsSync(candidate));
if (!installedBrowser) throw new Error("No installed Chromium executable found");

const browser = await chromium.launch({ headless: true, executablePath: installedBrowser });
const failures = [];
const checks = [];
const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];
const brokenImages = [];
const addCheck = (name, pass, details = "") => {
  checks.push({ name, status: pass ? "PASS" : "FAIL", details });
  if (!pass) failures.push(`${name}${details ? ` — ${details}` : ""}`);
};

async function newPage(context, viewport) {
  const page = await context.newPage();
  await page.setViewportSize(viewport);
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push({ url: page.url(), text: message.text() });
  });
  page.on("pageerror", (error) => pageErrors.push({ url: page.url(), text: error.message }));
  page.on("requestfailed", (request) => failedRequests.push({ url: request.url(), error: request.failure()?.errorText || "unknown" }));
  return page;
}

async function gotoReady(page, relative) {
  const response = await page.goto(`${BASE}${relative}`, { waitUntil: "networkidle", timeout: 30000 });
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(150);
  return response;
}

async function pageHealth(page, label) {
  const result = await page.evaluate(() => ({
    broken: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
    overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
    title: document.title,
    h1: document.querySelector("h1")?.textContent?.trim() || ""
  }));
  result.broken.forEach((url) => brokenImages.push({ label, url }));
  addCheck(`${label}: broken image = 0`, result.broken.length === 0, result.broken.join(", "));
  addCheck(`${label}: horizontal overflow = 0`, result.overflow <= 1, String(result.overflow));
  return result;
}

async function hydrateLazyImages(page) {
  await page.evaluate(async () => {
    const step = Math.max(500, Math.floor(innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 75));
    }
    await Promise.allSettled([...document.images].map((image) => image.decode?.()));
    scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
}

async function openWizardToStep3(page, triggerSelector = "[data-open-wizard]") {
  await page.locator(triggerSelector).first().click();
  await page.locator('.v7-choice[data-value="office"]').click();
  await page.locator('select[name="org_type"]').selectOption("business");
  await page.locator('select[name="quantity"]').selectOption("10-29");
  await page.locator('select[name="timeline"]').selectOption("researching");
  await page.locator('input[name="region"]').fill("Hà Nội");
  await page.locator('[data-step="2"] [data-next-step]').click();
  await page.locator('[data-step="3"]').waitFor({ state: "visible" });
  return page.evaluate(() => {
    const form = document.querySelector("#quote-form");
    const value = (name) => form?.elements?.namedItem(name)?.value || "";
    return {
      step: document.querySelector('[data-step="3"]')?.hidden === false ? 3 : 0,
      product_code: value("product_code"),
      product_name: value("product_name"),
      product_category: value("product_category"),
      utm_source: value("utm_source"),
      utm_medium: value("utm_medium"),
      utm_campaign: value("utm_campaign"),
      utm_content: value("utm_content"),
      utm_term: value("utm_term")
    };
  });
}

async function closeWizard(page) {
  await page.locator("[data-close-wizard]").first().click();
}

const responsive = [
  ["1440x900", { width: 1440, height: 900 }],
  ["1280x800", { width: 1280, height: 800 }],
  ["768x1024", { width: 768, height: 1024 }],
  ["390x844", { width: 390, height: 844 }],
  ["360x800", { width: 360, height: 800 }]
];

for (const [name, viewport] of responsive) {
  const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
  const page = await newPage(context, viewport);
  const response = await gotoReady(page, `/danh-muc/ghe-luoi-phong-hop?${UTM}`);
  addCheck(`Landing ${name}: HTTP 200`, response?.status() === 200, String(response?.status()));
  const health = await pageHealth(page, `Landing ${name}`);
  const metrics = await page.evaluate(() => {
    const cards = [...document.querySelectorAll(".v10-product-card")];
    const section = document.querySelector("#san-pham");
    const first = cards[0];
    return {
      cardCount: cards.length,
      sectionTop: Math.round(section?.getBoundingClientRect().top + scrollY || 0),
      firstCardTop: Math.round(first?.getBoundingClientRect().top + scrollY || 0),
      firstScreenCards: cards.filter((card) => card.getBoundingClientRect().top < innerHeight).length,
      pageHeight: document.documentElement.scrollHeight,
      viewportHeight: innerHeight
    };
  });
  addCheck(`Landing ${name}: 24 cards`, metrics.cardCount === 24, String(metrics.cardCount));
  const productFirstThreshold = viewport.width <= 390 ? 1.5 : 1.35;
  addCheck(`Landing ${name}: product section appears early`, metrics.sectionTop <= viewport.height * productFirstThreshold, JSON.stringify(metrics));
  if (name === "1440x900") {
    await page.screenshot({ path: path.join(SHOTS, "landing-desktop-1440-first-screen.png") });
    await hydrateLazyImages(page);
    await page.screenshot({ path: path.join(SHOTS, "landing-desktop-1440-full.png"), fullPage: true });
  }
  if (name === "390x844") {
    await page.screenshot({ path: path.join(SHOTS, "landing-mobile-390-first-screen.png") });
    await hydrateLazyImages(page);
    await page.screenshot({ path: path.join(SHOTS, "landing-mobile-390-full.png"), fullPage: true });
    await page.evaluate(() => scrollTo(0, document.querySelector("#san-pham")?.offsetTop || 0));
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(SHOTS, "landing-mobile-390-products.png") });
  }
  const contextData = await openWizardToStep3(page);
  addCheck(`Landing ${name}: wizard Step 3`, contextData.step === 3, JSON.stringify(contextData));
  addCheck(`Landing ${name}: category-only M1C`, contextData.product_code === "" && contextData.product_name === "" && contextData.product_category === "ghe-luoi-phong-hop", JSON.stringify(contextData));
  addCheck(`Landing ${name}: M1A UTM`, contextData.utm_source === "facebook" && contextData.utm_medium === "social" && contextData.utm_campaign === "gl4xx_theone" && contextData.utm_content === "group_post_01", JSON.stringify(contextData));
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await newPage(context, { width: 1280, height: 800 });
  for (const product of PRODUCTS) {
    const response = await gotoReady(page, product.detailUrl);
    const runtime = await page.evaluate(() => ({
      code: document.body.dataset.productCode || "",
      name: document.body.dataset.productName || "",
      canonical: document.querySelector('link[rel="canonical"]')?.href || "",
      schemaSku: [...document.querySelectorAll('script[type="application/ld+json"]')].map((node) => {
        try { return JSON.parse(node.textContent); } catch { return null; }
      }).find((item) => item?.["@type"] === "Product")?.sku || "",
      galleryCount: document.querySelectorAll("[data-gallery-image]").length,
      relatedCount: document.querySelectorAll(".v10-related-card").length,
      h1: document.querySelector("h1")?.textContent?.trim() || "",
      broken: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).length,
      overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth
    }));
    addCheck(`${product.code}: HTTP 200`, response?.status() === 200, String(response?.status()));
    addCheck(`${product.code}: exact runtime identity`, runtime.code === product.code && runtime.name === product.name && runtime.h1 === product.name, JSON.stringify(runtime));
    addCheck(`${product.code}: canonical/schema`, runtime.canonical.endsWith(product.detailUrl) && runtime.schemaSku === product.code, JSON.stringify(runtime));
    addCheck(`${product.code}: gallery/related`, runtime.galleryCount === product.gallery.length && runtime.relatedCount > 0, JSON.stringify(runtime));
    addCheck(`${product.code}: image/overflow`, runtime.broken === 0 && runtime.overflow <= 1, JSON.stringify(runtime));
  }
  await context.close();
}

for (const [code, shotPrefix] of [[CODES[0], "first-product"], [CODES.at(-1), "last-product"]]) {
  for (const [name, viewport] of [["desktop-1440", { width: 1440, height: 900 }], ["mobile-390", { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport });
    const page = await newPage(context, viewport);
    const product = PRODUCTS.find((item) => item.code === code);
    await gotoReady(page, `${product.detailUrl}?${UTM}`);
    await pageHealth(page, `${code} ${name}`);
    await page.screenshot({ path: path.join(SHOTS, `${shotPrefix}-${name}.png`), fullPage: true });
    const wizard = await openWizardToStep3(page);
    addCheck(`${code} ${name}: product M1C`, wizard.product_code === code && wizard.product_name === product.name && wizard.product_category === "ghe-luoi-phong-hop", JSON.stringify(wizard));
    addCheck(`${code} ${name}: product M1A`, wizard.utm_source === "facebook" && wizard.utm_medium === "social" && wizard.utm_campaign === "gl4xx_theone" && wizard.utm_content === "group_post_01", JSON.stringify(wizard));
    await context.close();
  }
}

{
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await newPage(context, { width: 1280, height: 800 });
  await gotoReady(page, `/san-pham/ghe-luoi-phong-hop/${CODES[0].toLowerCase()}?${UTM}`);
  await gotoReady(page, `/san-pham/ghe-luoi-phong-hop/${CODES.at(-1).toLowerCase()}`);
  const finalWizard = await openWizardToStep3(page);
  addCheck("First Code → last Code: context replaced", finalWizard.product_code === CODES.at(-1) && finalWizard.product_name === PRODUCTS.at(-1).name, JSON.stringify(finalWizard));
  addCheck("First Code → last Code: UTM persisted", finalWizard.utm_source === "facebook" && finalWizard.utm_campaign === "gl4xx_theone" && finalWizard.utm_content === "group_post_01", JSON.stringify(finalWizard));
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await newPage(context, { width: 1280, height: 800 });
  await gotoReady(page, "/danh-muc/ghe-luoi-phong-hop");
  const direct = await openWizardToStep3(page);
  addCheck("Direct visit: attribution isolated", [direct.utm_source, direct.utm_medium, direct.utm_campaign, direct.utm_content, direct.utm_term].every((value) => value === ""), JSON.stringify(direct));
  await context.close();
}

for (const [label, relative, expectedSelector] of [
  ["Homepage regression", "/", "main"],
  ["Executive Chair regression", "/danh-muc/ghe-giam-doc", "main"],
  ["GL3xx regression", "/danh-muc/ghe-luoi-lung-cao", "main"],
  ["SL regression", "/danh-muc/ghe-hop-chan-quy", "main"]
]) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await newPage(context, { width: 1280, height: 800 });
  const response = await gotoReady(page, relative);
  const selector = await page.locator(expectedSelector).count();
  addCheck(`${label}: HTTP 200/runtime shell`, response?.status() === 200 && selector > 0, `${response?.status()} / ${selector}`);
  await pageHealth(page, label);
  await context.close();
}

await browser.close();

const unique = (items) => [...new Map(items.map((item) => [JSON.stringify(item), item])).values()];
const report = {
  status: failures.length ? "FAIL" : "PASS",
  previewBase: BASE,
  checkedAt: new Date().toISOString(),
  products: CODES.length,
  routesChecked: CODES.map((code) => `/san-pham/ghe-luoi-phong-hop/${code.toLowerCase()}`),
  responsiveViewports: responsive.map(([name]) => name),
  checksPassed: checks.filter((item) => item.status === "PASS").length,
  checksFailed: failures.length,
  failures,
  consoleErrors: unique(consoleErrors),
  pageErrors: unique(pageErrors),
  failedRequests: unique(failedRequests),
  brokenImages: unique(brokenImages),
  leadSubmitted: false,
  checks
};
fs.writeFileSync(path.join(OUT, "BROWSER_QA.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ status: report.status, checksPassed: report.checksPassed, checksFailed: report.checksFailed, consoleErrors: report.consoleErrors.length, pageErrors: report.pageErrors.length, failedRequests: report.failedRequests.length, brokenImages: report.brokenImages.length }, null, 2));
if (failures.length || report.consoleErrors.length || report.pageErrors.length || report.failedRequests.length || report.brokenImages.length) process.exit(1);
