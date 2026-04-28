import { redirect } from 'next/navigation';

export default function HomePage() {
  // 1. สั่งย้ายหน้าไปที่ /dashboard ทันที
  redirect('/dashboard');

  // 2. ส่งแท็ก HTML คืนค่าเพื่อเอาใจ Turbopack ให้มันรู้ว่านี่คือ React Component แน่นอน!
  return (
    <div>
      กำลังนำท่านเข้าสู่ระบบ...
    </div>
  );
}
