# TQ34 Image Integrity Report

Audit time: 2026-08-08T15:20:05+07:00
Package: `PACKAGE_EXECUTIVE_CHAIR_THEONE`
Result: **PASS — CLEAN, EXACT TQ34 PRODUCT IMAGE**

## Current production candidate image

- Website path: `/assets/v10-01/executive-chair-theone/products/TQ34.jpg`
- Local dimension: `700 × 700 px`
- File size: `129070 bytes`
- SHA-256: `B3F548BAC8E24E0BD63FE82F9E5A1809B8E31790008FDCF88FBB376845850AB9`
- Website gallery: exactly one approved image, using the same path.
- Marketing product card: `images/product-cards/TQ34.png`, `1200 × 1200 px`.

## Source attribution

- Official product page: `https://theone.vn/san-pham/ghe-tq34`
- Clean primary source image recorded in source audit: `https://theone.vn/wp-content/uploads/2024/03/theonevn-TQ34.jpg`
- Recorded official source dimension: `580 × 580 px`.
- The website asset is a local derivative of the clean primary TQ34 photograph. Its larger file dimensions do not imply additional product detail.

## Integrity checks

| Check | Result | Evidence |
|---|---|---|
| Correct product TQ34 | PASS | Shape, black upholstery, wood arm/leg treatment and visible footrest mechanism match the official TQ34 primary image and published product description. |
| Category fallback | NO | Path resolves to the code-specific TQ34 asset, not `images/categories/*`. |
| Image from another code | NO | TQ34 image path is unique and is referenced consistently by landing data, product detail data and package data. |
| Watermark | NONE | Full-frame visual inspection found no watermark. |
| Supplier logo | NONE | Full-frame visual inspection found no supplier logo. |
| Crop or blur used to hide watermark | NO | Website image preserves the complete chair on a clean white background; marketing card uses contain placement without cropping. |
| AI-generated substitute | NO | The primary product image is the approved derivative of the official The One source. |

## Rejected variants

The following two auxiliary official-page images were rejected because they contain a visible `theone.vn` watermark and are not shipped in the gallery:

- `https://theone.vn/wp-content/uploads/2024/03/theonevn-TQ34_1.jpg`
- `https://theone.vn/wp-content/uploads/2024/03/theonevn-TQ34_2.jpg`

Final status: **PASS**. No category image, similar product, altered watermark image or fabricated replacement is used for TQ34.
