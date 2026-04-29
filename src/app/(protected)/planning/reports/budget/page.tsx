"use client";

import { Card, ProgressBar, Text, Flex, BadgeDelta, Title, BarChart, Subtitle, Divider } from "@tremor/react";
import { TrendingUp, Wallet, FileBarChart, ArrowUpRight } from "lucide-react";

export default function BudgetReportPage() {
  // ข้อมูลจำลองสำหรับการทำ Prototype ใน Task 4.1
  const chartData = [
    { name: "ม.ค.", "งบตามแผน": 4000, "ใช้จริง": 2400 },
    { name: "ก.พ.", "งบตามแผน": 3000, "ใช้จริง": 1398 },
    { name: "มี.ค.", "งบตามแผน": 2000, "ใช้จริง": 9800 },
    { name: "เม.ย.", "งบตามแผน": 2780, "ใช้จริง": 3908 },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-1000 bg-[#0b1120] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#EB005D]/10 rounded-2xl">
            <TrendingUp className="w-8 h-8 text-[#EB005D]" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white italic tracking-tight">
              Budget <span className="text-[#EB005D]">Tracking</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium">วิเคราะห์งบประมาณรายปีและการเบิกจ่ายจริง</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#0f172a] border-gray-800 ring-0 shadow-xl" decoration="top" decorationColor="pink">
          <Flex alignItems="start">
            <div>
              <Text className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">งบประมาณแผนงานรวม (2569)</Text>
              <Title className="text-3xl font-black text-white mt-1">1,250,000 ฿</Title>
            </div>
            <BadgeDelta deltaType="increase" className="bg-pink-500/10 text-[#EB005D]">Target 100%</BadgeDelta>
          </Flex>
        </Card>

        <Card className="bg-[#0f172a] border-gray-800 ring-0 shadow-xl">
          <Text className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">ทำสัญญาแล้ว (Actual)</Text>
          <Title className="text-3xl font-black text-white mt-1">450,000 ฿</Title>
          <Flex className="mt-4">
            <Text className="text-xs text-gray-400">Progress 36%</Text>
            <Text className="text-xs text-[#EB005D] font-bold">เหลือ 800,000 ฿</Text>
          </Flex>
          <ProgressBar value={36} color="gsbPink" className="mt-3" />
        </Card>

        <Card className="bg-[#0f172a] border-gray-800 ring-0 shadow-xl" decoration="top" decorationColor="emerald">
          <Text className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">สถานะการเบิกจ่าย</Text>
          <Title className="text-3xl font-black text-emerald-400 mt-1">ปกติ</Title>
          <Text className="mt-4 text-xs text-gray-400 leading-relaxed">การใช้งบประมาณเป็นไปตามแผนที่กำหนดไว้ในไตรมาสที่ 1</Text>
        </Card>
      </div>

      {/* Main Chart */}
      <Card className="bg-[#0f172a] border-gray-800 ring-0 shadow-2xl">
        <div className="flex items-center gap-2 mb-6">
          <FileBarChart className="text-[#EB005D]" size={20} />
          <Title className="text-white font-bold">เปรียบเทียบงบประมาณรายเดือน (Plan vs Actual)</Title>
        </div>
        <BarChart
  className="h-80 mt-4"
  data={chartData}
  index="name"
  categories={["งบตามแผน", "ใช้จริง"]}
  // เปลี่ยนจาก "gsb-pink" เป็น "gsbPink"
  colors={["slate-400", "gsbPink"]} 
  showGridLines={true}
  valueFormatter={(number) => `${Intl.NumberFormat("th").format(number)} ฿`}
  yAxisWidth={80}
/>
      </Card>
    </div>
  );
}
