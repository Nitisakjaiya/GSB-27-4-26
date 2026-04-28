'use server'

import { prisma } from "../../lib/prisma"
import { auth } from "../../auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache" // 👈 1. เพิ่มบรรทัดนี้เข้ามา

export async function createContract(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  
  const userId = BigInt(session.user.id)

  const category_code = formData.get("category_code") as string
  const ct_number = formData.get("ct_number") as string
  const ct_name = formData.get("ct_name") as string
  const coordinator_name = formData.get("coordinator_name") as string
  
  const item_type = formData.get("item_type") as string
  const item_agreement = formData.get("item_agreement") as string
  const item_cost_raw = formData.get("item_cost") as string
  const item_cost = item_cost_raw ? parseFloat(item_cost_raw) : 0

  // 👇 พิมพ์ Log เช็คว่าฟังก์ชันทำงานจริงไหม
  console.log(`👉 กำลังบันทึกข้อมูลสัญญา: ${ct_number}`); 

  try {
    await prisma.tb_contract.create({
      data: {
        category_code: category_code,
        ct_number: ct_number,
        ct_name: ct_name,
        coordinator_name: coordinator_name,
        created_by: userId,
        items: {
          create: {
            item_type: item_type,
            item_agreement: item_agreement,
            item_cost: item_cost,
          }
        }
      }
    })
    console.log(`✅ บันทึกลงฐานข้อมูลสำเร็จ!`);
  } catch (error) {
    console.error("🔥 Database Error:", error)
    throw new Error("ไม่สามารถบันทึกข้อมูลได้")
  }

  // 👈 2. สั่งล้างแคชหน้า Dashboard ก่อนเด้งไป
  revalidatePath("/dashboard") 
  redirect("/dashboard")
}

// แก้ไขเฉพาะฟังก์ชัน deleteContract นะครับ ส่วนอื่นคงเดิมไว้
export async function deleteContract(formData: FormData) { // 👈 เปลี่ยนจาก id: bigint เป็น formData: FormData
  // 1. ดึงค่า ID ที่ซ่อนอยู่ใน input name="id"
  const idStr = formData.get("id") as string;

  if (!idStr) {
    console.error("❌ หา ID ไม่เจอใน FormData");
    return;
  }

  try {
    console.log(`👉 กำลังทำ Soft Delete สัญญา ID: ${idStr}`);

    // 2. แปลง String เป็น BigInt ก่อนส่งให้ Prisma
    await prisma.tb_contract.update({
      where: { 
        ct_aid: BigInt(idStr) 
      },
      data: { 
        is_deleted: 1 
      },
    });

    console.log(`✅ ลบสัญญาสำเร็จ!`);
    
    // 3. สั่งให้ Dashboard รีเฟรชข้อมูลใหม่
    revalidatePath("/dashboard");

  } catch (error) {
    console.error("🔥 Delete Error Details:", error);
    throw new Error("ไม่สามารถลบสัญญาได้");
  }
}
