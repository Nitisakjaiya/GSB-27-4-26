import Link from "next/link";
import { 
  LayoutDashboard, FilePlus, Users, Settings, LogOut, 
  TrendingUp, Bell, UserCircle, FileText 
} from "lucide-react"; 
import { auth, signOut } from "../../auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-screen overflow-hidden relative bg-slate-50">
      
      {/* 🌸 1. สาดเวทมนตร์พื้นหลัง: Abstract Mesh Gradient สไตล์ออมสิน 🌸 */}
      {/* โซนนี้จะทำหน้าที่เป็นพื้นหลังฟุ้งๆ ลอยอยู่หลังสุดของระบบ (z-0) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* ก้อนสีชมพูบนขวา */}
        <div className="absolute -top-[15%] -right-[5%] w-[60%] h-[60%] rounded-full bg-pink-200/40 blur-[120px]"></div>
        {/* ก้อนสีฟ้าซ้ายล่าง (ให้ดูมีมิติ ไม่เลี่ยนชมพูเกินไป) */}
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-sky-100/50 blur-[100px]"></div>
        {/* ก้อนสีชมพูออมสินจางๆ ตรงกลาง */}
        <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full bg-[#EB005D]/5 blur-[120px]"></div>
      </div>

      {/* --- Sidebar (ยกระดับให้เป็นกระจกใสเบาๆ Glassmorphism) --- */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-white/50 flex flex-col z-20 shadow-[10px_0_40px_-15px_rgba(0,0,0,0.05)]">
        {/* Branding Area */}
        <div className="h-16 flex items-center px-6 border-b border-white/50 bg-transparent">
          <div className="w-8 h-8 rounded-lg bg-[#EB005D] text-white flex items-center justify-center font-bold text-xl mr-3 shadow-md shadow-pink-500/30">G</div>
          <span className="font-black text-xl tracking-tighter text-slate-800">
            CTMNG <span className="text-[#EB005D]">System</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
          
          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Overview</p>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-pink-50/80 hover:text-[#EB005D] transition-all group font-medium">
            <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm">Dashboard</span>
          </Link>

          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-8 mb-2">Contract Module</p>
          <Link href="/contracts" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-pink-50/80 hover:text-[#EB005D] transition-all group font-medium">
            <FileText size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm">รายการสัญญา</span>
          </Link>
          <Link href="/contracts/new" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-pink-50/80 hover:text-[#EB005D] transition-all group font-medium">
            <FilePlus size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm">เพิ่มสัญญาใหม่</span>
          </Link>
          
          <Link href="/committees" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-pink-50/80 hover:text-[#EB005D] transition-all group font-medium">
            <Users size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm">จัดการกรรมการ</span>
          </Link>

          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-8 mb-2">Planning Module</p>
          <Link href="/planning" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all group font-medium border border-transparent hover:border-emerald-100">
            <div className="p-1 bg-emerald-100/50 rounded-md group-hover:bg-emerald-200/50 transition-colors">
              <TrendingUp size={18} className="text-emerald-600" />
            </div>
            <span className="text-sm">รายการแผนงาน</span>
          </Link>

          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-8 mb-2">Reports & Analysis</p>
          <Link href="/reports/budget" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-pink-50/80 hover:text-[#EB005D] transition-all group font-medium border border-transparent hover:border-pink-100">
            <div className="p-1 bg-pink-100/50 rounded-md group-hover:bg-pink-200/50 transition-colors">
              <TrendingUp size={18} className="text-[#EB005D]" />
            </div>
            <span className="text-sm text-[#EB005D] font-bold">รายงานงบประมาณ</span>
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/50 space-y-1 bg-slate-50/30">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white/80 transition-all text-sm group font-medium shadow-sm">
            <Settings size={18} className="group-hover:rotate-45 transition-transform" />
            <span>ตั้งค่าระบบ</span>
          </Link>
          
          <form action={async () => {
            "use server"
            await signOut({ redirectTo: "/login" });
          }}>
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all text-sm font-bold shadow-sm">
              <LogOut size={18} />
              <span>ออกจากระบบ</span>
            </button>
          </form>
        </div>
      </aside>

      {/* --- Main Area --- */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Header (โปร่งแสงให้เห็นพื้นหลังทะลุมานิดๆ) */}
        <header className="h-16 border-b border-white/50 flex items-center px-8 justify-between sticky top-0 bg-white/60 backdrop-blur-xl z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#EB005D] rounded-full animate-pulse"></span>
            <div className="text-xs text-slate-500 font-bold tracking-widest uppercase">GSB Contract Management Project</div>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-[#EB005D] transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#EB005D] border-2 border-white rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800 leading-tight">{session?.user?.name || 'User'}</p>
                <p className="text-[10px] text-[#EB005D] font-bold uppercase tracking-tighter">{session?.user?.role || 'STAFF'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EB005D] to-pink-400 flex items-center justify-center shadow-md border-2 border-white">
                <UserCircle size={24} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* พื้นที่ Content (ปล่อยพื้นหลังโล่ง เพื่อให้โชว์ลวดลาย Mesh Gradient ที่เราทำไว้) */}
        <main className="flex-1 overflow-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
}
