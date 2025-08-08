import { PrismaClient } from "@prisma/client";
import { pythonBasicsCategories, pythonBasicsQuestions } from "./quiz-seeds/python-basics";

const prisma = new PrismaClient();

async function seedPythonBasics() {
  console.log("🌱 Starting Python Basics quiz seeding...");

  try {
    // First, create or update categories
    for (const categoryData of pythonBasicsCategories) {
      const existingCategory = await (prisma as any).quizCategory.findFirst({
        where: { name: categoryData.name }
      });

      if (!existingCategory) {
        await (prisma as any).quizCategory.create({
          data: {
            name: categoryData.name,
            description: categoryData.description,
            color: categoryData.color,
            icon: categoryData.icon,
            sortOrder: categoryData.sortOrder,
            isActive: true
          }
        });
        console.log(`✅ Created category: ${categoryData.name}`);
      } else {
        console.log(`⏭️  Category already exists: ${categoryData.name}`);
      }
    }

    // Check existing questions to avoid duplicates
    const existingQuestions = await (prisma as any).quizQuestion.findMany({
      where: { category: "Python Basics" }
    });

    const existingQuestionTexts = new Set(existingQuestions.map((q: any) => q.question));

    let addedCount = 0;
    let skippedCount = 0;

    // Add questions
    for (const questionData of pythonBasicsQuestions) {
      if (existingQuestionTexts.has(questionData.question)) {
        console.log(`⏭️  Question already exists: ${questionData.question.substring(0, 50)}...`);
        skippedCount++;
        continue;
      }

      await (prisma as any).quizQuestion.create({
        data: {
          question: questionData.question,
          options: questionData.options,
          correctAnswer: questionData.correctAnswer,
          explanation: questionData.explanation,
          difficulty: questionData.difficulty,
          category: questionData.category,
          isActive: true
        }
      });

      console.log(`✅ Added question: ${questionData.question.substring(0, 50)}...`);
      addedCount++;
    }

    console.log("\n🎉 Python Basics quiz seeding completed!");
    console.log(`📊 Statistics:`);
    console.log(`   - Questions added: ${addedCount}`);
    console.log(`   - Questions skipped (already exist): ${skippedCount}`);
    console.log(`   - Total questions in file: ${pythonBasicsQuestions.length}`);

  } catch (error) {
    console.error("❌ Error seeding Python Basics quiz:", error);
    throw error;
  }
}

async function main() {
  try {
    await seedPythonBasics();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main();