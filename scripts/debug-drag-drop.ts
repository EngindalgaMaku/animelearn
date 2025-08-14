import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function debugDragDrop() {
  try {
    console.log("🔍 Debugging drag_drop activities...");

    const dragDropActivities = await prisma.learningActivity.findMany({
      where: {
        activityType: "drag_drop",
        category: "Python Fundamentals",
      },
      select: {
        id: true,
        title: true,
        content: true,
      },
    });

    console.log(
      `\n📊 Found ${dragDropActivities.length} drag_drop activities:`
    );

    dragDropActivities.forEach((activity, index) => {
      console.log(`\n${index + 1}. ${activity.title}`);
      console.log(`   ID: ${activity.id}`);

      try {
        const content =
          typeof activity.content === "string"
            ? JSON.parse(activity.content)
            : activity.content;

        console.log(`   Content keys: ${Object.keys(content).join(", ")}`);

        if (content.items || content.categories) {
          console.log("   ❌ OLD FORMAT DETECTED! Has items/categories");
        }

        if (content.blocks && content.correctOrder) {
          console.log("   ✅ NEW FORMAT: Has blocks/correctOrder");
          console.log(`   Blocks count: ${content.blocks?.length || 0}`);
          console.log(
            `   CorrectOrder: ${JSON.stringify(content.correctOrder)}`
          );
        }
      } catch (error) {
        console.log(
          `   ❌ Error parsing content: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  debugDragDrop();
}
