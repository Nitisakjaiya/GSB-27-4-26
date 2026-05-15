import { prisma } from "../../../../lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import TrackingForm from "../../../../components/forms/TrackingForm";
import BudgetAllocationForm from "../../../../components/forms/BudgetAllocationForm";
import { 
  ArrowLeft, 
  BadgeDollarSign, 
  Briefcase, 
  Link as LinkIcon,
  Edit3,
  Users,
  HardDrive,
  File,
  Download,
  Info,
  Wallet,
  FilePlus2,
  CheckCircle 
} from "lucide-react";

import { getDownloadUrl } from "../../contracts/actions";
import { convertPlanToContract } from "./actions";

import { auth } from "../../../../auth";
import { revalidatePath } from "next/cache";

export default async function PlanningDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  const session = await auth();
  const userRole = session?.user?.role;

  const plan = await prisma.tb_planning.findUnique({
    where: { pl_aid: BigInt(id) },
    include: { items: { where: { is_deleted: 0 } } }
  });

  if (!plan || plan.is_deleted === 1) notFound();

  let sourceContract = null;
  let refCommittees: any[] = [];
  let refFiles: any[] = [];

  if (plan.ref_contract_id) {
    sourceContract = await prisma.tb_contract.findUnique({
      where: { ct_aid: plan.ref_contract_id }
    });

    refCommittees = await prisma.tb_committees.findMany({
      where: { 
        base_id: plan.ref_contract_id, 
        base_type: 'CON', 
        is_deleted: 0 
      },
      orderBy: { created_at: 'asc' }
    });

    refFiles = await prisma.tb_files.findMany({
      where: { 
        base_id: plan.ref_contract_id, 
        base_type: 'CON', 
        is_deleted: 0 
      },
      orderBy: { created_at: 'desc' }
    });
  }

  const rawTrackingRecords = await prisma.tb_tracking.findMany({
    where: { 
      base_id: BigInt(id), 
      base_type: 'PLA', 
      is_deleted: 0 
    },
    orderBy: { trk_date: 'desc' }
  });

  const trackingRecords = rawTrackingRecords.map(record => ({
    ...record,
    disbursed_amount: record.disbursed_amount ? Number(record.disbursed_amount) : null,
  }));

  const rawBudgets = await prisma.tb_budget_allocation.findMany({
    where: { 
      base_id: BigInt(id), 
      base_type: 'PLA', 
      is_deleted: 0 
    },
    orderBy: { budget_year: 'asc' }
  });

  const budgetAllocations = rawBudgets.map(b => ({
    ...b,
    allocated_amount: Number(b.allocated_amount)
  }));

  const totalBudget = plan.items.reduce((sum, item) => sum + Number(item.pli_budget || 0), 0);

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
      
      {/* --- Navigation & Actions --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Link href="/planning" className="flex items-center gap-2 text-slate-500 hover:text-pink-600 transition-all group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-sm font-bold uppercase tracking-tighter">Back to Planning List</span>
        </Link>

        <div className="flex gap-3">
          
          {userRole === 'MANAGER' && plan.status !== 'APPROVED' && (
            <form action={async () => {
              "use server";
              await prisma.tb_planning.update({
                where: { pl_aid: BigInt(id) },
                data: { status: 'APPROVED' }
              });
              revalidatePath(`/planning/${id}`);
            }}>
              <button 
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all text-sm font-black shadow-lg shadow-blue-500/20 active:scale-95"
              >
                <CheckCircle size={16} />
                อนุมัติแผนงาน
              </button>
            </form>
          )}

          {plan.status === "APPROVED" && (
            <form action={async () => {
              "use server";
              const res = await convertPlanToContract(plan.pl_aid.toString());
              if (res.success && res.newContractId) {
                redirect(`/contracts/${res.newContractId}/edit`);
              }
            }}>
              <button 
                type="submit"
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2.5 rounded-xl transition-all text-sm font-black shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <FilePlus2 size={16} />
                ทำสัญญาจากแผนงานนี้
              </button>
            </form>
          )}

          {plan.status !== 'APPROVED' && (
            <Link 
              href={`/planning/${id}/edit`}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-5 py-2.5 rounded-xl border border-slate-200 transition-all text-sm font-bold shadow-sm active:scale-95"
            >
              <Edit3 size={16} />
              แก้ไขแผนงาน
            </Link>
          )}
        </div>
      </div>

      {/* --- Main Content Card (เปลี่ยนเป็น Glassmorphism สีขาว) --- */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] border border-white shadow-2xl shadow-slate-300/30 overflow-hidden relative">
        <div className="h-2 w-full bg-gradient-to-r from-[#EB005D] via-pink-400 to-sky-400"></div>

        <div className="p-10 md:p-12 space-y-16">
          
          {/* --- Section 1: Header --- */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-pink-50 text-[#EB005D] text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-pink-100">
                  BUDGET YEAR {plan.pl_year}
                </span>
                <span className="text-slate-400 text-xs font-mono tracking-tighter">PLAN_ID: {plan.pl_aid.toString()}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight mb-6 italic">{plan.pl_name}</h1>
              
              {sourceContract && (
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-pink-50/50 rounded-2xl border border-pink-100">
                  <LinkIcon size={14} className="text-[#EB005D]" />
                  <span className="text-xs text-slate-500 font-medium">คัดลอกข้อมูลจากสัญญา:</span>
                  <Link href={`/contracts/${sourceContract.ct_aid}`} className="text-xs text-[#EB005D] hover:text-pink-600 font-bold hover:underline transition-all">
                    {sourceContract.ct_number} - {sourceContract.ct_name.substring(0, 40)}...
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 min-w-[280px]">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-4">Current Status</p>
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${
                  plan.status?.toUpperCase() === 'ACTIVE' ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 
                  plan.status?.toUpperCase() === 'COMPLETED' ? 'bg-blue-500' : 
                  plan.status?.toUpperCase() === 'APPROVED' ? 'bg-emerald-500' : 
                  plan.status?.toUpperCase() === 'CANCELLED' ? 'bg-red-500' : 
                  'bg-amber-500 animate-pulse'
                }`}></div>
                <span className={`text-2xl font-bold tracking-tight uppercase italic ${plan.status?.toUpperCase() === 'CANCELLED' ? 'text-red-500' : 'text-slate-800'}`}>
                  {plan.status || 'DRAFT'}
                </span>
              </div>
            </div>
          </div>

          {/* --- Section 2: Budget Items --- */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="p-2 bg-pink-50 rounded-lg">
                <BadgeDollarSign className="text-[#EB005D]" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 italic tracking-tight uppercase">งบประมาณที่จัดสรร</h3>
            </div>

            <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-inner">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100/50 text-[10px] text-slate-400 uppercase tracking-widest font-black">
                  <tr>
                    <th className="px-10 py-7">ITEM_TYPE</th>
                    <th className="px-10 py-7">DESCRIPTION</th>
                    <th className="px-10 py-7 text-right">BUDGET (THB)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {plan.items.map((item) => (
                    <tr key={item.pli_aid.toString()} className="group hover:bg-white transition-all">
                      <td className="px-10 py-8 font-black text-slate-700 italic">
                        <div className="flex items-center gap-3">
                          <Briefcase size={16} className="text-[#EB005D]/70" />
                          {item.pli_type}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-slate-500">{item.pli_description}</td>
                      <td className="px-10 py-8 text-right font-mono font-black text-2xl text-slate-800 tracking-tighter">
                        {Number(item.pli_budget || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                  {plan.items.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-10 py-12 text-center text-slate-400 italic text-xs">
                        ยังไม่มีรายการงบประมาณ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="bg-pink-50/50 p-8 flex justify-between items-center border-t border-pink-100">
                 <p className="text-pink-600/60 text-xs font-black uppercase tracking-widest">Total Allocated Budget</p>
                 <p className="text-[#EB005D] text-4xl font-mono font-black tracking-tighter">
                    {totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                 </p>
              </div>
            </div>
          </div>

          {/* --- Section 3: Reference Data Section --- */}
          {sourceContract && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* คณะกรรมการอ้างอิง */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <Users className="text-[#EB005D]/50" size={20} />
                  <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest italic">คณะกรรมการ (อ้างอิงจากสัญญา)</h4>
                </div>
                <div className="space-y-3">
                  {refCommittees.map((member) => (
                    <div key={member.cmit_aid.toString()} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-[10px] text-[#EB005D] font-bold border border-pink-100 uppercase">
                        {member.cmit_name?.substring(0, 1) || 'U'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">{member.cmit_name}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-medium">{member.cmit_position}</p>
                      </div>
                    </div>
                  ))}
                  {refCommittees.length === 0 && <p className="text-xs text-slate-400 italic px-2">ไม่พบรายชื่อกรรมการในสัญญาต้นทาง</p>}
                </div>
              </div>

              {/* เอกสารอ้างอิง */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <HardDrive className="text-[#EB005D]/50" size={20} />
                  <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest italic">เอกสารแนบ (อ้างอิงจากสัญญา)</h4>
                </div>
                <div className="space-y-3">
                  {refFiles.map(async (file) => {
                    const downloadUrl = await getDownloadUrl(file.file_path);
                    return (
                      <div key={file.file_aid.toString()} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <File size={16} className="text-[#EB005D]/50 group-hover:text-[#EB005D]" />
                          <div>
                            <p className="text-[11px] font-bold text-slate-700 group-hover:text-[#EB005D] transition-colors">{file.file_name}</p>
                            <p className="text-[9px] text-slate-400 uppercase font-mono italic">Source: Contract Storage</p>
                          </div>
                        </div>
                        <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-[#EB005D] transition-colors">
                          <Download size={14} />
                        </a>
                      </div>
                    );
                  })}
                  {refFiles.length === 0 && <p className="text-xs text-slate-400 italic px-2">ไม่พบเอกสารแนบในสัญญาต้นทาง</p>}
                </div>
              </div>

            </div>
          )}

          {/* --- Section 4: Budget Allocation --- */}
          <div className="pt-10 border-t border-slate-100">
             <div className="mb-6 flex items-center gap-3">
                <Wallet className="text-[#EB005D]" size={24} />
                <div>
                  <h3 className="text-2xl font-black text-slate-800 italic tracking-tight uppercase">Budget Allocation</h3>
                  <p className="text-slate-400 text-xs font-mono mt-1">กำหนดสัดส่วนการเบิกจ่ายรายปีงบประมาณ</p>
                </div>
             </div>
             
             <BudgetAllocationForm 
               baseId={id} 
               baseType="PLA" 
               allocations={budgetAllocations}
               totalBudget={totalBudget}
             />
          </div>

          {/* --- Section 5: Progress Tracking --- */}
          <div className="pt-10 border-t border-slate-100">
             <div className="mb-8">
                <h3 className="text-2xl font-black text-sky-600 italic tracking-tight uppercase">Progress Tracking</h3>
                <p className="text-slate-400 text-xs font-mono mt-1">อัปเดตและติดตามความคืบหน้าของการเบิกจ่ายและสถานะแผนงาน</p>
             </div>
             
             <TrackingForm 
               baseId={id} 
               baseType="PLA" 
               records={trackingRecords} 
             />
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-center gap-3 pt-10 border-t border-slate-100 opacity-60">
            <Info size={12} className="text-slate-400" />
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.5em]">GSB Contract Management Project // Modern View Active</p>
          </div>

        </div>
      </div>
    </div>
  );
}
