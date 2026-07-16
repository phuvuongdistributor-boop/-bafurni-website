# BAFurniture V5.2 - Release Integrity Recovery

Date: 2026-07-16

## Status

Local recovery: **PASS**  
Production release: **PENDING PUBLIC QA**

- Repository: `phuvuongdistributor-boop/-bafurni-website`
- Branch: `main`
- Production URL: `https://bafurni.com`
- Baseline production commit: `63db9d6db3e86f8ef08e9e3a2fc66902b1ed01ac`
- ProductDB: read-only and unchanged
- Portal: unchanged
- DNS: unchanged
- Visual assets: unchanged

## Regression audit

The regression was introduced by commit `815e3f845e81ac42448b6de6fb264b44c65ebeaf` (`Complete storefront visual rebuild V4.2`). That commit added static category product cards such as `BA-GVP-01` and `BA-GD-02` to the storefront. The product-detail runtime later loaded ProductDB independently, while category cards still depended on a separate hard-coded list. This split created two competing product identities and made a valid route such as TQ05 vulnerable to displaying unrelated sample content.

The audit covered every commit from `a27e358` through `63db9d6` and traced the first sample-card introduction to the commit above.

## Recovery

1. Added one shared readonly catalog runtime, `product-catalog-runtime.js`.
2. The runtime loads the existing 1,000-row ProductDB bundle and requires the expected row count before exposing data.
3. Product resolution now uses exact code or the longest valid code prefix from the requested route. It never substitutes the first available product.
4. Category cards now use real ProductDB rows for code, name, image, price and detail route.
5. Removed hard-coded category product arrays.
6. Removed the historical `CHAIR-DEMO-03` sample view model.
7. Added bundle-integrity diagnostics that verify every rendered card code exists in the ProductDB bundle.
8. Updated category and product-detail script versions to `2026-07-16-v52` to prevent stale runtime reuse.

## Files changed

- `category.html`
- `product-detail.html`
- `script.js`
- `product-detail-v41.js`
- `product-data-adapter.js`
- `product-catalog-runtime.js` (new)
- `V5_2_RELEASE_INTEGRITY_REPORT.md`

No `productdb-data*.js` file was modified.

## Local QA

| Check | Result |
| --- | --- |
| JavaScript static parse | PASS - 4/4 runtime files |
| ProductDB rows loaded | PASS - 1,000/1,000 |
| Product route resolver | PASS - 50/50 |
| Required TQ05 route | PASS - TQ05 resolves to TQ05 |
| Category route mappings | PASS - 20/20 |
| Category cards backed by bundle codes | PASS |
| Executable source sample-code audit | PASS - 0 matches |
| ProductDB files checked | 14 |
| ProductDB aggregate SHA-256 | `f9997d6fb1c9a993bb5993988281e21b7fe6a977f488c9fafa24ee6ab4ad7d3e` |

Required route result:

`/san-pham/tq05-ghe-giam-doc-tq05` -> code `TQ05`, name `Ghe giam doc TQ05` from ProductDB.

The 20 category cases cover main and subcategory routes for office chairs, office desks, meeting tables, cabinets, lockers, sofas, school furniture and warehouse racks. The empty-state behavior remains available when a valid filter has no ProductDB match; no sample product is inserted.

## Production QA

Pending deployment. Production PASS requires:

- release commit visible on `main` and Vercel production;
- `https://bafurni.com/san-pham/tq05-ghe-giam-doc-tq05` renders code `TQ05`;
- 50 public product routes resolve to their requested ProductDB code;
- 20 public category routes render only ProductDB-backed cards or the legitimate empty state;
- public rendered pages contain no sample product code, demo product or placeholder product card;
- console errors, failed first-party requests, broken images and horizontal overflow are zero on audited routes.

