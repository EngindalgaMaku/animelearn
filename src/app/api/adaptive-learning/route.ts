import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getOrGenerateRecommendationQueue,
  generateRecommendationQueue,
} from "@/lib/adaptive";
import { updateMasteryForActivityCompletion } from "@/lib/mastery";
import { recomputeAllBadges } from "@/lib/achievements-engine";

interface AuthUser {
  userId: string;
  username: string;
}

async function getUserFromSession(): Promise<AuthUser | null> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      return {
        userId: session.user.id as string,
        username:
          (session.user as any).username ||
          (session.user.email as string) ||
          "Unknown",
      };
    }
    return null;
  } catch {
    return null;
  }
}

interface LearningAnalytics {
  categoryPerformance: Record<
    string,
    {
      completedLessons: number;
      totalLessons: number;
      averageScore: number;
      averageTime: number;
      strugglingTopics: string[];
      masteredTopics: string[];
    }
  >;
  learningPattern: {
    preferredDifficulty: "beginner" | "intermediate" | "advanced";
    averageSessionTime: number;
    mostActiveTimeOfDay: string;
    learningStreak: number;
    consistencyScore: number;
  };
  recommendations: {
    nextLesson: any;
    reviewLessons: any[];
    focusAreas: string[];
    difficultyAdjustment: "increase" | "maintain" | "decrease";
    estimatedCompletionTime: number;
  };
}

