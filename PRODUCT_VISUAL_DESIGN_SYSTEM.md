# BAFurniture Product Visual Design System

Version: 0.1  
Date: 2026-07-07  
Scope: Design specification only. No HTML, CSS, JS, ProductDB, Portal, API, or render logic changes.

## Objective

This document defines the visual design system for BAFurniture product presentation across Website, Portal, catalogue, quotation, marketing, and future AI Advisor surfaces.

It extends the product classification specs:

- `PRODUCT_CLASSIFICATION_SYSTEM.md`
- `PRODUCT_CATEGORY_TREE.md`
- `PRODUCT_IMAGE_STANDARD.md`
- `PRODUCT_ICON_SYSTEM.md`
- `PRODUCT_DATA_MAPPING.md`

The goal is to make every product and category presentation feel consistent, premium, practical, and easy to scan for business buyers.

## Design Principles

| Principle | Rule |
|---|---|
| Product-first | Images, names, codes, category, price status, and CTA must be clear before decoration. |
| Premium but practical | Use bright surfaces, restrained borders, soft shadows, and confident spacing. |
| B2B clarity | Support quick comparison, quotation, bulk buying, and project selection. |
| System consistency | Use existing design tokens for color, spacing, radius, shadow, typography, and transition. |
| Mobile-ready | Product browsing must remain readable and tappable on mobile. |
| Fallback-safe | Missing images, prices, or codes must still produce a professional card. |

## Existing Token Alignment

Use the current website token families as the source of truth:

| Token Family | Intended Usage |
|---|---|
| Color | Brand, text, surface, border, success, warning, danger, Zalo CTA. |
| Spacing | Component padding, card gaps, grid gaps, content rhythm. |
| Radius | Cards, image containers, badges, CTA elements. |
| Shadow | Product card emphasis, floating panels, premium depth. |
| Font | Primary text, heading text, optional mono text for product codes. |
| Transition | Hover, focus, card elevation, CTA feedback. |

Do not introduce visual values directly in implementation. New visual needs should become tokens first.

## 1. Category Card Design

### Purpose

Category cards help users quickly understand BAFurniture's product range and navigate from broad groups to specific buying needs.

They must work for:

- Homepage category preview.
- Product listing filters.
- Category landing pages.
- Portal navigation.
- PDF catalogue category blocks.

### Components

| Component | Description |
|---|---|
| Card nhóm lớn | Large category card for Level 1 categories such as Ghế văn phòng, Bàn văn phòng, Tủ & Hộc tài liệu. |
| Card nhóm nhỏ | Compact category card for Level 2 categories such as Ghế giám đốc, Ghế lưới, Bàn nhân viên. |
| Card icon | Small icon-first card for filter menus, mobile category strips, or quick navigation. |
| Card landing | Rich category card for landing pages with image, description, key use cases, and CTA. |

### Rules

| Area | Rule |
|---|---|
| Structure | Image or icon first, then category name, short description, and optional CTA. |
| Visual weight | Level 1 card should feel stronger than Level 2 card. |
| Image | Use category representative image for large cards; use icon or cropped thumbnail for compact cards. |
| Text | Category name must be immediately readable; description should be one short sentence. |
| Border | Use subtle border token to separate cards from background. |
| Radius | Use radius token consistently with existing card system. |
| Shadow | Use soft shadow only when the card needs emphasis or hover depth. |
| Hover | Slight lift, border emphasis, or image clarity change; no colorful or aggressive motion. |
| CTA | Keep CTA lightweight: Xem danh mục, Xem sản phẩm, Nhận tư vấn. |
| Missing image | Use category placeholder from `PRODUCT_IMAGE_STANDARD.md`. |

### Examples

| Card Type | Example |
|---|---|
| Card nhóm lớn | Ghế văn phòng: icon chair-line, image of office task chairs, description "Ghế xoay, ghế lưới, ghế họp và ghế lãnh đạo cho văn phòng hiện đại." |
| Card nhóm nhỏ | Ghế lưới: compact icon, name, one-line description "Thoáng lưng, phù hợp làm việc nhiều giờ." |
| Card icon | Tủ locker: icon locker-line, label only, used inside horizontal mobile category menu. |
| Card landing | Nội thất trường học: classroom image, category summary, use cases, CTA to view products or request quote. |

## 2. Product Card Design

### Purpose

Product cards help customers scan, compare, and request quotes quickly without needing full product detail immediately.

### Components

