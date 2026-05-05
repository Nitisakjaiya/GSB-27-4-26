"use server"

import { prisma } from "../../../lib/prisma";
import { revalidatePath } from "next/cache";

// --- Task 4.1: ระบบบันทึกความคืบหน้า (Tracking Polymorphic) ---

export async function addTrackingRecord(formData: FormData) {
  try {
    const base_id = formData.get("base_id") as string;
    const base_type = formData.get("base_type") as string; // 'CON' สำหรับสัญญา หรือ 'PLA' สำหรับแผนงาน
    const trk_status = formData.get("trk_status") as string;
    const trk_detail = formData.get("trk_detail") as string;
    const disbursed_amount = formData.get("disbursed_amount") as string;

    await prisma.tb_tracking.create({
      data: {
        base_id: BigInt(base_id),
        base_type: base_type,
        trk_status: trk_status,
        trk_detail: trk_detail,
        trk_date: new Date(),
        disbursed_amount: disbursed_amount ? parseFloat(disbursed_amount) : null,
      }
    });

    // ล้างแคชหน้า Detail เพื่อให้ Timeline อัปเดตทันทีแบบ Real-time
    if (base_type === 'CON') revalidatePath(`/contracts/${base_id}`);
    if (base_type === 'PLA') revalidatePath(`/planning/${base_id}`);

    return { success: true };
  } catch (error) {
    console.error("Add Tracking Error:", error);
    return { success: false, message: "ไม่สามารถบันทึกสถานะได้" };
  }
}

export async function deleteTrackingRecord(formData: FormData) {
  const trk_aid = formData.get("trk_aid") as string;
  const base_id = formData.get("base_id") as string;
  const base_type = formData.get("base_type") as string;

  await prisma.tb_tracking.update({
    where: { trk_aid: BigInt(trk_aid) },
    data: { is_deleted: 1 }
  });

  if (base_type === 'CON') revalidatePath(`/contracts/${base_id}`);
  if (base_type === 'PLA') revalidatePath(`/planning/${base_id}`);
}
