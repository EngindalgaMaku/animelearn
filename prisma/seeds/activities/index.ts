/**
 * Activities Seed Manager
 * Python Fundamentals activity seed files for all activity types
 *
 * This file exports all activity seed arrays and provides seeding functions
 */

// Import all activity seed files
export * from "./drag-drop-python-fundamentals";
export * from "./memory-game-python-fundamentals";
export * from "./quiz-python-fundamentals";
export * from "./fill-blanks-python-fundamentals";
export * from "./interactive-coding-python-fundamentals";
export * from "./matching-python-fundamentals";
export * from "./code-builder-python-fundamentals";
export * from "./interactive-demo-python-fundamentals";
export * from "./algorithm-visualization-python-fundamentals";
export * from "./class-builder-python-fundamentals";
export * from "./data-exploration-python-fundamentals";

// Activity categories
export const ACTIVITY_CATEGORIES = {
  PYTHON_FUNDAMENTALS: "python_fundamentals",
} as const;

// Activity types
export const ACTIVITY_TYPES = {
  DRAG_DROP: "drag_drop",
  MEMORY_GAME: "memory_game",
  QUIZ: "quiz",
  FILL_BLANKS: "fill_blanks",
  INTERACTIVE_CODING: "interactive_coding",
  MATCHING: "matching",
  CODE_BUILDER: "code_builder",
  INTERACTIVE_DEMO: "interactive_demo",
  ALGORITHM_VISUALIZATION: "algorithm_visualization",
  CLASS_BUILDER: "class_builder",
  DATA_EXPLORATION: "data_exploration",
} as const;

export type ActivityCategory =
  (typeof ACTIVITY_CATEGORIES)[keyof typeof ACTIVITY_CATEGORIES];

export type ActivityType = (typeof ACTIVITY_TYPES)[keyof typeof ACTIVITY_TYPES];

/**
 * Seed all Python Fundamentals activities
 * This function will run all individual seeding functions
 */
export async function seedAllPythonFundamentalsActivities() {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  try {
    console.log("🚀 Starting to seed all Python Fundamentals activities...\n");

    // Import and run all seeding functions
    const seedFunctions = [
      () =>
        import("./drag-drop-python-fundamentals").then((m) =>
          m.seedDragDropPythonFundamentalsActivities()
        ),
      () =>
        import("./memory-game-python-fundamentals").then((m) =>
          m.seedMemoryGamePythonFundamentalsActivities()
        ),
      () =>
        import("./quiz-python-fundamentals").then((m) =>
          m.seedQuizPythonFundamentalsActivities()
        ),
      () =>
        import("./fill-blanks-python-fundamentals").then((m) =>
          m.seedFillBlanksPythonFundamentalsActivities()
        ),
      () =>
        import("./interactive-coding-python-fundamentals").then((m) =>
          m.seedInteractiveCodingPythonFundamentalsActivities()
        ),
      () =>
        import("./matching-python-fundamentals").then((m) =>
          m.seedMatchingPythonFundamentalsActivities()
        ),
      () =>
        import("./code-builder-python-fundamentals").then((m) =>
          m.seedCodeBuilderPythonFundamentalsActivities()
        ),
      () =>
        import("./interactive-demo-python-fundamentals").then((m) =>
          m.seedInteractiveDemoPythonFundamentalsActivities()
        ),
      () =>
        import("./algorithm-visualization-python-fundamentals").then((m) =>
          m.seedAlgorithmVisualizationPythonFundamentalsActivities()
        ),
      () =>
        import("./class-builder-python-fundamentals").then((m) =>
          m.seedClassBuilderActivities()
        ),
      () =>
        import("./data-exploration-python-fundamentals").then((m) =>
          m.seedDataExplorationActivities()
        ),
    ];

    for (const seedFunction of seedFunctions) {
      await seedFunction();
    }

    console.log("\n🎉 All Python Fundamentals activities seeded successfully!");

    // Get total count
    const totalCount = await prisma.learningActivity.count({
      where: { category: "python_fundamentals" },
    });

    console.log(`📊 Total activities in database: ${totalCount}`);
  } catch (error) {
    console.error("❌ Error seeding activities:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedAllPythonFundamentalsActivities()
    .then(() => {
      console.log("All Python Fundamentals activities seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed activities:", error);
      process.exit(1);
    });
}
