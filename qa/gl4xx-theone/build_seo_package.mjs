import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PACKAGE_ID = "PACKAGE_MESH_MEETING_GL4XX_THEONE";
const PACKAGE = path.join(ROOT, PACKAGE_ID);
const SEO = path.join(PACKAGE, "seo");
const PRODUCT_OUT = path.join(ROOT, "gl4xx-product-pages");
const ORIGIN = "https://bafurni.com";
const LANDING_ROUTE = "/danh-muc/ghe-luoi-phong-hop";
const PRODUCTS = JSON.parse(
  fs.readFileSync(path.join(PACKAGE, "website", "product-data.json"), "utf8")
);

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[character]);
}

function price(value) {
  return Number.isFinite(Number(value))
    ? new Intl.NumberFormat("vi-VN").format(Number(value)) + " ₫"
    : "Liên hệ";
}

function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function csvCell(value) {
  const text = Array.isArray(value) ? value.join(" | ") : String(value == null ? "" : value);
  return /[",\r\n]/.test(text) ? '"' + text.replaceAll('"', '""') + '"' : text;
}

function csv(headers, rows) {
  return [
    headers.map(csvCell).join(","),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(","))
  ].join("\n") + "\n";
}

function productTitle(product) {
  return product.name + " | BA_Furniture";
}

function productMeta(product) {
  return product.summary;
}

function canonical(product) {
  return ORIGIN + product.detailUrl;
}

function productSchema(product) {
  const url = canonical(product);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": url + "#product",
    url,
    mainEntityOfPage: url,
    name: product.name,
    sku: product.code,
    brand: { "@type": "Brand", name: product.sourceBrand },
    description: product.description,
    material: product.material,
    size: product.size,
    category: "Ghế lưới phòng họp"
  };
  if (!product.isPlaceholder) {
    schema.image = product.gallery.map((image) => new URL(image, ORIGIN).href);
  }
  return schema;
}

function breadcrumbSchema(product) {
  const url = canonical(product);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": url + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: ORIGIN + "/" },
      { "@type": "ListItem", position: 2, name: "Ghế văn phòng", item: ORIGIN + "/danh-muc/ghe-van-phong" },
      { "@type": "ListItem", position: 3, name: "Ghế lưới phòng họp", item: ORIGIN + LANDING_ROUTE },
      { "@type": "ListItem", position: 4, name: product.name, item: url }
    ]
  };
}

function productCard(product, indent = "            ") {
  return [
    indent + '<article class="v10-product-card" data-product-code="' + escapeHtml(product.code) + '">',
    indent + '  <a class="v10-product-media" href="' + escapeHtml(product.detailUrl) + '" aria-label="Xem ' + escapeHtml(product.name) + '">',
    indent + '    <img src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(product.name) + '" width="' + product.imageWidth + '" height="' + product.imageHeight + '" loading="lazy" decoding="async" data-product-code="' + escapeHtml(product.code) + '" />',
    indent + "  </a>",
    indent + '  <div class="v10-product-body">',
    indent + '    <p class="v10-product-code">The One · ' + escapeHtml(product.code) + "</p>",
    indent + '    <h3><a href="' + escapeHtml(product.detailUrl) + '">' + escapeHtml(product.name) + "</a></h3>",
    indent + '    <p class="v10-product-summary">' + escapeHtml(product.summary) + "</p>",
    indent + '    <p class="v10-product-price"><span>Giá tham khảo ProductDB</span><strong>' + price(product.price) + "</strong></p>",
    indent + '    <p class="v10-product-size">' + escapeHtml(product.size) + "</p>",
    indent + "    <ul>" + (product.features || []).slice(0, 2).map((feature) => "<li>" + escapeHtml(feature) + "</li>").join("") + "</ul>",
    indent + '    <div class="v10-product-actions">',
    indent + '      <a href="' + escapeHtml(product.detailUrl) + '">Xem chi tiết</a>',
    indent + '      <button type="button" data-open-wizard data-quote-product-code="' + escapeHtml(product.code) + '" data-quote-product-name="' + escapeHtml(product.name) + '">Tư vấn mẫu này</button>',
    indent + "    </div>",
    indent + "  </div>",
    indent + "</article>"
  ].join("\n");
}

