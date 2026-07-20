# BAFurniture Website V2
# Milestone 3 - Hero Section
# Issue #3 - Hero Typography Polish

## Status

PASS

## Files Modified

- `website/style.css`
- `website/reports/screenshots/hero-typography-polish-desktop.png`
- `website/reports/screenshots/hero-typography-polish-mobile.png`
- `website/HERO_TYPOGRAPHY_POLISH_REPORT.md`

## Hero Typography Changes

- Added Hero-specific typography rules without changing the shared section label styles.
- `hero__eyebrow`:
  - compact `font-size: 12px`
  - strong `font-weight: 900`
  - tighter `line-height: 1.2`
  - tokenized color with `var(--color-accent)`
- `hero__title`:
  - responsive `font-size: clamp(40px, 5vw, 68px)`
  - stronger readability with `line-height: 1.09`
  - `font-weight: 900`
  - tokenized text color with `var(--color-text-primary)`
  - controlled max-width for better line breaks
- `hero__description`:
  - improved reading rhythm with `line-height: 1.7`
  - tokenized spacing with `var(--space-18)`
  - responsive `font-size: clamp(17px, 1.3vw, 18px)`
  - adjusted text width to `680px`

## Screenshots

- Desktop: `website/reports/screenshots/hero-typography-polish-desktop.png`
- Mobile check: `website/reports/screenshots/hero-typography-polish-mobile.png`

## QA

- Confirmed Hero text content was not changed.
- Confirmed Hero image paths were not changed.
- Confirmed 2-column Hero layout rules were not changed.
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

Completed Milestone 3 Hero Section Issue #3 only. No next issue was started.
