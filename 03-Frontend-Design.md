# 🎨 Frontend Design - CTMNG

> การออกแบบ Frontend สำหรับ Contract Management System

**Version:** 1.0  
**Last Updated:** 2026-04-24

---

## 📌 Design Principles

### 1. Workspace Optimization

- เน้นพื้นที่แสดงผลข้อมูลให้มากที่สุด
- ลด visual clutter
- ใช้ Responsive design รองรับหลายขนาดหน้าจอ

### 2. Clean & Professional

- ใช้ Tailwind CSS 4.x
- สีเรียบง่าย อ่านง่าย
- Typography ชัดเจน

### 3. User-Centric

- Intuitive navigation
- Consistent patterns
- Helpful feedback (loading, error, success states)

### 4. Table Column Order (สำคัญมาก!)

**Action และ Status ต้องอยู่ด้านหน้าสุดเสมอ**

```
✅ ถูกต้อง: [Action] [Status] [ข้อมูลสำคัญ] [ข้อมูลอื่นๆ...]
❌ ผิด:   [ข้อมูล...] [Status] [Action]
```

> **เหตุผล:** ถ้า Action/Status อยู่ท้ายตาราง เมื่อมีข้อมูลยาว user ต้องเลื่อนดู ทำให้หงุดหงิด

### 5. Card-based Todo Style (สำหรับ Tracking, Items แบบ many)

รายการที่เชื่อมกับ Contract/Planning แบบ many ให้แสดงเป็น **Card + Todo Style** (คล้าย Microsoft Planner)

- **เพิ่มง่าย:** พิมพ์แล้ว Enter เพื่อเพิ่มรายการใหม่
- **ลบง่าย:** คลิก checkbox หรือ icon เพื่อลบ
- **Drag & Drop:** ลากเพื่อเปลี่ยนลำดับ (optional)

---

## 🖼️ Layout Structure

### Main Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ ┌─────┐                    NAVBAR                    [User Menu ▼] │
│ │LOGO │  Breadcrumb                                                 │
│ └─────┘                                                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                                                                     │
│                                                                     │
│                        MAIN CONTENT AREA                            │
│                      (Full Width Workspace)                         │
│                                                                     │
│                                                                     │
│                                                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

```tsx
// src/app/(protected)/layout.tsx
export default function ProtectedLayout({ children }) {
    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <main className='container mx-auto px-4 py-6'>{children}</main>
        </div>
    );
}
```

---

## 🧭 Navigation Design

### Navbar

```
┌─────────────────────────────────────────────────────────────────────┐
│ [≡]  CTMNG                                                         │
│ Menu  Contract Management System         🔔 Notifications  [👤 ▼] │
└─────────────────────────────────────────────────────────────────────┘
      │                                              │
      │ Click → Main Menu Dropdown                   │ User Dropdown:
      │                                              │ - Profile
      │                                              │ - Settings
      │                                              │ - Logout
      ▼
┌─────────────────────┐
│ 📊 Dashboard        │
│ 📄 ข้อมูลสัญญา      │
│ 📋 ร่างสัญญา        │
│ � ข้อความ          │
│ �📈 ออกรายงาน        │
│ ⚙️ Admin            │
│ 📖 คู่มือ           │
└─────────────────────┘
```

### Notification Bell (Message Badge)

```
┌───────────────────────────────────────────────────────────────────────┐
│                                          🔔 (3)  📧 (5)  [👤 Admin ▼] │
│                                           │       │                   │
│                                           │       └── ข้อความใหม่ 5   │
│                                           └────────── แจ้งเตือน 3     │
└───────────────────────────────────────────────────────────────────────┘
```

### Main Menu (Windows Start Style)

```tsx
// src/components/shared/MainMenu.tsx
const menuItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        description: 'ภาพรวมระบบ',
    },
    {
        label: 'ข้อมูลสัญญา',
        href: '/contracts',
        icon: FileText,
        description: 'จัดการสัญญาและรายละเอียด',
    },
    {
        label: 'ร่างสัญญา',
        href: '/planning',
        icon: ClipboardList,
        description: 'วางแผนสัญญาล่วงหน้า',
    },
    {
        label: 'ข้อความ',
        href: '/messages',
        icon: Mail,
        description: 'ข้อความแจ้งเตือนและการติดต่อ',
        badge: 'unreadCount', // แสดงจำนวนข้อความที่ยังไม่อ่าน
    },
    {
        label: 'ออกรายงาน',
        href: '/reports',
        icon: BarChart3,
        description: 'รายงานและสถิติ',
    },
    {
        label: 'Admin',
        href: '/admin',
        icon: Settings,
        description: 'ตั้งค่าระบบ',
        roles: ['ADMIN'], // แสดงเฉพาะ Admin
    },
    {
        label: 'คู่มือ',
        href: '/manual',
        icon: BookOpen,
        description: 'คู่มือการใช้งาน',
    },
];
```

