# STOREFRONT IMAGE PERFORMANCE REPORT V4.2

Date: 2026-07-13

## Asset Format

- Category images are WebP.
- Main composites: 480x320.
- Sub thumbnails: 260x186.
- Hero preload points to `/images/categories/main/ban-van-phong.webp`.

## Asset Weight

- `/images/categories/main/`: 15 WebP files, 49,928 bytes total.
- `/images/categories/sub/`: 40 WebP files, 44,954 bytes total.

## Loading Strategy

- Hero image uses preload plus `fetchpriority="high"`.
- Category storefront images are allowed to load immediately because they are small and define the visual identity of the page.
- Lower supporting images use lazy loading where appropriate.

## Vercel Headers

`vercel.json` sets:

- WebP content type: `image/webp`
- WebP cache: `public, max-age=31536000, immutable`
- Sitemap XML content type: `application/xml; charset=utf-8`
- Robots content type: `text/plain; charset=utf-8`

## QA

Local browser QA after full-page scroll:

- Broken images: 0
- Missing `alt` attributes: 0
- Horizontal overflow: 0
