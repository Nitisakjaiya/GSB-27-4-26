# 📋 CTMNG v1.0 Development Plan

**Project:** Contract Management System (ระบบบริหารจัดการสัญญาและแผนงานล่วงหน้า)

**Version:** 1.0

**Created:** 2026-04-24

---

## 🎯 Project Overview

| รายการ           | รายละเอียด                        |
| ---------------- | --------------------------------- |
| **ชื่อระบบ**     | CTMNG Version 1.0                 |
| **ประเภท**       | Full-Stack Web Application        |
| **Framework**    | Next.js 16+ (App Router)          |
| **Database**     | Microsoft SQL Server + Prisma ORM |
| **File Storage** | MinIO (S3 Compatible)             |
| **Target Users** | 10,000+ concurrent users          |

---

## 📅 Development Phases

### Phase 1: Foundation (สัปดาห์ที่ 1-2)

| #   | Task                                      | Priority  | Est. Days |
| --- | ----------------------------------------- | --------- | --------- |
| 1.1 | Init Next.js Project + Package Setup      | 🔴 High   | 1         |
| 1.2 | สร้าง Prisma Schema จาก Database Design   | 🔴 High   | 2         |
| 1.3 | Setup Docker (MSSQL + MinIO)              | 🔴 High   | 1         |
| 1.4 | Seed Data สำหรับ Master Tables            | 🟡 Medium | 1         |
| 1.5 | Authentication System (JWT + tb_user)     | 🔴 High   | 2         |
| 1.6 | Base Layout + Navigation (Navbar, Menu)   | 🔴 High   | 2         |
| 1.7 | Shared UI Components (Table, Form, Modal) | 🟡 Medium | 3         |

**Deliverables:**

- [ ] Next.js project พร้อมใช้งาน
- [ ] Database ถูกสร้างและ seed data แล้ว
- [ ] Login/Logout ทำงานได้
- [ ] Layout หลักพร้อมเมนู

---

### Phase 2: Contract Module (สัปดาห์ที่ 3-5)

| #   | Task                                              | Priority  | Est. Days |
| --- | ------------------------------------------------- | --------- | --------- |
| 2.1 | API: CRUD Contract (List, Create, Update, Delete) | 🔴 High   | 3         |
| 2.2 | API: Contract Items (Master-Detail)               | 🔴 High   | 2         |
| 2.3 | UI: Contract List + Search + Pagination           | 🔴 High   | 2         |
| 2.4 | UI: Contract Form (Create/Edit)                   | 🔴 High   | 3         |
| 2.5 | UI: Contract Detail Page (View + Items)           | 🔴 High   | 2         |
| 2.6 | API: Committees (Polymorphic)                     | 🟡 Medium | 2         |
| 2.7 | UI: Committee Management Tab                      | 🟡 Medium | 2         |
| 2.8 | API: Files Upload/Download (MinIO)                | 🟡 Medium | 2         |
| 2.9 | UI: File Attachment Tab                           | 🟡 Medium | 2         |

**Deliverables:**

- [ ] จัดการข้อมูลสัญญาได้ครบถ้วน
- [ ] เพิ่ม/แก้ไข/ลบ รายการย่อยในสัญญา
- [ ] จัดการคณะกรรมการ
- [ ] อัปโหลด/ดาวน์โหลดไฟล์แนบ

---

### Phase 3: Planning Module (สัปดาห์ที่ 6-7)

| #   | Task                                        | Priority  | Est. Days |
| --- | ------------------------------------------- | --------- | --------- |
| 3.1 | API: CRUD Planning                          | 🔴 High   | 2         |
| 3.2 | API: Planning Items                         | 🔴 High   | 1         |
| 3.3 | API: Copy Contract → Planning (Transaction) | 🔴 High   | 2         |
| 3.4 | API: Reference (Lineage Tracking)           | 🟡 Medium | 1         |
| 3.5 | UI: Planning List + Filter by Year/Status   | 🔴 High   | 2         |
| 3.6 | UI: Planning Form                           | 🔴 High   | 2         |
| 3.7 | UI: "สร้างแผนจากสัญญา" Wizard               | 🔴 High   | 2         |
| 3.8 | UI: Reuse Committees/Files from Contract    | 🟡 Medium | 1         |

**Deliverables:**

- [ ] จัดการแผนงานได้ครบถ้วน
- [ ] สร้างแผนจากสัญญาเดิมได้
- [ ] ติดตาม Lineage (ต้นทางของแผน)

---

### Phase 4: Tracking & Budget (สัปดาห์ที่ 8)

