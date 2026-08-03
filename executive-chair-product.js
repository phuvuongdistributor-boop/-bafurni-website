(() => {
  const products = Array.isArray(window.BA_V10_EXECUTIVE_CHAIRS) ? window.BA_V10_EXECUTIVE_CHAIRS : [];
  const root = document.querySelector("[data-product-detail]");
  const relatedRoot = document.querySelector("[data-related-products]");
  if (!root) return;

  const cleanCode = (value) => String(value || "").trim().toUpperCase();
  const params = new URLSearchParams(window.location.search);
  const pathCode = window.location.pathname.split("/").filter(Boolean).at(-1);
  const code = cleanCode(params.get("code") || pathCode);
  const product = products.find((item) => item.code === code);
  const escapeHtml = (value) => String(value == null ? "" : value).replace(/[&<>\"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
  }[character]));
  const price = (value) => new Intl.NumberFormat("vi-VN").format(value) + " ₫";

  if (!product) {
    root.innerHTML = `<div class="v10-wrap v10-product-error"><p class="v10-kicker">Không tìm thấy mã</p><h1>Sản phẩm chưa có trong package.</h1><a href="/danh-muc/ghe-giam-doc">Quay lại 8 mẫu ghế giám đốc</a></div>`;
    document.querySelector(".v10-related")?.remove();
    return;
  }

  document.body.dataset.productCode = product.code;
  document.body.dataset.productName = product.name;
  document.querySelector("[data-product-code-label]").textContent = product.code;
  document.title = `${product.name} | BA_Furniture`;
  document.querySelector('meta[name="description"]').content = product.summary;
  document.querySelector("[data-product-canonical]").href = `https://bafurni.com${product.detailUrl}`;
  document.querySelector("[data-product-og-title]").content = `${product.name} | BA_Furniture`;
  document.querySelector("[data-product-og-description]").content = product.summary;
  document.querySelector("[data-product-og-image]").content = new URL(product.image, "https://bafurni.com").href;

  const gallery = Array.isArray(product.gallery) && product.gallery.length ? product.gallery : [product.image];
  root.innerHTML = `
    <div class="v10-wrap v10-detail-grid">
      <div class="v10-gallery">
        <div class="v10-gallery-stage"><img src="${escapeHtml(gallery[0])}" alt="${escapeHtml(product.name)}" width="${product.imageWidth}" height="${product.imageHeight}" data-gallery-stage /></div>
        <div class="v10-gallery-thumbs" aria-label="Ảnh sản phẩm">
          ${gallery.map((image, index) => `<button class="v10-gallery-thumb" type="button" data-gallery-image="${escapeHtml(image)}" aria-label="Xem ảnh ${index + 1} của ${escapeHtml(product.code)}" aria-current="${index === 0}"><img src="${escapeHtml(image)}" alt="" width="84" height="84" /></button>`).join("")}
        </div>
        <p class="v10-gallery-note">${product.verifiedGalleryCount} ảnh đúng mã đã xác minh. Không dùng ảnh minh họa từ sản phẩm khác.</p>
      </div>
      <div class="v10-detail-copy">
        <p class="v10-kicker">The One · ${escapeHtml(product.code)}</p>
        <h1>${escapeHtml(product.name)}</h1>
        <p class="v10-detail-intro">${escapeHtml(product.description)}</p>
        <p class="v10-detail-price"><span>Giá tham khảo từ ProductDB</span><strong>${price(product.price)}</strong></p>
        <dl class="v10-detail-facts">
          <div><dt>Kích thước</dt><dd>${escapeHtml(product.size)}</dd></div>
          <div><dt>Chất liệu</dt><dd>${escapeHtml(product.material)}</dd></div>
          <div><dt>Công năng</dt><dd>${product.features.map(escapeHtml).join(" · ")}</dd></div>
          <div><dt>Bảo hành</dt><dd>${escapeHtml(product.warranty)}</dd></div>
          <div><dt>Nguồn</dt><dd><a href="${escapeHtml(product.sourceUrl)}" rel="nofollow noopener" target="_blank">The One · ${escapeHtml(product.code)}</a></dd></div>
        </dl>
        <div class="v10-detail-actions"><button type="button" data-open-wizard>Nhận báo giá ${escapeHtml(product.code)}</button><a href="tel:0929878666">Gọi 0929.878.666</a></div>
      </div>
      <div class="v10-detail-sections">
        <article><p class="v10-kicker">Ứng dụng</p><h2>Phù hợp khi</h2><p>${escapeHtml(product.application)}</p></article>
        <article><p class="v10-kicker">Điểm mạnh</p><h2>Lý do cân nhắc</h2><p>${escapeHtml(product.strength)}</p></article>
        <article><p class="v10-kicker">Lưu ý chọn</p><h2>Cần xác nhận</h2><p>${escapeHtml(product.limitation)}</p></article>
      </div>
    </div>`;

  root.querySelectorAll("[data-gallery-image]").forEach((button) => {
    button.addEventListener("click", () => {
      root.querySelector("[data-gallery-stage]").src = button.dataset.galleryImage;
      root.querySelectorAll("[data-gallery-image]").forEach((item) => item.setAttribute("aria-current", String(item === button)));
    });
  });

  const related = product.relatedCodes.map((relatedCode) => products.find((item) => item.code === relatedCode)).filter(Boolean);
  if (relatedRoot) relatedRoot.innerHTML = related.map((item) => `
    <a class="v10-related-card" href="${escapeHtml(item.detailUrl)}">
      <figure><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" width="${item.imageWidth}" height="${item.imageHeight}" loading="lazy" /></figure>
      <div><span>The One · ${escapeHtml(item.code)}</span><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.size)}<br />${price(item.price)}</p></div>
    </a>`).join("");

  const schema = document.createElement("script");
  schema.type = "application/ld+json";
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.code,
    brand: { "@type": "Brand", name: product.sourceBrand },
    image: gallery.map((image) => new URL(image, window.location.origin).href),
    description: product.description,
    material: product.material,
    size: product.size,
    category: "Ghế giám đốc"
  });
  document.head.append(schema);

  window.BA_V10_02_PRODUCT_QA = {
    code: product.code,
    dataSource: "ProductDB + verified The One source",
    galleryCount: gallery.length,
    relatedCodes: related.map((item) => item.code),
    brokenImages: () => [...document.images].filter((image) => image.complete && image.naturalWidth === 0).length
  };
})();
