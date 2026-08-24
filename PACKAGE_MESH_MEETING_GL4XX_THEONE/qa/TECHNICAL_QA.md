# Technical QA — GL4xx The One

Trạng thái local preview: **PASS**.

## Gate kết quả

- Static validator: 115/115 PASS.
- Browser validator: 191/191 PASS.
- Inventory: 24/24 Code exact.
- Product routes: 24/24 HTTP 200, đúng H1/Code/canonical/Product schema.
- Gallery: 46/46 asset exact-byte public mirror.
- Responsive: 1440×900, 1280×800, 768×1024, 390×844, 360×800.
- Broken image: 0.
- Console error: 0.
- Runtime/page error: 0.
- Failed request: 0.
- Horizontal overflow: 0.
- Placeholder/category fallback/wrong image: 0.
- Accepted watermark/QR/supplier logo/fake upscale: 0.

## M1A / M1C

- Landing + Facebook UTM → Quote Step 3: `facebook / social / gl4xx_theone / group_post_01`.
- Landing context: Code/name rỗng; category `ghe-luoi-phong-hop`.
- GL401 context: exact Code + exact name + category.
- GL401 → GL430: context cuối thay thành GL430; không giữ GL401.
- Direct new browser context: UTM rỗng.
- Shared `tools/test-m1c-product-context.js`: PASS.
- Lead submitted: **NO**.

## Regression

- Homepage: PASS.
- Executive Chair: PASS.
- GL3xx: PASS.
- SL Meeting Chair: PASS.
- ProductDB: unchanged.
- Portal: unchanged.
- Lead Engine/M1A/M1C/Apps Script: unchanged.

Machine-readable results:

- `STATIC_VALIDATION.json`
- `BROWSER_QA.json`
