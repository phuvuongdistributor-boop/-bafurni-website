# QUOTE LEAD MODULE REPORT

## Sprint
Sprint 19 - Quote and Lead Module

## Status
PASS

## Production Target
- Repo: `phuvuongdistributor-boop/-bafurni-website`
- Branch: `main`
- Root directory: repository root
- Output directory: `.`
- Public domain: `https://bafurni.com`

## Files Changed
- `quote-lead.css`
- `quote-lead.js`
- `site-modules-loader.js`
- `vercel.json`
- `QUOTE_LEAD_MODULE_REPORT.md`

## Implementation Summary
- Added a static-safe quote form on Product Detail pages.
- Auto-filled product context from the rendered product detail page:
  - product name
  - product code
  - current public URL
- Added required validation for contact name and phone number.
- Added visible success/error messaging.
- Added safe fallback behavior: valid submissions open a pre-filled `mailto:` draft instead of posting to a fake endpoint.
- Added hotline CTA using `tel:0929878666`.
- Kept Zalo as a documented placeholder because no verified Zalo URL is available.
- Added mobile sticky CTA with:
  - `Gọi ngay` -> `tel:0929878666`
  - `Nhận báo giá` -> `#product-quote`
- Added exact Vercel rewrites for the public clean product URLs in the sitemap to avoid the earlier 308 redirect loop.

## Public QA
Tested on public production URL:

- `https://bafurni.com/san-pham/tq05-ghe-giam-doc-tq05`

Desktop checks:
- Product page HTTP 200: PASS
- Quote module marker `data-quote-lead-module="ready"`: PASS
- Quote form exists: PASS
- Product context auto-filled as `TQ05 - Ghế giám đốc TQ05`: PASS
- Static mode message visible: PASS
- No fake external form endpoint: PASS
- Hotline CTA `tel:0929878666`: PASS
- Zalo placeholder labeled clearly: PASS
- Empty submit validation focuses name field: PASS
- No broken images: PASS
- No horizontal overflow: PASS

Mobile checks at 390 x 844:
- Quote form exists: PASS
- Sticky CTA visible: PASS
- Sticky call link `tel:0929878666`: PASS
- Sticky quote anchor `#product-quote`: PASS
- Product context preserved: PASS
- No broken images: PASS
- No horizontal overflow: PASS

## Deployment
- Sprint 19 code deploy commit: `a5a444b31f998b9fffa6ea5281f2d57ceb93977a`
- Vercel production deployment: verified successful via public URL checks.

## Known Limitations
- No real quote backend is connected yet. This is intentional for Sprint 19.
- Zalo URL remains placeholder until the business provides a verified Zalo OA/chat link.
- Clean product rewrites are explicit for the currently public sitemap product slugs. Generic future product routes should be revisited before expanding the public product set.

## Safety Confirmation
- ProductDB was not modified.
- Portal was not modified.
- No fake API endpoint was introduced.
- No sensitive user data is transmitted automatically.
