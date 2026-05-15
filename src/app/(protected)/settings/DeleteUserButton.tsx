"use client";

import { Trash2 } from "lucide-react";

export default function DeleteUserButton({ disabled }: { disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="p-2 bg-gray-800/50 hover:bg-red-500 text-gray-400 hover:text-white rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
      title={disabled ? "ไม่สามารถลบบัญชีนี้ได้" : "ลบบัญชีผู้ใช้งาน"}
      onClick={(e) => {
        if (!confirm("คุณแน่ใจหรือไม่ที่จะลบบัญชีผู้ใช้งานนี้?")) {
          e.preventDefault();
        }
      }}
    >
      <Trash2 size={18} />
    </button>
  );
}
