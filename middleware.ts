import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";

  // Get session token for database strategy
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!isProduction) {
    console.log("🔍 Middleware Debug (Database Strategy):");
    console.log("📍 Path:", request.nextUrl.pathname);
    console.log("🔑 Token exists:", !!token);
    console.log("👤 Email:", token?.email);
    console.log("🎭 Role:", token?.role);
  }

  // Check if user is trying to access protected routes
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/battle") ||
    request.nextUrl.pathname.startsWith("/tournaments");

  if (isProtectedRoute) {
    if (!token) {
      if (!isProduction) {
        console.log("❌ No token - redirecting to login");
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check if user is trying to access admin routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (!isProduction) {
        console.log("🚨 Admin route access attempt");
        console.log("Token details:", {
          email: token.email,
          role: token.role,
          sub: token.sub,
        });
      }

      // Enhanced admin role checking
      const isAdmin =
        token &&
        (token.role === "admin" ||
          token.role === "ADMIN" ||
          token.email === "admin@zumenzu.com");

      if (!isProduction) {
        console.log("Is admin:", isAdmin);
      }

      if (!isAdmin) {
        if (!isProduction) {
          console.log("❌ Access denied - redirecting to dashboard");
        }
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      if (!isProduction) {
        console.log("✅ Admin access granted");
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect admin routes
    "/admin/:path*",
    // Protect other authenticated routes if needed
    "/dashboard/:path*",
    "/battle/:path*",
    "/tournaments/:path*",
  ],
};
