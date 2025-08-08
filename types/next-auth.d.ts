import { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username?: string
      role?: string
      level?: number
      experience?: number
      currentDiamonds?: number
      totalDiamonds?: number
      loginStreak?: number
      maxLoginStreak?: number
      isPremium?: boolean
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    username?: string
    role?: string
    level?: number
    experience?: number
    currentDiamonds?: number
    totalDiamonds?: number
    loginStreak?: number
    maxLoginStreak?: number
    isPremium?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    username?: string
  }
}