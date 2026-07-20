# Emergency Public Deploy Mismatch Report

Date: 2026-07-09

## Result

Status: PASS

The public deployment mismatch has been fixed.

- `https://bafurni.com/` returns HTTP 200.
- `https://bafurni.com/category.html` returns HTTP 200.
- Public `index.html` contains `Danh mục sản phẩm BAFurniture`.
- Category UI renders on desktop and mobile.
- No ProductDB, Portal, or Product Detail source was modified.

## Root Cause

The mismatch had two causes:

1. Sprint 11 source existed only in the local `/website` directory. The real deploy repository still contained the older root-level `index.html`, `style.css`, `script.js`, and `category.html`.
2. Vercel `cleanUrls: true` produced an apex URL normalization loop in the active deployment. `https://bafurni.com/` returned HTTP 308 with `Location: https://bafurni.com/`.

The previous report verified a partial JavaScript-injected Category Module, but it did not verify that the latest Sprint 11 HTML/CSS/data source had reached the real deploy repository.

## Actual Production Source

- Repository: `phuvuongdistributor-boop/-bafurni-website`
- Deploy branch: `main`
- Hosting: Vercel
- Vercel project: `bafurni-website`
- Root directory: repository root
- Build command: none
- Output directory: repository root (`.`)
- Custom domain: `bafurni.com`

## Version Before Fix

- Public/deploy branch commit: `8a47a69de90b4574297404ac469a8c6ccdbd59fd`
- Commit message: `Add release image assets`
- Public `index.html`: old homepage HTML without the Sprint 11 Category Module markup
- Public apex result before fix: HTTP 308 self-redirect

## Release Applied

Files synchronized from local `/website` to the deploy repository root:

- `index.html`
- `style.css`
- `script.js`
- `category.html`
- `category-data.js`
- `vercel.json`

Release commits:

- `958f676a773c9fe3b1afb2f1bebb2992b74cba01` - homepage HTML
- `0fb7dd12cb0505b8966b774a91f2a690749ace60` - shared styles
- `84f79fa3f67031de1fe08c70bbb6b94b6e26575c` - Category renderer
- `6a9e7247019eb948719558f121988720fc6f6d7f` - category page
- `b6a11d070f852119c629103a4c3e0bbc6055f119` - Vercel redirect fix
- `04056133dd38efd1a0db77084c7ba700fe5d87f0` - shared Category data

Final production commit:

- `04056133dd38efd1a0db77084c7ba700fe5d87f0`

Vercel deployment:

- Deployment ID: `5374444402`
- Status: success
- Production deployment URL: `https://bafurni-website-iyy8joh2p-phuvuongdistributor-boops-projects.vercel.app`

## Public QA

Homepage:

- Required heading: PASS
- Main category cards: 12
- Office chair subcategory cards: 12
- Required first 8 chair groups: present
- Category page links: present
- Broken images: 0
- Console errors/warnings: 0
- Horizontal overflow: none

Category page:

- Breadcrumb: PASS
- Category hero: PASS
- Subcategory visual cards: 12
- Filter shell: PASS
- Product grid shell: 8 cards
- Empty state: PASS
- Related categories: 6
- CTA: PASS
- Broken images: 0
- Console errors/warnings: 0
- Horizontal overflow: none

Public file checks:

- `/`: 200, `text/html; charset=utf-8`
- `/index.html`: 200
- `/category.html`: 200
- `/category-data.js`: 200
- `/script.js`: 200
- `/style.css`: 200

## Screenshots

- `reports/emergency-public-homepage-desktop.png`
- `reports/emergency-public-homepage-mobile.png`
- `reports/emergency-public-category-desktop.png`
- `reports/emergency-public-category-mobile.png`

## Stop Confirmation

The public mismatch is fixed and verified against the real public URLs.

No new UI feature was developed. ProductDB, Portal, AI Advisor, and Product Detail were not changed.
