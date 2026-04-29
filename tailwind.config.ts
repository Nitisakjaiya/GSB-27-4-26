import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // ต้องมีบรรทัดนี้เพื่อให้ Tailwind รู้จัก Tremor
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx,mdx}", 
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
