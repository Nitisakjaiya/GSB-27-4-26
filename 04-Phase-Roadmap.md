# 🗓️ Phase Roadmap - CTMNG

> แผนการพัฒนาระบบ Contract Management System แบ่งตาม Phase

**Version:** 1.0  
**Last Updated:** 2026-04-24

---

## 📌 Overview

| Phase       | ชื่อ               | ระยะเวลา    | เป้าหมาย                             |
| ----------- | ------------------ | ----------- | ------------------------------------ |
| **Phase 1** | Admin Mode         | 13 สัปดาห์  | App สำหรับ Admin ใช้งาน (MVP)        |
| **Phase 2** | Project Owner Mode | 6-8 สัปดาห์ | เจ้าของโครงการ Login และจัดการงานได้ |
| **Phase 3** | Enhancement        | TBD         | รายงานขั้นสูง, Notification, Mobile  |

---

## 🚀 Phase 1: Admin Mode (MVP)

> **เป้าหมาย:** สร้าง App ให้เสร็จสมบูรณ์สำหรับ Admin ใช้งาน

### Timeline: 13 สัปดาห์

```
สัปดาห์ที่  1-2   │████████│ Foundation
สัปดาห์ที่  3-5   │████████████│ Contract Module
สัปดาห์ที่  6-7   │████████│ Planning Module
สัปดาห์ที่  8     │████│ Tracking & Budget
สัปดาห์ที่  9     │████│ Message System
สัปดาห์ที่ 10-11  │████████│ Dashboard & Reports
สัปดาห์ที่ 12-13  │████████│ Admin, Polish, Testing
```

---

### Sprint 1-2: Foundation (สัปดาห์ที่ 1-2)

| #   | Task                                               | Priority | Days |
| --- | -------------------------------------------------- | -------- | ---- |
| 1.1 | Init Next.js Project (16.1.6) + Package Setup      | 🔴       | 1    |
| 1.2 | Setup Docker (MSSQL + MinIO)                       | 🔴       | 1    |
| 1.3 | สร้าง Prisma Schema จาก Database Design            | 🔴       | 2    |
| 1.4 | Seed Data สำหรับ Master Tables                     | 🟡       | 1    |
| 1.5 | Authentication System (JWT + tb_user)              | 🔴       | 2    |
| 1.6 | Base Layout + Navigation                           | 🔴       | 2    |
| 1.7 | Shared UI Components (Button, Input, Table, Modal) | 🟡       | 3    |

**Deliverables:**

- [ ] โปรเจค Next.js พร้อมใช้งาน
- [ ] Database ถูกสร้าง + Seed data
- [ ] Login/Logout ทำงานได้
- [ ] Layout หลักพร้อมเมนู
- [ ] UI Components พื้นฐาน

**Technical Setup:**

```bash
# Package versions
next: 16.1.6
react: 19.2.4
tailwindcss: 4.0+
prisma: 6.19+

# Docker services
- mssql:2022
- minio:latest
```

---

### Sprint 3-5: Contract Module (สัปดาห์ที่ 3-5)

| #   | Task                                    | Priority | Days |
| --- | --------------------------------------- | -------- | ---- |
| 2.1 | API: CRUD Contract                      | 🔴       | 3    |
| 2.2 | API: Contract Items (Master-Detail)     | 🔴       | 2    |
| 2.3 | UI: Contract List + Search + Pagination | 🔴       | 2    |
| 2.4 | UI: Contract Form (Create/Edit)         | 🔴       | 3    |
| 2.5 | UI: Contract Detail Page                | 🔴       | 2    |
| 2.6 | API: Committees (Polymorphic)           | 🟡       | 2    |
| 2.7 | UI: Committee Management Tab            | 🟡       | 2    |
| 2.8 | API: Files (MinIO Upload/Download)      | 🟡       | 2    |
| 2.9 | UI: File Attachment Tab                 | 🟡       | 2    |

**Deliverables:**

- [ ] จัดการสัญญาได้ (CRUD)
- [ ] เพิ่ม/แก้ไข/ลบ รายการย่อย
- [ ] จัดการคณะกรรมการ
- [ ] อัปโหลด/ดาวน์โหลดไฟล์

**API Endpoints:**

```
GET/POST   /api/contracts
GET/PUT/DELETE /api/contracts/:id
GET/POST   /api/contracts/:id/items
GET/POST   /api/committees?base_type=CON&base_id=:id
GET/POST   /api/files?base_type=CON&base_id=:id
```

---

### Sprint 6-7: Planning Module (สัปดาห์ที่ 6-7)

