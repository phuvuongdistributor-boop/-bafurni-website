# BA_Furniture Logo Asset Audit

Audit date: 2026-07-20

## Asset inventory

| File | Type | Size | Status |
|---|---|---:|---|
| `images/brand/ba-furniture-logo.jpg` | JPEG, 1254 × 1254 | 166,568 bytes | Official storefront logo from Git history |
| `assets/favicon.svg` | SVG, 64 × 64 | 294 bytes | Favicon only; not a full brand logo |

No alternative SVG, PNG, WebP, AI, or EPS full logo exists in the current website source.

## Provenance

- The selected logo was introduced in Git commit `b442cc7` with message `Update BA_Furniture storefront logo`.
- The same binary is present in the current source and production repository.
- The logo contains the gold BA monogram, `BA_Furniture`, and the descriptor `PREMIUM INTERIOR SOLUTIONS`.

## Current consistency issue

The codebase mixes:

- `BAFurniture`
- `BA_Furniture`
- `BA Furniture`

The approved visible brand name for the reset is `BA_Furniture`.

## Usage decision

- Header: use `images/brand/ba-furniture-logo.jpg`, cropped with the historical storefront placement, displayed at approximately 40–44 px visual height.
- Footer: use the same asset uncropped on a light logo plate so the full mark remains legible.
- Favicon: retain `assets/favicon.svg`.
- Do not recreate the monogram in HTML or CSS.
- Do not use text as a substitute where the logo image can be shown.

## Contrast rule

- Header background should be warm white so the logo does not require a dark surrounding plate.
- Footer may remain charcoal, with the logo image displayed on its own white field.
