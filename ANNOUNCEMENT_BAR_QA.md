# BA_Furniture announcement bar QA

Branch: `correction/visual-assets-announcement-review`  
Production is not changed by this review.

## Implemented behavior

One live-region node rotates through three business messages.

Desktop:

1. `Nhận sản xuất theo kích thước, màu sắc và chất liệu yêu cầu`
2. `Tối ưu báo giá theo số lượng cho doanh nghiệp và dự án`
3. `Tư vấn nhanh · Hotline 0929.878.666`

Mobile:

1. `Nhận sản xuất nội thất theo yêu cầu`
2. `Tối ưu giá theo số lượng và dự án`
3. `Hotline 0929.878.666`

Timing is 4.6 seconds per message with a 500 ms opacity and 4 px vertical transition. The hotline is a real `tel:0929878666` link.

## Accessibility

- exactly one `[data-announcement-message]` node exists throughout all rotations;
- the node uses `aria-live="polite"` and `aria-atomic="true"`;
- no text is duplicated off-screen for animation;
- `prefers-reduced-motion: reduce` stops rotation and keeps message 1;
- reduced-motion was observed for 9.6 seconds: text and height remained unchanged;
- the fallback first message is present in HTML before JavaScript runs.

## Layout and regression measurements

| Check | Desktop 1440×900 | Mobile 390×844 | Result |
|---|---:|---:|---|
| Bar height | 34 px before / 34 px after | 28.8 px before / 29 px after | PASS |
| Page height after settle | 5769 px before / 5769 px after | 9540 px before / 9540 px after | PASS |
| CLS during rotation | 0 | 0 | PASS |
| Live nodes | 1 | 1 | PASS |
| Horizontal overflow | 0 | 0 | PASS |

Additional overflow checks passed at 1280×800 and 768×1024. The V9 hero, category, brand, project and sticky-CTA geometry is unchanged.

## Functional result

- normal motion shows messages 1 → 2 → 3 in order;
- desktop message 3 exposes `tel:0929878666`;
- mobile message 3 exposes `tel:0929878666`;
- reduced motion shows message 1 only;
- console/runtime errors: 0;
- broken images: 0.

Evidence:

- [Production before](qa/visual-assets-true-quality/before/announcement-desktop.png)
- [Preview after](qa/visual-assets-true-quality/after/announcement-desktop.png)
- [Reduced-motion preview](qa/visual-assets-true-quality/after/announcement-reduced-motion.png)
- [Mobile first screen](qa/visual-assets-true-quality/after/mobile-first-screen.png)
