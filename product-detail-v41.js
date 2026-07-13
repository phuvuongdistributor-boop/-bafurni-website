(() => {
  const VERSION = "2026-07-13-v41";
  const root = document.getElementById("product-detail-root");
  if (!root) return;

  const phaseOneChunks = [
    "productdb-data.part1.js",
    "productdb-data.part2.js",
    "productdb-data.part3.js",
    "productdb-data.part4.js",
    "productdb-data.part5a.js",
    "productdb-data.part5b.js",
    "productdb-data.part5c.js",
    "productdb-data.part6.js",
    "productdb-data.part7.js",
    "productdb-data.part8.js",
    "productdb-data.part9.js",
    "productdb-data.part10.js"
  ];
  const loaded = new Set();
  let activeProduct = null;
  let activeImageStatus = "pending";

  function clean(value) {
    return String(value == null ? "" : value).trim();
  }

  function esc(value) {
    return clean(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }

  function slugify(value) {
    return clean(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "san-pham";
  }

  function money(value) {
    const amount = Number(value || 0);
    if (!Number.isFinite(amount) || amount <= 0) return "Liên hệ báo giá";
    return amount.toLocaleString("vi-VN") + "đ";
  }

  function detailUrl(row) {
    return `/san-pham/${slugify(`${row.Code || "sp"}-${row.ProductName || "san-pham"}`)}`;
  }

  function routeToken() {
    const params = new URLSearchParams(location.search);
    const codeParam = clean(params.get("code"));
    if (codeParam) return slugify(codeParam);
    const parts = location.pathname.split("/").filter(Boolean);
    const tail = parts[parts.length - 1] || "";
    if (tail && tail !== "product-detail.html") return slugify(decodeURIComponent(tail));
    return "";
  }

  function inferCategory(row) {
    const text = `${row.Source_Group || ""} ${row.SubCategory || ""} ${row.Category || ""} ${row.ProductName || ""}`.toLowerCase();
    if (/ban_hop|bàn họp|meeting/.test(text)) return { name: "Bàn họp", href: "/category.html?cat=ban-hop" };
    if (/ban_van|bàn|desk/.test(text)) return { name: "Bàn văn phòng", href: "/category.html?cat=ban-van-phong" };
    if (/locker/.test(text)) return { name: "Tủ locker", href: "/category.html?cat=locker" };
    if (/tu_|tủ|cabinet|hộc/.test(text)) return { name: "Tủ & Hộc tài liệu", href: "/category.html?cat=tu-hoc" };
    if (/sofa|ghế chờ|lounge/.test(text)) return { name: "Sofa & Ghế chờ", href: "/category.html?cat=sofa" };
    if (/truong|school|học sinh|giáo viên/.test(text)) return { name: "Nội thất trường học", href: "/category.html?cat=truong-hoc" };
    if (/ke_|kệ|giá kho|rack|shelving/.test(text)) return { name: "Kệ & Giá kho", href: "/category.html?cat=ke-gia-kho" };
    return { name: "Ghế văn phòng", href: "/category.html?cat=ghe-van-phong" };
  }

  function isProductImageUrl(url) {
    const value = clean(url);
    return /^https?:\/\//i.test(value) && !/\/images\/categories\//i.test(value);
  }

  function normalizeProduct(row) {
    const category = inferCategory(row);
    const imageUrl = isProductImageUrl(row.Image_URL) ? clean(row.Image_URL) : "";
    const images = {
      hero: imageUrl,
      gallery: imageUrl ? [imageUrl] : [],
      thumbnail: imageUrl,
      fallback: "missing-placeholder"
    };
    return {
      code: clean(row.Code),
      name: clean(row.ProductName) || clean(row.Code) || "Sản phẩm BA_Furniture",
      category: category.name,
      categoryHref: category.href,
      price: money(row.SalePrice),
      size: clean(row.Size),
      material: clean(row.Material),
      description: clean(row.Description),
      sourceGroup: clean(row.Source_Group),
      sourceUrl: clean(row.Source_URL),
      images,
      href: detailUrl(row),
      row
    };
  }

  function rows() {
    return Array.isArray(window.BA_PRODUCT_ROWS) ? window.BA_PRODUCT_ROWS.filter((row) => row && row.Code && row.ProductName) : [];
  }

  function findProduct() {
    const token = routeToken();
    if (!token) return null;
    const all = rows().slice().sort((a, b) => slugify(b.Code).length - slugify(a.Code).length);
    return all.find((row) => {
      const codeSlug = slugify(row.Code);
      const fullSlug = slugify(`${row.Code}-${row.ProductName}`);
      return token === codeSlug || token === fullSlug || token.startsWith(`${codeSlug}-`);
    }) || null;
  }

  function placeholder(label) {
    return `<div class="product-missing-image" role="img" aria-label="${esc(label)}"><span>Hình ảnh đang cập nhật</span><small>BA_Furniture sẽ xác nhận hình thực tế khi báo giá</small></div>`;
  }

  function setMeta(product) {
    document.title = `${product.name} | BA_Furniture`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", `${product.name} (${product.code}) - ${product.category}. Kích thước: ${product.size || "theo cấu hình"}. Chất liệu: ${product.material || "theo yêu cầu"}. BA_Furniture tư vấn và báo giá theo số lượng.`);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", `https://bafurni.com${product.href}`);
    let schema = document.getElementById("product-jsonld");
    if (!schema) {
      schema = document.createElement("script");
      schema.type = "application/ld+json";
      schema.id = "product-jsonld";
      document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      sku: product.code,
      category: product.category,
      brand: { "@type": "Brand", name: "BA_Furniture" },
      image: product.images.hero ? [product.images.hero] : undefined,
      description: product.description || undefined,
      offers: { "@type": "Offer", priceCurrency: "VND", availability: "https://schema.org/InStock", url: `https://bafurni.com${product.href}` }
    });
    if (product.images.hero) {
      const existing = document.querySelector('link[data-product-preload="hero"]');
      if (!existing) {
        const preload = document.createElement("link");
        preload.rel = "preload";
        preload.as = "image";
        preload.href = product.images.hero;
        preload.setAttribute("data-product-preload", "hero");
        document.head.appendChild(preload);
      }
    }
  }

  function renderLoading(message) {
    root.innerHTML = `<section class="product-recovery"><div class="container"><div class="product-loading"><span></span><p>${esc(message || "Đang tải dữ liệu sản phẩm...")}</p></div></div></section>`;
  }

  function renderNotFound() {
    activeProduct = null;
    activeImageStatus = "not-found";
    document.title = "Không tìm thấy sản phẩm | BA_Furniture";
    root.innerHTML = `<section class="product-recovery"><div class="container"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Trang chủ</a><span>/</span><a href="/category.html">Danh mục</a><span>/</span><span>Không tìm thấy</span></nav><div class="product-not-found"><div>${placeholder("Không tìm thấy hình sản phẩm")}</div><div><p class="eyebrow">Không tìm thấy sản phẩm</p><h1>Không tìm thấy mã sản phẩm phù hợp</h1><p>URL này không khớp với bản ghi ProductDB đang public. BA_Furniture không hiển thị sản phẩm mẫu thay thế để tránh nhầm thông tin báo giá.</p><div class="hero__actions"><a class="btn btn-primary" href="tel:0929878666">Gọi 0929.878.666</a><a class="btn btn-secondary" href="/category.html">Xem danh mục</a></div></div></div></div></section>`;
    window.BA_PRODUCT_DETAIL_QA = { found: false, requested: routeToken(), genericFallbackUsed: false, imageStatus: activeImageStatus, rowsLoaded: rows().length };
  }

  function renderProduct(row, phase) {
    const product = normalizeProduct(row);
    activeProduct = product;
    activeImageStatus = product.images.hero ? "productdb-url" : "missing-placeholder";
    setMeta(product);
    const description = product.description || "Mô tả chi tiết đang được BA_Furniture cập nhật theo cấu hình thực tế. Vui lòng liên hệ để xác nhận mẫu, vật liệu và tiến độ.";
    const mainMedia = product.images.hero
      ? `<img class="product-main-image" data-product-image="hero" src="${esc(product.images.hero)}" width="760" height="570" alt="${esc(product.name)}" fetchpriority="high" decoding="async">`
      : placeholder(product.name);
    const thumbs = product.images.gallery.length > 1
      ? `<div class="product-thumbs">${product.images.gallery.map((src, index) => `<button type="button" aria-label="Xem ảnh ${index + 1}"><img src="${esc(src)}" alt="${esc(product.name)} ${index + 1}" loading="lazy" decoding="async"></button>`).join("")}</div>`
      : "";
    root.innerHTML = `<section class="product-recovery"><div class="container"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Trang chủ</a><span>/</span><a href="${esc(product.categoryHref)}">${esc(product.category)}</a><span>/</span><span>${esc(product.code)}</span></nav><div class="product-page-grid"><div class="product-media-card"><div class="product-main-frame">${mainMedia}</div>${thumbs}<p class="product-image-note">${product.images.hero ? "Ảnh sản phẩm lấy từ ProductDB theo đúng mã " + esc(product.code) : "Sản phẩm chưa có ảnh trong ProductDB."}</p></div><article class="product-info-card"><p class="eyebrow">${esc(product.category)}</p><h1>${esc(product.name)}</h1><p class="product-code-pill">Mã sản phẩm: <strong>${esc(product.code)}</strong></p><p class="product-price">${esc(product.price)}</p><p class="product-desc">${esc(description)}</p><div class="hero__actions"><a class="btn btn-primary" href="tel:0929878666">Gọi tư vấn</a><a class="btn btn-secondary" href="tel:0929878666">Nhận báo giá</a></div><div class="spec-mini-grid"><div><span>Danh mục</span><strong>${esc(product.category)}</strong></div><div><span>Kích thước</span><strong>${esc(product.size || "Cập nhật khi báo giá")}</strong></div><div><span>Chất liệu</span><strong>${esc(product.material || "Cập nhật khi báo giá")}</strong></div><div><span>Nguồn dữ liệu</span><strong>ProductDB public readonly</strong></div></div></article></div></div></section><section class="section product-benefits"><div class="container trust-grid"><article><strong>Tư vấn đúng mã</strong><span>Thông tin trang được bind theo Code ${esc(product.code)}.</span></article><article><strong>Báo giá theo số lượng</strong><span>Giá hiển thị là dữ liệu tham khảo, đơn hàng dự án được xác nhận riêng.</span></article><article><strong>Vật liệu rõ ràng</strong><span>Đối chiếu chất liệu, kích thước và màu sắc trước khi đặt hàng.</span></article><article><strong>Giao lắp theo khu vực</strong><span>Nam Định, Hà Nam, Ninh Bình, Hưng Yên, Thái Bình.</span></article></div></section><section class="section related" id="related-products"><div class="container"><div class="section-heading compact"><p class="eyebrow">Sản phẩm liên quan</p><h2>Cùng nhóm ${esc(product.category)}</h2></div><div class="related-row"><span>Đang tải sản phẩm cùng nhóm...</span></div></div></section>`;
    const img = root.querySelector("[data-product-image='hero']");
    if (img) {
      img.addEventListener("load", () => {
        activeImageStatus = "productdb-url-loaded";
        updateQA(product, phase);
      }, { once: true });
      img.addEventListener("error", () => {
        activeImageStatus = "missing-placeholder-after-error";
        const frame = root.querySelector(".product-main-frame");
        if (frame) frame.innerHTML = placeholder(product.name);
        updateQA(product, phase);
      }, { once: true });
    }
    updateQA(product, phase);
  }

  function updateQA(product, phase) {
    window.BA_PRODUCT_DETAIL_QA = {
      found: !!product,
      code: product && product.code,
      name: product && product.name,
      category: product && product.category,
      imageStatus: activeImageStatus,
      imageUrl: product && product.images.hero,
      rowsLoaded: rows().length,
      chunksLoaded: Array.from(loaded),
      phase,
      genericFallbackUsed: false
    };
  }

  function renderRelated() {
    if (!activeProduct) return;
    const related = rows()
      .filter((row) => row.Code !== activeProduct.code && inferCategory(row).name === activeProduct.category)
      .slice(0, 4)
      .map(normalizeProduct);
    const box = document.querySelector("#related-products .related-row");
    if (!box) return;
    box.className = "product-grid product-grid--related";
    box.innerHTML = related.map((item) => {
      const media = item.images.thumbnail ? `<img src="${esc(item.images.thumbnail)}" alt="${esc(item.name)}" loading="lazy" decoding="async">` : `<div class="product-card-placeholder">Hình ảnh đang cập nhật</div>`;
      return `<a class="product-card" href="${esc(item.href)}">${media}<div><small>${esc(item.code)}</small><h3>${esc(item.name)}</h3><p>${esc(item.price)}</p></div></a>`;
    }).join("");
  }

  function loadScript(file) {
    if (loaded.has(file)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `/${file}?v=${VERSION}`;
      script.async = false;
      script.onload = () => { loaded.add(file); resolve(); };
      script.onerror = () => reject(new Error(`Cannot load ${file}`));
      document.head.appendChild(script);
    });
  }

  async function loadPhase2() {
    await loadScript("productdb-data.phase2.compact.js");
    if (window.BA_PRODUCTDB_PHASE2_READY && typeof window.BA_PRODUCTDB_PHASE2_READY.then === "function") {
      await window.BA_PRODUCTDB_PHASE2_READY;
    }
  }

  async function boot() {
    const started = performance.now();
    renderLoading("Đang đọc ProductDB...");
    try {
      await loadScript("productdb-data.js");
      await loadScript(phaseOneChunks[0]);
      let found = findProduct();
      if (found) renderProduct(found, "phase1-part1");
      const rest = phaseOneChunks.slice(1);
      for (const chunk of rest) {
        await loadScript(chunk);
        if (!activeProduct) {
          found = findProduct();
          if (found) renderProduct(found, `phase1-${chunk}`);
        }
      }
      await loadPhase2();
      if (!activeProduct) {
        found = findProduct();
        if (found) renderProduct(found, "phase2");
      }
      if (!activeProduct) renderNotFound();
      renderRelated();
      if (window.BA_PRODUCT_DETAIL_QA) {
        window.BA_PRODUCT_DETAIL_QA.bootMs = Math.round(performance.now() - started);
      }
    } catch (error) {
      console.error(error);
      root.innerHTML = `<section class="product-recovery"><div class="container"><div class="product-not-found"><div>${placeholder("Không tải được dữ liệu sản phẩm")}</div><div><p class="eyebrow">Lỗi tải dữ liệu</p><h1>Chưa thể tải ProductDB</h1><p>Vui lòng thử lại hoặc gọi BA_Furniture để được tư vấn trực tiếp.</p><a class="btn btn-primary" href="tel:0929878666">Gọi 0929.878.666</a></div></div></div></section>`;
      window.BA_PRODUCT_DETAIL_QA = { found: false, error: String(error), genericFallbackUsed: false };
    }
  }

  boot();
})();
