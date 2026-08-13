# BAFurniture V10.04R — Clean Image Recovery Report

## Freeze và phạm vi

- Base branch: `feature/v10-04-gl3xx-theone-product-package`
- Base commit: `22b6cdc49dbd1dbfa3a2c5098dd83b59570d4f3b`
- Working branch: `correction/v10-04r-clean-image-recovery`
- Ngày audit: 2026-08-11 (Asia/Bangkok)
- Phạm vi duy nhất: recovery ảnh sạch cho `GL304`, `GL309`, `GL316`, `GL317`, `GL324`, `GL335`, `GL345`.
- Không thay landing/product/SEO/Knowledge/Marketing copy, UI/CSS, ProductDB, Portal, Lead Engine, Apps Script, collage marketing hoặc 15 mã ảnh hiện hữu.
- Không merge `main`; không deploy production.

## Kết quả

| Chỉ số | Trước | Sau |
|---|---:|---:|
| Sản phẩm có ảnh exact | 15/22 | 22/22 |
| Placeholder | 7/22 | 0/22 |
| Mã recovered | 0 | 7 |
| Asset recovered được giữ | 0 | 16 |

Tất cả 7 mã đều `FOUND`. Không dùng ảnh gần giống để đạt KPI; không crop, blur, clone, inpaint, generative fill hoặc upscale. Tất cả file website và file package là bản sao byte-for-byte từ asset được duyệt.

## Nguồn và phương pháp

Nguồn ưu tiên là website nhà sản xuất The One tại `https://noithattheone.vn/`, các trang sản phẩm chính thức, gallery/srcset và CDN `storage.sudospaces.com/noithattheone`. Nguồn reseller chỉ dùng để đối chiếu Code/hình dáng/thông số, không có ảnh reseller nào được chọn.

Tổng cộng 137 candidate row đã được rà bằng URL nguồn, kích thước thật, SHA-256, dấu hiệu watermark/QR/logo/chữ quảng cáo/crop/upscale và kiểm tra thị giác ở độ phân giải gốc.

| Code | Candidates | Clean exact | Main được chọn | Độ phân giải | Kết luận |
|---|---:|---:|---|---:|---|
| GL304 | 24 | 2 | `gl304-1.jpg.webp` | 1000×723 | FOUND — EXCELLENT |
| GL309 | 22 | 4 | `gl309-2.jpg.webp` | 2000×1446 | FOUND — EXCELLENT |
| GL316 | 23 | 2 | `gl316-2.jpg.webp` | 2000×1446 | FOUND — EXCELLENT |
| GL317 | 19 | 1 | `gl317-1-1.jpg.webp` | 2000×1446 | FOUND — EXCELLENT |
| GL324 | 20 | 2 | `gl324-2.jpg.webp` | 2000×1446 | FOUND — EXCELLENT |
| GL335 | 13 | 4 | `gl335-2-1.jpg.webp` | 2000×1446 | FOUND — EXCELLENT |
| GL345 | 16 | 2 | `gl345-2.jpg.webp` | 2000×1446 | FOUND — EXCELLENT |

Chi tiết bắt buộc theo Code nằm trong `V10_04R_IMAGE_RECOVERY.csv`.

## Exact-product verification — 16 asset được giữ

Quy ước: `PASS` ở Watermark/QR/Logo nghĩa là không phát hiện; Logo là logo/overlay của reseller hoặc nhà cung cấp, không tính nhãn vật lý gắn thật trên sản phẩm.

