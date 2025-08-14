const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log("🔍 Checking Code Arena activities in database...");

    const activities = await prisma.codeArena.findMany({
      where: {
        category: "Python Fundamentals",
      },
      select: {
        id: true,
        title: true,
        activityType: true,
        category: true,
      },
      take: 5,
    });

    console.log("📊 Found activities:");
    activities.forEach((activity) => {
      console.log(`- ${activity.title}: ${activity.activityType}`);
    });

    // Check total count
    const total = await prisma.codeArena.count({
      where: { category: "Python Fundamentals" },
    });

    console.log(`\n📈 Total Python Fundamentals activities: ${total}`);
  } catch (error) {
    console.error("❌ Database check failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
