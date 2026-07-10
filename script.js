const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll(".main-nav a");
const categoryLibrary = Array.isArray(window.BA_CATEGORY_LIBRARY) ? window.BA_CATEGORY_LIBRARY : [];
const productDetailHref = "product-detail.html";

const iconPaths = {
  chair: '<path d="M8 4h8l1 9H7L8 4Z"/><path d="M9 13v3h6v-3"/><path d="M12 16v4"/><path d="M8 20h8"/>',
  desk: '<path d="M4 9h16"/><path d="M6 9v10"/><path d="M18 9v10"/><path d="M8 14h8"/>',
  table: '<path d="M4 10h16"/><path d="M7 10v8"/><path d="M17 10v8"/><path d="M8 6h8"/>',
  cabinet: '<path d="M6 4h12v16H6V4Z"/><path d="M6 10h12"/><path d="M6 15h12"/><path d="M11 7h2"/><path d="M11 13h2"/><path d="M11 18h2"/>',
  locker: '<path d="M5 4h14v16H5V4Z"/><path d="M12 4v16"/><path d="M8 8h1"/><path d="M15 8h1"/><path d="M8 14h1"/><path d="M15 14h1"/>',
  sofa: '<path d="M6 11V8a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3"/><path d="M4 11h16v6H4v-6Z"/><path d="M6 17v2"/><path d="M18 17v2"/>',
  school: '<path d="M5 6h14v8H5V6Z"/><path d="M8 18h8"/><path d="M12 14v4"/><path d="M7 10h10"/>',
  shelves: '<path d="M5 5h14"/><path d="M5 12h14"/><path d="M5 19h14"/><path d="M7 5v14"/><path d="M17 5v14"/>',
  building: '<path d="M5 20V6l7-3 7 3v14"/><path d="M9 20v-6h6v6"/><path d="M9 8h.01"/><path d="M15 8h.01"/><path d="M12 11h.01"/>',
  medical: '<path d="M12 4v16"/><path d="M4 12h16"/><path d="M6 6h12v12H6V6Z"/>',
  home: '<path d="M4 11 12 4l8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-6h4v6"/>',
  panel: '<path d="M4 5h16v14H4V5Z"/><path d="M10 5v14"/><path d="M14 9h4"/><path d="M14 13h4"/>'
};

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function iconType(iconId = "") {
  const id = iconId.toLowerCase();
  if (id.includes("chair")) return "chair";
  if (id.includes("meeting") || id.includes("table") || id.includes("canteen")) return "table";
  if (id.includes("desk") || id.includes("reception")) return "desk";
  if (id.includes("locker")) return "locker";
  if (id.includes("cabinet") || id.includes("wardrobe") || id.includes("pedestal")) return "cabinet";
  if (id.includes("sofa") || id.includes("waiting")) return "sofa";
  if (id.includes("school") || id.includes("student") || id.includes("teacher") || id.includes("library") || id.includes("kindergarten") || id.includes("graduation")) return "school";
  if (id.includes("shel") || id.includes("rack") || id.includes("archive")) return "shelves";
  if (id.includes("project") || id.includes("building") || id.includes("auditorium") || id.includes("podium") || id.includes("public") || id.includes("blueprint")) return "building";
  if (id.includes("medical") || id.includes("exam") || id.includes("clinic")) return "medical";
  if (id.includes("home") || id.includes("bed")) return "home";
  if (id.includes("partition") || id.includes("accessory") || id.includes("part")) return "panel";
  return "panel";
}

function iconSvg(iconId, label = "") {
  return `<svg viewBox="0 0 24 24" focusable="false" aria-hidden="${label ? "false" : "true"}" ${label ? `aria-label="${escapeHTML(label)}"` : ""}>${iconPaths[iconType(iconId)]}</svg>`;
}

function subcategoryObjects(category) {
  return category.subcategories.map(([id, name, icon]) => ({ id, name, icon }));
}

function categoryHref(category) {
  return category.href || "https://portal.bafurni.com";
}

