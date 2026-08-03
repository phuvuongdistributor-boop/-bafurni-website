# BAFurniture V10.01 — Executive Chair The One QA

## Scope lock

- Branch: `feature/v10-01-executive-chair-theone`
- Base main: `ecc0c8bd1797e9c4c2eb575cc44bf33225d9dd70`
- Landing: `/danh-muc/ghe-giam-doc`
- Source: The One
- ProductDB gốc: không sửa
- Portal: không sửa
- Shared UI: không sửa
- Main/production: không merge, không deploy

## Product enrichment

| Code | Exact image | Source | Result |
| --- | --- | --- | --- |
| TQ01 | `/assets/products/approved/TQ01.webp` | The One | PASS |
| TQ05 | `/assets/products/approved/TQ05.webp` | The One | PASS |
| TQ26 | `/assets/v10-01/executive-chair-theone/products/TQ26.jpg` | The One | PASS |
| TQ27 | `/assets/v10-01/executive-chair-theone/products/TQ27.jpg` | The One | PASS |
| TQ30 | `/assets/v10-01/executive-chair-theone/products/TQ30.jpg` | The One | PASS |
| TQ34 | `/assets/v10-01/executive-chair-theone/products/TQ34.jpg` | The One | PASS |
| TQ38 | `/assets/v10-01/executive-chair-theone/products/TQ38.jpg` | The One | PASS |
| TQ39 | `/assets/v10-01/executive-chair-theone/products/TQ39.jpg` | The One | PASS |

Eight cards use exact product assets. Category images are not used as product fallbacks. Visual review found no watermark or supplier logo.

## Marketing images

| Asset | Dimension | Broken | Upscaled | Watermark/logo | Result |
| --- | ---: | ---: | ---: | ---: | --- |
| Hero | 1920×1080 | 0 | 0 | 0 | PASS |
| Collage | 1600×1200 | 0 | 0 | 0 | PASS |
| Thumbnail | 1200×1200 | 0 | 0 | 0 | PASS |

All three creatives use real local product images, solid colors, no decorative icons and no gradients.

## Local browser QA

| Viewport | Product cards | Grid | Horizontal overflow | Broken images | Result |
| --- | ---: | --- | ---: | ---: | --- |
| 1440×900 | 8 | 4 columns | 0 | 0 | PASS |
| 1280×800 | 8 | 4 columns | 0 | 0 | PASS |
| 768×1024 | 8 | 2 columns | 0 | 0 | PASS |
| 390×844 | 8 | 1 column | 0 | 0 | PASS |
| 360×800 | 8 | 1 column | 0 | 0 | PASS |

- Landing title and CTA contrast: PASS.
- Tablet hero changes to a single-column composition below 820 px: PASS.
- Product images use `object-fit: contain`: PASS.
- Console errors/warnings: 0.
- Quote Wizard: step 1 → step 2 → step 3 PASS; submit was not clicked; test leads sent = 0.
- Enrichment dataset: 8 products, 8 unique codes, source only The One.
- Read-only ProductDB lookup: all 8 codes exist exactly once; no ProductDB file changed.
- Marketing copy: 2 Facebook posts, 1 Google Business post, 1 Zalo OA post.
- Banned claim audit (`rẻ nhất`, `tốt nhất`, `số 1`): 0.

## Preview verification

To be completed after the branch is pushed and Vercel Preview is Ready. Production is explicitly out of scope.
