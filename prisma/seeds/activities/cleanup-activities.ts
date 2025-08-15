#!/usr/bin/env npx tsx

/**
 * Cleanup Script for Learning Activities
 * Removes all existing learning activities from the database
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupAllActivities() {
  try {
    console.log("🧹 Starting cleanup of all learning activities...\n");

    // Get current count
    const currentCount = await prisma.learningActivity.count();
    console.log(`📊 Current activities in database: ${currentCount}`);

    if (currentCount === 0) {
      console.log("✅ Database is already clean - no activities to remove");
      return;
    }

    // Delete all learning activities
    console.log("🗑️  Deleting all learning activities...");
    const deleteResult = await prisma.learningActivity.deleteMany({});

    console.log(
      `✅ Successfully deleted ${deleteResult.count} learning activities`
    );

    // Verify cleanup
    const finalCount = await prisma.learningActivity.count();
    console.log(`📊 Remaining activities: ${finalCount}`);

    if (finalCount === 0) {
      console.log("🎉 Database cleanup completed successfully!");
      console.log("\n📝 You can now test individual activity types:");
      console.log("   • npx tsx drag-drop-python-fundamentals.ts");
      console.log("   • npx tsx memory-game-python-fundamentals.ts");
      console.log("   • npx tsx quiz-python-fundamentals.ts");
      console.log("   • etc...");
    } else {
      console.log("⚠️  Some activities may not have been deleted");
    }
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run cleanup if called directly
if (require.main === module) {
  cleanupAllActivities()
    .then(() => {
      console.log("\n🏁 Cleanup process completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Cleanup failed:", error);
      process.exit(1);
    });
}

export { cleanupAllActivities };
