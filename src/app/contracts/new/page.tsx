import { createContract } from '../actions'
import { FileText, ArrowLeft, Save } from 'lucide-react'

export default function NewContractPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* ปุ่มย้อนกลับ */}
      <a href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm">
        <ArrowLeft size={16} />
        กลับไปหน้าหลัก
      </a>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-600/20 rounded-lg">
          <FileText className="text-blue-500" size={28} />
        </div>
        <h1 className="text-2xl font-bold text-white">บันทึกสัญญาฉบับใหม่</h1>
      </div>
      
      <form action={createContract} className="grid gap-6 bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">หมวดหมู่สัญญา (Category)</label>
            <input 
              name="category_code" 
              placeholder="ตัวอย่าง: EQ, SV, HW"
              className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">เลขที่สัญญา (Contract Number)</label>
            <input 
              name="ct_number" 
              placeholder="ตัวอย่าง: GSB-2026-002"
              className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all" 
              required 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">ชื่อโครงการ / ชื่อสัญญา</label>
          <input 
            name="ct_name" 
            placeholder="กรอกชื่อโครงการเต็ม..."
            className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all" 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">ชื่อผู้ประสานงาน (Coordinator)</label>
          <input 
            name="coordinator_name" 
            placeholder="ชื่อผู้รับผิดชอบโครงการ..."
            className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all" 
            required 
          />
        </div>
        
        {/* ส่วนข้อมูลรายการย่อย (ปรับปรุงใหม่) */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <h3 className="text-sm font-semibold text-blue-400 mb-4 uppercase tracking-widest">ข้อมูลรายการย่อย (Contract Item)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* จุดที่เพิ่ม: เลือกประเภทรายการ */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">ประเภท</label>
              <select 
                name="item_type" 
                className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Initial">Initial</option>
                <option value="Replace">Replace</option>
                <option value="MA">MA</option>
                <option value="New">New</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">ชื่อรายการอุปกรณ์/บริการ</label>
              <input 
                name="item_agreement" 
                placeholder="รายละเอียดรายการ..."
                className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-blue-500" 
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">งบประมาณ (บาท)</label>
              <input 
                name="item_cost" 
                type="number"
                placeholder="0.00"
                className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-blue-500" 
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800 mt-2">
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <Save size={20} />
            บันทึกข้อมูลสัญญา
          </button>
        </div>
      </form>
    </div>
  )
}