---

## 📄 Page Templates

### 1. List Page (Contract List)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Page Header                                                         │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 📄 ข้อมูลสัญญา                               [+ สร้างสัญญาใหม่] │ │
│ │ Contract Management                                              │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Search & Filters                                                    │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ [🔍 ค้นหา...        ] [หมวดหมู่ ▼] [สถานะ ▼] [ปี ▼] [🔄 Reset] │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Data Table                                                          │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ ☐ | เลขที่สัญญา | ชื่อสัญญา | ผู้รับจ้าง | มูลค่า | สถานะ | ⋮ │ │
│ │───────────────────────────────────────────────────────────────  │ │
│ │ ☐ | CTR-001    | สัญญา MA  | บริษัท A  | 1.5M  | 🟢 Active│ ⋮ │ │
│ │ ☐ | CTR-002    | สัญญา Dev | บริษัท B  | 2.0M  | 🟡 Pending│⋮ │ │
│ │ ☐ | CTR-003    | สัญญา ...  | บริษัท C | 3.0M  | 🔴 Expired│⋮ │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Pagination                                                          │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ แสดง 1-20 จาก 150 รายการ           [◀] 1 2 3 ... 8 [▶]  [20 ▼] │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### 2. Detail Page (Contract Detail)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Page Header                                                         │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ [← กลับ]  📄 CTR-2569-001: สัญญาบำรุงรักษาระบบ                  │ │
│ │           🟢 Active | หมดอายุ: 31 ธ.ค. 2569                     │ │
│ │                                    [📋 สร้าง Plan] [✏️] [🗑️]   │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Contract Info (ข้อมูลสัญญาหลัก)                                      │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ เลขที่สัญญา: CTR-2569-001       | ผู้รับจ้าง: บริษัท ABC       │ │
│ │ ชื่อสัญญา: สัญญาบำรุง...         | ผู้ประสานงาน: นายสมชาย      │ │
│ │ หมวดหมู่: IT                     | หน่วยงาน: ฝ่าย IT          │ │
│ │ มูลค่า: 1,500,000 บาท           | สถานะ: 🟢 Active            │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Contract Items (รายการย่อย) - CRUD                                   │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ # | รายการ       | เริ่มต้น   | สิ้นสุด    | มูลค่า  | Action   │ │
│ │───────────────────────────────────────────────────────────────  │ │
│ │ 1 | งวดที่ 1     | 1 ม.ค.     | 31 มี.ค.   | 375K    | [✏️][🗑️]│ │
│ │ 2 | งวดที่ 2     | 1 เม.ย.    | 30 มิ.ย.   | 375K    | [✏️][🗑️]│ │
│ │                                              [+ เพิ่มรายการ]    │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ References (สัญญา/แผนที่เชื่อมโยง) - Card List                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │ │
│ │  │ 📄 CTR-001     │  │ 📋 PLAN-005   │  │                │     │ │
│ │  │ สัญญา MA เดิม  │  │ แผนต่อสัญญา   │  │  + เพิ่มลิงก์  │     │ │
│ │  │ 🟢 Active      │  │ 📌 SOURCE     │  │                │     │ │
│ │  │ [คลิกเพื่อดู]  │  │ [คลิกเพื่อดู] │  │                │     │ │
│ │  └────────────────┘  └────────────────┘  └────────────────┘     │ │
│ │  ↑ คลิก Card → เปิด Right Sidebar แสดงรายละเอียด                 │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Tabs (ข้อมูลเพิ่มเติม)                                               │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ [คณะกรรมการ] [ไฟล์แนบ] [ติดตาม] [งบประมาณ]                     │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.1 Detail Page (Planning Detail)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Page Header                                                         │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ [← กลับ]  📋 PLAN-2570-001: แผนบำรุงรักษาระบบ                   │ │
│ │           🟡 DRAFTING | เป้าหมาย: ไตรมาส 1/2570                 │ │
│ │                                   [✅ Close Plan] [✏️] [🗑️]    │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Planning Info (ข้อมูลแผนหลัก)                                        │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ รหัสแผน: PLAN-2570-001           | ยังไม่มีเลขที่สัญญา         │ │
│ │ ชื่อแผน: แผนบำรุง...              | ผู้ประสานงาน: นายสมชาย      │ │
│ │ หมวดหมู่: IT                      | หน่วยงาน: ฝ่าย IT          │ │
│ │ งบประมาณ: 1,600,000 บาท          | สถานะ: 🟡 DRAFTING          │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│ (รูปแบบเหมือน Contract Detail: Items, References, Tabs)             │
└─────────────────────────────────────────────────────────────────────┘
```

> **ปุ่ม [Close Plan]:** เมื่อ Plan พร้อม → กดปุ่มนี้ → ระบบสร้าง Contract ใหม่

### 2.2 Right Sidebar (แสดงสัญญา/แผนที่เชื่อมโยง)

```
┌──────────────────────────────────────────────┬─────────────────────────────┐
│                                               │ RIGHT SIDEBAR               │
│         MAIN CONTENT                          │ ┌─────────────────────────┐ │
│         (Contract/Planning Detail)            │ │ [CTR-001] [PLAN-005] [×]│ │ ← Tabs
│                                               │ ├─────────────────────────┤ │
│                                               │ │ 📄 CTR-001              │ │
│                                               │ │ สัญญา MA ระบบ IT        │ │
│                                               │ │                          │ │
│                                               │ │ สถานะ: 🟢 Active        │ │
│                                               │ │ เริ่มต้น: 1 ม.ค. 2568   │ │
│                                               │ │ สิ้นสุด: 31 ธ.ค. 2568   │ │
│                                               │ │ มูลค่า: 1,200,000 บาท   │ │
│                                               │ │                          │ │
│                                               │ │ ผู้ประสานงาน:            │ │
│                                               │ │ นายสมศักดิ์ มั่นคง       │ │
│                                               │ │                          │ │
│                                               │ │ [เปิดในหน้าใหม่]        │ │
│                                               │ └─────────────────────────┘ │
│                                               │                             │
└──────────────────────────────────────────────┴─────────────────────────────┘

