# GL4xx The One — Multi-channel Distribution Report

Status: **EXTERNAL PREVIEW PASS — social chưa publish**

- Preview commit: `01c73fa73a4fe5bf7bf31c69b8caeea056ce22c8`.
- Vercel Preview: `https://bafurni-website-5oa2cqwrr-phuvuongdistributor-boops-projects.vercel.app`.
- Vercel: **Ready · Preview · Latest**, build 9 giây.

## Product

- Inventory: 24 Code exact.
- Official source: 23 trang manufacturer exact; GL404B dùng official archive/fallback đã ghi provenance.
- Images: 21 CLEAN_EXACT + 3 LOW_RES_EXACT_SOURCE_LIMIT; gallery 46.
- Watermark, QR, supplier logo, wrong Code, fake upscale, placeholder: 0.
- Source-limit 580×580: GL404B, GL424, GL429; giữ natural resolution.

## Website

- Landing: `/danh-muc/ghe-luoi-phong-hop`.
- Product routes: 24/24.
- Landing, product detail, comparison, Buying Guide, 11 FAQ, Quote Wizard và M1C product context: PASS local + external Preview.
- Framework UI không redesign; ProductDB, Portal, Lead Engine và Apps Script không thay đổi.

## Google SEO

- Keyword cluster: 30 dòng; đủ PRIMARY, SECONDARY, PRODUCT-CODE và LONG-TAIL BUYING INTENT.
- Page map: 25 URL = 1 landing + 24 product.
- 24 product page có HTML server-delivered riêng với unique title/meta/H1/self-canonical.
- Schema: landing CollectionPage + BreadcrumbList + FAQPage; product Product + BreadcrumbList.
- Sitemap/robots/internal links/orphan/indexability: PASS local; Preview HTTP 200 cho sitemap/robots, đúng 25 GL4xx URL.
- Automated SEO raw/static gate: 414/414 PASS trên local Preview.
- External raw HTML: 24/24 HTTP 200; 24 unique title/H1/canonical; 24 Product + Breadcrumb schema; landing có CollectionPage + BreadcrumbList + FAQPage.
- Google Product rich-result eligibility: deferred vì không có Offer/review/rating hiện hành đủ xác minh; không tạo claim giả.
- Search Console submission: chưa thực hiện.

## Facebook

- Selected 8: GL430, GL427, GL410, GL412, GL419, GL417, GL420, GL402TB.
- Media: 9 = cover 1200×1500 + 8 ảnh 1080×1080.
- Caption: plain text, mobile-first, CTA về landing.
- Tracking: `facebook / social / gl4xx_theone / group_post_01`.
- Status: READY FOR COMPOSER sau production; NOT PUBLISHED.

## Zalo Wall

- Selected 8 và ảnh: đồng nhất Facebook, 9/9 exact-copy approved render.
- Caption: riêng cho Zalo, ngắn hơn Facebook; hotline và landing rõ.
- Tracking: `zalo / social / gl4xx_theone / group_post_01`.
- Static Zalo QA: PASS; stale `wall_post_01` = 0.
- Status: READY FOR COMPOSER sau production; NOT PUBLISHED.

## Tracking

- Persistence: sessionStorage key `ba_utm_attribution_v1`.
- Fields: utm_source, utm_medium, utm_campaign, utm_content, utm_term.
- Facebook và Zalo: landing → GL401 → GL430 → Quote Step 3 giữ đúng UTM trên local + external Preview.
- M1C: landing category-only; product page giữ code/name/category; GL401 → GL430 cập nhật context cuối.
- Fresh direct tab: UTM rỗng trên local + external Preview.
- Lead submitted: 0.

## QA summary

- SEO raw/static: 414/414 PASS.
- Package static: 119/119 PASS.
- Browser: 191/191 PASS.
- Console/page/request/broken image errors: 0.
- Responsive overflow: 0.
- CSV artifact parse: PASS bằng `@oai/artifact-tool`.
- External Preview: Vercel Ready; 24/24 raw product HTML PASS; sitemap/robots HTTP 200; responsive overflow 0; console error 0; broken image 0.
- Visual: landing/product desktop-mobile PASS; Facebook/Zalo media 9/9 PASS.

## Gate

- READY WEBSITE: YES — external Vercel Preview PASS.
- READY GOOGLE SEO: YES — Preview artifact/runtime PASS; production URL/indexability verification pending.
- READY FACEBOOK: YES — assets/copy/tracking; composer chưa nạp.
- READY ZALO: YES — assets/copy/tracking; composer chưa nạp.

External Vercel Preview đã PASS. Bước tiếp theo theo release order là merge/deploy website production, rồi mới kiểm composer. Không publish social khi chưa có approval riêng.
