const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function fixActivityTypes() {
  try {
    console.log("🔧 Fixing activity types in database...");

    // Define the correct activity types for each activity
    const activityTypeMappings = [
      { title: "Python Data Types Quiz", activityType: "quiz" },
      { title: "Python Variables Drag & Sort", activityType: "drag_drop" },
      { title: "String Methods Memory Challenge", activityType: "memory_game" },
      { title: "Math Operators Matching Game", activityType: "matching" },
      { title: "Complete the Python List Code", activityType: "fill_blanks" },
      {
        title: "Python Conditionals Interactive Demo",
        activityType: "interactive_demo",
      },
      { title: "Build Python Loop Code", activityType: "code_builder" },
      {
        title: "Python Functions Code Lab",
        activityType: "interactive_coding",
      },
      { title: "Dictionary Operations Drag & Drop", activityType: "drag_drop" },
      { title: "Advanced Python Concepts Quiz", activityType: "quiz" },
      { title: "File Operations Matching Challenge", activityType: "matching" },
      { title: "Python Exception Memory Game", activityType: "memory_game" },
      { title: "Build a Python Class", activityType: "class_builder" },
      {
        title: "Explore Python Data Processing",
        activityType: "data_exploration",
      },
      {
        title: "Python Calculator Project",
        activityType: "interactive_coding",
      },
    ];

    // Update each activity with the correct type
    for (const mapping of activityTypeMappings) {
      try {
        const result = await prisma.codeArena.updateMany({
          where: {
            title: mapping.title,
            category: "Python Fundamentals",
          },
          data: {
            activityType: mapping.activityType,
          },
        });

        if (result.count > 0) {
          console.log(
            `✅ Updated "${mapping.title}" to "${mapping.activityType}"`
          );
        } else {
          console.log(`⚠️ No activity found with title "${mapping.title}"`);
        }
      } catch (error) {
        console.error(`❌ Failed to update "${mapping.title}":`, error.message);
      }
    }

    // Verify the updates
    console.log("\n🔍 Verifying updates...");
    const activities = await prisma.codeArena.findMany({
      where: { category: "Python Fundamentals" },
      select: { title: true, activityType: true },
      orderBy: { order: "asc" },
    });

    console.log("\n📊 Updated activities:");
    activities.forEach((activity) => {
      console.log(`- ${activity.title}: ${activity.activityType}`);
    });

    // Count by type
    const typeCounts = await prisma.codeArena.groupBy({
      by: ["activityType"],
      where: { category: "Python Fundamentals" },
      _count: { activityType: true },
    });

    console.log("\n📈 Activity type distribution:");
    typeCounts.forEach((typeCount) => {
      console.log(
        `- ${typeCount.activityType}: ${typeCount._count.activityType}`
      );
    });
  } catch (error) {
    console.error("❌ Fix failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixActivityTypes();
