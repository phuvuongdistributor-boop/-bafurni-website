(function () {
  const moduleVersion = "2026-07-10-s18";
  const cssFiles = ["site-modules.css", "search-filter.css", "productdb-integration.css"];
  const scriptFiles = [
    "product-data-adapter.js",
    "site-routing.js",
    "productdb-data.js",
    "productdb-integration.js",
    "seo-module.js",
    "product-data-adapter-qa.js",
    "product-gallery.js",
    "search-filter.js"
  ];

  function withVersion(path) {
    return `${path}?v=${moduleVersion}`;
  }

  cssFiles.forEach((href) => {
    if (document.querySelector(`link[href^="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = withVersion(href);
    document.head.appendChild(link);
  });

  function loadScript(index) {
    if (index >= scriptFiles.length) return;
    const src = scriptFiles[index];
    if (document.querySelector(`script[src^="${src}"]`)) {
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
