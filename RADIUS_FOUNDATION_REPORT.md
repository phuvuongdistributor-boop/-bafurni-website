# BORDER RADIUS FOUNDATION REPORT - Milestone 1 Issue #4

## Scope

Chuẩn hóa toàn bộ `border-radius` bằng Design Tokens.

Không đổi độ bo góc thực tế, layout, màu, font, shadow, Header, Hero, Footer, Product, JS, API, database hoặc package.

## Files Modified

- `website/style.css`
- `website/RADIUS_FOUNDATION_REPORT.md`

## Token Location

Radius tokens được khai báo tại:

- `website/style.css`
- Selector: `:root`

## Radius Tokens

- `--radius-0: 0`
- `--radius-4: 4px`
- `--radius-6: 6px`
- `--radius-8: 8px`
- `--radius-10: 10px`
- `--radius-12: 12px`
- `--radius-16: 16px`
- `--radius-24: 24px`
- `--radius-full: 9999px`

## Border Radius Replaced

- 19 `border-radius` declarations were replaced with `var(--radius-*)`.
- Original radius values preserved exactly:
  - `6px` -> `var(--radius-6)`
  - `8px` -> `var(--radius-8)`
  - `10px` -> `var(--radius-10)`
  - `12px` -> `var(--radius-12)`

## Validation

PASS:

- Required example tokens are present: `--radius-0`, `--radius-4`, `--radius-8`, `--radius-12`, `--radius-16`, `--radius-24`, `--radius-full`.
- No hard-coded `px` or `9999px` values remain in `border-radius` declarations outside token definitions.
- All 19 `border-radius` declarations use radius tokens.
- Static server checks:
  - `/` returns HTTP 200.
  - `/style.css` returns HTTP 200.
  - `/script.js` returns HTTP 200.

## Build Result

PASS.

This is a static website, so no package build step is required. Local static server validation succeeded.

## UI Impact

Expected visual impact: none.

All token replacements preserve the exact original border radius values. No layout, color, font, shadow, component, JavaScript, API, or database changes were introduced.

## Stop

Issue #4 completed. Stop before the next issue.
