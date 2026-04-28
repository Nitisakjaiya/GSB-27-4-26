import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// เพิ่ม LogOut เข้ามา
import { LayoutDashboard, FilePlus, Users, Settings, LogOut } from "lucide-react"; 

import { auth } from "../auth"; // ดึง auth มาเช็ค session
import Providers from "../components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CTMNG - ระบบจัดการสัญญา",
  description: "ระบบบริหารจัดการสัญญาและกรรมการ",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // ดึงข้อมูลการ Login จากฝั่ง Server
  const session = await auth();

  return (
    <html lang="th">
      <body className={`${inter.className} bg-black text-white`}>
        <Providers session={session}>
          <div className="flex min-h-screen">
            
            {/* Sidebar (เมนูซ้ายมือที่กู้คืนมาแล้ว!) */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col gap-8 fixed h-full">
              <div className="text-xl font-bold text-blue-500 tracking-tighter">CTMNG System</div>
              <nav className="flex flex-col gap-2">
                <div className="text-xs font-semibold text-gray-500 uppercase px-3 mb-2">Main Menu</div>
                
                <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 bg-blue-600/10 text-blue-400 rounded-lg border border-blue-600/20 transition-all">
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </a>

                <a href="/contracts/new" className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-all">
                  <FilePlus size={20} />
                  <span>เพิ่มสัญญาใหม่</span>
                </a>

                <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-all">
                  <Users size={20} />
                  <span>จัดการกรรมการ</span>
                </a>
              </nav>

              <div className="mt-auto pt-6 border-t border-gray-800">
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-all mb-2">
                  <Settings size={20} />
                  <span>ตั้งค่าระบบ</span>
                </a>
                
                {/* ปุ่ม Logout ที่เพิ่มให้ใหม่ */}
                <form action="/api/auth/signout" method="POST">
                  <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all">
                    <LogOut size={20} />
                    <span>ออกจากระบบ</span>
                  </button>
                </form>
              </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 ml-64">
              <header className="h-16 border-b border-gray-800 flex items-center px-8 justify-between sticky top-0 bg-black/80 backdrop-blur-md">
                <div className="text-sm text-gray-400">โครงการ: GSB Contract Management</div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold uppercase">NJ</div>
                  <span className="text-sm font-medium">{session?.user?.name || 'niti.admin'}</span>
                </div>
              </header>
              <main className="p-0">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
