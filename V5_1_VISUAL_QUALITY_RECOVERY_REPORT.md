# BAFurniture V5.1 - Visual Quality Recovery Report

Date: 2026-07-16

## Status

Local release candidate: PASS.

Production deployment is permitted only for the 52 asset families marked `APPROVED` in `V5_1_IMAGE_APPROVAL_MANIFEST.json`. Rejected candidates remain in QA staging and are not part of the production tree.

## Recovery outcome

- Reviewed all 52 commercial image families, not only a random subset.
- Replaced 31 subcategory masters for concrete quality or duplication reasons.
- Preserved 7 existing subcategory masters that already met the quality gate.
- Preserved the approved Hero, 9 main-category and 4 solution families.
- Exported responsive WebP variants at quality 84-85 using Lanczos and light sharpening.
- Rebased the approved images onto production commit `5fbe86aab3c68f2b6e24372a8f3f384507b48c35`.
- Preserved every production-only module and file; no release file was deleted.

## Rejected candidates

| Asset | Reason | Production |
| --- | --- | --- |
| `ban-may-tinh` first candidate | CPU holder/cable geometry was not convincing. | Excluded |
| `sofa-van-phong` first candidate | Props contained text-like AI marks. | Excluded |
| `ghe-luoi` previous source | Reused the main-category scene with another crop. | Replaced |
| `ghe-luoi` first replacement | Gas cylinder protruded below the base hub. | Excluded |

## QA

| Check | Result |
| --- | --- |
| Full family visual review | PASS - 52/52 approved |
| Seeded random contact-sheet review | PASS - 50/52 |
| Watermark / logo / AI text | PASS - none in approved set |
| Blur / low contrast / low sharpness | PASS - 0 flags |
| Wrong category or product | PASS - 0 |
| Implausible geometry in approved set | PASS - 0 |
| Exact / near duplicate | PASS - 0 |
| High-correlation duplicate scene | PASS - 0 |
| Local homepage desktop/mobile | PASS |
| Local category desktop/mobile | PASS |
| Local TQ05 product desktop/mobile | PASS |
| Browser console errors | PASS - 0 |
| Broken loaded images | PASS - 0 |
| Horizontal overflow | PASS - 0 |

## Evidence

- `release-v5/quality-recovery/final-review/approved-contact-hero-main.jpg`
- `release-v5/quality-recovery/final-review/approved-contact-sub-1.jpg` through `approved-contact-sub-4.jpg`
- `release-v5/quality-recovery/final-review/approved-contact-solutions.jpg`
- `release-v5/qa/visual-qa-contact-1.jpg` through `visual-qa-contact-5.jpg`
- `release-v5/screenshots/v51-release-local/`

## Scope guard

- ProductDB: unchanged.
- Portal: unchanged.
- Product routes: unchanged.
- DNS: unchanged.
- Existing production content and application modules: preserved.
