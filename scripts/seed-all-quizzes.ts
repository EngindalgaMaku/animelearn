import { PrismaClient } from "@prisma/client";
import { allCategories, allQuestions } from "./quiz-seeds/index";

const prisma = new PrismaClient();

interface SeedOptions {
  onlyCategories?: string[]; // Sadece belirli kategorileri yüklemek için
  skipExisting?: boolean;    // Mevcut soruları atlayacak mı?
}

async function seedQuizzes(options: SeedOptions = { skipExisting: true }) {
  console.log("🌱 Starting comprehensive quiz seeding...");
  
  const { onlyCategories, skipExisting = true } = options;

  try {
    let totalAdded = 0;
    let totalSkipped = 0;
    let categoriesAdded = 0;

    // Filter categories if specific ones are requested
    const categoriesToSeed = onlyCategories 
      ? allCategories.filter(cat => onlyCategories.includes(cat.name))
      : allCategories;

    console.log(`🎯 Processing ${categoriesToSeed.length} categories...`);

    // First, create or update categories
    for (const categoryData of categoriesToSeed) {
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
        categoriesAdded++;
      } else {
        console.log(`⏭️  Category exists: ${categoryData.name}`);
      }
    }

    // Filter questions for selected categories
    const questionsToSeed = onlyCategories
      ? allQuestions.filter(q => onlyCategories.includes(q.category))
      : allQuestions;

    console.log(`📝 Processing ${questionsToSeed.length} questions...`);

    // Get existing questions to avoid duplicates (if skipExisting is true)
    let existingQuestionTexts = new Set<string>();
    if (skipExisting) {
      const existingQuestions = await (prisma as any).quizQuestion.findMany({
        select: { question: true }
      });
      existingQuestionTexts = new Set(existingQuestions.map((q: any) => q.question));
    }

    // Add questions
    for (const questionData of questionsToSeed) {
      if (skipExisting && existingQuestionTexts.has(questionData.question)) {
        console.log(`⏭️  Question exists: ${questionData.question.substring(0, 60)}...`);
        totalSkipped++;
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

      console.log(`✅ Added: ${questionData.question.substring(0, 60)}...`);
      totalAdded++;
    }

    console.log("\n🎉 Quiz seeding completed!");
    console.log(`📊 Final Statistics:`);
    console.log(`   🏷️  Categories added: ${categoriesAdded}`);
    console.log(`   ✅ Questions added: ${totalAdded}`);
    console.log(`   ⏭️  Questions skipped: ${totalSkipped}`);
    console.log(`   📝 Total questions processed: ${questionsToSeed.length}`);
    console.log(`   🎯 Total categories processed: ${categoriesToSeed.length}`);

  } catch (error) {
    console.error("❌ Error seeding quizzes:", error);
    throw error;
  }
}

// Command line interface
async function main() {
  try {
    const args = process.argv.slice(2);
    const options: SeedOptions = { skipExisting: true };

    // Parse command line arguments
    if (args.includes('--force')) {
      options.skipExisting = false;
      console.log("🔄 Force mode: Will overwrite existing questions");
    }

    // Check for specific categories
    const categoryIndex = args.indexOf('--categories');
    if (categoryIndex !== -1 && args[categoryIndex + 1]) {
      options.onlyCategories = args[categoryIndex + 1].split(',');
      console.log(`🎯 Targeting specific categories: ${options.onlyCategories.join(', ')}`);
    }

    // Available categories info
    if (args.includes('--list-categories')) {
      console.log("📋 Available categories:");
      allCategories.forEach(cat => {
        const questionCount = allQuestions.filter(q => q.category === cat.name).length;
        console.log(`   ${cat.icon} ${cat.name} (${questionCount} questions)`);
      });
      return;
    }

    if (args.includes('--help')) {
      console.log(`
🚀 Quiz Seeding Tool

Usage:
  npx tsx scripts/seed-all-quizzes.ts [options]

Options:
  --help                     Show this help message
  --list-categories         List all available categories
  --categories cat1,cat2    Seed only specific categories
  --force                   Force overwrite existing questions

Examples:
  npx tsx scripts/seed-all-quizzes.ts
  npx tsx scripts/seed-all-quizzes.ts --categories "Python Basics,Control Flow"
  npx tsx scripts/seed-all-quizzes.ts --force
      `);
      return;
    }

    await seedQuizzes(options);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Quick seed functions for specific categories
export async function seedControlFlow() {
  return seedQuizzes({ onlyCategories: ["Control Flow"], skipExisting: true });
}

export async function seedPythonBasics() {
  return seedQuizzes({ onlyCategories: ["Python Basics"], skipExisting: true });
}

export async function seedAllBasics() {
  return seedQuizzes({ 
    onlyCategories: ["Python Basics", "Control Flow", "Basic Data Structures"], 
    skipExisting: true 
  });
}

// Run the script
if (require.main === module) {
  main();
}