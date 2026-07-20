# COLOR SYSTEM REPORT - Sprint 1 Task 1.1

## Scope

Chuẩn hóa hệ thống màu cho BA_Furniture Website V2 UI Foundation.

Không đổi layout, Header, Hero, Footer, Product, spacing, typography, animation, component, package, logic, API hoặc database.

## Files Modified

- `website/style.css`
- `website/index.html`
- `website/COLOR_SYSTEM_REPORT.md`

## Color Token Location

Color tokens được khai báo tại:

- `website/style.css`
- Selector: `:root`

## Tokens Created

Core semantic tokens:

- `--color-primary`
- `--color-primary-dark`
- `--color-secondary`
- `--color-accent`
- `--color-background`
- `--color-background-muted`
- `--color-surface`
- `--color-surface-subtle`
- `--color-surface-contrast`
- `--color-border`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-text-muted`
- `--color-text-inverse`
- `--color-text-inverse-soft`
- `--color-text-footer`
- `--color-text-footer-muted`
- `--color-text-on-secondary`
- `--color-success`
- `--color-warning`
- `--color-danger`
- `--color-zalo`
- `--color-transparent`

Supporting effect tokens:

- `--overlay-surface-strong`
- `--overlay-surface-hero`
- `--overlay-background-hero`
- `--overlay-accent-hero`
- `--overlay-border-inverse`
- `--overlay-surface-inverse`
- `--overlay-border-footer`
- `--shadow-elevated`
- `--shadow-floating`

## What Changed

- Replaced legacy color aliases such as `--ink`, `--muted`, `--brand`, `--steel`, `--accent`, `--line`, `--soft`, `--paper`, `--zalo`, and `--shadow`.
- Replaced hard-coded CSS colors in component rules with semantic tokens.
- Consolidated repeated white, border, text, muted, footer, overlay, and shadow colors.
- Removed the hard-coded HTML `theme-color` meta because HTML meta content cannot reference CSS variables reliably.

## Validation

PASS:

- Semantic tokens exist in `:root`.
- Legacy color aliases removed.
- No hex or rgba color values remain outside `:root` token declarations in CSS.
- Local assets still resolve.
- Inline JSON-LD still parses.
- Static server checks:
  - `/` returns HTTP 200.
  - `/style.css` returns HTTP 200.
  - `/script.js` returns HTTP 200.

## Build Result

PASS.

This is a static website, so there is no package build step. Local static server validation succeeded.

## UI Impact

Expected visual impact: none.

Only color declarations were refactored into semantic CSS variables. Layout, spacing, typography, selectors, components, and JavaScript behavior were not changed.

## Stop

Task 1.1 completed. Stop before Sprint 1 Task 1.2.
