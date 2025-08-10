import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkRecovery() {
  try {
    console.log("🔍 Checking database recovery status...");

    // Check if CodeArena table exists and has data
    const codeArenaCount = await prisma.codeArena.count();
    console.log(`📊 CodeArena challenges found: ${codeArenaCount}`);

    if (codeArenaCount > 0) {
      // Check for the specific sorting algorithm visualizer
      const sortingAlgorithm = await prisma.codeArena.findFirst({
        where: {
          title: {
            contains: "Sorting",
          },
        },
      });

      if (sortingAlgorithm) {
        console.log(`✅ Found sorting algorithm: "${sortingAlgorithm.title}"`);
        console.log(`🔗 URL: /code-arena/${sortingAlgorithm.slug}`);
      } else {
        console.log("❌ Sorting algorithm visualizer not found");
      }
    }

    // Check users
    const userCount = await prisma.user.count();
    console.log(`👥 Users found: ${userCount}`);

    // Check learning activities
    const activityCount = await prisma.learningActivity.count();
    console.log(`🎓 Learning activities found: ${activityCount}`);

    console.log("\n🎯 Recovery Summary:");
    console.log(
      `- Database seeding: ${codeArenaCount > 0 ? "✅ SUCCESS" : "❌ FAILED"}`
    );
    console.log(
      `- Sorting visualizer: ${codeArenaCount > 0 ? "✅ RESTORED" : "❌ MISSING"}`
    );
    console.log(`- User data: ${userCount > 0 ? "✅ RESTORED" : "❌ MISSING"}`);
  } catch (error) {
    console.error("❌ Error checking recovery:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecovery();
