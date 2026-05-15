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
  approvePlan, 
  rejectPlan 
} from "../../actions";
import { auth } from "../../../../../auth";

export default async function EditPlanningPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const userRole = session?.user?.role;

  const plan = await prisma.tb_planning.findUnique({
    where: { pl_aid: BigInt(id) },
    include: { items: { where: { is_deleted: 0 }, orderBy: { pli_aid: 'asc' } } }
  });

  if (!plan || plan.is_deleted === 1) notFound();

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 space-y-10">
      
      {/* --- ส่วนหัว --- */}
      <div className="flex justify-between items-center">
        <Link href={`/planning/${id}`} className="flex items-center gap-2 text-slate-500 hover:text-pink-600 transition-all w-fit group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold font-mono tracking-tighter uppercase">Back to Detail</span>
        </Link>
        <div className="flex items-center gap-2 text-slate-400 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
          <LayoutDashboard size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Plan Editor Mode</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* ========================================== */}
        {/* ฝั่งซ้าย: ข้อมูลแผนหลัก & ปุ่ม Action ต่างๆ */}
        {/* ========================================== */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            
            {/* กล่องที่ 1: ข้อมูลแผนงาน (สีขาวล้วน) */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="h-2 w-full bg-gradient-to-r from-[#EB005D] to-pink-400"></div>
              
              <form action={updatePlanning} className="p-8 space-y-7">
                <input type="hidden" name="id" value={id} />
                
                <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                  <div className="p-2 bg-pink-50 rounded-lg">
                    <Info className="text-[#EB005D]" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800 italic uppercase tracking-tight">Plan Details</h2>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Plan Name</label>
                    <textarea name="pl_name" defaultValue={plan.pl_name ?? ""} rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-800 focus:bg-white focus:border-pink-500 outline-none transition-all text-sm resize-none shadow-inner" required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Budget Year</label>
                      <input name="pl_year" type="number" defaultValue={plan.pl_year ?? ""} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-800 focus:bg-white focus:border-pink-500 outline-none transition-all text-sm font-mono shadow-inner text-center" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Status</label>
                      <div className={`w-full border rounded-2xl px-5 py-3 text-sm shadow-inner font-bold text-center flex items-center justify-center ${
                        plan.status === 'WAITING' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                        plan.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                        plan.status === 'REJECTED' ? 'bg-red-50 border-red-200 text-red-600' :
                        'bg-slate-100 border-slate-200 text-slate-500'
                      }`}>
                        {plan.status || 'DRAFT'}
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95 shadow-md">
                  <Save size={20} /> บันทึกข้อมูล (Save Draft)
                </button>
              </form>
            </div>

            {/* กล่องที่ 2: สำหรับพนักงาน (ส่งขออนุมัติ) */}
            {(plan.status === 'DRAFT' || plan.status === 'REJECTED' || !plan.status) && (
               <div className="bg-amber-50 border border-amber-200 rounded-[2.5rem] p-6 shadow-sm text-center space-y-4">
                  <div>
                    <h3 className="text-amber-600 font-black text-lg">พร้อมใช้งานจริงหรือไม่?</h3>
                    <p className="text-amber-600/70 text-xs mt-1">เมื่อส่งขออนุมัติแล้ว จะเปลี่ยนสถานะเป็น WAITING</p>
                  </div>
                  <form action={sendPlanForApproval}>
                    <input type="hidden" name="id" value={id} />
                    <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-amber-500/20 active:scale-95">
                      <Send size={20} /> ส่งขออนุมัติ (Send to Manager)
                    </button>
                  </form>
               </div>
            )}

            {/* กล่องที่ 3: สำหรับผู้บริหาร (อนุมัติ / ตีกลับ) */}
            {userRole === 'MANAGER' && plan.status === 'WAITING' && (
               <div className="bg-blue-50 border border-blue-200 rounded-[2.5rem] p-6 shadow-sm space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="text-center mb-2">
                    <h3 className="text-blue-600 font-black text-lg">สำหรับผู้บริหาร (Manager)</h3>
                    <p className="text-blue-500/70 text-xs mt-1">ตรวจสอบความถูกต้องและดำเนินการ</p>
                  </div>
                  <div className="flex gap-3">
                    <form action={approvePlan} className="flex-1">
                      <input type="hidden" name="id" value={id} />
                      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                        ✅ อนุมัติ
                      </button>
                    </form>
                    <form action={rejectPlan} className="flex-1">
                      <input type="hidden" name="id" value={id} />
                      <button type="submit" className="w-full bg-red-50 hover:bg-red-500 text-red-500 hover:text-white font-black py-3 rounded-xl transition-all border border-red-200 hover:border-transparent active:scale-95">
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-sm">
            <div>
              <h3 className="text-3xl font-black text-slate-800 italic tracking-tighter">Plan Budgets</h3>
            </div>
            <div className="px-6 py-2 bg-pink-50 border border-pink-100 rounded-2xl text-[#EB005D] text-xs font-black uppercase tracking-tighter">
              {plan.items.length} Active Records
            </div>
          </div>

          <div className="space-y-5">
            {plan.items.map((item) => (
              <form key={item.pli_aid.toString()} action={updatePlanningItem} className="bg-white p-7 rounded-[2.5rem] border border-slate-200 hover:border-pink-300 transition-all grid grid-cols-1 md:grid-cols-12 gap-5 items-end group/row shadow-sm hover:shadow-md">
                <input type="hidden" name="item_aid" value={item.pli_aid.toString()} />
                <input type="hidden" name="planningId" value={id} />
                
                <div className="md:col-span-3 space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Item Type</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input name="pli_type" defaultValue={item.pli_type ?? ""} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 text-xs font-bold focus:bg-white focus:border-[#EB005D] outline-none transition-all" />
                  </div>
                </div>

                <div className="md:col-span-5 space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Description</label>
                  <input name="pli_description" defaultValue={item.pli_description ?? ""} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-xs focus:bg-white focus:border-[#EB005D] outline-none transition-all" />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 text-right block">Budget (THB)</label>
                  <input name="pli_budget" type="number" step="0.01" defaultValue={item.pli_budget?.toString() ?? "0"} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-xs text-right focus:bg-white focus:border-[#EB005D] outline-none transition-all font-mono font-bold" />
                </div>
                
                <div className="md:col-span-2 flex gap-2">
                  <button type="submit" className="flex-1 bg-pink-50 hover:bg-[#EB005D] text-[#EB005D] hover:text-white p-3 rounded-xl border border-pink-100 transition-all flex items-center justify-center group/btn shadow-sm" title="Save">
                    <Save size={18} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button formAction={deletePlanningItem} className="p-3 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl border border-red-100 transition-all flex items-center justify-center shadow-sm" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </form>
            ))}
          </div>

          {/* Add New Plan Item */}
          <div className="bg-white/60 backdrop-blur-md p-10 rounded-[3rem] border border-dashed border-slate-300 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-[#EB005D] rounded-lg shadow-lg shadow-pink-500/20">
                <Plus className="text-white" size={18} />
              </div>
              <h4 className="text-sm font-black text-[#EB005D] uppercase tracking-[0.2em]">Add New Budget Item</h4>
            </div>

            <form action={addPlanningItem} className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <input type="hidden" name="planningId" value={id} />
              <div className="md:col-span-3 space-y-2">
                <input name="pli_type" placeholder="ประเภท..." className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 text-sm focus:border-[#EB005D] outline-none transition-all shadow-sm" required />
              </div>
              <div className="md:col-span-6 space-y-2">
                <input name="pli_description" placeholder="รายละเอียด..." className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 text-sm focus:border-[#EB005D] outline-none transition-all shadow-sm" required />
              </div>
              <div className="md:col-span-3">
                <button type="submit" className="w-full h-full bg-[#EB005D] hover:bg-pink-600 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-pink-500/30 active:scale-95">
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
