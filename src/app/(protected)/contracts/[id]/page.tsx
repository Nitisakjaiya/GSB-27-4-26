import { prisma } from "../../../../lib/prisma";
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Calendar, 
  BadgeDollarSign, 
  Briefcase,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// กำหนด Type ของ params ให้เป็น Promise ตามมาตรฐาน Next.js 15/16
export default async function ContractDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  
  // 1. แกะค่า ID ออกมาจาก Promise (Unwrap params)
  const { id } = await params;

  // 2. ดึงข้อมูลสัญญาตัวจริง พร้อมรายการย่อย (Items)
  const contract = await prisma.tb_contract.findUnique({
    where: { 
      ct_aid: BigInt(id) 
    },
    include: { 
      items: true 
    }
  });

  // 3. เช็คความปลอดภัย: ถ้าไม่เจอ หรือถูก Soft Delete (is_deleted: 1) ให้ขึ้น 404
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

      <div className="bg-gray-900 rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden relative">
        {/* แถบสีตกแต่งด้านบน (Sky Blue Gradient) */}
        <div className="h-2 w-full bg-gradient-to-r from-[#0EA5E9] to-blue-700"></div>

        <div className="p-10 md:p-12">
          
          {/* --- ส่วนหัวข้อสัญญา (Header Section) --- */}
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
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                  <ShieldCheck size={16} className="text-green-500" />
                  <span className="text-sm font-medium text-gray-200 font-mono italic">CTMNG_VERIFIED</span>
                </div>
              </div>
            </div>
            
            {/* กล่องสถานะ (Status Box) */}
            <div className="bg-black/40 p-8 rounded-[2rem] border border-gray-800 min-w-[280px] backdrop-blur-md">
               <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-4">Current Status</p>
               <div className="flex items-center gap-4">
                  <div className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                  </div>
                  <span className="text-2xl font-bold text-white tracking-tight">เปิดใช้งานปกติ</span>
               </div>
               <p className="text-xs text-gray-500 mt-3 italic font-light">* ข้อมูลถูกดึงจาก SQL Server ล่าสุด</p>
            </div>
          </div>

          {/* --- รายละเอียดผู้รับผิดชอบ (Info Cards) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
            <div className="p-8 bg-white/[0.03] rounded-[2rem] border border-white/5 hover:border-[#0EA5E9]/40 transition-all group shadow-inner">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-[#0EA5E9]/20 rounded-2xl group-hover:scale-110 transition-transform">
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

          {/* --- ตารางรายการย่อย (Items Master-Detail) --- */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gray-800 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[#0EA5E9]/10 rounded-lg">
                  <BadgeDollarSign className="text-[#0EA5E9]" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight italic">งบประมาณและรายการอุปกรณ์</h3>
              </div>
              <span className="text-gray-500 text-xs font-medium">จำนวน {contract.items.length} รายการ</span>
            </div>

            <div className="bg-black/50 rounded-[2rem] border border-gray-800 overflow-hidden shadow-inner">
              <table className="w-full text-left">
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
                          <span className="font-bold text-white text-lg tracking-tight">{item.item_type}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed text-sm">
                        {item.item_agreement}
                      </td>
                      <td className="px-10 py-8 text-right">
                        <span className="text-3xl font-black text-white font-mono tracking-tighter">
                          {Number(item.item_cost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>
                  ))}
                  
                  {contract.items.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-10 py-16 text-center text-gray-600 font-medium italic">
                        --- ไม่พบข้อมูลรายการงบประมาณย่อย ---
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Footer Summary (Optional) */}
            <div className="flex justify-end p-4">
               <p className="text-gray-600 text-[10px] uppercase font-bold tracking-widest">
                  End of Contract Details Report
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
