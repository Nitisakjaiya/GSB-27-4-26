# Database Schema Design (CTMNG)

**RDBMS:** Microsoft SQL Server (MSSQL)

**ORM:** Prisma

**Version:** 1.0 (Updated: 2026-04-24)

---

## 📌 Document Overview

| Section                | Description                                      |
| ---------------------- | ------------------------------------------------ |
| 1. Authentication      | ตาราง User และ Department                        |
| 2. Master Data         | ตารางข้อมูลอ้างอิง (Lookup Tables)               |
| 3. Contract Module     | ข้อมูลสัญญาจริง                                  |
| 4. Planning Module     | ร่างแผนงานล่วงหน้า                               |
| 5. Polymorphic Modules | ตารางที่ใช้ร่วมกัน (Committees, Tracking, Files) |
| 6. Budget              | การกระจายงบประมาณ                                |
| 7. Audit Trail         | ประวัติการแก้ไข                                  |
| 8. Project Assignment  | การมอบหมายงาน 🔮 Phase 2                         |
| 9. Message System      | ระบบข้อความและการแจ้งเตือน                       |
| 10. Index Strategy     | แนวทางการสร้าง Index                             |

> **สัญลักษณ์:** 🔮 = ฟิลด์/ตารางที่เตรียมไว้สำหรับ Phase 2

---

## 💡 Standard Columns (มีในทุกตารางหลักและตาราง Transaction)

เพื่อให้เอกสารกระชับ ตารางที่มีสัญลักษณ์ `[+Std Cols]` จะต้องมี 7 ฟิลด์นี้เสมอ:

| **Field Name** | **Type** | **Default** | **Description**              |
| -------------- | -------- | ----------- | ---------------------------- |
| `created_at`   | DATETIME | GETDATE()   | วันที่สร้าง                  |
| `created_by`   | BIGINT   | -           | ผู้สร้าง (FK: tb_user)       |
| `updated_at`   | DATETIME | -           | วันที่แก้ไขล่าสุด            |
| `updated_by`   | BIGINT   | -           | ผู้แก้ไขล่าสุด (FK: tb_user) |
| `is_deleted`   | BIT      | 0           | สถานะการลบ (Soft Delete)     |
| `deleted_at`   | DATETIME | NULL        | วันที่ลบ                     |
| `deleted_by`   | BIGINT   | NULL        | ผู้ลบ (FK: tb_user)          |

---

## 1. Authentication & Users

### `tb_user` (ใช้สำหรับ Login)

> **หมายเหตุ:** Phase 1 ใช้ Dev Mode (password_hash), Phase 2 ใช้ Active Directory

| **Field Name**    | **Type** | **Size** | **Key** | **Description / Remark**                    |
| ----------------- | -------- | -------- | ------- | ------------------------------------------- |
| `user_id`         | BIGINT   | -        | PK      | รหัสผู้ใช้งาน (Auto)                        |
| `username`        | NVARCHAR | 50       | UK      | รหัสเข้าใช้งานระบบ / AD Username            |
| `password_hash`   | NVARCHAR | MAX      | -       | รหัสผ่านที่เข้ารหัสแล้ว (ใช้เฉพาะ Dev)      |
| `display_name`    | NVARCHAR | 150      | -       | ชื่อ-นามสกุลแสดงผล                          |
| `email`           | NVARCHAR | 150      | -       | อีเมล                                       |
| `role`            | NVARCHAR | 20       | -       | สิทธิ์ระบบ (ADMIN, USER, VIEWER)            |
| `department_code` | NVARCHAR | 20       | FK      | รหัสหน่วยงาน (เชื่อม tb_department) 🔮 Ph2  |
| `position_title`  | NVARCHAR | 100      | -       | ตำแหน่งงาน (จาก AD) 🔮 Phase 2              |
| `position_level`  | NVARCHAR | 20       | -       | ระดับตำแหน่ง (STAFF, SECTION_HEAD, etc.) 🔮 |
| `manager_user_id` | BIGINT   | -        | FK      | รหัสหัวหน้า (Self FK: tb_user) 🔮 Phase 2   |
| `ad_guid`         | NVARCHAR | 50       | UK      | AD Object GUID (สำหรับ sync) 🔮 Phase 2     |
| `last_login`      | DATETIME | -        | -       | วันเวลา Login ล่าสุด                        |
| `is_active`       | BIT      | 1        | -       | สถานะการใช้งาน                              |
| `[+Std Cols]`     | -        | -        | -       | -                                           |

**Position Levels (Phase 2):** | Code | Description | |------|-------------| | `STAFF` | เจ้าหน้าที่ปฏิบัติการ | | `SECTION_HEAD` | หัวหน้าส่วนงาน | | `DEPT_HEAD` | หัวหน้าฝ่าย | | `DIVISION_HEAD` | หัวหน้าสำนัก | | `EXECUTIVE` | ผู้บริหาร |

### `tb_department` (หน่วยงาน/แผนก) 🔮 Phase 2

> **หมายเหตุ:** Sync จาก Active Directory หรือบันทึกด้วยตนเอง

| **Field Name** | **Type** | **Size** | **Key** | **Description / Remark**                |
| -------------- | -------- | -------- | ------- | --------------------------------------- |
| `dept_code`    | NVARCHAR | 20       | PK      | รหัสหน่วยงาน                            |
| `dept_name`    | NVARCHAR | 150      | -       | ชื่อหน่วยงาน                            |
| `dept_name_en` | NVARCHAR | 150      | -       | ชื่อหน่วยงาน (English)                  |
| `parent_code`  | NVARCHAR | 20       | FK      | รหัสหน่วยงานแม่ (Self FK)               |
| `dept_level`   | INT      | -        | -       | ระดับหน่วยงาน (1=สำนัก, 2=ฝ่าย, 3=ส่วน) |
| `ad_ou_path`   | NVARCHAR | 255      | -       | AD Organizational Unit Path 🔮          |
| `sort_order`   | INT      | -        | -       | ลำดับการแสดงผล                          |
| `is_active`    | BIT      | 1        | -       | สถานะการใช้งาน                          |

---

## 2. Master Data (ตารางข้อมูลอ้างอิง)

> **หมายเหตุ:** ตาราง Master Data ไม่จำเป็นต้องมี Soft Delete แต่ควรมี `is_active` เพื่อปิดการใช้งาน

### `tb_category` (หมวดหมู่สัญญา)

