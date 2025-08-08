const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkVariablesLesson() {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { slug: "variables" },
    });

    if (lesson) {
      console.log("=== VARIABLES LESSON IN DATABASE ===");
      console.log("Title:", lesson.title);
      console.log("Duration:", lesson.duration);
      console.log("Difficulty:", lesson.difficulty);
      console.log("Diamond Reward:", lesson.diamondReward);
      console.log("Experience Reward:", lesson.experienceReward);
      console.log("Description:", lesson.description.substring(0, 100) + "...");

      const content =
        typeof lesson.content === "string"
          ? JSON.parse(lesson.content)
          : lesson.content;
      console.log("Content sections:", Object.keys(content.sections || {}));
      console.log("============================");
    } else {
      console.log("Variables lesson not found in database");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkVariablesLesson();
