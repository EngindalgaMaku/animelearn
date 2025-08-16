const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkPythonTips() {
  try {
    console.log("🔍 Checking Python tips...");

    const tips = await prisma.pythonTip.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    console.log(`Found ${tips.length} Python tips`);

    if (tips.length > 0) {
      console.log("\n=== Sample tip data ===");
      const tip = tips[0];
      console.log(`Title: ${tip.title}`);
      console.log(`Tags field: "${tip.tags}"`);
      console.log(`Tags type: ${typeof tip.tags}`);
      console.log(`Category: ${tip.category?.name || "No category"}`);

      // Try parsing tags
      try {
        const parsed = JSON.parse(tip.tags);
        console.log("✅ Tags parse successfully:", parsed);
      } catch (error) {
        console.log("❌ Tags parse error:", error.message);
        console.log("Raw tags value:", JSON.stringify(tip.tags));
      }
    }

    const categories = await prisma.pythonTipCategory.findMany();
    console.log(`\nFound ${categories.length} Python tip categories`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPythonTips();
