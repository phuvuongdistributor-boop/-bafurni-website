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

Preview URL, deployment SHA và remote route QA sẽ được ghi sau khi Vercel Preview Ready.
