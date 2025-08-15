import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupDuplicates() {
  try {
    console.log("🧹 Starting duplicate cleanup...");

    // Get all activities and group by title and activityType to find duplicates
    const activities = await prisma.learningActivity.findMany({
      where: { category: "Python Fundamentals" },
      orderBy: [
        { activityType: "asc" },
        { sortOrder: "asc" },
        { createdAt: "desc" }, // Keep the newest ones
      ],
    });

    console.log(`📊 Found ${activities.length} total activities`);

    // Group by title + activityType to identify duplicates
    const grouped: { [key: string]: any[] } = {};

    activities.forEach((activity) => {
      const key = `${activity.activityType}-${activity.title}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(activity);
    });

    let duplicatesRemoved = 0;

    // Remove duplicates, keeping only the first (newest) one
    for (const [key, group] of Object.entries(grouped)) {
      if (group.length > 1) {
        console.log(`🔍 Found ${group.length} duplicates for: ${key}`);

        // Keep the first one, delete the rest
        const toDelete = group.slice(1);

        for (const duplicate of toDelete) {
          console.log(
            `❌ Deleting duplicate: ${duplicate.title} (ID: ${duplicate.id})`
          );
          await prisma.learningActivity.delete({
            where: { id: duplicate.id },
          });
          duplicatesRemoved++;
        }
      }
    }

    console.log(`🎉 Cleanup complete! Removed ${duplicatesRemoved} duplicates`);

    // Show final count
    const finalCount = await prisma.learningActivity.count({
      where: { category: "Python Fundamentals" },
    });

    console.log(`📊 Final count: ${finalCount} unique activities`);

    // Show count by type
    const typeCount = await prisma.learningActivity.groupBy({
      by: ["activityType"],
      where: { category: "Python Fundamentals" },
      _count: { activityType: true },
    });

    console.log("\n📋 Final count by type:");
    typeCount.forEach((type) => {
      console.log(
        `  ${type.activityType}: ${type._count.activityType} activities`
      );
    });
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicates();
