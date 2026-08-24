# GL4xx Google SEO QA

Status: **PASS — Preview-local**
Scope: landing `/danh-muc/ghe-luoi-phong-hop` và 24 product route GL4xx.
Google Search Console submission: **NOT PERFORMED**.
Production deployment: **NOT PERFORMED**.

## 1. Keyword intent

- Keyword map: `GL4XX_SEO_KEYWORD_MAP.csv`
- Tổng: 30 dòng.
- PRIMARY CATEGORY INTENT: `ghế lưới phòng họp`.
- SECONDARY INTENT: ghế họp The One, ghế hội thảo có bàn, ghế hội thảo gấp gọn.
- PRODUCT-CODE INTENT: 24/24 Code có một target URL riêng.
- LONG-TAIL BUYING INTENT: cách chọn và so sánh GL4xx.
- Location page: 0.
- Keyword stuffing: 0.

## 2. Page map

- Page map: `GL4XX_SEO_PAGE_MAP.csv`
- Tổng URL: 25 = 1 landing + 24 product.
- Title unique: 25/25.
- Meta description unique: 25/25.
- H1 duy nhất trên mỗi trang: 25/25.
- Canonical self-reference: 25/25.
- Indexable: 25/25.

## 3. Server-delivered product SEO

Trước correction, 24 URL product cùng rewrite vào một HTML generic và chỉ đổi title/meta/H1/canonical/schema sau khi JavaScript chạy.

Sau correction:

- 24 HTML riêng nằm trong `gl4xx-product-pages/`.
- Rewrite public giữ nguyên cấu trúc URL:
  `/san-pham/ghe-luoi-phong-hop/:code`
  → `/gl4xx-product-pages/:code.html?code=:code`.
- Raw HTTP HTML đã chứa sẵn title, meta, H1, canonical, Product schema và Breadcrumb schema đúng Code.
- JavaScript chỉ hydrate hành vi/gallery/Quote Wizard và cập nhật đúng node schema hiện có; không tạo Product schema trùng.
- Generic fallback `gl4xx-meeting-product.html` đặt `noindex, follow`.
- URL `.html` không được đưa vào sitemap hoặc internal link; mỗi file canonical về public URL.

## 4. Structured data

Landing:

- CollectionPage: 1.
- BreadcrumbList: 1.
- FAQPage: 1, tương ứng 11 FAQ hiển thị thật.

Mỗi product:

- Product: đúng 1.
- SKU: exact Code.
- Brand: The One.
- BreadcrumbList: đúng 1.
- Image: đúng gallery đã approved.
- Offer, price, priceCurrency, availability, rating, aggregateRating, review: **không khai báo** vì chưa có contract đủ để xác nhận.

Forbidden/fake structured-data claim: 0.

Google Product rich-result eligibility: **DEFERRED**. Theo contract hiện có, giá trên website chỉ là giá tham khảo ProductDB và không có Offer hiện hành, review hoặc aggregate rating đã xác minh. Vì vậy JSON-LD Product được dùng để mô tả đúng identity/SKU/brand/material/image, nhưng không được ghi Offer/rating giả chỉ để vượt rich-result gate. Tham chiếu: `https://developers.google.com/search/docs/appearance/structured-data/product-snippet`.

## 5. Internal linking

- Landing → 24/24 product: PASS trong raw HTML.
- Product → landing: 24/24.
- Product → related products: 24/24, ít nhất một link thật mỗi trang.
- Landing → nhóm liên quan: Ghế văn phòng, Ghế họp chân quỳ, Ghế lưới lưng cao.
- Orphan GL4xx URL trong sitemap: 0.
- External official-source link giữ `nofollow noopener`.

## 6. Crawlability

- `robots.txt`: `Allow: /` và khai báo `https://bafurni.com/sitemap.xml`.
- Sitemap GL4xx: đúng 25 URL, duplicate = 0.
- Product URL trong sitemap dùng Code chữ thường và canonical tương ứng.
- Raw local Preview HTTP: landing + 24/24 product trả 200.
- Noindex trên 25 URL hợp lệ: 0.
- Robots blocking: 0.

## 7. Automated QA

- SEO raw HTTP/static validation: **414/414 PASS**.
- Browser regression: **191/191 PASS**.
- Package static validation: **119/119 PASS**.
- Console error: 0.
- Page/runtime error: 0.
- Failed request: 0.
- Broken image: 0.
- Quote Wizard/M1A/M1C regression: 0.

Artifacts:

- `PACKAGE_MESH_MEETING_GL4XX_THEONE/qa/SEO_VALIDATION.json`
- `PACKAGE_MESH_MEETING_GL4XX_THEONE/qa/BROWSER_QA.json`
- `PACKAGE_MESH_MEETING_GL4XX_THEONE/qa/STATIC_VALIDATION.json`

## 8. Preview/production gate

Local Preview: **PASS**.
External Vercel Preview: chưa deploy trong subtask này theo stop rule. Khi owner deploy Preview, cần lặp raw HTTP audit trên public Preview URL để xác nhận Vercel thay `:code` vào đúng static file trên Linux và đủ 24 route vẫn trả 200.

Google SEO readiness: **YES cho Preview artifact; production verification còn chờ deploy được duyệt**.

Known limitation:

- Không khai báo Offer/rating/review chỉ để lấy rich result.
- Không tạo location page.
- Không submit sitemap hoặc yêu cầu index trước production.
