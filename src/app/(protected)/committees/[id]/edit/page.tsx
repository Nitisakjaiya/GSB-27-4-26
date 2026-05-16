import Link from "next/link";
import { ArrowLeft, Save, UserCheck, ShieldCheck, Building2, Link as LinkIcon, AlertCircle } from "lucide-react";
import { updateCommittee } from "../../actions";
import { prisma } from "../../../../../lib/prisma"; // 💡 เช็ก Path ของ prisma ดีๆ นะครับ อาจจะต้องถอยหลายโฟลเดอร์
import { notFound } from "next/navigation";

export default async function EditCommitteePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const committeeId = Number(id);

  // ดึงข้อมูลกรรมการคนเดิมจาก Database
  const committee = await prisma.tb_committees.findUnique({
    where: { cmit_aid: committeeId }
  });

  // ถ้าไม่เจอข้อมูล หรือถูกลบไปแล้ว ให้เด้งไปหน้า 404
  if (!committee || committee.is_deleted === 1) {
    notFound();
  }

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500 text-slate-800">
      
      {/* --- ปุ่มย้อนกลับ --- */}
      <Link href="/committees" className="flex items-center gap-2 text-slate-400 hover:text-[#EB005D] transition-all w-fit group mb-8">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold font-mono tracking-tighter uppercase">Back to List</span>
      </Link>

      {/* --- กล่องฟอร์มแก้ไข ธีมชมพู GSB สว่างคลีน --- */}
      <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* แถบสีชมพูด้านบน (เปลี่ยนกลับเป็น gradient ชมพู GSB) */}
        <div className="h-2 w-full bg-gradient-to-r from-[#EB005D] to-pink-400"></div>
        
        <form action={updateCommittee} className="p-10 space-y-8">
          
          {/* 🚀 ซ่อน ID ของกรรมการไว้ส่งไปให้ Server Action */}
          <input type="hidden" name="cmit_aid" value={committee.cmit_aid.toString()} />

          {/* Header ฟอร์ม เปลี่ยนเป็นสีชมพู */}
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="p-3 bg-pink-50 rounded-2xl border border-pink-100">
              <UserCheck className="text-[#EB005D]" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tight">
                Edit <span className="text-[#EB005D]">Committee</span>
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-1">แก้ไขข้อมูลรายชื่อคณะกรรมการ</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. อ้างอิงระบบ (Contract / Plan) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
                <LinkIcon size={12} className="text-[#EB005D]" /> สังกัด (Type)
              </label>
              <select 
                name="base_type" 
                defaultValue={committee.base_type}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:bg-white focus:border-[#EB005D] focus:ring-1 focus:ring-[#EB005D] outline-none transition-all text-sm font-bold shadow-inner appearance-none cursor-pointer"
                required
              >
                <option value="CON">กรรมการประจำ สัญญา (Contract)</option>
                <option value="PLAN">กรรมการประจำ แผนงาน (Planning)</option>
              </select>
            </div>

            {/* 2. รหัสอ้างอิง (Base ID) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
                <AlertCircle size={12} className="text-[#EB005D]" /> รหัสอ้างอิง (ID สัญญา หรือ แผนงาน)
              </label>
              <input 
                type="number" 
                name="base_id" 
                defaultValue={committee.base_id.toString()}
                placeholder="ระบุตัวเลข ID..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:bg-white focus:border-[#EB005D] focus:ring-1 focus:ring-[#EB005D] outline-none transition-all text-sm font-bold shadow-inner"
                required
              />
            </div>

            {/* 3. ชื่อ-นามสกุล */}
            <div className="md:col-span-2 space-y-2 mt-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
                ชื่อ-นามสกุล กรรมการ
              </label>
              <input 
                type="text" 
                name="cmit_name" 
                defaultValue={committee.cmit_name || ""}
                placeholder="ตัวอย่าง: นายสมชาย ใจดี" 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:bg-white focus:border-[#EB005D] focus:ring-1 focus:ring-[#EB005D] outline-none transition-all text-sm shadow-inner"
                required
              />
            </div>

            {/* 4. ตำแหน่ง */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-[#EB005D]" /> ตำแหน่ง
              </label>
              <input 
                type="text" 
                name="cmit_position" 
                defaultValue={committee.cmit_position || ""}
                placeholder="ตัวอย่าง: ประธานกรรมการ" 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:bg-white focus:border-[#EB005D] focus:ring-1 focus:ring-[#EB005D] outline-none transition-all text-sm shadow-inner"
              />
            </div>

            {/* 5. แผนก/หน่วยงาน */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
                <Building2 size={12} className="text-[#EB005D]" /> แผนก / หน่วยงาน
              </label>
              <input 
                type="text" 
                name="cmit_unit" 
                defaultValue={committee.cmit_unit || ""}
                placeholder="ตัวอย่าง: ฝ่ายเทคโนโลยีสารสนเทศ" 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:bg-white focus:border-[#EB005D] focus:ring-1 focus:ring-[#EB005D] outline-none transition-all text-sm shadow-inner"
              />
            </div>

          </div>

          {/* ปุ่มบันทึก เปลี่ยนสีเป็นชมพู GSB */}
          <div className="pt-8">
            <button 
              type="submit" 
              className="w-full bg-[#EB005D] hover:bg-pink-600 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-pink-500/30 active:scale-95 uppercase tracking-widest text-sm"
            >
              <Save size={20} />
              <span>บันทึกการแก้ไขข้อมูล</span>
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
