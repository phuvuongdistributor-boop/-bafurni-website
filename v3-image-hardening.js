(function () {
  if (window.BAFurnitureV3ImageHardening) return;

  function clean(value) { return value == null ? "" : String(value).trim(); }
  function esc(value) {
    return clean(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }
  function typeFromText(text) {
    const value = clean(text).toLowerCase();
    if (value.includes("lưới")) return "mesh";
    if (value.includes("chân quỳ") || value.includes("training") || value.includes("khách")) return "visitor";
    if (value.includes("ghế")) return "chair";
    if (value.includes("họp")) return "meeting";
    if (value.includes("bàn")) return "desk";
    if (value.includes("locker")) return "locker";
    if (value.includes("tủ")) return "cabinet";
    if (value.includes("sofa")) return "sofa";
    if (value.includes("trường")) return "school";
    if (value.includes("kệ") || value.includes("giá")) return "rack";
    return "utility";
  }
  function composite(name, type) {
    return `<span class="v3-composite v3-composite--${esc(type)} v3-composite--fallback" role="img" aria-label="Ảnh composite ${esc(name)}">
      <span class="v3-composite__brand">BA_Furniture</span>
      <strong>${esc(name)}</strong>
      <span class="v3-composite__scene" aria-hidden="true">
        <span class="v3-composite__item v3-composite__item--one"><i></i></span>
        <span class="v3-composite__item v3-composite__item--two"><i></i></span>
        <span class="v3-composite__item v3-composite__item--three"><i></i></span>
        <span class="v3-composite__item v3-composite__item--four"><i></i></span>
      </span>
    </span>`;
  }
  function titleForImage(img) {
    const scope = img.closest("article, a, li, section, .subcategory-card, .category-group-card, .product-card") || img.parentElement;
    return img.alt || scope?.querySelector("h1,h2,h3,strong,span")?.textContent || "BA_Furniture";
  }
  function replaceImage(img) {
    if (!img || img.dataset.v3HardeningApplied === "true") return;
    img.dataset.v3HardeningApplied = "true";
    const title = titleForImage(img);
    const wrapper = document.createElement("span");
    wrapper.className = "v3-image-fallback v3-image-fallback--compact";
    wrapper.innerHTML = composite(title, typeFromText(title));
    img.replaceWith(wrapper);
  }
  function run() {
    Array.from(document.images).forEach((img) => {
      const src = img.currentSrc || img.src || "";
      if (src.includes("/images/categories/") || src.includes("noithathoaphat.com") || (img.complete && img.naturalWidth === 0)) {
        replaceImage(img);
      } else {
        img.addEventListener("error", () => replaceImage(img), { once: true });
      }
    });
    document.documentElement.dataset.v3ImageHardening = "ready";
  }

  window.BAFurnitureV3ImageHardening = { run };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, { once: true });
  else run();
  [300, 900, 1800, 3600, 6400, 9600].forEach((delay) => window.setTimeout(run, delay));
  const observer = new MutationObserver(() => window.requestAnimationFrame(run));
  observer.observe(document.body, { childList: true, subtree: true });
})();