| **Field Name** | **Type** | **Size** | **Key** | **Description / Remark** |
| -------------- | -------- | -------- | ------- | ------------------------ |
| `cat_code`     | NVARCHAR | 20       | PK      | รหัสหมวดหมู่             |
| `cat_name`     | NVARCHAR | 100      | -       | ชื่อหมวดหมู่             |
| `sort_order`   | INT      | -        | -       | ลำดับการแสดงผล           |
| `is_active`    | BIT      | 1        | -       | สถานะการใช้งาน           |

### `tb_contract_type` (วิธีดำเนินการ / ประเภทสัญญา)

| **Field Name** | **Type** | **Size** | **Key** | **Description / Remark**                       |
| -------------- | -------- | -------- | ------- | ---------------------------------------------- |
| `ctype_code`   | NVARCHAR | 20       | PK      | รหัสประเภท (เช่น E-BIDDING)                    |
| `ctype_name`   | NVARCHAR | 100      | -       | ชื่อประเภท (เช่น วิธีประกวดราคาอิเล็กทรอนิกส์) |
| `sort_order`   | INT      | -        | -       | ลำดับการแสดงผล                                 |
| `is_active`    | BIT      | 1        | -       | สถานะการใช้งาน                                 |

### `tb_committee_type` (ประเภทคณะกรรมการ)

| **Field Name**   | **Type** | **Size** | **Key** | **Description / Remark**             |
| ---------------- | -------- | -------- | ------- | ------------------------------------ |
| `cmit_type_code` | NVARCHAR | 20       | PK      | รหัสประเภท (เช่น TOR, BUY, INSP)     |
| `cmit_type_name` | NVARCHAR | 100      | -       | ชื่อประเภท (เช่น คณะกรรมการร่าง TOR) |
| `sort_order`     | INT      | -        | -       | ลำดับการแสดงผล                       |
| `is_active`      | BIT      | 1        | -       | สถานะการใช้งาน                       |

### `tb_planning_status` (สถานะแผนงาน) ⭐ NEW

