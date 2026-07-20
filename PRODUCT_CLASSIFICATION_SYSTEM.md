# BAFurniture Product Classification System

Version: 0.1  
Date: 2026-07-07  
Scope: SPEC only. No ProductDB, Portal, UI, API, or render logic changes.

## Objective

This document defines the shared product classification foundation for BA_Furniture across:

- Website
- ProductDB
- Portal
- AI Advisor
- SEO
- Quotation
- Marketing

The system separates customer-facing taxonomy from raw ProductDB source fields. ProductDB may contain legacy values such as `GHẾ`, `BÀN`, `TỦ`, `TRUONG_HOC`, `CONG_TRINH`, `GIA_DUNG`, and mixed subcategory names. The proposed classification creates a stable normalized layer on top of those fields.

## Classification Principles

1. Customer-first naming: labels must be understandable to buyers, not only internal operators.
2. B2B-ready: categories should support offices, schools, factories, contractors, and projects.
3. Stable codes: category IDs should be uppercase ASCII for data systems.
4. Vietnamese display names: website, quotation, catalogue, and social content should use Vietnamese labels.
5. Search-friendly: categories should map cleanly to SEO clusters and product filters.
6. Backward-compatible: existing ProductDB fields remain valid source fields.
7. Multi-channel ready: category icon, image, and color tokens should work on web, portal, mobile, PDF, catalogue, and social.

## Level 1 Category Standard

| MainCategory ID | Display Name | Icon ID | Short Description | Representative Image Brief | Recognition Color |
|---|---|---|---|---|---|
| `OFFICE_CHAIR` | Ghế văn phòng | `chair-office` | Ghế làm việc, ghế họp, ghế lãnh đạo, ghế đào tạo. | Ghế văn phòng trong không gian làm việc sáng, nền trung tính. | `primary` |
| `OFFICE_DESK` | Bàn văn phòng | `desk` | Bàn nhân viên, bàn quản lý, bàn cụm, bàn máy tính. | Cụm bàn văn phòng hiện đại, mặt gỗ sáng. | `primary` |
| `MEETING_TABLE` | Bàn họp | `meeting-table` | Bàn họp nhỏ, lớn, module, bàn hội trường. | Phòng họp doanh nghiệp với bàn trung tâm. | `secondary` |
| `CABINET_STORAGE` | Tủ & Hộc tài liệu | `cabinet` | Tủ hồ sơ, tủ tài liệu, hộc di động, tủ gỗ, tủ sắt. | Tủ hồ sơ gọn trong văn phòng. | `primary-dark` |
| `LOCKER_STEEL` | Tủ sắt & Locker | `locker` | Tủ locker, tủ sắt, tủ công cụ, tủ kho, tủ chuyên dụng. | Dãy tủ locker/tủ sắt trong nhà máy hoặc văn phòng. | `secondary` |
| `SOFA_WAITING` | Sofa & Ghế chờ | `sofa` | Sofa văn phòng, ghế chờ, ghế tiếp khách, bàn sofa. | Khu tiếp khách văn phòng cao cấp. | `accent` |
| `SCHOOL_FURNITURE` | Nội thất trường học | `graduation-cap` | Bàn ghế học sinh, giáo viên, thư viện, phòng chức năng. | Lớp học sáng, bàn ghế ngay ngắn. | `primary` |
| `SHELVING_RACK` | Kệ & Giá kho | `shelves` | Kệ sắt, giá kho, kệ lưu trữ, kệ công nghiệp. | Kệ kho gọn, có sản phẩm hoặc hồ sơ. | `secondary` |
| `PUBLIC_PROJECT` | Nội thất công cộng & công trình | `building-project` | Hội trường, bục phát biểu, công trình, nhà thầu, dự án. | Không gian hội trường/công trình hoàn thiện. | `primary-dark` |
| `MEDICAL_FURNITURE` | Nội thất y tế | `medical-cross` | Giường y tế, bàn khám, tủ thuốc, xe đẩy y tế. | Phòng y tế sạch, sáng, thiết bị cơ bản. | `success` |
| `HOME_UTILITY` | Nội thất gia đình & gia dụng | `home` | Sản phẩm gia đình/gia dụng nằm trong nguồn hàng nhưng không phải trọng tâm B2B. | Góc nội thất gia đình gọn, trung tính. | `muted` |
| `PARTITION_ACCESSORY` | Vách & Phụ kiện | `layout-panel` | Vách văn phòng, phụ kiện, linh kiện, hạng mục bổ trợ. | Vách văn phòng hoặc chi tiết phụ kiện trên nền sáng. | `border` |

## Recommended Usage by System

| System | Primary Use |
|---|---|
| Website | Category preview, product card filters, SEO landing architecture. |
| ProductDB | Normalized fields: `MainCategory`, `SubCategoryNormalized`, `CategoryIcon`, `CategoryImage`. |
| Portal | Navigation, filters, product detail breadcrumbs, advisor facets. |
| AI Advisor | Ask clarifying questions by category, room type, material, size, budget. |
| SEO | Cluster pages and keyword maps by normalized category. |
| Quotation | Group quote line items and subtotal sections. |
| Marketing | Campaign group selection, content templates, creative direction. |

## Governance Rules

1. Do not rename `MainCategory ID` without a migration map.
2. Display name can be adjusted for UX/SEO, but ID must remain stable.
3. New Level 1 category requires:
   - business reason,
   - minimum product coverage or strategic reason,
   - icon,
   - representative image brief,
   - mapping rules from ProductDB source fields.
4. Level 2 category can be added more freely, but must map to exactly one Level 1 category.
5. A product can have one primary `MainCategory` and optional secondary tags.

## Current ProductDB Alignment

Observed existing source fields include:

- `Category`: `GHẾ`, `BÀN`, `TỦ`, `TRUONG_HOC`, `GIA_DINH`, `Sofa văn phòng`, `CONG_TRINH`, `GIA_DUNG`, `GIƯỜNG`, `KỆ`, `HỘC`, `Y_TE`, `VÁCH`
- `SubCategory`: examples include `OFFICE_DESK`, `OFFICE_CHAIR`, `MEETING_TABLE`, `STEEL_CABINET`, `LOCKER`, `NOI_THAT_TRUONG_HOC`, `SAN_PHAM_CONG_TRINH`, `STEEL_SHELVING`, `OFFICE_PARTITION`
- Product schema required fields: `Code`, `ProductName`, `Category`

This spec does not modify those fields. It defines the target normalized layer for future mapping.
