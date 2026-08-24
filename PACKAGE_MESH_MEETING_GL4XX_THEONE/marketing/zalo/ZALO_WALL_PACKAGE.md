# GL4xx The One — Zalo Wall Package

Status: `PREPARED_NOT_PUBLISHED`

## Mục tiêu

Một bài Zalo Wall ngắn cho nhóm ghế lưới phòng họp GL4xx The One. Nội dung được viết riêng cho nhịp đọc Zalo và không sao chép nguyên caption Facebook.

## Caption

Dùng nguyên văn file `ZALO_WALL_CAPTION.txt`. Không thêm giá, tồn kho, giảm giá, thời gian giao, hashtag hoặc claim chưa được nguồn xác nhận.

Tracked URL:

`https://bafurni.com/danh-muc/ghe-luoi-phong-hop?utm_source=zalo&utm_medium=social&utm_campaign=gl4xx_theone&utm_content=group_post_01`

UTM contract:

- `utm_source=zalo`
- `utm_medium=social`
- `utm_campaign=gl4xx_theone`
- `utm_content=group_post_01`

## Media và thứ tự nạp

1. `media/01-zalo-cover-1200x1500.png`
2. `media/02-zalo-GL430-1080x1080.png`
3. `media/03-zalo-GL427-1080x1080.png`
4. `media/04-zalo-GL410-1080x1080.png`
5. `media/05-zalo-GL412-1080x1080.png`
6. `media/06-zalo-GL419-1080x1080.png`
7. `media/07-zalo-GL417-1080x1080.png`
8. `media/08-zalo-GL420-1080x1080.png`
9. `media/09-zalo-GL402TB-1080x1080.png`

Cover 4:5 giữ hierarchy đã được visual QA. Tám ảnh sau là square swipe, Code lớn và sản phẩm là trọng tâm.

## Image policy

- Chín file Zalo là bản sao byte-for-byte của social render đã duyệt; không render lại và không upscale.
- Bảy sản phẩm dùng raster nguồn 2000×1446, GL402TB dùng raster nguồn 1000×723. Render sản phẩm tối đa 760×610, vì vậy không có fake upscale.
- Watermark, QR, supplier/reseller logo, wrong product và crop mất sản phẩm đều bằng 0.
- Không dùng filter, auto-enhance hoặc crop trong composer.

## Composer gate

Chỉ nạp vào Zalo khi được yêu cầu ở sprint publish. Phải kiểm tra trước khi đăng:

- tài khoản/Page đúng;
- đủ 9 ảnh và đúng thứ tự;
- cover vẫn là ảnh đầu;
- caption đúng plain text;
- tracked URL không bị rút gọn hoặc mất UTM;
- preview mobile không crop sản phẩm hoặc làm Code khó đọc.

Nếu composer không nhận đủ 9 ảnh, tự đổi thứ tự hoặc crop xấu, dừng và báo; không tự bỏ ảnh hoặc publish phiên bản khác.

## Stop rule

Không browser, không đăng, không schedule, không Ads, không gửi lead test, không sửa website/runtime.
