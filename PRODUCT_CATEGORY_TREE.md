# BAFurniture Product Category Tree

Version: 0.1  
Date: 2026-07-07  
Scope: SPEC only. No ProductDB, Portal, UI, API, or render logic changes.

## Tree Format

- Level 1: `MainCategory`
- Level 2: `SubCategoryNormalized`
- Display names are customer-facing Vietnamese.
- IDs are stable ASCII identifiers for systems.

## 1. Ghế Văn Phòng

MainCategory ID: `OFFICE_CHAIR`  
Icon: `chair-office`

| SubCategory ID | Display Name | Icon ID | Source Mapping Hints |
|---|---|---|---|
| `EXECUTIVE_CHAIR` | Ghế giám đốc | `chair-executive` | `OFFICE_CHAIR`, names containing giám đốc, lãnh đạo |
| `MANAGER_CHAIR` | Ghế trưởng phòng / leader | `chair-manager` | leader, trưởng phòng, quản lý |
| `MESH_CHAIR` | Ghế lưới | `chair-mesh` | names/material containing lưới |
| `LEATHER_CHAIR` | Ghế da | `chair-leather` | `Variant=DA`, material/name containing da |
| `SWIVEL_CHAIR` | Ghế xoay | `chair-swivel` | names containing xoay |
| `VISITOR_CHAIR` | Ghế chân quỳ | `chair-visitor` | names containing chân quỳ |
| `MEETING_CHAIR` | Ghế phòng họp | `chair-meeting` | họp, phòng họp |
| `TRAINING_CHAIR` | Ghế training | `chair-training` | training, đào tạo |
| `FOLDING_CHAIR` | Ghế gấp | `chair-folding` | `GHE_GAP` |
| `HALL_CHAIR` | Ghế hội trường | `chair-hall` | `GHE_HOI_TRUONG` |
| `BAR_CHAIR` | Ghế bar | `chair-bar` | bar |
| `CAFE_CHAIR` | Ghế cafe | `chair-cafe` | cafe |

## 2. Bàn Văn Phòng

MainCategory ID: `OFFICE_DESK`  
Icon: `desk`

| SubCategory ID | Display Name | Icon ID | Source Mapping Hints |
|---|---|---|---|
| `STAFF_DESK` | Bàn nhân viên | `desk-staff` | `OFFICE_DESK`, nhân viên |
| `MANAGER_DESK` | Bàn trưởng phòng / quản lý | `desk-manager` | quản lý, trưởng phòng |
| `EXECUTIVE_DESK` | Bàn giám đốc | `desk-executive` | giám đốc, lãnh đạo |
| `WORKSTATION_DESK` | Bàn cụm / module | `desk-workstation` | cụm, module, workstation |
| `COMPUTER_DESK` | Bàn máy tính | `desk-computer` | `COMPUTER_DESK`, máy tính |
| `FOLDING_DESK` | Bàn gấp | `desk-folding` | `BAN_GAP` |
| `TRAINING_DESK` | Bàn đào tạo | `desk-training` | training, đào tạo |
| `RECEPTION_DESK` | Bàn lễ tân | `desk-reception` | lễ tân |

## 3. Bàn Họp

MainCategory ID: `MEETING_TABLE`  
Icon: `meeting-table`

| SubCategory ID | Display Name | Icon ID | Source Mapping Hints |
|---|---|---|---|
| `SMALL_MEETING_TABLE` | Bàn họp nhỏ | `meeting-table-small` | size/name small, dưới 2m |
| `LARGE_MEETING_TABLE` | Bàn họp lớn | `meeting-table-large` | size/name large, trên 2m |
| `OVAL_MEETING_TABLE` | Bàn họp oval | `meeting-table-oval` | oval |
| `MODULE_MEETING_TABLE` | Bàn họp module | `meeting-table-module` | module |
| `HALL_TABLE` | Bàn hội trường | `table-hall` | `BAN_HOI_TRUONG` |

## 4. Tủ & Hộc Tài Liệu

MainCategory ID: `CABINET_STORAGE`  
Icon: `cabinet`

