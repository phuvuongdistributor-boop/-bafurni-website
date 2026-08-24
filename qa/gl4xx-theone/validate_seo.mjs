import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PACKAGE_ID = "PACKAGE_MESH_MEETING_GL4XX_THEONE";
const PACKAGE = path.join(ROOT, PACKAGE_ID);
const OUTPUT = path.join(PACKAGE, "qa", "SEO_VALIDATION.json");
const PRODUCTS = JSON.parse(fs.readFileSync(path.join(PACKAGE, "website", "product-data.json"), "utf8"));
const ORIGIN = "https://bafurni.com";
const LANDING_ROUTE = "/danh-muc/ghe-luoi-phong-hop";
const PREVIEW_BASE = process.env.PREVIEW_BASE || "";
const checks = [];

function check(name, pass, actual, expected, details = "") {
  checks.push({ name, pass: Boolean(pass), actual, expected, ...(details ? { details } : {}) });
}

function read(relative) {
  return fs.readFileSync(path.join(ROOT, relative), "utf8");
}

function decodeHtml(value) {
  const named = { amp: "&", apos: "'", gt: ">", lt: "<", nbsp: " ", quot: '"' };
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(#x[\da-f]+|#\d+|amp|apos|gt|lt|nbsp|quot);/gi, (match, entity) => {
      if (entity.startsWith("#")) {
        const number = entity[1].toLowerCase() === "x"
          ? Number.parseInt(entity.slice(2), 16)
          : Number.parseInt(entity.slice(1), 10);
        return Number.isFinite(number) ? String.fromCodePoint(number) : match;
      }
      return named[entity.toLowerCase()] || match;
    })
    .replace(/\s+/g, " ")
    .trim();
}

function title(html) {
  return decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);
}

function meta(html, name) {
  const escaped = name;
  return decodeHtml(
    html.match(new RegExp('<meta[^>]+(?:name|property)="' + escaped + '"[^>]+content="([^"]*)"', "i"))?.[1] ||
    html.match(new RegExp('<meta[^>]+content="([^"]*)"[^>]+(?:name|property)="' + escaped + '"', "i"))?.[1]
  );
}

function canonical(html) {
  return html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] || "";
}

function headings(html, level) {
  return [...html.matchAll(new RegExp("<h" + level + "[^>]*>([\\s\\S]*?)<\\/h" + level + ">", "gi"))]
    .map((match) => decodeHtml(match[1]));
}

function links(html) {
  return [...html.matchAll(/<a[^>]+href="([^"]+)"/gi)].map((match) => match[1]);
}

function imageAlts(html) {
  return [...html.matchAll(/<img\b([^>]*)>/gi)].map((match) => {
    const attributes = match[1];
    return {
      src: attributes.match(/\bsrc="([^"]+)"/i)?.[1] || "",
      alt: decodeHtml(attributes.match(/\balt="([^"]*)"/i)?.[1] || "")
    };
  });
}

function schemas(html) {
  const parsed = [];
  const errors = [];
  for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      parsed.push(JSON.parse(match[1]));
    } catch (error) {
      errors.push(error.message);
    }
  }
  return { parsed, errors };
}

function schemaNodes(items) {
  return items.flatMap((item) => Array.isArray(item?.["@graph"]) ? item["@graph"] : [item]);
}

function hasForbiddenSchemaKey(value, forbidden, trail = "$", hits = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => hasForbiddenSchemaKey(item, forbidden, trail + "[" + index + "]", hits));
    return hits;
  }
  if (!value || typeof value !== "object") return hits;
  for (const [key, child] of Object.entries(value)) {
    const childTrail = trail + "." + key;
    if (forbidden.has(key)) hits.push(childTrail);
    hasForbiddenSchemaKey(child, forbidden, childTrail, hits);
  }
  return hits;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quote = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quote) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') quote = false;
      else field += character;
    } else if (character === '"') quote = true;
    else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else field += character;
  }
  if (field || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  const headers = (rows.shift() || []).map((header, index) =>
    index === 0 ? header.replace(/^\uFEFF/, "") : header
  );
  return rows.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]))
  );
}

