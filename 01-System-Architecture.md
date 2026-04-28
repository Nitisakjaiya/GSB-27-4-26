# 🏗️ System Architecture - CTMNG

> สถาปัตยกรรมระบบ Contract Management System

**Version:** 1.0  
**Last Updated:** 2026-04-24

---

## 📌 Architecture Overview

CTMNG ใช้สถาปัตยกรรม **Monolithic Full-Stack** บน Next.js 16+ ที่รวม Frontend และ Backend ไว้ในโปรเจคเดียว เหมาะสำหรับทีมขนาดเล็ก-กลาง และการ deploy แบบ standalone

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Client Browser                              │
│                    (React, Next.js Client Components)                    │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           Next.js Application                            │
│  ┌────────────────────────────┬────────────────────────────────────┐    │
│  │      Server Components     │         API Routes (REST)          │    │
│  │   (SSR, Data Fetching)     │   /api/contracts, /api/planning    │    │
│  └────────────────────────────┴────────────────────────────────────┘    │
│                                   │                                      │
│                                   ▼                                      │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                       Business Logic Layer                        │   │
│  │              (Validation, Transaction, Polymorphic)               │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                   │                                      │
│                                   ▼                                      │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                        Prisma ORM Layer                           │   │
│  │                     (Type-safe DB Access)                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                              ▼
┌─────────────────────────────┐    ┌─────────────────────────────┐
│    Microsoft SQL Server     │    │           MinIO             │
│    (Docker Container)       │    │    (Docker Container)       │
│    - Contract Data          │    │    - File Attachments       │
│    - Planning Data          │    │    - Documents              │
│    - User Data              │    │    - Reports                │
└─────────────────────────────┘    └─────────────────────────────┘
```

---

## 🖥️ Infrastructure Diagram

### Development Environment

> **หมายเหตุ:** ใช้ Docker containers ที่มีอยู่แล้วร่วมกับโปรเจคอื่น (ต้องสร้าง Database: `CTMNG` และ Bucket: `ctmng`)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Developer Machine (Windows)                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     Next.js Dev Server                         │  │
│  │                     http://localhost:8008                      │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                 │                                    │
│           ┌─────────────────────┴─────────────────────┐              │
│           ▼                                           ▼              │
│  ┌─────────────────────┐                 ┌─────────────────────┐    │
│  │  Docker: MSSQL      │                 │   Docker: MinIO     │    │
│  │  Port: 1433         │                 │   Port: 9000/9001   │    │
│  │  DB: CTMNG          │                 │   Bucket: ctmng     │    │
│  └─────────────────────┘                 └─────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Production Environment

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Windows Server 2019 (Production)                  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                        Nginx Reverse Proxy                     │  │
│  │           https://domain.com/ctmng → localhost:8008           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                 │                                    │
│                                 ▼                                    │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                  Node.js (NSSM Windows Service)                │  │
│  │                     CTMNG Standalone Build                     │  │
│  │                      Port: 8008 (internal)                     │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                 │                                    │
│           ┌─────────────────────┴─────────────────────┐              │
│           ▼                                           ▼              │
│  ┌─────────────────────┐                 ┌─────────────────────┐    │
│  │   Docker: MSSQL     │                 │   Docker: MinIO     │    │
│  │   Internal Network  │                 │   Internal Network  │    │
│  │   DB: CTMNG         │                 │   Bucket: ctmng     │    │
│  └─────────────────────┘                 └─────────────────────┘    │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   Active Directory (Phase 2)                   │  │
│  │                   LDAP Authentication                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Application Layers

### 1. Presentation Layer (Frontend)

```
src/
├── app/
│   ├── layout.tsx                  # Root layout (fonts, metadata)
│   ├── globals.css                 # Global styles
│   ├── login/
│   │   └── page.tsx                # Login page (public)
│   └── (protected)/
│       ├── layout.tsx              # Auth check, Navigation
│       ├── dashboard/page.tsx
│       ├── contracts/
│       │   ├── page.tsx            # Contract list
│       │   ├── new/page.tsx        # Create contract
│       │   └── [id]/
│       │       ├── page.tsx        # Contract detail
│       │       └── edit/page.tsx   # Edit contract
│       ├── planning/
│       └── admin/
├── components/
│   ├── ui/                         # Base components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   └── Pagination.tsx
│   ├── forms/                      # Form components
│   │   ├── ContractForm.tsx
│   │   └── PlanningForm.tsx
│   └── shared/                     # Shared components
│       ├── Navbar.tsx
│       ├── MainMenu.tsx
│       └── PageHeader.tsx
```

### 2. API Layer (Backend)

```
src/app/api/
├── auth/
│   ├── login/route.ts              # POST: Login
│   ├── logout/route.ts             # POST: Logout
│   └── me/route.ts                 # GET: Current user
├── contracts/
│   ├── route.ts                    # GET: List, POST: Create
│   └── [id]/
│       ├── route.ts                # GET, PUT, DELETE
│       └── items/route.ts          # Contract items
├── planning/
│   ├── route.ts
│   ├── from-contract/[id]/route.ts # Copy from contract
│   └── [id]/route.ts
├── committees/route.ts             # Polymorphic
├── tracking/route.ts               # Polymorphic
├── files/
│   ├── route.ts                    # Upload
│   └── [id]/route.ts               # Download/Delete
└── admin/
    ├── users/route.ts
    └── master-data/
