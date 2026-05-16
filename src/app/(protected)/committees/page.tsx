import Link from "next/link";
import { Users, Search, Plus, Edit3, Trash2, Filter, ShieldCheck } from "lucide-react";

export default async function CommitteesPage() {
  // 💡 TODO: เปลี่ยนตรงนี้ให้ดึงข้อมูลจาก Database (Prisma) ของประธานนะครับ
  // ตัวอย่าง: const committees = await prisma.tb_committee.findMany({...})
  const mockCommittees = [
    { id: "1", name: "นายสมชาย ใจดี", position: "ประธานกรรมการ", department: "ฝ่ายเทคโนโลยีสารสนเทศ", status: "ACTIVE" },
    { id: "2", name: "นางสาวสมศรี เรียนรู้", position: "กรรมการ", department: "ฝ่ายบัญชีและการเงิน", status: "ACTIVE" },
    { id: "3", name: "นายสมปอง สมหวัง", position: "กรรมการและเลขานุการ", department: "ฝ่ายบริหารทรัพยากรบุคคล", status: "ACTIVE" },
    { id: "4", name: "นายสมศักดิ์ รักงาน", position: "กรรมการสำรอง", department: "ฝ่ายปฏิบัติการ", status: "INACTIVE" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700 text-slate-800 space-y-8">
      
      {/* --- ส่วน Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 italic tracking-tight uppercase">
            <Users className="w-8 h-8 text-[#EB005D]" />
            Committee <span className="text-[#EB005D]">Management</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium tracking-widest text-[10px] uppercase">
            ระบบบริหารจัดการรายชื่อคณะกรรมการ (พบข้อมูลทั้งหมด {mockCommittees.length} รายการ)
          </p>
        </div>
        <Link href="/committees/new" className="flex items-center gap-2 bg-[#EB005D] hover:bg-pink-600 text-white px-6 py-3 rounded-xl transition-all font-black text-sm uppercase tracking-widest shadow-lg shadow-pink-500/30 active:scale-95">
          <Plus size={18} /> Add Committee
        </Link>
      </div>

      {/* --- กล่องค้นหา (Search & Filter) ขาวสว่าง --- */}
      <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm">
        <form className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              name="q" 
              placeholder="ค้นหาชื่อกรรมการ หรือ แผนก..." 
              className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-800 focus:border-[#EB005D] focus:ring-1 focus:ring-[#EB005D] outline-none transition-all text-sm shadow-inner" 
            />
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Filter size={16} /></div>
            <select name="status" className="w-full md:w-48 bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-slate-800 focus:border-[#EB005D] outline-none transition-all text-sm appearance-none cursor-pointer shadow-inner font-bold">
              <option value="">ทุกสถานะ (All)</option>
              <option value="ACTIVE">ACTIVE (ปฏิบัติงาน)</option>
              <option value="INACTIVE">INACTIVE (พ้นสภาพ)</option>
            </select>
          </div>
          <button type="submit" className="bg-slate-800 hover:bg-[#EB005D] text-white px-8 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest shadow-md">
            ค้นหา
          </button>
        </form>
      </div>

      {/* --- ตารางข้อมูลสีสว่าง (GSB Theme) --- */}
      <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden relative">
        {/* แถบสีชมพูด้านบนกล่อง */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#EB005D] to-pink-400"></div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Committee Name</th>
                <th className="px-8 py-5">Position</th>
                <th className="px-8 py-5">Department</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {mockCommittees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="inline-flex flex-col items-center justify-center opacity-50">
                      <Users size={48} className="text-slate-400 mb-4" />
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No Committees Found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                mockCommittees.map((person) => (
                  <tr key={person.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-[#EB005D] font-black shadow-sm">
                          {person.name.charAt(1)}
                        </div>
                        <span className="font-bold text-slate-800">{person.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <ShieldCheck size={14} className={person.position.includes("ประธาน") ? "text-[#EB005D]" : "text-slate-400"} />
                        {person.position}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-slate-500 text-xs font-bold">
                      {person.department}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        person.status === 'ACTIVE' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {person.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/committees/${person.id}/edit`} className="p-2.5 bg-slate-50 hover:bg-amber-500 text-slate-500 hover:text-white rounded-xl transition-all shadow-sm border border-slate-100 hover:border-transparent" title="Edit">
                          <Edit3 size={16} />
                        </Link>
                        <button className="p-2.5 bg-slate-50 hover:bg-red-500 text-slate-500 hover:text-white rounded-xl transition-all shadow-sm border border-slate-100 hover:border-transparent" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
