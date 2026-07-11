# Sprint 27 - Product Bundle Expansion Phase 2

## Status

PASS - Static read-only ProductDB bundle expanded from 300 to 1,000 public rows.

## Files changed

- `productdb-data.js`
- `productdb-data.phase2.compact.js`
- `site-modules-loader.js`
- `tools/export-product-bundle-phase2.py`
- `product_bundle_export_phase2_report.json`
- `PRODUCT_EXPANSION_PHASE2_REPORT.md`

## Source and safety

- Input source: local `products.json`
- Input rows: 3,301
- ProductDB was not modified.
- Portal was not modified.
- The public bundle remains static, read-only, and browser-rendered.

## Selection result

- Phase 1 rows kept: 300
- Phase 2 rows added: 700
- Final public bundle count: 1,000
- Phase 2 files: 1 compact asset
- Payload format: gzip-base64 compact JS dictionary
- Missing image rate in Phase 2: 0.0%
- Duplicate code in final public loader set: 0
- Final public loader set rows: 1,000

## Category coverage

- OFFICE_DESK: 262
- OFFICE_CHAIR: 229
- SCHOOL_FURNITURE: 118
- SOFA_WAITING: 97
- CABINET_STORAGE: 85
- MEETING_TABLE: 60
- PEDESTAL_DRAWER: 47
- PUBLIC_PROJECT: 36
- SHELVING_RACK: 34
- LOCKER_STEEL: 28
- OTHER: 4

## Rejection reasons

- missing_or_invalid_image: 309
- duplicate_code_or_phase1: 304
- duplicate_slug_or_phase1: 303

## Implementation notes

- `productdb-data.js` now reports `bundledCount: 1000` and keeps the public bundle reset/expand helpers.
- Existing Phase 1 files remain unchanged.
- New Phase 2 rows are appended through `productdb-data.phase2.compact.js`.
- `site-modules-loader.js` now loads the compact Phase 2 asset after Phase 1 parts.
- `site-modules-loader.js` waits for `BA_PRODUCTDB_PHASE2_READY` before loading downstream integration modules.
- Exporter is repeatable: `tools/export-product-bundle-phase2.py` reads ProductDB JSON and existing Phase 1 bundle files, then emits the compact Phase 2 append asset.
- Size, material, description, and source URL are optional in the compact Phase 2 asset and use existing public fallback behavior to keep the deploy payload stable.

## QA

- Exporter compile PASS.
- Exporter generation PASS.
- Final loader row count PASS: 1,000.
- Unique product code PASS: 1,000 unique codes.
- Missing image PASS: 0 missing image values in public loader set.
- ProductDB writeback: not performed.
- Portal writeback: not performed.

## Deploy verification

Verify after deploy:

- `https://bafurni.com/productdb-data.js`
- `https://bafurni.com/productdb-data.phase2.compact.js`
- `https://bafurni.com/site-modules-loader.js`
- Public runtime row count should be 1,000 after all loader scripts execute.
