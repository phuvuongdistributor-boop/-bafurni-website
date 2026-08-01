# BA_Furniture marketing image — before/after

Branch: `correction/visual-assets-announcement-review`  
Frozen base: `e1e9274e564fdb27324e360307bdf9b3b7106b62`  
Scope: hero desktop/mobile, 3 solution images, 4 brand images, 3 project images, and the 8 primary category images.

## Finding

The previous files had large pixel dimensions but did not contain equivalent native detail. The old remaster script built many delivery files from smaller derivatives, then combined an 18% Real-ESRGAN result with an 82% Lanczos resize and light sharpening:

- hero desktop: 1600 source → 1920 (`1.20x`);
- hero mobile: 720 source → 1200 (`1.667x`);
- solutions: 720 source → 1920 (`2.667x`);
- brand images: 960 source → 1920 (`2.00x`);
- projects: 1200 source → 1920 (`1.60x`).

This explains why metadata reported 1920 px while 100% and 200% inspection still showed soft edges, weak material texture and invented/interpolated micro-detail. The issue was not CSS blur, transform scaling or the browser selecting a thumbnail.

## Correction

No mass upscale and no new generative image were used. The repository already contained better native sources:

- marketing desktop sources: 1600 px long edge;
- brand sources: 1600×1143;
- project and category sources: 1600×1200;
- mobile hero: verified center crop from the native 1600×1000 hero, then downsampled to 1200×900.

The mobile crop matches the previous composition: the former 720×540 file correlates at `0.99772` with the corresponding crop of the 1600 source (mean absolute error `2.27`). The new crop is therefore a higher-detail reconstruction from the same approved scene, not a newly invented scene.

WebP delivery files are copied byte-for-byte from the native repository sources where aspect ratio is unchanged. AVIF files are encoded once from those sources. No sharpen, denoise, blur or AI-detail pass is applied.

## Quantified result

Laplacian values are supporting edge-detail evidence only; final decisions were made by visual inspection of the 100% and 200% packages.

| Asset | Before | Previous source / scale | Before sharpness | After | After sharpness | Decision |
|---|---:|---:|---:|---:|---:|---|
| Hero desktop | 1920×1200 | 1600 / 1.20x | 241.345 | 1600×1000 | 432.641 | `PASS_TRUE_DETAIL` |
| Hero mobile | 1200×900 | 720 / 1.667x | 170.199 | 1200×900 verified crop | 465.010 | `PASS_TRUE_DETAIL` |
| Solution — office | 1920×1200 | 720 / 2.667x | 86.105 | 1600×1000 | 895.659 | `PASS_TRUE_DETAIL` |
| Solution — school | 1920×1200 | 720 / 2.667x | 63.171 | 1600×1000 | 465.603 | `PASS_TRUE_DETAIL` |
| Solution — factory | 1920×1200 | 720 / 2.667x | 40.912 | 1600×1000 | 784.595 | `PASS_TRUE_DETAIL` |
| Brand — leadership | 1920×1372 | 960 / 2.00x | 80.523 | 1600×1143 | 456.594 | `PASS_TRUE_DETAIL` |
| Brand — team | 1920×1372 | 960 / 2.00x | 73.265 | 1600×1143 | 447.066 | `PASS_TRUE_DETAIL` |
| Brand — meeting | 1920×1372 | 960 / 2.00x | 235.136 | 1600×1143 | 1600.154 | `PASS_TRUE_DETAIL` |
| Brand — locker | 1920×1372 | 960 / 2.00x | 161.125 | 1600×1143 | 937.135 | `PASS_TRUE_DETAIL` |
| Project — workplace | 1920×1440 | 1200 / 1.60x | 349.023 | 1600×1200 | 1108.354 | `PASS_TRUE_DETAIL` |
| Project — education | 1920×1440 | 1200 / 1.60x | 130.840 | 1600×1200 | 360.152 | `PASS_TRUE_DETAIL` |
| Project — lounge | 1920×1440 | 1200 / 1.60x | 58.927 | 1600×1200 | 161.639 | `PASS_TRUE_DETAIL` |

The 8 approved category assets were already native 1600×1200. All eight pass edge, material, geometry, watermark/logo and 100%/200% visual checks, so they remain byte-for-byte unchanged.

## Browser verification

Chrome with device scale factor 2 selected AVIF for every marketing image:

- desktop hero: 1600×1000, rendered 769×540;
- mobile hero: 1200×900, rendered 390×260;
- solutions: 1600×1000, rendered 423×238 desktop and 353×198 mobile;
- brand: 1600×1143, rendered 314×640 desktop and 168×640 mobile using the frozen V9 crop;
- projects: 1600×1200, rendered 476/396×357 desktop and 353×358 mobile.

All eight category images loaded the approved 1600×1200 WebP files, rendered 318×178 desktop and 170×105 mobile. Broken image count is zero. CSS reports `filter: none` and `transform: none` for the audited marketing images.

The 12 AVIF files total 2,771,647 bytes versus 2,330,073 bytes before (`+19.0%`). This is an intentional true-detail trade-off; only the hero is eager/preloaded and all images below the fold remain lazy-loaded.

## Visual evidence

- [Before — 100% contact sheet](qa/visual-assets-true-quality/before/assets-100.png)
- [Before — 200% detail contact sheet](qa/visual-assets-true-quality/before/assets-200.png)
- [After — 100% contact sheet](qa/visual-assets-true-quality/after/assets-100.png)
- [After — 200% detail contact sheet](qa/visual-assets-true-quality/after/assets-200.png)
- [After — desktop hero](qa/visual-assets-true-quality/after/hero-desktop.png)
- [After — solutions](qa/visual-assets-true-quality/after/solutions.png)
- [After — brand cards](qa/visual-assets-true-quality/after/brand.png)
- [After — projects](qa/visual-assets-true-quality/after/projects.png)
- [After — mobile first screen](qa/visual-assets-true-quality/after/mobile-first-screen.png)
- [Vercel preview — desktop first screen](qa/visual-assets-true-quality/after/preview-desktop.png)
- [Vercel preview — mobile first screen](qa/visual-assets-true-quality/after/preview-mobile.png)

Full per-asset decisions are recorded in `VISUAL_ASSET_TRUE_QUALITY_AUDIT.csv`.
