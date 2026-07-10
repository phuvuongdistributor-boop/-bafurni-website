# SEARCH FILTER MODULE REPORT

## Sprint
Sprint 14 - Search and Filter UI Module

## Scope
Hoàn thiện Search + Filter UI/UX trên `category.html` để chuẩn bị cho dữ liệu thật, không nối ProductDB và không thêm package.

## Files Changed
- `search-filter.css`
- `search-filter.js`
- `site-modules-loader.js`
- `SEARCH_FILTER_MODULE_REPORT.md`

## Implementation
- Thêm Search input.
- Thêm Category filter.
- Thêm Subcategory filter.
- Thêm Material filter.
- Thêm Size filter shell.
- Thêm Price/contact-price state.
- Thêm Sort UI.
- Thêm Clear filter.
- Thêm Empty results state.
- Thêm mobile filter drawer/panel.
- Thêm accessible labels cho field mới.
- Thêm focus-visible cho field/button.
- Filter hoạt động trên 8 product card mẫu tĩnh hiện có.

## Behavior
- Search `training` lọc còn 1/8 card mẫu.
- Search không khớp hiển thị empty state.
- Clear filter khôi phục 8/8 card.
- Mobile drawer mở bằng button có `aria-expanded`.
- Không kết nối dữ liệu thật.

## Deployment
- Production repo: `phuvuongdistributor-boop/-bafurni-website`
- Branch: `main`
- Public QA URL: `https://bafurni.com/category.html`
- Implementation commit: `6e6b84c25be0c7e4f8c584a771a557f9ca5b4afb`
- Vercel deployment: PASS

## Public QA Result
Desktop:
- Category HTTP 200: PASS
- Search input present: PASS
- Category filter present: PASS
- Subcategory filter present: PASS
- Material filter present: PASS
- Size filter present: PASS
- Price/contact state present: PASS
- Sort UI present: PASS
- Clear filter present: PASS
- Product card count: PASS, 8
- Search behavior: PASS, `training` -> 1/8 visible
- Empty state: PASS, unmatched query -> 0/8 visible + empty state visible
- Clear filter: PASS, reset -> 8/8 visible
- Broken image: PASS, 0
- Horizontal overflow: PASS
- Console errors/warnings: PASS, 0

Mobile:
- Filter shell present: PASS
- Drawer opens: PASS
- `aria-expanded=true`: PASS
- Broken image: PASS, 0
- Horizontal overflow: PASS
- Console errors/warnings: PASS, 0

## Accessibility
- New input/select controls use explicit labels.
- Mobile drawer button uses `aria-expanded` and `aria-controls`.
- Escape closes drawer.
- Focus-visible styles added.
- Buttons have visible text or aria-label.

## Safety
- ProductDB chưa được nối.
- Portal không bị sửa.
- Không thêm package.
- Category Module không bị thay đổi dữ liệu nguồn.

## Known Limitations
- Filter đang chạy trên shell demo/card mẫu.
- Khi Sprint ProductDB Integration hoàn tất, module có thể đọc normalized product view model thay vì card demo.
