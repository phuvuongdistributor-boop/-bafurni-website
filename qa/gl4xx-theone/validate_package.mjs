import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../..");
const MASTER = path.resolve(REPO, "../..");
const PACKAGE_ID = "PACKAGE_MESH_MEETING_GL4XX_THEONE";
const PACKAGE = path.join(REPO, PACKAGE_ID);
const OUTPUT = path.join(PACKAGE, "qa", "STATIC_VALIDATION.json");
const BASE_COMMIT = "eb26cc2d6eef88f2c02a204cd0a8695cfa3b6b22";
const CATEGORY_SLUG = "ghe-luoi-phong-hop";
const LANDING_ROUTE = `/danh-muc/${CATEGORY_SLUG}`;
const PRODUCT_ROUTE_PREFIX = `/san-pham/${CATEGORY_SLUG}`;
const TRACKED_URL = `https://bafurni.com${LANDING_ROUTE}?utm_source=facebook&utm_medium=social&utm_campaign=gl4xx_theone&utm_content=group_post_01`;

const EXPECTED_CODES = [
  "GL401", "GL402TB", "GL402XB", "GL403", "GL404", "GL404B",
  "GL405", "GL406", "GL410", "GL411", "GL412", "GL417",
  "GL418", "GL419", "GL420", "GL421", "GL423", "GL424",
  "GL424B", "GL425", "GL426", "GL427", "GL429", "GL430"
];
const SOURCE_LIMIT_CODES = ["GL404B", "GL424", "GL429"];
const EXPECTED_GALLERY_TOTAL = 46;
const EXPECTED_MARKETING_CODES = [
  "GL430", "GL427", "GL410", "GL412", "GL419", "GL417", "GL420", "GL402TB"
];
const EXPECTED_MEDIA_ORDER = ["COVER", ...EXPECTED_MARKETING_CODES];
const EXPECTED_MEDIA_FILES = [
  "01-cover-collage-1200x1500.png",
  ...EXPECTED_MARKETING_CODES.map((code, index) =>
    `${String(index + 2).padStart(2, "0")}-${code}-1080x1080.png`)
];

// This hash uses a validator-owned deterministic format:
// sorted relative path + NUL + SHA-256(file bytes) + LF, excluding __pycache__.
// The historical production freeze fingerprint is retained separately in the report.
const PORTAL_TREE_BASELINE = "50fbcb00b96c3dc810d87c96d7e64be4b0b58f08189323c62e54a2945d681da3";
const HISTORICAL_PORTAL_FREEZE = "7f2cb9d844b9259076d90b95725b4eaf4b021fdc3fb05c218837160a544b2c3a";
const HISTORICAL_PRODUCTDB_FREEZE = "748b0cfa81b29becea6d4e4cfe5d22c05cf8600afbb00b47d7eda5ed0be90f4c";

const RUNTIME_FILES = [
  "gl4xx-meeting-chair-data.js",
  "gl4xx-meeting-chair.js",
  "gl4xx-meeting-chair.html",
  "gl4xx-meeting-product.js",
  "gl4xx-meeting-product.html"
];

const PROTECTED_PATTERNS = [
  /^productdb-data(?:\.|$)/,
  /^productdb-integration\.(?:css|js)$/,
  /^product-catalog-runtime\.js$/,
  /^product-data-adapter(?:-qa)?\.js$/,
  /^lead-(?:engine|attribution|config)\.js$/,
  /^site-shell\.js$/,
  /^integrations\/google-apps-script\//,
  /^(?:style|product-first|storefront|premium-ui-v9|executive-chair-theone|executive-chair-product)\.css$/,
  /^index\.html$/,
  /^(?:category|product-detail|executive-chair|mesh-highback|sl-meeting)(?:[-.].*)?$/
];

const checks = [];
const check = (name, pass, actual, expected, details = "") => {
  checks.push({ name, pass: Boolean(pass), actual, expected, ...(details ? { details } : {}) });
  return Boolean(pass);
};

const relative = (absolute) => path.relative(REPO, absolute).replaceAll("\\", "/");
const absolute = (relativePath) => path.join(REPO, relativePath.replaceAll("/", path.sep));
const exists = (relativePath) => fs.existsSync(absolute(relativePath));
const readText = (relativePath) => fs.readFileSync(absolute(relativePath), "utf8");
const sha256 = (buffer) => crypto.createHash("sha256").update(buffer).digest("hex");
const fileSha256 = (absolutePath) => sha256(fs.readFileSync(absolutePath));
const arraysEqual = (left, right) =>
  Array.isArray(left) && Array.isArray(right) &&
  left.length === right.length && left.every((value, index) => value === right[index]);

function normalizeFaqText(value) {
  const entities = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"'
  };
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(#x[\da-f]+|#\d+|amp|apos|gt|lt|nbsp|quot);/gi, (match, entity) => {
      if (entity[0] === "#") {
        const numeric = entity[1].toLowerCase() === "x"
          ? Number.parseInt(entity.slice(2), 16)
          : Number.parseInt(entity.slice(1), 10);
        return Number.isFinite(numeric) ? String.fromCodePoint(numeric) : match;
      }
      return entities[entity.toLowerCase()] ?? match;
    })
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeFaqEntries(entries) {
  if (!Array.isArray(entries)) return [];
  return entries.map((entry) => ({
    question: normalizeFaqText(entry?.question ?? entry?.name),
    answer: normalizeFaqText(entry?.answer ?? entry?.acceptedAnswer?.text)
  }));
}

function faqMismatchIndexes(expected, actual) {
  const mismatches = [];
  const length = Math.max(expected.length, actual.length);
  for (let index = 0; index < length; index += 1) {
    if (JSON.stringify(expected[index]) !== JSON.stringify(actual[index])) mismatches.push(index + 1);
  }
  return mismatches;
}

