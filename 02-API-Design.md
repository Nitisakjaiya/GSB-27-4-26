# 🔌 API Design - CTMNG

> การออกแบบ REST API สำหรับ Contract Management System

**Version:** 1.0  
**Last Updated:** 2026-04-24

---

## 📌 API Overview

### Base URL

| Environment | Base URL                       |
| ----------- | ------------------------------ |
| Development | `http://localhost:3000/api`    |
| Production  | `https://domain.com/ctmng/api` |

### Response Format

```typescript
// Success Response
{
  "success": true,
  "data": { ... } | [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "ct_number", "message": "Required" }
    ]
  }
}
```

### HTTP Status Codes

| Code | Description                      |
| ---- | -------------------------------- |
| 200  | OK - Success                     |
| 201  | Created - Resource created       |
| 400  | Bad Request - Invalid input      |
| 401  | Unauthorized - Not authenticated |
| 403  | Forbidden - Not authorized       |
| 404  | Not Found - Resource not found   |
| 500  | Internal Server Error            |

---

## 🔐 Authentication APIs

### POST `/api/auth/login`

Login และรับ JWT token

**Request:**

```json
{
    "username": "admin",
    "password": "password123"
}
```

**Response (200):**

```json
{
    "success": true,
    "data": {
        "user": {
            "userId": 1,
            "username": "admin",
            "displayName": "System Administrator",
            "role": "ADMIN"
        },
        "token": "eyJhbGciOiJIUzI1NiIs..."
    }
}
```

**Response (401):**

```json
{
    "success": false,
    "error": {
        "code": "INVALID_CREDENTIALS",
        "message": "Username or password is incorrect"
    }
}
```

---

### POST `/api/auth/logout`

Logout และ invalidate token

**Response (200):**

```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

---

### GET `/api/auth/me`

ดึงข้อมูล user ปัจจุบัน

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
    "success": true,
    "data": {
        "userId": 1,
        "username": "admin",
        "displayName": "System Administrator",
        "email": "admin@company.com",
        "role": "ADMIN",
        "department": null,
        "position": null
    }
}
```

---

## 📄 Contract APIs

### GET `/api/contracts`

ดึงรายการสัญญา (with pagination)

**Query Parameters:** | Parameter | Type | Default | Description | |-----------|------|---------|-------------| | `page` | number | 1 | Page number | | `limit` | number | 20 | Items per page (max 100) | | `search` | string | - | Search by ct_number or ct_name | | `category` | string | - | Filter by category_code | | `status` | string | - | Filter by contract_status | | `year` | number | - | Filter by fiscal year | | `sortBy` | string | created_at | Sort field | | `sortOrder` | string | desc | Sort order (asc/desc) |

**Response (200):**

```json
{
    "success": true,
    "data": [
        {
            "ct_aid": 1,
            "ct_number": "CTR-2569-001",
            "ct_name": "สัญญาบำรุงรักษาระบบ Core Banking",
            "category_code": "IT",
            "contract_status": "ACTIVE",
            "vendor": "บริษัท ABC จำกัด",
            "purchase_cost": 1500000.0,
            "start_date": "2026-01-01",
            "end_date": "2026-12-31",
            "section_owner": "ฝ่ายเทคโนโลยีสารสนเทศ"
        }
    ],
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 150,
        "totalPages": 8
    }
}
```

---

### GET `/api/contracts/:id`

ดึงข้อมูลสัญญาตาม ID (with relations)

**Response (200):**

```json
{
    "success": true,
    "data": {
        "ct_aid": 1,
        "ct_number": "CTR-2569-001",
        "ct_name": "สัญญาบำรุงรักษาระบบ Core Banking",
        "category_code": "IT",
        "contract_type_code": "E-BIDDING",
        "coordinator_name": "นายสมชาย ใจดี",
        "sign_date": "2025-12-15",
        "start_date": "2026-01-01",
        "end_date": "2026-12-31",
        "warranty_end_date": "2027-12-31",
        "brief_desc": "รายละเอียดสัญญา...",
        "vendor": "บริษัท ABC จำกัด",
        "vendor_tax_id": "0123456789012",
        "purchase_cost": 1500000.0,
        "app_name": "Core Banking System",
        "section_owner": "ฝ่ายเทคโนโลยีสารสนเทศ",
        "budget_owner": "ฝ่ายการเงิน",
        "cost_center": "CC001",
        "contract_status": "ACTIVE",
        "remark": null,
        "items": [
            {
                "item_aid": 1,
                "item_seq": 1,
                "item_agreement": "งวดที่ 1",
                "start_date": "2026-01-01",
                "end_date": "2026-06-30",
                "item_cost": 750000.0
            }
        ],
        "created_at": "2025-12-01T10:00:00Z",
        "created_by": 1
    }
}
```

