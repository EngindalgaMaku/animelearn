const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function exportCodeArenaData() {
  try {
    console.log("💻 Starting Code Arena data export...\n");

    // Export Code Arenas
    console.log("🏟️ Exporting Code Arenas...");
    const codeArenas = await prisma.codeArena.findMany({
      orderBy: { createdAt: "asc" },
    });
    console.log(`✅ Found ${codeArenas.length} code arenas`);

    // Export Code Arena Progress (if any exist)
    console.log("\n📈 Exporting Code Arena Progress...");
    const codeArenaProgress = await prisma.codeArenaProgress.findMany({
      orderBy: { startedAt: "asc" },
    });
    console.log(`✅ Found ${codeArenaProgress.length} progress records`);

    // Export Code Submissions (if any exist)
    console.log("\n📝 Exporting Code Submissions...");
    const codeSubmissions = await prisma.codeSubmission.findMany({
      orderBy: { submittedAt: "asc" },
    });
    console.log(`✅ Found ${codeSubmissions.length} code submissions`);

    // Prepare export data
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        source: "code-arena-export",
        totalRecords:
          codeArenas.length + codeArenaProgress.length + codeSubmissions.length,
        tables: {
          codeArenas: codeArenas.length,
          codeArenaProgress: codeArenaProgress.length,
          codeSubmissions: codeSubmissions.length,
        },
      },
      data: {
        codeArenas,
        codeArenaProgress,
        codeSubmissions,
      },
    };

    // Write to file
    const fileName = `code-arena-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    const filePath = path.join(__dirname, fileName);

    fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));

    console.log(`\n🎉 Code Arena data exported successfully!`);
    console.log(`📁 File: ${fileName}`);
    console.log(`📊 Total records: ${exportData.metadata.totalRecords}`);
    console.log(`📈 Breakdown:`);
    console.log(`   - Code Arenas: ${codeArenas.length}`);
    console.log(`   - Code Arena Progress: ${codeArenaProgress.length}`);
    console.log(`   - Code Submissions: ${codeSubmissions.length}`);
  } catch (error) {
    console.error("❌ Error exporting code arena data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the export
exportCodeArenaData();
