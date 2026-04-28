import { prisma } from "../../../lib/prisma";
import { ArrowLeft, FileText, User, Calendar, BadgeDollarSign } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ContractDetailPage({ params }: { params: { id: string } }) {
  const contract = await prisma.tb_contract.findUnique({
    where: { ct_aid: BigInt(params.id) },
    include: { items: true } // ดึงรายการย่อยออกมาด้วย
  });

  if (!contract || contract.is_deleted === 1) notFound();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> กลับหน้าหลัก
      </Link>

      <div className="bg-gray-900 rounded-3xl border border-gray-800 p-8 shadow-2xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="bg-blue-600/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {contract.category_code}
            </span>
            <h1 className="text-3xl font-bold text-white mt-3">{contract.ct_name}</h1>
            <p className="text-gray-500 mt-1">เลขที่สัญญา: {contract.ct_number}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-400">
              <User size={20} className="text-blue-500" />
              <span>ผู้รับผิดชอบ: <b className="text-white">{contract.coordinator_name}</b></span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Calendar size={20} className="text-blue-500" />
              <span>วันที่บันทึก: <b className="text-white">{contract.created_at.toLocaleDateString('th-TH')}</b></span>
            </div>
          </div>
        </div>

        {/* รายการย่อย (Items) */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BadgeDollarSign className="text-blue-500" /> รายการย่อยในสัญญา
          </h3>
          <div className="bg-black/50 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-800/50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-4">ประเภท</th>
                  <th className="px-6 py-4">รายละเอียด</th>
                  <th className="px-6 py-4 text-right">งบประมาณ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {contract.items.map((item) => (
                  <tr key={item.item_autoid.toString()}>
                    <td className="px-6 py-4 text-blue-400 font-medium">{item.item_type}</td>
                    <td className="px-6 py-4 text-gray-300">{item.item_agreement}</td>
                    <td className="px-6 py-4 text-right text-white font-mono">
                      {Number(item.item_cost || 0).toLocaleString()} บาท
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
