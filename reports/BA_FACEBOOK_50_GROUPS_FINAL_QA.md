# BA_Furniture Facebook Automation — 50 Groups Final QA

Date: 2026-11-09 (Asia/Saigon)
Repository: `phuvuongdistributor-boop/-bafurni-website`
QA branch: `codex/qa-facebook-50-groups-20261109`
Scope: read-only QA and mock preparation only. No Graph API call, Facebook POST/upload/draft, Cron activation, `PUBLISH_ENABLED` change, or Production website change.

## Final counts from actual source artefacts

| Check | Result | Evidence |
|---|---:|---|
| Queue verified | **0/50** | No M26.8 queue file, database export, or 50 source rows found |
| Schedule draft | **0/50** | No scheduler/slot artefact found; no slot was created |
| Content package preflight | **2 package previews, 0/50 groups** | GL4XX and SL have preview captions/assets only; they are not a 50-group queue |
| Caption / image / landing URL / UTM | **0/50 groups** | No group-to-content mapping exists |
| Duplicate check | **0/50** | No historical post dataset or publish-history log exists |
| E2E mock | **0/50** | No actual M26.8 queue/worker implementation exists to exercise |
| Idempotency | **0/50** | No idempotency key/store or per-group result exists |
| Retry | **NOT RUN** | No retry implementation or queue source exists |
| Publish log | **0/50** | No publish-log artefact exists |
| Kill switch | **PASS for disabled scaffold only** | `api/admin/facebook-worker.js` is GET-only and returns disabled/zero transport posts; this is not a 50-group runner |
| Pilot B01 | **BLOCKED** | No verified B01 queue row/content/history record |

## Independent source audit

The audit used repository contents and commit/branch history only; the previous M26.8 baseline was not used as test evidence.

Findings:

- No branch matching M26.8, Facebook automation, or scheduler artefacts was found.
- No path for queue, scheduler, pilot, idempotency, duplicate history, retry, or publish log was found.
- The repository contains four product package directories, but only two have Facebook preview captions:
  - GL4XX: 24-product package, 9 preview media files, one tracked URL with `group_post_01`, `published=false`, `schedule=false`.
  - SL: 22-product package, one preview caption/collage, one tracked URL with `group_post_01`, `publish_status=PREPARE_ONLY`.
- These package previews prove content assets exist for two package-level previews; they do not prove 50 group assignments, historical deduplication, scheduling, idempotency, retry, or publishing readiness.
- The existing worker scaffold is intentionally disabled and contains no queue transport.

### Package-level preflight completed on actual repository files

| Package | Caption | Image manifest/assets | Landing route | Facebook UTM | Publish/schedule state |
|---|---|---|---|---|---|
| GL4XX | PASS | PASS (9/9 manifest files present) | PASS | PASS | OFF (published=false, schedule=false) |
| SL | PASS | PASS (collage asset present) | PASS | PASS | OFF (PREPARE_ONLY, production/Facebook published false) |

These are two package previews, not queue rows. They do not increase any 50-group count.

## Per-group QA

B01–B50 below are the expected slot labels from the requested 50-group scope, not recovered source IDs. Every row is blocked because its M26.8 source row is absent.

| Group | Queue | Schedule | Caption/media/URL/UTM | Duplicate | E2E | Result | Reason |
|---|---|---|---|---|---|---|---|
| B01 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B02 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B03 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B04 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B05 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B06 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B07 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B08 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B09 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B10 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B11 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B12 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B13 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B14 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B15 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B16 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B17 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B18 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B19 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B20 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B21 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B22 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B23 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B24 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B25 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B26 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B27 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B28 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B29 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B30 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B31 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B32 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B33 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B34 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B35 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B36 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B37 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B38 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B39 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B40 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B41 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B42 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B43 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B44 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B45 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B46 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B47 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B48 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B49 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |
| B50 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | BLOCKED | M26.8 queue row không tồn tại trong repository; thiếu caption, media, landing/UTM, history key và idempotency record. |

## Safety confirmation

No Facebook API call was made. No POST, image upload, Facebook draft, Cron, worker activation, or `PUBLISH_ENABLED` change was made. The report is committed on a non-Production QA branch.

## Only blocker and required input

Provide the actual M26.8 source bundle in the repository or an attached workspace path, containing at minimum:

1. the 50 queue rows with stable group IDs;
2. the 50 schedule records or slot rules;
3. caption, image manifest, landing URL, and UTM per row;
4. historical post IDs/content hashes for deduplication;
5. idempotency keys, retry state, publish log, and kill-switch configuration.

Once those artefacts exist, the next run can produce real `x/50` results and execute the 50-group mock without touching Facebook or Production.

## Decision

**BLOCKED by missing source data.** No group is marked PASS or READY_FOR_APPROVAL from inference or baseline reuse.
