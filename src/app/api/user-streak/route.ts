import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface AuthUser {
  userId: string;
  username: string;
}

// Streak milestone ödülleri
const STREAK_MILESTONES = {
  7: { diamonds: 50, experience: 100, title: "Haftalık Kahraman" },
  14: { diamonds: 100, experience: 200, title: "İki Haftalık Savaşçı" },
  30: { diamonds: 250, experience: 500, title: "Aylık Efsane" },
  60: { diamonds: 500, experience: 1000, title: "İki Aylık Usta" },
  100: { diamonds: 1000, experience: 2000, title: "Yüzlük Champion" },
  365: { diamonds: 5000, experience: 10000, title: "Yıllık Titan" },
};

// GET - Kullanıcının streak bilgilerini getir
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const authUser: AuthUser = {
      userId: session.user.id,
      username:
        (session.user as any).username || session.user.email || "Unknown",
    };

    // Kullanıcının streak bilgilerini al
    let userStreak = await prisma.userStreak.findUnique({
      where: { userId: authUser.userId },
    });

    if (!userStreak) {
      // Eğer streak kaydı yoksa oluştur
      userStreak = await prisma.userStreak.create({
        data: {
          userId: authUser.userId,
          currentStreak: 0,
          longestStreak: 0,
          loginStreak: 0,
          codeArenaStreak: 0,
          quizStreak: 0,
          totalRewardsEarned: 0,
        },
      });
    }

    // Bugünün tarihini al
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterday = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);

    // Streak durumunu kontrol et
    let streakStatus = "active";
    const lastActivityDate = userStreak.lastActivityDate
      ? new Date(userStreak.lastActivityDate)
      : null;

    if (!lastActivityDate) {
      streakStatus = "inactive";
    } else if (lastActivityDate.getTime() < yesterday.getTime()) {
      streakStatus = "broken";
    } else if (lastActivityDate.getTime() === todayStart.getTime()) {
      streakStatus = "completed_today";
    }

    // Sonraki milestone'ı hesapla
    const nextMilestone = Object.keys(STREAK_MILESTONES)
      .map(Number)
      .find((milestone) => milestone > userStreak!.currentStreak);

    // Günlük aktiviteleri kontrol et
    const todayActivities = await checkTodayActivities(
      authUser.userId,
      todayStart
    );

    return NextResponse.json({
      success: true,
      streak: {
        currentStreak: userStreak.currentStreak,
        longestStreak: userStreak.longestStreak,
        loginStreak: userStreak.loginStreak,
        codeArenaStreak: userStreak.codeArenaStreak,
        quizStreak: userStreak.quizStreak,
        totalRewardsEarned: userStreak.totalRewardsEarned,
        lastActivityDate: userStreak.lastActivityDate,
        streakStartDate: userStreak.streakStartDate,
        status: streakStatus,
      },
      milestones: {
        next: nextMilestone
          ? {
              day: nextMilestone,
              reward:
                STREAK_MILESTONES[
                  nextMilestone as keyof typeof STREAK_MILESTONES
                ],
              daysLeft: nextMilestone - userStreak.currentStreak,
            }
          : null,
        completed: Object.keys(STREAK_MILESTONES)
          .map(Number)
          .filter((milestone) => milestone <= userStreak!.longestStreak)
          .map((milestone) => ({
            day: milestone,
            reward:
              STREAK_MILESTONES[milestone as keyof typeof STREAK_MILESTONES],
          })),
      },
      todayActivities,
    });
  } catch (error) {
    console.error("Error fetching user streak:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Streak aktivitesi kaydet
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const authUser: AuthUser = {
      userId: session.user.id,
      username:
        (session.user as any).username || session.user.email || "Unknown",
    };

    const body = await req.json();
    const { activityType, forceUpdate } = body;

    // Valid activity types
    const validActivityTypes = ["login", "codeArena", "quiz", "daily_quest"];

    if (!validActivityTypes.includes(activityType)) {
      return NextResponse.json(
        { error: "Geçersiz aktivite tipi" },
        { status: 400 }
      );
    }

    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterday = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);

    // Kullanıcının streak bilgilerini al veya oluştur
    let userStreak = await prisma.userStreak.findUnique({
      where: { userId: authUser.userId },
    });

    if (!userStreak) {
      userStreak = await prisma.userStreak.create({
        data: {
          userId: authUser.userId,
          currentStreak: 1,
          longestStreak: 1,
          loginStreak: activityType === "login" ? 1 : 0,
          codeArenaStreak: activityType === "codeArena" ? 1 : 0,
          quizStreak: activityType === "quiz" ? 1 : 0,
          lastActivityDate: todayStart,
          streakStartDate: todayStart,
          totalRewardsEarned: 0,
        },
      });
    } else {
      const lastActivityDate = userStreak.lastActivityDate
        ? new Date(userStreak.lastActivityDate)
        : null;

      // Eğer bugün zaten aktivite varsa ve force update değilse, güncelleme yapma
      if (
        !forceUpdate &&
        lastActivityDate &&
        lastActivityDate.getTime() === todayStart.getTime()
      ) {
        return NextResponse.json({
          success: true,
          message: "Bugün zaten aktivite kaydedildi",
          streak: userStreak,
        });
      }

      let newCurrentStreak = userStreak.currentStreak;
      let newStreakStartDate = userStreak.streakStartDate;

      // Streak mantığı
      if (
        !lastActivityDate ||
        lastActivityDate.getTime() < yesterday.getTime()
      ) {
        // Streak kopmuş, yeniden başla
        newCurrentStreak = 1;
        newStreakStartDate = todayStart;
      } else if (lastActivityDate.getTime() === yesterday.getTime()) {
        // Streak devam ediyor
        newCurrentStreak = userStreak.currentStreak + 1;
      }
      // Eğer bugünse, streak sayısını artırma

      // Belirli aktivite streak'ini güncelle
      const activityStreamUpdates: any = {};
      if (activityType === "login") {
        activityStreamUpdates.loginStreak = { increment: 1 };
      } else if (activityType === "codeArena") {
        activityStreamUpdates.codeArenaStreak = { increment: 1 };
      } else if (activityType === "quiz") {
        activityStreamUpdates.quizStreak = { increment: 1 };
      }

      userStreak = await prisma.userStreak.update({
        where: { userId: authUser.userId },
        data: {
          currentStreak: newCurrentStreak,
          longestStreak: Math.max(userStreak.longestStreak, newCurrentStreak),
          lastActivityDate: todayStart,
          streakStartDate: newStreakStartDate,
          ...activityStreamUpdates,
        },
      });
    }

    // Milestone ödülü kontrolü
    const milestoneReward = await checkAndGiveMilestoneReward(
      authUser.userId,
      userStreak.currentStreak
    );

    return NextResponse.json({
      success: true,
      message: `${activityType} aktivitesi kaydedildi!`,
      streak: {
        currentStreak: userStreak.currentStreak,
        longestStreak: userStreak.longestStreak,
        lastActivityDate: userStreak.lastActivityDate,
      },
      milestoneReward,
    });
  } catch (error) {
    console.error("Error updating user streak:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Bugünün aktivitelerini kontrol et
async function checkTodayActivities(userId: string, todayStart: Date) {
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const [lessonCompletion, quizAttempts, dailyQuests, dailyMiniQuiz] =
    await Promise.all([
      // Lesson (migrated from Code Arena) tamamlama
      prisma.activityAttempt.findFirst({
        where: {
          userId,
          completed: true,
          completedAt: {
            gte: todayStart,
            lt: todayEnd,
          },
          activity: { activityType: "lesson" },
        },
      }),

      // Quiz çözme
      prisma.quizAttempt.findFirst({
        where: {
          userId,
          completedAt: {
            gte: todayStart,
            lt: todayEnd,
          },
        },
      }),

      // Daily quest
      prisma.dailyQuest.findFirst({
        where: {
          userId,
          isCompleted: true,
          date: {
            gte: todayStart,
            lt: todayEnd,
          },
        },
      }),

      // Daily mini quiz
      prisma.dailyMiniQuizAttempt.findFirst({
        where: {
          userId,
          completedAt: {
            gte: todayStart,
            lt: todayEnd,
          },
        },
      }),
    ]);

  return {
    codeArena: !!lessonCompletion,
    quiz: !!quizAttempts,
    dailyQuest: !!dailyQuests,
    dailyMiniQuiz: !!dailyMiniQuiz,
    login: true, // API çağrısı yapıldığında login olduğunu varsayıyoruz
  };
}

// Milestone ödül kontrolü
async function checkAndGiveMilestoneReward(
  userId: string,
  currentStreak: number
) {
  const milestone =
    STREAK_MILESTONES[currentStreak as keyof typeof STREAK_MILESTONES];

  if (!milestone) {
    return null;
  }

  // Ödül ver
  await prisma.user.update({
    where: { id: userId },
    data: {
      currentDiamonds: { increment: milestone.diamonds },
      totalDiamonds: { increment: milestone.diamonds },
      experience: { increment: milestone.experience },
    },
  });

  // Diamond transaction kaydet
  await prisma.diamondTransaction.create({
    data: {
      userId,
      amount: milestone.diamonds,
      type: "STREAK_MILESTONE",
      description: `Streak milestone ödülü: ${currentStreak} gün (${milestone.title})`,
      relatedType: "streak",
      relatedId: currentStreak.toString(),
    },
  });

  // Streak ödül toplamını güncelle
  await prisma.userStreak.update({
    where: { userId },
    data: {
      totalRewardsEarned: { increment: milestone.diamonds },
    },
  });

  return {
    day: currentStreak,
    diamonds: milestone.diamonds,
    experience: milestone.experience,
    title: milestone.title,
  };
}
