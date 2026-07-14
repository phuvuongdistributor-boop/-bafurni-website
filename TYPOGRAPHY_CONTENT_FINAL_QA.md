# BAFurniture V4.4 - Typography + Content Final QA

Date: 2026-07-14

## Local QA

Tested routes:

- `/`
- `/category.html`
- `/product-detail.html`
- `/danh-muc/ghe-van-phong`
- `/san-pham/tq05-ghe-giam-doc-tq05`

Viewports:

- 360 x 800
- 390 x 844
- 412 x 915
- 768 x 1024
- 1366 x 768

Result:

- HTTP 200: PASS
- Console errors: 0
- Failed requests: 0
- Bad responses: 0
- Broken images: 0
- Horizontal overflow: 0
- Product code wrapping: 0
- Visible internal terms: 0
- Typography CSS loaded: PASS

## Interaction QA

- Mobile drawer open/close: PASS
- Escape closes drawer: PASS
- Reduced motion ticker: PASS

## Typography QA

- Homepage hero H1 is 3 lines on mobile/desktop and within V4.4 scale.
- Category page H1 is category name only.
- Product detail H1 is product name only.
- Product code is separate and does not wrap.
- Section headings are shorter and easier to scan.
- Card descriptions are concise and clamped.

## Production QA

Pending after Vercel deployment.

## Known Limitations

Some category/product images remain very light because they use existing product assets on white backgrounds. This sprint focused on typography and content density; no ProductDB or new image generation was performed.
