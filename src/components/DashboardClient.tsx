"use client";

import { ProgressBar } from "@tremor/react";
import { Eye, AlertCircle, ArrowRight, TrendingUp, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import DeleteContractButton from "./DeleteContractButton";

interface DashboardProps {
  totalContracts: number;
  recentContracts: any[];
  expiringSoon: any[];
}

export default function DashboardClient({ totalContracts, recentContracts, expiringSoon }: DashboardProps) {
  const today = new Date();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* --- ฝั่งซ้าย: ตารางสัญญาล่าสุด --- */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden h-full">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3 italic uppercase tracking-tight">
              <TrendingUp className="text-[#EB005D] w-5 h-5" />
              Recent <span className="text-[#EB005D]">Contracts</span>
            </h2>
            <Link href="/contracts/new" className="text-[10px] font-black uppercase tracking-widest bg-[#EB005D] hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95">
              + New Contract
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-slate-400 font-bold text-[10px] uppercase tracking-[0.15em] border-b border-slate-100">
                <tr>
                  <th className="px-6 py-5">Actions</th> 
                  <th className="px-6 py-5">เลขที่สัญญา</th>
                  <th className="px-6 py-5">ชื่อโครงการ</th>
                  <th className="px-6 py-5">วันหมดอายุ</th>
                  <th className="px-6 py-5">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {recentContracts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">ไม่พบข้อมูลสัญญาในระบบ</td>
                  </tr>
                ) : (
                  recentContracts.map((contract) => (
                    <tr key={contract.ct_aid} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 flex items-center gap-2">
                        <Link href={`/contracts/${contract.ct_aid}`} className="p-2 text-slate-400 hover:text-white bg-slate-100 hover:bg-[#EB005D] rounded-lg transition-all"><Eye size={14} /></Link>
                        <DeleteContractButton id={contract.ct_aid.toString()} />
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">{contract.ct_number}</td>
                      <td className="px-6 py-4 max-w-xs truncate text-slate-500 group-hover:text-slate-800">{contract.ct_name}</td>
                      <td className="px-6 py-4"><div className="flex items-center gap-1.5 text-slate-500 text-xs">{contract.end_date && <Calendar className="w-3 h-3" />}{formatDate(contract.end_date)}</div></td>
                      <td className="px-6 py-4"><span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">{contract.contract_status || 'ACTIVE'}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- ฝั่งขวา: สัญญาใกล้หมดอายุ --- */}
      <div className="space-y-6">
        <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-[2rem] relative overflow-hidden h-full">
          {/* แถบสีชมพูด้านบน */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#EB005D]"></div>
          
          <div className="p-6">
            <div className="flex items-center mb-8 mt-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#EB005D] rounded-xl shadow-lg shadow-pink-500/20"><AlertCircle className="text-white w-5 h-5" /></div>
                <div>
                  <h3 className="text-slate-800 font-black italic tracking-tight uppercase text-lg">Expiring <span className="text-[#EB005D]">Soon</span></h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">สัญญาใกล้หมดอายุ (30 วัน)</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {expiringSoon.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-3xl mt-10">
                  <FileText className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-bold italic tracking-tight">ไม่พบสัญญาที่ใกล้หมดอายุ</p>
                </div>
              ) : (
                expiringSoon.map((contract) => {
                  const daysLeft = contract.end_date ? Math.ceil((new Date(contract.end_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 0;
                  
                  return (
                    <div key={contract.ct_aid} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-pink-200 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 pr-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase">{contract.ct_number}</p>
                          <p className="text-sm font-bold text-slate-700 truncate">{contract.ct_name}</p>
                          
                          {/* 🚀 วันที่หมดอายุ */}
                          <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3 h-3 text-[#EB005D]" /> 
                            หมดอายุ: {formatDate(contract.end_date)}
                          </p>
                        </div>
                        
                        {/* 🚀 ป้ายบอกจำนวนวัน (Badge) */}
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-[10px] font-black bg-pink-50 text-[#EB005D] border border-pink-100 shadow-sm">
                            {daysLeft} วัน
                          </span>
                        </div>
                      </div>
                      
                      {/* หลอด Progress Bar */}
                      <ProgressBar value={Math.max(0, 100 - (daysLeft * 3.3))} color="pink" className="h-1.5 mt-3" />
                      
                      <Link href={`/planning/new?from=${contract.ct_aid}`} className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-[#EB005D] text-slate-500 hover:text-white rounded-xl text-[10px] font-black transition-all uppercase tracking-widest border border-slate-100 hover:border-transparent">
                        เริ่มทำแผนงานต่อ <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
