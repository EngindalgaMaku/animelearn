import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testUrls() {
  try {
    console.log("🔍 Testing algorithm challenge URLs...");

    const challenges = await prisma.codeArena.findMany({
      select: {
        title: true,
        slug: true,
      },
    });

    console.log("\n📋 Available algorithm challenges:");
    challenges.forEach((challenge) => {
      console.log(`✅ ${challenge.title}`);
      console.log(`   URL: http://localhost:3000/code-arena/${challenge.slug}`);
      console.log("");
    });

    // Find the sorting visualizer specifically
    const sortingChallenge = challenges.find(
      (c) =>
        c.title.toLowerCase().includes("bubble") ||
        c.title.toLowerCase().includes("sort")
    );

    if (sortingChallenge) {
      console.log("🎯 SORTING ALGORITHM VISUALIZER FOUND!");
      console.log(`   Title: ${sortingChallenge.title}`);
      console.log(
        `   URL: http://localhost:3000/code-arena/${sortingChallenge.slug}`
      );
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testUrls();
