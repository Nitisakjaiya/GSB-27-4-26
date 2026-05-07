"use server";

import { prisma } from "../../../../lib/prisma";

export async function convertPlanToContract(planningId: string) {
  try {
    const plan = await prisma.tb_planning.findUnique({
      where: { pl_aid: BigInt(planningId) },
      include: { items: { where: { is_deleted: 0 } } }
    });

    if (!plan) throw new Error("ไม่พบข้อมูลแผนงาน");

    // 🌟 จุดที่แก้ 1: ใส่วันที่ตั้งต้นให้กับสัญญาใหม่ (ป้องกันวันที่ว่างเปล่าแล้วฟอร์ม error)
    // ... โค้ดด้านบนเหมือนเดิม ...
    
    // สร้างตัวแปรเก็บวันที่ปัจจุบัน
    const today = new Date();

    // 2. สร้างสัญญาใหม่ใน tb_contract
    const newContract = await prisma.tb_contract.create({
      data: {
        ct_number: "รอระบุเลขที่สัญญา",
        ct_name: `[สร้างจากแผนงาน] ${plan.pl_name}`,
        
        // 🌟 ยัดวันที่ปัจจุบันลงไปให้ครบทั้ง 2 ฟิลด์เลยครับ
        ct_date: today,
        // sign_date: today, // <--- ถ้าระบบฟ้อง Error บรรทัดนี้ ให้ใส่คอมเมนต์ // ปิดไว้นะครับ (ขึ้นอยู่กับว่าใน Prisma Schema ประธานมีฟิลด์นี้ไหม)
        
      }
    });

    // ... โค้ดด้านล่างเหมือนเดิม ...

    if (plan.items && plan.items.length > 0) {
      const contractItems = plan.items.map(item => ({
        contract_id: newContract.ct_aid,
        item_type: item.pli_type,
        item_agreement: item.pli_description,
        item_cost: item.pli_budget,
        // 🌟 จุดที่แก้ 2: ถ้าใน item ของสัญญาต้องมีวันที่ ให้ดึงมาจากแผนงาน หรือใส่วันที่ปัจจุบันกันเหนียวไว้ครับ
        // (ประธานเช็กชื่อฟิลด์ start_date, end_date ใน schema.prisma อีกทีนะครับ ถ้าชื่อต่างจากนี้ให้แก้ตามได้เลย)
        start_date: (item as any).start_date || new Date(), 
        end_date: (item as any).end_date || new Date(),
      }));

      await prisma.tb_contract_items.createMany({
        data: contractItems
      });
    }

    await prisma.tb_planning.update({
      where: { pl_aid: BigInt(planningId) },
      data: { status: "ACTIVE" } 
    });

    return { success: true, newContractId: newContract.ct_aid.toString() };

  } catch (error) {
    console.error("Error converting plan to contract:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการสร้างสัญญา" };
  }
}
