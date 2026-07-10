# Sprint 25 - Product Bundle Expansion Phase 1

## Status
PASS - Static read-only product bundle expanded from 48 to 300 curated records for production release.

## Files changed
- `category-data.js`
- `site-modules-loader.js`
- `productdb-data.js`
- `productdb-data.part1.js`
- `productdb-data.part2.js`
- `productdb-data.part3.js`
- `productdb-data.part4.js`
- `productdb-data.part5a.js`
- `productdb-data.part5b.js`
- `productdb-data.part5c.js`
- `productdb-data.part6.js`
- `productdb-data.part7.js`
- `productdb-data.part8.js`
- `productdb-data.part9.js`
- `productdb-data.part10.js`
- `product-category-normalizer.js`
- `tools/export-product-bundle.py`
- `PRODUCT_EXPANSION_PHASE1_REPORT.md`

## Source and safety
- Source read: local `products.json` with 3301 ProductDB rows.
- ProductDB was not modified.
- Portal was not modified.
- The public bundle is static, read-only, and browser-rendered.

## Selection result
- Input rows: 3301
- Selected rows: 300
- Rejected rows: 3001
- Final public bundle count: 300
- Missing image rate in selected bundle: 0.0%
- Duplicate code count observed during validation: 521
- Duplicate slug count observed during validation: 515

## Category coverage
- OFFICE_CHAIR: 90
- OFFICE_DESK: 85
- CABINET_STORAGE: 75
- LOCKER_STEEL: 50

## Rejection reasons
- duplicate_code: 521
- duplicate_slug: 515
- not_phase1_category: 488
- missing_or_invalid_image: 255
- missing_subcategory: 135

## Implementation notes
- Bundle split into `productdb-data.js` init plus ten logical 30-row parts; `part5` is deployed as `part5a`, `part5b`, and `part5c` to keep connector payloads byte-stable during production release.
- `site-modules-loader.js` now uses root-relative module paths and cache-busting version `2026-07-10-s25`.
- `category-data.js` keeps the shared module bootstrap root-relative, so homepage, category page and product detail page all receive the product bundle without editing each HTML file.
- `product-category-normalizer.js` patches category normalization after the adapter loads, so locker / tủ sắt rows do not fall into generic cabinet storage.
- Product images are still lazy-loaded by the existing card renderers and use error fallback from `productdb-integration.js`.
- `tools/export-product-bundle.py` documents the repeatable export path for future phases.
- Sitemap product URL expansion is deferred to Sprint 30 final release audit to keep Sprint 25 focused on the public product bundle.

## QA
- Bundle generation PASS.
- Static bundle count PASS: 300 rows.
- Duplicate-selected-code check PASS.
- Duplicate-selected-slug check PASS.
- Existing sitemap remains unchanged in this sprint.
- Public browser screenshot verification may be limited by the in-app browser URL policy for `bafurni.com`; production source and Vercel deploy status must still be checked after commit.
