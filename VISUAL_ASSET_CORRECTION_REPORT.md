# BA_Furniture visual asset correction report

## Scope lock

- Base production commit: `e1e9274e564fdb27324e360307bdf9b3b7106b62`
- Working branch: `correction/visual-assets-announcement-review`
- Main merge: **not performed**
- Production deploy: **not performed**
- ProductDB, Portal, Lead Engine and Apps Script: **unchanged**
- Product images/codes and the 8 primary category assets: **unchanged**
- V9 layout/content hierarchy: **unchanged**

## Decisions

- 12 marketing delivery images: previous state classified `UPSCALED_SOFT`; rebuilt from higher-resolution approved repository sources and now classified `PASS_TRUE_DETAIL`.
- 8 category images: classified `PASS_TRUE_DETAIL`; kept byte-for-byte unchanged.
- `AI_ARTIFACT`, `OVER_DENOISED`, `OVER_COMPRESSED`, `WRONG_CROP`, `WRONG_ASPECT_RATIO` and `REBUILD_REQUIRED` remaining after correction: 0.
- Watermark, supplier logo and fake readable text observed in the 20 audited assets: 0.
- New generated image assets: 0.

The source scenes are repository renders/composites with no camera or creation provenance attached. This report therefore does not claim that they are documentary photographs. It confirms only what can be verified: native file lineage, no upscale in the correction pipeline, and no serious geometry/material/text artifact visible at the requested 100% and 200% inspection.

## Delivery implementation

- marketing paths remain under `assets/marketing/remastered/` to avoid changing layout or content references;
- a `?v=true-source-1` cache key prevents a browser from retaining the superseded soft files at the same path;
- AVIF remains the primary browser format and WebP remains the fallback;
- hero desktop/mobile each have one matching preload;
- marketing images below the first screen remain `loading="lazy"`;
- the mobile hero is a verified crop/downsample, not an upscale;
- deterministic audit/build scripts are in `qa/visual-assets-true-quality/`.

## QA result before preview deployment

| Check | Result |
|---|---|
| Browser actual asset check at DSF 2 | PASS |
| 20/20 visual assets at 100% and 200% | PASS |
| Desktop page height | 5769 px before / 5769 px after |
| Mobile page height | 9540 px before / 9540 px after |
| CLS desktop/mobile | 0 / 0 |
| Horizontal overflow 1440/1280/768/390 | 0 / 0 / 0 / 0 |
| Broken images | 0 |
| Console/runtime errors | 0 |
| Quote Wizard step 1 → 2 → 3 | PASS |
| Lead submission | not clicked; test lead count 0 |
| Announcement 3-message rotation | PASS |
| Reduced-motion first-message-only behavior | PASS |
| V9 visual hierarchy/layout regression | 0 |

## Files

- `VISUAL_ASSET_TRUE_QUALITY_AUDIT.csv`
- `MARKETING_IMAGE_BEFORE_AFTER.md`
- `ANNOUNCEMENT_BAR_QA.md`
- `qa/visual-assets-true-quality/before/`
- `qa/visual-assets-true-quality/after/`

Preview deployment URL, commit SHA and Vercel status are appended after the branch is pushed and the preview reaches Ready.
