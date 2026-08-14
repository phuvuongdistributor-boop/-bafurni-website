# BAFURNITURE V10.04 + V10.04R — PRODUCTION FREEZE

Freeze date: 2026-08-13 (Asia/Bangkok)  
Status: **PASS — Ready / Production / Current**

## 1. Release identity

| Field | Value |
|---|---|
| Package | Ghế lưới lưng cao / cao cấp GL3xx — The One |
| Package base | `22b6cdc49dbd1dbfa3a2c5098dd83b59570d4f3b` |
| Approved recovery | `91900af26dd394849cfb5dab4e9136bbb114c302` |
| Minimal regression fix | `d54498bc852c421ef02a7b3b841d93df0f4a999f` |
| Previous production main | `8ac588cc871b5c6d386d6010f125b12412164777` |
| Production merge / content SHA | `db0c88d863df33054e99e10cd675cc367af5c7b1` |
| Vercel deployment ID | `2VhPcubz3tzZ9zzbrJyuxT1o8GF7` |
| Deployment URL | https://bafurni-website-94czmtqh2-phuvuongdistributor-boops-projects.vercel.app |
| Production domain | https://bafurni.com |
| Build time | 13 s |
| Vercel state | Ready — Production — Current |

The release contains the complete V10.04 package and approved V10.04R recovery. The only release-time correction removed a stale public sentence claiming that seven recovered products still lacked clean images. No UI, ProductDB, Portal, Apps Script, Lead Engine, unrelated route, or marketing asset was changed.

## 2. Frozen scope

22 codes: `GL304`, `GL307`, `GL309`, `GL316`, `GL317`, `GL320`, `GL321`, `GL322`, `GL323`, `GL324`, `GL326`, `GL328`, `GL329`, `GL331`, `GL332`, `GL333`, `GL334`, `GL335`, `GL336`, `GL338`, `GL343`, `GL345`.

Landing: https://bafurni.com/danh-muc/ghe-luoi-lung-cao

## 3. Production landing QA

| Check | Result |
|---|---|
| HTTP | 200 — PASS |
| Product count | 22/22 — PASS |
| Code/image mapping | 22/22 — PASS |
| Comparison | 8 rows — PASS |
| Buying Guide | PASS |
| FAQ | 10 — PASS |
| CTA | PASS |
| Quote Wizard context | PASS |
| Placeholder | 0 |

## 4. Production product routes

All routes returned HTTP 200 and resolved the correct H1, Code, image/gallery, title/meta, one canonical, runtime Product schema, three related products and Quote CTA.

1. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl304
2. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl307
3. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl309
4. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl316
5. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl317
6. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl320
7. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl321
8. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl322
9. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl323
10. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl324
11. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl326
12. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl328
13. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl329
14. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl331
15. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl332
16. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl333
17. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl334
18. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl335
19. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl336
20. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl338
21. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl343
22. https://bafurni.com/san-pham/ghe-luoi-lung-cao/gl345

Wrong Code: **0**.

## 5. Production image QA

Browser reference: 1440×900. Product-detail gallery stages rendered approximately 575×575 CSS px with `object-fit: contain`. Asset files retain natural source resolution; no file was synthetically enlarged.

