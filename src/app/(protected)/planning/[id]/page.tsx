import { prisma } from "../../../../lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import TrackingForm from "../../../../components/forms/TrackingForm";
import { 
  ArrowLeft, 
  Calendar, 
  BadgeDollarSign, 
  Briefcase, 
  FileText,
  Link as LinkIcon,
  Edit3,
  Users,
  HardDrive,
  File,
  Download,
  Info
} from "lucide-react";

// ดึงฟังก์ชันช่วยดาวน์โหลดจาก Contract Actions มาใช้ร่วมกัน
import { getDownloadUrl } from "../../contracts/actions";

export default async function PlanningDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  // 1. ดึงข้อมูลแผนงาน และ รายการย่อย
  const plan = await prisma.tb_planning.findUnique({
    where: { pl_aid: BigInt(id) },
    include: { items: { where: { is_deleted: 0 } } }
  });

  if (!plan || plan.is_deleted === 1) notFound();

  // 2. ดึงข้อมูลสัญญาต้นทาง (ถ้ามี)
  let sourceContract = null;
  let refCommittees: any[] = [];
  let refFiles: any[] = [];

  if (plan.ref_contract_id) {
    sourceContract = await prisma.tb_contract.findUnique({
      where: { ct_aid: plan.ref_contract_id }
    });

    // Task 3.8: ดึงข้อมูลกรรมการจากสัญญาต้นทาง
    refCommittees = await prisma.tb_committees.findMany({
      where: { 
        base_id: plan.ref_contract_id, 
        base_type: 'CON', 
        is_deleted: 0 
      },
      orderBy: { created_at: 'asc' }
    });

    // Task 3.8: ดึงข้อมูลไฟล์จากสัญญาต้นทาง
    refFiles = await prisma.tb_files.findMany({
      where: { 
        base_id: plan.ref_contract_id, 
        base_type: 'CON', 
        is_deleted: 0 
      },
      orderBy: { created_at: 'desc' }
    });
  }

  // 3. ดึงข้อมูลประวัติการติดตามสถานะ (Tracking Records)
  const trackingRecords = await prisma.tb_tracking.findMany({
    where: { 
      base_id: BigInt(id), 
      base_type: 'PLA', 
      is_deleted: 0 
    },
    orderBy: { trk_date: 'desc' }
  });

  // คำนวณยอดรวมงบประมาณ
  const totalBudget = plan.items.reduce((sum, item) => sum + Number(item.pli_budget || 0), 0);

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
      
      {/* --- Navigation & Actions --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Link href="/planning" className="flex items-center gap-2 text-gray-500 hover:text-emerald-500 transition-all group">
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

      <div className="bg-gray-900 rounded-[3rem] border border-gray-800 shadow-2xl overflow-hidden relative">
        <div className="h-2 w-full bg-gradient-to-r from-emerald-500 to-teal-600"></div>

        <div className="p-10 md:p-12 space-y-16">
          
          {/* --- Section 1: Header --- */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-emerald-500/10 text-emerald-400 text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-500/20">
                  BUDGET YEAR {plan.pl_year}
                </span>
                <span className="text-gray-600 text-xs font-mono tracking-tighter">PLAN_ID: {plan.pl_aid.toString()}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6 italic">{plan.pl_name}</h1>
              
              {sourceContract && (
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                  <LinkIcon size={14} className="text-emerald-500" />
                  <span className="text-xs text-gray-400 font-medium">คัดลอกข้อมูลจากสัญญา:</span>
                  <Link href={`/contracts/${sourceContract.ct_aid}`} className="text-xs text-emerald-400 hover:text-white font-bold hover:underline transition-all">
                    {sourceContract.ct_number} - {sourceContract.ct_name.substring(0, 40)}...
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-black/40 p-8 rounded-[2rem] border border-gray-800 min-w-[280px] backdrop-blur-md">
               <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-4">Current Status</p>
               <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${plan.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]' : plan.status === 'COMPLETED' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                  <span className="text-2xl font-bold text-white tracking-tight uppercase italic">{plan.status}</span>
               </div>
            </div>
          </div>

          {/* --- Section 2: Budget Items --- */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <BadgeDollarSign className="text-emerald-500" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white italic tracking-tight uppercase">งบประมาณที่จัดสรร</h3>
            </div>

            <div className="bg-black/40 rounded-[2.5rem] border border-gray-800 overflow-hidden shadow-2xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-800/50 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">
                  <tr>
                    <th className="px-10 py-7">ITEM_TYPE</th>
                    <th className="px-10 py-7">DESCRIPTION</th>
                    <th className="px-10 py-7 text-right">BUDGET (THB)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {plan.items.map((item) => (
                    <tr key={item.pli_aid.toString()} className="group hover:bg-emerald-500/5 transition-all">
                      <td className="px-10 py-8 font-black text-white italic">
                        <div className="flex items-center gap-3">
                          <Briefcase size={16} className="text-emerald-500" />
                          {item.pli_type}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-gray-500 group-hover:text-gray-300 transition-colors">{item.pli_description}</td>
                      <td className="px-10 py-8 text-right font-mono font-black text-2xl text-white tracking-tighter">
                        {Number(item.pli_budget || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                  {plan.items.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-10 py-12 text-center text-gray-500 italic text-xs">
                        ยังไม่มีรายการงบประมาณ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="bg-emerald-900/10 p-8 flex justify-between items-center border-t border-emerald-900/20">
                 <p className="text-emerald-500/50 text-xs font-black uppercase tracking-widest">Total Allocated Budget</p>
                 <p className="text-emerald-400 text-4xl font-mono font-black tracking-tighter">
                    {totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                 </p>
              </div>
            </div>
          </div>

          {/* --- Task 3.8: Reference Data Section (Only show if created from contract) --- */}
          {sourceContract && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* คณะกรรมการอ้างอิง */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                  <Users className="text-emerald-500/50" size={20} />
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest italic">คณะกรรมการ (อ้างอิงจากสัญญา)</h4>
                </div>
                <div className="space-y-3">
                  {refCommittees.map((member) => (
                    <div key={member.cmit_aid.toString()} className="flex items-center gap-4 p-4 bg-white/[0.01] border border-white/5 rounded-2xl opacity-60 hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[10px] text-emerald-500 font-bold border border-gray-700 uppercase">
                        {member.cmit_name?.substring(0, 1) || 'U'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{member.cmit_name}</p>
                        <p className="text-[9px] text-gray-500 uppercase font-medium">{member.cmit_position}</p>
                      </div>
                    </div>
                  ))}
                  {refCommittees.length === 0 && <p className="text-xs text-gray-600 italic px-2">ไม่พบรายชื่อกรรมการในสัญญาต้นทาง</p>}
                </div>
              </div>

              {/* เอกสารอ้างอิง */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                  <HardDrive className="text-emerald-500/50" size={20} />
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest italic">เอกสารแนบ (อ้างอิงจากสัญญา)</h4>
                </div>
                <div className="space-y-3">
                  {refFiles.map(async (file) => {
                    const downloadUrl = await getDownloadUrl(file.file_path);
                    return (
                      <div key={file.file_aid.toString()} className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-2xl group opacity-70 hover:opacity-100 transition-all">
                        <div className="flex items-center gap-4">
                          <File size={16} className="text-emerald-500/50 group-hover:text-emerald-400" />
                          <div>
                            <p className="text-[11px] font-bold text-white group-hover:text-emerald-400 transition-colors">{file.file_name}</p>
                            <p className="text-[9px] text-gray-500 uppercase font-mono italic">Source: Contract Storage</p>
                          </div>
                        </div>
                        <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-600 hover:text-emerald-500 transition-colors">
                          <Download size={14} />
                        </a>
                      </div>
                    );
                  })}
                  {refFiles.length === 0 && <p className="text-xs text-gray-600 italic px-2">ไม่พบเอกสารแนบในสัญญาต้นทาง</p>}
                </div>
              </div>

            </div>
          )}

          {/* 💡 --- Section 3: Tracking & Progress (Phase 4) --- 💡 */}
          <div className="pt-10 border-t border-gray-800">
             <div className="mb-8">
                <h3 className="text-2xl font-black text-[#0EA5E9] italic tracking-tight uppercase">Progress Tracking</h3>
                <p className="text-gray-500 text-xs font-mono mt-1">อัปเดตและติดตามความคืบหน้าของการเบิกจ่ายและสถานะแผนงาน</p>
             </div>
             
             {/* เรียกใช้งาน Polymorphic Component */}
             <TrackingForm 
               baseId={id} 
               baseType="PLA" 
               records={trackingRecords} 
             />
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-center gap-3 pt-10 border-t border-gray-800/50 opacity-20 hover:opacity-50 transition-opacity">
            <Info size={12} className="text-white" />
            <p className="text-[9px] text-white font-black uppercase tracking-[0.5em]">Planning Reference Module // Phase 4 Active</p>
          </div>

        </div>
      </div>
    </div>
  );
}