// GET - Get adaptive learning recommendations
export async function GET(req: NextRequest) {
  try {
    const authUser = await getUserFromSession();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's learning data
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        level: true,
        experience: true,
        codeArenasCompleted: true,
        quizzesCompleted: true,
        codeSubmissionCount: true,
        loginStreak: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get activity progress data
    const activityAttempts = await prisma.activityAttempt.findMany({
      where: { userId: authUser.userId },
      include: {
        activity: {
          select: {
            id: true,
            title: true,
            category: true,
            difficulty: true,
            sortOrder: true,
          },
        },
      },
      orderBy: { startedAt: "desc" },
    });

    // Get quiz attempts
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { userId: authUser.userId },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
      orderBy: { startedAt: "desc" },
      take: 50,
    });

    // Get code submissions
    const codeSubmissions = await prisma.codeSubmission.findMany({
      where: { userId: authUser.userId },
      orderBy: { submittedAt: "desc" },
      take: 50,
    });

    // Get all available lessons
    const allLearningActivities = await prisma.learningActivity.findMany({
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        title: true,
        category: true,
        difficulty: true,
        sortOrder: true,
      },
    });

    // Analyze performance by category
    const categoryPerformance = analyzeCategoryPerformance(
      activityAttempts,
      quizAttempts,
      codeSubmissions,
      allLearningActivities
    );

    // Analyze learning patterns
    const learningPattern = analyzeLearningPattern(
      activityAttempts,
      quizAttempts,
      codeSubmissions,
      user
    );

    // Generate recommendations
    const recommendations = generateRecommendations(
      categoryPerformance,
      learningPattern,
      activityAttempts,
      allLearningActivities,
      user
    );

    const analytics: LearningAnalytics = {
      categoryPerformance,
      learningPattern,
      recommendations,
    };

    // Mastery-based adaptive recommendations (queue)
    const queue = await getOrGenerateRecommendationQueue(authUser.userId, {
      limit: 8,
      ttlHours: 6,
    });
    const activityIds = queue.items.map((i) => i.activityId);
    const recActivities = activityIds.length
      ? await prisma.learningActivity.findMany({
          where: { id: { in: activityIds } },
          select: {
            id: true,
            title: true,
            category: true,
            difficulty: true,
            estimatedMinutes: true,
          },
        })
      : [];
    const actMap = new Map(recActivities.map((a) => [a.id, a]));
    const recommendationsQueue = queue.items.map((i) => ({
      ...i,
      activity: actMap.get(i.activityId) || null,
    }));

    return NextResponse.json({
      success: true,
      analytics,
      recommendationsQueue,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating adaptive learning recommendations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Analyze performance by category
function analyzeCategoryPerformance(
  activityAttempts: any[],
  quizAttempts: any[],
  codeSubmissions: any[],
  allLearningActivities: any[]
): Record<string, any> {
  const categories = [
    "Python Fundamentals",
    "Intermediate Python",
    "Advanced Python",
    "Projects",
  ];
  const performance: Record<string, any> = {};

  for (const category of categories) {
    const lessonsInCategory = allLearningActivities.filter(
      (l) => l.category === category
    );

    const attemptsInCategory = activityAttempts.filter(
      (attempt) => attempt.activity?.category === category
    );

    const completedAttempts = attemptsInCategory.filter((a) => a.completed);

    const averageScore =
      completedAttempts.length > 0
        ? Math.round(
            completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) /
              completedAttempts.length
          )
        : 0;

    const averageTime =
      completedAttempts.length > 0
        ? Math.round(
            completedAttempts.reduce((sum, a) => sum + (a.timeSpent || 0), 0) /
              completedAttempts.length
          )
        : 0;

    // Struggling topics: lessons with avg attempt score < 70
    const strugglingTopics = lessonsInCategory
      .filter((lesson) => {
        const lessonAttempts = attemptsInCategory.filter(
          (a) => a.activity?.id === lesson.id
        );
        if (lessonAttempts.length === 0) return false;
        const avg =
          lessonAttempts.reduce((s, a) => s + (a.score || 0), 0) /
          lessonAttempts.length;
        return avg < 70;
      })
      .map((l) => l.title);

    // Mastered topics: completed attempts with avg score >= 85
    const masteredTopics = lessonsInCategory
      .filter((lesson) => {
        const lessonAttempts = attemptsInCategory.filter(
          (a) => a.activity?.id === lesson.id && a.completed
        );
        if (lessonAttempts.length === 0) return false;
        const avg =
          lessonAttempts.reduce((s, a) => s + (a.score || 0), 0) /
          lessonAttempts.length;
        return avg >= 85;
      })
      .map((l) => l.title);

    performance[category] = {
      completedLessons: completedAttempts.length,
      totalLessons: lessonsInCategory.length,
      averageScore,
      averageTime,
      strugglingTopics,
      masteredTopics,
    };
  }

  return performance;
}

// Analyze learning patterns
function analyzeLearningPattern(
  activityAttempts: any[],
  quizAttempts: any[],
  codeSubmissions: any[],
  user: any
) {
  // Determine preferred difficulty based on completion rates
  const difficultyStats = {
    1: activityAttempts.filter((attempt) => attempt.activity.difficulty === 1),
    2: activityAttempts.filter((attempt) => attempt.activity.difficulty === 2),
    3: activityAttempts.filter((attempt) => attempt.activity.difficulty === 3),
  };

  let preferredDifficulty: "beginner" | "intermediate" | "advanced" =
    "beginner";
  let bestCompletionRate = 0;

  Object.entries(difficultyStats).forEach(([difficulty, attempts]) => {
    if (attempts.length > 0) {
      const completionRate =
        attempts.filter((attempt) => attempt.completed).length /
        attempts.length;
      if (completionRate > bestCompletionRate) {
        bestCompletionRate = completionRate;
        if (difficulty === "1") preferredDifficulty = "beginner";
        else if (difficulty === "2") preferredDifficulty = "intermediate";
        else preferredDifficulty = "advanced";
      }
    }
  });

  // Calculate average session time
  const averageSessionTime =
    activityAttempts.length > 0
      ? Math.round(
          activityAttempts.reduce(
            (sum, attempt) => sum + (attempt.timeSpent || 0),
            0
          ) / activityAttempts.length
        )
      : 0;

  // Analyze activity times (simplified - in real app would use actual timestamps)
  const mostActiveTimeOfDay = "evening"; // Placeholder

  // Calculate consistency score based on login streak and regular activity
  const consistencyScore = Math.min(
    100,
    (user.loginStreak || 0) * 10 + (user.codeArenasCompleted || 0) * 2
  );

  return {
    preferredDifficulty,
    averageSessionTime,
    mostActiveTimeOfDay,
    learningStreak: user.loginStreak || 0,
    consistencyScore,
  };
}

// Generate personalized recommendations
function generateRecommendations(
  categoryPerformance: Record<string, any>,
  learningPattern: any,
  activityAttempts: any[],
  allLearningActivities: any[],
  user: any
) {
  // Find next lesson to recommend
  const completedLessonIds = activityAttempts
    .filter((attempt) => attempt.completed)
    .map((attempt) => attempt.activity.id);

  const difficultyMap: { [key: string]: number } = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
  };
  const preferredDifficultyNum =
    difficultyMap[learningPattern.preferredDifficulty as string] || 1;

  const nextLesson =
    allLearningActivities.find(
      (lesson) =>
        !completedLessonIds.includes(lesson.id) &&
        lesson.difficulty === preferredDifficultyNum
    ) ||
    allLearningActivities.find(
      (lesson) => !completedLessonIds.includes(lesson.id)
    );

  // Find lessons that need review (completed but with low scores)
  const reviewLessons = activityAttempts
    .filter((attempt) => attempt.completed && (attempt.score || 0) < 80)
    .slice(0, 3)
    .map((attempt) => attempt.activity);

  // Identify focus areas based on struggling topics
  const focusAreas: string[] = [];
  Object.entries(categoryPerformance).forEach(([category, performance]) => {
    if (performance.strugglingTopics.length > 0) {
      focusAreas.push(category);
    }
  });

  // Determine difficulty adjustment
  let difficultyAdjustment: "increase" | "maintain" | "decrease" = "maintain";
  const recentCompletionRate =
    activityAttempts.slice(0, 5).filter((attempt) => attempt.completed).length /
    Math.min(5, activityAttempts.length);

  if (recentCompletionRate > 0.8) {
    difficultyAdjustment = "increase";
  } else if (recentCompletionRate < 0.4) {
    difficultyAdjustment = "decrease";
  }

  // Estimate completion time for next lesson
  const estimatedCompletionTime = nextLesson?.estimatedMinutes || 30;

  return {
    nextLesson,
    reviewLessons,
    focusAreas,
    difficultyAdjustment,
    estimatedCompletionTime,
  };
}