| Component | Description |
|---|---|
| Image area | Product thumbnail or fallback placeholder. |
| Badge area | Optional badges such as NEW, HOT, SALE, BEST. |
| Product name | Customer-facing product name. |
| Product code | Stable product identifier from ProductDB. |
| Metadata | Category, size, material, or short attribute line if available. |
| Price status | Sale price, catalogue price, or "Liên hệ báo giá". |
| CTA | Lightweight action such as Xem chi tiết or Nhận báo giá. |

### Rules

| Area | Rule |
|---|---|
| Card tone | Bright, clean, premium, easy to scan. |
| Image ratio | Default listing image should use 1:1. Use object contain for isolated product photos. |
| Image background | Prefer neutral surface so chairs, desks, and cabinets are not visually cropped or distorted. |
| Name | Product name should support two readable lines before truncation. |
| Code | Product code must remain visible when available; use a quieter visual style than product name. |
| Price | Price or contact-price line should be clearer than metadata but less dominant than CTA. |
| CTA | CTA should be tappable, accessible, and visually consistent with the product system. |
| Hover | Slight elevation and border emphasis; image must not jump or distort. |
| Fallback | If no image, use product placeholder. If no price, show "Liên hệ báo giá". |
| Accessibility | Entire interactive area must have visible focus state. CTA text must describe the action clearly. |

### Example

| Field | Example Display |
|---|---|
| Product name | Ghế lưới nhân viên BA-GL01 |
| Product code | Mã: BA-GL01 |
| Metadata | Ghế văn phòng / Lưới / Chân xoay |
| Price | Liên hệ báo giá |
| CTA | Nhận báo giá |

## 3. Product Detail Layout

### Purpose

Product detail pages should support deeper evaluation, quotation, and project decision-making.

Even before ProductDB integration, the design pattern should be stable enough for future detail pages.

### Components

| Component | Description |
|---|---|
| Breadcrumb | Helps users understand category path. |
| Gallery | Product image set following `PRODUCT_IMAGE_STANDARD.md`. |
| Product summary | Product name, code, category, price status, and CTA. |
| Specification block | Size, material, color, structure, usage, warranty if available. |
| Quote panel | Hotline, quote CTA, Zalo placeholder if no official link. |
| Description | Short business-oriented product description. |
| Related products | Similar products or same category suggestions. |
| Category return | Link back to category listing or Portal search. |

### Rules

| Area | Rule |
|---|---|
| Desktop layout | Gallery left, summary right, detail content below or beside depending on content depth. |
| Tablet layout | Keep gallery and summary near each other; avoid overly narrow specification tables. |
| Mobile layout | Stack gallery, summary, CTA, specs, then related products. |
| CTA priority | Quote CTA and hotline must remain visible near product summary. |
| Specs | Use structured rows, not long paragraphs, for size/material/price/category. |
| Long content | Separate description, specifications, and related products into clear sections. |
| Missing fields | Hide empty optional rows instead of showing blank values. |

### Example

Product detail flow:

1. Breadcrumb: Sản phẩm / Ghế văn phòng / Ghế lưới.
2. Gallery: Hero image, 45-degree image, material detail, dimension image.
3. Summary: Ghế lưới nhân viên BA-GL01, product code, contact price, quote CTA.
4. Specs: Size, material, color, structure, use case.
5. Related products: Other office chairs or same collection.

## 4. Gallery Layout

### Purpose

Gallery layout helps customers inspect the product from enough angles to make a purchase or quotation decision.

### Components

| Component | Description |
|---|---|
| Main image | Large current image, usually product hero image. |
| Thumbnail rail | Small image selectors in the standard image order. |
| Image labels | Optional short labels such as Kích thước, Vật liệu, Ảnh thực tế. |
| Zoom state | Optional future behavior for product detail pages. |
| Fallback image | Professional placeholder when no usable image exists. |

### Rules

| Area | Rule |
|---|---|
| Order | Follow product image group order: Hero, 45-degree, front, side, back, material, structure, dimension, real photo, catalogue/PDF. |
| Main image ratio | Use 1:1 for isolated products; use 4:3 or 16:9 for scene or project images. |
| Thumbnails | Keep consistent size and crop behavior. |
| Product visibility | Do not crop essential parts such as chair legs, desk edges, cabinet handles, or dimensions. |
| Background | Use neutral, bright background for catalogue images. |
| Real photos | Mark as real/project photo if mixed with catalogue images. |
| Missing image | Show fallback at the same ratio as the intended image slot. |

### Example

Gallery sequence for an office chair:

1. Hero product on neutral background.
2. 45-degree angle.
3. Front view.
4. Side view.
5. Back view.
6. Mesh material close-up.
7. Armrest or base detail.
8. Dimension diagram.
9. Real office installation photo.
10. Catalogue PDF link.

