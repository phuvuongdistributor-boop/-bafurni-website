# M26.8 Source Artefact Recovery

Date: 2026-11-09 (Asia/Saigon)
Repository checked: `phuvuongdistributor-boop/-bafurni-website`
Recovery branch: `codex/recover-m26-8-20261109`
Scope: read-only recovery and integrity inspection. No Facebook call, POST, upload, draft, Cron activation, `PUBLISH_ENABLED` change, or Production deploy.

## Recovery result

| Item | Result | Evidence |
|---|---|---|
| Source workspace | **NOT_FOUND** | `C:\Users\Admin\Documents\Codex\2026-10-02\ba-furniture-master-handover-20261002-md-2` does not exist; `C:\Users\Admin` is not present on this machine |
| Worker code | **FOUND** | Remote `api/admin/facebook-worker.js`; read-only disabled scaffold only |
| Queue | **0/50** | No M26.8 queue file, export, database snapshot, or 50 source rows found |
| Schedule records | **0/50** | No scheduler/calendar/slot artefact found |
| Pilot packages | **0/5** | No records for B01, B02, B04-01, B04-02, or B05-01 found |
| Content mapping | **0/50** | No group-to-caption/media/landing/UTM mapping found |
| Idempotency state | **NOT_FOUND** | No idempotency key store, result file, or state export found |
| Publish history | **NOT_FOUND** | No historical Facebook post mapping, post ID list, or publish log found |
| E2E mock | **0/50** | No M26.8 queue/runner/test fixture exists to execute |
| Recovery artefacts copied | **0** | No source data was found, so nothing was copied or rewritten |

## Locations checked

### Requested source workspace

- `C:\Users\Admin\Documents\Codex\2026-10-02\ba-furniture-master-handover-20261002-md-2`
- `automation/facebook_publishing/`
- `outputs/M26_8_FACEBOOK_AUTOMATION_ENGINE/`
- `reports/M26_8_FACEBOOK_AUTOMATION_ENGINE.md`
- `reports/M26_9_PRODUCTION_CONNECTION.md`

The root workspace and all requested child paths are **NOT_FOUND**.

### Local filesystem recovery search

Targeted read-only searches found no matching artefacts in:

- `C:\Users\PC`
- `C:\Users\Public`
- `D:\`
- `E:\`

Search patterns included the requested report names, `M26_8`, `facebook_publishing`, `ba-furniture-master-handover`, and automation-engine names. No matching local Git checkout, `.git`, or `.worktrees` was found in the inspected roots. Codex chat attachments/worktrees were also empty.

### Remote Git recovery search

The connected GitHub owner exposes one repository: `phuvuongdistributor-boop/-bafurni-website`.

The following recovery searches returned no M26.8 source result:

- branch search: `m26.8`, `facebook`, `automation`;
- commit search: `M26.8`;
- code search: `M26_8`, `B04-01`, `B05-01`, and `publish log`.

The repository tree contains no queue, scheduler, pilot, idempotency, duplicate-history, retry, or publish-log artefact.

## Artefacts that do exist remotely

These are package-level previews, not M26.8 queue rows:

1. `PACKAGE_MESH_MEETING_GL4XX_THEONE`
   - 24 product inventory;
   - Facebook preview caption;
   - 9-file Facebook media manifest;
   - tracked URL with `utm_source=facebook`, `utm_medium=social`, campaign and `group_post_01`;
   - manifest says unpublished and unscheduled.

2. `PACKAGE_SL_MEETING_CHAIR_THEONE`
   - 22 product codes;
   - Facebook preview caption and collage;
   - tracked URL with Facebook UTM fields and `group_post_01`;
   - manifest says `PREPARE_ONLY`, not production/published.

Both packages passed package-level presence checks for caption, referenced media, landing route, Facebook UTM fields, and publish-off state. They do not establish any 50-group queue, schedule, deduplication, idempotency, retry, or historical post mapping.

The remote `api/admin/facebook-worker.js` is present but intentionally returns disabled/read-only state and contains no queue transport.

## Integrity and safety

- No Secret was read, copied, logged, or committed.
- No data was synthesized to reach 50.
- No historical data was overwritten.
- No Production code or environment was changed.
- No Facebook API request was made.
- No Cron, publishing flag, POST, upload, or draft was activated.
- No source artefact was available to back up; therefore no recovery copy was created.

## Git recovery branch and commit

- Recovery branch: `codex/recover-m26-8-20261109`
- Report history: initial report commit `367b1be949f1436e243193884be5bb3ed324817a`; metadata was finalized in the recovery commit chain.
- Only this recovery report is committed; no M26.8 source artefact was recovered.

## Missing data and next action

The actual M26.8 handover directory or an equivalent source bundle is required. It must contain the original:

1. 50 queue rows with stable Group IDs;
2. five pilot records: B01, B02, B04-01, B04-02, B05-01;
3. caption, media, landing URL and UTM mapping per row;
4. scheduler/calendar rules and 50 slot records;
5. idempotency keys/state;
6. retry state and publish log;
7. historical Facebook post mapping.

Provide or mount that original workspace/repository snapshot in the current environment. Once present, the next run should back it up, hash/count it, redact only sensitive values, commit the permitted artefacts to a recovery branch, and run the real QA. Until then, queue, schedule, pilot, E2E, duplicate, idempotency, and publish-history results remain **NOT_VERIFIED**, not PASS.

## Decision

**RECOVERY BLOCKED BY MISSING SOURCE WORKSPACE AND M26.8 ARTEFACTS.** No baseline number was promoted to evidence.
