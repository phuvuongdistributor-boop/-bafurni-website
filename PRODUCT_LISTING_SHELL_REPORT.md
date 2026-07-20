# BAFurniture Website V2
# Milestone 6 - Product UI
# Issue #2 - Product Listing UI Shell

## Status

PASS

## Files Modified

- `website/index.html`
- `website/style.css`
- `website/reports/screenshots/product-listing-shell-desktop.png`
- `website/reports/screenshots/product-listing-shell-mobile.png`
- `website/PRODUCT_LISTING_SHELL_REPORT.md`

## Product Listing Shell

Added a new static homepage section:

- Class: `product-listing-section`
- Grid: `product-listing-grid`
- Card component: `product-card`

The section includes:

- Section heading
- Short description
- 4 static placeholder product cards
- Placeholder image frame
- Sample product name
- Sample product code using `DEMO-*`
- Price text: `Liên hệ báo giá`
- CTA: `Nhận báo giá`

## Placeholder Cards

- `DEMO-CHAIR-01` - Ghế xoay văn phòng mẫu
- `DEMO-DESK-01` - Bàn làm việc 1m2 mẫu
- `DEMO-LOCKER-01` - Tủ locker 12 ngăn mẫu
- `DEMO-MEETING-01` - Bàn họp 2m4 mẫu

## Styling

- Added professional product card shell styling with existing design tokens:
  - color tokens
  - spacing tokens
  - radius tokens
  - shadow tokens
  - transition tokens
- Added image placeholder frame with fixed aspect ratio.
- Added clear product code, title, price text, and CTA hierarchy.
- Added hover/focus-within card lift.
- Added responsive grid:
  - desktop: 4 columns
  - tablet: 2 columns
  - mobile: 1 column

## Screenshots

- Desktop: `website/reports/screenshots/product-listing-shell-desktop.png`
- Mobile: `website/reports/screenshots/product-listing-shell-mobile.png`

## QA

- Confirmed ProductDB was not connected.
- Confirmed no real product data was used.
- Confirmed no existing render logic was changed.
- Confirmed JavaScript was not modified.
- Confirmed Header, Hero, Footer, API, and database were not modified.
- Static HTTP smoke test passed:
  - `/` -> `200 text/html`
  - `/style.css` -> `200 text/css`
  - `/script.js` -> `200 application/javascript`
  - `/robots.txt` -> `200 text/plain`
  - `/sitemap.xml` -> `200 text/xml`
  - `/assets/favicon.svg` -> `200 image/svg+xml`

## Static Check Result

PASS. No package build pipeline is present for this static website, so static HTTP smoke test was used.

## Functional Impact

No existing functionality changed. The new section is a static UI shell only.

## Stop Rule

Completed Milestone 6 Product UI Issue #2 only. No next issue was started.
