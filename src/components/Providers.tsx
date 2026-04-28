'use client';

import { SessionProvider } from 'next-auth/react';

// เพิ่มการรับค่า session เข้ามาใน Props
export default function Providers({ 
  children, 
  session 
}: { 
  children: React.ReactNode,
  session: any 
}) {
  // เอา session ที่ได้จากหลังบ้านมาใส่ให้ Provider เลย
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
