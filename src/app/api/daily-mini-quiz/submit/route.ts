import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAndAwardBadges } from "@/lib/badges";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface AuthUser {
  userId: string;
  username: string;
}

interface RewardAnimation {
  type: string;
  amount: any;
  icon: string;
  color: string;
  delay: number;
  badgeData?: any;
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

// Calculate user level from experience
function calculateLevel(experience: number): number {
  return Math.floor(experience / 1000) + 1;
}

// Calculate experience needed for next level
function calculateExpToNextLevel(experience: number, level: number): number {
  return level * 1000 - experience;
}

// POST - Daily Mini Quiz'i çöz
export async function POST(req: NextRequest) {
  try {
    const authUser = await getUserFromSession();
    const isLoggedIn = !!authUser;

    const body = await req.json();
    const { quizId, answers, timeSpent } = body;

    // Enhanced validation
    if (!quizId || !answers || typeof answers !== "object") {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: {
            quizId: !quizId ? "Quiz ID is required" : null,
            answers: !answers ? "Answers are required" : null,
            answersType:
              typeof answers !== "object" ? "Answers must be an object" : null,
          },
        },
        { status: 400 }
      );
    }

    // Validate timeSpent
    if (
      timeSpent !== undefined &&
      (typeof timeSpent !== "number" || timeSpent < 0)
    ) {
      return NextResponse.json(
        { error: "Time spent must be a non-negative number" },
        { status: 400 }
      );
    }

