(function () {
  if (window.BAProductDataAdapter) return;

  const CONTACT_PRICE_LABEL = "Liên hệ báo giá";
  const DEFAULT_QUOTE_URL = "#product-quote";
  const DEFAULT_DETAIL_URL = "product-detail.html";
  const PLACEHOLDER_IMAGE = null;

  const mainCategoryRules = [
    [/gh[eế]|chair/i, "OFFICE_CHAIR", "Ghế văn phòng"],
    [/b[aà]n h[oọ]p|meeting/i, "MEETING_TABLE", "Bàn họp"],
    [/b[aà]n|desk/i, "OFFICE_DESK", "Bàn văn phòng"],
    [/t[uủ]|h[oộ]c|cabinet|pedestal/i, "CABINET_STORAGE", "Tủ & Hộc tài liệu"],
    [/locker|t[uủ] s[aắ]t/i, "LOCKER_STEEL", "Tủ sắt & Locker"],
    [/sofa|gh[eế] ch[oờ]/i, "SOFA_WAITING", "Sofa & Ghế chờ"],
    [/tr[uư][oờ]ng|school|h[oọ]c sinh/i, "SCHOOL_FURNITURE", "Nội thất trường học"],
    [/k[eệ]|gi[aá] kho|rack|shel/i, "SHELVING_RACK", "Kệ & Giá kho"],
    [/c[oô]ng tr[iì]nh|project|public/i, "PUBLIC_PROJECT", "Nội thất công cộng & công trình"],
    [/y t[eế]|medical/i, "MEDICAL_FURNITURE", "Nội thất y tế"],
    [/v[aá]ch|partition|ph[uụ] ki[eệ]n|accessory/i, "PARTITION_ACCESSORY", "Vách & Phụ kiện"]
  ];

  function clean(value) {
    if (value == null) return "";
    return String(value).trim();
  }

  function toNumber(value) {
    if (value == null || value === "") return null;
    const normalized = Number(String(value).replaceAll(".", "").replaceAll(",", ""));
    if (!Number.isFinite(normalized) || normalized <= 0) return null;
    return normalized;
  }

  function formatVnd(amount) {
    if (!amount) return CONTACT_PRICE_LABEL;
    return `${amount.toLocaleString("vi-VN")}đ`;
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

  function firstNonEmpty(...values) {
    return values.map(clean).find(Boolean) || "";
  }

  function normalizeImage(row, name, code, flags) {
    const src = firstNonEmpty(row.Image_URL, row.Thumbnail, row.HeroImage, row.LocalImage);
    const valid = src && (/^(https?:)?\/\//.test(src) || /^[./a-zA-Z0-9_-]+/.test(src));
    if (!valid) {
      flags.push("missing_image");
      return {
        src: PLACEHOLDER_IMAGE,
        alt: `${name || code || "Sản phẩm"} BA_Furniture`,
        status: "placeholder"
      };
    }
    return {
      src,
      alt: `${name || code || "Sản phẩm"} BA_Furniture`,
      status: "ready"
    };
  }

  function normalizePrice(row, flags) {
    const contactMode = /contact|li[eê]n h[eệ]/i.test(clean(row.Price_Mode));
    const candidates = [
      ["SalePrice", toNumber(row.SalePrice)],
      ["BasePrice", toNumber(row.BasePrice)],
      ["CatalogPrice", toNumber(row.CatalogPrice)]
    ];
    const found = candidates.find(([, amount]) => amount);
    if (contactMode || !found) {
      flags.push("missing_price");
      return {
        amount: null,
        label: CONTACT_PRICE_LABEL,
        mode: contactMode ? "CONTACT" : "CONTACT_FALLBACK",
        source: "CONTACT"
      };
    }
    return {
      amount: found[1],
      label: formatVnd(found[1]),
      mode: clean(row.Price_Mode) || found[0],
      source: found[0]
    };
  }

  function inferCategory(row, flags) {
    const raw = `${clean(row.Category)} ${clean(row.SubCategory)} ${clean(row.Source_Group)} ${clean(row.ProductName)} ${clean(row.ProductName_Clean)}`;
    const matched = mainCategoryRules.find(([pattern]) => pattern.test(raw));
    if (!matched) {
      flags.push("missing_category");
      return {
        id: clean(row.Category) || "UNMAPPED",
        name: clean(row.Category) || "Nội thất văn phòng"
      };
    }
    return { id: matched[1], name: matched[2] };
  }

  function normalizeGallery(row, image) {
    const base = image?.src || "";
    const groups = ["hero", "angle_45", "front", "side", "back", "detail", "material", "dimension", "real_project", "catalog"];
    return groups.map((type, index) => ({
      type,
      label: ["Hero", "Góc 45°", "Chính diện", "Bên", "Sau", "Chi tiết", "Vật liệu", "Kích thước", "Ảnh thực tế", "Catalogue"][index],
      src: index === 0 ? base : "",
      alt: `${clean(row.ProductName) || clean(row.Code) || "Sản phẩm BA_Furniture"} - ${type}`
    }));
  }

  function buildDetailUrl(code, name) {
    const slug = slugify(`${code || "sp"}-${name || "san-pham"}`);
    return `${DEFAULT_DETAIL_URL}?slug=${encodeURIComponent(slug)}&code=${encodeURIComponent(code || "")}`;
  }

  function normalizeProductRow(row = {}, options = {}) {
    const flags = [];
    const code = firstNonEmpty(row.Code, row.ProductCode, row.SKU);
    const fallbackId = firstNonEmpty(row.Product_UID, row.id, row.ID);
    const id = code || fallbackId;
    if (!code) flags.push("missing_code");
    if (!id) {
      return {
        ok: false,
        flags: ["missing_code", "missing_id"],
        reason: "Product row has no Code or Product_UID"
      };
    }

    const name = firstNonEmpty(row.ProductName, row.ProductName_Clean, row.Name, row.name) || "Sản phẩm BA_Furniture";
    if (name === "Sản phẩm BA_Furniture") flags.push("missing_name");

    const category = inferCategory(row, flags);
    const subCategory = firstNonEmpty(row.SubCategory, row.SubCategoryNormalized);
    if (!subCategory) flags.push("missing_subcategory");

    const image = normalizeImage(row, name, code || id, flags);
    const price = normalizePrice(row, flags);
    const size = firstNonEmpty(row.Size, row.Product_Size);
    const material = firstNonEmpty(row.Material);
    if (!size) flags.push("missing_size");
    if (!material) flags.push("missing_material");

    const detailUrl = options.detailUrl || buildDetailUrl(code || id, name);
    const quoteUrl = options.quoteUrl || DEFAULT_QUOTE_URL;

    return {
      ok: true,
      id,
      code: code || id,
      name,
      category: category.name,
      mainCategory: category.id,
      subCategory,
      description: firstNonEmpty(row.Description, row.ShortDescription),
      image,
      gallery: normalizeGallery(row, image),
      price,
      detailUrl,
      quoteUrl,
      source: {
        sourceUrl: firstNonEmpty(row.Source_URL, row.Search_URL),
        imageSource: firstNonEmpty(row.Image_Source),
        sourceGroup: firstNonEmpty(row.Source_Group)
      },
      meta: {
        size,
        material,
        status: firstNonEmpty(row.Status) || "ACTIVE",
        variant: firstNonEmpty(row.Variant)
      },
      flags
    };
  }

  function normalizeProducts(rows = [], options = {}) {
    const normalized = rows.map((row) => normalizeProductRow(row, options));
    const products = normalized.filter((item) => item.ok);
    const rejected = normalized.filter((item) => !item.ok);
    const flagCounts = products.reduce((acc, item) => {
      item.flags.forEach((flag) => {
        acc[flag] = (acc[flag] || 0) + 1;
      });
      return acc;
    }, {});
    return {
      products,
      rejected,
      stats: {
        inputCount: rows.length,
        outputCount: products.length,
        rejectedCount: rejected.length,
        flagCounts,
        missingImageRate: products.length ? (flagCounts.missing_image || 0) / products.length : 0,
        missingNameRate: products.length ? (flagCounts.missing_name || 0) / products.length : 0,
        missingCodeRate: rows.length ? (rows.length - products.length + (flagCounts.missing_code || 0)) / rows.length : 0
      }
    };
  }

  function validateProductViewModel(product) {
    const errors = [];
    ["id", "code", "name", "category", "detailUrl", "quoteUrl"].forEach((field) => {
      if (!clean(product?.[field])) errors.push(`missing_${field}`);
    });
    if (!product?.price?.label) errors.push("missing_price_label");
    if (!product?.image?.alt) errors.push("missing_image_alt");
    return { valid: errors.length === 0, errors };
  }

  window.BAProductDataAdapter = {
    normalizeProductRow,
    normalizeProducts,
    validateProductViewModel,
    formatVnd,
    slugify,
    constants: {
      CONTACT_PRICE_LABEL,
      DEFAULT_QUOTE_URL,
      DEFAULT_DETAIL_URL
    }
  };
})();
