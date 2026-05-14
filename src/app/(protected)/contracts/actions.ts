'use server'

import { Decimal } from "@prisma/client/runtime/library";
import { minioClient, BUCKET_NAME } from "../../../lib/minio";
import { prisma } from "../../../lib/prisma"
import { auth } from "../../../auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache" 

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

  const startDateRaw = formData.get("start_date") as string;
  const endDateRaw = formData.get("end_date") as string;
  const start_date = startDateRaw ? new Date(startDateRaw) : null;
  const end_date = endDateRaw ? new Date(endDateRaw) : null;

  // 🚀 💡 รับไฟล์ที่อัปโหลดมาจากฟอร์มหน้าบ้าน
  const contract_file = formData.get("contract_file") as File | null;

  console.log(`👉 กำลังบันทึกข้อมูลสัญญา: ${ct_number}`); 

  try {
    // 1. สร้างสัญญาหลักก่อน เพื่อให้ได้ ID (ct_aid) มาใช้งาน
    const newContract = await prisma.tb_contract.create({
      data: {
        category_code: category_code,
        ct_number: ct_number,
        ct_name: ct_name,
        coordinator_name: coordinator_name,
        created_by: userId,
        start_date: start_date,
        end_date: end_date,
        items: {
          create: {
            item_type: item_type,
            item_agreement: item_agreement,
            item_cost: item_cost,
            start_date: start_date,
            end_date: end_date,
          }
        }
      }
    });

    console.log(`✅ บันทึกลงฐานข้อมูลสำเร็จ! ID: ${newContract.ct_aid}`);

    // 🚀 💡 2. ระบบอัปโหลดไฟล์ (ทำงานต่อเมื่อมีการแนบไฟล์มาด้วยเท่านั้น)
    if (contract_file && contract_file.size > 0) {
      console.log(`👉 กำลังอัปโหลดไฟล์: ${contract_file.name}`);
      
      const base_id = newContract.ct_aid.toString();
      const buffer = Buffer.from(await contract_file.arrayBuffer());
      const fileName = `${Date.now()}-${contract_file.name}`;
      const filePath = `CON/${base_id}/${fileName}`; // จัดเก็บเป็นหมวดหมู่ CON/ID_สัญญา/ชื่อไฟล์

      // ส่งไฟล์ขึ้น MinIO Server
      await minioClient.putObject(BUCKET_NAME, filePath, buffer, contract_file.size, {
          'Content-Type': contract_file.type,
      });

      // บันทึกประวัติไฟล์ลง Database (tb_files)
      await prisma.tb_files.create({
        data: {
          base_type: "CON",
          base_id: newContract.ct_aid,
          file_name: contract_file.name,
          file_path: filePath,
          file_size: contract_file.size,
          mime_type: contract_file.type,
        },
      });
      console.log(`✅ อัปโหลดไฟล์สำเร็จ!`);
    }

  } catch (error) {
    console.error("🔥 Database/Upload Error:", error)
    throw new Error("ไม่สามารถบันทึกข้อมูลได้")
  }

  revalidatePath("/dashboard") 
  redirect("/dashboard")
}

