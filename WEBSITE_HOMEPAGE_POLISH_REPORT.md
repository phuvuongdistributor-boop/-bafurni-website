# WEBSITE HOMEPAGE POLISH REPORT - W04

## Kết luận

Homepage V1 đã được polish để sẵn sàng CTO Review trước khi đưa `bafurni.com` online.

Không deploy. Không sửa ProductDB. Không sửa Portal. Không tạo Website Factory, landing hàng loạt, product page hoặc blog engine.

## File đã cập nhật

- `index.html`
- `style.css`
- `schema.json`
- `WEBSITE_QA_REPORT.md`
- `WEBSITE_HOMEPAGE_POLISH_REPORT.md`

## Asset đã dùng

Đã ưu tiên asset hiện có từ `data/master/MASTER_MARKETING_ASSETDB.xlsx` và copy ảnh đại diện từ `render_assets` sang `website/assets/products/` để website deploy độc lập:

- `assets/products/meeting-table.jpg`
- `assets/products/steel-cabinet.jpg`
- `assets/products/locker.jpg`
- `assets/products/office-desk.jpg`
- `assets/products/school-desk.jpg`
- `assets/products/project-furniture.jpg`

Vẫn còn asset placeholder:

- `assets/og-ba-furniture.svg` dùng cho Open Graph tạm thời.
- `assets/favicon.svg` dùng làm favicon.

NEED_IMAGE:

- Nên bổ sung ảnh thật showroom, nhà xưởng, lắp đặt hoặc dự án thực tế để tăng độ tin cậy.
- Nên thay OG SVG bằng PNG/JPG thương hiệu chính thức trước khi public mạnh trên social.

## Giao diện đã polish

- Header rõ ràng: logo, menu, Portal CTA, hotline.
- Hero mạnh hơn: headline B2B, 4 CTA, trust metrics, ảnh sản phẩm thật.
- CTA nổi bật:
  - Xem hơn 3.300 sản phẩm
  - Nhận báo giá
  - Gọi hotline
  - Chat Zalo placeholder
- Danh mục sản phẩm có ảnh đại diện và mô tả ngắn.
- Giải pháp theo khách hàng: doanh nghiệp, trường học, nhà máy, chủ đầu tư/nhà thầu.
- Brand Promise trình bày riêng.
- Sản xuất theo yêu cầu có quy trình ngắn.
- Khu vực phục vụ local SEO: Nam Định, Hà Nam, Ninh Bình, Hưng Yên, Thái Bình.
- Liên hệ và footer đầy đủ.

## CTA đã gắn

- `Xem hơn 3.300 sản phẩm` -> `https://portal.bafurni.com`
- `Gọi hotline` -> `tel:0929878666`
- `Nhận báo giá` -> `#contact`
- `Chat Zalo` -> placeholder `#` với marker `NEED_ZALO_LINK`
- `Vào Portal sản phẩm` -> `https://portal.bafurni.com`

## SEO cơ bản

- Title: `BA_Furniture | Nội thất văn phòng, trường học và dự án`
- Meta description đã tối ưu local SEO.
- Open Graph cơ bản.
- Organization Schema inline và `schema.json`.
- `robots.txt` giữ nguyên.
- `sitemap.xml` giữ nguyên.

## Deploy readiness

Website static trong `/website` có thể deploy bằng các hướng dẫn hiện có trong `README_DEPLOY.md`.

Chưa deploy vì task yêu cầu STOP và chờ CTO Review.

## Việc cần CTO Review

- Duyệt nội dung homepage.
- Cung cấp link Zalo chính thức để thay `NEED_ZALO_LINK`.
- Cung cấp thông tin pháp lý nếu muốn thêm vào footer: địa chỉ, email, MST.
- Duyệt ảnh hiện dùng từ AssetDB hoặc cung cấp ảnh thương hiệu/dự án thật thay thế.
- Sau khi duyệt, deploy theo `README_DEPLOY.md` và trỏ DNS `bafurni.com`.
