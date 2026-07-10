# PRODUCT DATA ADAPTER REPORT

## Sprint
Sprint 15 - Product Data Adapter

## Scope
Tạo lớp adapter an toàn giữa dữ liệu sản phẩm thô và UI website. Sprint này không nối ProductDB thật, không render dữ liệu thật, không sửa ProductDB và không sửa Portal.

## Contract Sources Read
Production repo chưa có 2 tài liệu contract/mapping, nên đã đọc từ workspace baseline:
- `website/PRODUCT_CARD_DATA_CONTRACT.md`
- `website/PRODUCT_DATA_MAPPING.md`

Adapter tuân thủ mapping field:
- `Code`
- `ProductName`
- `ProductName_Clean`
- `Category`
- `SubCategory`
- `Image_URL`
- `SalePrice`
- `BasePrice`
- `CatalogPrice`
- `Size`
- `Material`
- `Description`
- `Detail URL`
- `Quote CTA`

## Files Changed
- `product-data-adapter.js`
- `product-data-adapter-qa.js`
- `site-modules-loader.js`
- `category-data.js`
- `PRODUCT_DATA_ADAPTER_REPORT.md`

## Implementation
`product-data-adapter.js` exposes:
- `window.BAProductDataAdapter.normalizeProductRow(row, options)`
- `window.BAProductDataAdapter.normalizeProducts(rows, options)`
- `window.BAProductDataAdapter.validateProductViewModel(product)`
- `window.BAProductDataAdapter.formatVnd(amount)`
- `window.BAProductDataAdapter.slugify(value)`

Normalized product view model includes:
- `id`
- `code`
- `name`
- `category`
- `mainCategory`
- `subCategory`
- `description`
- `image`
- `gallery`
- `price`
- `detailUrl`
- `quoteUrl`
- `source`
- `meta`
- `flags`

## Fallback Rules Implemented
- Missing `Code`: use `Product_UID` as internal fallback and flag `missing_code`.
- Missing `Code` and `Product_UID`: reject row.
- Missing `ProductName`: use `ProductName_Clean`, then `Sản phẩm BA_Furniture` and flag `missing_name`.
- Missing/invalid image: use placeholder/null image source and flag `missing_image`.
- Missing price: display `Liên hệ báo giá` and flag `missing_price`.
- Missing size/material/subcategory/category: hide or infer where possible and flag relevant issue.
- Numeric price priority: `SalePrice` -> `BasePrice` -> `CatalogPrice`.
- Never display `0đ`.

## Deployment
- Production repo: `phuvuongdistributor-boop/-bafurni-website`
- Branch: `main`
- Implementation commit: `0393674487da70f508d7bd4026074ce4579b5ed1`
- Vercel deployment: PASS

## Public QA
QA URL:
- `https://bafurni.com/product-detail.html`

Result:
- Adapter marker: PASS, `ready`
- Normalized output count: PASS, 2
- Rejected count: PASS, 0 for QA rows
- Validation: PASS, `true`
- Gallery groups: PASS, 10
- Price formatting: PASS, `6.457.000đ`
- Console errors/warnings: PASS, 0
- Horizontal overflow: PASS

## Safety
- No ProductDB runtime connection.
- No write-back to ProductDB.
- No Portal changes.
- No source data mutation.
- Adapter is read-only and only normalizes rows passed into it.

## Known Limitations
- ProductDB source bundle is not connected in this Sprint.
- Adapter category inference is rule-based until full ProductDB mapping QA in Sprint 16.
- Detail URL currently points to `product-detail.html?slug=...&code=...`; Sprint 17 will harden routing and canonical strategy.
