# Website integration V10.04

Framework được tái sử dụng từ V10.02, không redesign:

- CSS: `executive-chair-theone.css`, `executive-chair-product.css`
- Landing template: `mesh-highback-gl3xx.html`
- Landing renderer: `mesh-highback-gl3xx.js`
- Product template: `mesh-highback-product.html`
- Product renderer: `mesh-highback-product.js`
- Runtime dataset: `mesh-highback-gl3xx-data.js`
- Route landing: `/danh-muc/ghe-luoi-lung-cao`
- Route product: `/san-pham/ghe-luoi-lung-cao/:code`

Lead Engine và Apps Script endpoint được dùng nguyên trạng theo V7/V10.02. Quote Wizard chỉ nhận context `productCode`, `productName`, `categoryName`; package không thay đổi logic gửi lead.

Giá public lấy `SalePrice` của ProductDB snapshot và luôn gắn nhãn “Giá tham khảo ProductDB”. Dữ liệu tên, kích thước, vật liệu và đặc tính được enrich từ trang sản phẩm chính thức The One. ProductDB/Portal chỉ được đọc, không sửa.

Sáu mã không có ảnh sạch dùng `assets/v10-04/gl3xx-theone/products/placeholder.svg`. Product schema không khai báo `image` cho những mã này.
