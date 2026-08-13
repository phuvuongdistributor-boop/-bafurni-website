import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const QA_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(QA_DIR, "../..");
const BASE = "22b6cdc49dbd1dbfa3a2c5098dd83b59570d4f3b";
const RECOVERED = ["GL304", "GL309", "GL316", "GL317", "GL324", "GL335", "GL345"];
const EXPECTED = [
  "GL304", "GL307", "GL309", "GL316", "GL317", "GL320", "GL321",
  "GL322", "GL323", "GL324", "GL326", "GL328", "GL329", "GL331",
  "GL332", "GL333", "GL334", "GL335", "GL336", "GL338", "GL343", "GL345"
];
const SELECTED_SHA256 = {
  "GL304/main.webp": "349ffe51b6cd2b4ac730bd5b98d141cb8c8ff1c3aa31507d47ba11f31b539a4d",
  "GL304/gallery-01.webp": "fd7b7c14fe2f0382bd83a82077fa0ad0112781f2521e050be7621e219d6e2b5d",
  "GL309/main.webp": "257b349e92d57b77a3a915eb4f510edf4d61135711505c5800b7c126715d7fcc",
  "GL309/gallery-01.webp": "f1b847675c9e607206211363477ffde604fe19311437d748453b8cb80b750f33",
  "GL309/gallery-02.webp": "134e7b6fa0e331ee551ebe617f3e4d47fd3106aea4250a087aab8f0880541084",
  "GL309/gallery-03.webp": "cc1613fe46fb0978821f68c914bf6bb12702601da97fc8d94b214405b854a41d",
  "GL316/main.webp": "11f0fedf043914e213bd1609eb159a5d2845dc1be5a46d5776303d91ed2a1b30",
  "GL316/gallery-01.webp": "3e476f3dc5d7a6866fd458ee2eb0ab32db0ccc80f744b0ea583ed8fc8c087740",
  "GL317/main.webp": "dac85650fb5f6a5f28dbad6dd1311bc77540ca5eb700aff76455a9b3ad875b6d",
  "GL324/main.webp": "ddfef838edf752183e86cb932f9d6c1eae92061bfda4a9e85256f83cfd586457",
  "GL324/gallery-01.webp": "b188ff61f17fe074894b4194f0c6fa30920f818aa73d0c62c575bc367ba985fe",
  "GL335/main.webp": "831a204783a582c5ccaa99fdeed631460b87a47bb253de88a22c1c79dda5a436",
  "GL335/gallery-01.webp": "8dc8d86d24034ed4bf9cec3bb3459bca72961cb807c544f8740ad279286ad2e3",
  "GL335/gallery-02.webp": "0b39899f48998c1520bdcfd6f4164b861c6dbf23c3bd451f81edc30e226ce70e",
  "GL345/main.webp": "2a150146692f8d9b1091fcd1aae1ed7d9e37d825befcbf333cde78ee6fbcbba4",
  "GL345/gallery-01.webp": "c723e26a96fb1a0b6e1a787c5e53ec811fb4344e6eddb4354ef72493e8221deb"
};

const failures = [];
const passes = [];
const check = (condition, label, details = "") => {
  if (condition) passes.push(label);
  else failures.push(`${label}${details ? ` — ${details}` : ""}`);
};
const read = (relative) => fs.readFileSync(path.join(REPO, relative), "utf8");
const digest = (file) => createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const git = (...args) => execFileSync("git", args, { cwd: REPO, encoding: "utf8" });

function imageSize(file) {
  const buffer = fs.readFileSync(file);
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset += 1; continue; }
      const marker = buffer[offset + 1];
      offset += 2;
      if (marker === 0xd8 || marker === 0xd9) continue;
      const length = buffer.readUInt16BE(offset);
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { width: buffer.readUInt16BE(offset + 5), height: buffer.readUInt16BE(offset + 3), format: "JPEG" };
      }
      offset += length;
    }
  }
  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    let offset = 12;
    while (offset + 8 <= buffer.length) {
      const type = buffer.toString("ascii", offset, offset + 4);
      const length = buffer.readUInt32LE(offset + 4);
      const payload = offset + 8;
      if (type === "VP8X") {
        return { width: buffer.readUIntLE(payload + 4, 3) + 1, height: buffer.readUIntLE(payload + 7, 3) + 1, format: "WEBP" };
      }
      if (type === "VP8 ") {
        return { width: buffer.readUInt16LE(payload + 6) & 0x3fff, height: buffer.readUInt16LE(payload + 8) & 0x3fff, format: "WEBP" };
      }
      if (type === "VP8L") {
        const bits = buffer.readUInt32LE(payload + 1);
        return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1, format: "WEBP" };
      }
      offset = payload + length + (length % 2);
    }
  }
  throw new Error(`Unsupported image: ${file}`);
}

const productsPath = "PACKAGE_MESH_HIGHBACK_GL3XX_THEONE/website/product-data.json";
const products = JSON.parse(read(productsPath));
const baseProducts = JSON.parse(git("show", `${BASE}:${productsPath}`));
const context = { window: {} };
vm.runInNewContext(read("mesh-highback-gl3xx-data.js"), context);

