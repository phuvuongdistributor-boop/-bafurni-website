# BAFurniture Website V2
# Milestone 1 - UI Foundation
# Issue #5 - Shadow Foundation

## Status

PASS

## Files Modified

- `website/style.css`
- `website/SHADOW_FOUNDATION_REPORT.md`

## Shadow Tokens

Declared in `website/style.css` inside `:root`:

- `--shadow-none: none;`
- `--shadow-sm: 0 18px 44px rgba(19, 32, 42, 0.18);`
- `--shadow-md: 0 24px 60px rgba(19, 32, 42, 0.14);`
- `--shadow-lg: 0 24px 60px rgba(19, 32, 42, 0.14);`

## Replacements

- Replaced `5` hard-coded semantic shadow usages with scale tokens.
- Removed old shadow token references:
  - `--shadow-elevated`
  - `--shadow-floating`

## QA

- Confirmed no `box-shadow` declaration uses deprecated shadow tokens.
- Confirmed no direct hard-coded `box-shadow` values remain in `website/style.css`.
- Confirmed required static files exist:
  - `index.html`
  - `style.css`
  - `script.js`
  - `robots.txt`
  - `sitemap.xml`
- Confirmed referenced local assets used by homepage exist.
- Static HTTP smoke test passed:
  - `/` -> `200 text/html`
  - `/style.css` -> `200 text/css`
  - `/script.js` -> `200 application/javascript`
  - `/robots.txt` -> `200 text/plain`
  - `/sitemap.xml` -> `200 text/xml`
  - `/assets/favicon.svg` -> `200 image/svg+xml`

## Build Result

No package build pipeline is present for this static website. Static HTTP smoke test completed successfully.

## UI Impact

No intended visual change. Existing shadow values were preserved exactly and only moved to standardized design tokens.

## Stop Rule

Completed Issue #5 only. No next issue was started.
