# BA_Furniture Shared Component Audit

Branch: `correction/site-wide-ui-unification`
Baseline: `3bc3de2b9ee9a83779affab2873b31c75aadcad0`

## Source of truth

Homepage `/` remains the reference implementation. Its existing `product-first.css`, logo asset, header proportions, navigation, search, buttons, sticky CTA, Quote Wizard, footer, typography and palette were not redesigned.

Locked palette:

- Canvas `#F7F5F1`
- Surface `#FFFFFF`
- Surface secondary `#EEEAE3`
- Primary text `#1F2421`
- Secondary text `#666A65`
- Accent `#A77A3D`
- Border `#DDD8CF`

## Shared component mapping

| Contract | Shared source | Homepage | Category | Product detail | Result |
|---|---|---:|---:|---:|---|
| SiteAnnouncement | `site-shell.js` contract + homepage reference markup | reference | shared template | shared template | PASS |
| SiteHeader | `site-shell.js` + `.pf-header` | reference | shared template | shared template | PASS |
| BrandLogo | `/images/brand/ba-furniture-logo.jpg` | same | same | same | PASS |
| DesktopNavigation | `.pf-nav.main-nav` | same | same | same | PASS |
| MobileNavigation | `.pf-menu.nav-toggle` | same | same | same | PASS |
| SiteFooter | `.pf-footer` | reference | shared template | shared template | PASS |
| StickyQuoteCTA | `.pf-sticky` | reference | shared template | shared template | PASS |
| QuoteWizard | `#quote-wizard.v7-wizard` + `lead-engine.js` | same engine | same engine | same engine | PASS |
| ProductCard | `.pf-product-card` rendered by `storefront.js` | reference class | shared renderer | related products | PASS |
| CategoryCard | `.pf-category-card` homepage contract | reference | category hero/route link | breadcrumb route link | PASS |
| Breadcrumb | `.sf-breadcrumb` | not required | shared renderer | shared renderer | PASS |
| EmptyState | `.sf-empty` / `.sf-error` | not required | shared renderer | shared not-found state | PASS |

## Lead context

- Homepage preserves the existing `source=bafurni-homepage-product-first`.
- Category sets `source_page=category` and `category_name`.
- Product detail sets `source_page=product_detail`, `product_code`, `product_name` and `category_name`.
- `lead-engine.js` retains existing UTM attribution.
- CTA opening uses event delegation so product content rendered after ProductDB load opens the same wizard.
- QA stopped at wizard step 3. No submit action and no real lead.

## Duplication removed

- `category.html` no longer contains a second header, logo, ticker, footer or demo catalog.
- `product-detail.html` no longer loads the legacy commerce header, repeated announcement ticker or separate product footer.
- Retired unreferenced legacy category engine assets: `category-page-engine.js` and `category-page-engine.css`.
- `script.js` now contains only homepage navigation and section-state behavior; legacy demo category rendering was removed.

## Responsive result

Homepage, category and product detail were measured at 1440×900, 1280×800, 768×1024 and 390×844:

- horizontal overflow: `0`
- broken visible image: `0`
- one announcement/header/footer/wizard per page
- shared logo asset: PASS
- mobile category/product gallery: PASS
- Quote Wizard steps 1 → 2 → 3: PASS
