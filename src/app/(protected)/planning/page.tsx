import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import { DeleteButton } from "./DeleteButton"; 
import { deletePlanning } from "./actions"; 
import { auth } from "../../../auth";
import { 
  FolderKanban, Calendar, Activity, Eye, Plus, Search, BadgeDollarSign, Bell
} from "lucide-react";

export default async function PlanningListPage() {
  const session = await auth();
  const userRole = session?.user?.role;

  const plans = await prisma.tb_planning.findMany({
    where: { is_deleted: 0 },
    include: { items: { where: { is_deleted: 0 } } },
    orderBy: [{ pl_year: 'desc' }, { created_at: 'desc' }]
  });

  const totalPlans = plans.length;
  const activePlans = plans.filter(p => p.status === 'ACTIVE').length;
  const draftPlans = plans.filter(p => p.status === 'DRAFT').length;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-pink-100 rounded-xl text-[#EB005D]">
              <FolderKanban size={28} />
            </div>
            <h1 className="text-4xl font-black text-slate-800 italic tracking-tight uppercase">Planning List</h1>
          </div>
          <p className="text-sm text-slate-500 font-mono uppercase tracking-widest ml-14">GSB Contract Management System</p>
        </div>

        <Link href="/planning/new" className="flex items-center gap-2 bg-[#EB005D] hover:bg-pink-600 text-white px-6 py-3 rounded-2xl transition-all font-black shadow-lg shadow-pink-500/30 active:scale-95">
          <Plus size={18} /> สร้างแผนงานใหม่
        </Link>
      </div>

      {/* Stats Cards (สีขาว เงาฟุ้ง) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Plans', val: totalPlans, icon: FolderKanban, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Active Plans', val: activePlans, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Draft Plans', val: draftPlans, icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-md border border-white/50 rounded-[2.5rem] p-6 flex items-center gap-6 shadow-sm">
            <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}><stat.icon size={24} /></div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Container (สีขาว Glassmorphism) */}
      <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-xl shadow-slate-200/50 overflow-hidden relative">
        <div className="h-2 w-full bg-gradient-to-r from-[#EB005D] to-pink-400"></div>
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="ค้นหาชื่อแผนงาน..." className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-700 focus:border-pink-500 outline-none transition-all shadow-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">
              <tr>
                <th className="px-8 py-6">FY Year</th>
                <th className="px-8 py-6">Plan Name</th>
                <th className="px-8 py-6 text-right">Total Budget</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {plans.map((plan) => {
                const totalBudget = plan.items.reduce((sum, item) => sum + Number(item.pli_budget || 0), 0);
                return (
                  <tr key={plan.pl_aid.toString()} className="group hover:bg-white transition-colors">
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center justify-center px-3 py-1 bg-slate-100 text-slate-600 rounded-lg font-mono font-bold text-xs">{plan.pl_year}</div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-800 text-base truncate max-w-md">{plan.pl_name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">ID: {plan.pl_aid.toString()}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 text-pink-600 font-mono font-black text-lg">
                        {totalBudget > 0 && <BadgeDollarSign size={14} className="opacity-50" />}
                        {totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          plan.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          plan.status === 'WAITING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {plan.status || 'DRAFT'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center items-center gap-2">
                        {userRole === 'MANAGER' && plan.status === 'WAITING' && (
                          <div className="relative group/notify mr-2">
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>
                            <Bell size={18} className="text-orange-500" />
                          </div>
                        )}
                        <Link href={`/planning/${plan.pl_aid}`} className="p-2 bg-slate-100 hover:bg-[#EB005D] text-slate-400 hover:text-white rounded-xl transition-all shadow-sm active:scale-95"><Eye size={18} /></Link>
                        <form action={deletePlanning.bind(null, plan.pl_aid.toString())}><DeleteButton /></form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
