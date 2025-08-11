const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkCategories() {
  try {
    console.log("🔍 Checking existing categories in database...\n");

    // Get all unique categories
    const categories = await prisma.learningActivity.groupBy({
      by: ["category"],
      where: { isActive: true },
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
    });

    console.log("📊 Categories found:");
    categories.forEach((cat) => {
      console.log(`  - "${cat.category}" (${cat._count.category} activities)`);
    });

    console.log("\n🔍 Looking for Python-related activities...");

    // Check for Python activities specifically
    const pythonActivities = await prisma.learningActivity.findMany({
      where: {
        isActive: true,
        OR: [
          { category: { contains: "Python", mode: "insensitive" } },
          { category: { contains: "python", mode: "insensitive" } },
          { title: { contains: "Python", mode: "insensitive" } },
          { title: { contains: "python", mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        category: true,
        activityType: true,
      },
    });

    console.log(
      `\n🐍 Found ${pythonActivities.length} Python-related activities:`
    );
    pythonActivities.forEach((activity) => {
      console.log(
        `  - "${activity.title}" (Category: "${activity.category}", Type: ${activity.activityType})`
      );
    });

    // Get all activities for debugging
    const allActivities = await prisma.learningActivity.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        category: true,
        activityType: true,
      },
      orderBy: { category: "asc" },
    });

    console.log(
      `\n📝 All ${allActivities.length} active activities by category:`
    );
    const grouped = allActivities.reduce((acc, activity) => {
      if (!acc[activity.category]) {
        acc[activity.category] = [];
      }
      acc[activity.category].push(activity);
      return acc;
    }, {});

    Object.keys(grouped).forEach((category) => {
      console.log(`\n  📂 ${category}:`);
      grouped[category].forEach((activity) => {
        console.log(`    - ${activity.title} (${activity.activityType})`);
      });
    });
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();
