(function () {
  if (window.BAQuoteLeadModule) return;

  const version = "2026-07-11-s29-lead";
  const hotline = "0929878666";
  const hotlineLabel = "0929.878.666";
  const email = "contact@bafurni.com";
  const verifiedZaloUrl = "";

  function clean(value) {
    return value == null ? "" : String(value).replace(/\s+/g, " ").trim();
  }

  function escapeHTML(value) {
    return clean(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function stripLabel(value, labels) {
    let output = clean(value);
    labels.forEach((label) => {
      const expression = new RegExp(`^${label}\\s*:?\\s*`, "i");
      output = output.replace(expression, "");
    });
    return clean(output);
  }

  function currentUrl() {
    return window.location.href.split("#")[0];
  }

  function text(selector, root = document) {
    return clean(root.querySelector(selector)?.textContent);
  }

  function productFromWindow() {
    const product = window.BA_CURRENT_PRODUCT;
    if (!product || typeof product !== "object") return null;
    return {
      type: "product",
      name: clean(product.name) || "Sản phẩm BA_Furniture",
      code: clean(product.code) || "Đang cập nhật",
      category: clean(product.category) || "Nội thất BA_Furniture",
      subCategory: clean(product.subCategory),
      url: window.BARouting?.productUrl ? new URL(window.BARouting.productUrl(product), window.location.origin).href : currentUrl()
    };
  }

  function productFromDom() {
    const page = document.querySelector(".product-detail-page");
    if (!page) return null;
    const meta = [...document.querySelectorAll(".product-summary__meta span")].map((item) => clean(item.textContent));
    const code = clean(page.dataset.productdbRendered) || stripLabel(meta.find((item) => /^Mã/i.test(item)) || "", ["Mã", "Ma"]);
    const category = stripLabel(meta.find((item) => /^Danh mục/i.test(item)) || "", ["Danh mục", "Danh muc"]);
    const subCategory = stripLabel(meta.find((item) => /^Nhóm/i.test(item)) || "", ["Nhóm", "Nhom"]);
    return {
      type: "product",
      name: text("#product-title") || "Sản phẩm BA_Furniture",
      code: code || "Đang cập nhật",
      category: category || "Nội thất BA_Furniture",
      subCategory,
      url: currentUrl()
    };
  }

  function categoryFromDom() {
    const page = document.querySelector(".category-template-page");
    if (!page) return null;
    const name = text(".category-template-hero h1") || text("h1") || "Danh mục BA_Furniture";
    return {
      type: "category",
      name,
      code: "",
      category: name,
      subCategory: "",
      url: currentUrl()
    };
  }

  function getProductContext() {
    return productFromWindow() || productFromDom() || categoryFromDom() || {
      type: "general",
      name: "BA_Furniture",
      code: "",
      category: "Nội thất BA_Furniture",
      subCategory: "",
      url: currentUrl()
    };
  }

  function contextLabel(context) {
    if (context.type === "category") return `Danh mục - ${context.category}`;
    return [context.code, context.name].filter(Boolean).join(" - ") || context.name;
  }

  function quoteSubject(context) {
    if (context.type === "category") return `Yêu cầu báo giá danh mục ${context.category}`;
    return `Yêu cầu báo giá ${context.code} - ${context.name}`;
  }

  function encodeBody(fields, context) {
    const lines = [
      "Yêu cầu báo giá BA_Furniture",
      "",
      `Loại yêu cầu: ${context.type === "category" ? "Danh mục sản phẩm" : "Sản phẩm"}`,
      context.type === "category" ? `Danh mục: ${context.category}` : `Sản phẩm: ${context.name}`,
      context.code ? `Mã sản phẩm: ${context.code}` : "",
      context.type !== "category" ? `Danh mục: ${[context.category, context.subCategory].filter(Boolean).join(" / ")}` : "",
      `URL: ${context.url}`,
      "",
      `Họ tên: ${fields.name || ""}`,
      `Số điện thoại: ${fields.phone || ""}`,
      `Số lượng: ${fields.quantity || "Đang trao đổi"}`,
      `Khu vực giao hàng: ${fields.area || "Đang trao đổi"}`,
      "",
      "Nội dung yêu cầu:",
      fields.note || "Cần tư vấn cấu hình, chất liệu, kích thước và báo giá."
    ];
    return lines.filter((line) => line !== "").join("\n");
  }

  function quoteMailto(context, fields = {}) {
    return `mailto:${email}?subject=${encodeURIComponent(quoteSubject(context))}&body=${encodeURIComponent(encodeBody(fields, context))}`;
  }

  function validPhone(value) {
    return /^(0|\+84)[0-9\s.\-]{8,14}$/.test(clean(value));
  }

  function quoteTargetSelector(context) {
    if (context.type === "product" && document.querySelector("#product-quote")) return "#product-quote";
    if (document.querySelector("#category-contact")) return "#category-contact";
    return "";
  }

  function updateStaticQuoteLinks(context) {
    document.querySelectorAll('#product-quote a[href^="mailto:"], [data-lead-mail]').forEach((link) => {
      link.href = quoteMailto(context);
    });

    document.querySelectorAll("[data-lead-quote]").forEach((link) => {
      const target = quoteTargetSelector(context);
      link.href = target || quoteMailto(context);
      link.dataset.leadContext = context.type;
    });
  }

  function enhanceCategoryCtas(context) {
    if (context.type !== "category") return;
    const actions = document.querySelector(".category-template-cta__actions");
    if (!actions || actions.querySelector("[data-lead-quote]")) return;
    const quoteLink = document.createElement("a");
    quoteLink.className = "btn btn-light";
    quoteLink.href = "#category-contact";
    quoteLink.dataset.leadQuote = "category";
    quoteLink.textContent = "Nhận báo giá";
    actions.appendChild(quoteLink);
  }

  function renderQuoteForm() {
    const context = getProductContext();
    const quote = document.querySelector("#product-quote") || document.querySelector("#category-contact");
    if (!quote || quote.dataset.quoteLeadEnhanced === "true") {
      updateStaticQuoteLinks(context);
      return;
    }

    enhanceCategoryCtas(context);

    const form = document.createElement("form");
    form.className = "ba-quote-form";
    form.noValidate = true;
    form.dataset.leadContext = context.type;
    form.innerHTML = `
      <div class="ba-quote-form__grid">
        <div class="ba-quote-field">
          <label for="ba-lead-name">Họ tên</label>
          <input id="ba-lead-name" name="name" autocomplete="name" required placeholder="Tên người liên hệ" />
        </div>
        <div class="ba-quote-field">
          <label for="ba-lead-phone">Số điện thoại</label>
          <input id="ba-lead-phone" name="phone" autocomplete="tel" inputmode="tel" required placeholder="${hotlineLabel}" />
        </div>
        <div class="ba-quote-field">
          <label for="ba-lead-quantity">Số lượng</label>
          <input id="ba-lead-quantity" name="quantity" inputmode="numeric" placeholder="Ví dụ: 20 ghế" />
        </div>
        <div class="ba-quote-field">
          <label for="ba-lead-area">Khu vực giao hàng</label>
          <input id="ba-lead-area" name="area" autocomplete="address-level1" placeholder="Nam Định, Hà Nam..." />
        </div>
        <div class="ba-quote-field ba-quote-field--full">
          <label for="ba-lead-product">Nội dung báo giá</label>
          <input id="ba-lead-product" name="product" value="${escapeHTML(contextLabel(context))}" readonly />
        </div>
        <div class="ba-quote-field ba-quote-field--full">
          <label for="ba-lead-note">Yêu cầu thêm</label>
          <textarea id="ba-lead-note" name="note" placeholder="Kích thước, màu sắc, chất liệu, tiến độ, ngân sách..."></textarea>
        </div>
      </div>
      <div class="ba-quote-form__actions">
        <button class="btn btn-primary" type="submit">Gửi yêu cầu báo giá</button>
        <a class="btn btn-secondary" href="tel:${hotline}" aria-label="Gọi hotline BA_Furniture ${hotlineLabel}">Gọi ${hotlineLabel}</a>
        <a class="btn btn-light" href="#" data-placeholder="NEED_ZALO_LINK" aria-disabled="true">Chat Zalo</a>
      </div>
      <p class="ba-quote-message" role="status" aria-live="polite">Chế độ static: form sẽ mở email đã điền sẵn, không gửi tới endpoint giả.</p>
    `;

    const message = form.querySelector(".ba-quote-message");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const fields = Object.fromEntries(new FormData(form).entries());
      const name = clean(fields.name);
      const phone = clean(fields.phone);
      message.classList.remove("is-error", "is-success");
      if (!name) {
        message.textContent = "Vui lòng nhập họ tên người liên hệ.";
        message.classList.add("is-error");
        form.querySelector("#ba-lead-name")?.focus();
        return;
      }
      if (!validPhone(phone)) {
        message.textContent = "Vui lòng nhập số điện thoại hợp lệ.";
        message.classList.add("is-error");
        form.querySelector("#ba-lead-phone")?.focus();
        return;
      }

      message.textContent = "Đã tạo nội dung yêu cầu. Trình email của bạn sẽ mở để gửi cho BA_Furniture.";
      message.classList.add("is-success");
      window.location.href = quoteMailto(context, { ...fields, name, phone });
    });

    quote.appendChild(form);
    quote.dataset.quoteLeadEnhanced = "true";
    updateStaticQuoteLinks(context);
  }

  function renderStickyCta() {
    if (document.querySelector(".ba-sticky-cta")) return;
    if (!document.querySelector(".product-detail-page, .category-template-page")) return;
    const context = getProductContext();
    const target = quoteTargetSelector(context) || quoteMailto(context);
    const sticky = document.createElement("div");
    sticky.className = "ba-sticky-cta";
    sticky.dataset.leadContext = context.type;
    sticky.innerHTML = `
      <a class="ba-sticky-cta__call" href="tel:${hotline}" aria-label="Gọi hotline BA_Furniture ${hotlineLabel}">Gọi ngay</a>
      <a class="ba-sticky-cta__quote" href="${escapeHTML(target)}" data-lead-quote="sticky">Nhận báo giá</a>
    `;
    document.body.appendChild(sticky);
  }

  function annotateZaloPlaceholders() {
    document.querySelectorAll('[data-placeholder="NEED_ZALO_LINK"]').forEach((link) => {
      if (verifiedZaloUrl) {
        link.href = verifiedZaloUrl;
        link.removeAttribute("aria-disabled");
        link.removeAttribute("data-placeholder");
        return;
      }
      link.href = "#";
      link.dataset.leadZalo = "disabled";
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("aria-label", "Chat Zalo đang chờ cập nhật link chính thức");
      link.setAttribute("title", "Chat Zalo đang chờ cập nhật link chính thức");
      link.addEventListener("click", (event) => event.preventDefault());
    });
  }

  function boot() {
    const context = getProductContext();
    enhanceCategoryCtas(context);
    renderQuoteForm();
    renderStickyCta();
    annotateZaloPlaceholders();
    document.documentElement.dataset.quoteLeadModule = `ready:${version}`;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.BAQuoteLeadModule = {
    version,
    getProductContext,
    quoteMailto,
    renderQuoteForm,
    renderStickyCta
  };
})();