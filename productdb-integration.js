(function () {
  if (window.BAProductDBIntegration) return;

  const adapter = window.BAProductDataAdapter;
  const routing = window.BARouting || {};
  const rows = Array.isArray(window.BA_PRODUCT_ROWS) ? window.BA_PRODUCT_ROWS : [];
  const meta = window.BA_PRODUCTDB_META || {};
  if (!adapter || !rows.length) return;

  const imageLabels = [["hero", "Hero"], ["angle_45", "Góc 45°"], ["front", "Chính diện"], ["side", "Bên"], ["back", "Sau"], ["detail", "Chi tiết"], ["material", "Vật liệu"], ["dimension", "Kích thước"], ["real_project", "Ảnh thực tế"], ["catalog", "Catalogue"]];

  function clean(value) {
    return value == null ? "" : String(value).trim();
  }

  function escapeHtml(value) {
    return clean(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function routeProductSlug(product) {
    return routing.productSlug ? routing.productSlug(product) : adapter.slugify(`${product.code}-${product.name}`);
  }

  function routeProductUrl(product) {
    return routing.productUrl ? routing.productUrl(product) : `product-detail.html?slug=${encodeURIComponent(routeProductSlug(product))}&code=${encodeURIComponent(product.code)}`;
  }

  function routeCategoryUrl(categoryId) {
    return routing.categoryUrl ? routing.categoryUrl(categoryId || "OFFICE_CHAIR") : "category.html";
  }

  function setCanonical(path) {
    if (routing.setCanonical) return routing.setCanonical(path);
    return path;
  }

  function materialBucket(product) {
    const text = `${product.name} ${product.meta?.material || ""} ${product.subCategory || ""}`.toLowerCase();
    if (/lưới|luoi|mesh/.test(text)) return "mesh";
    if (/da|leather|pvc/.test(text)) return "leather";
    if (/training|đào tạo|dao tao/.test(text)) return "training";
    return "standard";
  }

  function sizeBucket(product) {
    const text = `${product.name} ${product.meta?.size || ""}`.toLowerCase();
    if (/cao|high/.test(text)) return "high";
    if (/gấp|gap|compact|module/.test(text)) return "compact";
    return "standard";
  }

  function buildImages(product) {
    const primary = product.image?.src || "";
    return imageLabels.map(([type, label], index) => ({
      type,
      label,
      src: index === 0 ? primary : "",
      alt: `${product.name || "Sản phẩm BA_Furniture"} - ${label}`
    }));
  }

  const products = rows.map((row) => {
    const product = adapter.normalizeProductRow(row);
    if (!product.ok) return null;
    product.images = buildImages(product);
    product.raw = row;
    product.routeSlug = routeProductSlug(product);
    product.detailUrl = routeProductUrl(product);
    product.legacyDetailUrl = routing.legacyProductUrl ? routing.legacyProductUrl(product) : product.detailUrl;
    return product;
  }).filter(Boolean);

  const stats = products.reduce((acc, product) => {
    acc.outputCount += 1;
    acc.categoryCoverage[product.mainCategory] = (acc.categoryCoverage[product.mainCategory] || 0) + 1;
    product.flags.forEach((flag) => {
      acc.flagCounts[flag] = (acc.flagCounts[flag] || 0) + 1;
    });
    return acc;
  }, { sourceTotal: meta.sourceTotal || rows.length, bundledCount: rows.length, outputCount: 0, rejectedCount: rows.length - products.length, flagCounts: {}, categoryCoverage: {} });

  function placeholder(label) {
    return `<div class="product-card__image category-template-product-card__image" aria-hidden="true"><span>${escapeHtml(label || "Ảnh")}</span></div>`;
  }

  function productImage(product) {
    if (!product.image?.src) return placeholder("Đang cập nhật ảnh");
    return `<div class="product-card__image category-template-product-card__image product-card__image--photo"><img src="${escapeHtml(product.image.src)}" alt="${escapeHtml(product.image.alt)}" loading="lazy" decoding="async" /></div>`;
  }

  function card(product) {
    const metaLine = [product.category, product.subCategory, product.meta?.material].filter(Boolean).join(" / ");
    return `
      <article class="product-card category-template-product-card" data-product-code="${escapeHtml(product.code)}" data-product-slug="${escapeHtml(product.routeSlug)}" data-category="${escapeHtml(product.mainCategory)}" data-subcategory="${escapeHtml(product.subCategory)}" data-material="${materialBucket(product)}" data-size="${sizeBucket(product)}" data-price-state="${product.price?.amount ? "priced" : "contact"}" data-search-text="${escapeHtml(`${product.name} ${product.code} ${metaLine}`.toLowerCase())}">
        ${productImage(product)}
        <div class="product-card__body">
          <p class="product-card__code">Mã: ${escapeHtml(product.code)}</p>
          <h3>${escapeHtml(product.name)}</h3>
          <p class="category-template-product-card__meta">${escapeHtml(metaLine || "Nội thất BA_Furniture")}</p>
          <p class="product-card__price">${escapeHtml(product.price?.label || "Liên hệ báo giá")}</p>
          <p class="product-card__source">ProductDB static bundle</p>
          <a class="product-card__cta" href="${escapeHtml(product.detailUrl)}">Xem chi tiết</a>
        </div>
      </article>
    `;
  }

  function applyImageFallback(scope) {
    scope.querySelectorAll(".product-card__image--photo img").forEach((img) => {
      img.addEventListener("error", () => {
        const fallback = document.createElement("div");
        fallback.innerHTML = placeholder("Đang cập nhật ảnh");
        img.closest(".product-card__image")?.replaceWith(fallback.firstElementChild);
      }, { once: true });
    });
  }

  function renderCategory() {
    const page = document.querySelector(".category-template-page");
    const container = page?.querySelector(".category-template-products");
    const layout = page?.querySelector(".category-template-layout");
    if (!page || !container || !layout) return;

    const categoryProducts = products.filter((product) => product.mainCategory === "OFFICE_CHAIR").slice(0, 12);
    if (!categoryProducts.length) return;

    setCanonical(routeCategoryUrl("OFFICE_CHAIR"));
    const categoryLink = page.querySelector('.category-template-breadcrumb a[href*="category"], .category-template-breadcrumb a[href*="products"]');
    if (categoryLink) categoryLink.href = routeCategoryUrl("OFFICE_CHAIR");

    const head = page.querySelector(".category-template-section__head");
    if (head) {
      head.querySelector(".section-label") && (head.querySelector(".section-label").textContent = "ProductDB Static Bundle");
      head.querySelector("h2") && (head.querySelector("h2").textContent = "Sản phẩm ghế văn phòng từ ProductDB");
      head.querySelector("p") && (head.querySelector("p").textContent = "Danh sách đang dùng dữ liệu thật đã normalize qua Product Card contract. Bundle này là bản static chỉ đọc, chưa ghi hoặc sửa ProductDB.");
    }

    const heroStats = page.querySelector(".category-template-stats");
    if (heroStats) {
      heroStats.innerHTML = `<span><strong>${categoryProducts.length}</strong> sản phẩm ghế</span><span><strong>${rows.length}</strong> dòng bundle</span><span><strong>${stats.sourceTotal}</strong> dòng nguồn</span>`;
    }

    let status = page.querySelector(".ba-productdb-status");
    if (!status) {
      status = document.createElement("div");
      status.className = "ba-productdb-status";
      layout.parentNode.insertBefore(status, layout);
    }
    status.innerHTML = `<span><strong>${categoryProducts.length}</strong> card ghế văn phòng đang render từ ProductDB bundle.</span><span>URL danh mục: ${escapeHtml(routeCategoryUrl("OFFICE_CHAIR"))}</span>`;

    container.innerHTML = categoryProducts.map(card).join("");
    container.setAttribute("aria-label", "Danh sách sản phẩm ghế văn phòng từ ProductDB bundle");
    applyImageFallback(container);
    page.dataset.productdbRendered = "true";
  }

  function findProduct() {
    const route = routing.parseProductRoute ? routing.parseProductRoute() : {};
    const params = new URLSearchParams(window.location.search);
    const code = clean(route.code || params.get("code"));
    const slug = clean(route.slug || params.get("slug"));
    return products.find((product) => product.code.toLowerCase() === code.toLowerCase()) ||
      products.find((product) => product.routeSlug === slug || adapter.slugify(`${product.code}-${product.name}`) === slug) ||
      products[0];
  }

  function setText(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function renderDetail() {
    const page = document.querySelector(".product-detail-page");
    if (!page || !products.length) return;
    const product = findProduct();
    window.BA_CURRENT_PRODUCT = product;
    setCanonical(product.detailUrl);

    document.title = `${product.name} | BA_Furniture`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", `${product.name} ${product.code} tại BA_Furniture. Xem thông số, chất liệu, kích thước và nhận báo giá theo số lượng.`);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", `${product.name} | BA_Furniture`);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", `${product.code} - ${product.category}. Liên hệ BA_Furniture để nhận báo giá.`);

    setText("#product-title", product.name);
    const label = page.querySelector(".product-summary .section-label");
    if (label) label.textContent = "ProductDB Static Bundle";
    const breadcrumbLast = page.querySelector(".product-detail-breadcrumb span:last-child");
    if (breadcrumbLast) breadcrumbLast.textContent = product.name;
    const breadcrumbCategory = page.querySelector(".product-detail-breadcrumb a[href='category.html']");
    if (breadcrumbCategory) {
      breadcrumbCategory.textContent = product.category;
      breadcrumbCategory.href = routeCategoryUrl(product.mainCategory);
    }

    const metaBox = page.querySelector(".product-summary__meta");
    if (metaBox) metaBox.innerHTML = `<span>Mã: ${escapeHtml(product.code)}</span><span>Danh mục: ${escapeHtml(product.category)}</span><span>Nhóm: ${escapeHtml(product.subCategory || "Đang cập nhật")}</span>`;

    const desc = page.querySelector(".product-summary__description");
    if (desc) desc.textContent = product.description || `${product.name} thuộc nhóm ${product.category}. BA_Furniture tư vấn cấu hình, chất liệu, kích thước và báo giá theo số lượng/dự án.`;
    const price = page.querySelector(".product-summary__price strong");
    if (price) price.textContent = product.price?.label || "Liên hệ báo giá";

    const table = page.querySelector(".product-spec-table tbody");
    if (table) table.innerHTML = `<tr><th scope="row">Mã sản phẩm</th><td>${escapeHtml(product.code)}</td></tr><tr><th scope="row">Tên sản phẩm</th><td>${escapeHtml(product.name)}</td></tr><tr><th scope="row">Danh mục</th><td>${escapeHtml(product.category)}${product.subCategory ? ` / ${escapeHtml(product.subCategory)}` : ""}</td></tr><tr><th scope="row">Kích thước</th><td>${escapeHtml(product.meta?.size || "Đang cập nhật")}</td></tr><tr><th scope="row">Chất liệu</th><td>${escapeHtml(product.meta?.material || "Đang cập nhật")}</td></tr><tr><th scope="row">Tình trạng giá</th><td>${escapeHtml(product.price?.label || "Liên hệ báo giá")}</td></tr>`;

    const infoCards = page.querySelectorAll(".product-info-card p");
    if (infoCards[0]) infoCards[0].textContent = product.meta?.material || "Chất liệu đang cập nhật theo ProductDB.";
    if (infoCards[1]) infoCards[1].textContent = product.meta?.size || "Kích thước đang cập nhật theo ProductDB.";

    const related = products.filter((item) => item.code !== product.code && item.mainCategory === product.mainCategory).slice(0, 4);
    const relatedGrid = page.querySelector(".product-related-grid");
    if (relatedGrid && related.length) {
      relatedGrid.innerHTML = related.map(card).join("");
      applyImageFallback(relatedGrid);
    }

    const quote = page.querySelector("#product-quote h2");
    if (quote) quote.textContent = `Cần báo giá ${product.name}?`;
    const mail = page.querySelector('#product-quote a[href^="mailto:"]');
    if (mail) mail.href = `mailto:contact@bafurni.com?subject=${encodeURIComponent(`Yeu cau bao gia ${product.code}`)}`;
    page.dataset.productdbRendered = product.code;
    page.dataset.productRoute = product.detailUrl;
  }

  renderCategory();
  renderDetail();
  routing.updateCategoryAnchors?.();

  window.BA_PRODUCTS = products;
  window.BA_PRODUCTDB_STATS = stats;
  window.BAProductDBIntegration = { products, stats, renderCategory, renderDetail };
  window.BA_PRODUCTDB_READY = true;
  document.documentElement.dataset.productdbIntegration = `ready:${products.length}`;
})();
