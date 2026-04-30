import { prisma } from "../../../../../lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  BadgeDollarSign, 
  Calendar,
  Briefcase
} from "lucide-react";

export default async function CopySuccessWizardPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  // ดึงข้อมูลแผนงานที่เพิ่งถูกสร้างจากระบบ Magic Copy
  const plan = await prisma.tb_planning.findUnique({
    where: { pl_aid: BigInt(id) },
    include: { items: { where: { is_deleted: 0 } } }
  });

  if (!plan) notFound();

  // คำนวณยอดรวมงบประมาณ
  const totalBudget = plan.items.reduce((sum, item) => sum + Number(item.pli_budget || 0), 0);

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in zoom-in-95 duration-500">
      
      <div className="bg-gray-900 rounded-[3rem] border border-gray-800 shadow-2xl overflow-hidden relative text-center p-12">
        {/* Background Effects (ปรับเป็นโทนเขียว Emerald) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-[#10B981]/15 blur-3xl"></div>

        {/* Success Icon */}
        <div className="mx-auto w-24 h-24 bg-[#10B981]/10 rounded-full flex items-center justify-center mb-8 border-2 border-[#10B981]/20 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce-slow relative z-10">
          <CheckCircle2 size={48} className="text-[#10B981]" />
        </div>

        <h1 className="text-4xl font-black text-white mb-4 tracking-tight relative z-10">คัดลอกข้อมูลสำเร็จ!</h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed mb-10 relative z-10">
          ระบบได้ดึงข้อมูลจากสัญญาต้นทางมาสร้างเป็น <b className="text-[#10B981]">"ร่างแผนงาน"</b> เรียบร้อยแล้ว โปรดตรวจสอบความถูกต้องของข้อมูลเบื้องต้นก่อนดำเนินการต่อ
        </p>

        {/* Summary Card */}
        <div className="bg-black/50 border border-gray-800 rounded-[2rem] p-8 text-left space-y-6 max-w-2xl mx-auto mb-10 shadow-inner relative z-10">
          
          <div className="flex items-start gap-4 pb-6 border-b border-gray-800/50">
            <div className="p-3 bg-[#10B981]/10 rounded-xl text-[#10B981]">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-1">Planning Name</p>
              <h2 className="text-xl font-bold text-white">{plan.pl_name}</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-800 rounded-lg text-emerald-400"><Calendar size={18} /></div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Budget Year</p>
                <p className="text-sm text-white font-bold">{plan.pl_year}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-800 rounded-lg text-emerald-400"><Briefcase size={18} /></div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Items Copied</p>
                <p className="text-sm text-white font-bold">{plan.items.length} รายการ</p>
              </div>
            </div>
          </div>

          <div className="bg-[#10B981]/5 p-5 rounded-2xl border border-[#10B981]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <BadgeDollarSign size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Total Estimated Budget</span>
            </div>
            <span className="text-2xl font-mono font-black text-white">
              {totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-sm text-gray-500">THB</span>
            </span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10">
          <Link 
            href={`/contracts/${plan.ref_contract_id}`}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 transition-all border border-transparent hover:border-gray-700"
          >
            กลับไปหน้าสัญญา
          </Link>
          <Link 
            href={`/planning/${id}`}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-white bg-[#10B981] hover:bg-[#059669] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#10B981]/20 active:scale-95"
          >
            ไปจัดการแผนงานต่อ <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}
