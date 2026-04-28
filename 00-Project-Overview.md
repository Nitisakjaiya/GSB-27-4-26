# 📋 CTMNG - Project Overview

> **Contract Management System** - ระบบบริหารจัดการสัญญาและแผนงานล่วงหน้า

**Version:** 1.0  
**Last Updated:** 2026-04-24

---

## 📌 Executive Summary

**CTMNG** (Contract Management) คือระบบบริหารจัดการสัญญาและแผนงานล่วงหน้าสำหรับองค์กร ออกแบบมาเพื่อ:

- **จัดการวงจรชีวิตสัญญา** ตั้งแต่ร่างแผนจนถึงสิ้นสุดสัญญา
- **วางแผนล่วงหน้า** สร้างแผนงานจากสัญญาเดิมที่จะหมดอายุ
- **ติดตามความคืบหน้า** บันทึกปัญหาและ milestone
- **บริหารงบประมาณ** กระจายงบประมาณตามปีงบประมาณ
- **รองรับผู้ใช้หลายระดับ** Admin และเจ้าของโครงการ (Phase 2)

---

## 🎯 Project Information

| รายการ                | รายละเอียด                             |
| --------------------- | -------------------------------------- |
| **ชื่อระบบ**          | CTMNG Version 1.0                      |
| **ชื่อภาษาไทย**       | ระบบบริหารจัดการสัญญาและแผนงานล่วงหน้า |
| **ประเภท**            | Full-Stack Web Application             |
| **Target Users**      | 10,000+ concurrent users               |
| **Development Start** | April 2026                             |

---

## 🏗️ Technology Stack

| Layer            | Technology              | Version | หมายเหตุ                      |
| ---------------- | ----------------------- | ------- | ----------------------------- |
| **Framework**    | Next.js                 | 16.1.6+ | App Router, Server Components |
| **Language**     | TypeScript              | 5.7+    | Type-safe development         |
| **CSS**          | Tailwind CSS            | 4.0+    | Utility-first styling         |
| **ORM**          | Prisma                  | 6.19+   | Type-safe database access     |
| **Database**     | Microsoft SQL Server    | 2019+   | Production database           |
| **File Storage** | MinIO                   | Latest  | S3-compatible storage         |
| **Auth (Dev)**   | JWT + tb_user           | -       | Development authentication    |
| **Auth (Prod)**  | Active Directory + JWT  | -       | Enterprise authentication     |
| **Deployment**   | Windows Server + Docker | 2019    | MSSQL & MinIO in Docker       |

---

## 📦 Core Modules

### 1. Contract Module (ข้อมูลสัญญา)

- จัดการข้อมูลสัญญาหลัก (Master)
- รายการย่อย/งวดงาน (Items)
- คณะกรรมการที่เกี่ยวข้อง
- ไฟล์แนบ (MinIO)
- ติดตามสถานะและปัญหา

### 2. Planning Module (ร่างแผนงาน)

- สร้างแผนงานใหม่ หรือ Copy จากสัญญาเดิม
- วางแผนตามปีงบประมาณและไตรมาส
- ติดตาม Lineage (ต้นทางของแผน)
- จัดการคณะกรรมการและไฟล์แนบ

### 3. Budget Module (งบประมาณ)

- กระจายงบประมาณตามปีงบประมาณ
- รองรับทั้งระดับสัญญาและรายการย่อย
- เปรียบเทียบงบประมาณกับค่าใช้จ่ายจริง

### 4. Dashboard & Reports

- ภาพรวมสัญญาและแผนงาน
- สัญญาที่ใกล้หมดอายุ
- รายงานงบประมาณ
- Export Excel

### 5. Admin Module

- จัดการผู้ใช้งาน
- จัดการข้อมูล Master Data
- ตั้งค่าระบบ

---

## 👥 User Roles

### Phase 1 (Admin Mode)

