# BAFurniture Website V2
# Milestone 3 - Hero Section
# Issue #2 - Hero Layout Polish

## Status

PASS

## Files Modified

- `website/style.css`
- `website/reports/screenshots/hero-layout-polish-desktop.png`
- `website/reports/screenshots/hero-layout-polish-mobile.png`
- `website/HERO_LAYOUT_POLISH_REPORT.md`

## Hero Layout Changes

- Standardized Hero desktop as a clearer 2-column layout:
  - left column: `hero__content`
  - right column: `hero__media`
- Added `max-width: 1280px` to `hero__container` to match the header container width.
- Centered the Hero container with `margin: var(--space-0) auto`.
- Updated desktop columns to `minmax(0, 1.18fr) minmax(400px, 0.82fr)` so content has enough room while media remains prominent.
- Increased layout breathing room with tokenized gap:
  - `clamp(var(--space-40), 4vw, var(--space-64))`
- Vertically centered Hero content with `align-self: center`.
- Constrained the media column on desktop with `max-width: 560px` and aligned it to the right.
- Preserved the existing mobile behavior by overriding the media column to stretch under the existing `900px` breakpoint.

## Screenshots

- Desktop: `website/reports/screenshots/hero-layout-polish-desktop.png`
- Mobile check: `website/reports/screenshots/hero-layout-polish-mobile.png`

## QA

- Confirmed Hero text was not changed.
- Confirmed Hero image paths and alt text were not changed.
- Confirmed Header, Footer, Product, JavaScript, API, and database were not modified.
- Static HTTP smoke test passed:
  - `/` -> `200 text/html`
  - `/style.css` -> `200 text/css`
  - `/script.js` -> `200 application/javascript`
  - `/robots.txt` -> `200 text/plain`
  - `/sitemap.xml` -> `200 text/xml`
  - `/assets/favicon.svg` -> `200 image/svg+xml`
  - `/assets/products/meeting-table.jpg` -> `200 image/jpeg`

## Static Check Result

PASS. No package build pipeline is present for this static website, so static HTTP smoke test was used.

## Functional Impact

No functional change. Hero CTAs, portal link, hotline link, Zalo placeholder, and image rendering were preserved.

## Stop Rule

Completed Milestone 3 Hero Section Issue #2 only. No next issue was started.
