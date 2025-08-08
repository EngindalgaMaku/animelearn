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

// GET - Günün mini quiz'ini getir
export async function GET(req: NextRequest) {
  try {
    const authUser = getUserFromToken(req);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Bugünün tarihini al (UTC)
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    // Bugün için aktif quiz'i bul
    const todayQuiz = await prisma.dailyMiniQuiz.findFirst({
      where: {
        date: {
          gte: todayStart,
          lt: todayEnd,
        },
        isActive: true,
      },
    });

    if (!todayQuiz) {
      return NextResponse.json({ 
        error: "Bugün için aktif quiz bulunamadı" 
      }, { status: 404 });
    }

    // Kullanıcının bugün bu quiz'i çözüp çözmediğini kontrol et
    const userAttempt = await prisma.dailyMiniQuizAttempt.findUnique({
      where: {
        userId_quizId: {
          userId: authUser.userId,
          quizId: todayQuiz.id,
        },
      },
    });

    // Questions'ı parse et
    let questions = [];
    try {
      questions = JSON.parse(todayQuiz.questions);
    } catch (error) {
      console.error("Error parsing quiz questions:", error);
      return NextResponse.json({ 
        error: "Quiz verileri hatalı" 
      }, { status: 500 });
    }

    // Eğer kullanıcı quiz'i çözmişse, sonuçları göster
    if (userAttempt) {
      let userAnswers: { [key: string]: any } = {};
      try {
        userAnswers = JSON.parse(userAttempt.answers);
      } catch (error) {
        userAnswers = {};
      }

      return NextResponse.json({
        success: true,
        quiz: {
          id: todayQuiz.id,
          title: todayQuiz.title,
          description: todayQuiz.description,
          category: todayQuiz.category,
          difficulty: todayQuiz.difficulty,
          date: todayQuiz.date,
          questions: questions.map((q: any, index: number) => ({
            id: index + 1,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            userAnswer: userAnswers[(index + 1).toString()],
          })),
        },
        userAttempt: {
          id: userAttempt.id,
          score: userAttempt.score,
          timeSpent: userAttempt.timeSpent,
          diamondsEarned: userAttempt.diamondsEarned,
          experienceEarned: userAttempt.experienceEarned,
          completedAt: userAttempt.completedAt,
        },
        completed: true,
      });
    }

    // Quiz henüz çözülmemişse, sadece soruları göster (cevaplar olmadan)
    return NextResponse.json({
      success: true,
      quiz: {
        id: todayQuiz.id,
        title: todayQuiz.title,
        description: todayQuiz.description,
        category: todayQuiz.category,
        difficulty: todayQuiz.difficulty,
        date: todayQuiz.date,
        diamondReward: todayQuiz.diamondReward,
        experienceReward: todayQuiz.experienceReward,
        questions: questions.map((q: any, index: number) => ({
          id: index + 1,
          question: q.question,
          options: q.options,
          // correctAnswer ve explanation gizlenir
        })),
        totalQuestions: questions.length,
      },
      completed: false,
    });

  } catch (error) {
    console.error("Error fetching daily mini quiz:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Günlük mini quiz oluştur (Admin only)
export async function POST(req: NextRequest) {
  try {
    const authUser = getUserFromToken(req);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin yetkisi kontrolü - şimdilik tüm kullanıcılara izin ver (role alanı yoksa)
    // Gelecekte role tablosu eklenebilir
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Role kontrolü şimdilik devre dışı - tüm kullanıcılar quiz oluşturabilir
    // if (!user || user.role !== "ADMIN") {
    //   return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    // }

    const body = await req.json();
    const {
      title,
      description,
      category,
      difficulty,
      questions,
      diamondReward,
      experienceReward,
      date,
    } = body;

    // Validation
    if (!title || !questions || !Array.isArray(questions) || questions.length !== 5) {
      return NextResponse.json(
        { error: "Title ve 5 adet soru gerekli" },
        { status: 400 }
      );
    }

    // Her sorunun gerekli alanları kontrol et
    for (const q of questions) {
      if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length < 2 || q.correctAnswer === undefined) {
        return NextResponse.json(
          { error: "Her soru için question, options (min 2) ve correctAnswer gerekli" },
          { status: 400 }
        );
      }
    }

    // Belirtilen tarihte quiz var mı kontrol et
    const quizDate = date ? new Date(date) : new Date();
    const dateStart = new Date(quizDate.getFullYear(), quizDate.getMonth(), quizDate.getDate());
    const dateEnd = new Date(dateStart.getTime() + 24 * 60 * 60 * 1000);

    const existingQuiz = await prisma.dailyMiniQuiz.findFirst({
      where: {
        date: {
          gte: dateStart,
          lt: dateEnd,
        },
      },
    });

    if (existingQuiz) {
      return NextResponse.json(
        { error: "Bu tarih için zaten bir quiz mevcut" },
        { status: 400 }
      );
    }

    // Quiz'i oluştur
    const newQuiz = await prisma.dailyMiniQuiz.create({
      data: {
        title,
        description: description || "",
        category: category || "mixed",
        difficulty: difficulty || "medium",
        questions: JSON.stringify(questions),
        diamondReward: diamondReward || 10,
        experienceReward: experienceReward || 25,
        date: dateStart,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Daily Mini Quiz başarıyla oluşturuldu",
      quiz: {
        id: newQuiz.id,
        title: newQuiz.title,
        category: newQuiz.category,
        difficulty: newQuiz.difficulty,
        date: newQuiz.date,
      },
    });

  } catch (error) {
    console.error("Error creating daily mini quiz:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