Features:
- คลิก Reference Card → เปิด Sidebar พร้อม Tab ใหม่
- Tab แสดงเลขที่สัญญา/แผน (CTR-xxx หรือ PLAN-xxx)
- สามารถเปิดหลาย Tabs พร้อมกัน
- ปุ่ม [×] ปิด Sidebar
- ปุ่ม [เปิดในหน้าใหม่] navigate ไป Detail Page เต็มจอ
- รองรับทั้ง Contract และ Planning
```

### 3. Form Page (Create/Edit)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Page Header                                                         │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ [← ยกเลิก]  📄 สร้างสัญญาใหม่                                   │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Form Content                                                        │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ ข้อมูลสัญญา                                                     │ │
│ │ ┌───────────────────────────┐ ┌───────────────────────────┐     │ │
│ │ │ เลขที่สัญญา *             │ │ ชื่อสัญญา *               │     │ │
│ │ │ [CTR-2569-___________]    │ │ [________________________] │     │ │
│ │ └───────────────────────────┘ └───────────────────────────┘     │ │
│ │                                                                  │ │
│ │ ┌───────────────────────────┐ ┌───────────────────────────┐     │ │
│ │ │ หมวดหมู่                  │ │ วิธีดำเนินการ             │     │ │
│ │ │ [เลือก...            ▼]  │ │ [เลือก...            ▼]  │     │ │
│ │ └───────────────────────────┘ └───────────────────────────┘     │ │
│ │                                                                  │ │
│ │ ระยะเวลาสัญญา                                                    │ │
│ │ ┌────────────┐ ┌────────────┐ ┌────────────┐                     │ │
│ │ │ วันลงนาม  │ │ วันเริ่มต้น │ │ วันสิ้นสุด │                     │ │
│ │ │ [📅 ____] │ │ [📅 ____]  │ │ [📅 ____]  │                     │ │
│ │ └────────────┘ └────────────┘ └────────────┘                     │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Actions                                                             │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │                                     [ยกเลิก] [💾 บันทึก]        │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### 4. Message Page (Inbox Style)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Page Header                                                         │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 📧 ข้อความ                                        [+ เขียนใหม่] │ │
│ │ Message Center                                                   │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Tabs & Filters                                                      │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ [📥 กล่องขาเข้า (5)] [📤 ส่งแล้ว] [⭐ สำคัญ] [🗑️ ถังขยะ]      │ │
│ │ [🔍 ค้นหา...        ] [ประเภท ▼] [สถานะ ▼] [🔄]                │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Message List                                                        │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ ☐ | ⭐ | 🔴 | หัวข้อ                    | ผู้ส่ง  | วันที่      │ │
│ │───────────────────────────────────────────────────────────────  │ │
│ │ ☐ | ⭐ | 🔴 | สัญญาใกล้หมดอายุ 30 วัน   | System | 24 เม.ย.    │ │
│ │ ☐ | ☆ | 🔵 | มีการมอบหมายงานใหม่       | Admin  | 23 เม.ย.    │ │
│ │ ☐ | ☆ | 🔵 | แจ้งเตือนงบประมาณใกล้หมด  | System | 22 เม.ย.    │ │
│ │ ☐ | ☆ | ⚪ | ยืนยันการแก้ไขสัญญา       | User01 | 20 เม.ย.    │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│ Message Preview                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 📄 สัญญาใกล้หมดอายุ 30 วัน                                      │ │
│ │ ─────────────────────────────────────────────────────────────── │ │
│ │ จาก: System Auto                           24 เม.ย. 2569 08:00 │ │
│ │ ประเภท: แจ้งเตือนอัตโนมัติ                                      │ │
│ │ ─────────────────────────────────────────────────────────────── │ │
│ │ สัญญาต่อไปนี้จะหมดอายุภายใน 30 วัน:                             │ │
│ │                                                                  │ │
│ │ 1. CTR-2569-001 - สัญญาบำรุงรักษาระบบ IT (หมดอายุ: 24 พ.ค. 69) │ │
│ │ 2. CTR-2569-005 - สัญญาบริการ Cloud (หมดอายุ: 31 พ.ค. 69)      │ │
│ │                                                                  │ │
│ │ [ดูรายละเอียด]  [ทำเครื่องหมายว่าอ่านแล้ว]  [🗑️ ลบ]           │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

#### Message Types (ประเภทข้อความ)

| Type Code      | Icon | Color | Description               |
| -------------- | ---- | ----- | ------------------------- |
| `SYSTEM_ALERT` | 🔔   | Red   | แจ้งเตือนอัตโนมัติจากระบบ |
| `ASSIGNMENT`   | 📋   | Blue  | การมอบหมายงาน             |
| `REMINDER`     | ⏰   | Amber | เตือนความจำ               |
| `INFO`         | ℹ️   | Gray  | ข้อมูลทั่วไป              |
| `USER_MSG`     | 💬   | Green | ข้อความจากผู้ใช้อื่น      |

#### Message Status (สถานะข้อความ)

| Status     | Icon | Description |
| ---------- | ---- | ----------- |
| `UNREAD`   | 🔴   | ยังไม่อ่าน  |
| `READ`     | 🔵   | อ่านแล้ว    |
| `ARCHIVED` | ⚪   | เก็บถาวร    |

---

## 🎨 Color Palette

### Primary Colors (Sky Blue Theme - โทนสีฟ้าท้องฟ้า)

| Name          | Hex       | Tailwind | Usage                         |
| ------------- | --------- | -------- | ----------------------------- |
| Primary       | `#0EA5E9` | sky-500  | Buttons, Links, Active states |
| Primary Dark  | `#0284C7` | sky-600  | Hover states                  |
| Primary Light | `#E0F2FE` | sky-100  | Backgrounds                   |
| Accent        | `#38BDF8` | sky-400  | เน้นสี                        |

