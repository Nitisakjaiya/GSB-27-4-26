import { prisma } from "../../../../../lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Save, Plus, Trash2, Briefcase, LayoutDashboard, Info, Send
} from "lucide-react";
import { 
  updatePlanning, 
  addPlanningItem, 
  updatePlanningItem, 
  deletePlanningItem,
  sendPlanForApproval,
  approvePlan, // 🚀 นำเข้าฟังก์ชันอนุมัติ
  rejectPlan   // 🚀 นำเข้าฟังก์ชันตีกลับ
} from "../../actions";

export default async function EditPlanningPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const plan = await prisma.tb_planning.findUnique({
    where: { pl_aid: BigInt(id) },
    include: { items: { where: { is_deleted: 0 }, orderBy: { pli_aid: 'asc' } } }
  });

  if (!plan || plan.is_deleted === 1) notFound();

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 space-y-10">
      
      {/* --- ส่วนหัว --- */}
      <div className="flex justify-between items-center">
        <Link href={`/planning`} className="flex items-center gap-2 text-gray-500 hover:text-emerald-500 transition-all w-fit group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold font-mono tracking-tighter uppercase">Back to Plans</span>
        </Link>
        <div className="flex items-center gap-2 text-gray-600">
          <LayoutDashboard size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Plan Editor Mode</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* ========================================== */}
        {/* ฝั่งซ้าย: ข้อมูลแผนหลัก & ปุ่ม Action ต่างๆ */}
        {/* ========================================== */}
        <div className="lg:col-span-4">
          
          {/* 🚀 ใช้ sticky ครอบทั้งหมดตรงนี้ เพื่อให้เลื่อนไปพร้อมกันโดยไม่ทับกัน */}
          <div className="sticky top-8 space-y-6">
            
            {/* กล่องที่ 1: ข้อมูลแผนงาน (ฟอร์มบันทึกร่าง) */}
            <div className="bg-gray-900 rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden">
              <div className="h-2 w-full bg-gradient-to-r from-emerald-400 to-teal-600"></div>
              
              <form action={updatePlanning} className="p-8 space-y-7">
                <input type="hidden" name="id" value={id} />
                
                <div className="flex items-center gap-3 border-b border-gray-800 pb-5">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Info className="text-emerald-500" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white italic uppercase tracking-tight">Plan Details</h2>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Plan Name</label>
                    <textarea name="pl_name" defaultValue={plan.pl_name ?? ""} rows={4} className="w-full bg-black/50 border border-gray-800 rounded-2xl px-5 py-3 text-white focus:border-emerald-500 outline-none transition-all text-sm resize-none shadow-inner" required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Budget Year</label>
                      <input name="pl_year" type="number" defaultValue={plan.pl_year ?? ""} className="w-full bg-black/50 border border-gray-800 rounded-2xl px-5 py-3 text-white focus:border-emerald-500 outline-none transition-all text-sm font-mono shadow-inner text-center" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Current Status</label>
                      <div className={`w-full border rounded-2xl px-5 py-3 text-sm shadow-inner font-bold text-center flex items-center justify-center ${
                        plan.status === 'WAITING' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                        plan.status === 'APPROVED' ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' :
                        plan.status === 'REJECTED' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                        'bg-gray-800 border-gray-700 text-gray-400'
                      }`}>
                        {plan.status || 'DRAFT'}
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-gray-800 hover:bg-gray-700 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95">
                  <Save size={20} /> บันทึกข้อมูล (Save Draft)
                </button>
              </form>
            </div>

            {/* กล่องที่ 2: สำหรับพนักงาน (ส่งขออนุมัติ) - โชว์เฉพาะตอน DRAFT หรือ REJECTED */}
            {(plan.status === 'DRAFT' || plan.status === 'REJECTED' || !plan.status) && (
               <div className="bg-amber-500/10 border border-amber-500/30 rounded-[2.5rem] p-6 shadow-xl text-center space-y-4">
                  <div>
                    <h3 className="text-amber-500 font-black text-lg">พร้อมใช้งานจริงหรือไม่?</h3>
                    <p className="text-amber-500/70 text-xs mt-1">เมื่อส่งขออนุมัติแล้ว จะเปลี่ยนสถานะเป็น WAITING</p>
                  </div>
                  <form action={sendPlanForApproval}>
                    <input type="hidden" name="id" value={id} />
                    <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20 active:scale-95">
                      <Send size={20} /> ส่งขออนุมัติ (Send to Manager)
                    </button>
                  </form>
               </div>
            )}

            {/* กล่องที่ 3: สำหรับผู้บริหาร (อนุมัติ / ตีกลับ) - โชว์เฉพาะตอน WAITING */}
            {plan.status === 'WAITING' && (
               <div className="bg-blue-500/10 border border-blue-500/30 rounded-[2.5rem] p-6 shadow-xl space-y-4">
                  <div className="text-center mb-2">
                    <h3 className="text-blue-400 font-black text-lg">สำหรับผู้บริหาร (Manager)</h3>
                    <p className="text-blue-400/70 text-xs mt-1">ตรวจสอบความถูกต้องและดำเนินการ</p>
                  </div>
                  <div className="flex gap-3">
                    <form action={approvePlan} className="flex-1">
                      <input type="hidden" name="id" value={id} />
                      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                        ✅ อนุมัติ
                      </button>
                    </form>
                    <form action={rejectPlan} className="flex-1">
                      <input type="hidden" name="id" value={id} />
                      <button type="submit" className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-black py-3 rounded-xl transition-all border border-red-500/20 hover:border-transparent active:scale-95">
                        ❌ ตีกลับ
                      </button>
                    </form>
                  </div>
               </div>
            )}

          </div>
        </div>

        {/* ========================================== */}
        {/* ฝั่งขวา: จัดการงบประมาณ (รายการย่อย) */}
        {/* ========================================== */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900/50 p-6 rounded-[2rem] border border-gray-800">
            <div>
              <h3 className="text-3xl font-black text-white italic tracking-tighter">Plan Budgets</h3>
            </div>
            <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-xs font-black uppercase tracking-tighter">
              {plan.items.length} Active Records
            </div>
          </div>

          <div className="space-y-5">
            {plan.items.map((item) => (
              <form key={item.pli_aid.toString()} action={updatePlanningItem} className="bg-gray-900/40 p-7 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-all grid grid-cols-1 md:grid-cols-12 gap-5 items-end group/row shadow-xl">
                <input type="hidden" name="item_aid" value={item.pli_aid.toString()} />
                <input type="hidden" name="planningId" value={id} />
                
                <div className="md:col-span-3 space-y-2">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] ml-1">Item Type</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" size={14} />
                    <input name="pli_type" defaultValue={item.pli_type ?? ""} className="w-full bg-black/60 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white text-xs font-bold focus:border-emerald-500 outline-none transition-all" />
                  </div>
                </div>

                <div className="md:col-span-5 space-y-2">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] ml-1">Description</label>
                  <input name="pli_description" defaultValue={item.pli_description ?? ""} className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-3 text-white text-xs focus:border-emerald-500 outline-none transition-all" />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] ml-1 text-right block">Budget (THB)</label>
                  <input name="pli_budget" type="number" step="0.01" defaultValue={item.pli_budget?.toString() ?? "0"} className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-3 text-white text-xs text-right focus:border-emerald-500 outline-none transition-all font-mono font-bold" />
                </div>
                
                <div className="md:col-span-2 flex gap-2">
                  <button type="submit" className="flex-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-black p-3 rounded-xl border border-emerald-500/20 transition-all flex items-center justify-center group/btn shadow-lg" title="Save">
                    <Save size={18} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button formAction={deletePlanningItem} className="p-3 bg-red-500/5 hover:bg-red-500 text-gray-700 hover:text-white rounded-xl border border-transparent hover:border-red-500/50 transition-all flex items-center justify-center shadow-lg" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </form>
            ))}
          </div>

          {/* Add New Plan Item */}
          <div className="bg-emerald-500/[0.03] p-10 rounded-[3rem] border border-dashed border-emerald-500/20 shadow-inner">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20">
                <Plus className="text-black" size={18} />
              </div>
              <h4 className="text-sm font-black text-emerald-500 uppercase tracking-[0.2em]">Add New Budget Item</h4>
            </div>

            <form action={addPlanningItem} className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <input type="hidden" name="planningId" value={id} />
              <div className="md:col-span-3 space-y-2">
                <input name="pli_type" placeholder="ประเภท..." className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 text-white text-sm focus:border-emerald-500 outline-none transition-all shadow-inner" required />
              </div>
              <div className="md:col-span-6 space-y-2">
                <input name="pli_description" placeholder="รายละเอียด..." className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 text-white text-sm focus:border-emerald-500 outline-none transition-all shadow-inner" required />
              </div>
              <div className="md:col-span-3">
                <button type="submit" className="w-full h-full bg-white hover:bg-emerald-500 text-black font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95">
                  <Plus size={20} /> เพิ่มรายการ
                </button>
              </div>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
