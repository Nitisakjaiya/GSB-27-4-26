"use client";

import { Trash2 } from "lucide-react";

export function DeleteButton() {
  return (
    <button
      type="submit"
      className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all shadow-lg active:scale-95 border border-red-500/20 hover:border-red-500"
      title="ลบแผนงานนี้"
      onClick={(e) => {
        // ใช้ confirm ฝั่ง Client ได้อย่างปลอดภัย
        if (!confirm('คุณต้องการลบแผนงานนี้ใช่หรือไม่?')) {
          e.preventDefault();
        }
      }}
    >
      <Trash2 size={18} />
    </button>
  );
}
