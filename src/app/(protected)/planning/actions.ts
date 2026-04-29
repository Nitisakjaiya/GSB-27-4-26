"use server"

import { prisma } from "../../../lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Task 3.3 & 3.4: ระบบก๊อปปี้ข้อมูลสัญญาไปเป็นแผนงาน (Transaction)
 */
export async function copyContractToPlanning(contractId: string) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. ดึงข้อมูลสัญญาต้นทาง
      const source = await tx.tb_contract.findUnique({
        where: { ct_aid: BigInt(contractId) },
        include: { items: { where: { is_deleted: 0 } } }
      });

      if (!source) throw new Error("ไม่พบข้อมูลสัญญาต้นทาง");

      // 2. สร้างแผนงานใหม่ (Lineage Tracking: จดบันทึก ref_contract_id)
      const newPlan = await tx.tb_planning.create({
        data: {
          pl_name: `[ร่างแผนงาน] ${source.ct_name}`,
          ref_contract_id: BigInt(contractId), // Task 3.4
          pl_year: new Date().getFullYear() + 543,
          status: "DRAFT",
          // 3. ก๊อปปี้รายการงบประมาณ (Task 3.2)
          items: {
            create: source.items.map(item => ({
              pli_type: item.item_type,
              pli_description: item.item_agreement,
              pli_budget: item.item_cost
            }))
          }
        }
      });

      return newPlan;
    });

    revalidatePath("/dashboard");
    revalidatePath("/planning");
    
    // สำเร็จแล้วส่ง ID กลับไปเพื่อให้หน้า UI ทำการ Redirect
    return { success: true, id: result.pl_aid.toString() };
  } catch (error) {
    console.error("Copy Error:", error);
    return { success: false, message: "สร้างแผนงานไม่สำเร็จ" };
  }
}

// --- Task 3.6: ระบบแก้ไขแผนงาน (Update Planning) ---

export async function updatePlanning(formData: FormData) {
  const id = formData.get("id") as string;
  const pl_name = formData.get("pl_name") as string;
  const pl_year = parseInt(formData.get("pl_year") as string);
  const status = formData.get("status") as string;

  await prisma.tb_planning.update({
    where: { pl_aid: BigInt(id) },
    data: { pl_name, pl_year, status },
  });

  revalidatePath(`/planning/${id}`);
  redirect(`/planning/${id}`);
}

// --- ระบบจัดการรายการงบประมาณของแผนงาน (Planning Items) ---

export async function addPlanningItem(formData: FormData) {
  const planningId = formData.get("planningId") as string;
  const pli_type = formData.get("pli_type") as string;
  const pli_description = formData.get("pli_description") as string;
  const pli_budget = formData.get("pli_budget") as string;

  await prisma.tb_planning_items.create({
    data: {
      planning_id: BigInt(planningId),
      pli_type,
      pli_description,
      pli_budget: new Decimal(pli_budget || 0),
    },
  });

  revalidatePath(`/planning/${planningId}/edit`);
}

export async function updatePlanningItem(formData: FormData) {
  const item_aid = formData.get("item_aid") as string;
  const planningId = formData.get("planningId") as string;
  const pli_type = formData.get("pli_type") as string;
  const pli_description = formData.get("pli_description") as string;
  const pli_budget = formData.get("pli_budget") as string;

  await prisma.tb_planning_items.update({
    where: { pli_aid: BigInt(item_aid) },
    data: {
      pli_type,
      pli_description,
      pli_budget: new Decimal(pli_budget || 0),
    },
  });

  revalidatePath(`/planning/${planningId}`);
  revalidatePath(`/planning/${planningId}/edit`);
}

export async function deletePlanningItem(formData: FormData) {
  const item_aid = formData.get("item_aid") as string;
  const planningId = formData.get("planningId") as string;

  await prisma.tb_planning_items.update({
    where: { pli_aid: BigInt(item_aid) },
    data: { is_deleted: 1 },
  });

  revalidatePath(`/planning/${planningId}/edit`);
}

// --- Task 3.6: สร้างแผนงานใหม่แบบ Manual (Create Planning) ---

export async function createPlanning(formData: FormData) {
  const pl_name = formData.get("pl_name") as string;
  const pl_year = parseInt(formData.get("pl_year") as string);

  // สร้างแผนงานเปล่าๆ ขึ้นมา
  const newPlan = await prisma.tb_planning.create({
    data: {
      pl_name,
      pl_year,
      status: "DRAFT", // ค่าเริ่มต้นเป็น DRAFT เสมอ
    },
  });

  // ล้างแคชหน้ารวม
  revalidatePath("/planning");
  
  // เด้งไปหน้า Edit เพื่อให้ประธานเพิ่มรายการงบประมาณต่อได้เลย
  redirect(`/planning/${newPlan.pl_aid}/edit`);
}

// --- ฟังก์ชันสำหรับลบแผนงาน (Soft Delete) ---
export async function deletePlanning(id: string) {
  try {
    await prisma.tb_planning.update({
      where: { pl_aid: BigInt(id) },
      data: { is_deleted: 1 } // ลบแบบ Soft Delete (แค่ซ่อนไว้)
    });
    
    // อัปเดตหน้า List ให้ข้อมูลหายไปทันที
    revalidatePath("/planning");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Delete Planning Error:", error);
    throw new Error("ไม่สามารถลบแผนงานได้");
  }
}