### Status Colors

| Status  | Color | Hex       | Usage            |
| ------- | ----- | --------- | ---------------- |
| Active  | Green | `#10B981` | Active contracts |
| Pending | Gray  | `#6B7280` | Pending items    |
| Warning | Amber | `#F59E0B` | Expiring soon    |
| Error   | Red   | `#EF4444` | Expired, Errors  |
| Info    | Sky   | `#0EA5E9` | Information      |

### Neutral Colors

| Name           | Hex       | Usage                    |
| -------------- | --------- | ------------------------ |
| Background     | `#F0F9FF` | Page background (sky-50) |
| Surface        | `#FFFFFF` | Cards, Modals            |
| Border         | `#E0F2FE` | Borders, Dividers        |
| Text Primary   | `#0C4A6E` | Main text (sky-900)      |
| Text Secondary | `#0369A1` | Secondary text (sky-700) |

---

## 🧩 Component Library

### Base Components (`src/components/ui/`)

#### Button

```tsx
interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

// Usage
<Button variant='primary' leftIcon={<Plus />}>
    สร้างสัญญาใหม่
</Button>;
```

#### Input

```tsx
interface InputProps {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

// Usage
<Input label='เลขที่สัญญา' placeholder='CTR-2569-xxx' error={errors.ct_number?.message} required />;
```

