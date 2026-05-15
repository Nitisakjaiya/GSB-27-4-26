"use client"; 

import { useState } from "react";
import { Save, Calendar, Link as LinkIcon, UploadCloud } from "lucide-react";

export default function ContractForm({ plans, action }: { plans: any[], action: any }) {
  
  const [formData, setFormData] = useState({
    ct_name: "",
    item_agreement: "",
    item_cost: "",
  });

  const handlePlanChange = (e: any) => {
    const planId = e.target.value;
    
    if (!planId) {
      setFormData({ ct_name: "", item_agreement: "", item_cost: "" });
      return;
    }

    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      const totalBudget = plan.items.reduce((sum: number, item: any) => sum + item.budget, 0);
      const itemNames = plan.items.map((i: any) => i.desc).join(", ");

      setFormData({
        ct_name: plan.name || "",
        item_agreement: itemNames || "",
        item_cost: totalBudget.toString(),
      });
    }
  };

  return (
    <form action={action} className="grid gap-6 bg-white/90 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50">
      
      {/* 🚀 กล่อง Magic Bridge เลือกแผนงาน */}
      <div className="mb-2 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm">
        <label className="flex items-center gap-2 text-sm font-black text-emerald-600 mb-3 uppercase tracking-widest">
          <LinkIcon size={16} />
          ดึงข้อมูลจากแผนงานที่อนุมัติแล้ว (Auto-Fill)
        </label>
        <select 
          onChange={handlePlanChange}
          className="w-full bg-white border border-emerald-200 rounded-xl p-3 text-emerald-700 focus:border-emerald-400 outline-none transition-all font-bold cursor-pointer shadow-inner"
        >
          <option value="">-- ไม่ระบุ (สร้างสัญญาใหม่ด้วยตัวเอง) --</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              ⭐ {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">หมวดหมู่สัญญา (Category)</label>
          <input name="category_code" placeholder="ตัวอย่าง: EQ, SV, HW" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:bg-white focus:border-[#EB005D] outline-none transition-all shadow-inner" required />
        </div>
        <div>
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">เลขที่สัญญา (Contract Number)</label>
          <input name="ct_number" placeholder="ตัวอย่าง: GSB-2026-002" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:bg-white focus:border-[#EB005D] outline-none transition-all shadow-inner" required />
        </div>
      </div>

      <div>
        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">ชื่อโครงการ / ชื่อสัญญา</label>
        <input 
          name="ct_name" 
          value={formData.ct_name}
          onChange={(e) => setFormData({ ...formData, ct_name: e.target.value })}
          placeholder="กรอกชื่อโครงการเต็ม..." 
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:bg-white focus:border-[#EB005D] outline-none transition-all font-bold shadow-inner" 
          required 
        />
      </div>

      <div>
        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">ชื่อผู้ประสานงาน (Coordinator)</label>
        <input name="coordinator_name" placeholder="ชื่อผู้รับผิดชอบโครงการ..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:bg-white focus:border-[#EB005D] outline-none transition-all shadow-inner" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50/80 rounded-2xl border border-slate-100 shadow-inner">
         <div>
           <label className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest mb-2 ml-1">
             <Calendar size={14} />วันที่เริ่มสัญญา (Start Date)
           </label>
           <input type="date" name="start_date" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 focus:border-emerald-500 outline-none transition-all shadow-sm" required />
         </div>
         <div>
           <label className="flex items-center gap-2 text-xs font-black text-[#EB005D] uppercase tracking-widest mb-2 ml-1">
             <Calendar size={14} />วันที่สิ้นสุดสัญญา (End Date)
           </label>
           <input type="date" name="end_date" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 focus:border-[#EB005D] outline-none transition-all shadow-sm" required />
         </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-slate-100">
        <h3 className="text-sm font-black text-blue-500 mb-4 uppercase tracking-widest">ข้อมูลรายการย่อย (Contract Item)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">ประเภท</label>
            <select name="item_type" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer shadow-inner">
              <option value="Initial">Initial</option>
              <option value="Replace">Replace</option>
              <option value="MA">MA</option>
              <option value="New">New</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">ชื่อรายการอุปกรณ์/บริการ</label>
            <input 
              name="item_agreement" 
              value={formData.item_agreement}
              onChange={(e) => setFormData({ ...formData, item_agreement: e.target.value })}
              placeholder="รายละเอียดรายการ..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 outline-none focus:bg-white focus:border-[#EB005D] font-bold shadow-inner" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1 text-right">งบประมาณ (บาท)</label>
            <input 
              name="item_cost" 
              type="number" 
              value={formData.item_cost}
              onChange={(e) => setFormData({ ...formData, item_cost: e.target.value })}
              placeholder="0.00" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 outline-none focus:bg-white focus:border-[#EB005D] font-bold text-right font-mono shadow-inner" 
            />
          </div>
        </div>
      </div>

      {/* กล่องอัปโหลดไฟล์สัญญา (PDF) */}
      <div className="mt-4 pt-6 border-t border-slate-100">
        <h3 className="flex items-center gap-2 text-sm font-black text-sky-500 mb-4 uppercase tracking-widest">
          <UploadCloud size={18} />
          หลักฐานสัญญา (Document Archive)
        </h3>
        <div className="bg-sky-50/50 border-2 border-dashed border-sky-200 rounded-2xl p-6 hover:border-sky-400 hover:bg-sky-50 transition-all flex flex-col items-center justify-center gap-3 shadow-inner">
          <input 
            type="file" 
            name="contract_file" 
            accept=".pdf, image/jpeg, image/png"
            className="w-full max-w-md text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-sky-500 file:text-white hover:file:bg-sky-600 cursor-pointer transition-colors"
          />
          <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
            * รองรับไฟล์ PDF, JPG, PNG ขนาดไม่เกิน 5MB
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 mt-2">
        <button type="submit" className="w-full bg-[#EB005D] hover:bg-pink-600 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-pink-500/30 active:scale-95 tracking-widest uppercase">
          <Save size={20} /> บันทึกและสร้างสัญญา
        </button>
      </div>
    </form>
  );
}
