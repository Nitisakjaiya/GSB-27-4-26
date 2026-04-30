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
  LayoutDashboard, 
  FileText, 
  Clock, 
  CheckCircle, 
  Eye, 
  AlertCircle, 
  ArrowRight, 
  TrendingUp,
  Calendar
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

  // 🚀 ฟังก์ชันช่วยแปลงรูปแบบวันที่ให้เป็นภาษาไทย (เช่น 5 พ.ค. 2569)
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
    <div className="p-8 space-y-8 animate-in fade-in duration-700 bg-[#0b1120] min-h-screen text-gray-100">
      
      {/* --- Header Section --- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 italic tracking-tight uppercase">
            <LayoutDashboard className="w-8 h-8 text-[#EB005D]" />
            Dashboard <span className="text-[#EB005D]">Overview</span>
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">CTMNG: Contract & Planning Management System</p>
        </div>
        <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">System Status</p>
            <p className="text-sm font-black text-emerald-400">● STABLE ONLINE</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- Left Column: Stats & Recent Contracts (2/3 Width) --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Summary Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#0f172a] border-gray-800 ring-0 shadow-xl" decoration="top" decorationColor="pink">
              <Flex alignItems="start">
                <div>
                  <Text className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">สัญญาทั้งหมด</Text>
                  <Title className="text-3xl font-black text-white mt-1">{totalContracts}</Title>
                </div>
                <div className="bg-[#EB005D]/10 p-2 rounded-lg">
                  <FileText className="text-[#EB005D] w-5 h-5" />
                </div>
              </Flex>
            </Card>

            <Card className="bg-[#0f172a] border-gray-800 ring-0 shadow-xl" decoration="top" decorationColor="orange">
              <Flex alignItems="start">
                <div>
                  <Text className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">รอดำเนินการ</Text>
                  <Title className="text-3xl font-black text-white mt-1">0</Title>
                </div>
                <div className="bg-orange-500/10 p-2 rounded-lg">
                  <Clock className="text-orange-500 w-5 h-5" />
                </div>
              </Flex>
            </Card>

            <Card className="bg-[#0f172a] border-gray-800 ring-0 shadow-xl" decoration="top" decorationColor="emerald">
              <Flex alignItems="start">
                <div>
                  <Text className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">อนุมัติแล้ว</Text>
                  <Title className="text-3xl font-black text-white mt-1">0</Title>
                </div>
                <div className="bg-emerald-500/10 p-2 rounded-lg">
                  <CheckCircle className="text-emerald-500 w-5 h-5" />
                </div>
              </Flex>
            </Card>
          </div>

          {/* 2. Recent Contracts Table Card */}
          <div className="bg-[#0f172a] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/20">
              <h2 className="text-lg font-bold text-white flex items-center gap-3 italic uppercase tracking-tight">
                <TrendingUp className="text-[#EB005D] w-5 h-5" />
                Recent <span className="text-[#EB005D]">Contracts</span>
              </h2>
              <Link href="/contracts/new" className="text-[10px] font-black uppercase tracking-widest bg-[#EB005D] hover:bg-[#c4004e] text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-pink-500/20">
                + New Contract
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-900/50 text-gray-500 font-bold text-[10px] uppercase tracking-[0.15em]">
                  <tr>
                    <th className="px-6 py-4">Actions</th> 
                    <th className="px-6 py-4">เลขที่สัญญา</th>
                    <th className="px-6 py-4">ชื่อโครงการ</th>
                    {/* 🚀 จุดที่เพิ่มในตาราง: วันหมดอายุ */}
                    <th className="px-6 py-4">วันหมดอายุ</th>
                    <th className="px-6 py-4">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {recentContracts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-gray-600 italic">
                        ไม่พบข้อมูลสัญญาในระบบ
                      </td>
                    </tr>
                  ) : (
                    recentContracts.map((contract) => (
                      <tr key={contract.ct_aid} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4 flex items-center gap-2">
                          <Link 
                            href={`/contracts/${contract.ct_aid}`} 
                            className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-[#EB005D] rounded-lg transition-all"
                            title="ดูรายละเอียด"
                          >
                            <Eye size={14} />
                          </Link>
                          <DeleteContractButton id={contract.ct_aid.toString()} />
                        </td>
                        <td className="px-6 py-4 font-bold text-white tracking-tight">
                          {contract.ct_number}
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate text-gray-400 group-hover:text-gray-200 transition-colors">
                          {contract.ct_name}
                        </td>
                        {/* 🚀 จุดที่เพิ่มข้อมูลวันที่ในตาราง */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                            {contract.end_date && <Calendar className="w-3 h-3 text-gray-500" />}
                            {formatDate(contract.end_date)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge color="slate" className="bg-gray-800 text-gray-300 border-none font-bold text-[10px] uppercase">
                            {contract.contract_status || 'ACTIVE'}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- Right Column: Expiring Alerts (1/3 Width) --- */}
        <div className="space-y-6">
          <Card className="relative overflow-hidden bg-[#0f172a] border-gray-800 ring-0 shadow-2xl backdrop-blur-xl" decoration="top" decorationColor="pink">
            {/* Background Glow Effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#EB005D]/10 blur-3xl rounded-full" />
            
            <Flex alignItems="center" className="mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#EB005D] rounded-xl shadow-[0_0_15px_rgba(235,0,93,0.4)]">
                  <AlertCircle className="text-white w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <Title className="text-white font-black italic tracking-tight uppercase text-lg">Expiring <span className="text-[#EB005D]">Soon</span></Title>
                  <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">สัญญาใกล้หมดอายุ (30 วัน)</Text>
                </div>
              </div>
            </Flex>

            <div className="space-y-4">
              {expiringSoon.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-gray-800 rounded-3xl">
                  <CheckCircle className="w-8 h-8 text-emerald-500/20 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 font-bold italic tracking-tight">ข้อมูลปัจจุบันยังไม่มีรายการวิกฤต</p>
                </div>
              ) : (
                expiringSoon.map((contract) => {
                  // คำนวณวันคงเหลือ
                  const daysLeft = contract.end_date 
                    ? Math.ceil((new Date(contract.end_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                    : 0;

                  return (
                    <div key={contract.ct_aid} className="group relative p-4 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-[#EB005D]/40 transition-all duration-300">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <Text className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">{contract.ct_number}</Text>
                            <Text className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors truncate max-w-[150px]">
                              {contract.ct_name}
                            </Text>
                            {/* 🚀 จุดที่เพิ่มข้อมูลวันที่ใต้ชื่อโครงการในกรอบสีชมพู */}
                            <Text className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> หมดอายุ: {formatDate(contract.end_date)}
                            </Text>
                          </div>
                          <BadgeDelta deltaType="moderateDecrease" className="text-[10px] font-black">
                            {daysLeft} วัน
                          </BadgeDelta>
                        </div>
                        
                        {/* Progress Bar คำนวณความวิกฤต (ยิ่งใกล้วัน ยิ่งเต็ม) */}
                        <ProgressBar value={Math.max(0, 100 - (daysLeft * 3.3))} color="pink" className="h-1.5" />
                        
                        <Link 
                          href={`/planning/new?from=${contract.ct_aid}`}
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-800 hover:bg-[#EB005D] text-gray-400 hover:text-white rounded-xl text-[10px] font-black transition-all group/btn uppercase tracking-widest"
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

            {expiringSoon.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-800/50 text-center">
                 <button className="text-[10px] font-black text-gray-600 hover:text-[#EB005D] transition-colors tracking-widest uppercase">
                    View All Priority Alerts
                 </button>
              </div>
            )}
          </Card>

          {/* Quick Shortcuts */}
          <Card className="bg-[#0f172a] border-gray-800 ring-0 shadow-xl">
             <Text className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-4">Quick Shortcuts</Text>
             <div className="grid grid-cols-2 gap-3">
                <Link href="/planning" className="p-4 bg-gray-900 rounded-2xl border border-gray-800 hover:border-emerald-500/50 transition-all text-center group">
                   <TrendingUp className="w-5 h-5 mx-auto mb-2 text-emerald-500 group-hover:scale-110 transition-transform" />
                   <p className="text-[10px] font-black text-gray-400 group-hover:text-emerald-500 transition-colors">แผนงานล่วงหน้า</p>
                </Link>
                <Link href="/reports/budget" className="p-4 bg-gray-900 rounded-2xl border border-gray-800 hover:border-[#EB005D]/50 transition-all text-center group">
                   <FileText className="w-5 h-5 mx-auto mb-2 text-[#EB005D] group-hover:scale-110 transition-transform" />
                   <p className="text-[10px] font-black text-gray-400 group-hover:text-[#EB005D] transition-colors">สรุปงบประมาณ</p>
                </Link>
             </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
