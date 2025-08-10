import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle font files specifically - let Next.js handle everything else
  if (
    pathname.startsWith("/_next/static/media/") &&
    pathname.endsWith(".woff2")
  ) {
    const response = NextResponse.next();
    response.headers.set("Content-Type", "font/woff2");
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Cross-Origin-Resource-Policy", "cross-origin");
    return response;
  }

  if (
    pathname.startsWith("/_next/static/media/") &&
    pathname.endsWith(".woff")
  ) {
    const response = NextResponse.next();
    response.headers.set("Content-Type", "font/woff");
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Cross-Origin-Resource-Policy", "cross-origin");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/_next/static/media/(.*)"],
};
