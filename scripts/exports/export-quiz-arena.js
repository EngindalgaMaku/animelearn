const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function exportQuizArenaData() {
  try {
    console.log("🎯 Starting Quiz Arena data export...\n");

    // Export Quiz Categories
    console.log("📁 Exporting Quiz Categories...");
    const quizCategories = await prisma.quizCategory.findMany({
      orderBy: { createdAt: "asc" },
    });
    console.log(`✅ Found ${quizCategories.length} quiz categories`);

    // Export Quiz Questions
    console.log("\n❓ Exporting Quiz Questions...");
    const quizQuestions = await prisma.quizQuestion.findMany({
      orderBy: { createdAt: "asc" },
    });
    console.log(`✅ Found ${quizQuestions.length} quiz questions`);

    // Export Quizzes (if any exist)
    console.log("\n📊 Exporting Quizzes...");
    const quizzes = await prisma.quiz.findMany({
      orderBy: { createdAt: "asc" },
    });
    console.log(`✅ Found ${quizzes.length} quizzes`);

    // Export Quiz Attempts (if any exist)
    console.log("\n🎯 Exporting Quiz Attempts...");
    const quizAttempts = await prisma.quizAttempt.findMany({
      orderBy: { startedAt: "asc" },
    });
    console.log(`✅ Found ${quizAttempts.length} quiz attempts`);

    // Export Daily Mini Quizzes (if any exist)
    console.log("\n📅 Exporting Daily Mini Quizzes...");
    const dailyMiniQuizzes = await prisma.dailyMiniQuiz.findMany({
      orderBy: { date: "asc" },
    });
    console.log(`✅ Found ${dailyMiniQuizzes.length} daily mini quizzes`);

    // Export Daily Mini Quiz Attempts (if any exist)
    console.log("\n🎲 Exporting Daily Mini Quiz Attempts...");
    const dailyMiniQuizAttempts = await prisma.dailyMiniQuizAttempt.findMany({
      orderBy: { completedAt: "asc" },
    });
    console.log(
      `✅ Found ${dailyMiniQuizAttempts.length} daily mini quiz attempts`
    );

    // Prepare export data
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        source: "quiz-arena-export",
        totalRecords:
          quizCategories.length +
          quizQuestions.length +
          quizzes.length +
          quizAttempts.length +
          dailyMiniQuizzes.length +
          dailyMiniQuizAttempts.length,
        tables: {
          quizCategories: quizCategories.length,
          quizQuestions: quizQuestions.length,
          quizzes: quizzes.length,
          quizAttempts: quizAttempts.length,
          dailyMiniQuizzes: dailyMiniQuizzes.length,
          dailyMiniQuizAttempts: dailyMiniQuizAttempts.length,
        },
      },
      data: {
        quizCategories,
        quizQuestions,
        quizzes,
        quizAttempts,
        dailyMiniQuizzes,
        dailyMiniQuizAttempts,
      },
    };

    // Write to file
    const fileName = `quiz-arena-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    const filePath = path.join(__dirname, fileName);

    fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));

    console.log(`\n🎉 Quiz Arena data exported successfully!`);
    console.log(`📁 File: ${fileName}`);
    console.log(`📊 Total records: ${exportData.metadata.totalRecords}`);
    console.log(`📈 Breakdown:`);
    console.log(`   - Quiz Categories: ${quizCategories.length}`);
    console.log(`   - Quiz Questions: ${quizQuestions.length}`);
    console.log(`   - Quizzes: ${quizzes.length}`);
    console.log(`   - Quiz Attempts: ${quizAttempts.length}`);
    console.log(`   - Daily Mini Quizzes: ${dailyMiniQuizzes.length}`);
    console.log(
      `   - Daily Mini Quiz Attempts: ${dailyMiniQuizAttempts.length}`
    );
  } catch (error) {
    console.error("❌ Error exporting quiz arena data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the export
exportQuizArenaData();