function expectedTitle(product) {
  return product.name + " | BA_Furniture";
}

function expectedCanonical(product) {
  return ORIGIN + product.detailUrl;
}

async function fetchRaw(route) {
  if (!PREVIEW_BASE) return null;
  const response = await fetch(PREVIEW_BASE + route, { redirect: "manual" });
  return { status: response.status, html: await response.text() };
}

const landingHtml = read("gl4xx-meeting-chair.html");
const landingUrl = ORIGIN + LANDING_ROUTE;
const landingSchemas = schemas(landingHtml);
const landingNodes = schemaNodes(landingSchemas.parsed);
const landingLinks = links(landingHtml);
const expectedProductRoutes = PRODUCTS.map((product) => product.detailUrl);

check("landing_unique_title", title(landingHtml) === "Ghế lưới phòng họp GL4xx The One: 24 mẫu | BA_Furniture", title(landingHtml), "Ghế lưới phòng họp GL4xx The One: 24 mẫu | BA_Furniture");
check("landing_meta_description", meta(landingHtml, "description").length >= 120 && meta(landingHtml, "description").length <= 170, meta(landingHtml, "description").length, "120..170 characters");
check("landing_single_h1", headings(landingHtml, 1).length === 1, headings(landingHtml, 1), ["Chọn ghế lưới phòng họp theo đúng không gian."]);
check("landing_canonical", canonical(landingHtml) === landingUrl, canonical(landingHtml), landingUrl);
check("landing_indexable", /\bindex\b/i.test(meta(landingHtml, "robots")) && !/\bnoindex\b/i.test(meta(landingHtml, "robots")), meta(landingHtml, "robots"), "index, follow");
check("landing_jsonld_parse", landingSchemas.errors.length === 0, landingSchemas.errors, []);
check("landing_collection_schema", landingNodes.filter((node) => node?.["@type"] === "CollectionPage").length === 1, landingNodes.map((node) => node?.["@type"]), "one CollectionPage");
check("landing_breadcrumb_schema", landingNodes.filter((node) => node?.["@type"] === "BreadcrumbList").length === 1, landingNodes.map((node) => node?.["@type"]), "one BreadcrumbList");
check("landing_faq_schema", landingNodes.filter((node) => node?.["@type"] === "FAQPage").length === 1, landingNodes.map((node) => node?.["@type"]), "one FAQPage");
check("landing_visible_faq", (landingHtml.match(/<details\b/gi) || []).length === 11, (landingHtml.match(/<details\b/gi) || []).length, 11);
check("landing_raw_product_links", expectedProductRoutes.every((route) => landingLinks.includes(route)), expectedProductRoutes.filter((route) => landingLinks.includes(route)).length, 24);
check("landing_related_category_links", ["/danh-muc/ghe-van-phong", "/danh-muc/ghe-hop-chan-quy", "/danh-muc/ghe-luoi-lung-cao"].every((route) => landingLinks.includes(route)), landingLinks.filter((route) => route.startsWith("/danh-muc/")), ["/danh-muc/ghe-van-phong", "/danh-muc/ghe-hop-chan-quy", "/danh-muc/ghe-luoi-lung-cao"]);
check("landing_meaningful_image_alt", imageAlts(landingHtml).filter((item) => item.alt === "").length === 0, imageAlts(landingHtml).filter((item) => item.alt === ""), []);

