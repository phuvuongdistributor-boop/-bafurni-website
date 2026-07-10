(function () {
  if (window.BARouting) return;

  const origin = "https://bafurni.com";

  function clean(value) {
    return value == null ? "" : String(value).trim();
  }

  function slugify(value) {
    return clean(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "noi-that";
  }

  function categories() {
    return Array.isArray(window.BA_CATEGORY_LIBRARY) ? window.BA_CATEGORY_LIBRARY : [];
  }

  function findCategory(idOrSlug) {
    const value = clean(idOrSlug).toLowerCase();
    return categories().find((category) =>
      clean(category.id).toLowerCase() === value || slugify(category.name) === value
    ) || categories()[0];
  }

  function findSubcategory(category, idOrSlug) {
    const value = clean(idOrSlug).toLowerCase();
    return (category?.subcategories || []).find(([id, name]) =>
      clean(id).toLowerCase() === value || slugify(name) === value
    );
  }

  function categoryUrl(categoryOrId, subcategoryOrId) {
    const category = typeof categoryOrId === "string" ? findCategory(categoryOrId) : categoryOrId;
    if (!category) return "/category.html";
    const base = `/danh-muc/${slugify(category.name)}`;
    if (!subcategoryOrId) return base;
    const sub = Array.isArray(subcategoryOrId) ? subcategoryOrId : findSubcategory(category, subcategoryOrId);
    return sub ? `${base}/${slugify(sub[1])}` : base;
  }

  function productSlug(product) {
    return slugify(`${clean(product?.code || product?.Code)}-${clean(product?.name || product?.ProductName)}`);
  }

  function productUrl(product) {
    const slug = productSlug(product);
    return `/san-pham/${slug}`;
  }

  function legacyProductUrl(product) {
    const code = clean(product?.code || product?.Code);
    return `/product-detail.html?slug=${encodeURIComponent(productSlug(product))}&code=${encodeURIComponent(code)}`;
  }

  function absolute(path) {
    if (!path) return origin;
    if (/^https?:\/\//i.test(path)) return path;
    return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
  }

  function parseProductRoute() {
    const path = window.location.pathname.replace(/\/+$/, "");
    const match = path.match(/^\/san-pham\/([^/]+)$/);
    const params = new URLSearchParams(window.location.search);
    return {
      slug: match ? decodeURIComponent(match[1]) : clean(params.get("slug")),
      code: clean(params.get("code")),
      isClean: Boolean(match)
    };
  }

  function parseCategoryRoute() {
    const path = window.location.pathname.replace(/\/+$/, "");
    const match = path.match(/^\/danh-muc\/([^/]+)(?:\/([^/]+))?$/);
    return {
      categorySlug: match ? decodeURIComponent(match[1]) : "ghe-van-phong",
      subcategorySlug: match?.[2] ? decodeURIComponent(match[2]) : "",
      isClean: Boolean(match)
    };
  }

  function setCanonical(path) {
    const href = absolute(path);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = href;
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", href);
    return href;
  }

  function updateCategoryAnchors() {
    document.querySelectorAll("[data-main-category]").forEach((link) => {
      const category = findCategory(link.getAttribute("data-main-category"));
      if (category) {
        link.setAttribute("href", categoryUrl(category));
        link.removeAttribute("target");
        link.removeAttribute("rel");
      }
    });

    const hero = document.querySelector(".category-home-hero");
    const chair = findCategory("OFFICE_CHAIR");
    if (hero && chair) hero.setAttribute("href", categoryUrl(chair));

    document.querySelectorAll(".category-subgroup-card[data-subcategory]").forEach((link) => {
      const category = chair || categories()[0];
      const sub = findSubcategory(category, link.getAttribute("data-subcategory"));
      if (category && sub) link.setAttribute("href", `${categoryUrl(category, sub)}#category-listing`);
    });
  }

  window.BARouting = {
    origin,
    slugify,
    categoryUrl,
    productSlug,
    productUrl,
    legacyProductUrl,
    parseProductRoute,
    parseCategoryRoute,
    setCanonical,
    updateCategoryAnchors
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateCategoryAnchors, { once: true });
  } else {
    updateCategoryAnchors();
  }
})();
