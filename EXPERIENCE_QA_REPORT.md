# Experience QA Report

Date: 2026-07-11
Public domain: https://bafurni.com
Final code commit before reports: de2b07fd01034b50f0cb5c20a94407c25a23f7a2

## HTTP QA

- https://bafurni.com/ 200 text/html
- https://bafurni.com/danh-muc/ghe-van-phong 200 text/html
- https://bafurni.com/danh-muc/ban-van-phong 200 text/html
- https://bafurni.com/danh-muc/tu-hoc-tai-lieu 200 text/html
- https://bafurni.com/product-detail.html 200 text/html
- https://bafurni.com/sitemap.xml 200 application/xml
- https://bafurni.com/robots.txt 200 text/plain
- https://portal.bafurni.com/ 200 text/html

## DNS QA

- bafurni.com A via 1.1.1.1: 216.198.79.1
- bafurni.com A via 8.8.8.8: 216.198.79.1
- portal.bafurni.com CNAME: productdb-v2-portal.onrender.com

## Browser DOM QA

Homepage desktop:
- V3 ready: PASS
- Header/search/quote: PASS
- Category cards: 12
- Featured products: PASS
- Solutions: PASS
- Final quote CTA: PASS
- Broken images: 0
- Console errors: 0
- Overflow: 0

Category desktop:
- V3 ready: PASS
- Filter shell: PASS
- Product cards: 12
- Broken images: 0
- Console errors: 0
- Overflow: 0

Product desktop:
- V3 ready: PASS
- Quote CTA: PASS
- Product cards: 4
- Broken images: 0
- Console errors: 0
- Overflow: 0

Homepage mobile:
- V3 ready: PASS
- Sticky CTA: PASS
- Category cards: 12
- Broken images: 0
- Console errors: 0
- Overflow: 0

Category mobile with q=ghế lưới:
- V3 ready: PASS
- Filter shell: PASS
- Search query applied: ghế lưới
- Broken images: 0
- Console errors: 0
- Overflow: 0

## Screenshots

- C:\Users\Admin\AppData\Local\Temp\bafurni-v3-final-qa\home-desktop-cli.png
- C:\Users\Admin\AppData\Local\Temp\bafurni-v3-final-qa\category-desktop-cli.png
- C:\Users\Admin\AppData\Local\Temp\bafurni-v3-final-qa\product-desktop-cli.png
- C:\Users\Admin\AppData\Local\Temp\bafurni-v3-final-qa\category-mobile-cli.png
- C:\Users\Admin\AppData\Local\Temp\bafurni-v3-final-qa\home-mobile.png

QA status: PASS.