---

### POST `/api/contracts`

สร้างสัญญาใหม่

**Request:**

```json
{
    "ct_number": "CTR-2569-002",
    "ct_name": "สัญญาจ้างพัฒนาระบบ",
    "category_code": "IT",
    "contract_type_code": "E-BIDDING",
    "coordinator_name": "นายสมชาย ใจดี",
    "sign_date": "2026-04-01",
    "start_date": "2026-04-15",
    "end_date": "2027-04-14",
    "vendor": "บริษัท XYZ จำกัด",
    "purchase_cost": 2000000.0,
    "section_owner": "ฝ่ายเทคโนโลยีสารสนเทศ",
    "contract_status": "ACTIVE",
    "items": [
        {
            "item_agreement": "งวดที่ 1",
            "start_date": "2026-04-15",
            "end_date": "2026-10-14",
            "item_cost": 1000000.0
        }
    ]
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "ct_aid": 2,
    "ct_number": "CTR-2569-002",
    ...
  },
  "message": "Contract created successfully"
}
```

---

### PUT `/api/contracts/:id`

แก้ไขสัญญา

**Request:**

```json
{
    "ct_name": "สัญญาจ้างพัฒนาระบบ (แก้ไข)",
    "remark": "แก้ไขชื่อสัญญา"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "ct_aid": 2,
    ...
  },
  "message": "Contract updated successfully"
}
```

---

### DELETE `/api/contracts/:id`

ลบสัญญา (Soft Delete)

**Response (200):**

```json
{
    "success": true,
    "message": "Contract deleted successfully"
}
```

---

### Contract Items

#### GET `/api/contracts/:id/items`

ดึงรายการย่อยของสัญญา

#### POST `/api/contracts/:id/items`

เพิ่มรายการย่อย

#### PUT `/api/contracts/:contractId/items/:itemId`

แก้ไขรายการย่อย

#### DELETE `/api/contracts/:contractId/items/:itemId`

ลบรายการย่อย

---

## 📋 Planning APIs

### GET `/api/planning`

ดึงรายการแผนงาน

**Query Parameters:** | Parameter | Type | Default | Description | |-----------|------|---------|-------------| | `page` | number | 1 | Page number | | `limit` | number | 20 | Items per page | | `search` | string | - | Search by plan_name | | `status` | string | - | Filter by planning_status | | `year` | number | - | Filter by target_year | | `quarter` | number | - | Filter by target_quarter |

---

### POST `/api/planning/from-contract/:contractId`

สร้างแผนงานจากสัญญาเดิม (Copy)

**Request:**

```json
{
    "target_year": 2570,
    "target_quarter": 1,
    "planning_status": "PENDING",
    "priority": "HIGH",
    "copy_options": {
        "items": true,
        "committees": true,
        "files": false
    }
}
```

**Response (201):**

```json
{
    "success": true,
    "data": {
        "plan_aid": 10,
        "plan_name": "สัญญาบำรุงรักษาระบบ Core Banking",
        "target_year": 2570,
        "target_quarter": 1,
        "planning_status": "PENDING",
        "source_contract": {
            "ct_aid": 1,
            "ct_number": "CTR-2569-001"
        }
    },
    "message": "Planning created from contract successfully"
}
```

**Process:**

1. Copy ข้อมูลจาก tb_contract → tb_planning
2. Copy ข้อมูลจาก tb_contract_items → tb_planning_items
3. Copy committees ถ้าเลือก (เปลี่ยน base_type เป็น 'PLAN')
4. สร้าง reference (PLAN → CON, ref_type = 'SOURCE')