| #   | Task                                        | Priority | Days |
| --- | ------------------------------------------- | -------- | ---- |
| 3.1 | API: CRUD Planning                          | 🔴       | 2    |
| 3.2 | API: Planning Items                         | 🔴       | 1    |
| 3.3 | API: Copy Contract → Planning (Transaction) | 🔴       | 2    |
| 3.4 | API: Reference (Lineage Tracking)           | 🟡       | 1    |
| 3.5 | UI: Planning List + Filter                  | 🔴       | 2    |
| 3.6 | UI: Planning Form                           | 🔴       | 2    |
| 3.7 | UI: "สร้างแผนจากสัญญา" Wizard               | 🔴       | 2    |
| 3.8 | UI: Lineage View                            | 🟡       | 1    |

**Deliverables:**

- [ ] จัดการแผนงานได้ (CRUD)
- [ ] สร้างแผนจากสัญญาเดิม (Copy)
- [ ] ดู Lineage (ต้นทางของแผน)

**Key Feature: Copy Contract to Planning**

```typescript
// Transaction Pattern
await prisma.$transaction(async (tx) => {
  // 1. Copy contract → planning
  const plan = await tx.planning.create({...});

  // 2. Copy items
  await tx.planningItem.createMany({...});

  // 3. Copy committees (optional)

  // 4. Create reference
  await tx.reference.create({
    base_id: plan.plan_aid,
    base_type: 'PLAN',
    ref_contract_id: contractId,
    ref_contract_type: 'CON',
    ref_type: 'SOURCE'
  });
});
```

---

### Sprint 8: Tracking & Budget (สัปดาห์ที่ 8)

| #   | Task                                       | Priority | Days |
| --- | ------------------------------------------ | -------- | ---- |
| 4.1 | API: CRUD Tracking                         | 🟡       | 1    |
| 4.2 | UI: Tracking Tab (in Contract/Plan Detail) | 🟡       | 2    |
| 4.3 | API: CRUD Budget                           | 🟡       | 1    |
| 4.4 | UI: Budget Allocation by Year              | 🟡       | 2    |

**Deliverables:**

- [ ] บันทึกการติดตามความคืบหน้า/ปัญหา
- [ ] กระจายงบประมาณตามปี

---

### Sprint 9: Message System (สัปดาห์ที่ 9)

| #   | Task                                                        | Priority | Days |
| --- | ----------------------------------------------------------- | -------- | ---- |
| 5.1 | Database: tb_message, tb_message_recipient, tb_message_rule | 🟡       | 1    |
| 5.2 | API: CRUD Messages                                          | 🟡       | 2    |
| 5.3 | API: Message Rules (CRUD + Manual Run)                      | 🟡       | 1    |
| 5.4 | UI: Message Inbox (List, Preview, Detail)                   | 🟡       | 2    |
| 5.5 | UI: Compose Message                                         | 🟢       | 1    |
| 5.6 | UI: Notification Badge                                      | 🟡       | 1    |
| 5.7 | Schedule Process: Daily Job Runner                          | 🟡       | 2    |

**Deliverables:**

- [ ] ส่ง/รับข้อความในระบบ
- [ ] ระบบแจ้งเตือนอัตโนมัติ (สัญญาใกล้หมดอายุ)
- [ ] Notification Badge บน Navbar

**Schedule Process:**

```
┌────────────────────────────────────────────────────┐
│ Cron Job (รันทุกวัน 08:00)                         │
├────────────────────────────────────────────────────┤
│ 1. ดึง Active Rules จาก tb_message_rule           │
│ 2. ตรวจสอบเงื่อนไข (เช่น สัญญาหมดอายุใน 30 วัน)   │
│ 3. สร้างข้อความและผู้รับอัตโนมัติ                  │
│ 4. อัปเดต last_run_at                              │
└────────────────────────────────────────────────────┘
```

---

### Sprint 10-11: Dashboard & Reports (สัปดาห์ที่ 10-11)

| #   | Task                               | Priority | Days |
| --- | ---------------------------------- | -------- | ---- |
| 6.1 | Dashboard: Summary Cards           | 🟡       | 2    |
| 6.2 | Dashboard: Charts                  | 🟡       | 2    |
| 6.3 | Dashboard: สัญญาใกล้หมดอายุ        | 🟡       | 1    |
| 6.4 | Report: รายงานสัญญา + Export Excel | 🟡       | 2    |
| 6.5 | Report: รายงานแผนงาน               | 🟡       | 1    |
| 6.6 | Report: รายงานงบประมาณ             | 🟡       | 2    |

**Deliverables:**

- [ ] Dashboard แสดงภาพรวม
- [ ] Charts และ Statistics
- [ ] Export Excel

---

