# RELEASE REPORT - Sprint 10 Deploy & Release Verification

Date: 2026-07-07  
Website: https://bafurni.com  
Category page: https://bafurni.com/category.html  
Portal: https://portal.bafurni.com

## 1. Local Version

Local source checked in `/website`.

Homepage local includes:

- Category Hero linking to `category.html`.
- Section `Danh mục sản phẩm BAFurniture`.
- 6 nhóm lớn: Ghế văn phòng, Bàn văn phòng, Tủ & Hộc tài liệu, Sofa & Ghế lounge, Nội thất trường học, Kệ & Giá kho.
- Icon nhóm lớn.
- Ảnh/placeholder nhóm.
- 8 nhóm nhỏ Ghế văn phòng.
- SVG icon nhóm nhỏ.
- Link sang `category.html`.

Category page local includes:

- Hero.
- Breadcrumb.
- Visual nhóm nhỏ.
- Filter shell.
- Product grid shell 8 card mẫu.
- Empty state.
- CTA.
- Responsive desktop/mobile đã có screenshot local trong `website/reports`.

## 2. Public Version

Public production was updated and verified at:

- `https://bafurni.com/?release=8a47a69`
- `https://bafurni.com/category.html?release=8a47a69`

Final production commit:

- `8a47a69de90b4574297404ac469a8c6ccdbd59fd`

Release commits:

- `45fc11a8770d9f33f0510d2f309b57b653fcdc89` - Release Category Module UI.
- `8a47a69de90b4574297404ac469a8c6ccdbd59fd` - Add release image assets.

## 3. Repo

- Repository: `phuvuongdistributor-boop/-bafurni-website`
- Branch: `main`
- Public domain: `https://bafurni.com`
- Deploy root: repository root
- Hosting configuration: static Vercel config present at repo root via `vercel.json`
- Build command: none required for static site
- Output directory: repository root

Note: the deployed repository layout is root-based, while the local working source is under `/website`. The release was adapted to the deployed repo root without touching ProductDB, Portal, or Product Detail.

## 4. Deployment Status

Status: PASS

- GitHub `main` is ahead of previous public source by 2 commits.
- Public `script.js` serves the Category Module UI.
- Public `category.html` serves the Category Page shell.
- Public assets now return 200.
- SSL public access verified through `https://bafurni.com`.

## 5. Files Released

- `script.js` - modified to inject the Category Module on homepage and link Ghế văn phòng to `category.html`.
- `category.html` - added static Category Page shell.
- `assets/favicon.svg` - added.
- `assets/og-ba-furniture.svg` - added.
- `assets/hero-workspace.svg` - added.
- `assets/products/meeting-table.jpg` - added.
- `assets/products/steel-cabinet.jpg` - added.
- `assets/products/locker.jpg` - added.
- `assets/products/office-desk.jpg` - added.
- `assets/products/school-desk.jpg` - added.
- `assets/products/project-furniture.jpg` - added.

## 6. Public QA

Homepage desktop/mobile:

- Category Hero: PASS
- `Danh mục sản phẩm BAFurniture`: PASS
- 6 nhóm lớn: PASS
- Icon nhóm lớn: PASS
- Visual nhóm lớn: PASS, 6 media blocks total
- Ảnh/placeholder nhóm: PASS, 3 image assets and 3 polished placeholders
- 8 nhóm nhỏ Ghế văn phòng: PASS
- SVG icon nhóm nhỏ: PASS
- Link sang `category.html`: PASS
- Broken image: PASS, none found
- Console error: PASS, none found
- Horizontal overflow: PASS, none found

Category page desktop/mobile:

- Hero: PASS
- Breadcrumb: PASS
- Visual nhóm nhỏ: PASS, 6 items
- Filter shell: PASS
- Product grid shell: PASS, 8 cards
- Empty state: PASS
- CTA: PASS
- Broken image: PASS, none found
- Console error: PASS, none found
- Horizontal overflow: PASS, none found

No ProductDB connection was added. No Product Detail work was performed. Portal was not modified.

## 7. Screenshots

Desktop:

- Homepage: `website/reports/release-public-homepage-desktop.png`
- Category page: `website/reports/release-public-category-desktop.png`

Mobile:

- Homepage: `website/reports/release-public-homepage-mobile.png`
- Category page: `website/reports/release-public-category-mobile.png`

## 8. Final Result

Release status: PASS

The Category Module UI is live on `bafurni.com` and verified against the Sprint 10 checklist.