| Role      | Description | Permissions                    |
| --------- | ----------- | ------------------------------ |
| **ADMIN** | ผู้ดูแลระบบ | Full access ทุกฟังก์ชัน        |
| **AUDIT** | ผู้ตรวจสอบ  | จำกัดบางหน้า (กำหนดภายหลัง)    |
| **USER**  | ผู้ใช้งาน   | เห็นเมนูบางส่วน (กำหนดภายหลัง) |

> **หมายเหตุ:** เริ่มพัฒนาด้วย ADMIN ก่อน แล้วค่อยกำหนดสิทธิ์ AUDIT/USER ภายหลัง วิธีจำกัดสิทธิ์เบื้องต้น: ซ่อนเมนูที่ไม่ให้เข้าถึง

### Phase 2 (Project Owner Mode) - Future

| Role             | Description       | Permissions                        |
| ---------------- | ----------------- | ---------------------------------- |
| **SECTION_HEAD** | หัวหน้าส่วนงาน    | จัดการโครงการในสังกัด + Assign งาน |
| **TOR_OWNER**    | เจ้าของ TOR/สัญญา | จัดการโครงการที่ถูก Assign         |
| **ASSISTANT**    | ผู้ช่วยดำเนินการ  | เห็นเฉพาะงานที่ถูก Assign          |

---

## 🔄 Business Workflows

### 1. Contract Lifecycle

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   PENDING   │───>│   ACTIVE    │───>│   EXPIRED   │───>│   RENEWED   │
│  (รอลงนาม)  │    │ (ใช้งานอยู่) │    │ (หมดอายุ)   │    │ (ต่อสัญญา)  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │ TERMINATED  │
                   │(ยกเลิกสัญญา)│
                   └─────────────┘
```

### 2. Planning Workflow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   PENDING   │───>│  DRAFTING   │───>│  REVIEWING  │───>│   FINISH    │
│(รอดำเนินการ)│    │ (กำลังร่าง)  │    │ (รออนุมัติ)  │    │(สร้างสัญญา) │──> สร้าง Contract ใหม่
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │  CANCELLED  │
                                      │   (ยกเลิก)  │
                   └─────────────┘                        └─────────────┘
```

### 3. Contract ↔ Planning (Independent & Bidirectional)

> **หลักการสำคัญ:** Contract และ Planning ทำงาน **แยกกันอิสระ** สามารถเพิ่ม/ลบ/แก้ไขได้โดยไม่ส่งผลกระทบต่อกัน

