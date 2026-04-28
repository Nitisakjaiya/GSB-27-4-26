'use server'

import { minioClient, BUCKET_NAME } from "../../../lib/minio";
import { prisma } from "../../../lib/prisma"
import { auth } from "../../../auth"
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

// 28/เม.ษ /2569 --- Action สำหรับจัดการคณะกรรมการ ---

export async function addCommittee(formData: FormData) {
  const base_id = formData.get("base_id") as string;
  const cmit_name = formData.get("cmit_name") as string;
  const cmit_position = formData.get("cmit_position") as string;

  try {
    await prisma.tb_committees.create({
      data: {
        base_type: 'CON', // 'CON' สำหรับสัญญาตาม Schema ที่วางไว้
        base_id: BigInt(base_id),
        cmit_name: cmit_name,
        cmit_position: cmit_position,
      },
    });

    revalidatePath(`/(protected)/contracts/${base_id}`);
  } catch (error) {
    console.error("Add Committee Error:", error);
    throw new Error("ไม่สามารถเพิ่มรายชื่อกรรมการได้");
  }
}

export async function deleteCommittee(formData: FormData) {
  const cmit_aid = formData.get("cmit_aid") as string;
  const base_id = formData.get("base_id") as string;

  try {
    await prisma.tb_committees.update({
      where: { cmit_aid: BigInt(cmit_aid) },
      data: { is_deleted: 1 } // ใช้ Soft Delete ตาม Pattern ของคุณนิติ
    });

    revalidatePath(`/(protected)/contracts/${base_id}`);
  } catch (error) {
    console.error("Delete Committee Error:", error);
    throw new Error("ไม่สามารถลบรายชื่อกรรมการได้");
  }
}

// --- สำหรับจัดการไฟล์ ---

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;
  const base_id = formData.get("base_id") as string;
  const base_type = "CON";

  if (!file || file.size === 0) return;

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `${base_type}/${base_id}/${fileName}`;

  try {
    // 1. ส่งไฟล์ไปที่ MinIO
    await minioClient.putObject(BUCKET_NAME, filePath, buffer, file.size, {
        'Content-Type': file.type,
    });

    // 2. บันทึก Metadata ลง SQL Server
    await prisma.tb_files.create({
      data: {
        base_type,
        base_id: BigInt(base_id),
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
      },
    });

    revalidatePath(`/(protected)/contracts/${base_id}`);
  } catch (error) {
    console.error("🔥 Upload Error:", error);
    throw new Error("อัปโหลดไม่สำเร็จ");
  }
}

export async function deleteFile(formData: FormData) {
  const file_aid = formData.get("file_aid") as string;
  const base_id = formData.get("base_id") as string;
  const filePath = formData.get("file_path") as string;

  try {
    // 1. ลบจาก MinIO (ลบจริง)
    await minioClient.removeObject(BUCKET_NAME, filePath);
    
    // 2. Soft Delete ใน Database
    await prisma.tb_files.update({
      where: { file_aid: BigInt(file_aid) },
      data: { is_deleted: 1 }
    });

    revalidatePath(`/(protected)/contracts/${base_id}`);
  } catch (error) {
    console.error("🔥 Delete File Error:", error);
  }
}

// เพิ่มใน actions.ts
export async function getDownloadUrl(filePath: string) {
  // สร้างลิงก์ที่มีอายุ 1 ชั่วโมง (3600 วินาที)
  return await minioClient.presignedGetObject(BUCKET_NAME, filePath, 3600);
}
