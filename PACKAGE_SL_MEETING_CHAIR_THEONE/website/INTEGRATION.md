# Website Integration

Package runtime tái sử dụng design system và template V10.04 hiện hành; không sửa ProductDB, Portal hoặc Lead Engine.

- Landing: `/danh-muc/ghe-hop-chan-quy` → `sl-meeting-chair.html`
- Product: `/san-pham/ghe-hop-chan-quy/:code` → `sl-meeting-product.html?code=:code`
- Dataset: `sl-meeting-chair-data.js`
- Landing controller: `sl-meeting-chair.js`
- Product controller: `sl-meeting-product.js`
- Public image root: `/assets/product-packages/sl-chair-theone/`

Hai rewrite SL được đặt trước rewrite category/product tổng quát trong `vercel.json`. Sitemap có landing và đúng 22 URL product.

Quote context:

- Landing: `product_code=""`, `product_name=""`, `product_category="ghe-hop-chan-quy"`.
- Product: Code và tên thật của trang hiện tại; category giữ `ghe-hop-chan-quy`.
- Khi điều hướng từ landing có UTM sang product không có query string, M1A giữ `facebook / social / sl_chair_theone / group_post_01` trong cùng browser tab.
- Direct visit ở tab mới không nhận UTM của tab trước.

Không submit lead trong QA package.
