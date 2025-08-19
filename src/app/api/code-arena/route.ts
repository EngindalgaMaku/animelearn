import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface AuthUser {
  userId: string;
  username: string;
}

// Get user from NextAuth session
async function getUserFromSession(): Promise<AuthUser | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return null;
    }

    return {
      userId: session.user.id,
      username: session.user.username || session.user.email || "Unknown",
    };
  } catch (error) {
    console.error("Error getting user from session:", error);
    return null;
  }
}

// GET - Code Arena challenges
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const activityType = searchParams.get("activityType"); // Add activity type filtering
    const search = searchParams.get("search");

    const where: any = {
      isActive: true, // LearningActivity uses isActive instead of isPublished
      NOT: { activityType: "lesson" }, // Exclude 'lesson' activities from Code Arena lists
    };

    if (category) where.category = category;
    if (difficulty) where.difficulty = parseInt(difficulty);
    if (activityType && activityType !== "lesson")
      where.activityType = activityType; // Ignore "lesson" type in Code Arena
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get user info for progress data
    const authUser = await getUserFromSession();
    let userAttempts: any[] = [];

    if (authUser) {
      // Get user attempts from activity attempts
      userAttempts = await prisma.activityAttempt.findMany({
        where: { userId: authUser.userId },
        include: {
          activity: {
            select: { id: true, title: true },
          },
        },
      });
    }

    const activities = await prisma.learningActivity.findMany({
      where,
      orderBy: [
        { category: "asc" },
        { sortOrder: "asc" },
        { difficulty: "asc" },
        { title: "asc" },
      ],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        activityType: true,
        difficulty: true,
        sortOrder: true,
        estimatedMinutes: true,
        diamondReward: true,
        experienceReward: true,
        content: true,
        settings: true,
        tags: true,
        isActive: true,
        isLocked: true,
        prerequisiteId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const totalCount = await prisma.learningActivity.count({
      where,
    });

    // Format activities for Code Arena display
    const formattedActivities = activities.map((activity) => {
      let parsedContent: any;
      try {
        parsedContent =
          typeof activity.content === "string"
            ? JSON.parse(activity.content)
            : activity.content || {};
      } catch (e) {
        parsedContent =
          activity &&
          (activity as any).content &&
          typeof (activity as any).content === "object"
            ? (activity as any).content
            : { instructions: activity.description };
      }

      let parsedSettings: any = {};
      try {
        if (activity.settings) {
          parsedSettings =
            typeof activity.settings === "string"
              ? JSON.parse(activity.settings)
              : activity.settings;
        }
      } catch (e) {
        parsedSettings = {};
      }

      let parsedTags = [];
      try {
        if (activity.tags) {
          parsedTags =
            typeof activity.tags === "string"
              ? JSON.parse(activity.tags)
              : activity.tags;
        }
      } catch (e) {
        parsedTags = [];
      }

      // Find user's progress for this activity
      const userAttempt = userAttempts.find(
        (attempt) => attempt.activityId === activity.id
      );
      const userProgress = userAttempt
        ? {
            id: userAttempt.id,
            completed: userAttempt.completed,
            score: userAttempt.score,
            attempts: 1,
            lastAttempt: userAttempt.completedAt || userAttempt.startedAt,
            timeSpent: userAttempt.timeSpent,
          }
        : null;

      return {
        id: activity.id,
        title: activity.title,
        description: activity.description,
        activityType: activity.activityType,
        category: activity.category,
        difficulty: activity.difficulty,
        sortOrder: activity.sortOrder,
        isLocked: activity.isLocked,
        prerequisiteId: activity.prerequisiteId,
        diamondReward: activity.diamondReward,
        experienceReward: activity.experienceReward,
        estimatedMinutes: activity.estimatedMinutes,
        content: parsedContent,
        settings: parsedSettings,
        tags: Array.isArray(parsedTags) ? parsedTags : [],
        totalAttempts: userAttempts.filter((a) => a.activityId === activity.id)
          .length,
        isUnlocked: !activity.isLocked,
        userProgress,
        createdAt: activity.createdAt,
        updatedAt: activity.updatedAt,
      };
    });

    // Get stats
    const stats = await prisma.learningActivity.aggregate({
      where,
      _count: { id: true },
    });

    const categories = await prisma.learningActivity.groupBy({
      by: ["category"],
      where,
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
    });

    const activityTypes = await prisma.learningActivity.groupBy({
      by: ["activityType"],
      where,
      _count: { activityType: true },
      orderBy: { _count: { activityType: "desc" } },
    });

    return NextResponse.json({
      success: true,
      activities: formattedActivities,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
      stats: {
        totalActivities: stats._count.id,
        categories: categories.map((cat) => ({
          category: cat.category,
          count: cat._count.category,
        })),
        activityTypes: activityTypes.map((type) => ({
          type: type.activityType,
          count: type._count.activityType,
        })),
        userProgress: authUser
          ? {
              totalAttempted: userAttempts.length,
              completed: userAttempts.filter((a) => a.completed).length,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Code Arena GET error:", error);
    return NextResponse.json(
      { error: "Code Arena activities could not be fetched" },
      { status: 500 }
    );
  }
}
