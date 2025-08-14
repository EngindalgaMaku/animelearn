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
    const authUser = getUserFromToken(req);

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
        learningActivity: {
          select: {
            id: true,
            title: true,
            category: true,
            difficulty: true,
            sortOrder: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
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

    return NextResponse.json({
      success: true,
      analytics,
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

  categories.forEach((category) => {
    const categoryLessons = allLearningActivities.filter(
      (l) => l.category === category
    );
    const completedLessons = activityAttempts.filter(
      (attempt) =>
        attempt.completed && attempt.learningActivity.category === category
    );
    const categoryQuizzes = quizAttempts.filter(
      (qa) => qa.quiz.learningActivity?.category === category
    );

    // Calculate average scores and performance metrics
    const averageQuizScore =
      categoryQuizzes.length > 0
        ? Math.round(
            categoryQuizzes.reduce((sum, qa) => sum + qa.score, 0) /
              categoryQuizzes.length
          )
        : 0;

    const averageTime =
      completedLessons.length > 0
        ? Math.round(
            completedLessons.reduce(
              (sum, attempt) => sum + (attempt.timeSpent || 0),
              0
            ) / completedLessons.length
          )
        : 0;

    // Identify struggling topics (lessons with low quiz scores or multiple attempts)
    const strugglingTopics = categoryLessons
      .filter((lesson) => {
        const lessonQuizzes = categoryQuizzes.filter(
          (qa) => qa.quiz && qa.quiz.id === lesson.id
        );
        const avgScore =
          lessonQuizzes.length > 0
            ? lessonQuizzes.reduce((sum, qa) => sum + qa.score, 0) /
              lessonQuizzes.length
            : 0;
        return avgScore < 70;
      })
      .map((lesson) => lesson.title);

    // Identify mastered topics (lessons completed with high scores)
    const masteredTopics = categoryLessons
      .filter((lesson) => {
        const lessonProgress = activityAttempts.find(
          (attempt) => attempt.activity.id === lesson.id
        );
        const lessonQuizzes = categoryQuizzes.filter(
          (qa) => qa.quiz && qa.quiz.id === lesson.id
        );
        const avgScore =
          lessonQuizzes.length > 0
            ? lessonQuizzes.reduce((sum, qa) => sum + qa.score, 0) /
              lessonQuizzes.length
            : 0;
        return lessonProgress?.completed && avgScore >= 85;
      })
      .map((lesson) => lesson.title);

    performance[category] = {
      completedLessons: completedLessons.length,
      totalLessons: categoryLessons.length,
      averageScore: averageQuizScore,
      averageTime,
      strugglingTopics,
      masteredTopics,
    };
  });

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
    const authUser = getUserFromToken(req);

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
