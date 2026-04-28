# GitHub Copilot Instructions - CTMNG v1.0

> Contract Management System - คำแนะนำสำหรับ AI Assistant

---

## 🌐 Language & Communication

**ตอบคำถามและสื่อสารเป็นภาษาไทยเสมอ** (Always answer in Thai language)

---

## 🎯 Project Context

### Project Overview

| รายการ          | รายละเอียด                             |
| --------------- | -------------------------------------- |
| **ชื่อระบบ**    | CTMNG Version 1.0                      |
| **ชื่อภาษาไทย** | ระบบบริหารจัดการสัญญาและแผนงานล่วงหน้า |
| **ประเภท**      | Full-Stack Web Application             |
| **Folder**      | CTMNG/                                 |

### Reference Documents

**เอกสารที่ต้องอ่านก่อนทำงานทุกครั้ง:**

| เอกสาร              | Path                                     | คำอธิบาย           |
| ------------------- | ---------------------------------------- | ------------------ |
| **Project Spec**    | `docs/Project Specification Document.md` | ข้อกำหนดโปรเจค     |
| **Database Schema** | `docs/Database Schema Design (CTMNG).md` | โครงสร้างฐานข้อมูล |
| **Prisma Schema**   | `prisma/schema.prisma`                   | ORM Schema         |

---

## 🏗️ Architecture & Stack

### Technology Stack

| Layer         | Technology                   |
| ------------- | ---------------------------- |
| **Framework** | Next.js 16+ (App Router)     |
| **Language**  | TypeScript 5.x               |
| **State**     | Zustand หรือ React Context   |
| **CSS**       | Tailwind CSS 4.x             |
| **ORM**       | Prisma 6.x                   |
| **Database**  | Microsoft SQL Server (MSSQL) |
| **Storage**   | MinIO (S3 Compatible)        |
| **Auth Dev**  | JWT + tb_user                |
| **Auth Prod** | Active Directory + JWT       |

### Project Structure

```
CTMNG/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── (protected)/          # Protected routes
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/        # ภาพรวมระบบ
│   │   │   ├── contracts/        # ข้อมูลสัญญา
│   │   │   ├── planning/         # ร่างสัญญา/แผนงาน
│   │   │   ├── messages/         # ข้อความ/แจ้งเตือน
│   │   │   ├── reports/          # ออกรายงาน
│   │   │   └── admin/            # ตั้งค่าระบบ
│   │   ├── api/                  # API Routes
│   │   │   ├── auth/
│   │   │   ├── contracts/
│   │   │   ├── planning/
│   │   │   ├── committees/
│   │   │   ├── tracking/
│   │   │   ├── files/
│   │   │   ├── messages/
│   │   │   └── admin/
│   │   └── login/
│   ├── components/
│   │   ├── ui/                   # Base UI components
│   │   ├── forms/                # Form components
│   │   ├── tables/               # Data tables
│   │   └── shared/               # Shared components
│   ├── hooks/
│   ├── lib/
│   │   ├── prisma.ts             # Prisma client singleton
│   │   ├── minio.ts              # MinIO client
│   │   └── auth.ts               # Auth utilities
│   ├── stores/
│   ├── types/
│   └── utils/
├── prisma/
│   └── schema.prisma
├── public/
├── scripts/                      # Build & deploy scripts
│   ├── build-and-copy.ps1
│   ├── copy-full.ps1
│   └── copy-compact.ps1
├── deploy/                       # Production-ready files
├── docs/                         # Project documentation
└── .github/
    └── copilot-instructions.md   # This file
```

---

## ⚠️ Pre-Task Checklist (ต้องทำก่อนทุกครั้ง!)

**ก่อนแก้ไขโค้ดต้อง:**

1. **อ่าน Database Schema** ที่ `docs/Database Schema Design (CTMNG).md`
2. **ตรวจสอบ Standard Columns** - ทุกตารางหลักต้องมี `[+Std Cols]`
3. **ใช้ Polymorphic Pattern** - สำหรับ committees, tracking, files ต้องใช้ `base_id` + `base_type`

