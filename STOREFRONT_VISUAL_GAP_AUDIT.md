# STOREFRONT VISUAL GAP AUDIT V4.2

Date: 2026-07-13

## Scope

Production repo: `phuvuongdistributor-boop/-bafurni-website`

Branch: `main`

Base commit audited: `b7f49c6f2028af800a0b3bf32854d4b48d5a96c8`

## Findings Before V4.2

- Homepage still felt closer to a light static catalog than a full commerce storefront.
- Header was single-commerce row plus nav, not a mature three-tier discovery header.
- Category imagery mixed generated/invalid WebP leftovers and SVG/icon-style assets.
- `index.html` had visible UTF-8 mojibake in public-facing Vietnamese text.
- Category page had only a narrow ghế văn phòng shell and did not adapt cleanly to category slugs.
- Product detail V4.1 binding was working and had to be preserved.

## Required Fix Direction

- Replace icon/SVG-first category presentation with real WebP product composite images.
- Keep ProductDB readonly and preserve product routes.
- Rebuild header for search-first product discovery.
- Make first viewport clearly look like a real office furniture storefront within 3 seconds.
- Keep deployment source at repository root for Vercel.

## Result

V4.2 implementation replaces the storefront surface with real product images, UTF-8 text, commerce header, stronger hero, ecommerce product cards, and category slug rendering.

