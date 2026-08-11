# Technical QA — V10.04

## Local preview

- Landing: `http://127.0.0.1:4174/danh-muc/ghe-luoi-lung-cao`
- 22/22 product routes: HTTP 200.
- Exact Code membership: 22/22; code ngoài danh sách: 0.
- Product cards: 22; duplicate Code: 0.
- Product image mapping: 16 `LOW_RES_EXACT`, 6 `NO_CLEAN_EXACT` neutral placeholder.
- Category fallback: 0.
- Wrong product image: 0.
- Watermark/QR/supplier logo trên public assets: 0/0/0.
- Broken image: 0.
- Console/runtime error trên landing, homepage V9.1 và V10.02 landing: 0.
- Lead test submitted: 0.

## Responsive

| Viewport | Horizontal overflow | Broken image | Product cards | Kết quả |
|---|---:|---:|---:|---|
| 1440×900 | 0 | 0 | 22 | PASS |
| 1280×800 | 0 | 0 | 22 | PASS |
| 768×1024 | 0 | 0 | 22 | PASS |
| 390×844 | 0 | 0 | 22 | PASS |
| 360×800 | 0 | 0 | 22 | PASS |

## Quote Wizard — không submit

| Context | Step 1 | Step 2 | Step 3 | Submit |
|---|---|---|---|---|
| Landing | PASS | PASS | PASS | Không |
| GL304 | PASS | PASS | PASS | Không |
| GL345 | PASS | PASS | PASS | Không |

## Product samples

- GL304: H1/Code/canonical/Product schema đúng; gallery 3 ảnh đúng mã; related routes đúng; broken image 0.
- GL345: H1/Code/canonical đúng; placeholder disclosure hiển thị; Product schema không khai báo ảnh giả; broken image 0.

## Regression

- Homepage V9.1: H1, logo chuẩn, 8 category card, 8 featured product card, broken image 0, overflow 0, console error 0.
- V10.02 Executive Chair: 8 mã `TQ01, TQ05, TQ26, TQ27, TQ30, TQ34, TQ38, TQ39`, broken image 0, overflow 0, console error 0.
- `ProductDB`, `Portal`, `lead-engine.js`, `lead-config.js`, Apps Script, `premium-ui-v9.css` và `executive-chair-theone.css`: không đổi.

## Automated validation

`STATIC_VALIDATION.json`: 128 checks PASS sau staging. Validator được chạy lại sau commit và sau Preview deployment.
