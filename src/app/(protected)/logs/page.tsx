import { prisma } from "../../../lib/prisma";
import { Activity, Search, Clock, FileText, Filter } from "lucide-react";
import Link from "next/link";

export default async function LogsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const searchQuery = q || "";

  // ดึงข้อมูลประวัติจาก tb_tracking (จำกัด 200 รายการล่าสุดเพื่อไม่ให้หน้าเว็บหน่วง)
  const systemLogs = await prisma.tb_tracking.findMany({
    where: {
      is_deleted: 0,
      ...(searchQuery && { trk_detail: { contains: searchQuery } }), // ค้นหาจากรายละเอียด
    },
    orderBy: { trk_date: 'desc' },
    take: 200, 
  });

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return date.toLocaleString("th-TH", { 
      year: "numeric", month: "short", day: "numeric", 
      hour: "2-digit", minute: "2-digit", second: "2-digit" 
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700 text-slate-800 space-y-8">
      
      {/* --- ส่วน Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 italic tracking-tight uppercase">
            <Activity className="w-8 h-8 text-[#EB005D]" />
            System <span className="text-[#EB005D]">Audit Logs</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium tracking-widest text-[10px] uppercase">
            ประวัติการทำรายการและบันทึกระบบ (แสดง 200 รายการล่าสุด)
          </p>
        </div>
      </div>

      {/* --- กล่องค้นหา (Search) ขาวสว่าง --- */}
      <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm">
        <form className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              name="q" 
              defaultValue={searchQuery}
              placeholder="ค้นหาประวัติการทำรายการ..." 
              className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-800 focus:border-[#EB005D] focus:ring-1 focus:ring-[#EB005D] outline-none transition-all text-sm shadow-inner" 
            />
          </div>
          <button type="submit" className="bg-slate-800 hover:bg-[#EB005D] text-white px-8 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest shadow-md">
            ค้นหา
          </button>
          {searchQuery && (
            <Link href="/logs" className="flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 px-6 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest border border-slate-200">
              ล้างค่า
            </Link>
          )}
        </form>
      </div>

      {/* --- ตารางข้อมูลสีสว่าง (GSB Theme) --- */}
      <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden relative">
        {/* แถบสีชมพูด้านบนกล่อง */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#EB005D] to-pink-400"></div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 w-20 text-center">No.</th>
                <th className="px-8 py-5">Date & Time</th>
                <th className="px-8 py-5">Activity Detail</th>
                <th className="px-8 py-5 text-center">Reference ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {systemLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="inline-flex flex-col items-center justify-center opacity-50">
                      <Activity size={48} className="text-slate-400 mb-4" />
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No Audit Logs Found</p>
                      <p className="text-slate-400 text-[10px] mt-1">ไม่พบประวัติการทำรายการในระบบ</p>
                    </div>
                  </td>
                </tr>
              ) : (
                systemLogs.map((log, index) => (
                  <tr key={log.trk_aid.toString()} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5 text-center text-slate-400 font-mono text-xs font-bold">
                      {index + 1}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-500 font-mono text-xs">
                        <Clock size={14} className="text-[#EB005D]" />
                        {formatDate(log.trk_date)}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-slate-800 font-bold text-sm">
                        {log.trk_detail}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-pink-50 text-[#EB005D] border border-pink-100">
                        <FileText size={12} />
                        ID: {log.base_id.toString()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
