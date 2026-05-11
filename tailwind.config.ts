import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // ต้องมีบรรทัดนี้เพื่อให้ Tailwind รู้จัก Tremor
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  // 🚀 เพิ่ม Safelist: ยันต์กัน Tailwind ลบสีของ Tremor ทิ้ง!
  safelist: [
    // 🚀 ระบุสีที่ใช้ใน Chart ตรงๆ ไปเลย กันพลาด!
    {
      pattern: /^(bg|text|border|ring|stroke|fill)-(emerald|amber|rose|blue|slate|pink)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    // สีกราฟโดนัทที่ Tremor มักเรียกใช้ล่วงหน้า
    "bg-emerald-500", "text-emerald-500", "border-emerald-500",
    "bg-amber-500", "text-amber-500", "border-amber-500",
    "bg-rose-500", "text-rose-500", "border-rose-500",
    "bg-blue-500", "text-blue-500", "border-blue-500",
    "bg-slate-500", "text-slate-500", "border-slate-500",
    "bg-[#EB005D]", "text-[#EB005D]", "border-[#EB005D]",
  ],
  theme: {
    extend: {
      colors: {
        // เราตั้งชื่อใหม่เป็น 'gsbPink' (ไม่มีขีด) เพื่อให้ Tremor เรียกใช้ได้ตรงๆ
        gsbPink: "#EB005D", 
        // เก็บของเดิมไว้ใช้กับปุ่มหรือส่วนอื่นๆ
        gsb: {
          pink: "#EB005D",
          "pink-light": "#FDF2F8",
          accent: "#6E2B4E",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
