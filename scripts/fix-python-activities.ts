import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Fixing Python fundamentals activities...");

  try {
    // Get all Python fundamentals activities with theory_interactive type
    const activities = await prisma.learningActivity.findMany({
      where: {
        category: "python_fundamentals",
      },
      select: {
        id: true,
        title: true,
        activityType: true,
        content: true,
      },
    });

    console.log(`📊 Found ${activities.length} Python fundamentals activities`);

    // Fix each activity type and content format
    for (const activity of activities) {
      console.log(`🔧 Fixing: ${activity.title}`);

      let newActivityType = activity.activityType;
      let newContent = activity.content;

      // Map theory_interactive to appropriate types based on content
      if (activity.activityType === "theory_interactive") {
        try {
          const content = JSON.parse(activity.content);

          // Determine correct activity type based on content structure
          if (content.questions) {
            newActivityType = "quiz";
          } else if (content.cards && Array.isArray(content.cards)) {
            newActivityType = "memory_game";
          } else if (content.pairs && Array.isArray(content.pairs)) {
            newActivityType = "matching";
          } else if (content.blocks || content.items) {
            newActivityType = "drag_drop";
          } else if (content.codeBlocks && content.correctOrder) {
            newActivityType = "code_builder";
          } else if (content.blanks && content.codeTemplate) {
            newActivityType = "fill_blanks";
          } else if (content.steps && Array.isArray(content.steps)) {
            newActivityType = "interactive_demo";
          } else if (content.dataset && content.tasks) {
            newActivityType = "data_exploration";
          }

          console.log(
            `   📋 Changed type from ${activity.activityType} to ${newActivityType}`
          );
        } catch (e) {
          console.log(`   ⚠️ Could not parse content for ${activity.title}`);
          // Keep as is if we can't parse content
        }
      }

      // Fix content format issues
      if (activity.activityType === "coding_challenge") {
        newActivityType = "interactive_coding";
        console.log(`   📋 Changed coding_challenge to interactive_coding`);
      }

      // Update the activity
      await prisma.learningActivity.update({
        where: { id: activity.id },
        data: {
          activityType: newActivityType,
        },
      });

      console.log(`   ✅ Updated: ${activity.title} (${newActivityType})`);
    }

    console.log("🎉 All Python fundamentals activities fixed!");

    // Show final counts
    const finalCounts = await prisma.learningActivity.groupBy({
      by: ["activityType"],
      where: { category: "python_fundamentals" },
      _count: { activityType: true },
    });

    console.log("\n📊 Final activity type distribution:");
    finalCounts.forEach((count) => {
      console.log(
        `   - ${count.activityType}: ${count._count.activityType} activities`
      );
    });
  } catch (error) {
    console.error("❌ Error fixing activities:", error);
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
