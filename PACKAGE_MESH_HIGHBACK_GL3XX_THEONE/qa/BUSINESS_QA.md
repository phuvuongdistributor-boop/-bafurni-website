# Business QA — V10.04

Trạng thái tổng: **PASS WITH DISCLOSED SOURCE LIMITATION**.

| # | Câu hỏi | Kết quả | Đánh giá |
|---:|---|---|---|
| 1 | Khách có hiểu đây là ghế lưới lưng cao/cao cấp không? | PASS | H1, kicker, breadcrumb và 22 card khóa rõ nhóm GL3xx. GL317 được ghi là biến thể bọc da, không giả là lưới. |
| 2 | Có phân biệt được các model không? | PASS | Card có Code, kích thước, vật liệu, đặc tính; bảng so sánh chọn 8 mốc khác biệt. |
| 3 | GL304 và GL345 khác nhau rõ không? | PASS | GL304 rộng 585 mm, khung/chân thép mạ; GL345 rộng 695 mm, có tựa đầu và tay chỉnh cao. Cả hai ảnh được ghi thiếu thay vì mượn ảnh hoặc public ảnh có watermark. |
| 4 | Sản phẩm có xuất hiện đủ sớm không? | PASS | Product Grid bắt đầu ở khoảng 1189 px trên desktop 1440 và khoảng 1699 px trên mobile 390, xấp xỉ trong hai màn hình đầu. |
| 5 | Landing có quá nhiều chữ không? | PASS | Main static 714 từ; bản copy package 725 từ, nằm trong target 550–750. Nội dung chia thành hero, grid, comparison, guide, FAQ và quote. |
| 6 | Có lý do để khách bấm Nhận báo giá không? | PASS | Giá được dán nhãn tham khảo; CTA cho phép gửi Code, số lượng, khu vực để xác nhận cấu hình và tình trạng nguồn. |
| 7 | Collage có đủ đẹp để đăng Facebook/Zalo ngay không? | PASS | 10 mã sạch, code rõ, khoảng trắng kiểm soát, tone V9.1, không giá và không logo nhà cung cấp. |
| 8 | Có ảnh nào nhìn mờ vì source resolution thấp không? | REVIEW | Nguồn sạch cao nhất chỉ 580×580. Website và creative giữ kích thước tự nhiên hoặc downscale; khi zoom lớn vẫn có thể thấy giới hạn chi tiết nguồn. |
| 9 | Có ảnh nào bị upscale giả không? | PASS | 16 ảnh sản phẩm được copy exact-byte; pipeline creative giới hạn scale tối đa 1.0. |
| 10 | Có claim nào vượt quá source không? | PASS | Không public tải trọng, tồn kho, thời gian giao, bảo hành đồng nhất hoặc tùy màu. Màu D16 chỉ gắn GL309. |

## Kết luận kinh doanh

Package giúp khách khoanh vùng bằng thông số và cơ cấu thay vì chỉ nhìn ảnh. Điểm hạn chế còn lại là chất lượng/độ phủ ảnh nguồn: 15 mã có ảnh sạch 580×580, 7 mã phải dùng placeholder. GL304 đã được chuyển sang placeholder sau khi QA thị giác phát hiện watermark chéo mờ mà phân loại tự động ban đầu bỏ sót. Đây là hạn chế nguồn đã được công khai, không phải lỗi mapping.
