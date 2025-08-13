import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Build date filter
    const dateFilter: any = {};
    if (dateFrom) {
      dateFilter.gte = new Date(dateFrom);
    }
    if (dateTo) {
      dateFilter.lte = new Date(dateTo);
    }

    // Get current date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // **QUIZ ANALYTICS**
    const [quizStats, quizAttempts] = await Promise.all([
      prisma.quizAttempt.aggregate({
        where: {
          completedAt: Object.keys(dateFilter).length
            ? dateFilter
            : { gte: thirtyDaysAgo },
        },
        _count: { id: true },
        _avg: { score: true, timeSpent: true },
        _sum: { score: true, timeSpent: true },
      }),
      prisma.quizAttempt.findMany({
        where: {
          completedAt: Object.keys(dateFilter).length
            ? dateFilter
            : { gte: sevenDaysAgo },
        },
        include: {
          quiz: { select: { title: true, difficulty: true } },
          user: { select: { username: true, level: true } },
        },
        orderBy: { completedAt: "desc" },
        take: 10,
      }),
    ]);

    // Top performing quizzes
    const topQuizzes = await prisma.quizAttempt.groupBy({
      by: ["quizId"],
      where: {
        completedAt: Object.keys(dateFilter).length
          ? dateFilter
          : { gte: thirtyDaysAgo },
      },
      _count: { id: true },
      _avg: { score: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    const quizDetails = await prisma.quiz.findMany({
      where: { id: { in: topQuizzes.map((q) => q.quizId) } },
      select: { id: true, title: true, difficulty: true },
    });

    const topQuizzesWithDetails = topQuizzes.map((quiz) => ({
      ...quiz,
      quiz: quizDetails.find((q) => q.id === quiz.quizId),
    }));

    // **CODE ARENA ANALYTICS**
    const [codeArenaStats, codeSubmissions] = await Promise.all([
      prisma.codeArenaProgress.aggregate({
        where: {
          completedAt: Object.keys(dateFilter).length
            ? dateFilter
            : { gte: thirtyDaysAgo },
          isCompleted: true,
        },
        _count: { id: true },
        _avg: { score: true, timeSpent: true },
        _sum: { timeSpent: true },
      }),
      prisma.codeSubmission.findMany({
        where: {
          submittedAt: Object.keys(dateFilter).length
            ? dateFilter
            : { gte: sevenDaysAgo },
        },
        include: {
          user: { select: { username: true, level: true } },
        },
        orderBy: { submittedAt: "desc" },
        take: 10,
      }),
    ]);

    // Top Code Arena challenges
    const topCodeArenas = await prisma.codeArenaProgress.groupBy({
      by: ["codeArenaId"],
      where: {
        completedAt: Object.keys(dateFilter).length
          ? dateFilter
          : { gte: thirtyDaysAgo },
        isCompleted: true,
      },
      _count: { id: true },
      _avg: { score: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    const arenaDetails = await prisma.codeArena.findMany({
      where: { id: { in: topCodeArenas.map((a) => a.codeArenaId) } },
      select: { id: true, title: true, difficulty: true, category: true },
    });

    const topCodeArenasWithDetails = topCodeArenas.map((arena) => ({
      ...arena,
      codeArena: arenaDetails.find((a) => a.id === arena.codeArenaId),
    }));

    // **LEARNING ACTIVITIES ANALYTICS**
    const [learningStats, learningAttempts] = await Promise.all([
      prisma.activityAttempt.aggregate({
        where: {
          completedAt: Object.keys(dateFilter).length
            ? dateFilter
            : { gte: thirtyDaysAgo },
          completed: true,
        },
        _count: { id: true },
        _avg: { score: true, timeSpent: true },
        _sum: { timeSpent: true },
      }),
      prisma.activityAttempt.findMany({
        where: {
          completedAt: Object.keys(dateFilter).length
            ? dateFilter
            : { gte: sevenDaysAgo },
          completed: true,
        },
        include: {
          activity: {
            select: { title: true, activityType: true, difficulty: true },
          },
          user: { select: { username: true, level: true } },
        },
        orderBy: { completedAt: "desc" },
        take: 10,
      }),
    ]);

    // **BLOG POST ANALYTICS**
    const [blogStats, blogInteractions] = await Promise.all([
      prisma.blogPostInteraction.aggregate({
        where: {
          firstViewedAt: Object.keys(dateFilter).length
            ? dateFilter
            : { gte: thirtyDaysAgo },
          hasViewed: true,
        },
        _count: { id: true },
        _avg: { timeSpent: true },
        _sum: { timeSpent: true },
      }),
      prisma.blogPostInteraction.findMany({
        where: {
          firstViewedAt: Object.keys(dateFilter).length
            ? dateFilter
            : { gte: sevenDaysAgo },
          hasViewed: true,
        },
        include: {
          post: {
            select: { title: true, category: true, estimatedMinutes: true },
          },
          user: { select: { username: true, level: true } },
        },
        orderBy: { firstViewedAt: "desc" },
        take: 10,
      }),
    ]);

    // Top blog posts
    const topBlogPosts = await prisma.blogPostInteraction.groupBy({
      by: ["postId"],
      where: {
        firstViewedAt: Object.keys(dateFilter).length
          ? dateFilter
          : { gte: thirtyDaysAgo },
        hasViewed: true,
      },
      _count: { id: true },
      _avg: { timeSpent: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    const blogDetails = await prisma.blogPost.findMany({
      where: { id: { in: topBlogPosts.map((b) => b.postId) } },
      select: { id: true, title: true, category: true, readTime: true },
    });

    const topBlogPostsWithDetails = topBlogPosts.map((blog) => ({
      ...blog,
      post: blogDetails.find((b) => b.id === blog.postId),
    }));

    // **PYTHON TIPS ANALYTICS**
    const [pythonTipStats, pythonTipInteractions] = await Promise.all([
      prisma.userPythonTipInteraction.aggregate({
        where: {
          firstViewedAt: Object.keys(dateFilter).length
            ? dateFilter
            : { gte: thirtyDaysAgo },
          hasViewed: true,
        },
        _count: { id: true },
        _avg: { timeSpent: true },
        _sum: { timeSpent: true, xpEarned: true },
      }),
      prisma.userPythonTipInteraction.findMany({
        where: {
          firstViewedAt: Object.keys(dateFilter).length
            ? dateFilter
            : { gte: sevenDaysAgo },
          hasViewed: true,
        },
        include: {
          tip: { select: { title: true, difficulty: true } },
          user: { select: { username: true, level: true } },
        },
        orderBy: { firstViewedAt: "desc" },
        take: 10,
      }),
    ]);

    // **ACHIEVEMENT ANALYTICS**
    const [achievementStats, recentAchievements] = await Promise.all([
      prisma.userBadge.aggregate({
        where: {
          earnedAt: Object.keys(dateFilter).length
            ? dateFilter
            : { gte: thirtyDaysAgo },
          isCompleted: true,
        },
        _count: { id: true },
      }),
      prisma.userBadge.findMany({
        where: {
          earnedAt: Object.keys(dateFilter).length
            ? dateFilter
            : { gte: sevenDaysAgo },
          isCompleted: true,
        },
        include: {
          badge: {
            select: { name: true, title: true, category: true, rarity: true },
          },
          user: { select: { username: true, level: true } },
        },
        orderBy: { earnedAt: "desc" },
        take: 10,
      }),
    ]);

    // **USER ENGAGEMENT TIMELINE**
    const rawEngagementTimeline = await prisma.$queryRaw`
      SELECT
        DATE(activity_date) as date,
        COUNT(CASE WHEN activity_date IS NOT NULL THEN 1 END) as daily_activities
      FROM (
        SELECT "completedAt" as activity_date FROM "quiz_attempts" WHERE "completedAt" >= ${thirtyDaysAgo}
        UNION ALL
        SELECT "completedAt" as activity_date FROM "code_arena_progress" WHERE "completedAt" >= ${thirtyDaysAgo} AND "isCompleted" = true
        UNION ALL
        SELECT "completedAt" as activity_date FROM "activity_attempts" WHERE "completedAt" >= ${thirtyDaysAgo} AND "completed" = true
        UNION ALL
        SELECT "firstViewedAt" as activity_date FROM "blog_post_interactions" WHERE "firstViewedAt" >= ${thirtyDaysAgo} AND "hasViewed" = true
      ) combined_activities
      GROUP BY DATE(activity_date)
      ORDER BY date ASC
    `;

    // Convert BigInt to Number for JSON serialization
    const engagementTimeline = (rawEngagementTimeline as any[]).map((row) => ({
      date: row.date,
      daily_activities: Number(row.daily_activities),
    }));

    // **OVERALL SUMMARY**
    const totalUsers = await prisma.user.count({
      where: {
        createdAt: Object.keys(dateFilter).length ? dateFilter : undefined,
      },
    });

    const activeUsers = await prisma.user.count({
      where: {
        OR: [
          { quizAttempts: { some: { completedAt: { gte: sevenDaysAgo } } } },
          {
            codeArenaProgress: { some: { completedAt: { gte: sevenDaysAgo } } },
          },
          {
            activityAttempts: { some: { completedAt: { gte: sevenDaysAgo } } },
          },
          {
            blogInteractions: {
              some: { firstViewedAt: { gte: sevenDaysAgo } },
            },
          },
        ],
      },
    });

    return NextResponse.json({
      summary: {
        totalUsers,
        activeUsers,
        totalQuizzes: quizStats._count.id || 0,
        totalCodeSubmissions: codeArenaStats._count.id || 0,
        totalLearningActivities: learningStats._count.id || 0,
        totalBlogViews: blogStats._count.id || 0,
        totalPythonTipViews: pythonTipStats._count.id || 0,
        totalAchievements: achievementStats._count.id || 0,
        averageQuizScore: quizStats._avg.score || 0,
        averageCodeArenaScore: codeArenaStats._avg.score || 0,
        totalLearningTime:
          (quizStats._sum.timeSpent || 0) +
          (codeArenaStats._sum.timeSpent || 0) +
          (learningStats._sum.timeSpent || 0),
      },
      quiz: {
        stats: quizStats,
        recentAttempts: quizAttempts,
        topQuizzes: topQuizzesWithDetails,
      },
      codeArena: {
        stats: codeArenaStats,
        recentSubmissions: codeSubmissions,
        topChallenges: topCodeArenasWithDetails,
      },
      learningActivities: {
        stats: learningStats,
        recentAttempts: learningAttempts,
      },
      blog: {
        stats: blogStats,
        recentViews: blogInteractions,
        topPosts: topBlogPostsWithDetails,
      },
      pythonTips: {
        stats: pythonTipStats,
        recentInteractions: pythonTipInteractions,
      },
      achievements: {
        stats: achievementStats,
        recentEarned: recentAchievements,
      },
      engagementTimeline,
      // Keep card analytics for backwards compatibility but make it optional
      cardAnalytics: {
        available: true,
        message: "Card analytics moved to separate endpoint",
      },
    });
  } catch (error) {
    console.error("Education Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch education analytics data" },
      { status: 500 }
    );
  }
}
