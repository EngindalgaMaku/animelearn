import { PrismaClient } from "@prisma/client";
import { seedSortingAlgorithms } from "./algorithm-challenges/sorting-algorithms";
import { seedSearchAlgorithms } from "./algorithm-challenges/search-algorithms";
import { seedDataStructures } from "./algorithm-challenges/data-structures";
import { seedGraphAlgorithms } from "./algorithm-challenges/graph-algorithms";

const prisma = new PrismaClient();

export async function seedAlgorithms() {
  console.log("🔄 Seeding Algorithm Challenges...");

  try {
    // Seed all algorithm challenge categories
    console.log("\n📚 Seeding Sorting Algorithms...");
    await seedSortingAlgorithms();

    console.log("\n🔍 Seeding Search Algorithms...");
    await seedSearchAlgorithms();

    console.log("\n📊 Seeding Data Structures...");
    await seedDataStructures();

    console.log("\n🗺️ Seeding Graph Algorithms...");
    await seedGraphAlgorithms();

    console.log("\n🎉 All algorithm challenges seeded successfully!");

    // Summary of what was created
    console.log("\n📋 ALGORITHM CHALLENGES SUMMARY:");
    console.log("=".repeat(60));
    console.log("🔄 Sorting Algorithms (5):");
    console.log("  • Bubble Sort: Step-by-Step Visualization");
    console.log("  • Selection Sort: Minimum Selection Process");
    console.log("  • Insertion Sort: Building Sorted Sequence");
    console.log("  • Merge Sort: Divide and Conquer Approach");
    console.log("  • Quick Sort: Partition-based Sorting");
    console.log("\n🔍 Search Algorithms (4):");
    console.log("  • Linear Search: Sequential Element Discovery");
    console.log("  • Binary Search: Divide and Conquer Search");
    console.log("  • Depth-First Search: Graph Traversal");
    console.log("  • Breadth-First Search: Level-order Traversal");
    console.log("\n📊 Data Structures (3):");
    console.log("  • Stack Operations: LIFO in Action");
    console.log("  • Queue Operations: FIFO in Action");
    console.log("  • Linked List Operations: Dynamic Node Management");
    console.log("\n🗺️ Graph Algorithms (3):");
    console.log("  • Dijkstra's Algorithm: Shortest Path Finding");
    console.log("  • Kruskal's Algorithm: Minimum Spanning Tree");
    console.log("  • Binary Tree Traversal: In/Pre/Post-order");
    console.log(
      "\n🌟 Total: 15 comprehensive algorithm visualization challenges!"
    );
    console.log("💎 Each challenge includes:");
    console.log("  - Comprehensive theory and explanations");
    console.log("  - Step-by-step visual breakdowns");
    console.log("  - Detailed starter code with TODOs");
    console.log("  - Complete solution implementations");
    console.log("  - Multiple test cases");
    console.log("  - Learning objectives");
    console.log("  - Real-world applications");
    console.log("  - Complexity analysis");
  } catch (error) {
    console.error("❌ Error seeding algorithm challenges:", error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    await seedAlgorithms();
    console.log("✅ Algorithm seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding algorithms:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}
