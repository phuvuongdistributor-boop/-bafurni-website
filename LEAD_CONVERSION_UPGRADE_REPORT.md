# Sprint 29 - Lead Conversion Upgrade

## Status

PASS - Lead conversion module was upgraded for product and category quote intent without modifying ProductDB or Portal.

## Scope

- Repository target: `phuvuongdistributor-boop/-bafurni-website`
- Branch: `main`
- ProductDB modified: no
- Portal modified: no
- Fake endpoint added: no
- Zalo URL: not verified, remains disabled placeholder

## Files Released

- `quote-lead.js`
- `quote-lead.css`
- `site-modules-loader.js`
- `LEAD_CONVERSION_UPGRADE_REPORT.md`

## CTA Coverage

- Hotline CTA uses `tel:0929878666`.
- Product quote form pre-fills product name, product code, category/subcategory and current product URL.
- Category quote form pre-fills category name and category page URL.
- Quote form uses `mailto:contact@bafurni.com` with subject/body prefilled.
- Mobile sticky action appears on product detail and category pages.
- Sticky quote action targets the correct quote/contact section instead of always using `#product-quote`.
- Zalo CTA remains marked `NEED_ZALO_LINK`, `aria-disabled="true"` and click-disabled until a verified Zalo URL exists.

## Local Static QA

- `quote-lead.js` syntax check: PASS
- Hotline marker `tel:0929878666`: PASS
- Mailto fallback `contact@bafurni.com`: PASS
- Zalo placeholder: PASS
- No fetch/XHR endpoint submission added: PASS
- ProductDB writeback: not performed
- Portal writeback: not performed

## Public QA Plan

- Deploy through Vercel from commit on `main`.
- Verify `https://bafurni.com/quote-lead.js` contains `2026-07-11-s29-lead`.
- Verify `https://bafurni.com/product-detail.html` HTTP 200.
- Verify `https://bafurni.com/category.html` HTTP 200.
- Verify public quote module contains product/category context, mailto fallback, hotline and disabled Zalo placeholder.

## Notes

This sprint improves conversion readiness only. It does not connect CRM, Zalo, ProductDB, Portal, search, filters or product detail backend logic.
