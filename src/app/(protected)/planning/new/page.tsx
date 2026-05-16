import Link from "next/link";
import { ArrowLeft, Save, FolderKanban, AlertCircle } from "lucide-react";
import { createPlanning } from "../actions";
import { prisma } from "../../../../lib/prisma"; // ปรับ path ให้ตรงกับที่ตั้งไฟล์ prisma ของประธานนะครับ

export default async function NewPlanningPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const currentYearTH = new Date().getFullYear() + 543;

  // ตัวแปรสำหรับเก็บค่า Auto-fill
  let defaultPlanName = "";
  let refContractNumber = "";

  // 🚀 ถ้ามี ID สัญญาแนบมา (กดมาจากหน้า Dashboard) ให้ไปดึงข้อมูลสัญญาเก่ามา
  if (from) {
    const oldContract = await prisma.tb_contract.findUnique({
      where: { ct_aid: Number(from) }
    });

    if (oldContract) {
      defaultPlanName = `${oldContract.ct_name} (ต่ออายุ)`;
      refContractNumber = oldContract.ct_number || "";
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto animate-in fade-in duration-500">
      
      <Link href="/planning" className="flex items-center gap-2 text-slate-400 hover:text-[#EB005D] transition-all w-fit group mb-8">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold font-mono tracking-tighter uppercase">Back to List</span>
      </Link>

      {/* 🌸 เปลี่ยนเป็นธีมขาว-ชมพู สว่างคลีน 🌸 */}
      <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-[#EB005D] to-pink-400"></div>
        
        <form action={createPlanning} className="p-10 space-y-8">
          
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="p-3 bg-pink-50 rounded-2xl border border-pink-100">
              <FolderKanban className="text-[#EB005D]" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tight">
                Create New <span className="text-[#EB005D]">Plan</span>
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-1">สร้างแผนงานใหม่ / ต่ออายุสัญญา</p>
            </div>
          </div>

          {/* 🚀 กล่องแจ้งเตือนอ้างอิงสัญญาเดิม (จะโชว์ก็ต่อเมื่อกดมาจากหน้า Dashboard) */}
          {from && refContractNumber && (
            <div className="p-4 bg-pink-50 border border-pink-100 rounded-xl text-xs font-bold text-[#EB005D] flex items-center gap-2 shadow-sm">
              <AlertCircle size={16} className="animate-pulse" />
              <span>📌 ระบบได้ดึงข้อมูลเบื้องต้นมาจากสัญญาเลขที่: <span className="font-black bg-white px-2 py-0.5 rounded border border-pink-200">{refContractNumber}</span></span>
              
              {/* ซ่อน ID สัญญาเก่าไว้ เพื่อให้ตอนกด Save ระบบ action จะได้เอาไปผูก Relation ในฐานข้อมูลได้ */}
              <input type="hidden" name="ref_contract_id" value={from} />
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Plan Name</label>
              <textarea 
                name="pl_name" 
                placeholder="ระบุชื่อแผนงานหรือโครงการ..."
                rows={4} 
                defaultValue={defaultPlanName} // 👈 ใส่ค่าที่ดึงมาให้อัตโนมัติ
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:bg-white focus:border-[#EB005D] focus:ring-1 focus:ring-[#EB005D] outline-none transition-all text-sm resize-none shadow-inner font-medium" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Budget Year (ปีงบประมาณ)</label>
              <select 
                name="pl_year" 
                defaultValue={currentYearTH}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:bg-white focus:border-[#EB005D] focus:ring-1 focus:ring-[#EB005D] outline-none transition-all text-sm font-bold shadow-inner appearance-none cursor-pointer"
              >
                {[...Array(5)].map((_, i) => {
                  const year = currentYearTH + i;
                  return <option key={year} value={year}>ปีงบประมาณ {year}</option>;
                })}
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-[#EB005D] hover:bg-pink-600 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-pink-500/30 active:scale-95 uppercase tracking-widest text-sm"
            >
              <Save size={20} />
              <span>บันทึกและไปจัดการงบประมาณ</span>
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
