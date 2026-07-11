(function () {
  if (window.BAProductDetailContentEngine) return;

  const page = document.querySelector(".product-detail-page");
  if (!page) return;

  const routing = window.BARouting || {};
  const adapter = window.BAProductDataAdapter || {};
  const products = Array.isArray(window.BA_PRODUCTS) ? window.BA_PRODUCTS : [];
  const hotline = "0929878666";
  const email = "contact@bafurni.com";

  const imageSlots = [
    ["hero", "Hero"],
    ["angle_45", "Góc 45°"],
    ["front", "Chính diện"],
    ["side", "Bên"],
    ["back", "Sau"],
    ["material", "Chi tiết vật liệu"],
    ["structure", "Chi tiết kết cấu"],
    ["dimension", "Kích thước"],
    ["real_project", "Ảnh thực tế"],
    ["catalog", "Catalogue"]
  ];

  function clean(value) {
    return value == null ? "" : String(value).trim();
  }

  function escapeHtml(value) {
    return clean(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function absolute(path) {
    if (!path) return "https://bafurni.com/";
    if (/^https?:\/\//i.test(path)) return path;
    return `https://bafurni.com${path.startsWith("/") ? path : `/${path}`}`;
  }

  function currentProduct() {
    if (window.BA_CURRENT_PRODUCT) return window.BA_CURRENT_PRODUCT;
    const route = routing.parseProductRoute ? routing.parseProductRoute() : {};
    const params = new URLSearchParams(window.location.search);
    const code = clean(route.code || params.get("code")).toLowerCase();
    const slug = clean(route.slug || params.get("slug"));
    return products.find((item) => clean(item.code).toLowerCase() === code) ||
      products.find((item) => item.routeSlug === slug || (adapter.slugify && adapter.slugify(`${item.code}-${item.name}`) === slug)) ||
      products[0] ||
      null;
  }

  function categoryUrl(product) {
    if (routing.categoryUrl) return routing.categoryUrl(product.mainCategory || product.category || "OFFICE_CHAIR");
    return "/category.html";
  }

  function productUrl(product) {
    if (product.detailUrl) return product.detailUrl;
    if (routing.productUrl) return routing.productUrl(product);
    return `/product-detail.html?code=${encodeURIComponent(product.code || "")}`;
  }

  function detailDescription(product) {
    const parts = [
      product.description,
      product.meta?.material ? `Chất liệu: ${product.meta.material}.` : "",
      product.meta?.size ? `Kích thước: ${product.meta.size}.` : ""
    ].filter(Boolean);
    if (parts.length) return parts.join(" ");
    return `${product.name} thuộc nhóm ${product.category || "nội thất BA_Furniture"}. BA_Furniture tư vấn cấu hình, màu sắc, chất liệu, kích thước và báo giá theo số lượng hoặc dự án.`;
  }

  function sourceLabel(product) {
    return clean(product.source?.sourceGroup || product.raw?.Source_Group || "ProductDB static bundle");
  }

  function sourceUrl(product) {
    return clean(product.source?.sourceUrl || product.raw?.Source_URL || product.raw?.Search_URL);
  }

  function priceLabel(product) {
    return clean(product.price?.label) || "Liên hệ báo giá";
  }

  function gallery(product) {
    const existing = Array.isArray(product.images) && product.images.length ? product.images : product.gallery || [];
    const primary = product.image?.src || existing.find((item) => item.src)?.src || "";
    const result = imageSlots.map(([type, label], index) => {
      const match = existing.find((item) => item.type === type || item.label === label);
      return {
        type,
        label,
        src: match?.src || (index === 0 ? primary : ""),
      alt: match?.alt || `${product.name || "Sản phẩm BA_Furniture"} - ${label}`
      };
    });
    product.images = result;
    return result;
  }

  function setMeta(selector, attr, value) {
    const node = document.querySelector(selector);
    if (node) node.setAttribute(attr, value);
  }

  function updateSeo(product) {
    const url = productUrl(product);
    const title = `${product.name} | ${product.code} | BA_Furniture`;
    const description = `${product.name} ${product.code} - ${product.category || "Nội thất BA_Furniture"}. Xem hình ảnh, thông số, chất liệu, kích thước và nhận báo giá theo số lượng.`;
    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[name="robots"]', "content", "index, follow, max-image-preview:large");
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", absolute(url));
    if (product.image?.src) setMeta('meta[property="og:image"]', "content", absolute(product.image.src));
    if (routing.setCanonical) routing.setCanonical(url);
  }

  function updateSchema(product) {
    const images = gallery(product).filter((item) => item.src).map((item) => absolute(item.src));
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      sku: product.code,
      category: [product.category, product.subCategory].filter(Boolean).join(" / "),
      description: detailDescription(product),
      image: images.length ? images : ["https://bafurni.com/assets/og-ba-furniture.svg"],
      brand: { "@type": "Brand", name: "BA_Furniture" },
      offers: {
        "@type": "Offer",
        url: absolute(productUrl(product)),
        availability: "https://schema.org/InStock",
        priceCurrency: "VND"
      },
      additionalProperty: [
        { "@type": "PropertyValue", name: "Chất liệu", value: clean(product.meta?.material) || "Đang cập nhật" },
        { "@type": "PropertyValue", name: "Kích thước", value: clean(product.meta?.size) || "Đang cập nhật" },
        { "@type": "PropertyValue", name: "Nguồn dữ liệu", value: sourceLabel(product) }
      ]
    };
    if (product.price?.amount) schema.offers.price = String(product.price.amount);
    let node = document.querySelector('script[type="application/ld+json"]');
    if (!node) {
      node = document.createElement("script");
      node.type = "application/ld+json";
      document.head.appendChild(node);
    }
    node.textContent = JSON.stringify(schema);
  }

  function setText(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function renderTable(product) {
    const rows = [
      ["Mã sản phẩm", product.code],
      ["Tên sản phẩm", product.name],
      ["Danh mục", [product.category, product.subCategory].filter(Boolean).join(" / ")],
      ["Kích thước", clean(product.meta?.size) || "Đang cập nhật"],
      ["Chất liệu", clean(product.meta?.material) || "Đang cập nhật"],
      ["Giá / báo giá", priceLabel(product)],
      ["Thương hiệu", "BA_Furniture"],
      ["Nguồn dữ liệu", sourceLabel(product)]
    ];
    const table = page.querySelector(".product-spec-table tbody");
    if (!table) return;
    table.innerHTML = rows.map(([label, value]) => `<tr><th scope="row">${escapeHtml(label)}</th><td>${escapeHtml(value || "Đang cập nhật")}</td></tr>`).join("");
  }

  function relatedProducts(product) {
    return products
      .filter((item) => item.code !== product.code)
      .map((item) => ({
        product: item,
        score: (item.subCategory && item.subCategory === product.subCategory ? 2 : 0) + (item.mainCategory === product.mainCategory ? 1 : 0)
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || clean(a.product.name).localeCompare(clean(b.product.name), "vi"))
      .slice(0, 4)
      .map((item) => item.product);
  }

  function productImage(product) {
    if (product.image?.src) {
      return `<div class="product-card__image category-template-product-card__image product-card__image--photo"><img src="${escapeHtml(product.image.src)}" alt="${escapeHtml(product.image.alt || product.name)}" loading="lazy" decoding="async" /></div>`;
    }
    return `<div class="product-card__image category-template-product-card__image" aria-hidden="true"><span>Đang cập nhật ảnh</span></div>`;
  }

  function relatedCard(product) {
    const meta = [product.category, product.subCategory, product.meta?.material].filter(Boolean).join(" / ");
    return `<article class="product-card category-template-product-card" data-product-code="${escapeHtml(product.code)}" data-product-slug="${escapeHtml(product.routeSlug || "")}" data-category="${escapeHtml(product.mainCategory)}" data-subcategory="${escapeHtml(product.subCategory)}" data-price-state="${product.price?.amount ? "priced" : "contact"}">
      ${productImage(product)}
      <div class="product-card__body">
        <p class="product-card__code">Mã: ${escapeHtml(product.code)}</p>
        <h3>${escapeHtml(product.name)}</h3>
        <p class="category-template-product-card__meta">${escapeHtml(meta || "Nội thất BA_Furniture")}</p>
        <p class="product-card__price">${escapeHtml(priceLabel(product))}</p>
        <a class="product-card__cta" href="${escapeHtml(productUrl(product))}">Xem chi tiết</a>
      </div>
    </article>`;
  }

  function quoteHref(product) {
    const subject = `Yêu cầu báo giá ${product.code} - ${product.name}`;
    const body = [
      "Yêu cầu báo giá BA_Furniture",
      "",
      `Sản phẩm: ${product.name}`,
      `Mã sản phẩm: ${product.code}`,
      `Danh mục: ${[product.category, product.subCategory].filter(Boolean).join(" / ")}`,
      `URL: ${absolute(productUrl(product))}`,
      "",
      "Số lượng:",
      "Khu vực giao hàng:",
      "Yêu cầu chất liệu/kích thước:"
    ].join("\n");
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function render(product) {
    if (!product) return;
    window.BA_CURRENT_PRODUCT = product;
    gallery(product);
    updateSeo(product);
    updateSchema(product);

    setText("#product-title", product.name);
    const label = page.querySelector(".product-summary .section-label");
    if (label) label.textContent = "Chi tiết sản phẩm";

    const breadcrumbLast = page.querySelector(".product-detail-breadcrumb span:last-child");
    if (breadcrumbLast) breadcrumbLast.textContent = product.name;
    const breadcrumbCategory = page.querySelector(".product-detail-breadcrumb a[href='category.html'], .product-detail-breadcrumb a[href*='danh-muc']");
    if (breadcrumbCategory) {
      breadcrumbCategory.textContent = product.category || "Danh mục";
      breadcrumbCategory.href = categoryUrl(product);
    }

    const metaBox = page.querySelector(".product-summary__meta");
    if (metaBox) {
      metaBox.innerHTML = `<span>Mã: ${escapeHtml(product.code)}</span><span>Danh mục: ${escapeHtml(product.category || "Đang cập nhật")}</span><span>Nhóm: ${escapeHtml(product.subCategory || "Đang cập nhật")}</span>`;
    }

    const desc = page.querySelector(".product-summary__description");
    if (desc) desc.textContent = detailDescription(product);

    const price = page.querySelector(".product-summary__price strong");
    if (price) price.textContent = priceLabel(product);

    let source = page.querySelector(".product-summary__source");
    if (!source) {
      source = document.createElement("p");
      source.className = "product-summary__source";
      page.querySelector(".product-summary__price")?.after(source);
    }
    const sourceLink = sourceUrl(product);
    source.innerHTML = sourceLink
      ? `Nguồn dữ liệu: <a href="${escapeHtml(sourceLink)}" target="_blank" rel="noopener">${escapeHtml(sourceLabel(product))}</a>`
      : `Nguồn dữ liệu: ${escapeHtml(sourceLabel(product))}`;

    const notes = page.querySelector(".product-summary__notes");
    if (notes) {
      notes.innerHTML = [
        `Tư vấn ${product.category || "nội thất"} theo số lượng, mặt bằng và ngân sách.`,
        clean(product.meta?.material) ? `Chất liệu: ${product.meta.material}.` : "Chất liệu sẽ được xác nhận khi báo giá.",
        clean(product.meta?.size) ? `Kích thước: ${product.meta.size}.` : "Kích thước có thể sản xuất theo yêu cầu.",
        "CTA báo giá đã tự điền mã sản phẩm, tên sản phẩm, danh mục và URL."
      ].map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    }

    renderTable(product);

    const infoCards = page.querySelectorAll(".product-info-card");
    if (infoCards[0]) {
      infoCards[0].querySelector("h3").textContent = "Chất liệu";
      infoCards[0].querySelector("p").textContent = clean(product.meta?.material) || "Chất liệu đang cập nhật trong ProductDB. BA_Furniture sẽ xác nhận khi báo giá.";
    }
    if (infoCards[1]) {
      infoCards[1].querySelector("h3").textContent = "Kích thước";
      infoCards[1].querySelector("p").textContent = clean(product.meta?.size) || "Kích thước đang cập nhật trong ProductDB hoặc sản xuất theo yêu cầu.";
    }

    const related = relatedProducts(product);
    const relatedGrid = page.querySelector(".product-related-grid");
    if (relatedGrid && related.length) relatedGrid.innerHTML = related.map(relatedCard).join("");

    const relatedHead = page.querySelector("#related-product-title")?.closest(".product-detail-section__head");
    const relatedText = relatedHead?.querySelector("p");
    if (relatedText) {
      relatedText.textContent = "Sản phẩm liên quan ưu tiên cùng nhóm nhỏ hoặc cùng danh mục trong static ProductDB bundle.";
    }

    const quoteTitle = page.querySelector("#product-quote h2");
    if (quoteTitle) quoteTitle.textContent = `Cần báo giá ${product.name}?`;
    const quoteCopy = page.querySelector("#product-quote p");
    if (quoteCopy) quoteCopy.textContent = `Gửi mã ${product.code}, số lượng, khu vực giao hàng và yêu cầu riêng. BA_Furniture sẽ tư vấn cấu hình, chất liệu, kích thước và báo giá phù hợp.`;
    page.querySelectorAll('#product-quote a[href^="mailto:"], .product-summary__actions a[href="#product-quote"]').forEach((link) => {
      if (link.getAttribute("href") === "#product-quote") return;
      link.href = quoteHref(product);
    });

    page.dataset.productContentEngine = product.code || "ready";
    document.documentElement.dataset.productDetailContentEngine = `ready:${product.code || "product"}`;
  }

  const product = currentProduct();
  render(product);

  window.BAProductDetailContentEngine = { render, currentProduct, relatedProducts };
})();
