# Website package

- Landing: `/danh-muc/ghe-giam-doc`
- Product detail: `/san-pham/ghe-giam-doc/{code}`
- Codes: TQ01, TQ05, TQ26, TQ27, TQ30, TQ34, TQ38, TQ39
- ProductDB: read-only; giá lấy đúng từ `productdb-data.part1.js`.
- Thông số, chất liệu, công năng, bảo hành: đối chiếu trang sản phẩm The One ngày 03/08/2026.
- Gallery: chỉ dùng ảnh đúng mã đã kiểm tra trực quan. Bảy mã có một ảnh xác minh; TQ34 có ba ảnh nguồn nhưng hai ảnh phụ có watermark `theone.vn`, vì vậy bị loại.
- Cấu hình public của Quote Wizard được nhúng trực tiếp trên hai trang package để tránh client blocker chặn file cấu hình; giá trị giữ đúng `lead-config.js`. `/quote-engine.js` rewrite tới `lead-engine.js`. Không đổi logic hay endpoint.
- Không sửa Portal, Lead Engine hoặc Apps Script.