---

## 📦 Package Versions (บังคับใช้!)

| Package          | Version    | หมายเหตุ                           |
| ---------------- | ---------- | ---------------------------------- |
| **Next.js**      | **16.1.6** | 🔴 ต้องใช้ 16.x (รองรับ --webpack) |
| **React**        | **19.2.4** | ตามที่ Next.js 16 กำหนด            |
| **TypeScript**   | **5.7+**   | ใช้เวอร์ชันล่าสุด                  |
| **Tailwind CSS** | **4.0+**   | ไวยากรณ์ใหม่                       |
| **Prisma**       | **6.19+**  | ORM สำหรับ MSSQL                   |

---

## 🗄️ Database Design Principles

### 1. Naming Convention

- **`aid` = Auto ID** - Primary Key ใช้ BIGINT IDENTITY(1,1)
- **ตัวอย่าง:** `ct_aid` = Contract Auto ID, `plan_aid` = Planning Auto ID

### 2. Standard Columns (`[+Std Cols]`)

ทุกตารางหลักต้องมี 7 ฟิลด์นี้:

```typescript
// Prisma fields
created_at  DateTime  @default(now())
created_by  BigInt
updated_at  DateTime  @updatedAt
updated_by  BigInt
is_deleted  Boolean   @default(false)
deleted_at  DateTime?
deleted_by  BigInt?
```

### 3. Polymorphic Relationships

ตารางที่ใช้ร่วมกันหลายโมดูล ต้องใช้:

```typescript
base_id    BigInt    // Contract ID หรือ Plan ID
base_type  String    // 'CON' หรือ 'PLAN'
```

**ตารางที่ใช้ Polymorphic:**

- `tb_reference` - ความสัมพันธ์ Any-to-Any
- `tb_committees` - คณะกรรมการ
- `tb_tracking` - ติดตามความคืบหน้า
- `tb_files` - ไฟล์แนบ MinIO

### 4. Base Types

| Code        | Description                     |
| ----------- | ------------------------------- |
| `CON`       | Contract (สัญญา)                |
| `PLAN`      | Planning (ร่างสัญญา/แผนงาน)     |
| `CON_ITEM`  | Contract Item (รายการย่อยสัญญา) |
| `PLAN_ITEM` | Planning Item (รายการย่อยแผน)   |

---

## 🔧 Prisma Best Practices

### 1. Schema Mapping

```prisma
// ใช้ @map สำหรับชื่อตารางและคอลัมน์
model Contract {
  ct_aid         BigInt   @id @default(autoincrement())
  ct_number      String   @db.NVarChar(100)
  ct_name        String   @db.NVarChar(255)

  @@map("tb_contract")
}
```

### 2. Transaction สำหรับ Copy Data

```typescript
// เมื่อสร้างแผนงานจากสัญญา ต้องใช้ Transaction
await prisma.$transaction(async (tx) => {
    // 1. Copy contract to planning
    const plan = await tx.planning.create({ data: planData });

    // 2. Copy contract items to planning items
    for (const item of contractItems) {
        await tx.planningItem.create({
            data: { ...item, plan_id: plan.plan_aid },
        });
    }

    // 3. Create reference link
    await tx.reference.create({
        data: {
            base_id: plan.plan_aid,
            base_type: 'PLAN',
            ref_contract_id: contractId,
            ref_contract_type: 'CON',
            ref_type: 'SOURCE',
        },
    });
});
```

### 3. Soft Delete Pattern

```typescript
// ห้าม DELETE จริง ใช้ Soft Delete เสมอ
await prisma.contract.update({
    where: { ct_aid: id },
    data: {
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: userId,
    },
});

// Query ต้องกรอง is_deleted
const contracts = await prisma.contract.findMany({
    where: { is_deleted: false },
});
```

---

## 📁 MinIO File Management

### File Upload Pattern

```typescript
// lib/minio.ts
import { Client } from 'minio';

const minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT!,
    port: parseInt(process.env.MINIO_PORT!),
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET_KEY!,
});

export async function uploadFile(bucket: string, objectName: string, file: Buffer): Promise<string> {
    await minioClient.putObject(bucket, objectName, file);
    return objectName;
}
```

