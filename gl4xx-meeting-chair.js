(() => {
  const products = Array.isArray(window.BA_GL4XX_MEETING_CHAIRS)
    ? window.BA_GL4XX_MEETING_CHAIRS
    : [];
  const grid = document.querySelector("[data-v10-product-grid]");
  if (!grid) return;

  const escapeHtml = (value) => String(value == null ? "" : value).replace(/[&<>\"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  }[character]));
  const price = (value) => Number.isFinite(Number(value))
    ? `${new Intl.NumberFormat("vi-VN").format(Number(value))} ₫`
    : "Liên hệ";

  grid.innerHTML = products.map((product) => `
    <article class="v10-product-card" data-product-code="${escapeHtml(product.code)}">
      <a class="v10-product-media" href="${escapeHtml(product.detailUrl)}" aria-label="Xem ${escapeHtml(product.name)}">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" width="${product.imageWidth}" height="${product.imageHeight}" loading="lazy" decoding="async" data-product-code="${escapeHtml(product.code)}" />
      </a>
      <div class="v10-product-body">
        <p class="v10-product-code">The One · ${escapeHtml(product.code)}</p>
        <h3><a href="${escapeHtml(product.detailUrl)}">${escapeHtml(product.name)}</a></h3>
        <p class="v10-product-summary">${escapeHtml(product.summary)}</p>
        ${product.isPlaceholder ? '<p class="v10-product-code">NO_CLEAN_EXACT · ảnh sạch đang cập nhật</p>' : ''}
        <p class="v10-product-price"><span>Giá tham khảo ProductDB</span><strong>${price(product.price)}</strong></p>
        <p class="v10-product-size">${escapeHtml(product.size)}</p>
        <ul>${(product.features || []).slice(0, 2).map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>
        <div class="v10-product-actions">
          <a href="${escapeHtml(product.detailUrl)}">Xem chi tiết</a>
          <button type="button" data-open-wizard data-quote-product-code="${escapeHtml(product.code)}" data-quote-product-name="${escapeHtml(product.name)}">Tư vấn mẫu này</button>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll("img[data-product-code]").forEach((image) => {
    image.addEventListener("error", () => {
      const placeholder = document.createElement("span");
      placeholder.className = "v10-image-placeholder";
      placeholder.textContent = `Đang cập nhật ảnh ${image.dataset.productCode}`;
      image.replaceWith(placeholder);
    }, { once: true });
  });

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-open-wizard]");
    if (!trigger) return;
    const context = {
      productCode: trigger.dataset.quoteProductCode || "",
      productName: trigger.dataset.quoteProductName || "",
      productCategory: "ghe-luoi-phong-hop",
      categoryName: "Ghế lưới phòng họp GL4xx The One"
    };
    document.body.dataset.productCode = context.productCode;
    document.body.dataset.productName = context.productName;
    if (window.BASiteShell?.setContext) window.BASiteShell.setContext(context);
  }, { capture: true });

  const schema = document.createElement("script");
  schema.type = "application/ld+json";
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ghế lưới phòng họp GL4xx The One",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: new URL(product.detailUrl, window.location.origin).href,
      name: product.name
    }))
  });
  document.head.append(schema);

  window.BA_GL4XX_MEETING_CHAIR_QA = {
    route: window.location.pathname,
    source: "THE ONE",
    category: "Office Chair",
    subcategory: "Ghế lưới phòng họp/hội thảo GL4xx",
    productCount: products.length,
    codes: products.map((product) => product.code),
    package: "PACKAGE_MESH_MEETING_GL4XX_THEONE",
    productDbMode: "read-only / unchanged",
    brokenImages: () => [...document.images].filter((image) => image.complete && image.naturalWidth === 0).length
  };
})();