| **Field Name**     | **Type** | **Size** | **Key** | **Description / Remark**                         |
| ------------------ | -------- | -------- | ------- | ------------------------------------------------ |
| `plan_status_code` | NVARCHAR | 20       | PK      | รหัสสถานะ (PENDING, DRAFTING, REVIEWING, FINISH) |
| `plan_status_name` | NVARCHAR | 100      | -       | ชื่อสถานะแสดงผล                                  |
| `color_code`       | NVARCHAR | 10       | -       | รหัสสีสำหรับ UI (เช่น #FFA500)                   |
| `sort_order`       | INT      | -        | -       | ลำดับการแสดงผล                                   |
| `is_active`        | BIT      | 1        | -       | สถานะการใช้งาน                                   |

**Default Values:** | Code | Name | Color | Description | |------|------|-------|-------------| | `PENDING` | รอดำเนินการ | #6B7280 (Gray) | สร้างใหม่ รอเริ่มทำงาน | | `DRAFTING` | กำลังร่าง | #3B82F6 (Blue) | กำลังทำงานกับแผน | | `REVIEWING` | รออนุมัติ | #F59E0B (Amber) | ส่งตรวจสอบ/อนุมัติ | | `FINISH` | เสร็จสิ้น | #10B981 (Green) | ปิดแผน → สร้าง Contract | | `CANCELLED` | ยกเลิก | #9CA3AF (Gray) | ยกเลิกแผน |

### `tb_tracking_type` (ประเภทการติดตาม) ⭐ NEW

| **Field Name**  | **Type** | **Size** | **Key** | **Description / Remark**                |
| --------------- | -------- | -------- | ------- | --------------------------------------- |
| `trk_type_code` | NVARCHAR | 20       | PK      | รหัสประเภท (ISSUE, PROGRESS, MILESTONE) |
| `trk_type_name` | NVARCHAR | 100      | -       | ชื่อประเภทแสดงผล                        |
| `icon`          | NVARCHAR | 50       | -       | ชื่อ Icon สำหรับ UI                     |
| `sort_order`    | INT      | -        | -       | ลำดับการแสดงผล                          |
| `is_active`     | BIT      | 1        | -       | สถานะการใช้งาน                          |

**Default Values:** | Code | Name | Icon | |------|------|------| | `ISSUE` | ปัญหา/อุปสรรค | AlertCircle | | `PROGRESS` | ความคืบหน้า | TrendingUp | | `MILESTONE` | เหตุการณ์สำคัญ | Flag | | `NOTE` | บันทึกทั่วไป | FileText |

### `tb_contract_status` (สถานะสัญญา) ⭐ NEW

| **Field Name**   | **Type** | **Size** | **Key** | **Description / Remark**                |
| ---------------- | -------- | -------- | ------- | --------------------------------------- |
| `ct_status_code` | NVARCHAR | 20       | PK      | รหัสสถานะ (ACTIVE, EXPIRED, TERMINATED) |
| `ct_status_name` | NVARCHAR | 100      | -       | ชื่อสถานะแสดงผล                         |
| `color_code`     | NVARCHAR | 10       | -       | รหัสสีสำหรับ UI                         |
| `sort_order`     | INT      | -        | -       | ลำดับการแสดงผล                          |
| `is_active`      | BIT      | 1        | -       | สถานะการใช้งาน                          |

**Default Values:** | Code | Name | Color | |------|------|-------| | `ACTIVE` | มีผลบังคับใช้ | #10B981 (Green) | | `EXPIRED` | หมดอายุ | #F59E0B (Amber) | | `TERMINATED` | ยกเลิกสัญญา | #EF4444 (Red) | | `PENDING` | รอลงนาม | #6B7280 (Gray) |

---

## 3. Contract Module (ข้อมูลสัญญาจริง)

### `tb_contract` (ข้อมูลสัญญาหลัก)

| **Field Name**       | **Type** | **Size** | **Key** | **Description / Remark**                   |
| -------------------- | -------- | -------- | ------- | ------------------------------------------ |
| `ct_aid`             | BIGINT   | -        | PK      | รหัสสัญญา (Auto)                           |
| `category_code`      | NVARCHAR | 20       | FK      | หมวดหมู่ (เชื่อม tb_category)              |
| `contract_type_code` | NVARCHAR | 20       | FK      | วิธีดำเนินการ (เชื่อม tb_contract_type) ⭐ |
| `ct_number`          | NVARCHAR | 100      | UK      | เลขที่สัญญา (Unique)                       |
| `ct_name`            | NVARCHAR | 255      | -       | ชื่อสัญญา                                  |
| `coordinator_name`   | NVARCHAR | 150      | -       | ชื่อผู้ประสานงาน                           |
| `sign_date`          | DATE     | -        | -       | วันที่ลงนาม                                |
| `start_date`         | DATE     | -        | -       | วันที่เริ่มต้นสัญญา                        |
| `end_date`           | DATE     | -        | -       | วันที่สิ้นสุดสัญญา                         |
| `warranty_end_date`  | DATE     | -        | -       | วันสิ้นสุดการรับประกัน ⭐                  |
| `brief_desc`         | NVARCHAR | MAX      | -       | รายละเอียดสัญญา                            |
| `vendor`             | NVARCHAR | 255      | -       | ผู้รับจ้าง/บริษัท/ห้าง                     |
| `vendor_tax_id`      | NVARCHAR | 20       | -       | เลขประจำตัวผู้เสียภาษี ⭐                  |
| `purchase_cost`      | DECIMAL  | 18,2     | -       | วงเงิน/มูลค่าสัญญา                         |
| `app_name`           | NVARCHAR | 255      | -       | Header (ชื่อระบบหลัก)                      |
| `section_owner`      | NVARCHAR | 100      | -       | หน่วยงานที่รับผิดชอบ                       |
| `budget_owner`       | NVARCHAR | 100      | -       | หน่วยงานเจ้าของงบประมาณ                    |
| `cost_center`        | NVARCHAR | 50       | -       | รหัส Cost Center                           |
| `contract_status`    | NVARCHAR | 20       | FK      | สถานะสัญญา (เชื่อม tb_contract_status) ⭐  |
| `owner_user_id`      | BIGINT   | -        | FK      | เจ้าของโครงการ (เชื่อม tb_user) 🔮 Phase 2 |
| `owner_dept_code`    | NVARCHAR | 20       | FK      | หน่วยงานเจ้าของ (เชื่อม tb_department) 🔮  |
| `remark`             | NVARCHAR | MAX      | -       | หมายเหตุ                                   |
| `[+Std Cols]`        | -        | -        | -       | -                                          |

### `tb_contract_items` (รายการย่อย/รายการ MA ในสัญญา)

| **Field Name**     | **Type** | **Size** | **Key** | **Description / Remark**           |
| ------------------ | -------- | -------- | ------- | ---------------------------------- |
| `item_aid`         | BIGINT   | -        | PK      | รหัสรายการ (Auto)                  |
| `contract_id`      | BIGINT   | -        | FK      | รหัสสัญญาหลัก (เชื่อม tb_contract) |
| `item_seq`         | INT      | -        | -       | ลำดับรายการ ⭐                     |
| `item_agreement`   | NVARCHAR | 255      | -       | ข้อตกลง/ชื่องวดงาน                 |
| `start_date`       | DATE     | -        | -       | วันที่เริ่มต้นงวด                  |
| `end_date`         | DATE     | -        | -       | วันที่สิ้นสุดงวด                   |
| `item_month_count` | INT      | -        | -       | ระยะเวลา (เดือน)                   |
| `item_term`        | NVARCHAR | 255      | -       | ระยะเวลา-เงื่อนไข                  |
| `item_cost`        | DECIMAL  | 18,2     | -       | จำนวนเงิน (บาท)                    |
| `item_condition`   | NVARCHAR | 255      | -       | เงื่อนไขการจ่ายเงิน                |
| `item_remark`      | NVARCHAR | MAX      | -       | หมายเหตุประจำรายการ                |
| `[+Std Cols]`      | -        | -        | -       | -                                  |

---

## 4. Planning Module (ข้อมูลร่างแผนงานล่วงหน้า)

### `tb_planning` (แผนงานหลัก)

> **หมายเหตุ:** ฟิลด์ส่วนใหญ่ Copy มาจาก `tb_contract` เพื่อใช้เป็นตัวตั้งต้นแก้ไข

| **Field Name**                | **Type** | **Size** | **Key** | **Description / Remark**                       |
| ----------------------------- | -------- | -------- | ------- | ---------------------------------------------- |
| `plan_aid`                    | BIGINT   | -        | PK      | รหัสแผนงาน (Auto)                              |
| `target_year`                 | INT      | -        | -       | ปีที่จะเริ่มสัญญาใหม่ (พ.ศ.)                   |
| `target_quarter`              | INT      | -        | -       | ไตรมาสที่จะเริ่ม (1-4)                         |
| `planning_status`             | NVARCHAR | 20       | FK      | สถานะแผน (เชื่อม tb_planning_status) ⭐        |
| `priority`                    | NVARCHAR | 20       | -       | ความสำคัญ (LOW, NORMAL, HIGH, CRITICAL)        |
| `plan_ctype_code`             | NVARCHAR | 20       | FK      | วิธีดำเนินการจัดซื้อ (เชื่อม tb_contract_type) |
| `owner_user_id`               | BIGINT   | -        | FK      | เจ้าของแผนงาน (เชื่อม tb_user) 🔮 Phase 2      |
| `owner_dept_code`             | NVARCHAR | 20       | FK      | หน่วยงานเจ้าของ (เชื่อม tb_department) 🔮      |
| **--- ฟิลด์จาก Contract ---** |          |          |         |                                                |
| `category_code`               | NVARCHAR | 20       | FK      | หมวดหมู่ (เชื่อม tb_category)                  |
| `plan_name`                   | NVARCHAR | 255      | -       | ชื่อแผนงาน (คัดลอกจาก ct_name)                 |
| `coordinator_name`            | NVARCHAR | 150      | -       | ชื่อผู้ประสานงาน                               |
| `expected_sign_date`          | DATE     | -        | -       | วันที่คาดว่าจะลงนาม                            |
| `expected_start`              | DATE     | -        | -       | วันที่คาดว่าจะเริ่ม                            |
| `expected_end`                | DATE     | -        | -       | วันที่คาดว่าจะสิ้นสุด                          |
| `brief_desc`                  | NVARCHAR | MAX      | -       | รายละเอียด                                     |
| `expected_vendor`             | NVARCHAR | 255      | -       | ผู้รับจ้างที่คาด (ถ้ามี)                       |
| `estimated_cost`              | DECIMAL  | 18,2     | -       | วงเงินประมาณการ                                |
| `app_name`                    | NVARCHAR | 255      | -       | ชื่อระบบหลัก                                   |
| `section_owner`               | NVARCHAR | 100      | -       | หน่วยงานที่รับผิดชอบ                           |
| `budget_owner`                | NVARCHAR | 100      | -       | หน่วยงานเจ้าของงบประมาณ                        |
| `cost_center`                 | NVARCHAR | 50       | -       | รหัส Cost Center                               |
| `remark`                      | NVARCHAR | MAX      | -       | หมายเหตุ                                       |
| `[+Std Cols]`                 | -        | -        | -       | -                                              |

### `tb_planning_items` (รายการย่อยของแผน)

> **หมายเหตุ:** ฟิลด์ Copy มาจาก `tb_contract_items`

| **Field Name**     | **Type** | **Size** | **Key** | **Description / Remark**         |
| ------------------ | -------- | -------- | ------- | -------------------------------- |
| `plan_item_aid`    | BIGINT   | -        | PK      | รหัสรายการของแผน (Auto)          |
| `plan_id`          | BIGINT   | -        | FK      | รหัสแผนหลัก (เชื่อม tb_planning) |
| `item_seq`         | INT      | -        | -       | ลำดับรายการ                      |
| `item_agreement`   | NVARCHAR | 255      | -       | ข้อตกลง/ชื่องวดงาน               |
| `start_date`       | DATE     | -        | -       | วันที่เริ่มต้นงวด (คาดการณ์)     |
| `end_date`         | DATE     | -        | -       | วันที่สิ้นสุดงวด (คาดการณ์)      |
| `item_month_count` | INT      | -        | -       | ระยะเวลา (เดือน)                 |
| `item_term`        | NVARCHAR | 255      | -       | ระยะเวลา-เงื่อนไข                |
| `item_cost`        | DECIMAL  | 18,2     | -       | จำนวนเงินประมาณการ (บาท)         |
| `item_condition`   | NVARCHAR | 255      | -       | เงื่อนไขการจ่ายเงิน              |
| `item_remark`      | NVARCHAR | MAX      | -       | หมายเหตุประจำรายการ              |
| `[+Std Cols]`      | -        | -        | -       | -                                |

---

## 5. Polymorphic & Relational Modules (ตารางศูนย์กลาง)

> **หมายเหตุ:** ตารางในส่วนนี้ใช้ `base_id` + `base_type` เพื่อเชื่อมโยงกับทั้ง Contract และ Planning

### Base Types Reference

| Code        | Description       | ใช้กับตาราง       |
| ----------- | ----------------- | ----------------- |
| `CON`       | Contract (สัญญา)  | tb_contract       |
| `PLAN`      | Planning (แผนงาน) | tb_planning       |
| `CON_ITEM`  | Contract Item     | tb_contract_items |
| `PLAN_ITEM` | Planning Item     | tb_planning_items |

### `tb_reference` (ตารางเชื่อมโยงความสัมพันธ์ Any-to-Any)

| **Field Name**      | **Type** | **Size** | **Key** | **Description / Remark**                      |
| ------------------- | -------- | -------- | ------- | --------------------------------------------- |
| `ref_id`            | BIGINT   | -        | PK      | รหัสอ้างอิง (Auto)                            |
| `base_id`           | BIGINT   | -        | IDX     | รหัสรายการปัจจุบัน (Contract ID หรือ Plan ID) |
| `base_type`         | NVARCHAR | 20       | IDX     | ประเภทปัจจุบัน ('CON', 'PLAN')                |
| `ref_contract_id`   | BIGINT   | -        | IDX     | รหัสรายการต้นทาง/เป้าหมาย                     |
| `ref_contract_type` | NVARCHAR | 20       | IDX     | ประเภทต้นทาง ('CON', 'PLAN')                  |
| `ref_type`          | NVARCHAR | 50       | -       | ลักษณะความสัมพันธ์ (SOURCE, MERGED, RELATED)  |
| `ref_note`          | NVARCHAR | 255      | -       | หมายเหตุการเชื่อมโยง ⭐                       |
| `[+Std Cols]`       | -        | -        | -       | -                                             |

**Reference Types:** | ref_type | Description | |----------|-------------| | `SOURCE` | ต้นทาง (สัญญาเดิมที่ Copy มาทำแผน) | | `MERGED` | ถูกรวมจาก (หลายสัญญารวมเป็นแผนเดียว) | | `SPLIT` | ถูกแยกจาก (สัญญาเดียวแยกเป็นหลายแผน) | | `RELATED` | เกี่ยวข้องกัน (ความสัมพันธ์ทั่วไป) | | `RENEWED` | ต่ออายุจาก (สัญญาที่ต่ออายุ) |

### `tb_committees` (ตารางคณะกรรมการ)

| **Field Name**   | **Type** | **Size** | **Key** | **Description / Remark**                     |
| ---------------- | -------- | -------- | ------- | -------------------------------------------- |
| `cmit_aid`       | BIGINT   | -        | PK      | รหัสคณะกรรมการ (Auto)                        |
| `base_id`        | BIGINT   | -        | IDX     | รหัสอ้างอิง (Contract ID หรือ Plan ID)       |
| `base_type`      | NVARCHAR | 20       | IDX     | ประเภทอ้างอิง ('CON', 'PLAN')                |
| `committee_type` | NVARCHAR | 20       | FK      | รหัสประเภทกรรมการ (เชื่อม tb_committee_type) |
| `position_index` | INT      | -        | -       | ลำดับที่ของกรรมการ (1-10)                    |
| `member_name`    | NVARCHAR | 150      | -       | ชื่อ-นามสกุล                                 |
| `position_title` | NVARCHAR | 100      | -       | ตำแหน่ง (ประธาน, กรรมการ, เลขานุการ)         |
| `department`     | NVARCHAR | 100      | -       | หน่วยงาน ⭐                                  |
| `status`         | INT      | -        | -       | 1=Active, 0=Inactive (พ้นวาระ)               |
| `effective_date` | DATE     | -        | -       | วันที่แต่งตั้ง                               |
| `end_date`       | DATE     | -        | -       | วันที่สิ้นสุดวาระ ⭐                         |
| `remark`         | NVARCHAR | 255      | -       | เหตุผลเปลี่ยนตัว / หมายเหตุ                  |
| `[+Std Cols]`    | -        | -        | -       | -                                            |

### `tb_tracking` (ตารางติดตามความคืบหน้า และปัญหา)

| **Field Name**   | **Type** | **Size** | **Key** | **Description / Remark**                     |
| ---------------- | -------- | -------- | ------- | -------------------------------------------- |
| `trk_aid`        | BIGINT   | -        | PK      | รหัส Tracking (Auto)                         |
| `base_id`        | BIGINT   | -        | IDX     | รหัสอ้างอิง (Contract ID หรือ Plan ID)       |
| `base_type`      | NVARCHAR | 20       | IDX     | ประเภทอ้างอิง ('CON', 'PLAN')                |
| `tracking_type`  | NVARCHAR | 20       | FK      | ประเภทการติดตาม (เชื่อม tb_tracking_type) ⭐ |
| `trk_name`       | NVARCHAR | 255      | -       | หัวข้อ/รายการปัญหา                           |
| `trk_status`     | NVARCHAR | 50       | -       | สถานะ (OPEN, IN_PROGRESS, DONE, CANCEL)      |
| `priority`       | NVARCHAR | 20       | -       | ความสำคัญ (LOW, NORMAL, HIGH, CRITICAL) ⭐   |
| `assigned_to`    | NVARCHAR | 150      | -       | ผู้รับผิดชอบ ⭐                              |
| `target_date`    | DATE     | -        | -       | วันที่คาดว่าจะเสร็จ / Due date               |
| `completed_date` | DATE     | -        | -       | วันที่เสร็จจริง ⭐                           |
| `remark`         | NVARCHAR | MAX      | -       | รายละเอียดความคืบหน้า                        |
| `[+Std Cols]`    | -        | -        | -       | -                                            |

### `tb_files` (ตารางเก็บไฟล์แนบ MinIO)

| **Field Name** | **Type** | **Size** | **Key** | **Description / Remark**               |
| -------------- | -------- | -------- | ------- | -------------------------------------- |
| `file_aid`     | BIGINT   | -        | PK      | รหัสเอกสาร (Auto)                      |
| `base_id`      | BIGINT   | -        | IDX     | รหัสอ้างอิง (Contract ID หรือ Plan ID) |
| `base_type`    | NVARCHAR | 20       | IDX     | ประเภทอ้างอิง ('CON', 'PLAN')          |
| `file_name`    | NVARCHAR | 255      | -       | ชื่อไฟล์สำหรับแสดงผลหน้าเว็บ           |
| `file_bucket`  | NVARCHAR | 100      | -       | ชื่อ Bucket ใน MinIO                   |
| `file_link`    | NVARCHAR | 500      | -       | Object Name / ชื่อไฟล์ใน MinIO         |
| `file_size`    | BIGINT   | -        | -       | ขนาดไฟล์ (bytes) ⭐                    |
| `file_mime`    | NVARCHAR | 100      | -       | MIME Type ⭐                           |
| `file_type`    | NVARCHAR | 50       | -       | ประเภทเอกสาร (เช่น TP-01, TOR)         |
| `file_comment` | NVARCHAR | MAX      | -       | ข้อมูลเพิ่มเติม                        |
| `[+Std Cols]`  | -        | -        | -       | -                                      |

**File Types (ตัวอย่าง):** | Code | Description | |------|-------------| | `CONTRACT` | เอกสารสัญญา | | `TOR` | ขอบเขตงาน (TOR) | | `QUOTATION` | ใบเสนอราคา | | `PO` | ใบสั่งซื้อ | | `INVOICE` | ใบแจ้งหนี้ | | `RECEIPT` | ใบเสร็จรับเงิน | | `REPORT` | รายงาน | | `OTHER` | อื่นๆ |

---

## 6. Budget (การกระจายงบประมาณตามปี)

### `tb_budget`

> **หมายเหตุ:** รองรับทั้งระดับ Item และระดับสัญญา/แผนหลัก

| **Field Name**   | **Type** | **Size** | **Key** | **Description / Remark**                        |
| ---------------- | -------- | -------- | ------- | ----------------------------------------------- |
| `budget_aid`     | BIGINT   | -        | PK      | รหัสงบประมาณ (Auto)                             |
| `base_id`        | BIGINT   | -        | IDX     | รหัสอ้างอิง (Contract/Plan/Item ID) ⭐          |
| `base_type`      | NVARCHAR | 20       | IDX     | ประเภท ('CON', 'PLAN', 'CON_ITEM', 'PLAN_ITEM') |
| `budget_year`    | INT      | -        | IDX     | ปีงบประมาณ (พ.ศ.)                               |
| `budget_quarter` | INT      | -        | -       | ไตรมาส (1-4, NULL=ทั้งปี) ⭐                    |
| `budget_money`   | DECIMAL  | 18,2     | -       | วงเงินที่ตั้งไว้ในปีนั้น                        |
| `actual_money`   | DECIMAL  | 18,2     | -       | วงเงินที่ใช้จริง ⭐                             |
| `budget_note`    | NVARCHAR | 255      | -       | หมายเหตุ ⭐                                     |
| `[+Std Cols]`    | -        | -        | -       | -                                               |

---

## 7. Audit Trail (ประวัติการแก้ไข)

> **หลักการ:** สร้างตาราง History ล้อตามตารางหลัก โดยเพิ่มฟิลด์เฉพาะเข้าไป

### History Fields (เพิ่มในทุกตาราง History)

| **Field Name** | **Type** | **Size** | **Key** | **Description / Remark**       |
| -------------- | -------- | -------- | ------- | ------------------------------ |
| `his_aid`      | BIGINT   | -        | PK      | รหัส History (Auto)            |
| `version_no`   | INT      | -        | -       | เลขเวอร์ชันสำหรับทำ Undo       |
| `his_type`     | NVARCHAR | 20       | -       | ประเภท Action (UPDATE, DELETE) |
| `his_date`     | DATETIME | -        | -       | วันเวลาที่บันทึก               |
| `his_by`       | BIGINT   | -        | FK      | ผู้ทำรายการ (เชื่อม tb_user)   |

### History Tables (ต้องสร้างทุกตาราง)

| ตารางหลัก           | ตาราง History               |
| ------------------- | --------------------------- |
| `tb_contract`       | `tb_contract_history`       |
| `tb_contract_items` | `tb_contract_items_history` |
| `tb_planning`       | `tb_planning_history`       |
| `tb_planning_items` | `tb_planning_items_history` |
| `tb_committees`     | `tb_committees_history`     |

### ตัวอย่าง: `tb_contract_history`

| **Field Name** | **Type** | **Size** | **Key** | **Description / Remark**          |
| -------------- | -------- | -------- | ------- | --------------------------------- |
| `his_aid`      | BIGINT   | -        | PK      | รหัส History (Auto)               |
| `version_no`   | INT      | -        | -       | เลขเวอร์ชัน                       |
| `his_type`     | NVARCHAR | 20       | -       | ประเภท Action (UPDATE, DELETE)    |
| `his_date`     | DATETIME | -        | -       | วันเวลาที่บันทึก                  |
| `his_by`       | BIGINT   | -        | FK      | ผู้แก้ไข (เชื่อม tb_user)         |
| `ct_aid`       | BIGINT   | -        | IDX     | รหัสสัญญาที่ถูกแก้ไข              |
| `...`          | ...      | ...      | -       | **(ฟิลด์ทั้งหมดจาก tb_contract)** |

---

## 8. Project Assignment (การมอบหมายงาน) 🔮 Phase 2

> **หมายเหตุ:** ตารางในส่วนนี้จะใช้งานใน Phase 2 เมื่อเปิดให้เจ้าของโครงการ Login

### `tb_project_assignment` (การมอบหมายโครงการให้ผู้ช่วย)

| **Field Name**  | **Type** | **Size** | **Key** | **Description / Remark**                  |
| --------------- | -------- | -------- | ------- | ----------------------------------------- |
| `assign_aid`    | BIGINT   | -        | PK      | รหัสการมอบหมาย (Auto)                     |
| `base_id`       | BIGINT   | -        | IDX     | รหัสสัญญา/แผน (Contract ID หรือ Plan ID)  |
| `base_type`     | NVARCHAR | 20       | IDX     | ประเภท ('CON', 'PLAN')                    |
| `assigned_by`   | BIGINT   | -        | FK      | ผู้มอบหมาย (หัวหน้าส่วน) - เชื่อม tb_user |
| `assigned_to`   | BIGINT   | -        | FK      | ผู้รับมอบหมาย (ผู้ช่วย) - เชื่อม tb_user  |
| `permission`    | NVARCHAR | 20       | -       | สิทธิ์ (VIEW, EDIT, FULL)                 |
| `assigned_date` | DATE     | -        | -       | วันที่มอบหมาย                             |
| `expire_date`   | DATE     | -        | -       | วันหมดอายุการมอบหมาย (Optional)           |
| `remark`        | NVARCHAR | 255      | -       | หมายเหตุ                                  |
| `status`        | INT      | -        | -       | 1=Active, 0=Revoked                       |
| `[+Std Cols]`   | -        | -        | -       | -                                         |

**Permission Types:** | Code | Description | |------|-------------| | `VIEW` | ดูข้อมูลได้อย่างเดียว | | `EDIT` | ดูและแก้ไขข้อมูลได้ | | `FULL` | ดู, แก้ไข, และ Assign ต่อได้ |

### `tb_committees` - เพิ่มฟิลด์สำหรับ Phase 2

> **หมายเหตุ:** ใน Phase 2 อาจเพิ่มฟิลด์เพื่อเชื่อมโยงกรรมการกับ user account

| **Field Name** | **Type** | **Size** | **Key** | **Description / Remark**          |
| -------------- | -------- | -------- | ------- | --------------------------------- |
| `user_id`      | BIGINT   | -        | FK      | เชื่อม tb_user (ถ้ามี account) 🔮 |

### Phase 2 Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Project Assignment Workflow                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. User Login ด้วย AD                                              │
│     - ระบบดึง department, position จาก AD                           │
│     - Sync/Update ข้อมูลใน tb_user                                  │
│                                                                      │
│  2. หัวหน้าส่วน (SECTION_HEAD) เข้าระบบ                             │
│     - เห็นสัญญา/แผนที่ owner_dept_code ตรงกับหน่วยงานตัวเอง        │
│     - สามารถ Assign งานให้ผู้ช่วยในสังกัดได้                        │
│                                                                      │
│  3. ผู้ช่วย (STAFF) เข้าระบบ                                        │
│     - เห็นเฉพาะสัญญา/แผนที่ถูก Assign ให้ (tb_project_assignment)   │
│     - สิทธิ์ตาม permission ที่กำหนด                                  │
│                                                                      │
│  4. Admin                                                            │
│     - เห็นทุกสัญญา/แผน                                               │
│     - จัดการ Master Data และ User                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Query Examples (Phase 2)

```sql
-- ดึงสัญญาที่ User มีสิทธิ์เห็น
SELECT c.* FROM tb_contract c
WHERE c.is_deleted = 0
AND (
    -- เป็น Admin เห็นทั้งหมด
    @user_role = 'ADMIN'
    -- เป็นเจ้าของโครงการ
    OR c.owner_user_id = @user_id
    -- เป็นหัวหน้าส่วนเห็นงานในหน่วยงาน
    OR (c.owner_dept_code = @user_dept AND @user_level = 'SECTION_HEAD')
    -- ถูก Assign
    OR EXISTS (
        SELECT 1 FROM tb_project_assignment pa
        WHERE pa.base_id = c.ct_aid
        AND pa.base_type = 'CON'
        AND pa.assigned_to = @user_id
        AND pa.status = 1
        AND (pa.expire_date IS NULL OR pa.expire_date >= GETDATE())
    )
);
```

---

## 9. Message System (ระบบข้อความและการแจ้งเตือน)

> **หมายเหตุ:** ใช้สำหรับการส่งข้อความภายในระบบ และการแจ้งเตือนอัตโนมัติจาก Schedule Process

### `tb_message` (ข้อความ)

| **Field Name**   | **Type** | **Size** | **Key** | **Description / Remark**                       |
| ---------------- | -------- | -------- | ------- | ---------------------------------------------- |
| `msg_aid`        | BIGINT   | -        | PK      | รหัสข้อความ (Auto)                             |
| `msg_type`       | NVARCHAR | 30       | -       | ประเภทข้อความ (SYSTEM_ALERT, ASSIGNMENT, etc.) |
| `subject`        | NVARCHAR | 255      | -       | หัวข้อข้อความ                                  |
| `body`           | NVARCHAR | MAX      | -       | เนื้อหาข้อความ (HTML/Text)                     |
| `priority`       | NVARCHAR | 10       | -       | ความสำคัญ (LOW, NORMAL, HIGH, URGENT)          |
| `sender_user_id` | BIGINT   | -        | FK      | ผู้ส่ง (NULL = System)                         |
| `sender_type`    | NVARCHAR | 20       | -       | USER, SYSTEM, SCHEDULED                        |
| `base_id`        | BIGINT   | -        | -       | อ้างอิงสัญญา/แผนงาน (Polymorphic)              |
| `base_type`      | NVARCHAR | 20       | -       | CON, PLAN, GENERAL                             |
| `rule_id`        | BIGINT   | -        | FK      | กฎที่สร้างข้อความนี้ (NULL = Manual)           |
| `sent_at`        | DATETIME | -        | -       | วันที่ส่ง                                      |
| `[+Std Cols]`    | -        | -        | -       | -                                              |

**Message Types:** | Code | Description | |------|-------------| | `SYSTEM_ALERT` | แจ้งเตือนอัตโนมัติจากระบบ | | `CONTRACT_EXPIRY` | สัญญาใกล้หมดอายุ | | `ASSIGNMENT` | การมอบหมายงาน | | `REMINDER` | เตือนความจำ | | `INFO` | ข้อมูลทั่วไป | | `USER_MSG` | ข้อความจากผู้ใช้อื่น |

### `tb_message_recipient` (ผู้รับข้อความ)

| **Field Name** | **Type** | **Size** | **Key** | **Description / Remark**     |
| -------------- | -------- | -------- | ------- | ---------------------------- |
| `rcpt_aid`     | BIGINT   | -        | PK      | รหัสผู้รับ (Auto)            |
| `msg_id`       | BIGINT   | -        | FK      | รหัสข้อความ (FK: tb_message) |
| `user_id`      | BIGINT   | -        | FK      | ผู้รับ (FK: tb_user)         |
| `folder`       | NVARCHAR | 20       | -       | INBOX, SENT, STARRED, TRASH  |
| `status`       | NVARCHAR | 20       | -       | UNREAD, READ, ARCHIVED       |
| `is_starred`   | BIT      | 1        | -       | ติดดาวสำคัญ                  |
| `read_at`      | DATETIME | -        | -       | วันที่อ่าน                   |
| `deleted_at`   | DATETIME | -        | -       | วันที่ลบ (ย้ายไปถังขยะ)      |
| `created_at`   | DATETIME | -        | -       | วันที่สร้าง                  |

### `tb_message_rule` (กฎการสร้างข้อความอัตโนมัติ)

> **หมายเหตุ:** Schedule Process จะรันทุกวันเพื่อตรวจสอบตามกฎเหล่านี้

| **Field Name**     | **Type** | **Size** | **Key** | **Description / Remark**                   |
| ------------------ | -------- | -------- | ------- | ------------------------------------------ |
| `rule_aid`         | BIGINT   | -        | PK      | รหัสกฎ (Auto)                              |
| `rule_code`        | NVARCHAR | 50       | UK      | รหัสกฎเพื่ออ้างอิง                         |
| `rule_name`        | NVARCHAR | 150      | -       | ชื่อกฎ                                     |
| `rule_description` | NVARCHAR | MAX      | -       | คำอธิบายกฎ                                 |
| `target_entity`    | NVARCHAR | 30       | -       | CONTRACT, PLANNING, USER                   |
| `condition_type`   | NVARCHAR | 50       | -       | DAYS_BEFORE_EXPIRY, DAYS_AFTER_START, etc. |
| `condition_value`  | INT      | -        | -       | ค่าเงื่อนไข (เช่น 30 วัน)                  |
| `msg_type`         | NVARCHAR | 30       | -       | ประเภทข้อความที่จะสร้าง                    |
| `msg_priority`     | NVARCHAR | 10       | -       | ความสำคัญ (LOW, NORMAL, HIGH, URGENT)      |
| `msg_template`     | NVARCHAR | MAX      | -       | Template ข้อความ (รองรับ {{variable}})     |
| `recipient_type`   | NVARCHAR | 30       | -       | OWNER, ROLE, DEPT, ALL                     |
| `recipient_value`  | NVARCHAR | 100      | -       | ค่าตาม recipient_type                      |
| `schedule_time`    | TIME     | -        | -       | เวลาที่รัน (เช่น 08:00)                    |
| `last_run_at`      | DATETIME | -        | -       | วันที่รันล่าสุด                            |
| `next_run_at`      | DATETIME | -        | -       | วันที่จะรันครั้งถัดไป                      |
| `is_active`        | BIT      | 1        | -       | สถานะเปิดใช้งาน                            |
| `[+Std Cols]`      | -        | -        | -       | -                                          |

**Condition Types:** | Code | Description | |------|-------------| | `DAYS_BEFORE_EXPIRY` | ก่อนหมดอายุ X วัน | | `DAYS_AFTER_START` | หลังเริ่มสัญญา X วัน | | `BUDGET_THRESHOLD` | งบประมาณเกิน X% | | `STATUS_CHANGE` | เมื่อสถานะเปลี่ยน | | `MONTHLY_REPORT` | รายงานประจำเดือน |

**Recipient Types:** | Code | Description | |------|-------------| | `OWNER` | เจ้าของสัญญา/แผนงาน | | `ROLE` | ผู้ใช้ที่มี role ที่ระบุ | | `DEPT` | ผู้ใช้ในหน่วยงานที่ระบุ | | `ALL` | ทุกคน |

### Workflow: Schedule Process

```
┌─────────────────────────────────────────────────────────────────────┐
│                   Schedule Process (รันทุกวัน)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. ดึงกฎที่ is_active = 1 จาก tb_message_rule                    │
│     │                                                               │
│     ▼                                                               │
│  2. ตรวจสอบเงื่อนไขตาม condition_type + condition_value         │
│     │                                                               │
│     ▼                                                               │
│  3. ค้นหาข้อมูลที่ตรงเงื่อนไข (เช่น สัญญาหมดอายุใน 30 วัน)  │
│     │                                                               │
│     ▼                                                               │
│  4. สร้างข้อความใน tb_message จาก msg_template                 │
│     │                                                               │
│     ▼                                                               │
│  5. สร้างผู้รับใน tb_message_recipient ตาม recipient_type       │
│     │                                                               │
│     ▼                                                               │
│  6. อัปเดต last_run_at และ next_run_at ใน tb_message_rule         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### SQL Examples

```sql
-- กฎ: แจ้งเตือนสัญญาใกล้หมดอายุ 30 วัน
-- ดึงข้อมูลสัญญาที่หมดอายุใน 30 วัน
SELECT c.ct_aid, c.ct_number, c.ct_name, c.end_date, c.owner_user_id
FROM tb_contract c
WHERE c.is_deleted = 0
AND c.end_date BETWEEN GETDATE() AND DATEADD(DAY, 30, GETDATE())
AND NOT EXISTS (
    -- ไม่เคยส่งแจ้งเตือนแล้ววันนี้
    SELECT 1 FROM tb_message m
    WHERE m.base_id = c.ct_aid
    AND m.base_type = 'CON'
    AND m.msg_type = 'CONTRACT_EXPIRY'
    AND m.rule_id = @rule_id
    AND CAST(m.sent_at AS DATE) = CAST(GETDATE() AS DATE)
);

-- สร้างข้อความและผู้รับ
INSERT INTO tb_message (msg_type, subject, body, priority, sender_type, base_id, base_type, rule_id, sent_at, created_by)
VALUES ('CONTRACT_EXPIRY', N'สัญญาใกล้หมดอายุ', N'เนื้อหา...', 'HIGH', 'SCHEDULED', @ct_aid, 'CON', @rule_id, GETDATE(), 0);

SET @msg_id = SCOPE_IDENTITY();

INSERT INTO tb_message_recipient (msg_id, user_id, folder, status, created_at)
VALUES (@msg_id, @owner_user_id, 'INBOX', 'UNREAD', GETDATE());

-- ดึงข้อความที่ยังไม่อ่าน (สำหรับ Badge Count)
SELECT COUNT(*) AS unread_count
FROM tb_message_recipient r
WHERE r.user_id = @user_id
AND r.folder = 'INBOX'
AND r.status = 'UNREAD'
AND r.deleted_at IS NULL;
```

### Default Message Rules

| rule_code         | rule_name            | condition_type     | condition_value | recipient_type |
| ----------------- | -------------------- | ------------------ | --------------- | -------------- |
| `EXPIRY_30`       | สัญญาหมดอายุ 30 วัน  | DAYS_BEFORE_EXPIRY | 30              | OWNER          |
| `EXPIRY_7`        | สัญญาหมดอายุ 7 วัน   | DAYS_BEFORE_EXPIRY | 7               | OWNER          |
| `EXPIRY_1`        | สัญญาหมดอายุพรุ่งนี้ | DAYS_BEFORE_EXPIRY | 1               | OWNER          |
| `MONTHLY_SUMMARY` | สรุปประจำเดือน       | MONTHLY_REPORT     | 1               | ROLE:ADMIN     |

---

## 10. Index Strategy (แนวทางการสร้าง Index)

### Primary Keys (Auto-created)

ทุก PK จะถูกสร้าง Clustered Index อัตโนมัติ

### Foreign Key Indexes

```sql
-- Contract Module
CREATE INDEX idx_contract_category ON tb_contract(category_code);
CREATE INDEX idx_contract_type ON tb_contract(contract_type_code);
CREATE INDEX idx_contract_status ON tb_contract(contract_status);
CREATE INDEX idx_contract_owner ON tb_contract(owner_user_id);
CREATE INDEX idx_contract_dept ON tb_contract(owner_dept_code);
CREATE INDEX idx_contract_items_contract ON tb_contract_items(contract_id);

-- Planning Module
CREATE INDEX idx_planning_status ON tb_planning(planning_status);
CREATE INDEX idx_planning_year ON tb_planning(target_year);
CREATE INDEX idx_planning_owner ON tb_planning(owner_user_id);
CREATE INDEX idx_planning_dept ON tb_planning(owner_dept_code);
CREATE INDEX idx_planning_items_plan ON tb_planning_items(plan_id);

-- User & Assignment (Phase 2)
CREATE INDEX idx_user_dept ON tb_user(department_code);
CREATE INDEX idx_user_manager ON tb_user(manager_user_id);
CREATE INDEX idx_assignment_base ON tb_project_assignment(base_type, base_id);
CREATE INDEX idx_assignment_to ON tb_project_assignment(assigned_to);

-- Message System
CREATE INDEX idx_message_type ON tb_message(msg_type);
CREATE INDEX idx_message_sender ON tb_message(sender_user_id);
CREATE INDEX idx_message_base ON tb_message(base_type, base_id);
CREATE INDEX idx_message_rule ON tb_message(rule_id);
CREATE INDEX idx_message_sent ON tb_message(sent_at);
CREATE INDEX idx_recipient_msg ON tb_message_recipient(msg_id);
CREATE INDEX idx_recipient_user ON tb_message_recipient(user_id, folder, status);
CREATE INDEX idx_recipient_unread ON tb_message_recipient(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_rule_active ON tb_message_rule(is_active, next_run_at);
```

### Polymorphic Composite Indexes (สำคัญมาก!)

```sql
-- ใช้สำหรับ Query ที่ต้องกรองด้วย base_type + base_id
CREATE INDEX idx_reference_base ON tb_reference(base_type, base_id);
CREATE INDEX idx_reference_ref ON tb_reference(ref_contract_type, ref_contract_id);
CREATE INDEX idx_committees_base ON tb_committees(base_type, base_id);
CREATE INDEX idx_tracking_base ON tb_tracking(base_type, base_id);
CREATE INDEX idx_files_base ON tb_files(base_type, base_id);
CREATE INDEX idx_budget_base ON tb_budget(base_type, base_id);
```

### Soft Delete Filter Index

```sql
-- Filtered index สำหรับ Query ที่ต้องกรอง is_deleted = 0 บ่อยๆ
CREATE INDEX idx_contract_active ON tb_contract(ct_aid) WHERE is_deleted = 0;
CREATE INDEX idx_planning_active ON tb_planning(plan_aid) WHERE is_deleted = 0;
```

### Date Range Indexes

```sql
-- สำหรับ Query ที่ค้นหาตามช่วงวันที่
CREATE INDEX idx_contract_dates ON tb_contract(start_date, end_date);
CREATE INDEX idx_planning_target ON tb_planning(target_year, target_quarter);
CREATE INDEX idx_tracking_target ON tb_tracking(target_date);
```

---

## 📊 Entity Relationship Summary

```
┌─────────────────┐     ┌─────────────────┐
│   tb_contract   │────<│tb_contract_items│
└────────┬────────┘     └─────────────────┘
         │
         │ (Polymorphic: base_type='CON')
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  tb_committees  │     │   tb_tracking   │     │    tb_files     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         ▲
         │ (Polymorphic: base_type='PLAN')
         │
┌────────┴────────┐     ┌─────────────────┐
│   tb_planning   │────<│tb_planning_items│
└─────────────────┘     └─────────────────┘
         │
         │ (tb_reference: SOURCE)
         ▼
┌─────────────────┐
│   tb_contract   │ (สัญญาต้นทาง)
└─────────────────┘
```

---

## 📝 Notes

1. **ปีงบประมาณ:** ใช้ปี พ.ศ. ทั้งหมด
2. **Soft Delete:** ทุกตารางหลักใช้ `is_deleted` ห้ามลบข้อมูลจริง
3. **Polymorphic:** ตาราง committees, tracking, files ใช้ร่วมกันได้
4. **Transaction:** การ Copy สัญญามาเป็นแผนต้องใช้ Transaction
5. **Index:** สร้าง Composite Index ตาม Pattern การใช้งานจริง | `...` | ... | ... | - | ... |
