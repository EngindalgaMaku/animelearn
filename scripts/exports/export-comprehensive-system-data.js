const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function exportComprehensiveSystemData() {
  try {
    console.log("🚀 Starting comprehensive system data export...");

    // Export core system data that's missing from backup
    console.log("📦 Exporting Categories...");
    const categories = await prisma.category.findMany();

    console.log("💎 Exporting Rarities...");
    const rarities = await prisma.rarity.findMany();

    console.log("⚡ Exporting Elements...");
    const elements = await prisma.element.findMany();

    console.log("🎨 Exporting Card Styles...");
    const cardStyles = await prisma.cardStyle.findMany();

    console.log("🔶 Exporting Card Rarities...");
    const cardRarities = await prisma.cardRarity.findMany();

    console.log("💳 Exporting Diamond Packages...");
    const diamondPackages = await prisma.diamondPackage.findMany();

    // Export blog data
    console.log("📝 Exporting Blog Posts...");
    const blogPosts = await prisma.blogPost.findMany({
      include: {
        interactions: true,
        authorUser: true,
      },
    });

    // Export Python tips comprehensive data
    console.log("🐍 Exporting Python Tip Categories...");
    const pythonTipCategories = await prisma.pythonTipCategory.findMany({
      include: {
        tips: true,
      },
    });

    console.log("💡 Exporting Python Tips...");
    const pythonTips = await prisma.pythonTip.findMany({
      include: {
        category: true,
        interactions: true,
        feedback: true,
        dailyTips: true,
      },
    });

    console.log("📅 Exporting Daily Python Tips...");
    const dailyPythonTips = await prisma.dailyPythonTip.findMany({
      include: {
        tip: true,
      },
    });

    // Create comprehensive backup data structure
    const backupData = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        exportType: "COMPREHENSIVE_SYSTEM_BACKUP",
        version: "3.0.0",
        description:
          "Complete system backup including all core components for full recovery",
      },

      // Core system components (as per SYSTEM_RECOVERY.md)
      systemData: {
        categories,
        rarities,
        elements,
        cardStyles,
        cardRarities,
        diamondPackages,
      },

      // Content data
      contentData: {
        blogPosts,
        pythonTipCategories,
        pythonTips,
        dailyPythonTips,
      },

      // Statistics summary
      summary: {
        categories: categories.length,
        rarities: rarities.length,
        elements: elements.length,
        cardStyles: cardStyles.length,
        cardRarities: cardRarities.length,
        diamondPackages: diamondPackages.length,
        blogPosts: blogPosts.length,
        pythonTipCategories: pythonTipCategories.length,
        pythonTips: pythonTips.length,
        dailyPythonTips: dailyPythonTips.length,
        totalRecords:
          categories.length +
          rarities.length +
          elements.length +
          cardStyles.length +
          cardRarities.length +
          diamondPackages.length +
          blogPosts.length +
          pythonTipCategories.length +
          pythonTips.length +
          dailyPythonTips.length,
      },
    };

    // Write comprehensive backup file
    const fileName = `comprehensive-system-backup-${new Date().toISOString().split("T")[0]}.json`;
    fs.writeFileSync(fileName, JSON.stringify(backupData, null, 2));

    // Log summary
    console.log("\n✅ COMPREHENSIVE SYSTEM DATA EXPORT COMPLETE!");
    console.log("📊 Summary:");
    console.log(`├── Categories: ${categories.length}`);
    console.log(`├── Rarities: ${rarities.length}`);
    console.log(`├── Elements: ${elements.length}`);
    console.log(`├── Card Styles: ${cardStyles.length}`);
    console.log(`├── Card Rarities: ${cardRarities.length}`);
    console.log(`├── Diamond Packages: ${diamondPackages.length}`);
    console.log(`├── Blog Posts: ${blogPosts.length}`);
    console.log(`├── Python Tip Categories: ${pythonTipCategories.length}`);
    console.log(`├── Python Tips: ${pythonTips.length}`);
    console.log(`├── Daily Python Tips: ${dailyPythonTips.length}`);
    console.log(`└── Total Records: ${backupData.summary.totalRecords}`);
    console.log(`\n💾 Exported to: ${fileName}`);

    // Log missing system components
    const missingComponents = [];
    if (categories.length === 0) missingComponents.push("Categories");
    if (rarities.length === 0) missingComponents.push("Rarities");
    if (elements.length === 0) missingComponents.push("Elements");
    if (cardStyles.length === 0) missingComponents.push("Card Styles");
    if (diamondPackages.length === 0)
      missingComponents.push("Diamond Packages");
    if (blogPosts.length === 0) missingComponents.push("Blog Posts");
    if (pythonTips.length === 0) missingComponents.push("Python Tips");

    if (missingComponents.length > 0) {
      console.log("\n⚠️  MISSING SYSTEM COMPONENTS:");
      missingComponents.forEach((component) => {
        console.log(`   ❌ ${component}`);
      });
      console.log("\n💡 Run the main seed script to populate missing data:");
      console.log("   node scripts/seed-all-admin-data.js");
    } else {
      console.log("\n🎉 ALL CORE SYSTEM COMPONENTS ARE PRESENT!");
    }
  } catch (error) {
    console.error("❌ Error exporting comprehensive system data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the export
exportComprehensiveSystemData().catch(console.error);
