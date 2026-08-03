# Technical QA — V10.02

## Data

- 8/8 Code đúng ProductDB: TQ01, TQ05, TQ26, TQ27, TQ30, TQ34, TQ38, TQ39.
- Giá đọc đúng từ `productdb-data.part1.js`; ProductDB không bị sửa.
- 8/8 ảnh chính đúng Code; category image trong product = 0.
- Gallery sạch: 8/8 trang có ảnh; watermark dùng trên website = 0.
- 2 ảnh phụ TQ34 có watermark bị loại, không crop/blur để che.
- Product routes giữ đúng context Code trong Quote Wizard.

## Landing

- Section flow: Hero → Benefits → Product Grid → Quick Comparison → Buying Guide → FAQ → Quote.
- Word count: 691 ở 1440; 678 ở 768/390 do nội dung ẩn theo responsive. Target 500–700: PASS.
- Product cards: 8.
- FAQ: 10 trên landing; package FAQ: 12.
- JSON files parse: PASS.
- JavaScript syntax: PASS.

## Responsive browser QA

| Viewport | Product cards | Broken image | Horizontal overflow | Word count |
|---|---:|---:|---:|---:|
| 1440×900 | 8 | 0 | 0 | 691 |
| 1280×800 | 8 | 0 | 0 | 691 |
| 768×1024 | 8 | 0 | 0 | 678 |
| 390×844 | 8 | 0 | 0 | 678 |

## Product detail

- 8/8 trang render đúng H1, Code, ảnh, giá, kích thước, chất liệu, công năng, bảo hành và related products.
- 8/8 primary image đúng mapping.
- Broken image = 0.
- Horizontal overflow desktop/mobile = 0.
- TQ34 mobile first screen: ảnh đúng mã; gallery count = 1; watermark = 0.

## Quote Wizard

- Landing: bước 1 → 2 → 3 PASS; source `bafurni-executive-chair-theone-v10-02`.
- Product TQ34: bước 1 → 2 → 3 PASS; `product_code=TQ34`, tên đúng.
- Không submit; lead test = 0.
- Lead Engine endpoint không sửa.
- Cấu hình public được nhúng trực tiếp và giữ đúng giá trị của `lead-config.js`; Vercel alias `/quote-engine.js` → `/lead-engine.js` tránh client blocker theo tên file. Logic gốc không đổi.

## Runtime

- Console errors: 0.
- Broken images: 0.
- `git diff --check`: PASS.
- Portal, Apps Script, Lead Engine: unchanged.
