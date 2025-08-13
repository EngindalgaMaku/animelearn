const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function seedLearningActivities() {
  try {
    console.log("🎯 Starting Learning Activities seeding...");

    // Read the JSON data
    const dataPath = path.join(
      process.cwd(),
      "data",
      "learning-activities.json"
    );
    const jsonData = fs.readFileSync(dataPath, "utf8");
    const { activities } = JSON.parse(jsonData);

    console.log(`📚 Found ${activities.length} activities to seed`);

    // Clear existing activities (optional - comment out if you want to keep existing data)
    console.log("🧹 Clearing existing learning activities...");
    await prisma.activityAttempt.deleteMany({});
    await prisma.learningActivity.deleteMany({});

    // Keep track of created activities for prerequisite setup
    const createdActivities = new Map();

    // First pass: Create all activities without prerequisites
    console.log("🔨 Creating activities (first pass)...");
    for (const activity of activities) {
      try {
        const createdActivity = await prisma.learningActivity.create({
          data: {
            title: activity.title,
            description: activity.description || "",
            activityType: activity.activityType,
            category: activity.category,
            difficulty: activity.difficulty,
            diamondReward: activity.diamondReward,
            experienceReward: activity.experienceReward,
            content: JSON.stringify(activity.content),
            estimatedMinutes: activity.estimatedMinutes,
            tags: JSON.stringify(activity.tags || []),
            sortOrder: activity.sortOrder,
            topicOrder: activity.topicOrder || 0,
            isLocked: activity.isLocked,
            isActive: true,
            settings: activity.settings
              ? JSON.stringify(activity.settings)
              : null,
          },
        });

        createdActivities.set(activity.sortOrder, createdActivity);
        console.log(`✅ Created: ${activity.title} (${activity.activityType})`);
      } catch (error) {
        console.error(
          `❌ Failed to create activity: ${activity.title}`,
          error.message
        );
      }
    }

    // Second pass: Set up prerequisites based on logical progression
    console.log("🔗 Setting up prerequisites (second pass)...");
    const prerequisiteRules = [
      // Python Fundamentals progression
      { current: 2, prerequisite: 1 }, // Built-in Functions needs Variables
      { current: 3, prerequisite: 2 }, // For Loops needs Built-in Functions
      { current: 4, prerequisite: 3 }, // If-Else needs For Loops
      { current: 5, prerequisite: 4 }, // String Methods needs If-Else
      { current: 6, prerequisite: 5 }, // Code Structure needs String Methods
      { current: 19, prerequisite: 6 }, // Memory Game needs Code Structure

      // Data Structures progression (starts after fundamentals)
      { current: 7, prerequisite: 6 }, // Lists need Code Structure
      { current: 8, prerequisite: 7 }, // Dictionaries need Lists
      { current: 9, prerequisite: 8 }, // Tuples need Dictionaries
      { current: 10, prerequisite: 9 }, // Sets need Tuples
      { current: 20, prerequisite: 10 }, // Advanced Data Structures need Sets

      // Algorithms progression (starts after data structures)
      { current: 11, prerequisite: 10 }, // Binary Search needs Sets
      { current: 12, prerequisite: 11 }, // Sorting needs Binary Search
      { current: 13, prerequisite: 12 }, // Graph Traversal needs Sorting

      // New Algorithm Visualizations progression
      { current: 21, prerequisite: 10 }, // Bubble Sort needs Sets (basic algorithms start)
      { current: 22, prerequisite: 21 }, // Linear Search needs Bubble Sort
      { current: 23, prerequisite: 22 }, // Insertion Sort needs Linear Search
      { current: 24, prerequisite: 23 }, // Selection Sort needs Insertion Sort
      { current: 25, prerequisite: 24 }, // Quick Sort needs Selection Sort
      { current: 26, prerequisite: 25 }, // Merge Sort needs Quick Sort
      { current: 27, prerequisite: 26 }, // DFS needs Merge Sort
      { current: 28, prerequisite: 27 }, // BFS needs DFS

      // Advanced Sorting Algorithms progression
      { current: 29, prerequisite: 28 }, // Heap Sort needs BFS (advanced sorting)
      { current: 30, prerequisite: 29 }, // Counting Sort needs Heap Sort (non-comparison)
      { current: 31, prerequisite: 30 }, // Radix Sort needs Counting Sort (builds on counting)
      { current: 32, prerequisite: 31 }, // Shell Sort needs Radix Sort (gap-based sorting)
      { current: 33, prerequisite: 32 }, // Bucket Sort needs Shell Sort (distribution sorting)
      { current: 34, prerequisite: 33 }, // Cocktail Sort needs Bucket Sort (bidirectional bubble)
      { current: 35, prerequisite: 34 }, // Comb Sort needs Cocktail Sort (improved bubble)

      // Functions & OOP progression (starts after fundamentals)
      { current: 14, prerequisite: 6 }, // Function Fundamentals needs Code Structure
      { current: 15, prerequisite: 14 }, // Class Design needs Functions
      { current: 16, prerequisite: 15 }, // Inheritance needs Classes
      { current: 17, prerequisite: 16 }, // Decorators need Inheritance
      { current: 18, prerequisite: 17 }, // Exception Handling needs Decorators

      // Advanced Python Fundamentals progression (builds on core fundamentals)
      { current: 36, prerequisite: 19 }, // Advanced List Comprehensions needs Memory Game (solid fundamentals)
      { current: 37, prerequisite: 36 }, // Lambda Functions need List Comprehensions
      { current: 38, prerequisite: 5 }, // File I/O needs String Methods (basic I/O understanding)
      { current: 39, prerequisite: 18 }, // Exception Handling builds on existing exception quiz
      { current: 40, prerequisite: 38 }, // Modules Quiz needs File I/O (module imports/usage)
      { current: 41, prerequisite: 5 }, // String Formatting builds on String Methods
      { current: 42, prerequisite: 37 }, // Generators need Lambda Functions (advanced concepts)
      { current: 43, prerequisite: 41 }, // Regex needs String Formatting (text processing)
    ];

    for (const rule of prerequisiteRules) {
      const currentActivity = createdActivities.get(rule.current);
      const prerequisiteActivity = createdActivities.get(rule.prerequisite);

      if (currentActivity && prerequisiteActivity) {
        try {
          await prisma.learningActivity.update({
            where: { id: currentActivity.id },
            data: { prerequisiteId: prerequisiteActivity.id },
          });
          console.log(
            `🔗 Set prerequisite: ${prerequisiteActivity.title} → ${currentActivity.title}`
          );
        } catch (error) {
          console.error(
            `❌ Failed to set prerequisite for ${currentActivity.title}:`,
            error.message
          );
        }
      }
    }

    // Create activity statistics
    console.log("📊 Generating activity statistics...");
    const stats = {
      total: activities.length,
      byType: {},
      byCategory: {},
      byDifficulty: {},
      totalDiamonds: 0,
      totalXP: 0,
      totalMinutes: 0,
    };

    activities.forEach((activity) => {
      // Count by type
      stats.byType[activity.activityType] =
        (stats.byType[activity.activityType] || 0) + 1;

      // Count by category
      stats.byCategory[activity.category] =
        (stats.byCategory[activity.category] || 0) + 1;

      // Count by difficulty
      stats.byDifficulty[activity.difficulty] =
        (stats.byDifficulty[activity.difficulty] || 0) + 1;

      // Sum rewards
      stats.totalDiamonds += activity.diamondReward;
      stats.totalXP += activity.experienceReward;
      stats.totalMinutes += activity.estimatedMinutes;
    });

    // Display comprehensive statistics
    console.log("\n📈 SEEDING COMPLETE - STATISTICS:");
    console.log("=" * 50);
    console.log(`📚 Total Activities: ${stats.total}`);
    console.log(`💎 Total Diamond Rewards: ${stats.totalDiamonds}`);
    console.log(`⭐ Total XP Rewards: ${stats.totalXP}`);
    console.log(
      `⏱️  Total Estimated Time: ${stats.totalMinutes} minutes (${Math.round(stats.totalMinutes / 60)} hours)`
    );

    console.log("\n🎮 BY ACTIVITY TYPE:");
    Object.entries(stats.byType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} activities`);
    });

    console.log("\n📖 BY CATEGORY:");
    Object.entries(stats.byCategory).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} activities`);
    });

    console.log("\n🎯 BY DIFFICULTY:");
    Object.entries(stats.byDifficulty).forEach(([difficulty, count]) => {
      const level = [
        "",
        "Beginner",
        "Basic",
        "Intermediate",
        "Advanced",
        "Expert",
      ][difficulty];
      console.log(`  Level ${difficulty} (${level}): ${count} activities`);
    });

    console.log("\n🏆 ACTIVITY TYPE COVERAGE:");
    const expectedTypes = [
      "interactive_demo",
      "matching",
      "fill_blanks",
      "data_exploration",
      "drag_drop",
      "interactive_coding",
      "memory_game",
      "quiz",
      "algorithm_visualization",
      "code_builder",
      "class_builder",
    ];

    expectedTypes.forEach((type) => {
      const count = stats.byType[type] || 0;
      const status = count > 0 ? "✅" : "❌";
      console.log(`  ${status} ${type}: ${count} activities`);
    });

    console.log("\n✨ Learning Activities seeding completed successfully!");
    console.log(
      "🎓 Students can now enjoy comprehensive Python learning experiences!"
    );
  } catch (error) {
    console.error("💥 Error during learning activities seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
if (require.main === module) {
  seedLearningActivities()
    .then(() => {
      console.log("🎉 Seeding process completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💀 Seeding process failed:", error);
      process.exit(1);
    });
}

module.exports = { seedLearningActivities };
