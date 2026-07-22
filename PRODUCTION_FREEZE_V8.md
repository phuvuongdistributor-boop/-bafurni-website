# BAFurniture V8 — Production Freeze

Freeze date: 2026-07-22  
Candidate branch: `correction/product-v7-v8-preview`  
Visual candidate commit: `c6ada492ddf03c7df3ceeb466a1308067ac2db32`

## Scope

This freeze covers the product-first homepage correction and the V7/V8 homepage integration only. ProductDB, Portal, Lead Engine, Apps Script, product inventory, and category data are unchanged.

Homepage order is frozen as:

1. Header and premium hero
2. Eight product categories
3. Featured products
4. V7 solution teaser
5. Product-by-space block
6. V8 project teaser
7. Capability and trust strip
8. Quote CTA and footer

## Screenshot package

The approved render package is stored in `qa/screenshots/production-freeze-v8/`.

| Artifact | Coverage |
| --- | --- |
| `desktop-full.png` | Full homepage at 1440 × 900 viewport |
| `hero.png` | Premium hero |
| `category.png` | Eight category cards |
| `featured-products.png` | Featured product grid |
| `v7-teaser.png` | V7 solution teaser |
| `v8-teaser.png` | V8 project teaser |
| `mobile-first-screen.png` | First mobile screen at 390 × 844 viewport |
| `mobile-category.png` | Mobile category block |
| `mobile-product.png` | Mobile featured products block |

## Frozen homepage metrics

Desktop measurements use a 1440 × 900 viewport.

| Metric | Frozen value |
| --- | ---: |
| Total page height | 5,690 px |
| Hero height | 540 px |
| Main section count | 8 |
| Homepage word count | 564 |
| Category cards in first two screens | 8 / 8 |
| Product cards in first two screens | 4 |
| Product content above the two-screen fold | Yes |
| Images loaded | 29 / 29 |
| Broken images | 0 |
| Horizontal overflow | No |
| Console errors | 0 |

Mobile verification uses a 390 × 844 viewport. The first screen contains the header, full product-first hero with real furniture photography, and the beginning of the category section. There is no horizontal overflow and no console error.

## Regression gate

- [x] Official BA_Furniture logo remains in header and footer.
- [x] Eight category cards remain visible and linked.
- [x] Featured product cards, prices, dimensions, and detail links remain intact.
- [x] V7 and V8 teaser blocks remain in the homepage flow.
- [x] Desktop and mobile layouts do not overflow horizontally.
- [x] Quote Wizard advances through all steps without submitting a test lead.
- [x] Eight category routes return HTTP 200 in preview.
- [x] `lead-config.js` returns HTTP 200 and retains the production Apps Script endpoint.
- [x] ProductDB, Portal, Lead Engine, and Apps Script were not modified.

## Merge and production gate

The correction branch may be merged into `main` only while all checks above remain green. After Vercel reports the `main` deployment as Ready, production must be rechecked on `https://bafurni.com/` for commit identity, homepage metrics, Quote Wizard navigation, all category routes, `lead-config.js`, image loading, horizontal overflow, and console errors.