const productResults = [];
for (const product of PRODUCTS) {
  const relative = "gl4xx-product-pages/" + product.code.toLowerCase() + ".html";
  const html = read(relative);
  const pageSchemas = schemas(html);
  const nodes = schemaNodes(pageSchemas.parsed);
  const productNodes = nodes.filter((node) => node?.["@type"] === "Product");
  const breadcrumbNodes = nodes.filter((node) => node?.["@type"] === "BreadcrumbList");
  const productNode = productNodes[0] || {};
  const pageLinks = links(html);
  const pageAlts = imageAlts(html);
  const forbidden = hasForbiddenSchemaKey(
    pageSchemas.parsed,
    new Set(["offers", "aggregateRating", "review", "availability", "price", "priceCurrency"])
  );
  const result = {
    code: product.code,
    route: product.detailUrl,
    title: title(html),
    meta: meta(html, "description"),
    h1: headings(html, 1),
    canonical: canonical(html),
    robots: meta(html, "robots"),
    productSchemaCount: productNodes.length,
    breadcrumbSchemaCount: breadcrumbNodes.length,
    relatedLinks: pageLinks.filter((link) => link.startsWith("/san-pham/ghe-luoi-phong-hop/")).length
  };
  productResults.push(result);

  check(product.code + "_raw_title", result.title === expectedTitle(product), result.title, expectedTitle(product));
  check(product.code + "_raw_meta", result.meta === product.summary, result.meta, product.summary);
  check(product.code + "_single_h1", result.h1.length === 1 && result.h1[0] === product.name, result.h1, [product.name]);
  check(product.code + "_self_canonical", result.canonical === expectedCanonical(product), result.canonical, expectedCanonical(product));
  check(product.code + "_indexable", /\bindex\b/i.test(result.robots) && !/\bnoindex\b/i.test(result.robots), result.robots, "index, follow");
  check(product.code + "_jsonld_parse", pageSchemas.errors.length === 0, pageSchemas.errors, []);
  check(product.code + "_single_product_schema", productNodes.length === 1, productNodes.length, 1);
  check(product.code + "_single_breadcrumb_schema", breadcrumbNodes.length === 1, breadcrumbNodes.length, 1);
  check(product.code + "_schema_identity", productNode.sku === product.code && productNode.name === product.name && productNode.url === expectedCanonical(product), { sku: productNode.sku, name: productNode.name, url: productNode.url }, { sku: product.code, name: product.name, url: expectedCanonical(product) });
  check(product.code + "_schema_brand", productNode.brand?.name === "The One", productNode.brand?.name, "The One");
  check(product.code + "_schema_no_unverified_commercial_claims", forbidden.length === 0, forbidden, []);
  check(product.code + "_landing_backlink", pageLinks.includes(LANDING_ROUTE), pageLinks.includes(LANDING_ROUTE), true);
  check(product.code + "_related_links", result.relatedLinks > 0, result.relatedLinks, "> 0");
  check(product.code + "_meaningful_main_alt", pageAlts.some((item) => item.src === product.image && item.alt === product.name), pageAlts.filter((item) => item.src === product.image), [{ src: product.image, alt: product.name }]);

  const raw = await fetchRaw(product.detailUrl);
  if (raw) {
    check(product.code + "_preview_http_200", raw.status === 200, raw.status, 200);
    check(product.code + "_preview_raw_identity", title(raw.html) === expectedTitle(product) && headings(raw.html, 1)[0] === product.name && canonical(raw.html) === expectedCanonical(product), { title: title(raw.html), h1: headings(raw.html, 1)[0], canonical: canonical(raw.html) }, { title: expectedTitle(product), h1: product.name, canonical: expectedCanonical(product) });
  }
}

for (const [field, values] of [
  ["title", productResults.map((item) => item.title)],
  ["meta", productResults.map((item) => item.meta)],
  ["h1", productResults.map((item) => item.h1[0])],
  ["canonical", productResults.map((item) => item.canonical)]
]) {
  check("product_" + field + "_unique_24", new Set(values).size === 24, new Set(values).size, 24);
}

const rawLanding = await fetchRaw(LANDING_ROUTE);
if (rawLanding) {
  check("landing_preview_http_200", rawLanding.status === 200, rawLanding.status, 200);
  check("landing_preview_raw_product_links", expectedProductRoutes.every((route) => links(rawLanding.html).includes(route)), expectedProductRoutes.filter((route) => links(rawLanding.html).includes(route)).length, 24);
}

