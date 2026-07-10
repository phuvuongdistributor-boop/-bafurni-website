(function () {
  const moduleVersion = "2026-07-10-s25";
  const cssFiles = ["/site-modules.css", "/search-filter.css", "/productdb-integration.css", "/quote-lead.css", "/performance-accessibility.css", "/final-design-polish.css", "/category-visual-library.css", "/category-page-engine.css"];
  const scriptFiles = [
    "/product-data-adapter.js",
    "/site-routing.js",
    "/category-visual-library.js",
    "/productdb-data.js",
    "/productdb-data.part1.js",
    "/productdb-data.part2.js",
    "/productdb-data.part3.js",
    "/productdb-data.part4.js",
    "/productdb-data.part5a.js",
    "/productdb-data.part5b.js",
    "/productdb-data.part5c.js",
    "/productdb-data.part6.js",
    "/productdb-data.part7.js",
    "/productdb-data.part8.js",
    "/productdb-data.part9.js",
    "/productdb-data.part10.js",
    "/product-category-normalizer.js",
    "/productdb-integration.js",
    "/seo-module.js",
    "/category-page-engine.js",
    "/quote-lead.js",
    "/product-data-adapter-qa.js",
    "/product-gallery.js",
    "/search-filter.js",
    "/performance-accessibility.js",
    "/release-cleanup.js"
  ];

  function withVersion(path) {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${normalized}?v=${moduleVersion}`;
  }

  function hasAsset(selector, path) {
    return Boolean(document.querySelector(`${selector}[href*="${path}"], ${selector}[src*="${path}"]`));
  }

  cssFiles.forEach((href) => {
    if (hasAsset("link", href)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = withVersion(href);
    document.head.appendChild(link);
  });

  function loadScript(index) {
    if (index >= scriptFiles.length) return;
    const src = scriptFiles[index];
    if (hasAsset("script", src)) {
      loadScript(index + 1);
      return;
    }
    const script = document.createElement("script");
    script.src = withVersion(src);
    script.defer = false;
    script.onload = () => loadScript(index + 1);
    script.onerror = () => loadScript(index + 1);
    document.body.appendChild(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => loadScript(0), { once: true });
  } else {
    loadScript(0);
  }
})();
