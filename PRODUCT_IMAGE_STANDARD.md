# BAFurniture Product Image Standard

Version: 0.1  
Date: 2026-07-07  
Scope: SPEC only. No ProductDB, Portal, UI, API, or render logic changes.

## Objective

Define the standard image set for every BA_Furniture product and category so Website, ProductDB, Portal, AI Advisor, SEO, Quotation, and Marketing can share one consistent visual system.

## Product Image Group Standard

| Order | Image Group ID | Display Name | Required | Usage |
|---:|---|---|---:|---|
| 01 | `hero` | Hero | Yes | Main product thumbnail/card/detail image. |
| 02 | `angle_45` | Góc 45° | Recommended | Shows depth and structure. |
| 03 | `front` | Chính diện | Recommended | Clean product identification. |
| 04 | `side` | Bên | Optional | Useful for chairs, desks, cabinets. |
| 05 | `back` | Sau | Optional | Useful for chairs, sofas, lockers, cabinets. |
| 06 | `material_detail` | Chi tiết vật liệu | Optional | Fabric, leather, wood grain, steel surface. |
| 07 | `structure_detail` | Chi tiết kết cấu | Optional | Legs, handles, hinges, locks, joints. |
| 08 | `dimension` | Kích thước | Recommended | Size/spec image or dimension drawing. |
| 09 | `real_photo` | Ảnh thực tế | Optional | Installation/customer/project photo. |
| 10 | `catalogue_pdf` | Catalogue / PDF | Optional | Spec sheet or catalogue image/PDF reference. |

## Minimum Image Requirements

| Product Type | Minimum Required |
|---|---|
| Product card | `hero` or placeholder |
| Product detail | `hero`, then any gallery images available |
| Quotation PDF | `hero` or placeholder |
| SEO category page | category representative image, not necessarily product image |
| Marketing/social | `hero` plus optional `real_photo` or context image |

## Display Order

1. `hero`
2. `angle_45`
3. `front`
4. `side`
5. `back`
6. `material_detail`
7. `structure_detail`
8. `dimension`
9. `real_photo`
10. `catalogue_pdf`

## Fallback Rules

### Product Card

1. Use `HeroImage`.
2. Fallback to first gallery image in order.
3. Fallback to `Image_URL`.
4. Fallback to category placeholder.
5. Fallback to generic product placeholder.

### Product Detail

1. Use ordered gallery by image group.
2. If no gallery, use `Image_URL`.
3. If image fails to load, keep product information visible and show error image placeholder.

### Quotation

1. Use compressed `Thumbnail`.
2. Fallback to `HeroImage`.
3. Fallback to category placeholder.
4. Do not block quote generation due to missing image.

## Recommended File Naming

Use stable product code and image group:

```text
{Code}_01_hero.jpg
{Code}_02_angle_45.jpg
{Code}_03_front.jpg
{Code}_04_side.jpg
{Code}_05_back.jpg
{Code}_06_material_detail.jpg
{Code}_07_structure_detail.jpg
{Code}_08_dimension.jpg
{Code}_09_real_photo.jpg
{Code}_10_catalogue.pdf
```

For local paths:

```text
assets/products/{Code}/{Code}_01_hero.jpg
assets/products/{Code}/{Code}_gallery_02_angle_45.jpg
```

## Category Image Standard

| Image Type | Purpose | Recommended Ratio | Required |
|---|---|---:|---:|
| `CategoryHeroImage` | Main category landing image | 16:9 | Yes for public category pages |
| `CategoryThumbnail` | Navigation/card thumbnail | 4:3 or 1:1 | Yes |
| `CategorySocialImage` | Social/OG/campaign creative | 1.91:1 or 1:1 | Optional |
| `CategoryIconPreview` | Light category visual with icon | 1:1 | Optional |

## SubCategory Image Standard

| Image Type | Purpose | Recommended Ratio | Required |
|---|---|---:|---:|
| `SubCategoryThumbnail` | Filter/card image | 4:3 | Recommended |
| `SubCategoryHeroImage` | SEO cluster page | 16:9 | Optional |
| `SubCategoryPlaceholder` | Missing product image fallback | 4:3 | Recommended |

## Placeholder Standards

| Placeholder ID | Usage | Visual Rule |
|---|---|---|
| `placeholder_product` | Generic missing product image | Light neutral surface, BA mark, label `Ảnh đang cập nhật`. |
| `placeholder_category` | Missing category image | Category icon centered on soft background. |
| `placeholder_error` | Image failed to load | Neutral error state, label `Không tải được ảnh`. |
| `placeholder_updating` | Known product, image pending | Label `Ảnh sản phẩm đang cập nhật`. |
| `placeholder_private` | Image intentionally hidden | Label `Ảnh theo yêu cầu`. |

## Image Quality Rules

1. Product image should not be stretched.
2. Use `object-fit: contain` for catalogue-like product cards when full product shape matters.
3. Use `object-fit: cover` for editorial/category imagery.
4. Avoid watermarked, blurry, cropped, or unrelated images for production.
5. White or very light neutral backgrounds are preferred for product cards.
6. Real project photos should be marked separately as `real_photo`.
7. Dimension images should not be the default hero image.

## ProductDB Image Field Mapping

| Proposed Field | Existing Source | Notes |
|---|---|---|
| `Thumbnail` | derived from `HeroImage` or `Image_URL` | Small optimized card image. |
| `HeroImage` | `Image_URL` or render asset hero | Main product image. |
| `Gallery` | render/gallery assets or image group records | Ordered array of images. |
| `ImageGroup` | new normalized group | `hero`, `angle_45`, etc. |
| `Image_Status` | existing | Source quality flag. |
| `Image_Source` | existing | Source attribution/internal provenance. |
| `Source_URL` | existing | Source reference, not customer-facing by default. |

## QA Rules

| Check | Pass Rule |
|---|---|
| Hero exists | Product has `HeroImage` or valid `Image_URL`, or placeholder assigned. |
| Image load | URL/path returns valid image. |
| Ratio | Product card image container preserves ratio without distortion. |
| Alt text | Product image has alt text derived from `ProductName` and brand. |
| Duplicate | Avoid duplicate gallery images in first 5 positions. |
| Wrong category | Image should visually match product type. |

## Do Not Do

- Do not overwrite ProductDB images without QA.
- Do not use source URLs as marketing images unless approved.
- Do not block product rendering because optional image groups are missing.
- Do not make `catalogue_pdf` the hero image.
