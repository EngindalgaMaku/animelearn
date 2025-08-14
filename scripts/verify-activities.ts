import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verifyActivities() {
  try {
    console.log("🔍 Verifying Python Fundamentals activities...");

    // Get all Python Fundamentals activities
    const activities = await prisma.learningActivity.findMany({
      where: {
        category: "Python Fundamentals",
      },
      orderBy: {
        sortOrder: "asc",
      },
      select: {
        id: true,
        title: true,
        activityType: true,
        difficulty: true,
        diamondReward: true,
        experienceReward: true,
        estimatedMinutes: true,
        sortOrder: true,
        isActive: true,
        tags: true,
      },
    });

    console.log(
      `\n📊 Found ${activities.length} Python Fundamentals activities\n`
    );

    if (activities.length === 0) {
      console.log("❌ No activities found!");
      return;
    }

    // Display activity summary
    console.log("📋 Activity List:");
    console.log("=".repeat(80));

    let totalDiamonds = 0;
    let totalXP = 0;
    let totalMinutes = 0;
    const difficultyCount = [0, 0, 0, 0]; // index 0 unused
    const typeCount: { [key: string]: number } = {};

    activities.forEach((activity, index) => {
      const difficultyLabel =
        activity.difficulty === 1
          ? "🔥 Beginner"
          : activity.difficulty === 2
            ? "⚡ Intermediate"
            : "🚀 Advanced";

      console.log(`${(index + 1).toString().padStart(2)}. ${activity.title}`);
      console.log(
        `    Type: ${activity.activityType} | ${difficultyLabel} | Order: ${activity.sortOrder}`
      );
      console.log(
        `    Rewards: 💎${activity.diamondReward} ⭐${activity.experienceReward} ⏱️${activity.estimatedMinutes}min`
      );
      console.log(
        `    Status: ${activity.isActive ? "✅ Active" : "❌ Inactive"}`
      );
      console.log();

      // Accumulate stats
      totalDiamonds += activity.diamondReward;
      totalXP += activity.experienceReward;
      totalMinutes += activity.estimatedMinutes;
      difficultyCount[activity.difficulty]++;
      typeCount[activity.activityType] =
        (typeCount[activity.activityType] || 0) + 1;
    });

    // Display summary statistics
    console.log("📈 Summary Statistics:");
    console.log("=".repeat(50));
    console.log(`🎯 Total Activities: ${activities.length}`);
    console.log(`💎 Total Diamonds: ${totalDiamonds}`);
    console.log(`⭐ Total Experience: ${totalXP}`);
    console.log(
      `⏱️ Total Learning Time: ${totalMinutes} minutes (${(totalMinutes / 60).toFixed(1)} hours)`
    );

    console.log("\n🎚️ Difficulty Distribution:");
    console.log(`   🔥 Beginner (1): ${difficultyCount[1]} activities`);
    console.log(`   ⚡ Intermediate (2): ${difficultyCount[2]} activities`);
    console.log(`   🚀 Advanced (3): ${difficultyCount[3]} activities`);

    console.log("\n🎭 Activity Type Distribution:");
    Object.entries(typeCount)
      .sort(([, a], [, b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`   ${type}: ${count} activities`);
      });

    // Check for any issues
    console.log("\n🔍 Quality Check:");
    const issues = [];

    // Check for duplicates
    const titles = activities.map((a) => a.title);
    const duplicateTitles = titles.filter(
      (title, index) => titles.indexOf(title) !== index
    );
    if (duplicateTitles.length > 0) {
      issues.push(`❌ Duplicate titles found: ${duplicateTitles.join(", ")}`);
    }

    // Check sort order
    const sortOrders = activities.map((a) => a.sortOrder);
    const expectedOrders = Array.from(
      { length: activities.length },
      (_, i) => i + 1
    );
    if (JSON.stringify(sortOrders) !== JSON.stringify(expectedOrders)) {
      issues.push("❌ Sort order is not sequential (1, 2, 3...)");
    }

    // Check if all activities are active
    const inactiveCount = activities.filter((a) => !a.isActive).length;
    if (inactiveCount > 0) {
      issues.push(`⚠️ ${inactiveCount} activities are inactive`);
    }

    if (issues.length === 0) {
      console.log("✅ All quality checks passed!");
    } else {
      console.log("Issues found:");
      issues.forEach((issue) => console.log(`   ${issue}`));
    }

    // Test a sample activity content
    console.log("\n🧪 Testing Sample Activity Content:");
    const sampleActivity = await prisma.learningActivity.findFirst({
      where: {
        category: "Python Fundamentals",
        title: "Python Basics: Hello World",
      },
    });

    if (sampleActivity) {
      console.log(`✅ Sample activity found: ${sampleActivity.title}`);
      try {
        const content = JSON.parse(sampleActivity.content);
        console.log("✅ Content JSON is valid");
        console.log(`   - Instructions: ${content.instructions ? "✅" : "❌"}`);
        console.log(`   - Starter Code: ${content.starterCode ? "✅" : "❌"}`);
        console.log(
          `   - Solution Code: ${content.solutionCode ? "✅" : "❌"}`
        );
        console.log(
          `   - Test Cases: ${content.testCases?.length > 0 ? "✅" : "❌"}`
        );
      } catch (error) {
        console.log("❌ Content JSON is invalid");
      }
    } else {
      console.log("❌ Sample activity not found");
    }

    console.log("\n🎉 Verification Complete!");
  } catch (error) {
    console.error("❌ Error during verification:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run verification
if (require.main === module) {
  verifyActivities();
}

export { verifyActivities };
