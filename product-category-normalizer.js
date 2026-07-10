(function () {
  if (window.BAProductCategoryNormalizer || !window.BAProductDataAdapter) return;

  const adapter = window.BAProductDataAdapter;
  const originalNormalize = adapter.normalizeProductRow;
  if (typeof originalNormalize !== "function") return;

  function clean(value) {
    return value == null ? "" : String(value).trim();
  }

  function normalizeText(value) {
    return clean(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  }

  function sourceText(row, product) {
    return normalizeText([
      row?.Category,
      row?.SubCategory,
      row?.Source_Group,
      row?.ProductName,
      row?.ProductName_Clean,
      product?.category,
      product?.subCategory,
      product?.name
    ].join(" "));
  }

  function hasLockerSignal(text) {
    return /\blocker\b|\btu sat\b|tu gia cong|steel cabinet|steel locker|phone locker|tool cabinet|wardrobe steel/.test(text) ||
      text.includes("locker") ||
      text.includes("tu sat") ||
      text.includes("tu gia cong") ||
      text.includes("tu quan ao sat");
  }

  adapter.normalizeProductRow = function normalizeProductRowWithCategoryPatch(row, options) {
    const product = originalNormalize.call(adapter, row, options);
    if (!product || !product.ok) return product;

    const text = sourceText(row, product);
    if (hasLockerSignal(text)) {
      product.mainCategory = "LOCKER_STEEL";
      product.category = "Tủ sắt & Locker";
      if (!product.subCategory) product.subCategory = "Tủ sắt / locker";
      if (!product.flags.includes("category_normalized_locker")) product.flags.push("category_normalized_locker");
    }

    return product;
  };

  window.BAProductCategoryNormalizer = {
    version: "2026-07-10-s25",
    rules: ["locker", "tu sat", "tu gia cong", "steel cabinet", "steel locker", "tool cabinet"]
  };
})();