#### Select

```tsx
interface SelectProps {
    label?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
    error?: string;
}

// Usage
<Select label='หมวดหมู่' options={categories} placeholder='เลือกหมวดหมู่...' />;
```

#### Table

```tsx
interface TableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    isLoading?: boolean;
    onRowClick?: (row: T) => void;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        onChange: (page: number) => void;
    };
}

// Usage
<Table columns={contractColumns} data={contracts} pagination={{ page, limit, total, onChange: setPage }} onRowClick={(row) => router.push(`/contracts/${row.ct_aid}`)} />;
```

#### Modal

```tsx
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    footer?: ReactNode;
}

// Usage
<Modal
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
    title='ยืนยันการลบ'
    footer={
        <>
            <Button variant='outline' onClick={onClose}>
                ยกเลิก
            </Button>
            <Button variant='danger' onClick={handleDelete}>
                ลบ
            </Button>
        </>
    }
>
    <p>คุณต้องการลบสัญญานี้หรือไม่?</p>
</Modal>;
```

#### DatePicker

```tsx
interface DatePickerProps {
    label?: string;
    value?: Date;
    onChange: (date: Date | undefined) => void;
    minDate?: Date;
    maxDate?: Date;
}

// Usage
<DatePicker label='วันที่ลงนาม' value={signDate} onChange={setSignDate} />;
```

#### StatusBadge

```tsx
interface StatusBadgeProps {
    status: string;
    statusConfig: Record<string, { label: string; color: string }>;
}

// Usage
<StatusBadge
    status='ACTIVE'
    statusConfig={{
        ACTIVE: { label: 'มีผลบังคับใช้', color: 'green' },
        EXPIRED: { label: 'หมดอายุ', color: 'amber' },
        TERMINATED: { label: 'ยกเลิก', color: 'red' },
    }}
/>;
```

---

## 📱 Responsive Design

### Breakpoints

| Breakpoint | Min Width | Device           |
| ---------- | --------- | ---------------- |
| `sm`       | 640px     | Mobile landscape |
| `md`       | 768px     | Tablet           |
| `lg`       | 1024px    | Laptop           |
| `xl`       | 1280px    | Desktop          |
| `2xl`      | 1536px    | Large desktop    |

### Responsive Patterns

```tsx
// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>

// Table responsive
<div className="overflow-x-auto">
  <table className="min-w-full">
    {/* Table content */}
  </table>
</div>

// Hide on mobile
<div className="hidden md:block">
  {/* Desktop only content */}
</div>
```

---

## 🔄 State Management

### SWR for Data Fetching

```tsx
// src/hooks/useContracts.ts
import useSWR from 'swr';
import { apiFetch } from '@/utils/apiFetch';

interface UseContractsOptions {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}

export function useContracts(options: UseContractsOptions = {}) {
    const { page = 1, limit = 20, search, status } = options;

    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(status && { status }),
    });

    const { data, error, isLoading, mutate } = useSWR(`/api/contracts?${params}`, (url) => apiFetch(url).then((res) => res.json()));

    return {
        contracts: data?.data ?? [],
        meta: data?.meta ?? { page: 1, limit: 20, total: 0, totalPages: 0 },
        isLoading,
        isError: !!error,
        mutate,
    };
}
```

### React Hook Form for Forms

```tsx
// src/components/forms/ContractForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateContractSchema } from '@/lib/validators';

interface ContractFormProps {
    defaultValues?: Partial<ContractFormData>;
    onSubmit: (data: ContractFormData) => Promise<void>;
}

export function ContractForm({ defaultValues, onSubmit }: ContractFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ContractFormData>({
        resolver: zodResolver(CreateContractSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Input label='เลขที่สัญญา' {...register('ct_number')} error={errors.ct_number?.message} required />
            {/* More fields */}
            <Button type='submit' isLoading={isSubmitting}>
                บันทึก
            </Button>
        </form>
    );
}
```

---

## 🔔 Feedback & Notifications

### Toast Notifications

