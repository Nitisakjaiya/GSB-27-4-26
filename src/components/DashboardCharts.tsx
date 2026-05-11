"use client";

import { Card, Title, DonutChart, Legend, BarChart } from "@tremor/react";

interface ChartProps {
  statusData: { name: string; value: number }[];
  budgetData: { name: string; Total: number }[]; // 🚀 รับข้อมูลใหม่
}

export default function DashboardCharts({ statusData, budgetData }: ChartProps) {
  // ฟังก์ชันจัดฟอร์แมตตัวเลข
  const countFormatter = (number: number) => `${number} รายการ`;
  const currencyFormatter = (number: number) => `฿ ${Intl.NumberFormat("th").format(number)}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
      
      {/* 1. กราฟโดนัท แสดงสัดส่วนสถานะสัญญา */}
      <Card className="bg-[#0f172a] border-gray-800 ring-0 shadow-xl rounded-[2rem] hover:border-[#EB005D]/50 transition-all duration-300">
        <Title className="text-white font-black italic uppercase tracking-widest mb-6 text-center flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-[#EB005D] rounded-full"></span>
          Contract Status <span className="text-[#EB005D]">Distribution</span>
        </Title>
        
        <div className="flex flex-col items-center justify-center gap-6">
          <DonutChart
            data={statusData}
            category="value"
            index="name"
            colors={["emerald", "amber", "rose", "blue", "slate"]}
            className="h-48"
            valueFormatter={countFormatter}
          />
          <Legend
            categories={statusData.map(d => d.name)}
            colors={["emerald", "amber", "rose", "blue", "slate"]}
            className="mt-2 text-gray-400 font-bold"
          />
        </div>
      </Card>

      {/* 🚀 2. กราฟแท่ง แสดงการกระจายตัวของงบประมาณ */}
      <Card className="bg-[#0f172a] border-gray-800 ring-0 shadow-xl rounded-[2rem] hover:border-emerald-500/50 transition-all duration-300">
         <Title className="text-white font-black italic uppercase tracking-widest mb-6 text-center flex items-center justify-center gap-2">
           <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
           Budget <span className="text-emerald-500">Allocation</span>
         </Title>
         
         <div className="pt-4">
           {budgetData.length === 0 ? (
             <p className="text-center text-gray-500 text-sm italic py-10">ยังไม่มีข้อมูลรายการงบประมาณ</p>
           ) : (
             <BarChart
               data={budgetData}
               index="name"
               categories={["Total"]}
               colors={["emerald"]}
               valueFormatter={currencyFormatter}
               yAxisWidth={80}
               className="h-48"
               showAnimation={true}
             />
           )}
         </div>
      </Card>

    </div>
  );
}

// 🚀 วิชามาร: พิมพ์ Class สีของ Tremor ทิ้งไว้หลอกๆ แบบเต็มๆ 
// เพื่อบังคับให้ Tailwind อ่านเจอ และ "ห้ามลบ" สีเหล่านี้ทิ้งตอนแสดงกราฟเด็ดขาด!
const tremorSafelistHack = `
  bg-emerald-500 bg-amber-500 bg-rose-500 bg-blue-500 bg-slate-500
  text-emerald-500 text-amber-500 text-rose-500 text-blue-500 text-slate-500
  ring-emerald-500 ring-amber-500 ring-rose-500 ring-blue-500 ring-slate-500
  fill-emerald-500 fill-amber-500 fill-rose-500 fill-blue-500 fill-slate-500
  stroke-emerald-500 stroke-amber-500 stroke-rose-500 stroke-blue-500 stroke-slate-500
`;
