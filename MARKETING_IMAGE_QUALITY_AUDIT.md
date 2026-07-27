# BAFurniture — Production Marketing Image Quality Audit

Audit date: 2026-07-27  
Scope: homepage marketing imagery only. ProductDB, Portal, Lead Engine, Apps Script, product cards, the eight main category cards, typography and homepage layout are unchanged.

## Outcome

- Production baseline: 12 marketing image variants; 11 below the requested desktop target and one live browser cache case served an obsolete 260×186 derivative.
- Preview: 12/12 marketing image variants use remastered AVIF with WebP fallback.
- Desktop marketing assets: minimum long edge 1920 px.
- Mobile hero: 1200×900 px.
- Visual classification in preview: `BLURRY = 0`, `SOFT = 0`, `UPSCALED = 0`, `OVER_COMPRESSED = 0`.
- Browser-selected format: AVIF; WebP remains the fallback.
- Desktop page height: `5690 → 5690`.
- Mobile page height: `9116 → 9116`.
- CLS: `0` desktop and mobile.
- Console errors: `0`.
- Horizontal overflow: `0` at 1440×900 and 390×844.

## Production root cause

1. The homepage is static HTML/CSS, not Next.js. There is no `next/image`, `q=` URL parameter, Next image optimizer, width-descriptor `srcset`, or `sizes` calculation.
2. Production used fixed small derivatives:
   - hero desktop: 1600×1000;
   - hero mobile and Solution: 720 px;
   - Brand Promise: 960×686;
   - Project: 1200×900.
3. `ghe-giam-doc.webp` returned 960×686 over a fresh HTTP request, while the live browser cache still decoded a legacy 260×186 object under the same URL. The reused filename caused stale asset selection in an existing browser cache.
4. Project images were eager-loaded even though they are below the fold.
5. Computed CSS on all audited images was `filter: none`, `backdrop-filter: none`, `transform: none`, and `opacity: 1`. CSS softness was not the cause.

## Remaster method

- Official Real-ESRGAN `RealESRGAN_x4plus` weights.
- Conservative neural contribution: 18%.
- Full-source Lanczos contribution: 82%.
- Light unsharp mask only; no blur, crop-to-hide, object replacement, or generative detail synthesis.
- Outputs:
  - Hero: quality 90.
  - Solution and Project: quality 88.
  - Brand Promise marketing cards: quality 85.
- Formats: AVIF primary and WebP fallback.
- Location: `assets/marketing/remastered/`.

The Laplacian score is resolution-dependent. The table below reports the raw score at each file's delivered dimensions; a lower value on a larger remaster does not by itself indicate a softer visible result. Final status combines the numeric audit with 100% visual inspection at rendered size.

## Sharpness and compression

| Section / variant | Production px | Bytes | B/px | Raw compression | Laplacian | Preview px | AVIF bytes | B/px | Raw compression | Laplacian | Final |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Hero desktop | 1600×1000 | 87,812 | 0.055 | 54.66:1 | 438.32 | 1920×1200 | 166,580 | 0.072 | 41.49:1 | 243.37 | PASS |
| Hero mobile | 720×540 | 27,670 | 0.071 | 42.15:1 | 885.47 | 1200×900 | 70,097 | 0.065 | 46.22:1 | 173.58 | PASS |
| Solution — doanh nghiệp | 720×450 | 48,524 | 0.150 | 20.03:1 | 2025.71 | 1920×1200 | 195,717 | 0.085 | 35.32:1 | 91.11 | PASS |
| Solution — trường học | 720×450 | 42,654 | 0.132 | 22.79:1 | 1535.98 | 1920×1200 | 177,632 | 0.077 | 38.91:1 | 72.59 | PASS |
| Solution — nhà máy | 720×450 | 33,888 | 0.105 | 28.68:1 | 1254.77 | 1920×1200 | 141,702 | 0.062 | 48.78:1 | 43.54 | PASS |
| Brand Promise — lãnh đạo | 960×686 | 58,412 | 0.089 | 33.82:1 | 943.06 | 1920×1372 | 156,448 | 0.059 | 50.51:1 | 84.38 | PASS |
| Brand Promise — đội nhóm | 960×686 | 65,990 | 0.100 | 29.94:1 | 877.44 | 1920×1372 | 172,837 | 0.066 | 45.72:1 | 81.19 | PASS |
| Brand Promise — phòng họp | 960×686 | 141,344 | 0.215 | 13.98:1 | 2914.78 | 1920×1372 | 343,266 | 0.130 | 23.02:1 | 262.90 | PASS |
| Brand Promise — nhà máy | 960×686 | 58,128 | 0.088 | 33.99:1 | 1838.97 | 1920×1372 | 156,150 | 0.059 | 50.61:1 | 165.29 | PASS |
| Project — workplace | 1200×900 | 113,708 | 0.105 | 28.49:1 | 1820.57 | 1920×1440 | 265,789 | 0.096 | 31.21:1 | 356.93 | PASS |
| Project — education | 1200×900 | 96,830 | 0.090 | 33.46:1 | 713.67 | 1920×1440 | 233,070 | 0.084 | 35.59:1 | 133.47 | PASS |
| Project — lounge | 1200×900 | 99,000 | 0.092 | 32.73:1 | 328.57 | 1920×1440 | 250,785 | 0.091 | 33.07:1 | 57.77 | PASS |

