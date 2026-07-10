(function () {
  if (window.BASEOModule) return;

  const origin = "https://bafurni.com";
  const routing = window.BARouting || {};

  function clean(value) {
    return value == null ? "" : String(value).trim();
  }

  function absolute(path) {
    if (!path) return origin + "/";
    if (/^https?:\/\//i.test(path)) return path;
    return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
  }

  function setMeta(selector, attrs) {
    let node = document.querySelector(selector);
    if (!node) {
      node = document.createElement("meta");
      Object.entries(attrs.create || {}).forEach(([key, value]) => node.setAttribute(key, value));
      document.head.appendChild(node);
    }
    Object.entries(attrs.set || {}).forEach(([key, value]) => node.setAttribute(key, value));
  }

  function setJsonLd(id, data) {
    let node = document.getElementById(id);
    if (!node) {
      node = document.createElement("script");
      node.type = "application/ld+json";
      node.id = id;
      document.head.appendChild(node);
    }
    node.textContent = JSON.stringify(data);
  }

  function removeJsonLdByType(type, keepId) {
    document.querySelectorAll('script[type="application/ld+json"]').forEach((node) => {
      if (keepId && node.id === keepId) return;
      try {
        const data = JSON.parse(node.textContent || "{}");
        if (data["@type"] === type) node.remove();
      } catch {}
    });
  }

  function setCanonical(path) {
    if (routing.setCanonical) return routing.setCanonical(path);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = absolute(path);
    return canonical.href;
  }

  function setCommonSeo(title, description, canonicalPath, type) {
    const canonical = setCanonical(canonicalPath);
    document.title = title;
    setMeta('meta[name="description"]', { create: { name: "description" }, set: { content: description } });
    setMeta('meta[name="robots"]', { create: { name: "robots" }, set: { content: "index, follow, max-image-preview:large" } });
    setMeta('meta[property="og:type"]', { create: { property: "og:type" }, set: { content: type || "website" } });
    setMeta('meta[property="og:url"]', { create: { property: "og:url" }, set: { content: canonical } });
    setMeta('meta[property="og:title"]', { create: { property: "og:title" }, set: { content: title } });
    setMeta('meta[property="og:description"]', { create: { property: "og:description" }, set: { content: description } });
    setMeta('meta[property="og:image"]', { create: { property: "og:image" }, set: { content: `${origin}/assets/og-ba-furniture.svg` } });
    setMeta('meta[name="twitter:card"]', { create: { name: "twitter:card" }, set: { content: "summary_large_image" } });
    setMeta('meta[name="twitter:title"]', { create: { name: "twitter:title" }, set: { content: title } });
    setMeta('meta[name="twitter:description"]', { create: { name: "twitter:description" }, set: { content: description } });
    setMeta('meta[name="twitter:image"]', { create: { name: "twitter:image" }, set: { content: `${origin}/assets/og-ba-furniture.svg` } });
    return canonical;
  }

  function organizationSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "BA_Furniture",
      "url": `${origin}/`,
      "logo": `${origin}/assets/favicon.svg`,
      "image": `${origin}/assets/og-ba-furniture.svg`,
      "telephone": "+84929878666",
      "priceRange": "Liên hệ báo giá",
      "areaServed": ["Nam Định", "Hà Nam", "Ninh Bình", "Hưng Yên", "Thái Bình", "Việt Nam"],
      "sameAs": ["https://portal.bafurni.com"],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+84929878666",
        "contactType": "sales",
        "availableLanguage": "vi"
      }
    };
  }

  function breadcrumbSchema(items) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": absolute(item.url)
      }))
    };
  }

  function homepageSeo() {
    if (document.body.classList.contains("category-template-page") || document.body.classList.contains("product-detail-page")) return;
    const title = "BA_Furniture | Nội thất văn phòng, trường học và dự án";
    const description = clean(document.querySelector('meta[name="description"]')?.content) || "BA_Furniture cung cấp nội thất văn phòng, trường học và dự án tại Nam Định, Hà Nam, Ninh Bình, Hưng Yên, Thái Bình.";
    setCommonSeo(title, description, "/", "website");
    setJsonLd("ba-localbusiness-schema", organizationSchema());
  }

  function categorySeo() {
    const page = document.querySelector(".category-template-page");
    if (!page) return;
    const categoryPath = routing.categoryUrl ? routing.categoryUrl("OFFICE_CHAIR") : "/category.html";
    const title = "Ghế văn phòng BA_Furniture | Danh mục sản phẩm nội thất văn phòng";
    const description = "Danh mục ghế văn phòng BA_Furniture: ghế giám đốc, ghế lưới, ghế da, ghế chân quỳ, ghế training. Tư vấn kích thước, chất liệu và báo giá theo số lượng.";
    setCommonSeo(title, description, categoryPath, "website");

    const cards = [...document.querySelectorAll(".category-template-products .product-card")].slice(0, 12);
    setJsonLd("ba-category-breadcrumb-schema", breadcrumbSchema([
      { name: "Trang chủ", url: "/" },
      { name: "Danh mục", url: categoryPath },
      { name: "Ghế văn phòng", url: categoryPath }
    ]));
    setJsonLd("ba-category-itemlist-schema", {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Ghế văn phòng BA_Furniture",
      "itemListElement": cards.map((card, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": clean(card.querySelector("h3")?.textContent),
        "url": absolute(card.querySelector("a.product-card__cta")?.getAttribute("href") || categoryPath)
      }))
    });
  }

  function productSeo() {
    const page = document.querySelector(".product-detail-page");
    if (!page) return;
    removeJsonLdByType("Product", "ba-product-schema");

    const renderedCode = page.dataset.productdbRendered || "";
    const route = routing.parseProductRoute ? routing.parseProductRoute() : {};
    const routeSlug = clean(route.slug);
    const productRoute = clean(page.dataset.productRoute);
    const routeMismatch = routeSlug && productRoute && !productRoute.endsWith(routeSlug);

    if (routeMismatch) {
      const title = "Sản phẩm đang cập nhật | BA_Furniture";
      setCommonSeo(title, "Sản phẩm đang được cập nhật trong hệ thống BA_Furniture. Vui lòng liên hệ hotline 0929.878.666 để được tư vấn và báo giá.", "/product-detail.html", "website");
      setMeta('meta[name="robots"]', { create: { name: "robots" }, set: { content: "noindex, follow" } });
      page.dataset.productUnavailable = "true";
      const h1 = document.querySelector("#product-title");
      if (h1) h1.textContent = "Sản phẩm đang cập nhật";
      return;
    }

    const titleText = clean(document.querySelector("#product-title")?.textContent) || "Sản phẩm BA_Furniture";
    const priceText = clean(document.querySelector(".product-summary__price strong")?.textContent) || "Liên hệ báo giá";
    const categoryText = clean(document.querySelector(".product-summary__meta span:nth-child(2)")?.textContent.replace("Danh mục:", "")) || "Nội thất văn phòng";
    const canonicalPath = productRoute || window.location.pathname;
    const description = `${titleText} mã ${renderedCode || "đang cập nhật"} thuộc ${categoryText}. Xem hình ảnh, thông số, chất liệu, kích thước và nhận báo giá từ BA_Furniture.`;
    const canonical = setCommonSeo(`${titleText} | BA_Furniture`, description, canonicalPath, "product");
    const image = document.querySelector(".ba-gallery__image")?.getAttribute("src") || `${origin}/assets/og-ba-furniture.svg`;

    setJsonLd("ba-product-breadcrumb-schema", breadcrumbSchema([
      { name: "Trang chủ", url: "/" },
      { name: categoryText, url: routing.categoryUrl ? routing.categoryUrl("OFFICE_CHAIR") : "/category.html" },
      { name: titleText, url: canonicalPath }
    ]));
    setJsonLd("ba-product-schema", {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": titleText,
      "sku": renderedCode,
      "category": categoryText,
      "image": absolute(image),
      "description": description,
      "brand": { "@type": "Brand", "name": "BA_Furniture" },
      "offers": {
        "@type": "Offer",
        "url": canonical,
        "priceCurrency": "VND",
        "availability": "https://schema.org/InStock",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "priceCurrency": "VND",
          "description": priceText
        }
      }
    });
  }

  homepageSeo();
  categorySeo();
  productSeo();
  window.BASEOModule = { homepageSeo, categorySeo, productSeo };
  document.documentElement.dataset.seoModule = "ready";
})();
