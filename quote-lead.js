(function () {
  if (window.BAQuoteLeadModule) return;

  const hotline = "0929878666";
  const email = "contact@bafurni.com";

  function clean(value) {
    return value == null ? "" : String(value).trim();
  }

  function getProductContext() {
    const page = document.querySelector(".product-detail-page");
    const name = clean(document.querySelector("#product-title")?.textContent) || "Sản phẩm BA_Furniture";
    const code = clean(page?.dataset.productdbRendered) || clean(document.querySelector(".product-summary__meta span")?.textContent.replace("Mã:", ""));
    const category = clean(document.querySelector(".product-summary__meta span:nth-child(2)")?.textContent.replace("Danh mục:", ""));
    return {
      name,
      code: code || "Đang cập nhật",
      category: category || "Nội thất BA_Furniture",
      url: window.location.href.split("#")[0]
    };
  }

  function encodeBody(fields, context) {
    return [
      "Yêu cầu báo giá BA_Furniture",
      "",
      `Sản phẩm: ${context.name}`,
      `Mã sản phẩm: ${context.code}`,
      `Danh mục: ${context.category}`,
      `URL: ${context.url}`,
      "",
      `Họ tên: ${fields.name}`,
      `Số điện thoại: ${fields.phone}`,
      `Số lượng: ${fields.quantity || "Đang trao đổi"}`,
      `Khu vực giao hàng: ${fields.area || "Đang trao đổi"}`,
      "",
      "Nội dung yêu cầu:",
      fields.note || "Cần tư vấn cấu hình, chất liệu, kích thước và báo giá."
    ].join("\n");
  }

  function validPhone(value) {
    return /^(0|\+84)[0-9\s.\-]{8,14}$/.test(clean(value));
  }

  function renderQuoteForm() {
    const quote = document.querySelector("#product-quote");
    if (!quote || quote.dataset.quoteLeadEnhanced === "true") return;
    const context = getProductContext();
    const form = document.createElement("form");
    form.className = "ba-quote-form";
    form.noValidate = true;
    form.innerHTML = `
      <div class="ba-quote-form__grid">
        <div class="ba-quote-field">
          <label for="ba-lead-name">Họ tên</label>
          <input id="ba-lead-name" name="name" autocomplete="name" required placeholder="Tên người liên hệ" />
        </div>
        <div class="ba-quote-field">
          <label for="ba-lead-phone">Số điện thoại</label>
          <input id="ba-lead-phone" name="phone" autocomplete="tel" inputmode="tel" required placeholder="0929.878.666" />
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
          <label for="ba-lead-product">Sản phẩm</label>
          <input id="ba-lead-product" name="product" value="${context.code} - ${context.name}" readonly />
        </div>
        <div class="ba-quote-field ba-quote-field--full">
          <label for="ba-lead-note">Yêu cầu thêm</label>
          <textarea id="ba-lead-note" name="note" placeholder="Kích thước, màu sắc, chất liệu, tiến độ, ngân sách..."></textarea>
        </div>
      </div>
      <div class="ba-quote-form__actions">
        <button class="btn btn-primary" type="submit">Gửi yêu cầu báo giá</button>
        <a class="btn btn-secondary" href="tel:${hotline}">Gọi 0929.878.666</a>
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
      const subject = `Yêu cầu báo giá ${context.code} - ${context.name}`;
      const body = encodeBody({ ...fields, name, phone }, context);
      message.textContent = "Đã tạo nội dung yêu cầu. Trình email của bạn sẽ mở để gửi cho BA_Furniture.";
      message.classList.add("is-success");
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });

    quote.appendChild(form);
    quote.dataset.quoteLeadEnhanced = "true";
  }

  function renderStickyCta() {
    if (document.querySelector(".ba-sticky-cta")) return;
    if (!document.querySelector(".product-detail-page, .category-template-page")) return;
    const sticky = document.createElement("div");
    sticky.className = "ba-sticky-cta";
    sticky.innerHTML = `
      <a class="ba-sticky-cta__call" href="tel:${hotline}">Gọi ngay</a>
      <a class="ba-sticky-cta__quote" href="#product-quote">Nhận báo giá</a>
    `;
    document.body.appendChild(sticky);
  }

  function annotateZaloPlaceholders() {
    document.querySelectorAll('[data-placeholder="NEED_ZALO_LINK"]').forEach((link) => {
      link.setAttribute("aria-label", "Chat Zalo đang chờ cập nhật link chính thức");
      link.setAttribute("title", "Chat Zalo đang chờ cập nhật link chính thức");
    });
  }

  renderQuoteForm();
  renderStickyCta();
  annotateZaloPlaceholders();
  window.BAQuoteLeadModule = { renderQuoteForm, renderStickyCta };
  document.documentElement.dataset.quoteLeadModule = "ready";
})();
