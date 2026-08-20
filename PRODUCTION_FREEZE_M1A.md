# BAFURNITURE M1A — PRODUCTION FREEZE

Freeze date: 2026-08-20 (Asia/Bangkok)  
Status: **PASS — Ready / Production / Current**

## 1. Release identity

| Field | Value |
|---|---|
| Feature | M1A first-party UTM persistence + conditional Telegram attribution |
| Approved commit | `6b805641cc73d45ef602c6c7f3d8b6020d81ad69` |
| Previous production / rollback SHA | `37a8fc93aa0446e93ac34076ee3cc03e7bea6b45` |
| Website merge / content SHA | `3491a2ea88d9e7f12e17cb2e67125d778e8cba11` |
| Runtime production main SHA | `3491a2ea88d9e7f12e17cb2e67125d778e8cba11` |
| Vercel deployment ID | `dpl_CfcYhPcUrGtWzYP3vFLwpwtcCoyK` |
| Production deployment URL | https://bafurni-website-b06tz285d-phuvuongdistributor-boops-projects.vercel.app |
| Production domain | https://bafurni.com |
| Vercel state | Ready — Production — Current |
| Vercel build duration | 15 s displayed; 15,851 ms created → ready |
| Apps Script project | `BAFurniture Lead Webhook V7.1` |
| Apps Script version | Version 4, active production |
| Apps Script deployment ID | `AKfycbyLFkUYAvwWnpzJOwwLzhCak1YKAW623XPdL-mnbHSJPEfhBYPAX1QtGKNlTC5mFztWMQ` |

## 2. Frozen scope

The release adds first-party UTM persistence and compact Telegram attribution formatting. It does not change ProductDB, Portal, public UI, product/category data, assets, Sheet schema, lead endpoint, or secrets.

The existing production Apps Script deployment was updated in place to Version 4. An accidental second deployment created during release was archived; it is not referenced by `lead-config.js`.

No Facebook, Google Business, or Zalo content was published. No production lead was submitted.

## 3. Persistence mechanism

| Item | Frozen behavior |
|---|---|
| Storage | First-party `sessionStorage` |
| Storage key | `ba_utm_attribution_v1` |
| Fields | `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` |
| Capture | URL parameters are trimmed, limited to 500 characters, and stored when at least one supported UTM field is present |
| Navigation | Internal navigation reads persisted attribution without appending query parameters to every URL |
| Lifecycle | Same browser tab/session only; a new direct tab starts without inherited attribution |
| Privacy | No third-party tracker and no client-side Telegram or Sheet secret |

The Lead Engine reads the persisted attribution for both quick and full lead payloads. A visit without supported UTM parameters continues to work with empty UTM values.

## 4. Production journey QA — no submit

Test input:

`https://bafurni.com/danh-muc/ghe-luoi-lung-cao?utm_source=facebook&utm_medium=social&utm_campaign=gl3xx_theone&utm_content=group_post_01`

| Journey | Source | Medium | Campaign | Content | Product context | Result |
|---|---|---|---|---|---|---|
| A. Landing → Quote Wizard | `facebook` | `social` | `gl3xx_theone` | `group_post_01` | Package/landing | Step 1 → 2 → 3 PASS |
| B. Landing → GL304 → Quote Wizard | `facebook` | `social` | `gl3xx_theone` | `group_post_01` | `GL304` | Step 1 → 2 → 3 PASS |
| C. Landing → GL304 → GL345 → Quote Wizard | `facebook` | `social` | `gl3xx_theone` | `group_post_01` | `GL345` | Step 1 → 2 → 3 PASS |
| D. New direct tab → Quote Wizard | empty | empty | empty | empty | Direct | PASS — no stale attribution |

Homepage, landing GL3xx, GL304, and GL345 Quote Wizards reached Step 3 without Submit. Production lead submitted: **0**.

## 5. Responsive and runtime QA

Routes tested: homepage, landing GL3xx, GL304, and GL345.

| Viewport | Horizontal overflow | Broken image | Console/runtime error | Result |
|---|---:|---:|---:|---|
| 1440×900 | 0 | 0 | 0 | PASS |
| 1280×800 | 0 | 0 | 0 | PASS |
| 768×1024 | 0 | 0 | 0 | PASS |
| 390×844 | 0 | 0 | 0 | PASS |
| 360×800 | 0 | 0 | 0 | PASS |

Production HTTP checks:

- Homepage: HTTP 200.
- Landing GL3xx: HTTP 200.
- GL304: HTTP 200.
- GL345: HTTP 200.
- `lead-config.js`: HTTP 200.
- `lead-config.js` references the unchanged production deployment ID and does not reference the archived accidental deployment.
- `lead-attribution.js?v=1.0.0`: HTTP 200 and byte-identical to the approved source.

## 6. Telegram production formatting

The server-side message adds these lines only when the values exist:

- `Nguồn: Facebook`
- `Campaign: gl3xx_theone`
- `Content: group_post_01`

The message remains compact. `utm_medium` and `utm_term` are not added to Telegram. Bot token, chat ID, and other Script Properties remain server-side and are not exposed by the website.

## 7. Google Sheet readiness

The active `Leads` sheet retains its existing 28-column schema. Existing mapping remains unchanged for:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`

`utm_term` is persisted and included in the client lead context, but it is intentionally not added to the Sheet because the approved production schema has no `utm_term` column.

## 8. Protected scope verification

| Scope | Result |
|---|---|
| ProductDB tracked manifest | Unchanged; SHA-256 `7b77e0e7156b77abf75444d04a8164e5205607c30d3144a074f16b881d344f19` |
| Portal | No file changed |
| `lead-config.js` / endpoint | Unchanged |
| Sheet headers/schema | Unchanged |
| Script Properties | Preserved; values not recorded in this freeze |
| UI/CSS/assets/product data | Unchanged |

## 9. Rollback

Website rollback SHA: `37a8fc93aa0446e93ac34076ee3cc03e7bea6b45`.

Apps Script rollback target: previous active production version 3 on the same deployment ID and endpoint.

## 10. Final decision

**PRODUCTION PASS.** M1A attribution persistence is active on the website and the existing Apps Script production endpoint runs Version 4. Telegram formatting and Sheet mapping are ready. No production lead was submitted during verification.