function walk(directory, predicate = () => true) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === "__pycache__") continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(target, predicate));
    else if (predicate(target)) files.push(target);
  }
  return files.sort((a, b) => relative(a).localeCompare(relative(b), "en"));
}

function readJson(relativePath, checkName = `json_${relativePath}`) {
  try {
    const value = JSON.parse(readText(relativePath));
    check(checkName, true, "valid JSON", "valid JSON");
    return value;
  } catch (error) {
    check(checkName, false, error.message, "valid JSON");
    return null;
  }
}

function imageDimensions(buffer, extension) {
  const ext = extension.toLowerCase();
  if (ext === ".png") {
    const signature = "89504e470d0a1a0a";
    if (buffer.length < 24 || buffer.subarray(0, 8).toString("hex") !== signature) {
      throw new Error("Invalid PNG signature");
    }
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20), format: "PNG" };
  }

  if (ext === ".jpg" || ext === ".jpeg") {
    if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
      throw new Error("Invalid JPEG signature");
    }
    let offset = 2;
    while (offset + 8 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      offset += 2;
      if (marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
      if (offset + 2 > buffer.length) break;
      const length = buffer.readUInt16BE(offset);
      const isStartOfFrame = [
        0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,
        0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf
      ].includes(marker);
      if (isStartOfFrame) {
        if (offset + 7 > buffer.length) break;
        return { width: buffer.readUInt16BE(offset + 5), height: buffer.readUInt16BE(offset + 3), format: "JPEG" };
      }
      if (length < 2) break;
      offset += length;
    }
    throw new Error("JPEG dimensions not found");
  }

  if (ext === ".webp") {
    if (
      buffer.length < 30 ||
      buffer.subarray(0, 4).toString("ascii") !== "RIFF" ||
      buffer.subarray(8, 12).toString("ascii") !== "WEBP"
    ) {
      throw new Error("Invalid WebP signature");
    }
    let offset = 12;
    while (offset + 8 <= buffer.length) {
      const type = buffer.subarray(offset, offset + 4).toString("ascii");
      const size = buffer.readUInt32LE(offset + 4);
      const start = offset + 8;
      const end = Math.min(start + size, buffer.length);
      const payload = buffer.subarray(start, end);
      if (type === "VP8X" && payload.length >= 10) {
        const width = 1 + payload[4] + (payload[5] << 8) + (payload[6] << 16);
        const height = 1 + payload[7] + (payload[8] << 8) + (payload[9] << 16);
        return { width, height, format: "WebP" };
      }
      if (type === "VP8L" && payload.length >= 5 && payload[0] === 0x2f) {
        const width = 1 + payload[1] + ((payload[2] & 0x3f) << 8);
        const height = 1 + (payload[2] >> 6) + (payload[3] << 2) + ((payload[4] & 0x0f) << 10);
        return { width, height, format: "WebP" };
      }
      if (type === "VP8 ") {
        const frame = payload.indexOf(Buffer.from([0x9d, 0x01, 0x2a]));
        if (frame >= 0 && frame + 7 <= payload.length) {
          const width = payload.readUInt16LE(frame + 3) & 0x3fff;
          const height = payload.readUInt16LE(frame + 5) & 0x3fff;
          return { width, height, format: "WebP" };
        }
      }
      offset = start + size + (size % 2);
    }
    throw new Error("WebP dimensions not found");
  }

  throw new Error(`Unsupported image extension: ${extension}`);
}

function inspectImage(relativePath) {
  const target = absolute(relativePath);
  const buffer = fs.readFileSync(target);
  const dimensions = imageDimensions(buffer, path.extname(target));
  return {
    ...dimensions,
    bytes: buffer.length,
    sha256: sha256(buffer)
  };
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') quoted = false;
      else field += character;
      continue;
    }
    if (character === '"') quoted = true;
    else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      field = "";
    } else field += character;
  }
  if (field || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  if (quoted) throw new Error("Unterminated CSV quote");
  if (!rows.length) return [];
  const headers = rows[0].map((header, index) => index === 0 ? header.replace(/^\uFEFF/, "") : header);
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function validateSimpleXml(xml) {
  const clean = xml.replace(/<\?xml[\s\S]*?\?>/g, "").replace(/<!--[\s\S]*?-->/g, "");
  const tokens = clean.match(/<[^>]+>/g) || [];
  const stack = [];
  for (const token of tokens) {
    if (/^<\//.test(token)) {
      const name = token.match(/^<\/\s*([\w:.-]+)/)?.[1];
      if (!name || stack.pop() !== name) return { valid: false, error: `Mismatched closing tag ${token}` };
    } else if (!/^<!/.test(token) && !/\/$/.test(token.replace(/>$/, ""))) {
      const name = token.match(/^<\s*([\w:.-]+)/)?.[1];
      if (!name) return { valid: false, error: `Invalid opening tag ${token}` };
      stack.push(name);
    }
  }
  if (stack.length) return { valid: false, error: `Unclosed tags: ${stack.join(", ")}` };
  const textWithoutTags = clean.replace(/<[^>]+>/g, "");
  if (/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[\da-f]+;)/i.test(textWithoutTags)) {
    return { valid: false, error: "Unescaped ampersand in XML text" };
  }
  return { valid: true, error: "" };
}

function canonicalTreeHash(root) {
  const entries = walk(root).map((file) => {
    const rel = path.relative(root, file).replaceAll("\\", "/");
    return `${rel}\0${fileSha256(file)}\n`;
  });
  return { hash: sha256(Buffer.from(entries.join(""))), count: entries.length };
}