---

### GET `/api/planning/:id`

ดึงข้อมูลแผนงาน (with lineage)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "plan_aid": 10,
    "plan_name": "สัญญาบำรุงรักษาระบบ Core Banking",
    "target_year": 2570,
    "target_quarter": 1,
    "planning_status": "DRAFTING",
    "priority": "HIGH",
    "estimated_cost": 1600000.00,
    "items": [...],
    "lineage": {
      "source": {
        "type": "CON",
        "id": 1,
        "number": "CTR-2569-001",
        "name": "สัญญาบำรุงรักษาระบบ Core Banking"
      }
    }
  }
}
```

---

### POST `/api/planning/:id/close`

ปิดแผนงาน (FINISH) และสร้าง Contract ใหม่

**Request:**

```json
{
    "ct_number": "CTR-2570-001",
    "sign_date": "2570-01-15",
    "start_date": "2570-02-01",
    "end_date": "2570-12-31",
    "copy_options": {
        "items": true,
        "committees": true,
        "files": true
    }
}
```

**Response (201):**

```json
{
    "success": true,
    "data": {
        "plan": {
            "plan_aid": 10,
            "planning_status": "FINISH"
        },
        "contract": {
            "ct_aid": 50,
            "ct_number": "CTR-2570-001",
            "ct_name": "สัญญาบำรุงรักษาระบบ Core Banking"
        }
    },
    "message": "Plan closed and contract created successfully"
}
```

**Process:**

1. เปลี่ยนสถานะ Plan → FINISH
2. สร้าง Contract ใหม่จาก Plan
3. กำหนดเลขที่สัญญาให้ Contract
4. Copy Planning Items → Contract Items
5. Copy Committees, Files (ถ้าเลือก)
6. สร้าง Reference (Contract SOURCE from Plan)

---

## 👥 Polymorphic APIs

### Committees

#### GET `/api/committees`

**Query Parameters:** | Parameter | Type | Required | Description | |-----------|------|----------|-------------| | `base_type` | string | Yes | 'CON' or 'PLAN' | | `base_id` | number | Yes | Contract ID or Planning ID | | `committee_type` | string | No | Filter by type (TOR, BUY, INSP) |

**Response:**

```json
{
    "success": true,
    "data": [
        {
            "cmit_aid": 1,
            "base_id": 1,
            "base_type": "CON",
            "committee_type": "TOR",
            "position_index": 1,
            "member_name": "นายสมศักดิ์ มั่นคง",
            "position_title": "ประธาน",
            "department": "ฝ่ายจัดซื้อ",
            "status": 1,
            "effective_date": "2026-01-01"
        }
    ]
}
```

#### POST `/api/committees`

```json
{
    "base_id": 1,
    "base_type": "CON",
    "committee_type": "TOR",
    "position_index": 1,
    "member_name": "นายสมศักดิ์ มั่นคง",
    "position_title": "ประธาน",
    "department": "ฝ่ายจัดซื้อ",
    "effective_date": "2026-01-01"
}
```

---

### Tracking

#### GET `/api/tracking`

**Query Parameters:** | Parameter | Type | Required | Description | |-----------|------|----------|-------------| | `base_type` | string | Yes | 'CON' or 'PLAN' | | `base_id` | number | Yes | Contract ID or Planning ID | | `tracking_type` | string | No | ISSUE, PROGRESS, MILESTONE | | `status` | string | No | OPEN, IN_PROGRESS, DONE, CANCEL |

#### POST `/api/tracking`

```json
{
    "base_id": 1,
    "base_type": "CON",
    "tracking_type": "ISSUE",
    "trk_name": "ปัญหาการส่งมอบงาน",
    "trk_status": "OPEN",
    "priority": "HIGH",
    "assigned_to": "นายสมชาย ใจดี",
    "target_date": "2026-05-01",
    "remark": "รายละเอียดปัญหา..."
}
```

---

### Files

#### GET `/api/files`

**Query Parameters:** | Parameter | Type | Required | Description | |-----------|------|----------|-------------| | `base_type` | string | Yes | 'CON' or 'PLAN' | | `base_id` | number | Yes | Contract ID or Planning ID | | `file_type` | string | No | CONTRACT, TOR, QUOTATION, etc. |

#### POST `/api/files`

Upload file (multipart/form-data)

**Form Data:** | Field | Type | Required | Description | |-------|------|----------|-------------| | `file` | File | Yes | File to upload | | `base_id` | number | Yes | Contract/Planning ID | | `base_type` | string | Yes | 'CON' or 'PLAN' | | `file_type` | string | Yes | File type code | | `file_comment` | string | No | Description |

**Response:**

```json
{
    "success": true,
    "data": {
        "file_aid": 1,
        "file_name": "สัญญาลงนาม.pdf",
        "file_bucket": "ctmng-files",
        "file_link": "contracts/2026/ct_001_contract.pdf",
        "file_size": 1024000,
        "file_mime": "application/pdf"
    }
}
```

#### GET `/api/files/:id`

Download file

**Response:** File stream with appropriate Content-Type

#### DELETE `/api/files/:id`

Delete file (Soft Delete in DB, remove from MinIO)

---

## 💰 Budget APIs

### GET `/api/budget`

**Query Parameters:** | Parameter | Type | Required | Description | |-----------|------|----------|-------------| | `base_type` | string | Yes | 'CON', 'PLAN', 'CON_ITEM', 'PLAN_ITEM' | | `base_id` | number | Yes | ID | | `year` | number | No | Filter by fiscal year |

### POST `/api/budget`

```json
{
    "base_id": 1,
    "base_type": "CON",
    "budget_year": 2569,
    "budget_quarter": null,
    "budget_money": 1500000.0,
    "actual_money": 0,
    "budget_note": "งบประมาณประจำปี"
}
```

---

## 👤 Admin APIs

### Users

#### GET `/api/admin/users`

#### POST `/api/admin/users`

#### PUT `/api/admin/users/:id`

#### DELETE `/api/admin/users/:id`

### Master Data

#### GET `/api/admin/master-data/categories`

#### POST `/api/admin/master-data/categories`

#### PUT `/api/admin/master-data/categories/:code`

#### DELETE `/api/admin/master-data/categories/:code`

(Similar pattern for contract-types, committee-types, planning-status, tracking-types)

---

## 📊 Dashboard APIs

### GET `/api/dashboard/summary`

**Response:**

```json
{
    "success": true,
    "data": {
        "contracts": {
            "total": 150,
            "active": 120,
            "expiring_soon": 15,
            "expired": 15
        },
        "planning": {
            "total": 50,
            "pending": 10,
            "drafting": 25,
            "approved": 15
        },
        "budget": {
            "total_budget": 50000000.0,
            "total_actual": 35000000.0,
            "utilization_rate": 70.0
        }
    }
}
```

### GET `/api/dashboard/expiring-contracts`

สัญญาที่จะหมดอายุใน 90 วัน

### GET `/api/dashboard/charts/by-category`

ข้อมูลสำหรับ Chart แบ่งตามหมวดหมู่

---

## � Message APIs

### GET `/api/messages`

ดึงรายการข้อความ (Inbox style)

**Query Parameters:** | Parameter | Type | Default | Description | |-----------|------|---------|-------------| | `folder` | string | INBOX | INBOX, SENT, STARRED, TRASH | | `status` | string | - | UNREAD, READ, ARCHIVED | | `msg_type` | string | - | Filter by message type | | `page` | number | 1 | Page number | | `limit` | number | 20 | Items per page |

**Response (200):**

```json
{
    "success": true,
    "data": [
        {
            "rcpt_aid": 1,
            "msg_id": 100,
            "subject": "สัญญาใกล้หมดอายุ 30 วัน",
            "msg_type": "CONTRACT_EXPIRY",
            "priority": "HIGH",
            "sender_type": "SYSTEM",
            "sender_name": "System Auto",
            "folder": "INBOX",
            "status": "UNREAD",
            "is_starred": false,
            "sent_at": "2026-04-24T08:00:00Z",
            "read_at": null,
            "preview": "สัญญาต่อไปนี้จะหมดอายุภายใน 30 วัน..."
        }
    ],
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 25,
        "totalPages": 2,
        "unreadCount": 5
    }
}
```

---

### GET `/api/messages/unread-count`

ดึงจำนวนข้อความที่ยังไม่อ่าน (สำหรับ Badge)

**Response (200):**

```json
{
    "success": true,
    "data": {
        "unreadCount": 5
    }
}
```

---

### GET `/api/messages/:id`

ดึงข้อมูลข้อความเต็ม

**Response (200):**

```json
{
    "success": true,
    "data": {
        "msg_aid": 100,
        "subject": "สัญญาใกล้หมดอายุ 30 วัน",
        "body": "<p>สัญญาต่อไปนี้จะหมดอายุภายใน 30 วัน:</p><ul>...</ul>",
        "msg_type": "CONTRACT_EXPIRY",
        "priority": "HIGH",
        "sender_type": "SYSTEM",
        "sender_name": "System Auto",
        "sent_at": "2026-04-24T08:00:00Z",
        "base_type": "CON",
        "base_id": 1,
        "related_contract": {
            "ct_aid": 1,
            "ct_number": "CTR-2569-001",
            "ct_name": "สัญญาบำรุงรักษาระบบ"
        },
        "recipient_status": {
            "folder": "INBOX",
            "status": "READ",
            "is_starred": false,
            "read_at": "2026-04-24T09:30:00Z"
        }
    }
}
```

---

### POST `/api/messages`

ส่งข้อความใหม่ (User to User)

**Request:**

```json
{
    "subject": "สอบถามเรื่องสัญญา",
    "body": "ต้องการสอบถามเรื่อง...",
    "priority": "NORMAL",
    "recipient_user_ids": [2, 3],
    "base_type": "CON",
    "base_id": 1
}
```

**Response (201):**

```json
{
    "success": true,
    "data": {
        "msg_aid": 101,
        "subject": "สอบถามเรื่องสัญญา",
        "recipients_count": 2
    },
    "message": "Message sent successfully"
}
```

---

### PUT `/api/messages/:id/read`

ทำเครื่องหมายว่าอ่านแล้ว

**Response (200):**

```json
{
    "success": true,
    "message": "Marked as read"
}
```

---

### PUT `/api/messages/:id/star`

ติด/เอาออก ดาวสำคัญ

**Request:**

```json
{
    "is_starred": true
}
```

---

### PUT `/api/messages/:id/folder`

ย้าย folder (เช่น ย้ายไปถังขยะ)

**Request:**

```json
{
    "folder": "TRASH"
}
```

---

### DELETE `/api/messages/:id`

ลบข้อความ (ย้ายไป TRASH หรือลบถาวรถ้าอยู่ใน TRASH)

---

### Admin: Message Rules

#### GET `/api/admin/message-rules`

ดึงรายการกฎการสร้างข้อความอัตโนมัติ

#### POST `/api/admin/message-rules`

สร้างกฎใหม่

**Request:**

```json
{
    "rule_code": "EXPIRY_30",
    "rule_name": "สัญญาหมดอายุ 30 วัน",
    "target_entity": "CONTRACT",
    "condition_type": "DAYS_BEFORE_EXPIRY",
    "condition_value": 30,
    "msg_type": "CONTRACT_EXPIRY",
    "msg_priority": "HIGH",
    "msg_template": "สัญญาต่อไปนี้จะหมดอายุภายใน 30 วัน:\n{{contract_list}}",
    "recipient_type": "OWNER",
    "schedule_time": "08:00",
    "is_active": true
}
```

#### PUT `/api/admin/message-rules/:id`

แก้ไขกฎ

#### DELETE `/api/admin/message-rules/:id`

ลบกฎ

#### POST `/api/admin/message-rules/:id/run`

รันกฎทันที (Manual trigger)

**Response (200):**

```json
{
    "success": true,
    "data": {
        "messages_created": 5,
        "recipients_notified": 5
    },
    "message": "Rule executed successfully"
}
```

---

## �🔄 Validation Schemas (Zod)

```typescript
// src/lib/validators.ts

