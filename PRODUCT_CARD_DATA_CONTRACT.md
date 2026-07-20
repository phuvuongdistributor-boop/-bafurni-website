# BAFurniture Website V2
# Product Card Data Contract

Milestone 6 - Product UI  
Issue #3 - Product Card Data Mapping Contract  
Date: 2026-07-07

## Status

CONTRACT ONLY. ProductDB is not connected. No real product rendering is implemented.

## Sources Checked

- `data/schemas/product_schema.json`
- `exports/pdf_intake/schema_check.json`
- existing static Product Listing Shell in `website/index.html`

Current ProductDB schema marks these fields as required:

- `Code`
- `ProductName`
- `Category`

## Product Card View Model

Future Product Card rendering should normalize ProductDB rows into this UI model before rendering:

```js
{
  id: "CT2412V1",
  code: "CT2412V1",
  name: "Bàn họp gỗ cao cấp CT2412V1",
  category: "BÀN",
  subCategory: "MEETING_TABLE",
  image: {
    src: "https://...",
    alt: "Bàn họp gỗ cao cấp CT2412V1"
  },
  price: {
    amount: 6457000,
    label: "6.457.000đ",
    mode: "SALE"
  },
  detailUrl: "https://portal.bafurni.com",
  quoteUrl: "#contact",
  meta: {
    size: "W2400 x D1200 x H760 mm",
    material: "Gỗ CN Veneer cao cấp",
    status: "ACTIVE"
  }
}
```

## Required UI Fields

| UI Field | Required | Purpose |
|---|---:|---|
| `id` | Yes | Stable card key. Prefer ProductDB `Code`. |
| `name` | Yes | Main product title. |
| `code` | Yes | Visible product code / SKU. |
| `category` | Yes | Product grouping or badge. |
| `image.src` | No | Product image. Use placeholder if missing. |
| `image.alt` | Yes | Accessible image text. Derived from product name/code. |
| `price.label` | Yes | Price display or `Liên hệ báo giá`. |
| `detailUrl` | Yes | Card/detail CTA target. |
| `quoteUrl` | Yes | Quote CTA target. |

## Optional UI Fields

| UI Field | Source | Usage |
|---|---|---|
| `subCategory` | `SubCategory` | Optional tag/filter. |
| `meta.size` | `Size` or `Product_Size` | Optional product spec line. |
| `meta.material` | `Material` | Optional product spec line. |
| `meta.status` | `Status` | Optional filter/visibility guard. |
| `description` | `Description` | Optional card excerpt, not required for compact cards. |
| `sourceUrl` | `Source_URL` or `Search_URL` | Internal QA/source reference only, not customer CTA by default. |

## ProductDB Field Mapping

| Product Card Field | ProductDB Field | Required | Mapping Rule |
|---|---|---:|---|
| `id` | `Code` | Yes | Use exact `Code`. If missing, use `Product_UID`; otherwise reject row from render. |
| `code` | `Code` | Yes | Display as product code. |
| `name` | `ProductName` | Yes | Prefer `ProductName`; fallback to `ProductName_Clean`. |
| `category` | `Category` | Yes | Display raw category label unless UI taxonomy mapping is added later. |
| `subCategory` | `SubCategory` | No | Optional display/filter metadata. |
| `image.src` | `Image_URL` | No | Use if non-empty and valid URL/path. |
| `image.alt` | `ProductName` + `Code` | Yes | Generate as `{ProductName} BA_Furniture` or `{Code} BA_Furniture`. |
| `price.amount` | `SalePrice`, `BasePrice`, `CatalogPrice` | No | Prefer first valid numeric value in this order: `SalePrice` -> `BasePrice` -> `CatalogPrice`. |
| `price.mode` | `Price_Mode` | No | If present, preserve for price rules. |
| `price.label` | derived | Yes | Format numeric price in VND; otherwise `Liên hệ báo giá`. |
| `meta.size` | `Size`, `Product_Size` | No | Prefer `Size`; fallback to `Product_Size`. |
| `meta.material` | `Material` | No | Display only when non-empty. |
| `detailUrl` | derived from `Code` | Yes | Future internal product route. Until route is approved, fallback to `https://portal.bafurni.com`. |
| `quoteUrl` | site constant | Yes | Default `#contact`; optional future `tel:0929878666`. |

## Price Rules

1. Treat empty string, null, undefined, `0`, non-numeric, and negative values as missing.
2. Preferred numeric price source:
   - `SalePrice`
   - `BasePrice`
   - `CatalogPrice`
3. If `Price_Mode` explicitly means contact-only in future rules, display `Liên hệ báo giá` even if a numeric price exists.
4. Display format:
   - Numeric: Vietnamese currency format, e.g. `6.457.000đ`.
   - Missing/contact: `Liên hệ báo giá`.
