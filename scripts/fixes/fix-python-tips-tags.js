const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fixPythonTipsTags() {
  try {
    console.log("🔧 Fixing Python tips tags format...");

    const tips = await prisma.pythonTip.findMany();
    console.log(`Found ${tips.length} Python tips to fix`);

    let fixed = 0;

    for (const tip of tips) {
      if (tip.tags && typeof tip.tags === "string") {
        try {
          // Check if it's already JSON
          JSON.parse(tip.tags);
          console.log(`✅ Tip "${tip.title}" - tags already in JSON format`);
        } catch {
          // Convert string to JSON array
          const tagsArray = tip.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);

          const jsonTags = JSON.stringify(tagsArray);

          await prisma.pythonTip.update({
            where: { id: tip.id },
            data: { tags: jsonTags },
          });

          console.log(
            `🔧 Fixed tip "${tip.title}": "${tip.tags}" → ${jsonTags}`
          );
          fixed++;
        }
      }

      // Fix prerequisites if exists
      if (tip.prerequisites && typeof tip.prerequisites === "string") {
        try {
          JSON.parse(tip.prerequisites);
        } catch {
          const prereqArray = tip.prerequisites
            .split(",")
            .map((prereq) => prereq.trim())
            .filter((prereq) => prereq.length > 0);

          await prisma.pythonTip.update({
            where: { id: tip.id },
            data: { prerequisites: JSON.stringify(prereqArray) },
          });
        }
      }

      // Fix relatedTips if exists
      if (tip.relatedTips && typeof tip.relatedTips === "string") {
        try {
          JSON.parse(tip.relatedTips);
        } catch {
          const relatedArray = tip.relatedTips
            .split(",")
            .map((related) => related.trim())
            .filter((related) => related.length > 0);

          await prisma.pythonTip.update({
            where: { id: tip.id },
            data: { relatedTips: JSON.stringify(relatedArray) },
          });
        }
      }
    }

    console.log(`\n✅ Fixed ${fixed} Python tips with invalid tags format`);
    console.log("🎉 All Python tips now have proper JSON formatting!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPythonTipsTags();
