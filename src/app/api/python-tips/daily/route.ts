import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/python-tips/daily - Get today's Python tip
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log(
      "🔍 Python tips session:",
      JSON.stringify(session?.user, null, 2)
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's tip
    let dailyTip = await prisma.dailyPythonTip.findFirst({
      where: {
        date: today,
        isActive: true,
      },
      include: {
        tip: {
          include: {
            category: true,
            _count: {
              select: {
                interactions: true,
                feedback: true,
              },
            },
          },
        },
      },
    });

    // If no tip for today, create one
    if (!dailyTip) {
      // Get user's difficulty preference or default
      let userDifficulty = "beginner";
      if (session?.user?.id) {
        try {
          const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { level: true },
          });

          if (user) {
            if (user.level >= 10) userDifficulty = "advanced";
            else if (user.level >= 5) userDifficulty = "intermediate";
          }
        } catch (error) {
          console.error("User lookup error:", error);
          // Continue with default difficulty
        }
      }

      // Get a suitable tip for today
      const dayOfYear = Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
          86400000
      );

      const availableTips = await prisma.pythonTip.findMany({
        where: {
          isActive: true,
          difficulty: userDifficulty,
          publishDate: {
            lte: new Date(),
          },
        },
        include: {
          category: true,
        },
        orderBy: { createdAt: "asc" },
      });

      if (availableTips.length > 0) {
        const selectedTip = availableTips[dayOfYear % availableTips.length];

        // Create daily tip entry
        dailyTip = await prisma.dailyPythonTip.create({
          data: {
            tipId: selectedTip.id,
            date: today,
          },
          include: {
            tip: {
              include: {
                category: true,
                _count: {
                  select: {
                    interactions: true,
                    feedback: true,
                  },
                },
              },
            },
          },
        });
      }
    }

    if (!dailyTip) {
      return NextResponse.json(
        { success: false, error: "No tip available for today" },
        { status: 404 }
      );
    }

    // Get user interaction data if authenticated
    let userInteraction = null;
    let userStreak = null;

    if (session?.user?.id) {
      try {
        [userInteraction, userStreak] = await Promise.all([
          prisma.userPythonTipInteraction.findUnique({
            where: {
              userId_tipId: {
                userId: session.user.id,
                tipId: dailyTip.tip.id,
              },
            },
          }),
          prisma.pythonTipStreak.findUnique({
            where: { userId: session.user.id },
          }),
        ]);
      } catch (error) {
        console.error("User interaction lookup error:", error);
        // Continue without user data
      }
    }

    return NextResponse.json({
      success: true,
      dailyTip: dailyTip.tip,
      userProgress: userInteraction
        ? {
            hasViewed: userInteraction.hasViewed,
            hasLiked: userInteraction.hasLiked,
            hasCompleted: userInteraction.hasCompleted,
            xpEarned: userInteraction.xpEarned,
            timeSpent: userInteraction.timeSpent,
          }
        : null,
      streak: userStreak
        ? {
            current: userStreak.currentStreak,
            longest: userStreak.longestStreak,
            totalTipsViewed: userStreak.totalTipsViewed,
            totalXPEarned: userStreak.totalXPEarned,
          }
        : null,
    });
  } catch (error) {
    console.error("Daily tip fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch daily tip" },
      { status: 500 }
    );
  }
}

// POST /api/python-tips/daily - Set today's tip (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tipId, date } = body;

    if (!tipId) {
      return NextResponse.json(
        { success: false, error: "Tip ID is required" },
        { status: 400 }
      );
    }

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    // Check if tip exists
    const tip = await prisma.pythonTip.findUnique({
      where: { id: tipId },
    });

    if (!tip) {
      return NextResponse.json(
        { success: false, error: "Tip not found" },
        { status: 404 }
      );
    }

    // First try to find existing daily tip for this date
    const existingTip = await prisma.dailyPythonTip.findFirst({
      where: {
        date: targetDate,
      },
    });

    let dailyTip;
    if (existingTip) {
      // Update existing tip
      dailyTip = await prisma.dailyPythonTip.update({
        where: { id: existingTip.id },
        data: {
          tipId,
          isActive: true,
        },
        include: {
          tip: {
            include: {
              category: true,
            },
          },
        },
      });
    } else {
      // Create new tip
      dailyTip = await prisma.dailyPythonTip.create({
        data: {
          tipId,
          date: targetDate,
          isActive: true,
        },
        include: {
          tip: {
            include: {
              category: true,
            },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      dailyTip,
      message: "Daily tip set successfully",
    });
  } catch (error) {
    console.error("Daily tip setting error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to set daily tip" },
      { status: 500 }
    );
  }
}
