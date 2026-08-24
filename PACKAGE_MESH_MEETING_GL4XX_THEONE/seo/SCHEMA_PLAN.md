# Schema plan

- Landing: `CollectionPage`, `BreadcrumbList`, `FAQPage`, runtime `ItemList` 24 sản phẩm.
- Product: canonical duy nhất theo Code, `Product` với `sku`, brand, image gallery, material, size và category.
- Không phát sinh `Offer`, `availability`, review hoặc rating vì package không có dữ liệu tồn kho/đánh giá được xác minh.
- FAQ visible và JSON-LD phải giữ parity 11/11.