### File Record in Database

```typescript
// บันทึกข้อมูลไฟล์ใน tb_files
await prisma.file.create({
    data: {
        base_id: contractId,
        base_type: 'CON',
        file_name: 'สัญญาลงนาม.pdf',
        file_bucket: 'contracts',
        file_link: 'contracts/2026/ct_001_signed.pdf',
        file_type: 'CONTRACT',
        created_by: userId,
    },
});
```

---

## 🚨 Performance & Scalability (10,000+ Users)

### Database Best Practices

```typescript
// ❌ ผิด - ไม่มี pagination
const contracts = await prisma.contract.findMany();

// ✅ ถูก - มี pagination + select เฉพาะที่ต้องการ
const contracts = await prisma.contract.findMany({
    skip: (page - 1) * limit,
    take: Math.min(limit, 100),
    where: { is_deleted: false },
    select: { ct_aid: true, ct_number: true, ct_name: true },
});
```

### Connection Pooling (Prisma Singleton)

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
```

---

## 🛡️ Security Standards

### Input Validation

```typescript
import { z } from 'zod';

const CreateContractSchema = z.object({
    ct_number: z.string().min(1).max(100),
    ct_name: z.string().min(1).max(255),
    vendor: z.string().max(255).optional(),
    purchase_cost: z.number().positive().optional(),
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const result = CreateContractSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json({ error: 'Invalid input', details: result.error.issues }, { status: 400 });
    }
    // ...
}
```

### Authentication Check

```typescript
// ทุก API ต้องตรวจสอบ authentication
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const session = await getSession(request);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // ...
}
```

---

## 🔗 basePath Configuration

### Dev vs Production

| Environment | URL                        | basePath |
| ----------- | -------------------------- | -------- |
| Development | `http://localhost:3000/`   | (none)   |
| Production  | `https://domain.com/ctmng` | `/ctmng` |

### apiFetch Helper

```typescript
// src/utils/apiFetch.ts
export function getBasePath(): string {
    if (typeof window === 'undefined') return '';

    const pathname = window.location.pathname;
    const match = pathname.match(/^\/([^\/]+)/);

    const knownRoutes = ['login', 'dashboard', 'contracts', 'planning', 'api'];
    if (match && !knownRoutes.includes(match[1])) {
        return `/${match[1]}`;
    }
    return '';
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const basePath = getBasePath();
    const fullUrl = url.startsWith('/') ? `${basePath}${url}` : url;

    return fetch(fullUrl, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
}
```

---

## 📋 Menu Structure

| เมนู        | Path         | Description                    |
| ----------- | ------------ | ------------------------------ |
| Dashboard   | `/dashboard` | ภาพรวมระบบ                     |
| ข้อมูลสัญญา | `/contracts` | Contract Management            |
| ร่างสัญญา   | `/planning`  | Planning / Draft Management    |
| ข้อความ     | `/messages`  | ข้อความและแจ้งเตือน            |
| ออกรายงาน   | `/reports`   | Reports                        |
| Admin       | `/admin`     | ตั้งค่าระบบและฐานข้อมูลอ้างอิง |
| คู่มือ      | `/manual`    | User Manual                    |

---

## 📝 Coding Standards

### 1. Client Components

```typescript
'use client';

import { useState } from 'react';
// Client-side logic here
```

### 2. Server Components (Default)

```typescript
// ไม่ต้องใส่ directive
import { prisma } from '@/lib/prisma';

export default async function ContractsPage() {
  const contracts = await prisma.contract.findMany({
    where: { is_deleted: false }
  });
  return <div>...</div>;
}
```

### 3. API Routes Pattern

```typescript
// app/api/contracts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const session = await getSession(request);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    const contracts = await prisma.contract.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { is_deleted: false },
        orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ data: contracts, page, limit });
}
```

---

## 🔧 Build Scripts

### Required Scripts in package.json

