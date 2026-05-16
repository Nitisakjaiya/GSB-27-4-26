"use client";

import { Trash2 } from "lucide-react";
import { deleteCommittee } from "../app/(protected)/committees/actions";

export default function DeleteCommitteeButton({ id }: { id: number }) {
  const handleDelete = async () => {
    // แจ้งเตือนก่อนลบเพื่อความปลอดภัย
    if (window.confirm("ท่านประธานยืนยันที่จะลบรายชื่อกรรมการท่านนี้ออกจากระบบหรือไม่?")) {
      await deleteCommittee(id);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="p-2.5 bg-slate-50 hover:bg-red-500 text-slate-500 hover:text-white rounded-xl transition-all shadow-sm border border-slate-100 hover:border-transparent active:scale-95" 
      title="Delete"
    >
      <Trash2 size={16} />
    </button>
  );
}
