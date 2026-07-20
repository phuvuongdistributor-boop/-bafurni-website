# BAFurniture Product Data Mapping

Version: 0.1  
Date: 2026-07-07  
Scope: SPEC only. No ProductDB, Portal, UI, API, or render logic changes.

## Objective

Define how current ProductDB fields should map into the normalized product classification system used by Website, Portal, AI Advisor, SEO, Quotation, and Marketing.

## Existing ProductDB Fields

Confirmed by `data/schemas/product_schema.json` and schema sample files:

| Field | Existing | Notes |
|---|---:|---|
| `Code` | Yes | Required in current schema. |
| `Product_UID` | Yes | Optional stable ID. |
| `ProductName` | Yes | Required in current schema. |
| `ProductName_Clean` | Yes | Optional cleaned name. |
| `Category` | Yes | Required in current schema. |
| `SubCategory` | Yes | Optional but widely used. |
| `Variant` | Yes | Optional. |
| `Size` | Yes | Optional. |
| `Material` | Yes | Optional. |
| `Description` | Yes | Optional. |
| `BasePrice` | Yes | Optional number. |
| `SalePrice` | Yes | Optional number. |
| `CatalogPrice` | Yes | Optional number. |
| `Price_Mode` | Yes | Optional. |
| `Status` | Yes | Optional. |
| `Image_URL` | Yes | Optional. |
| `Image_Source` | Yes | Optional. |
| `Image_Status` | Yes | Optional. |
| `Source_Group` | Yes | Optional. |
| `Source_URL` | Yes | Optional. |
| `QA_Flag` | Yes | Optional. |

## Proposed Normalized Fields

These fields are proposed for a future normalized layer. This issue does not add them to ProductDB.

| Proposed Field | Type | Required | Purpose |
|---|---|---:|---|
| `MainCategory` | string | Yes | Stable Level 1 category ID. |
| `MainCategoryName` | string | Yes | Customer-facing Level 1 label. |
| `SubCategoryNormalized` | string | Yes | Stable Level 2 category ID. |
| `SubCategoryName` | string | Yes | Customer-facing Level 2 label. |
| `CategoryIcon` | string | Yes | Icon ID from icon system. |
| `CategoryColor` | string | No | Recognition color token. |
| `CategoryImage` | string | No | Representative category image. |
| `Thumbnail` | string | No | Optimized product card image. |
| `HeroImage` | string | No | Main product image. |
| `Gallery` | array | No | Ordered image group list. |
| `ImageGroup` | string | No | Per-image group: hero, angle_45, front, etc. |
| `DisplayPrice` | string | Yes | Formatted customer price or contact text. |
| `PriceSource` | string | No | SalePrice, BasePrice, CatalogPrice, or CONTACT. |
| `DetailURL` | string | Yes | Customer detail CTA target. |
| `QuoteURL` | string | Yes | Quote CTA target. |
| `SEOCategorySlug` | string | No | SEO route slug. |
| `MarketingSegment` | string | No | Campaign grouping. |
| `AdvisorTags` | array | No | AI Advisor search/filter tags. |

## Field Mapping

| Normalized Field | Source Field(s) | Mapping Rule |
|---|---|---|
| `MainCategory` | `Category`, `SubCategory`, `Source_Group`, name keywords | Use mapping table below. |
| `MainCategoryName` | derived | Display label from `PRODUCT_CLASSIFICATION_SYSTEM.md`. |
| `SubCategoryNormalized` | `SubCategory`, `Category`, name keywords | Use category tree mapping. |
| `SubCategoryName` | derived | Display label from `PRODUCT_CATEGORY_TREE.md`. |
| `CategoryIcon` | derived | Map from Main/Sub category icon tables. |
| `CategoryColor` | derived | Map from MainCategory recognition color. |
| `CategoryImage` | derived | Category representative image asset. |
| `Thumbnail` | `Image_URL`, gallery/render assets | Prefer optimized thumbnail; fallback to `Image_URL`. |
| `HeroImage` | `Image_URL`, render hero asset | Prefer render hero; fallback to `Image_URL`. |
| `Gallery` | render/gallery assets, image group assets | Ordered by `PRODUCT_IMAGE_STANDARD.md`. |
| `ImageGroup` | derived per asset | `hero`, `angle_45`, `front`, etc. |
| `DisplayPrice` | `SalePrice`, `BasePrice`, `CatalogPrice`, `Price_Mode` | Format best valid price, otherwise `Liên hệ báo giá`. |
| `PriceSource` | price field used | `SalePrice`, `BasePrice`, `CatalogPrice`, or `CONTACT`. |
| `DetailURL` | `Code`, portal route | Until detail route is approved, fallback to `https://portal.bafurni.com`. |
| `QuoteURL` | site constant | Default `#contact` or future quote route. |
| `Material` | `Material` | Display/spec field. |
| `Size` | `Size` | Display/spec field. |
| `Status` | `Status` | Visibility and QA rule. |

## MainCategory Mapping Table

