(() => {
  const root = document.querySelector("#storefront-root");
  const catalog = window.BAProductCatalog;
  if (!root || !catalog) return;

  const APPROVED_CODES = new Set([
    "TQ05",
    "TQ01",
    "DT1890V2",
    "DT2010V2",
    "TU09K7CK",
    "TU983-3KS",
    "GMG101A-2",
    "BMG101A-2"
  ]);

  const CATEGORY_DEFINITIONS = [
    {
      slug: "ghe-van-phong",
      dataSlug: "ghe-van-phong",
      name: "Ghế văn phòng",
      shortName: "Ghế",
      description: "Ghế làm việc, ghế lãnh đạo, ghế lưới và ghế phòng họp cho nhiều quy mô không gian.",
      image: "/assets/category/approved/category-office-chair.webp"
    },
    {
      slug: "ban-van-phong",
      dataSlug: "ban-van-phong",
      name: "Bàn văn phòng",
      shortName: "Bàn",
      description: "Bàn nhân viên, bàn quản lý và hệ bàn module đồng bộ cho môi trường làm việc hiện đại.",
      image: "/assets/category/approved/category-office-desk.webp"
    },
    {
      slug: "ban-hop",
      dataSlug: "ban-hop",
      name: "Bàn họp",
      shortName: "Bàn họp",
      description: "Bàn họp nhiều quy mô, từ phòng trao đổi nhóm nhỏ đến phòng họp điều hành.",
      image: "/assets/category/approved/category-meeting-table.webp"
    },
    {
      slug: "tu-ho-so",
      dataSlug: "tu-hoc",
      name: "Tủ và hộc tài liệu",
      shortName: "Tủ và hộc",
      description: "Giải pháp lưu trữ hồ sơ, tài liệu và hộc cá nhân cho văn phòng, trường học và dự án.",
      image: "/assets/category/approved/category-cabinet-pedestal.webp"
    },
    {
      slug: "tu-locker",
      dataSlug: "locker",
      name: "Tủ locker",
      shortName: "Locker",
      description: "Tủ locker và tủ thay đồ cho nhà máy, trường học, văn phòng và khu tiện ích.",
      image: "/assets/category/approved/category-locker.webp"
    },
    {
      slug: "sofa-ghe-cho",
      dataSlug: "sofa",
      name: "Sofa và ghế chờ",
      shortName: "Sofa",
      description: "Sofa văn phòng, ghế sảnh và khu chờ giúp hoàn thiện trải nghiệm tiếp đón.",
      image: "/assets/category/approved/category-sofa-waiting.webp"
    },
    {
      slug: "noi-that-truong-hoc",
      dataSlug: "truong-hoc",
      name: "Nội thất trường học",
      shortName: "Trường học",
      description: "Bàn ghế học sinh, bàn giáo viên và nội thất đồng bộ cho các không gian giáo dục.",
      image: "/assets/category/approved/category-school.webp"
    },
    {
      slug: "ke-gia-kho",
      dataSlug: "ke-gia-kho",
      name: "Kệ và giá kho",
      shortName: "Kệ và giá kho",
      description: "Hệ kệ lưu trữ và giá kho cho tài liệu, vật tư và không gian vận hành.",
      image: "/assets/category/approved/category-storage-rack.webp"
    }
  ];

  const CATEGORY_ALIASES = {
    "tu-hoc": "tu-ho-so",
    "tu-hoc-tai-lieu": "tu-ho-so",
    locker: "tu-locker",
    sofa: "sofa-ghe-cho",
    "truong-hoc": "noi-that-truong-hoc"
  };

  const CATEGORY_BY_SLUG = new Map(CATEGORY_DEFINITIONS.map((item) => [item.slug, item]));
  const text = (value) => String(value == null ? "" : value).trim();
  const html = (value) => text(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));
  const normalize = (value) => text(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

  function currentCategorySlug() {
    const params = new URLSearchParams(window.location.search);
    const explicit = text(params.get("cat"));
    const segments = window.location.pathname.split("/").filter(Boolean);
    const routeSlug = segments[0] === "danh-muc" ? segments[1] : "";
    const requested = catalog.slugify(routeSlug || explicit);
    return CATEGORY_ALIASES[requested] || requested;
  }

  function setMeta(selector, attribute, value) {
    const target = document.querySelector(selector);
    if (target) target.setAttribute(attribute, value);
  }

  function setCanonical(url) {
    setMeta('link[rel="canonical"]', "href", url);
    setMeta('meta[property="og:url"]', "content", url);
  }

  function setDescription(description) {
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:description"]', "content", description);
  }

  function setRobots(value) {
    setMeta('meta[name="robots"]', "content", value);
  }

  function approvedImage(code) {
    const normalizedCode = text(code).toUpperCase();
    return APPROVED_CODES.has(normalizedCode)
      ? `/assets/products/approved/${encodeURIComponent(normalizedCode)}.webp`
      : "";
  }

  function productImage(row) {
    const approved = approvedImage(row.Code);
    if (approved) return { url: approved, source: "approved_local" };
    const candidate = text(row.Image_URL);
    if (/^https?:\/\//i.test(candidate) && !/\/images\/categories\//i.test(candidate)) {
      return { url: candidate, source: "productdb" };
    }
    return { url: "", source: "missing" };
  }

  function imageMarkup(row, options = {}) {
    const image = productImage(row);
    const loading = options.eager ? "eager" : "lazy";
    const priority = options.eager ? ' fetchpriority="high"' : "";
    if (!image.url) {
      return `<span class="sf-image-placeholder" data-image-status="missing">Đang cập nhật ảnh ${html(row.Code)}</span>`;
    }
    return `<img src="${html(image.url)}" alt="${html(row.ProductName)} — mã ${html(row.Code)}" width="1200" height="1000" loading="${loading}" decoding="async"${priority} data-product-code="${html(row.Code)}" data-image-source="${image.source}" />`;
  }

  function bindImageFallbacks(scope = document) {
    scope.querySelectorAll("img[data-product-code]").forEach((image) => {
      if (image.dataset.errorBound === "true") return;
      image.dataset.errorBound = "true";
      image.addEventListener("error", () => {
        const placeholder = document.createElement("span");
        placeholder.className = "sf-image-placeholder";
        placeholder.dataset.imageStatus = "load-error";
        placeholder.textContent = `Đang cập nhật ảnh ${image.dataset.productCode || "sản phẩm"}`;
        image.replaceWith(placeholder);
      }, { once: true });
    });
  }

  function detailUrl(row) {
    return `/product-detail.html?code=${encodeURIComponent(text(row.Code))}`;
  }

  function productCard(row) {
    const href = detailUrl(row);
    const category = text(row.Category) || text(row.Source_Group).replaceAll("_", " ") || "Sản phẩm";
    const size = text(row.Size) || "Thông số theo cấu hình";
    return `
      <article class="pf-product-card" data-product-code="${html(row.Code)}">
        <a href="${href}" aria-label="Xem ${html(row.ProductName)}">${imageMarkup(row)}</a>
        <div>
          <p>${html(row.Code)}</p>
          <h3><a href="${href}">${html(row.ProductName)}</a></h3>
          <span>${html(category)} · ${html(size)}</span>
          <strong>${html(catalog.money(row.SalePrice))}</strong>
        </div>
      </article>
    `;
  }

  function categoryDefinitionForRow(row) {
    return CATEGORY_DEFINITIONS.find((definition) => catalog.matchesCategory(row, definition.dataSlug))
      || CATEGORY_DEFINITIONS[0];
  }

  function categoryRowScore(row) {
    const approved = APPROVED_CODES.has(text(row.Code).toUpperCase()) ? 100000000 : 0;
    const hasImage = productImage(row).url ? 10000000 : 0;
    const price = Number(row.SalePrice || 0);
    return approved + hasImage + price;
  }

  function rowSearchText(row) {
    return normalize([
      row.Code,
      row.ProductName,
      row.Category,
      row.SubCategory,
      row.Source_Group,
      row.Material,
      row.Description
    ].join(" "));
  }

  function renderCategory(rows) {
    const params = new URLSearchParams(window.location.search);
    const slug = currentCategorySlug();
    const definition = CATEGORY_BY_SLUG.get(slug);
    const initialQuery = text(params.get("q"));
    const searchMode = !definition && Boolean(initialQuery);
    const activeDefinition = definition || {
      slug: "",
      dataSlug: "",
      name: searchMode ? `Kết quả cho “${initialQuery}”` : "Tất cả sản phẩm",
      shortName: "Danh mục sản phẩm",
      description: searchMode
        ? "Tìm theo mã, tên sản phẩm, nhóm sản phẩm hoặc chất liệu trong dữ liệu sản phẩm hiện hữu."
        : "Khám phá các nhóm sản phẩm nội thất chính của BA_Furniture.",
      image: "/assets/category/approved/category-office-desk.webp"
    };

    const canonical = definition
      ? `https://bafurni.com/danh-muc/${definition.slug}`
      : "https://bafurni.com/category.html";
    document.title = `${activeDefinition.name} | BA_Furniture`;
    setCanonical(canonical);
    setDescription(activeDefinition.description);
    setRobots(searchMode ? "noindex, follow" : "index, follow, max-image-preview:large");
    setMeta('meta[property="og:title"]', "content", document.title);
    setMeta('meta[property="og:image"]', "content", `https://bafurni.com${activeDefinition.image}`);

    window.BASiteShell?.setContext({
      pageType: "category",
      source: "bafurni-category",
      categoryName: activeDefinition.name,
      productCode: "",
      productName: ""
    });

    let baseRows = definition
      ? rows.filter((row) => catalog.matchesCategory(row, definition.dataSlug))
      : rows.slice();
    baseRows = baseRows
      .filter((row) => text(row.Code) && text(row.ProductName))
      .sort((first, second) => categoryRowScore(second) - categoryRowScore(first));

    root.innerHTML = `
      <div class="sf-container">
        <nav class="sf-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Trang chủ</a><span aria-hidden="true">/</span>
          <a href="/category.html">Sản phẩm</a><span aria-hidden="true">/</span>
          <span aria-current="page">${html(activeDefinition.name)}</span>
        </nav>
        <section class="sf-category-hero" aria-labelledby="category-title">
          <div class="sf-category-copy">
            <p class="sf-kicker">Danh mục BA_Furniture</p>
            <h1 id="category-title">${html(activeDefinition.name)}</h1>
            <p>${html(activeDefinition.description)}</p>
          </div>
          <figure class="sf-category-media">
            <img src="${html(activeDefinition.image)}" alt="${html(activeDefinition.name)}" width="1600" height="1200" fetchpriority="high" />
          </figure>
        </section>
        <section class="sf-category-content" aria-labelledby="category-products-title">
          <div class="sf-toolbar">
            <div class="sf-section-head">
              <p class="sf-kicker">Sản phẩm hiện có</p>
              <h2 id="category-products-title">Chọn theo nhu cầu sử dụng</h2>
              <p class="sf-result-copy" data-result-copy></p>
            </div>
            <div class="sf-controls">
              <label>Tìm trong danh mục
                <input type="search" data-category-search value="${html(initialQuery)}" placeholder="Tên hoặc mã sản phẩm" />
              </label>
              <label>Sắp xếp
                <select data-category-sort>
                  <option value="featured">Nổi bật</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="name">Tên A–Z</option>
                </select>
              </label>
            </div>
          </div>
          <div class="sf-product-grid" data-product-grid aria-live="polite"></div>
        </section>
      </div>
    `;

    const searchField = root.querySelector("[data-category-search]");
    const sortField = root.querySelector("[data-category-sort]");
    const resultCopy = root.querySelector("[data-result-copy]");
    const grid = root.querySelector("[data-product-grid]");

    function paint() {
      const query = normalize(searchField.value);
      let visible = query
        ? baseRows.filter((row) => rowSearchText(row).includes(query))
        : baseRows.slice();
      if (sortField.value === "price-asc") visible.sort((a, b) => Number(a.SalePrice || 0) - Number(b.SalePrice || 0));
      if (sortField.value === "price-desc") visible.sort((a, b) => Number(b.SalePrice || 0) - Number(a.SalePrice || 0));
      if (sortField.value === "name") visible.sort((a, b) => text(a.ProductName).localeCompare(text(b.ProductName), "vi"));

      const shown = visible.slice(0, 32);
      resultCopy.textContent = `${visible.length.toLocaleString("vi-VN")} sản phẩm phù hợp${visible.length > 32 ? " · đang hiển thị 32 sản phẩm đầu tiên" : ""}.`;
      grid.innerHTML = shown.length
        ? shown.map(productCard).join("")
        : `<div class="sf-empty"><h3>Chưa tìm thấy sản phẩm phù hợp.</h3><p>Thử tìm bằng mã sản phẩm hoặc một từ khóa ngắn hơn.</p></div>`;
      bindImageFallbacks(grid);

      window.BA_CATEGORY_QA = {
        route: definition ? `/danh-muc/${definition.slug}` : "/category.html",
        canonical,
        categorySlug: definition?.slug || "all",
        categoryName: activeDefinition.name,
        rowsLoaded: rows.length,
        categoryRowCount: baseRows.length,
        visibleCount: visible.length,
        renderedCount: shown.length,
        demoContentCount: document.querySelectorAll("[data-demo-content]").length
      };
    }

    searchField.addEventListener("input", paint);
    sortField.addEventListener("change", paint);
    paint();
  }

  function addStructuredProduct(row, image, canonical) {
    const current = document.querySelector('script[data-product-schema="true"]');
    current?.remove();
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.productSchema = "true";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: text(row.ProductName),
      sku: text(row.Code),
      description: text(row.Description),
      image: image ? new URL(image, window.location.origin).href : undefined,
      category: text(row.Category),
      url: canonical,
      offers: Number(row.SalePrice || 0) > 0 ? {
        "@type": "Offer",
        priceCurrency: "VND",
        price: Number(row.SalePrice),
        availability: "https://schema.org/InStock",
        url: canonical
      } : undefined
    });
    document.head.appendChild(schema);
  }

  function renderProductNotFound(requestedCode) {
    document.title = "Không tìm thấy sản phẩm | BA_Furniture";
    setRobots("noindex, follow");
    setCanonical("https://bafurni.com/product-detail.html");
    window.BASiteShell?.setContext({
      pageType: "product_detail",
      source: "bafurni-product-detail",
      productCode: requestedCode,
      productName: "",
      categoryName: ""
    });
    root.innerHTML = `
      <section class="sf-error">
        <p class="sf-kicker">Mã sản phẩm chưa hợp lệ</p>
        <h1>Chưa tìm thấy sản phẩm${requestedCode ? ` ${html(requestedCode)}` : ""}.</h1>
        <p>Kiểm tra lại mã sản phẩm hoặc quay về danh mục để tiếp tục khám phá.</p>
        <a class="sf-button sf-button-primary" href="/category.html">Xem danh mục sản phẩm</a>
      </section>
    `;
    window.BA_PRODUCT_DETAIL_QA = {
      requestedCode,
      found: false,
      rowsLoaded: catalog.rows().length,
      status: 404
    };
  }

  function renderProduct(rows) {
    const requestedToken = catalog.routeToken();
    const row = catalog.resolveProduct(requestedToken);
    if (!row) {
      renderProductNotFound(requestedToken);
      return;
    }

    const definition = categoryDefinitionForRow(row);
    const image = productImage(row);
    const canonical = `https://bafurni.com/product-detail.html?code=${encodeURIComponent(text(row.Code))}`;
    const description = text(row.Description)
      || `${text(row.ProductName)} mã ${text(row.Code)}, thuộc nhóm ${definition.name} tại BA_Furniture.`;
    document.title = `${text(row.ProductName)} (${text(row.Code)}) | BA_Furniture`;
    setDescription(description.slice(0, 160));
    setCanonical(canonical);
    setRobots("index, follow, max-image-preview:large");
    setMeta('meta[property="og:title"]', "content", document.title);
    if (image.url) setMeta('meta[property="og:image"]', "content", new URL(image.url, window.location.origin).href);
    addStructuredProduct(row, image.url, canonical);

    window.BASiteShell?.setContext({
      pageType: "product_detail",
      source: "bafurni-product-detail",
      productCode: row.Code,
      productName: row.ProductName,
      categoryName: definition.name
    });

    const specifications = [
      ["Mã sản phẩm", row.Code],
      ["Tên sản phẩm", row.ProductName],
      ["Danh mục", row.Category],
      ["Nhóm sản phẩm", row.SubCategory],
      ["Nhóm nguồn", text(row.Source_Group).replaceAll("_", " ")],
      ["Kích thước", row.Size],
      ["Chất liệu", row.Material],
      ["Giá tham khảo", catalog.money(row.SalePrice)],
      ["Tình trạng", "Liên hệ xác nhận"],
      ["Tư vấn cấu hình", "Theo nhu cầu và số lượng"],
      ["Giao hàng", "Theo khu vực và tiến độ dự án"],
      ["Nguồn dữ liệu", row.Source_URL ? "ProductDB hiện hữu" : "BA_Furniture"],
      ["Mã đối chiếu", row.Code]
    ].filter(([, value]) => text(value));

    const related = rows
      .filter((candidate) => text(candidate.Code).toUpperCase() !== text(row.Code).toUpperCase())
      .filter((candidate) => catalog.matchesCategory(candidate, definition.dataSlug))
      .filter((candidate) => productImage(candidate).url)
      .sort((first, second) => categoryRowScore(second) - categoryRowScore(first))
      .slice(0, 4);

    root.innerHTML = `
      <div class="sf-container sf-product-page">
        <nav class="sf-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Trang chủ</a><span aria-hidden="true">/</span>
          <a href="/danh-muc/${html(definition.slug)}">${html(definition.name)}</a><span aria-hidden="true">/</span>
          <span aria-current="page">${html(row.Code)}</span>
        </nav>
        <article class="sf-product-layout">
          <div class="sf-gallery">
            <div class="sf-gallery-main">${imageMarkup(row, { eager: true })}</div>
            <p class="sf-gallery-note">Hình ảnh dùng để nhận diện đúng mã sản phẩm. Màu sắc thực tế có thể thay đổi theo cấu hình vật liệu.</p>
          </div>
          <div class="sf-product-summary">
            <p class="sf-product-code">Mã sản phẩm ${html(row.Code)}</p>
            <h1>${html(row.ProductName)}</h1>
            <p class="sf-product-category">${html(definition.name)} · Tư vấn theo số lượng và yêu cầu triển khai.</p>
            <p class="sf-price">${html(catalog.money(row.SalePrice))}</p>
            <div class="sf-product-actions">
              <button class="sf-button sf-button-primary" type="button" data-open-wizard>Nhận báo giá sản phẩm</button>
              <a class="sf-button sf-button-secondary" href="tel:0929878666">Gọi 0929.878.666</a>
            </div>
            <p class="sf-product-description">${html(description)}</p>
            <section class="sf-specs" aria-labelledby="spec-title">
              <h2 id="spec-title">Thông tin sản phẩm</h2>
              <dl class="sf-spec-list">
                ${specifications.map(([label, value]) => `<div class="sf-spec-row"><dt>${html(label)}</dt><dd>${html(value)}</dd></div>`).join("")}
              </dl>
            </section>
            <p class="sf-origin-note">Thông tin được đọc từ ProductDB hiện hữu ở chế độ chỉ đọc. BA_Furniture sẽ xác nhận cấu hình, tồn kho và báo giá tại thời điểm tư vấn.</p>
          </div>
        </article>
        ${related.length ? `
          <section class="sf-related" aria-labelledby="related-title">
            <div class="sf-section-head">
              <p class="sf-kicker">Cùng nhóm sản phẩm</p>
              <h2 id="related-title">Sản phẩm liên quan</h2>
            </div>
            <div class="sf-product-grid">${related.map(productCard).join("")}</div>
          </section>
        ` : ""}
      </div>
    `;
    bindImageFallbacks(root);

    window.BA_PRODUCT_DETAIL_QA = {
      requestedCode: requestedToken,
      found: true,
      resolvedCode: text(row.Code),
      resolvedName: text(row.ProductName),
      rowsLoaded: rows.length,
      image: image.url,
      imageSource: image.source,
      categoryRoute: `/danh-muc/${definition.slug}`,
      specificationCount: specifications.length,
      relatedCount: related.length,
      leadContext: {
        source_page: document.querySelector('#quote-form [name="source_page"]')?.value,
        product_code: document.querySelector('#quote-form [name="product_code"]')?.value,
        product_name: document.querySelector('#quote-form [name="product_name"]')?.value
      }
    };
  }

  async function boot() {
    try {
      const rows = await catalog.load();
      const mode = document.body.dataset.pageType;
      if (mode === "product_detail") renderProduct(rows);
      else renderCategory(rows);
      document.documentElement.dataset.storefront = "ready";
    } catch (error) {
      console.error("BAFurniture storefront failed to load", error);
      root.innerHTML = `
        <section class="sf-error">
          <p class="sf-kicker">BA_Furniture</p>
          <h1>Chưa thể tải dữ liệu sản phẩm.</h1>
          <p>Vui lòng tải lại trang hoặc gọi 0929.878.666 để được hỗ trợ.</p>
        </section>
      `;
      document.documentElement.dataset.storefront = "error";
    }
  }

  boot();
})();