5. Product Card must never display `0đ`.

## Image Rules

1. Use `Image_URL` when present.
2. Accept both absolute URLs and approved local asset paths.
3. If `Image_URL` is missing, empty, invalid, or fails load:
   - show product-card placeholder frame,
   - keep product title/code visible,
   - set `image.src` to null in normalized data.
4. Image display must use `object-fit: contain` or `object-fit: cover` depending on final card design, never stretch.
5. Alt text fallback order:
   - `{ProductName} BA_Furniture`
   - `{Code} BA_Furniture`
   - `Sản phẩm BA_Furniture`

## Name / Code Fallback Rules

| Missing Field | Fallback |
|---|---|
| `ProductName` | Use `ProductName_Clean`. |
| `ProductName` and `ProductName_Clean` | Display `Sản phẩm BA_Furniture`; mark row `needs_name_review`. |
| `Code` | Use `Product_UID` only as internal key; do not display as final product code unless approved. |
| `Code` and `Product_UID` | Exclude row from product card render. |

## Category / Metadata Fallback Rules

| Missing Field | Fallback |
|---|---|
| `Category` | Display `Nội thất văn phòng`; mark row `needs_category_review`. |
| `SubCategory` | Hide subcategory badge/filter. |
| `Size` | Hide size line. |
| `Material` | Hide material line. |
| `Description` | Hide excerpt. |

## Link Rules

### Detail Link

No product detail route is approved yet for `bafurni.com`.

Until approved:

- `detailUrl` fallback: `https://portal.bafurni.com`
- Do not use external `Source_URL` as the customer-facing product detail link by default.
- Keep `Source_URL` / `Search_URL` for QA/source traceability only.

Future internal detail route options to approve later:

- `/san-pham/{Code}`
- `/products/{Code}`
- Portal route if portal supports product detail deep links.

### Quote CTA

Default:

- `quoteUrl: "#contact"`
- label: `Nhận báo giá`

Optional future alternate:

- `tel:0929878666`

Do not change CTA behavior without a separate approved issue.

## Visibility Rules

Recommended row eligibility before rendering:

1. `Status` is empty or `ACTIVE`.
2. `Code` exists.
3. `ProductName` or `ProductName_Clean` exists.
4. Product is not explicitly marked hidden/blocked by a future QA or publish flag.

Rows failing eligibility should be excluded from customer-facing product card render and logged for QA.

## Example Normalization

Input ProductDB row:

```json
{
  "Code": "CT2412V1",
  "ProductName": "Bàn họp gỗ cao cấp CT2412V1",
  "Category": "BÀN",
  "SubCategory": "MEETING_TABLE",
  "Image_URL": "https://noithathoaphat.com/Uploads/images/BAN-HOP/ban-hop-cao-cap/ban-hop-go-ct2412v1.jpg",
  "SalePrice": 6457000,
  "BasePrice": 5870000,
  "CatalogPrice": 5870000,
  "Size": "W2400 x D1200 x H760 mm",
  "Material": "Gỗ CN Veneer cao cấp",
  "Status": "ACTIVE"
}
```

Normalized Product Card:

```json
{
  "id": "CT2412V1",
  "code": "CT2412V1",
  "name": "Bàn họp gỗ cao cấp CT2412V1",
  "category": "BÀN",
  "subCategory": "MEETING_TABLE",
  "image": {
    "src": "https://noithathoaphat.com/Uploads/images/BAN-HOP/ban-hop-cao-cap/ban-hop-go-ct2412v1.jpg",
    "alt": "Bàn họp gỗ cao cấp CT2412V1 BA_Furniture"
  },
  "price": {
    "amount": 6457000,
    "label": "6.457.000đ",
    "mode": "SALE"
  },
  "detailUrl": "https://portal.bafurni.com",
  "quoteUrl": "#contact",
  "meta": {
    "size": "W2400 x D1200 x H760 mm",
    "material": "Gỗ CN Veneer cao cấp",
    "status": "ACTIVE"
  }
}
```

## Implementation Guardrails

- Do not connect ProductDB in this issue.
- Do not render real product data in this issue.
- Do not modify ProductDB, API, database, or existing JavaScript render logic.
- Product Card UI should consume normalized view-model data, not raw ProductDB rows directly.
- Any future ProductDB connection must be done in a separate approved issue with QA and fallback logging.

## Static Check

Not required for this issue because only this Markdown contract file was added. No web UI, CSS, HTML, or JavaScript runtime file was modified.

## Confirmation

No real data was connected. No ProductDB data was modified. No render logic was changed.
