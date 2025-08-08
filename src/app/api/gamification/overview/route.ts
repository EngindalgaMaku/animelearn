import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");

    let userId = "cmdx1xoke0000wc485ntjnhxq"; // Default test user ID

    if (token) {
      try {
        const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as { userId: string };
        userId = decoded.userId;
      } catch (error) {
        console.log("JWT verification failed, using test user");
        // Continue with test user ID
      }
    } else {
      console.log("No auth token found, using test user");
      // Continue with test user ID
    }

    // Get user's basic info and stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        experience: true,
        currentDiamonds: true,
        level: true,
        loginStreak: true,
        codeArenasCompleted: true,
        quizzesCompleted: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Calculate experience to next level (simple formula: level * 1000)
    const experienceToNext = (user.level + 1) * 1000 - user.experience;

    // Get current streak
    const currentStreak = await prisma.userStreak.findUnique({
      where: { userId },
      select: { currentStreak: true },
    });

    // Get total cards count
    const totalCards = await prisma.userCard.count({
      where: { userId },
    });

    // Get total achievements (placeholder - will implement later)
    const totalAchievements = 0;

    // Calculate weekly XP (mock data for now)
    const weeklyXP = 450;

    // Mock rank (in real implementation, calculate based on leaderboard)
    const rank = Math.floor(Math.random() * 1000) + 1;

    // Get today's quest status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check daily quiz completion
    const dailyQuizAttempt = await prisma.dailyMiniQuizAttempt.findFirst({
      where: {
        userId,
        completedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Check card pack opening today
    const todayCardPacks = await prisma.cardPackOpening.findMany({
      where: {
        userId,
        openedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Mock today's quests (simplified for now)
    const todayQuests = {
      dailyQuiz: {
        completed: !!dailyQuizAttempt,
        progress: dailyQuizAttempt ? 1 : 0,
        total: 1,
      },
      lessonComplete: {
        completed: false, // Mock data
        progress: 0,
        total: 1,
      },
      streakMaintain: {
        completed: user.loginStreak > 0,
        progress: user.loginStreak > 0 ? 1 : 0,
        total: 1,
      },
      cardPackOpen: {
        completed: todayCardPacks.length > 0,
        progress: todayCardPacks.length,
        total: 1,
      },
    };

    const stats = {
      level: user.level,
      experience: user.experience,
      experienceToNext,
      diamonds: user.currentDiamonds,
      totalCards,
      currentStreak: currentStreak?.currentStreak || 0,
      totalAchievements,
      weeklyXP,
      rank,
    };

    return NextResponse.json({
      success: true,
      stats,
      todayQuests,
    });
  } catch (error) {
    console.error("Error fetching gamification overview:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gamification overview" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
