# BAFurniture V9 — Premium UI Report

## Scope

- Branch: `correction/premium-ui-polish-v9`
- Merge-base: `3bc3de2b9ee9a83779affab2873b31c75aadcad0`
- Baseline kỹ thuật: site-wide UI correction đã có trên branch preview trước đó
- Trạng thái: Preview only, không merge `main`, không production

## Thay đổi

1. Tạo lớp token và component polish dùng chung cho Homepage, Category và Product Detail.
2. Chuẩn hóa header 84 px, logo production 56 px, search và CTA.
3. Dùng Playfair Display + Inter với Vietnamese glyph, self-host WOFF2 và preload riêng display font để tiêu đề không đổi dòng sau first paint.
4. Chuẩn hóa H1 48 / 42 / 32 px.
5. Nâng card category/product bằng radius, border, shadow và hover -4 px.
6. Giữ nguyên toàn bộ ảnh và mapping; tắt image scale ở hover.
7. Sắp lại nhịp đọc Product Detail:
   ảnh → tên → mô tả ngắn → giá → CTA → thông số → mô tả → sản phẩm liên quan.
8. Đổi CTA product từ “Nhận báo giá sản phẩm” thành “Nhận báo giá”.
9. Chuẩn hóa responsive tại 1440, 1280, 768, 390 và 360.

## Đánh giá cảm nhận thị giác

### Homepage

Before đã có cấu trúc product-first tốt nhưng chữ sans tạo cảm giác thiên về catalog. After giữ nguyên bố cục và ảnh, dùng heading serif có chiều sâu, khoảng trắng rõ và card hoàn thiện hơn. Kết quả gần trải nghiệm của một thương hiệu nội thất lớn mà không biến homepage thành concept mới.

### Category

Đây là cải thiện thị giác lớn nhất. Before dùng màu xanh–cam, icon, số liệu mẫu, nội dung “đang cập nhật” và H1 74 px nên giống Portal/template. After dùng ảnh category thật, copy tối giản, nền charcoal và lưới sản phẩm sạch. Cảm giác chuyển từ “trang module” sang “bộ sưu tập thương hiệu”.

### Product Detail

Before desktop có logo phóng chiếm gần toàn bộ first screen và header không đồng nhất. After đưa đúng ảnh sản phẩm thành trọng tâm, title TQ05 nằm một dòng, giá và CTA rõ, bảng thông số có nhịp 16 px, mô tả tách section. Trang có cảm giác commercial premium, đủ nghiêm túc cho khách B2B.

### Kết luận thị giác

**Approved for stakeholder preview.**

- Brand impression: premium, warm, professional.
- Portal/catalog impression: đã loại bỏ ở Category và Product Detail.
- Vietnamese typography: đẹp, dấu thoáng, không nặng.
- Motion: đủ tinh tế, không phô.
- Mức tự đánh giá thị giác: **8.8/10** cho Preview.

Điểm giữ lại có chủ đích: tại 1280 homepage H1 chia 3 dòng cân để không giảm font dưới chuẩn 48 px; không có dòng cuối một từ hoặc một ký tự.

## File code thay đổi

- `premium-ui-v9.css`
- `index.html`
- `category.html`
- `product-detail.html`
- `storefront.js`

Không thay đổi ProductDB, Portal, Lead Engine, Apps Script, Search Logic, Quote Wizard Logic, Category Mapping hoặc Product Mapping.

## Preview delivery

- Vercel: Ready — Preview — Latest.
- Cold-load typography đã được sửa trước khi chốt: không còn đổi font muộn làm hero đổi từ 3 dòng về 2 dòng.
- `main` vẫn giữ nguyên tại `3bc3de2b9ee9a83779affab2873b31c75aadcad0`.
- Dừng ở Preview; không merge và không deploy production.
