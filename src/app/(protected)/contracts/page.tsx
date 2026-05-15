import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import { FileText, Search, Plus, Eye, Edit3, Calendar, Filter } from "lucide-react";
import DeleteContractButton from "../../../components/DeleteContractButton";

export default async function ContractsListPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { q, status } = await searchParams;
  const searchQuery = q || "";
  const statusFilter = status || "";

  const contracts = await prisma.tb_contract.findMany({
    where: {
      is_deleted: 0,
      ...(searchQuery && { OR: [{ ct_number: { contains: searchQuery } }, { ct_name: { contains: searchQuery } }] }),
      ...(statusFilter && { contract_status: statusFilter }),
    },
    orderBy: { created_at: "desc" },
  });

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return date.toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700 text-slate-800 space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 italic tracking-tight uppercase">
            <FileText className="w-8 h-8 text-[#EB005D]" />
            Contract <span className="text-[#EB005D]">Management</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium tracking-widest text-[10px] uppercase">
            ระบบบริหารจัดการข้อมูลสัญญา (พบข้อมูลทั้งหมด {contracts.length} รายการ)
          </p>
        </div>
        <Link href="/contracts/new" className="flex items-center gap-2 bg-[#EB005D] hover:bg-pink-600 text-white px-6 py-3 rounded-xl transition-all font-black text-sm uppercase tracking-widest shadow-lg shadow-pink-500/30 active:scale-95">
          <Plus size={18} /> Add New Contract
        </Link>
      </div>

      <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm">
        <form className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" name="q" defaultValue={searchQuery} placeholder="ค้นหาจากเลขที่สัญญา หรือ ชื่อโครงการ..." className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-800 focus:border-[#EB005D] focus:ring-1 focus:ring-[#EB005D] outline-none transition-all text-sm shadow-inner" />
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Filter size={16} /></div>
            <select name="status" defaultValue={statusFilter} className="w-full md:w-48 bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-slate-800 focus:border-[#EB005D] outline-none transition-all text-sm appearance-none cursor-pointer shadow-inner font-bold">
              <option value="">ทุกสถานะ (All)</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
          <button type="submit" className="bg-slate-800 hover:bg-[#EB005D] text-white px-8 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest shadow-md">
            ค้นหา
          </button>
          {(searchQuery || statusFilter) && (
            <Link href="/contracts" className="flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 px-6 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest border border-slate-200">
              ล้างค่า
            </Link>
          )}
        </form>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden relative">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#EB005D] to-pink-400"></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Ref Number</th>
                <th className="px-8 py-5">Project Details</th>
                <th className="px-8 py-5">Duration</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="inline-flex flex-col items-center justify-center opacity-50">
                      <FileText size={48} className="text-slate-400 mb-4" />
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No Contracts Found</p>
                      <p className="text-slate-400 text-[10px] mt-1">ไม่พบข้อมูลสัญญาที่ตรงกับเงื่อนไข</p>
                    </div>
                  </td>
                </tr>
              ) : (
                contracts.map((contract) => (
                  <tr key={contract.ct_aid} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="font-bold text-slate-800 font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                        {contract.ct_number}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-slate-800 font-bold truncate max-w-xs">{contract.ct_name}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                        Coordinator: {contract.coordinator_name}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className="flex items-center gap-2 text-xs font-medium text-emerald-600"><Calendar size={12} /> {formatDate(contract.start_date)}</span>
                        <span className="flex items-center gap-2 text-xs font-medium text-[#EB005D]"><Calendar size={12} /> {formatDate(contract.end_date)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        contract.contract_status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        contract.contract_status === 'COMPLETED' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        'bg-orange-50 text-orange-600 border border-orange-100'
                      }`}>
                        {contract.contract_status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/contracts/${contract.ct_aid}`} className="p-2.5 bg-slate-100 hover:bg-[#38BDF8] text-slate-500 hover:text-white rounded-xl transition-all shadow-sm" title="View Details"><Eye size={16} /></Link>
                        <Link href={`/contracts/${contract.ct_aid}/edit`} className="p-2.5 bg-slate-100 hover:bg-amber-500 text-slate-500 hover:text-white rounded-xl transition-all shadow-sm" title="Edit Contract"><Edit3 size={16} /></Link>
                        <DeleteContractButton id={contract.ct_aid.toString()} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50/50 p-5 border-t border-slate-100 flex justify-between items-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">CTMNG System • Datagrid View</p>
        </div>
      </div>
    </div>
  );
}
