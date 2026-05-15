import { prisma } from '../../../../lib/prisma'
import { createContract } from '../actions'
import { FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ContractForm from './ContractForm' 

export default async function NewContractPage() {
  const approvedPlansRaw = await prisma.tb_planning.findMany({
    where: { status: 'APPROVED', is_deleted: 0 },
    include: { items: { where: { is_deleted: 0 } } }
  });

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
      <Link href="/contracts" className="flex items-center gap-2 text-slate-500 hover:text-[#EB005D] transition-colors mb-6 text-sm w-fit font-bold uppercase tracking-tighter">
        <ArrowLeft size={16} /> กลับไปหน้าหลัก
      </Link>

      {/* หัวข้อ */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-pink-100 rounded-xl shadow-sm border border-pink-200">
          <FileText className="text-[#EB005D]" size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 italic tracking-tight">บันทึกสัญญาฉบับใหม่</h1>
          <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mt-1">Contract Creation Wizard</p>
        </div>
      </div>
      
      {/* 🚀 หมายเหตุ: ตัวฟอร์ม ContractForm เป็น Client Component ประธานอาจจะต้องเข้าไปเปลี่ยนสีข้างในไฟล์นั้นให้เป็นสีขาวด้วยนะครับ! */}
      <ContractForm plans={serializedPlans} action={createContract} />

    </div>
  )
}
