# BAFurniture V5.1 - Visual Release Report

Date: 2026-07-16

## Release status

Production: **PASS**

- Repository: `phuvuongdistributor-boop/-bafurni-website`
- Branch: `main`
- Production asset commit: `7972b58b13d5ca8c7ed2aedbc8cb1f51072205bd`
- Deployment: Vercel production
- Public URL: `https://bafurni.com`
- Default Vercel URL: `https://bafurni-website.vercel.app`

The production HTML now references the V5.1 Hero, category and solution assets. The release is visibly different in the first viewport while preserving ProductDB, Portal and existing routes.

## Approval gate

Only assets marked `APPROVED` in `V5_1_IMAGE_APPROVAL_MANIFEST.json` were included.

| Group | Approved families |
| --- | ---: |
| Hero | 1 |
| Main category | 9 |
| Subcategory | 38 |
| Solution | 4 |
| **Total** | **52** |

- Responsive WebP files released: 165.
- Rejected historical candidates: 4.
- Rejected candidates deployed: 0.
- Rejection rules: watermark/logo, blur, AI text, wrong category, implausible product geometry, duplicate scene and visibly awkward compositing.

## Files released

Asset commit `7972b58b13d5ca8c7ed2aedbc8cb1f51072205bd` contains 171 changed paths:

- 165 approved WebP variants under `images/hero`, `images/categories/main`, `images/categories/sub` and `images/solutions`.
- `index.html`
- `category.html`
- `script.js`
- `style.css`
- `V5_1_IMAGE_APPROVAL_MANIFEST.json`
- `V5_1_VISUAL_QUALITY_RECOVERY_REPORT.md`

Diff against the previous production commit: 102 added, 69 changed and 0 removed files. This report is added in a separate report-only commit after public QA.

## Asset QA

| Check | Result |
| --- | --- |
| Full visual review | PASS - 52/52 families |
| Random contact-sheet review | PASS - 50/52 families |
| Approved responsive variants | PASS - 165/165 present |
| WebP decode | PASS - 0 failures |
| Expected dimensions | PASS - 0 failures |
| Blur / low sharpness | PASS - 0 flags |
| Low contrast | PASS - 0 flags |
| Exact duplicate | PASS - 0 |
| Near duplicate dHash | PASS - 0 |
| Watermark / logo / AI text | PASS - 0 in approved set |
| Wrong category / product | PASS - 0 in approved set |
| Awkward composite | PASS - 0 in approved set |

WebP export quality is 84-85 with responsive desktop/mobile sources. Example production transfer sizes: Hero 720px is 27,670 bytes and Hero 1600px is 87,812 bytes.

## Scope verification

- ProductDB scripts checked by hash: 14; mismatches: 0.
- ProductDB content and structure: unchanged.
- Portal: unchanged and public HTTP 200.
- Product routes: unchanged.
- DNS: unchanged.
- Missing internal UI image references: 0.

Catalog-relative image paths inside the untouched ProductDB files remain resolved by the existing runtime/CDN. Public TQ05 QA loaded all five images successfully.

## Public QA

| URL | HTTP | Result |
| --- | ---: | --- |
| `https://bafurni.com/` | 200 | PASS |
| `https://bafurni.com/category.html?cat=ghe-van-phong` | 200 | PASS |
| `https://bafurni.com/danh-muc/ghe-van-phong` | 200 | PASS |
| `https://bafurni.com/product-detail.html?code=TQ05` | 200 | PASS |
| `https://bafurni.com/san-pham/tq05-ghe-giam-doc-tq05` | 200 | PASS |
| `https://bafurni.com/robots.txt` | 200 | PASS |
| `https://bafurni.com/sitemap.xml` | 200 | PASS - `application/xml` |
| `https://bafurni-website.vercel.app/` | 200 | PASS |
| `https://portal.bafurni.com/` | 200 | PASS |

Browser QA at desktop 1366px, mobile 390px and emulated Retina 2x:

- Console exceptions/errors/warnings: 0.
- Failed requests: 0.
- HTTP responses >= 400: 0.
- Broken images: 0.
- Pending images after lazy-load sweep: 0.
- Horizontal overflow: 0.
- Homepage images: 28/28 loaded.
- Category images: 21/21 loaded.
- Product images: 5/5 loaded.
- Retina 2x selected `homepage-1600.webp`; mobile category cards selected 720px sources.

## Screenshot evidence

Public screenshots are stored in the local release evidence folder:

- `release-v5/screenshots/v51-public/homepage-desktop-1366-full.png`
- `release-v5/screenshots/v51-public/homepage-desktop-1366.png`
- `release-v5/screenshots/v51-public/homepage-mobile-390.png`
- `release-v5/screenshots/v51-public/category-desktop-1366.png`
- `release-v5/screenshots/v51-public/category-mobile-390.png`
- `release-v5/screenshots/v51-public/product-desktop-1366.png`
- `release-v5/screenshots/v51-public/product-mobile-390.png`

## Known limitation

The existing mobile header search submit label remains tightly clipped at 390px. It predates V5.1 and was not changed because this release is strictly limited to approved commercial imagery and its responsive integration.