| SubCategory ID | Display Name | Icon ID | Source Mapping Hints |
|---|---|---|---|
| `WOOD_CABINET` | Tủ gỗ văn phòng | `cabinet-wood` | `WOOD_CABINET`, tủ gỗ |
| `FILE_CABINET` | Tủ hồ sơ | `cabinet-file` | hồ sơ, tài liệu |
| `DOCUMENT_CABINET` | Tủ tài liệu | `cabinet-document` | tài liệu |
| `MOBILE_PEDESTAL` | Hộc di động | `pedestal-mobile` | `WOOD_PEDESTAL`, hộc |
| `STEEL_PEDESTAL` | Hộc sắt | `pedestal-steel` | `STEEL_PEDESTAL` |
| `LOW_CABINET` | Tủ thấp | `cabinet-low` | thấp |
| `WARDROBE_OFFICE` | Tủ áo văn phòng | `wardrobe-office` | wardrobe, tủ áo |

## 5. Tủ Sắt & Locker

MainCategory ID: `LOCKER_STEEL`  
Icon: `locker`

| SubCategory ID | Display Name | Icon ID | Source Mapping Hints |
|---|---|---|---|
| `STEEL_CABINET` | Tủ sắt văn phòng | `cabinet-steel` | `STEEL_CABINET` |
| `STEEL_LOCKER` | Tủ locker | `locker-grid` | `LOCKER`, `STEEL_LOCKER`, locker |
| `PHONE_LOCKER` | Tủ locker điện thoại | `locker-phone` | `STEEL_PHONE_LOCKER` |
| `TOOL_CABINET` | Tủ công cụ | `tool-cabinet` | `STEEL_TOOL_CABINET`, công cụ |
| `STEEL_WARDROBE` | Tủ sắt quần áo | `wardrobe-steel` | `STEEL_WARDROBE` |
| `KINDERGARTEN_CABINET` | Tủ mầm non | `cabinet-kindergarten` | `STEEL_CABINET_KINDERGARTEN` |
| `CUSTOM_STEEL_CABINET` | Tủ sắt gia công | `cabinet-custom` | `TỦ GIA CÔNG` |

## 6. Sofa & Ghế Chờ

MainCategory ID: `SOFA_WAITING`  
Icon: `sofa`

| SubCategory ID | Display Name | Icon ID | Source Mapping Hints |
|---|---|---|---|
| `OFFICE_SOFA` | Sofa văn phòng | `sofa-office` | `Sofa văn phòng`, `SOFA` |
| `CORNER_SOFA` | Bộ sofa góc | `sofa-corner` | `BO_SOFA_GOC` |
| `SOFA_SET` | Bộ ghế sofa | `sofa-set` | `BO_GHE_SOFA` |
| `WAITING_CHAIR` | Ghế chờ | `waiting-chair` | chờ |
| `LOBBY_SOFA` | Sofa sảnh | `sofa-lobby` | sảnh |
| `SOFA_TABLE` | Bàn sofa | `sofa-table` | `BAN_SOFA` |

## 7. Nội Thất Trường Học

MainCategory ID: `SCHOOL_FURNITURE`  
Icon: `graduation-cap`

| SubCategory ID | Display Name | Icon ID | Source Mapping Hints |
|---|---|---|---|
| `STUDENT_DESK` | Bàn học sinh | `student-desk` | `BAN_HOC_SINH` |
| `STUDENT_CHAIR` | Ghế học sinh | `student-chair` | `GHE_HOC_SINH` |
| `TEACHER_DESK` | Bàn giáo viên | `teacher-desk` | `BAN_GIAO_VIEN` |
| `CLASSROOM_SET` | Bàn ghế lớp học | `classroom-set` | `NOI_THAT_TRUONG_HOC` |
| `LIBRARY_FURNITURE` | Nội thất thư viện | `library` | thư viện |
| `KINDERGARTEN_FURNITURE` | Nội thất mầm non | `kindergarten` | mầm non |
| `SCHOOL_STORAGE` | Tủ/kệ trường học | `school-storage` | tủ trường học |

## 8. Kệ & Giá Kho

MainCategory ID: `SHELVING_RACK`  
Icon: `shelves`

| SubCategory ID | Display Name | Icon ID | Source Mapping Hints |
|---|---|---|---|
| `STEEL_SHELVING` | Kệ sắt | `shelves-steel` | `STEEL_SHELVING` |
| `WAREHOUSE_RACK` | Giá kho | `warehouse-rack` | giá kho |
| `DISPLAY_SHELF` | Kệ trưng bày | `display-shelf` | trưng bày |
| `ARCHIVE_SHELF` | Kệ lưu trữ hồ sơ | `archive-shelf` | hồ sơ, lưu trữ |