function categoryCard(category, index = 0) {
  const href = categoryHref(category);
  const isInternal = href.startsWith("category");
  const subCount = category.subcategories.length;
  const media = category.image
    ? `<img src="${escapeHTML(category.image)}" alt="${escapeHTML(category.name)} BA_Furniture" />`
    : `<span class="category-group-card__placeholder-text">${escapeHTML(category.name)}</span>`;

  return `
    <a class="category-group-card category-system-card" href="${escapeHTML(href)}" ${isInternal ? "" : 'target="_blank" rel="noopener"'} data-main-category="${escapeHTML(category.id)}">
      <div class="category-group-card__media ${category.image ? "" : `category-group-card__placeholder category-group-card__placeholder--tone-${(index % 4) + 1}`}" aria-label="${escapeHTML(category.name)}">
        ${media}
        <span class="category-group-card__icon-badge" aria-hidden="true">${iconSvg(category.icon)}</span>
      </div>
      <div class="category-group-card__body">
        <div class="category-group-card__meta"><span>${subCount} nhóm nhỏ</span><span>${escapeHTML(category.id)}</span></div>
        <h3>${escapeHTML(category.name)}</h3>
        <p>${escapeHTML(category.description)}</p>
        <span class="category-group-card__cta">${isInternal ? "Xem trang danh mục" : "Xem trên Portal"}</span>
      </div>
    </a>
  `;
}

function subcategoryCard(item, href = "category.html#category-listing") {
  return `
    <a class="category-subgroup-card" href="${escapeHTML(href)}" data-subcategory="${escapeHTML(item.id)}">
      <span class="category-subgroup-card__icon" aria-hidden="true">${iconSvg(item.icon)}</span>
      <span class="category-subgroup-card__label">${escapeHTML(item.name)}</span>
    </a>
  `;
}

function libraryDetails(category, index) {
  const items = subcategoryObjects(category);
  return `
    <details class="category-library-details" ${index === 0 ? "open" : ""} data-main-category="${escapeHTML(category.id)}">
      <summary class="category-library-summary">
        <span class="category-library-summary__icon" aria-hidden="true">${iconSvg(category.icon)}</span>
        <span>
          <strong>${escapeHTML(category.name)}</strong>
          <small>${items.length} nhóm nhỏ</small>
        </span>
      </summary>
      <div class="category-library-chips">
        ${items.map((item) => `<span class="category-library-chip" data-subcategory="${escapeHTML(item.id)}">${iconSvg(item.icon)}${escapeHTML(item.name)}</span>`).join("")}
      </div>
    </details>
  `;
}

function renderHomepageCategory() {
  const target = document.querySelector("[data-category-home], .category-visual-section");
  if (!target || categoryLibrary.length === 0) return;

  target.id = "category-library";
  target.classList.add("category-experience");
  target.setAttribute("aria-labelledby", "category-visual-title");
  target.dataset.categoryHome = "true";

  const chair = categoryLibrary.find((category) => category.id === "OFFICE_CHAIR") || categoryLibrary[0];
  const chairSubcategories = subcategoryObjects(chair);

  target.innerHTML = `
    <div class="section-head category-experience__head">
      <span class="section-label">Hệ thống danh mục</span>
      <h2 id="category-visual-title">Danh mục sản phẩm BAFurniture</h2>
      <p>Thư viện danh mục chuẩn theo Product Classification System: rõ nhóm lớn, nhóm nhỏ, icon, visual và CTA để sẵn sàng cho ProductDB ở giai đoạn sau.</p>
    </div>

    <a class="category-home-hero" href="category.html" aria-label="Xem trang danh mục Ghế văn phòng">
      <span class="category-home-hero__icon" aria-hidden="true">${iconSvg(chair.icon)}</span>
      <span class="category-home-hero__copy">
        <span class="section-label">Category Hero</span>
        <strong>${escapeHTML(chair.name)}</strong>
        <small>${escapeHTML(chair.description)} Trang danh mục đã có breadcrumb, subcategory visual, filter shell, product grid shell, empty state, CTA và related categories.</small>
      </span>
      <span class="category-home-hero__actions">
        <span class="category-home-hero__cta">Xem trang danh mục</span>
        <span class="category-home-hero__ghost">12 nhóm nhỏ</span>
      </span>
    </a>

    <div class="category-group-grid category-system-grid" aria-label="Toàn bộ nhóm sản phẩm lớn">
      ${categoryLibrary.map((category, index) => categoryCard(category, index)).join("")}
    </div>

    <div class="category-subgroup-panel category-featured-subgroups" aria-labelledby="chair-subgroup-title">
      <div class="category-subgroup-panel__head">
        <span class="section-label">Nhóm nhỏ nổi bật</span>
        <h3 id="chair-subgroup-title">Ghế văn phòng</h3>
        <p>Hiển thị đầy đủ Level 2 của nhóm ghế theo PRODUCT_CATEGORY_TREE.md, không nối dữ liệu thật.</p>
      </div>
      <div class="category-subgroup-grid" aria-label="Nhóm nhỏ Ghế văn phòng">
        ${chairSubcategories.map((item) => subcategoryCard(item)).join("")}
      </div>
    </div>

    <div class="category-library-panel" aria-labelledby="category-library-title">
      <div class="category-library-panel__head">
        <span class="section-label">Category Library</span>
        <h3 id="category-library-title">Cây danh mục chuẩn</h3>
        <p>Toàn bộ MainCategory và SubCategoryNormalized để đồng bộ Website, Portal, AI Advisor, SEO, báo giá và marketing.</p>
      </div>
      <div class="category-library-grid">
        ${categoryLibrary.map((category, index) => libraryDetails(category, index)).join("")}
      </div>
    </div>

    <div class="category-section-cta">
      <div>
        <span class="section-label">Portal sản phẩm</span>
        <h3>Xem dữ liệu sản phẩm thật tại Portal BA_Furniture.</h3>
      </div>
      <a class="btn btn-primary" href="https://portal.bafurni.com" target="_blank" rel="noopener">Xem hơn 3.300 sản phẩm</a>
    </div>
  `;
}