| Code | Production asset | Natural | Rendered | Gallery | Provenance/status | Result |
|---|---|---:|---:|---:|---|---|
| GL304 | `/assets/v10-04/gl3xx-theone/products/GL304/main.webp` | 1000×723 | 575×575 | 2 | V10.04R official, CLEAN_EXACT | PASS |
| GL307 | `/assets/v10-04/gl3xx-theone/products/GL307/main.jpg` | 580×580 | 575×575 | 1 | Official, LOW_RES_EXACT | PASS |
| GL309 | `/assets/v10-04/gl3xx-theone/products/GL309/main.webp` | 2000×1446 | 575×575 | 4 | V10.04R official, CLEAN_EXACT | PASS |
| GL316 | `/assets/v10-04/gl3xx-theone/products/GL316/main.webp` | 2000×1446 | 575×575 | 2 | V10.04R official, CLEAN_EXACT | PASS |
| GL317 | `/assets/v10-04/gl3xx-theone/products/GL317/main.webp` | 2000×1446 | 575×575 | 1 | V10.04R official, CLEAN_EXACT | PASS |
| GL320 | `/assets/v10-04/gl3xx-theone/products/GL320/main.jpg` | 580×580 | 575×575 | 1 | Official, LOW_RES_EXACT | PASS |
| GL321 | `/assets/v10-04/gl3xx-theone/products/GL321/main.jpg` | 580×580 | 575×575 | 1 | Official, LOW_RES_EXACT | PASS |
| GL322 | `/assets/v10-04/gl3xx-theone/products/GL322/main.jpg` | 580×580 | 575×575 | 1 | Official, LOW_RES_EXACT | PASS |
| GL323 | `/assets/v10-04/gl3xx-theone/products/GL323/main.jpg` | 580×580 | 575×575 | 1 | Official, LOW_RES_EXACT | PASS |
| GL324 | `/assets/v10-04/gl3xx-theone/products/GL324/main.webp` | 2000×1446 | 575×575 | 2 | V10.04R official, CLEAN_EXACT | PASS |
| GL326 | `/assets/v10-04/gl3xx-theone/products/GL326/main.jpg` | 580×580 | 575×575 | 1 | Official, LOW_RES_EXACT | PASS |
| GL328 | `/assets/v10-04/gl3xx-theone/products/GL328/main.jpg` | 580×580 | 575×575 | 1 | Official, LOW_RES_EXACT | PASS |
| GL329 | `/assets/v10-04/gl3xx-theone/products/GL329/main.jpg` | 580×580 | 575×575 | 1 | Official, LOW_RES_EXACT | PASS |
| GL331 | `/assets/v10-04/gl3xx-theone/products/GL331/main.jpg` | 580×580 | 575×575 | 1 | Official, LOW_RES_EXACT | PASS |
| GL332 | `/assets/v10-04/gl3xx-theone/products/GL332/main.jpg` | 580×580 | 575×575 | 1 | Official, LOW_RES_EXACT | PASS |
| GL333 | `/assets/v10-04/gl3xx-theone/products/GL333/main.jpg` | 580×580 | 575×575 | 2 | Official, LOW_RES_EXACT | PASS |
| GL334 | `/assets/v10-04/gl3xx-theone/products/GL334/main.jpg` | 580×580 | 575×575 | 1 | Official, LOW_RES_EXACT | PASS |
| GL335 | `/assets/v10-04/gl3xx-theone/products/GL335/main.webp` | 2000×1446 | 575×575 | 3 | V10.04R official, CLEAN_EXACT | PASS |
| GL336 | `/assets/v10-04/gl3xx-theone/products/GL336/main.jpg` | 580×580 | 575×575 | 1 | Official, LOW_RES_EXACT | PASS |
| GL338 | `/assets/v10-04/gl3xx-theone/products/GL338/main.jpg` | 580×580 | 575×575 | 1 | Official, LOW_RES_EXACT | PASS |
| GL343 | `/assets/v10-04/gl3xx-theone/products/GL343/main.jpg` | 580×580 | 575×575 | 1 | Official, LOW_RES_EXACT | PASS |
| GL345 | `/assets/v10-04/gl3xx-theone/products/GL345/main.webp` | 2000×1446 | 575×575 | 2 | V10.04R official, CLEAN_EXACT | PASS |

- Clean, exact, usable product image: **22/22**
- V10.04R recovered official main image: **7/7**
- Official source-limited exact main image: **15/15**
- Verified gallery assets: **32/32 HTTP 200 and decodable**
- Production/local exact asset identity: **37/37** (32 product + 5 marketing, byte length and ETag)
- Placeholder / watermark / QR / reseller logo / category fallback / wrong image / fake upscale / broken image: **0**

## 6. Discontinued/source-status handling

- `GL321` and `GL343`: retained for reference, consultation and equivalent-model guidance. Production does not claim “Còn hàng”, “Có sẵn” or “Mua ngay”.
- `GL332` and `GL345`: source availability/price requires confirmation; production uses consultation/quotation language.

## 7. Quote Wizard and lead safety

| Entry | Flow | Context | Submit |
|---|---|---|---|
| Landing GL3xx | Step 1 → 2 → 3 PASS | `bafurni-mesh-highback-gl3xx` | Not submitted |
| GL304 | Step 1 → 2 → 3 PASS | GL304 | Not submitted |
| GL345 | Step 1 → 2 → 3 PASS | GL345 | Not submitted |

