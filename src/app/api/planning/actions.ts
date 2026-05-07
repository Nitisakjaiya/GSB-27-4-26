"use server";

import { prisma } from "../../../lib/prisma"; // ปรับ path ให้ตรงกับที่ประธานตั้งไว้

export async function convertPlanToContract(planningId: string) {
  try {
    // 1. ดึงข้อมูลแผนงานต้นทาง (ดึงรายการ Items มาด้วยถ้ามี)
    const plan = await prisma.tb_planning.findUnique({
      where: { pl_aid: BigInt(planningId) }, // เปลี่ยนชื่อฟิลด์ PK ให้ตรงกับ Database ประธาน
      // include: { items: true } // ถ้าประธานโยง relation ของไอเท็มไว้ เปิดคอมเมนต์นี้ได้เลย
    });

    if (!plan) throw new Error("ไม่พบข้อมูลแผนงาน");

    // 2. สร้างสัญญาใหม่ใน tb_contract
    const newContract = await prisma.tb_contract.create({
      data: {
        ct_name: `[จากแผนงาน] ${plan.pl_name}`, // คัดลอกชื่อแผนมาเป็นชื่อสัญญา (แก้ชื่อฟิลด์ตามจริง)
        // ct_date: new Date(),
        // status: "DRAFT", // ตั้งให้สัญญาใหม่เริ่มที่ DRAFT
      }
    });

    // --- (Optional) ถ้ามีการก๊อปปี้ Items ย่อย ให้เขียนลูปตรงนี้ ---
    // if (plan.items && plan.items.length > 0) { ... createMany tb_contract_items ... }

    // 3. อัปเดตสถานะของแผนงานว่า "ถูกนำไปทำสัญญาแล้ว" (ล็อกไว้ไม่ให้กดซ้ำ)
    await prisma.tb_planning.update({
      where: { pl_aid: BigInt(planningId) },
      data: { status: "ACTIVE" } // เปลี่ยนเป็น ACTIVE เพราะแผนนี้กำลังถูกนำไปรันจริงแล้ว
    });

    // 4. ส่งรหัสสัญญาใหม่กลับไป
    return { success: true, newContractId: newContract.ct_aid.toString() };

  } catch (error) {
    console.error("Error converting plan to contract:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการสร้างสัญญา" };
  }
}
