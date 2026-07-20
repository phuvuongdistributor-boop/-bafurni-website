# BA_Furniture — Production Visual Correction Report

Ngày hoàn tất preview: 2026-07-20

## Kết luận

Bản preview đạt mục tiêu product-first và giữ V7/V8 ở vai trò teaser. Production chưa được cập nhật theo STOP RULE.

- Production hiện tại: commit `137f1df40b4d2574b0d3eb52f8d757bf9b7051bf`
- Preview UI đã QA: commit `23ef38b`
- Nhánh: `correction/product-v7-v8-preview`
- Preview đã QA: `https://bafurni-website-cfevvg74l-phuvuongdistributor-boops-projects.vercel.app/`
- Vercel project: `bafurni-website`
- Repository: `phuvuongdistributor-boop/-bafurni-website`

## Nguyên nhân báo cáo production trước đó không khớp

Audit không tìm thấy sai project, repository, branch, root directory hay domain alias. `bafurni.com` đang phục vụ đúng recovery commit `137f1df`.

Khả năng cao sai lệch quan sát trước đó đến từ tab/cache phía client cũ hoặc thời điểm quan sát trước khi production alias chuyển xong. Đây là suy luận dựa trên bằng chứng Vercel và HTTP; không có deployment mismatch còn hoạt động tại thời điểm kiểm tra.

Chi tiết: `PRODUCTION_DEPLOYMENT_AUDIT.md`.

## Production trước và sau phần chỉnh sửa

| Trạng thái | Commit | URL | Ghi chú |
|---|---|---|---|
| Production trước chỉnh | `137f1df40b4d2574b0d3eb52f8d757bf9b7051bf` | `https://bafurni.com/` | Đúng recovery commit |
| Production sau chỉnh | Chưa deploy | `https://bafurni.com/` vẫn ở `137f1df` | Dừng ở preview để duyệt |
| Preview đã QA | `23ef38b` | `https://bafurni-website-cfevvg74l-phuvuongdistributor-boops-projects.vercel.app/` | Ready |

## Kiến trúc homepage sau chỉnh

1. Header
2. Hero sản phẩm
3. 8 nhóm sản phẩm
4. Sản phẩm được quan tâm
5. V7 — Giải pháp cho doanh nghiệp, 3 card
6. Sản phẩm theo không gian, 4 card
7. V8 — Dự án và không gian, 3 card
8. Năng lực triển khai dạng strip
9. CTA báo giá
10. Footer

Không có ba section corporate dài nối tiếp. Nội dung operation, coverage, process và brand authority không được mở thành section homepage mới.

## Tỷ trọng thị giác tại 1440px

Đo theo chiều cao các section chính:

| Nhóm | Chiều cao | Tỷ trọng |
|---|---:|---:|
| Hero + category + featured product + product by need | 3.964px | 68,3% |
| V7 solution + V8 project | 1.164px | 20,1% |
| Capability + CTA | 674px | 11,6% |

Kết quả làm tròn đạt tỷ trọng mục tiêu 65–75% / khoảng 20% / 10–15%.

## Số liệu trước và sau

| Chỉ số | Production before | Preview after |
|---|---:|---:|
| Main section | 7 | 8 |
| Từ trong `body.innerText` ở desktop | 512 | 714 |
| H1 | 1 | 1 |
| H2 hiển thị trong main | 6 | 7 |
| H3 sản phẩm hiển thị | 8 | 8 |
| H2 toàn DOM, gồm Quote Wizard | — | 8 |
| H3 toàn DOM, gồm Quote Wizard | — | 12 |
| Category card | 8 | 8 |
| Featured product card | 8 | 8 |
| Product-by-need card | 6 | 4 |
| V7 solution card | — | 3 |
| V8 project card | 3 | 3 |
| Chiều cao trang 1440px | 6.696px | 6.215px |

## Typography

- Stack: `"Segoe UI", Arial, sans-serif`
- Không tải webfont, không có font-swap CLS
- `font-synthesis: none`
- H1 desktop: `clamp(44px, 4vw, 56px)`
- H2 desktop: `clamp(30px, 2.8vw, 36px)`
- H1 mobile: 36px
- H2 mobile: 28px
- H3: 19–22px
- Body: 15–16px
- Heading tiếng Việt dùng sentence case; letter spacing trong khoảng `-0.02em` đến `0`

Chi tiết: `TYPOGRAPHY_AUDIT.md`.

## 8 ảnh danh mục trước và sau

| Danh mục | Trước | Sau |
|---|---|---|
| Ghế văn phòng | 720×540 | `category-office-chair.webp`, 1600×1200 |
| Bàn văn phòng | 720×540 | `category-office-desk.webp`, 1600×1200 |
| Bàn họp | 720×540 | `category-meeting-table.webp`, 1600×1200 |
| Tủ & Hộc | 720×540 | `category-cabinet-pedestal.webp`, 1600×1200 |
| Locker | 720×540 | `category-locker.webp`, 1600×1200 |
| Sofa & Ghế chờ | 720×540 | `category-sofa-waiting.webp`, 1600×1200 |
| Trường học | 720×540 | `category-school.webp`, 1600×1200 |
| Kệ & Giá kho | 720×540 | `category-storage-rack.webp`, 1600×1200 |

- Watermark removed: 0
- Watermark rejected: 0
- Ảnh hiện tại bị loại do không đạt cạnh dài tối thiểu 1200px: 8
- Source candidate bị loại do mờ: 0
- Approved output: 8 ảnh 1600×1200 và 8 thumbnail 800×600
- Không ghi đè master

Chi tiết: `CATEGORY_IMAGE_AUDIT.csv`.

## Logo

- Official asset: `images/brand/ba-furniture-logo.jpg`
- Intrinsic: 1254×1254
- Desktop: 44×44
- Mobile: 38×38
- Không upscale; tên hiển thị thống nhất `BA_Furniture`
- Header và footer dùng cùng official asset đã audit

## Responsive QA

| Viewport | H1 | H2 | Page height | Horizontal overflow | Images |
|---:|---:|---:|---:|---|---|
| 1440 | 56px | 36px | 6.215px | None | 29/29 loaded, 0 broken |
| 1280 | 51.2px | 35.84px | 5.912px | None | 29/29 loaded, 0 broken |
| 768 | 44px | 30px | 9.221px | None | 29/29 loaded, 0 broken |
| 390 | 36px | 28px | 9.978px | None | 29/29 loaded, 0 broken |

## Functional QA

- Vercel preview: Ready
- 8 category routes: HTTP 200
- `lead-config.js`: HTTP 200
- Quote Wizard: mở thành công, bước 1 → 2 → 3 thành công
- Không submit lead thật trong visual QA
- Console error: 0
- ProductDB: không sửa
- Lead Engine: không sửa
- Apps Script: không sửa
- Portal: không sửa
- Không thêm sản phẩm
- Không thêm case study
- Không deploy production

## Screenshot

Production before:

- `qa/screenshots/production-before/homepage-1440-full.png`
- `qa/screenshots/production-before/homepage-1280-full.png`
- `qa/screenshots/production-before/homepage-768-full.png`
- `qa/screenshots/production-before/homepage-390-full.png`

Preview after:

- `qa/screenshots/preview-after/homepage-1440-full.png`
- `qa/screenshots/preview-after/homepage-1280-full.png`
- `qa/screenshots/preview-after/homepage-768-full.png`
- `qa/screenshots/preview-after/homepage-390-full.png`

## Gate

Preview PASS. Production deployment đang chờ duyệt.