    // Quiz'i bul
    const quiz = await prisma.dailyMiniQuiz.findUnique({
      where: {
        id: quizId,
        isActive: true,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz bulunamadı" }, { status: 404 });
    }

    // Kullanıcının daha önce bu quiz'i çözüp çözmediğini kontrol et (sadece giriş yapan kullanıcılar için)
    let existingAttempt = null;
    if (isLoggedIn && authUser) {
      existingAttempt = await prisma.dailyMiniQuizAttempt.findUnique({
        where: {
          userId_quizId: {
            userId: authUser.userId,
            quizId: quiz.id,
          },
        },
      });

      if (existingAttempt) {
        return NextResponse.json(
          { error: "Bu quiz'i zaten çözdünüz" },
          { status: 400 }
        );
      }
    }

    // Questions'ı parse et
    let questions = [];
    try {
      questions = JSON.parse(quiz.questions);
    } catch (error) {
      return NextResponse.json(
        {
          error: "Quiz verileri hatalı",
        },
        { status: 500 }
      );
    }

    // Cevapları değerlendir
    let correctAnswers = 0;
    const results: any[] = [];

    questions.forEach((question: any, index: number) => {
      const questionId = (index + 1).toString();
      const userAnswer = answers[questionId];
      const correctAnswer = question.correctAnswer;
      const isCorrect = userAnswer === correctAnswer;

      if (isCorrect) {
        correctAnswers++;
      }

      results.push({
        questionId,
        question: question.question,
        userAnswer,
        correctAnswer,
        isCorrect,
        explanation: question.explanation,
      });
    });

    // Skor hesapla (0-100 arası)
    const score = Math.round((correctAnswers / questions.length) * 100);

    // Ödül hesapla (80% üzerinde tam ödül, altında yarı ödül)
    let diamondsEarned = 0;
    let experienceEarned = 0;

    if (score >= 80) {
      diamondsEarned = quiz.diamondReward;
      experienceEarned = quiz.experienceReward;
    } else if (score >= 60) {
      diamondsEarned = Math.round(quiz.diamondReward * 0.5);
      experienceEarned = Math.round(quiz.experienceReward * 0.5);
    }

    // Get user before transaction to check current state
    const userBefore = await prisma.user.findUnique({
      where: { id: authUser!.userId },
      select: {
        id: true,
        experience: true,
        currentDiamonds: true,
        level: true,
        quizzesCompleted: true,
        username: true,
      },
    });

    if (!userBefore) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate new values if rewards are earned
    let finalDiamonds = userBefore.currentDiamonds;
    let finalExperience = userBefore.experience;
    let finalLevel = userBefore.level;
    let leveledUp = false;

    if (diamondsEarned > 0 || experienceEarned > 0) {
      finalExperience = userBefore.experience + experienceEarned;
      finalDiamonds = userBefore.currentDiamonds + diamondsEarned;
      finalLevel = calculateLevel(finalExperience);
      leveledUp = finalLevel > userBefore.level;
    }

    // Begin transaction - ALL updates must be atomic
    const result = await prisma.$transaction(async (prisma) => {
      // Create quiz attempt record
      const attempt = await prisma.dailyMiniQuizAttempt.create({
        data: {
          userId: authUser!.userId,
          quizId: quiz.id,
          answers: JSON.stringify(answers),
          score: score,
          timeSpent: timeSpent || 0,
          diamondsEarned,
          experienceEarned,
        },
      });

      // Award rewards if earned
      if (diamondsEarned > 0 || experienceEarned > 0) {
        // Update user with main rewards
        let updatedUser = await prisma.user.update({
          where: { id: authUser!.userId },
          data: {
            currentDiamonds: finalDiamonds,
            totalDiamonds: { increment: diamondsEarned },
            experience: finalExperience,
            level: finalLevel,
            quizzesCompleted: { increment: 1 },
          },
        });

        // Handle level up bonuses within the same transaction
        if (leveledUp) {
          updatedUser = await prisma.user.update({
            where: { id: authUser!.userId },
            data: {
              currentDiamonds: { increment: 50 },
              totalDiamonds: { increment: 50 },
              experience: { increment: 100 },
            },
          });

          // Create level up transaction
          await prisma.diamondTransaction.create({
            data: {
              userId: authUser!.userId,
              amount: 50,
              type: "LEVEL_UP_BONUS",
              description: `Level up bonus! Reached level ${finalLevel}`,
              relatedType: "level_up",
              relatedId: finalLevel.toString(),
            },
          });
        }

        // Create main diamond transaction
        if (diamondsEarned > 0) {
          await prisma.diamondTransaction.create({
            data: {
              userId: authUser!.userId,
              amount: diamondsEarned,
              type: "DAILY_QUIZ",
              description: `Günlük mini quiz tamamlandı: ${quiz.title}`,
              relatedType: "daily_mini_quiz",
              relatedId: quiz.id,
            },
          });
        }
      }

      // Update quiz statistics
      await prisma.dailyMiniQuiz.update({
        where: { id: quiz.id },
        data: {
          totalAttempts: { increment: 1 },
          totalCorrect: { increment: correctAnswers },
        },
      });

      // Check for new badges
      let newBadges: any[] = [];
      try {
        newBadges = await checkAndAwardBadges(authUser!.userId);
      } catch (error) {
        console.error("Error checking badges:", error);
        // Don't fail the entire transaction for badge errors
      }

      return { attempt, newBadges };
    });

    // Update user streak after transaction
    await updateUserStreak(authUser!.userId);

    // Calculate final values including level up bonuses
    if (leveledUp) {
      finalDiamonds += 50;
      finalExperience += 100;
      finalLevel = calculateLevel(finalExperience);
    }

    // Prepare reward animation data
    const rewardAnimations: RewardAnimation[] = [];

    if (experienceEarned > 0) {
      rewardAnimations.push({
        type: "experience",
        amount: experienceEarned + (leveledUp ? 100 : 0),
        icon: "⭐",
        color: "#FFD700",
        delay: 0,
      });
    }

    if (diamondsEarned > 0) {
      rewardAnimations.push({
        type: "diamonds",
        amount: diamondsEarned + (leveledUp ? 50 : 0),
        icon: "💎",
        color: "#00D4FF",
        delay: 500,
      });
    }

    // Add level up animation if applicable
    if (leveledUp) {
      rewardAnimations.push({
        type: "level_up",
        amount: finalLevel,
        icon: "🎉",
        color: "#FF6B6B",
        delay: 1000,
      });
    }

    // Add badge animations if any new badges
    if (result.newBadges.length > 0) {
      result.newBadges.forEach((badge, index) => {
        rewardAnimations.push({
          type: "badge",
          amount: 1,
          icon: badge.badge?.icon || "🏆",
          color: badge.badge?.color || "#FFD700",
          delay: 1500 + index * 300,
          badgeData: badge.badge,
        });
      });
    }

    return NextResponse.json({
      success: true,
      message:
        score >= 80
          ? `Mükemmel! Günlük quiz'i başarıyla tamamladınız!${leveledUp ? ` Level ${finalLevel}'e ulaştınız!` : ""}`
          : score >= 60
            ? `İyi iş! Günlük quiz'i tamamladınız${leveledUp ? ` Level ${finalLevel}'e ulaştınız!` : ""}`
            : "Quiz tamamlandı. Daha iyi yapmak için tekrar deneyin!",
      attempt: {
        id: result.attempt.id,
        score,
        correctAnswers,
        totalQuestions: questions.length,
        timeSpent: timeSpent || 0,
        diamondsEarned: finalDiamonds - userBefore.currentDiamonds,
        experienceEarned: finalExperience - userBefore.experience,
      },
      results,
      rewards: {
        diamonds: finalDiamonds - userBefore.currentDiamonds,
        experience: finalExperience - userBefore.experience,
        levelUp: leveledUp,
        newLevel: leveledUp ? finalLevel : undefined,
        badges: result.newBadges,
      },
      animations: rewardAnimations,
      user: {
        id: authUser!.userId,
        username: userBefore.username,
        level: finalLevel,
        experience: finalExperience,
        diamonds: finalDiamonds,
        expToNextLevel: calculateExpToNextLevel(finalExperience, finalLevel),
      },
    });
  } catch (error) {
    console.error("Error submitting daily mini quiz:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Streak güncelleme yardımcı fonksiyonu
async function updateUserStreak(userId: string) {
  try {
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterday = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);

    // Kullanıcının streak bilgisini al
    let userStreak = await prisma.userStreak.findUnique({
      where: { userId },
    });

    if (!userStreak) {
      // İlk streak oluştur
      userStreak = await prisma.userStreak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastActivityDate: todayStart,
          streakStartDate: todayStart,
          quizStreak: 1,
        },
      });
    } else {
      const lastActivityDate = userStreak.lastActivityDate
        ? new Date(userStreak.lastActivityDate)
        : null;

      // Eğer bugün zaten aktifse güncelleme yapma
      if (
        lastActivityDate &&
        lastActivityDate.getTime() === todayStart.getTime()
      ) {
        return;
      }

      // Eğer dün aktifse streak devam ediyor
      if (
        lastActivityDate &&
        lastActivityDate.getTime() === yesterday.getTime()
      ) {
        const newStreak = userStreak.currentStreak + 1;
        await prisma.userStreak.update({
          where: { userId },
          data: {
            currentStreak: newStreak,
            longestStreak: Math.max(userStreak.longestStreak, newStreak),
            lastActivityDate: todayStart,
            quizStreak: { increment: 1 },
          },
        });
      } else {
        // Streak kopmuş, yeniden başla
        await prisma.userStreak.update({
          where: { userId },
          data: {
            currentStreak: 1,
            lastActivityDate: todayStart,
            streakStartDate: todayStart,
            quizStreak: 1,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error updating user streak:", error);
  }
}
