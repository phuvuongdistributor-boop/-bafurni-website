(function () {
  const listing = document.querySelector(".category-template-page #category-listing");
  if (!listing || listing.dataset.filterEnhanced === "true") return;

  const layout = listing.querySelector(".category-template-layout");
  const productContainer = listing.querySelector(".category-template-products");
  if (!layout || !productContainer) return;

  const products = Array.from(productContainer.querySelectorAll(".product-card"));
  const categoryLibrary = Array.isArray(window.BA_CATEGORY_LIBRARY) ? window.BA_CATEGORY_LIBRARY : [];
  const chair = categoryLibrary.find((item) => item.id === "OFFICE_CHAIR") || categoryLibrary[0];
  const subcategories = chair ? chair.subcategories.map(([id, name]) => ({ id, name })) : [];

  products.forEach((card, index) => {
    const title = card.querySelector("h3")?.textContent.trim() || "";
    const meta = card.querySelector(".category-template-product-card__meta")?.textContent.trim() || "";
    const subcategory = card.dataset.subcategory || subcategories[index]?.id || "";
    card.dataset.searchText = `${title} ${meta} ${card.textContent}`.toLowerCase();
    card.dataset.category = "OFFICE_CHAIR";
    card.dataset.subcategory = subcategory;
    card.dataset.material = /da/i.test(meta + title) ? "leather" : /lưới|luoi/i.test(meta + title) ? "mesh" : /training|đào tạo/i.test(meta + title) ? "training" : "standard";
    card.dataset.size = /cao/i.test(meta + title) ? "high" : /gọn|gap|gấp|module/i.test(meta + title) ? "compact" : "standard";
    card.dataset.priceState = "contact";
  });

  const shell = document.createElement("div");
  shell.className = "ba-filter-shell";
  shell.innerHTML = `
    <div class="ba-filter-shell__top">
      <div class="ba-filter-shell__title">
        <strong>Tìm và lọc sản phẩm</strong>
        <span>Filter UI shell tĩnh, chưa nối ProductDB.</span>
      </div>
      <button class="ba-filter-shell__mobile-button" type="button" aria-expanded="false" aria-controls="ba-filter-panel">Mở bộ lọc</button>
    </div>
    <div class="ba-filter-overlay" data-filter-close></div>
    <div id="ba-filter-panel" class="ba-filter-panel" role="search" aria-label="Bộ lọc sản phẩm mẫu">
      <div class="ba-filter-field">
        <label for="ba-filter-search">Tìm kiếm</label>
        <input id="ba-filter-search" type="search" placeholder="Nhập tên hoặc mã sản phẩm" autocomplete="off" />
      </div>
      <div class="ba-filter-field">
        <label for="ba-filter-category">Danh mục</label>
        <select id="ba-filter-category">
          <option value="">Tất cả danh mục</option>
          ${categoryLibrary.map((item) => `<option value="${item.id}" ${item.id === "OFFICE_CHAIR" ? "selected" : ""}>${item.name}</option>`).join("")}
        </select>
      </div>
      <div class="ba-filter-field">
        <label for="ba-filter-subcategory">Nhóm nhỏ</label>
        <select id="ba-filter-subcategory">
          <option value="">Tất cả nhóm nhỏ</option>
          ${subcategories.map((item) => `<option value="${item.id}">${item.name}</option>`).join("")}
        </select>
      </div>
      <div class="ba-filter-field">
        <label for="ba-filter-material">Chất liệu</label>
        <select id="ba-filter-material">
          <option value="">Tất cả chất liệu</option>
          <option value="mesh">Lưới</option>
          <option value="leather">Da</option>
          <option value="training">Training</option>
          <option value="standard">Tiêu chuẩn</option>
        </select>
      </div>
      <div class="ba-filter-field">
        <label for="ba-filter-size">Kích thước</label>
        <select id="ba-filter-size">
          <option value="">Tất cả kích thước</option>
          <option value="standard">Tiêu chuẩn</option>
          <option value="compact">Gọn / module</option>
          <option value="high">Lưng cao</option>
        </select>
      </div>
      <div class="ba-filter-field">
        <label for="ba-filter-price">Giá</label>
        <select id="ba-filter-price">
          <option value="">Tất cả trạng thái giá</option>
          <option value="contact">Liên hệ báo giá</option>
        </select>
      </div>
      <div class="ba-filter-field">
        <label for="ba-filter-sort">Sắp xếp</label>
        <select id="ba-filter-sort">
          <option value="default">Mặc định</option>
          <option value="name-asc">Tên A-Z</option>
          <option value="name-desc">Tên Z-A</option>
        </select>
      </div>
      <button class="ba-filter-shell__clear" type="button">Xóa lọc</button>
      <button class="ba-filter-shell__close" type="button" data-filter-close>Đóng bộ lọc</button>
    </div>
  `;

  const resultBar = document.createElement("div");
  resultBar.className = "ba-filter-results";
  resultBar.setAttribute("aria-live", "polite");

  const emptyState = document.createElement("div");
  emptyState.className = "ba-filter-empty";
  emptyState.innerHTML = `
    <h3>Không tìm thấy sản phẩm phù hợp</h3>
    <p>Hãy xóa bớt điều kiện lọc hoặc liên hệ BA_Furniture để được tư vấn cấu hình/sản xuất theo yêu cầu.</p>
  `;

  layout.parentNode.insertBefore(shell, layout);
  layout.parentNode.insertBefore(resultBar, layout);
  layout.parentNode.insertBefore(emptyState, layout.nextSibling);

  const controls = {
    search: shell.querySelector("#ba-filter-search"),
    category: shell.querySelector("#ba-filter-category"),
    subcategory: shell.querySelector("#ba-filter-subcategory"),
    material: shell.querySelector("#ba-filter-material"),
    size: shell.querySelector("#ba-filter-size"),
    price: shell.querySelector("#ba-filter-price"),
    sort: shell.querySelector("#ba-filter-sort"),
    clear: shell.querySelector(".ba-filter-shell__clear"),
    mobile: shell.querySelector(".ba-filter-shell__mobile-button")
  };

  function matches(card) {
    const q = controls.search.value.trim().toLowerCase();
    if (q && !card.dataset.searchText.includes(q)) return false;
    if (controls.category.value && card.dataset.category !== controls.category.value) return false;
    if (controls.subcategory.value && card.dataset.subcategory !== controls.subcategory.value) return false;
    if (controls.material.value && card.dataset.material !== controls.material.value) return false;
    if (controls.size.value && card.dataset.size !== controls.size.value) return false;
    if (controls.price.value && card.dataset.priceState !== controls.price.value) return false;
    return true;
  }

  function sortProducts(visibleCards) {
    const sorted = [...products];
    if (controls.sort.value === "name-asc") {
      sorted.sort((a, b) => (a.querySelector("h3")?.textContent || "").localeCompare(b.querySelector("h3")?.textContent || "", "vi"));
    }
    if (controls.sort.value === "name-desc") {
      sorted.sort((a, b) => (b.querySelector("h3")?.textContent || "").localeCompare(a.querySelector("h3")?.textContent || "", "vi"));
    }
    sorted.forEach((card) => productContainer.appendChild(card));
    return visibleCards;
  }

  function applyFilters() {
    let visible = products.filter(matches);
    sortProducts(visible);
    products.forEach((card) => {
      const isVisible = visible.includes(card);
      card.hidden = !isVisible;
    });
    resultBar.innerHTML = `
      <span>${visible.length}/${products.length} sản phẩm mẫu đang hiển thị</span>
      <span>Mode: static filter shell, chưa nối ProductDB</span>
    `;
    emptyState.classList.toggle("is-visible", visible.length === 0);
  }

  function resetFilters() {
    controls.search.value = "";
    controls.category.value = "OFFICE_CHAIR";
    controls.subcategory.value = "";
    controls.material.value = "";
    controls.size.value = "";
    controls.price.value = "";
    controls.sort.value = "default";
    applyFilters();
    controls.search.focus();
  }

  function toggleDrawer(open) {
    shell.classList.toggle("is-open", open);
    controls.mobile.setAttribute("aria-expanded", String(open));
    controls.mobile.textContent = open ? "Đóng bộ lọc" : "Mở bộ lọc";
    document.body.classList.toggle("nav-open", open);
    if (open) controls.search.focus();
  }

  Object.values(controls).forEach((control) => {
    if (!control || control === controls.clear || control === controls.mobile) return;
    control.addEventListener("input", applyFilters);
    control.addEventListener("change", applyFilters);
  });

  controls.clear.addEventListener("click", resetFilters);
  controls.mobile.addEventListener("click", () => toggleDrawer(!shell.classList.contains("is-open")));
  shell.querySelectorAll("[data-filter-close]").forEach((button) => button.addEventListener("click", () => toggleDrawer(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && shell.classList.contains("is-open")) toggleDrawer(false);
  });

  listing.dataset.filterEnhanced = "true";
  applyFilters();
})();
