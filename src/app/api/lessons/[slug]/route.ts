import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAndAwardBadges } from "@/lib/badges";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface AuthUser {
  userId: string;
  username: string;
}

// Token'dan kullanıcı bilgilerini çıkart
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authUser = getUserFromToken(req);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;

    // Get code arena with user progress and quizzes
    const codeArena = await prisma.codeArena.findUnique({
      where: {
        slug: slug,
        isPublished: true,
      },
      include: {
        progress: {
          where: {
            userId: authUser.userId,
          },
        },
        quizzes: {
          include: {
            attempts: {
              where: {
                userId: authUser.userId,
              },
              orderBy: {
                startedAt: "desc",
              },
              take: 5,
            },
          },
        },
      },
    });

    if (!codeArena) {
      return NextResponse.json({ error: "Code Arena not found" }, { status: 404 });
    }

    // Parse content from JSON string to object
    let parsedContent;
    try {
      parsedContent =
        typeof codeArena.content === "string"
          ? JSON.parse(codeArena.content)
          : codeArena.content;

      // DEBUG: Log the parsed content for variables code arena
      if (codeArena.slug === "variables") {
        console.log("=== VARIABLES CODE ARENA DEBUG ===");
        console.log("Raw content type:", typeof codeArena.content);
        console.log("Parsed content:", JSON.stringify(parsedContent, null, 2));
        console.log(
          "Sections keys:",
          Object.keys(parsedContent.sections || {})
        );
        console.log("=====================================");
      }
    } catch (error) {
      console.log("Content parse error:", error);
      parsedContent = { sections: {} };
    }

    // Parse other JSON fields
    let parsedHints = [];
    try {
      parsedHints = codeArena.hints ? JSON.parse(codeArena.hints) : [];
    } catch (error) {
      parsedHints = [];
    }

    let parsedTestCases = [];
    try {
      parsedTestCases = codeArena.testCases ? JSON.parse(codeArena.testCases) : [];
    } catch (error) {
      parsedTestCases = [];
    }

    let parsedPrerequisites = [];
    try {
      parsedPrerequisites = codeArena.prerequisites
        ? JSON.parse(codeArena.prerequisites)
        : [];
    } catch (error) {
      parsedPrerequisites = [];
    }

    const progress = codeArena.progress[0];
    const quiz = codeArena.quizzes[0];

    // Parse quiz from code arena data if available
    let parsedQuiz = null;
    try {
      // Check if code arena has quiz data in content or separate field
      if (codeArena.content && typeof codeArena.content === "string") {
        const contentObj = JSON.parse(codeArena.content);
        if (contentObj.quiz) {
          parsedQuiz = contentObj.quiz;
        }
      }
    } catch (error) {
      console.log("No quiz data found in code arena content");
    }

    // Helper function to convert numeric difficulty to string
    const getDifficultyString = (numDifficulty: number): string => {
      switch (numDifficulty) {
        case 1:
          return "beginner";
        case 2:
          return "intermediate";
        case 3:
          return "advanced";
        default:
          return "beginner";
      }
    };

    // Helper function to convert to exercise difficulty format
    const getExerciseDifficulty = (
      numDifficulty: number
    ): "easy" | "medium" | "hard" => {
      switch (numDifficulty) {
        case 1:
          return "easy";
        case 2:
          return "medium";
        case 3:
          return "hard";
        default:
          return "easy";
      }
    };

    // Transform code arena data to match frontend interface
    const transformedCodeArena = {
      id: codeArena.id,
      title: codeArena.title,
      slug: codeArena.slug,
      description: codeArena.description,
      category: codeArena.category,
      difficulty: getDifficultyString(codeArena.difficulty),
      order: codeArena.order,
      estimatedTime: codeArena.duration, // Map duration to estimatedTime
      diamondReward: codeArena.diamondReward,
      experienceReward: codeArena.experienceReward,

      // Content object with expected structure - Show ALL sections for interactive lessons
      content: {
        introduction: parsedContent.sections
          ? Object.values(parsedContent.sections)
              .map(
                (section: any) =>
                  `<h3>${section.title}</h3><div>${section.content.replace(/\n/g, "<br>")}</div>`
              )
              .join("<br><br>")
          : parsedContent.introduction || "",
        syntax: parsedContent.sections
          ? Object.values(parsedContent.sections)
              .filter(
                (section: any) =>
                  section.title.toLowerCase().includes("syntax") ||
                  section.title.toLowerCase().includes("concept") ||
                  section.title.toLowerCase().includes("defining")
              )
              .map(
                (section: any) =>
                  `<h3>${section.title}</h3><div>${section.content.replace(/\n/g, "<br>")}</div>`
              )
              .join("<br><br>")
          : parsedContent.syntax || "",
        examples: parsedContent.sections
          ? Object.values(parsedContent.sections)
              .filter(
                (section: any) =>
                  section.title.toLowerCase().includes("example") ||
                  section.title.toLowerCase().includes("practice") ||
                  section.title.toLowerCase().includes("games") ||
                  section.title.toLowerCase().includes("arena") ||
                  section.title.toLowerCase().includes("interactive")
              )
              .map(
                (section: any) =>
                  `<h3>${section.title}</h3><div>${section.content.replace(/\n/g, "<br>")}</div>`
              )
              .join("<br><br>")
          : parsedContent.examples || "",
      },

      // Exercise object
      exercise: {
        id: `${codeArena.id}-exercise`,
        title: `${codeArena.title} - Exercise`,
        description: "Practice what you learned",
        starterCode: codeArena.starterCode || "",
        testCases: parsedTestCases,
        hints: parsedHints,
        difficulty: getExerciseDifficulty(codeArena.difficulty),
      },

      // Quiz object - use parsed quiz from code arena content if available
      quiz:
        parsedQuiz ||
        (quiz && quiz.title !== "lesson_001 Quiz"
          ? {
              id: quiz.id,
              title: quiz.title,
              description: quiz.description,
              questions: [], // We'll need to fetch questions separately
              timeLimit: quiz.timeLimit,
              passingScore: 70, // Default passing score
              diamondReward: quiz.diamondReward,
              experienceReward: quiz.experienceReward,
            }
          : // Create specific quiz for python-welcome code arena
            (() => {
                console.log("=== CODE ARENA DEBUG ===");
                console.log("codeArena.slug:", codeArena.slug);
                console.log("codeArena.title:", codeArena.title);
                console.log("codeArena.id:", codeArena.id);
                console.log("Checking if matches python-welcome...");
                console.log("slug match:", codeArena.slug === "python-welcome");
                console.log(
                  "title match:",
                  codeArena.title === "Welcome to Python!"
                );
                const matches =
                  codeArena.slug === "python-welcome" ||
                  codeArena.title === "Welcome to Python!";
                console.log("Final match result:", matches);
                console.log("========================");
                return matches;
              })()
            ? {
                id: `${codeArena.id}-quiz`,
                title: "Python Giriş Quiz",
                description: "Python temellerinizi test edin!",
                questions: [
                  {
                    id: "q1",
                    question: "Python programlama dilinin yaratıcısı kimdir?",
                    type: "multiple_choice",
                    options: [
                      "Guido van Rossum",
                      "Elon Musk",
                      "Bill Gates",
                      "Steve Jobs",
                    ],
                    correctAnswer: "Guido van Rossum",
                    explanation:
                      "Python, 1991 yılında Hollandalı programcı Guido van Rossum tarafından geliştirilmiştir.",
                    points: 10,
                  },
                  {
                    id: "q2",
                    question: "Python neden bu isimle adlandırılmıştır?",
                    type: "multiple_choice",
                    options: [
                      "Yılan türünden dolayı",
                      "Monty Python's Flying Circus adlı komedi programından dolayı",
                      "Hızlı olduğu için",
                      "Pythagoras teoreminden dolayı",
                    ],
                    correctAnswer:
                      "Monty Python's Flying Circus adlı komedi programından dolayı",
                    explanation:
                      "Guido van Rossum, Python'u sevdiği Monty Python's Flying Circus komedi programından esinlenerek adlandırmıştır.",
                    points: 10,
                  },
                  {
                    id: "q3",
                    question: "Python'da print() fonksiyonu ne yapar?",
                    type: "multiple_choice",
                    options: [
                      "Dosya yazdırır",
                      "Ekrana çıktı verir",
                      "Değişken oluşturur",
                      "Hesaplama yapar",
                    ],
                    correctAnswer: "Ekrana çıktı verir",
                    explanation:
                      "print() fonksiyonu, ekrana metin veya değişken değerlerini yazdırmak için kullanılır.",
                    points: 10,
                  },
                  {
                    id: "q4",
                    question: "Python başlangıç dostu bir programlama dilidir.",
                    type: "true_false",
                    correctAnswer: "true",
                    explanation:
                      "Python'un basit sözdizimi ve okunabilir kodu sayesinde yeni başlayanlar için idealdir.",
                    points: 10,
                  },
                  {
                    id: "q5",
                    question:
                      "Aşağıdakilerden hangisi Python'un kullanım alanlarından DEĞİLDİR?",
                    type: "multiple_choice",
                    options: [
                      "Web geliştirme",
                      "Yapay zeka ve makine öğrenmesi",
                      "Donanım tasarımı",
                      "Veri analizi",
                    ],
                    correctAnswer: "Donanım tasarımı",
                    explanation:
                      "Python web geliştirme, AI/ML ve veri analizinde yaygın kullanılır, ancak donanım tasarımı için genellikle tercih edilmez.",
                    points: 10,
                  },
                  {
                    id: "q6",
                    question:
                      "Instagram, Netflix ve Google gibi şirketler Python kullanır.",
                    type: "true_false",
                    correctAnswer: "true",
                    explanation:
                      "Bu büyük teknoloji şirketleri Python'u backend sistemlerinde, veri analizinde ve çeşitli uygulamalarında aktif olarak kullanmaktadır.",
                    points: 10,
                  },
                ],
                timeLimit: 8,
                passingScore: 70,
                diamondReward: 30,
                experienceReward: 50,
              }
            : {
                id: `${codeArena.id}-quiz`,
                title: `${codeArena.title} - Quiz`,
                description: "Test your knowledge",
                questions: [],
                timeLimit: 10,
                passingScore: 70,
                diamondReward: 30,
                experienceReward: 50,
              }),

      // Status flags
      isCompleted: progress?.isCompleted || false,
      isStarted: progress?.isStarted || false,

      // Progress object
      progress: {
        startedAt: progress?.startedAt?.toISOString() || null,
        completedAt: progress?.completedAt?.toISOString() || null,
        lastVisit:
          progress?.lastVisit?.toISOString() || new Date().toISOString(),
        timeSpent: progress?.timeSpent || 0,
        isCodeCorrect: progress?.isCodeCorrect || false,
        lastCode: progress?.lastCode || null,
        bestCode: progress?.bestCode || null,
        score: progress?.score || null, // Add quiz score to progress
      },

      // Additional fields for compatibility
      hasCodeExercise: codeArena.hasCodeExercise,
      solutionCode: codeArena.solutionCode,
      prerequisites: parsedPrerequisites,

      // Timestamps
      createdAt: codeArena.createdAt,
      updatedAt: codeArena.updatedAt,
    };

    return NextResponse.json({
      success: true,
      codeArena: transformedCodeArena,
    });
  } catch (error) {
    console.error("Error fetching code arena:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Start lesson or update progress
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authUser = getUserFromToken(req);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await req.json();
    const { action, code, timeSpent } = body;

    // Find code arena
    const codeArena = await prisma.codeArena.findUnique({
      where: { slug, isPublished: true },
    });

    if (!codeArena) {
      return NextResponse.json({ error: "Code Arena not found" }, { status: 404 });
    }

    // Find or create progress
    let progress = await prisma.codeArenaProgress.findUnique({
      where: {
        userId_codeArenaId: {
          userId: authUser.userId,
          codeArenaId: codeArena.id,
        },
      },
    });

    switch (action) {
      case "start":
        if (!progress) {
          progress = await prisma.codeArenaProgress.create({
            data: {
              userId: authUser.userId,
              codeArenaId: codeArena.id,
              isStarted: true,
              startedAt: new Date(),
              lastVisit: new Date(),
            },
          });
        } else {
          progress = await prisma.codeArenaProgress.update({
            where: { id: progress.id },
            data: {
              isStarted: true,
              lastVisit: new Date(),
              startedAt: progress.startedAt || new Date(),
            },
          });
        }

        return NextResponse.json({
          success: true,
          message: "Code Arena started",
          progress,
        });

      case "save_code":
        if (!progress) {
          return NextResponse.json(
            { error: "Code Arena not started" },
            { status: 400 }
          );
        }

        progress = await prisma.codeArenaProgress.update({
          where: { id: progress.id },
          data: {
            lastCode: code,
            timeSpent: (progress.timeSpent || 0) + (timeSpent || 0),
            lastVisit: new Date(),
            attempts: { increment: 1 },
          },
        });

        return NextResponse.json({
          success: true,
          message: "Code saved",
          progress,
        });

      case "complete":
        if (!progress) {
          return NextResponse.json(
            { error: "Code Arena not started" },
            { status: 400 }
          );
        }

        // Check if code arena was already completed BEFORE updating
        const wasAlreadyCompleted = progress.isCompleted;

        const updateData: any = {
          isCompleted: true,
          completedAt: new Date(),
          lastVisit: new Date(),
          timeSpent: (progress.timeSpent || 0) + (timeSpent || 0),
        };

        if (code) {
          updateData.lastCode = code;
          updateData.bestCode = code;
          updateData.isCodeCorrect = true;
        }

        progress = await prisma.codeArenaProgress.update({
          where: { id: progress.id },
          data: updateData,
        });

        // Award diamonds and experience if not already completed
        let newBadges: any[] = [];
        if (!wasAlreadyCompleted) {
          await prisma.user.update({
            where: { id: authUser.userId },
            data: {
              currentDiamonds: { increment: codeArena.diamondReward },
              totalDiamonds: { increment: codeArena.diamondReward },
              experience: { increment: codeArena.experienceReward },
              codeArenasCompleted: { increment: 1 },
            },
          });

          // Create diamond transaction
          await prisma.diamondTransaction.create({
            data: {
              userId: authUser.userId,
              amount: codeArena.diamondReward,
              type: "CODE_ARENA_COMPLETE",
              description: `Code Arena completed: ${codeArena.title}`,
              relatedType: "code_arena",
              relatedId: codeArena.id,
            },
          });

          // Check for new badges after code arena completion
          try {
            newBadges = await checkAndAwardBadges(authUser.userId);
            console.log(
              `🏆 Badge check completed. Found ${newBadges.length} new badges.`
            );
          } catch (error) {
            console.error("Error checking badges:", error);
          }
        }

        return NextResponse.json({
          success: true,
          message: "Code Arena completed",
          progress,
          rewards: !wasAlreadyCompleted
            ? {
                diamonds: codeArena.diamondReward,
                experience: codeArena.experienceReward,
              }
            : null,
          alreadyCompleted: wasAlreadyCompleted,
          newBadges: newBadges.length > 0 ? newBadges : undefined,
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating code arena progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
