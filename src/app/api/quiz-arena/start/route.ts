import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    const body = await request.json();
    const { difficulty = "progressive", category = "Python Basics" } = body;

    // For anonymous users, return demo questions with login incentive
    if (!session?.user?.email) {
      console.log("Anonymous user starting quiz - returning demo questions");

      const demoQuestions = [
        {
          id: "demo_1",
          question:
            "Welcome to Python Quiz Arena! This is a demo question. Which operator is used to concatenate strings in Python?",
          options: ["&", "+", ".", "*"],
          correctAnswer: 1,
          explanation:
            "The + operator is used to concatenate strings in Python. Example: 'Hello' + ' World' = 'Hello World'",
          difficulty: 1,
          category: category,
          tags: [],
        },
        {
          id: "demo_2",
          question:
            "Which type of brackets are used to create a list in Python?",
          options: ["()", "{}", "[]", "<>"],
          correctAnswer: 2,
          explanation:
            "Square brackets [] are used to create lists in Python. Example: my_list = [1, 2, 3]",
          difficulty: 1,
          category: category,
          tags: [],
        },
      ];

      const demoSession = {
        id: "demo_session",
        currentStreak: 0,
        questions: demoQuestions,
        currentQuestionIndex: 0,
        startTime: new Date(),
        totalTime: 0,
        isActive: true,
        isDemo: true,
      };

      return NextResponse.json({
        session: demoSession,
        firstQuestion: demoQuestions[0],
        totalQuestions: demoQuestions.length,
        loginMessage:
          "This is a demo experience. Login to access all questions and earn real rewards!",
      });
    }

    // Get user for authenticated users
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create new quiz session
    const sessionId = `quiz_${Date.now()}_${user.id}`;

    // Get questions from database with category filter
    const whereClause: any = {
      isActive: true,
      category: category,
    };

    // Fetch all questions from the selected category
    const dbQuestions = await (prisma as any).quizQuestion.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    if (dbQuestions.length === 0) {
      return NextResponse.json(
        { error: "No questions found for the selected category" },
        { status: 404 }
      );
    }

    // Convert database questions and shuffle options for each question
    let allQuestions = dbQuestions.map((q: any, index: number) => {
      // Shuffle options while tracking correct answer
      const originalOptions = [...q.options];
      const shuffledOptions = [...originalOptions];
      const originalCorrectAnswer = q.correctAnswer;

      // Fisher-Yates shuffle for options
      for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOptions[i], shuffledOptions[j]] = [
          shuffledOptions[j],
          shuffledOptions[i],
        ];
      }

      // Find new correct answer index
      const correctAnswerText = originalOptions[originalCorrectAnswer];
      const newCorrectAnswer = shuffledOptions.findIndex(
        (option) => option === correctAnswerText
      );

      return {
        id: `q_${index}`,
        question: q.question,
        options: shuffledOptions,
        correctAnswer: newCorrectAnswer,
        explanation: q.explanation || "No explanation provided.",
        difficulty:
          q.difficulty === "beginner"
            ? 1
            : q.difficulty === "intermediate"
              ? 2
              : q.difficulty === "advanced"
                ? 3
                : 4,
        category: q.category,
        tags: [],
        originalDifficulty: q.difficulty,
      };
    });

    // Smart question ordering algorithm
    let selectedQuestions: any[];

    if (difficulty === "progressive") {
      // Progressive Algorithm: Organize by difficulty but shuffle within each level
      const questionsByDifficulty = {
        1: allQuestions.filter((q: any) => q.difficulty === 1),
        2: allQuestions.filter((q: any) => q.difficulty === 2),
        3: allQuestions.filter((q: any) => q.difficulty === 3),
        4: allQuestions.filter((q: any) => q.difficulty === 4),
      };

      // Shuffle questions within each difficulty level
      Object.values(questionsByDifficulty).forEach((difficultyGroup) => {
        for (let i = difficultyGroup.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [difficultyGroup[i], difficultyGroup[j]] = [
            difficultyGroup[j],
            difficultyGroup[i],
          ];
        }
      });

      // Combine in progressive order
      selectedQuestions = [
        ...questionsByDifficulty[1],
        ...questionsByDifficulty[2],
        ...questionsByDifficulty[3],
        ...questionsByDifficulty[4],
      ];
    } else {
      // Mixed Algorithm: Balanced distribution with smart randomization
      const questionsByDifficulty = {
        1: allQuestions.filter((q: any) => q.difficulty === 1),
        2: allQuestions.filter((q: any) => q.difficulty === 2),
        3: allQuestions.filter((q: any) => q.difficulty === 3),
        4: allQuestions.filter((q: any) => q.difficulty === 4),
      };

      selectedQuestions = [];
      const maxLength = Math.max(
        ...Object.values(questionsByDifficulty).map((arr) => arr.length)
      );

      // Interleave questions from different difficulties for balanced experience
      for (let i = 0; i < maxLength; i++) {
        [1, 2, 3, 4].forEach((diff) => {
          if (
            questionsByDifficulty[diff as keyof typeof questionsByDifficulty][i]
          ) {
            selectedQuestions.push(
              questionsByDifficulty[diff as keyof typeof questionsByDifficulty][
                i
              ]
            );
          }
        });
      }

      // Final shuffle for mixed mode
      for (let i = selectedQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selectedQuestions[i], selectedQuestions[j]] = [
          selectedQuestions[j],
          selectedQuestions[i],
        ];
      }
    }

    // Create quiz in database
    const quiz = await prisma.quiz.create({
      data: {
        title: `Python Quiz Arena - ${new Date().toLocaleString()}`,
        description: "Interactive Python quiz with strike system",
        questions: JSON.stringify(
          selectedQuestions.map((q: any, index: number) => ({
            ...q,
            id: `q_${index}`,
          }))
        ),
        timeLimit: 30,
        difficulty:
          difficulty === "mixed"
            ? 2
            : difficulty === "easy"
              ? 1
              : difficulty === "hard"
                ? 3
                : 2,
        diamondReward: 5,
        experienceReward: 10,
        isActive: true,
      },
    });

    // Start quiz attempt
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: quiz.id,
        answers: JSON.stringify([]),
        score: 0,
        correctAnswers: 0,
        totalQuestions: selectedQuestions.length,
        timeSpent: 0,
        isCompleted: false,
      },
    });

    const session_data = {
      id: sessionId,
      currentStreak: 0,
      questions: selectedQuestions.map((q: any, index: number) => ({
        ...q,
        id: `q_${index}`,
      })),
      currentQuestionIndex: 0,
      startTime: new Date(),
      totalTime: 0,
      isActive: true,
      quizId: quiz.id,
      attemptId: quizAttempt.id,
    };

    // Store session data (in a real app, you'd use Redis or similar)
    // For now, we'll include it in the response and track it client-side

    return NextResponse.json({
      session: session_data,
      firstQuestion: session_data.questions[0],
      totalQuestions: selectedQuestions.length,
    });
  } catch (error) {
    console.error("Quiz start error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
