"use client";

import { useRef } from "react";
import { addTrackingRecord, deleteTrackingRecord } from "../../app/(protected)/tracking/actions";
import { CheckCircle2, Clock, FileText, Send, Trash2, Wallet } from "lucide-react";

type TrackingRecord = {
  trk_aid: bigint;
  trk_status: string;
  trk_detail: string;
  trk_date: Date;
  disbursed_amount: number | null;
};

export default function TrackingForm({ 
  baseId, 
  baseType, 
  records 
}: { 
  baseId: string; 
  baseType: 'CON' | 'PLA';
  records: TrackingRecord[];
}) {
  const formRef = useRef<HTMLFormElement>(null);

  // ฟังก์ชันช่วยจัดการสีตามสถานะ
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'IN_PROGRESS': return 'text-[#0EA5E9] bg-[#0EA5E9]/10 border-[#0EA5E9]/20'; // สีฟ้า Sky Blue
      case 'DELAYED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* --- ส่วนแสดงผล Timeline ความคืบหน้า --- */}
      <div className="bg-gray-900/40 p-8 rounded-[2.5rem] border border-gray-800">
        <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-8 flex items-center gap-3">
          <Clock className="text-[#0EA5E9]" />
          Tracking History
        </h3>

        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-800 before:to-transparent">
          {records.length === 0 ? (
            <p className="text-center text-sm text-gray-500 italic py-6">ยังไม่มีการบันทึกสถานะ</p>
          ) : (
            records.map((record) => (
              <div key={record.trk_aid.toString()} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0b1120] bg-gray-800 text-gray-500 group-[.is-active]:bg-[#0EA5E9] group-[.is-active]:text-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                  <CheckCircle2 size={18} />
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl border border-gray-800 bg-black/50 shadow-lg hover:border-[#0EA5E9]/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(record.trk_status)}`}>
                      {record.trk_status}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {new Date(record.trk_date).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                  <p className="text-sm text-white font-medium mb-3">{record.trk_detail}</p>
                  
                  {/* แสดงยอดเบิกจ่าย ถ้ามี */}
                  {record.disbursed_amount && record.disbursed_amount > 0 && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-800/50 text-[#0EA5E9]">
                      <Wallet size={14} />
                      <span className="text-xs font-bold uppercase tracking-widest">เบิกจ่าย:</span>
                      <span className="text-sm font-mono font-black">{Number(record.disbursed_amount).toLocaleString()} THB</span>
                    </div>
                  )}

                  <form action={deleteTrackingRecord} className="mt-3 text-right">
                    <input type="hidden" name="trk_aid" value={record.trk_aid.toString()} />
                    <input type="hidden" name="base_id" value={baseId} />
                    <input type="hidden" name="base_type" value={baseType} />
                    <button type="submit" className="text-gray-600 hover:text-red-400 transition-colors p-1" title="ลบบันทึก">
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- ส่วนฟอร์มบันทึกสถานะใหม่ --- */}
      <div className="bg-[#0EA5E9]/5 p-8 rounded-[2.5rem] border border-[#0EA5E9]/20 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0EA5E9] to-cyan-400"></div>
        <h3 className="text-sm font-black text-[#0EA5E9] uppercase tracking-widest mb-6 flex items-center gap-2">
          <FileText size={16} /> Update Progress
        </h3>
        
        <form 
          ref={formRef}
          action={async (formData) => {
            await addTrackingRecord(formData);
            formRef.current?.reset(); // ล้างฟอร์มหลังบันทึกเสร็จ
          }} 
          className="space-y-4"
        >
          <input type="hidden" name="base_id" value={baseId} />
          <input type="hidden" name="base_type" value={baseType} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">สถานะความคืบหน้า</label>
              <select name="trk_status" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#0EA5E9] outline-none transition-all text-sm appearance-none">
                <option value="PENDING">รอดำเนินการ (PENDING)</option>
                <option value="IN_PROGRESS">กำลังดำเนินการ (IN_PROGRESS)</option>
                <option value="PAYMENT">กำลังเบิกจ่าย (PAYMENT)</option>
                <option value="COMPLETED">เสร็จสิ้น (COMPLETED)</option>
                <option value="DELAYED">ล่าช้า/ติดปัญหา (DELAYED)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ยอดเงินเบิกจ่ายรอบนี้ (ถ้ามี)</label>
              <input type="number" step="0.01" name="disbursed_amount" placeholder="0.00" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#0EA5E9] outline-none transition-all text-sm font-mono" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">รายละเอียดการอัปเดต</label>
            <textarea name="trk_detail" rows={3} placeholder="ระบุรายละเอียดความคืบหน้า หรือปัญหาที่พบ..." className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#0EA5E9] outline-none transition-all text-sm resize-none" required></textarea>
          </div>

          <div className="pt-2 text-right">
            <button type="submit" className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-black py-3 px-8 rounded-xl transition-all shadow-lg shadow-[#0EA5E9]/20 flex items-center justify-center gap-2 ml-auto active:scale-95 text-sm uppercase tracking-widest">
              <Send size={16} /> บันทึกสถานะ
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
