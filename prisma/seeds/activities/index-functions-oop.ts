import { seedQuizFunctionsOOPActivities } from "./quiz-functions-oop";
import { seedDragDropFunctionsOOPActivities } from "./drag-drop-functions-oop";
import { seedMemoryGameFunctionsOOPActivities } from "./memory-game-functions-oop";
import { seedMatchingFunctionsOOPActivities } from "./matching-functions-oop";
import { seedFillBlanksFunctionsOOPActivities } from "./fill-blanks-functions-oop";
import { seedInteractiveCodingFunctionsOOPActivities } from "./interactive-coding-functions-oop";
import { seedCodeBuilderFunctionsOOPActivities } from "./code-builder-functions-oop";
import { seedInteractiveDemoFunctionsOOPActivities } from "./interactive-demo-functions-oop";
import { seedAlgorithmVisualizationFunctionsOOPActivities } from "./algorithm-visualization-functions-oop";
import { seedClassBuilderFunctionsOOPActivities } from "./class-builder-functions-oop";
import { seedDataExplorationFunctionsOOPActivities } from "./data-exploration-functions-oop";

import { prisma } from "./seed-utils";

/**
 * Seed ALL Functions & OOP activities (11 types)
 * - quiz
 * - drag_drop
 * - memory_game
 * - matching
 * - fill_blanks
 * - interactive_coding
 * - code_builder
 * - interactive_demo
 * - algorithm_visualization
 * - class_builder
 * - data_exploration
 */
export async function seedAllFunctionsOOPActivities() {
  console.log("🚀 Starting to seed ALL Functions & OOP activities...\n");

  const tasks: Array<{ name: string; run: () => Promise<void> }> = [
    { name: "Quiz", run: seedQuizFunctionsOOPActivities },
    { name: "Drag-Drop", run: seedDragDropFunctionsOOPActivities },
    { name: "Memory Game", run: seedMemoryGameFunctionsOOPActivities },
    { name: "Matching", run: seedMatchingFunctionsOOPActivities },
    { name: "Fill Blanks", run: seedFillBlanksFunctionsOOPActivities },
    {
      name: "Interactive Coding",
      run: seedInteractiveCodingFunctionsOOPActivities,
    },
    { name: "Code Builder", run: seedCodeBuilderFunctionsOOPActivities },
    {
      name: "Interactive Demo",
      run: seedInteractiveDemoFunctionsOOPActivities,
    },
    {
      name: "Algorithm Visualization",
      run: seedAlgorithmVisualizationFunctionsOOPActivities,
    },
    { name: "Class Builder", run: seedClassBuilderFunctionsOOPActivities },
    {
      name: "Data Exploration",
      run: seedDataExplorationFunctionsOOPActivities,
    },
  ];

  let ok = 0;
  let fail = 0;

  for (const t of tasks) {
    try {
      console.log(`➡️  Seeding: ${t.name} ...`);
      await t.run();
      console.log(`✅ Completed: ${t.name}\n`);
      ok++;
    } catch (e) {
      console.error(`❌ Failed: ${t.name}`, e);
      fail++;
    }
  }

  console.log(
    `\n🎯 Functions & OOP seeding finished. Success: ${ok}, Failed: ${fail}`
  );
}

// Execute if run directly
if (require.main === module) {
  seedAllFunctionsOOPActivities()
    .catch((error) => {
      console.error("❌ Error seeding ALL Functions & OOP activities:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