function staticDetail(product) {
  const gallery = product.gallery.length ? product.gallery : [product.image];
  const facts = [
    ["Kích thước", product.size],
    ["Chất liệu", product.material],
    ["Cấu tạo", (product.features || []).join(" · ")],
    ["Màu sắc", product.colors],
    ["Bảo hành", product.warranty],
    ["Tình trạng nguồn", product.availabilityNote]
  ].filter((entry) => entry[1]);
  const galleryNote = gallery.length + " ảnh đúng mã đã xác minh. Ảnh độ phân giải thấp được giữ nguyên kích thước tự nhiên; không dùng ảnh mã khác.";
  return [
    '      <section class="v10-detail" data-product-detail aria-live="polite">',
    '        <div class="v10-wrap v10-detail-grid">',
    '          <div class="v10-gallery">',
    '            <div class="v10-gallery-stage"><img src="' + escapeHtml(gallery[0]) + '" alt="' + escapeHtml(product.name) + '" width="' + product.imageWidth + '" height="' + product.imageHeight + '" data-gallery-stage /></div>',
    '            <div class="v10-gallery-thumbs" aria-label="Ảnh sản phẩm">',
    gallery.map((image, index) =>
      '              <button class="v10-gallery-thumb" type="button" data-gallery-image="' + escapeHtml(image) + '" aria-label="Xem ảnh ' + (index + 1) + " của " + escapeHtml(product.code) + '" aria-current="' + String(index === 0) + '"><img src="' + escapeHtml(image) + '" alt="" width="84" height="84" /></button>'
    ).join("\n"),
    "            </div>",
    '            <p class="v10-gallery-note">' + escapeHtml(galleryNote) + "</p>",
    "          </div>",
    '          <div class="v10-detail-copy">',
    '            <p class="v10-kicker">The One · ' + escapeHtml(product.code) + "</p>",
    "            <h1>" + escapeHtml(product.name) + "</h1>",
    '            <p class="v10-detail-intro">' + escapeHtml(product.description) + "</p>",
    '            <p class="v10-detail-price"><span>Giá tham khảo từ ProductDB</span><strong>' + price(product.price) + "</strong></p>",
    '            <dl class="v10-detail-facts">',
    facts.map((entry) => "              <div><dt>" + escapeHtml(entry[0]) + "</dt><dd>" + escapeHtml(entry[1]) + "</dd></div>").join("\n"),
    '              <div><dt>Nguồn</dt><dd><a href="' + escapeHtml(product.sourceUrl) + '" rel="nofollow noopener" target="_blank">The One · ' + escapeHtml(product.code) + "</a></dd></div>",
    "            </dl>",
    '            <div class="v10-detail-actions"><button type="button" data-open-wizard>Nhận báo giá ' + escapeHtml(product.code) + '</button><a href="tel:0929878666">Gọi 0929.878.666</a></div>',
    "          </div>",
    '          <div class="v10-detail-sections">',
    '            <article><p class="v10-kicker">Ứng dụng</p><h2>Phù hợp khi</h2><p>' + escapeHtml(product.application) + "</p></article>",
    '            <article><p class="v10-kicker">Điểm đáng cân nhắc</p><h2>Khác biệt chính</h2><p>' + escapeHtml(product.strength) + "</p></article>",
    '            <article><p class="v10-kicker">Trước khi chốt</p><h2>Cần xác nhận</h2><p>' + escapeHtml(product.limitation) + "</p></article>",
    "          </div>",
    "        </div>",
    "      </section>"
  ].join("\n");
}

function staticRelated(product) {
  return (product.relatedCodes || [])
    .map((code) => PRODUCTS.find((candidate) => candidate.code === code))
    .filter(Boolean)
    .map((related) => [
      '            <a class="v10-related-card" href="' + escapeHtml(related.detailUrl) + '">',
      '              <figure><img src="' + escapeHtml(related.image) + '" alt="' + escapeHtml(related.name) + '" width="' + related.imageWidth + '" height="' + related.imageHeight + '" loading="lazy" /></figure>',
      '              <div><span>The One · ' + escapeHtml(related.code) + "</span><h3>" + escapeHtml(related.name) + "</h3><p>" + escapeHtml(related.size) + "<br />" + price(related.price) + "</p></div>",
      "            </a>"
    ].join("\n"))
    .join("\n");
}

function replaceRequired(source, search, replacement, label) {
  if (!source.includes(search)) throw new Error("Template token missing: " + label);
  return source.replace(search, replacement);
}

