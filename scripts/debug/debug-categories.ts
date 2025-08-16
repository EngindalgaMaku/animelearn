import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function debugCategories() {
  try {
    console.log("🔍 Debugging database categories...");

    // Get all unique categories
    const categories = await prisma.learningActivity.groupBy({
      by: ["category"],
      _count: {
        id: true,
      },
    });

    console.log("\n📋 All categories in database:");
    categories.forEach((cat) => {
      console.log(`  ${cat.category}: ${cat._count.id} activities`);
    });

    // Get all unique activityTypes
    const activityTypes = await prisma.learningActivity.groupBy({
      by: ["activityType"],
      _count: {
        id: true,
      },
    });

    console.log("\n🎯 All activity types in database:");
    activityTypes.forEach((type) => {
      console.log(`  ${type.activityType}: ${type._count.id} activities`);
    });

    // Get sample activities to see their actual structure
    const sampleActivities = await prisma.learningActivity.findMany({
      take: 3,
      select: {
        id: true,
        title: true,
        category: true,
        activityType: true,
      },
    });

    console.log("\n📝 Sample activities:");
    sampleActivities.forEach((activity) => {
      console.log(
        `  ID: ${activity.id}, Title: "${activity.title}", Category: "${activity.category}", Type: "${activity.activityType}"`
      );
    });
  } catch (error) {
    console.error("❌ Error debugging categories:", error);
  } finally {
    await prisma.$disconnect();
  }
}

debugCategories();
