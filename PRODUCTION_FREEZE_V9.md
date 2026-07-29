# BAFurniture V9 — Production Freeze

## Release identity

- Production domain: `https://bafurni.com`
- Production merge commit: `8ab720501d1c75c175727f08888a53d411946137`
- Parent preview commit: `0ac47d3a73e93ca3cfce18a23bb439bdae9c2b25`
- Previous production / rollback commit: `3bc3de2b9ee9a83779affab2873b31c75aadcad0`
- Deployment time: `2026-07-29 16:29:59 ICT (GMT+7)`
- Vercel deployment: `https://bafurni-website-fujnschuv-phuvuongdistributor-boops-projects.vercel.app`
- Vercel status: `Ready — Production — Current`
- Vercel build duration: `11s`
- Visual approval: `8.8/10`

The deployed HTML, CSS, JavaScript, lead configuration and storefront files were byte-compared after line-ending normalization and match the approved production tree.

## Typography and font architecture

- Heading: self-hosted Playfair Display WOFF2, Latin and Vietnamese subsets.
- Body: self-hosted Inter WOFF2, Latin and Vietnamese subsets.
- Only the two Playfair subsets are preloaded; Inter is loaded on demand.
- All four font files return HTTP `200` with MIME `font/woff2`.
- Requests to `fonts.googleapis.com` and `fonts.gstatic.com`: `0`.
- Cold-load font readiness: Playfair `PASS`, Inter `PASS`.
- No visually significant FOUT or FOIT was observed.

## Routes tested

Homepage:

- `/` — HTTP `200`

Category routes — all HTTP `200`, real ProductDB-backed data, broken image `0`:

| Route | Matching products | Rendered |
|---|---:|---:|
| `/danh-muc/ghe-van-phong` | 176 | 32 |
| `/danh-muc/ban-van-phong` | 268 | 32 |
| `/danh-muc/ban-hop` | 51 | 32 |
| `/danh-muc/tu-ho-so` | 109 | 32 |
| `/danh-muc/tu-locker` | 34 | 32 |
| `/danh-muc/sofa-ghe-cho` | 95 | 32 |
| `/danh-muc/noi-that-truong-hoc` | 124 | 32 |
| `/danh-muc/ke-gia-kho` | 3 | 3 |

Product routes — all HTTP `200`, resolved code and lead context match:

- `/san-pham/TQ05`
- `/san-pham/TQ01`
- `/san-pham/DT1890V2`
- `/san-pham/DT2010V2`
- `/san-pham/TU09K7CK`
- `/san-pham/TU983-3KS`
- `/san-pham/GMG101A-2`
- `/san-pham/BMG101A-2`

All eight product pages preserve the hierarchy `name → short description → price → CTA → specifications` and load the matching approved product image.

## Functional QA

- Search `TQ05`: exactly `1` result, code and product link match.
- Homepage Quote Wizard: step `1 → 2 → 3` PASS.
- Product Quote Wizard: step `1 → 2 → 3` PASS.
- Product wizard context: `TQ05`, `Ghế giám đốc TQ05`, source page `product_detail`.
- Form submit was not clicked.
- Fake/test leads created: `0`.
- Apps Script delivery requests during QA: `0`.
- `lead-config.js`: HTTP `200`.
- Apps Script endpoint is unchanged.
- Console/runtime errors belonging to `bafurni.com`: `0`.
- Broken images: `0`.
- `CHAIR-DEMO`: `0`.
- `NEED_ZALO_LINK`: `0`.
- Rendered demo-content nodes: `0`.

## Responsive and visual QA

Tested at:

- `1440×900`
- `1280×800`
- `768×1024`
- `390×844`
- `360×800`

Results:

- Horizontal overflow: `0` at all five viewports.
- Homepage H1: 2 lines at 1440, balanced 3 lines at 1280, 2 lines at 768 and balanced 3 lines at 390/360.
- TQ05 featured-card title is stable at 2 lines on 390/360.
- Vietnamese diacritics render correctly.
- The approved BA_Furniture logo asset is consistent on homepage, category and product pages.
- Category and product surfaces use the same color, header, footer and typography system as the homepage.
- Mobile composition is purpose-built rather than a scaled-down desktop layout.
- Product detail spacing and hierarchy remain intact after the production build.

Production screenshots:

- `qa/v9/production/homepage-desktop-1440.png`
- `qa/v9/production/homepage-desktop-1280.png`
- `qa/v9/production/homepage-mobile-390.png`
- `qa/v9/production/category-desktop-1440.png`
- `qa/v9/production/category-mobile-390.png`
- `qa/v9/production/product-desktop-1440.png`
- `qa/v9/production/product-mobile-390.png`

## Performance verification

- Cold-load desktop LCP at `1440×900`: `816 ms`.
- Cold-load mobile LCP at `390×844`: `976 ms`.
- Warm desktop LCP at `1440×900`: `516 ms`.
- Cold mobile CLS: `0`.
- Warm desktop CLS: `0`.
- Cold desktop raw layout-shift observer: `0.000979`; Web Vitals display rounds to `0.00` and no visual jump was perceptible.
- Desktop hero: `assets/marketing/remastered/hero-desktop.avif`.
- Mobile hero: `assets/marketing/remastered/hero-mobile.avif`.
- Hero preload remains media-scoped to one applicable asset.
- Font preload is not duplicated and does not preload all weights.
- Lazy-loaded images below the fold: `27`.
- No serious LCP regression was observed.

## Freeze

Known limitation:

- Homepage editorial structure is locked.

No ProductDB, Portal, Apps Script, lead endpoint, product/category mapping, UI content or runtime logic was changed after the approved V9 preview.