```

### 3. Business Logic Layer

```
src/lib/
├── prisma.ts                       # Prisma client singleton
├── minio.ts                        # MinIO client
├── auth.ts                         # JWT utilities
├── validators.ts                   # Zod schemas
└── services/                       # Business logic (optional)
    ├── contractService.ts
    ├── planningService.ts
    └── copyService.ts              # Copy contract to planning
```

### 4. Data Access Layer

```
prisma/
├── schema.prisma                   # Database schema
├── seed.ts                         # Seed data
└── migrations/                     # Migration files
```

---

## 🔐 Authentication Architecture

### Phase 1: JWT + Database

```
┌──────────────────────────────────────────────────────────────────┐
│                      Authentication Flow (Phase 1)                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User submits username/password                                │
│                     │                                             │
│                     ▼                                             │
│  2. Server validates against tb_user table                       │
│     - Check username exists                                       │
│     - Verify password hash (bcrypt)                              │
│                     │                                             │
│                     ▼                                             │
│  3. Generate JWT token                                            │
│     - Payload: { userId, username, role, exp }                    │
│     - Sign with JWT_SECRET                                        │
│                     │                                             │
│                     ▼                                             │
│  4. Return token in HttpOnly cookie                               │
│                     │                                             │
│                     ▼                                             │
│  5. Client includes cookie in subsequent requests                 │
│                     │                                             │
│                     ▼                                             │
│  6. Server validates JWT on each API call                         │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Phase 2: Active Directory + JWT

```
┌──────────────────────────────────────────────────────────────────┐
│                      Authentication Flow (Phase 2)                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User submits AD username/password                             │
│                     │                                             │
│                     ▼                                             │
│  2. Server authenticates against Active Directory (LDAP)          │
│     - Bind with AD server                                         │
│     - Verify credentials                                          │
│     - Get user attributes (displayName, department, title)        │
│                     │                                             │
│                     ▼                                             │
│  3. Sync/Update user info in tb_user                             │
│     - Create if not exists                                        │
│     - Update department, position from AD                         │
│                     │                                             │
│                     ▼                                             │
│  4. Generate JWT token with AD info                               │
│     - Payload: { userId, username, department, position, role }   │
│                     │                                             │
│                     ▼                                             │
│  5. Return token + continue as Phase 1                            │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Architecture

### Polymorphic Pattern

ระบบใช้ **Polymorphic Relationships** สำหรับตารางที่ใช้ร่วมกันหลาย Entity:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Polymorphic Tables Pattern                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  tb_committees, tb_tracking, tb_files, tb_budget                    │
│  ใช้ base_id + base_type เพื่อเชื่อมกับหลาย Entity                  │
│                                                                      │
│  ┌─────────────────┐              ┌─────────────────┐               │
│  │   tb_contract   │              │   tb_planning   │               │
│  │   ct_aid = 123  │              │  plan_aid = 456 │               │
│  └────────┬────────┘              └────────┬────────┘               │
│           │                                │                         │
│           │  base_type = 'CON'             │  base_type = 'PLAN'     │
│           │  base_id = 123                 │  base_id = 456          │
│           │                                │                         │
│           ▼                                ▼                         │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                      tb_committees                           │    │
│  │  cmit_aid | base_id | base_type | committee_type | ...      │    │
│  │     1     |   123   |   'CON'   |     'TOR'      | ...      │    │
│  │     2     |   456   |  'PLAN'   |     'BUY'      | ...      │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Reference Pattern (Lineage Tracking)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Reference Pattern (Lineage)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  เมื่อสร้าง Planning จาก Contract:                                   │
│                                                                      │
│  tb_contract (ct_aid = 100)                                         │
│       │                                                              │
│       │  Copy data                                                   │
│       ▼                                                              │
│  tb_planning (plan_aid = 200)                                       │
│       │                                                              │
│       │  Create reference                                            │
│       ▼                                                              │
│  tb_reference                                                        │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │ ref_id | base_id | base_type | ref_contract_id | ref_type │      │
│  │   1    |   200   |  'PLAN'   |       100       | 'SOURCE' │      │
│  └─────────────────────────────────────────────────────────┘        │
│                                                                      │
│  ref_type:                                                           │
│  - SOURCE: ต้นทาง (สัญญาเดิมที่ Copy มา)                             │
│  - MERGED: ถูกรวมจากหลายสัญญา                                        │
│  - SPLIT: ถูกแยกจากสัญญาเดียว                                        │
│  - RENEWED: ต่ออายุจากสัญญาเดิม                                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 File Storage Architecture (MinIO)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      MinIO Storage Structure                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Bucket: ctmng-files                                                │
│  ├── contracts/                                                      │
│  │   ├── 2026/                                                       │
│  │   │   ├── ct_001_contract.pdf                                    │
│  │   │   ├── ct_001_tor.pdf                                         │
│  │   │   └── ct_002_quotation.pdf                                   │
│  │   └── 2027/                                                       │
│  │       └── ...                                                     │
│  ├── planning/                                                       │
│  │   ├── 2026/                                                       │
│  │   │   └── plan_001_draft.docx                                    │
│  │   └── ...                                                         │
│  └── temp/                                                           │
│      └── (temporary uploads)                                         │
│                                                                      │
│  Database Reference (tb_files):                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ file_aid | base_id | base_type | file_bucket  | file_link    │   │
│  │    1     |   123   |   'CON'   | ctmng-files  | contracts/.. │   │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Performance Architecture

### Connection Pooling

```typescript
// src/lib/prisma.ts - Singleton Pattern
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
```

### Caching Strategy

```
┌─────────────────────────────────────────────────────────────────────┐
│                       Caching Strategy                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Level 1: SWR (Client-side)                                         │
│  - React Query / SWR for data fetching                              │
│  - Stale-while-revalidate pattern                                   │
│  - Cache in memory (browser)                                        │
│                                                                      │
│  Level 2: Next.js Data Cache (Server-side)                          │
│  - fetch() with revalidate option                                   │
│  - Automatic deduplication                                          │
│                                                                      │
│  Level 3: Redis (Future - if needed)                                │
│  - Master data caching                                              │
│  - Session storage                                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### API Response Optimization

