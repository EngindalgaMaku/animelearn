/**
 * Normalize LearningActivity.category for Python Fundamentals
 * Goal: Make Learn page show correct totals by unifying category naming.
 *
 * Actions:
 * - Map variants to exact "Python Fundamentals":
 *   • "python_fundamentals"
 *   • "Python Basics"
 *   • "python basics"
 *   • "Functions & OOP"
 *   • "functions & oop"
 * - Also force all activities created by python fundamentals seed (settings.source === "python_fundamentals_seed")
 *   into "Python Fundamentals" to avoid stragglers.
 *
 * Safe to run multiple times (idempotent).
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(
    "🔧 Normalizing LearningActivity categories to 'Python Fundamentals'..."
  );

  // Snapshot counts before
  const before = await prisma.learningActivity.groupBy({
    by: ["category"],
    _count: { category: true },
  });
  console.log("📊 Categories before:");
  before.forEach((c) => console.log(`  - ${c.category}: ${c._count.category}`));

  let totalUpdated = 0;

  // 1) Direct category mappings
  const mappings: { from: string[]; to: string }[] = [
    {
      from: [
        "python_fundamentals",
        "Python Basics",
        "python basics",
        "Functions & OOP",
        "functions & oop",
      ],
      to: "Python Fundamentals",
    },
  ];

  for (const map of mappings) {
    for (const fromCat of map.from) {
      const res = await prisma.learningActivity.updateMany({
        where: { category: fromCat },
        data: { category: map.to },
      });
      if (res.count > 0) {
        console.log(
          `✅ Updated ${res.count} activities: '${fromCat}' -> '${map.to}'`
        );
      }
      totalUpdated += res.count;
    }
  }

  // 2) Seed-source-based normalization (python fundamentals seed)
  //    Any items created by python fundamentals seed should be under 'Python Fundamentals'
  const resSeed = await prisma.learningActivity.updateMany({
    where: {
      AND: [
        { settings: { contains: '"source":"python_fundamentals_seed"' } },
        { NOT: { category: "Python Fundamentals" } },
      ],
    },
    data: { category: "Python Fundamentals" },
  });
  if (resSeed.count > 0) {
    console.log(
      `✅ Updated ${resSeed.count} activities by seed-source to 'Python Fundamentals'`
    );
  }
  totalUpdated += resSeed.count;

  console.log(`\n✨ Total activities updated: ${totalUpdated}`);

  // Snapshot after
  const after = await prisma.learningActivity.groupBy({
    by: ["category"],
    _count: { category: true },
    orderBy: { _count: { category: "desc" } },
  });
  console.log("\n📊 Categories after:");
  after.forEach((c) => console.log(`  - ${c.category}: ${c._count.category}`));

  // Show Python Fundamentals total explicitly
  const pythonFundamentalsCount =
    after.find((c) => c.category === "Python Fundamentals")?._count.category ??
    0;
  console.log(
    `\n🎯 Python Fundamentals total activities: ${pythonFundamentalsCount}`
  );

  console.log("\n✅ Category normalization complete.");
}

main()
  .catch((e) => {
    console.error("❌ Normalization failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
