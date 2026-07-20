# BAFurniture Product Icon System

Version: 0.1  
Date: 2026-07-07  
Scope: SPEC only. No icon package, UI, ProductDB, Portal, API, or render logic changes.

## Objective

Define a consistent icon language for BA_Furniture product classification across Website, Portal, mobile UI, PDF, catalogue, social, SEO visuals, quotation, and AI Advisor.

## Style Principles

1. Thin-line modern icons.
2. Rounded stroke caps and joins.
3. Consistent optical size.
4. Simple geometric shapes, no filled cartoon style.
5. Must work in one color.
6. Must remain readable at 16px, 20px, 24px, 32px, and 48px.
7. Should be exportable as SVG for website/portal and vector/PDF for catalogue.

## Icon Technical Standard

| Property | Standard |
|---|---|
| Format | SVG source preferred |
| Viewbox | `0 0 24 24` |
| Stroke | 1.75px or 2px |
| Fill | none |
| Stroke cap | round |
| Stroke join | round |
| Default color | currentColor |
| Minimum size | 16px |
| Preferred UI size | 20px or 24px |
| PDF/catalogue size | 24px to 48px |

## Level 1 Icon Set

| MainCategory ID | Display Name | Icon ID | Shape Description |
|---|---|---|---|
| `OFFICE_CHAIR` | Ghế văn phòng | `chair-office` | Office chair silhouette with back, seat, base. |
| `OFFICE_DESK` | Bàn văn phòng | `desk` | Rectangular desktop with legs or modesty panel. |
| `MEETING_TABLE` | Bàn họp | `meeting-table` | Long table with two chairs or centered table. |
| `CABINET_STORAGE` | Tủ & Hộc tài liệu | `cabinet` | Cabinet with two doors / drawer lines. |
| `LOCKER_STEEL` | Tủ sắt & Locker | `locker` | Locker grid with small handle dots. |
| `SOFA_WAITING` | Sofa & Ghế chờ | `sofa` | Sofa outline with arms. |
| `SCHOOL_FURNITURE` | Nội thất trường học | `graduation-cap` | Graduation cap or classroom desk. |
| `SHELVING_RACK` | Kệ & Giá kho | `shelves` | Multi-tier shelf. |
| `PUBLIC_PROJECT` | Nội thất công cộng & công trình | `building-project` | Building/project frame or blueprint. |
| `MEDICAL_FURNITURE` | Nội thất y tế | `medical-cross` | Medical cross with furniture base. |
| `HOME_UTILITY` | Nội thất gia đình & gia dụng | `home` | Home outline. |
| `PARTITION_ACCESSORY` | Vách & Phụ kiện | `layout-panel` | Partition panels / layout grid. |

## Level 2 Icon Set

### Ghế Văn Phòng

| SubCategory ID | Icon ID |
|---|---|
| `EXECUTIVE_CHAIR` | `chair-executive` |
| `MANAGER_CHAIR` | `chair-manager` |
| `MESH_CHAIR` | `chair-mesh` |
| `LEATHER_CHAIR` | `chair-leather` |
| `SWIVEL_CHAIR` | `chair-swivel` |
| `VISITOR_CHAIR` | `chair-visitor` |
| `MEETING_CHAIR` | `chair-meeting` |
| `TRAINING_CHAIR` | `chair-training` |
| `FOLDING_CHAIR` | `chair-folding` |
| `HALL_CHAIR` | `chair-hall` |
| `BAR_CHAIR` | `chair-bar` |
| `CAFE_CHAIR` | `chair-cafe` |

### Bàn Văn Phòng / Bàn Họp

| SubCategory ID | Icon ID |
|---|---|
| `STAFF_DESK` | `desk-staff` |
| `MANAGER_DESK` | `desk-manager` |
| `EXECUTIVE_DESK` | `desk-executive` |
| `WORKSTATION_DESK` | `desk-workstation` |
| `COMPUTER_DESK` | `desk-computer` |
| `FOLDING_DESK` | `desk-folding` |
| `TRAINING_DESK` | `desk-training` |
| `RECEPTION_DESK` | `desk-reception` |
| `SMALL_MEETING_TABLE` | `meeting-table-small` |
| `LARGE_MEETING_TABLE` | `meeting-table-large` |
| `OVAL_MEETING_TABLE` | `meeting-table-oval` |
| `MODULE_MEETING_TABLE` | `meeting-table-module` |
| `HALL_TABLE` | `table-hall` |

