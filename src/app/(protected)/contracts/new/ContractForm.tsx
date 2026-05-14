"use client"; // 🚀 สำคัญมาก: ประกาศให้ไฟล์นี้ทำงานฝั่ง Client เพื่อให้ใช้ Auto-fill ได้

import { useState } from "react";
import { Save, Calendar, Link as LinkIcon, UploadCloud } from "lucide-react";

// รับ Props ข้อมูล plans และฟังก์ชัน action มาจากหน้าหลัก
export default function ContractForm({ plans, action }: { plans: any[], action: any }) {
  
  // สร้าง State สำหรับเก็บข้อมูลที่จะทำ Auto-fill
  const [formData, setFormData] = useState({
    ct_name: "",
    item_agreement: "",
    item_cost: "",
  });

  // ฟังก์ชันเวทมนตร์: เมื่อเลือกแผนงาน ให้ดึงข้อมูลมาหยอดใส่ State ทันที
  const handlePlanChange = (e: any) => {
    const planId = e.target.value;
    
    if (!planId) {
      // ถ้าเลือก "ไม่ระบุ" ให้เคลียร์ข้อมูลทิ้ง
      setFormData({ ct_name: "", item_agreement: "", item_cost: "" });
      return;
    }

    // หาข้อมูลแผนงานที่ตรงกับที่เลือก
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      // รวมยอดเงิน และรวมชื่อรายการย่อย
      const totalBudget = plan.items.reduce((sum: number, item: any) => sum + item.budget, 0);
      const itemNames = plan.items.map((i: any) => i.desc).join(", ");

      // อัปเดตข้อมูลลงไปในช่องกรอกทันที!
      setFormData({
        ct_name: plan.name || "",
        item_agreement: itemNames || "",
        item_cost: totalBudget.toString(),
      });
    }
  };

  return (
    // 🚀 เพิ่ม encType="multipart/form-data" เพื่อให้ฟอร์มนี้ส่งไฟล์ได้
    <form action={action} encType="multipart/form-data" className="grid gap-6 bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
      
      {/* 🚀 💡 กล่อง Magic Bridge เลือกแผนงาน */}
      <div className="mb-2 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl shadow-inner">
        <label className="flex items-center gap-2 text-sm font-black text-emerald-400 mb-3 uppercase tracking-widest">
          <LinkIcon size={16} />
          ดึงข้อมูลจากแผนงานที่อนุมัติแล้ว (Auto-Fill)
        </label>
        <select 
          onChange={handlePlanChange}
          className="w-full bg-black/60 border border-emerald-500/50 rounded-xl p-3 text-emerald-300 focus:border-emerald-400 outline-none transition-all font-bold cursor-pointer"
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
          <label className="block text-sm font-medium text-gray-400 mb-2">หมวดหมู่สัญญา (Category)</label>
          <input name="category_code" placeholder="ตัวอย่าง: EQ, SV, HW" className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">เลขที่สัญญา (Contract Number)</label>
          <input name="ct_number" placeholder="ตัวอย่าง: GSB-2026-002" className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all" required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">ชื่อโครงการ / ชื่อสัญญา</label>
        <input 
          name="ct_name" 
          value={formData.ct_name} // ผูกกับ State Auto-fill
          onChange={(e) => setFormData({ ...formData, ct_name: e.target.value })}
          placeholder="กรอกชื่อโครงการเต็ม..." 
          className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none transition-all font-bold" 
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">ชื่อผู้ประสานงาน (Coordinator)</label>
        <input name="coordinator_name" placeholder="ชื่อผู้รับผิดชอบโครงการ..." className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-black/50 rounded-xl border border-gray-800">
         <div>
           <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2"><Calendar size={14} className="text-emerald-500" />วันที่เริ่มสัญญา (Start Date)</label>
           <input type="date" name="start_date" className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all color-scheme-dark" required />
         </div>
         <div>
           <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2"><Calendar size={14} className="text-[#EB005D]" />วันที่สิ้นสุดสัญญา (End Date)</label>
           <input type="date" name="end_date" className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all color-scheme-dark" required />
         </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-800">
        <h3 className="text-sm font-semibold text-blue-400 mb-4 uppercase tracking-widest">ข้อมูลรายการย่อย (Contract Item)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">ประเภท</label>
            <select name="item_type" className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-blue-500 cursor-pointer">
              <option value="Initial">Initial</option>
              <option value="Replace">Replace</option>
              <option value="MA">MA</option>
              <option value="New">New</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">ชื่อรายการอุปกรณ์/บริการ</label>
            <input 
              name="item_agreement" 
              value={formData.item_agreement} // ผูกกับ State Auto-fill
              onChange={(e) => setFormData({ ...formData, item_agreement: e.target.value })}
              placeholder="รายละเอียดรายการ..." 
              className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-emerald-500 font-bold" 
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">งบประมาณ (บาท)</label>
            <input 
              name="item_cost" 
              type="number" 
              value={formData.item_cost} // ผูกกับ State Auto-fill
              onChange={(e) => setFormData({ ...formData, item_cost: e.target.value })}
              placeholder="0.00" 
              className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-emerald-500 font-bold text-right font-mono" 
            />
          </div>
        </div>
      </div>

      {/* 🚀 💡 ส่วนที่เพิ่มใหม่: กล่องอัปโหลดไฟล์สัญญา (PDF) */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-400 mb-4 uppercase tracking-widest">
          <UploadCloud size={18} />
          หลักฐานสัญญา (Document Archive)
        </h3>
        <div className="bg-black/40 border-2 border-dashed border-gray-700 rounded-2xl p-6 hover:border-blue-500 transition-all flex flex-col items-center justify-center gap-3">
          <input 
            type="file" 
            name="contract_file" 
            accept=".pdf, image/jpeg, image/png" // บังคับรับเฉพาะ PDF หรือรูปภาพ
            className="w-full max-w-md text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-600/20 file:text-blue-500 hover:file:bg-blue-600/30 cursor-pointer"
          />
          <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
            * รองรับไฟล์ PDF, JPG, PNG ขนาดไม่เกิน 5MB
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-800 mt-2">
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 tracking-widest uppercase">
          <Save size={20} /> บันทึกข้อมูลสัญญา
        </button>
      </div>
    </form>
  );
}
