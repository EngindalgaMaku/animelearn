import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Admin kontrolü
async function checkAdminAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return false;
  }
  return true;
}

// DELETE - Clear future automated daily tips (Admin only) - for testing
export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "clear_future") {
      // Only delete tips for future dates (tomorrow and beyond)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const deletedTips = await prisma.dailyPythonTip.deleteMany({
        where: {
          date: {
            gte: tomorrow,
          },
        },
      });

      return NextResponse.json({
        message: `Cleared ${deletedTips.count} future daily tips`,
        deletedCount: deletedTips.count,
      });
    }

    if (action === "clear_today") {
      // Only delete tips for today - for testing
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const deletedTips = await prisma.dailyPythonTip.deleteMany({
        where: {
          date: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      return NextResponse.json({
        message: `Cleared ${deletedTips.count} daily tips for today`,
        deletedCount: deletedTips.count,
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'clear_future' or 'clear_today'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error cleaning up daily tips:", error);
    return NextResponse.json(
      { error: "Failed to cleanup daily tips" },
      { status: 500 }
    );
  }
}

// GET - Show current daily tips status
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Get tips for today
    const todayTips = await prisma.dailyPythonTip.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        tip: {
          select: {
            title: true,
            difficulty: true,
          },
        },
      },
    });

    // Get tips for tomorrow
    const tomorrowTips = await prisma.dailyPythonTip.findMany({
      where: {
        date: {
          gte: tomorrow,
          lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      include: {
        tip: {
          select: {
            title: true,
            difficulty: true,
          },
        },
      },
    });

    // Get tips for next 7 days
    const upcomingTips = await prisma.dailyPythonTip.findMany({
      where: {
        date: {
          gte: today,
          lt: nextWeek,
        },
      },
      orderBy: {
        date: "asc",
      },
      include: {
        tip: {
          select: {
            title: true,
            difficulty: true,
          },
        },
      },
    });

    return NextResponse.json({
      today: {
        date: today.toISOString().split("T")[0],
        tips: todayTips,
      },
      tomorrow: {
        date: tomorrow.toISOString().split("T")[0],
        tips: tomorrowTips,
      },
      upcoming: upcomingTips.map((tip) => ({
        date: tip.date.toISOString().split("T")[0],
        title: tip.tip.title,
        difficulty: tip.tip.difficulty,
        variant: tip.variant,
      })),
    });
  } catch (error) {
    console.error("Error fetching daily tips status:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily tips status" },
      { status: 500 }
    );
  }
}
