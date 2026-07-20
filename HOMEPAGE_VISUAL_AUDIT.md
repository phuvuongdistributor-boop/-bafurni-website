# BAFurniture Homepage Visual Audit

Audit date: 2026-07-20  
Audited URL: https://bafurni.com/  
Scope: production state before Product-First Visual Reset

## Evidence

- Desktop 1440: `outputs/bafurni-homepage-recovery-audit/before/homepage-1440.png`
- Laptop 1280: `outputs/bafurni-homepage-recovery-audit/before/homepage-1280.png`
- Mobile 390: `outputs/bafurni-homepage-recovery-audit/before/homepage-390.png`
- Link results: `outputs/bafurni-homepage-recovery-audit/before/link-audit.json`

## Quantitative baseline

| Metric | Production before reset |
|---|---:|
| Main sections | 13 |
| Total words in main | 1,386 |
| H1 | 1 |
| H2 | 11 |
| H3 | 3 |
| Total headings | 15 |
| Main images | 27 |
| Links/buttons in main + sticky CTA | 32 |
| Desktop page height | 16,601 px |
| Mobile page height | 25,393 px |
| Product category section position | approximately 3,143 px from top |
| Dedicated featured product grid | absent |
| Long corporate/supporting sections | 9 |

## Current section order

1. Hero
2. Brand introduction
3. Spaces served
4. Product categories
5. Solutions
6. Case-study block
7. Capability
8. Real operation
9. Coverage
10. Five-step process
11. Brand authority
12. Manifesto
13. Quote CTA

## Findings

### Information architecture

- Product categories appear only after three large brand/corporate sections.
- There is no real featured-product grid on the homepage.
- Six long V8 trust sections run consecutively after the category block.
- Product and category content do not approach the required 70% visual emphasis.
- The page behaves like a company profile with a catalog inserted into it, not a furniture retail homepage.

### Hero

- Headline is abstract and does not state what BA_Furniture sells.
- Hero is approximately 1,004 px high on desktop.
- Dark overlay and the fixed quote bar reduce product visibility.
- Hero contains three statistics and multiple actions, increasing first-screen density.

### Product categories

- Eight category cards exist and use real images.
- Card copy is longer than necessary and uses English/number labels.
- All eight main category cards point to the same `category.html` destination.
- Small chair groups also point to the same anchor instead of distinct category state.

### Product content

- No featured-product grid is rendered on the homepage.
- Product codes, dimensions, price state, and detail CTA are absent above the fold and from the homepage flow.

### Corporate density

Long sections currently shown in full:

- Case-study profiles
- Capability
- Real operation
- Coverage
- Five-step process
- Brand authority
- Manifesto

These should remain available as detail content but be reduced to short teasers on the homepage.

### Header and logo

- Header is transparent over the hero rather than a stable warm-white retail header.
- Official image asset is present, but the site name is inconsistent across metadata and page content.
- Header prioritizes brand/capability navigation over search and shopping orientation.
- No search control appears in the current V8 header.

### Color and typography

- Multiple consecutive dark sections create a corporate presentation rhythm.
- Background changes frequently between cream, paper, moss, and charcoal.
- Serif display headings are used heavily and at many scales.
- Eleven H2 headings create excessive editorial density.
- English labels remain in Vietnamese UI: Workplace, Shared space, Brand authority.

### Spacing and images

- Large vertical padding and tall image blocks produce a 16.6k desktop page.
- Mobile stacks all long sections, increasing height to more than 25k.
- Images are high quality, but several are used to support corporate narrative rather than product selection.

## Link and route audit

### HTTP 200

- `/`
- `/category.html`
- `/case-studies.html`
- all three case-study pages
- `/lead-config.js`
- current logo and category image assets

### Broken

- `/danh-muc/ghe-van-phong` → HTTP 404

### Structural link problem

- All eight homepage category cards currently point to `category.html`.
- The old clean category route is broken.
- The reset must give each visible group a distinct, working route or query state and must not introduce a redirect loop.

## Audit conclusion

Production fails the Product-First brief because products appear too late, no product grid exists, corporate sections dominate the lower page, and category routing is not distinct. The reset should retain the official asset library and case-study pages while rebuilding only the homepage order and route layer.
