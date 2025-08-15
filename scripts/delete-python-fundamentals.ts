import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🗑️ Deleting all Python fundamentals activities...");

  try {
    // First, get count of activities to be deleted
    const count = await prisma.learningActivity.count({
      where: {
        category: "python_fundamentals",
      },
    });

    console.log(`📊 Found ${count} Python fundamentals activities to delete`);

    if (count === 0) {
      console.log(
        "✅ No Python fundamentals activities found. Nothing to delete."
      );
      return;
    }

    // Get all activity IDs first for logging
    const activities = await prisma.learningActivity.findMany({
      where: {
        category: "python_fundamentals",
      },
      select: {
        id: true,
        title: true,
        activityType: true,
      },
    });

    console.log("\n📋 Activities to be deleted:");
    activities.forEach((activity, index) => {
      console.log(
        `   ${index + 1}. ${activity.title} (${activity.activityType})`
      );
    });

    // Delete related attempts first (cascade should handle this, but being explicit)
    const attemptCount = await prisma.activityAttempt.count({
      where: {
        activity: {
          category: "python_fundamentals",
        },
      },
    });

    if (attemptCount > 0) {
      console.log(`\n🗑️ Deleting ${attemptCount} related activity attempts...`);
      await prisma.activityAttempt.deleteMany({
        where: {
          activity: {
            category: "python_fundamentals",
          },
        },
      });
      console.log("✅ Activity attempts deleted");
    }

    // Delete all Python fundamentals activities
    console.log("\n🗑️ Deleting Python fundamentals activities...");
    const deleteResult = await prisma.learningActivity.deleteMany({
      where: {
        category: "python_fundamentals",
      },
    });

    console.log(
      `✅ Successfully deleted ${deleteResult.count} Python fundamentals activities`
    );

    // Verify deletion
    const remainingCount = await prisma.learningActivity.count({
      where: {
        category: "python_fundamentals",
      },
    });

    if (remainingCount === 0) {
      console.log(
        "🎉 All Python fundamentals activities have been successfully deleted!"
      );
    } else {
      console.log(`⚠️ Warning: ${remainingCount} activities still remain`);
    }

    // Show remaining activity categories
    const remainingCategories = await prisma.learningActivity.groupBy({
      by: ["category"],
      _count: { category: true },
    });

    console.log("\n📊 Remaining activity categories:");
    remainingCategories.forEach((cat) => {
      console.log(`   - ${cat.category}: ${cat._count.category} activities`);
    });
  } catch (error) {
    console.error("❌ Error deleting Python fundamentals activities:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
