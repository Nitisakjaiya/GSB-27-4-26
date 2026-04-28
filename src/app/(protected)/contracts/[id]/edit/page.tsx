import { prisma } from "../../../../../lib/prisma";
import { notFound } from "next/navigation";
import { updateContract } from "../../actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default async function EditContractPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  const contract = await prisma.tb_contract.findUnique({
    where: { ct_aid: BigInt(id) },
  });

  if (!contract || contract.is_deleted === 1) notFound();

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <Link 
        href={`/contracts/${id}`} 
        className="flex items-center gap-2 text-gray-500 hover:text-[#38BDF8] mb-8 transition-all w-fit"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">ยกเลิกและกลับไปหน้าเดิม</span>
      </Link>

      <div className="bg-gray-900 rounded-[2rem] border border-gray-800 shadow-2xl overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-amber-500 to-orange-600"></div>
        
        <form action={updateContract} className="p-10 space-y-8">
          <input type="hidden" name="id" value={id} />
          
          <div>
            <h2 className="text-2xl font-black text-white mb-2">แก้ไขข้อมูลสัญญา</h2>
            <p className="text-gray-500 text-sm">ปรับปรุงรายละเอียดหลักของโครงการในระบบ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">ประเภทโครงการ</label>
              <input 
                name="category_code" 
                defaultValue={contract.category_code ?? ""}
                className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">เลขที่สัญญา</label>
              <input 
                name="ct_number" 
                defaultValue={contract.ct_number ?? ""}
                className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">ชื่อโครงการ / สัญญา</label>
            <textarea 
              name="ct_name" 
              defaultValue={contract.ct_name ?? ""}
              rows={3}
              className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">ผู้ประสานงานหลัก</label>
            <input 
              name="coordinator_name" 
              defaultValue={contract.coordinator_name ?? ""}
              className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all"
              required
            />
          </div>

          <div className="pt-4 border-t border-gray-800 flex justify-end">
            <button 
              type="submit" 
              className="bg-amber-500 hover:bg-amber-600 text-black font-black px-10 py-4 rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Save size={20} />
              บันทึกการแก้ไข
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
