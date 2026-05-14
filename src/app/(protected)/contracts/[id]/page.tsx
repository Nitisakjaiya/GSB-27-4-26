import { prisma } from "../../../../lib/prisma";
import { 
  ArrowLeft, FileText, User, Calendar, BadgeDollarSign, 
  Briefcase, Users, Plus, Trash2, ShieldCheck,
  HardDrive, FileUp, File, Download, Edit3, CopyPlus, Clock, Lock
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

// Import Actions (Contracts)
import { 
  addCommittee, 
  deleteCommittee, 
  uploadFile, 
  deleteFile, 
  getDownloadUrl 
} from "../actions";

// Import Actions (Planning - Phase 3)
import { copyContractToPlanning } from "../../planning/actions";

export default async function ContractDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. แกะค่า ID จาก Promise (Next.js 16 Standard)
  const { id } = await params;

  // 2. ดึงข้อมูลสัญญา + รายการย่อย
  const contract = await prisma.tb_contract.findUnique({
    where: { ct_aid: BigInt(id) },
    include: { items: { where: { is_deleted: 0 } } }
  });

  if (!contract || contract.is_deleted === 1) notFound();

  // 3. ดึงรายชื่อกรรมการ
  const committees = await prisma.tb_committees.findMany({
    where: { base_id: BigInt(id), base_type: 'CON', is_deleted: 0 },
    orderBy: { created_at: 'asc' }
  });

  // 4. ดึงรายการไฟล์
  const files = await prisma.tb_files.findMany({
    where: { base_id: BigInt(id), base_type: 'CON', is_deleted: 0 },
    orderBy: { created_at: 'desc' }
  });

  // 🚀 Helper Function แปลงวันที่
  const formatDate = (date: Date | null) => {
    if (!date) return "ไม่ระบุ";
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // 🔐 💡 ตรวจสอบว่าสัญญาถูกล็อกหรือไม่ (COMPLETED หรือ CANCELLED)
  const isLocked = contract.contract_status === 'COMPLETED' || contract.contract_status === 'CANCELLED';

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- ส่วนนำทางและปุ่มจัดการหลัก --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-[#38BDF8] transition-all group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-sm font-medium uppercase tracking-tighter">Back to Overview</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          {/* ✨ ปุ่มสร้างแผนงาน (Task 3.3 - Magic Copy) */}
          <form action={async () => {
            "use server"
            const res = await copyContractToPlanning(id);
            if (res.success) {
              redirect(`/planning/from-contract/${res.id}`);
            }
          }}>
            <button 
              type="submit"
              className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white px-5 py-2.5 rounded-xl transition-all text-sm font-bold shadow-lg shadow-[#0EA5E9]/20 active:scale-95"
            >
              <CopyPlus size={16} />
              สร้างแผนงานจากสัญญานี้
            </button>
          </form>

          {/* ✏️ ปุ่มแก้ไขสัญญา (จะโชว์เฉพาะตอนที่ยังไม่โดนล็อก) */}
          {!isLocked ? (
            <Link 
              href={`/contracts/${id}/edit`}
              className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black px-5 py-2.5 rounded-xl border border-amber-500/20 transition-all text-sm font-bold shadow-lg shadow-amber-500/5 active:scale-95"
            >
              <Edit3 size={16} />
              แก้ไขข้อมูลสัญญา
            </Link>
          ) : (
            <div className="flex items-center gap-2 bg-gray-800 text-gray-500 px-5 py-2.5 rounded-xl border border-gray-700 text-sm font-bold cursor-not-allowed">
              <Lock size={16} />
              สัญญานี้ถูกล็อกการแก้ไขแล้ว
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-900 rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden relative">
        <div className="h-2 w-full bg-gradient-to-r from-[#0EA5E9] to-blue-700"></div>

        <div className="p-10 md:p-12">
          
          {/* --- Section 1: Header (ข้อมูลหลัก) --- */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-[#0EA5E9]/10 text-[#38BDF8] text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-[#38BDF8]/20">
                  {contract.category_code}
                </span>
                <span className="text-gray-600 text-xs font-mono tracking-tighter uppercase">Entry_ID: {contract.ct_aid.toString()}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6 italic tracking-tight">{contract.ct_name}</h1>
              <div className="flex items-center gap-2 text-gray-500 font-mono italic">
                <FileText size={16} className="text-[#38BDF8]" /> <span>Ref No: {contract.ct_number}</span>
              </div>
            </div>
            <div className="bg-black/40 p-8 rounded-[2rem] border border-gray-800 min-w-[280px] backdrop-blur-md">
               <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-4">Current Status</p>
               <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${contract.contract_status === 'ACTIVE' ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]' : contract.contract_status === 'COMPLETED' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'bg-orange-500'}`}></div>
                  <span className="text-2xl font-bold text-white tracking-tight uppercase">{contract.contract_status || 'ACTIVE'}</span>
               </div>
               <p className="text-[9px] text-gray-700 mt-4 uppercase font-bold italic tracking-widest">CTMNG_SECURE_ENCRYPTED</p>
            </div>
          </div>

          {/* --- Section 2: Info Cards --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
            
            <div className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 shadow-inner group hover:border-[#38BDF8]/30 transition-all">
              <p className="text-[11px] text-gray-500 uppercase font-black tracking-widest mb-3 italic">Coordinator</p>
              <div className="flex items-center gap-4 text-xl md:text-2xl text-white font-bold tracking-tight">
                <div className="p-3 bg-[#0EA5E9]/10 rounded-xl text-[#38BDF8] group-hover:scale-110 transition-transform">
                  <User size={24} />
                </div> 
                <span className="truncate">{contract.coordinator_name}</span>
              </div>
            </div>

            <div className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 shadow-inner group hover:border-[#10B981]/30 transition-all">
              <p className="text-[11px] text-emerald-600 uppercase font-black tracking-widest mb-3 italic">Start Date</p>
              <div className="flex items-center gap-4 text-xl md:text-2xl text-white font-bold tracking-tight">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 group-hover:scale-110 transition-transform">
                  <Calendar size={24} /> 
                </div>
                <span className="truncate">{formatDate(contract.start_date)}</span>
              </div>
            </div>

            <div className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 shadow-inner group hover:border-[#EB005D]/30 transition-all">
              <p className="text-[11px] text-pink-600 uppercase font-black tracking-widest mb-3 italic">End Date</p>
              <div className="flex items-center gap-4 text-xl md:text-2xl text-white font-bold tracking-tight">
                <div className="p-3 bg-pink-500/10 rounded-xl text-[#EB005D] group-hover:scale-110 transition-transform">
                  <Clock size={24} /> 
                </div>
                <span className="truncate">{formatDate(contract.end_date)}</span>
              </div>
            </div>

          </div>

          {/* --- Section 3: คณะกรรมการ (Committee) --- */}
          <div className="mb-14 space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
              <div className="p-2 bg-[#0EA5E9]/10 rounded-lg">
                <Users className="text-[#0EA5E9]" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white italic tracking-tight uppercase">คณะกรรมการตรวจรับพัสดุ</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {committees.map((member) => (
                <div key={member.cmit_aid.toString()} className="flex items-center justify-between p-5 bg-white/[0.01] rounded-2xl border border-white/5 group hover:border-[#38BDF8]/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-[#38BDF8] font-black border border-gray-700 group-hover:scale-110 transition-transform">
                      {member.cmit_name?.substring(0, 1)}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{member.cmit_name}</p>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">{member.cmit_position || 'กรรมการ'}</p>
                    </div>
                  </div>
                  {/* 🔐 ซ่อนปุ่มลบกรรมการถ้าสัญญาโดนล็อก */}
                  {!isLocked && (
                    <form action={deleteCommittee}>
                      <input type="hidden" name="cmit_aid" value={member.cmit_aid.toString()} />
                      <input type="hidden" name="base_id" value={id} />
                      <button type="submit" className="text-gray-700 hover:text-red-500 p-2 transition-colors"><Trash2 size={16} /></button>
                    </form>
                  )}
                </div>
              ))}
            </div>

            {/* 🔐 ซ่อนฟอร์มเพิ่มกรรมการถ้าสัญญาโดนล็อก */}
            {!isLocked && (
              <form action={addCommittee} className="bg-black/20 p-6 rounded-[2rem] border border-dashed border-gray-800 flex flex-col md:flex-row gap-4">
                <input type="hidden" name="base_id" value={id} />
                <input name="cmit_name" placeholder="ชื่อ-นามสกุล..." required className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-5 py-3 text-white focus:border-[#0EA5E9] outline-none text-sm transition-all" />
                <select name="cmit_position" className="md:w-64 bg-gray-900 border border-gray-800 rounded-xl px-5 py-3 text-white focus:border-[#0EA5E9] outline-none text-sm cursor-pointer">
                  <option value="กรรมการ">กรรมการ</option>
                  <option value="ประธานกรรมการ">ประธานกรรมการ</option>
                  <option value="กรรมการและเลขานุการ">กรรมการและเลขานุการ</option>
                </select>
                <button type="submit" className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-black rounded-xl px-8 py-3 flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95">
                  <Plus size={18} /> เพิ่มรายชื่อ
                </button>
              </form>
            )}
          </div>

          {/* --- Section 4: เอกสารแนบสัญญา (MinIO) --- */}
          <div className="mb-14 space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
              <div className="p-2 bg-[#0EA5E9]/10 rounded-lg">
                <HardDrive className="text-[#0EA5E9]" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white italic tracking-tight uppercase">เอกสารแนบสัญญา (MINIO_STORE)</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {files.map(async (file) => {
                const downloadUrl = await getDownloadUrl(file.file_path);
                return (
                  <div key={file.file_aid.toString()} className="flex items-center justify-between p-4 bg-white/[0.01] rounded-2xl border border-white/5 hover:bg-white/[0.03] transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-800/50 rounded-xl text-[#38BDF8] group-hover:bg-[#38BDF8]/10 transition-colors"><File size={20} /></div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-[#38BDF8] transition-colors">{file.file_name}</p>
                        <p className="text-[10px] text-gray-600 uppercase font-mono italic">{(Number(file.file_size || 0) / 1024 / 1024).toFixed(2)} MB • {file.created_at.toLocaleDateString('th-TH')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={downloadUrl} target="_blank" className="p-3 text-gray-500 hover:text-[#38BDF8] transition-colors" title="Download"><Download size={18} /></a>
                      {/* 🔐 ซ่อนปุ่มลบไฟล์ถ้าสัญญาโดนล็อก */}
                      {!isLocked && (
                        <form action={deleteFile}>
                          <input type="hidden" name="file_aid" value={file.file_aid.toString()} />
                          <input type="hidden" name="base_id" value={id} />
                          <input type="hidden" name="file_path" value={file.file_path} />
                          <button type="submit" className="p-3 text-gray-700 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </form>
                      )}
                    </div>
                  </div>
                );
              })}
              {files.length === 0 && <div className="py-12 text-center border-2 border-dashed border-gray-800 rounded-[2rem] text-gray-700 italic text-sm">NO_ATTACHMENTS_FOUND_FOR_THIS_CONTRACT</div>}
            </div>

            {/* 🔐 ซ่อนฟอร์มอัปโหลดไฟล์ถ้าสัญญาโดนล็อก */}
            {!isLocked && (
              <form action={uploadFile} className="bg-[#0EA5E9]/5 p-6 rounded-[2rem] border border-[#0EA5E9]/20 flex flex-col md:flex-row items-center gap-4 shadow-inner">
                <input type="hidden" name="base_id" value={id} />
                <label className="flex-1 w-full flex items-center justify-center h-14 px-5 bg-gray-900 border-2 border-gray-800 border-dashed rounded-2xl cursor-pointer hover:border-[#0EA5E9] transition-all group">
                  <span className="text-sm text-gray-500 flex items-center gap-3 group-hover:text-white transition-colors"><FileUp size={20} /> เลือกไฟล์ PDF หรือรูปภาพประกอบสัญญา...</span>
                  <input type="file" name="file" className="hidden" required />
                </label>
                <button type="submit" className="w-full md:w-auto px-10 h-14 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-black rounded-2xl transition-all shadow-xl shadow-[#0EA5E9]/20 flex items-center justify-center gap-3 active:scale-95">
                  <Plus size={20} /> อัปโหลดไฟล์
                </button>
              </form>
            )}
          </div>

          {/* --- Section 5: งบประมาณ (Items) --- */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
              <div className="p-2 bg-[#0EA5E9]/10 rounded-lg">
                <BadgeDollarSign className="text-[#0EA5E9]" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white italic tracking-tight uppercase">Budget & Equipment Items</h3>
            </div>
            <div className="bg-black/40 rounded-[2.5rem] border border-gray-800 overflow-hidden shadow-2xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-800/50 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">
                  <tr>
                    <th className="px-10 py-7">ITEM_CATEGORY</th>
                    <th className="px-10 py-7">DESCRIPTION_AGREEMENT</th>
                    <th className="px-10 py-7 text-right uppercase">COST_AMOUNT (THB)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {contract.items.map((item) => (
                    <tr key={item.item_autoid.toString()} className="group hover:bg-[#0EA5E9]/5 transition-all">
                      <td className="px-10 py-8 font-black text-white italic">
                        <div className="flex items-center gap-3">
                          <Briefcase size={16} className="text-[#38BDF8] group-hover:rotate-12 transition-transform" />
                          {item.item_type}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-gray-500 group-hover:text-gray-300 transition-colors leading-relaxed">{item.item_agreement}</td>
                      <td className="px-10 py-8 text-right font-mono font-black text-3xl text-white tracking-tighter">
                        {Number(item.item_cost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-gray-800/20 p-6 flex justify-between items-center border-t border-gray-800/50">
                 <p className="text-gray-700 text-[10px] uppercase font-black tracking-[0.3em]">Secure Data Node: {contract.ct_aid.toString()}</p>
                 <p className="text-gray-600 text-[10px] font-bold italic">Total {contract.items.length} records found.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="mt-12 text-center opacity-20 hover:opacity-100 transition-opacity">
         <p className="text-xs font-black uppercase tracking-[0.8em] text-white">CTMNG // ENTERPRISE_RESOURCE_PLANNING</p>
      </div>
    </div>
  );
}
