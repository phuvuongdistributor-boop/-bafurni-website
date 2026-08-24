# Package Report — Ghế họp chân quỳ SL / The One

## Kết quả trước Preview

- Base: `b95dd4e9bc4f02d7c29a431cff9f499aa2be2916`
- Branch: `feature/sl-chair-theone-product-package`
- Product: 22/22.
- Clean exact image: 22/22.
- Gallery: 22 ảnh.
- Low-res exact: 22; toàn bộ 580×580 nguồn thật.
- Candidate đã xem: 270; rejected: 248.
- Wrong image, watermark, QR, supplier/reseller overlay, placeholder, category fallback, fake upscale: 0.
- Landing copy: 684 từ; runtime visible: 730 từ.
- Buying Guide: 494 từ; FAQ: 11.
- Product routes: 22.
- Facebook: đúng một final copy và một collage 1200×1500; chưa publish.
- UTM: `facebook / social / sl_chair_theone / group_post_01`.
- Quote Wizard: landing + `SL216S` + `SL9700M`, Step 1→2→3 PASS; không submit.
- Local responsive/console/broken/overflow: PASS.

## Known limitations

1. Bản ảnh corporate 1000–2000 px được tìm thấy nhưng có logo/watermark nhúng nên bị loại; 22 ảnh public dùng bản archive exact-code sạch 580×580 và không upscale.
2. Mỗi Code chỉ có một ảnh gallery sạch đã duyệt. Không dùng ảnh khác mã để tăng gallery.
3. Trang corporate `SL9700M` hiện hiển thị ảnh hình dáng không khớp mô tả chân quỳ; package dùng asset archive exact-code chân quỳ và ghi provenance thay vì giả định ảnh corporate là đúng.
4. `SL903` trong ProductDB có URL ảnh trỏ nhầm `SL908`; package sửa mapping website riêng, không sửa ProductDB.
5. `ACTIVE_OR_UNSPECIFIED` không được chuyển thành claim “còn hàng”.

## Preview

- Runtime commit đã kiểm tra: `b810aab11c49ffbcc7c5725a30d580955fe85dcc`.
- Vercel deployment: `6dBP6s6y9GaAv8yNEVUHbpNUad9U` — `Ready` sau 11 giây.
- Immutable URL: `https://bafurni-website-pnkbwmn1f-phuvuongdistributor-boops-projects.vercel.app`.
- Branch alias: `https://bafurni-website-git-f-10aa05-phuvuongdistributor-boops-projects.vercel.app`.
- Landing: `/danh-muc/ghe-hop-chan-quy` — HTTP 200, 22 card.
- Remote route QA: landing + 22 product route = 23/23 HTTP 200.
- Runtime detail QA: 22/22 đúng H1, Code, canonical, schema SKU và asset `products/{Code}/main.jpg` 580×580.
- Preview responsive: 1440×900, 1280×800, 768×1024, 390×844, 360×800; overflow 0.
- Broken image: 0; console/runtime error: 0.
- Quote Wizard: landing + `SL216S` + `SL9700M`, Step 1→2→3 PASS; submit 0.
- M1A: bốn UTM field giữ đúng qua landing → product → product; direct tab rỗng.
- M1C: landing chỉ có category; `SL216S` và `SL9700M` nhận đúng code/name/category, không giữ context cũ.
- Business QA: PASS. Hero ngắn, CTA xem 22 mẫu nằm ở màn đầu; card đầu xuất hiện trong hai màn hình đầu mobile; collage có hierarchy 2 hero + 6 support, không phải contact sheet.
