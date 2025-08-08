import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Use NextAuth session instead of JWT
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get user's cards count and total value
    const userCards = await db.userCard.findMany({
      where: { userId },
      include: {
        card: true
      }
    });

    const totalCards = userCards.length;
    const totalValue = userCards.reduce((sum, userCard) => sum + userCard.purchasePrice, 0);

    // Get recent activity attempts (user's learning activities)
    const recentActivities = await db.activityAttempt.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      take: 5,
      include: {
        activity: true
      }
    });

    // Format activities for dashboard
    const formattedActivities = recentActivities.map(attempt => ({
      id: attempt.id,
      type: attempt.activity.activityType,
      description: getActivityDescription(attempt.activity),
      timestamp: (attempt.completedAt || attempt.startedAt).toISOString(),
      reward: attempt.activity.diamondReward || undefined
    }));

    // Calculate weekly progress
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyActivities = await db.activityAttempt.count({
      where: {
        userId,
        completedAt: {
          gte: oneWeekAgo
        }
      }
    });

    const weeklyProgress = Math.min(100, (weeklyActivities / 7) * 100); // Assume 7 activities per week as goal

    // Calculate daily goal progress
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayActivities = await db.activityAttempt.count({
      where: {
        userId,
        completedAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    const dailyGoalProgress = Math.min(100, (todayActivities / 3) * 100); // Assume 3 activities per day as goal

    return NextResponse.json({
      totalCards,
      totalValue,
      weeklyProgress: Math.round(weeklyProgress),
      dailyGoalProgress: Math.round(dailyGoalProgress),
      recentActivities: formattedActivities
    });

  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}

function getActivityDescription(activity: any): string {
  switch (activity.activityType) {
    case 'memory_game':
      return `Completed "${activity.title}" memory game`;
    case 'quiz':
      return `Solved "${activity.title}" quiz`;
    case 'fill_blanks':
      return `Completed "${activity.title}" fill in the blanks`;
    case 'drag_drop':
      return `Completed "${activity.title}" drag & drop exercise`;
    default:
      return `Completed "${activity.title}" activity`;
  }
}
