"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, User, ShieldAlert, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      // 🚀 สั่ง Login แบบไม่ให้มันเด้งหน้าเอง (redirect: false)
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false, 
      });

      if (res?.error) {
        setErrorMessage("Username หรือ Password ไม่ถูกต้อง!");
        setIsPending(false);
      } else {
        // 🚀 ถ้าล็อคอินผ่าน ให้สั่ง Client Router เปลี่ยนหน้าอย่างนุ่มนวล!
        router.push("/dashboard");
        router.refresh(); // บังคับให้โหลดข้อมูลใหม่ให้ชัวร์
      }
    } catch (err) {
      setErrorMessage("ระบบขัดข้อง กรุณาลองใหม่");
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#EB005D]/20 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#0EA5E9]/20 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-10 rounded-[2.5rem] shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight italic mb-2">
            CTMNG <span className="text-[#EB005D]">ENTERPRISE</span>
          </h1>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-[0.2em]">
            Resource Planning System
          </p>
        </div>

        {/* 🚀 เปลี่ยนมาใช้ onSubmit แทน action */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                name="username" 
                type="text"
                placeholder="manager หรือ staff"
                required
                className="w-full bg-black/50 border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-white text-sm focus:border-[#EB005D] outline-none transition-all shadow-inner" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                name="password" 
                type="password"
                placeholder="••••••"
                required
                className="w-full bg-black/50 border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-white text-sm focus:border-[#EB005D] outline-none transition-all shadow-inner" 
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-3 rounded-xl animate-in fade-in slide-in-from-top-2">
              <ShieldAlert size={16} />
              <p>{errorMessage}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-[#EB005D] hover:bg-[#c4004e] text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-pink-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest mt-4"
          >
            {isPending ? <Loader2 size={20} className="animate-spin" /> : 'Sign In'}
            {isPending ? 'Authenticating...' : ''}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-800 pt-6">
          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.3em]">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}
