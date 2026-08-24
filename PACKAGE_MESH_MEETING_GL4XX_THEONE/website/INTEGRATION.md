# Website Integration

Package tái sử dụng nguyên design system và template SL production; không sửa framework CSS, ProductDB, Portal, Lead Engine hoặc Apps Script.

- Landing: `/danh-muc/ghe-luoi-phong-hop` → `gl4xx-meeting-chair.html`.
- Product: `/san-pham/ghe-luoi-phong-hop/:code` → `gl4xx-meeting-product.html?code=:code`.
- Dataset: `gl4xx-meeting-chair-data.js`.
- Landing controller: `gl4xx-meeting-chair.js`.
- Product controller: `gl4xx-meeting-product.js`.
- Public images: `/assets/product-packages/gl4xx-theone/`.

Hai rewrite GL4xx nằm trước rewrite category/product tổng quát. Sitemap có một landing và đúng 24 product URL.

## M1C context

- Landing Quote: `product_code=""`, `product_name=""`, `product_category="ghe-luoi-phong-hop"`.
- Product Quote: Code và tên thật của trang hiện tại; category giữ `ghe-luoi-phong-hop`.
- Khi chuyển GL401 → GL430, context cuối phải là GL430, không giữ Code cũ.
- Không submit lead trong QA preview.

## M1A attribution

Campaign preview dùng `facebook / social / gl4xx_theone / group_post_01`. Attribution giữ trong `sessionStorage` key `ba_utm_attribution_v1`; không sửa Lead Engine hoặc append query vào mọi internal link.
