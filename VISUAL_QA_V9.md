# BAFurniture V9 — Visual QA

## Phương pháp

QA bằng Chrome thật, không chỉ đọc CSS:

- Chụp cùng trang Before production và After local ở 1440×1000, 768×1024, 390×844.
- Đọc computed style của H1.
- Kiểm tra scroll width, broken image, console error và layout-shift entry.
- Tự đánh giá tỷ lệ, nhịp chữ tiếng Việt, khoảng trắng và brand impression.

## Screenshot package

### Before

- `qa/v9/before/homepage-desktop-1440.png`
- `qa/v9/before/homepage-tablet-768.png`
- `qa/v9/before/homepage-mobile-390.png`
- `qa/v9/before/category-desktop-1440.png`
- `qa/v9/before/category-tablet-768.png`
- `qa/v9/before/category-mobile-390.png`
- `qa/v9/before/product-desktop-1440.png`
- `qa/v9/before/product-tablet-768.png`
- `qa/v9/before/product-mobile-390.png`

### After

- `qa/v9/after/homepage-desktop-1440.png`
- `qa/v9/after/homepage-tablet-768.png`
- `qa/v9/after/homepage-mobile-390.png`
- `qa/v9/after/category-desktop-1440.png`
- `qa/v9/after/category-tablet-768.png`
- `qa/v9/after/category-mobile-390.png`
- `qa/v9/after/product-desktop-1440.png`
- `qa/v9/after/product-tablet-768.png`
- `qa/v9/after/product-mobile-390.png`

## Computed typography After

| Viewport | Homepage H1 | Category H1 | Product H1 |
|---:|---:|---:|---:|
| 1440 | 48 px / 2 dòng | 48 px / 1 dòng | 48 px / 1 dòng |
| 1280 | 48 px / 3 dòng cân | 48 px / 1 dòng | 48 px / 1 dòng |
| 768 | 42 px / 2 dòng | 42 px / 1 dòng | 42 px / 1 dòng |
| 390 | 32 px / 3 dòng | 32 px / 1 dòng | 32 px / 1 dòng |
| 360 | 32 px / 3 dòng | 32 px / 1 dòng | 32 px / 1 dòng |

## Regression matrix

| Viewport | Trang | Overflow | Broken image | CLS entry | Font ready |
|---:|---|---:|---:|---:|---:|
| 1440 | Homepage / Category / Product | 0 | 0 | 0 | PASS |
| 1280 | Homepage / Category / Product | 0 | 0 | 0 | PASS |
| 768 | Homepage / Category / Product | 0 | 0 | 0 | PASS |
| 390 | Homepage / Category / Product | 0 | 0 | 0 | PASS |
| 360 | Homepage / Category / Product | 0 | 0 | 0 | PASS |

Console error local: **0**.

## Quote Wizard

- Product CTA mở đúng wizard.
- Bước 1 → 2: PASS.
- Bước 2 điền loại khách hàng, quy mô, thời gian, khu vực → Bước 3: PASS.
- Product context giữ TQ05.
- Không submit và không gửi lead test.

## Visual verdict

| Surface | Before | After |
|---|---|---|
| Homepage | Product-first tốt nhưng chữ còn giống catalog | Premium hơn, giữ nguyên cấu trúc |
| Category | Portal/template, icon và H1 quá lớn | Brand collection có ảnh thật và hierarchy rõ |
| Product | Logo chiếm first screen desktop | Ảnh sản phẩm, title, giá, CTA và specs có thứ bậc |
| Mobile | UI thiếu thống nhất giữa route | Header, logo, type và CTA đồng nhất |

Kết quả: **PASS về kỹ thuật và PASS về cảm nhận thị giác để đưa lên Vercel Preview review.**
