import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import { auth } from "../../../auth";
import { deleteUser } from "./actions";
import DeleteUserButton from "./DeleteUserButton"; // 🚀 นำเข้าปุ่ม Client Component ที่เพิ่งสร้าง
import { 
  Settings as SettingsIcon, 
  Users, 
  UserPlus, 
  Shield,  
  UserCircle 
} from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  const userRole = session?.user?.role;

  // 🛡️ กางโล่: ถ้าไม่ใช่ MANAGER ห้ามเข้า!
  if (userRole !== 'MANAGER') {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center animate-in fade-in duration-500">
        <div className="bg-red-500/10 p-8 rounded-[3rem] border border-red-500/20 text-center max-w-md">
          <Shield size={64} className="text-red-500 mx-auto mb-6 animate-pulse" />
          <h1 className="text-2xl font-black text-white italic tracking-tighter mb-2 uppercase">Access Denied</h1>
          <p className="text-gray-400 text-sm">ขออภัย เฉพาะพนักงานระดับ <span className="text-blue-400 font-bold">MANAGER</span> เท่านั้น ที่สามารถเข้าถึงระบบตั้งค่าและจัดการผู้ใช้งานได้</p>
        </div>
      </div>
    );
  }

  const users = await prisma.tb_user.findMany({
    where: { is_deleted: 0 },
    orderBy: { created_at: 'desc' }
  });

  const totalUsers = users.length;
  const managerCount = users.filter(u => u.role === 'MANAGER').length;
  const staffCount = users.filter(u => u.role === 'STAFF').length;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
              <SettingsIcon size={28} />
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tight uppercase">System Settings</h1>
          </div>
          <p className="text-sm text-gray-500 font-mono uppercase tracking-widest ml-14">
            ระบบจัดการผู้ใช้งานและตั้งค่าพื้นฐาน
          </p>
        </div>

        <Link 
          href="/settings/users/new" 
          className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white px-6 py-3 rounded-2xl transition-all font-black shadow-lg shadow-purple-500/20 active:scale-95"
        >
          <UserPlus size={18} />
          เพิ่มพนักงานใหม่
        </Link>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-[2rem] p-6 flex items-center gap-6 shadow-inner">
          <div className="p-4 bg-gray-500/10 text-gray-400 rounded-2xl"><Users size={24} /></div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Total Users</p>
            <p className="text-3xl font-black text-white">{totalUsers}</p>
          </div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-[2rem] p-6 flex items-center gap-6 shadow-inner">
          <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl"><Shield size={24} /></div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Managers</p>
            <p className="text-3xl font-black text-white">{managerCount}</p>
          </div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-[2rem] p-6 flex items-center gap-6 shadow-inner">
          <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl"><UserCircle size={24} /></div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Staff Members</p>
            <p className="text-3xl font-black text-white">{staffCount}</p>
          </div>
        </div>
      </div>

      {/* --- User Management Table --- */}
      <div className="bg-gray-900 rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden relative">
        <div className="h-2 w-full bg-gradient-to-r from-purple-500 to-indigo-600"></div>
        
        <div className="p-8 border-b border-gray-800 bg-black/20">
           <h3 className="text-xl font-black text-white italic tracking-tight uppercase">User Accounts</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-800/30 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">
              <tr>
                <th className="px-8 py-6 rounded-tl-3xl">ID</th>
                <th className="px-8 py-6">Name / Username</th>
                <th className="px-8 py-6 text-center">Role</th>
                <th className="px-8 py-6 text-center">Joined Date</th>
                <th className="px-8 py-6 text-center rounded-tr-3xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {users.map((user) => (
                <tr key={user.user_aid.toString()} className="group hover:bg-purple-500/5 transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-gray-500 font-mono text-xs">#{user.user_aid.toString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-white text-base">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono mt-1">@{user.username}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      user.role === 'MANAGER' 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center text-gray-400 font-mono text-xs">
                    {user.created_at.toLocaleDateString('th-TH')}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center items-center gap-2">
                      {/* 🚀 เรียกใช้ Client Component แทนปุ่มเดิม! */}
                      <form action={deleteUser.bind(null, user.user_aid.toString())}>
                        <DeleteUserButton disabled={user.username === 'manager'} />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
