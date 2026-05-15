import { Loader2, Activity } from "lucide-react";

export default function ProtectedLoading() {
  return (
    <div className="h-[70vh] w-full flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
      <div className="relative flex items-center justify-center">
        {/* วงแหวนหมุนๆ */}
        <Loader2 size={64} className="text-[#EB005D] animate-spin absolute" />
        {/* ไอคอนตรงกลาง */}
        <Activity size={24} className="text-[#0EA5E9] animate-pulse" />
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-white font-black italic tracking-widest uppercase">
          Fetching Data
        </h3>
        <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.2em] animate-pulse">
          Connecting to Secure Database...
        </p>
      </div>
    </div>
  );
}
