# Technical QA — SL / The One

Ngày kiểm tra: 2026-08-24 (Asia/Bangkok)

## Static gate

- Product count: 22/22; Code order khớp inventory.
- Product asset: 22/22 exact-byte mirror, 580×580 nguồn thật.
- Gallery: 22 ảnh, một ảnh sạch đúng mã cho mỗi product.
- Placeholder, wrong Code, category fallback: 0.
- Watermark, QR, supplier/reseller overlay: 0.
- Fake upscale: 0.
- Vercel rewrite: 2/2 explicit và đứng trước generic rewrite.
- Sitemap: landing + 22/22 product URL.
- FAQ: 11; schema JSON parse PASS.
- Collage: 1200×1500, đúng tám ảnh nguồn 580×580, rendered ≤ natural size.
- Static validation: `STATIC_VALIDATION.json` = PASS.

## Browser local

Landing được kiểm tra ở 1440×900, 1280×800, 768×1024, 390×844 và 360×800:

- 22 card; first `SL216S`, last `SL9700M`.
- Horizontal overflow: 0.
- Console/page error: 0.
- Sau khi kích hoạt lazy-load: 22/22 ảnh tải 580×580, broken image 0.
- Product grid bắt đầu tại y=843 px ở desktop 1440; y=1158 px ở mobile 390; y=1218 px ở mobile 360.
- Flow runtime: Hero → Product Grid → assurance → comparison → guide → FAQ → Quote.

Product `SL216S` và `SL9700M`:

- H1, Code, canonical, schema SKU, ảnh và ba related item đúng.
- Context product thay thế theo trang hiện tại; `SL9700M` không giữ `SL216S` cũ.
- Horizontal overflow 0; broken image 0; console/runtime error 0.

## Quote / attribution

Không bấm Submit; lead test = 0.

- Landing UTM → Step 1 → 2 → 3: PASS.
- Landing context: category đúng; code/name rỗng.
- Landing → `SL216S` → Step 3: exact Code/name/category và bốn UTM field đúng.
- `SL216S` → `SL9700M` → Step 3: context cập nhật thành `SL9700M`; UTM còn đúng.
- Tab mới/direct → `SL216S`: UTM rỗng, product context vẫn đúng.

Kết quả: M1A regression = 0; M1C regression = 0; Lead Engine source diff = 0.