function buildProductPage(template, product) {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, "<title>" + escapeHtml(productTitle(product)) + "</title>");
  html = html.replace(/<meta name="description" content="[^"]*" \/>/, '<meta name="description" content="' + escapeHtml(productMeta(product)) + '" />');
  html = replaceRequired(
    html,
    '<meta name="robots" content="noindex, follow, max-image-preview:large" />',
    '<meta name="robots" content="index, follow, max-image-preview:large" />',
    "robots"
  );
  html = replaceRequired(
    html,
    '    <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />',
    '    <link rel="canonical" href="' + canonical(product) + '" />\n    <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />',
    "canonical insertion"
  );
  html = html.replace(/<meta property="og:title"[^>]*\/>/, '<meta property="og:title" content="' + escapeHtml(productTitle(product)) + '" data-product-og-title />');
  html = html.replace(/<meta property="og:description"[^>]*\/>/, '<meta property="og:description" content="' + escapeHtml(productMeta(product)) + '" data-product-og-description />');
  html = html.replace(/<meta property="og:url"[^>]*\/>/, '<meta property="og:url" content="' + canonical(product) + '" data-product-og-url />');
  html = html.replace(/<meta property="og:image"[^>]*\/>/, '<meta property="og:image" content="' + new URL(product.image, ORIGIN).href + '" data-product-og-image />');
  const schemas = [
    '    <script id="gl4xx-product-schema" type="application/ld+json">' + jsonLd(productSchema(product)) + "</script>",
    '    <script id="gl4xx-product-breadcrumb-schema" type="application/ld+json">' + jsonLd(breadcrumbSchema(product)) + "</script>"
  ].join("\n");
  html = replaceRequired(html, "  </head>", schemas + "\n  </head>", "schema insertion");
  html = replaceRequired(
    html,
    'data-category-name="Ghế lưới phòng họp GL4xx The One">',
    'data-category-name="Ghế lưới phòng họp GL4xx The One" data-product-code="' + escapeHtml(product.code) + '" data-product-name="' + escapeHtml(product.name) + '">',
    "body product identity"
  );
  html = replaceRequired(
    html,
    '<span aria-current="page" data-product-code-label>Đang tải</span>',
    '<span aria-current="page" data-product-code-label>' + escapeHtml(product.code) + "</span>",
    "breadcrumb code"
  );
  html = replaceRequired(
    html,
    '      <section class="v10-detail" data-product-detail aria-live="polite"></section>',
    staticDetail(product),
    "product detail"
  );
  html = replaceRequired(
    html,
    '          <div class="v10-related-grid" data-related-products></div>',
    '          <div class="v10-related-grid" data-related-products>\n' + staticRelated(product) + "\n          </div>",
    "related products"
  );
  return html;
}

fs.mkdirSync(PRODUCT_OUT, { recursive: true });
fs.mkdirSync(SEO, { recursive: true });

const genericTemplate = fs.readFileSync(path.join(ROOT, "gl4xx-meeting-product.html"), "utf8");
for (const product of PRODUCTS) {
  const output = path.join(PRODUCT_OUT, product.code.toLowerCase() + ".html");
  fs.writeFileSync(output, buildProductPage(genericTemplate, product), "utf8");
}

const landingPath = path.join(ROOT, "gl4xx-meeting-chair.html");
let landing = fs.readFileSync(landingPath, "utf8");
const gridPattern = /<!-- GL4XX_STATIC_PRODUCT_GRID_START -->[\s\S]*?<!-- GL4XX_STATIC_PRODUCT_GRID_END -->/;
if (!gridPattern.test(landing)) throw new Error("Landing static product-grid markers are missing");
landing = landing.replace(
  gridPattern,
  "<!-- GL4XX_STATIC_PRODUCT_GRID_START -->\n" +
    PRODUCTS.map((product) => productCard(product)).join("\n") +
    "\n            <!-- GL4XX_STATIC_PRODUCT_GRID_END -->"
);
fs.writeFileSync(landingPath, landing, "utf8");

