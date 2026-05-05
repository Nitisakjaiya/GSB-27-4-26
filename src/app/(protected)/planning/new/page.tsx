import Link from "next/link";
import { ArrowLeft, Save, FolderKanban } from "lucide-react";
import { createPlanning } from "../actions";

export default function NewPlanningPage() {
  const currentYearTH = new Date().getFullYear() + 543;

  return (
    <div className="p-8 max-w-3xl mx-auto animate-in fade-in duration-500">
      
      <Link href="/planning" className="flex items-center gap-2 text-gray-500 hover:text-emerald-500 transition-all w-fit group mb-8">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold font-mono tracking-tighter uppercase">Back to List</span>
      </Link>

      <div className="bg-gray-900 rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-emerald-400 to-teal-600"></div>
        
        <form action={createPlanning} className="p-10 space-y-8">
          
          <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
            <div className="p-3 bg-emerald-500/10 rounded-2xl">
              <FolderKanban className="text-emerald-500" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">Create New Plan</h2>
              <p className="text-xs text-gray-500 font-mono">สร้างแผนงานใหม่แบบกำหนดเอง</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Plan Name</label>
              <textarea 
                name="pl_name" 
                placeholder="ระบุชื่อแผนงานหรือโครงการ..."
                rows={4} 
                className="w-full bg-black/50 border border-gray-800 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all text-sm resize-none shadow-inner" 
                required 
              />
            </div>
            
            {/* 💡 ใช้ Select Dropdown สำหรับเลือกปีงบประมาณ ป้องกันการพิมพ์ผิด */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Budget Year (ปีงบประมาณ)</label>
              <select 
                name="pl_year" 
                defaultValue={currentYearTH}
                className="w-full bg-black/50 border border-gray-800 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all text-sm font-mono shadow-inner appearance-none cursor-pointer"
              >
                {/* วนลูปแสดงปีปัจจุบัน และล่วงหน้าอีก 4 ปี */}
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
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 active:scale-95"
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
