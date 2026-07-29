# BAFurniture V9 — Typography System

## Font pairing

- Heading: **Playfair Display 700**
- Body/UI: **Inter 400 / 500 / 600 / 700**
- Fallback: Georgia cho heading; system UI cho body

Playfair Display được chọn vì dấu tiếng Việt rõ, tương phản nét có chiều sâu và phù hợp ngành nội thất cao cấp. Inter giữ phần dữ liệu, form và navigation gọn, dễ đọc.

## Scale

| Role | Desktop | Tablet | Mobile | Line-height |
|---|---:|---:|---:|---:|
| H1 | 48 px | 42 px | 32 px | 1.15 |
| H2 | 36 px | 34 px | 30 px | 1.20–1.22 |
| H3 section | 28 px | 28 px | 26 px | 1.30 |
| Body chính | 18 px | 18 px | 17 px | 1.65–1.70 |
| Caption | 14 px | 14 px | 13 px | 1.60–1.65 |
| Product code | 13 px | 13 px | 13 px | 1.40 |

Product/card title dùng 16–21 px theo mật độ lưới và không đại diện cho H3 section.

## Trước / Sau

| Surface | Before | After |
|---|---|---|
| Homepage desktop | Segoe UI, H1 52 px, cao 3 dòng ở 1440 | Playfair Display, H1 48 px, 2 dòng cân |
| Homepage mobile | Segoe UI, H1 34 px | Playfair Display, H1 32 px, 3 dòng đều |
| Category desktop | Arial, H1 74 px | Playfair Display, H1 48 px |
| Category mobile | Arial, H1 42 px | Playfair Display, H1 32 px |
| Product desktop | Arial, H1 46 px; first screen bị logo chiếm | Playfair Display, H1 48 px; title một dòng |
| Product mobile | Arial, H1 31.232 px | Playfair Display, H1 32 px; không orphan |

## Quy tắc xuống dòng

- Heading dùng `text-wrap: balance`.
- Không dùng `word-break: break-all`.
- Product title giữ `word-break: normal` và `overflow-wrap: normal`.
- Kết quả đo TQ05: một dòng tại 1440, 768, 390 và 360.
- Homepage H1: 2 dòng tại 1440/768, 3 dòng cân tại 1280/390/360.