## 9. Nội Thất Công Cộng & Công Trình

MainCategory ID: `PUBLIC_PROJECT`  
Icon: `building-project`

| SubCategory ID | Display Name | Icon ID | Source Mapping Hints |
|---|---|---|---|
| `PROJECT_FURNITURE` | Nội thất công trình | `project-furniture` | `SAN_PHAM_CONG_TRINH` |
| `AUDITORIUM_FURNITURE` | Nội thất hội trường | `auditorium` | hội trường |
| `PODIUM` | Bục phát biểu | `podium` | `BUC_PHAT_BIEU` |
| `PUBLIC_SEATING` | Ghế khu công cộng | `public-seating` | công cộng |
| `CANTEEN_FURNITURE` | Bàn ghế ăn công nghiệp | `canteen` | canteen, bàn ăn công nghiệp |
| `CONSTRUCTION_CUSTOM` | Hạng mục theo bản vẽ | `blueprint` | bản vẽ, công trình |

## 10. Nội Thất Y Tế

MainCategory ID: `MEDICAL_FURNITURE`  
Icon: `medical-cross`

| SubCategory ID | Display Name | Icon ID | Source Mapping Hints |
|---|---|---|---|
| `MEDICAL_BED` | Giường y tế | `medical-bed` | `GIUONG_Y_TE` |
| `EXAM_TABLE` | Bàn khám bệnh | `exam-table` | `BAN_KHAM_BENH` |
| `MEDICAL_CABINET` | Tủ thuốc / tủ y tế | `medical-cabinet` | tủ thuốc |
| `MEDICAL_TROLLEY` | Xe đẩy y tế | `medical-trolley` | `XE_AY_Y_TE` |
| `CLINIC_FURNITURE` | Nội thất phòng y tế | `clinic` | `NOI_THAT_Y_TE` |

## 11. Nội Thất Gia Đình & Gia Dụng

MainCategory ID: `HOME_UTILITY`  
Icon: `home`

| SubCategory ID | Display Name | Icon ID | Source Mapping Hints |
|---|---|---|---|
| `HOME_FURNITURE` | Nội thất gia đình | `home-furniture` | `NOI_THAT_GIA_INH`, `GIA_DINH` |
| `HOME_UTILITY_PRODUCT` | Sản phẩm gia dụng | `home-utility` | `SAN_PHAM_GIA_DUNG`, `GIA_DUNG` |
| `BED` | Giường | `bed` | `GIUONG`, `GIƯỜNG` |
| `HOME_SOFA` | Sofa gia đình | `sofa-home` | sofa gia đình |

## 12. Vách & Phụ Kiện

MainCategory ID: `PARTITION_ACCESSORY`  
Icon: `layout-panel`

| SubCategory ID | Display Name | Icon ID | Source Mapping Hints |
|---|---|---|---|
| `OFFICE_PARTITION` | Vách văn phòng | `partition-office` | `OFFICE_PARTITION`, `VÁCH` |
| `ACCESSORY` | Phụ kiện nội thất | `accessory` | phụ kiện |
| `SPARE_PART` | Linh kiện / chi tiết thay thế | `spare-part` | linh kiện |

## Alias Rules

| Raw ProductDB Value | Target MainCategory |
|---|---|
| `GHẾ` | `OFFICE_CHAIR` unless school/sofa context says otherwise |
| `BÀN` | `OFFICE_DESK` unless meeting/hall/canteen context says otherwise |
| `TỦ` | `CABINET_STORAGE` or `LOCKER_STEEL` based on `SubCategory` |
| `HỘC` | `CABINET_STORAGE` |
| `KỆ` | `SHELVING_RACK` |
| `TRUONG_HOC` | `SCHOOL_FURNITURE` |
| `CONG_TRINH` | `PUBLIC_PROJECT` |
| `Y_TE` | `MEDICAL_FURNITURE` |
| `VÁCH` | `PARTITION_ACCESSORY` |
| `Sofa văn phòng` | `SOFA_WAITING` |
| `GIA_DINH`, `GIA_DUNG`, `GIƯỜNG` | `HOME_UTILITY` |

## Review Notes

This category tree is intentionally broader than current homepage navigation. Website navigation can show a smaller curated subset while ProductDB, Portal, AI Advisor, SEO, Quotation, and Marketing use the full normalized tree.