## 5. Image Ratio

### Purpose

Image ratios keep product surfaces consistent and prevent layout jumps across cards, galleries, banners, and catalogues.

### Components

| Ratio | Usage |
|---|---|
| 1:1 | Product listing cards, compact product thumbnails, Portal grids. |
| 4:3 | Product detail gallery, category cards, standard catalogue blocks. |
| 3:2 | Rich category image, project preview, showroom-style product image. |
| 16:9 | Hero showcase, landing page banner, project image, wide solution block. |
| 2:1 | Slim promotional strip, category landing header, quotation cover image. |
| A4 portrait | PDF catalogue page and quotation product sheet. |

### Rules

| Area | Rule |
|---|---|
| Product card | Default to 1:1 so grids stay balanced. |
| Category card | Use 4:3 or 3:2 depending on card size. |
| Hero/landing | Use 16:9 or wider composition. |
| Product detail | Main gallery may use 1:1 for product-only images or 4:3 for contextual images. |
| Placeholder | Match the same ratio as the missing asset slot. |
| Cropping | Use contain for individual product cutouts; use cover only for room/project imagery. |

### Example

| Surface | Recommended Ratio |
|---|---|
| Product card grid | 1:1 |
| Category preview card | 4:3 |
| Product detail main image | 1:1 or 4:3 |
| Project/customer section | 16:9 |
| PDF product sheet image | 4:3 or A4-safe crop |

## 6. Placeholder Design

### Purpose

Placeholders protect the buying experience when a product image, category image, or data field is missing.

### Components

| Component | Description |
|---|---|
| Product placeholder | Neutral product frame with category icon and updating message. |
| Category placeholder | Soft category background with Level 1 icon. |
| Error image | Clear but quiet failed-image state. |
| Updating image | Indicates image is being updated, not unavailable permanently. |
| Catalogue placeholder | PDF or document placeholder when catalogue file is missing. |

### Rules

| Area | Rule |
|---|---|
| Tone | Calm, professional, not alarming. |
| Color | Use muted surface and border tokens; do not use danger color unless there is a true error state. |
| Icon | Use category icon when category is known. |
| Text | Keep message short: Đang cập nhật ảnh, Ảnh sản phẩm đang cập nhật. |
| Ratio | Placeholder must preserve the expected image ratio. |
| Accessibility | Placeholder text should communicate the missing content state. |

### Example

| Missing Asset | Placeholder |
|---|---|
| Product image | Category icon plus text "Ảnh sản phẩm đang cập nhật". |
| Category image | Level 1 icon plus category name. |
| Real project photo | Neutral project placeholder plus "Ảnh thực tế đang cập nhật". |
| PDF catalogue | Document icon plus "Catalogue đang cập nhật". |

## 7. Badge Design

### Purpose

Badges highlight product status, commercial priority, or availability without overwhelming the card.

### Components

| Badge | Meaning |
|---|---|
| NEW | New product or newly added to catalogue. |
| HOT | High-interest or frequently requested product. |
| SALE | Discounted or promotional product. |
| BEST | Best-selling or recommended product. |
| PROJECT | Suitable for project procurement. |
| CUSTOM | Made-to-order or customizable. |
| READY | Ready-stock or fast availability, only when confirmed. |
| CONTACT | Price requires quotation. |

### Rules

| Area | Rule |
|---|---|
| Placement | Top-left of product image or top area of card. |
| Quantity | Maximum two badges per product card. |
| Priority | SALE > HOT > BEST > NEW > PROJECT > CUSTOM > READY > CONTACT. |
| Color | Use semantic tokens: warning for SALE/HOT, success or primary for BEST/READY, neutral for CUSTOM/PROJECT/CONTACT. |
| Shape | Use pill or compact rounded rectangle with radius token. |
| Text | Short uppercase label for product cards; Vietnamese explanation can appear in detail page. |
| Accessibility | Badge meaning must not rely only on color. |

### Example

| Product Condition | Badge Display |
|---|---|
| New imported chair line | NEW |
| Frequently requested office desk | HOT |
| Promotional locker item | SALE |
| Recommended chair for project quote | BEST + PROJECT |
| Custom size cabinet | CUSTOM |

## 8. Icon Style Guide

### Purpose

Icons create a consistent product navigation language across category cards, filters, Portal views, PDF catalogue, and social graphics.

### Components

| Component | Rule |
|---|---|
| Level 1 icon | Used for broad category recognition. |
| Level 2 icon | Used for subcategory browsing and filters. |
| Utility icon | Used for CTA, quote, phone, Zalo, size, material, delivery. |
| Empty-state icon | Used in placeholders and missing content states. |

