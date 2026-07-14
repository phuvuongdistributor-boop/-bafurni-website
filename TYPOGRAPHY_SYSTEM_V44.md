# BAFurniture V4.4 - Typography System

Date: 2026-07-14

## Files

- `script.js`
- `typography-v44.css`
- `TYPOGRAPHY_CONTENT_AUDIT.md`
- `TYPOGRAPHY_SYSTEM_V44.md`
- `CONTENT_DENSITY_REWRITE_REPORT.md`
- `TYPOGRAPHY_CONTENT_FINAL_QA.md`

## Font Tokens

Defined in `typography-v44.css`:

- `--font-primary`
- `--font-heading`

System stack:

```css
Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, "Helvetica Neue", sans-serif
```

No external font package was added.

## Type Tokens

Defined in `typography-v44.css`:

- `--type-heading`
- `--type-body`
- `--type-muted`
- `--type-link`

## Scale

Desktop:

- Hero H1: `clamp(36px, 3.4vw, 52px)`
- Category/Page H1: `clamp(32px, 3vw, 44px)`
- Section H2: `clamp(26px, 2.3vw, 34px)`
- Card title: 16-18px
- Body: 16px
- Meta: 13-14.5px

Mobile:

- Hero H1: 30-36px
- Page H1: 28-34px
- Section H2: 24-30px
- Body: 15-16px

## Rules Applied

- Heading weight normalized around 700.
- Button/nav/meta weight normalized around 600.
- Body line-height normalized to about 1.6.
- Card descriptions are clamped to 2 lines where appropriate.
- Product codes use nowrap/ellipsis safeguards.
- Public-facing technical words were removed from visible UI.

## Route Safety

Existing public slugs and routes were not renamed, including product URLs that already contain legacy terms.
