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
        <h1 className="text-2xl font-black text-red-500 italic uppercase">Access Denied</h1>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/settings" className="p-2 bg-gray-800/50 hover:bg-purple-500 text-gray-400 hover:text-white rounded-xl transition-all shadow-lg active:scale-95 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tight uppercase flex items-center gap-3">
            <UserPlus className="text-purple-500" size={28} />
            Create New User
          </h1>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mt-1">เพิ่มบัญชีผู้ใช้งานใหม่เข้าสู่ระบบ</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-gray-900 rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden relative">
        <div className="h-2 w-full bg-gradient-to-r from-purple-500 to-indigo-600"></div>
        
        <form action={createUser} className="p-8 md:p-12 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Username (ID เข้าใช้งาน)</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input name="username" type="text" required placeholder="เช่น j.doe หรือ staff_01" className="w-full bg-black/50 border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-white text-sm focus:border-purple-500 outline-none transition-all shadow-inner" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input name="password" type="password" required placeholder="••••••••" className="w-full bg-black/50 border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-white text-sm focus:border-purple-500 outline-none transition-all shadow-inner" />
              </div>
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">First Name (ชื่อจริง)</label>
              <input name="first_name" type="text" required placeholder="ชื่อ" className="w-full bg-black/50 border border-gray-800 rounded-2xl px-5 py-4 text-white text-sm focus:border-purple-500 outline-none transition-all shadow-inner" />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Last Name (นามสกุล)</label>
              <input name="last_name" type="text" required placeholder="นามสกุล" className="w-full bg-black/50 border border-gray-800 rounded-2xl px-5 py-4 text-white text-sm focus:border-purple-500 outline-none transition-all shadow-inner" />
            </div>

            {/* Role Selection */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">System Role (ระดับสิทธิ์)</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <select name="role" required className="w-full bg-black/50 border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-white text-sm focus:border-purple-500 outline-none transition-all shadow-inner appearance-none cursor-pointer">
                  <option value="STAFF">STAFF (เจ้าหน้าที่ทั่วไป - สร้างสัญญาได้)</option>
                  <option value="MANAGER">MANAGER (ผู้บริหาร - อนุมัติแผนงานได้)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-800">
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-purple-500/20 active:scale-95 uppercase tracking-widest">
              <Save size={20} /> Create Account
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
