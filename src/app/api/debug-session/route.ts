import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    console.log("🔍 Debug Session API:")
    console.log("Session:", session)
    console.log("User:", session?.user)
    
    return NextResponse.json({
      success: true,
      session: session,
      user: session?.user,
      isAuthenticated: !!session,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Debug session error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to get session",
      timestamp: new Date().toISOString()
    })
  }
}