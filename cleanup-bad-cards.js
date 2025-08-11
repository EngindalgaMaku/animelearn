const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function cleanupBadCards() {
  try {
    console.log("🔍 Starting card cleanup process...");

    // Define criteria for bad cards
    const badCardQueries = [
      {
        name: "Null essential fields",
        where: {
          OR: [
            { name: null },
            { cardTitle: null },
            { series: null },
            { character: null },
            { rarity: null },
          ],
        },
      },
      {
        name: "Empty essential fields",
        where: {
          OR: [
            { name: "" },
            { cardTitle: "" },
            { series: "" },
            { character: "" },
            { rarity: "" },
          ],
        },
      },
      {
        name: "Generic placeholder names",
        where: {
          OR: [
            { name: { contains: "Anime Card", mode: "insensitive" } },
            { cardTitle: { contains: "Anime Card", mode: "insensitive" } },
            { name: { contains: "İsimsiz Kart", mode: "insensitive" } },
            { cardTitle: { contains: "İsimsiz Kart", mode: "insensitive" } },
            { name: { contains: "Unnamed Card", mode: "insensitive" } },
            { cardTitle: { contains: "Unnamed Card", mode: "insensitive" } },
            { name: { contains: "Default Card", mode: "insensitive" } },
            { cardTitle: { contains: "Default Card", mode: "insensitive" } },
            { character: { contains: "Unknown", mode: "insensitive" } },
            { character: { contains: "Anime Character", mode: "insensitive" } },
          ],
        },
      },
      {
        name: "Unanalyzed cards",
        where: {
          isAnalyzed: false,
        },
      },
      {
        name: "Invalid pricing",
        where: {
          OR: [{ diamondPrice: null }, { diamondPrice: 0 }],
        },
      },
    ];

    // First, identify bad cards
    console.log("📊 Analyzing bad cards...");
    const totalCards = await prisma.card.count();
    let totalBadCards = 0;

    for (const query of badCardQueries) {
      const count = await prisma.card.count({ where: query.where });
      console.log(`- ${query.name}: ${count} cards`);
      totalBadCards += count;
    }

    console.log(
      `📊 Total bad cards: ${totalBadCards} out of ${totalCards} cards (${Math.round((totalBadCards / totalCards) * 100)}%)`
    );

    if (totalBadCards === 0) {
      console.log("✅ No bad cards found. Database is clean!");
      return;
    }

    // Proceed with cleanup
    console.log("\n🧹 Starting cleanup...");
    let totalDeleted = 0;

    await prisma.$transaction(async (tx) => {
      for (const query of badCardQueries) {
        // Get cards to delete
        const cardsToDelete = await tx.card.findMany({
          where: query.where,
          select: { id: true, name: true, cardTitle: true, fileName: true },
        });

        if (cardsToDelete.length > 0) {
          console.log(
            `🗑️ Deleting ${cardsToDelete.length} cards from category: ${query.name}`
          );

          // Delete related records first
          await tx.userCard.deleteMany({
            where: { cardId: { in: cardsToDelete.map((c) => c.id) } },
          });

          await tx.analytics.deleteMany({
            where: { cardId: { in: cardsToDelete.map((c) => c.id) } },
          });

          await tx.usedCardNames.deleteMany({
            where: { cardId: { in: cardsToDelete.map((c) => c.id) } },
          });

          // Delete the cards
          const deleteResult = await tx.card.deleteMany({
            where: query.where,
          });

          totalDeleted += deleteResult.count;
          console.log(
            `✅ Deleted ${deleteResult.count} cards from: ${query.name}`
          );

          // Show some examples
          const examples = cardsToDelete
            .map((c) => c.name || c.cardTitle || c.fileName)
            .slice(0, 3)
            .join(", ");
          if (examples) {
            console.log(
              `   Examples: ${examples}${cardsToDelete.length > 3 ? "..." : ""}`
            );
          }
        }
      }
    });

    console.log(`\n🎯 Cleanup completed successfully!`);
    console.log(`📊 Total cards deleted: ${totalDeleted}`);

    // Final stats
    const finalCount = await prisma.card.count();
    console.log(`📊 Remaining cards: ${finalCount}`);
    console.log("✅ Database cleanup finished!");
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupBadCards();
