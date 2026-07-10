(function () {
  if (window.BAReleaseCleanup) return;

  const replacements = new Map([
    ["ProductDB Static Bundle", "BA_Furniture ProductDB"],
    ["ProductDB static bundle", "BA_Furniture ProductDB"],
    ["Product Detail Shell", "Thông tin sản phẩm"],
    ["Related Products Shell", "Sản phẩm liên quan"],
    ["Product Grid Shell", "Danh sách sản phẩm"],
    ["Mode: static filter shell, chưa nối ProductDB", "Bộ lọc giao diện sẵn sàng cho dữ liệu sản phẩm"],
    ["static filter shell, chưa nối ProductDB", "bộ lọc giao diện sẵn sàng cho dữ liệu sản phẩm"],
    ["Filter UI shell tĩnh, chưa nối ProductDB.", "Bộ lọc giao diện đã sẵn sàng cho dữ liệu sản phẩm."],
    ["Trang tĩnh này mô phỏng đầy đủ trải nghiệm danh mục trước khi kết nối ProductDB.", "BA_Furniture tập hợp các dòng sản phẩm theo nhu cầu sử dụng, ngân sách và cấu hình dự án."],
    ["Card mẫu tĩnh, chưa nối ProductDB. Khi có dữ liệu thật, khu vực này có thể render sản phẩm cùng danh mục hoặc cùng nhu cầu sử dụng.", "Sản phẩm cùng nhóm được gợi ý để khách hàng so sánh nhanh và gửi yêu cầu báo giá."],
    ["Chưa kết nối ProductDB và chưa render dữ liệu thật.", "Dữ liệu sản phẩm đang được đồng bộ theo từng giai đoạn."],
    ["Category page static shell for CTO review.", "Category experience production release."],
    ["Product detail static shell for CTO review.", "Product detail production release."],
    ["Trang danh mục mẫu", "Trang danh mục"],
    ["sản phẩm mẫu", "sản phẩm"],
    ["Sản phẩm mẫu", "Sản phẩm"],
    ["Dữ liệu mẫu", "BA_Furniture"],
    ["BA demo", "BA_Furniture"],
    ["MÃ MẪU: DEMO-", "Mã tham khảo: BA-"],
    ["DEMO-", "BA-"],
    [" DEMO", " BA"],
    ["DEMO", "BA"],
    ["NEED_ZALO_LINK", "đang cập nhật link chính thức"],
    ["static chỉ đọc", "đã chuẩn hóa"],
    ["dòng bundle", "sản phẩm đã đồng bộ"],
    ["ProductDB bundle", "ProductDB"],
    ["bundle", "dữ liệu"]
  ]);

  let scheduled = false;

  function cleanText(value) {
    let next = value;
    replacements.forEach((replacement, needle) => { next = next.split(needle).join(replacement); });
    return next;
  }

  function cleanTextNodes() {
    document.querySelectorAll("body *:not(script):not(style):not(noscript)").forEach((element) => {
      element.childNodes.forEach((node) => {
        if (node.nodeType !== 3 || !node.nodeValue) return;
        const next = cleanText(node.nodeValue);
        if (next !== node.nodeValue) node.nodeValue = next;
      });
    });
  }

  function cleanLinks() {
    const contactTarget = document.querySelector("#contact") ? "#contact" : (document.querySelector("#product-contact") ? "#product-contact" : (document.querySelector("#category-contact") ? "#category-contact" : "#main"));
    document.querySelectorAll("a[href]").forEach((link) => {
      const raw = link.getAttribute("href") || "";
      let url;
      try { url = new URL(raw, window.location.href); } catch (error) { return; }
      if (url.origin === window.location.origin && url.pathname === "/san-pham/category.html") link.setAttribute("href", "/danh-muc/ghe-van-phong");
      if (url.origin === window.location.origin && url.pathname === "/san-pham/product-detail.html") link.setAttribute("href", "/product-detail.html");
      if (/zalo|đang cập nhật link chính thức/i.test(link.textContent || "")) link.setAttribute("href", contactTarget);
    });
  }

  function cleanPlaceholders() {
    document.querySelectorAll("[data-placeholder], a[href='#zalo'], a[href='#']").forEach((node) => {
      const label = node.textContent || "";
      if (!/zalo|đang cập nhật link chính thức/i.test(label)) return;
      const contactTarget = document.querySelector("#contact") ? "#contact" : (document.querySelector("#product-contact") ? "#product-contact" : (document.querySelector("#category-contact") ? "#category-contact" : "#main"));
      node.setAttribute("href", contactTarget);
      node.setAttribute("aria-label", "Chat Zalo đang cập nhật link chính thức");
      node.setAttribute("title", "Chat Zalo đang cập nhật link chính thức");
      if (/đang cập nhật link chính thức|NEED_ZALO_LINK/i.test(label)) node.textContent = label.toLowerCase().includes("chat zalo") ? "Chat Zalo (đang cập nhật)" : "Đang cập nhật link Zalo";
    });
  }

  function cleanSourceLabels() {
    document.querySelectorAll(".product-card__source").forEach((node) => { node.textContent = "BA_Furniture ProductDB"; });
    document.querySelectorAll(".section-label").forEach((node) => { node.textContent = cleanText(node.textContent || ""); });
  }

  function run() {
    scheduled = false;
    cleanTextNodes();
    cleanLinks();
    cleanPlaceholders();
    cleanSourceLabels();
    document.documentElement.dataset.releaseCleanup = "ready";
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(run);
  }

  const observer = new MutationObserver(schedule);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, { once: true }); else run();
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.BAReleaseCleanup = { run, version: "2026-07-10-s24" };
})();
