(function () {
  if (window.BAFurnitureV3Fix) return;

  const categories = [
    ["OFFICE_CHAIR", "Ghế văn phòng", "/danh-muc/ghe-van-phong", "chair", "Ghế giám đốc, ghế lưới, ghế xoay, ghế họp và ghế training."],
    ["OFFICE_DESK", "Bàn văn phòng", "/danh-muc/ban-van-phong", "desk", "Bàn nhân viên, bàn cụm, bàn quản lý và bàn máy tính."],
    ["MEETING_TABLE", "Bàn họp", "/danh-muc/ban-hop", "meeting", "Bàn họp nhỏ, lớn, oval, module và bàn hội trường."],
    ["CABINET_STORAGE", "Tủ & Hộc tài liệu", "/danh-muc/tu-hoc-tai-lieu", "cabinet", "Tủ hồ sơ, hộc di động và giải pháp lưu trữ văn phòng."],
    ["LOCKER_STEEL", "Tủ sắt", "/danh-muc/tu-sat-locker/tu-sat-van-phong", "cabinet", "Tủ sắt văn phòng, tủ công cụ và tủ gia công theo yêu cầu."],
    ["LOCKER_STEEL", "Locker", "/danh-muc/tu-sat-locker/tu-locker", "locker", "Locker nhân viên, locker điện thoại và lưu trữ theo dự án."],
    ["SOFA_WAITING", "Sofa & Ghế chờ", "/danh-muc/sofa-ghe-cho", "sofa", "Sofa văn phòng, ghế chờ, ghế tiếp khách và sofa sảnh."],
    ["SCHOOL_FURNITURE", "Nội thất trường học", "/danh-muc/noi-that-truong-hoc", "school", "Bàn ghế học sinh, giáo viên, thư viện và phòng chức năng."],
    ["SHELVING_RACK", "Kệ & Giá kho", "/danh-muc/ke-gia-kho", "rack", "Kệ sắt, giá kho, kệ trưng bày và lưu trữ hồ sơ."],
    ["OFFICE_DESK", "Bàn giám đốc", "/danh-muc/ban-van-phong/ban-giam-doc", "executive", "Bàn lãnh đạo và cấu hình phòng giám đốc theo không gian."],
    ["OFFICE_CHAIR", "Ghế lưới", "/danh-muc/ghe-van-phong/ghe-luoi", "mesh", "Ghế lưới làm việc, ghế xoay lưng lưới và ghế công thái học."],
    ["OFFICE_CHAIR", "Ghế chân quỳ", "/danh-muc/ghe-van-phong/ghe-chan-quy", "visitor", "Ghế họp, ghế tiếp khách và ghế chân quỳ đồng bộ." ]
  ];

  function clean(value) { return value == null ? "" : String(value).trim(); }
  function esc(value) {
    return clean(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }
  function typeFromText(text) {
    const value = clean(text).toLowerCase();
    if (value.includes("lưới")) return "mesh";
    if (value.includes("chân quỳ") || value.includes("ghế chờ")) return "visitor";
    if (value.includes("ghế")) return "chair";
    if (value.includes("bàn họp")) return "meeting";
    if (value.includes("giám đốc") || value.includes("lãnh đạo")) return "executive";
    if (value.includes("bàn")) return "desk";
    if (value.includes("locker")) return "locker";
    if (value.includes("tủ")) return "cabinet";
    if (value.includes("sofa")) return "sofa";
    if (value.includes("trường")) return "school";
    if (value.includes("kệ") || value.includes("giá")) return "rack";
    return "utility";
  }
  function composite(name, type) {
    return `<span class="v3-composite v3-composite--${esc(type)} v3-composite--fallback" role="img" aria-label="Ảnh composite ${esc(name)}">
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
  function categoryCard([id, title, href, type, desc], index) {
    return `<a class="category-group-card v3-category-card" data-main-category="${esc(id)}" href="${esc(href)}" aria-label="Xem ${esc(title)}">
      <span class="category-group-card__media v3-category-card__media" data-s31-composite="ready">${composite(title, type)}</span>
      <span class="category-group-card__body v3-category-card__body">
        <span class="v3-category-card__meta">${index < 9 ? 'Nhóm chính' : 'Nhóm nổi bật'}</span>
        <h3>${esc(title)}</h3>
        <p>${esc(desc)}</p>
        <span class="v3-card-link">Xem danh mục</span>
      </span>
    </a>`;
  }
  function renderCategoryGrid() {
    const section = document.querySelector("#category-library");
    const grid = section?.querySelector(".category-group-grid");
    if (!grid) return;
    const hasLegacyImages = grid.querySelector('img[src*="/images/categories/main/"]');
    const count = grid.querySelectorAll(".v3-category-card").length;
    if (count === categories.length && !hasLegacyImages) return;
    grid.innerHTML = categories.map(categoryCard).join("");
    grid.dataset.v3Categories = "ready";

    const hero = section.querySelector(".category-home-hero");
    if (hero) {
      hero.href = "/danh-muc/ghe-van-phong";
      const visual = hero.querySelector(".category-home-hero__icon, .category-home-hero__visual");
      if (visual) {
        visual.className = "category-home-hero__visual v3-category-hero-visual";
        visual.innerHTML = composite("Ghế văn phòng", "chair");
      }
    }
  }
  function titleForImage(img) {
    const scope = img.closest("article, a, section, .product-card, .product-detail-gallery, .category-group-card") || img.parentElement;
    return img.alt || scope?.querySelector("h1,h2,h3,strong")?.textContent || "Sản phẩm BA_Furniture";
  }
  function replaceImage(img) {
    if (!img || img.dataset.v3FallbackApplied === "true") return;
    img.dataset.v3FallbackApplied = "true";
    const title = titleForImage(img);
    const wrapper = document.createElement("span");
    wrapper.className = "v3-image-fallback";
    wrapper.innerHTML = composite(title, typeFromText(title));
    img.replaceWith(wrapper);
  }
  function patchImages() {
    Array.from(document.images).forEach((img) => {
      const src = img.currentSrc || img.src || "";
      const unstableExternal = src.includes("noithathoaphat.com");
      const legacyCategory = src.includes("/images/categories/main/");
      const alreadyBroken = img.complete && img.naturalWidth === 0;
      if (unstableExternal || legacyCategory || alreadyBroken) {
        replaceImage(img);
        return;
      }
      img.addEventListener("error", () => replaceImage(img), { once: true });
    });
  }
  function run() {
    renderCategoryGrid();
    patchImages();
    document.documentElement.dataset.v3ExperienceFix = "ready";
  }
  function boot() {
    run();
    [250, 700, 1600, 3200, 5200, 8200].forEach((delay) => window.setTimeout(run, delay));
    const observer = new MutationObserver(() => window.requestAnimationFrame(run));
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.BAFurnitureV3Fix = { run };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