| Code / role | Source URL | Source type | Original resolution | Exact Code evidence | Visual match | Material match | Watermark | QR | Logo | Decision | SHA-256 |
|---|---|---|---:|---|---|---|---|---|---|---|---|
| GL304 main | `https://storage.sudospaces.com/noithattheone/2024/03/gl304-1.jpg.webp` | Level 1 official manufacturer CDN | 1000×723 | Trang chính thức GL304 + filename exact | PASS | Lưới, khung/chân thép mạ: PASS | PASS | PASS | PASS | ACCEPT | `349ffe51b6cd2b4ac730bd5b98d141cb8c8ff1c3aa31507d47ba11f31b539a4d` |
| GL304 gallery-01 | `https://storage.sudospaces.com/noithattheone/2024/03/gl304-3.jpg.webp` | Level 1 official manufacturer CDN | 1000×723 | Gallery trang chính thức GL304 | PASS | PASS | PASS | PASS | PASS | ACCEPT | `fd7b7c14fe2f0382bd83a82077fa0ad0112781f2521e050be7621e219d6e2b5d` |
| GL309 main | `https://storage.sudospaces.com/noithattheone/2021/12/gl309-2.jpg.webp` | Level 1 official manufacturer CDN | 2000×1446 | Trang chính thức GL309 + filename exact | PASS | Tựa đầu, lưới, chân thép mạ: PASS | PASS | PASS | PASS | ACCEPT | `257b349e92d57b77a3a915eb4f510edf4d61135711505c5800b7c126715d7fcc` |
| GL309 gallery-01 | `https://storage.sudospaces.com/noithattheone/2021/12/gl309-3.jpg.webp` | Level 1 official manufacturer CDN | 2000×1446 | Gallery trang chính thức GL309 | PASS | PASS | PASS | PASS | PASS | ACCEPT | `f1b847675c9e607206211363477ffde604fe19311437d748453b8cb80b750f33` |
| GL309 gallery-02 | `https://storage.sudospaces.com/noithattheone/2021/12/gl309-4.jpg.webp` | Level 1 official manufacturer CDN | 2000×1446 | Gallery trang chính thức GL309 | PASS | PASS | PASS | PASS | PASS | ACCEPT | `134e7b6fa0e331ee551ebe617f3e4d47fd3106aea4250a087aab8f0880541084` |
| GL309 gallery-03 | `https://storage.sudospaces.com/noithattheone/2021/12/gl309-5.jpg.webp` | Level 1 official manufacturer CDN | 2000×1446 | Gallery trang chính thức GL309 | PASS | PASS | PASS | PASS | PASS | ACCEPT | `cc1613fe46fb0978821f68c914bf6bb12702601da97fc8d94b214405b854a41d` |
| GL316 main | `https://storage.sudospaces.com/noithattheone/2024/07/gl316-2.jpg.webp` | Level 1 official manufacturer CDN | 2000×1446 | Trang chính thức GL316 + filename exact | PASS | Tựa lưới/PVC, đệm PVC, chân thép mạ: PASS | PASS | PASS | PASS | ACCEPT | `11f0fedf043914e213bd1609eb159a5d2845dc1be5a46d5776303d91ed2a1b30` |
| GL316 gallery-01 | `https://storage.sudospaces.com/noithattheone/2024/07/gl316-3.jpg.webp` | Level 1 official manufacturer CDN | 2000×1446 | Gallery trang chính thức GL316 | PASS | PASS | PASS | PASS | PASS | ACCEPT | `3e476f3dc5d7a6866fd458ee2eb0ab32db0ccc80f744b0ea583ed8fc8c087740` |
| GL317 main | `https://storage.sudospaces.com/noithattheone/2024/03/gl317-1-1.jpg.webp` | Level 1 official manufacturer CDN | 2000×1446 | Trang chính thức GL317 + filename exact | PASS | **Khung thép bọc da CN**, chân/tay thép mạ: PASS | PASS | PASS | PASS | ACCEPT | `dac85650fb5f6a5f28dbad6dd1311bc77540ca5eb700aff76455a9b3ad875b6d` |
| GL324 main | `https://storage.sudospaces.com/noithattheone/2024/01/gl324-2.jpg.webp` | Level 1 official manufacturer CDN | 2000×1446 | Trang chính thức GL324 + filename exact | PASS | Khung nhựa bọc lưới, đệm lưới: PASS | PASS | PASS | PASS | ACCEPT | `ddfef838edf752183e86cb932f9d6c1eae92061bfda4a9e85256f83cfd586457` |
| GL324 gallery-01 | `https://storage.sudospaces.com/noithattheone/2024/01/gl324-3.jpg.webp` | Level 1 official manufacturer CDN | 2000×1446 | Gallery trang chính thức GL324 | PASS | PASS | PASS | PASS | PASS | ACCEPT | `b188ff61f17fe074894b4194f0c6fa30920f818aa73d0c62c575bc367ba985fe` |
| GL335 main | `https://storage.sudospaces.com/noithattheone/2025/11/gl335-2-1.jpg.webp` | Level 1 official manufacturer CDN | 2000×1446 | Trang chính thức GL335 + filename exact | PASS | Khung lưới, đệm PVC, chân thép mạ: PASS | PASS | PASS | PASS | ACCEPT | `831a204783a582c5ccaa99fdeed631460b87a47bb253de88a22c1c79dda5a436` |
| GL335 gallery-01 | `https://storage.sudospaces.com/noithattheone/2025/11/gl335-3-1.jpg.webp` | Level 1 official manufacturer CDN | 2000×1446 | Gallery trang chính thức GL335 | PASS | PASS | PASS | PASS | PASS | ACCEPT | `8dc8d86d24034ed4bf9cec3bb3459bca72961cb807c544f8740ad279286ad2e3` |
| GL335 gallery-02 | `https://storage.sudospaces.com/noithattheone/2025/11/gl335-4-1.jpg.webp` | Level 1 official manufacturer CDN | 2000×1446 | Gallery trang chính thức GL335 | PASS | PASS | PASS | PASS | PASS | ACCEPT | `0b39899f48998c1520bdcfd6f4164b861c6dbf23c3bd451f81edc30e226ce70e` |
| GL345 main | `https://storage.sudospaces.com/noithattheone/2024/12/gl345-2.jpg.webp` | Level 2 official manufacturer CDN archive | 2000×1446 | Official The One article links exact GL345 gallery family | PASS | Khung tựa nhựa bọc lưới, đệm vải, chân thép mạ: PASS | PASS | PASS | PASS* | ACCEPT | `2a150146692f8d9b1091fcd1aae1ed7d9e37d825befcbf333cde78ee6fbcbba4` |
| GL345 gallery-01 | `https://storage.sudospaces.com/noithattheone/2024/12/gl345-3.jpg.webp` | Level 2 official manufacturer CDN archive | 2000×1446 | Exact-code official CDN gallery family | PASS | PASS | PASS | PASS | PASS | ACCEPT | `c723e26a96fb1a0b6e1a787c5e53ec811fb4344e6eddb4354ef72493e8221deb` |