| Source Condition | MainCategory |
|---|---|
| `Category=GHẾ` and not sofa/school | `OFFICE_CHAIR` |
| `SubCategory=OFFICE_CHAIR` | `OFFICE_CHAIR` |
| `SubCategory` in `GHE_HOI_TRUONG`, `GHE_GAP`, `GHE_HOC_SINH` | Depends on context: public/school/chair tree |
| `Category=BÀN`, `SubCategory=OFFICE_DESK` | `OFFICE_DESK` |
| `SubCategory=COMPUTER_DESK` | `OFFICE_DESK` |
| `SubCategory=MEETING_TABLE` or `Source_Group=BAN_HOP` | `MEETING_TABLE` |
| `Category=TỦ`, `SubCategory` in `WOOD_CABINET`, `WOOD_PEDESTAL`, `STEEL_PEDESTAL` | `CABINET_STORAGE` |
| `SubCategory` in `STEEL_CABINET`, `LOCKER`, `STEEL_LOCKER`, `STEEL_WARDROBE`, `STEEL_TOOL_CABINET` | `LOCKER_STEEL` |
| `Category=HỘC` | `CABINET_STORAGE` |
| `Category=KỆ`, `SubCategory=STEEL_SHELVING` | `SHELVING_RACK` |
| `Category=TRUONG_HOC`, `SubCategory=NOI_THAT_TRUONG_HOC` | `SCHOOL_FURNITURE` |
| `Category=CONG_TRINH`, `SubCategory=SAN_PHAM_CONG_TRINH` | `PUBLIC_PROJECT` |
| `Category=Y_TE`, y tế subcategories | `MEDICAL_FURNITURE` |
| `Category=VÁCH`, `SubCategory=OFFICE_PARTITION` | `PARTITION_ACCESSORY` |
| `Category=Sofa văn phòng`, sofa subcategories | `SOFA_WAITING` |
| `Category` in `GIA_DINH`, `GIA_DUNG`, `GIƯỜNG` | `HOME_UTILITY` |

## Price Mapping Rules

1. Valid numeric source priority:
   - `SalePrice`
   - `BasePrice`
   - `CatalogPrice`
2. If all prices are missing/empty/invalid, set:
   - `DisplayPrice = "Liên hệ báo giá"`
   - `PriceSource = "CONTACT"`
3. Never display `0đ`.
4. If `Price_Mode` later defines a contact-only mode, it overrides numeric display.

## Image Mapping Rules

1. `HeroImage` priority:
   - render/gallery hero asset,
   - `Image_URL`,
   - category placeholder,
   - generic product placeholder.
2. `Thumbnail` priority:
   - optimized thumbnail,
   - `HeroImage`,
   - `Image_URL`,
   - placeholder.
3. `Gallery` follows `PRODUCT_IMAGE_STANDARD.md` image group order.

## AI Advisor Mapping

| Advisor Need | Source |
|---|---|
| Product type | `MainCategory`, `SubCategoryNormalized` |
| Use case | category tree + `Description` + marketing segment |
| Budget | `DisplayPrice`, `PriceSource` |
| Size fit | `Size` |
| Material preference | `Material` |
| Need quote | `QuoteURL`, hotline |
| Suggest alternatives | same `MainCategory` and related `SubCategoryNormalized` |

## SEO Mapping

| SEO Field | Source |
|---|---|
| Category page title | `MainCategoryName` |
| Subcategory page title | `SubCategoryName` |
| URL slug | `SEOCategorySlug` |
| Product title | `ProductName` |
| Product schema SKU | `Code` |
| Product image | `HeroImage` |
| Product offer | `DisplayPrice` when numeric; otherwise contact offer |

## Quotation Mapping

| Quotation Field | Source |
|---|---|
| SKU | `Code` |
| Product name | `ProductName` |
| Group heading | `MainCategoryName` |
| Subgroup | `SubCategoryName` |
| Unit price | `SalePrice` or selected price source |
| Display price | `DisplayPrice` |
| Size | `Size` |
| Material | `Material` |
| Product image | `Thumbnail` or `HeroImage` |

## Marketing Mapping

| Marketing Need | Source |
|---|---|
| Campaign cluster | `MainCategory` |
| Ad set / content topic | `SubCategoryNormalized` |
| Creative image | `HeroImage`, `CategoryImage`, `real_photo` |
| Landing page route | `SEOCategorySlug` |
| Hashtags | `MainCategoryName`, `SubCategoryName`, location/customer type |
| Proof points | `Material`, `Size`, `Description`, project category |

## Fallback and QA Flags

| Missing Data | Fallback | Suggested QA Flag |
|---|---|---|
| `Code` | Exclude from customer render | `missing_code` |
| `ProductName` | `ProductName_Clean`, then `Sản phẩm BA_Furniture` | `missing_name` |
| `Category` | `UNMAPPED` or inferred by rules | `missing_category` |
| `SubCategory` | Infer from name/source group or hide | `missing_subcategory` |
| `Image_URL` | Placeholder | `missing_image` |
| price fields | `Liên hệ báo giá` | `missing_price` |
| `Size` | Hide size line | `missing_size` |
| `Material` | Hide material line | `missing_material` |

## Migration Plan

1. Keep existing ProductDB unchanged.
2. Create a read-only mapping table from raw category/subcategory to normalized taxonomy.
3. Test mapping on ProductDB export and produce unmapped report.
4. Approve taxonomy changes.
5. Add normalized fields only in a separate ProductDB migration issue.
6. Connect Website/Portal rendering only after mapping QA passes.

## Stop Rule Confirmation

This file is a mapping spec only. It does not modify ProductDB or connect any system.
