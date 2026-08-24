# BAFURNITURE — SL MEETING CHAIR PRODUCTION FREEZE

Freeze time: 2026-08-24 12:00:06 +07:00 (Asia/Bangkok)  
Status: **PASS — Ready / Production / Current**

## 1. Release identity

| Field | Value |
|---|---|
| Package | Ghế họp chân quỳ SL / The One |
| Product count | 22 |
| Approved branch | `feature/sl-chair-theone-product-package` |
| Approved runtime commit | `b810aab11c49ffbcc7c5725a30d580955fe85dcc` |
| Approved branch head | `7b54f54b8a6fb44455c2e1de6365251585a55eb5` |
| Previous production / rollback SHA | `b95dd4e9bc4f02d7c29a431cff9f499aa2be2916` |
| Merge commit | `64454aa27ef1d56faa91ececb2f1b76beb805cf7` |
| FAQ parity correction | `d379d1b6e75ce24bbce808496d1420b90362d1bd` |
| Production runtime SHA | `d379d1b6e75ce24bbce808496d1420b90362d1bd` |
| Vercel deployment ID | `FE3qER7cUEw8L5VPf4syTE9BTxQQ` |
| Immutable deployment URL | https://bafurni-website-4mldgs3bb-phuvuongdistributor-boops-projects.vercel.app |
| Production domain | https://bafurni.com |
| Build time | 11 s |
| Deployment time | 2026-08-24 11:50:29 +07:00 |
| Vercel state | Ready — Production — Current |

The approved branch was merged with history preserved. The only release-time correction aligned the landing runtime with the approved package: 11 visible FAQ and 11 FAQ schema entries. It reused approved FAQ content and did not change layout, typography, ProductDB, Portal, Lead Engine, Apps Script, image mapping or marketing copy.

## 2. Frozen scope

Landing: https://bafurni.com/danh-muc/ghe-hop-chan-quy

Codes: `SL216S`, `SL225S`, `SL601S`, `SL603M`, `SL606`, `SL607`, `SL710S`, `SL711S`, `SL712S`, `SL718M`, `SL719M`, `SL721M`, `SL811M`, `SL901`, `SL903`, `SL904`, `SL905`, `SL906`, `SL908`, `SL926`, `SL933`, `SL9700M`.

## 3. Production landing QA

| Check | Result |
|---|---|
| HTTP | 200 — PASS |
| Product cards | 22/22 — PASS |
| Product visibility | Product grid begins early — PASS |
| Current typography/color/header/footer | PASS |
| Comparison | 8 rows — PASS |
| Buying Guide | PASS |
| Visible FAQ | 11/11 — PASS |
| FAQ schema | 11/11 — PASS |
| Quote CTA | PASS |
| Broken image | 0 |

## 4. Production product routes

All 22 routes returned HTTP 200. Browser runtime verification passed for H1, Code, canonical, Product schema SKU, image mapping and `product_code` / `product_name` / `product_category` context.

1. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl216s
2. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl225s
3. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl601s
4. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl603m
5. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl606
6. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl607
7. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl710s
8. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl711s
9. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl712s
10. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl718m
11. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl719m
12. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl721m
13. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl811m
14. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl901
15. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl903
16. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl904
17. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl905
18. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl906
19. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl908
20. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl926
21. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl933
22. https://bafurni.com/san-pham/ghe-hop-chan-quy/sl9700m

Wrong Code: **0**.

Runtime note: the static product template is populated by JavaScript, so raw HTML does not contain the final H1/canonical before script execution. Browser-rendered H1/canonical/schema/context passed 22/22. This remains a known limitation for crawlers that do not execute JavaScript.

## 5. Image QA and source limitation

| Metric | Result |
|---|---:|
| CLEAN exact-Code images | 22/22 |
| Natural resolution | 22/22 at 580×580 |
| Gallery total | 22 |
| Candidate images reviewed | 270 |
| Rejected images | 248 |
| Wrong image | 0 |
| Watermark | 0 |
| QR | 0 |
| Supplier/reseller logo | 0 |
| Placeholder | 0 |
| Category fallback | 0 |
| Fake upscale | 0 |
| Broken image | 0 |

