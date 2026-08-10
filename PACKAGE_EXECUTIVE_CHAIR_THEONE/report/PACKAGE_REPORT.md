# Package Report — Executive Chair The One

Version: V10.02 Framework

Branch: `feature/v10-02-executive-chair-package-standard`

Status: Final release candidate; chỉ merge sau khi Preview regression PASS.

## Scope

Một nhóm duy nhất: Ghế giám đốc → The One → 8 sản phẩm. Không triển khai Hòa Phát hoặc nhóm ghế khác.

## 10 phần hoàn thành

1. **Product:** 8 Code, giá ProductDB, ảnh đúng mã, gallery sạch, specs, dimensions, materials, descriptions, related products.
2. **Landing:** flow bán hàng 7 section, đúng 691 từ desktop và 678 từ mobile.
3. **Buying Guide:** tài liệu riêng khoảng 500–600 từ.
4. **FAQ:** 12 câu trong package, 12 câu trên landing, có FAQ schema đầy đủ.
5. **SEO:** title, description, keywords, canonical, schema, internal links và related categories.
6. **Image Package:** 13 asset gồm hero, collage, thumbnail, 8 product cards, OG và social cover.
7. **Marketing Package:** Facebook long/short, Google Business, Zalo OA, 5 caption, 10 hook, 10 CTA.
8. **Knowledge Package:** `knowledge.json` có summary, application, strengths, weaknesses, related, FAQ, keywords, guide và sales points.
9. **Business QA:** PASS với giới hạn gallery được công khai.
10. **Publish Package:** đủ 10 thư mục và `manifest.json`; chỉ deploy Preview.

## Website output

- Landing: `/danh-muc/ghe-giam-doc`
- Details: `/san-pham/ghe-giam-doc/{tq01|tq05|tq26|tq27|tq30|tq34|tq38|tq39}`
- Quote Wizard: landing và TQ34 đều PASS bước 1 → 2 → 3, không submit.

## Image decision

The One công bố ba ảnh cho TQ34 nhưng hai ảnh phụ có watermark. Hai file này bị loại khỏi repository và package. Không tạo góc ảnh giả, không lấy ảnh khác mã, không che watermark. Gallery sạch cuối cùng có một ảnh xác minh cho mỗi Code.

## QA summary

- 8/8 product details đúng Code.
- Broken image = 0.
- Wrong product image = 0.
- Watermark live/package = 0.
- Console error = 0.
- Horizontal overflow = 0 tại 1440, 1280, 768, 390.
- Main production branch và production deployment chưa thay đổi.

## Release gate

Chỉ merge `main` sau khi Preview regression PASS. Sau production verification phải STOP; không bắt đầu V10.03 và không tự đăng marketing.
