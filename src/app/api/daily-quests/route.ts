import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateQuestProgress } from "@/lib/quests";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type AuthUser = { userId: string; username: string };

// Daily quest templates
const DAILY_QUEST_TEMPLATES = [
  {
    type: "complete_lesson",
    title: "Complete Lesson",
    description: "Complete 1 lesson",
    target: 1,
    diamondReward: 30,
    experienceReward: 15,
    icon: "📚",
  },
  {
    type: "solve_quiz",
    title: "Solve Quiz",
    description: "Solve 3 quizzes",
    target: 3,
    diamondReward: 20,
    experienceReward: 10,
    icon: "🧠",
  },
  {
    type: "submit_code",
    title: "Submit Code",
    description: "Run 5 code exercises",
    target: 5,
    diamondReward: 25,
    experienceReward: 12,
    icon: "💻",
  },
  {
    type: "daily_login",
    title: "Daily Login",
    description: "Log in today",
    target: 1,
    diamondReward: 10,
    experienceReward: 5,
    icon: "🌅",
  },
  {
    type: "spend_time",
    title: "Study Time",
    description: "Study for 30 minutes",
    target: 30, // minutes
    diamondReward: 35,
    experienceReward: 20,
    icon: "⏰",
  },
];

// Generate today's quests for user
async function generateDailyQuests(userId: string): Promise<any[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check today's quests
  const existingQuests = await prisma.dailyQuest.findMany({
    where: {
      userId,
      date: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  });

  if (existingQuests.length > 0) {
    return existingQuests;
  }

  // Select random 3-4 quests
  const shuffled = [...DAILY_QUEST_TEMPLATES].sort(() => 0.5 - Math.random());
  const selectedTemplates = shuffled.slice(
    0,
    Math.floor(Math.random() * 2) + 3
  ); // 3-4 quests

  // Always add daily login quest
  const loginQuest = DAILY_QUEST_TEMPLATES.find(
    (t) => t.type === "daily_login"
  );
  if (loginQuest && !selectedTemplates.some((t) => t.type === "daily_login")) {
    selectedTemplates.push(loginQuest);
  }

  // Create quests
  const quests = [];
  for (const template of selectedTemplates) {
    const quest = await prisma.dailyQuest.create({
      data: {
        userId,
        questType: template.type,
        target: template.target,
        progress: template.type === "daily_login" ? 1 : 0, // Login quest auto-completes
        isCompleted: template.type === "daily_login",
        diamondReward: template.diamondReward,
        experienceReward: template.experienceReward,
        date: today,
      },
    });
    quests.push(quest);
  }

  // Complete daily login quest if exists
  const loginQuestCreated = quests.find((q) => q.questType === "daily_login");
  if (loginQuestCreated && !loginQuestCreated.isCompleted) {
    await completeQuest(loginQuestCreated.id, userId);
  }

  return quests;
}

// Quest completion
async function completeQuest(questId: string, userId: string): Promise<any> {
  const quest = await prisma.dailyQuest.findUnique({
    where: { id: questId },
  });

  if (!quest || quest.isCompleted) {
    return null;
  }

  // Complete quest
  const completedQuest = await prisma.dailyQuest.update({
    where: { id: questId },
    data: { isCompleted: true },
  });

  // Give reward
  await prisma.user.update({
    where: { id: userId },
    data: {
      currentDiamonds: { increment: quest.diamondReward },
      totalDiamonds: { increment: quest.diamondReward },
      experience: { increment: quest.experienceReward },
    },
  });

  // Transaction record
  await prisma.diamondTransaction.create({
    data: {
      userId,
      amount: quest.diamondReward,
      type: "DAILY_QUEST",
      description: `Daily quest completed: ${quest.questType}`,
      relatedId: questId,
      relatedType: "daily_quest",
    },
  });

  return completedQuest;
}

// GET - List daily quests
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }
    const authUser: AuthUser = {
      userId: session.user.id,
      username:
        (session.user as any).username || session.user.email || "Unknown",
    };

    // Get or create today's quests
    const quests = await generateDailyQuests(authUser.userId);

    // Merge with quest templates (for UI)
    const questsWithDetails = quests.map((quest) => {
      const template = DAILY_QUEST_TEMPLATES.find(
        (t) => t.type === quest.questType
      );
      return {
        ...quest,
        title: template?.title || quest.questType,
        description: template?.description || quest.questType,
        icon: template?.icon || "📋",
        progressPercentage: Math.round((quest.progress / quest.target) * 100),
      };
    });

    // Statistics
    const completedCount = quests.filter((q) => q.isCompleted).length;
    const totalRewards = quests
      .filter((q) => q.isCompleted)
      .reduce((sum, q) => sum + q.diamondReward, 0);

    // Weekly statistics
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weeklyQuests = await prisma.dailyQuest.findMany({
      where: {
        userId: authUser.userId,
        date: { gte: weekStart },
        isCompleted: true,
      },
    });

    const weeklyStats = {
      completed: weeklyQuests.length,
      diamonds: weeklyQuests.reduce((sum, q) => sum + q.diamondReward, 0),
      experience: weeklyQuests.reduce((sum, q) => sum + q.experienceReward, 0),
    };

    return NextResponse.json({
      success: true,
      quests: questsWithDetails,
      stats: {
        today: {
          total: quests.length,
          completed: completedCount,
          remaining: quests.length - completedCount,
          completionRate: Math.round((completedCount / quests.length) * 100),
          totalRewards,
        },
        weekly: weeklyStats,
      },
    });
  } catch (error) {
    console.error("Daily quests GET error:", error);
    return NextResponse.json(
      { error: "Error occurred while fetching daily quests" },
      { status: 500 }
    );
  }
}

// POST - Update quest progress or manual completion
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }
    const authUser: AuthUser = {
      userId: session.user.id,
      username:
        (session.user as any).username || session.user.email || "Unknown",
    };

    const body = await request.json();
    const { action, questType, questId, increment } = body;

    if (action === "update_progress") {
      if (!questType) {
        return NextResponse.json(
          { error: "Quest type required" },
          { status: 400 }
        );
      }

      await updateQuestProgress(authUser.userId, questType, increment || 1);

      return NextResponse.json({
        success: true,
        message: "Quest progress updated",
      });
    } else if (action === "complete_quest") {
      if (!questId) {
        return NextResponse.json(
          { error: "Quest ID required" },
          { status: 400 }
        );
      }

      const completedQuest = await completeQuest(questId, authUser.userId);

      if (!completedQuest) {
        return NextResponse.json(
          { error: "Quest not found or already completed" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Quest completed!",
        quest: completedQuest,
        rewards: {
          diamonds: completedQuest.diamondReward,
          experience: completedQuest.experienceReward,
        },
      });
    } else if (action === "reset_daily") {
      // Admin operation - Reset daily quests
      if ((session.user as any).role !== "admin") {
        return NextResponse.json(
          { error: "You don't have permission for this operation" },
          { status: 403 }
        );
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.dailyQuest.deleteMany({
        where: {
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: "Daily quests reset",
      });
    } else {
      return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
    }
  } catch (error) {
    console.error("Daily quests POST error:", error);
    return NextResponse.json(
      { error: "Error occurred during operation" },
      { status: 500 }
    );
  }
}
