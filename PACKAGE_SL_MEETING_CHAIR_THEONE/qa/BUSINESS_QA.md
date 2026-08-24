# Business QA — SL / The One

| Câu hỏi | Kết quả | Nhận xét |
|---|---|---|
| Khách hiểu đây là ghế chân quỳ? | PASS | H1, hero, breadcrumb và toàn bộ Code đều nói rõ nhóm ghế họp chân quỳ. |
| Có phân biệt được model? | PASS | Card hiển thị Code, ảnh, kích thước, vật liệu, cấu tạo và giá tham khảo. |
| Sản phẩm xuất hiện đủ sớm? | PASS | Product Grid ngay sau hero; bắt đầu ở y=843 desktop và khoảng 1,4 màn hình mobile 390. |
| Landing có quá nhiều chữ? | PASS | Runtime 730 từ, trong target 550–750; nội dung dài nằm sau Product Grid. |
| Tám mẫu marketing đại diện tốt? | PASS | Có vải/da-PVC, sơn/mạ, tay nhựa/gỗ/nhôm và tỷ lệ khác nhau. |
| Collage là quảng cáo thật hay contact sheet? | PASS | Hai hero lớn, sáu mẫu hỗ trợ; headline/CTA rõ, Code không lấn át ảnh. |
| Mobile có đẹp? | PASS | Hero riêng, product một cột, CTA cố định; không phải desktop thu nhỏ. |
| CTA có rõ? | PASS | CTA xem 22 mẫu và Quote ba bước xuất hiện trong hero, card, cuối trang và sticky. |
| Có claim vượt source? | PASS | Không claim tồn kho, tải trọng, giao ngay, bảo hành chung hoặc giảm giá. |
| Có ảnh nhìn mềm? | REVIEW | 22 ảnh nguồn sạch chỉ có 580×580; card dùng contain và không phóng to giả. |
| Có upscale giả? | PASS | Rendered product pixels không vượt natural size trong collage; website dùng nguồn 580×580 nguyên bản. |

## Đánh giá cảm nhận

Landing thể hiện rõ một gói kinh doanh theo nhóm: khách thấy sản phẩm thật ngay sau hero, có thể phân biệt nhanh bằng Code và thông số, rồi mới đọc so sánh/hướng dẫn. Collage có hierarchy đủ rõ để dùng như social creative, không mang cảm giác bảng QA.

Điểm cần nói thẳng: độ phân giải public của toàn bộ nhóm chỉ 580×580. Những bản corporate lớn hơn đã bị loại vì có logo/watermark nhúng; chọn đúng sản phẩm được ưu tiên hơn độ phân giải. Đây là giới hạn nguồn, không phải lỗi nén hoặc upscale của website.