### Tủ / Locker / Kệ

| SubCategory ID | Icon ID |
|---|---|
| `WOOD_CABINET` | `cabinet-wood` |
| `FILE_CABINET` | `cabinet-file` |
| `DOCUMENT_CABINET` | `cabinet-document` |
| `MOBILE_PEDESTAL` | `pedestal-mobile` |
| `STEEL_PEDESTAL` | `pedestal-steel` |
| `LOW_CABINET` | `cabinet-low` |
| `WARDROBE_OFFICE` | `wardrobe-office` |
| `STEEL_CABINET` | `cabinet-steel` |
| `STEEL_LOCKER` | `locker-grid` |
| `PHONE_LOCKER` | `locker-phone` |
| `TOOL_CABINET` | `tool-cabinet` |
| `STEEL_WARDROBE` | `wardrobe-steel` |
| `KINDERGARTEN_CABINET` | `cabinet-kindergarten` |
| `CUSTOM_STEEL_CABINET` | `cabinet-custom` |
| `STEEL_SHELVING` | `shelves-steel` |
| `WAREHOUSE_RACK` | `warehouse-rack` |
| `DISPLAY_SHELF` | `display-shelf` |
| `ARCHIVE_SHELF` | `archive-shelf` |

### Sofa / School / Public / Medical / Home / Accessory

| SubCategory ID | Icon ID |
|---|---|
| `OFFICE_SOFA` | `sofa-office` |
| `CORNER_SOFA` | `sofa-corner` |
| `SOFA_SET` | `sofa-set` |
| `WAITING_CHAIR` | `waiting-chair` |
| `LOBBY_SOFA` | `sofa-lobby` |
| `SOFA_TABLE` | `sofa-table` |
| `STUDENT_DESK` | `student-desk` |
| `STUDENT_CHAIR` | `student-chair` |
| `TEACHER_DESK` | `teacher-desk` |
| `CLASSROOM_SET` | `classroom-set` |
| `LIBRARY_FURNITURE` | `library` |
| `KINDERGARTEN_FURNITURE` | `kindergarten` |
| `SCHOOL_STORAGE` | `school-storage` |
| `PROJECT_FURNITURE` | `project-furniture` |
| `AUDITORIUM_FURNITURE` | `auditorium` |
| `PODIUM` | `podium` |
| `PUBLIC_SEATING` | `public-seating` |
| `CANTEEN_FURNITURE` | `canteen` |
| `CONSTRUCTION_CUSTOM` | `blueprint` |
| `MEDICAL_BED` | `medical-bed` |
| `EXAM_TABLE` | `exam-table` |
| `MEDICAL_CABINET` | `medical-cabinet` |
| `MEDICAL_TROLLEY` | `medical-trolley` |
| `CLINIC_FURNITURE` | `clinic` |
| `HOME_FURNITURE` | `home-furniture` |
| `HOME_UTILITY_PRODUCT` | `home-utility` |
| `BED` | `bed` |
| `HOME_SOFA` | `sofa-home` |
| `OFFICE_PARTITION` | `partition-office` |
| `ACCESSORY` | `accessory` |
| `SPARE_PART` | `spare-part` |

## Icon Color Rules

| Context | Recommended Color |
|---|---|
| Website nav/category | `currentColor`, usually primary or text-muted |
| Active category | primary |
| CTA/helper icon | accent or primary |
| PDF/catologue | black, primary, or grayscale |
| Social | primary/accent, high contrast |

## Accessibility Rules

1. Decorative icons should use empty alt/aria-hidden in UI.
2. Informational icons need accessible labels.
3. Icon-only buttons must have text label via aria-label.
4. Icons cannot be the only way to communicate category; always pair with text in primary UI.

## Naming Rules

1. Icon IDs must be lowercase kebab-case.
2. MainCategory icon should be generic and reusable.
3. SubCategory icon can be more specific but must still work at 20px.
4. Do not use brand logos or supplier-specific marks as category icons.
5. Do not mix filled emoji-style icons with line icons.

## Implementation Note

This spec does not install or require an icon package. If using an external icon set later, map these `Icon ID` values to that library in a separate implementation issue.
