import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";


const QA_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(QA_DIR, "../..");
const PACKAGE = path.join(REPO, "PACKAGE_MESH_HIGHBACK_GL3XX_THEONE");
const BASE = "8ac588cc871b5c6d386d6010f125b12412164777";
const EXPECTED = [
  "GL304", "GL307", "GL309", "GL316", "GL317", "GL320", "GL321",
  "GL322", "GL323", "GL324", "GL326", "GL328", "GL329", "GL331",
  "GL332", "GL333", "GL334", "GL335", "GL336", "GL338", "GL343",
  "GL345"
];
const NO_CLEAN = ["GL304", "GL309", "GL316", "GL317", "GL324", "GL335", "GL345"];

const failures = [];
const pass = [];
const check = (condition, label, details = "") => {
  if (condition) pass.push(label);
  else failures.push(`${label}${details ? ` — ${details}` : ""}`);
};
const text = (relative) => fs.readFileSync(path.join(REPO, relative), "utf8");
const json = (relative) => JSON.parse(text(relative));
const exists = (relative) => fs.existsSync(path.join(REPO, relative));
const words = (value) => (value.match(/[\p{L}\p{N}_]+(?:[-'][\p{L}\p{N}_]+)*/gu) || []).length;

function jpegSize(file) {
  const buffer = fs.readFileSync(file);
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) throw new Error(`Not JPEG: ${file}`);
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    const marker = buffer[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    const length = buffer.readUInt16BE(offset);
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return { width: buffer.readUInt16BE(offset + 5), height: buffer.readUInt16BE(offset + 3) };
    }
    offset += length;
  }
  throw new Error(`JPEG size not found: ${file}`);
}

function pngSize(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.toString("ascii", 1, 4) !== "PNG") throw new Error(`Not PNG: ${file}`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

const products = json("PACKAGE_MESH_HIGHBACK_GL3XX_THEONE/website/product-data.json");
const codes = products.map((item) => item.code);
check(products.length === 22, "22/22 product records", String(products.length));
check(JSON.stringify(codes) === JSON.stringify(EXPECTED), "Exact code order and membership");
check(new Set(codes).size === 22, "No duplicate Code");
check(products.every((item) => item.detailUrl === `/san-pham/ghe-luoi-lung-cao/${item.code.toLowerCase()}`), "22 canonical route mappings");
check(products.every((item) => !item.image.includes("categories")), "No category image fallback");
check(products.every((item) => item.priceLabel === "Giá tham khảo ProductDB"), "ProductDB price label is explicit");
check(products.every((item) => item.fieldProvenance && item.sourceUrl.startsWith("https://theone.vn/")), "Field provenance and official source present");

const placeholderCodes = products.filter((item) => item.isPlaceholder).map((item) => item.code);
check(JSON.stringify(placeholderCodes) === JSON.stringify(NO_CLEAN), "Exactly seven NO_CLEAN_EXACT placeholders", placeholderCodes.join(","));
check(products.filter((item) => !item.isPlaceholder).every((item) => item.imageStatus === "LOW_RES_EXACT"), "15 image-bearing records are LOW_RES_EXACT");
for (const item of products) {
  if (item.isPlaceholder) {
    check(item.image.endsWith("placeholder.svg"), `${item.code} neutral placeholder mapping`);
    continue;
  }
  const relative = item.image.replace(/^\//, "");
  check(exists(relative), `${item.code} main image exists`);
  if (exists(relative)) {
    const size = jpegSize(path.join(REPO, relative));
    check(size.width === 580 && size.height === 580, `${item.code} natural image is 580×580`, `${size.width}x${size.height}`);
  }
  check(item.gallery.length === item.verifiedGalleryCount, `${item.code} gallery count matches manifest`);
  for (const galleryImage of item.gallery) check(exists(galleryImage.replace(/^\//, "")), `${item.code} gallery asset exists`);
}

const imageAudit = json("PACKAGE_MESH_HIGHBACK_GL3XX_THEONE/images/SOURCE_IMAGE_AUDIT.json");
check(imageAudit.Totals.CandidateURLs === 229, "229 source image candidates audited");
check(imageAudit.Totals.ClassificationTotals.QR === 0, "Rejected QR count recorded as 0");
check(imageAudit.Totals.ClassificationTotals.WATERMARK === 19, "19 watermark candidates rejected after final visual correction");
check(imageAudit.Totals.ClassificationTotals.WRONG_CODE === 2, "2 wrong-code candidates rejected");
const selectedCandidates = imageAudit.Candidates.filter((item) => item.SelectedRole);
check(selectedCandidates.length === 16, "16 selected exact-byte source files");
for (const candidate of selectedCandidates) {
  const filename = candidate.SelectedRole === "MAIN"
    ? "main.jpg"
    : `gallery-${String(candidate.SelectedRole.match(/\d+/)?.[0] || "1").padStart(2, "0")}.jpg`;
  const asset = path.join(REPO, "assets", "v10-04", "gl3xx-theone", "products", candidate.Code, filename);
  const digest = fs.existsSync(asset) ? createHash("sha256").update(fs.readFileSync(asset)).digest("hex") : "MISSING";
  check(digest === candidate.SelectedSHA256, `${candidate.Code} ${candidate.SelectedRole} exact-byte SHA-256`);
}

const marketing = [
  ["hero-1920x1080.png", 1920, 1080],
  ["collage-1600x1200.png", 1600, 1200],
  ["thumbnail-1200x1200.png", 1200, 1200],
  ["og-1200x630.png", 1200, 630],
  ["social-cover-1640x924.png", 1640, 924]
];
const marketingManifest = text("PACKAGE_MESH_HIGHBACK_GL3XX_THEONE/images/IMAGE_MANIFEST.csv");
check(!marketingManifest.includes("GL304"), "Watermarked GL304 pixels excluded from every marketing asset");
check(!exists("assets/v10-04/gl3xx-theone/products/GL304/main.jpg"), "Watermarked GL304 main asset removed from public tree");
for (const [filename, width, height] of marketing) {
  const packageFile = path.join(PACKAGE, "images", filename);
  const publicFile = path.join(REPO, "assets", "v10-04", "gl3xx-theone", "marketing", filename);
  check(fs.existsSync(packageFile) && fs.existsSync(publicFile), `${filename} package/public copies exist`);
  if (fs.existsSync(packageFile)) {
    const size = pngSize(packageFile);
    check(size.width === width && size.height === height, `${filename} dimensions`, `${size.width}x${size.height}`);
  }
}

const landingCopy = text("PACKAGE_MESH_HIGHBACK_GL3XX_THEONE/landing/LANDING_COPY.md");
const guide = text("PACKAGE_MESH_HIGHBACK_GL3XX_THEONE/guide/BUYING_GUIDE.md");
const faq = json("PACKAGE_MESH_HIGHBACK_GL3XX_THEONE/faq/faq.json");
check(words(landingCopy) >= 550 && words(landingCopy) <= 750, "Landing copy 550–750 words", String(words(landingCopy)));
check(words(guide) >= 450 && words(guide) <= 600, "Buying guide 450–600 words", String(words(guide)));
check(faq.length >= 8 && faq.length <= 12, "FAQ count 8–12", String(faq.length));
check(exists("PACKAGE_MESH_HIGHBACK_GL3XX_THEONE/knowledge/knowledge.json"), "Knowledge package exists");
check(exists("PACKAGE_MESH_HIGHBACK_GL3XX_THEONE/marketing/MARKETING_PACKAGE.md"), "Marketing package exists");
check(exists("PACKAGE_MESH_HIGHBACK_GL3XX_THEONE/seo/schema.json"), "SEO schema exists");

const landingHtml = text("mesh-highback-gl3xx.html");
const productHtml = text("mesh-highback-product.html");
const vercel = json("vercel.json");
check(landingHtml.includes("data-v10-product-grid") && landingHtml.includes("mesh-highback-gl3xx-data.js"), "Landing runtime wiring");
check(productHtml.includes("mesh-highback-product.js") && productHtml.includes("data-product-detail"), "Product runtime wiring");
check(vercel.rewrites.some((item) => item.source === "/danh-muc/ghe-luoi-lung-cao"), "Landing rewrite exists");
check(vercel.rewrites.some((item) => item.source === "/san-pham/ghe-luoi-lung-cao/:code"), "Product rewrite exists");

let changed = [];
try {
  changed = execFileSync("git", ["diff", "--name-only", BASE], { cwd: REPO, encoding: "utf8" }).trim().split(/\r?\n/).filter(Boolean);
} catch (error) {
  failures.push(`git protected-file check failed — ${error.message}`);
}
const forbidden = changed.filter((file) => /(^|\/)(ProductDB|Portal)(\/|$)|(^|\/)lead-engine\.js$|(^|\/)lead-config\.js$|integrations\/google-apps-script|Apps Script/i.test(file));
check(forbidden.length === 0, "ProductDB / Portal / Lead Engine / Apps Script unchanged", forbidden.join(","));
check(!changed.some((file) => file.endsWith("executive-chair-theone.css") || file.endsWith("premium-ui-v9.css")), "V10.02/V9.1 CSS unchanged");

const result = {
  status: failures.length ? "FAIL" : "PASS",
  checks_passed: pass.length,
  failures,
  metrics: {
    products: products.length,
    source_pages: 22,
    low_res_exact_codes: 15,
    no_clean_exact_codes: 7,
    clean_gallery_images: products.reduce((sum, item) => sum + item.verifiedGalleryCount, 0),
    landing_words: words(landingCopy),
    guide_words: words(guide),
    faq_count: faq.length,
    marketing_assets: marketing.length,
    changed_files: changed.length
  }
};
fs.writeFileSync(path.join(PACKAGE, "qa", "STATIC_VALIDATION.json"), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
