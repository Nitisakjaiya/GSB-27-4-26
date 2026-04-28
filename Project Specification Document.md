# Project Specification Document

**Project Name:** Contract Management System

**Project Code:** CTMNG

**Description:** ระบบบริหารจัดการสัญญาและแผนงานล่วงหน้า (Contract & Planning Lifecycle Management)

## 1. Technology Stack

- **Frontend & Backend:** Next.js (Full-stack Framework)

- **Database:** Microsoft SQL Server (MSSQL)

- **ORM (Object-Relational Mapping):** Prisma

- **File Storage:** MinIO (S3 Compatible Storage)

- **Infrastructure & Deployment:** * ระบบปฏิบัติการหลัก (Host OS): **Windows Server 2019**
  
  - รัน Database (MSSQL) และ Storage (MinIO) ภายใน **Docker**

- **Styling/UI:** Tailwind CSS (เน้น Custom UI ให้ดูคลีนและใช้พื้นที่คุ้มค่า)

- **Authentication:** * *Development Environment:* ใช้ตาราง `tb_user` ใน Database สำหรับ Login และเข้ารหัสด้วย JWT
  
  - *Production Environment:* เชื่อมต่อกับ Active Directory (AD) ขององค์กรผ่าน JWT Token

## 2. UI/UX Layout & Navigation

- **Workspace Optimization:** เน้นพื้นที่แสดงผลข้อมูลให้มากที่สุด (Full-width workspace)

- **Navbar:** อยู่ด้านบนสุด

- **Main Menu (Windows Start Menu Style):** * เป็นปุ่มไอคอน/โลโก้ อยู่มุมซ้ายบนสุดของ Navbar
  
  - เมื่อคลิก จะแสดงรายการเมนูแบบ Dropdown/Flyout ออกมา

- **Menu Items:**
  
  1. Dashboard (ภาพรวมระบบ)
  
  2. ข้อมูลสัญญา (Contract Management)
  
  3. ร่างสัญญา (Planning / Draft Management)
  
  4. ออกรายงาน (Reports)
  
  5. Admin (ตั้งค่าระบบและฐานข้อมูลอ้างอิง)
  
  6. คู่มือการใช้งาน (User Manual)

## 3. Database Architecture Principles

เพื่อให้ AI สร้าง Schema (Prisma) และ Model ได้อย่างถูกต้อง ให้ยึดหลักการดังนี้:

### 3.1 Primary Keys, Naming Convention & Tracking

- **Naming Convention (`aid`):** คำว่า `aid` ย่อมาจาก Auto ID (Auto Number) เช่น `ct_aid` = Contract Auto ID, `plan_aid` = Planning Auto ID

- **Primary Key:** ใช้ `BIGINT IDENTITY(1,1)` (หรือ `BigInt` `@id` `@default(autoincrement())` ใน Prisma) เป็น Primary Key สำหรับฟิลด์ `aid` ทุกตาราง

- **Soft Delete:** ใช้ระบบนี้กับทุกตารางหลัก: `is_deleted` (Boolean), `deleted_at` (DateTime?), `deleted_by` (BigInt?)

- **Audit Fields:** มี `created_at`, `created_by`, `updated_at`, `updated_by` เสมอ

### 3.2 Polymorphic Relationships (The Core Engine)

ตารางที่เป็นศูนย์กลางและถูกใช้งานร่วมกันหลายโมดูล จะต้องใช้หลักการ `base_id` (BigInt) และ `base_type` (String เช่น 'CON', 'PLAN'):

1. **tb_reference:** จัดการความสัมพันธ์ Any-to-Any (Lineage, Merge, Splitting)

2. **tb_committees:** จัดการรายชื่อกรรมการของทั้งสัญญาและร่างสัญญา

3. **tb_tracking:** จัดการบันทึกการติดตามความคืบหน้า (Progress Tracking)

4. **tb_files:** จัดการข้อมูลไฟล์ที่แนบกับ MinIO

### 3.3 Core Tables Overview

- **User Module:** `tb_user` (เฉพาะ Dev Auth)

- **Contract Module:** `tb_contract` (Master) และ `tb_contract_items` (Details)

- **Planning Module:** `tb_planning` (Master) และ `tb_planning_items` (Details)
  
  - *Logic:* เมื่อสร้างแผนงาน ให้ Copy ข้อมูลจาก Contract Master และ Items มาเป็นตัวตั้งต้น

- **Master Data (สำหรับ Admin Menu):** `tb_category`, `tb_contract_type`, `tb_planning_status`, `tb_tracking_type`, `tb_committee_type`

- **Audit Trail:** ตาราง History แยกตามตารางหลัก (เช่น `tb_contract_history`) เก็บโครงสร้างเหมือนตารางหลักทุกประการ + ฟิลด์ `his_type`, `his_date`, `his_by`, `version_no`

## 4. Specific Development Instructions for Copilot (Prisma + Next.js)

1. **Prisma Schema:** ให้สร้าง `schema.prisma` โดยใช้ `@map` เพื่อตั้งชื่อตารางและคอลัมน์ให้ตรงกับเอกสาร Database Design อย่างเคร่งครัด

2. **API Structure:** ให้สร้าง API Routes ที่รองรับการ Query แบบแยกตารางและการ Join ข้อมูลอย่างมีประสิทธิภาพ (ใช้ Prisma `include` สำหรับ Master-Detail และแยก Query สำหรับ Polymorphic relations)

3. **MinIO Integration:** เตรียม Utility functions สำหรับ `uploadFile`, `downloadFile`, `deleteFile` โดยจัดเก็บชื่อ Bucket และ File Link ลงใน `tb_files`

4. **Transaction Management:** ทุกครั้งที่มีการ "สร้างแผนงานจากสัญญาเดิม" (Transfer/Copy) จะต้องใช้ `prisma.$transaction` เสมอ เพื่อให้การ Insert ข้อมูลลง Master, Items, และ Reference สำเร็จพร้อมกันแบบ Atomic
