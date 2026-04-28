import { auth } from "./auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnLoginPage = req.nextUrl.pathname.startsWith("/login")
  const isOnSetupPage = req.nextUrl.pathname.startsWith("/setup")

  // ถ้ายังไม่ได้ Login และไม่ได้อยู่ที่หน้า Login/Setup ให้เด้งไปหน้า Login
  if (!isLoggedIn && !isOnLoginPage && !isOnSetupPage) {
    return Response.redirect(new URL("/login", req.nextUrl))
  }

  // ถ้า Login แล้วแต่พยายามจะเข้าหน้า Login ให้เด้(ไปหน้าแรก
  if (isLoggedIn && isOnLoginPage) {
    return Response.redirect(new URL("/", req.nextUrl))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
