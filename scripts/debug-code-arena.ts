import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function debugCodeArena() {
  try {
    console.log("🔍 Debugging Code Arena API...");

    // Check what the Code Arena API query would return
    const where: any = {
      isActive: true, // Same filter as Code Arena API
    };

    const activities = await prisma.learningActivity.findMany({
      where,
      orderBy: [
        { category: "asc" },
        { sortOrder: "asc" },
        { difficulty: "asc" },
        { title: "asc" },
      ],
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        activityType: true,
        difficulty: true,
        isActive: true,
        isLocked: true,
        createdAt: true,
      },
    });

    console.log(
      `📊 Code Arena API would return: ${activities.length} activities`
    );

    if (activities.length === 0) {
      console.log("\n❌ No activities with isActive: true found!");

      // Check how many activities exist but are inactive
      const inactiveCount = await prisma.learningActivity.count({
        where: { isActive: false },
      });

      const totalCount = await prisma.learningActivity.count();

      console.log(`📊 Total activities in DB: ${totalCount}`);
      console.log(`❌ Inactive activities: ${inactiveCount}`);
      console.log(`✅ Active activities: ${totalCount - inactiveCount}`);

      if (inactiveCount > 0) {
        console.log("\n🔧 Fixing inactive activities...");
        const updateResult = await prisma.learningActivity.updateMany({
          where: { isActive: false },
          data: { isActive: true },
        });
        console.log(`✅ Activated ${updateResult.count} activities`);
      }
    } else {
      console.log("\n🎯 Code Arena activities found:");

      // Group by category
      const byCategory: { [key: string]: any[] } = {};
      activities.forEach((activity) => {
        if (!byCategory[activity.category]) {
          byCategory[activity.category] = [];
        }
        byCategory[activity.category].push(activity);
      });

      Object.entries(byCategory).forEach(([category, acts]) => {
        console.log(`\n📂 ${category} (${acts.length} activities):`);
        acts.forEach((activity) => {
          const lockStatus = activity.isLocked ? "🔒" : "🔓";
          console.log(
            `  ${lockStatus} ${activity.title} (${activity.activityType})`
          );
        });
      });
    }

    // Test specific Python Fundamentals category
    console.log("\n🐍 Python Fundamentals check:");
    const pythonFundamentals = await prisma.learningActivity.findMany({
      where: {
        category: "Python Fundamentals",
        isActive: true,
      },
      select: {
        title: true,
        isActive: true,
        isLocked: true,
      },
    });

    console.log(
      `Found ${pythonFundamentals.length} Python Fundamentals activities:`
    );
    pythonFundamentals.slice(0, 5).forEach((activity) => {
      const status = activity.isActive ? "✅" : "❌";
      const lock = activity.isLocked ? "🔒" : "🔓";
      console.log(`  ${status}${lock} ${activity.title}`);
    });

    if (pythonFundamentals.length > 5) {
      console.log(`  ... and ${pythonFundamentals.length - 5} more`);
    }
  } catch (error) {
    console.error("❌ Error debugging Code Arena:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  debugCodeArena();
}

export { debugCodeArena };
