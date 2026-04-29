import { prisma } from "../../../../lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  BadgeDollarSign, 
  Briefcase, 
  FileText,
  Link as LinkIcon,
  Edit3
} from "lucide-react";

export default async function PlanningDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // แกะค่า ID ตาม Next.js 16
  const { id } = await params;

  // ดึงข้อมูลแผนงาน และ รายการย่อย
  const plan = await prisma.tb_planning.findUnique({
    where: { pl_aid: BigInt(id) },
    include: { items: { where: { is_deleted: 0 } } }
  });

  if (!plan || plan.is_deleted === 1) notFound();

  // ดึงข้อมูลสัญญาต้นทาง (ถ้ามี) เพื่อเอามาโชว์ (Lineage Tracking - Task 3.4)
  let sourceContract = null;
  if (plan.ref_contract_id) {
    sourceContract = await prisma.tb_contract.findUnique({
      where: { ct_aid: plan.ref_contract_id }
    });
  }

  // คำนวณยอดรวม
  const totalBudget = plan.items.reduce((sum, item) => sum + Number(item.pli_budget || 0), 0);

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      
      {/* Navigation & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Link href="/planning" className="flex items-center gap-2 text-gray-500 hover:text-[#0EA5E9] transition-all group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-sm font-bold uppercase tracking-tighter">Back to Planning List</span>
        </Link>

        <div className="flex gap-3">
          <Link 
            href={`/planning/${id}/edit`}
            className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black px-5 py-2.5 rounded-xl border border-amber-500/20 transition-all text-sm font-bold shadow-lg shadow-amber-500/5 active:scale-95"
          >
            <Edit3 size={16} />
            แก้ไขแผนงาน
          </Link>
        </div>
      </div>

      <div className="bg-gray-900 rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden relative">
        <div className="h-2 w-full bg-gradient-to-r from-emerald-500 to-teal-600"></div>

        <div className="p-10 md:p-12 space-y-12">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-emerald-500/10 text-emerald-400 text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-500/20">
                  FY {plan.pl_year}
                </span>
                <span className="text-gray-600 text-xs font-mono tracking-tighter uppercase">PLAN_ID: {plan.pl_aid.toString()}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6 tracking-tight">
                {plan.pl_name}
              </h1>
              
              {/* Task 3.4: Lineage Tracking */}
              {sourceContract && (
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700">
                  <LinkIcon size={14} className="text-[#38BDF8]" />
                  <span className="text-xs text-gray-400 font-medium">สร้างจากสัญญา:</span>
                  <Link href={`/contracts/${sourceContract.ct_aid}`} className="text-xs text-[#38BDF8] hover:text-white font-bold hover:underline transition-all">
                    {sourceContract.ct_number} - {sourceContract.ct_name.substring(0, 30)}...
                  </Link>
                </div>
              )}
            </div>

            {/* Status Badge */}
            <div className="bg-black/40 p-8 rounded-[2rem] border border-gray-800 min-w-[280px] backdrop-blur-md">
               <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-4">Plan Status</p>
               <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${plan.status === 'DRAFT' ? 'bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.6)]' : 'bg-green-500'}`}></div>
                  <span className="text-2xl font-bold text-white tracking-tight uppercase">{plan.status}</span>
               </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <BadgeDollarSign className="text-emerald-500" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white italic tracking-tight uppercase">Budget Allocation</h3>
            </div>

            <div className="bg-black/40 rounded-[2.5rem] border border-gray-800 overflow-hidden shadow-2xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-800/50 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">
                  <tr>
                    <th className="px-10 py-7">ITEM_TYPE</th>
                    <th className="px-10 py-7">DESCRIPTION</th>
                    <th className="px-10 py-7 text-right uppercase">BUDGET (THB)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {plan.items.map((item) => (
                    <tr key={item.pli_aid.toString()} className="group hover:bg-emerald-500/5 transition-all">
                      <td className="px-10 py-8 font-black text-white italic">
                        <div className="flex items-center gap-3">
                          <Briefcase size={16} className="text-emerald-500 group-hover:rotate-12 transition-transform" />
                          {item.pli_type}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-gray-500 group-hover:text-gray-300 transition-colors leading-relaxed">
                        {item.pli_description}
                      </td>
                      <td className="px-10 py-8 text-right font-mono font-black text-2xl text-white tracking-tighter">
                        {Number(item.pli_budget || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-emerald-900/20 p-6 flex justify-between items-center border-t border-emerald-900/30">
                 <p className="text-emerald-500/80 text-[10px] uppercase font-black tracking-[0.3em]">Total Plan Budget</p>
                 <p className="text-emerald-400 text-3xl font-mono font-black">{totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
