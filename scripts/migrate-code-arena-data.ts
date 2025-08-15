import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateCodeArenaData() {
  try {
    console.log("🔄 CodeArena to LearningActivity migration check...");

    // The CodeArena model has been removed and migration has been completed
    // This script is now a no-op to prevent build errors
    console.log(
      "✅ Migration already completed - CodeArena model has been removed"
    );
    console.log("📋 All data has been migrated to the LearningActivity model");

    const totalActivities = await prisma.learningActivity.count();
    console.log(`📊 Current LearningActivity entries: ${totalActivities}`);

    console.log("🎉 Migration check completed successfully!");
  } catch (error) {
    console.error("❌ Migration check failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function mapCategory(category: string): string {
  const categoryMap: { [key: string]: string } = {
    basic: "Python Fundamentals",
    intermediate: "Data Structures",
    advanced: "Algorithms",
    functions: "Functions & OOP",
    web: "Web Development",
    ml: "Machine Learning",
  };

  return categoryMap[category] || "Python Fundamentals";
}

// Run the migration
migrateCodeArenaData()
  .then(() => {
    console.log("🏁 Migration script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Migration script failed:", error);
    process.exit(1);
  });