check(products.length === 22, "22/22 product records", String(products.length));
check(JSON.stringify(products.map((item) => item.code)) === JSON.stringify(EXPECTED), "Exact code order and membership");
check(JSON.stringify(products) === JSON.stringify(context.window.BA_V10_MESH_HIGHBACK_CHAIRS), "Runtime data mirrors package JSON exactly");
check(products.filter((item) => item.isPlaceholder).length === 0, "Placeholder count is 0");
check(products.filter((item) => item.imageStatus === "CLEAN_EXACT").map((item) => item.code).join(",") === RECOVERED.join(","), "Exactly seven recovered codes are CLEAN_EXACT");
check(products.filter((item) => item.imageStatus === "LOW_RES_EXACT").length === 15, "Fifteen baseline image codes remain LOW_RES_EXACT");
check(products.every((item) => !item.image.includes("categories")), "No category fallback in product images");

const mainHashes = [];
for (const product of products) {
  const main = path.join(REPO, product.image.replace(/^\//, ""));
  check(fs.existsSync(main), `${product.code} main image exists`);
  if (!fs.existsSync(main)) continue;
  const size = imageSize(main);
  check(size.width === product.imageWidth && size.height === product.imageHeight, `${product.code} declared dimensions match bytes`, `${size.width}x${size.height}`);
  check(product.gallery.length === product.verifiedGalleryCount, `${product.code} gallery count matches`);
  check(product.gallery[0] === product.image, `${product.code} gallery starts with main image`);
  for (const galleryUrl of product.gallery) check(fs.existsSync(path.join(REPO, galleryUrl.replace(/^\//, ""))), `${product.code} gallery asset exists: ${path.basename(galleryUrl)}`);
  mainHashes.push([product.code, digest(main)]);
}
check(new Set(mainHashes.map(([, hash]) => hash)).size === 22, "No cross-code exact-byte duplicate main image");

for (const [relative, expectedHash] of Object.entries(SELECTED_SHA256)) {
  const publicFile = path.join(REPO, "assets/v10-04/gl3xx-theone/products", relative);
  const packageFile = path.join(REPO, "PACKAGE_MESH_HIGHBACK_GL3XX_THEONE/images/products", relative);
  check(fs.existsSync(publicFile) && fs.existsSync(packageFile), `${relative} public/package copies exist`);
  if (fs.existsSync(publicFile) && fs.existsSync(packageFile)) {
    check(digest(publicFile) === expectedHash, `${relative} public exact-byte SHA-256`);
    check(digest(packageFile) === expectedHash, `${relative} package exact-byte SHA-256`);
  }
}

for (const product of products.filter((item) => !RECOVERED.includes(item.code))) {
  const baseline = baseProducts.find((item) => item.code === product.code);
  check(JSON.stringify(product) === JSON.stringify(baseline), `${product.code} record unchanged from base`);
}
const gl317 = products.find((item) => item.code === "GL317");
check(/da\s*(cn|công nghiệp)/iu.test(gl317.material), "GL317 material remains leather/CN configuration", gl317.material);
for (const code of ["GL321", "GL343"]) {
  const product = products.find((item) => item.code === code);
  check(/ngừng kinh doanh/iu.test(product.availabilityNote), `${code} discontinued source status retained`);
}
const storefrontText = [read("mesh-highback-gl3xx.html"), read("mesh-highback-gl3xx.js"), read("mesh-highback-product.html"), read("mesh-highback-product.js")].join("\n");
check(!/Còn hàng|Mua ngay/iu.test(storefrontText), "No unverified stock or buy-now claim in package runtime");

const trackedChanges = git("diff", "--name-only", BASE).trim().split(/\r?\n/).filter(Boolean);
const untrackedChanges = git("ls-files", "--others", "--exclude-standard").trim().split(/\r?\n/).filter(Boolean);
const changed = [...new Set([...trackedChanges, ...untrackedChanges])];
const allowed = changed.filter((file) => !(
  file === "mesh-highback-gl3xx-data.js" ||
  file === productsPath ||
  file === "PACKAGE_MESH_HIGHBACK_GL3XX_THEONE/website/PRODUCT_MATRIX.csv" ||
  file === "V10_04R_IMAGE_RECOVERY.csv" ||
  file === "V10_04R_IMAGE_RECOVERY_REPORT.md" ||
  file.startsWith("qa/v10-04r/") ||
  file.startsWith("PACKAGE_MESH_HIGHBACK_GL3XX_THEONE/qa/screenshots/v10-04r-") ||
  RECOVERED.some((code) => file.startsWith(`assets/v10-04/gl3xx-theone/products/${code}/`)) ||
  RECOVERED.some((code) => file.startsWith(`PACKAGE_MESH_HIGHBACK_GL3XX_THEONE/images/products/${code}/`))
));
check(allowed.length === 0, "Only V10.04R image-recovery paths changed", allowed.join(","));
check(!changed.some((file) => /(^|\/)(ProductDB|Portal)(\/|$)|lead-engine\.js$|lead-config\.js$|integrations\/google-apps-script/i.test(file)), "ProductDB / Portal / Lead Engine / Apps Script unchanged");
check(!changed.some((file) => /\.css$/i.test(file)), "UI/CSS unchanged");
check(!changed.some((file) => /(^|\/)marketing\//i.test(file) || /assets\/v10-04\/gl3xx-theone\/marketing\//i.test(file)), "Marketing collage/assets unchanged");

const result = {
  status: failures.length ? "FAIL" : "PASS",
  checksPassed: passes.length,
  failures,
  metrics: {
    products: products.length,
    cleanBefore: 15,
    cleanAfter: products.filter((item) => !item.isPlaceholder).length,
    placeholdersBefore: 7,
    placeholdersAfter: products.filter((item) => item.isPlaceholder).length,
    recoveredCodes: RECOVERED,
    recoveredAssets: Object.keys(SELECTED_SHA256).length,
    changedFiles: changed.length
  }
};
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
