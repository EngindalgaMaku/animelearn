import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface AuthUser {
  userId: string;
  username: string;
}

// GET - Quiz sorularını getir
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Quiz'i ve sorularını getir
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: id,
        isActive: true,
      },
      include: {
        attempts: {
          where: {
            userId: authUser.userId,
          },
          orderBy: {
            startedAt: "desc",
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Questions'ı parse et
    let questions = [];
    try {
      questions = JSON.parse(quiz.questions);
    } catch (error) {
      console.error("Error parsing quiz questions:", error);
      questions = [];
    }

    // Kullanıcının önceki denemelerini al
    const bestAttempt =
      quiz.attempts.length > 0
        ? quiz.attempts.reduce((best: any, current: any) =>
            current.score > best.score ? current : best
          )
        : null;

    const transformedQuiz = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      difficulty: quiz.difficulty,
      diamondReward: quiz.diamondReward,
      experienceReward: quiz.experienceReward,
      questions: questions.map((q: any, index: number) => ({
        id: index + 1,
        type: q.type,
        question: q.question,
        options: q.options || [],
        points: q.points || 1,
        explanation: q.explanation,
      })),
      totalQuestions: questions.length,
      totalPoints: questions.reduce(
        (sum: number, q: any) => sum + (q.points || 1),
        0
      ),
      userStats: {
        attempts: quiz.attempts.length,
        bestScore: bestAttempt?.score || 0,
        bestScorePercentage: bestAttempt
          ? Math.round(
              (bestAttempt.score / (quiz.attempts[0]?.totalQuestions || 1)) *
                100
            )
          : 0,
        lastAttempt: quiz.attempts[0] || null,
      },
    };

    return NextResponse.json({
      success: true,
      quiz: transformedQuiz,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Quiz denemesi başlat/tamamla
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await req.json();
    const { action, answers, timeSpent } = body;

    // Quiz'i bul
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: id,
        isActive: true,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Questions'ı parse et
    let questions = [];
    try {
      questions = JSON.parse(quiz.questions);
    } catch (error) {
      return NextResponse.json({ error: "Invalid quiz data" }, { status: 500 });
    }

    switch (action) {
      case "start":
        // Yeni deneme başlat
        const attempt = await prisma.quizAttempt.create({
          data: {
            userId: authUser.userId,
            quizId: quiz.id,
            answers: "{}",
            score: 0,
            totalQuestions: questions.length,
            timeSpent: 0,
            isCompleted: false,
          },
        });

        return NextResponse.json({
          success: true,
          message: "Quiz started",
          attemptId: attempt.id,
        });

      case "submit":
        if (!answers || typeof answers !== "object") {
          return NextResponse.json(
            { error: "Invalid answers format" },
            { status: 400 }
          );
        }

        // Cevapları değerlendir
        let correctAnswers = 0;
        let totalScore = 0;
        const results: any[] = [];

        questions.forEach((question: any, index: number) => {
          const questionId = (index + 1).toString();
          const userAnswer = answers[questionId];
          const correctAnswer = question.correctAnswer;
          const isCorrect = userAnswer === correctAnswer;

          if (isCorrect) {
            correctAnswers++;
            totalScore += question.points || 1;
          }

          results.push({
            questionId,
            userAnswer,
            correctAnswer,
            isCorrect,
            points: isCorrect ? question.points || 1 : 0,
            explanation: question.explanation,
          });
        });

        const scorePercentage = Math.round(
          (correctAnswers / questions.length) * 100
        );

        // Quiz denemesini kaydet
        const completedAttempt = await prisma.quizAttempt.create({
          data: {
            userId: authUser.userId,
            quizId: quiz.id,
            answers: JSON.stringify(answers),
            score: totalScore,
            correctAnswers,
            totalQuestions: questions.length,
            timeSpent: timeSpent || 0,
            isCompleted: true,
            completedAt: new Date(),
          },
        });

        // Başarılıysa ödül ver (70% üzerinde)
        let rewards = null;
        if (scorePercentage >= 70) {
          await prisma.user.update({
            where: { id: authUser.userId },
            data: {
              currentDiamonds: { increment: quiz.diamondReward },
              totalDiamonds: { increment: quiz.diamondReward },
              experience: { increment: quiz.experienceReward },
              quizzesCompleted: { increment: 1 },
            },
          });

          // Diamond transaction kaydet
          await prisma.diamondTransaction.create({
            data: {
              userId: authUser.userId,
              amount: quiz.diamondReward,
              type: "QUIZ_COMPLETE",
              description: `Quiz tamamlandı: ${quiz.title}`,
              relatedType: "quiz",
              relatedId: quiz.id,
            },
          });

          rewards = {
            diamonds: quiz.diamondReward,
            experience: quiz.experienceReward,
          };
        }

        return NextResponse.json({
          success: true,
          message:
            scorePercentage >= 70
              ? "Quiz başarıyla tamamlandı!"
              : "Quiz tamamlandı",
          attempt: {
            id: completedAttempt.id,
            score: totalScore,
            correctAnswers,
            totalQuestions: questions.length,
            scorePercentage,
            timeSpent: timeSpent || 0,
            passed: scorePercentage >= 70,
          },
          results,
          rewards,
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing quiz:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
