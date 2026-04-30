import { prisma } from "../../../../../lib/prisma";
import { notFound } from "next/navigation";
import { 
  updateContract, 
  addContractItem, 
  updateContractItem, 
  deleteContractItem 
} from "../../actions";
import Link from "next/link";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Briefcase, 
  LayoutDashboard,
  Info,
  Calendar,
  Clock
} from "lucide-react";

export default async function EditContractPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  // 1. ดึงข้อมูลสัญญาพร้อมรายการย่อย (เฉพาะที่ยังไม่ถูกลบ)
  const contract = await prisma.tb_contract.findUnique({
    where: { ct_aid: BigInt(id) },
    include: { 
      items: { 
        where: { is_deleted: 0 },
        orderBy: { item_autoid: 'asc' }
      } 
    }
  });

  if (!contract || contract.is_deleted === 1) notFound();

  // 🚀 Helper: แปลง Date object เป็น String format "YYYY-MM-DD" เพื่อใช้เป็น defaultValue ใน input type="date"
  const formatDateForInput = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
      
      {/* --- ส่วนนำทาง (Navigation) --- */}
      <div className="flex justify-between items-center">
        <Link 
          href={`/contracts/${id}`} 
          className="flex items-center gap-2 text-gray-500 hover:text-[#EB005D] transition-all w-fit group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold font-mono tracking-tighter uppercase">Back to Details</span>
        </Link>
        <div className="flex items-center gap-2 text-gray-600">
          <LayoutDashboard size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EB005D]">Contract Editor Mode</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- ฝั่งซ้าย: แก้ไขข้อมูลหลัก (Main Info) --- */}
        <div className="lg:col-span-4">
          <div className="bg-gray-900 rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden sticky top-8">
            {/* 🚀 ปรับแถบสีด้านบนให้เป็นโทนชมพูออมสิน */}
            <div className="h-2 w-full bg-gradient-to-r from-[#EB005D] to-pink-700"></div>
            
            <form action={updateContract} className="p-8 space-y-7">
              <input type="hidden" name="id" value={id} />
              
              <div className="flex items-center gap-3 border-b border-gray-800 pb-5">
                <div className="p-2 bg-[#EB005D]/10 rounded-lg">
                  <Info className="text-[#EB005D]" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white italic uppercase tracking-tight">Main Details</h2>
                  <p className="text-[10px] text-gray-500 font-mono">ID: {contract.ct_aid.toString()}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category Code</label>
                  <input name="category_code" defaultValue={contract.category_code ?? ""} className="w-full bg-black/50 border border-gray-800 rounded-2xl px-5 py-3 text-white focus:border-[#EB005D] outline-none transition-all text-sm shadow-inner" required />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Reference Number</label>
                  <input name="ct_number" defaultValue={contract.ct_number ?? ""} className="w-full bg-black/50 border border-gray-800 rounded-2xl px-5 py-3 text-white focus:border-[#EB005D] outline-none transition-all text-sm font-mono shadow-inner" required />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Project Name</label>
                  <textarea name="ct_name" defaultValue={contract.ct_name ?? ""} rows={4} className="w-full bg-black/50 border border-gray-800 rounded-2xl px-5 py-3 text-white focus:border-[#EB005D] outline-none transition-all text-sm resize-none shadow-inner leading-relaxed" required />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Lead Coordinator</label>
                  <input name="coordinator_name" defaultValue={contract.coordinator_name ?? ""} className="w-full bg-black/50 border border-gray-800 rounded-2xl px-5 py-3 text-white focus:border-[#EB005D] outline-none transition-all text-sm shadow-inner" required />
                </div>

                {/* วันที่เริ่ม และ วันสิ้นสุดสัญญา */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-800/50">
                   <div className="space-y-2">
                     <label className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">
                       <Calendar size={12} /> Start Date
                     </label>
                     <input 
                       type="date"
                       name="start_date" 
                       defaultValue={formatDateForInput(contract.start_date)}
                       className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-all text-xs shadow-inner color-scheme-dark" 
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="flex items-center gap-1.5 text-[10px] font-black text-[#EB005D] uppercase tracking-widest ml-1">
                       <Clock size={12} /> End Date
                     </label>
                     <input 
                       type="date"
                       name="end_date" 
                       defaultValue={formatDateForInput(contract.end_date)}
                       className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-[#EB005D] outline-none transition-all text-xs shadow-inner color-scheme-dark" 
                     />
                   </div>
                </div>

              </div>

              {/* 🚀 ปรับปุ่มเซฟหลักให้เป็นสีชมพู */}
              <button 
                type="submit" 
                className="w-full bg-[#EB005D] hover:bg-[#c4004e] text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-pink-500/20 active:scale-95"
              >
                <Save size={20} />
                <span className="uppercase tracking-widest">บันทึกข้อมูลหลัก</span>
              </button>
            </form>
          </div>
        </div>

        {/* --- ฝั่งขวา: จัดการงบประมาณ (Items Management) --- */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900/50 p-6 rounded-[2rem] border border-gray-800">
            <div>
              <h3 className="text-3xl font-black text-white italic tracking-tighter">Budget & Items</h3>
              <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mt-1">Manage sub-contracts and equipment</p>
            </div>
            <div className="px-6 py-2 bg-[#EB005D]/10 border border-[#EB005D]/20 rounded-2xl text-[#EB005D] text-xs font-black uppercase tracking-tighter">
              {contract.items.length} Active Records
            </div>
          </div>

          {/* รายการที่มีอยู่ (Editable List) */}
          <div className="space-y-5">
            {contract.items.map((item) => (
              <form 
                key={item.item_autoid.toString()} 
                action={updateContractItem} 
                className="bg-gray-900/40 p-7 rounded-[2.5rem] border border-white/5 hover:border-[#EB005D]/30 transition-all grid grid-cols-1 md:grid-cols-12 gap-5 items-end group/row shadow-xl"
              >
                <input type="hidden" name="item_autoid" value={item.item_autoid.toString()} />
                <input type="hidden" name="contractId" value={id} />
                
                <div className="md:col-span-3 space-y-2">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] ml-1">Item Category</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" size={14} />
                    <input name="item_type" defaultValue={item.item_type ?? ""} className="w-full bg-black/60 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white text-xs font-bold focus:border-[#EB005D] outline-none transition-all" />
                  </div>
                </div>

                <div className="md:col-span-5 space-y-2">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] ml-1">Agreement Details</label>
                  <input name="item_agreement" defaultValue={item.item_agreement ?? ""} className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-3 text-white text-xs focus:border-[#EB005D] outline-none transition-all" />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] ml-1 text-right block">Cost (THB)</label>
                  <input name="item_cost" type="number" step="0.01" defaultValue={item.item_cost?.toString() ?? "0"} className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-3 text-white text-xs text-right focus:border-[#EB005D] outline-none transition-all font-mono font-bold" />
                </div>
                
                <div className="md:col-span-2 flex gap-2">
                  {/* ปุ่มบันทึกรายการรายแถว (Save Item) */}
                  <button 
                    type="submit" 
                    className="flex-1 bg-[#EB005D]/10 hover:bg-[#EB005D] text-[#EB005D] hover:text-white p-3 rounded-xl border border-[#EB005D]/20 transition-all flex items-center justify-center group/btn shadow-lg"
                    title="บันทึกรายการนี้"
                  >
                    <Save size={18} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                  
                  {/* ปุ่มลบรายการ (Delete Item) */}
                  <button 
                    formAction={deleteContractItem} 
                    className="p-3 bg-red-500/5 hover:bg-red-500 text-gray-700 hover:text-white rounded-xl border border-transparent hover:border-red-500/50 transition-all flex items-center justify-center shadow-lg"
                    title="ลบรายการนี้"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </form>
            ))}
          </div>

          {/* ฟอร์มเพิ่มรายการใหม่ (Add New Item Section) */}
          <div className="bg-[#EB005D]/[0.02] p-10 rounded-[3rem] border border-dashed border-[#EB005D]/20 shadow-inner">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-[#EB005D] rounded-lg shadow-lg shadow-[#EB005D]/20">
                <Plus className="text-white" size={18} />
              </div>
              <h4 className="text-sm font-black text-[#EB005D] uppercase tracking-[0.2em]">Add New Entry</h4>
            </div>

            <form action={addContractItem} className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <input type="hidden" name="contractId" value={id} />
              
              <div className="md:col-span-3 space-y-2">
                <input name="item_type" placeholder="ประเภท (เช่น MA, ซื้อใหม่)" className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 text-white text-sm focus:border-[#EB005D] outline-none transition-all shadow-inner" required />
              </div>
              
              <div className="md:col-span-6 space-y-2">
                <input name="item_agreement" placeholder="รายละเอียดของรายการ..." className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 text-white text-sm focus:border-[#EB005D] outline-none transition-all shadow-inner" required />
              </div>

              <div className="md:col-span-3">
                <button 
                  type="submit" 
                  className="w-full h-full bg-gray-800 border border-gray-700 hover:border-[#EB005D] hover:bg-[#EB005D] text-gray-300 hover:text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                >
                  <Plus size={20} />
                  <span>เพิ่มรายการ</span>
                </button>
              </div>
            </form>
          </div>
          
          <div className="text-center pt-6">
             <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.5em]">CTMNG Management System • Phase 2.5</p>
          </div>
        </div>

      </div>
    </div>
  );
}
