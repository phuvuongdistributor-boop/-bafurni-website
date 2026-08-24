(() => {
  const products = Array.isArray(window.BA_GL4XX_MEETING_CHAIRS)
    ? window.BA_GL4XX_MEETING_CHAIRS
    : [];
  const root = document.querySelector("[data-product-detail]");
  const relatedRoot = document.querySelector("[data-related-products]");
  if (!root) return;

  const cleanCode = (value) => String(value || "").trim().toUpperCase();
  const params = new URLSearchParams(window.location.search);
  const pathCode = window.location.pathname.split("/").filter(Boolean).at(-1);
  const code = cleanCode(params.get("code") || document.body.dataset.productCode || pathCode);
  const product = products.find((item) => item.code === code);
  const escapeHtml = (value) => String(value == null ? "" : value).replace(/[&<>\"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
  }[character]));
  const price = (value) => Number.isFinite(Number(value))
    ? `${new Intl.NumberFormat("vi-VN").format(Number(value))} ₫`
    : "Liên hệ";
  const robots = document.querySelector('meta[name="robots"]');
  const setRobots = (content) => {
    if (robots) robots.content = content;
  };
  const upsertSchema = (id, value) => {
    let node = document.getElementById(id);
    if (!node) {
      node = document.createElement("script");
      node.id = id;
      node.type = "application/ld+json";
      document.head.append(node);
    }
    node.textContent = JSON.stringify(value);
  };

  if (!product) {
    document.title = "Không tìm thấy sản phẩm GL4xx | BA_Furniture";
    setRobots("noindex, follow, max-image-preview:large");
    root.innerHTML = `<div class="v10-wrap v10-product-error"><p class="v10-kicker">Không tìm thấy mã</p><h1>Sản phẩm chưa có trong package.</h1><a href="/danh-muc/ghe-luoi-phong-hop">Quay lại 24 mẫu ghế lưới phòng họp</a></div>`;
    document.querySelector(".v10-related")?.remove();
    return;
  }

  setRobots("index, follow, max-image-preview:large");
  document.body.dataset.productCode = product.code;
  document.body.dataset.productName = product.name;
  document.querySelector("[data-product-code-label]").textContent = product.code;
  document.title = `${product.name} | BA_Furniture`;
  document.querySelector('meta[name="description"]').content = product.summary;
  let canonical = document.querySelector("link[rel='canonical']");
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = `https://bafurni.com${product.detailUrl}`;
  document.querySelector("[data-product-og-title]").content = `${product.name} | BA_Furniture`;
  document.querySelector("[data-product-og-description]").content = product.summary;
  document.querySelector("[data-product-og-image]").content = new URL(product.image, "https://bafurni.com").href;
  document.querySelector("[data-product-og-url]")?.setAttribute("content", canonical.href);

  const gallery = Array.isArray(product.gallery) && product.gallery.length ? product.gallery : [product.image];
  const galleryNote = product.isPlaceholder
    ? "Nguồn chưa có ảnh sạch đạt điều kiện public. BA_Furniture không dùng ảnh watermark, QR, logo nhà cung cấp hoặc ảnh mã khác."
    : `${gallery.length} ảnh đúng mã đã xác minh. Ảnh độ phân giải thấp được giữ nguyên kích thước tự nhiên; không dùng ảnh mã khác.`;
  const facts = [
    ["Kích thước", product.size],
    ["Chất liệu", product.material],
    ["Cấu tạo", (product.features || []).join(" · ")],
    ["Màu sắc", product.colors],
    ["Bảo hành", product.warranty],
    ["Tình trạng nguồn", product.availabilityNote]
  ].filter(([, value]) => value);

  const detailMarkup = `
    <div class="v10-wrap v10-detail-grid">
      <div class="v10-gallery">
        <div class="v10-gallery-stage"><img src="${escapeHtml(gallery[0])}" alt="${escapeHtml(product.name)}" width="${product.imageWidth}" height="${product.imageHeight}" data-gallery-stage /></div>
        <div class="v10-gallery-thumbs" aria-label="Ảnh sản phẩm">
          ${gallery.map((image, index) => `<button class="v10-gallery-thumb" type="button" data-gallery-image="${escapeHtml(image)}" aria-label="Xem ảnh ${index + 1} của ${escapeHtml(product.code)}" aria-current="${index === 0}"><img src="${escapeHtml(image)}" alt="" width="84" height="84" /></button>`).join("")}
        </div>
        <p class="v10-gallery-note">${escapeHtml(galleryNote)}</p>
      </div>
      <div class="v10-detail-copy">
        <p class="v10-kicker">The One · ${escapeHtml(product.code)}</p>
        <h1>${escapeHtml(product.name)}</h1>
        <p class="v10-detail-intro">${escapeHtml(product.description)}</p>
        <p class="v10-detail-price"><span>Giá tham khảo từ ProductDB</span><strong>${price(product.price)}</strong></p>
        <dl class="v10-detail-facts">
          ${facts.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}
          <div><dt>Nguồn</dt><dd><a href="${escapeHtml(product.sourceUrl)}" rel="nofollow noopener" target="_blank">The One · ${escapeHtml(product.code)}</a></dd></div>
        </dl>
        <div class="v10-detail-actions"><button type="button" data-open-wizard>Nhận báo giá ${escapeHtml(product.code)}</button><a href="tel:0929878666">Gọi 0929.878.666</a></div>
      </div>
      <div class="v10-detail-sections">
        <article><p class="v10-kicker">Ứng dụng</p><h2>Phù hợp khi</h2><p>${escapeHtml(product.application)}</p></article>
        <article><p class="v10-kicker">Điểm đáng cân nhắc</p><h2>Khác biệt chính</h2><p>${escapeHtml(product.strength)}</p></article>
        <article><p class="v10-kicker">Trước khi chốt</p><h2>Cần xác nhận</h2><p>${escapeHtml(product.limitation)}</p></article>
      </div>
    </div>`;
  const prerenderedIdentity = root.querySelector("h1")?.textContent?.trim() === product.name;
  const prerenderedGalleryCount = root.querySelectorAll("[data-gallery-image]").length;
  if (!prerenderedIdentity || prerenderedGalleryCount !== gallery.length) {
    root.innerHTML = detailMarkup;
  }

  root.querySelectorAll("[data-gallery-image]").forEach((button) => {
    button.addEventListener("click", () => {
      root.querySelector("[data-gallery-stage]").src = button.dataset.galleryImage;
      root.querySelectorAll("[data-gallery-image]").forEach((item) => item.setAttribute("aria-current", String(item === button)));
    });
  });

  const related = (product.relatedCodes || [])
    .map((relatedCode) => products.find((item) => item.code === relatedCode))
    .filter(Boolean);
  const relatedMarkup = related.map((item) => `
    <a class="v10-related-card" href="${escapeHtml(item.detailUrl)}">
      <figure><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" width="${item.imageWidth}" height="${item.imageHeight}" loading="lazy" /></figure>
      <div><span>The One · ${escapeHtml(item.code)}</span><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.size)}<br />${price(item.price)}</p></div>
    </a>`).join("");
  if (relatedRoot) {
    const prerenderedRelatedCodes = [...relatedRoot.querySelectorAll(":scope > a")]
      .map((link) => link.getAttribute("href")?.split("/").at(-1)?.toUpperCase() || "");
    const expectedRelatedCodes = related.map((item) => item.code);
    if (JSON.stringify(prerenderedRelatedCodes) !== JSON.stringify(expectedRelatedCodes)) {
      relatedRoot.innerHTML = relatedMarkup;
    }
  }

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-open-wizard]")) return;
    const context = {
      productCode: product.code,
      productName: product.name,
      productCategory: "ghe-luoi-phong-hop",
      categoryName: "Ghế lưới phòng họp GL4xx The One"
    };
    if (window.BASiteShell?.setContext) window.BASiteShell.setContext(context);
  }, { capture: true });

  const productUrl = `https://bafurni.com${product.detailUrl}`;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    url: productUrl,
    mainEntityOfPage: productUrl,
    name: product.name,
    sku: product.code,
    brand: { "@type": "Brand", name: product.sourceBrand },
    description: product.description,
    material: product.material,
    size: product.size,
    category: "Ghế lưới phòng họp"
  };
  if (!product.isPlaceholder) productSchema.image = gallery.map((image) => new URL(image, "https://bafurni.com").href);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${productUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://bafurni.com/" },
      { "@type": "ListItem", position: 2, name: "Ghế văn phòng", item: "https://bafurni.com/danh-muc/ghe-van-phong" },
      { "@type": "ListItem", position: 3, name: "Ghế lưới phòng họp", item: "https://bafurni.com/danh-muc/ghe-luoi-phong-hop" },
      { "@type": "ListItem", position: 4, name: product.name, item: productUrl }
    ]
  };
  upsertSchema("gl4xx-product-schema", productSchema);
  upsertSchema("gl4xx-product-breadcrumb-schema", breadcrumbSchema);

  window.BA_GL4XX_MEETING_PRODUCT_QA = {
    code: product.code,
    dataSource: "ProductDB + verified The One source",
    galleryCount: gallery.length,
    imageStatus: product.imageStatus,
    relatedCodes: related.map((item) => item.code),
    brokenImages: () => [...document.images].filter((image) => image.complete && image.naturalWidth === 0).length
  };
})();