import { z } from 'zod';

export const CreateContractSchema = z.object({
    ct_number: z.string().min(1).max(100),
    ct_name: z.string().min(1).max(255),
    category_code: z.string().max(20).optional(),
    contract_type_code: z.string().max(20).optional(),
    coordinator_name: z.string().max(150).optional(),
    sign_date: z.string().date().optional(),
    start_date: z.string().date().optional(),
    end_date: z.string().date().optional(),
    vendor: z.string().max(255).optional(),
    purchase_cost: z.number().positive().optional(),
    contract_status: z.string().max(20).optional(),
    items: z.array(CreateContractItemSchema).optional(),
});

export const CreateContractItemSchema = z.object({
    item_agreement: z.string().max(255),
    start_date: z.string().date().optional(),
    end_date: z.string().date().optional(),
    item_month_count: z.number().int().positive().optional(),
    item_cost: z.number().positive().optional(),
});

export const CreatePlanningFromContractSchema = z.object({
    target_year: z.number().int().min(2500).max(2600),
    target_quarter: z.number().int().min(1).max(4),
    planning_status: z.string().max(20).default('PENDING'),
    priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'CRITICAL']).default('NORMAL'),
    copy_options: z
        .object({
            items: z.boolean().default(true),
            committees: z.boolean().default(true),
            files: z.boolean().default(false),
        })
        .optional(),
});

