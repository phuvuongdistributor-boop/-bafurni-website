# Product Performance Report

Date: 2026-07-13

## Performance Changes

- Product page now loads `productdb-data.js` and `productdb-data.part1.js` first.
- If the current product is found early, the page renders immediately and loads remaining chunks in the background for related products/routes.
- TQ05 is found in `part1`, so it renders before loading the full 1,000 row bundle.
- Main image gets `width`, `height`, `fetchpriority="high"`, `decoding="async"` and stable aspect ratio.
- Related product images are lazy-loaded.
- Main product frame has fixed aspect ratio to reduce CLS.

## Request / Timing QA

TQ05 desktop after recovery:

- HTTP: 200
- Rows needed at first render: 30
- Chunks needed at first render: `productdb-data.js`, `productdb-data.part1.js`
- Main image: ProductDB URL loaded
- Main image natural width: 600
- Broken images: 0
- Console errors: 0
- Horizontal overflow: 0
- Request count observed: 23
- First contentful paint observed: ~2,048 ms

TQ05 mobile after recovery:

- HTTP: 200
- Main image: ProductDB URL loaded
- Broken images: 0
- Console errors: 0
- Horizontal overflow: 0
- Request count observed: 23
- First contentful paint observed: ~444 ms

## Main Image Bytes

For 21 real product URLs tested:

- Average main image bytes by HTTP content-length: 90,220 bytes
- Minimum: 25,049 bytes
- Maximum: 202,187 bytes
- TQ05: 96,403 bytes

## Before / After

Before:

- Product page rendered static BA-GVP-01 for every route.
- Main gallery used category images.
- Product-specific image was never requested.

After:

- TQ05 and tested product URLs request ProductDB `Image_URL`.
- Product main image appears as real product photo.
- Unknown route shows not-found state rather than loading a generic sample.
