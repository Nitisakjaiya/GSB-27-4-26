import { prisma } from "../../../lib/prisma";
import DashboardClient from "../../../components/DashboardClient";
import DashboardCharts from "../../../components/DashboardCharts";
import ExportExcelButton from "../../../components/ExportExcelButton";
import Link from "next/link";
import { 
  FileText, 
  Briefcase, 
  Clock, 
  Wallet,
  ArrowRight,
  Activity 
} from "lucide-react";

export const dynamic = 'force-dynamic'; 

export default async function DashboardPage() {
  const totalContracts = await prisma.tb_contract.count({ where: { is_deleted: 0 } });
  const totalPlans = await prisma.tb_planning.count({ where: { is_deleted: 0 } });
  const pendingPlans = await prisma.tb_planning.count({ where: { is_deleted: 0, status: 'WAITING' } });

  const budgetResult = await prisma.tb_contract_items.aggregate({ _sum: { item_cost: true }, where: { is_deleted: 0 } });
  const totalBudget = Number(budgetResult._sum.item_cost || 0);

  const statusGroups = await prisma.tb_contract.groupBy({ by: ['contract_status'], _count: { ct_aid: true }, where: { is_deleted: 0 } });
  const statusChartData = statusGroups.map(g => ({ name: g.contract_status || 'ACTIVE', value: g._count.ct_aid }));

  const budgetGroups = await prisma.tb_contract_items.groupBy({ by: ['item_type'], _sum: { item_cost: true }, where: { is_deleted: 0 } });
  const budgetChartData = budgetGroups.map(g => ({ name: g.item_type || 'ไม่ระบุ', Total: Number(g._sum.item_cost || 0) }));

  const rawExportData = await prisma.tb_contract.findMany({ where: { is_deleted: 0 }, orderBy: { created_at: 'desc' } });
  const exportExcelData = rawExportData.map(ct => ({ "เลขที่สัญญา": ct.ct_number || "-", "หมวดหมู่": ct.category_code || "-", "ชื่อโครงการ": ct.ct_name || "-", "ผู้ประสานงาน": ct.coordinator_name || "-", "สถานะสัญญา": ct.contract_status || "ACTIVE", "วันที่เริ่ม": ct.start_date ? ct.start_date.toISOString().split('T')[0] : "-", "วันหมดอายุ": ct.end_date ? ct.end_date.toISOString().split('T')[0] : "-" }));

  const recentContracts = await prisma.tb_contract.findMany({ where: { is_deleted: 0 }, orderBy: { created_at: 'desc' }, take: 10, });

  const today = new Date();
  const next30Days = new Date(new Date().setDate(today.getDate() + 30));
  const expiringSoon = await prisma.tb_contract.findMany({ where: { is_deleted: 0, contract_status: "ACTIVE", end_date: { lte: next30Days, gte: today } }, orderBy: { end_date: 'asc' }, take: 5 });

  const systemLogs = await prisma.tb_tracking.findMany({ where: { is_deleted: 0 }, orderBy: { trk_date: 'desc' }, take: 4 });

  const serializeData = (data: any) => JSON.parse(JSON.stringify(data, (key, value) => typeof value === 'bigint' ? value.toString() : value));

  const serializedRecent = serializeData(recentContracts);
  const serializedExpiring = serializeData(expiringSoon);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
      
      {/* --- ส่วน Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight italic">
            Dashboard <span className="text-[#EB005D]">Overview</span>
          </h1>
          <p className="text-sm text-slate-500 font-mono mt-2 uppercase tracking-widest">
            CTMNG • Executive Summary
          </p>
        </div>
        <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl shadow-sm">
          <p className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Live & Syncing
          </p>
        </div>
      </div>

      {/* --- ส่วน Summary Cards 4 ใบ (เปลี่ยนเป็นสีขาว) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
            <FileText size={80} className="text-blue-500" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mb-2">Total Contracts</p>
            <h2 className="text-5xl font-black text-slate-800 tracking-tighter mb-4">{totalContracts}</h2>
            <Link href="/contracts" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-500 font-bold transition-colors">
              จัดการสัญญา <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
            <Briefcase size={80} className="text-emerald-500" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em] mb-2">Active Plans</p>
            <h2 className="text-5xl font-black text-slate-800 tracking-tighter mb-4">{totalPlans}</h2>
            <Link href="/planning" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-500 font-bold transition-colors">
              จัดการแผนงาน <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
            <Clock size={80} className="text-amber-500" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.2em] mb-2">Pending Approvals</p>
            <h2 className="text-5xl font-black text-slate-800 tracking-tighter mb-4">{pendingPlans}</h2>
            <Link href="/planning" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-amber-500 font-bold transition-colors">
              รอการอนุมัติ (WAITING) <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="bg-pink-50/80 p-6 rounded-[2rem] border border-pink-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
            <Wallet size={80} className="text-[#EB005D]" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] text-[#EB005D] font-black uppercase tracking-[0.2em] mb-2">Total Value (THB)</p>
            <h2 className="text-3xl lg:text-4xl font-black text-pink-600 tracking-tighter font-mono mb-4">
              {totalBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h2>
            <span className="inline-flex items-center gap-1 text-xs text-pink-500 font-bold">
              มูลค่าจากรายการทั้งหมด
            </span>
          </div>
        </div>

      </div>

      {/* --- ส่วนเนื้อหากราฟ และ Live Feed --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        <div className="lg:col-span-2">
          {/* กราฟจะถูกเรนเดอร์จาก DashboardCharts.tsx ที่เราแก้เป็นสีขาวไปแล้ว */}
          <DashboardCharts statusData={statusChartData} budgetData={budgetChartData} />
        </div>

        {/* 🚀 System Activity Feed (เปลี่ยนเป็นสีขาว) */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-pink-50 rounded-xl"><Activity className="text-[#EB005D]" size={24} /></div>
            <h3 className="text-xl font-black text-slate-800 italic tracking-tighter">Live Audit Trail</h3>
          </div>
          
          <div className="flex-1 space-y-6">
            {systemLogs.length > 0 ? systemLogs.map((log) => (
              <div key={log.trk_aid.toString()} className="relative pl-6 border-l-2 border-slate-100">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#EB005D]"></div>
                <p className="text-xs text-slate-600 font-medium mb-1">{log.trk_detail}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-400 font-mono">{log.trk_date.toLocaleString('th-TH')}</span>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200">
                    ID: {log.base_id.toString()}
                  </span>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300">
                <Activity size={48} className="mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">No Recent Activity</p>
              </div>
            )}
          </div>
          <Link href="/contracts" className="mt-6 w-full py-3 bg-pink-50 hover:bg-[#EB005D] text-[#EB005D] hover:text-white text-xs font-black uppercase tracking-widest rounded-xl text-center transition-colors">
            View All Records
          </Link>
        </div>
      </div>

      {/* --- ส่วนเนื้อหาตาราง --- */}
      <div className="pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-xl font-black text-slate-800 italic tracking-tighter flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#EB005D] rounded-full"></span>
            Data Analytics & Recent Activities
          </h3>
          <ExportExcelButton data={exportExcelData} />
        </div>
        
        {/* ตารางจะถูกเรนเดอร์จาก DashboardClient.tsx ที่เราแก้เป็นสีขาวไปแล้ว */}
        <DashboardClient 
          totalContracts={totalContracts} 
          recentContracts={serializedRecent} 
          expiringSoon={serializedExpiring} 
        />
      </div>

    </div>
  );
}