#### 3.1 Contract → Planning (สร้างแผนจากสัญญาเดิม)

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Contract → Create Plan                           │
├─────────────────────────────────────────────────────────────────────┤
│  User: เปิด Contract Detail → กดปุ่ม [สร้าง Plan]                   │
│                                                                      │
│  ระบบ:                                                               │
│  1. Copy ข้อมูล Contract → Planning ใหม่                             │
│  2. Copy Contract Items → Planning Items                             │
│  3. Copy Committees, Files (Optional)                                │
│  4. สร้าง Reference (Plan SOURCE from Contract)                     │
│  5. Planning ใหม่ยังไม่มีเลขที่สัญญา                                  │
└─────────────────────────────────────────────────────────────────────┘
```

#### 3.2 Planning → Contract (ปิดแผน → สร้างสัญญาใหม่)

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Plan → Close & Create Contract                   │
├─────────────────────────────────────────────────────────────────────┤
│  User: ทำงานกับ Plan จนข้อมูลครบ → กดปุ่ม [Close Plan]              │
│                                                                      │
│  ระบบ:                                                               │
│  1. เปลี่ยนสถานะ Plan → FINISH                                       │
│  2. สร้าง Contract ใหม่จาก Plan นั้น                                 │
│  3. กำหนดเลขที่สัญญาให้ Contract ใหม่                                │
│  4. Copy Planning Items → Contract Items                             │
│  5. สร้าง Reference (Contract SOURCE from Plan)                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### 3.3 ความแตกต่าง Contract vs Planning

| หัวข้อ          | Contract (สัญญา)        | Planning (แผนงาน)           |
| --------------- | ----------------------- | --------------------------- |
| **เลขที่สัญญา** | มีเสมอ (สัญญาแล้วเสร็จ) | อาจยังไม่มี (ร่าง/แผน)      |
| **สถานะ**       | PENDING → ACTIVE → ...  | PENDING → DRAFTING → FINISH |
| **การใช้งาน**   | เก็บข้อมูลสัญญาจริง     | วางแผนล่วงหน้า              |
| **ปิดงาน**      | EXPIRED / TERMINATED    | FINISH → สร้าง Contract     |

---

## 📁 Project Structure

```
CTMNG/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (protected)/        # Protected routes
│   │   ├── api/                # API Routes
│   │   └── login/              # Public login page
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI (Button, Input, etc.)
│   │   ├── forms/              # Form components
│   │   ├── tables/             # Data table components
│   │   └── shared/             # Shared components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities (Prisma, MinIO, Auth)
│   ├── stores/                 # State management (Zustand)
│   ├── types/                  # TypeScript types
│   └── utils/                  # Helper functions
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed data
├── public/                     # Static files
├── scripts/                    # Build & deploy scripts
├── deploy/                     # Production files
├── docs/                       # Documentation
└── docker-compose.yml          # MSSQL + MinIO
```

---

## 🔗 Related Documents

| Document                                                                       | Description           |
| ------------------------------------------------------------------------------ | --------------------- |
| [01-System-Architecture.md](01-System-Architecture.md)                         | สถาปัตยกรรมระบบ       |
| [02-API-Design.md](02-API-Design.md)                                           | การออกแบบ API         |
| [03-Frontend-Design.md](03-Frontend-Design.md)                                 | การออกแบบ Frontend    |
| [04-Phase-Roadmap.md](04-Phase-Roadmap.md)                                     | แผนการพัฒนาแบ่ง Phase |
| [Database Schema Design (CTMNG).md](<Database%20Schema%20Design%20(CTMNG).md>) | โครงสร้างฐานข้อมูล    |
| [Project Specification Document.md](Project%20Specification%20Document.md)     | ข้อกำหนดโปรเจค        |

---

## 📊 Success Criteria

### Phase 1 (MVP)

- [ ] Admin สามารถจัดการสัญญาได้ครบถ้วน
- [ ] Admin สามารถสร้างแผนจากสัญญาเดิมได้
- [ ] ระบบรองรับ 1,000+ สัญญา
- [ ] Response time < 500ms (95th percentile)
- [ ] เอกสารครบถ้วน

### Phase 2 (Enhancement)

- [ ] เจ้าของโครงการ login และจัดการโครงการตัวเองได้
- [ ] หัวหน้าส่วน assign งานให้ผู้ช่วยได้
- [ ] Integration กับ Active Directory
- [ ] ระบบรองรับ 10,000+ concurrent users

---

## 📝 Glossary

| Term        | Thai                  | Description                            |
| ----------- | --------------------- | -------------------------------------- |
| Contract    | สัญญา                 | ข้อตกลงที่ลงนามแล้ว                    |
| Planning    | แผนงาน                | ร่างสัญญา/แผนงานล่วงหน้า               |
| MA          | Maintenance Agreement | สัญญาบำรุงรักษา                        |
| TOR         | Terms of Reference    | ขอบเขตงาน                              |
| Committee   | คณะกรรมการ            | ทีมที่รับผิดชอบในแต่ละขั้นตอน          |
| Lineage     | สายสัมพันธ์           | ความสัมพันธ์ระหว่างสัญญาและแผน         |
| Polymorphic | พหุรูป                | Pattern ที่ตารางเดียวรองรับหลาย Entity |
