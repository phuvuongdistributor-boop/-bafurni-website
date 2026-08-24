# Schema plan — Ghế họp chân quỳ SL The One

## Landing

Nhúng một JSON-LD `@graph` gồm:

1. `CollectionPage` với canonical `/danh-muc/ghe-hop-chan-quy`.
2. `BreadcrumbList`: Trang chủ → Ghế văn phòng → Ghế họp chân quỳ.
3. `ItemList` đúng 22 phần tử theo thứ tự inventory; mỗi phần tử trỏ tới route riêng.
4. `FAQPage` dùng nguyên 11 cặp hỏi đáp trong `faq/faq.json`.

Không khai báo `AggregateRating`, `Review`, `Offer`, `availability`, tải trọng, bảo hành hoặc giao hàng khi package không có nguồn xác nhận phù hợp.

## Product routes

Mỗi route sinh một node `Product` từ record đã xác minh:

- `name`: tên public của đúng Code;
- `sku`: Code;
- `brand`: `The One`;
- `category`: `Ghế họp chân quỳ`;
- `description`, `material`, `size`: dữ liệu có provenance;
- `image`: chỉ asset sạch đúng Code đã approved;
- `url` và `@id`: canonical duy nhất của route.

Không sinh `offers` chỉ từ giá tham khảo ProductDB. Nếu về sau public `Offer`, phải có giá, tiền tệ, URL và trạng thái bán được xác nhận tại thời điểm phát hành.

## Validation

- JSON hợp lệ, không duplicate `@id` hoặc canonical.
- `numberOfItems=22` và thứ tự ItemList khớp inventory.
- FAQ trên schema khớp nội dung hiển thị.
- Product schema của từng route giữ đúng Code, tên, ảnh và URL.