`*` Ảnh chính GL345 có một nhãn may vật lý rất nhỏ trên mép đệm. Đây là bộ phận thật của sản phẩm, không phải overlay, watermark, logo reseller hoặc chữ quảng cáo. Gallery góc sau không có dấu chữ nhìn thấy.

Trang đối chiếu chính thức:

- GL304: `https://noithattheone.vn/ghe-lanh-dao/ghe-luoi-lanh-dao-gl304.html`
- GL309: `https://noithattheone.vn/ghe-luoi-lanh-dao-gl-en/ghe-luoi-lanh-dao-gl309-en.html`
- GL316: `https://noithattheone.vn/ghe-lanh-dao/ghe-luoi-lanh-dao-gl316.html`
- GL317: `https://noithattheone.vn/ghe-lanh-dao/ghe-luoi-lanh-dao-gl317.html`
- GL324: `https://noithattheone.vn/ghe-lanh-dao/ghe-luoi-lanh-dao--gl324.html`
- GL335: `https://noithattheone.vn/ghe-lanh-dao/ghe-luoi-lanh-dao-gl335.html`
- GL345 evidence article: `https://noithattheone.vn/ban-giam-doc/ban-giam-doc-son-pu-dt1890h25.html`

## Duplicate detection

- SHA-256: 16/16 asset recovered có hash riêng; exact-byte duplicate giữa hai Code khác nhau = 0.
- Main image toàn package: 22/22 SHA-256 riêng; không có hai Code dùng cùng file.
- Perceptual: 107 cặp cross-Code được so sánh bằng foreground-trimmed 64-bit pHash (32×32 DCT); exact pHash duplicate = 0; khoảng cách Hamming nhỏ nhất = 8, vượt ngưỡng duplicate bảo thủ `≤5`.
- Cặp gần nhất theo pHash là `GL304/main.webp` và `GL317/main.webp`; kiểm tra thị giác xác nhận khác model và khác vật liệu rõ ràng (GL304 lưới, GL317 da CN).
- Các JPEG/WebP hoặc gallery cùng Code có nội dung tương đương chỉ giữ một delivery asset cần thiết; không có `OFFICIAL_SHARED_IMAGE` giữa hai Code.

## Candidate bị loại

Các candidate bị loại nếu có một trong các yếu tố: watermark/logo/domain/hotline reseller, QR, chữ quảng cáo, badge 3D/Corona, overlay THE ONE, sai Code/cấu hình, crop nghiêm trọng, ảnh nhỏ hoặc trùng nội dung. Ví dụ đáng chú ý:

