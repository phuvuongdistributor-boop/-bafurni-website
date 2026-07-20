# BAFurniture Website V2
# Milestone 3 - Hero Section
# Issue #4 - Hero Visual Upgrade

## Status

PASS

## Files Modified

- `website/style.css`
- `website/reports/screenshots/hero-visual-upgrade-desktop.png`
- `website/reports/screenshots/hero-visual-upgrade-mobile.png`
- `website/HERO_VISUAL_UPGRADE_REPORT.md`

## Hero Changes

- Upgraded Hero visual style with a brighter, cleaner showroom-like background using existing color/overlay tokens.
- Refined desktop two-column balance between content and media.
- Added a subtle pill treatment to the Hero eyebrow for a more premium brand signal.
- Improved Hero title scale and rhythm while keeping the text unchanged.
- Upgraded Hero CTA presentation:
  - larger touch/click area
  - clearer primary button emphasis
  - lighter supporting button treatment
  - no link or function changes
- Polished trust cards with lighter surface styling, tokenized radius, and cleaner spacing.
- Upgraded the media area into a framed showcase panel:
  - subtle surface background
  - border
  - larger radius
  - tokenized shadow
  - balanced image/card positioning
- Added mobile safeguards so the framed media block stays full-width and does not break the layout.

## Screenshots

- Desktop: `website/reports/screenshots/hero-visual-upgrade-desktop.png`
- Mobile: `website/reports/screenshots/hero-visual-upgrade-mobile.png`

## QA

- Confirmed Hero links were not changed:
  - Portal CTA remains `https://portal.bafurni.com`
  - Quote CTA remains `#contact`
  - Hotline CTA remains `tel:0929878666`
  - Zalo placeholder remains `#`
- Confirmed Header, Footer, Product, JavaScript, API, and database were not modified.
- Confirmed Hero image assets still load:
  - `assets/products/meeting-table.jpg`
  - `assets/products/steel-cabinet.jpg`
  - `assets/products/locker.jpg`
- Static HTTP smoke test passed:
  - `/` -> `200 text/html`
  - `/style.css` -> `200 text/css`
  - `/script.js` -> `200 application/javascript`
  - `/robots.txt` -> `200 text/plain`
  - `/sitemap.xml` -> `200 text/xml`
  - `/assets/favicon.svg` -> `200 image/svg+xml`
  - `/assets/products/meeting-table.jpg` -> `200 image/jpeg`
  - `/assets/products/steel-cabinet.jpg` -> `200 image/jpeg`
  - `/assets/products/locker.jpg` -> `200 image/jpeg`

## Static Check Result

PASS. No package build pipeline is present for this static website, so static HTTP smoke test was used.

## Functional Impact

No functional change. This update only changes Hero presentation.

## Stop Rule

Completed Milestone 3 Hero Section Issue #4 only. No next issue was started.
