import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import { DeleteButton } from "./DeleteButton"; // นำเข้า Client Component ที่เราแยกไว้
import { deletePlanning } from "./actions"; // นำเข้า Action สำหรับลบข้อมูล

import { 
  FolderKanban, 
  Calendar, 
  Activity, 
  Eye, 
  Plus, 
  Search,
  BadgeDollarSign
} from "lucide-react";

export default async function PlanningListPage() {
  // ดึงข้อมูลแผนงานทั้งหมดที่ยังไม่ถูกลบ เรียงตามปีล่าสุด และวันที่สร้าง
  const plans = await prisma.tb_planning.findMany({
    where: { is_deleted: 0 },
    include: { items: { where: { is_deleted: 0 } } },
    orderBy: [
      { pl_year: 'desc' },
      { created_at: 'desc' }
    ]
  });

  // คำนวณสถิติเบื้องต้น
  const totalPlans = plans.length;
  const activePlans = plans.filter(p => p.status === 'ACTIVE').length;
  const draftPlans = plans.filter(p => p.status === 'DRAFT').length;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
              <FolderKanban size={28} />
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tight">Planning List</h1>
          </div>
          <p className="text-sm text-gray-500 font-mono uppercase tracking-widest ml-14">
            ระบบบริหารจัดการแผนงานและงบประมาณ
          </p>
        </div>

        {/* ปุ่มสร้างแผนงานใหม่แบบ Manual */}
        <Link 
          href="/planning/new" 
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-2xl transition-all font-black shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <Plus size={18} />
          สร้างแผนงานใหม่
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-[2rem] p-6 flex items-center gap-6 shadow-inner">
          <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl"><FolderKanban size={24} /></div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Total Plans</p>
            <p className="text-3xl font-black text-white">{totalPlans}</p>
          </div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-[2rem] p-6 flex items-center gap-6 shadow-inner">
          <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl"><Activity size={24} /></div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Active Plans</p>
            <p className="text-3xl font-black text-white">{activePlans}</p>
          </div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-[2rem] p-6 flex items-center gap-6 shadow-inner">
          <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl"><Calendar size={24} /></div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Draft Plans</p>
            <p className="text-3xl font-black text-white">{draftPlans}</p>
          </div>
        </div>
      </div>

      {/* Main Table Data */}
      <div className="bg-gray-900 rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden relative">
        <div className="h-2 w-full bg-gradient-to-r from-emerald-500 to-teal-600"></div>
        
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/20">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อแผนงาน..." 
              className="w-full bg-black/50 border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-800/30 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">
              <tr>
                <th className="px-8 py-6 rounded-tl-3xl">FY Year</th>
                <th className="px-8 py-6">Plan Name</th>
                <th className="px-8 py-6 text-right">Total Budget</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-center rounded-tr-3xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {plans.map((plan) => {
                const totalBudget = plan.items.reduce((sum, item) => sum + Number(item.pli_budget || 0), 0);
                
                return (
                  <tr key={plan.pl_aid.toString()} className="group hover:bg-emerald-500/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center justify-center px-3 py-1 bg-gray-800 text-gray-300 rounded-lg font-mono font-bold text-xs">
                        {plan.pl_year}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-white text-base truncate max-w-md" title={plan.pl_name || ""}>
                        {plan.pl_name}
                      </p>
                      <p className="text-[10px] text-gray-500 font-mono mt-1">ID: {plan.pl_aid.toString()}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 text-emerald-400 font-mono font-black text-lg">
                        {totalBudget > 0 ? <BadgeDollarSign size={14} className="text-emerald-500/50" /> : null}
                        {totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          plan.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          plan.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                          'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                          {plan.status || 'DRAFT'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center items-center gap-2">
                        {/* ปุ่มดูรายละเอียด (ของเดิม) */}
                        <Link 
                          href={`/planning/${plan.pl_aid}`}
                          className="p-2 bg-gray-800/50 hover:bg-emerald-500 text-gray-400 hover:text-black rounded-xl transition-all shadow-lg active:scale-95"
                          title="ดูรายละเอียดแผนงาน"
                        >
                          <Eye size={18} />
                        </Link>

                        {/* ปุ่มลบแผนงาน (เรียกใช้ Client Component) */}
                        <form action={deletePlanning.bind(null, plan.pl_aid.toString())}>
                          <DeleteButton />
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {plans.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center">
                    <div className="inline-flex flex-col items-center justify-center text-gray-600">
                      <FolderKanban size={48} className="mb-4 opacity-20" />
                      <p className="font-bold text-lg">ยังไม่มีข้อมูลแผนงาน</p>
                      <p className="text-sm mt-1">เริ่มสร้างแผนงานใหม่จากเมนูสัญญา หรือกดสร้างใหม่ด้านบน</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