Production/local byte and SHA-256 identity passed 22/22. Each public asset is the approved exact-Code source file; no synthetic enlargement was created.

Rendered product-detail gallery size:

| Viewport | Natural | Rendered | Assessment |
|---|---:|---:|---|
| 1440×900 | 580×580 | ~575×575 | At natural scale — PASS |
| 1280×800 | 580×580 | ~575×575 | At natural scale — PASS |
| 768×1024 | 580×580 | ~703×703 | 1.21× CSS display; slight softness/source-limit risk, reported only |
| 390×844 | 580×580 | ~346×346 | PASS |
| 360×800 | 580×580 | ~315×315 | PASS |

Landing cards render about 410×410 on desktop and 330×330 at smaller layouts. `object-fit` and layout preserve full product shape. No abnormal distortion was observed.

Source exceptions:

- `SL903`: production uses the approved `SL903` asset; it does not fall back to the incorrect `SL908` URL held by ProductDB. Production hashes for `SL903` and `SL908` are distinct.
- `SL9700M`: production retains the approved archive exact-Code cantilever-chair asset because the current corporate image conflicts with the model description.

## 6. M1A UTM and M1C product-context QA

Tracked entry:

`https://bafurni.com/danh-muc/ghe-hop-chan-quy?utm_source=facebook&utm_medium=social&utm_campaign=sl_chair_theone&utm_content=group_post_01`

| Flow | UTM | Product context | Quote Wizard | Submit |
|---|---|---|---|---|
| Landing → Quote | Four fields retained | category=`ghe-hop-chan-quy`, code/name empty | Step 1→2→3 PASS | No |
| Landing → SL216S → Quote | Four fields retained | code=`SL216S`, exact name, category=`ghe-hop-chan-quy` | Step 1→2→3 PASS | No |
| Landing → SL216S → SL9700M → Quote | Four fields retained | context updates to `SL9700M`, exact name/category | Step 1→2→3 PASS | No |
| Fresh direct tab → SL216S → Quote | UTM empty | exact `SL216S` context | PASS | No |

Persisted values: `facebook / social / sl_chair_theone / group_post_01`. No lead was submitted.

## 7. Responsive and regression QA

| Scope | Result |
|---|---|
| Homepage V9.1 | PASS |
| V10.02 Ghế giám đốc The One | PASS — landing 8 products; TQ05 context correct |
| V10.04 GL3xx | PASS — landing 22 products; GL304 and GL345 context correct |
| M1A UTM persistence | PASS |
| M1C product context normalization | PASS |
| `lead-config.js` | HTTP 200; endpoint unchanged |
| Viewports | 1440×900, 1280×800, 768×1024, 390×844, 360×800 |
| Pages at all viewports | Homepage, SL landing, SL216S, SL9700M — PASS |
| Horizontal overflow | 0 |
| Broken image | 0 |
| Console/runtime error attributable to bafurni.com | 0 |
| Lead test submitted | 0 |

## 8. Marketing package readiness

Approved collage: https://bafurni.com/assets/product-packages/sl-chair-theone/marketing/collage-facebook-group-post-01-1200x1500.png

- Natural size: 1200×1500 PNG.
- Selected Codes: `SL216S`, `SL603M`, `SL607`, `SL718M`, `SL901`, `SL926`, `SL933`, `SL9700M`.
- Exact approved copy and tracked URL are present in the production package.
- Collage and copy returned HTTP 200 and matched approved local artifacts.
- Facebook publish status remains **PREPARE_ONLY**. Nothing was published.

## 9. Protected-scope verification

Diff from rollback base through production runtime:

| Protected scope | Diff |
|---|---:|
| ProductDB | 0 |
| Portal | 0 |
| Lead Engine / M1A / M1C | 0 |
| Apps Script | 0 |
| Existing product/category mappings outside this package | 0 |

## 10. Final decision

**PRODUCTION PASS.** The SL meeting-chair package runtime is frozen at `d379d1b6e75ce24bbce808496d1420b90362d1bd`, with rollback SHA `b95dd4e9bc4f02d7c29a431cff9f499aa2be2916`.

No Facebook post, Google Business post, Zalo post, Ads campaign, second marketing post, GL4xx work or new product package was started by this release.
