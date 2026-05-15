import { auth } from "./auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLoginPage = req.nextUrl.pathname.startsWith('/login');

  // ถ้าอยู่หน้า Login แล้วล็อคอินแล้ว ให้เตะไปหน้า Dashboard
  if (isOnLoginPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }
    return null; 
  }

  // ถ้าพยายามเข้าหน้าอื่น แต่ยังไม่ได้ล็อคอิน ให้เตะกลับไปหน้า Login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  return null;
})

// กำหนดว่าจะให้ รปภ. เฝ้าที่ไหนบ้าง (ยกเว้นพวกไฟล์ระบบ รูปภาพ)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
