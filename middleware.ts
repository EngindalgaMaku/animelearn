import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isProduction = process.env.NODE_ENV === "production";

    if (!isProduction) {
      console.log("🔍 Middleware Debug:");
      console.log("📍 Path:", req.nextUrl.pathname);
      console.log("🔑 Token exists:", !!req.nextauth.token);
      console.log("👤 Email:", req.nextauth.token?.email);
      console.log("🎭 Role:", req.nextauth.token?.role);
    }

    // Check if user is trying to access admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const token = req.nextauth.token;

      if (!isProduction) {
        console.log("🚨 Admin route access attempt");
        console.log("Token exists:", !!token);

        if (token) {
          console.log("Token details:", {
            email: token.email,
            role: token.role,
            id: token.id,
            isActive: token.isActive,
          });
        }
      }

      // Enhanced admin role checking
      const isAdmin =
        token &&
        token.isActive !== false &&
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
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      if (!isProduction) {
        console.log("✅ Admin access granted");
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access if token exists and user is active
        return !!token && token.isActive !== false;
      },
    },
  }
);

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