```json
{
    "scripts": {
        "dev": "next dev -p 8008",
        "build": "next build --webpack",
        "start": "next start -p 8008",
        "lint": "next lint",
        "type-check": "tsc --noEmit",
        "db:push": "prisma db push",
        "db:generate": "prisma generate"
    }
}
```

---

## 🐳 Docker Services (Shared Containers)

> **หมายเหตุ:** ใช้ Docker containers ที่มีอยู่แล้วร่วมกับโปรเจคอื่น

| Service   | Container | Database/Bucket                   |
| --------- | --------- | --------------------------------- |
| **MSSQL** | Existing  | Database: `CTMNG` (ต้องสร้างใหม่) |
| **MinIO** | Existing  | Bucket: `ctmng` (ต้องสร้างใหม่)   |
| **Redis** | Existing  | Shared (optional caching)         |

### Environment Variables

```env
# Database
DATABASE_URL="sqlserver://localhost:1433;database=CTMNG;user=sa;password=xxx;encrypt=false"

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=xxx
MINIO_SECRET_KEY=xxx
MINIO_BUCKET=ctmng

# Redis (optional)
REDIS_URL=redis://localhost:6379

# App
PORT=8008
```

---

## 🎨 UI/UX Design Rules

### 1. Table Column Order (สำคัญมาก!)

**Action และ Status ต้องอยู่ด้านหน้าสุดเสมอ**

```
✅ ถูกต้อง: [Action] [Status] [ข้อมูลสำคัญ] [ข้อมูลอื่นๆ...]
❌ ผิด:   [ข้อมูล...] [Status] [Action]
```

**เหตุผล:** ถ้า Action/Status อยู่ท้ายตาราง เมื่อมีข้อมูลยาว user ต้องเลื่อนดู ทำให้หงุดหงิด

### 2. Card-based Todo Style (สำหรับ Tracking, Items แบบ many)

รายการที่เชื่อมกับ Contract/Planning แบบ many ให้แสดงเป็น **Card + Todo Style** (คล้าย Microsoft Planner)

- เพิ่มง่าย: พิมพ์แล้ว Enter เพื่อเพิ่มรายการใหม่
- ลบง่าย: คลิก checkbox หรือ icon เพื่อลบ
- Drag & Drop: ลากเพื่อเปลี่ยนลำดับ (optional)

### 3. Theme: Sky Blue (โทนสีฟ้าท้องฟ้า)

| Name          | Hex       | Usage   |
| ------------- | --------- | ------- |
| Primary       | `#0EA5E9` | Sky-500 |
| Primary Dark  | `#0284C7` | Sky-600 |
| Primary Light | `#E0F2FE` | Sky-100 |
| Accent        | `#38BDF8` | Sky-400 |

---

## 📚 Reference Patterns (tb_reference)

### Reference Types

| ref_type  | Description                           |
| --------- | ------------------------------------- |
| `SOURCE`  | ต้นทาง (สัญญาเดิมที่ถูก Copy มาทำแผน) |
| `MERGED`  | ถูกรวมจาก                             |
| `RELATED` | เกี่ยวข้องกัน                         |

### Usage Example

```typescript
// เมื่อสร้างแผนงานจากสัญญา
await prisma.reference.create({
    data: {
        base_id: newPlanId,
        base_type: 'PLAN',
        ref_contract_id: sourceContractId,
        ref_contract_type: 'CON',
        ref_type: 'SOURCE',
        created_by: userId,
    },
});
```

---

## ✅ Verification Checklist

ก่อน commit ทุกครั้ง ต้องตรวจสอบ:

- [ ] ใช้ `[+Std Cols]` ในตารางใหม่
- [ ] ใช้ Polymorphic pattern ถูกต้อง (`base_id` + `base_type`)
- [ ] มี Input Validation (Zod)
- [ ] มี Authentication check ใน API
- [ ] ใช้ Soft Delete ไม่ใช่ Hard Delete
- [ ] ใช้ Transaction สำหรับ multi-table operations
- [ ] มี Pagination ใน list APIs
- [ ] `npm run lint` ผ่าน
- [ ] `npm run type-check` ผ่าน
