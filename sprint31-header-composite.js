(function () {
  const portalUrl = "https://portal.bafurni.com";
  const hotlineRaw = "0929878666";
  const hotlineText = "0929.878.666";

  const typeById = {
    OFFICE_CHAIR: "chair",
    OFFICE_DESK: "desk",
    MEETING_TABLE: "meeting",
    CABINET_STORAGE: "cabinet",
    LOCKER_STEEL: "locker",
    SOFA_WAITING: "sofa",
    SCHOOL_FURNITURE: "school",
    SHELVING_RACK: "rack",
    PUBLIC_PROJECT: "project",
    MEDICAL_FURNITURE: "medical",
    HOME_UTILITY: "utility",
    PARTITION_ACCESSORY: "partition"
  };

  function escapeHTML(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function typeFromText(text) {
    const value = String(text || "").toLowerCase();
    if (value.includes("ghế")) return "chair";
    if (value.includes("bàn họp")) return "meeting";
    if (value.includes("bàn")) return "desk";
    if (value.includes("locker")) return "locker";
    if (value.includes("tủ")) return "cabinet";
    if (value.includes("sofa")) return "sofa";
    if (value.includes("trường")) return "school";
    if (value.includes("kệ") || value.includes("giá")) return "rack";
    if (value.includes("công trình")) return "project";
    if (value.includes("y tế")) return "medical";
    if (value.includes("vách")) return "partition";
    return "utility";
  }

  function compositeMarkup(name, type, variant = "card") {
    return `
      <div class="s31-category-composite s31-category-composite--${escapeHTML(type)} s31-category-composite--${escapeHTML(variant)}" aria-label="Composite danh mục ${escapeHTML(name)}">
        <span class="s31-category-composite__brand">BA_Furniture</span>
        <strong class="s31-category-composite__title">${escapeHTML(name)}</strong>
        <span class="s31-category-composite__caption">Composite sản phẩm</span>
        <span class="s31-category-composite__stage" aria-hidden="true">
          <span class="s31-category-composite__product s31-category-composite__product--1"><span></span></span>
          <span class="s31-category-composite__product s31-category-composite__product--2"><span></span></span>
          <span class="s31-category-composite__product s31-category-composite__product--3"><span></span></span>
          <span class="s31-category-composite__product s31-category-composite__product--4"><span></span></span>
        </span>
      </div>
    `;
  }

  function headerMarkup() {
    return `
      <div class="s31-header__primary">
        <a class="s31-header__logo" href="index.html" aria-label="BA_Furniture trang chủ">
          <span class="s31-header__logo-mark">BA</span>
          <span>
            <strong>BA_Furniture</strong>
            <small>Nội thất doanh nghiệp, trường học và dự án</small>
          </span>
        </a>
        <form class="s31-header__search site-header__search" action="category.html" method="get" role="search">
          <label class="sr-only" for="s31-site-search">Tìm sản phẩm</label>
          <input id="s31-site-search" type="search" name="q" placeholder="Tìm ghế văn phòng, bàn họp, tủ locker..." />
          <button type="submit">Tìm kiếm</button>
        </form>
        <div class="s31-header__actions">
          <a class="s31-header__hotline" href="tel:${hotlineRaw}"><span>Tư vấn nhanh</span><strong>${hotlineText}</strong></a>
          <a class="s31-header__portal-button" href="${portalUrl}">Portal</a>
          <button class="s31-header__toggle" type="button" aria-expanded="false" aria-controls="s31-main-nav" aria-label="Mở menu">☰</button>
        </div>
      </div>
      <div class="s31-header__nav-row">
        <a class="s31-header__category-entry" href="category.html">Danh mục sản phẩm</a>
        <nav id="s31-main-nav" class="s31-header__nav" aria-label="Điều hướng chính">
          <a href="index.html#category-library">Sản phẩm</a>
          <a href="index.html#solutions">Giải pháp</a>
          <a href="index.html#promise">Cam kết</a>
          <a href="index.html#service-area">Khu vực</a>
          <a href="index.html#contact">Liên hệ</a>
          <a href="${portalUrl}">Xem hơn 3.300 sản phẩm</a>
        </nav>
      </div>
    `;
  }

  function mountHeader() {
    const topbar = document.querySelector(".topbar");
    if (topbar) {
      topbar.classList.add("s31-topbar");
      topbar.innerHTML = `
        <p>Phục vụ Nam Định, Hà Nam, Ninh Bình, Hưng Yên, Thái Bình và dự án toàn quốc</p>
        <div class="s31-topbar__links">
          <a href="category.html">Danh mục sản phẩm</a>
          <a href="tel:${hotlineRaw}">Gọi ${hotlineText}</a>
          <a href="${portalUrl}">Portal sản phẩm</a>
        </div>
      `;
    }

    let header = document.querySelector(".site-header");
    if (!header) {
      header = document.createElement("header");
      header.className = "site-header";
      const anchor = topbar || document.querySelector(".skip-link") || document.body.firstChild;
      anchor.parentNode.insertBefore(header, anchor.nextSibling);
    }
    header.classList.add("s31-site-header");
    header.innerHTML = headerMarkup();

    const toggle = header.querySelector(".s31-header__toggle");
    const nav = header.querySelector(".s31-header__nav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Đóng menu" : "Mở menu");
        document.body.classList.toggle("s31-nav-open", isOpen);
      });
      nav.addEventListener("click", (event) => {
        if (event.target instanceof HTMLAnchorElement) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          document.body.classList.remove("s31-nav-open");
        }
      });
    }
  }

  function enhanceCategoryCards(root = document) {
    root.querySelectorAll(".category-group-card, .category-system-card").forEach((card) => {
      const media = card.querySelector(".category-group-card__media");
      if (!media || media.dataset.s31Composite === "ready") return;
      const id = card.getAttribute("data-main-category") || "";
      const title = card.querySelector("h3")?.textContent?.trim() || "Danh mục BA_Furniture";
      const type = typeById[id] || typeFromText(title);
      media.classList.add("s31-composite-media");
      media.classList.remove("category-group-card__placeholder");
      media.innerHTML = compositeMarkup(title, type);
      media.dataset.s31Composite = "ready";
    });

    const homeHeroIcon = root.querySelector(".category-home-hero__icon");
    if (homeHeroIcon && homeHeroIcon.dataset.s31Composite !== "ready") {
      const visual = document.createElement("span");
      visual.className = "category-home-hero__visual s31-composite-hero";
      visual.dataset.s31Composite = "ready";
      visual.innerHTML = compositeMarkup("Ghế văn phòng", "chair", "hero");
      homeHeroIcon.replaceWith(visual);
    }

    const homeHeroVisual = root.querySelector(".category-home-hero__visual:not([data-s31-composite])");
    if (homeHeroVisual) {
      homeHeroVisual.classList.add("s31-composite-hero");
      homeHeroVisual.dataset.s31Composite = "ready";
      homeHeroVisual.innerHTML = compositeMarkup("Ghế văn phòng", "chair", "hero");
    }

    const templateVisual = root.querySelector(".category-template-hero__visual:not([data-s31-composite])");
    if (templateVisual) {
      const title = root.querySelector(".category-template-hero h1")?.textContent?.trim() || "Ghế văn phòng";
      templateVisual.classList.add("s31-composite-hero");
      templateVisual.dataset.s31Composite = "ready";
      templateVisual.innerHTML = compositeMarkup(title, typeFromText(title), "hero");
    }
  }

  function boot() {
    mountHeader();
    enhanceCategoryCards();
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        scheduled = false;
        enhanceCategoryCards();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(enhanceCategoryCards, 500);
    window.setTimeout(enhanceCategoryCards, 1500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