| #   | Task                                          | Priority  | Est. Days |
| --- | --------------------------------------------- | --------- | --------- |
| 4.1 | API: CRUD Tracking                            | 🟡 Medium | 1         |
| 4.2 | UI: Tracking List/Form (Tab in Contract/Plan) | 🟡 Medium | 2         |
| 4.3 | API: CRUD Budget                              | 🟡 Medium | 1         |
| 4.4 | UI: Budget Allocation by Year                 | 🟡 Medium | 2         |

**Deliverables:**

- [ ] บันทึกการติดตามความคืบหน้า
- [ ] กระจายงบประมาณตามปี

---

### Phase 5: Dashboard & Reports (สัปดาห์ที่ 9-10)

| #   | Task                                           | Priority  | Est. Days |
| --- | ---------------------------------------------- | --------- | --------- |
| 5.1 | Dashboard: Summary Cards                       | 🟡 Medium | 2         |
| 5.2 | Dashboard: Charts (สัญญาใกล้หมดอายุ, งบประมาณ) | 🟡 Medium | 2         |
| 5.3 | Report: รายงานสัญญา (Filter + Export Excel)    | 🟡 Medium | 2         |
| 5.4 | Report: รายงานแผนงาน                           | 🟡 Medium | 1         |
| 5.5 | Report: รายงานงบประมาณ                         | 🟡 Medium | 2         |

**Deliverables:**

- [ ] Dashboard แสดงภาพรวมระบบ
- [ ] Export รายงานเป็น Excel

---

### Phase 6: Admin & Polish (สัปดาห์ที่ 11-12)

| #   | Task                                         | Priority  | Est. Days |
| --- | -------------------------------------------- | --------- | --------- |
| 6.1 | Admin: User Management                       | 🟡 Medium | 2         |
| 6.2 | Admin: Master Data (Category, Contract Type) | 🟡 Medium | 2         |
| 6.3 | Admin: Planning Status / Tracking Type       | 🟡 Medium | 1         |
| 6.4 | History/Audit Trail Implementation           | 🟢 Low    | 2         |
| 6.5 | Performance Optimization                     | 🟡 Medium | 2         |
| 6.6 | Security Hardening                           | 🔴 High   | 2         |
| 6.7 | Testing & Bug Fixes                          | 🔴 High   | 3         |
| 6.8 | Documentation (User Manual)                  | 🟡 Medium | 2         |

**Deliverables:**

- [ ] Admin สามารถจัดการ Master Data
- [ ] ระบบพร้อมใช้งานจริง

---

## 🗂️ Folder Structure

