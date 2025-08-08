import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface AuthUser {
  userId: string;
  username: string;
}

function getUserFromToken(request: NextRequest): AuthUser | null {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET - Learning activities listele (kullanıcılar için)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const activityType = searchParams.get("activityType");
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");

    const where: any = {
      isActive: true,
    };
    
    if (activityType) where.activityType = activityType;
    if (category) where.category = category;
    if (difficulty) where.difficulty = parseInt(difficulty);

    // Get user info for attempt data
    const authUser = getUserFromToken(request);
    let userAttempts: any[] = [];
    
    if (authUser) {
      userAttempts = await prisma.activityAttempt.findMany({
        where: { userId: authUser.userId },
        select: {
          activityId: true,
          score: true,
          maxScore: true,
          completed: true,
          timeSpent: true,
          completedAt: true,
        },
      });
    }

    const activities = await prisma.learningActivity.findMany({
      where,
      orderBy: [
        { category: "asc" },
        { sortOrder: "asc" },
        { difficulty: "asc" },
        { createdAt: "desc" },
      ],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        activityType: true,
        category: true,
        difficulty: true,
        sortOrder: true,
        isLocked: true,
        prerequisiteId: true,
        diamondReward: true,
        experienceReward: true,
        estimatedMinutes: true,
        content: true, // Content field'ını ekleyelim
        settings: true, // Settings field'ını da ekleyelim
        tags: true,
        _count: {
          select: {
            attempts: true,
          },
        },
        prerequisite: {
          select: {
            id: true,
            title: true,
            category: true,
            sortOrder: true,
          },
        },
      },
    });

    const totalCount = await prisma.learningActivity.count({ where });

    // Check prerequisite completion for each activity
    const prerequisiteIds = activities
      .map(a => a.prerequisiteId)
      .filter(Boolean) as string[];
    
    let prerequisiteCompletions: {[key: string]: boolean} = {};
    
    if (authUser && prerequisiteIds.length > 0) {
      const prerequisiteAttempts = await prisma.activityAttempt.findMany({
        where: {
          userId: authUser.userId,
          activityId: { in: prerequisiteIds },
          completed: true,
        },
        select: { activityId: true },
      });
      
      prerequisiteCompletions = prerequisiteAttempts.reduce((acc, attempt) => {
        acc[attempt.activityId] = true;
        return acc;
      }, {} as {[key: string]: boolean});
    }

    // Format activities with user progress and unlock status
    const formattedActivities = activities.map(activity => {
      const userAttempt = userAttempts.find(attempt => attempt.activityId === activity.id);
      
      // Check if activity is unlocked
      const isUnlocked = !activity.isLocked ||
        !activity.prerequisiteId ||
        prerequisiteCompletions[activity.prerequisiteId] ||
        false;
      
      return {
        ...activity,
        content: activity.content ? JSON.parse(activity.content) : {},
        settings: activity.settings ? JSON.parse(activity.settings) : {},
        tags: activity.tags ? JSON.parse(activity.tags) : [],
        totalAttempts: activity._count.attempts,
        isUnlocked,
        userProgress: userAttempt ? {
          score: userAttempt.score,
          maxScore: userAttempt.maxScore,
          completed: userAttempt.completed,
          timeSpent: userAttempt.timeSpent,
          completedAt: userAttempt.completedAt,
          percentage: Math.round((userAttempt.score / userAttempt.maxScore) * 100),
        } : null,
      };
    });

    // Get stats
    const stats = await prisma.learningActivity.aggregate({
      where: { isActive: true },
      _count: { id: true },
    });

    const categories = await prisma.learningActivity.groupBy({
      by: ["category"],
      where: { isActive: true },
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
    });

    const activityTypes = await prisma.learningActivity.groupBy({
      by: ["activityType"],
      where: { isActive: true },
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
        categories: categories.map(cat => ({
          category: cat.category,
          count: cat._count.category,
        })),
        activityTypes: activityTypes.map(type => ({
          type: type.activityType,
          count: type._count.activityType,
        })),
        userProgress: authUser ? {
          totalAttempted: userAttempts.length,
          completed: userAttempts.filter(a => a.completed).length,
        } : null,
      },
    });
  } catch (error) {
    console.error("Learning activities GET error:", error);
    return NextResponse.json(
      { error: "Learning activities getirilirken hata oluştu" },
      { status: 500 }
    );
  }
}