### Sprint 12-13: Admin & Polish (สัปดาห์ที่ 12-13)

| #   | Task                                         | Priority | Days |
| --- | -------------------------------------------- | -------- | ---- |
| 7.1 | Admin: User Management                       | 🟡       | 2    |
| 7.2 | Admin: Master Data (Category, Contract Type) | 🟡       | 2    |
| 7.3 | Admin: Status Management                     | 🟡       | 1    |
| 7.4 | Admin: Message Rules Management              | 🟡       | 2    |
| 7.5 | History/Audit Trail                          | 🟢       | 2    |
| 7.6 | Performance Optimization                     | 🟡       | 2    |
| 7.7 | Security Hardening                           | 🔴       | 2    |
| 7.8 | Testing & Bug Fixes                          | 🔴       | 3    |
| 7.9 | Documentation                                | 🟡       | 2    |

**Deliverables:**

- [ ] Admin จัดการ Users และ Master Data
- [ ] Admin จัดการ Message Rules
- [ ] ระบบ Audit Trail
- [ ] ระบบผ่านการทดสอบ
- [ ] เอกสารครบถ้วน

---

### Phase 1 Acceptance Criteria

| Criteria         | Target                         |
| ---------------- | ------------------------------ |
| สัญญาที่รองรับ   | 1,000+ records                 |
| Response Time    | < 500ms (95th percentile)      |
| Concurrent Users | 100+                           |
| Browser Support  | Chrome, Edge, Firefox (latest) |
| Test Coverage    | Manual testing passed          |

---

## 🔮 Phase 2: Project Owner Mode

> **เป้าหมาย:** เจ้าของโครงการ Login และจัดการงานได้

### Timeline: 6-8 สัปดาห์

### Prerequisites

- Phase 1 deployed and stable
- Active Directory accessible
- User acceptance from Phase 1

---

### Sprint 1-2: AD Integration

| #    | Task                      | Priority | Days |
| ---- | ------------------------- | -------- | ---- |
| P2.1 | AD Authentication (LDAP)  | 🔴       | 3    |
| P2.2 | User Sync from AD         | 🔴       | 2    |
| P2.3 | tb_department Management  | 🟡       | 2    |
| P2.4 | Position Level Mapping    | 🟡       | 2    |
| P2.5 | Role-based Access Control | 🔴       | 3    |

**Technical Details:**

```typescript
// AD Authentication Flow
async function loginWithAD(username: string, password: string) {
  // 1. Authenticate against AD
  const adUser = await ldapClient.bind(username, password);

  // 2. Get user attributes
  const { displayName, department, title } = adUser;

  // 3. Sync to tb_user
  const user = await prisma.user.upsert({
    where: { username },
    update: {
      display_name: displayName,
      department_code: mapDepartment(department),
      position_title: title,
      position_level: mapPositionLevel(title),
      last_login: new Date()
    },
    create: { ... }
  });

  // 4. Generate JWT
  return generateJWT(user);
}
```

---

### Sprint 3-4: Project Assignment

| #     | Task                         | Priority | Days |
| ----- | ---------------------------- | -------- | ---- |
| P2.6  | API: Project Assignment CRUD | 🔴       | 2    |
| P2.7  | UI: Assignment Management    | 🔴       | 3    |
| P2.8  | Permission-based Data Filter | 🔴       | 3    |
| P2.9  | "My Projects" View           | 🔴       | 2    |
| P2.10 | Notification on Assignment   | 🟡       | 2    |

**Permission Flow:**