```typescript
// Example: Pagination + Select specific fields
const contracts = await prisma.contract.findMany({
    skip: (page - 1) * limit,
    take: Math.min(limit, 100), // Max 100 per page
    where: { is_deleted: false },
    select: {
        ct_aid: true,
        ct_number: true,
        ct_name: true,
        contract_status: true,
        end_date: true,
        // Don't select heavy fields like brief_desc
    },
    orderBy: { created_at: 'desc' },
});
```

---

## 🔒 Security Architecture

### Defense in Depth

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Security Layers                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Layer 1: Network (Nginx)                                           │
│  ├── HTTPS only                                                      │
│  ├── Rate limiting                                                   │
│  ├── Request size limit                                              │
│  └── Security headers (CSP, HSTS)                                   │
│                                                                      │
│  Layer 2: Application (Next.js)                                     │
│  ├── Authentication middleware                                       │
│  ├── Input validation (Zod)                                         │
│  ├── CSRF protection                                                 │
│  └── XSS prevention (React auto-escaping)                           │
│                                                                      │
│  Layer 3: Data (Prisma)                                             │
│  ├── Parameterized queries (SQL injection prevention)               │
│  ├── Soft delete (data preservation)                                │
│  └── Audit trail (tb_*_history)                                     │
│                                                                      │
│  Layer 4: Storage (MinIO)                                           │
│  ├── Pre-signed URLs (time-limited access)                          │
│  ├── Bucket policies                                                 │
│  └── File type validation                                            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Monitoring & Logging

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Logging Architecture                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Application Logs (stdout):                                         │
│  - API requests/responses                                            │
│  - Error stack traces                                                │
│  - Authentication events                                             │
│  - Performance metrics                                               │
│                                                                      │
│  Audit Logs (Database):                                             │
│  - Data changes (tb_*_history)                                      │
│  - User actions (created_by, updated_by)                            │
│  - Soft deletes (deleted_at, deleted_by)                            │
│                                                                      │
│  Output (NSSM Service):                                             │
│  - AppStdout → logs/ctmng-stdout.log                                │
│  - AppStderr → logs/ctmng-stderr.log                                │
│  - Log rotation: Daily                                               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Deployment Architecture

### Build Process

```bash
# 1. Build with webpack (standalone)
npm run build  # next build --webpack

# 2. Output structure
.next/
├── standalone/           # Self-contained server
│   ├── server.js        # Entry point
│   ├── node_modules/    # Minimal dependencies
│   └── .next/           # Build output
└── static/              # Static assets (copy manually)

# 3. Deploy to production
scripts/build-and-copy.ps1
# → Copies to deploy/standalone-full/
```

### Production Structure

```
deploy/standalone-full/
├── server.js             # Next.js server
├── start.js              # Custom startup script
├── .env                  # Environment config
├── .next/                # Build output
│   └── static/           # CSS, JS, images
├── public/               # Static files
└── node_modules/         # Dependencies (bundled)
```

---

## 📝 Configuration Management

### Environment Variables

```bash
# .env.local (Development)
NODE_ENV=development
DATABASE_URL="sqlserver://localhost:1433;database=CTMNG;user=sa;password=xxx"
JWT_SECRET="dev-secret-key"
MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"

# .env (Production)
NODE_ENV=production
DATABASE_URL="sqlserver://db-server:1433;database=CTMNG_PROD;user=app_user;password=xxx"
JWT_SECRET="<random-64-char-string>"
MINIO_ENDPOINT="storage-server"
MINIO_PORT="9000"
MINIO_ACCESS_KEY="<production-key>"
MINIO_SECRET_KEY="<production-secret>"
```

### next.config.ts

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    // basePath: '/ctmng',  // For production behind reverse proxy

    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },

    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                ],
            },
        ];
    },
};

export default nextConfig;
```
