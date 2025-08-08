import { PrismaClient } from "@prisma/client";
import { allCategories, allQuestions } from "./quiz-seeds";

const prisma = new PrismaClient();

async function seedAllQuizData() {
  try {
    console.log("🌱 Starting comprehensive quiz data seeding...");
    console.log(`📊 Preparing to seed:`);
    console.log(`   - Categories: ${allCategories.length}`);
    console.log(`   - Questions: ${allQuestions.length}`);

    // Create categories
    console.log("\n📝 Creating quiz categories...");
    for (const category of allCategories) {
      try {
        await (prisma as any).quizCategory.upsert({
          where: { name: category.name },
          update: category,
          create: category,
        });
        console.log(`✅ Created/Updated category: ${category.name}`);
      } catch (error) {
        console.log(`❌ Category creation failed: ${category.name}`, error);
      }
    }

    // Clear existing questions to avoid duplicates
    console.log("\n🗑️ Clearing existing quiz questions...");
    try {
      await (prisma as any).quizQuestion.deleteMany({});
      console.log("✅ Cleared existing questions");
    } catch (error) {
      console.log("No existing questions to clear");
    }

    // Create questions
    console.log("\n❓ Creating quiz questions...");
    let successCount = 0;
    let failCount = 0;

    for (const question of allQuestions) {
      try {
        await (prisma as any).quizQuestion.create({
          data: question
        });
        console.log(`✅ Created question: ${question.question.substring(0, 60)}...`);
        successCount++;
      } catch (error) {
        console.log(`❌ Question creation failed: ${question.question.substring(0, 60)}...`);
        console.error(error);
        failCount++;
      }
    }

    // Update category question counts
    console.log("\n🔄 Updating category question counts...");
    for (const category of allCategories) {
      try {
        const questionCount = await (prisma as any).quizQuestion.count({
          where: {
            category: category.name,
            isActive: true,
          },
        });

        await (prisma as any).quizCategory.update({
          where: { name: category.name },
          data: { questionCount },
        });
        console.log(`✅ Updated ${category.name}: ${questionCount} questions`);
      } catch (error) {
        console.log(`❌ Count update failed for: ${category.name}`);
      }
    }

    console.log("\n🎉 Quiz data seeding completed!");
    console.log(`📊 Final Summary:`);
    console.log(`   - Categories Created: ${allCategories.length}`);
    console.log(`   - Questions Successful: ${successCount}`);
    console.log(`   - Questions Failed: ${failCount}`);
    console.log(`   - Total Questions Attempted: ${allQuestions.length}`);
    console.log(`   - Success Rate: ${((successCount / allQuestions.length) * 100).toFixed(2)}%`);

  } catch (error) {
    console.error("❌ Critical error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
if (require.main === module) {
  seedAllQuizData()
    .then(() => {
      console.log("✨ Comprehensive seeding process completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Comprehensive seeding process failed:", error);
      process.exit(1);
    });
}

export { seedAllQuizData, allCategories, allQuestions };