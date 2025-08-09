import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/auth/session - Get current session
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(null, { status: 200 });
    }

    // Return session data
    return NextResponse.json({
      user: {
        id: session.user?.id,
        email: session.user?.email,
        username: session.user?.username,
        role: session.user?.role,
        level: session.user?.level,
        experience: session.user?.experience,
        currentDiamonds: session.user?.currentDiamonds,
        totalDiamonds: session.user?.totalDiamonds,
        loginStreak: session.user?.loginStreak,
        maxLoginStreak: session.user?.maxLoginStreak,
        isPremium: session.user?.isPremium,
      },
      expires: session.expires,
    });
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
