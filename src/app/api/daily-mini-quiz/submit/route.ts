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

// POST - Daily Mini Quiz'i çöz
export async function POST(req: NextRequest) {
  try {
    const authUser = getUserFromToken(req);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { quizId, answers, timeSpent } = body;

    // Validation
    if (!quizId || !answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Quiz ID ve cevaplar gerekli" },
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

    // Kullanıcının daha önce bu quiz'i çözüp çözmediğini kontrol et
    const existingAttempt = await prisma.dailyMiniQuizAttempt.findUnique({
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

    // Questions'ı parse et
    let questions = [];
    try {
      questions = JSON.parse(quiz.questions);
    } catch (error) {
      return NextResponse.json({ 
        error: "Quiz verileri hatalı" 
      }, { status: 500 });
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

    // Quiz denemesini kaydet
    const attempt = await prisma.dailyMiniQuizAttempt.create({
      data: {
        userId: authUser.userId,
        quizId: quiz.id,
        answers: JSON.stringify(answers),
        score: score,
        timeSpent: timeSpent || 0,
        diamondsEarned,
        experienceEarned,
      },
    });

    // Kullanıcıya ödül ver
    if (diamondsEarned > 0 || experienceEarned > 0) {
      await prisma.user.update({
        where: { id: authUser.userId },
        data: {
          currentDiamonds: { increment: diamondsEarned },
          totalDiamonds: { increment: diamondsEarned },
          experience: { increment: experienceEarned },
        },
      });

      // Diamond transaction kaydet
      if (diamondsEarned > 0) {
        await prisma.diamondTransaction.create({
          data: {
            userId: authUser.userId,
            amount: diamondsEarned,
            type: "DAILY_QUIZ",
            description: `Günlük mini quiz tamamlandı: ${quiz.title}`,
            relatedType: "daily_mini_quiz",
            relatedId: quiz.id,
          },
        });
      }
    }

    // Quiz istatistiklerini güncelle
    await prisma.dailyMiniQuiz.update({
      where: { id: quiz.id },
      data: {
        totalAttempts: { increment: 1 },
        totalCorrect: { increment: correctAnswers },
      },
    });

    // Streak kontrolü ve güncelleme
    await updateUserStreak(authUser.userId);

    return NextResponse.json({
      success: true,
      message: score >= 80 
        ? "Mükemmel! Günlük quiz'i başarıyla tamamladınız!" 
        : score >= 60
        ? "İyi iş! Günlük quiz'i tamamladınız"
        : "Quiz tamamlandı. Daha iyi yapmak için tekrar deneyin!",
      attempt: {
        id: attempt.id,
        score,
        correctAnswers,
        totalQuestions: questions.length,
        timeSpent: timeSpent || 0,
        diamondsEarned,
        experienceEarned,
      },
      results,
      rewards: {
        diamonds: diamondsEarned,
        experience: experienceEarned,
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
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
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
      const lastActivityDate = userStreak.lastActivityDate ? new Date(userStreak.lastActivityDate) : null;
      
      // Eğer bugün zaten aktifse güncelleme yapma
      if (lastActivityDate && lastActivityDate.getTime() === todayStart.getTime()) {
        return;
      }

      // Eğer dün aktifse streak devam ediyor
      if (lastActivityDate && lastActivityDate.getTime() === yesterday.getTime()) {
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
