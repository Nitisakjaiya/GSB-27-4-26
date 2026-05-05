"use client";

import { useRef } from "react";
import { addBudgetAllocation, deleteBudgetAllocation } from "../../app/(protected)/budget/actions";
import { Plus, Trash2, Coins, CalendarDays, Wallet } from "lucide-react";

export default function BudgetAllocationForm({ 
  baseId, 
  baseType, 
  allocations,
  totalBudget
}: { 
  baseId: string; 
  baseType: 'CON' | 'PLA';
  allocations: any[];
  totalBudget: number;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const currentYearTH = new Date().getFullYear() + 543;
  
  // คำนวณงบที่ใช้ไปแล้วและคงเหลือ
  const usedAmount = allocations.reduce((sum, item) => sum + Number(item.allocated_amount), 0);
  const remainingAmount = totalBudget - usedAmount;

  return (
    <div className="space-y-6">
      {/* สรุปยอดเงิน */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">งบประมาณรวม</p>
          <p className="text-xl font-mono font-black text-white">{totalBudget.toLocaleString()} <span className="text-xs text-gray-500">THB</span></p>
        </div>
        <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl">
          <p className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest mb-1">จัดสรรแล้ว</p>
          <p className="text-xl font-mono font-black text-emerald-400">{usedAmount.toLocaleString()} <span className="text-xs text-emerald-500/50">THB</span></p>
        </div>
        <div className={`p-5 rounded-2xl border ${remainingAmount < 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-blue-500/5 border-blue-500/20'}`}>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">คงเหลือ</p>
          <p className={`text-xl font-mono font-black ${remainingAmount < 0 ? 'text-red-400' : 'text-blue-400'}`}>{remainingAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* ตารางแสดงข้อมูล */}
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-800/50 text-[10px] text-gray-500 uppercase font-black tracking-widest">
            <tr>
              <th className="px-6 py-4">ปีงบประมาณ</th>
              <th className="px-6 py-4">ยอดเงิน (THB)</th>
              <th className="px-6 py-4">หมายเหตุ</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50 text-white">
            {allocations.map((item) => (
              <tr key={item.bg_aid.toString()} className="group hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-bold italic">ปี {item.budget_year}</td>
                <td className="px-6 py-4 font-mono font-bold text-emerald-400">{Number(item.allocated_amount).toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-500 text-xs">{item.bg_remark || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <form action={deleteBudgetAllocation}>
                    <input type="hidden" name="bg_aid" value={item.bg_aid.toString()} />
                    <input type="hidden" name="base_id" value={baseId} />
                    <input type="hidden" name="base_type" value={baseType} />
                    <button type="submit" className="text-gray-700 hover:text-red-400 p-1 transition-colors"><Trash2 size={14} /></button>
                  </form>
                </td>
              </tr>
            ))}
            
            {/* ฟอร์มเพิ่มข้อมูล */}
            <tr className="bg-emerald-500/[0.02]">
              <td colSpan={4} className="p-0">
                <form 
                  ref={formRef}
                  action={async (fd) => {
                    await addBudgetAllocation(fd);
                    formRef.current?.reset();
                  }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 items-center"
                >
                  <input type="hidden" name="base_id" value={baseId} />
                  <input type="hidden" name="base_type" value={baseType} />
                  
                  <select name="budget_year" className="bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500">
                    {[...Array(5)].map((_, i) => (
                      <option key={i} value={currentYearTH + i}>ปี {currentYearTH + i}</option>
                    ))}
                  </select>

                  <input type="number" step="0.01" name="allocated_amount" placeholder="ยอดเงินจัดสรร..." required className="bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500" />
                  
                  <input type="text" name="bg_remark" placeholder="หมายเหตุ (ถ้ามี)..." className="bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500" />

                  <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] uppercase py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95">
                    <Plus size={14} /> เพิ่มการจัดสรร
                  </button>
                </form>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
