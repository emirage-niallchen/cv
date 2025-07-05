import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

// 扩展 NextAuth 的类型定义
declare module "next-auth" {
  interface User {
    username?: string
  }
  
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      username?: string
    }
  }
}

const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string(),
})

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)

          const admin = await prisma.admin.findUnique({
            where: { email },
          })

          if (!admin) {
            throw new Error("邮箱或密码错误")
          }

          const isPasswordValid = await bcrypt.compare(password, admin.password)

          if (!isPasswordValid) {
            throw new Error("邮箱或密码错误")
          }

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            username: admin.username,
          }
        } catch (error) {
          console.error("登录验证失败:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id
        token.username = user.username
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id as string
        session.user.username = token.username as string
      }
      return session
    },
  },
}

