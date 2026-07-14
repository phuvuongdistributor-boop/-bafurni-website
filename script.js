(() => {
  const CATEGORY_LIBRARY = [
    { slug: "ghe-van-phong", name: "Ghế văn phòng", description: "Ghế làm việc cho văn phòng, phòng họp và khu chờ.", image: "/images/categories/main/ghe-van-phong.webp", subs: [["ghe-giam-doc", "Ghế giám đốc"], ["ghe-leader", "Ghế leader"], ["ghe-luoi", "Ghế lưới"], ["ghe-chan-quy", "Ghế chân quỳ"], ["ghe-da", "Ghế da"], ["ghe-training", "Ghế training"], ["ghe-bar-cafe", "Ghế bar/cafe"], ["ghe-xoay", "Ghế xoay"]], products: [["TQ05", "Ghế giám đốc TQ05", "/images/categories/sub/ghe-giam-doc.webp", "/san-pham/tq05-ghe-giam-doc-tq05"], ["TQ01", "Ghế giám đốc TQ01", "/images/categories/sub/ghe-da.webp", "/san-pham/tq01-ghe-giam-doc-tq01"], ["GL304", "Ghế lưới cao cấp GL304", "/images/categories/sub/ghe-luoi.webp", "/san-pham/gl304-ghe-luoi-cao-cap-gl304"], ["GL307", "Ghế lưới cao cấp GL307", "/images/categories/sub/ghe-leader.webp", "/san-pham/gl307-ghe-luoi-cao-cap-gl307"], ["VT3B", "Ghế họp chân tĩnh VT3B", "/images/categories/sub/ghe-chan-quy.webp", "/san-pham/vt3b-ghe-hop-chan-tinh-vt3b"], ["SL933", "Ghế chân quỳ SL933", "/images/categories/sub/ghe-phong-hop.webp", "/san-pham/sl933-ghe-chan-quy-sl933"], ["TQ33", "Ghế xoay văn phòng TQ33", "/images/categories/sub/ghe-xoay.webp", "/san-pham/tq33-ghe-xoay-van-phong-tq33"], ["GL316", "Ghế lưới văn phòng GL316", "/images/categories/sub/ghe-luoi.webp", "/san-pham/gl316-ghe-luoi-van-phong-gl316"]] },
    { slug: "ban-van-phong", name: "Bàn văn phòng", description: "Bàn cá nhân, bàn quản lý và cụm làm việc.", image: "/images/categories/main/ban-van-phong.webp", subs: [["ban-nhan-vien", "Bàn nhân viên"], ["ban-quan-ly", "Bàn quản lý"], ["ban-giam-doc", "Bàn giám đốc"], ["ban-cum-module", "Cụm bàn"], ["ban-may-tinh", "Bàn máy tính"], ["ban-lam-viec", "Bàn làm việc"]], products: [["BRIMD01-4C15", "Cụm bàn làm việc BRIMD01-4C15", "/images/categories/sub/ban-cum-module.webp", "/san-pham/brimd01-4c15-module-ban-lam-viec-brimd01-4c15"], ["DT1890V2", "Bàn giám đốc Veneer DT1890V2", "/images/categories/sub/ban-giam-doc.webp", "/san-pham/dt1890v2-ban-giam-doc-veneer-dt1890v2"], ["LUXL14C10", "Bàn quản lý LUXL14C10", "/images/categories/sub/ban-quan-ly.webp", "/san-pham/luxl14c10-ban-lanh-dao-luxl14c10"], ["NTM120S", "Bàn máy tính NTM120S", "/images/categories/sub/ban-may-tinh.webp", "/san-pham/ntm120s-ban-may-tinh-ntm120s"]] },
    { slug: "ban-hop", name: "Bàn họp", description: "Bàn họp gọn cho nhóm và dự án.", image: "/images/categories/main/ban-hop.webp", subs: [["ban-hop-lon", "Bàn họp lớn"], ["ban-hop-nho", "Bàn họp nhỏ"], ["ban-hop-oval", "Bàn họp oval"], ["ban-hoi-truong", "Bàn hội trường"]], products: [["CT2412V1", "Bàn họp gỗ cao cấp CT2412V1", "/images/categories/sub/ban-hop-nho.webp", "/san-pham/ct2412v1-ban-hop-go-cao-cap-ct2412v1"], ["CT4016V19", "Bàn họp cao cấp CT4016V19", "/images/categories/sub/ban-hop-lon.webp", "/san-pham/ct4016v19-ban-hop-cao-cap-ct4016v19"], ["CT2010H2", "Bàn họp cao cấp CT2010H2", "/images/categories/sub/ban-hop-oval.webp", "/san-pham/ct2010h2-ban-hop-cao-cap-ct2010h2"], ["TC336", "Bàn hội trường TC336", "/images/categories/sub/ban-hoi-truong.webp", "/san-pham/tc336-ban-hoi-truong-tc336"]] },
    { slug: "tu-hoc", aliases: ["tu-hoc-tai-lieu"], name: "Tủ & Hộc tài liệu", description: "Lưu trữ hồ sơ và vật dụng văn phòng.", image: "/images/categories/main/tu-hoc-tai-lieu.webp", subs: [["tu-tai-lieu", "Tủ tài liệu"], ["tu-ho-so", "Tủ hồ sơ"], ["hoc-di-dong", "Hộc di động"], ["tu-thap", "Tủ thấp"], ["tu-sat", "Tủ sắt"], ["tu-locker", "Tủ locker"]], products: [["TU09K7CK", "Tủ sắt hồ sơ TU09K7CK", "/images/categories/sub/tu-ho-so.webp", "/san-pham/tu09k7ck-tu-sat-ho-so-tu09k7ck"], ["TU06AD", "Tủ thấp TU06AD", "/images/categories/sub/tu-thap.webp", "/san-pham/tu06ad-tu-thap-tu06ad"], ["HS1", "Hộc sắt HS1", "/images/categories/sub/hoc-di-dong.webp", "/san-pham/hs1-hoc-sat-hs1"], ["TU09", "Tủ tài liệu TU09", "/images/categories/sub/tu-tai-lieu.webp", "/san-pham/tu09-tu-tai-lieu-tu09"]] },
    { slug: "locker", name: "Locker", description: "Tủ cá nhân cho văn phòng và nhà máy.", image: "/images/categories/main/tu-locker.webp", subs: [["tu-locker", "Tủ locker"], ["tu-sat", "Tủ sắt"], ["tu-ho-so", "Tủ hồ sơ"], ["tu-truong-hoc", "Tủ trường học"]], products: [["TU983-3KS", "Tủ locker khóa số 9 ngăn TU983-3KS", "/images/categories/sub/tu-locker.webp", "/san-pham/tu983-3ks-tu-locker-khoa-so-9-ngan-tu983-3ks"], ["TU981-2K", "Tủ locker TU981-2K", "/images/categories/main/tu-locker.webp", "/san-pham/tu981-2k-tu-locker-tu981-2k"], ["TU982", "Tủ sắt 6 ngăn TU982", "/images/categories/sub/tu-sat.webp", "/san-pham/tu982-tu-sat-6-ngan-tu982-3kp"], ["TU09K8CK", "Tủ sắt hồ sơ TU09K8CK", "/images/categories/sub/tu-ho-so.webp", "/san-pham/tu09k8ck-tu-sat-ho-so-tu09k8ck"]] },
    { slug: "sofa", name: "Sofa & Ghế chờ", description: "Khu tiếp khách, sảnh và phòng chờ.", image: "/images/categories/main/sofa-ghe-cho.webp", subs: [["sofa-van-phong", "Sofa văn phòng"], ["sofa-sanh", "Sofa sảnh"], ["ghe-lounge", "Ghế lounge"], ["ghe-cho", "Ghế chờ"]], products: [["SF01", "Sofa văn phòng SF01", "/images/categories/sub/sofa-van-phong.webp", "/san-pham/sf01-sofa-van-phong-sf01"], ["SF02", "Sofa văn phòng SF02", "/images/categories/sub/sofa-sanh.webp", "/san-pham/sf02-sofa-van-phong-sf02"], ["SF01-1", "Ghế sofa đơn SF01-1", "/images/categories/sub/ghe-lounge.webp", "/san-pham/sf01-1-ghe-sofa-don-sf01-1"], ["SF01-3", "Ghế sofa băng SF01-3", "/images/categories/sub/ghe-cho.webp", "/san-pham/sf01-3-ghe-sofa-bang-sf01-3"]] },
    { slug: "truong-hoc", name: "Nội thất trường học", description: "Bàn ghế cho lớp học và phòng chức năng.", image: "/images/categories/main/noi-that-truong-hoc.webp", subs: [["ban-hoc-sinh", "Bàn học sinh"], ["ghe-hoc-sinh", "Ghế học sinh"], ["ban-giao-vien", "Bàn giáo viên"], ["noi-that-mam-non", "Nội thất mầm non"], ["tu-truong-hoc", "Tủ trường học"], ["ban-ghe-dao-tao", "Bàn ghế đào tạo"]], products: [["BHS03-1", "Bàn ghế học sinh BHS03-1", "/images/categories/sub/ban-hoc-sinh.webp", "/san-pham/bhs03-1-ban-ghe-hoc-sinh-bhs03-1-ghs03-1"], ["GMG101A-2", "Nội thất trường học GMG101A-2", "/images/categories/sub/ban-giao-vien.webp", "/san-pham/gmg101a-2-noi-that-truong-hoc-gmg101a-2"], ["GHS03-1", "Ghế học sinh GHS03-1", "/images/categories/sub/ghe-hoc-sinh.webp", "/san-pham/ghs03-1-ban-ghe-hoc-sinh-bhs03-1-ghs03-1"], ["TMG984-3K", "Tủ trường học TMG984-3K", "/images/categories/sub/tu-truong-hoc.webp", "/san-pham/tmg984-3k-tu-truong-hoc-tmg984-3k"]] },
    { slug: "ke-gia-kho", name: "Kệ & Giá kho", description: "Kệ lưu trữ cho kho và hồ sơ.", image: "/images/categories/main/ke-gia-kho.webp", subs: [["ke-sat", "Kệ sắt"], ["gia-kho", "Giá kho"], ["ke-luu-tru", "Kệ lưu trữ"], ["tu-ho-so", "Tủ hồ sơ"]], products: [["TK60", "Tủ treo chìa khóa TK60", "/images/categories/sub/ke-sat.webp", "/san-pham/tk60-tu-treo-chia-khoa-tk60"], ["TK100", "Tủ treo chìa khóa TK100", "/images/categories/sub/gia-kho.webp", "/san-pham/tk100-tu-treo-chia-khoa-tk100"], ["TK200", "Tủ treo chìa khóa TK200", "/images/categories/main/ke-gia-kho.webp", "/san-pham/tk200-tu-treo-chia-khoa-tk200"], ["TU981-3KD", "Tủ lưu trữ TU981-3KD", "/images/categories/sub/ke-luu-tru.webp", "/san-pham/tu981-3kd-tu-sat-tu981-3kd"]] }
  ];

  const tickerItems = ["Nam Định • Ninh Bình • Hà Nam • Hưng Yên • Thái Bình", "Tư vấn • Sản xuất • Giao lắp", "Báo giá rõ • Bảo hành uy tín", "Văn phòng • Trường học • Nhà máy • Dự án", "Hotline: 0929.878.666"];
  const cardDescriptions = CATEGORY_LIBRARY.map((item) => item.description);
  const $ = (selector, root = document) => root.querySelector(selector);
  const $all = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const esc = (value) => String(value == null ? "" : value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  const ready = (fn) => document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fn, { once: true }) : fn();
  const setText = (selector, value, root = document) => { const el = $(selector, root); if (el && el.textContent.trim() !== value) el.textContent = value; };

  function categoryImageBase(image) { return String(image || "").replace(/-(720|1200)\.webp$/, "").replace(/\.webp$/, ""); }
  function categoryImageUrl(image, size = "720") { return `${categoryImageBase(image)}-${size}.webp`; }
  function categoryImageSrcset(image) { return `${categoryImageBase(image)}-720.webp 720w`; }
  function categoryImageSizes() { return "(max-width: 620px) calc(100vw - 44px), (max-width: 980px) 50vw, 360px"; }
  function currentCategorySlug() { const params = new URLSearchParams(location.search); const byCat = params.get("cat"); if (byCat) return byCat; const parts = location.pathname.split("/").filter(Boolean); const idx = parts.indexOf("danh-muc"); return idx >= 0 && parts[idx + 1] ? parts[idx + 1] : "ghe-van-phong"; }
  function findCategory(slug) { return CATEGORY_LIBRARY.find((item) => item.slug === slug || (item.aliases || []).includes(slug)) || CATEGORY_LIBRARY[0]; }
  function compactWords(text, maxWords = 52) { const words = String(text || "").trim().split(/\s+/).filter(Boolean); return words.length > maxWords ? `${words.slice(0, maxWords).join(" ")}...` : words.join(" "); }

  function loadCss() {
    if (document.querySelector('link[href*="typography-v44.css"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/typography-v44.css?v=2026-07-14-v44";
    document.head.appendChild(link);
  }

  function rewriteTicker() {
    $all(".ticker__group").forEach((group, groupIndex) => {
      group.innerHTML = tickerItems.map((text) => `<span class="ticker__item">${text.split(" • ").map((part, i) => `${i ? '<span class="ticker__dot" aria-hidden="true">•</span> ' : ""}${part}`).join(" ")}</span>`).join("");
      if (groupIndex > 0) group.setAttribute("aria-hidden", "true");
    });
  }

  function productCard(product) {
    const [code, name, image, href] = product;
    return `<a class="product-card" href="${esc(href)}"><img src="${esc(image)}" alt="${esc(name)}" width="260" height="186" loading="lazy" decoding="async"><div><small>${esc(code)}</small><h3>${esc(name)}</h3><p>Liên hệ báo giá</p><span>Nhận tư vấn</span></div></a>`;
  }

  function renderCategoryPage() {
    if (!$('[data-category-page]')) return;
    const category = findCategory(currentCategorySlug());
    document.title = `${category.name} | BA_Furniture`;
    const desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", `${category.name} BA_Furniture. ${category.description} Tư vấn và báo giá theo nhu cầu.`);
    const canonical = $('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", `https://bafurni.com/danh-muc/${category.slug}`);
    setText('[data-category-title]', category.name);
    setText('[data-category-breadcrumb]', category.name);
    setText('[data-category-description]', `${category.description} BA_Furniture tư vấn mẫu phù hợp theo nhu cầu sử dụng.`);
    setText('[data-listing-title]', category.name);
    const heroImage = $('[data-category-hero-image]');
    if (heroImage) {
      heroImage.src = categoryImageUrl(category.image);
      heroImage.srcset = categoryImageSrcset(category.image);
      heroImage.sizes = "(max-width: 980px) calc(100vw - 44px), 520px";
      heroImage.alt = `Danh mục ${category.name} BA_Furniture`;
    }
    const subGrid = $('[data-subcategory-grid]');
    if (subGrid) subGrid.innerHTML = category.subs.map(([slug, name]) => `<a href="/category.html?cat=${esc(category.slug)}&sub=${esc(slug)}"><img src="/images/categories/sub/${esc(slug)}.webp" alt="${esc(name)}" width="260" height="186" loading="lazy" decoding="async"><span>${esc(name)}</span></a>`).join("");
    const productGrid = $('[data-product-grid]');
    if (productGrid) productGrid.innerHTML = category.products.map(productCard).join("");
    const related = $('[data-related-categories]');
    if (related) related.innerHTML = CATEGORY_LIBRARY.filter((item) => item.slug !== category.slug).slice(0, 4).map((item) => `<a class="category-card" href="/danh-muc/${esc(item.slug)}"><img src="${esc(categoryImageUrl(item.image))}" srcset="${esc(categoryImageSrcset(item.image))}" sizes="${categoryImageSizes()}" alt="${esc(item.name)}" width="1200" height="900" decoding="async"><span>${esc(item.name)}</span><p>${esc(item.description)}</p><em>Xem danh mục</em></a>`).join("");
  }

  function initNavigation() {
    const toggle = $('.menu-toggle');
    const nav = $('#site-nav');
    const closeNav = () => { if (!toggle || !nav) return; toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); document.body.classList.remove("mobile-nav-open"); };
    if (toggle && nav) {
      toggle.addEventListener("click", () => { const open = toggle.getAttribute("aria-expanded") === "true"; toggle.setAttribute("aria-expanded", String(!open)); nav.classList.toggle("is-open", !open); document.body.classList.toggle("mobile-nav-open", !open); });
      nav.addEventListener("click", (event) => { if (event.target.closest("a")) closeNav(); });
      document.addEventListener("click", (event) => { if (toggle.getAttribute("aria-expanded") !== "true") return; if (nav.contains(event.target) || toggle.contains(event.target)) return; closeNav(); });
      document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeNav(); });
    }
    const catalog = $('.nav-catalog');
    const mega = $('#mega-menu');
    if (catalog && mega) catalog.addEventListener("click", () => { const open = catalog.getAttribute("aria-expanded") === "true"; catalog.setAttribute("aria-expanded", String(!open)); catalog.classList.toggle("is-open", !open); mega.classList.toggle("is-open", !open); });
  }

  function initSearchAndFilter() {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    const searchInput = $('.site-search input[name="q"]');
    if (q && searchInput) searchInput.value = q;
    const filter = $('#category-filter');
    const cards = () => $all('.product-grid--listing .product-card');
    const empty = $('.empty-state');
    function applyFilter(value) { const query = (value || "").trim().toLowerCase(); let shown = 0; cards().forEach((card) => { const match = !query || card.innerText.toLowerCase().includes(query); card.hidden = !match; if (match) shown += 1; }); if (empty) empty.hidden = shown !== 0; }
    if (filter) { if (q) filter.value = q; filter.placeholder = "Tên hoặc mã sản phẩm"; filter.addEventListener("input", (event) => applyFilter(event.target.value)); applyFilter(filter.value); }
  }

  function initMobileCta() {
    const bar = $('.mobile-cta-bar');
    if (!bar) return;
    const media = window.matchMedia("(max-width: 980px)");
    const update = () => document.body.classList.toggle("mobile-cta-visible", media.matches && window.scrollY > 260);
    update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update);
  }

  function rewriteHomepage() {
    if (!$('.commerce-hero')) return;
    setText('.hero__content .eyebrow', 'Nội thất văn phòng & dự án');
    setText('.hero__content h1', 'Nội thất đúng nhu cầu, đúng không gian');
    setText('.hero__lead', 'Bàn, ghế, tủ và giải pháp nội thất cho doanh nghiệp, trường học, nhà máy và công trình.');
    setText('.hero-card span', 'Đúng kích thước, màu sắc và chất liệu');
    setText('.category-showcase .section-heading .eyebrow', 'Danh mục');
    setText('.category-showcase .section-heading h2', 'Danh mục sản phẩm');
    setText('.category-showcase .section-heading p:not(.eyebrow)', 'Tìm nhanh theo nhu cầu sử dụng.');
    $all('.category-grid--storefront .category-card').forEach((card, i) => { const p = $('p', card); if (p && cardDescriptions[i]) p.textContent = cardDescriptions[i]; });
    setText('.featured-products .section-heading .eyebrow', 'Mẫu nổi bật');
    setText('.featured-products .section-heading h2', 'Sản phẩm nổi bật');
    setText('.featured-products .section-heading p:not(.eyebrow)', 'Các mẫu được khách hàng quan tâm.');
    setText('.solutions .split > div:first-child .eyebrow', 'Giải pháp');
    setText('.solutions .split > div:first-child h2', 'Giải pháp theo không gian');
    setText('.solutions .split > div:first-child p:not(.eyebrow)', 'Tư vấn theo nhu cầu, diện tích và ngân sách.');
    const trust = $('.trust');
    if (trust && !$('.trust .section-heading')) { const heading = document.createElement('div'); heading.className = 'container section-heading compact v44-trust-heading'; heading.innerHTML = '<p class="eyebrow">Cam kết</p><h2>Vì sao chọn BA_Furniture?</h2>'; trust.insertBefore(heading, trust.firstChild); }
    [['Luôn sát nhu cầu', 'Khách hàng ở đâu, BA_Furniture ở đó.'], ['Sản xuất theo yêu cầu', 'Đúng kích thước, màu sắc, chất liệu.'], ['Giải pháp trọn gói', 'Cho doanh nghiệp, trường học và dự án.'], ['Lựa chọn phù hợp', 'Từ sản phẩm tiêu chuẩn đến thiết kế riêng.']].forEach((copy, i) => { const card = $all('.trust-grid article')[i]; if (card) { setText('strong', copy[0], card); setText('span', copy[1], card); } });
    setText('.projects .split > div:first-child .eyebrow', 'Năng lực triển khai');
    setText('.projects .split > div:first-child h2', 'Năng lực triển khai');
    setText('.projects .split > div:first-child p:not(.eyebrow)', 'BA_Furniture tư vấn cấu hình, vật liệu, tiến độ và phương án giao lắp rõ ràng.');
    setText('.project-panel h3', 'Đủ nhóm sản phẩm chính');
    setText('.project-panel p', 'Ghế, bàn, tủ, locker, trường học và kệ kho.');
    setText('.service-area .eyebrow', 'Khu vực phục vụ');
    setText('.service-area h2', 'Khu vực phục vụ');
    setText('.service-area p:not(.eyebrow)', 'Nam Định, Hà Nam, Ninh Bình, Hưng Yên, Thái Bình và dự án theo kế hoạch.');
    const areaBox = $('.service-area__box > div');
    if (areaBox && !$('.area-chips', areaBox)) { const chips = document.createElement('div'); chips.className = 'area-chips'; chips.setAttribute('aria-label', 'Tỉnh thành phục vụ'); chips.innerHTML = '<span>Nam Định</span><span>Hà Nam</span><span>Ninh Bình</span><span>Hưng Yên</span><span>Thái Bình</span>'; areaBox.appendChild(chips); }
    setText('.service-area .btn', 'Gọi tư vấn');
  }

  function rewriteFinalCta() { $all('.final-cta').forEach((section) => { setText('.eyebrow', 'Báo giá', section); setText('h2', 'Cần tư vấn hoặc báo giá?', section); setText('p:not(.eyebrow)', 'Gửi nhu cầu, số lượng và thời gian cần hàng.', section); }); }

  function scrubVisibleText() {
    const replacements = [/ProductDB public readonly/g, /Nguồn dữ liệu/g, /Ảnh sản phẩm lấy từ ProductDB theo đúng mã/g, /Sản phẩm chưa có ảnh trong ProductDB\./g, /Thông tin trang được bind theo Code/g, /Đang đọc ProductDB\.\.\./g, /Đang tải dữ liệu sản phẩm\.\.\./g, /Chưa thể tải ProductDB/g, /URL này không khớp với bản ghi ProductDB đang public\. BA_Furniture không hiển thị sản phẩm mẫu thay thế để tránh nhầm thông tin báo giá\./g, /Module bàn làm việc/g, /module bàn làm việc/g, /Bàn cụm\/module/g];
    const values = ['Theo số lượng', 'Báo giá', 'Ảnh sản phẩm theo mã', 'Sản phẩm đang cập nhật ảnh.', 'Tra cứu và báo giá theo mã', 'Đang tải sản phẩm...', 'Đang tải sản phẩm...', 'Chưa thể tải sản phẩm', 'URL này chưa khớp với sản phẩm đang có trên website. Gọi BA_Furniture để được tư vấn đúng mã cần tìm.', 'Cụm bàn làm việc', 'cụm làm việc', 'Cụm bàn'];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode(node) { const parent = node.parentElement; if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT; return /ProductDB|bind|Module|module|Nguồn dữ liệu|Đang đọc|Đang tải dữ liệu/.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP; } });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => { let value = node.nodeValue; replacements.forEach((re, i) => { value = value.replace(re, values[i]); }); if (value !== node.nodeValue) node.nodeValue = value; });
    $all('.product-desc').forEach((el) => { el.textContent = compactWords(el.textContent, 52); });
  }

  function applyV44() { loadCss(); rewriteTicker(); rewriteHomepage(); rewriteFinalCta(); scrubVisibleText(); }

  ready(() => {
    renderCategoryPage();
    initNavigation();
    initSearchAndFilter();
    initMobileCta();
    window.BA_CATEGORY_LIBRARY = CATEGORY_LIBRARY;
    applyV44();
    [120, 650, 1600, 3200].forEach((delay) => setTimeout(applyV44, delay));
    let queued = false;
    const observer = new MutationObserver(() => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; applyV44(); }); });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  });
})();
