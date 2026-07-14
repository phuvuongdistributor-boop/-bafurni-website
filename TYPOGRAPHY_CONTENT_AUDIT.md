# BAFurniture V4.4 - Typography + Content Density Audit

Date: 2026-07-14

## Scope

Audited production storefront pages before V4.4 changes:

- `/`
- `/category.html`
- `/product-detail.html`
- `/san-pham/tq05-ghe-giam-doc-tq05`

Viewports:

- 390 x 844
- 1366 x 768

## Findings Before V4.4

1. Homepage hero H1 was long and heavy:
   - `Nội thất văn phòng & dự án, sẵn sàng theo yêu cầu`
   - Desktop measured about 54px and 3 lines.

2. Several homepage section headings were too sentence-like:
   - `Tư vấn theo bài toán sử dụng, không chỉ bán từng sản phẩm`
   - `Sẵn sàng cho đơn hàng văn phòng, trường học và công trình`
   - `Tập trung tại miền Bắc, linh hoạt theo dự án`

3. Top ticker text was readable but too dense for a premium storefront.

4. Category page carried longer supporting text than needed for quick product discovery.

5. Product detail page exposed internal-facing language in public UI:
   - `ProductDB`
   - `bind`

6. Product/card copy used `module` in visible labels. This was changed to customer-facing `cụm bàn` while URL slugs stayed unchanged.

7. Text hierarchy was inconsistent across hero, category, product listing, CTA, footer, and product detail.

## Baseline Technical Result

- HTTP 200: PASS
- Console errors: 0
- Request failed: 0
- Horizontal overflow: 0
- Broken images: 0

## Decision

Proceed with a typography/content density layer and targeted copy rewrite. Do not edit ProductDB, Portal, DNS, or routes.
