"use client";

import { Download } from "lucide-react";
import * as XLSX from "xlsx";

interface ExportProps {
  data: any[];
  fileName?: string;
}

export default function ExportExcelButton({ data, fileName = "GSB_Contracts_Report" }: ExportProps) {
  
  const handleExport = () => {
    if (data.length === 0) {
      alert("ไม่มีข้อมูลสำหรับดาวน์โหลดครับ");
      return;
    }

    // 1. นำข้อมูล JSON มาสร้างเป็น Worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // 2. สร้าง Workbook (สมุดงาน Excel) และเอา Worksheet ใส่เข้าไป
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contracts");

    // 3. สั่งดาวน์โหลดไฟล์
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 bg-[#EB005D] hover:bg-[#c4004e] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-pink-500/20 active:scale-95"
    >
      <Download size={16} />
      <span>Export Report</span>
    </button>
  );
}