### Rules

| Area | Rule |
|---|---|
| Style | Thin-line, modern, geometric, rounded stroke ends. |
| Weight | Use one consistent stroke weight across the system. |
| Fill | Prefer outline icons; avoid heavy filled pictograms unless used for badges. |
| Color | Use current text or category color; avoid multi-color icon sets. |
| Detail | Icons must remain readable at small sizes. |
| Format | SVG preferred for system icons; raster only for rich illustrations. |
| Naming | Follow the names defined in `PRODUCT_ICON_SYSTEM.md`. |

### Example

| Category | Icon Direction |
|---|---|
| Ghế văn phòng | Minimal task chair outline. |
| Bàn văn phòng | Desk surface and legs outline. |
| Tủ & Hộc tài liệu | Cabinet drawer outline. |
| Sofa & Ghế chờ | Sofa silhouette outline. |
| Nội thất trường học | Desk and chair or classroom board outline. |

## 9. Color Usage

### Purpose

Color usage should reinforce BAFurniture's premium, practical, business-oriented identity without making product pages noisy.

### Components

| Color Role | Usage |
|---|---|
| Primary | Main brand actions, selected states, important accents. |
| Secondary | Supporting headings, dark surfaces, premium contrast zones. |
| Accent | Limited commercial highlights such as SALE or key CTA accents. |
| Background | Page background and wide section background. |
| Surface | Cards, panels, product containers. |
| Border | Card boundaries, dividers, form edges, gallery rails. |
| Text primary | Product names, headings, important content. |
| Text secondary | Descriptions, metadata, product code, helper text. |
| Success | Confirmed availability, best/recommended, completed states. |
| Warning | Sale, hot, attention-worthy commercial states. |
| Danger | Error only, not decoration. |

### Rules

| Area | Rule |
|---|---|
| Product cards | Mostly surface, border, text, and one CTA color. |
| Category cards | May use a light category accent but must stay restrained. |
| Badges | Use semantic color, not arbitrary category color. |
| Detail pages | CTA and quote states should be visually clear but not overly bright. |
| Contrast | Text and CTA must remain readable on all backgrounds. |
| Brand tone | Avoid overly saturated palettes or too many competing colors in one section. |

### Example

| UI Element | Color Direction |
|---|---|
| Primary quote CTA | Primary background, inverse text. |
| Secondary product CTA | Surface background, primary border or text. |
| SALE badge | Accent or warning tone. |
| Product code | Text secondary. |
| Card border | Border token. |

## 10. Spacing Rule

### Purpose

Spacing rules keep product browsing calm, readable, and consistent across dense grids and rich detail pages.

### Components

| Spacing Area | Description |
|---|---|
| Card padding | Inner room around product image and text. |
| Grid gap | Space between product/category cards. |
| Section spacing | Vertical rhythm between homepage/product sections. |
| Text stack | Space between name, code, metadata, price, and CTA. |
| Gallery spacing | Space between main image and thumbnails. |
| Detail spacing | Space between summary, specs, quote panel, and related products. |

### Rules

| Area | Rule |
|---|---|
| Use tokens | Use existing spacing tokens only. |
| Density | Product listing should be compact enough for scanning but not cramped. |
| Hierarchy | Larger spacing should separate sections; smaller spacing should group related product info. |
| Mobile | Reduce layout complexity, not readability. |
| CTA | Keep enough room around action buttons for touch usage. |
| Card grid | Maintain consistent gaps across rows and columns. |

### Example

| Surface | Spacing Direction |
|---|---|
| Product card | Medium internal padding, small text stack gaps. |
| Category grid | Consistent grid gap, stronger section top/bottom spacing. |
| Product detail | Large gap between gallery and summary on desktop; stacked rhythm on mobile. |
| Badge | Tight internal padding, visually compact. |

## 11. Typography Rule

### Purpose

Typography should make product names, categories, and quotation actions easy to understand at a glance.

### Components

| Text Type | Usage |
|---|---|
| Page heading | Category landing and product detail title. |
| Section heading | Homepage sections and listing groups. |
| Product name | Main card title and detail title. |
| Product code | SKU-like identifier for quotation and customer support. |
| Metadata | Category, size, material, use case. |
| Price/contact text | Price display or quote status. |
| CTA text | Action labels. |
| Badge text | Compact status label. |

### Rules

