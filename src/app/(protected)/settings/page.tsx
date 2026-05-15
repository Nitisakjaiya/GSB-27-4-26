import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import { auth } from "../../../auth";
import { deleteUser } from "./actions";
import DeleteUserButton from "./DeleteUserButton"; 
import { 
  Settings as SettingsIcon, Users, UserPlus, Shield, UserCircle 
} from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  const userRole = session?.user?.role;

  if (userRole !== 'MANAGER') {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center animate-in fade-in duration-500">
        <div className="bg-red-50 p-8 rounded-[3rem] border border-red-100 text-center max-w-md shadow-xl">
          <Shield size={64} className="text-red-500 mx-auto mb-6 animate-pulse" />
          <h1 className="text-2xl font-black text-slate-800 italic tracking-tighter mb-2 uppercase">Access Denied</h1>
          <p className="text-slate-500 text-sm">ขออภัย เฉพาะระดับ <span className="text-[#EB005D] font-bold">MANAGER</span> เท่านั้นที่เข้าได้</p>
        </div>
      </div>
    );
  }

  const users = await prisma.tb_user.findMany({
    where: { is_deleted: 0 }, orderBy: { created_at: 'desc' }
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
            <div className="p-2 bg-pink-100 rounded-xl text-[#EB005D] border border-pink-200">
              <SettingsIcon size={28} />
            </div>
            <h1 className="text-4xl font-black text-slate-800 italic tracking-tight uppercase">System Settings</h1>
          </div>
          <p className="text-sm text-slate-500 font-mono uppercase tracking-widest ml-14">
            ระบบจัดการผู้ใช้งานและตั้งค่าพื้นฐาน
          </p>
        </div>

        <Link href="/settings/users/new" className="flex items-center gap-2 bg-[#EB005D] hover:bg-pink-600 text-white px-6 py-3 rounded-2xl transition-all font-black shadow-lg shadow-pink-500/20 active:scale-95">
          <UserPlus size={18} /> เพิ่มพนักงานใหม่
        </Link>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-md border border-white rounded-[2rem] p-6 flex items-center gap-6 shadow-sm">
          <div className="p-4 bg-slate-50 text-slate-500 rounded-2xl border border-slate-100"><Users size={24} /></div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Total Users</p>
            <p className="text-3xl font-black text-slate-800">{totalUsers}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-md border border-white rounded-[2rem] p-6 flex items-center gap-6 shadow-sm">
          <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl border border-blue-100"><Shield size={24} /></div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Managers</p>
            <p className="text-3xl font-black text-slate-800">{managerCount}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-md border border-white rounded-[2rem] p-6 flex items-center gap-6 shadow-sm">
          <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl border border-emerald-100"><UserCircle size={24} /></div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Staff Members</p>
            <p className="text-3xl font-black text-slate-800">{staffCount}</p>
          </div>
        </div>
      </div>

      {/* --- User Management Table --- */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50 overflow-hidden relative">
        <div className="h-2 w-full bg-gradient-to-r from-[#EB005D] to-pink-400"></div>
        
        <div className="p-8 border-b border-slate-100 bg-white/50">
           <h3 className="text-xl font-black text-slate-800 italic tracking-tight uppercase">User Accounts</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">
              <tr>
                <th className="px-8 py-6 rounded-tl-3xl">ID</th>
                <th className="px-8 py-6">Name / Username</th>
                <th className="px-8 py-6 text-center">Role</th>
                <th className="px-8 py-6 text-center">Joined Date</th>
                <th className="px-8 py-6 text-center rounded-tr-3xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.user_aid.toString()} className="group hover:bg-pink-50/50 transition-colors">
                  <td className="px-8 py-6"><span className="text-slate-400 font-mono text-xs">#{user.user_aid.toString()}</span></td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-800 text-base">{user.first_name} {user.last_name}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">@{user.username}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      user.role === 'MANAGER' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    }`}>{user.role}</span>
                  </td>
                  <td className="px-8 py-6 text-center text-slate-500 font-mono text-xs">
                    {user.created_at.toLocaleDateString('th-TH')}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center items-center gap-2">
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
