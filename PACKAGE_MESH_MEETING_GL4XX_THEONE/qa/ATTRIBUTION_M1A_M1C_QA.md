# GL4xx Attribution QA — M1A / M1C

Status: **PASS — local runtime**
Checked: `2026-08-24T17:12:40+07:00`
Runtime: `http://127.0.0.1:4184`
Browser: Chrome, fresh top-level tabs for session-isolation checks
Lead submitted: **NO**

## Scope and method

- Exercised the real landing, product template, Site Shell and Quote Wizard through Step 3.
- Read the final hidden form fields at Step 3; no Submit button was clicked.
- Attribution was verified through the lead form contract, not by directly inspecting browser storage.
- Direct isolation used a new top-level tab with no UTM query while Facebook and Zalo test tabs remained active.
- Console errors across Facebook, Zalo, direct landing and direct product tabs: `0`.
- Success panel remained hidden and no lead-success state was reached.

## URLs tested

Facebook locked URL:

`/danh-muc/ghe-luoi-phong-hop?utm_source=facebook&utm_medium=social&utm_campaign=gl4xx_theone&utm_content=group_post_01`

Zalo parity URL used for QA:

`/danh-muc/ghe-luoi-phong-hop?utm_source=zalo&utm_medium=social&utm_campaign=gl4xx_theone&utm_content=group_post_01`

Additional five-field persistence variants appended `utm_term=meeting_room` for Facebook and `utm_term=oa` for Zalo. These variants were test-only and were not added to marketing assets.

## Results

| Journey | Step | product_code | product_name | product_category | source | medium | campaign | content | term | Result |
|---|---:|---|---|---|---|---|---|---|---|---|
| Facebook URL → landing → Quote | 3 | empty | empty | `ghe-luoi-phong-hop` | `facebook` | `social` | `gl4xx_theone` | `group_post_01` | empty | PASS |
| Facebook URL → landing → GL401 → Quote | 3 | `GL401` | `Ghế Họp Tựa Lưới The One GL401` | `ghe-luoi-phong-hop` | `facebook` | `social` | `gl4xx_theone` | `group_post_01` | empty | PASS |
| Facebook five-field URL → GL401 → GL430 → Quote | 3 | `GL430` | `Ghế Họp Tựa Lưới The One GL430` | `ghe-luoi-phong-hop` | `facebook` | `social` | `gl4xx_theone` | `group_post_01` | `meeting_room` | PASS |
| Zalo URL → landing → Quote | 3 | empty | empty | `ghe-luoi-phong-hop` | `zalo` | `social` | `gl4xx_theone` | `group_post_01` | empty | PASS |
| Zalo URL → landing → GL401 → Quote | 3 | `GL401` | `Ghế Họp Tựa Lưới The One GL401` | `ghe-luoi-phong-hop` | `zalo` | `social` | `gl4xx_theone` | `group_post_01` | empty | PASS |
| Zalo five-field URL → GL401 → GL430 → Quote | 3 | `GL430` | `Ghế Họp Tựa Lưới The One GL430` | `ghe-luoi-phong-hop` | `zalo` | `social` | `gl4xx_theone` | `group_post_01` | `oa` | PASS |
| New direct tab → landing → Quote | 3 | empty | empty | `ghe-luoi-phong-hop` | empty | empty | empty | empty | empty | PASS |
| New direct tab → GL401 → Quote | 3 | `GL401` | `Ghế Họp Tựa Lưới The One GL401` | `ghe-luoi-phong-hop` | empty | empty | empty | empty | empty | PASS |

## Contract audit

`lead-attribution.js` uses first-party `sessionStorage` with key `ba_utm_attribution_v1` and the five locked fields:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

When a page URL contains any campaign field, the current five-field object is captured. Navigation without campaign fields reuses that tab's captured attribution. A separate direct tab receives no attribution.

M1C product context is synchronized into the Quote Wizard hidden fields:

- landing keeps category-only context and does not invent a product;
- GL401 sets the exact GL401 Code and name;
- navigating onward to GL430 replaces GL401 with GL430 rather than retaining stale context.

## Environment boundary

No deployed Vercel Preview URL was available during this test. This report therefore proves the current local runtime at `127.0.0.1:4184`. Re-run the same matrix against the generated Vercel Preview URL after preview deployment.

No Lead Engine, ProductDB, Portal or endpoint file was changed. No lead was submitted.
