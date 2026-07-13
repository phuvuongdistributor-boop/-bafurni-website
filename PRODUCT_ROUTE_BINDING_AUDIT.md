# Product Route Binding Audit

Date: 2026-07-13
Scope: BAFurniture V4.1 critical product page recovery
Production: https://bafurni.com

## Root Cause

`product-detail.html` was a static sample page. Every `/san-pham/*` route was rewritten to that file and therefore rendered the same BA-GVP-01 product, category composite images and generic content.

## Audited Areas

- Vercel rewrite `/san-pham/(.*)` -> `/product-detail.html`: valid and preserved.
- ProductDB public bundle: `productdb-data.js`, phase 1 chunks and phase 2 compact bundle are readable, readonly and unchanged.
- Product route resolver: rebuilt in `product-detail-v41.js`.
- Product fallback logic: generic product fallback removed.

## Binding Rules Implemented

- Resolve route by product code prefix from slug or by `?code=`.
- Match against `Code` from `window.BA_PRODUCT_ROWS`.
- Render `ProductName`, `Code`, `Category`, `Image_URL`, `Size`, `Material`, `Description` from the matched row.
- If no row matches, render a clear not-found state.
- Never substitute BA-GVP-01 or another product for an unknown slug.

## Product URLs Tested

- `/san-pham/tq05-ghe-giam-doc-tq05`
- `/san-pham/tq01-ghe-giam-doc-tq01`
- `/san-pham/tq07-ghe-giam-doc-tq07`
- `/san-pham/tq08-ghe-giam-doc-tq08`
- `/san-pham/tq09-ghe-giam-doc-tq09`
- `/san-pham/tq11-ghe-giam-doc-tq11`
- `/san-pham/dt1890v2-ban-giam-doc-veneer-dt1890v2`
- `/san-pham/dt2010v2-ban-giam-doc-dt2010v2`
- `/san-pham/dt1890vm2-ban-giam-doc-dt1890vm2`
- `/san-pham/dt2010vm2-ban-giam-doc-dt2010vm2`
- `/san-pham/dt1890v4-ban-giam-doc-veneer-dt1890v4`
- `/san-pham/tu09k3gd-tu-ho-so-sat-tu09k3gd`
- `/san-pham/tu981-3kd-tu-ho-so-sat-3-ngan-tu981-3kd`
- `/san-pham/tu982-3kd-tu-ho-so-sat-6-khoang-tu982-3kd`
- `/san-pham/tu07-tu-sat-ho-so-tu07`
- `/san-pham/tu08-tu-sat-ho-so-tu08`
- `/san-pham/ct2412v1-ban-hop-go-cao-cap-ct2412v1`
- `/san-pham/ct2412vm1-ban-hop-cao-cap-ct2412vm1`
- `/san-pham/ct4016v19-ban-hop-cao-cap-ct4016v19`
- `/san-pham/sf01-sofa-van-phong-sf01`
- `/san-pham/sf01-1-ghe-sofa-don-sf01-1`
- `/san-pham/not-real-product-code` not-found control

## Result

- Correct binding count: 22 browser checks, including TQ05 desktop/mobile.
- Incorrect binding count: 0.
- Unknown route fallback to generic product: 0.
- ProductDB modified: NO.