| Area | Rule |
|---|---|
| Font family | Use existing font tokens. |
| Product name | Stronger than metadata; readable in two lines on cards. |
| Product code | Smaller or quieter, but never hidden if available. |
| Metadata | Secondary color and compact rhythm. |
| CTA | Clear, concise, action-oriented. |
| Badge | Uppercase short labels for cards. |
| Detail page | Product title should be prominent, but specs must remain easy to scan. |
| Line length | Descriptions should avoid overly long lines on desktop. |

### Example

| Text | Visual Priority |
|---|---|
| "Ghế lưới nhân viên BA-GL01" | High priority product name. |
| "Mã: BA-GL01" | Secondary but visible. |
| "Lưới / Chân xoay / Văn phòng" | Metadata. |
| "Liên hệ báo giá" | Commercial status. |
| "Nhận báo giá" | CTA. |

## 12. Responsive Wireframe

### Purpose

Responsive wireframes define how product/category surfaces adapt across desktop, tablet, and mobile before implementation.

### Components

| Breakpoint Type | Primary Goal |
|---|---|
| Desktop | Show more product/category options per row with strong visual hierarchy. |
| Tablet | Preserve comparison ability while reducing column count. |
| Mobile | Stack content, keep images stable, make CTA easy to tap. |

### Desktop Wireframe

Purpose: Support product scanning, comparison, and quotation.

Component:

- Page heading or category heading.
- Optional filter/sidebar for product listing.
- Product grid with 3 to 4 cards per row.
- Category cards in 3 to 4 columns.
- Product detail as gallery plus summary two-column layout.

Rule:

- Keep header and section rhythm calm.
- Use consistent card heights where practical.
- Keep CTA visible inside each product card.
- Avoid overly wide product descriptions.

Example:

Desktop product listing:

1. Category title and description.
2. Filter or category shortcut row.
3. Product grid.
4. CTA band for quote support.

### Tablet Wireframe

Purpose: Preserve readability and touch comfort on medium screens.

Component:

- Category cards in 2 columns.
- Product cards in 2 columns.
- Product detail gallery above or beside summary depending on available width.
- CTA remains near summary.

Rule:

- Avoid three dense product columns if text becomes cramped.
- Use the same image ratios as desktop.
- Keep touch targets comfortable.

Example:

Tablet category landing:

1. Heading.
2. Two-column category card grid.
3. Two-column product preview grid.
4. Quote CTA.

### Mobile Wireframe

Purpose: Make product browsing clear on a narrow screen.

Component:

- Single-column product cards or compact two-column only when text remains readable.
- Horizontal category shortcut strip if needed.
- Product detail stacked vertically.
- CTA buttons placed close to product summary.

Rule:

- Images must not become too short or crop the product.
- Product name and price/contact line must remain visible.
- Avoid side-by-side specs that force tiny text.
- Keep badge count minimal.

Example:

Mobile product detail:

1. Product gallery.
2. Product name and code.
3. Price/contact state.
4. CTA group.
5. Specs.
6. Description.
7. Related products.

## Cross-System Usage

| System | Usage |
|---|---|
| Website | Homepage sections, category preview, product listing shell, future product detail. |
| Portal | Category navigation, product cards, filters, quote preparation. |
| ProductDB | Image group naming, category metadata, badge source fields. |
| AI Advisor | Product recommendation cards and explanation blocks. |
| SEO | Category landing visual hierarchy and product preview snippets. |
| Quotation | Product line item presentation and PDF product blocks. |
| Marketing | Social category cards, catalogue pages, campaign product cards. |

## Quality Checklist

| Check | PASS Criteria |
|---|---|
| Product image | Clear, stable ratio, not distorted. |
| Product name | Readable and not visually lost. |
| Product code | Visible when available. |
| Price/contact | Clear enough for quotation flow. |
| CTA | Action is obvious and accessible. |
| Badge | Meaning is clear without relying only on color. |
| Placeholder | Looks intentional, not broken. |
| Category card | Category purpose is understandable in one scan. |
| Mobile | No cramped product text or broken card layout. |
| Token usage | Visual implementation uses design tokens, not hard-coded values. |

## Do Not Do

- Do not distort product images to fill a frame.
- Do not crop important product details.
- Do not show more than two badges on a compact card.
- Do not use decorative colors that compete with product information.
- Do not hide product code when it exists.
- Do not use placeholder imagery that looks like a broken asset.
- Do not mix filled, outlined, and illustrative icon styles in one surface.
- Do not make Product Detail depend on long unstructured paragraphs.
- Do not create a separate visual language for Portal, Website, and Catalogue.

## Stop Rule Confirmation

This document is a visual design specification only. It does not modify HTML, CSS, JS, ProductDB, Portal, API, or deployment configuration.
