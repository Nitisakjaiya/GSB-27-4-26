import { LayoutDashboard, FileText, Clock, CheckCircle, Eye } from "lucide-react";
import { prisma } from "../../../lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic'; 

export default async function DashboardPage() {
  // 1. ดึงข้อมูล "จำนวนสัญญา" ทั้งหมด
  const totalContracts = await prisma.tb_contract.count({
    where: { is_deleted: 0 }
  });

  // 🚀 2. ดึงข้อมูล "รายการสัญญา" ล่าสุด 10 รายการ
  const recentContracts = await prisma.tb_contract.findMany({
    where: { is_deleted: 0 },
    orderBy: { created_at: 'desc' }, // เรียงจากใหม่ไปเก่า
    take: 10, // เอามาโชว์แค่ 10 อันดับแรก
  });

  return (
    <div className="p-8 animate-in fade-in duration-500">
      
      {/* --- ส่วน Header --- */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-blue-500" />
          ภาพรวมระบบ (Dashboard)
        </h1>
        <p className="text-gray-500 mt-2">ข้อมูลสรุปสัญญาและแผนงานล่วงหน้าทั้งหมด</p>
      </div>

      {/* --- ส่วน Widget สรุปตัวเลข --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium mb-1">สัญญาทั้งหมด</p>
              <p className="text-3xl font-bold text-white">
                {totalContracts} <span className="text-sm text-gray-500 font-normal">ฉบับ</span>
              </p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-xl">
              <FileText className="text-blue-500 w-6 h-6" />
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
      </div>

      {/* --- 🚀 ส่วนตารางรายการสัญญาล่าสุด --- */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="text-blue-400 w-5 h-5" />
            รายการสัญญาล่าสุด
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-800/50 text-gray-300 uppercase font-medium text-xs tracking-wider">
              <tr>
                {/* เอาคอลัมน์จัดการไว้หน้าสุดตามมาตรฐาน CTMNG */}
                <th className="px-6 py-4 w-32">จัดการ</th> 
                <th className="px-6 py-4">เลขที่สัญญา</th>
                <th className="px-6 py-4">ชื่อโครงการ</th>
                <th className="px-6 py-4">ผู้รับผิดชอบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              
              {/* ถ้ายังไม่มีข้อมูลให้แสดงข้อความนี้ */}
              {recentContracts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    ยังไม่มีข้อมูลสัญญาในระบบ
                  </td>
                </tr>
              )}

              {/* วนลูปแสดงข้อมูลสัญญา */}
              {recentContracts.map((contract) => (
                <tr key={contract.ct_aid.toString()} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    {/* ปุ่มกดดูรายละเอียด (เดี๋ยวเราจะสร้างหน้านี้ทีหลังครับ) */}
                    <Link 
                      href={`/contracts/${contract.ct_aid.toString()}`} 
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg w-fit transition-all"
                    >
                      <Eye size={16} />
                      ดูข้อมูล
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{contract.ct_number || '-'}</td>
                  <td className="px-6 py-4 truncate max-w-xs">{contract.ct_name || '-'}</td>
                  <td className="px-6 py-4">{contract.coordinator_name || '-'}</td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
