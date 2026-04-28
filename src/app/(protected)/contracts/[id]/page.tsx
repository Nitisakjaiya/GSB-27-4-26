import { prisma } from "../../../../lib/prisma";
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Calendar, 
  BadgeDollarSign, 
  Briefcase,
  ShieldCheck,
  Users,
  Plus,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { addCommittee, deleteCommittee } from "../actions";

export default async function ContractDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  
  // 1. แกะค่า ID ออกมาจาก Promise
  const { id } = await params;

  // 2. ดึงข้อมูลสัญญาและรายการย่อย
  const contract = await prisma.tb_contract.findUnique({
    where: { ct_aid: BigInt(id) },
    include: { items: true }
  });

  // 3. ดึงรายชื่อกรรมการที่ผูกกับสัญญานี้ (base_type: 'CON') และยังไม่ถูกลบ
  const committees = await prisma.tb_committees.findMany({
    where: { 
      base_id: BigInt(id),
      base_type: 'CON',
      is_deleted: 0
    },
    orderBy: { created_at: 'asc' }
  });

  if (!contract || contract.is_deleted === 1) {
    notFound();
  }

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- ปุ่มย้อนกลับ --- */}
      <Link 
        href="/dashboard" 
        className="flex items-center gap-2 text-gray-500 hover:text-[#38BDF8] mb-8 transition-all group w-fit"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        <span className="text-sm font-medium">กลับไปหน้าภาพรวมระบบ</span>
      </Link>

      <div className="bg-gray-900 rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden relative mb-12">
        <div className="h-2 w-full bg-gradient-to-r from-[#0EA5E9] to-blue-700"></div>

        <div className="p-10 md:p-12">
          
          {/* --- ส่วนหัวข้อสัญญา --- */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-5">
                 <span className="bg-[#0EA5E9]/10 text-[#38BDF8] text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-[#38BDF8]/20">
                  {contract.category_code}
                </span>
                <span className="text-gray-600 text-xs font-mono">SYSTEM_ID: {contract.ct_aid.toString()}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
                {contract.ct_name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-400">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                  <FileText size={16} className="text-[#38BDF8]" />
                  <span className="text-sm font-medium">เลขที่สัญญา: <b className="text-gray-200">{contract.ct_number}</b></span>
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 p-8 rounded-[2rem] border border-gray-800 min-w-[280px] backdrop-blur-md">
               <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-4">Current Status</p>
               <div className="flex items-center gap-4">
                  <div className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                  </div>
                  <span className="text-2xl font-bold text-white tracking-tight">เปิดใช้งานปกติ</span>
               </div>
            </div>
          </div>

          {/* --- รายละเอียดผู้รับผิดชอบ --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14 border-b border-gray-800 pb-14">
            <div className="p-8 bg-white/[0.03] rounded-[2rem] border border-white/5 shadow-inner">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-[#0EA5E9]/20 rounded-2xl">
                  <User className="text-[#38BDF8]" size={28} />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase font-black tracking-widest mb-1">ผู้ประสานงานโครงการ</p>
                  <p className="text-2xl text-white font-bold tracking-tight">{contract.coordinator_name}</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white/[0.03] rounded-[2rem] border border-white/5 shadow-inner">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-[#0EA5E9]/20 rounded-2xl">
                  <Calendar className="text-[#38BDF8]" size={28} />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase font-black tracking-widest mb-1">วันที่เริ่มบันทึกระบบ</p>
                  <p className="text-2xl text-white font-bold tracking-tight">
                    {contract.created_at.toLocaleDateString('th-TH', { 
                      year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- ส่วนจัดการคณะกรรมการ (Task 2.7) --- */}
          <div className="mb-14">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[#0EA5E9]/10 rounded-lg">
                  <Users className="text-[#0EA5E9]" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight italic">คณะกรรมการตรวจรับพัสดุ</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {committees.map((member) => (
                <div 
                  key={member.cmit_aid.toString()} 
                  className="flex items-center justify-between p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-[#0EA5E9]/40 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-[#38BDF8] font-bold border border-gray-700">
                      {member.cmit_name?.substring(0, 1)}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{member.cmit_name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{member.cmit_position || 'กรรมการ'}</p>
                    </div>
                  </div>
                  <form action={deleteCommittee}>
                    <input type="hidden" name="cmit_aid" value={member.cmit_aid.toString()} />
                    <input type="hidden" name="base_id" value={id} />
                    <button type="submit" className="text-gray-600 hover:text-red-500 p-2 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              ))}
            </div>

            {/* ฟอร์มเพิ่มกรรมการใหม่ */}
            <form action={addCommittee} className="bg-black/40 p-6 rounded-3xl border border-dashed border-gray-800 flex flex-col md:flex-row gap-4">
              <input type="hidden" name="base_id" value={id} />
              <div className="flex-1">
                <input 
                  name="cmit_name" 
                  placeholder="ชื่อ-นามสกุล คณะกรรมการ" 
                  required 
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#0EA5E9] outline-none transition-all text-sm"
                />
              </div>
              <div className="w-full md:w-64">
                <select 
                  name="cmit_position" 
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#0EA5E9] outline-none transition-all text-sm"
                >
                  <option value="กรรมการ">กรรมการ</option>
                  <option value="ประธานกรรมการ">ประธานกรรมการ</option>
                  <option value="กรรมการและเลขานุการ">กรรมการและเลขานุการ</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl px-8 py-3 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                <span className="text-sm">เพิ่มรายชื่อ</span>
              </button>
            </form>
          </div>

          {/* --- ตารางรายการย่อย --- */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gray-800 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[#0EA5E9]/10 rounded-lg">
                  <BadgeDollarSign className="text-[#0EA5E9]" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight italic">งบประมาณและรายการอุปกรณ์</h3>
              </div>
              <span className="text-gray-500 text-xs font-medium uppercase tracking-widest">Total {contract.items.length} Items</span>
            </div>

            <div className="bg-black/50 rounded-[2rem] border border-gray-800 overflow-hidden shadow-inner">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-800/80 text-[10px] text-gray-400 uppercase tracking-[0.25em] font-black">
                  <tr>
                    <th className="px-10 py-6">ประเภท</th>
                    <th className="px-10 py-6">รายละเอียดข้อตกลง / บริการ</th>
                    <th className="px-10 py-6 text-right">จำนวนเงิน (บาท)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {contract.items.map((item) => (
                    <tr key={item.item_autoid.toString()} className="group hover:bg-[#0EA5E9]/5 transition-colors">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-[#0EA5E9]/20 transition-colors">
                            <Briefcase size={14} className="text-[#38BDF8]" />
                          </div>
                          <span className="font-bold text-white text-base tracking-tight">{item.item_type}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed">
                        {item.item_agreement}
                      </td>
                      <td className="px-10 py-8 text-right">
                        <span className="text-2xl font-black text-white font-mono tracking-tighter">
                          {Number(item.item_cost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
