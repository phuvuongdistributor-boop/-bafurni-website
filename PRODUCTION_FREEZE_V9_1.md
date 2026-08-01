# BAFurniture V9.1 — Production Freeze

## Release identity

- Production domain: `https://bafurni.com`
- Approved preview commit: `1a956de1b51b74648ec553117b2353ed5c2e5e2b`
- Production merge commit / application SHA verified: `4ebbaf2a776b3d69995d50301b9fb9ba688d8577`
- Previous production / rollback commit: `e1e9274e564fdb27324e360307bdf9b3b7106b62`
- Deployment time: `2026-08-01 18:22:49 ICT (GMT+7)`
- Vercel deployment: `https://bafurni-website-h9jv9enex-phuvuongdistributor-boops-projects.vercel.app`
- Vercel status: `Ready — Production — Current`
- Vercel build duration: `10s`
- Public copy audit records: `40`
- Homepage main word count: preview `505` → production `505`

The production application tree matches the approved V9.1 preview. No UI, typography, image, ProductDB, Portal, Lead Engine, Apps Script, route, product mapping or category mapping change was made during the merge and verification workflow.

## Brand voice verification

- Hero brand line: `Giải pháp nội thất phù hợp cho từng không gian làm việc.`
- Homepage contains all `8/8` approved category descriptions.
- Footer copy: `Giải pháp nội thất cho văn phòng, trường học và dự án.`
- Footer slogan: `Khách hàng ở đâu, chúng tôi ở đó.`
- Generic public English from the audited phrase set: `0`.
- Public claims `rẻ nhất`, `tốt nhất`, `số 1`: `0`.

Announcement desktop rotation uses one live node and displays exactly:

1. `Thiết kế, cung cấp và sản xuất nội thất theo yêu cầu`
2. `Hơn 3.000 sản phẩm cho văn phòng, trường học và dự án`
3. `Tối ưu báo giá theo số lượng · Hotline 0929.878.666`

The third message preserves `tel:0929878666`. With `prefers-reduced-motion: reduce`, the first message remained unchanged after `5.4s`.

## Route verification

- Homepage `/`: HTTP `200`.
- `/lead-config.js`: HTTP `200`.

Category routes — all HTTP `200`, real ProductDB-backed data, broken image `0`, horizontal overflow `0`:

| Route | Matching products | Rendered |
|---|---:|---:|
| `/danh-muc/ghe-van-phong` | 176 | 32 |
| `/danh-muc/ban-van-phong` | 268 | 32 |
| `/danh-muc/ban-hop` | 51 | 32 |
| `/danh-muc/tu-ho-so` | 109 | 32 |
| `/danh-muc/tu-locker` | 34 | 32 |
| `/danh-muc/sofa-ghe-cho` | 95 | 32 |
| `/danh-muc/noi-that-truong-hoc` | 124 | 32 |
| `/danh-muc/ke-gia-kho` | 3 | 3 |

Product routes — all HTTP `200`, resolved Code and approved image Code match:

| Code | Category | Application line |
|---|---|---|
| `TQ05` | Ghế văn phòng | Phù hợp: Văn phòng · Phòng lãnh đạo · Phòng họp |
| `TQ01` | Ghế văn phòng | Phù hợp: Văn phòng · Phòng lãnh đạo · Phòng họp |
| `DT1890V2` | Bàn văn phòng | Phù hợp: Nhân viên · Lãnh đạo · Văn phòng dự án |
| `DT2010V2` | Bàn văn phòng | Phù hợp: Nhân viên · Lãnh đạo · Văn phòng dự án |
| `TU09K7CK` | Tủ và hộc tài liệu | Phù hợp: Lưu trữ hồ sơ · Văn phòng · Cơ quan |
| `TU983-3KS` | Tủ locker | Phù hợp: Nhân viên · Trường học · Nhà máy |
| `GMG101A-2` | Nội thất trường học | Phù hợp: Lớp học · Phòng giáo viên · Trường học |
| `BMG101A-2` | Nội thất trường học | Phù hợp: Lớp học · Phòng giáo viên · Trường học |

## Functional QA

- Homepage Quote Wizard: step `1 → 2 → 3` PASS.
- Product detail `TQ05` Quote Wizard: step `1 → 2 → 3` PASS.
- Product context preserved: Code `TQ05`, name `Ghế giám đốc TQ05`, category `Ghế văn phòng`, source `bafurni-product-detail`.
- Form submit was not clicked.
- Test/fake leads created: `0`.
- Apps Script delivery requests during QA: `0`.
- Console/runtime errors belonging to `bafurni.com`: `0`.
- Broken images: `0`.
- Horizontal overflow: `0` on desktop and mobile verification viewports.

## Performance and stability

- Desktop CLS: `0`.
- Mobile CLS: `0`.
- Desktop homepage main word count: `505`, equal to the approved preview.
- Mobile homepage has no horizontal overflow and no broken image.
- Announcement height remained `34px` during desktop rotation.

## Freeze

Rollback commit:

`e1e9274e564fdb27324e360307bdf9b3b7106b62`

STOP after V9.1 production verification. Product Enrichment was not started.
