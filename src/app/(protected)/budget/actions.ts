"use server"

import { prisma } from "../../../lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Task 4.3: เพิ่มรายการจัดสรรงบประมาณรายปี
 */
export async function addBudgetAllocation(formData: FormData) {
  try {
    const base_id = formData.get("base_id") as string;
    const base_type = formData.get("base_type") as string; // 'CON' หรือ 'PLA'
    const budget_year = formData.get("budget_year") as string;
    const allocated_amount = formData.get("allocated_amount") as string;
    const bg_remark = formData.get("bg_remark") as string;

    await prisma.tb_budget_allocation.create({
      data: {
        base_id: BigInt(base_id),
        base_type: base_type,
        budget_year: parseInt(budget_year),
        allocated_amount: parseFloat(allocated_amount),
        bg_remark: bg_remark,
      }
    });

    // รีเฟรชหน้าเพื่อให้ข้อมูลอัปเดตทันที
    if (base_type === 'CON') revalidatePath(`/contracts/${base_id}`);
    if (base_type === 'PLA') revalidatePath(`/planning/${base_id}`);

    return { success: true };
  } catch (error) {
    console.error("Budget Action Error:", error);
    return { success: false };
  }
}

/**
 * Task 4.3: ลบรายการจัดสรรงบประมาณ
 */
export async function deleteBudgetAllocation(formData: FormData) {
  const bg_aid = formData.get("bg_aid") as string;
  const base_id = formData.get("base_id") as string;
  const base_type = formData.get("base_type") as string;

  await prisma.tb_budget_allocation.update({
    where: { bg_aid: BigInt(bg_aid) },
    data: { is_deleted: 1 }
  });

  if (base_type === 'CON') revalidatePath(`/contracts/${base_id}`);
  if (base_type === 'PLA') revalidatePath(`/planning/${base_id}`);
}
