(function () {
  const galleryRoot = document.querySelector(".product-detail-page .product-gallery");
  if (!galleryRoot || galleryRoot.dataset.galleryEnhanced === "true") return;

  const imageTypes = [
    ["hero", "Hero"],
    ["angle_45", "Góc 45°"],
    ["front", "Chính diện"],
    ["side", "Bên"],
    ["back", "Sau"],
    ["detail", "Chi tiết"],
    ["material", "Vật liệu"],
    ["dimension", "Kích thước"],
    ["real_project", "Ảnh thực tế"],
    ["catalog", "Catalogue"]
  ];

  const product = window.BA_CURRENT_PRODUCT || {
    name: "Ghế lưới nhân viên BA demo",
    code: "CHAIR-DEMO-03",
    images: []
  };

  const images = imageTypes.map(([type, label], index) => {
    const existing = Array.isArray(product.images) ? product.images.find((item) => item.type === type || item.label === label) : null;
    return {
      type,
      label,
      src: existing?.src || "",
      alt: existing?.alt || `${product.name || "Sản phẩm BA_Furniture"} - ${label}`,
      index
    };
  });

  let activeIndex = 0;
  let lastFocus = null;

  function chairSvg() {
    return `
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="M8 4h8v9H8V4Z" />
        <path d="M10 6h4" />
        <path d="M10 9h4" />
        <path d="M9 13v4h6v-4" />
        <path d="M12 17v3" />
        <path d="M8 20h8" />
      </svg>
    `;
  }

  function placeholder(item) {
    return `
      <div class="ba-gallery__placeholder" data-image-type="${item.type}">
        ${chairSvg()}
        <strong>${item.label}</strong>
        <span>Ảnh ${item.label.toLowerCase()} đang cập nhật. Gallery đã sẵn sàng nhận ảnh thật từ ProductDB sau này.</span>
      </div>
    `;
  }

  function mainMedia(item) {
    if (!item.src) return placeholder(item);
    return `<img class="ba-gallery__image" src="${item.src}" alt="${item.alt}" loading="eager" decoding="async" data-fallback-label="${item.label}" />`;
  }

  function render() {
    const active = images[activeIndex];
    galleryRoot.innerHTML = `
      <div class="ba-gallery" role="region" aria-label="Gallery sản phẩm ${product.name || "BA_Furniture"}">
        <div class="ba-gallery__stage">
          <button class="ba-gallery__main" type="button" aria-label="Phóng to ảnh ${active.label}" data-gallery-open>
            ${mainMedia(active)}
          </button>
          <button class="ba-gallery__nav ba-gallery__nav--prev" type="button" aria-label="Ảnh trước" data-gallery-prev>‹</button>
          <button class="ba-gallery__nav ba-gallery__nav--next" type="button" aria-label="Ảnh tiếp theo" data-gallery-next>›</button>
          <div class="ba-gallery__meta" aria-live="polite">
            <span>${active.label}</span>
            <span>${activeIndex + 1}/${images.length}</span>
          </div>
        </div>
        <div class="ba-gallery__rail" role="tablist" aria-label="Thumbnail sản phẩm">
          ${images.map((item, index) => `
            <button class="ba-gallery__thumb" type="button" role="tab" aria-selected="${index === activeIndex}" tabindex="${index === activeIndex ? "0" : "-1"}" data-gallery-thumb="${index}">
              ${item.label}
            </button>
          `).join("")}
        </div>
        <div class="ba-gallery__lightbox" role="dialog" aria-modal="true" aria-label="Xem ảnh sản phẩm phóng to" data-gallery-lightbox>
          <div class="ba-gallery__lightbox-panel">
            <button class="ba-gallery__lightbox-close" type="button" aria-label="Đóng ảnh phóng to" data-gallery-close>×</button>
            <div class="ba-gallery__lightbox-body" data-gallery-lightbox-body>${mainMedia(active)}</div>
          </div>
        </div>
      </div>
    `;
    attachEvents();
  }

  function setActive(index, focusThumb = false) {
    activeIndex = (index + images.length) % images.length;
    render();
    if (focusThumb) {
      galleryRoot.querySelector(`[data-gallery-thumb="${activeIndex}"]`)?.focus();
    }
  }

  function openLightbox() {
    const lightbox = galleryRoot.querySelector("[data-gallery-lightbox]");
    lastFocus = document.activeElement;
    lightbox?.classList.add("is-open");
    galleryRoot.querySelector("[data-gallery-close]")?.focus();
    document.body.classList.add("nav-open");
  }

  function closeLightbox() {
    galleryRoot.querySelector("[data-gallery-lightbox]")?.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function fallbackImage(img) {
    const label = img.getAttribute("data-fallback-label") || "Ảnh sản phẩm";
    const wrapper = document.createElement("div");
    wrapper.innerHTML = placeholder({ type: "fallback", label });
    img.replaceWith(wrapper.firstElementChild);
  }

  function attachEvents() {
    galleryRoot.querySelector("[data-gallery-prev]")?.addEventListener("click", () => setActive(activeIndex - 1));
    galleryRoot.querySelector("[data-gallery-next]")?.addEventListener("click", () => setActive(activeIndex + 1));
    galleryRoot.querySelector("[data-gallery-open]")?.addEventListener("click", openLightbox);
    galleryRoot.querySelector("[data-gallery-close]")?.addEventListener("click", closeLightbox);
    galleryRoot.querySelector("[data-gallery-lightbox]")?.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) closeLightbox();
    });

    galleryRoot.querySelectorAll("[data-gallery-thumb]").forEach((button) => {
      button.addEventListener("click", () => setActive(Number(button.dataset.galleryThumb), true));
      button.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          setActive(activeIndex + 1, true);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          setActive(activeIndex - 1, true);
        }
        if (event.key === "Home") {
          event.preventDefault();
          setActive(0, true);
        }
        if (event.key === "End") {
          event.preventDefault();
          setActive(images.length - 1, true);
        }
      });
    });

    galleryRoot.querySelectorAll("img").forEach((img) => {
      img.addEventListener("error", () => fallbackImage(img), { once: true });
    });
  }

  document.addEventListener("keydown", (event) => {
    if (!galleryRoot.contains(document.activeElement) && !galleryRoot.querySelector(".ba-gallery__lightbox.is-open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") setActive(activeIndex + 1, true);
    if (event.key === "ArrowLeft") setActive(activeIndex - 1, true);
  });

  galleryRoot.dataset.galleryEnhanced = "true";
  render();
})();
