const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkArenaData() {
  try {
    console.log("=== QUIZ ARENA DATA ANALYSIS ===\n");

    // Check Quiz data
    const quizCount = await prisma.quiz.count();
    console.log(`📊 Quizzes: ${quizCount} total`);

    if (quizCount > 0) {
      const quizSample = await prisma.quiz.findMany({
        take: 3,
        select: {
          id: true,
          title: true,
          difficulty: true,
          isActive: true,
          codeArenaId: true,
          createdAt: true,
        },
      });
      console.log("Sample quizzes:", quizSample);
    }

    // Check QuizAttempt data
    const quizAttemptCount = await prisma.quizAttempt.count();
    console.log(`\n🎯 Quiz Attempts: ${quizAttemptCount} total`);

    // Check QuizQuestion data
    const quizQuestionCount = await prisma.quizQuestion.count();
    console.log(`❓ Quiz Questions: ${quizQuestionCount} total`);

    if (quizQuestionCount > 0) {
      const questionSample = await prisma.quizQuestion.findMany({
        take: 2,
        select: {
          id: true,
          question: true,
          difficulty: true,
          category: true,
          isActive: true,
        },
      });
      console.log("Sample questions:", questionSample);
    }

    // Check QuizCategory data
    const quizCategoryCount = await prisma.quizCategory.count();
    console.log(`\n📁 Quiz Categories: ${quizCategoryCount} total`);

    if (quizCategoryCount > 0) {
      const categories = await prisma.quizCategory.findMany({
        select: {
          id: true,
          name: true,
          questionCount: true,
          isActive: true,
        },
      });
      console.log("Quiz categories:", categories);
    }

    // Check DailyMiniQuiz data
    const dailyMiniQuizCount = await prisma.dailyMiniQuiz.count();
    console.log(`\n📅 Daily Mini Quizzes: ${dailyMiniQuizCount} total`);

    if (dailyMiniQuizCount > 0) {
      const dailyQuizSample = await prisma.dailyMiniQuiz.findMany({
        take: 3,
        select: {
          id: true,
          title: true,
          date: true,
          category: true,
          isActive: true,
          totalAttempts: true,
        },
      });
      console.log("Sample daily mini quizzes:", dailyQuizSample);
    }

    // Check DailyMiniQuizAttempt data
    const dailyMiniQuizAttemptCount = await prisma.dailyMiniQuizAttempt.count();
    console.log(
      `\n🎲 Daily Mini Quiz Attempts: ${dailyMiniQuizAttemptCount} total`
    );

    console.log("\n=== CODE ARENA DATA ANALYSIS ===\n");

    // Check CodeArena data
    const codeArenaCount = await prisma.codeArena.count();
    console.log(`💻 Code Arenas: ${codeArenaCount} total`);

    if (codeArenaCount > 0) {
      const codeArenaSample = await prisma.codeArena.findMany({
        take: 3,
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          category: true,
          isPublished: true,
          hasCodeExercise: true,
          createdAt: true,
        },
      });
      console.log("Sample code arenas:", codeArenaSample);
    }

    // Check CodeArenaProgress data
    const codeArenaProgressCount = await prisma.codeArenaProgress.count();
    console.log(`\n📈 Code Arena Progress: ${codeArenaProgressCount} total`);

    if (codeArenaProgressCount > 0) {
      const progressSample = await prisma.codeArenaProgress.findMany({
        take: 3,
        select: {
          id: true,
          userId: true,
          codeArenaId: true,
          isCompleted: true,
          score: true,
          attempts: true,
        },
      });
      console.log("Sample progress records:", progressSample);
    }

    // Check CodeSubmission data
    const codeSubmissionCount = await prisma.codeSubmission.count();
    console.log(`\n📝 Code Submissions: ${codeSubmissionCount} total`);

    if (codeSubmissionCount > 0) {
      const submissionSample = await prisma.codeSubmission.findMany({
        take: 3,
        select: {
          id: true,
          userId: true,
          language: true,
          isCorrect: true,
          score: true,
          codeArenaId: true,
          submittedAt: true,
        },
      });
      console.log("Sample submissions:", submissionSample);
    }

    console.log("\n=== SUMMARY ===");
    console.log(`Quiz Arena Models:`);
    console.log(`  - Quizzes: ${quizCount}`);
    console.log(`  - Quiz Attempts: ${quizAttemptCount}`);
    console.log(`  - Quiz Questions: ${quizQuestionCount}`);
    console.log(`  - Quiz Categories: ${quizCategoryCount}`);
    console.log(`  - Daily Mini Quizzes: ${dailyMiniQuizCount}`);
    console.log(`  - Daily Mini Quiz Attempts: ${dailyMiniQuizAttemptCount}`);

    console.log(`\nCode Arena Models:`);
    console.log(`  - Code Arenas: ${codeArenaCount}`);
    console.log(`  - Code Arena Progress: ${codeArenaProgressCount}`);
    console.log(`  - Code Submissions: ${codeSubmissionCount}`);

    const totalRecords =
      quizCount +
      quizAttemptCount +
      quizQuestionCount +
      quizCategoryCount +
      dailyMiniQuizCount +
      dailyMiniQuizAttemptCount +
      codeArenaCount +
      codeArenaProgressCount +
      codeSubmissionCount;

    console.log(`\n🎯 Total Arena Records to Backup: ${totalRecords}`);
  } catch (error) {
    console.error("Error checking arena data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkArenaData();