```
┌─────────────────────────────────────────────────────────┐
│                 User Roles (Phase 2)                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ADMIN                                                   │
│  └── เห็นทุก Contract/Planning                          │
│      └── จัดการ Users, Master Data                      │
│                                                          │
│  SECTION_HEAD (หัวหน้าส่วน)                              │
│  └── เห็น Contract/Planning ของหน่วยงานตัวเอง           │
│      └── Assign งานให้ STAFF ในสังกัดได้                 │
│                                                          │
│  STAFF (เจ้าหน้าที่)                                     │
│  └── เห็นเฉพาะงานที่ถูก Assign                          │
│      └── สิทธิ์ตาม permission (VIEW/EDIT/FULL)          │
│                                                          │
│  VIEWER                                                  │
│  └── ดูได้อย่างเดียว (Read-only)                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

### Sprint 5-6: Enhancement & Polish

| #     | Task                      | Priority | Days |
| ----- | ------------------------- | -------- | ---- |
| P2.11 | Committee → User Linking  | 🟡       | 2    |
| P2.12 | Department Hierarchy View | 🟡       | 2    |
| P2.13 | Assignment History        | 🟢       | 1    |
| P2.14 | Performance Tuning        | 🟡       | 2    |
| P2.15 | Security Review           | 🔴       | 2    |
| P2.16 | UAT & Bug Fixes           | 🔴       | 3    |

---

### Phase 2 Database Changes

| Table                   | Change     | Description                                                               |
| ----------------------- | ---------- | ------------------------------------------------------------------------- |
| `tb_user`               | เพิ่มฟิลด์ | department_code, position_title, position_level, manager_user_id, ad_guid |
| `tb_department`         | ตารางใหม่  | ข้อมูลหน่วยงาน                                                            |
| `tb_contract`           | เพิ่มฟิลด์ | owner_user_id, owner_dept_code                                            |
| `tb_planning`           | เพิ่มฟิลด์ | owner_user_id, owner_dept_code                                            |
| `tb_project_assignment` | ตารางใหม่  | การมอบหมายงาน                                                             |
| `tb_committees`         | เพิ่มฟิลด์ | user_id (link to tb_user)                                                 |

---

### Phase 2 Acceptance Criteria

| Criteria         | Target                          |
| ---------------- | ------------------------------- |
| AD Integration   | 100% users can login            |
| Assignment       | หัวหน้าส่วน assign งานได้       |
| Permission       | STAFF เห็นเฉพาะงานที่ถูก assign |
| Concurrent Users | 1,000+                          |
| Response Time    | < 500ms                         |

---

## 📈 Phase 3: Enhancement (Future)

> **เป้าหมาย:** ฟีเจอร์เสริมและการปรับปรุง

### Potential Features

| Feature             | Description               | Priority |
| ------------------- | ------------------------- | -------- |
| Email Notification  | แจ้งเตือนสัญญาใกล้หมดอายุ | 🟡       |
| Advanced Reports    | รายงาน Drill-down         | 🟡       |
| Calendar View       | ปฏิทินแสดงกำหนดการ        | 🟢       |
| Mobile Responsive   | ปรับ UI สำหรับ Mobile     | 🟡       |
| Workflow Approval   | กระบวนการอนุมัติ          | 🟡       |
| Audit Dashboard     | Dashboard สำหรับตรวจสอบ   | 🟢       |
| API Integration     | เชื่อมต่อระบบภายนอก       | 🟢       |
| Performance Monitor | ตรวจสอบ Performance       | 🟢       |

---

## 📊 Resource Planning

### Phase 1 Team

| Role                 | Count | Responsibility           |
| -------------------- | ----- | ------------------------ |
| Full-stack Developer | 1-2   | พัฒนา Frontend + Backend |
| Designer             | 0.5   | UI/UX Design (Part-time) |
| Tester               | 1     | Manual Testing           |
| Project Manager      | 0.5   | Coordination             |

### Phase 2 Team

| Role                 | Count | Responsibility                 |
| -------------------- | ----- | ------------------------------ |
| Full-stack Developer | 1-2   | พัฒนาต่อเนื่อง                 |
| System Admin         | 0.5   | AD Integration                 |
| Tester               | 1     | Testing                        |
| Business Analyst     | 0.5   | Requirements for Project Owner |

---

## 📋 Risk Management

| Risk                  | Impact | Mitigation                   |
| --------------------- | ------ | ---------------------------- |
| AD ไม่พร้อม (Phase 2) | สูง    | เตรียม Fallback ใช้ Dev Auth |
| Scope Creep           | กลาง   | ยึด Phase 1 MVP ก่อน         |
| Performance Issues    | กลาง   | Load testing ตั้งแต่เริ่ม    |
| Data Migration        | กลาง   | เตรียม Import Tool           |
| User Adoption         | กลาง   | Training + Documentation     |

---

## ✅ Phase Completion Checklist

### Phase 1 Complete When:

- [ ] ทุก Sprint deliverables ผ่าน
- [ ] Performance test ผ่าน
- [ ] Security review ผ่าน
- [ ] User acceptance test ผ่าน
- [ ] Documentation ครบ
- [ ] Production deployment สำเร็จ

### Phase 2 Complete When:

- [ ] AD Integration ทำงานได้
- [ ] Project Assignment ใช้งานได้
- [ ] Permission control ถูกต้อง
- [ ] UAT ผ่าน
- [ ] Production rollout สำเร็จ

---

## 📝 Notes

1. **Priority:** Phase 1 ต้องเสร็จก่อนเริ่ม Phase 2
2. **Database:** ฟิลด์ Phase 2 ถูกเตรียมไว้แล้ว (nullable)
3. **Flexibility:** Timeline อาจปรับได้ตามสถานการณ์
4. **Documentation:** อัปเดตทุกครั้งที่มีการเปลี่ยนแปลง
