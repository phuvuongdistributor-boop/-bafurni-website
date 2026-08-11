# Package Report — V10.04 GL3xx The One

## Scope

- Branch: `feature/v10-04-gl3xx-theone-product-package`
- Base: `8ac588cc871b5c6d386d6010f125b12412164777`
- Product count: 22.
- Source pages found: 22/22, HTTP 200 tại thời điểm audit.
- Landing: `/danh-muc/ghe-luoi-lung-cao`.
- Product routes: `/san-pham/ghe-luoi-lung-cao/{code}`.
- Framework: V10.02 templates/CSS được tái sử dụng, không redesign.

## Data enrichment

- Official dimensions: 22/22.
- Official materials: 22/22.
- Official numeric price: 18/22; 4 trang yêu cầu liên hệ.
- Public website price: 22/22 từ ProductDB SalePrice, luôn ghi “Giá tham khảo ProductDB”.
- Official discontinued flag: GL321, GL343.
- Explicit published color: GL309 / D16; các màu khác không được biến thành fact public.
- Numeric dimension conflicts với Portal: GL324, GL329, GL338, GL343, GL345; website ưu tiên trang The One và provenance ghi rõ.

## Image audit

- Candidate URL: 229; tải thành công: 220; lỗi tải: 9.
- Clean main images: 15/22.
- Clean gallery images selected: 16 exact-byte files.
- `CLEAN_EXACT`: 0; `LOW_RES_EXACT`: 16.
- `NO_CLEAN_EXACT`: GL304, GL309, GL316, GL317, GL324, GL335, GL345.
- Rejected: WATERMARK 19, QR 0, SUPPLIER_LOGO 9, WRONG_CODE 2, DUPLICATE 174, REJECT 9.
- Final visual correction: ba ảnh gốc GL304 có watermark chéo mờ trên lưng ghế; cả ba bị loại khỏi public assets và GL304 chuyển sang placeholder trung tính.
- Highest candidate resolution: 800×500, nhưng thuộc `SUPPLIER_LOGO` và bị loại.
- Lowest candidate resolution: 100×100 duplicate thumbnail và bị loại.
- Highest/lowest selected clean resolution: 580×580 / 580×580.
- Public wrong image: 0; category fallback: 0; product pixel upscale: false.

Bảng 22 mã đầy đủ: `PRODUCT_SOURCE_IMAGE_STATUS.md`.

## Content package

- Landing copy: 725 từ; HTML main static: 714 từ.
- Buying guide: 589 từ.
- FAQ: 10.
- Marketing asset count: 5 — Hero, Collage, Thumbnail, OG, Social Cover.
- Collage: 10 mã sạch, không dùng bảy mã thiếu ảnh.
- Marketing copy: 2 Facebook, 1 Google Business, 1 Zalo OA, 5 caption, 10 hook, 10 CTA; chưa publish.
- Knowledge package: 22 product summaries, verified features, comparison, FAQ, buying guide routing, keywords, sales points và source provenance.

## QA

- Business QA: PASS WITH DISCLOSED SOURCE LIMITATION.
- Technical local QA: PASS.
- Viewports 1440/1280/768/390/360: overflow 0, broken image 0.
- Quote Wizard landing, GL304, GL345: bước 1→2→3 PASS; submit 0.
- Homepage V9.1 regression: 0.
- V10.02 Executive Chair regression: 0.
- Vercel Preview đầu tiên: `READY`, deployment ID `5844049663`, commit-to-success quan sát 44 giây.
- Preview branch alias: `https://bafurni-website-git-f-d5beaf-phuvuongdistributor-boops-projects.vercel.app` (Deployment Protection / Vercel SSO).

## Missing fields not public

Package không biến các trường sau thành fact public vì nguồn chưa công bố đầy đủ: tải trọng, tồn kho, thời gian giao, bảo hành đồng nhất cho toàn nhóm và tùy chọn màu ngoài D16 của GL309.

## Known limitations

1. Ảnh sạch chính thức chỉ 580×580; chi tiết vẫn bị giới hạn khi zoom, dù không upscale.
2. Bảy mã dùng placeholder trung tính vì nguồn public chỉ có ảnh watermark/logo hoặc không có ảnh sạch; GL304 được bổ sung vào nhóm này sau QA thị giác Preview.
3. GL317 là biến thể lưng cao bọc da CN trong membership ProductDB/Portal, không phải tựa lưới.
4. GL321 và GL343 đang được The One ghi ngừng kinh doanh; phải xác nhận mẫu thay thế/khả dụng.
5. Giá ProductDB khác giá hiện hành trên 18 trang nguồn; website không dùng giá nguồn để ghi đè ProductDB.
6. Marketing content/asset là content bank, chưa publish.
