import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

// GET - Kullanıcının genel progress bilgilerini getir
export async function GET(req: NextRequest) {
  try {
    const authUser = await getUserFromSession();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const timeframe = searchParams.get("timeframe") || "all"; // all, week, month
    const category = searchParams.get("category"); // basic, intermediate, advanced

    // Tarih filtresi
    let dateFilter = {};
    if (timeframe === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { gte: weekAgo };
    } else if (timeframe === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { gte: monthAgo };
    }

    // Kullanıcının genel bilgilerini al
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        username: true,
        level: true,
        experience: true,
        codeArenasCompleted: true,
        quizzesCompleted: true,
        codeSubmissionCount: true,
        loginStreak: true,
        maxLoginStreak: true,
        lastLoginDate: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Lesson attempts (migrated from CodeArena progress)
    const attempts = await prisma.activityAttempt.findMany({
      where: {
        userId: authUser.userId,
        ...(category && { activity: { category } }),
        ...(Object.keys(dateFilter).length > 0 && {
          OR: [{ startedAt: dateFilter }, { completedAt: dateFilter }],
        }),
        activity: { activityType: "lesson" },
      },
      include: {
        activity: {
          select: {
            title: true,
            category: true,
            difficulty: true,
            diamondReward: true,
            experienceReward: true,
            settings: true,
          },
        },
      },
      orderBy: { completedAt: "desc" },
    });

    // Helpers for transforming to legacy shape expected below
    const parseJSON = <T>(val: any, fallback: T): T => {
      try {
        if (!val) return fallback;
        if (typeof val === "string") return JSON.parse(val) as T;
        return val as T;
      } catch {
        return fallback;
      }
    };
    const slugify = (title: string) =>
      (title || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

    // Build legacy-like progress entries so the rest of the file remains unchanged
    const codeArenaProgresses = attempts.map((at) => {
      const settings = parseJSON<any>(at.activity?.settings, null);
      const slug =
        (settings?.slug &&
          typeof settings.slug === "string" &&
          settings.slug) ||
        slugify(at.activity?.title || "");
      return {
        isCompleted: !!at.completed,
        isStarted: !!at.startedAt,
        lastVisit: at.completedAt || at.startedAt,
        timeSpent: at.timeSpent || 0,
        codeArena: {
          title: at.activity?.title || "",
          slug,
          category: at.activity?.category || "general",
          difficulty: at.activity?.difficulty || 1,
          diamondReward: at.activity?.diamondReward || 0,
          experienceReward: at.activity?.experienceReward || 0,
          order: undefined,
        },
      };
    });

    // Quiz attempts'leri al
    const quizAttemptsQuery: any = {
      where: {
        userId: authUser.userId,
        ...(Object.keys(dateFilter).length > 0 && {
          startedAt: dateFilter,
        }),
      },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            diamondReward: true,
            experienceReward: true,
            codeArena: {
              select: {
                title: true,
                slug: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        startedAt: "desc",
      },
    };

    const quizAttempts = await prisma.quizAttempt.findMany(quizAttemptsQuery);

    // Code submissions'ları al
    const codeSubmissionsQuery: any = {
      where: {
        userId: authUser.userId,
        ...(Object.keys(dateFilter).length > 0 && {
          submittedAt: dateFilter,
        }),
      },
      include: {
        codeArena: {
          select: {
            title: true,
            slug: true,
            category: true,
          },
        },
      } as any,
      orderBy: {
        submittedAt: "desc",
      },
      take: 50,
    };

    const codeSubmissions =
      await prisma.codeSubmission.findMany(codeSubmissionsQuery);

    // İstatistikleri hesapla
    const stats = {
      totalCodeArenas: codeArenaProgresses.length,
      completedCodeArenas: codeArenaProgresses.filter((lp) => lp.isCompleted)
        .length,
      inProgressCodeArenas: codeArenaProgresses.filter(
        (lp) => lp.isStarted && !lp.isCompleted
      ).length,
      totalTimeSpent: codeArenaProgresses.reduce(
        (sum, lp) => sum + (lp.timeSpent || 0),
        0
      ),

      totalQuizzes: quizAttempts.length,
      passedQuizzes: quizAttempts.filter((qa) => qa.score >= 70).length,
      averageQuizScore:
        quizAttempts.length > 0
          ? Math.round(
              quizAttempts.reduce((sum, qa) => sum + qa.score, 0) /
                quizAttempts.length
            )
          : 0,

      totalCodeSubmissions: codeSubmissions.length,
      successfulSubmissions: codeSubmissions.filter((cs) => cs.isCorrect)
        .length,

      // Kategori bazlı istatistikler
      categoryStats: {} as any,
    };

    // Kategori bazlı progress
    const categories = ["basic", "intermediate", "advanced", "project"];
    for (const cat of categories) {
      const catCodeArenas = codeArenaProgresses.filter(
        (lp: any) => lp.codeArena.category === cat
      );
      stats.categoryStats[cat] = {
        total: catCodeArenas.length,
        completed: catCodeArenas.filter((lp: any) => lp.isCompleted).length,
        inProgress: catCodeArenas.filter(
          (lp: any) => lp.isStarted && !lp.isCompleted
        ).length,
        completionRate:
          catCodeArenas.length > 0
            ? Math.round(
                (catCodeArenas.filter((lp: any) => lp.isCompleted).length /
                  catCodeArenas.length) *
                  100
              )
            : 0,
      };
    }

    // Haftalık aktivite (son 7 gün)
    const weeklyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayActivity = {
        date: date.toISOString().split("T")[0],
        codeArenas: codeArenaProgresses.filter((lp: any) => {
          const visitDate = new Date(lp.lastVisit);
          return visitDate >= date && visitDate < nextDate;
        }).length,
        submissions: codeSubmissions.filter((cs: any) => {
          const subDate = new Date(cs.submittedAt);
          return subDate >= date && subDate < nextDate;
        }).length,
        timeSpent: codeArenaProgresses
          .filter((lp: any) => {
            const visitDate = new Date(lp.lastVisit);
            return visitDate >= date && visitDate < nextDate;
          })
          .reduce((sum, lp) => sum + (lp.timeSpent || 0), 0),
      };

      weeklyActivity.push(dayActivity);
    }

    // Başarımlar ve milestone'lar
    const achievements = {
      firstCodeArena: codeArenaProgresses.some((lp) => lp.isCompleted),
      firstQuiz: quizAttempts.some((qa) => qa.isCompleted),
      firstCode: codeSubmissions.some((cs) => cs.isCorrect),
      streak: user.loginStreak,
      maxStreak: user.maxLoginStreak,
      codeArenasCompleted: user.codeArenasCompleted,
      quizzesCompleted: user.quizzesCompleted,
    };

    // Son aktiviteler
    const recentActivities = [
      ...codeArenaProgresses.slice(0, 5).map((lp: any) => ({
        type: "code_arena",
        action: lp.isCompleted ? "completed" : "started",
        title: lp.codeArena.title,
        slug: lp.codeArena.slug,
        date: lp.isCompleted ? lp.completedAt : lp.startedAt,
        reward: lp.isCompleted ? lp.codeArena.diamondReward : null,
      })),
      ...quizAttempts.slice(0, 5).map((qa: any) => ({
        type: "quiz",
        action: qa.score >= 70 ? "passed" : "failed",
        title: qa.quiz.title,
        score: qa.score,
        date: qa.startedAt,
        reward: qa.score >= 70 ? qa.quiz.diamondReward : null,
      })),
      ...codeSubmissions.slice(0, 5).map((cs: any) => ({
        type: "code",
        action: cs.isCorrect ? "success" : "attempt",
        title: cs.codeArena?.title || "Code Exercise",
        date: cs.submittedAt,
        score: cs.score,
      })),
    ]
      .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        level: user.level,
        experience: user.experience,
        memberSince: user.createdAt,
        lastActive: user.lastLoginDate,
      },
      stats,
      weeklyActivity,
      achievements,
      recentActivities,
      timeframe,
      category: category || "all",
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Progress istatistiklerini güncelle
export async function POST(req: NextRequest) {
  try {
    const authUser = await getUserFromSession();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, data } = body;

    switch (action) {
      case "update_login_streak":
        const user = await prisma.user.findUnique({
          where: { id: authUser.userId },
        });

        if (!user) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        const today = new Date();
        const lastLogin = user.lastLoginDate
          ? new Date(user.lastLoginDate)
          : null;
        let newStreak = 1;

        if (lastLogin) {
          const daysDiff = Math.floor(
            (today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysDiff === 1) {
            // Ardışık gün
            newStreak = user.loginStreak + 1;
          } else if (daysDiff === 0) {
            // Aynı gün
            newStreak = user.loginStreak;
          } else {
            // Streak broken
            newStreak = 1;
          }
        }

        await prisma.user.update({
          where: { id: authUser.userId },
          data: {
            loginStreak: newStreak,
            maxLoginStreak: Math.max(newStreak, user.maxLoginStreak),
            lastLoginDate: today,
          },
        });

        return NextResponse.json({
          success: true,
          message: "Login streak updated",
          newStreak,
          maxStreak: Math.max(newStreak, user.maxLoginStreak),
        });

      case "reset_progress":
        // Sadece test ortamı için - production'da kaldırılmalı
        if (process.env.NODE_ENV === "development") {
          await prisma.activityAttempt.deleteMany({
            where: {
              userId: authUser.userId,
              activity: { activityType: "lesson" },
            },
          });

          await prisma.quizAttempt.deleteMany({
            where: { userId: authUser.userId },
          });

          await prisma.codeSubmission.deleteMany({
            where: { userId: authUser.userId },
          });

          await prisma.user.update({
            where: { id: authUser.userId },
            data: {
              experience: 0,
              level: 1,
              codeArenasCompleted: 0,
              quizzesCompleted: 0,
              codeSubmissionCount: 0,
              loginStreak: 0,
            },
          });

          return NextResponse.json({
            success: true,
            message: "Progress reset successfully",
          });
        } else {
          return NextResponse.json(
            { error: "Operation not allowed in production" },
            { status: 403 }
          );
        }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
