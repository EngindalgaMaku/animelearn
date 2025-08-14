import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixActivityTypes() {
  try {
    console.log("🔧 Fixing activity types to use only supported types...");

    // Get all Python Fundamentals activities with unsupported types
    const activities = await prisma.learningActivity.findMany({
      where: {
        category: "Python Fundamentals",
      },
    });

    console.log(`📋 Found ${activities.length} activities to check`);

    // Mapping of unsupported types to supported types
    const typeMapping = {
      concept_exploration: "interactive_demo", // Theory-based content as demo
      quiz_challenge: "quiz", // Quiz challenge as quiz
      debugging_challenge: "interactive_coding", // Debug as coding
      algorithm_practice: "algorithm_visualization", // Algorithm practice as visualization
      project_based: "interactive_coding", // Project as coding
      code_review: "interactive_coding", // Code review as coding
    };

    let updated = 0;

    for (const activity of activities) {
      const newType =
        typeMapping[activity.activityType as keyof typeof typeMapping];

      if (newType) {
        // Update the activity type
        await prisma.learningActivity.update({
          where: { id: activity.id },
          data: {
            activityType: newType,
          },
        });

        console.log(
          `✅ Updated "${activity.title}": ${activity.activityType} → ${newType}`
        );
        updated++;
      } else {
        console.log(
          `✓ "${activity.title}": ${activity.activityType} (already supported)`
        );
      }
    }

    console.log(`\n🎉 Activity Type Fix Complete!`);
    console.log(`📊 Updated ${updated} activities`);

    // Show final distribution
    const finalActivities = await prisma.learningActivity.findMany({
      where: {
        category: "Python Fundamentals",
      },
      select: {
        activityType: true,
      },
    });

    const typeCount: { [key: string]: number } = {};
    finalActivities.forEach((activity) => {
      typeCount[activity.activityType] =
        (typeCount[activity.activityType] || 0) + 1;
    });

    console.log("\n📈 Final Activity Type Distribution:");
    Object.entries(typeCount)
      .sort(([, a], [, b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`   ${type}: ${count} activities`);
      });
  } catch (error) {
    console.error("❌ Error fixing activity types:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
if (require.main === module) {
  fixActivityTypes();
}

export { fixActivityTypes };
