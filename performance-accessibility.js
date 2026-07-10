(function () {
  if (window.BAPerformanceAccessibility) return;

  let scheduled = false;

  function text(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function productLabelFrom(node) {
    const card = node.closest(".product-card, .product-summary, .product-detail-hero, .category-group-card");
    const heading = card?.querySelector("h1, h2, h3, strong")?.textContent;
    return text(heading) || "Sản phẩm BA_Furniture";
  }

  function enhanceImage(img) {
    const inGalleryStage = !!img.closest(".ba-gallery__stage, .product-gallery");
    const inCard = !!img.closest(".product-card, .category-group-card");

    if (!img.getAttribute("alt")) {
      img.setAttribute("alt", productLabelFrom(img));
    }

    if (!img.hasAttribute("decoding")) {
      img.setAttribute("decoding", "async");
    }

    if (!img.hasAttribute("loading")) {
      img.setAttribute("loading", inGalleryStage ? "eager" : "lazy");
    }

    if (inGalleryStage && !img.hasAttribute("fetchpriority")) {
      img.setAttribute("fetchpriority", "high");
    }

    if (!img.hasAttribute("width")) {
      img.setAttribute("width", inGalleryStage ? "900" : "640");
    }

    if (!img.hasAttribute("height")) {
      img.setAttribute("height", inGalleryStage ? "900" : "640");
    }

    if (!img.hasAttribute("sizes")) {
      img.setAttribute("sizes", inGalleryStage ? "(max-width: 900px) 100vw, 52vw" : "(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 280px");
    }

    if (inCard || inGalleryStage) {
      img.classList.add("ba-perf-safe-media");
    }
  }

  function enhanceLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
      const rel = new Set(text(link.getAttribute("rel")).split(" ").filter(Boolean));
      rel.add("noopener");
      rel.add("noreferrer");
      link.setAttribute("rel", Array.from(rel).join(" "));
    });

    document.querySelectorAll(".product-card__cta").forEach((link) => {
      if (!link.getAttribute("aria-label")) {
        const productName = text(link.closest(".product-card")?.querySelector("h3")?.textContent);
        if (productName) link.setAttribute("aria-label", `Xem chi tiết ${productName}`);
      }
    });
  }

  function enhanceTapTargets() {
    document.querySelectorAll(".btn, .product-card__cta, .site-header__nav a, .category-template-chips a, .category-subgroup-card, .ba-sticky-cta a, .ba-gallery__thumb, .ba-gallery__nav").forEach((node) => {
      node.classList.add("ba-a11y-tap-target");
    });
  }

  function run() {
    scheduled = false;
    document.querySelectorAll("img").forEach(enhanceImage);
    enhanceLinks();
    enhanceTapTargets();
    document.documentElement.dataset.performanceAccessibility = "ready";
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(run);
  }

  const observer = new MutationObserver(schedule);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.BAPerformanceAccessibility = {
    run,
    version: "2026-07-10-s20"
  };
})();
