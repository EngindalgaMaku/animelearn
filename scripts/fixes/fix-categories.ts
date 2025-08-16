import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixCategories() {
  try {
    console.log("🔄 Fixing activity categories...");

    // Update activities with wrong category name
    const updateResult = await prisma.learningActivity.updateMany({
      where: {
        category: "python_fundamentals",
      },
      data: {
        category: "Python Fundamentals",
      },
    });

    console.log(
      `✅ Updated ${updateResult.count} activities to use correct category`
    );

    // Verify the fix
    const finalCount = await prisma.learningActivity.count({
      where: { category: "Python Fundamentals" },
    });

    console.log(
      `📊 Total activities with "Python Fundamentals" category: ${finalCount}`
    );
  } catch (error) {
    console.error("❌ Error fixing categories:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCategories();
