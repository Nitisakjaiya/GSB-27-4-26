"use client";

import { 
  Badge, 
  Card, 
  Flex, 
  Title, 
  Text, 
  ProgressBar, 
  BadgeDelta,
} from "@tremor/react";
import { 
  Eye, 
  AlertCircle, 
  ArrowRight, 
  TrendingUp,
  Calendar,
  FileText
} from "lucide-react";
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
    return d.toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* --- ฝั่งซ้าย: ตารางสัญญาล่าสุด --- */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden h-full">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3 italic uppercase tracking-tight">
              <TrendingUp className="text-[#EB005D] w-5 h-5" />
              Recent <span className="text-[#EB005D]">Contracts</span>
            </h2>
            <Link href="/contracts/new" className="text-[10px] font-black uppercase tracking-widest bg-[#EB005D] hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-pink-500/20 active:scale-95">
              + New Contract
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase tracking-[0.15em]">
                <tr>
                  <th className="px-6 py-5 border-b border-slate-100">Actions</th> 
                  <th className="px-6 py-5 border-b border-slate-100">เลขที่สัญญา</th>
                  <th className="px-6 py-5 border-b border-slate-100">ชื่อโครงการ</th>
                  <th className="px-6 py-5 border-b border-slate-100">วันหมดอายุ</th>
                  <th className="px-6 py-5 border-b border-slate-100">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentContracts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">
                      ไม่พบข้อมูลสัญญาในระบบ
                    </td>
                  </tr>
                ) : (
                  recentContracts.map((contract) => (
                    <tr key={contract.ct_aid} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 flex items-center gap-2">
                        <Link 
                          href={`/contracts/${contract.ct_aid}`} 
                          className="p-2 text-slate-400 hover:text-white bg-slate-100 hover:bg-[#EB005D] rounded-lg transition-all"
                          title="ดูรายละเอียด"
                        >
                          <Eye size={14} />
                        </Link>
                        <DeleteContractButton id={contract.ct_aid.toString()} />
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800 tracking-tight">
                        {contract.ct_number}
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-slate-500 group-hover:text-slate-800 transition-colors">
                        {contract.ct_name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                          {contract.end_date && <Calendar className="w-3 h-3 text-slate-400" />}
                          {formatDate(contract.end_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          contract.contract_status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          contract.contract_status === 'COMPLETED' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                          'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {contract.contract_status || 'ACTIVE'}
                        </span>
                      </td>
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
        <Card className="relative overflow-hidden bg-pink-50/80 border-pink-100 ring-0 shadow-xl shadow-pink-500/10 backdrop-blur-xl h-full rounded-[2rem]" decoration="top" decorationColor="pink">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#EB005D]/5 blur-3xl rounded-full" />
          
          <Flex alignItems="center" className="mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#EB005D] rounded-xl shadow-lg shadow-pink-500/30">
                <AlertCircle className="text-white w-5 h-5 animate-pulse" />
              </div>
              <div>
                <Title className="text-slate-800 font-black italic tracking-tight uppercase text-lg">Expiring <span className="text-[#EB005D]">Soon</span></Title>
                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">สัญญาใกล้หมดอายุ (30 วัน)</Text>
              </div>
            </div>
          </Flex>

          <div className="space-y-4 relative z-10">
            {expiringSoon.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-pink-200 rounded-3xl mt-10 bg-white/50">
                <FileText className="w-8 h-8 text-[#EB005D]/20 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-bold italic tracking-tight">ไม่พบสัญญาที่ใกล้หมดอายุ</p>
              </div>
            ) : (
              expiringSoon.map((contract) => {
                const daysLeft = contract.end_date 
                  ? Math.ceil((new Date(contract.end_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                  : 0;

                return (
                  <div key={contract.ct_aid} className="group relative p-4 rounded-2xl bg-white border border-pink-100 hover:border-[#EB005D]/40 transition-all duration-300 shadow-sm">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <Text className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{contract.ct_number}</Text>
                          <Text className="text-sm font-bold text-slate-700 group-hover:text-[#EB005D] transition-colors truncate max-w-[150px]">
                            {contract.ct_name}
                          </Text>
                          <Text className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                            <Calendar className="w-3 h-3" /> หมดอายุ: {formatDate(contract.end_date)}
                          </Text>
                        </div>
                        <BadgeDelta deltaType="moderateDecrease" className="text-[10px] font-black bg-pink-100 text-[#EB005D]">
                          {daysLeft} วัน
                        </BadgeDelta>
                      </div>
                      
                      <ProgressBar value={Math.max(0, 100 - (daysLeft * 3.3))} color="pink" className="h-1.5" />
                      
                      <Link 
                        href={`/planning/new?from=${contract.ct_aid}`}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-[#EB005D] text-slate-500 hover:text-white rounded-xl text-[10px] font-black transition-all group/btn uppercase tracking-widest border border-slate-100 hover:border-transparent"
                      >
                        <span>เริ่มทำแผนงานต่อ</span>
                        <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
