import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const today = new Date();
    const todayDateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    // Get client info for tracking
    const userAgent = request.headers.get("user-agent") || "";
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip") || "unknown";

    // Detect platform
    let platform = "unknown";
    if (userAgent.includes("Mobile")) platform = "mobile";
    else if (userAgent.includes("Windows")) platform = "windows";
    else if (userAgent.includes("Mac")) platform = "mac";
    else if (userAgent.includes("Linux")) platform = "linux";

    // Check if user already logged in today
    const existingLoginToday = await (prisma as any).loginHistory.findUnique({
      where: {
        userId_loginDate: {
          userId: user.id,
          loginDate: todayDateOnly,
        },
      },
    });

    if (existingLoginToday) {
      // User already logged in today, just return current streak
      const streakData = await getOrCreateStreakData(user.id);
      return NextResponse.json({
        success: true,
        alreadyLoggedToday: true,
        message: "Already logged in today",
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        totalLogins: streakData.totalLogins,
      });
    }

    // Get yesterday's date
    const yesterday = new Date(todayDateOnly);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if user logged in yesterday
    const yesterdayLogin = await (prisma as any).loginHistory.findUnique({
      where: {
        userId_loginDate: {
          userId: user.id,
          loginDate: yesterday,
        },
      },
    });

    // Get or create streak data
    let streakData = await getOrCreateStreakData(user.id);

    let newStreakCount = 1;
    let isConsecutive = true;

    if (yesterdayLogin) {
      // Consecutive login - increment streak
      newStreakCount = streakData.currentStreak + 1;
      isConsecutive = true;
    } else {
      // Not consecutive - reset streak
      newStreakCount = 1;
      isConsecutive = false;
    }

    // Create login history record (handle race conditions gracefully)
    try {
      await (prisma as any).loginHistory.create({
        data: {
          userId: user.id,
          loginDate: todayDateOnly,
          loginTimestamp: today,
          streakCount: newStreakCount,
          isConsecutive,
          ipAddress,
          userAgent,
          platform,
        },
      });
    } catch (error: any) {
      // If another request already created today's login (unique constraint), treat as already logged in today
      if (error?.code === "P2002") {
        const streakData = await getOrCreateStreakData(user.id);
        return NextResponse.json({
          success: true,
          alreadyLoggedToday: true,
          message: "Already logged in today",
          currentStreak: streakData.currentStreak,
          longestStreak: streakData.longestStreak,
          totalLogins: streakData.totalLogins,
        });
      }
      // Re-throw unknown errors
      throw error;
    }

    // Update streak data
    const updatedStreakData = await (prisma as any).loginStreak.update({
      where: { userId: user.id },
      data: {
        currentStreak: newStreakCount,
        longestStreak: Math.max(streakData.longestStreak, newStreakCount),
        lastLoginDate: todayDateOnly,
        streakStartDate: isConsecutive
          ? streakData.streakStartDate
          : todayDateOnly,
        totalLogins: { increment: 1 },
      },
    });

    // Update user's login streak field for compatibility
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginStreak: newStreakCount,
        maxLoginStreak: Math.max(user.maxLoginStreak, newStreakCount),
        lastLoginDate: today,
      },
    });

    // Calculate rewards based on streak
    const rewards = calculateStreakRewards(newStreakCount, isConsecutive);

    // Apply rewards if any
    if (rewards.diamonds > 0 || rewards.experience > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          currentDiamonds: { increment: rewards.diamonds },
          totalDiamonds: { increment: rewards.diamonds },
          experience: { increment: rewards.experience },
        },
      });

      // Log diamond transaction
      if (rewards.diamonds > 0) {
        await prisma.diamondTransaction.create({
          data: {
            userId: user.id,
            amount: rewards.diamonds,
            type: "earned",
            description: `Login streak day ${newStreakCount} bonus`,
            relatedType: "login_streak",
            relatedId: updatedStreakData.id,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      isNewStreak: !isConsecutive,
      wasConsecutive: isConsecutive,
      currentStreak: newStreakCount,
      longestStreak: updatedStreakData.longestStreak,
      totalLogins: updatedStreakData.totalLogins,
      rewards: rewards,
      milestones: getStreakMilestones(newStreakCount),
      nextMilestone: getNextMilestone(newStreakCount),
    });
  } catch (error) {
    console.error("Login streak tracking error:", error);
    return NextResponse.json(
      {
        error: "Failed to track login streak",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function getOrCreateStreakData(userId: string) {
  try {
    let streakData = await (prisma as any).loginStreak.findUnique({
      where: { userId },
    });

    if (!streakData) {
      const today = new Date();
      const todayDateOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      streakData = await (prisma as any).loginStreak.create({
        data: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
          lastLoginDate: todayDateOnly,
          streakStartDate: todayDateOnly,
          totalLogins: 0,
          streakRewards: [],
        },
      });
    }

    return streakData;
  } catch (error) {
    console.error("Error getting/creating streak data:", error);
    // Fallback values
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalLogins: 0,
      streakStartDate: new Date(),
      streakRewards: [],
    };
  }
}

function calculateStreakRewards(streakCount: number, isConsecutive: boolean) {
  const baseReward = {
    diamonds: 5,
    experience: 10,
  };

  // Base rewards for daily login
  let diamonds = baseReward.diamonds;
  let experience = baseReward.experience;

  // Bonus for consecutive days
  if (isConsecutive && streakCount > 1) {
    // Increasing rewards for longer streaks
    if (streakCount >= 7) diamonds += 15; // Week bonus
    if (streakCount >= 14) diamonds += 25; // Two week bonus
    if (streakCount >= 30) diamonds += 50; // Month bonus
    if (streakCount >= 100) diamonds += 100; // 100 day bonus

    // Small incremental bonus
    diamonds += Math.floor(streakCount / 5) * 2;
    experience += Math.floor(streakCount / 3) * 5;
  }

  return {
    diamonds,
    experience,
    isBonus: streakCount > 1 && isConsecutive,
  };
}

function getStreakMilestones(streakCount: number) {
  const milestones = [3, 7, 14, 30, 50, 100, 200, 365];
  return milestones.filter((milestone) => streakCount >= milestone);
}

function getNextMilestone(streakCount: number) {
  const milestones = [3, 7, 14, 30, 50, 100, 200, 365];
  const nextMilestone = milestones.find((milestone) => milestone > streakCount);

  if (nextMilestone) {
    return {
      days: nextMilestone,
      remaining: nextMilestone - streakCount,
      reward: getMilestoneReward(nextMilestone),
    };
  }

  return null;
}

function getMilestoneReward(milestone: number) {
  const rewards = {
    3: { diamonds: 25, experience: 50 },
    7: { diamonds: 75, experience: 150 },
    14: { diamonds: 200, experience: 400 },
    30: { diamonds: 500, experience: 1000 },
    50: { diamonds: 1000, experience: 2000 },
    100: { diamonds: 2500, experience: 5000 },
    200: { diamonds: 5000, experience: 10000 },
    365: { diamonds: 10000, experience: 25000 },
  };

  return (
    rewards[milestone as keyof typeof rewards] || { diamonds: 0, experience: 0 }
  );
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const streakData = await getOrCreateStreakData(user.id);

    // Get recent login history
    const recentLogins = await (prisma as any).loginHistory.findMany({
      where: { userId: user.id },
      orderBy: { loginDate: "desc" },
      take: 30,
    });

    return NextResponse.json({
      success: true,
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      totalLogins: streakData.totalLogins,
      lastLoginDate: streakData.lastLoginDate,
      streakStartDate: streakData.streakStartDate,
      milestones: getStreakMilestones(streakData.currentStreak),
      nextMilestone: getNextMilestone(streakData.currentStreak),
      recentLogins: recentLogins.map((login: any) => ({
        date: login.loginDate,
        timestamp: login.loginTimestamp,
        streakCount: login.streakCount,
        isConsecutive: login.isConsecutive,
        platform: login.platform,
      })),
    });
  } catch (error) {
    console.error("Login streak stats error:", error);
    return NextResponse.json(
      {
        error: "Failed to get login streak stats",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
