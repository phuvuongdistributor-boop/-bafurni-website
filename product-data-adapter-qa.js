(function () {
  function mark() {
    const root = document.documentElement;
    const adapter = window.BAProductDataAdapter;
    if (!adapter) {
      root.dataset.productAdapter = "missing";
      return;
    }

    const rows = [
      {
        Code: "CT2412V1",
        ProductName: "Bàn họp gỗ cao cấp CT2412V1",
        Category: "BÀN",
        SubCategory: "MEETING_TABLE",
        Image_URL: "assets/products/meeting-table.svg",
        SalePrice: 6457000,
        Size: "W2400 x D1200 x H760 mm",
        Material: "Gỗ công nghiệp veneer"
      },
      {
        Product_UID: "NO-CODE-01",
        Category: "GHẾ",
        ProductName_Clean: "Ghế thiếu mã demo"
      }
    ];

    const normalized = adapter.normalizeProducts(rows);
    const first = normalized.products[0];
    const validation = adapter.validateProductViewModel(first);

    root.dataset.productAdapter = "ready";
    root.dataset.productAdapterOutput = String(normalized.stats.outputCount);
    root.dataset.productAdapterRejected = String(normalized.stats.rejectedCount);
    root.dataset.productAdapterValid = String(validation.valid);
    root.dataset.productAdapterGallery = String(first.gallery.length);
    root.dataset.productAdapterPrice = first.price.label;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mark, { once: true });
  } else {
    mark();
  }
})();
