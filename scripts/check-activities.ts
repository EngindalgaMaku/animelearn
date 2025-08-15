import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking Python fundamentals activities in database...");

  try {
    // Get all activities
    const allActivities = await prisma.learningActivity.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        isActive: true,
        activityType: true,
        difficulty: true,
        sortOrder: true,
      },
      orderBy: { title: "asc" },
    });

    console.log(`📊 Total activities in database: ${allActivities.length}`);

    // Filter Python fundamentals activities
    const pythonActivities = allActivities.filter(
      (a) =>
        a.category.toLowerCase().includes("python") ||
        a.title.toLowerCase().includes("python")
    );

    console.log(`🐍 Python-related activities: ${pythonActivities.length}`);

    if (pythonActivities.length > 0) {
      console.log("\n📝 Python fundamentals activities found:");
      pythonActivities.forEach((activity, index) => {
        console.log(`${index + 1}. ${activity.title}`);
        console.log(`   - Category: ${activity.category}`);
        console.log(`   - Active: ${activity.isActive}`);
        console.log(`   - Type: ${activity.activityType}`);
        console.log(`   - Difficulty: ${activity.difficulty}`);
        console.log("");
      });
    } else {
      console.log("❌ No Python fundamentals activities found!");
    }

    // Check categories
    const categories = await prisma.learningActivity.groupBy({
      by: ["category"],
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
    });

    console.log("📂 Available categories:");
    categories.forEach((cat) => {
      console.log(`   - ${cat.category}: ${cat._count.category} activities`);
    });
  } catch (error) {
    console.error("❌ Error checking activities:", error);
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
