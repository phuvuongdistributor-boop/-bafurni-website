(function () {
  if (window.BAFurnitureV3Experience) return;

  const version = "2026-07-11-v3-experience";
  const hotline = "0929878666";
  const hotlineText = "0929.878.666";
  const portalUrl = "https://portal.bafurni.com";

  const categoryCards = [
    { id: "OFFICE_CHAIR", title: "Ghế văn phòng", href: "/danh-muc/ghe-van-phong", type: "chair", count: 12, desc: "Ghế giám đốc, ghế lưới, ghế xoay, ghế họp và ghế training cho văn phòng hiện đại." },
    { id: "OFFICE_DESK", title: "Bàn văn phòng", href: "/danh-muc/ban-van-phong", type: "desk", count: 8, desc: "Bàn nhân viên, bàn cụm, bàn quản lý, bàn máy tính và cấu hình theo mặt bằng." },
    { id: "MEETING_TABLE", title: "Bàn họp", href: "/danh-muc/ban-hop", type: "meeting", count: 5, desc: "Bàn họp nhỏ, lớn, oval, module và bàn hội trường cho doanh nghiệp." },
    { id: "CABINET_STORAGE", title: "Tủ & Hộc tài liệu", href: "/danh-muc/tu-hoc-tai-lieu", type: "cabinet", count: 7, desc: "Tủ hồ sơ, hộc di động, tủ tài liệu và giải pháp lưu trữ gọn cho văn phòng." },
    { id: "LOCKER_STEEL", title: "Tủ sắt", href: "/danh-muc/tu-sat-locker/tu-sat-van-phong", type: "cabinet", count: 3, desc: "Tủ sắt văn phòng, tủ quần áo, tủ công cụ và tủ gia công theo yêu cầu." },
    { id: "LOCKER_STEEL", title: "Locker", href: "/danh-muc/tu-sat-locker/tu-locker", type: "locker", count: 3, desc: "Locker nhân viên, locker điện thoại và giải pháp lưu trữ cho nhà máy, trường học, dự án." },
    { id: "SOFA_WAITING", title: "Sofa & Ghế chờ", href: "/danh-muc/sofa-ghe-cho", type: "sofa", count: 6, desc: "Sofa văn phòng, ghế chờ, ghế tiếp khách, sofa sảnh và bàn sofa." },
    { id: "SCHOOL_FURNITURE", title: "Nội thất trường học", href: "/danh-muc/noi-that-truong-hoc", type: "school", count: 7, desc: "Bàn ghế học sinh, giáo viên, thư viện, mầm non và phòng chức năng." },
    { id: "SHELVING_RACK", title: "Kệ & Giá kho", href: "/danh-muc/ke-gia-kho", type: "rack", count: 4, desc: "Kệ sắt, giá kho, kệ trưng bày và kệ lưu trữ hồ sơ cho vận hành." },
    { id: "OFFICE_DESK", title: "Bàn giám đốc", href: "/danh-muc/ban-van-phong/ban-giam-doc", type: "executive", count: 1, desc: "Bàn lãnh đạo, bàn quản trị và cấu hình phòng giám đốc theo không gian." },
    { id: "OFFICE_CHAIR", title: "Ghế lưới", href: "/danh-muc/ghe-van-phong/ghe-luoi", type: "mesh", count: 1, desc: "Ghế lưới làm việc, ghế xoay lưng lưới và lựa chọn công thái học cho đội ngũ." },
    { id: "OFFICE_CHAIR", title: "Ghế chân quỳ", href: "/danh-muc/ghe-van-phong/ghe-chan-quy", type: "visitor", count: 1, desc: "Ghế họp, ghế tiếp khách, ghế chân quỳ đồng bộ cho phòng họp và khu làm việc." }
  ];

  const solutions = [
    ["Văn phòng doanh nghiệp", "Bàn cụm, ghế làm việc, tủ hồ sơ và setup theo sơ đồ vận hành."],
    ["Phòng giám đốc", "Bàn lãnh đạo, ghế giám đốc, tủ tài liệu và sofa tiếp khách đồng bộ."],
    ["Phòng họp", "Bàn họp, ghế họp, tủ phụ và cấu hình theo số người sử dụng."],
    ["Trường học", "Bàn ghế học sinh, giáo viên, thư viện, mầm non và phòng chức năng."],
    ["Nhà máy / KCN", "Locker, bàn ghế ăn công nghiệp, tủ công cụ và khu hành chính nhà máy."],
    ["Kho / lưu trữ", "Kệ kho, tủ sắt, hộc tài liệu và giải pháp lưu trữ theo tải trọng." ]
  ];

  function clean(value) { return value == null ? "" : String(value).trim(); }
  function esc(value) {
    return clean(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }
  function slug(value) {
    if (window.BARouting?.slugify) return window.BARouting.slugify(value);
    return clean(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function productUrl(product) {
    if (window.BARouting?.productUrl) return window.BARouting.productUrl(product);
    return product?.detailUrl || `/product-detail.html?code=${encodeURIComponent(product?.code || "")}`;
  }
  function quoteTarget() {
    if (document.querySelector("#product-quote")) return "#product-quote";
    if (document.querySelector("#category-contact")) return "#category-contact";
    if (document.querySelector("#contact")) return "#contact";
    return `mailto:contact@bafurni.com?subject=${encodeURIComponent("Yêu cầu báo giá BA_Furniture")}`;
  }

  function composite(name, type) {
    return `<span class="v3-composite v3-composite--${esc(type)}" role="img" aria-label="Ảnh nhóm ${esc(name)} gồm nhiều sản phẩm nội thất">
      <span class="v3-composite__brand">BA_Furniture</span>
      <strong>${esc(name)}</strong>
      <span class="v3-composite__scene" aria-hidden="true">
        <span class="v3-composite__item v3-composite__item--one"><i></i></span>
        <span class="v3-composite__item v3-composite__item--two"><i></i></span>
        <span class="v3-composite__item v3-composite__item--three"><i></i></span>
        <span class="v3-composite__item v3-composite__item--four"><i></i></span>
      </span>
    </span>`;
  }

  function patchHeader() {
    const header = document.querySelector(".s31-site-header, .site-header");
    if (!header || header.dataset.v3Header === "ready") return;
    header.dataset.v3Header = "ready";
    header.classList.add("v3-commerce-header");

    const topbar = document.querySelector(".s31-topbar, .topbar");
    if (topbar) {
      topbar.innerHTML = `<p>Khách hàng ở đâu, BA_Furniture tư vấn và cung ứng ở đó</p><div class="s31-topbar__links"><a href="/danh-muc/ghe-van-phong">Sản phẩm</a><a href="/#solutions">Dự án</a><a href="/#contact">Liên hệ</a><a href="tel:${hotline}">Gọi ${hotlineText}</a></div>`;
    }

    const form = header.querySelector("form.s31-header__search, form.site-header__search");
    if (form) {
      form.action = "/danh-muc/ghe-van-phong";
      const input = form.querySelector("input[type='search']");
      if (input) {
        input.name = "q";
        input.placeholder = "Tìm ghế lưới, bàn giám đốc, tủ locker...";
        input.setAttribute("aria-label", "Tìm sản phẩm BA_Furniture");
      }
    }

    const actions = header.querySelector(".s31-header__actions, .site-header__actions");
    if (actions && !actions.querySelector(".v3-header-quote")) {
      const quote = document.createElement("a");
      quote.className = "v3-header-quote";
      quote.href = quoteTarget();
      quote.textContent = "Nhận báo giá";
      const portal = actions.querySelector(".s31-header__portal-button, .site-header__portal-link");
      actions.insertBefore(quote, portal || actions.firstChild);
    }
  }

  function renderCategoryCards() {
    const section = document.querySelector("#category-library");
    const grid = section?.querySelector(".category-group-grid");
    if (!section || !grid || grid.dataset.v3Categories === "ready") return;
    grid.dataset.v3Categories = "ready";
    grid.innerHTML = categoryCards.map((item) => `
      <a class="category-group-card v3-category-card" data-main-category="${esc(item.id)}" href="${esc(item.href)}" aria-label="Xem ${esc(item.title)}">
        <span class="category-group-card__media v3-category-card__media" data-s31-composite="ready">${composite(item.title, item.type)}</span>
        <span class="category-group-card__body v3-category-card__body">
          <span class="v3-category-card__meta">${item.count} nhóm nhỏ</span>
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.desc)}</p>
          <span class="v3-card-link">Xem danh mục</span>
        </span>
      </a>`).join("");

    const hero = section.querySelector(".category-home-hero");
    if (hero) {
      hero.href = "/danh-muc/ghe-van-phong";
      const icon = hero.querySelector(".category-home-hero__icon, .category-home-hero__visual");
      if (icon) {
        icon.className = "category-home-hero__visual v3-category-hero-visual";
        icon.innerHTML = composite("Ghế văn phòng", "chair");
      }
    }
  }

  function renderFeaturedProducts() {
    if (!document.body.contains(document.querySelector("#home")) || document.querySelector("#v3-featured-products")) return;
    const products = Array.isArray(window.BA_PRODUCTS) ? window.BA_PRODUCTS.filter((item) => item && !/^DEMO-/i.test(item.code || "")) : [];
    if (!products.length) return;
    const withImages = products.filter((item) => item.image?.src).slice(0, 8);
    const chosen = (withImages.length >= 4 ? withImages : products).slice(0, 8);
    const section = document.createElement("section");
    section.id = "v3-featured-products";
    section.className = "section v3-featured-products";
    section.innerHTML = `<div class="section-head"><span class="section-label">Sản phẩm nổi bật</span><h2>Sản phẩm BA_Furniture đang được quan tâm</h2><p>Danh sách đọc từ product bundle hiện có, chỉ hiển thị trên website và không ghi ngược ProductDB.</p></div><div class="v3-product-grid">${chosen.map(productCard).join("")}</div>`;
    const anchor = document.querySelector("#category-library") || document.querySelector("#home");
    anchor?.insertAdjacentElement("afterend", section);
  }

  function productCard(product) {
    const image = product.image?.src ? `<img src="${esc(product.image.src)}" alt="${esc(product.image.alt || product.name)}" loading="lazy" decoding="async" />` : composite(product.category || "Sản phẩm", "utility");
    const meta = [product.category, product.subCategory].filter(Boolean).join(" / ") || "Nội thất BA_Furniture";
    return `<article class="product-card v3-product-card" data-product-code="${esc(product.code)}">
      <a class="v3-product-card__media" href="${esc(productUrl(product))}" aria-label="Xem ${esc(product.name)}">${image}</a>
      <div class="product-card__body v3-product-card__body">
        <span class="v3-product-card__category">${esc(meta)}</span>
        <p class="product-card__code">Mã: ${esc(product.code || "Đang cập nhật")}</p>
        <h3>${esc(product.name || "Sản phẩm BA_Furniture")}</h3>
        <p class="product-card__price">${esc(product.price?.label || "Liên hệ báo giá")}</p>
        <div class="v3-product-card__actions"><a class="product-card__cta" href="${esc(productUrl(product))}">Xem chi tiết</a><a class="v3-quote-link" href="${quoteTarget()}">Báo giá</a></div>
      </div>
    </article>`;
  }

  function renderCommerceSections() {
    if (!document.querySelector("#home") || document.querySelector("#v3-solutions")) return;
    const section = document.createElement("section");
    section.id = "v3-solutions";
    section.className = "section v3-solutions";
    section.innerHTML = `<div class="section-head"><span class="section-label">Giải pháp theo nhu cầu</span><h2>Không chỉ bán sản phẩm, BA_Furniture tư vấn theo không gian sử dụng</h2><p>Chọn nhóm nhu cầu gần nhất để đội tư vấn đề xuất cấu hình sản phẩm, kích thước, chất liệu và tiến độ phù hợp.</p></div><div class="v3-solution-grid">${solutions.map(([title, desc]) => `<a href="${quoteTarget()}" class="v3-solution-card"><span>${esc(title)}</span><p>${esc(desc)}</p></a>`).join("")}</div><div class="v3-trust-strip"><span>Tư vấn chuyên nghiệp</span><span>Sản xuất theo yêu cầu</span><span>Giao hàng theo dự án</span><span>Bảo hành theo từng nhóm sản phẩm</span><span>Phục vụ Nam Định, Hà Nam, Ninh Bình, Hưng Yên, Thái Bình</span></div>`;
    const after = document.querySelector("#v3-featured-products") || document.querySelector("#category-library") || document.querySelector("#home");
    after?.insertAdjacentElement("afterend", section);
  }

  function renderNewsAndFinalCta() {
    if (!document.querySelector("#home") || document.querySelector("#v3-final-quote")) return;
    const section = document.createElement("section");
    section.id = "v3-final-quote";
    section.className = "section v3-final-quote";
    section.innerHTML = `<div><span class="section-label">Tư vấn và báo giá</span><h2>Cần cấu hình nội thất cho văn phòng, trường học hoặc dự án?</h2><p>Gửi yêu cầu để BA_Furniture tư vấn danh mục phù hợp, kích thước, màu sắc, chất liệu và phương án giao hàng.</p></div><div class="v3-final-quote__actions"><a class="btn btn-primary" href="tel:${hotline}">Gọi ${hotlineText}</a><a class="btn btn-secondary" href="${quoteTarget()}">Nhận báo giá</a><a class="btn btn-light" href="/danh-muc/ghe-van-phong">Xem danh mục</a></div>`;
    const contact = document.querySelector("#contact");
    if (contact) contact.insertAdjacentElement("beforebegin", section);
    else document.querySelector("main")?.appendChild(section);
  }

  function applySearchQuery() {
    const q = clean(new URLSearchParams(window.location.search).get("q"));
    if (!q) return;
    const input = document.querySelector("#ba-filter-search");
    if (input && input.value !== q) {
      input.value = q;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  function addStickyCta() {
    if (document.querySelector(".v3-mobile-sticky-cta")) return;
    const nav = document.createElement("nav");
    nav.className = "v3-mobile-sticky-cta";
    nav.setAttribute("aria-label", "CTA nhanh trên mobile");
    nav.innerHTML = `<a href="tel:${hotline}">Gọi</a><a href="${quoteTarget()}">Báo giá</a><a href="/danh-muc/ghe-van-phong">Danh mục</a>`;
    document.body.appendChild(nav);
  }

  function polishLinksAndA11y() {
    document.querySelectorAll('a[href="category.html"]').forEach((link) => { link.href = "/danh-muc/ghe-van-phong"; });
    document.querySelectorAll('a[href="#"][aria-disabled="true"], a[data-placeholder="NEED_ZALO_LINK"]').forEach((link) => {
      link.setAttribute("aria-disabled", "true");
      link.addEventListener("click", (event) => event.preventDefault());
    });
    document.querySelectorAll("img:not([alt])").forEach((img) => { img.alt = "BA_Furniture"; });
    document.documentElement.dataset.v3Experience = "ready";
  }

  function run() {
    patchHeader();
    renderCategoryCards();
    renderFeaturedProducts();
    renderCommerceSections();
    renderNewsAndFinalCta();
    applySearchQuery();
    addStickyCta();
    polishLinksAndA11y();
  }

  function boot() {
    run();
    [400, 1200, 2400, 4200].forEach((delay) => window.setTimeout(run, delay));
    const observer = new MutationObserver(() => window.requestAnimationFrame(run));
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.BAFurnitureV3Experience = { version, run, categoryCards: categoryCards.length };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
