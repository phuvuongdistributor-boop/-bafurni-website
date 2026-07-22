# Production Image Visual QA

Audit basis: production commit `737db9417d1f086ecbc51232e98db503a14716ac`, live HTTP assets, and visual inspection at original resolution.

## Category images

All eight approved category originals are `PASS`: correct category, sharp, no watermark, and no supplier logo. The live browser selected their `800×600` responsive variants; the corrected mapping uses native `1600×1200` originals without upscaling.

## Featured product images

| Code | Previous visual status | Final visual status | Native dimensions |
|---|---|---|---:|
| TQ05 | WRONG_PRODUCT | PASS | 600×600 |
| TQ01 | WRONG_PRODUCT | PASS | 600×600 |
| DT1890V2 | WRONG_PRODUCT | PASS | 700×700 |
| DT2010V2 | WRONG_PRODUCT | PASS | 600×600 |
| TU09K7CK | WRONG_PRODUCT | PASS | 600×600 |
| TU983-3KS | WRONG_PRODUCT | PASS | 700×700 |
| GMG101A-2 | WRONG_PRODUCT | PASS | 470×470 |
| BMG101A-2 | WRONG_PRODUCT | PASS | 470×470 |

All final images are exact product matches, use clean or neutral backgrounds, and contain no visible watermark or supplier logo. No asset was upscaled. `object-fit: contain` preserves product edges.

## Hero, V7, and V8

- Hero `images/hero/homepage-1600.webp`: PASS.
- V7 `images/solutions/doanh-nghiep-720.webp`: PASS.
- V7 `images/solutions/truong-hoc-720.webp`: PASS.
- V7 `images/solutions/nha-may-720.webp`: PASS.
- V8 `images/categories/main/ghe-van-phong-1200.webp`: PASS.
- V8 `images/categories/main/noi-that-truong-hoc-1200.webp`: PASS.
- V8 `images/categories/main/sofa-ghe-cho-1200.webp`: PASS.

## Rejected images

- Eight `images/categories/sub/*` files: rejected for product cards as `WRONG_PRODUCT`; these are category illustrations.
- `DT2010V2_DB.jpg`: rejected as `WRONG_PRODUCT`; existing ProductDB URL duplicates DT1890V2.
- Eight `render_assets/products/*/gallery/*_gallery_01_hero.jpg` files: rejected as test placeholders containing BA_Furniture test branding and “replace before publishing” copy.
- Composite GMG/BMG dataset images: rejected for the final cards where an exact isolated or approved exact product asset was available.
