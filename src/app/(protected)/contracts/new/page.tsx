import { prisma } from '../../../../lib/prisma'
import { createContract } from '../actions'
import { FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ContractForm from './ContractForm' // 🚀 นำเข้า Form แบบ Client Component

export default async function NewContractPage() {
  // 🚀 ดึงข้อมูลแผนงานเฉพาะที่สถานะ "APPROVED" จาก Database
  const approvedPlansRaw = await prisma.tb_planning.findMany({
    where: { 
      status: 'APPROVED', 
      is_deleted: 0 
    },
    include: { 
      items: { where: { is_deleted: 0 } } 
    }
  });

  // 🚀 แปลงข้อมูล (Serialize) เพื่อแก้ปัญหาเรื่อง BigInt ไม่สามารถส่งข้ามไปยัง Client Component ได้
  const serializedPlans = approvedPlansRaw.map(plan => ({
    id: plan.pl_aid.toString(),
    name: plan.pl_name,
    items: plan.items.map(item => ({
      desc: item.pli_description,
      budget: Number(item.pli_budget || 0)
    }))
  }));

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      
      {/* ปุ่มย้อนกลับ */}
      <Link href="/contracts" className="flex items-center gap-2 text-gray-400 hover:text-emerald-500 transition-colors mb-6 text-sm w-fit">
        <ArrowLeft size={16} /> กลับไปหน้าหลัก
      </Link>

      {/* หัวข้อ */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-600/20 rounded-lg">
          <FileText className="text-blue-500" size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white italic tracking-tight">บันทึกสัญญาฉบับใหม่</h1>
          <p className="text-xs text-gray-500 font-mono tracking-widest uppercase mt-1">Contract Creation Wizard</p>
        </div>
      </div>
      
      {/* 🚀 เรียกใช้ Client Component พร้อมส่งข้อมูล Plans เข้าไป */}
      <ContractForm plans={serializedPlans} action={createContract} />

    </div>
  )
}
