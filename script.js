const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Đóng menu" : "Mở menu");
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      mainNav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Mở menu");
    }
  });
}

function injectCategoryModule() {
  const productsSection = document.querySelector("#products");
  if (!productsSection || document.querySelector(".category-visual-section")) return;

  const chairPreviewCard = [...document.querySelectorAll(".category-card")].find((card) => card.textContent.includes("Ghế văn phòng"));
  if (chairPreviewCard instanceof HTMLAnchorElement) {
    chairPreviewCard.href = "category.html";
    chairPreviewCard.removeAttribute("target");
    chairPreviewCard.removeAttribute("rel");
  }

  if (!document.querySelector("#category-module-style")) {
    const style = document.createElement("style");
    style.id = "category-module-style";
    style.textContent = `
      .category-visual-section{overflow:hidden;background:linear-gradient(180deg,var(--color-background-muted),var(--color-surface));}
      .category-visual-section .section-head{max-width:760px;margin-right:auto;margin-bottom:var(--space-34);margin-left:auto;text-align:center;}
      .category-home-hero{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:var(--space-20);align-items:center;max-width:1180px;margin:var(--space-0) auto var(--space-28);padding:var(--space-24);background:linear-gradient(135deg,var(--color-surface),var(--color-background-muted));border:1px solid var(--color-border);border-radius:var(--radius-16);box-shadow:var(--shadow-none);transition:border-color var(--transition-fast) var(--ease-default),box-shadow var(--transition-fast) var(--ease-default),transform var(--transition-fast) var(--ease-default);}
      .category-home-hero:hover,.category-home-hero:focus-visible{border-color:var(--color-primary);box-shadow:var(--shadow-sm);transform:translateY(-3px);outline:none;}
      .category-home-hero:focus-visible{outline:2px solid var(--color-primary);outline-offset:4px;}
      .category-home-hero__icon,.category-subgroup-card__icon,.category-group-card__icon-badge{display:grid;place-items:center;color:var(--color-primary);background:var(--color-surface);border:1px solid var(--color-border);}
      .category-home-hero__icon{width:var(--space-72);height:var(--space-72);border-radius:var(--radius-16);}.category-home-hero svg,.category-subgroup-card svg,.category-group-card svg{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.8;}.category-home-hero svg{width:var(--space-40);height:var(--space-40);}
      .category-home-hero__copy{display:grid;gap:var(--space-8);min-width:0;}.category-home-hero__copy strong{color:var(--color-text-primary);font-size:clamp(24px,3vw,36px);line-height:1.1;}.category-home-hero__copy small{max-width:660px;color:var(--color-text-secondary);font-size:15px;line-height:1.55;}
      .category-home-hero__cta{display:inline-flex;min-height:42px;align-items:center;justify-content:center;padding:var(--space-10) var(--space-16);color:var(--color-text-inverse);background:var(--color-primary);border-radius:var(--radius-full);font-size:14px;font-weight:900;white-space:nowrap;}
      .category-group-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));max-width:1180px;margin:var(--space-0) auto;gap:var(--space-20);}.category-group-card{display:flex;flex-direction:column;overflow:hidden;min-height:100%;background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-16);box-shadow:var(--shadow-none);transition:border-color var(--transition-fast) var(--ease-default),box-shadow var(--transition-fast) var(--ease-default),transform var(--transition-fast) var(--ease-default);}.category-group-card:hover,.category-group-card:focus-visible,.category-group-card:focus-within{border-color:var(--color-primary);box-shadow:var(--shadow-sm);transform:translateY(-4px);outline:none;}.category-group-card:focus-visible{outline:2px solid var(--color-primary);outline-offset:4px;}
      .category-group-card__media{position:relative;display:grid;height:196px;overflow:hidden;background:linear-gradient(135deg,var(--color-secondary),var(--color-primary-dark));}.category-group-card__media img{width:100%;height:100%;object-fit:cover;display:block;}.category-group-card__placeholder{isolation:isolate;place-items:center;padding:var(--space-24);color:var(--color-text-inverse);text-align:center;}.category-group-card__placeholder::before{position:absolute;inset:var(--space-18);z-index:-1;content:"";border:1px solid var(--overlay-border-inverse);border-radius:var(--radius-16);}.category-group-card__placeholder::after{position:absolute;right:var(--space-24);bottom:var(--space-24);width:var(--space-84);height:var(--space-84);content:"";border:1px solid var(--overlay-border-inverse);border-radius:var(--radius-full);opacity:.55;}.category-group-card__placeholder--sofa{background:linear-gradient(135deg,var(--color-primary-dark),var(--color-secondary));}.category-group-card__placeholder--rack{background:linear-gradient(135deg,var(--color-secondary),var(--color-primary));}.category-group-card__placeholder-text{position:relative;z-index:1;padding:var(--space-10) var(--space-16);color:var(--color-text-inverse);background:var(--overlay-surface-inverse);border:1px solid var(--overlay-border-inverse);border-radius:var(--radius-full);font-size:14px;font-weight:900;}
      .category-group-card__icon-badge{position:absolute;left:var(--space-16);bottom:var(--space-16);width:var(--space-48);height:var(--space-48);border-radius:var(--radius-12);box-shadow:var(--shadow-sm);}.category-group-card__icon-badge svg{width:var(--space-28);height:var(--space-28);}.category-group-card__body{flex:1;padding:var(--space-22);}.category-group-card__body h3{margin:0 0 var(--space-10);color:var(--color-text-primary);font-size:21px;line-height:1.2;}.category-group-card__body p{margin:0;color:var(--color-text-secondary);font-size:15px;line-height:1.6;}
      .category-subgroup-panel{display:grid;grid-template-columns:minmax(220px,.75fr) minmax(0,1.7fr);gap:var(--space-24);align-items:center;max-width:1180px;margin:var(--space-32) auto 0;padding:var(--space-24);background:linear-gradient(135deg,var(--color-surface),var(--color-background-muted));border:1px solid var(--color-border);border-radius:var(--radius-16);}.category-subgroup-panel__head h3{margin:var(--space-8) 0 0;color:var(--color-text-primary);font-size:26px;line-height:1.15;}.category-subgroup-panel__head p{margin:var(--space-12) 0 0;color:var(--color-text-secondary);line-height:1.6;}.category-subgroup-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--space-10);align-content:start;}.category-subgroup-card{display:flex;min-height:58px;align-items:center;gap:var(--space-10);padding:var(--space-10) var(--space-12);color:var(--color-text-primary);background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-12);font-size:14px;font-weight:800;line-height:1.25;transition:border-color var(--transition-fast) var(--ease-default),background var(--transition-fast) var(--ease-default),box-shadow var(--transition-fast) var(--ease-default),transform var(--transition-fast) var(--ease-default);}.category-subgroup-card:hover,.category-subgroup-card:focus-visible{background:var(--color-surface-subtle);border-color:var(--color-primary);box-shadow:var(--shadow-sm);transform:translateY(-2px);outline:none;}.category-subgroup-card:focus-visible{outline:2px solid var(--color-primary);outline-offset:3px;}.category-subgroup-card__icon{flex:0 0 var(--space-38);width:var(--space-38);height:var(--space-38);border-radius:var(--radius-10);background:var(--color-background-muted);}.category-subgroup-card__icon svg{width:var(--space-24);height:var(--space-24);}
      @media(max-width:900px){.category-visual-section .section-head{text-align:left;}.category-home-hero{grid-template-columns:auto minmax(0,1fr);}.category-home-hero__cta{grid-column:2;width:fit-content;}.category-group-grid{grid-template-columns:repeat(2,1fr);}.category-subgroup-panel{grid-template-columns:1fr;}.category-subgroup-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
      @media(max-width:640px){.category-home-hero{grid-template-columns:1fr;gap:var(--space-16);padding:var(--space-18);}.category-home-hero__icon{width:var(--space-52);height:var(--space-52);}.category-home-hero__cta{grid-column:auto;width:100%;}.category-group-grid{grid-template-columns:1fr;gap:var(--space-14);}.category-group-card__media{height:154px;}.category-subgroup-panel{gap:var(--space-18);padding:var(--space-18);}.category-subgroup-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--space-8);}.category-subgroup-card{min-height:52px;gap:var(--space-8);padding:var(--space-8);font-size:13px;}.category-subgroup-card__icon{flex-basis:var(--space-32);width:var(--space-32);height:var(--space-32);}}
    `;
    document.head.appendChild(style);
  }

  const chairIcon = '<svg viewBox="0 0 24 24" focusable="false"><path d="M8 4h8l1 9H7L8 4Z"/><path d="M9 13v3h6v-3"/><path d="M12 16v4"/><path d="M8 20h8"/></svg>';
  const deskIcon = '<svg viewBox="0 0 24 24" focusable="false"><path d="M4 9h16"/><path d="M6 9v10"/><path d="M18 9v10"/><path d="M8 14h8"/></svg>';
  const cabinetIcon = '<svg viewBox="0 0 24 24" focusable="false"><path d="M6 4h12v16H6V4Z"/><path d="M6 10h12"/><path d="M6 15h12"/><path d="M11 7h2"/><path d="M11 13h2"/><path d="M11 18h2"/></svg>';
  const sofaIcon = '<svg viewBox="0 0 24 24" focusable="false"><path d="M6 11V8a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3"/><path d="M4 11h16v6H4v-6Z"/><path d="M6 17v2"/><path d="M18 17v2"/></svg>';
  const schoolIcon = '<svg viewBox="0 0 24 24" focusable="false"><path d="M5 6h14v8H5V6Z"/><path d="M8 18h8"/><path d="M12 14v4"/><path d="M7 10h10"/></svg>';
  const rackIcon = '<svg viewBox="0 0 24 24" focusable="false"><path d="M5 5h14"/><path d="M5 12h14"/><path d="M5 19h14"/><path d="M7 5v14"/><path d="M17 5v14"/></svg>';
  const subgroup = ["Ghế giám đốc","Ghế leader","Ghế lưới","Ghế chân quỳ","Ghế da","Ghế training","Ghế bar/cafe","Ghế xoay"];
  const subgroupIcons = [chairIcon,'<svg viewBox="0 0 24 24" focusable="false"><path d="M8 5h8l-1 7H7L8 5Z"/><path d="M8 12h8v4H8v-4Z"/><path d="M10 19h4"/><path d="M12 16v3"/></svg>','<svg viewBox="0 0 24 24" focusable="false"><path d="M8 4h8v9H8V4Z"/><path d="M10 6h4"/><path d="M10 9h4"/><path d="M9 13v4h6v-4"/><path d="M12 17v3"/></svg>','<svg viewBox="0 0 24 24" focusable="false"><path d="M8 5h8l-1 8H7L8 5Z"/><path d="M8 13h8"/><path d="M9 13v5"/><path d="M15 13v5"/><path d="M7 18h10"/></svg>','<svg viewBox="0 0 24 24" focusable="false"><path d="M8 4h8l1 9H7L8 4Z"/><path d="M10 7c2 1 4 1 6 0"/><path d="M8 13h8v4H8v-4Z"/><path d="M12 17v3"/></svg>','<svg viewBox="0 0 24 24" focusable="false"><path d="M7 5h7l-1 7H6L7 5Z"/><path d="M6 12h8v4H6v-4Z"/><path d="M14 10h5"/><path d="M16 10v4"/><path d="M9 16v4"/></svg>','<svg viewBox="0 0 24 24" focusable="false"><path d="M8 7h8v3H8V7Z"/><path d="M12 10v8"/><path d="M8 18h8"/><path d="M9 21h6"/><path d="M6 4h12"/></svg>','<svg viewBox="0 0 24 24" focusable="false"><path d="M8 5h8l-1 8H7L8 5Z"/><path d="M9 13v3h6v-3"/><path d="M12 16v4"/><path d="M7 20h10"/><path d="M17 7c2 1 2 4 0 5"/></svg>'];

  const section = document.createElement("section");
  section.className = "section category-visual-section";
  section.setAttribute("aria-labelledby", "category-visual-title");
  section.innerHTML = `
    <div class="section-head"><span class="section-label">Hệ thống danh mục</span><h2 id="category-visual-title">Danh mục sản phẩm BAFurniture</h2><p>Nhóm sản phẩm được sắp xếp theo nhu cầu mua sắm thực tế của văn phòng, trường học, nhà máy và dự án.</p></div>
    <a class="category-home-hero" href="category.html" aria-label="Xem trang danh mục Ghế văn phòng"><span class="category-home-hero__icon" aria-hidden="true">${chairIcon}</span><span class="category-home-hero__copy"><span class="section-label">Category Page</span><strong>Ghế văn phòng</strong><small>Trang danh mục mẫu có breadcrumb, subcategory visual, filter UI, product grid, empty state và CTA.</small></span><span class="category-home-hero__cta">Xem trang danh mục</span></a>
    <div class="category-group-grid" aria-label="Nhóm sản phẩm lớn">
      <a class="category-group-card" href="category.html" aria-label="Xem danh mục Ghế văn phòng"><div class="category-group-card__media category-group-card__placeholder"><span class="category-group-card__placeholder-text">Đang cập nhật ảnh</span><span class="category-group-card__icon-badge" aria-hidden="true">${chairIcon}</span></div><div class="category-group-card__body"><h3>Ghế văn phòng</h3><p>Ghế giám đốc, ghế lưới, ghế xoay, ghế họp và ghế training cho không gian làm việc hiện đại.</p></div></a>
      <article class="category-group-card"><div class="category-group-card__media"><img src="assets/products/office-desk.jpg" alt="Bàn văn phòng BA_Furniture"><span class="category-group-card__icon-badge" aria-hidden="true">${deskIcon}</span></div><div class="category-group-card__body"><h3>Bàn văn phòng</h3><p>Bàn nhân viên, bàn cụm, bàn quản lý và bàn theo mặt bằng cho doanh nghiệp.</p></div></article>
      <article class="category-group-card"><div class="category-group-card__media"><img src="assets/products/steel-cabinet.jpg" alt="Tủ và hộc tài liệu BA_Furniture"><span class="category-group-card__icon-badge" aria-hidden="true">${cabinetIcon}</span></div><div class="category-group-card__body"><h3>Tủ &amp; Hộc tài liệu</h3><p>Tủ hồ sơ, hộc di động, tủ tài liệu và giải pháp lưu trữ cho văn phòng.</p></div></article>
      <article class="category-group-card"><div class="category-group-card__media category-group-card__placeholder category-group-card__placeholder--sofa"><span class="category-group-card__placeholder-text">Đang cập nhật ảnh</span><span class="category-group-card__icon-badge" aria-hidden="true">${sofaIcon}</span></div><div class="category-group-card__body"><h3>Sofa &amp; Ghế lounge</h3><p>Sofa tiếp khách, ghế chờ, lounge văn phòng và khu vực lễ tân cao cấp.</p></div></article>
      <article class="category-group-card"><div class="category-group-card__media"><img src="assets/products/school-desk.jpg" alt="Nội thất trường học BA_Furniture"><span class="category-group-card__icon-badge" aria-hidden="true">${schoolIcon}</span></div><div class="category-group-card__body"><h3>Nội thất trường học</h3><p>Bàn ghế học sinh, giáo viên, thư viện, phòng chức năng và không gian đào tạo.</p></div></article>
      <article class="category-group-card"><div class="category-group-card__media category-group-card__placeholder category-group-card__placeholder--rack"><span class="category-group-card__placeholder-text">Đang cập nhật ảnh</span><span class="category-group-card__icon-badge" aria-hidden="true">${rackIcon}</span></div><div class="category-group-card__body"><h3>Kệ &amp; Giá kho</h3><p>Kệ lưu trữ, giá kho, kệ tài liệu và giải pháp sắp xếp cho kho vận hành.</p></div></article>
    </div>
    <div class="category-subgroup-panel" aria-labelledby="chair-subgroup-title"><div class="category-subgroup-panel__head"><span class="section-label">Nhóm nhỏ mẫu</span><h3 id="chair-subgroup-title">Ghế văn phòng</h3><p>Các nhóm nhỏ dùng để chuẩn hóa navigation, lọc sản phẩm và định hướng nội dung cho giai đoạn kết nối ProductDB sau này.</p></div><div class="category-subgroup-grid" aria-label="Nhóm nhỏ Ghế văn phòng">${subgroup.map((label, i) => `<a class="category-subgroup-card" href="category.html#category-listing"><span class="category-subgroup-card__icon" aria-hidden="true">${subgroupIcons[i]}</span><span class="category-subgroup-card__label">${label}</span></a>`).join("")}</div></div>`;
  productsSection.insertAdjacentElement("afterend", section);
}

injectCategoryModule();

const navLinks = document.querySelectorAll(".main-nav a");
const sections = [...document.querySelectorAll("main section[id]")];

if ("IntersectionObserver" in window && sections.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
  );

  sections.forEach((section) => observer.observe(section));
}