Manufacturing, Coverage, CTA and CSS backgrounds have no image URL in the current homepage DOM. They are recorded as `NO_IMAGE` in the CSV rather than inventing assets.

## Browser delivery audit

| Check | Production | Preview |
|---|---|---|
| Framework image optimizer | None | None |
| Hero desktop source | fixed WebP 1600 | AVIF 1920 / WebP fallback |
| Hero mobile source | media source WebP 720 | media source AVIF 1200 / WebP fallback |
| Solution source | fixed WebP 720 | AVIF 1920 / WebP fallback |
| Project source | fixed WebP 1200, eager | AVIF 1920 / WebP fallback, lazy |
| `srcset` / `sizes` | hero breakpoint only; no width descriptors or `sizes` | explicit picture format and hero breakpoint; no undersized candidate |
| `q=` | not present | not present; quality set at build time |
| CSS scale / blur | none | none |

## Performance and regression

Performance was measured in the same in-app Chromium browser and viewport. Production and local preview are different origins, so the timing comparison is directional rather than a laboratory network benchmark.

| Metric | Production | Preview |
|---|---:|---:|
| Desktop hero LCP | 1276 ms | 692 ms |
| Mobile hero LCP | 608 ms | 364 ms |
| Desktop CLS | 0 | 0 |
| Mobile CLS | 0 | 0 |
| Desktop page height | 5690 px | 5690 px |
| Mobile page height | 9116 px | 9116 px |
| Desktop overflow | no | no |
| Mobile overflow | no | no |
| Console errors | 0 | 0 |
| Quote Wizard | PASS | PASS step 1 → 2 |

## Visual comparison package

| View | Production | Preview |
|---|---|---|
| Hero desktop | `qa/screenshots/marketing-image-quality/before/hero-desktop.jpg` | `qa/screenshots/marketing-image-quality/after/hero-desktop.png` |
| Solution | `qa/screenshots/marketing-image-quality/before/solution.jpg` | `qa/screenshots/marketing-image-quality/after/solution.png` |
| Project | `qa/screenshots/marketing-image-quality/before/project.jpg` | `qa/screenshots/marketing-image-quality/after/project.png` |
| Mobile hero | `qa/screenshots/marketing-image-quality/before/mobile-hero.jpg` | `qa/screenshots/marketing-image-quality/after/mobile-hero.png` |
| Desktop full preview | — | `qa/screenshots/marketing-image-quality/after/desktop-full.png` |

## Scope protection

- Product image URLs are unchanged.
- The eight main category cards and their URLs are unchanged.
- Typography, section order and layout measurements are unchanged.
- ProductDB, Portal, Lead Engine and Apps Script are unchanged.
- This work stops on the preview branch and is not merged into `main`.

## Reproducibility

- Remaster pipeline: `qa/marketing-image-quality/remaster_marketing_esrgan.py`.
- Machine-readable metrics: `qa/marketing-image-quality/remaster-metrics.json`.
- Production inventory: `HOMEPAGE_MARKETING_IMAGES.csv`.
- Preview inventory: `HOMEPAGE_MARKETING_IMAGES_PREVIEW.csv`.
- Audit workbook: `HOMEPAGE_MARKETING_IMAGE_AUDIT.xlsx`.
- Real-ESRGAN: https://github.com/xinntao/Real-ESRGAN
- BasicSR RRDBNet architecture: https://github.com/XPixelGroup/BasicSR
