# WEBSITE QA REPORT - W04

## Kết quả tổng

QA PASS.

Homepage V1 polished sẵn sàng CTO Review. Không deploy.

## Kiểm tra static

PASS:

- `index.html` parse được.
- Không phát hiện marker mojibake phổ biến.
- Inline JSON-LD hợp lệ.
- `schema.json` parse JSON hợp lệ.
- Local assets trong HTML đều tồn tại.
- `script.js` có xử lý menu mobile và active nav.
- `style.css` có responsive media queries.

## Kiểm tra CTA

PASS:

- Portal link đúng: `https://portal.bafurni.com`
- Số link Portal trong homepage: 17.
- Hotline đúng: `tel:0929878666`
- Số link hotline trong homepage: 5.
- Có CTA `Xem hơn 3.300 sản phẩm`.
- Có CTA `Nhận báo giá`.
- Có CTA `Gọi hotline`.
- Có CTA `Chat Zalo`.
- Zalo để placeholder rõ ràng: `NEED_ZALO_LINK`.

## Kiểm tra link nội bộ

PASS:

- Không có link anchor nội bộ chết.
- Các section chính tồn tại: `home`, `products`, `solutions`, `promise`, `service-area`, `contact`, `main`.

## Kiểm tra SEO

PASS:

- Title đúng yêu cầu.
- Meta description có nhóm sản phẩm và địa phương trọng điểm.
- Canonical: `https://bafurni.com/`
- Open Graph cơ bản.
- Organization Schema có hotline, URL, logo, area served.
- `robots.txt` trả HTTP 200 khi test local.
- `sitemap.xml` trả HTTP 200 khi test local.

## Kiểm tra HTTP local

PASS:

- `http://127.0.0.1:4173/` trả HTTP 200.
- `http://127.0.0.1:4173/robots.txt` trả HTTP 200.
- `http://127.0.0.1:4173/sitemap.xml` trả HTTP 200.

## Kiểm tra responsive bằng browser

Desktop viewport 1280x720:

- PASS: không tràn ngang.
- PASS: title đúng.
- PASS: H1 đúng.
- PASS: 7 ảnh render đầy đủ.
- PASS: ảnh sản phẩm có kích thước tự nhiên 1200x1200.

Mobile viewport 390x844:

- PASS: không tràn ngang.
- PASS: menu chính ẩn mặc định.
- PASS: nút menu mobile hiển thị.
- PASS: 4 CTA hero full width.
- PASS: 7 ảnh render đầy đủ, không ảnh lỗi.

## Rủi ro còn lại

- Chat Zalo đang là placeholder `NEED_ZALO_LINK`; cần link chính thức trước khi publish.
- OG image vẫn là SVG placeholder; nên thay bằng PNG/JPG chính thức.
- Chưa có địa chỉ, email, MST trong footer.
- Ảnh đang là ảnh sản phẩm từ AssetDB, chưa phải ảnh showroom/dự án thực tế.

## Kết luận QA

PASS. Website có thể chuyển sang CTO Review và deploy sau khi được duyệt.