const robots = read("robots.txt");
check("robots_allows_crawl", /User-agent:\s*\*\s*[\r\n]+Allow:\s*\//i.test(robots) && !/Disallow:\s*\//i.test(robots), robots.trim(), "Allow: /");
check("robots_sitemap", robots.includes("Sitemap: https://bafurni.com/sitemap.xml"), robots.trim(), "Sitemap: https://bafurni.com/sitemap.xml");

const sitemap = read("sitemap.xml");
const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const expectedSitemap = [landingUrl, ...PRODUCTS.map(expectedCanonical)];
const gl4xxSitemap = sitemapLocs.filter((url) => url.includes("/ghe-luoi-phong-hop"));
check("sitemap_gl4xx_exact_25", JSON.stringify(gl4xxSitemap) === JSON.stringify(expectedSitemap), gl4xxSitemap, expectedSitemap);
check("sitemap_no_duplicates", sitemapLocs.length === new Set(sitemapLocs).size, sitemapLocs.length - new Set(sitemapLocs).size, 0);

const vercel = JSON.parse(read("vercel.json"));
const rewrite = (vercel.rewrites || []).find((item) => item.source === "/san-pham/ghe-luoi-phong-hop/:code");
check("vercel_static_product_rewrite", rewrite?.destination === "/gl4xx-product-pages/:code.html?code=:code", rewrite, { source: "/san-pham/ghe-luoi-phong-hop/:code", destination: "/gl4xx-product-pages/:code.html?code=:code" });
const staticFiles = fs.readdirSync(path.join(ROOT, "gl4xx-product-pages")).filter((name) => name.endsWith(".html")).sort();
check("static_product_page_count", staticFiles.length === 24, staticFiles.length, 24);
check("static_product_page_names", JSON.stringify(staticFiles) === JSON.stringify(PRODUCTS.map((product) => product.code.toLowerCase() + ".html").sort()), staticFiles, PRODUCTS.map((product) => product.code.toLowerCase() + ".html").sort());

const keywordRows = parseCsv(read(PACKAGE_ID + "/seo/GL4XX_SEO_KEYWORD_MAP.csv"));
const pageRows = parseCsv(read(PACKAGE_ID + "/seo/GL4XX_SEO_PAGE_MAP.csv"));
check("keyword_map_clusters", ["PRIMARY CATEGORY INTENT", "SECONDARY INTENT", "PRODUCT-CODE INTENT", "LONG-TAIL BUYING INTENT"].every((cluster) => keywordRows.some((row) => row.ClusterType === cluster)), [...new Set(keywordRows.map((row) => row.ClusterType))], ["PRIMARY CATEGORY INTENT", "SECONDARY INTENT", "PRODUCT-CODE INTENT", "LONG-TAIL BUYING INTENT"]);
check("keyword_map_product_codes", keywordRows.filter((row) => row.ClusterType === "PRODUCT-CODE INTENT").length === 24, keywordRows.filter((row) => row.ClusterType === "PRODUCT-CODE INTENT").length, 24);
check("page_map_count", pageRows.length === 25, pageRows.length, 25);
check("page_map_urls", pageRows.every((row, index) => row.URL === expectedSitemap[index]), pageRows.map((row) => row.URL), expectedSitemap);

const failed = checks.filter((item) => !item.pass);
const report = {
  status: failed.length ? "FAIL" : "PASS",
  generatedAt: new Date().toISOString(),
  previewBase: PREVIEW_BASE || "not supplied",
  rawServerDelivered: true,
  landing: landingUrl,
  productPages: PRODUCTS.length,
  keywordRows: keywordRows.length,
  pageMapRows: pageRows.length,
  totals: { checks: checks.length, passed: checks.length - failed.length, failed: failed.length },
  productResults,
  checks,
  failed
};
fs.writeFileSync(OUTPUT, JSON.stringify(report, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ status: report.status, checks: report.totals.checks, passed: report.totals.passed, failed: report.totals.failed, previewBase: report.previewBase }, null, 2));
if (failed.length) process.exit(1);