```tsx
// Using react-hot-toast or custom implementation
import toast from 'react-hot-toast';

// Success
toast.success('บันทึกข้อมูลสำเร็จ');

// Error
toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่');

// Loading
const loadingToast = toast.loading('กำลังบันทึก...');
// Later:
toast.dismiss(loadingToast);
```

### Loading States

```tsx
// Skeleton loader
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>

// Spinner
<div className="flex items-center justify-center">
  <Loader2 className="h-6 w-6 animate-spin text-primary" />
  <span className="ml-2">กำลังโหลด...</span>
</div>
```

### Empty States

```tsx
<div className='text-center py-12'>
    <FileX className='h-12 w-12 mx-auto text-gray-400 mb-4' />
    <h3 className='text-lg font-medium text-gray-900 mb-2'>ไม่พบข้อมูล</h3>
    <p className='text-gray-500 mb-4'>ยังไม่มีสัญญาในระบบ เริ่มต้นด้วยการสร้างสัญญาใหม่</p>
    <Button href='/contracts/new' leftIcon={<Plus />}>
        สร้างสัญญาใหม่
    </Button>
</div>
```

---

## 📊 Dashboard Widgets

### Summary Cards

```tsx
<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
    <SummaryCard title='สัญญาทั้งหมด' value={150} icon={FileText} change='+5 จากเดือนก่อน' changeType='positive' />
    <SummaryCard title='สัญญามีผลบังคับใช้' value={120} icon={CheckCircle} color='green' />
    <SummaryCard title='ใกล้หมดอายุ' value={15} icon={AlertTriangle} color='amber' />
    <SummaryCard title='หมดอายุแล้ว' value={15} icon={XCircle} color='red' />
</div>
```

### Charts

```tsx
// Using Recharts
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width='100%' height={300}>
    <BarChart data={budgetData}>
        <XAxis dataKey='category' />
        <YAxis />
        <Tooltip />
        <Bar dataKey='budget' fill='#3B82F6' name='งบประมาณ' />
        <Bar dataKey='actual' fill='#10B981' name='ใช้จริง' />
    </BarChart>
</ResponsiveContainer>;
```

---

## 🛠️ Utility Functions

### API Fetch with basePath

```tsx
// src/utils/apiFetch.ts
export function getBasePath(): string {
    if (typeof window === 'undefined') return '';

    const pathname = window.location.pathname;
    const match = pathname.match(/^\/([^\/]+)/);

    const knownRoutes = ['login', 'dashboard', 'contracts', 'planning', 'messages', 'reports', 'admin'];
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

### Formatters

```tsx
// src/utils/formatters.ts
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export function formatDate(date: Date | string, pattern = 'd MMM yyyy'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, pattern, { locale: th });
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function formatNumber(num: number): string {
    return new Intl.NumberFormat('th-TH').format(num);
}
```

---

## 📁 File Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── DatePicker.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   ├── Pagination.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── FileUpload.tsx
│   │   ├── Tabs.tsx
│   │   ├── Toast.tsx
│   │   └── Badge.tsx
│   ├── forms/
│   │   ├── ContractForm.tsx
│   │   ├── PlanningForm.tsx
│   │   ├── CommitteeForm.tsx
│   │   ├── TrackingForm.tsx
│   │   ├── BudgetForm.tsx
│   │   └── MessageComposeForm.tsx
│   ├── tables/
│   │   ├── ContractTable.tsx
│   │   ├── PlanningTable.tsx
│   │   ├── ItemsTable.tsx
│   │   ├── CommitteeTable.tsx
│   │   ├── FileTable.tsx
│   │   └── MessageTable.tsx
│   ├── messages/
│   │   ├── MessageList.tsx
│   │   ├── MessagePreview.tsx
│   │   ├── MessageDetail.tsx
│   │   ├── MessageCompose.tsx
│   │   └── MessageBadge.tsx
│   └── shared/
│       ├── Navbar.tsx
│       ├── MainMenu.tsx
│       ├── PageHeader.tsx
│       ├── Breadcrumb.tsx
│       ├── EmptyState.tsx
│       └── LoadingSpinner.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useContracts.ts
│   ├── usePlanning.ts
│   ├── useCommittees.ts
│   ├── useFiles.ts
│   ├── useMessages.ts
│   ├── useUnreadCount.ts
│   └── useToast.ts
└── utils/
    ├── apiFetch.ts
    ├── formatters.ts
    └── helpers.ts
```
