(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
  }

  const params = new URLSearchParams(location.search);
  const q = params.get('q');
  const searchInput = document.querySelector('.site-search input[name="q"]');
  if (q && searchInput) searchInput.value = q;

  const filter = document.getElementById('category-filter');
  const cards = Array.from(document.querySelectorAll('.product-grid--listing .product-card'));
  const empty = document.querySelector('.empty-state');
  function applyFilter(value) {
    const query = (value || '').trim().toLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const match = !query || card.innerText.toLowerCase().includes(query);
      card.hidden = !match;
      if (match) shown += 1;
    });
    if (empty) empty.hidden = shown !== 0;
  }
  if (filter) {
    if (q) filter.value = q;
    filter.addEventListener('input', event => applyFilter(event.target.value));
    applyFilter(filter.value);
  }

  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.src = '/images/categories/main/ghe-van-phong.webp';
    }, { once: true });
  });
})();
