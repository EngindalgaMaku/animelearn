import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * CLEANUP OLD ALGORITHM CHALLENGES
 *
 * This script removes all old algorithm challenges from the database
 * and ensures only the new detailed visualization challenges remain.
 */

export async function cleanupOldAlgorithmChallenges() {
  console.log("🧹 Cleaning up old algorithm challenges...");

  try {
    // First, let's see what algorithm challenges currently exist
    const existingChallenges = await prisma.learningActivity.findMany({
      where: {
        OR: [
          { category: "Algorithms" },
          { activityType: "algorithm_visualization" },
        ],
      },
      select: {
        id: true,
        title: true,
        activityType: true,
      },
    });

    console.log(
      `📊 Found ${existingChallenges.length} existing algorithm challenges:`
    );
    existingChallenges.forEach((challenge) => {
      console.log(
        `  - ${challenge.id}: ${challenge.title} (${challenge.activityType})`
      );
    });

    // Delete ALL algorithm challenges to start completely fresh
    const challengesToDelete = existingChallenges;

    console.log(`\n🗑️ Challenges to delete: ${challengesToDelete.length}`);
    challengesToDelete.forEach((challenge) => {
      console.log(`  - ${challenge.id}: ${challenge.title}`);
    });

    // Delete ALL algorithm challenges
    if (challengesToDelete.length > 0) {
      const deleteResult = await prisma.learningActivity.deleteMany({
        where: {
          OR: [
            { category: "Algorithms" },
            { activityType: "algorithm_visualization" },
          ],
        },
      });

      console.log(
        `✅ Deleted ${deleteResult.count} algorithm challenges (COMPLETE CLEANUP)`
      );
    } else {
      console.log("✅ No algorithm challenges to delete");
    }

    // Verify what remains
    const remainingChallenges = await prisma.learningActivity.findMany({
      where: {
        OR: [
          { category: "Algorithms" },
          { activityType: "algorithm_visualization" },
        ],
      },
      select: {
        id: true,
        title: true,
        activityType: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    console.log(
      `\n📋 Remaining algorithm challenges: ${remainingChallenges.length}`
    );
    remainingChallenges.forEach((challenge, index) => {
      console.log(`  ${index + 1}. ${challenge.id}: ${challenge.title}`);
    });

    console.log("\n🎉 Algorithm challenges cleanup completed successfully!");
  } catch (error) {
    console.error("❌ Error cleaning up algorithm challenges:", error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    await cleanupOldAlgorithmChallenges();
    console.log("✅ Cleanup completed successfully!");
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}
