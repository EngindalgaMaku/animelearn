import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Debug bilgileri
    const debugInfo = {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
      middleware: "passed through",
      route: "api/debug working",
    };

    // Session kontrolü
    let sessionInfo: any = null;
    try {
      const session = await getServerSession(authOptions);
      sessionInfo = {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id || null,
        userEmail: session?.user?.email || null,
        username: session?.user?.username || null,
        fullSession: session, // Tam session objesi
        userExistsInDB: false,
        dbUser: null,
      };

      // Eğer user ID varsa veritabanında kontrol et
      if (session?.user?.id) {
        const { prisma } = await import("@/lib/prisma");
        const dbUser = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { id: true, email: true, username: true },
        });
        sessionInfo.userExistsInDB = !!dbUser;
        sessionInfo.dbUser = dbUser;
      }
    } catch (error) {
      sessionInfo = {
        error: "Session check failed",
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }

    return NextResponse.json({
      status: "API_WORKING",
      debug: debugInfo,
      session: sessionInfo,
      message: "API routes are accessible and working",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "ERROR",
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : null,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    status: "POST_WORKING",
    message: "POST method is working on API routes",
    timestamp: new Date().toISOString(),
  });
}
