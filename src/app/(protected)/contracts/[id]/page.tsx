import { prisma } from "../../../../lib/prisma";
import { 
  ArrowLeft, FileText, User, Calendar, BadgeDollarSign, 
  Briefcase, Users, Plus, Trash2, ShieldCheck,
  HardDrive, FileUp, File, Download
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
// Import Actions ทั้งหมดที่เราทำไว้
import { 
  addCommittee, 
  deleteCommittee, 
  uploadFile, 
  deleteFile, 
  getDownloadUrl 
} from "../actions";

export default async function ContractDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. แกะค่า ID
  const { id } = await params;

  // 2. ดึงข้อมูลสัญญา + รายการย่อย
  const contract = await prisma.tb_contract.findUnique({
    where: { ct_aid: BigInt(id) },
    include: { items: true }
  });

  if (!contract || contract.is_deleted === 1) notFound();

  // 3. ดึงรายชื่อกรรมการ
  const committees = await prisma.tb_committees.findMany({
    where: { base_id: BigInt(id), base_type: 'CON', is_deleted: 0 },
    orderBy: { created_at: 'asc' }
  });

  // 4. ดึงรายการไฟล์จากฐานข้อมูล
  const files = await prisma.tb_files.findMany({
    where: { base_id: BigInt(id), base_type: 'CON', is_deleted: 0 },
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- ปุ่มย้อนกลับ --- */}
      <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-[#38BDF8] mb-8 transition-all group w-fit">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        <span className="text-sm font-medium">กลับไปหน้าภาพรวมระบบ</span>
      </Link>

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
                <span className="text-gray-600 text-xs font-mono tracking-tighter">ID: {contract.ct_aid.toString()}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">{contract.ct_name}</h1>
              <div className="flex items-center gap-2 text-gray-500 font-mono italic">
                <FileText size={16} /> <span>Ref No: {contract.ct_number}</span>
              </div>
            </div>
            <div className="bg-black/40 p-8 rounded-[2rem] border border-gray-800 min-w-[280px]">
               <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-4">Status</p>
               <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-2xl font-bold text-white">เปิดใช้งานปกติ</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
            <div className="p-8 bg-white/[0.03] rounded-3xl border border-white/5 shadow-inner">
              <p className="text-[11px] text-gray-500 uppercase font-black tracking-widest mb-3">ผู้ประสานงาน</p>
              <div className="flex items-center gap-4 text-2xl text-white font-bold tracking-tight">
                <User className="text-[#38BDF8]" size={24} /> {contract.coordinator_name}
              </div>
            </div>
            <div className="p-8 bg-white/[0.03] rounded-3xl border border-white/5 shadow-inner">
              <p className="text-[11px] text-gray-500 uppercase font-black tracking-widest mb-3">วันที่เริ่มบันทึก</p>
              <div className="flex items-center gap-4 text-2xl text-white font-bold tracking-tight">
                <Calendar className="text-[#38BDF8]" size={24} /> {contract.created_at.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* --- Section 2: คณะกรรมการ (Committee) --- */}
          <div className="mb-14 space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
              <Users className="text-[#0EA5E9]" size={28} />
              <h3 className="text-2xl font-bold text-white italic">คณะกรรมการตรวจรับพัสดุ</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {committees.map((member) => (
                <div key={member.cmit_aid.toString()} className="flex items-center justify-between p-5 bg-white/[0.02] rounded-2xl border border-white/5 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-[#38BDF8] font-bold border border-gray-700">
                      {member.cmit_name?.substring(0, 1)}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{member.cmit_name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{member.cmit_position || 'กรรมการ'}</p>
                    </div>
                  </div>
                  <form action={deleteCommittee}>
                    <input type="hidden" name="cmit_aid" value={member.cmit_aid.toString()} />
                    <input type="hidden" name="base_id" value={id} />
                    <button type="submit" className="text-gray-600 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                  </form>
                </div>
              ))}
            </div>

            <form action={addCommittee} className="bg-black/40 p-6 rounded-3xl border border-dashed border-gray-800 flex flex-col md:flex-row gap-4">
              <input type="hidden" name="base_id" value={id} />
              <input name="cmit_name" placeholder="ชื่อ-นามสกุล" required className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#0EA5E9] outline-none text-sm" />
              <select name="cmit_position" className="md:w-64 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#0EA5E9] outline-none text-sm">
                <option value="กรรมการ">กรรมการ</option>
                <option value="ประธานกรรมการ">ประธานกรรมการ</option>
              </select>
              <button type="submit" className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl px-8 py-3 flex items-center justify-center gap-2 transition-all">
                <Plus size={18} /> เพิ่มชื่อ
              </button>
            </form>
          </div>

          {/* --- Section 3: เอกสารแนบสัญญา (MinIO - Task 2.9) --- */}
          <div className="mb-14 space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
              <HardDrive className="text-[#0EA5E9]" size={28} />
              <h3 className="text-2xl font-bold text-white italic">เอกสารแนบสัญญา (Object Storage)</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {files.map(async (file) => {
                const downloadUrl = await getDownloadUrl(file.file_path);
                return (
                  <div key={file.file_aid.toString()} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-800 rounded-xl text-[#38BDF8]"><File size={20} /></div>
                      <div>
                        <p className="text-sm font-bold text-white">{file.file_name}</p>
                        <p className="text-[10px] text-gray-500 uppercase italic">{(Number(file.file_size || 0) / 1024 / 1024).toFixed(2)} MB • {file.created_at.toLocaleDateString('th-TH')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={downloadUrl} target="_blank" className="p-2 text-gray-400 hover:text-[#38BDF8]"><Download size={18} /></a>
                      <form action={deleteFile}>
                        <input type="hidden" name="file_aid" value={file.file_aid.toString()} /><input type="hidden" name="base_id" value={id} /><input type="hidden" name="file_path" value={file.file_path} />
                        <button type="submit" className="p-2 text-gray-600 hover:text-red-500"><Trash2 size={18} /></button>
                      </form>
                    </div>
                  </div>
                );
              })}
              {files.length === 0 && <div className="py-10 text-center border-2 border-dashed border-gray-800 rounded-3xl text-gray-600 italic">ยังไม่มีเอกสารแนบ</div>}
            </div>

            <form action={uploadFile} className="bg-[#0EA5E9]/5 p-6 rounded-3xl border border-[#0EA5E9]/20 flex flex-col md:flex-row items-center gap-4">
              <input type="hidden" name="base_id" value={id} />
              <label className="flex-1 w-full flex items-center justify-center h-12 px-4 bg-gray-900 border-2 border-gray-700 border-dashed rounded-xl cursor-pointer hover:border-[#0EA5E9]">
                <span className="text-sm text-gray-400 flex items-center gap-2"><FileUp size={20} /> คลิกเพื่อเลือกไฟล์...</span>
                <input type="file" name="file" className="hidden" required />
              </label>
              <button type="submit" className="w-full md:w-auto px-10 h-12 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-black rounded-xl transition-all shadow-lg shadow-[#0EA5E9]/20">
                อัปโหลดไฟล์
              </button>
            </form>
          </div>

          {/* --- Section 4: งบประมาณ (Items) --- */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
              <BadgeDollarSign className="text-[#0EA5E9]" size={28} />
              <h3 className="text-2xl font-bold text-white italic">งบประมาณและรายการอุปกรณ์</h3>
            </div>
            <div className="bg-black/50 rounded-[2rem] border border-gray-800 overflow-hidden shadow-inner">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-800/80 text-[10px] text-gray-400 uppercase tracking-widest font-black">
                  <tr><th className="px-10 py-6">ประเภท</th><th className="px-10 py-6">รายละเอียด</th><th className="px-10 py-6 text-right">จำนวนเงิน (บาท)</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {contract.items.map((item) => (
                    <tr key={item.item_autoid.toString()} className="hover:bg-[#0EA5E9]/5 transition-colors">
                      <td className="px-10 py-8 font-bold text-white italic"><div className="flex items-center gap-2"><Briefcase size={14} className="text-[#38BDF8]" />{item.item_type}</div></td>
                      <td className="px-10 py-8 text-gray-400">{item.item_agreement}</td>
                      <td className="px-10 py-8 text-right font-mono font-black text-2xl text-white">{Number(item.item_cost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