export const PolymorphicQuerySchema = z.object({
    base_type: z.enum(['CON', 'PLAN', 'CON_ITEM', 'PLAN_ITEM']),
    base_id: z.coerce.number().int().positive(),
});
```

---

## 🔐 API Authentication Middleware

```typescript
// src/lib/auth.ts

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
    userId: number;
    username: string;
    role: string;
    exp: number;
}

export async function getSession(request: NextRequest): Promise<JwtPayload | null> {
    const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) return null;

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        return payload;
    } catch {
        return null;
    }
}

export function withAuth(handler: Function, requiredRole?: string) {
    return async (request: NextRequest, context: any) => {
        const session = await getSession(request);

        if (!session) {
            return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
        }

        if (requiredRole && session.role !== requiredRole && session.role !== 'ADMIN') {
            return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized' } }, { status: 403 });
        }

        return handler(request, context, session);
    };
}
```

---

## 📝 API Route Template

```typescript
// src/app/api/contracts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { CreateContractSchema } from '@/lib/validators';

// GET /api/contracts
export async function GET(request: NextRequest) {
    const session = await getSession(request);
    if (!session) {
        return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const search = searchParams.get('search') || '';

    const where = {
        is_deleted: false,
        ...(search && {
            OR: [{ ct_number: { contains: search } }, { ct_name: { contains: search } }],
        }),
    };

    const [contracts, total] = await Promise.all([
        prisma.contract.findMany({
            skip: (page - 1) * limit,
            take: limit,
            where,
            orderBy: { created_at: 'desc' },
            select: {
                ct_aid: true,
                ct_number: true,
                ct_name: true,
                contract_status: true,
                vendor: true,
                purchase_cost: true,
                start_date: true,
                end_date: true,
            },
        }),
        prisma.contract.count({ where }),
    ]);

    return NextResponse.json({
        success: true,
        data: contracts,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}

// POST /api/contracts
export async function POST(request: NextRequest) {
    const session = await getSession(request);
    if (!session) {
        return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
    }

    const body = await request.json();
    const result = CreateContractSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', details: result.error.issues } }, { status: 400 });
    }

    const { items, ...contractData } = result.data;

    const contract = await prisma.$transaction(async (tx) => {
        // Create contract
        const newContract = await tx.contract.create({
            data: {
                ...contractData,
                created_by: BigInt(session.userId),
                updated_by: BigInt(session.userId),
            },
        });

        // Create items if provided
        if (items && items.length > 0) {
            await tx.contractItem.createMany({
                data: items.map((item, index) => ({
                    contract_id: newContract.ct_aid,
                    item_seq: index + 1,
                    ...item,
                    created_by: BigInt(session.userId),
                    updated_by: BigInt(session.userId),
                })),
            });
        }

        return newContract;
    });

    return NextResponse.json({ success: true, data: contract, message: 'Contract created successfully' }, { status: 201 });
}
```
