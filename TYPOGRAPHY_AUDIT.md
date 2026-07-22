# BA_Furniture Typography Audit

Audit date: 2026-07-20

## Result

The corrected homepage uses a Vietnamese-safe system sans-serif stack:

```css
"Segoe UI", Arial, sans-serif
```

No remote font is requested. This removes font-download layout shift and avoids synthetic Vietnamese glyphs from an incomplete webfont.

## Font behavior

| Check | Result |
|---|---|
| Primary font | Segoe UI |
| Fallback | Arial, then generic sans-serif |
| Vietnamese glyph support | Pass on supported Windows/browser platforms; Arial provides the fallback |
| Loaded weights | Native system weights; no external font files |
| Font synthesis | Disabled |
| Text rendering | `optimizeLegibility` |
| Font-related CLS | No webfont fetch, therefore no webfont swap CLS |
| Long uppercase headings | Removed; uppercase is limited to short eyebrow/caption labels |

## Scale

| Element | Desktop | Tablet | Mobile | Weight | Line height |
|---|---:|---:|---:|---:|---:|
| H1 | `clamp(44px, 4vw, 56px)` | 44px | 36px | 700 | 1.10 |
| H2 | `clamp(30px, 2.8vw, 36px)` | 30px | 28px | 650 | 1.20 |
| H3 | 20–22px | 20px | 19px | 600 | 1.30 |
| Body | 16px | 16px | 15–16px | 400 | 1.60 |
| Caption | 13–14px | 13–14px | 13px | 600 | 1.45 |

## Spacing and hierarchy

- H1/H2 letter spacing stays between `-0.02em` and `0`.
- Body letter spacing is neutral.
- Long Vietnamese headings use sentence case.
- Product code is visually secondary to the product name.
- Bronze is reserved for links, CTAs, and small emphasis.

## Responsive verification

Measured in the browser after correction:

| Viewport | H1 | H2 | Horizontal overflow |
|---:|---:|---:|---|
| 1440px | 56px | 36px | None |
| 1280px | 51.2px | 35.84px | None |
| 768px | 44px | 30px | None |
| 390px | 36px | 28px | None |
