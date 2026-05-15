import { prisma } from "../../../../lib/prisma";
import { 
  ArrowLeft, FileText, User, Calendar, BadgeDollarSign, 
  Briefcase, Users, Plus, Trash2, ShieldCheck,
  HardDrive, FileUp, File, Download, Edit3, CopyPlus, Clock, Lock,
  History 
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { addCommittee, deleteCommittee, uploadFile, deleteFile, getDownloadUrl } from "../actions";
import { copyContractToPlanning } from "../../planning/actions";

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contract = await prisma.tb_contract.findUnique({
    where: { ct_aid: BigInt(id) }, include: { items: { where: { is_deleted: 0 } } }
  });

  if (!contract || contract.is_deleted === 1) notFound();

  const committees = await prisma.tb_committees.findMany({
    where: { base_id: BigInt(id), base_type: 'CON', is_deleted: 0 }, orderBy: { created_at: 'asc' }
  });

  const files = await prisma.tb_files.findMany({
    where: { base_id: BigInt(id), base_type: 'CON', is_deleted: 0 }, orderBy: { created_at: 'desc' }
  });

  const trackingLogs = await prisma.tb_tracking.findMany({
    where: { base_id: BigInt(id), base_type: 'CON', is_deleted: 0 }, orderBy: { trk_date: 'desc' }
  });

  const formatDate = (date: Date | null) => {
    if (!date) return "ไม่ระบุ";
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const isLocked = contract.contract_status === 'COMPLETED' || contract.contract_status === 'CANCELLED';

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-sky-500 transition-all group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-sm font-bold uppercase tracking-tighter">Back to Overview</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <form action={async () => {
            "use server"; const res = await copyContractToPlanning(id);
            if (res.success) { redirect(`/planning/from-contract/${res.id}`); }
          }}>
            <button type="submit" className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl transition-all text-sm font-bold shadow-lg shadow-sky-500/20 active:scale-95">
              <CopyPlus size={16} /> สร้างแผนงานจากสัญญานี้
            </button>
          </form>

          {!isLocked ? (
            <Link href={`/contracts/${id}/edit`} className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl border border-slate-200 transition-all text-sm font-bold shadow-sm active:scale-95">
              <Edit3 size={16} /> แก้ไขข้อมูลสัญญา
            </Link>
          ) : (
            <div className="flex items-center gap-2 bg-slate-100 text-slate-400 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold cursor-not-allowed">
              <Lock size={16} /> สัญญานี้ถูกล็อกการแก้ไขแล้ว
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-slate-300/30 overflow-hidden relative">
        <div className="h-2 w-full bg-gradient-to-r from-sky-400 to-[#EB005D]"></div>

        <div className="p-10 md:p-12">
          
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-sky-50 text-sky-600 text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-sky-100">
                  {contract.category_code}
                </span>
                <span className="text-slate-400 text-xs font-mono tracking-tighter uppercase">Entry_ID: {contract.ct_aid.toString()}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight mb-6 italic tracking-tight">{contract.ct_name}</h1>
              <div className="flex items-center gap-2 text-slate-500 font-mono italic">
                <FileText size={16} className="text-sky-500" /> <span>Ref No: {contract.ct_number}</span>
              </div>
            </div>
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 min-w-[280px]">
               <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-4">Current Status</p>
               <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${contract.contract_status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : contract.contract_status === 'COMPLETED' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                  <span className="text-2xl font-bold text-slate-800 tracking-tight uppercase">{contract.contract_status || 'ACTIVE'}</span>
               </div>
               <p className="text-[9px] text-slate-400 mt-4 uppercase font-bold italic tracking-widest">CTMNG_SECURE_ENCRYPTED</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
            <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm group hover:border-sky-300 transition-all">
              <p className="text-[11px] text-slate-400 uppercase font-black tracking-widest mb-3 italic">Coordinator</p>
              <div className="flex items-center gap-4 text-xl md:text-2xl text-slate-800 font-bold tracking-tight">
                <div className="p-3 bg-sky-50 rounded-xl text-sky-500 group-hover:scale-110 transition-transform"><User size={24} /></div> 
                <span className="truncate">{contract.coordinator_name}</span>
              </div>
            </div>
            <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm group hover:border-emerald-300 transition-all">
              <p className="text-[11px] text-emerald-600 uppercase font-black tracking-widest mb-3 italic">Start Date</p>
              <div className="flex items-center gap-4 text-xl md:text-2xl text-slate-800 font-bold tracking-tight">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500 group-hover:scale-110 transition-transform"><Calendar size={24} /></div>
                <span className="truncate">{formatDate(contract.start_date)}</span>
              </div>
            </div>
            <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm group hover:border-[#EB005D]/30 transition-all">
              <p className="text-[11px] text-pink-600 uppercase font-black tracking-widest mb-3 italic">End Date</p>
              <div className="flex items-center gap-4 text-xl md:text-2xl text-slate-800 font-bold tracking-tight">
                <div className="p-3 bg-pink-50 rounded-xl text-[#EB005D] group-hover:scale-110 transition-transform"><Clock size={24} /></div>
                <span className="truncate">{formatDate(contract.end_date)}</span>
              </div>
            </div>
          </div>

          <div className="mb-14 space-y-8">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="p-2 bg-sky-50 rounded-lg"><Users className="text-sky-500" size={28} /></div>
              <h3 className="text-2xl font-bold text-slate-800 italic tracking-tight uppercase">คณะกรรมการตรวจรับพัสดุ</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {committees.map((member) => (
                <div key={member.cmit_aid.toString()} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 shadow-sm group hover:border-sky-300 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-sky-500 font-black border border-slate-200 group-hover:scale-110 transition-transform">{member.cmit_name?.substring(0, 1)}</div>
                    <div>
                      <p className="text-slate-800 font-bold text-sm">{member.cmit_name}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">{member.cmit_position || 'กรรมการ'}</p>
                    </div>
                  </div>
                  {!isLocked && (
                    <form action={deleteCommittee}>
                      <input type="hidden" name="cmit_aid" value={member.cmit_aid.toString()} />
                      <input type="hidden" name="base_id" value={id} />
                      <button type="submit" className="text-slate-400 hover:text-red-500 p-2 transition-colors"><Trash2 size={16} /></button>
                    </form>
                  )}
                </div>
              ))}
            </div>
            {!isLocked && (
              <form action={addCommittee} className="bg-slate-50 p-6 rounded-[2rem] border border-dashed border-slate-200 flex flex-col md:flex-row gap-4">
                <input type="hidden" name="base_id" value={id} />
                <input name="cmit_name" placeholder="ชื่อ-นามสกุล..." required className="flex-1 bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-800 focus:border-sky-500 outline-none text-sm transition-all shadow-inner" />
                <select name="cmit_position" className="md:w-64 bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-800 focus:border-sky-500 outline-none text-sm cursor-pointer shadow-inner">
                  <option value="กรรมการ">กรรมการ</option>
                  <option value="ประธานกรรมการ">ประธานกรรมการ</option>
                  <option value="กรรมการและเลขานุการ">กรรมการและเลขานุการ</option>
                </select>
                <button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white font-black rounded-xl px-8 py-3 flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"><Plus size={18} /> เพิ่มรายชื่อ</button>
              </form>
            )}
          </div>

          <div className="mb-14 space-y-8">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="p-2 bg-sky-50 rounded-lg"><HardDrive className="text-sky-500" size={28} /></div>
              <h3 className="text-2xl font-bold text-slate-800 italic tracking-tight uppercase">เอกสารแนบสัญญา (MINIO_STORE)</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {files.map(async (file) => {
                const downloadUrl = await getDownloadUrl(file.file_path);
                return (
                  <div key={file.file_aid.toString()} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:bg-sky-50/50 transition-all group shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-50 rounded-xl text-sky-500 border border-slate-100 group-hover:bg-white transition-colors"><File size={20} /></div>
                      <div>
                        <p className="text-sm font-bold text-slate-700 group-hover:text-sky-600 transition-colors">{file.file_name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-mono italic">{(Number(file.file_size || 0) / 1024 / 1024).toFixed(2)} MB • {file.created_at.toLocaleDateString('th-TH')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={downloadUrl} target="_blank" className="p-3 text-slate-400 hover:text-sky-500 transition-colors" title="Download"><Download size={18} /></a>
                      {!isLocked && (
                        <form action={deleteFile}>
                          <input type="hidden" name="file_aid" value={file.file_aid.toString()} />
                          <input type="hidden" name="base_id" value={id} />
                          <input type="hidden" name="file_path" value={file.file_path} />
                          <button type="submit" className="p-3 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </form>
                      )}
                    </div>
                  </div>
                );
              })}
              {files.length === 0 && <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 italic text-sm">NO_ATTACHMENTS_FOUND_FOR_THIS_CONTRACT</div>}
            </div>
            {!isLocked && (
              <form action={uploadFile} className="bg-sky-50 p-6 rounded-[2rem] border border-sky-100 flex flex-col md:flex-row items-center gap-4">
                <input type="hidden" name="base_id" value={id} />
                <label className="flex-1 w-full flex items-center justify-center h-14 px-5 bg-white border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer hover:border-sky-400 transition-all group">
                  <span className="text-sm text-slate-400 flex items-center gap-3 group-hover:text-sky-600 transition-colors"><FileUp size={20} /> เลือกไฟล์ PDF หรือรูปภาพประกอบสัญญา...</span>
                  <input type="file" name="file" className="hidden" required />
                </label>
                <button type="submit" className="w-full md:w-auto px-10 h-14 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-3 active:scale-95"><Plus size={20} /> อัปโหลดไฟล์</button>
              </form>
            )}
          </div>

          <div className="mb-14 space-y-8">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="p-2 bg-sky-50 rounded-lg"><BadgeDollarSign className="text-sky-500" size={28} /></div>
              <h3 className="text-2xl font-bold text-slate-800 italic tracking-tight uppercase">Budget & Equipment Items</h3>
            </div>
            <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-inner">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/50 text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
                  <tr>
                    <th className="px-10 py-7 border-b border-slate-100">ITEM_CATEGORY</th>
                    <th className="px-10 py-7 border-b border-slate-100">DESCRIPTION_AGREEMENT</th>
                    <th className="px-10 py-7 text-right uppercase border-b border-slate-100">COST_AMOUNT (THB)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contract.items.map((item) => (
                    <tr key={item.item_autoid.toString()} className="group hover:bg-white transition-all">
                      <td className="px-10 py-8 font-black text-slate-700 italic"><div className="flex items-center gap-3"><Briefcase size={16} className="text-sky-500 group-hover:rotate-12 transition-transform" />{item.item_type}</div></td>
                      <td className="px-10 py-8 text-slate-500 group-hover:text-slate-700 transition-colors leading-relaxed">{item.item_agreement}</td>
                      <td className="px-10 py-8 text-right font-mono font-black text-3xl text-slate-800 tracking-tighter">{Number(item.item_cost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-8 mt-16 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-2 bg-pink-50 rounded-lg"><History className="text-[#EB005D]" size={28} /></div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 italic tracking-tight uppercase">Audit Trail & Status History</h3>
                <p className="text-xs text-slate-400 font-mono tracking-widest mt-1">ประวัติการปรับปรุงสถานะสัญญา (ระบบบันทึกอัตโนมัติ)</p>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
              {trackingLogs.length > 0 ? (
                <div className="relative border-l-2 border-slate-200 ml-4 space-y-8">
                  {trackingLogs.map((log, index) => (
                    <div key={log.trk_aid.toString()} className="relative pl-8 group">
                      <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-slate-50 transition-colors ${index === 0 ? 'bg-[#EB005D] shadow-sm' : 'bg-slate-300'}`}></div>
                      
                      <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-pink-200 hover:shadow-sm transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                            log.trk_status === 'COMPLETED' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            log.trk_status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            log.trk_status === 'CANCELLED' ? 'bg-red-50 text-red-600 border border-red-100' :
                            'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                            {log.trk_status}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono italic">
                            {formatDateTime(log.trk_date)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 font-medium">
                          {log.trk_detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm italic">ยังไม่มีประวัติการเปลี่ยนสถานะของสัญญานี้</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      
      <div className="mt-12 text-center opacity-40 hover:opacity-100 transition-opacity">
         <p className="text-xs font-black uppercase tracking-[0.8em] text-slate-400">CTMNG // ENTERPRISE_RESOURCE_PLANNING</p>
      </div>
    </div>
  );
}
