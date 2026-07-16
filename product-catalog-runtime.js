(() => {
  const VERSION = "2026-07-16-v52";
  const DATA_FILES = [
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
  const CATEGORY_ALIASES = { "tu-hoc-tai-lieu": "tu-hoc" };
  const loadedFiles = new Set();
  let loadPromise = null;

  function clean(value) {
    return String(value == null ? "" : value).trim();
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

  function searchableText(row) {
    return slugify([
      row.Code,
      row.ProductName,
      row.Category,
      row.SubCategory,
      row.Source_Group,
      row.Material
    ].join(" ")).replace(/-/g, " ");
  }

  function normalizeCategorySlug(slug) {
    const value = slugify(slug || "ghe-van-phong");
    return CATEGORY_ALIASES[value] || value;
  }

  function rowGroup(row) {
    return clean(row.Source_Group).toUpperCase();
  }

  function rowSubCategory(row) {
    return clean(row.SubCategory).toUpperCase();
  }

  function rowCategory(row) {
    return clean(row.Category).toUpperCase();
  }

  function matchesCategory(row, requestedSlug) {
    const slug = normalizeCategorySlug(requestedSlug);
    const group = rowGroup(row);
    const subCategory = rowSubCategory(row);
    const category = rowCategory(row);
    const text = searchableText(row);

    if (slug === "ghe-van-phong") return group === "GHE_VAN_PHONG";
    if (slug === "ban-van-phong") return group === "BAN_VAN_PHONG" || group === "BAN_MAY_TINH";
    if (slug === "ban-hop") return group === "BAN_HOP" || subCategory === "MEETING_TABLE";
    if (slug === "locker") return subCategory === "LOCKER" || /\blocker\b/.test(text);
    if (slug === "tu-hoc") {
      return subCategory !== "LOCKER" && ["TU_VAN_PHONG", "HOC_TU_PHU_GO", "HOC_SAT"].includes(group);
    }
    if (slug === "sofa") return group === "SOFA" || category === "SOFA VĂN PHÒNG";
    if (slug === "truong-hoc") return group === "NOI_THAT_TRUONG_HOC";
    if (slug === "ke-gia-kho") return group === "GIA_KE_SAT" || category === "KỆ";
    return false;
  }

  function matchesSubcategory(row, requestedSlug) {
    const slug = slugify(requestedSlug);
    if (!slug) return true;
    const group = rowGroup(row);
    const subCategory = rowSubCategory(row);
    const text = searchableText(row);
    const patterns = {
      "ghe-giam-doc": /\b(ghe )?(giam doc|lanh dao)\b/,
      "ghe-leader": /\b(truong phong|leader)\b/,
      "ghe-luoi": /\bghe luoi\b|\bluoi\b/,
      "ghe-chan-quy": /\bchan quy\b/,
      "ghe-da": /\bghe da\b|\bda that\b|\bda cao cap\b/,
      "ghe-training": /\b(training|dao tao)\b/,
      "ghe-bar-cafe": /\b(bar|cafe)\b/,
      "ghe-xoay": /\bghe xoay\b|\bxoay\b/,
      "ban-nhan-vien": /\bban nhan vien\b/,
      "ban-quan-ly": /\bban (quan ly|lanh dao)\b/,
      "ban-giam-doc": /\bban giam doc\b/,
      "ban-cum-module": /\b(cum ban|module)\b/,
      "ban-may-tinh": /\bban may tinh\b/,
      "ban-lam-viec": /\bban lam viec\b/,
      "ban-hop-lon": /\bban hop\b/,
      "ban-hop-nho": /\bban hop\b/,
      "ban-hop-oval": /\b(oval|elip)\b/,
      "ban-hoi-truong": /\bhoi truong\b/,
      "tu-tai-lieu": /\btu tai lieu\b/,
      "tu-ho-so": /\btu (ho so|tai lieu)\b/,
      "hoc-di-dong": /\bhoc (di dong|tai lieu|sat)\b/,
      "tu-thap": /\btu thap\b/,
      "tu-sat": /\btu sat\b/,
      "tu-locker": /\blocker\b/,
      "sofa-van-phong": /\bsofa van phong\b|\bsofa\b/,
      "sofa-sanh": /\bsofa\b.*\bsanh\b|\bsanh\b.*\bsofa\b/,
      "ghe-lounge": /\blounge\b/,
      "ghe-cho": /\bghe cho\b|\bbang cho\b/,
      "ban-hoc-sinh": /\bban (ghe )?hoc sinh\b/,
      "ghe-hoc-sinh": /\bghe hoc sinh\b/,
      "ban-giao-vien": /\bban giao vien\b/,
      "noi-that-mam-non": /\bmam non\b/,
      "tu-truong-hoc": /\btu (mam non|truong hoc)\b/,
      "ban-ghe-dao-tao": /\b(dao tao|ban ghe hoc sinh)\b/,
      "ke-sat": /\bke sat\b/,
      "gia-kho": /\bgia kho\b|\bke kho\b/,
      "ke-luu-tru": /\bke (luu tru|tai lieu|sat)\b/
    };
    if (slug === "ban-may-tinh") return group === "BAN_MAY_TINH" || patterns[slug].test(text);
    if (slug === "tu-locker") return subCategory === "LOCKER" || patterns[slug].test(text);
    if (slug === "tu-sat") return subCategory === "STEEL_CABINET" || patterns[slug].test(text);
    if (slug === "ban-hoi-truong") return subCategory === "BAN_HOI_TRUONG" || patterns[slug].test(text);
    if (slug === "ban-hoc-sinh") return subCategory === "BAN_HOC_SINH" || patterns[slug].test(text);
    if (slug === "ghe-hoc-sinh") return subCategory === "GHE_HOC_SINH" || patterns[slug].test(text);
    if (slug === "ke-sat" || slug === "gia-kho" || slug === "ke-luu-tru") {
      return subCategory === "STEEL_SHELVING" || patterns[slug].test(text);
    }
    return patterns[slug] ? patterns[slug].test(text) : true;
  }

  function isProductImageUrl(value) {
    const url = clean(value);
    return /^https?:\/\//i.test(url) && !/\/images\/categories\//i.test(url);
  }

  function money(value) {
    const amount = Number(value || 0);
    if (!Number.isFinite(amount) || amount <= 0) return "Liên hệ báo giá";
    return amount.toLocaleString("vi-VN") + "đ";
  }

  function detailUrl(row) {
    return `/san-pham/${slugify(`${row.Code || "sp"}-${row.ProductName || "san-pham"}`)}`;
  }

  function uniqueRows() {
    const source = Array.isArray(window.BA_PRODUCT_ROWS) ? window.BA_PRODUCT_ROWS : [];
    const seen = new Set();
    return source.filter((row) => {
      const code = clean(row && row.Code).toUpperCase();
      if (!code || !clean(row.ProductName) || seen.has(code)) return false;
      seen.add(code);
      return true;
    });
  }

  function routeToken(url = window.location) {
    const params = new URLSearchParams(url.search || "");
    const codeParam = clean(params.get("code"));
    if (codeParam) return slugify(codeParam);
    const parts = String(url.pathname || "").split("/").filter(Boolean);
    const tail = parts[parts.length - 1] || "";
    return tail && tail !== "product-detail.html" ? slugify(decodeURIComponent(tail)) : "";
  }

  function resolveProduct(token = routeToken()) {
    const requested = slugify(token);
    if (!requested) return null;
    return uniqueRows()
      .slice()
      .sort((a, b) => slugify(b.Code).length - slugify(a.Code).length)
      .find((row) => {
        const code = slugify(row.Code);
        const full = slugify(`${row.Code}-${row.ProductName}`);
        return requested === code || requested === full || requested.startsWith(`${code}-`);
      }) || null;
  }

  function productsForCategory(categorySlug, subcategorySlug = "", limit = 8) {
    const rows = uniqueRows().filter((row) => matchesCategory(row, categorySlug));
    const filtered = subcategorySlug ? rows.filter((row) => matchesSubcategory(row, subcategorySlug)) : rows;
    return filtered
      .filter((row) => isProductImageUrl(row.Image_URL))
      .sort((a, b) => {
        const priceOrder = Number(b.SalePrice || 0) - Number(a.SalePrice || 0);
        return priceOrder || clean(a.Code).localeCompare(clean(b.Code), "vi");
      })
      .slice(0, limit);
  }

  function toCard(row) {
    return {
      code: clean(row.Code),
      name: clean(row.ProductName),
      image: clean(row.Image_URL),
      price: money(row.SalePrice),
      href: detailUrl(row)
    };
  }

  function loadScript(file) {
    if (loadedFiles.has(file)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `/${file}?v=${VERSION}`;
      script.async = false;
      script.dataset.baProductdbFile = file;
      script.onload = () => {
        loadedFiles.add(file);
        resolve();
      };
      script.onerror = () => reject(new Error(`Cannot load ${file}`));
      document.head.appendChild(script);
    });
  }

  async function load() {
    if (loadPromise) return loadPromise;
    loadPromise = (async () => {
      await loadScript("productdb-data.js");
      await Promise.all(DATA_FILES.map(loadScript));
      await loadScript("productdb-data.phase2.compact.js");
      if (window.BA_PRODUCTDB_PHASE2_READY && typeof window.BA_PRODUCTDB_PHASE2_READY.then === "function") {
        await window.BA_PRODUCTDB_PHASE2_READY;
      }
      const rows = uniqueRows();
      const expected = Number(window.BA_PRODUCTDB_META && window.BA_PRODUCTDB_META.bundledCount) || 1000;
      if (rows.length !== expected) throw new Error(`Product bundle incomplete: ${rows.length}/${expected}`);
      window.BA_PRODUCT_CATALOG_QA = {
        rowsLoaded: rows.length,
        expectedRows: expected,
        bundleIntegrity: rows.length === expected && rows.every((row) => clean(row.Code) && clean(row.ProductName)),
        dataFilesLoaded: loadedFiles.size
      };
      return rows;
    })();
    return loadPromise;
  }

  window.BAProductCatalog = {
    load,
    rows: uniqueRows,
    routeToken,
    resolveProduct,
    productsForCategory,
    matchesCategory,
    matchesSubcategory,
    normalizeCategorySlug,
    slugify,
    money,
    detailUrl,
    toCard
  };
})();
