// Minimal middleware to avoid conflicts with static assets
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Skip all middleware for static assets completely
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only match non-static files, but ALLOW api routes
    "/((?!_next|static|.*\\..*|favicon.ico).*)",
  ],
};
