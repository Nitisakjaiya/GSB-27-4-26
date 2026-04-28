import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // 👈 เพิ่มบรรทัดนี้เพื่อขยายเป็น 10MB (หรือตามที่ต้องการ)
    },
  },
};

export default nextConfig;
