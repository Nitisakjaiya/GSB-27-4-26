"use server";

import { prisma } from "../../../lib/prisma"; // 💡 ปรับ Path ให้ตรงกับโฟลเดอร์ที่เก็บ prisma ของประธานนะครับ
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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

export async function deleteCommittee(cmit_aid: number) {
  // ทำ Soft Delete (เปลี่ยน is_deleted เป็น 1) เพื่อไม่ให้ข้อมูลหายไปจากฐานข้อมูลจริงๆ
  await prisma.tb_committees.update({
    where: { cmit_aid: cmit_aid },
    data: { is_deleted: 1 },
  });

  // สั่งให้ Next.js รีเฟรชหน้าตารางใหม่ทันที
  revalidatePath("/committees");
}

export async function updateCommittee(formData: FormData) {
  // รับค่า ID ที่ซ่อนไว้ในฟอร์มเพื่อใช้ค้นหาว่าต้องแก้ข้อมูลของใคร
  const cmit_aid = Number(formData.get("cmit_aid"));
  
  const base_type = formData.get("base_type") as string;
  const base_id = Number(formData.get("base_id"));
  const cmit_name = formData.get("cmit_name") as string;
  const cmit_position = formData.get("cmit_position") as string;
  const cmit_unit = formData.get("cmit_unit") as string;

  if (!cmit_aid || !base_type || !base_id || !cmit_name) {
    throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
  }

  // อัปเดตข้อมูลทับของเดิม
  await prisma.tb_committees.update({
    where: { cmit_aid: cmit_aid },
    data: {
      base_type: base_type,
      base_id: base_id,
      cmit_name: cmit_name,
      cmit_position: cmit_position,
      cmit_unit: cmit_unit,
    },
  });

  // อัปเดตเสร็จให้เด้งกลับไปหน้าตาราง
  redirect("/committees");
}
