import Link from "next/link";
import { ArrowLeft, UserPlus, Shield, User, Lock, Save } from "lucide-react";
import { createUser } from "../../actions";
import { auth } from "../../../../../auth";

export default async function NewUserPage() {
  // 🛡️ กางโล่ป้องกัน: ตรวจสอบสิทธิ์อีกครั้งก่อนให้เห็นฟอร์ม
  const session = await auth();
  if (session?.user?.role !== 'MANAGER') {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center animate-in fade-in duration-500">
        <div className="bg-red-50 p-8 rounded-[3rem] border border-red-100 text-center max-w-md shadow-xl shadow-red-500/10">
          <Shield size={64} className="text-red-500 mx-auto mb-6 animate-pulse" />
          <h1 className="text-2xl font-black text-slate-800 italic tracking-tighter mb-2 uppercase">Access Denied</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/settings" className="p-2 bg-white hover:bg-pink-50 text-slate-400 hover:text-[#EB005D] border border-slate-200 rounded-xl transition-all shadow-sm active:scale-95 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-800 italic tracking-tight uppercase flex items-center gap-3">
            <UserPlus className="text-[#EB005D]" size={28} />
            Create New User
          </h1>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mt-1">เพิ่มบัญชีผู้ใช้งานใหม่เข้าสู่ระบบ</p>
        </div>
      </div>

      {/* Form Card (Glassmorphism สว่างๆ) */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-slate-300/30 overflow-hidden relative">
        <div className="h-2 w-full bg-gradient-to-r from-[#EB005D] via-pink-400 to-sky-400"></div>
        
        <form action={createUser} className="p-8 md:p-12 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username (ID เข้าใช้งาน)</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input name="username" type="text" required placeholder="เช่น j.doe หรือ staff_01" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-800 text-sm focus:border-[#EB005D] focus:bg-white outline-none transition-all shadow-inner" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input name="password" type="password" required placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-800 text-sm focus:border-[#EB005D] focus:bg-white outline-none transition-all shadow-inner" />
              </div>
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name (ชื่อจริง)</label>
              <input name="first_name" type="text" required placeholder="ชื่อ" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 text-sm focus:border-[#EB005D] focus:bg-white outline-none transition-all shadow-inner" />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name (นามสกุล)</label>
              <input name="last_name" type="text" required placeholder="นามสกุล" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 text-sm focus:border-[#EB005D] focus:bg-white outline-none transition-all shadow-inner" />
            </div>

            {/* Role Selection */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">System Role (ระดับสิทธิ์)</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select name="role" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-800 font-bold text-sm focus:border-[#EB005D] focus:bg-white outline-none transition-all shadow-inner appearance-none cursor-pointer">
                  <option value="STAFF">STAFF (เจ้าหน้าที่ทั่วไป - สร้างสัญญาได้)</option>
                  <option value="MANAGER">MANAGER (ผู้บริหาร - อนุมัติแผนงานได้)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button type="submit" className="w-full bg-[#EB005D] hover:bg-pink-600 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-pink-500/20 active:scale-95 uppercase tracking-widest">
              <Save size={20} /> Create Account
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