function git(...args) {
  return execFileSync("git", args, { cwd: REPO, encoding: "utf8" }).trim();
}

function compileInlineScripts(relativeHtml) {
  const html = readText(relativeHtml);
  const pattern = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  let executableCount = 0;
  let jsonLdCount = 0;
  const errors = [];
  while ((match = pattern.exec(html))) {
    const attributes = match[1] || "";
    if (/\bsrc\s*=/.test(attributes)) continue;
    if (/application\/ld\+json/i.test(attributes)) {
      jsonLdCount += 1;
      try {
        JSON.parse(match[2]);
      } catch (error) {
        errors.push(`JSON-LD ${jsonLdCount}: ${error.message}`);
      }
    } else {
      executableCount += 1;
      try {
        new vm.Script(match[2], { filename: `${relativeHtml}:inline-${executableCount}` });
      } catch (error) {
        errors.push(`inline ${executableCount}: ${error.message}`);
      }
    }
  }
  check(
    `html_inline_scripts_${path.basename(relativeHtml)}`,
    errors.length === 0,
    errors.length ? errors : { executableCount, jsonLdCount },
    "all inline JS and JSON-LD parse"
  );
}

function validateProductImages(products, imageAudit) {
  const galleryPaths = [];
  const derivedStatuses = {};
  let exactMirrors = 0;
  let validDimensions = 0;
  const errors = [];

  for (const product of products) {
    const expectedStatus = SOURCE_LIMIT_CODES.includes(product.code)
      ? "LOW_RES_EXACT_SOURCE_LIMIT"
      : "CLEAN_EXACT";
    derivedStatuses[product.code] = product.imageStatus;
    if (product.imageStatus !== expectedStatus) errors.push(`${product.code}: imageStatus=${product.imageStatus}`);
    if (product.isPlaceholder !== false) errors.push(`${product.code}: isPlaceholder must be false`);
    if (!Array.isArray(product.gallery) || product.gallery.length !== product.verifiedGalleryCount) {
      errors.push(`${product.code}: gallery/verifiedGalleryCount mismatch`);
      continue;
    }
    if (product.gallery[0] !== product.image) errors.push(`${product.code}: main image is not gallery[0]`);
    if (product.detailUrl !== `${PRODUCT_ROUTE_PREFIX}/${product.code.toLowerCase()}`) {
      errors.push(`${product.code}: wrong detailUrl ${product.detailUrl}`);
    }
    if (/categories|placeholder/i.test(product.image)) errors.push(`${product.code}: forbidden fallback path`);
    const provenance = product.imageProvenance || {};
    for (const flag of ["watermark", "qr", "supplierLogo", "fakeUpscale"]) {
      if (provenance[flag] !== false) errors.push(`${product.code}: ${flag} is not false`);
    }

    for (const publicUrl of product.gallery) {
      galleryPaths.push(publicUrl);
      const publicRelative = publicUrl.replace(/^\//, "");
      const packageRelative = publicRelative.replace(
        /^assets\/product-packages\/gl4xx-theone\/products\//,
        `${PACKAGE_ID}/images/products/`
      );
      if (!exists(publicRelative) || !exists(packageRelative)) {
        errors.push(`${product.code}: missing mirror ${publicRelative} / ${packageRelative}`);
        continue;
      }
      try {
        const publicImage = inspectImage(publicRelative);
        const packageImage = inspectImage(packageRelative);
        if (publicImage.sha256 !== packageImage.sha256) errors.push(`${product.code}: package/public bytes differ for ${publicUrl}`);
        else exactMirrors += 1;
        if (publicImage.width <= 0 || publicImage.height <= 0) errors.push(`${product.code}: invalid dimensions for ${publicUrl}`);
        else validDimensions += 1;
        if (publicUrl === product.image) {
          if (publicImage.width !== Number(product.imageWidth) || publicImage.height !== Number(product.imageHeight)) {
            errors.push(`${product.code}: runtime dimensions ${product.imageWidth}x${product.imageHeight} != ${publicImage.width}x${publicImage.height}`);
          }
          if (product.imageNaturalResolution !== `${publicImage.width}x${publicImage.height}`) {
            errors.push(`${product.code}: imageNaturalResolution mismatch`);
          }
          if (provenance.sha256 !== publicImage.sha256 || Number(provenance.bytes) !== publicImage.bytes) {
            errors.push(`${product.code}: main provenance hash/bytes mismatch`);
          }
        }
      } catch (error) {
        errors.push(`${product.code}: ${publicUrl}: ${error.message}`);
      }
    }
  }

  const publicProductFiles = walk(
    path.join(REPO, "assets", "product-packages", "gl4xx-theone", "products"),
    (file) => /\.(?:jpe?g|png|webp)$/i.test(file)
  );
  const packageProductFiles = walk(
    path.join(PACKAGE, "images", "products"),
    (file) => /\.(?:jpe?g|png|webp)$/i.test(file)
  );
  const auditProducts = Array.isArray(imageAudit?.products) ? imageAudit.products : [];
  const auditSummary = imageAudit?.summary || {};

  check("gallery_total", galleryPaths.length === EXPECTED_GALLERY_TOTAL, galleryPaths.length, EXPECTED_GALLERY_TOTAL);
  check("gallery_paths_unique", new Set(galleryPaths).size === EXPECTED_GALLERY_TOTAL, new Set(galleryPaths).size, EXPECTED_GALLERY_TOTAL);
  check("public_gallery_file_count", publicProductFiles.length === EXPECTED_GALLERY_TOTAL, publicProductFiles.length, EXPECTED_GALLERY_TOTAL);
  check("package_gallery_file_count", packageProductFiles.length === EXPECTED_GALLERY_TOTAL, packageProductFiles.length, EXPECTED_GALLERY_TOTAL);
  check("gallery_exact_mirror_count", exactMirrors === EXPECTED_GALLERY_TOTAL, exactMirrors, EXPECTED_GALLERY_TOTAL);
  check("gallery_dimension_count", validDimensions === EXPECTED_GALLERY_TOTAL, validDimensions, EXPECTED_GALLERY_TOTAL);
  check("product_image_contract", errors.length === 0, errors, []);
  check("image_status_clean_exact", Object.values(derivedStatuses).filter((value) => value === "CLEAN_EXACT").length === 21, Object.values(derivedStatuses).filter((value) => value === "CLEAN_EXACT").length, 21);
  check("image_status_source_limit", arraysEqual(Object.entries(derivedStatuses).filter(([, value]) => value === "LOW_RES_EXACT_SOURCE_LIMIT").map(([code]) => code), SOURCE_LIMIT_CODES), Object.entries(derivedStatuses).filter(([, value]) => value === "LOW_RES_EXACT_SOURCE_LIMIT").map(([code]) => code), SOURCE_LIMIT_CODES);
  check("image_audit_code_order", arraysEqual(auditProducts.map((item) => item.code), EXPECTED_CODES), auditProducts.map((item) => item.code), EXPECTED_CODES);
  check("image_audit_gallery_total", Number(auditSummary.approvedGalleryImages) === EXPECTED_GALLERY_TOTAL, auditSummary.approvedGalleryImages, EXPECTED_GALLERY_TOTAL);
  check("image_audit_clean_exact", Number(auditSummary.cleanExact) === 21, auditSummary.cleanExact, 21);
  check("image_audit_low_res_exact", Number(auditSummary.lowResExact) === 3, auditSummary.lowResExact, 3);
  check("image_audit_high_resolution_2000", Number(auditSummary.highResolution2000) === 8, auditSummary.highResolution2000, 8);
  check("image_audit_source_ceiling_1000", Number(auditSummary.sourceCeiling1000) === 13, auditSummary.sourceCeiling1000, 13);
  check("image_audit_source_limit_580", Number(auditSummary.sourceLimit580) === 3, auditSummary.sourceLimit580, 3);
  for (const field of ["watermark", "qr", "supplierLogo", "wrongCode", "placeholder", "fakeUpscale"]) {
    check(`image_audit_${field}`, Number(auditSummary[field]) === 0, auditSummary[field], 0);
  }

  const auditErrors = [];
  for (const item of auditProducts) {
    const product = products.find((candidate) => candidate.code === item.code);
    if (!product) continue;
    const approved = Array.isArray(item.approvedGallery) ? item.approvedGallery : [];
    if (!arraysEqual(approved.map((entry) => entry.publicPath), product.gallery)) {
      auditErrors.push(`${item.code}: approvedGallery paths differ from runtime`);
    }
    for (const entry of approved) {
      const rel = String(entry.publicPath || "").replace(/^\//, "");
      if (!exists(rel)) {
        auditErrors.push(`${item.code}: missing audited asset ${rel}`);
        continue;
      }
      const image = inspectImage(rel);
      if (image.width !== Number(entry.width) || image.height !== Number(entry.height)) auditErrors.push(`${item.code}: audited dimensions differ ${rel}`);
      if (image.bytes !== Number(entry.bytes) || image.sha256 !== entry.sha256) auditErrors.push(`${item.code}: audited bytes/hash differ ${rel}`);
      for (const flag of ["watermark", "qr", "supplierLogo", "wrongCode", "fakeUpscale"]) {
        if (entry[flag] !== false) auditErrors.push(`${item.code}: audited ${flag} is not false ${rel}`);
      }
    }
  }
  check("product_image_audit_asset_contract", auditErrors.length === 0, auditErrors, []);
}

function validateFacebookMedia(manifest, products) {
  const errors = [];
  check("facebook_manifest_order", arraysEqual(manifest?.order, EXPECTED_MEDIA_ORDER), manifest?.order, EXPECTED_MEDIA_ORDER);
  check("facebook_manifest_files", arraysEqual(manifest?.files, EXPECTED_MEDIA_FILES), manifest?.files, EXPECTED_MEDIA_FILES);
  check("facebook_manifest_selected_codes", arraysEqual(manifest?.selectedCodes, EXPECTED_MARKETING_CODES), manifest?.selectedCodes, EXPECTED_MARKETING_CODES);
  check("facebook_manifest_canvas_cover", manifest?.canvas?.cover === "1200x1500", manifest?.canvas?.cover, "1200x1500");
  check("facebook_manifest_canvas_individual", manifest?.canvas?.individual === "1080x1080", manifest?.canvas?.individual, "1080x1080");
  const constraints = manifest?.constraints || {};
  check("facebook_no_ai_redraw", constraints.aiRedraw === false, constraints.aiRedraw, false);
  check("facebook_no_raster_upscale", constraints.rasterUpscale === false, constraints.rasterUpscale, false);
  for (const field of ["watermark", "qr", "supplierLogo", "wrongCode"]) {
    check(`facebook_${field}`, Number(constraints[field]) === 0, constraints[field], 0);
  }

  const mediaDir = path.join(PACKAGE, "images", "facebook-multi-image");
  const actualPngs = walk(mediaDir, (file) => /\.png$/i.test(file)).map((file) => path.basename(file));
  check("facebook_png_count", actualPngs.length === 9, actualPngs.length, 9);
  check("facebook_png_names", arraysEqual(actualPngs, EXPECTED_MEDIA_FILES), actualPngs, EXPECTED_MEDIA_FILES);

  for (const [index, filename] of EXPECTED_MEDIA_FILES.entries()) {
    const packageRelative = `${PACKAGE_ID}/images/facebook-multi-image/${filename}`;
    if (!exists(packageRelative)) {
      errors.push(`missing ${packageRelative}`);
      continue;
    }
    const image = inspectImage(packageRelative);
    const expected = index === 0 ? { width: 1200, height: 1500 } : { width: 1080, height: 1080 };
    if (image.width !== expected.width || image.height !== expected.height || image.format !== "PNG") {
      errors.push(`${filename}: ${image.width}x${image.height} ${image.format}`);
    }
    const publicName = index === 0 ? "collage-facebook-group-post-01-1200x1500.png" : filename;
    const publicRelative = `assets/product-packages/gl4xx-theone/marketing/${publicName}`;
    if (!exists(publicRelative) || inspectImage(publicRelative).sha256 !== image.sha256) {
      errors.push(`${filename}: public mirror missing or byte-different`);
    }
  }

  const cover = `${PACKAGE_ID}/images/facebook-multi-image/${EXPECTED_MEDIA_FILES[0]}`;
  const packageCollage = `${PACKAGE_ID}/images/collage-facebook-group-post-01-1200x1500.png`;
  if (!exists(packageCollage) || (exists(cover) && fileSha256(absolute(cover)) !== fileSha256(absolute(packageCollage)))) {
    errors.push("cover and package collage are not exact mirrors");
  }

  const selectedSources = EXPECTED_MARKETING_CODES.map((code) => products.find((item) => item.code === code));
  check("facebook_selected_codes_exist", selectedSources.every(Boolean), selectedSources.filter(Boolean).map((item) => item.code), EXPECTED_MARKETING_CODES);
  const sourceRasterErrors = selectedSources.filter(Boolean).flatMap((product) => {
    // Individual creative renders the product inside a maximum 760x610 frame.
    if (Number(product.imageWidth) < 760 || Number(product.imageHeight) < 610) {
      return [`${product.code}: ${product.imageWidth}x${product.imageHeight} below 760x610 render frame`];
    }
    return [];
  });
  check("facebook_individual_source_not_upscaled", sourceRasterErrors.length === 0, sourceRasterErrors, []);
  check("facebook_media_dimensions_and_mirrors", errors.length === 0, errors, []);
}

function validateRoutesAndSitemap(products) {
  const vercel = readJson("vercel.json", "json_vercel_config");
  const rewrites = Array.isArray(vercel?.rewrites) ? vercel.rewrites : [];
  const expectedProductRewrite = {
    source: `${PRODUCT_ROUTE_PREFIX}/:code`,
    destination: "/gl4xx-product-pages/:code.html?code=:code"
  };
  const expectedLandingRewrite = {
    source: LANDING_ROUTE,
    destination: "/gl4xx-meeting-chair.html"
  };
  const productMatches = rewrites.filter((item) => item.source === expectedProductRewrite.source && item.destination === expectedProductRewrite.destination);
  const landingMatches = rewrites.filter((item) => item.source === expectedLandingRewrite.source && item.destination === expectedLandingRewrite.destination);
  check("vercel_product_rewrite", productMatches.length === 1, productMatches.length, 1);
  check("vercel_landing_rewrite", landingMatches.length === 1, landingMatches.length, 1);
  const productIndex = rewrites.findIndex((item) => item.source === expectedProductRewrite.source);
  const landingIndex = rewrites.findIndex((item) => item.source === expectedLandingRewrite.source);
  const genericProduct = rewrites.findIndex((item) => item.source === "/san-pham/:slug");
  const genericCategory = rewrites.findIndex((item) => item.source === "/danh-muc/:slug");
  check("vercel_product_before_generic", productIndex >= 0 && genericProduct >= 0 && productIndex < genericProduct, { productIndex, genericProduct }, "product rewrite before generic");
  check("vercel_landing_before_generic", landingIndex >= 0 && genericCategory >= 0 && landingIndex < genericCategory, { landingIndex, genericCategory }, "landing rewrite before generic");

  const sitemap = readText("sitemap.xml");
  const xml = validateSimpleXml(sitemap);
  check("sitemap_xml_well_formed", xml.valid, xml.error || "valid", "valid XML");
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  check("sitemap_no_duplicate_loc", new Set(locs).size === locs.length, locs.length - new Set(locs).size, 0);
  const expectedLocs = [
    `https://bafurni.com${LANDING_ROUTE}`,
    ...products.map((product) => `https://bafurni.com${product.detailUrl}`)
  ];
  const actualGl4Locs = locs.filter((loc) => loc.includes(`/${CATEGORY_SLUG}`));
  check("sitemap_gl4_exact_order", arraysEqual(actualGl4Locs, expectedLocs), actualGl4Locs, expectedLocs);
  check("sitemap_gl4_count", actualGl4Locs.length === 25, actualGl4Locs.length, 25);
  check("sitemap_excluded_codes_absent", !actualGl4Locs.some((loc) => /\/gl402(?:t|x)$/i.test(loc)), actualGl4Locs.filter((loc) => /\/gl402(?:t|x)$/i.test(loc)), []);
}

function validateStaleTokens() {
  const runtimeFacing = [
    ...RUNTIME_FILES,
    `${PACKAGE_ID}/website/product-data.json`,
    `${PACKAGE_ID}/website/PRODUCT_MATRIX.csv`,
    `${PACKAGE_ID}/landing/LANDING_COPY.md`,
    `${PACKAGE_ID}/guide/BUYING_GUIDE.md`,
    `${PACKAGE_ID}/faq/FAQ.md`,
    `${PACKAGE_ID}/faq/faq.json`,
    `${PACKAGE_ID}/knowledge/knowledge.json`,
    `${PACKAGE_ID}/seo/seo.json`,
    `${PACKAGE_ID}/seo/schema.json`,
    `${PACKAGE_ID}/marketing/FACEBOOK_POST_FINAL.txt`,
    `${PACKAGE_ID}/marketing/GL4XX_M1_SELECTED_PRODUCTS.csv`
  ];
  const tokens = [
    ["SL package id", /PACKAGE_SL_MEETING_CHAIR_THEONE/g],
    ["SL asset root", /sl-chair-theone/g],
    ["SL runtime", /sl-meeting/g],
    ["SL route", /ghe-hop-chan-quy/g],
    ["SL namespace", /BA_SL_/g],
    ["GL3 package id", /PACKAGE_MESH_HIGHBACK_GL3XX_THEONE/g],
    ["GL3 runtime", /mesh-highback-gl3xx/g],
    ["GL3 route", /ghe-luoi-lung-cao/g],
    ["GL3 namespace", /BA_V10_MESH_HIGHBACK/g],
    ["unresolved slug", /\[approved-slug\]/gi],
    ["generic TODO", /\b(?:TODO|TBD)\b/g],
    ["demo token", /\b(?:CHAIR-DEMO|NEED_ZALO_LINK)\b/g]
  ];
  const hits = [];
  for (const file of runtimeFacing) {
    if (!exists(file)) {
      hits.push({ file, token: "MISSING_RUNTIME_FILE", count: 1 });
      continue;
    }
    const rawText = readText(file);
    const text = file === "gl4xx-meeting-chair.html"
      ? rawText.replace(/href="\/danh-muc\/(?:ghe-hop-chan-quy|ghe-luoi-lung-cao)"/g, 'href="[approved-related-category]"')
      : rawText;
    for (const [label, pattern] of tokens) {
      const matches = text.match(pattern) || [];
      if (matches.length) hits.push({ file, token: label, count: matches.length });
    }
  }
  check("stale_runtime_tokens", hits.length === 0, hits, []);
}

function validateProtectedScope() {
  let changed = [];
  try {
    git("cat-file", "-e", `${BASE_COMMIT}^{commit}`);
    const output = git("diff", "--name-only", BASE_COMMIT, "--");
    changed = output ? output.split(/\r?\n/).filter(Boolean) : [];
    check("base_commit_available", true, BASE_COMMIT, BASE_COMMIT);
  } catch (error) {
    check("base_commit_available", false, error.message, BASE_COMMIT);
  }
  const protectedChanges = changed.filter((file) => PROTECTED_PATTERNS.some((pattern) => pattern.test(file)));
  check("protected_files_unchanged", protectedChanges.length === 0, protectedChanges, []);

  const portalRoot = path.join(MASTER, "portal_v2");
  if (!fs.existsSync(portalRoot)) {
    check("portal_tree_unchanged", false, "portal_v2 missing", PORTAL_TREE_BASELINE);
  } else {
    const portal = canonicalTreeHash(portalRoot);
    check("portal_business_file_count", portal.count === 28, portal.count, 28);
    check("portal_tree_unchanged", portal.hash === PORTAL_TREE_BASELINE, portal.hash, PORTAL_TREE_BASELINE);
  }
  return { changed, protectedChanges };
}

function validatePackageManifest(products) {
  const relativePath = `${PACKAGE_ID}/manifest.json`;
  if (!exists(relativePath)) {
    check("package_manifest_missing", false, "missing", relativePath);
    return null;
  }
  const manifest = readJson(relativePath, "json_package_manifest");
  if (!manifest) return null;
  check("package_manifest_id", manifest.package === PACKAGE_ID, manifest.package, PACKAGE_ID);
  check("package_manifest_base", manifest.baseProduction === BASE_COMMIT, manifest.baseProduction, BASE_COMMIT);
  check("package_manifest_codes", arraysEqual(manifest.codes, EXPECTED_CODES), manifest.codes, EXPECTED_CODES);
  check("package_manifest_landing_route", manifest.routes?.landing === LANDING_ROUTE, manifest.routes?.landing, LANDING_ROUTE);
  check("package_manifest_product_route", manifest.routes?.productPattern === `${PRODUCT_ROUTE_PREFIX}/{code-lowercase}`, manifest.routes?.productPattern, `${PRODUCT_ROUTE_PREFIX}/{code-lowercase}`);
  check("package_manifest_selected_codes", arraysEqual(manifest.marketing?.selectedCodes, EXPECTED_MARKETING_CODES), manifest.marketing?.selectedCodes, EXPECTED_MARKETING_CODES);
  check("package_manifest_tracked_url", manifest.marketing?.trackedUrl === TRACKED_URL, manifest.marketing?.trackedUrl, TRACKED_URL);
  const publishStatus = String(manifest.status || "").toUpperCase();
  check("package_manifest_preview_only", ["PREVIEW ONLY", "PREVIEW_ONLY", "PREPARE_ONLY"].includes(publishStatus), publishStatus, "PREVIEW ONLY");
  const forbiddenReleaseFlags = ["leadSubmission", "productionDeployment", "facebookPublished", "ads", "boost", "schedule"]
    .filter((field) => manifest.qa?.[field] !== false);
  check("package_manifest_no_release_actions", forbiddenReleaseFlags.length === 0, forbiddenReleaseFlags, []);
  return manifest;
}

function main() {
  for (const file of RUNTIME_FILES) check(`runtime_exists_${file}`, exists(file), exists(file) ? "exists" : "missing", "exists");
  const requiredPackageFiles = [
    `${PACKAGE_ID}/website/product-data.json`,
    `${PACKAGE_ID}/website/PRODUCT_MATRIX.csv`,
    `${PACKAGE_ID}/website/INTEGRATION.md`,
    `${PACKAGE_ID}/images/SOURCE_IMAGE_AUDIT.csv`,
    `${PACKAGE_ID}/report/PRODUCT_IMAGE_AUDIT.json`,
    `${PACKAGE_ID}/report/OFFICIAL_SOURCE_RESEARCH.json`,
    `${PACKAGE_ID}/landing/LANDING_COPY.md`,
    `${PACKAGE_ID}/guide/BUYING_GUIDE.md`,
    `${PACKAGE_ID}/faq/FAQ.md`,
    `${PACKAGE_ID}/faq/faq.json`,
    `${PACKAGE_ID}/knowledge/knowledge.json`,
    `${PACKAGE_ID}/seo/seo.json`,
    `${PACKAGE_ID}/seo/schema.json`,
    `${PACKAGE_ID}/marketing/FACEBOOK_POST_FINAL.txt`,
    `${PACKAGE_ID}/marketing/GL4XX_M1_SELECTED_PRODUCTS.csv`,
    `${PACKAGE_ID}/images/facebook-multi-image/manifest.json`
  ];
  const missingRequired = requiredPackageFiles.filter((file) => !exists(file));
  check("required_package_files", missingRequired.length === 0, missingRequired, []);

  const jsonFiles = walk(PACKAGE, (file) => file.endsWith(".json") && path.resolve(file) !== path.resolve(OUTPUT));
  for (const file of jsonFiles) readJson(relative(file));

  const products = readJson(`${PACKAGE_ID}/website/product-data.json`, "json_product_data") || [];
  check("product_count", products.length === 24, products.length, 24);
  check("product_code_order", arraysEqual(products.map((item) => item.code), EXPECTED_CODES), products.map((item) => item.code), EXPECTED_CODES);
  check("product_codes_unique", new Set(products.map((item) => item.code)).size === 24, new Set(products.map((item) => item.code)).size, 24);
  check("excluded_inventory_codes", !products.some((item) => ["GL402T", "GL402X"].includes(item.code)), products.filter((item) => ["GL402T", "GL402X"].includes(item.code)).map((item) => item.code), []);
  check("product_names_and_sources", products.every((item) => item.name && item.sourceBrand === "The One" && /^https:\/\/(?:noithattheone|theone)\.vn\//.test(item.sourceUrl || "")), products.filter((item) => !(item.name && item.sourceBrand === "The One" && /^https:\/\/(?:noithattheone|theone)\.vn\//.test(item.sourceUrl || ""))).map((item) => item.code), []);
  check("product_price_label", products.every((item) => item.priceLabel === "Giá tham khảo ProductDB"), products.filter((item) => item.priceLabel !== "Giá tham khảo ProductDB").map((item) => item.code), []);

  const runtimeContext = vm.createContext({ window: {} });
  try {
    new vm.Script(readText("gl4xx-meeting-chair-data.js"), { filename: "gl4xx-meeting-chair-data.js" }).runInContext(runtimeContext);
    const runtimeProducts = runtimeContext.window.BA_GL4XX_MEETING_CHAIRS;
    check("runtime_data_array", Array.isArray(runtimeProducts), Array.isArray(runtimeProducts) ? runtimeProducts.length : typeof runtimeProducts, "array");
    check("runtime_data_parity", JSON.stringify(runtimeProducts) === JSON.stringify(products), Array.isArray(runtimeProducts) ? runtimeProducts.length : 0, products.length, "Runtime JS must be exact JSON parity with package product-data.json");
  } catch (error) {
    check("runtime_data_js", false, error.message, "valid executable JS");
  }

  for (const file of ["gl4xx-meeting-chair-data.js", "gl4xx-meeting-chair.js", "gl4xx-meeting-product.js", "qa/gl4xx-theone/render_facebook_media.mjs"]) {
    if (!exists(file)) {
      check(`js_syntax_${file}`, false, "missing", "valid JS");
      continue;
    }
    try {
      execFileSync(process.execPath, ["--check", absolute(file)], { cwd: REPO, stdio: "pipe" });
      check(`js_syntax_${file}`, true, "valid", "valid JS");
    } catch (error) {
      check(`js_syntax_${file}`, false, error.stderr?.toString().trim() || error.message, "valid JS");
    }
  }
  compileInlineScripts("gl4xx-meeting-chair.html");
  compileInlineScripts("gl4xx-meeting-product.html");

  const faq = readJson(`${PACKAGE_ID}/faq/faq.json`, "json_faq") || [];
  const landingHtml = readText("gl4xx-meeting-chair.html");
  const canonicalFaq = normalizeFaqEntries(faq);
  const visibleFaq = [...landingHtml.matchAll(/<details[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/details>/gi)]
    .map((match) => ({
      question: normalizeFaqText(match[1]),
      answer: normalizeFaqText(match[2])
    }));
  let inlineSchemaFaq = [];
  for (const match of landingHtml.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const schema = JSON.parse(match[1]);
      const nodes = Array.isArray(schema["@graph"]) ? schema["@graph"] : [schema];
      const faqNode = nodes.find((node) => node?.["@type"] === "FAQPage");
      if (faqNode) inlineSchemaFaq = normalizeFaqEntries(faqNode.mainEntity);
    } catch {
      // JSON-LD parse is already reported by compileInlineScripts.
    }
  }
  const knowledge = readJson(`${PACKAGE_ID}/knowledge/knowledge.json`, "json_knowledge_faq_parity") || {};
  const knowledgeFaq = normalizeFaqEntries(knowledge.faq);
  const seoSchema = readJson(`${PACKAGE_ID}/seo/schema.json`, "json_seo_schema_faq_parity") || {};
  const seoFaqNode = (Array.isArray(seoSchema["@graph"]) ? seoSchema["@graph"] : [seoSchema])
    .find((node) => node?.["@type"] === "FAQPage");
  const seoSchemaFaq = normalizeFaqEntries(seoFaqNode?.mainEntity);
  check("faq_count", faq.length >= 8 && faq.length <= 12, faq.length, "8..12");
  check("faq_visible_parity", visibleFaq.length === faq.length, visibleFaq.length, faq.length);
  check("faq_schema_parity", inlineSchemaFaq.length === faq.length, inlineSchemaFaq.length, faq.length);
  check("faq_visible_exact_qa", JSON.stringify(visibleFaq) === JSON.stringify(canonicalFaq), faqMismatchIndexes(canonicalFaq, visibleFaq), []);
  check("faq_inline_schema_exact_qa", JSON.stringify(inlineSchemaFaq) === JSON.stringify(canonicalFaq), faqMismatchIndexes(canonicalFaq, inlineSchemaFaq), []);
  check("faq_knowledge_exact_qa", JSON.stringify(knowledgeFaq) === JSON.stringify(canonicalFaq), faqMismatchIndexes(canonicalFaq, knowledgeFaq), []);
  check("faq_seo_schema_exact_qa", JSON.stringify(seoSchemaFaq) === JSON.stringify(canonicalFaq), faqMismatchIndexes(canonicalFaq, seoSchemaFaq), []);

  const imageAudit = readJson(`${PACKAGE_ID}/report/PRODUCT_IMAGE_AUDIT.json`, "json_product_image_audit") || {};
  validateProductImages(products, imageAudit);

  const sourceAuditPath = `${PACKAGE_ID}/images/SOURCE_IMAGE_AUDIT.csv`;
  try {
    const rows = parseCsv(readText(sourceAuditPath));
    check("source_image_audit_rows", rows.length === 24, rows.length, 24);
    check("source_image_audit_code_order", arraysEqual(rows.map((row) => row.Code), EXPECTED_CODES), rows.map((row) => row.Code), EXPECTED_CODES);
    check("source_image_audit_gallery_total", rows.reduce((sum, row) => sum + Number(row.GalleryCount || 0), 0) === EXPECTED_GALLERY_TOTAL, rows.reduce((sum, row) => sum + Number(row.GalleryCount || 0), 0), EXPECTED_GALLERY_TOTAL);
    const badFlags = rows.filter((row) => ["Watermark", "QR", "SupplierLogo", "WrongCode", "FakeUpscale"].some((field) => row[field] !== "NO"));
    check("source_image_audit_flags", badFlags.length === 0, badFlags.map((row) => row.Code), []);
  } catch (error) {
    check("source_image_audit_csv", false, error.message, "valid CSV");
  }

  const mediaManifest = readJson(`${PACKAGE_ID}/images/facebook-multi-image/manifest.json`, "json_facebook_media_manifest") || {};
  validateFacebookMedia(mediaManifest, products);
  validateRoutesAndSitemap(products);
  validateStaleTokens();
  validatePackageManifest(products);
  const protectedScope = validateProtectedScope();

  const marketingCopy = readText(`${PACKAGE_ID}/marketing/FACEBOOK_POST_FINAL.txt`);
  check("marketing_tracked_url", marketingCopy.includes(TRACKED_URL), marketingCopy.match(/https?:\/\/\S+/)?.[0] || "missing", TRACKED_URL);
  check("marketing_selected_codes", EXPECTED_MARKETING_CODES.every((code) => marketingCopy.includes(code)), EXPECTED_MARKETING_CODES.filter((code) => marketingCopy.includes(code)), EXPECTED_MARKETING_CODES);
  check("marketing_hotline", marketingCopy.includes("0929.878.666"), marketingCopy.includes("0929.878.666"), true);
  const forbiddenClaims = marketingCopy.match(/rẻ nhất|tốt nhất|số 1|còn hàng|giao ngay|giảm giá/gi) || [];
  check("marketing_forbidden_claims", forbiddenClaims.length === 0, forbiddenClaims, []);

  const failed = checks.filter((item) => !item.pass);
  const report = {
    status: failed.length ? "FAIL" : "PASS",
    generated_at: new Date().toISOString(),
    validator_version: "1.0.0",
    base_commit: BASE_COMMIT,
    package_id: PACKAGE_ID,
    inventory: {
      expected: EXPECTED_CODES.length,
      actual: products.length,
      codes: products.map((item) => item.code),
      expected_codes: EXPECTED_CODES
    },
    images: {
      gallery_expected: EXPECTED_GALLERY_TOTAL,
      gallery_actual: products.reduce((sum, item) => sum + (Array.isArray(item.gallery) ? item.gallery.length : 0), 0),
      clean_exact_expected: 21,
      source_limit_expected: SOURCE_LIMIT_CODES,
      facebook_media_expected: EXPECTED_MEDIA_FILES
    },
    boundaries: {
      changed_files_vs_base: protectedScope.changed,
      protected_changes: protectedScope.protectedChanges,
      productdb_historical_freeze_sha256: HISTORICAL_PRODUCTDB_FREEZE,
      portal_historical_freeze_sha256: HISTORICAL_PORTAL_FREEZE,
      portal_validator_baseline_sha256: PORTAL_TREE_BASELINE
    },
    totals: {
      checks: checks.length,
      passed: checks.length - failed.length,
      failed: failed.length
    },
    checks,
    failed
  };

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(report, null, 2));
  if (failed.length) process.exitCode = 1;
}

main();
