# PRODUCT DETAIL CONTENT ENGINE REPORT

Sprint: 26 - Product Detail Content Engine  
Date: 2026-07-10  
Production target: `phuvuongdistributor-boop/-bafurni-website` `main`

## Files changed

- `product-detail.html`
- `product-detail.css`
- `site-modules-loader.js`
- `product-detail-content-engine.js`

## What changed

- Added `product-detail-content-engine.js` as a dedicated Product Detail content renderer.
- Loaded the new engine through `site-modules-loader.js` after ProductDB integration.
- Added direct `site-modules-loader.js` loading to `product-detail.html` so product detail pages receive ProductDB/static bundle modules.
- Replaced static demo/noindex fallback copy in `product-detail.html` with production-safe BA_Furniture fallback content.
- Added `.product-summary__source` CSS for the ProductDB/source data line.

## Data mapping rendered

- Product name: `product.name`
- Code: `product.code`
- Category: `product.category`
- SubCategory: `product.subCategory`
- Gallery: `product.images`, `product.gallery`, `product.image`, then placeholder fallback
- Size: `product.meta.size`
- Material: `product.meta.material`
- Description: source description, adapter description, or ProductDB-based fallback
- Price/contact price: public price fields when present, otherwise `Lien he bao gia`
- Brand/source: BA_Furniture plus ProductDB/source group when present
- Related products: same subcategory first, then same category
- Quote CTA: product name, code, category, and URL are embedded in the mailto body

## Fallback rules

- Missing image: use the existing BA_Furniture gallery placeholder.
- Missing price: display contact-price copy.
- Missing size/material: display a clear "dang cap nhat" fallback without inventing specifications.
- Missing detailed description: build a short ProductDB-safe description from category/subcategory/name.
- Missing related products: keep the existing related grid fallback.

## Q@

- Static grep PASS:
  - `product-detail.html` no longer contains `noindex`.
  - Runtime-injected `_rum` / `_osh` scripts were removed from the clean file before commit.
  - `product-detail.html` now loads `site-modules-loader.js`.
  - `site-modules-loader.js` includes `product-detail-content-engine.js`.
- Local JS syntax tooling:
  - `node`, `deno`, and `bun` are not installed in this shell, so CLI syntax check could not run locally.
- Safety:
  - ProductDB was not modified.
  - Portal was not modified.
  - No runtime hotlink dependency was added.

## Deploy notes

- Verify public after deploy:
  - `https://bafurni.com/product-detail.html`
  - `https://bafurni.com/product-detail-content-engine.js`
  - A clean product URL generated from the static bundle
- Expected public signals:
  - `product-detail.html` contains `site-modules-loader.js`.
  - `product-detail-content-engine.js` returns HTTP 200.
  - Product detail page includes the content engine flag after runtime execution.