Lead giả: **0**. `lead-config.js` returned HTTP 200 (315 bytes) and retains the approved Apps Script production endpoint. Apps Script and Lead Engine were not modified.

## 8. Regression and responsive QA

| Scope | Result |
|---|---|
| Homepage V9.1 | PASS |
| V10.02 Ghế giám đốc The One (8 products) | PASS |
| V10.04 landing/product template | PASS |
| Logo, typography, color, header, footer | PASS |
| Sticky CTA / Quote Wizard / Lead Engine | PASS |
| Viewports 1440×900, 1280×800, 768×1024, 390×844, 360×800 | 20/20 page-viewport checks PASS |
| Horizontal overflow | 0 |
| Broken image | 0 |
| Console/runtime error attributable to bafurni.com | 0 |

## 9. Marketing assets

| Asset | Production URL | Natural | QA |
|---|---|---:|---|
| Hero | https://bafurni.com/assets/v10-04/gl3xx-theone/marketing/hero-1920x1080.png | 1920×1080 | PASS |
| Collage | https://bafurni.com/assets/v10-04/gl3xx-theone/marketing/collage-1600x1200.png | 1600×1200 | PASS |
| Thumbnail | https://bafurni.com/assets/v10-04/gl3xx-theone/marketing/thumbnail-1200x1200.png | 1200×1200 | PASS |
| OG | https://bafurni.com/assets/v10-04/gl3xx-theone/marketing/og-1200x630.png | 1200×630 | PASS |
| Social Cover | https://bafurni.com/assets/v10-04/gl3xx-theone/marketing/social-cover-1640x924.png | 1640×924 | PASS |

The collage uses ten real product images with verified Code/image pairing and no watermark, QR, source logo, placeholder or distortion. Marketing content was not auto-published.

## 10. Immutable data fingerprints

| Scope | Canonical SHA-256 / evidence | Result |
|---|---|---|
| Website ProductDB runtime set (16 files) | `748b0cfa81b29becea6d4e4cfe5d22c05cf8600afbb00b47d7eda5ed0be90f4c` | 16/16 blobs unchanged from previous production |
| Portal tree (`portal_v2`, 28 business files) | `7f2cb9d844b9259076d90b95725b4eaf4b021fdc3fb05c218837160a544b2c3a` | Outside website diff; unchanged |
| `lead-config.js` | `bf34f4f036f3e2d1856847f9ef893edb46cffdd47f55e3a4baa225519889f461` | Unchanged |
| `lead-engine.js` | `90f526ec66dbb0a5189dd10bc4251261e24aa78a00a25f117e960a50de7215ac` | Unchanged |
| Apps Script `Code.gs` | `cbae42fccf141bab041d9ce395b5c1305b86ad3f029224039b1c9f82f03c03d0` | Unchanged |

## 11. Image provenance summary

- Membership and pricing: existing ProductDB/Portal records.
- Product names, dimensions, materials and source state: verified The One source.
- Recovered V10.04R images: approved official manufacturer assets, exact-Code match.
- Source-limited 580×580 images: official exact-Code source files preserved at natural resolution; no artificial upscale or substituted product.
- Runtime dataset and browser-injected Product schema use the approved image mapping.

## 12. Known limitations

1. Fifteen exact official-source main images are limited to 580×580. They remain intentionally source-limited and are not synthetically enlarged.
2. Historical V10.04 QA/report artifacts that describe seven placeholders or `NO_CLEAN_EXACT` predate V10.04R and are superseded by this freeze and the approved recovery audit.
3. The standalone package SEO/schema reference artifact reflects the pre-recovery package snapshot; it is not the production runtime source. Production pages inject current per-product Product schema from the recovered runtime dataset, verified on all 22 routes.
4. `GL321` and `GL343` are marked discontinued by The One and remain catalog references only; current availability requires confirmation.

## 13. Final decision

**PRODUCTION PASS.** V10.04 + V10.04R content is frozen at `db0c88d863df33054e99e10cd675cc367af5c7b1`. No next micro-group, UI change, further image hunting or automatic marketing publication is authorized by this record.

