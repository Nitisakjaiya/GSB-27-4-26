import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ตั้งค่าสี Sky Blue ตามมาตรฐาน CTMNG
        sky: {
          100: "#E0F2FE",
          400: "#38BDF8",
          500: "#0EA5E9", // Primary
          600: "#0284C7", // Primary Dark
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
