# PRODUCT ROUTING REPORT

Sprint: 17 - Product Routing and URL System  
Production repo: `phuvuongdistributor-boop/-bafurni-website`  
Branch: `main`  
Public domain: `https://bafurni.com`

## Summary

PASS. Product and category clean URLs are now available while legacy URLs remain functional.

## Files Changed

- `site-routing.js`
- `productdb-integration.js`
- `site-modules-loader.js`
- `vercel.json`
- `PRODUCT_ROUTING_REPORT.md`

## URL System

Category URL pattern:

- `/danh-muc/:category`
- `/danh-muc/:category/:subcategory`

Product URL pattern:

- `/san-pham/:product-slug`

Legacy URLs kept working:

- `/category.html`
- `/product-detail.html?code=TQ05`
- `/product-detail.html?slug=...&code=...`

## Canonical Rules

- Category canonical: `https://bafurni.com/danh-muc/ghe-van-phong`
- Product canonical: `https://bafurni.com/san-pham/{code-name-slug}`
- Legacy product URL renders the product but points canonical to the clean product URL.

## Vercel Routing

Added same-app rewrites for:

- `/san-pham/:slug` -> `/product-detail.html`
- `/danh-muc/:category` -> `/category.html`
- `/danh-muc/:category/:subcategory` -> `/category.html`

Because this is a static HTML site using relative assets, explicit asset/module rewrites were added for clean route prefixes:

- `/danh-muc/.../*.css|js`
- `/san-pham/.../*.css|js`
- nested `/assets/:path*`

A first regex rewrite attempt failed Vercel validation. It was replaced with explicit valid rewrites and the final deployment passed.

## Public QA

Clean category URL: `https://bafurni.com/danh-muc/ghe-van-phong`

- ProductDB marker: `ready:48`
- Category render marker: `true`
- H1: `Ghế văn phòng`
- Product cards: `12`
- First product detail href: `/san-pham/tq01-ghe-giam-doc-tq01`
- Canonical: `https://bafurni.com/danh-muc/ghe-van-phong`
- Broken images: `0`
- Console errors: `0`
- Horizontal overflow: `false`

Clean product URL: `https://bafurni.com/san-pham/tq05-ghe-giam-doc-tq05`

- ProductDB marker: `ready:48`
- Detail render marker: `TQ05`
- H1: `Ghế giám đốc TQ05`
- Price: `5.225.000đ`
- Gallery enhanced: `true`
- Canonical: `https://bafurni.com/san-pham/tq05-ghe-giam-doc-tq05`
- Category breadcrumb href: `/danh-muc/ghe-van-phong`
- Broken images: `0`
- Console errors: `0`
- Horizontal overflow: `false`

Legacy product URL: `https://bafurni.com/product-detail.html?code=TQ05`

- Rendered product: `TQ05`
- Canonical points to clean URL.
- Broken images: `0`
- Console errors: `0`

Mobile QA:

- Clean product route renders `Ghế giám đốc TQ05`.
- Canonical remains clean product URL.
- Broken images: `0`
- Horizontal overflow: `false`

## Deploy Status

Final routing deployment commit: `0884732cebbeb0bd5a4c12e5bc2187c4b1decbea`  
Vercel status: `success`

## Safety

- No ProductDB write.
- No Portal change.
- No force push.
- No redirect loop introduced.
- Old public URLs remain usable.
