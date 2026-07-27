(() => {
  if (window.BASiteShell) return;

  const PHONE_DISPLAY = "0929.878.666";
  const PHONE_HREF = "tel:0929878666";

  function clean(value) {
    return String(value == null ? "" : value).trim();
  }

  function escapeHtml(value) {
    return clean(value).replace(/[&<>"]/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;"
    }[character]));
  }

  function pageContext() {
    const body = document.body;
    const pageType = clean(body.dataset.pageType || "homepage");
    return {
      pageType,
      source: clean(body.dataset.leadSource || `bafurni-${pageType.replaceAll("_", "-")}`),
      productCode: clean(body.dataset.productCode),
      productName: clean(body.dataset.productName),
      categoryName: clean(body.dataset.categoryName)
    };
  }

  function headerTemplate() {
    return `
      <header class="pf-header" data-shared-component="SiteHeader">
        <a class="pf-brand" href="/" aria-label="BA_Furniture trang chủ">
          <img src="/images/brand/ba-furniture-logo.jpg" alt="BA_Furniture" width="1254" height="1254" fetchpriority="high" />
          <span>BA_Furniture</span>
        </a>
        <button class="pf-menu nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="Mở menu">
          <span></span><span></span><span></span>
        </button>
        <nav id="main-nav" class="pf-nav main-nav" aria-label="Điều hướng chính">
          <a href="/#categories">Danh mục</a>
          <a href="/#featured">Sản phẩm</a>
          <a href="/#solutions">Giải pháp</a>
          <a href="/#projects">Dự án</a>
          <a href="/#contact">Liên hệ</a>
        </nav>
        <form class="pf-search" action="/category.html" role="search">
          <label class="pf-sr-only" for="site-search">Tìm sản phẩm</label>
          <input id="site-search" name="q" type="search" placeholder="Tìm ghế, bàn, tủ..." />
        </form>
        <a class="pf-hotline" href="${PHONE_HREF}"><span>Hotline</span><strong>${PHONE_DISPLAY}</strong></a>
        <button class="pf-quote-button" type="button" data-open-wizard>Nhận báo giá</button>
      </header>
    `;
  }

  function stickyTemplate() {
    return `
      <aside class="v7-sticky-cta pf-sticky" aria-label="Liên hệ nhanh" data-shared-component="StickyQuoteCTA">
        <div><span>Cần phương án nội thất?</span><strong>Gửi nhu cầu trong 60 giây</strong></div>
        <button type="button" data-open-wizard>Nhận báo giá</button>
        <a href="${PHONE_HREF}">Gọi ${PHONE_DISPLAY}</a>
      </aside>
    `;
  }

  function footerTemplate() {
    return `
      <footer class="pf-footer" data-shared-component="SiteFooter">
        <div class="pf-footer-brand">
          <a class="pf-brand" href="/" aria-label="BA_Furniture trang chủ">
            <img src="/images/brand/ba-furniture-logo.jpg" alt="BA_Furniture" width="1254" height="1254" loading="lazy" />
            <span>BA_Furniture</span>
          </a>
          <p>Nội thất đồng bộ cho tổ chức và dự án.</p>
        </div>
        <div>
          <strong>Sản phẩm</strong>
          <a href="/danh-muc/ghe-van-phong">Ghế văn phòng</a>
          <a href="/danh-muc/ban-van-phong">Bàn văn phòng</a>
          <a href="/danh-muc/tu-ho-so">Tủ hồ sơ</a>
        </div>
        <div>
          <strong>BA_Furniture</strong>
          <a href="/case-studies.html">Hồ sơ dự án</a>
          <a href="/#solutions">Giải pháp</a>
          <a href="/#contact">Liên hệ</a>
        </div>
        <div>
          <strong>Tư vấn</strong>
          <a href="${PHONE_HREF}">${PHONE_DISPLAY}</a>
          <button type="button" data-open-wizard>Nhận báo giá</button>
        </div>
        <p class="pf-copyright">© 2026 BA_Furniture. All rights reserved.</p>
      </footer>
    `;
  }

  function wizardTemplate(context) {
    return `
      <dialog id="quote-wizard" class="v7-wizard" aria-labelledby="wizard-title" data-shared-component="QuoteWizard">
        <div class="v7-wizard-shell">
          <header class="v7-wizard-header">
            <div>
              <p class="v6-kicker">BA_Furniture Quote Wizard</p>
              <h2 id="wizard-title">Cho chúng tôi biết nhu cầu của bạn.</h2>
            </div>
            <button class="v7-wizard-close" type="button" data-close-wizard aria-label="Đóng biểu mẫu">Đóng</button>
          </header>
          <div class="v7-wizard-progress" aria-label="Tiến trình gửi nhu cầu">
            <span class="is-active" data-progress="1">01 Nhu cầu</span>
            <span data-progress="2">02 Quy mô</span>
            <span data-progress="3">03 Liên hệ</span>
          </div>
          <form id="quote-form" novalidate>
            <section class="v7-wizard-step is-active" data-step="1" aria-labelledby="wizard-step-1">
              <p class="v7-step-count">Bước 1 / 3</p>
              <h3 id="wizard-step-1" tabindex="-1">Bạn đang cần nội thất cho đâu?</h3>
              <div class="v7-quick-lead">
                <div><strong>Cần tư vấn ngay?</strong><span>Chỉ để lại số điện thoại, BA_Furniture sẽ gọi lại.</span></div>
                <label>
                  <span class="v7-visually-hidden">Số điện thoại nhận tư vấn</span>
                  <input name="quick_phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Số điện thoại của bạn" />
                </label>
                <button type="button" data-quick-submit>Gửi số điện thoại</button>
              </div>
              <p class="v7-quick-privacy">Khi gửi số điện thoại, bạn đồng ý để BA_Furniture liên hệ tư vấn.</p>
              <p class="v7-field-error" data-error="quick" role="alert"></p>
              <div class="v7-choice-grid">
                <button type="button" class="v7-choice" data-field="need_type" data-value="office"><strong>Văn phòng doanh nghiệp</strong><span>Nơi làm việc, phòng họp, lãnh đạo</span></button>
                <button type="button" class="v7-choice" data-field="need_type" data-value="school"><strong>Trường học & đào tạo</strong><span>Lớp học, thư viện, phòng chức năng</span></button>
                <button type="button" class="v7-choice" data-field="need_type" data-value="factory"><strong>Nhà máy & công nghiệp</strong><span>Locker, lưu trữ, văn phòng điều hành</span></button>
                <button type="button" class="v7-choice" data-field="need_type" data-value="project"><strong>Dự án & công trình</strong><span>Cung ứng theo khối lượng và tiến độ</span></button>
              </div>
              <p class="v7-field-error" data-error="need_type" role="alert"></p>
            </section>
            <section class="v7-wizard-step" data-step="2" aria-labelledby="wizard-step-2" hidden>
              <p class="v7-step-count">Bước 2 / 3</p>
              <h3 id="wizard-step-2" tabindex="-1">Quy mô và thời gian dự kiến?</h3>
              <div class="v7-field-grid">
                <label><span>Loại khách hàng</span><select name="org_type" required><option value="">Chọn loại khách hàng</option><option value="business">Doanh nghiệp</option><option value="contractor">Chủ đầu tư / Nhà thầu</option><option value="school">Trường học / Đơn vị công</option><option value="individual">Cá nhân / Hộ kinh doanh</option></select></label>
                <label><span>Số lượng dự kiến</span><select name="quantity" required><option value="">Chọn quy mô</option><option value="under10">Dưới 10 sản phẩm</option><option value="10-29">10–29 sản phẩm</option><option value="30-99">30–99 sản phẩm</option><option value="100plus">Từ 100 sản phẩm</option></select></label>
                <label><span>Thời gian cần hàng</span><select name="timeline" required><option value="">Chọn thời gian</option><option value="30days">Trong 30 ngày</option><option value="1-3months">1–3 tháng</option><option value="3plus">Trên 3 tháng</option><option value="researching">Đang tìm hiểu</option></select></label>
                <label><span>Ngân sách dự kiến</span><select name="budget"><option value="unknown">Cần tư vấn</option><option value="under50">Dưới 50 triệu</option><option value="50-200">50–200 triệu</option><option value="200-500">200–500 triệu</option><option value="500plus">Trên 500 triệu</option></select></label>
                <label class="v7-field-wide"><span>Khu vực triển khai</span><input name="region" autocomplete="address-level1" placeholder="Ví dụ: Nam Định, Hà Nội..." required /></label>
              </div>
              <p class="v7-field-error" data-error="step2" role="alert"></p>
              <div class="v7-wizard-nav"><button type="button" data-prev-step>Quay lại</button><button type="button" class="v7-next" data-next-step>Tiếp tục</button></div>
            </section>
            <section class="v7-wizard-step" data-step="3" aria-labelledby="wizard-step-3" hidden>
              <p class="v7-step-count">Bước 3 / 3</p>
              <h3 id="wizard-step-3" tabindex="-1">Thông tin để BA_Furniture liên hệ.</h3>
              <div class="v7-field-grid">
                <label><span>Họ và tên</span><input name="name" autocomplete="name" placeholder="Nguyễn Văn A" required /></label>
                <label><span>Số điện thoại</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="09xx xxx xxx" required /></label>
                <label class="v7-field-wide"><span>Doanh nghiệp / Đơn vị</span><input name="company" autocomplete="organization" placeholder="Tên đơn vị (không bắt buộc)" /></label>
                <label class="v7-field-wide"><span>Ghi chú nhu cầu</span><textarea name="note" rows="3" placeholder="Diện tích, hạng mục ưu tiên hoặc yêu cầu đặc biệt..."></textarea></label>
              </div>
              <label class="v7-consent"><input name="consent" type="checkbox" required /><span>Tôi đồng ý để BA_Furniture liên hệ tư vấn về nhu cầu đã gửi.</span></label>
              <label class="v7-honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off" /></label>
              <input type="hidden" name="need_type" />
              <input type="hidden" name="lead_score" />
              <input type="hidden" name="lead_tier" />
              <input type="hidden" name="source" value="${escapeHtml(context.source)}" />
              <input type="hidden" name="source_page" value="${escapeHtml(context.pageType)}" />
              <input type="hidden" name="product_code" value="${escapeHtml(context.productCode)}" />
              <input type="hidden" name="product_name" value="${escapeHtml(context.productName)}" />
              <input type="hidden" name="category_name" value="${escapeHtml(context.categoryName)}" />
              <p class="v7-field-error" data-error="submit" role="alert"></p>
              <div class="v7-wizard-nav"><button type="button" data-prev-step>Quay lại</button><button type="submit" class="v7-next">Gửi nhu cầu</button></div>
            </section>
            <section class="v7-wizard-success" data-wizard-success hidden aria-live="polite">
              <p class="v6-kicker">Đã ghi nhận nhu cầu</p>
              <h3>Cảm ơn bạn đã liên hệ BA_Furniture.</h3>
              <p>Đội ngũ tư vấn sẽ liên hệ theo số điện thoại bạn cung cấp trong giờ làm việc.</p>
              <div><button type="button" data-close-wizard>Hoàn tất</button><a href="${PHONE_HREF}">Gọi ngay ${PHONE_DISPLAY}</a></div>
            </section>
          </form>
        </div>
      </dialog>
    `;
  }

  function replaceHost(selector, markup) {
    const host = document.querySelector(selector);
    if (!host) return false;
    host.insertAdjacentHTML("beforebegin", markup);
    host.remove();
    return true;
  }

  function bindMenu() {
    const toggle = document.querySelector(".pf-header .nav-toggle");
    const navigation = document.querySelector(".pf-header .main-nav");
    if (!toggle || !navigation || toggle.dataset.sharedBound === "true") return;
    toggle.dataset.sharedBound = "true";
    toggle.addEventListener("click", () => {
      const open = navigation.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
    });
    navigation.addEventListener("click", (event) => {
      if (!(event.target instanceof HTMLAnchorElement)) return;
      navigation.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Mở menu");
    });
  }

  function prefillSearch() {
    const field = document.querySelector('.pf-search input[name="q"]');
    if (!field) return;
    field.value = new URLSearchParams(window.location.search).get("q") || "";
  }

  function setContext(next = {}) {
    const body = document.body;
    if (next.pageType) body.dataset.pageType = clean(next.pageType);
    if (next.source) body.dataset.leadSource = clean(next.source);
    if (next.productCode != null) body.dataset.productCode = clean(next.productCode);
    if (next.productName != null) body.dataset.productName = clean(next.productName);
    if (next.categoryName != null) body.dataset.categoryName = clean(next.categoryName);

    const context = pageContext();
    const values = {
      source: context.source,
      source_page: context.pageType,
      product_code: context.productCode,
      product_name: context.productName,
      category_name: context.categoryName
    };
    const form = document.querySelector("#quote-form");
    Object.entries(values).forEach(([name, value]) => {
      const field = form?.elements?.namedItem(name);
      if (!field) return;
      field.value = value;
      field.defaultValue = value;
    });
    return context;
  }

  function mount() {
    const context = pageContext();
    const announcement = document.querySelector("[data-site-announcement]");
    let mounted = false;
    if (announcement) {
      announcement.className = "pf-announcement";
      announcement.dataset.sharedComponent = "SiteAnnouncement";
      announcement.textContent = `Tư vấn cấu hình và báo giá theo số lượng · Hotline ${PHONE_DISPLAY}`;
      mounted = true;
    }
    mounted = replaceHost("[data-site-header]", headerTemplate()) || mounted;
    mounted = replaceHost("[data-site-sticky]", stickyTemplate()) || mounted;
    mounted = replaceHost("[data-site-wizard]", wizardTemplate(context)) || mounted;
    mounted = replaceHost("[data-site-footer]", footerTemplate()) || mounted;
    if (mounted) {
      document.documentElement.dataset.sharedShell = "ready";
      bindMenu();
      prefillSearch();
      setContext(context);
    } else if (document.querySelector(".pf-header, .pf-footer, #quote-wizard")) {
      document.documentElement.dataset.sharedShell = "homepage-reference";
    }
    return mounted;
  }

  window.BASiteShell = {
    mount,
    setContext,
    context: pageContext,
    components: {
      SiteAnnouncement: "pf-announcement",
      SiteHeader: "pf-header",
      BrandLogo: "/images/brand/ba-furniture-logo.jpg",
      DesktopNavigation: "pf-nav",
      MobileNavigation: "pf-menu",
      SiteFooter: "pf-footer",
      StickyQuoteCTA: "pf-sticky",
      QuoteWizard: "v7-wizard"
    }
  };

  mount();
})();