```
CTMNG/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home redirect
│   │   ├── globals.css
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── (protected)/            # Auth required
│   │   │   ├── layout.tsx          # Protected layout
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── contracts/
│   │   │   │   ├── page.tsx        # List
│   │   │   │   ├── new/page.tsx    # Create
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx    # Detail view
│   │   │   │       └── edit/page.tsx
│   │   │   ├── planning/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   ├── from-contract/[id]/page.tsx  # Wizard
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── edit/page.tsx
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── contracts/page.tsx
│   │   │   │   ├── planning/page.tsx
│   │   │   │   └── budget/page.tsx
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── users/page.tsx
│   │   │   │   └── master-data/
│   │   │   │       ├── categories/page.tsx
│   │   │   │       ├── contract-types/page.tsx
│   │   │   │       └── ...
│   │   │   └── manual/
│   │   │       └── page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   ├── logout/route.ts
│   │       │   └── me/route.ts
│   │       ├── contracts/
│   │       │   ├── route.ts          # GET list, POST create
│   │       │   └── [id]/
│   │       │       ├── route.ts      # GET one, PUT, DELETE
│   │       │       └── items/route.ts
│   │       ├── planning/
│   │       │   ├── route.ts
│   │       │   ├── from-contract/[id]/route.ts  # Copy
│   │       │   └── [id]/
│   │       │       ├── route.ts
│   │       │       └── items/route.ts
│   │       ├── committees/route.ts   # Polymorphic
│   │       ├── tracking/route.ts     # Polymorphic
│   │       ├── files/
│   │       │   ├── route.ts          # Upload
│   │       │   └── [id]/route.ts     # Download/Delete
│   │       ├── budget/route.ts
│   │       ├── reference/route.ts
│   │       └── admin/
│   │           ├── users/route.ts
│   │           └── master-data/
│   │               ├── categories/route.ts
│   │               └── ...
│   ├── components/
│   │   ├── ui/                       # Base components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   └── Toast.tsx
│   │   ├── forms/                    # Form components
│   │   │   ├── ContractForm.tsx
│   │   │   ├── PlanningForm.tsx
│   │   │   ├── CommitteeForm.tsx
│   │   │   └── TrackingForm.tsx
│   │   ├── tables/                   # Table components
│   │   │   ├── ContractTable.tsx
│   │   │   ├── PlanningTable.tsx
│   │   │   └── ItemsTable.tsx
│   │   └── shared/
│   │       ├── Navbar.tsx
│   │       ├── MainMenu.tsx
│   │       ├── PageHeader.tsx
│   │       ├── StatusBadge.tsx
│   │       └── LoadingSpinner.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useContracts.ts
│   │   ├── usePlanning.ts
│   │   └── useToast.ts
│   ├── lib/
│   │   ├── prisma.ts                 # Prisma singleton
│   │   ├── minio.ts                  # MinIO client
│   │   ├── auth.ts                   # JWT utilities
│   │   └── validators.ts             # Zod schemas
│   ├── stores/                       # Zustand stores (optional)
│   │   └── authStore.ts
│   ├── types/
│   │   ├── contract.ts
│   │   ├── planning.ts
│   │   └── common.ts
│   └── utils/
│       ├── apiFetch.ts               # API helper with basePath
│       ├── formatters.ts             # Date, Currency formatters
│       └── helpers.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                       # Seed script
├── public/
│   └── logo.png
├── scripts/
│   ├── build-and-copy.ps1
│   ├── copy-full.ps1
│   └── copy-compact.ps1
├── deploy/
│   ├── env-configs/
│   │   └── .env
│   └── nginx-conf/
│       └── nginx.conf
├── docs/
│   ├── Project Specification Document.md
│   ├── Database Schema Design (CTMNG).md
│   └── CTMNG Development Plan.md     # This file
├── docker-compose.yml                # MSSQL + MinIO
├── .github/
│   └── copilot-instructions.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.js
└── .env.local
```

---

## 🔄 API Patterns

### Standard Response Format

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [...]
  }
}
```

### Polymorphic API Pattern

```typescript
// GET /api/committees?base_type=CON&base_id=123
// GET /api/tracking?base_type=PLAN&base_id=456
// GET /api/files?base_type=CON&base_id=123

// POST /api/committees
{
  "base_id": 123,
  "base_type": "CON",
  "committee_type": "TOR",
  "member_name": "...",
  ...
}
```

### Copy Contract → Planning

```typescript
// POST /api/planning/from-contract/123
{
  "target_year": 2570,
  "target_quarter": 1,
  "planning_status": "PENDING",
  "copy_items": true,
  "copy_committees": true,
  "copy_files": false
}
```

---

## ⚡ Technical Decisions

| Decision           | Choice                    | Reason                     |
| ------------------ | ------------------------- | -------------------------- |
| State Management   | React Context + SWR       | Simple, built-in caching   |
| Form Library       | React Hook Form + Zod     | Type-safe validation       |
| Table              | Custom + Pagination       | Flexibility, performance   |
| Date Handling      | date-fns                  | Lightweight, tree-shakable |
| Icons              | Lucide React              | Clean, consistent          |
| Toast/Notification | Custom or react-hot-toast | Simple                     |

---

## 🔐 Security Checklist

- [ ] Input Validation ทุก API (Zod)
- [ ] Authentication middleware
- [ ] Role-based access control
- [ ] SQL Injection prevention (Prisma)
- [ ] XSS prevention
- [ ] File upload validation (type, size)
- [ ] Rate limiting
- [ ] HTTPS only (production)
- [ ] Secrets in .env (not in code)
- [ ] Audit logging

---

## 📊 Performance Checklist

- [ ] Pagination ทุก list API
- [ ] Select เฉพาะ field ที่ต้องการ
- [ ] Composite indexes ตาม query pattern
- [ ] Connection pooling (Prisma singleton)
- [ ] Lazy loading components
- [ ] Image optimization
- [ ] Caching strategy (SWR/Redis)

---

## 📝 Notes

1. **ลำดับความสำคัญ:** Phase 1-3 เป็น Core Features ต้องเสร็จก่อน
2. **Testing:** ทดสอบด้วย manual testing ก่อน จะเพิ่ม automated tests ภายหลัง
3. **Deployment:** Development ใช้ localhost, Production ใช้ basePath `/ctmng`
4. **ปีงบประมาณ:** ใช้ปี พ.ศ. ทั้งหมด
