import { LayoutDashboard, FileText, Clock, CheckCircle, Eye } from "lucide-react";
import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import DeleteContractButton from "../../../components/DeleteContractButton"; // 👈 นำเข้าปุ่มลบตัวใหม่

export const dynamic = 'force-dynamic'; 

export default async function DashboardPage() {
  const totalContracts = await prisma.tb_contract.count({
    where: { is_deleted: 0 }
  });

  const recentContracts = await prisma.tb_contract.findMany({
    where: { is_deleted: 0 },
    orderBy: { created_at: 'desc' },
    take: 10,
  });

  return (
    <div className="p-8 animate-in fade-in duration-500">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-[#0EA5E9]" />
          ภาพรวมระบบ (Dashboard)
        </h1>
        <p className="text-gray-500 mt-2">ข้อมูลสรุปสัญญาและแผนงานล่วงหน้าทั้งหมดในระบบ CTMNG</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg hover:border-[#0EA5E9]/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium mb-1">สัญญาทั้งหมด</p>
              <p className="text-3xl font-bold text-white">
                {totalContracts} <span className="text-sm text-gray-500 font-normal">ฉบับ</span>
              </p>
            </div>
            <div className="bg-[#0EA5E9]/20 p-3 rounded-xl">
              <FileText className="text-[#0EA5E9] w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium mb-1">รอดำเนินการ</p>
              <p className="text-3xl font-bold text-white">0 <span className="text-sm text-gray-500 font-normal">ฉบับ</span></p>
            </div>
            <div className="bg-orange-500/20 p-3 rounded-xl">
              <Clock className="text-orange-500 w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium mb-1">อนุมัติแล้ว</p>
              <p className="text-3xl font-bold text-white">0 <span className="text-sm text-gray-500 font-normal">ฉบับ</span></p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-xl">
              <CheckCircle className="text-green-500 w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/30">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="text-[#38BDF8] w-5 h-5" />
            รายการสัญญาล่าสุด
          </h2>
          <Link href="/contracts/new" className="text-xs bg-[#0EA5E9] hover:bg-[#0284C7] text-white px-4 py-2 rounded-lg font-medium transition-all">
            + เพิ่มสัญญาใหม่
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-800/50 text-gray-300 uppercase font-medium text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 w-40">จัดการ (Actions)</th> 
                <th className="px-6 py-4">เลขที่สัญญา</th>
                <th className="px-6 py-4">ชื่อโครงการ / ชื่อสัญญา</th>
                <th className="px-6 py-4">ผู้ประสานงาน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              
              {recentContracts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    ไม่พบข้อมูลสัญญาในระบบ
                  </td>
                </tr>
              )}

              {recentContracts.map((contract) => (
                <tr key={contract.ct_aid.toString()} className="hover:bg-gray-800/50 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Link 
                      href={`/contracts/${contract.ct_aid.toString()}`} 
                      className="flex items-center gap-2 text-[#38BDF8] hover:text-white bg-[#38BDF8]/10 hover:bg-[#38BDF8] px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Eye size={14} />
                      <span className="text-xs">ดูข้อมูล</span>
                    </Link>

                    {/* 👈 เรียกใช้ปุ่มลบตัวใหม่ที่นี่ */}
                    <DeleteContractButton id={contract.ct_aid.toString()} />
                  </td>
                  <td className="px-6 py-4 font-semibold text-white tracking-tight">
                    {contract.ct_number}
                  </td>
                  <td className="px-6 py-4 max-w-md truncate text-gray-300">
                    {contract.ct_name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[10px] text-gray-400 uppercase">
                        {contract.coordinator_name?.substring(0, 2) || '??'}
                      </div>
                      <span>{contract.coordinator_name}</span>
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
