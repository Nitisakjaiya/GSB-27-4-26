import { prisma } from "../../../lib/prisma";
import DashboardClient from "../../../components/DashboardClient";

export const dynamic = 'force-dynamic'; 

export default async function DashboardPage() {
  // 1. ดึงข้อมูลสถิติ
  const totalContracts = await prisma.tb_contract.count({
    where: { is_deleted: 0 }
  });

  // 2. ดึงข้อมูลสัญญาล่าสุด 10 รายการ
  const recentContracts = await prisma.tb_contract.findMany({
    where: { is_deleted: 0 },
    orderBy: { created_at: 'desc' },
    take: 10,
  });

  // 3. ดึงข้อมูลสัญญาที่ใกล้หมดอายุใน 30 วัน
  const today = new Date();
  const next30Days = new Date(new Date().setDate(today.getDate() + 30));

  const expiringSoon = await prisma.tb_contract.findMany({
    where: {
      is_deleted: 0,
      contract_status: "ACTIVE",
      end_date: {
        lte: next30Days,
        gte: today 
      }
    },
    orderBy: { end_date: 'asc' },
    take: 5 
  });

  /** * 🚀 💡 วิธีแก้ BigInt Serialization Error:
   * ใช้ JSON.stringify พร้อมกับ Custom Replacer เพื่อแปลง BigInt เป็น String ครับ
   */
  const serializeData = (data: any) => {
    return JSON.parse(
      JSON.stringify(data, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );
  };

  const serializedRecent = serializeData(recentContracts);
  const serializedExpiring = serializeData(expiringSoon);

  return (
    <DashboardClient 
      totalContracts={totalContracts} 
      recentContracts={serializedRecent} 
      expiringSoon={serializedExpiring} 
    />
  );
}
