(() => {
  const products = window.BA_V10_EXECUTIVE_CHAIRS || [];
  const params = new URLSearchParams(location.search);
  const kind = params.get("kind") || "hero";
  const canvasWidth = Number(params.get("w")) || 1200;
  const canvasHeight = Number(params.get("h")) || 1200;
  const code = String(params.get("code") || "TQ27").toUpperCase();
  const product = products.find((item) => item.code === code) || products[0];
  const byCodes = (...codes) => codes.map((item) => products.find((productItem) => productItem.code === item)).filter(Boolean);
  const figure = (item) => `<figure><img src="${item.image}" alt="${item.name}" /></figure>`;
  const root = document.querySelector("#creative");
  document.documentElement.style.width = `${canvasWidth}px`;
  document.documentElement.style.height = `${canvasHeight}px`;
  document.body.style.width = `${canvasWidth}px`;
  document.body.style.height = `${canvasHeight}px`;
  root.style.width = `${canvasWidth}px`;
  root.style.height = `${canvasHeight}px`;
  const brand = `<div class="brand">BA_Furniture</div>`;

  if (kind === "hero") root.innerHTML = `<section class="art hero-art">${brand}<div class="hero-copy"><p class="eyebrow">The One · Ghế lãnh đạo</p><h1>Chọn ghế theo cách làm việc.</h1><p class="sub">Tám mã. Đúng ảnh, đúng thông số, rõ khác biệt.</p></div><div class="hero-stage"><img src="${byCodes("TQ27")[0].image}" alt="TQ27" /></div><div class="hero-tag">TQ27 · Khổ lớn</div></section>`;
  if (kind === "collage") root.innerHTML = `<section class="art collage-art">${brand}<div class="collage-head"><p class="eyebrow">Executive Chair</p><h1>8 lựa chọn.<br />1 cách so sánh.</h1><p>Tỷ lệ · Cơ cấu · Vật liệu · Khoảng lùi</p></div><div class="collage-grid">${byCodes("TQ30","TQ26","TQ34","TQ39").map((item) => `<figure class="collage-item"><img src="${item.image}" alt="${item.code}" /><span>${item.code}</span></figure>`).join("")}</div></section>`;
  if (kind === "thumbnail") root.innerHTML = `<section class="art square-art">${brand}<div class="square-copy"><p class="eyebrow">The One</p><h1>Ghế<br />giám đốc</h1><p>8 mã theo nhu cầu thực tế</p></div><div class="square-products">${byCodes("TQ30","TQ27","TQ34").map(figure).join("")}</div></section>`;
  if (kind === "card") root.innerHTML = `<section class="art card-art">${brand}<div class="card-media"><img src="${product.image}" alt="${product.name}" /></div><div class="card-copy"><div><p class="eyebrow">The One</p><h1>${product.code}</h1><p class="name">${product.name}</p></div><p class="spec">${product.size}<br />${product.features.slice(0,2).join(" · ")}</p></div></section>`;
  if (kind === "og" || kind === "social") root.innerHTML = `<section class="art wide-art">${brand}<div class="wide-copy"><p class="eyebrow">The One · Executive Chair</p><h1>8 mẫu ghế.<br />Rõ cách chọn.</h1><p>So sánh theo kích thước, cơ cấu và vật liệu.</p></div><div class="wide-products">${byCodes("TQ30","TQ27","TQ34","TQ39").map(figure).join("")}</div><div class="wide-line"></div></section>`;
})();
