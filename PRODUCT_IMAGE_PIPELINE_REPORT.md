# Product Image Pipeline Report

Date: 2026-07-13

## Problem Fixed

Product detail pages used category composite images from `/images/categories/...` as product hero/gallery images. This made product URLs look generic and disconnected from ProductDB.

## New Product Image Order

1. Valid `Image_URL` from ProductDB public bundle.
2. Transparent missing-image placeholder with label `Hình ảnh đang cập nhật`.

No category composite image is used as product hero image.

## Normalized Fields

`product-detail-v41.js` normalizes each record into:

- `product.images.hero`
- `product.images.gallery[]`
- `product.images.thumbnail`
- `product.images.fallback`

## Gallery Rules

- If one ProductDB image exists, render one main image only.
- Do not create fake repeated thumbnails.
- Thumbnail row appears only when multiple real gallery images exist.
- If image is missing or fails, show a visible neutral placeholder instead of an empty box.

## Public Bundle Image Audit

- Product rows audited: 1,000.
- Rows with `Image_URL`: 1,000.
- Rows missing `Image_URL`: 0.
- QA product checks with real ProductDB image loaded: 22.
- Product image fallback count in QA: 0.
- Not-found placeholder count in QA: 1.

## TQ05 Image

- Code: TQ05
- Product: Ghế giám đốc TQ05
- Image source: `https://noithathoaphat.com/Uploads/images/ghe-van-phong/ghe-giam-doc/ghe-giam-doc-TQ05.jpg`
- HTTP: 200
- Content type: image/jpeg
- Size: 96,403 bytes

## Safety

- No fake product images created.
- No category composite image used as product hero.
- ProductDB data was not edited.
