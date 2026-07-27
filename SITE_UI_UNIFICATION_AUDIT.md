# BA_Furniture Site-wide UI Unification Audit

Status: local regression PASS; Vercel Preview verification pending initial push.
Branch: `correction/site-wide-ui-unification`
Production baseline: `3bc3de2b9ee9a83779affab2873b31c75aadcad0`

## Root cause

Three generations of storefront code were deployed side by side:

1. Homepage used the current Product-first V8 visual system.
2. `category.html` and the category engine retained a static CTO-review/demo shell, separate logo/header/footer, placeholder products and disabled filters.
3. `product-detail.html` retained an older commerce shell and a separate renderer whose presentation and runtime assumptions no longer matched the current homepage.

Because category/product pages did not share the homepage shell or one storefront renderer, UI and lead context drifted independently. The fix establishes one shared shell contract and one ProductDB-readonly storefront renderer while leaving homepage content, ProductDB, Portal and Apps Script untouched.

## Legacy templates found

- Static category template in the previous `category.html`.
- Legacy category rendering module in the retired `category-page-engine.js`.
- Demo category renderer previously embedded in `script.js`.
- Legacy commerce product shell in the previous `product-detail.html`.
- Old product presentation assets (`product-detail-v41.css`, `mobile-v43.css`, `topbar-ticker.css`) remain archival but are no longer loaded by a public route.
- Old product renderer (`product-detail-v41.js`) remains archival but is no longer loaded by a public route.

## Implementation

- Added `site-shell.js` for shared announcement, header, brand logo, navigation, footer, sticky CTA and Quote Wizard markup.
- Added `storefront.js` for category mapping, search, sorting, ProductCard rendering, product resolution by `code`, related products, SEO and not-found UI.
- Added `storefront.css` using the homepage palette and typography contract without gradients.
- Rebuilt `category.html` and `product-detail.html` as thin shared-shell render targets.
- Kept `product-catalog-runtime.js` and the ProductDB bundles read-only.
- Updated `lead-engine.js` only for dynamic shared CTA delegation and contextual lead fields.
- Added canonical category aliases and rewrites in `vercel.json`.
- Added the eight canonical category routes to `sitemap.xml`.
- Removed dormant demo rendering from `script.js` and retired the unreferenced legacy category engine assets.

## Local QA summary

| Check | Result |
|---|---|
| Homepage visual structure | PASS — 8 category cards, 8 featured products, original hero/assets |
| Shared logo/header/footer/wizard | PASS — one instance per page |
| Product detail required fields | PASS — 13 fields, gallery, CTAs, 4 related products |
| Product resolution | PASS — 8/8 required codes |
| Approved local product image | PASS — 8/8 required codes |
| Category data | PASS — 8/8 routes have real ProductDB rows |
| Search | PASS — `TQ05` returns only product `TQ05` |
| Unknown code | PASS — clear noindex not-found UI, no crash |
| Demo production UI | PASS — zero matching demo UI strings |
| Quote Wizard homepage | PASS — steps 1 → 2 → 3, not submitted |
| Quote Wizard product | PASS — steps 1 → 2 → 3 with product context, not submitted |
| Responsive | PASS at 1440×900, 1280×800, 768×1024, 390×844 |
| Horizontal overflow | 0 across homepage/category/product at all four viewports |
| Broken visible image | 0 |
| Console error | 0 |
| ProductDB / Portal / Apps Script changes | 0 |

## Screenshot package

Directory: `qa/site-wide-ui-unification/`

- Homepage header: `home-header-desktop.png`
- Category desktop/mobile: `category-ghe-van-phong-desktop.png`, `category-ghe-van-phong-mobile.png`
- Product desktop/mobile: `product-TQ05-desktop.png`, `product-TQ05-mobile.png`
- Wizard homepage/product: `wizard-home-step1.png`, `wizard-product-step3.png`
- Footer homepage/category/product: `footer-home.png`, `footer-category.png`, `footer-product.png`
- Eight category route screenshots: `route-category-*.png`
- Eight product detail screenshots: `route-product-*.png`

## Guardrails verified

- No homepage redesign.
- No logo or palette replacement.
- No ProductDB source changes.
- No Portal changes.
- No Apps Script endpoint changes.
- No lead submitted.
- No merge to `main`.
- No production deployment.
