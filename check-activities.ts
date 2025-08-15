import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkActivities() {
  try {
    console.log("🔍 Checking activities in database...");

    const totalActivities = await prisma.learningActivity.count();
    console.log(`📊 Total learning activities: ${totalActivities}`);

    const pythonActivities = await prisma.learningActivity.count({
      where: { category: "Python Fundamentals" },
    });
    console.log(`🐍 Python fundamentals activities: ${pythonActivities}`);

    const activityTypes = await prisma.learningActivity.groupBy({
      by: ["activityType"],
      _count: {
        id: true,
      },
      where: { category: "Python Fundamentals" },
    });

    console.log("\n📋 Activities by type:");
    activityTypes.forEach((type) => {
      console.log(`  ${type.activityType}: ${type._count.id} activities`);
    });

    // Check specific drag-drop activities
    const dragDropActivities = await prisma.learningActivity.findMany({
      where: {
        activityType: "drag_drop",
        category: "Python Fundamentals",
      },
      select: {
        id: true,
        title: true,
        isActive: true,
      },
    });

    console.log("\n🎯 Drag-drop activities:");
    dragDropActivities.forEach((activity) => {
      console.log(
        `  - ${activity.title} (ID: ${activity.id}, Active: ${activity.isActive})`
      );
    });
  } catch (error) {
    console.error("❌ Error checking activities:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkActivities();