function productCard(item, index) {
  const productCode = `CHAIR-DEMO-${String(index + 1).padStart(2, "0")}`;
  const productName = `${item.name} BA demo`;

  return `
    <article class="product-card category-template-product-card" data-subcategory="${escapeHTML(item.id)}">
      <div class="product-card__image category-template-product-card__image" aria-hidden="true">
        <span>${iconSvg(item.icon)} DEMO</span>
      </div>
      <div class="product-card__body">
        <p class="product-card__code">Mã mẫu: ${escapeHTML(productCode)}</p>
        <h3>${escapeHTML(productName)}</h3>
        <p class="category-template-product-card__meta">Ghế văn phòng / ${escapeHTML(item.name)} / Dữ liệu mẫu</p>
        <p class="product-card__price">Liên hệ báo giá</p>
        <a class="product-card__cta" href="${productDetailHref}" aria-label="Xem chi tiết ${escapeHTML(productName)}">Xem chi tiết</a>
      </div>
    </article>
  `;
}

function renderCategoryPage() {
  const page = document.querySelector(".category-template-page main");
  if (!page || categoryLibrary.length === 0) return;

  const category = categoryLibrary.find((item) => item.id === "OFFICE_CHAIR") || categoryLibrary[0];
  const subcategories = subcategoryObjects(category);
  const related = categoryLibrary.filter((item) => item.id !== category.id).slice(0, 6);
  const products = subcategories.slice(0, 8);

  page.innerHTML = `
    <section id="category-top" class="category-template-hero">
      <nav class="category-template-breadcrumb" aria-label="Breadcrumb">
        <a href="index.html#home">Trang chủ</a>
        <span aria-hidden="true">/</span>
        <a href="index.html#category-library">Danh mục</a>
        <span aria-hidden="true">/</span>
        <span>${escapeHTML(category.name)}</span>
      </nav>

      <div class="category-template-hero__grid">
        <div class="category-template-hero__content">
          <span class="section-label">Category Page</span>
          <h1>${escapeHTML(category.name)}</h1>
          <p>${escapeHTML(category.description)} Trang tĩnh này mô phỏng đầy đủ trải nghiệm danh mục trước khi kết nối ProductDB.</p>
          <div class="category-template-stats" aria-label="Thông tin danh mục">
            <span><strong>${subcategories.length}</strong> nhóm nhỏ</span>
            <span><strong>08</strong> card mẫu</span>
            <span><strong>0</strong> dữ liệu thật</span>
          </div>
        </div>

        <div class="category-template-hero__visual" aria-label="Visual danh mục ${escapeHTML(category.name)}">
          <span class="category-template-hero__icon" aria-hidden="true">${iconSvg(category.icon)}</span>
          <span>Visual danh mục đang cập nhật</span>
        </div>
      </div>

      <div class="category-template-chips" aria-label="Nhóm nhỏ ${escapeHTML(category.name)}">
        ${subcategories.map((item) => `<a href="#category-listing">${escapeHTML(item.name)}</a>`).join("")}
      </div>

      <div id="category-subgroups" class="category-subgroup-panel category-template-subcategory-visual" aria-labelledby="category-subgroup-visual-title">
        <div class="category-subgroup-panel__head">
          <span class="section-label">Subcategory Visual</span>
          <h2 id="category-subgroup-visual-title">Các dòng ${escapeHTML(category.name.toLowerCase())}</h2>
          <p>Nhóm nhỏ hiển thị bằng card icon nhất quán, hỗ trợ scan nhanh và chuẩn bị cho filter động sau này.</p>
        </div>
        <div class="category-subgroup-grid" aria-label="Nhóm nhỏ có visual của ${escapeHTML(category.name)}">
          ${subcategories.map((item) => subcategoryCard(item, "#category-listing")).join("")}
        </div>
      </div>
    </section>

    <section id="category-listing" class="category-template-section">
      <div class="category-template-section__head">
        <span class="section-label">Product Grid Shell</span>
        <h2>Khung sản phẩm trong danh mục</h2>
        <p>Card mẫu tĩnh để kiểm thử UI listing, filter, empty state và CTA. Chưa render dữ liệu thật và chưa nối ProductDB.</p>
      </div>

      <div class="category-template-layout">
        <aside class="category-template-filter" aria-label="Bộ lọc tĩnh">
          <div>
            <h3>Nhóm ghế</h3>
            ${subcategories.slice(0, 6).map((item) => `<label><input type="checkbox" disabled /> ${escapeHTML(item.name)}</label>`).join("")}
          </div>
          <div>
            <h3>Khoảng giá</h3>
            <label><input type="checkbox" disabled /> Liên hệ báo giá</label>
            <label><input type="checkbox" disabled /> Dưới 2 triệu</label>
            <label><input type="checkbox" disabled /> 2-5 triệu</label>
          </div>
          <div>
            <h3>Trạng thái</h3>
            <label><input type="checkbox" disabled /> Hàng mẫu</label>
            <label><input type="checkbox" disabled /> Sản xuất theo yêu cầu</label>
          </div>
        </aside>

        <div>
          <div class="category-template-products-toolbar">
            <span>8 sản phẩm mẫu</span>
            <span>Sort shell: Mặc định</span>
          </div>
          <div class="category-template-products" aria-label="Danh sách sản phẩm mẫu">
            ${products.map((item, index) => productCard(item, index)).join("")}
          </div>
        </div>
      </div>

      <div class="category-template-empty" role="status" aria-live="polite">
        <span class="category-template-empty__icon" aria-hidden="true">${iconSvg("empty-chair")}</span>
        <div>
          <h3>Không tìm thấy sản phẩm phù hợp</h3>
          <p>Empty state mẫu cho trường hợp bộ lọc không trả về sản phẩm. BA_Furniture vẫn có thể tư vấn cấu hình, chất liệu, màu sắc và sản xuất theo yêu cầu.</p>
        </div>
        <a class="product-card__cta" href="#category-contact">Nhận tư vấn</a>
      </div>
    </section>

    <section class="section category-template-related" aria-labelledby="related-category-title">
      <div class="section-head">
        <span class="section-label">Related Categories</span>
        <h2 id="related-category-title">Danh mục liên quan</h2>
        <p>Gợi ý các nhóm sản phẩm thường đi cùng ghế văn phòng khi khách hàng làm văn phòng, phòng họp, trường học hoặc dự án.</p>
      </div>
      <div class="category-group-grid category-related-grid">
        ${related.map((item, index) => categoryCard(item, index)).join("")}
      </div>
    </section>

    <section id="category-contact" class="category-template-cta">
      <div>
        <span class="section-label">Tư vấn danh mục</span>
        <h2>Cần báo giá ghế văn phòng theo số lượng hoặc mặt bằng?</h2>
        <p>Liên hệ BA_Furniture để được tư vấn cấu hình, chất liệu, màu sắc và phương án cung ứng phù hợp.</p>
      </div>
      <div class="category-template-cta__actions">
        <a class="btn btn-primary" href="tel:0929878666">Gọi 0929.878.666</a>
        <a class="btn btn-secondary" href="https://portal.bafurni.com" target="_blank" rel="noopener">Vào Portal sản phẩm</a>
      </div>
    </section>
  `;
}

renderHomepageCategory();
renderCategoryPage();

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Đóng menu" : "Mở menu");
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      mainNav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Mở menu");
    }
  });
}

const sections = [...document.querySelectorAll("main section[id]")];

if ("IntersectionObserver" in window && sections.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
  );

  sections.forEach((section) => observer.observe(section));
}
