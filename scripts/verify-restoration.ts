import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verifyRestoration() {
  try {
    console.log("🔍 Verifying activity restoration...");

    // Count total activities
    const totalCount = await prisma.learningActivity.count();
    console.log(`📊 Total activities: ${totalCount}`);

    // Count by category
    const byCategory = await prisma.learningActivity.groupBy({
      by: ["category"],
      _count: {
        category: true,
      },
    });

    console.log("\n📂 Activities by category:");
    byCategory.forEach((category) => {
      console.log(
        `  ${category.category}: ${category._count.category} activities`
      );
    });

    // Count by activity type
    const byType = await prisma.learningActivity.groupBy({
      by: ["activityType"],
      _count: {
        activityType: true,
      },
    });

    console.log("\n🎯 Activities by type:");
    byType.forEach((type) => {
      console.log(
        `  ${type.activityType}: ${type._count.activityType} activities`
      );
    });

    // Show recent activities
    const recentActivities = await prisma.learningActivity.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        category: true,
        activityType: true,
        isActive: true,
      },
    });

    console.log("\n🆕 Recent activities:");
    recentActivities.forEach((activity) => {
      const status = activity.isActive ? "✅" : "❌";
      console.log(
        `  ${status} ${activity.title} (${activity.category} - ${activity.activityType})`
      );
    });

    if (totalCount === 0) {
      console.log(
        "\n❌ No activities found! Activities may not have been properly restored."
      );
    } else {
      console.log(
        `\n🎉 Success! ${totalCount} activities are available in the database.`
      );
    }
  } catch (error) {
    console.error("❌ Error verifying restoration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  verifyRestoration();
}

export { verifyRestoration };
