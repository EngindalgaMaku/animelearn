import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    console.log("🔍 Middleware Debug:")
    console.log("📍 Path:", req.nextUrl.pathname)
    console.log("🔑 Token:", req.nextauth.token)
    console.log("👤 Email:", req.nextauth.token?.email)
    console.log("🎭 Role:", req.nextauth.token?.role)
    
    // Check if user is trying to access admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const token = req.nextauth.token
      
      console.log("🚨 Admin route access attempt")
      console.log("Token exists:", !!token)
      
      if (token) {
        console.log("Token details:", {
          email: token.email,
          role: token.role,
          name: token.name
        })
      }
      
      // Check if user has admin role
      const isAdmin = token && (
        token.role === "admin" ||
        token.role === "ADMIN" ||
        token.email === "admin@zumenzu.com"
      )
      
      console.log("Is admin:", isAdmin)
      
      if (!isAdmin) {
        console.log("❌ Access denied - redirecting to dashboard")
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
      
      console.log("✅ Admin access granted")
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    // Protect admin routes
    "/admin/:path*",
    // Protect other authenticated routes if needed
    "/dashboard/:path*",
    "/battle/:path*",
    "/tournaments/:path*"
  ]
}