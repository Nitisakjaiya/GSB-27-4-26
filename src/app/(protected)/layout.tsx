import Link from "next/link";
import { 
  LayoutDashboard, FilePlus, Users, Settings, LogOut, 
  TrendingUp, Bell, UserCircle, FileText 
} from "lucide-react"; 
// 🚀 เพิ่ม signOut เข้ามาใช้งานด้วยครับ
import { auth, signOut } from "../../auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b1120]">
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-[#0f172a] border-r border-gray-800 flex flex-col z-20 shadow-2xl">
        {/* Branding Area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800 bg-[#0f172a]">
          <div className="w-8 h-8 rounded-lg bg-[#EB005D] text-white flex items-center justify-center font-bold text-xl mr-3 shadow-lg shadow-pink-500/20">G</div>
          <span className="font-black text-xl tracking-tighter text-white">
            CTMNG <span className="text-[#EB005D]">System</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
          
          <p className="px-3 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Overview</p>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:bg-[#EB005D]/10 hover:text-[#EB005D] transition-all group">
            <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">Dashboard</span>
          </Link>

          <p className="px-3 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-8 mb-2">Contract Module</p>
          <Link href="/contracts" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:bg-[#EB005D]/10 hover:text-[#EB005D] transition-all group">
            <FileText size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">รายการสัญญา</span>
          </Link>
          <Link href="/contracts/new" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:bg-[#EB005D]/10 hover:text-[#EB005D] transition-all group">
            <FilePlus size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">เพิ่มสัญญาใหม่</span>
          </Link>
          
          <Link href="/committees" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:bg-[#EB005D]/10 hover:text-[#EB005D] transition-all group">
            <Users size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">จัดการกรรมการ</span>
          </Link>

          <p className="px-3 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-8 mb-2">Planning Module</p>
          <Link href="/planning" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:bg-[#10b981]/10 hover:text-[#10b981] transition-all group border border-transparent hover:border-[#10b981]/20">
            <div className="p-1 bg-[#10b981]/20 rounded-md">
              <TrendingUp size={18} className="text-[#10b981]" />
            </div>
            <span className="font-bold text-sm">รายการแผนงาน</span>
          </Link>

          <p className="px-3 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-8 mb-2">Reports & Analysis</p>
          <Link href="/reports/budget" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:bg-[#EB005D]/10 hover:text-[#EB005D] transition-all group">
            <div className="p-1 bg-[#EB005D]/20 rounded-md">
              <TrendingUp size={18} className="text-[#EB005D]" />
            </div>
            <span className="font-bold text-sm text-[#EB005D]">รายงานงบประมาณ</span>
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-800 space-y-1">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-gray-200 transition-all text-sm group">
            <Settings size={18} className="group-hover:rotate-45 transition-transform" />
            <span>ตั้งค่าระบบ</span>
          </Link>
          
          {/* 🚀 อัปเกรดปุ่ม Logout ให้ทำงานด้วย Server Action เตะกลับหน้า /login */}
          <form action={async () => {
            "use server"
            await signOut({ redirectTo: "/login" });
          }}>
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm font-bold">
              <LogOut size={18} />
              <span>ออกจากระบบ</span>
            </button>
          </form>
        </div>
      </aside>

      {/* --- Main Area --- */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-800 flex items-center px-8 justify-between sticky top-0 bg-[#0b1120]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#EB005D] rounded-full animate-pulse"></span>
            <div className="text-xs text-gray-500 font-bold tracking-widest uppercase">GSB Contract Management Project</div>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-gray-500 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#EB005D] rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-gray-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-white leading-tight">{session?.user?.name || 'User'}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{session?.user?.role || 'STAFF'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EB005D] to-[#6E2B4E] flex items-center justify-center shadow-lg border-2 border-gray-800">
                <UserCircle size={24} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
}
