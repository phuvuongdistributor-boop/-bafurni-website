(() => {
  const CATEGORY_LIBRARY = [
    {
      slug: "ghe-van-phong",
      name: "Ghế văn phòng",
      description: "Ghế giám đốc, ghế leader, ghế lưới, ghế chân quỳ, ghế da, ghế training và các lựa chọn cho phòng họp, khu làm việc, khu chờ.",
      image: "/images/categories/main/ghe-van-phong.webp",
      subs: [
        ["ghe-giam-doc", "Ghế giám đốc"], ["ghe-leader", "Ghế leader"], ["ghe-luoi", "Ghế lưới"], ["ghe-chan-quy", "Ghế chân quỳ"],
        ["ghe-da", "Ghế da"], ["ghe-training", "Ghế training"], ["ghe-bar-cafe", "Ghế bar/cafe"], ["ghe-xoay", "Ghế xoay"]
      ],
      products: [
        ["TQ05", "Ghế giám đốc TQ05", "/images/categories/sub/ghe-giam-doc.webp", "/san-pham/tq05-ghe-giam-doc-tq05"],
        ["TQ01", "Ghế giám đốc TQ01", "/images/categories/sub/ghe-da.webp", "/san-pham/tq01-ghe-giam-doc-tq01"],
        ["GL304", "Ghế lưới cao cấp GL304", "/images/categories/sub/ghe-luoi.webp", "/san-pham/gl304-ghe-luoi-cao-cap-gl304"],
        ["GL307", "Ghế lưới cao cấp GL307", "/images/categories/sub/ghe-leader.webp", "/san-pham/gl307-ghe-luoi-cao-cap-gl307"],
        ["VT3B", "Ghế họp chân tĩnh VT3B", "/images/categories/sub/ghe-chan-quy.webp", "/san-pham/vt3b-ghe-hop-chan-tinh-vt3b"],
        ["SL933", "Ghế chân quỳ SL933", "/images/categories/sub/ghe-phong-hop.webp", "/san-pham/sl933-ghe-chan-quy-sl933"],
        ["TQ33", "Ghế xoay văn phòng TQ33", "/images/categories/sub/ghe-xoay.webp", "/san-pham/tq33-ghe-xoay-van-phong-tq33"],
        ["GL316", "Ghế lưới văn phòng GL316", "/images/categories/sub/ghe-luoi.webp", "/san-pham/gl316-ghe-luoi-van-phong-gl316"]
      ]
    },
    {
      slug: "ban-van-phong",
      name: "Bàn văn phòng",
      description: "Bàn nhân viên, bàn quản lý, bàn giám đốc, module bàn làm việc và bàn máy tính cho văn phòng hiện đại.",
      image: "/images/categories/main/ban-van-phong.webp",
      subs: [["ban-nhan-vien", "Bàn nhân viên"], ["ban-quan-ly", "Bàn quản lý"], ["ban-giam-doc", "Bàn giám đốc"], ["ban-cum-module", "Bàn cụm/module"], ["ban-may-tinh", "Bàn máy tính"], ["ban-lam-viec", "Bàn làm việc"]],
      products: [
        ["BRIMD01-4C15", "Module bàn làm việc BRIMD01-4C15", "/images/categories/sub/ban-cum-module.webp", "/san-pham/brimd01-4c15-module-ban-lam-viec-brimd01-4c15"],
        ["DT1890V2", "Bàn giám đốc Veneer DT1890V2", "/images/categories/sub/ban-giam-doc.webp", "/san-pham/dt1890v2-ban-giam-doc-veneer-dt1890v2"],
        ["LUXL14C10", "Bàn quản lý LUXL14C10", "/images/categories/sub/ban-quan-ly.webp", "/san-pham/luxl14c10-ban-lanh-dao-luxl14c10"],
        ["NTM120S", "Bàn máy tính NTM120S", "/images/categories/sub/ban-may-tinh.webp", "/san-pham/ntm120s-ban-may-tinh-ntm120s"]
      ]
    },
    {
      slug: "ban-hop",
      name: "Bàn họp",
      description: "Bàn họp nhỏ, bàn họp lớn, bàn họp oval và cấu hình phòng họp theo số lượng người dùng.",
      image: "/images/categories/main/ban-hop.webp",
      subs: [["ban-hop-lon", "Bàn họp lớn"], ["ban-hop-nho", "Bàn họp nhỏ"], ["ban-hop-oval", "Bàn họp oval"], ["ban-hoi-truong", "Bàn hội trường"]],
      products: [
        ["CT2412V1", "Bàn họp gỗ cao cấp CT2412V1", "/images/categories/sub/ban-hop-nho.webp", "/san-pham/ct2412v1-ban-hop-go-cao-cap-ct2412v1"],
        ["CT4016V19", "Bàn họp cao cấp CT4016V19", "/images/categories/sub/ban-hop-lon.webp", "/san-pham/ct4016v19-ban-hop-cao-cap-ct4016v19"],
        ["CT2010H2", "Bàn họp cao cấp CT2010H2", "/images/categories/sub/ban-hop-oval.webp", "/san-pham/ct2010h2-ban-hop-cao-cap-ct2010h2"],
        ["TC336", "Bàn hội trường TC336", "/images/categories/sub/ban-hoi-truong.webp", "/san-pham/tc336-ban-hoi-truong-tc336"]
      ]
    },
    {
      slug: "tu-hoc",
      aliases: ["tu-hoc-tai-lieu"],
      name: "Tủ & Hộc tài liệu",
      description: "Tủ hồ sơ, tủ tài liệu, tủ thấp, hộc di động và giải pháp lưu trữ cho văn phòng.",
      image: "/images/categories/main/tu-hoc-tai-lieu.webp",
      subs: [["tu-tai-lieu", "Tủ tài liệu"], ["tu-ho-so", "Tủ hồ sơ"], ["hoc-di-dong", "Hộc di động"], ["tu-thap", "Tủ thấp"], ["tu-sat", "Tủ sắt"], ["tu-locker", "Tủ locker"]],
      products: [
        ["TU09K7CK", "Tủ sắt hồ sơ TU09K7CK", "/images/categories/sub/tu-ho-so.webp", "/san-pham/tu09k7ck-tu-sat-ho-so-tu09k7ck"],
        ["TU06AD", "Tủ thấp TU06AD", "/images/categories/sub/tu-thap.webp", "/san-pham/tu06ad-tu-thap-tu06ad"],
        ["HS1", "Hộc sắt HS1", "/images/categories/sub/hoc-di-dong.webp", "/san-pham/hs1-hoc-sat-hs1"],
        ["TU09", "Tủ tài liệu TU09", "/images/categories/sub/tu-tai-lieu.webp", "/san-pham/tu09-tu-tai-lieu-tu09"]
      ]
    },
    {
      slug: "locker",
      name: "Locker",
      description: "Tủ locker nhiều ngăn, tủ sắt, tủ thay đồ cho văn phòng, nhà máy, trường học và khu công cộng.",
      image: "/images/categories/main/tu-locker.webp",
      subs: [["tu-locker", "Tủ locker"], ["tu-sat", "Tủ sắt"], ["tu-ho-so", "Tủ hồ sơ"], ["tu-truong-hoc", "Tủ trường học"]],
      products: [
        ["TU983-3KS", "Tủ locker khóa số 9 ngăn TU983-3KS", "/images/categories/sub/tu-locker.webp", "/san-pham/tu983-3ks-tu-locker-khoa-so-9-ngan-tu983-3ks"],
        ["TU981-2K", "Tủ locker TU981-2K", "/images/categories/main/tu-locker.webp", "/san-pham/tu981-2k-tu-locker-tu981-2k"],
        ["TU982", "Tủ sắt 6 ngăn TU982", "/images/categories/sub/tu-sat.webp", "/san-pham/tu982-tu-sat-6-ngan-tu982-3kp"],
        ["TU09K8CK", "Tủ sắt hồ sơ TU09K8CK", "/images/categories/sub/tu-ho-so.webp", "/san-pham/tu09k8ck-tu-sat-ho-so-tu09k8ck"]
      ]
    },
    {
      slug: "sofa",
      name: "Sofa & Ghế chờ",
      description: "Sofa văn phòng, sofa sảnh, ghế lounge và ghế chờ cho khu tiếp khách, lễ tân, phòng chờ.",
      image: "/images/categories/main/sofa-ghe-cho.webp",
      subs: [["sofa-van-phong", "Sofa văn phòng"], ["sofa-sanh", "Sofa sảnh"], ["ghe-lounge", "Ghế lounge"], ["ghe-cho", "Ghế chờ"]],
      products: [
        ["SF01", "Sofa văn phòng SF01", "/images/categories/sub/sofa-van-phong.webp", "/san-pham/sf01-sofa-van-phong-sf01"],
        ["SF02", "Sofa văn phòng SF02", "/images/categories/sub/sofa-sanh.webp", "/san-pham/sf02-sofa-van-phong-sf02"],
        ["SF01-1", "Ghế sofa đơn SF01-1", "/images/categories/sub/ghe-lounge.webp", "/san-pham/sf01-1-ghe-sofa-don-sf01-1"],
        ["SF01-3", "Ghế sofa băng SF01-3", "/images/categories/sub/ghe-cho.webp", "/san-pham/sf01-3-ghe-sofa-bang-sf01-3"]
      ]
    },
    {
      slug: "truong-hoc",
      name: "Nội thất trường học",
      description: "Bàn ghế học sinh, bàn giáo viên, tủ trường học, nội thất mầm non và phòng chức năng.",
      image: "/images/categories/main/noi-that-truong-hoc.webp",
      subs: [["ban-hoc-sinh", "Bàn học sinh"], ["ghe-hoc-sinh", "Ghế học sinh"], ["ban-giao-vien", "Bàn giáo viên"], ["noi-that-mam-non", "Nội thất mầm non"], ["tu-truong-hoc", "Tủ trường học"], ["ban-ghe-dao-tao", "Bàn ghế đào tạo"]],
      products: [
        ["BHS03-1", "Bàn ghế học sinh BHS03-1", "/images/categories/sub/ban-hoc-sinh.webp", "/san-pham/bhs03-1-ban-ghe-hoc-sinh-bhs03-1-ghs03-1"],
        ["GMG101A-2", "Nội thất trường học GMG101A-2", "/images/categories/sub/ban-giao-vien.webp", "/san-pham/gmg101a-2-noi-that-truong-hoc-gmg101a-2"],
        ["GHS03-1", "Ghế học sinh GHS03-1", "/images/categories/sub/ghe-hoc-sinh.webp", "/san-pham/ghs03-1-ban-ghe-hoc-sinh-bhs03-1-ghs03-1"],
        ["TMG984-3K", "Tủ trường học TMG984-3K", "/images/categories/sub/tu-truong-hoc.webp", "/san-pham/tmg984-3k-tu-truong-hoc-tmg984-3k"]
      ]
    },
    {
      slug: "ke-gia-kho",
      name: "Kệ & Giá kho",
      description: "Kệ sắt, giá kho, kệ lưu trữ và phụ kiện sắp xếp hồ sơ, chìa khóa, vật tư văn phòng.",
      image: "/images/categories/main/ke-gia-kho.webp",
      subs: [["ke-sat", "Kệ sắt"], ["gia-kho", "Giá kho"], ["ke-luu-tru", "Kệ lưu trữ"], ["tu-ho-so", "Tủ hồ sơ"]],
      products: [
        ["TK60", "Tủ treo chìa khóa TK60", "/images/categories/sub/ke-sat.webp", "/san-pham/tk60-tu-treo-chia-khoa-tk60"],
        ["TK100", "Tủ treo chìa khóa TK100", "/images/categories/sub/gia-kho.webp", "/san-pham/tk100-tu-treo-chia-khoa-tk100"],
        ["TK200", "Tủ treo chìa khóa TK200", "/images/categories/main/ke-gia-kho.webp", "/san-pham/tk200-tu-treo-chia-khoa-tk200"],
        ["TU981-3KD", "Tủ lưu trữ TU981-3KD", "/images/categories/sub/ke-luu-tru.webp", "/san-pham/tu981-3kd-tu-sat-tu981-3kd"]
      ]
    }
  ];

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }

  function currentCategorySlug() {
    const params = new URLSearchParams(location.search);
    const byCat = params.get("cat");
    if (byCat) return byCat;
    const parts = location.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("danh-muc");
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    return "ghe-van-phong";
  }

  function findCategory(slug) {
    return CATEGORY_LIBRARY.find((item) => item.slug === slug || (item.aliases || []).includes(slug)) || CATEGORY_LIBRARY[0];
  }

  function productCard(product) {
    const [code, name, image, href] = product;
    return `<a class="product-card" href="${escapeHtml(href)}"><img src="${escapeHtml(image)}" alt="${escapeHtml(name)}" width="260" height="186" loading="lazy" decoding="async"><div><small>${escapeHtml(code)}</small><h3>${escapeHtml(name)}</h3><p>Liên hệ báo giá</p><span>Nhận tư vấn</span></div></a>`;
  }

  function renderCategoryPage() {
    const page = $("[data-category-page]");
    if (!page) return;
    const category = findCategory(currentCategorySlug());
    document.title = `${category.name} | BA_Furniture`;
    const desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", `${category.name} BA_Furniture. ${category.description} Tư vấn và báo giá theo nhu cầu doanh nghiệp, trường học và dự án.`);
    const canonical = $('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", `https://bafurni.com/danh-muc/${category.slug}`);
    const title = $("[data-category-title]");
    const breadcrumb = $("[data-category-breadcrumb]");
    const description = $("[data-category-description]");
    const listingTitle = $("[data-listing-title]");
    const heroImage = $("[data-category-hero-image]");
    if (title) title.textContent = category.name;
    if (breadcrumb) breadcrumb.textContent = category.name;
    if (description) description.textContent = category.description;
    if (listingTitle) listingTitle.textContent = `${category.name} BA_Furniture`;
    if (heroImage) {
      heroImage.src = category.image;
      heroImage.alt = `Danh mục ${category.name} BA_Furniture`;
    }
    const subGrid = $("[data-subcategory-grid]");
    if (subGrid) {
      subGrid.innerHTML = category.subs.map(([slug, name]) => `<a href="/category.html?cat=${escapeHtml(category.slug)}&sub=${escapeHtml(slug)}"><img src="/images/categories/sub/${escapeHtml(slug)}.webp" alt="${escapeHtml(name)}" width="260" height="186" loading="lazy" decoding="async"><span>${escapeHtml(name)}</span></a>`).join("");
    }
    const productGrid = $("[data-product-grid]");
    if (productGrid) {
      productGrid.innerHTML = category.products.map(productCard).join("");
    }
    const related = $("[data-related-categories]");
    if (related) {
      related.innerHTML = CATEGORY_LIBRARY.filter((item) => item.slug !== category.slug).slice(0, 4).map((item) => `<a class="category-card" href="/danh-muc/${escapeHtml(item.slug)}"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" width="480" height="320" decoding="async"><span>${escapeHtml(item.name)}</span><p>${escapeHtml(item.description)}</p><em>Xem danh mục</em></a>`).join("");
    }
  }

  function initNavigation() {
    const toggle = $(".menu-toggle");
    const nav = $("#site-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        nav.classList.toggle("is-open", !open);
      });
    }
    const catalog = $(".nav-catalog");
    const mega = $("#mega-menu");
    if (catalog && mega) {
      catalog.addEventListener("click", () => {
        const open = catalog.getAttribute("aria-expanded") === "true";
        catalog.setAttribute("aria-expanded", String(!open));
        catalog.classList.toggle("is-open", !open);
        mega.classList.toggle("is-open", !open);
      });
    }
  }

  function initSearchAndFilter() {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    const searchInput = $('.site-search input[name="q"]');
    if (q && searchInput) searchInput.value = q;
    const filter = $("#category-filter");
    const cards = () => Array.from(document.querySelectorAll(".product-grid--listing .product-card"));
    const empty = $(".empty-state");
    function applyFilter(value) {
      const query = (value || "").trim().toLowerCase();
      let shown = 0;
      cards().forEach((card) => {
        const match = !query || card.innerText.toLowerCase().includes(query);
        card.hidden = !match;
        if (match) shown += 1;
      });
      if (empty) empty.hidden = shown !== 0;
    }
    if (filter) {
      if (q) filter.value = q;
      filter.addEventListener("input", (event) => applyFilter(event.target.value));
      applyFilter(filter.value);
    }
  }

  renderCategoryPage();
  initNavigation();
  initSearchAndFilter();
  window.BA_CATEGORY_LIBRARY = CATEGORY_LIBRARY;
})();

