import { seedQuizDataStructuresActivities } from "./quiz-data-structures";
import { seedDragDropDataStructuresActivities } from "./drag-drop-data-structures";
import { seedMemoryGameDataStructuresActivities } from "./memory-game-data-structures";
import { seedMatchingDataStructuresActivities } from "./matching-data-structures";
import { seedFillBlanksDataStructuresActivities } from "./fill-blanks-data-structures";
import { seedInteractiveCodingDataStructuresActivities } from "./interactive-coding-data-structures";
import { seedCodeBuilderDataStructuresActivities } from "./code-builder-data-structures";
import { seedInteractiveDemoDataStructuresActivities } from "./interactive-demo-data-structures";
import { seedAlgorithmVisualizationDataStructuresActivities } from "./algorithm-visualization-data-structures";
import { seedClassBuilderDataStructuresActivities } from "./class-builder-data-structures";
import { seedDataExplorationDataStructuresActivities } from "./data-exploration-data-structures";

import { prisma } from "./seed-utils";

/**
 * Seed ALL Data Structures activities (11 types)
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
export async function seedAllDataStructuresActivities() {
  console.log("🚀 Starting to seed ALL Data Structures activities...\n");

  const tasks: Array<{ name: string; run: () => Promise<void> }> = [
    { name: "Quiz", run: seedQuizDataStructuresActivities },
    { name: "Drag-Drop", run: seedDragDropDataStructuresActivities },
    { name: "Memory Game", run: seedMemoryGameDataStructuresActivities },
    { name: "Matching", run: seedMatchingDataStructuresActivities },
    { name: "Fill Blanks", run: seedFillBlanksDataStructuresActivities },
    {
      name: "Interactive Coding",
      run: seedInteractiveCodingDataStructuresActivities,
    },
    { name: "Code Builder", run: seedCodeBuilderDataStructuresActivities },
    {
      name: "Interactive Demo",
      run: seedInteractiveDemoDataStructuresActivities,
    },
    {
      name: "Algorithm Visualization",
      run: seedAlgorithmVisualizationDataStructuresActivities,
    },
    { name: "Class Builder", run: seedClassBuilderDataStructuresActivities },
    {
      name: "Data Exploration",
      run: seedDataExplorationDataStructuresActivities,
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
    `\n🎯 Data Structures seeding finished. Success: ${ok}, Failed: ${fail}`
  );
}

if (require.main === module) {
  seedAllDataStructuresActivities()
    .catch((error) => {
      console.error("❌ Error seeding ALL Data Structures activities:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
