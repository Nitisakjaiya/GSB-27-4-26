'use client'; // 👈 บรรทัดนี้สำคัญที่สุด เพื่อให้ใช้ confirm() ได้

import { Trash2 } from "lucide-react";
import { deleteContract } from "../app/(protected)/contracts/actions";

export default function DeleteContractButton({ id }: { id: string }) {
  return (
    <form 
      action={deleteContract} 
      onSubmit={(e) => {
        if (!confirm('ยืนยันการลบสัญญาฉบับนี้? (ข้อมูลจะถูกซ่อนจากระบบ)')) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button 
        type="submit"
        className="flex items-center justify-center text-red-400 hover:text-white bg-red-400/10 hover:bg-red-500 p-2 rounded-lg transition-all"
        title="ลบข้อมูล"
      >
        <Trash2 size={14} />
      </button>
    </form>
  );
}
