import { seedLearningActivities } from "../prisma/seeds/learning-activities";
import { seedPythonFundamentals } from "../prisma/seeds/python-fundamentals";
import { seedLessons } from "../src/scripts/seed-lessons";

async function restoreAllActivities() {
  console.log("🔄 Starting activity restoration...");

  try {
    // Restore learning activities
    console.log("\n1. Restoring learning activities...");
    await seedLearningActivities();

    // Restore Python fundamentals
    console.log("\n2. Restoring Python fundamentals...");
    await seedPythonFundamentals();

    // Restore lessons
    console.log("\n3. Restoring lessons...");
    await seedLessons();

    console.log("\n🎉 All activities restored successfully!");
  } catch (error) {
    console.error("❌ Error restoring activities:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  restoreAllActivities();
}

export { restoreAllActivities };
