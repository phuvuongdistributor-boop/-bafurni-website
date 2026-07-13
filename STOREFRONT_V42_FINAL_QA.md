# STOREFRONT V4.2 FINAL QA

Date: 2026-07-13

## Local QA

Local server:

- `http://127.0.0.1:4180`
- Vercel-style rewrites tested for `/danh-muc/*` and `/san-pham/*`

Viewports tested:

- 1440x900
- 1366x768
- 768x1024
- 390x844
- 360x800

Local checks:

- HTTP status for local tested pages: PASS
- Console error/warning: PASS
- Broken image after full-page scroll: PASS
- Missing image alt attribute: PASS
- Duplicate IDs: PASS
- Horizontal overflow: PASS
- Product route sample binding: PASS

Product route sample:

- TQ05
- GL304
- VT3B
- DT1890V2
- BRIMD01-4C15
- CT2412V1
- TU09K7CK
- TU983-3KS
- SF01
- BHS03-1
- TK60

## Public QA

Status: PASS.

Production commit:

- `815e3f845e81ac42448b6de6fb264b44c65ebeaf`

Required production URLs:

- `https://bafurni.com/`
- `https://bafurni.com/category.html`
- `https://bafurni.com/danh-muc/ghe-van-phong`
- `https://bafurni.com/danh-muc/ban-van-phong`
- `https://bafurni.com/san-pham/tq05-ghe-giam-doc-tq05`
- `https://bafurni.com/sitemap.xml`
- `https://bafurni.com/robots.txt`
- `https://portal.bafurni.com/`

Public checks:

- HTTP 200: PASS
- `https://bafurni.com/` contains `Danh mục sản phẩm BAFurniture`: PASS
- Category route `/danh-muc/ghe-van-phong`: PASS
- Product route `/san-pham/tq05-ghe-giam-doc-tq05`: PASS
- WebP category assets: PASS
- Manifest `CATEGORY_ASSET_MANIFEST_V42.json`: PASS
- Console errors: 0
- Broken images after full-page scroll: 0
- Horizontal overflow: 0
- Portal status: 200

Screenshots:

- `qa-screenshots/public-v42-home-desktop.png`
- `qa-screenshots/public-v42-home-mobile.png`
- `qa-screenshots/public-v42-category-desktop.png`
- `qa-screenshots/public-v42-category-mobile.png`
- `qa-screenshots/public-v42-product-mobile.png`
