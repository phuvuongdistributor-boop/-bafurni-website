# BAFurniture V9 — Design System

## Định hướng

V9 không redesign homepage. Hệ thống mới giữ cấu trúc product-first hiện hữu và chuẩn hóa cảm giác thị giác giữa Homepage, Category và Product Detail theo bốn thuộc tính:

- Premium interior brand
- Chuyên nghiệp và có chiều sâu
- Hiện đại nhưng không lạnh
- Ưu tiên ảnh thật, dữ liệu thật và khả năng đọc tiếng Việt

Design system được triển khai bằng lớp `premium-ui-v9.css` tải sau các stylesheet hiện hữu. Cách này giữ nguyên ProductDB, Portal, Lead Engine, Search Logic, Quote Wizard Logic, Category Mapping và Product Mapping.

## Nguyên tắc thị giác

1. Typography tạo thương hiệu: Playfair Display cho heading, Inter cho nội dung và giao diện.
2. Hệ màu trung tính ấm: canvas ngà, giấy trắng, mực than, bronze tiết chế.
3. Khoảng trắng theo lưới 8pt, ưu tiên nhịp 32 / 40 / 48 px ở Product Detail.
4. Ảnh là trọng tâm; không blur, không phóng ảnh bằng transform và không đổi mapping.
5. Card chuyển động tối đa `translateY(-4px)` trong 200 ms.
6. Shadow nhẹ, không tạo cảm giác dashboard hoặc portal.
7. Button và input có radius 8 px; card 16 px; hero/gallery 24 px.
8. Heading dùng `text-wrap: balance` để tránh dòng cuối bị cô lập.

## Component foundation

| Component | Chuẩn V9 |
|---|---|
| Announcement | 32 px desktop, 28 px mobile |
| Header | 84 px desktop/tablet, 72 px mobile |
| Logo | 56 px desktop/tablet, 44 px mobile |
| Search | 48 px, radius 8 px, focus ring bronze 12% |
| Button | 50–52 px, padding ngang 24 px, radius 8 px |
| Product/Category card | radius 16 px, border trung tính, hover -4 px |
| Category hero | radius 24 px, ảnh thật và nền charcoal |
| Product gallery | radius 24 px, shadow ảnh, `object-fit: contain` |
| Input/Select | cao 50 px, radius 8 px |
| Footer | chung đúng shell homepage, border-top nhẹ |

## Animation

- Transition: 200 ms, easing `cubic-bezier(0.2, 0.7, 0.2, 1)`.
- Chỉ dùng translate nhỏ, đổi màu, border và shadow.
- Không bounce, rotate, zoom mạnh.
- Tắt transition khi người dùng chọn `prefers-reduced-motion: reduce`.

## Phạm vi khóa

Không thay đổi:

- ProductDB và file dữ liệu sản phẩm
- Portal
- Apps Script và endpoint production
- Lead Engine
- Logic tìm kiếm
- Logic Quote Wizard
- Category/Product mapping
- Ảnh sản phẩm và ảnh category
