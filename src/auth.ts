import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        const inputUsername = (credentials.username as string).trim();
        const inputPassword = (credentials.password as string).trim();

        // 1. ค้นหา User ในตาราง tb_user
        const user = await prisma.tb_user.findFirst({
          where: { 
            username: inputUsername,
            is_deleted: 0 
          },
        })

        // 2. ตรวจสอบว่าพบ User และมีรหัสผ่านหรือไม่
        if (!user || !user.password) {
          console.log("Auth Error: User not found or no password");
          return null
        }

        // 3. เช็ครหัสผ่านด้วย bcrypt
        const isPasswordCorrect = await bcrypt.compare(
          inputPassword,
          user.password.trim()
        )

        if (!isPasswordCorrect) {
          console.log("Auth Error: Password mismatch");
          return null
        }

        // 4. ส่งข้อมูล User กลับ (ใช้ user_aid เป็น ID)
        return {
          id: user.user_aid.toString(),
          name: user.username,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
})
 