const keywordHeaders = [
  "ClusterType", "PrimaryKeyword", "SupportingKeywords", "SearchIntent",
  "TargetURL", "ContentRole", "Notes"
];
const keywordRows = [
  {
    ClusterType: "PRIMARY CATEGORY INTENT",
    PrimaryKeyword: "ghế lưới phòng họp",
    SupportingKeywords: "ghế phòng họp lưới | ghế họp lưới The One",
    SearchIntent: "Commercial investigation",
    TargetURL: ORIGIN + LANDING_ROUTE,
    ContentRole: "Landing category",
    Notes: "Primary cluster; buyer-first comparison and quote intent"
  },
  {
    ClusterType: "SECONDARY INTENT",
    PrimaryKeyword: "ghế họp The One",
    SupportingKeywords: "ghế phòng họp The One | ghế họp GL4xx",
    SearchIntent: "Commercial investigation",
    TargetURL: ORIGIN + LANDING_ROUTE,
    ContentRole: "Landing category",
    Notes: "Brand plus category"
  },
  {
    ClusterType: "SECONDARY INTENT",
    PrimaryKeyword: "ghế hội thảo có bàn",
    SupportingKeywords: "ghế hội thảo bàn viết | ghế đào tạo có bàn",
    SearchIntent: "Commercial investigation",
    TargetURL: ORIGIN + LANDING_ROUTE,
    ContentRole: "Comparison and buying guide",
    Notes: "Supported by GL402TB, GL402XB, GL404B, GL424B"
  },
  {
    ClusterType: "SECONDARY INTENT",
    PrimaryKeyword: "ghế hội thảo gấp gọn",
    SupportingKeywords: "ghế hội thảo xếp lồng | ghế phòng đào tạo gấp gọn",
    SearchIntent: "Commercial investigation",
    TargetURL: ORIGIN + LANDING_ROUTE,
    ContentRole: "Comparison and buying guide",
    Notes: "Supported by GL402TB, GL402XB, GL424, GL424B"
  },
  {
    ClusterType: "LONG-TAIL BUYING INTENT",
    PrimaryKeyword: "cách chọn ghế lưới phòng họp",
    SupportingKeywords: "kích thước ghế phòng họp | chọn ghế họp chân quỳ hay chân tĩnh",
    SearchIntent: "Informational to commercial",
    TargetURL: ORIGIN + LANDING_ROUTE + "#gl4xx-buying-title",
    ContentRole: "Buying guide",
    Notes: "No location modifiers"
  },
  {
    ClusterType: "LONG-TAIL BUYING INTENT",
    PrimaryKeyword: "so sánh ghế phòng họp GL4xx",
    SupportingKeywords: "mẫu ghế GL4xx The One | ghế họp theo kích thước",
    SearchIntent: "Commercial investigation",
    TargetURL: ORIGIN + LANDING_ROUTE + "#gl4xx-compare-title",
    ContentRole: "Comparison",
    Notes: "Code and source-backed differences only"
  },
  ...PRODUCTS.map((product) => ({
    ClusterType: "PRODUCT-CODE INTENT",
    PrimaryKeyword: product.name,
    SupportingKeywords: product.code + " | " + product.code + " The One",
    SearchIntent: "Product lookup / commercial",
    TargetURL: canonical(product),
    ContentRole: "Product detail",
    Notes: product.strength
  }))
];
fs.writeFileSync(
  path.join(SEO, "GL4XX_SEO_KEYWORD_MAP.csv"),
  "\uFEFF" + csv(keywordHeaders, keywordRows),
  "utf8"
);

const pageHeaders = [
  "URL", "PageType", "TargetIntent", "PrimaryKeyword", "Title", "H1",
  "MetaDescription", "Canonical", "Schema", "InternalLinks", "Indexability"
];
const pageRows = [
  {
    URL: ORIGIN + LANDING_ROUTE,
    PageType: "LANDING",
    TargetIntent: "PRIMARY CATEGORY INTENT",
    PrimaryKeyword: "ghế lưới phòng họp",
    Title: "Ghế lưới phòng họp GL4xx The One: 24 mẫu | BA_Furniture",
    H1: "Chọn ghế lưới phòng họp theo đúng không gian.",
    MetaDescription: "So sánh 24 mẫu ghế lưới phòng họp GL4xx The One theo Code, kích thước, vật liệu, cấu tạo và giá tham khảo ProductDB trước khi nhận báo giá.",
    Canonical: ORIGIN + LANDING_ROUTE,
    Schema: "CollectionPage | BreadcrumbList | FAQPage",
    InternalLinks: "/danh-muc/ghe-van-phong | /danh-muc/ghe-hop-chan-quy | /danh-muc/ghe-luoi-lung-cao | 24 product routes",
    Indexability: "INDEX, FOLLOW; server-delivered HTML"
  },
  ...PRODUCTS.map((product) => ({
    URL: canonical(product),
    PageType: "PRODUCT",
    TargetIntent: "PRODUCT-CODE INTENT",
    PrimaryKeyword: product.name,
    Title: productTitle(product),
    H1: product.name,
    MetaDescription: productMeta(product),
    Canonical: canonical(product),
    Schema: "Product (SKU " + product.code + ") | BreadcrumbList",
    InternalLinks: LANDING_ROUTE + " | " + (product.relatedCodes || []).map((code) => "/san-pham/ghe-luoi-phong-hop/" + code.toLowerCase()).join(" | "),
    Indexability: "INDEX, FOLLOW; server-delivered unique HTML"
  }))
];
fs.writeFileSync(
  path.join(SEO, "GL4XX_SEO_PAGE_MAP.csv"),
  "\uFEFF" + csv(pageHeaders, pageRows),
  "utf8"
);

console.log(JSON.stringify({
  products: PRODUCTS.length,
  staticProductPages: fs.readdirSync(PRODUCT_OUT).filter((name) => name.endsWith(".html")).length,
  landingCardsPrerendered: PRODUCTS.length,
  keywordRows: keywordRows.length,
  pageRows: pageRows.length
}, null, 2));
