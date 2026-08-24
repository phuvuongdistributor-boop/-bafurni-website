# SL / The One — approved clean exact image selection

Audit date: 2026-08-24
Scope: 22/22 inventory codes
Machine-readable contract: `approved-image-selection.json`

## Verdict

- Approved exact-code files: **22/22**
- Digital watermark / QR / embedded supplier-reseller logo / wrong product / placeholder: **0**
- Natural resolution: **580×580 for all 22 selected JPEGs**
- Resolution classification: **LOW_RES_EXACT**, disclosed without exception
- Transformations: **none** — no crop, AI redraw, background removal, remaster, sharpen, or upscale
- Presentation constraint: never render a selected product image larger than 580 px on either axis.

Small manufacturer labels physically attached to some chair frames are part of the photographed product. They are not digital logo overlays and were not concealed or altered.

## Approved selection

| Code | Selected source file | Natural px | Bytes | Visual status |
|---|---|---:|---:|---|
| SL216S | [2020/08/SL216S-1.jpg](https://theone.vn/wp-content/uploads/2020/08/SL216S-1.jpg) | 580×580 | 55,429 | PASS_CLEAN_EXACT_LOW_RES |
| SL225S | [2020/08/SL225S-1.jpg](https://theone.vn/wp-content/uploads/2020/08/SL225S-1.jpg) | 580×580 | 46,276 | PASS_CLEAN_EXACT_LOW_RES |
| SL601S | [2020/08/SL601S-1.jpg](https://theone.vn/wp-content/uploads/2020/08/SL601S-1.jpg) | 580×580 | 56,074 | PASS_CLEAN_EXACT_LOW_RES |
| SL603M | [2020/08/SL603M-1.jpg](https://theone.vn/wp-content/uploads/2020/08/SL603M-1.jpg) | 580×580 | 52,176 | PASS_CLEAN_EXACT_LOW_RES |
| SL606 | [2020/08/SL606-1.jpg](https://theone.vn/wp-content/uploads/2020/08/SL606-1.jpg) | 580×580 | 48,815 | PASS_CLEAN_EXACT_LOW_RES |
| SL607 | [2020/08/SL607-1.jpg](https://theone.vn/wp-content/uploads/2020/08/SL607-1.jpg) | 580×580 | 42,393 | PASS_CLEAN_EXACT_LOW_RES |
| SL710S | [2020/08/SL710S.jpg](https://theone.vn/wp-content/uploads/2020/08/SL710S.jpg) | 580×580 | 47,254 | PASS_CLEAN_EXACT_LOW_RES |
| SL711S | [2020/08/SL711S-1.jpg](https://theone.vn/wp-content/uploads/2020/08/SL711S-1.jpg) | 580×580 | 82,027 | PASS_CLEAN_EXACT_LOW_RES |
| SL712S | [2020/08/SL712S-1.jpg](https://theone.vn/wp-content/uploads/2020/08/SL712S-1.jpg) | 580×580 | 56,953 | PASS_CLEAN_EXACT_LOW_RES |
| SL718M | [2020/08/SL718M-1.jpg](https://theone.vn/wp-content/uploads/2020/08/SL718M-1.jpg) | 580×580 | 61,853 | PASS_CLEAN_EXACT_LOW_RES |
| SL719M | [2020/08/SL719M-1.jpg](https://theone.vn/wp-content/uploads/2020/08/SL719M-1.jpg) | 580×580 | 61,870 | PASS_CLEAN_EXACT_LOW_RES |
| SL721M | [2020/08/SL721M-1.jpg](https://theone.vn/wp-content/uploads/2020/08/SL721M-1.jpg) | 580×580 | 61,096 | PASS_CLEAN_EXACT_LOW_RES |
| SL811M | [2020/08/SL811M-1.jpg](https://theone.vn/wp-content/uploads/2020/08/SL811M-1.jpg) | 580×580 | 64,355 | PASS_CLEAN_EXACT_LOW_RES |
| SL901 | [2020/08/SL901-1.jpg](https://theone.vn/wp-content/uploads/2020/08/SL901-1.jpg) | 580×580 | 61,606 | PASS_CLEAN_EXACT_LOW_RES |
| SL903 | [2020/08/SL903-1.jpg](https://theone.vn/wp-content/uploads/2020/08/SL903-1.jpg) | 580×580 | 58,604 | PASS_CLEAN_EXACT_LOW_RES |
| SL904 | [2020/08/SL904-1.jpg](https://theone.vn/wp-content/uploads/2020/08/SL904-1.jpg) | 580×580 | 62,130 | PASS_CLEAN_EXACT_LOW_RES |
| SL905 | [2022/02/SL905.jpg](https://theone.vn/wp-content/uploads/2022/02/SL905.jpg) | 580×580 | 34,803 | PASS_CLEAN_EXACT_LOW_RES |
| SL906 | [2022/05/SL906.jpg](https://theone.vn/wp-content/uploads/2022/05/SL906.jpg) | 580×580 | 33,980 | PASS_CLEAN_EXACT_LOW_RES |
| SL908 | [2020/08/SL908-theonevn.jpg](https://theone.vn/wp-content/uploads/2020/08/SL908-theonevn.jpg) | 580×580 | 36,000 | PASS_CLEAN_EXACT_LOW_RES |
| SL926 | [2022/02/SL926.jpg](https://theone.vn/wp-content/uploads/2022/02/SL926.jpg) | 580×580 | 34,883 | PASS_CLEAN_EXACT_LOW_RES |
| SL933 | [2022/08/SL933.jpg](https://theone.vn/wp-content/uploads/2022/08/SL933.jpg) | 580×580 | 34,582 | PASS_CLEAN_EXACT_LOW_RES |
| SL9700M | [2020/08/SL9700M-1.jpg](https://theone.vn/wp-content/uploads/2020/08/SL9700M-1.jpg) | 580×580 | 60,584 | PASS_CLEAN_EXACT_LOW_RES_WITH_SOURCE_CONFLICT_NOTE |

## Selection corrections and hard rejections

### SL710S

Selected `SL710S.jpg`. Its form matches the current corporate-source SL710S product image. `SL710S-1.jpg` is clean and exact-code but appears to be an alternate/older upholstery form, so it is not the primary asset.

### SL908

Selected `SL908-theonevn.jpg`; it matches the current corporate-source SL908 form. Rejected:

- `SL908.jpg`: materially different gathered-back form from the current corporate source.
- `SL908-anhtam.jpg`: visibly soft and low-detail.
- All generated derivatives: smaller duplicates.

### SL926

Selected exactly `https://theone.vn/wp-content/uploads/2022/02/SL926.jpg`. Rejected:

- `theone-800-SL926.jpg`: contact collage with phone number, brand mark and repeated diagonal watermark.
- `theonevn-SL926.jpg`, `theonevn-SL926_1.jpg`, `theonevn-SL926_2.jpg`: embedded `theone.vn` watermark.
- All generated derivatives: smaller duplicates.

### SL903

The approved source is an exact `SL903` image. It must replace the known ProductDB image URL mismatch that pointed to an SL908 asset. ProductDB itself is not modified.

### SL9700M

The inventory-mapped exact-code archive provides a cantilever-chair image consistent with the `SL9700M` name and description. The current corporate page's downloaded image depicts a wheeled-base chair even though its page identifies the product as `GHẾ HỌP CHÂN QUỲ SL9700M`; that corporate image is treated as a source-side image mismatch and is rejected.

## Global rejected sources

- Corporate high-resolution JPEG downloads carrying Hòa Phát / The One / 3DModels marks or watermark overlays.
- Corporate search/gallery images with embedded supplier marks.
- Every WordPress thumbnail derivative smaller than the selected 580×580 original.

No rejected file may be cleaned by cropping, blurring, covering, redrawing, or upscaling.
