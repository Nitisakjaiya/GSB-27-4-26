'use server'

import { prisma } from "../../../lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

// 🚀 ฟังก์ชันสำหรับลบผู้ใช้งาน (Soft Delete)
export async function deleteUser(userId: string) {
  try {
    await prisma.tb_user.update({
      where: { user_aid: BigInt(userId) },
      data: { is_deleted: 1 }
    });
    
    // สั่งรีเฟรชหน้าตั้งค่าเพื่ออัปเดตตาราง
    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "ไม่สามารถลบผู้ใช้งานได้" };
  }
}

// 🚀 ฟังก์ชันสำหรับสร้างผู้ใช้งานใหม่
export async function createUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const role = formData.get("role") as string;

  try {
    // 1. เช็กก่อนว่ามี Username นี้ในระบบหรือยัง?
    const existingUser = await prisma.tb_user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return { success: false, error: "Username นี้มีผู้ใช้งานแล้ว!" };
    }

    // 2. เข้ารหัส Password เพื่อความปลอดภัยขั้นสูงสุด
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. บันทึกลง Database
    await prisma.tb_user.create({
      data: {
        username,
        password: hashedPassword,
        first_name,
        last_name,
        role,
      }
    });

  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" };
  }

  // ถ้าสำเร็จ ให้กลับไปหน้า Settings เพื่อดูรายชื่อใหม่
  revalidatePath('/settings');
  redirect('/settings');
}
