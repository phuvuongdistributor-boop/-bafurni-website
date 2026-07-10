(function () {
  if (window.BACategoryPageEngine) return;

  const page = document.querySelector(".category-template-page");
  if (!page) return;

  const library = Array.isArray(window.BA_CATEGORY_LIBRARY) ? window.BA_CATEGORY_LIBRARY : [];
  const routing = window.BARouting || {};
  const products = Array.isArray(window.BA_PRODUCTS) ? window.BA_PRODUCTS : [];
  const visuals = window.BACategoryVisualLibrary || {};
  const placeholder = "/images/categories/placeholders/category-placeholder.svg";

  function clean(value) {
    return value == null ? "" : String(value).trim();
  }

  function escapeHtml(value) {
    return clean(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function slugify(value) {
    if (routing.slugify) return routing.slugify(value);
    return clean(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "noi-that";
  }

  function iconType(iconId) {
    const id = clean(iconId).toLowerCase();
    if (id.includes("chair")) return "chair";
    if (id.includes("desk")) return "desk";
    if (id.includes("meeting") || id.includes("table") || id.includes("canteen")) return "table";
    if (id.includes("locker")) return "locker";
    if (id.includes("cabinet") || id.includes("pedestal") || id.includes("wardrobe")) return "cabinet";
    if (id.includes("sofa") || id.includes("waiting")) return "sofa";
    if (id.includes("school") || id.includes("student") || id.includes("teacher") || id.includes("library")) return "school";
    if (id.includes("shel") || id.includes("rack") || id.includes("archive")) return "shelves";
    if (id.includes("medical") || id.includes("clinic")) return "medical";
    if (id.includes("home") || id.includes("bed")) return "home";
    if (id.includes("partition") || id.includes("accessory")) return "panel";
    return "building";
  }

  const paths = {
    chair: '<path d="M8 4h8l1 9H7L8 4Z"/><path d="M9 13v3h6v-3"/><path d="M12 16v4"/><path d="M8 20h8"/>',
    desk: '<path d="M4 9h16"/><path d="M6 9v10"/><path d="M18 9v10"/><path d="M8 14h8"/>',
    table: '<path d="M4 10h16"/><path d="M7 10v8"/><path d="M17 10v8"/><path d="M8 6h8"/>',
    cabinet: '<path d="M6 4h12v16H6V4Z"/><path d="M6 10h12"/><path d="M6 15h12"/><path d="M11 7h2"/><path d="M11 13h2"/>',
    locker: '<path d="M5 4h14v16H5V4Z"/><path d="M12 4v16"/><path d="M8 8h1"/><path d="M15 8h1"/><path d="M8 14h1"/><path d="M15 14h1"/>',
    sofa: '<path d="M6 11V8a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3"/><path d="M4 11h16v6H4v-6Z"/><path d="M6 17v2"/><path d="M18 17v2"/>',
    school: '<path d="M5 6h14v8H5V6Z"/><path d="M8 18h8"/><path d="M12 14v4"/><path d="M7 10h10"/>',
    shelves: '<path d="M5 5h14"/><path d="M5 12h14"/><path d="M5 19h14"/><path d="M7 5v14"/><path d="M17 5v14"/>',
    building: '<path d="M5 20V6l7-3 7 3v14"/><path d="M9 20v-6h6v6"/><path d="M9 8h.01"/><path d="M15 8h.01"/><path d="M12 11h.01"/>',
    medical: '<path d="M12 4v16"/><path d="M4 12h16"/><path d="M6 6h12v12H6V6Z"/>',
    home: '<path d="M4 11 12 4l8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-6h4v6"/>',
    panel: '<path d="M4 5h16v14H4V5Z"/><path d="M10 5v14"/><path d="M14 9h4"/><path d="M14 13h4"/>'
  };

  function iconSvg(iconId) {
    return `<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">${paths[iconType(iconId)]}</svg>`;
  }

  function categoryUrl(category, subcategory) {
    if (routing.categoryUrl) return routing.categoryUrl(category, subcategory);
    const base = `/danh-muc/${slugify(category?.name || "ghe-van-phong")}`;
    return subcategory ? `${base}/${slugify(subcategory[1])}` : base;
  }

  function route() {
    return routing.parseCategoryRoute ? routing.parseCategoryRoute() : { categorySlug: "ghe-van-phong", subcategorySlug: "" };
  }

  function findCategory() {
    const current = route();
    return library.find((item) => slugify(item.name) === current.categorySlug || clean(item.id).toLowerCase() === current.categorySlug) || library[0];
  }

  function findSubcategory(category) {
    const subSlug = route().subcategorySlug;
    if (!subSlug) return null;
    return (category?.subcategories || []).find(([id, name]) => slugify(name) === subSlug || clean(id).toLowerCase() === subSlug) || null;
  }

  function subItems(category) {
    return (category?.subcategories || []).map(([id, name, icon, image]) => ({ id, name, icon, image }));
  }

  function subMatches(product, subcategory) {
    if (!subcategory) return true;
    const target = `${clean(subcategory[0])} ${clean(subcategory[1])}`.toLowerCase();
    const source = `${clean(product.subCategory)} ${clean(product.name)} ${clean(product.category)}`.toLowerCase();
    return target.split(/\s+/).some((part) => part.length > 3 && source.includes(part)) || source.includes(clean(subcategory[0]).toLowerCase());
  }

  function categoryProducts(category, subcategory) {
    return products.filter((product) => product.mainCategory === category.id && subMatches(product, subcategory)).slice(0, 12);
  }

  function imageHtml(src, alt) {
    if (!src) return "";
    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" width="800" height="600" />`;
  }

  function productImage(product) {
    if (product?.image?.src) return `<div class="product-card__image category-template-product-card__image product-card__image--photo"><img src="${escapeHtml(product.image.src)}" alt="${escapeHtml(product.image.alt || product.name)}" loading="lazy" decoding="async" /></div>`;
    return `<div class="product-card__image category-template-product-card__image" aria-hidden="true"><span>Đang cập nhật ảnh</span></div>`;
  }

  function productCard(product) {
    const meta = [product.category, product.subCategory, product.meta?.material].filter(Boolean).join(" / ");
    return `
      <article class="product-card category-template-product-card" data-product-code="${escapeHtml(product.code)}" data-product-slug="${escapeHtml(product.routeSlug || "")}" data-category="${escapeHtml(product.mainCategory)}" data-subcategory="${escapeHtml(product.subCategory)}" data-price-state="${product.price?.amount ? "priced" : "contact"}" data-search-text="${escapeHtml(`${product.name} ${product.code} ${meta}`.toLowerCase())}">
        ${productImage(product)}
        <div class="product-card__body">
          <p class="product-card__code">Mã: ${escapeHtml(product.code)}</p>
          <h3>${escapeHtml(product.name)}</h3>
          <p class="category-template-product-card__meta">${escapeHtml(meta || "Nội thất BA_Furniture")}</p>
          <p class="product-card__price">${escapeHtml(product.price?.label || "Liên hệ báo giá")}</p>
          <a class="product-card__cta" href="${escapeHtml(product.detailUrl || "/product-detail.html")}">Xem chi tiết</a>
        </div>
      </article>`;
  }

  function shellCard(item, category) {
    return `
      <article class="product-card category-template-product-card category-shell-card" data-category="${escapeHtml(category.id)}" data-subcategory="${escapeHtml(item.id)}" data-price-state="contact" data-search-text="${escapeHtml(`${item.name} ${category.name}`.toLowerCase())}">
        <div class="product-card__image category-template-product-card__image category-shell-card__visual" aria-hidden="true">${item.image ? imageHtml(item.image, item.name) : iconSvg(item.icon)}</div>
        <div class="product-card__body">
          <p class="product-card__code">Dòng danh mục</p>
          <h3>${escapeHtml(item.name)}</h3>
          <p class="category-template-product-card__meta">${escapeHtml(category.name)} / tư vấn theo cấu hình</p>
          <p class="product-card__price">Liên hệ báo giá</p>
          <a class="product-card__cta" href="#category-contact">Nhận báo giá</a>
        </div>
      </article>`;
  }

  function setMeta(selector, attr, value) {
    let node = document.querySelector(selector);
    if (!node) {
      node = document.createElement("meta");
      const match = selector.match(/meta\[(name|property)=\"([^\"]+)\"\]/);
      if (match) node.setAttribute(match[1], match[2]);
      document.head.appendChild(node);
    }
    node.setAttribute(attr, value);
  }

  function setSeo(category, subcategory) {
    const path = categoryUrl(category, subcategory || undefined);
    const titleName = subcategory ? `${subcategory[1]} | ${category.name}` : category.name;
    const title = `${titleName} BA_Furniture | Danh mục nội thất văn phòng và dự án`;
    const description = `${titleName} tại BA_Furniture. ${category.description} Tư vấn kích thước, chất liệu, màu sắc và báo giá theo số lượng tại Nam Định, Hà Nam, Ninh Bình, Hưng Yên, Thái Bình.`;
    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[name="robots"]', "content", "index, follow, max-image-preview:large");
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    if (routing.setCanonical) routing.setCanonical(path);
  }

  function render(category, subcategory) {
    const subcategories = subItems(category);
    const activeProducts = categoryProducts(category, subcategory);
    const cards = activeProducts.length ? activeProducts.map(productCard) : (subcategory ? [{ id: subcategory[0], name: subcategory[1], icon: subcategory[2], image: subcategory[3] }] : subcategories.slice(0, 8)).map((item) => shellCard(item, category));
    const related = library.filter((item) => item.id !== category.id).slice(0, 6);
    const visual = visuals.main?.[category.id] || { image: category.image || placeholder, alt: `${category.name} BA_Furniture` };
    const label = subcategory ? subcategory[1] : category.name;

    const main = page.querySelector("main");
    if (!main) return;

    main.innerHTML = `
      <section id="category-top" class="category-template-hero category-dynamic-hero">
        <nav class="category-template-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Trang chủ</a><span aria-hidden="true">/</span><a href="/#category-library">Danh mục</a><span aria-hidden="true">/</span><span>${escapeHtml(label)}</span>
        </nav>
        <div class="category-template-hero__grid">
          <div class="category-template-hero__content">
            <span class="section-label">Danh mục sản phẩm BAFurniture</span>
            <h1>${escapeHtml(label)}</h1>
            <p>${escapeHtml(category.description)}</p>
            <div class="category-template-stats" aria-label="Thông tin danh mục">
              <span><strong>${subcategories.length}</strong> nhóm nhỏ</span>
              <span><strong>${activeProducts.length || cards.length}</strong> ${activeProducts.length ? "sản phẩm" : "card shell"}</span>
              <span><strong>12</strong> nhóm chính</span>
            </div>
          </div>
          <div class="category-template-hero__visual has-category-image" aria-label="Visual ${escapeHtml(label)}">
            ${imageHtml(visual.image, visual.alt)}
            <span class="category-template-hero__icon" aria-hidden="true">${iconSvg(category.icon)}</span>
          </div>
        </div>
        <div class="category-template-chips" aria-label="Nhóm nhỏ ${escapeHtml(category.name)}">
          ${subcategories.map((item) => `<a href="${escapeHtml(categoryUrl(category, [item.id, item.name, item.icon, item.image]))}#category-listing" ${subcategory && item.id === subcategory[0] ? 'aria-current="page"' : ""}>${escapeHtml(item.name)}</a>`).join("")}
        </div>
        <div id="category-subgroups" class="category-subgroup-panel category-template-subcategory-visual" aria-labelledby="category-subgroup-visual-title">
          <div class="category-subgroup-panel__head">
            <span class="section-label">Subcategory Visual</span>
            <h2 id="category-subgroup-visual-title">Nhóm nhỏ trong ${escapeHtml(category.name)}</h2>
            <p>Icon và visual đồng bộ giúp khách hàng scan nhanh trước khi xem danh sách sản phẩm hoặc gửi yêu cầu báo giá.</p>
          </div>
          <div class="category-subgroup-grid" aria-label="Nhóm nhỏ ${escapeHtml(category.name)}">
            ${subcategories.map((item) => `<a class="category-subgroup-card" href="${escapeHtml(categoryUrl(category, [item.id, item.name, item.icon, item.image]))}#category-listing" data-subcategory="${escapeHtml(item.id)}"><span class="category-subgroup-card__visual" aria-hidden="true">${item.image ? imageHtml(item.image, item.name) : imageHtml(visuals.sub?.[item.id] || placeholder, item.name)}</span><span class="category-subgroup-card__icon" aria-hidden="true">${iconSvg(item.icon)}</span><span class="category-subgroup-card__label">${escapeHtml(item.name)}</span></a>`).join("")}
          </div>
        </div>
      </section>
      <section id="category-listing" class="category-template-section">
        <div class="category-template-section__head">
          <span class="section-label">Danh sách sản phẩm</span>
          <h2>${escapeHtml(activeProducts.length ? `Sản phẩm ${label}` : `Khung sản phẩm ${label}`)}</h2>
          <p>${activeProducts.length ? "Danh sách đang đọc từ ProductDB static bundle đã chuẩn hóa, không ghi hoặc sửa ProductDB." : "Danh mục này đang có Product Grid Shell để giữ UI sẵn sàng trong khi dữ liệu được đồng bộ theo từng giai đoạn."}</p>
        </div>
        <div class="category-template-layout">
          <aside class="category-template-filter" aria-label="Bộ lọc danh mục">
            <div><h3>Nhóm nhỏ</h3>${subcategories.slice(0, 8).map((item) => `<a href="${escapeHtml(categoryUrl(category, [item.id, item.name, item.icon, item.image]))}#category-listing">${escapeHtml(item.name)}</a>`).join("")}</div>
            <div><h3>Tình trạng giá</h3><label><input type="checkbox" disabled /> Liên hệ báo giá</label><label><input type="checkbox" disabled /> Có giá tham khảo</label></div>
            <div><h3>Ứng dụng</h3><label><input type="checkbox" disabled /> Văn phòng</label><label><input type="checkbox" disabled /> Trường học / dự án</label></div>
          </aside>
          <div class="category-template-products" aria-label="Danh sách ${escapeHtml(label)}">${cards.join("")}</div>
        </div>
        <div class="category-template-empty" role="status" aria-live="polite">
          <span class="category-template-empty__icon" aria-hidden="true">${iconSvg(category.icon)}</span>
          <div><h3>Chưa có sản phẩm phù hợp trong bundle hiện tại</h3><p>BA_Furniture vẫn có thể tư vấn cấu hình, chất liệu, kích thước và sản xuất theo yêu cầu cho ${escapeHtml(label)}.</p></div>
          <a class="product-card__cta" href="#category-contact">Nhận tư vấn</a>
        </div>
      </section>
      <section class="category-related-section" aria-labelledby="category-related-title">
        <div class="category-template-section__head"><span class="section-label">Related Categories</span><h2 id="category-related-title">Danh mục liên quan</h2><p>Gợi ý các nhóm sản phẩm thường được mua kèm trong dự án văn phòng, trường học và nhà máy.</p></div>
        <div class="category-related-grid">${related.map((item) => `<a class="category-related-card" href="${escapeHtml(categoryUrl(item))}" data-main-category="${escapeHtml(item.id)}"><span aria-hidden="true">${iconSvg(item.icon)}</span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.description)}</small></a>`).join("")}</div>
      </section>
      <section id="category-contact" class="category-template-cta">
        <div><span class="section-label">Tư vấn danh mục</span><h2>Cần báo giá ${escapeHtml(label)} theo số lượng hoặc mặt bằng?</h2><p>Gửi nhu cầu, số lượng, khu vực giao hàng và yêu cầu riêng. BA_Furniture sẽ tư vấn phương án phù hợp.</p></div>
        <div class="category-template-cta__actions"><a class="btn btn-primary" href="tel:0929878666">Gọi 0929.878.666</a><a class="btn btn-secondary" href="https://portal.bafurni.com" target="_blank" rel="noopener">Vào Portal sản phẩm</a></div>
      </section>`;

    setSeo(category, subcategory);
    page.dataset.categoryEngineReady = "true";
    page.dataset.currentCategory = category.id;
    page.dataset.currentSubcategory = subcategory ? subcategory[0] : "";
    document.documentElement.dataset.categoryPageEngine = `ready:${category.id}`;
    routing.updateCategoryAnchors?.();
  }

  const currentCategory = findCategory();
  if (!currentCategory) return;
  render(currentCategory, findSubcategory(currentCategory));

  window.BACategoryPageEngine = {
    render,
    currentCategory,
    currentSubcategory: findSubcategory(currentCategory),
    version: "2026-07-10-s24"
  };
})();
