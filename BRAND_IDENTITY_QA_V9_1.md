# BA_Furniture V9.1 — Brand Identity QA

## Freeze lineage

- Base production: `e1e9274e564fdb27324e360307bdf9b3b7106b62`
- Approved predecessor: `c54439c3c27845ebd0fdfb2e2d73be1464c89570`
- Branch: `correction/brand-voice-identity-v9-1`
- Main merge: không thực hiện
- Production deploy: không thực hiện

## Locked systems

`ProductDB`, `Portal`, `Lead Engine`, `lead-config.js`, Apps Script, endpoint, product images, category images và product mapping không có diff.

## Homepage responsive

| Viewport | H1 lines | Brand line | Hero height | Category cards | Overflow | Broken image |
|---|---:|---:|---:|---|---:|---:|
| 1440×900 | 2 | 1 dòng | 540 px | 8 × 177 px | 0 | 0 |
| 1280×800 | 3 | 2 dòng | 540 px | 8 × 157 px | 0 | 0 |
| 768×1024 | 2 | 1 dòng | 707 px | 8 × 190 px | 0 | 0 |
| 390×844 | 3 | 2 dòng | 647 px | 8 × 102 px | 0 | 0 |
| 360×800 | 3 | 2 dòng | 647 px | 8 × 93 px | 0 | 0 |

Homepage height desktop tăng 9 px, tương đương 0,16%. Word count trong `main` tăng từ 481 lên 505, tương đương 4,99%.

## Announcement

- Desktop: ba câu đúng brief, mỗi câu một dòng ở 1440.
- Mobile: ba bản rút gọn đúng brief.
- Live region node: 1.
- Hotline: `tel:0929878666`.
- Normal motion: xoay đủ 1 → 2 → 3.
- Reduced motion: giữ câu đầu sau 5,4 giây.
- Height: desktop 34 px; mobile không đổi responsive rule.
- CLS: 0.

## Category QA

| Route | H1 / title đúng | Sản phẩm phù hợp | Rendered | Broken | Overflow |
|---|---|---:|---:|---:|---:|
| `/danh-muc/ghe-van-phong` | PASS | 176 | 32 | 0 | 0 |
| `/danh-muc/ban-van-phong` | PASS | 268 | 32 | 0 | 0 |
| `/danh-muc/ban-hop` | PASS | 51 | 32 | 0 | 0 |
| `/danh-muc/tu-ho-so` | PASS | 109 | 32 | 0 | 0 |
| `/danh-muc/tu-locker` | PASS | 34 | 32 | 0 | 0 |
| `/danh-muc/sofa-ghe-cho` | PASS | 95 | 32 | 0 | 0 |
| `/danh-muc/noi-that-truong-hoc` | PASS | 124 | 32 | 0 | 0 |
| `/danh-muc/ke-gia-kho` | PASS | 3 | 3 | 0 | 0 |

Title và meta description được tạo từ đúng category definition; canonical giữ nguyên.

## Product detail QA

| Code | Image code | Application | Hierarchy | Broken | Overflow |
|---|---|---|---|---:|---:|
| TQ05 | TQ05 | Văn phòng · Phòng lãnh đạo · Phòng họp | PASS | 0 | 0 |
| TQ01 | TQ01 | Văn phòng · Phòng lãnh đạo · Phòng họp | PASS | 0 | 0 |
| DT1890V2 | DT1890V2 | Nhân viên · Lãnh đạo · Văn phòng dự án | PASS | 0 | 0 |
| DT2010V2 | DT2010V2 | Nhân viên · Lãnh đạo · Văn phòng dự án | PASS | 0 | 0 |
| TU09K7CK | TU09K7CK | Lưu trữ hồ sơ · Văn phòng · Cơ quan | PASS | 0 | 0 |
| TU983-3KS | TU983-3KS | Nhân viên · Trường học · Nhà máy | PASS | 0 | 0 |
| GMG101A-2 | GMG101A-2 | Lớp học · Phòng giáo viên · Trường học | PASS | 0 | 0 |
| BMG101A-2 | BMG101A-2 | Lớp học · Phòng giáo viên · Trường học | PASS | 0 | 0 |

Application line 14 px; summary 18 px; price 32 px. Tên → mô tả ngắn → ứng dụng → giá → CTA → thông số vẫn giữ nguyên thứ tự.

## Quote Wizard

- Homepage: bước 1 → 2 → 3 PASS.
- Product detail TQ05: bước 1 → 2 → 3 PASS.
- Context giữ `TQ05`, `Ghế giám đốc TQ05`, `Ghế văn phòng`.
- Source giữ `bafurni-product-detail`.
- Success panel vẫn hidden; không bấm submit; lead giả = 0.

## Runtime / visual QA

- CLS desktop: 0.
- CLS mobile: 0.
- Console error thuộc local site: 0.
- Broken image: 0.
- Horizontal page overflow: 0 tại 1440, 1280, 768, 390, 360.
- Generic English public trong HTML render: 0.
- Cụm khoa trương bị cấm: 0.
- Hero H1, font, màu, logo, ảnh, grid, route và animation system không đổi.

## Preview gate

Chỉ được push branch và tạo Vercel Preview. Không merge `main` và không deploy production.