// POST - Update learning preferences or feedback
export async function POST(req: NextRequest) {
  try {
    const authUser = await getUserFromSession();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, data } = body;

    switch (action) {
      case "feedback":
        // Store user feedback on recommendations
        // This could be stored in a separate UserFeedback table
        return NextResponse.json({
          success: true,
          message: "Feedback recorded",
        });

      case "update_preferences":
        // Update user learning preferences
        await prisma.user.update({
          where: { id: authUser.userId },
          data: {
            // Could add preference fields to User model
            // preferredDifficulty: data.preferredDifficulty,
            // preferredSessionTime: data.preferredSessionTime,
          },
        });

        return NextResponse.json({
          success: true,
          message: "Preferences updated",
        });

      case "refresh_recommendations": {
        // Force re-generate recommendation queue using mastery gaps
        const limit = typeof data?.limit === "number" ? data.limit : 10;
        const ttlHours = typeof data?.ttlHours === "number" ? data.ttlHours : 6;
        const queue = await generateRecommendationQueue(authUser.userId, {
          limit,
          ttlHours,
        });
        return NextResponse.json({
          success: true,
          message: "Recommendations refreshed",
          queue,
        });
      }

      case "activity_completed": {
        // Update mastery and recompute achievements on activity completion
        const {
          activityId,
          score,
          completed,
          correctCount,
          incorrectCount,
          timeSpent,
        } = data || {};

        if (!activityId) {
          return NextResponse.json(
            { error: "activityId required" },
            { status: 400 }
          );
        }

        await updateMasteryForActivityCompletion({
          userId: authUser.userId,
          activityId,
          score: typeof score === "number" ? score : undefined,
          completed: typeof completed === "boolean" ? completed : true,
          correctCount: typeof correctCount === "number" ? correctCount : 0,
          incorrectCount:
            typeof incorrectCount === "number" ? incorrectCount : 0,
          timeSpent: typeof timeSpent === "number" ? timeSpent : undefined,
        });

        // Recompute achievements and award completions if any
        const recompute = await recomputeAllBadges(authUser.userId, {
          awardOnComplete: true,
        });

        // Refresh adaptive recommendations
        const queue = await generateRecommendationQueue(authUser.userId, {
          limit: 8,
          ttlHours: 6,
        });

        return NextResponse.json({
          success: true,
          message: "Activity completion recorded",
          masteryUpdated: true,
          achievements: {
            newlyCompleted: recompute.newlyCompletedBadgeIds,
            totalEvaluated: recompute.results.length,
          },
          queue,
        });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating adaptive learning data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