- GL304/GL324 design JPEG: có logo THE ONE, domain và badge thiết kế.
- GL309 reseller: có watermark/logo/điện thoại.
- GL316/GL317 reseller pool: chỉ dùng đối chiếu; không vượt nguồn chính hãng sạch.
- GL335 official Drive được xác minh sạch nhưng bản WebP gallery chính thức 2000×1446 được chọn cho delivery đồng nhất.
- GL345 các bản reseller có watermark/domain; bị loại.

## Data integrity và scope regression

- 15 record không thuộc recovery giữ nguyên byte-level JSON so với base.
- ProductDB, Portal, Lead Engine, Apps Script: không thay đổi.
- UI/CSS và marketing collage/assets: không thay đổi.
- Không có category fallback.
- GL321 và GL343 vẫn ở package, giữ nguyên `availabilityNote`/`limitation` “ngừng kinh doanh; cần xác nhận khả dụng hoặc mẫu thay thế”.
- Không xuất hiện claim `Còn hàng` hoặc `Mua ngay`.
- GL317 giữ đúng cấu hình bọc da CN.

## QA

### Static recovery validator

- Kết quả: PASS — 199 checks.
- 22/22 đúng membership/order Code.
- 16/16 source assets khớp SHA-256 ở cả public path và package path.
- 22/22 main image tồn tại và đọc được; 7 recovered là `CLEAN_EXACT`; 15 baseline còn lại giữ `LOW_RES_EXACT` đúng phạm vi.
- Placeholder = 0; category fallback = 0; wrong-product mapping = 0.

Lệnh:

```powershell
C:\Users\Admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe qa/v10-04r/validate-recovery.mjs
```

### Browser smoke test local

| Trang | Viewport | Kết quả |
|---|---:|---|
| `/danh-muc/ghe-luoi-lung-cao` | 1440 desktop | 22 cards; 0 placeholder; 0 broken image; 0 horizontal overflow |
| `/danh-muc/ghe-luoi-lung-cao` | 390 mobile | 22 cards; 0 placeholder; 0 broken image; 0 horizontal overflow |
| 7 route `/san-pham/ghe-luoi-lung-cao/{code}` | 1440 desktop | 7/7 đúng Code/main/gallery; 0 broken image; 0 placeholder; 0 horizontal overflow |

Natural dimensions trình duyệt đọc: GL304 `1000×723`; GL309, GL316, GL317, GL324, GL335, GL345 `2000×1446`. Console error thuộc website = 0.

### Screenshot evidence

- Landing desktop: `PACKAGE_MESH_HIGHBACK_GL3XX_THEONE/qa/screenshots/v10-04r-landing-desktop.jpg`
- Landing mobile: `PACKAGE_MESH_HIGHBACK_GL3XX_THEONE/qa/screenshots/v10-04r-landing-mobile.jpg`
- Mobile card: `PACKAGE_MESH_HIGHBACK_GL3XX_THEONE/qa/screenshots/v10-04r-cards-mobile.jpg`
- 7 card viewport: `v10-04r-card-gl304.jpg`, `gl309`, `gl316`, `gl317`, `gl324`, `gl335`, `gl345` trong cùng thư mục.
- 7 product route: `v10-04r-product-gl304.jpg`, `gl309`, `gl316`, `gl317`, `gl324`, `gl335`, `gl345` trong cùng thư mục.

## Preview release

- Preview branch only: `correction/v10-04r-clean-image-recovery`
- Recovery content commit: `5a1c4076fc4a540307201388436558e0236e59ae`
- Stable branch Preview: `https://bafurni-website-git-c-a0d3c7-phuvuongdistributor-boops-projects.vercel.app`
- Initial immutable deployment: `https://bafurni-website-lpcmy0n8n-phuvuongdistributor-boops-projects.vercel.app`
- Vercel: `Ready` — Environment `Preview` — build duration `13s`.
- Production: không deploy.

## Kết luận

V10.04R đạt mục tiêu theo tính toàn vẹn dữ liệu: 7/7 mã tìm được ảnh sạch, thật, đúng Code từ nguồn nhà sản xuất; clean tăng `15/22 → 22/22`, placeholder giảm `7/22 → 0/22`. Sprint dừng sau Preview QA; không merge main và không bắt đầu nhóm khác.