// แก้ไขเฉพาะฟังก์ชัน deleteContract นะครับ ส่วนอื่นคงเดิมไว้
export async function deleteContract(formData: FormData) { 
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
        base_type: 'CON', 
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
      data: { is_deleted: 1 } 
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

// เพิ่มต่อท้ายใน actions.ts

// แทนที่ฟังก์ชันเดิมด้วยโค้ดนี้ครับ
export async function updateContract(formData: FormData) {
  const id = formData.get("id") as string;
  const category_code = formData.get("category_code") as string;
  const ct_number = formData.get("ct_number") as string;
  const ct_name = formData.get("ct_name") as string;
  const coordinator_name = formData.get("coordinator_name") as string;
  const contract_status = formData.get("contract_status") as string;

  // 🌟 1. รับค่าวันที่ที่เป็น String จากฟอร์ม (เช็กชื่อ input ในฟอร์มด้วยนะครับว่าตรงกันไหม)
  const ctDateRaw = formData.get("ct_date") as string;
  const startDateRaw = formData.get("start_date") as string;
  const endDateRaw = formData.get("end_date") as string;
  const signDateRaw = formData.get("sign_date") as string;

  try {
    await prisma.tb_contract.update({
      where: { ct_aid: BigInt(id) },
      data: {
        category_code: category_code,
        ct_number: ct_number,
        ct_name: ct_name,
        coordinator_name: coordinator_name,
        contract_status: contract_status,
        
        // 🌟 2. แปลง String เป็น Date แล้วบันทึกลงฐานข้อมูล
        ct_date: ctDateRaw ? new Date(ctDateRaw) : null,
        start_date: startDateRaw ? new Date(startDateRaw) : null,
        end_date: endDateRaw ? new Date(endDateRaw) : null,
        sign_date: signDateRaw ? new Date(signDateRaw) : null,
      },
    });

    // ✅ Revalidate เพื่อล้าง Cache ให้หน้าเว็บดึงข้อมูลใหม่ทันที
    revalidatePath(`/contracts/${id}`);
    revalidatePath("/dashboard");

  } catch (error) {
    console.error("Update Error:", error);
    throw new Error("Update failed");
  }

  // ✅ Redirect กลับไปหน้า Detail ของสัญญา
  redirect(`/contracts/${id}`); 
}

// --- สำหรับจัดการรายการงบประมาณย่อย (Contract Items) ---

export async function addContractItem(formData: FormData) {
  const contractId = formData.get("contractId") as string;
  const item_type = formData.get("item_type") as string;
  const item_agreement = formData.get("item_agreement") as string;
  const item_cost = formData.get("item_cost") as string;

  await prisma.tb_contract_items.create({
    data: {
      contract_id: BigInt(contractId),
      item_type,
      item_agreement,
      item_cost: new Decimal(item_cost || 0),
    },
  });

  revalidatePath(`/contracts/${contractId}/edit`);
}

export async function updateContractItem(formData: FormData) {
  const item_autoid = formData.get("item_autoid") as string;
  const contractId = formData.get("contractId") as string;
  const item_type = formData.get("item_type") as string;
  const item_agreement = formData.get("item_agreement") as string;
  const item_cost = formData.get("item_cost") as string;

  await prisma.tb_contract_items.update({
    where: { item_autoid: BigInt(item_autoid) },
    data: {
      item_type,
      item_agreement,
      item_cost: new Decimal(item_cost || 0),
    },
  });

  revalidatePath(`/contracts/${contractId}/edit`);
}

export async function deleteContractItem(formData: FormData) {
  const item_autoid = formData.get("item_autoid") as string;
  const contractId = formData.get("contractId") as string;

  await prisma.tb_contract_items.update({
    where: { item_autoid: BigInt(item_autoid) },
    data: { is_deleted: 1 },
  });

  revalidatePath(`/contracts/${contractId}/edit`);
}

/**
 * Task 6.2: คัดลอกข้อมูลจาก Planning ไปสร้างเป็น Contract ใหม่
 */
export async function createContractFromPlanning(planningId: string) {
  try {
    // 1. ดึงข้อมูลแผนงานต้นทาง
    const plan = await prisma.tb_planning.findUnique({
      where: { pl_aid: BigInt(planningId) },
      include: { items: { where: { is_deleted: 0 } } }
    });

    if (!plan) throw new Error("ไม่พบข้อมูลแผนงาน");

    // 2. สร้างสัญญาใหม่ (Main Contract)
    const newContract = await prisma.tb_contract.create({
      data: {
        ct_name: `[จากแผนงาน] ${plan.pl_name}`,
        contract_status: "ACTIVE",
        // เราสามารถใส่ข้อมูลเบื้องต้นรอไว้ได้เลย
        created_at: new Date(),
      }
    });

    // 3. วนลูปคัดลอกรายการงบประมาณไปเป็นรายการสัญญา
    if (plan.items.length > 0) {
      const contractItems = plan.items.map(item => ({
        contract_id: newContract.ct_aid,
        item_type: item.pli_type,
        item_agreement: item.pli_description,
        item_cost: item.pli_budget,
      }));

      await prisma.tb_contract_items.createMany({
        data: contractItems
      });
    }

    // 4. อัปเดตสถานะแผนงานว่า "ถูกนำไปทำสัญญาแล้ว"
    await prisma.tb_planning.update({
      where: { pl_aid: BigInt(planningId) },
      data: { status: "CONTRACTED" } // ตั้งสถานะใหม่เพื่อให้รู้ว่าจบขั้นตอนแผนแล้ว
    });

    return { success: true, newId: newContract.ct_aid.toString() };
  } catch (error) {
    console.error("Convert Error:", error);
    return { success: false };
  }
}
