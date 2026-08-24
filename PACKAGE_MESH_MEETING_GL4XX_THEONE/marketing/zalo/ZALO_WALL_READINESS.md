# Zalo Wall Readiness

## Kết quả

`READY_FOR_ZALO_COMPOSER = YES`

`READY_TO_PUBLISH = NO — chưa có composer preview và chưa được yêu cầu publish`

## Static QA

- Caption: plain text, ngắn hơn và khác cấu trúc Facebook.
- Hotline: `0929.878.666`.
- Landing path: `/danh-muc/ghe-luoi-phong-hop` khớp package canonical.
- UTM: `zalo / social / gl4xx_theone / group_post_01`.
- Lead Engine hiện đọc `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`; không cần sửa runtime.
- Media count: 9/9.
- Cover: 1200×1500.
- Product media: 8/8 ở 1080×1080.
- Selected Codes: GL430, GL427, GL410, GL412, GL419, GL417, GL420, GL402TB.
- Code ↔ image: 8/8 exact.
- Zalo files khớp SHA-256 với approved source render: 9/9.
- Clean product asset: 8/8 `CLEAN_EXACT`.
- Fake upscale: 0.
- Watermark: 0.
- QR: 0.
- Supplier/reseller logo: 0.
- Wrong product: 0.
- Broken local media: 0.

## Provenance

Chi tiết từng Code, nguồn raster, độ phân giải tự nhiên, SHA-256 và file Zalo nằm trong `ZALO_SELECTED_PRODUCTS.csv`. Media order, bytes và hash nằm trong `manifest.json`.

Visual QA artifacts:

- `qa/zalo-wall-contact-sheet.jpg`
- `qa/zalo-cover-mobile-390.jpg`
- `qa/STATIC_QA.json`

## Chưa thực hiện theo stop rule

- Không mở Zalo composer.
- Không kiểm tra crop do composer thực tế.
- Không publish hoặc schedule.
- Không click tracked URL qua Zalo.
- Không submit lead.
- Không sửa website, Lead Engine, ProductDB hoặc Portal.
