"use server";

import { prisma } from "../../../lib/prisma"; // 💡 ปรับ Path ให้ตรงกับโฟลเดอร์ที่เก็บ prisma ของประธานนะครับ
import { redirect } from "next/navigation";

export async function createCommittee(formData: FormData) {
  // รับค่าจาก Form
  const base_type = formData.get("base_type") as string;
  const base_id = Number(formData.get("base_id"));
  const cmit_name = formData.get("cmit_name") as string;
  const cmit_position = formData.get("cmit_position") as string;
  const cmit_unit = formData.get("cmit_unit") as string;

  // ตรวจสอบข้อมูลเบื้องต้น
  if (!base_type || !base_id || !cmit_name) {
    throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
  }

  // บันทึกลงตาราง tb_committees
  await prisma.tb_committees.create({
    data: {
      base_type: base_type,
      base_id: base_id,
      cmit_name: cmit_name,
      cmit_position: cmit_position,
      cmit_unit: cmit_unit,
      is_deleted: 0,
    },
  });

  // บันทึกเสร็จแล้วเด้งกลับไปหน้าตารางรวม
  redirect("/committees");
}
