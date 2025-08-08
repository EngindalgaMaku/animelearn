import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateCardPrices() {
  console.log("🔄 Updating all card prices to 1/4 of original...");

  try {
    // Get all cards with their current prices
    const cards = await prisma.card.findMany({
      where: {
        diamondPrice: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
        diamondPrice: true,
      },
    });

    console.log(`📊 Found ${cards.length} cards with prices`);

    // Update each card's price to 1/4
    for (const card of cards) {
      if (card.diamondPrice) {
        const newPrice = Math.max(1, Math.round(card.diamondPrice / 4));

        await prisma.card.update({
          where: { id: card.id },
          data: { diamondPrice: newPrice },
        });

        console.log(
          `✅ ${card.name}: ${card.diamondPrice} → ${newPrice} diamonds`
        );
      }
    }

    console.log("🎉 All card prices updated successfully!");

    // Show summary statistics
    const updatedStats = await prisma.card.aggregate({
      where: { isPurchasable: true, isAnalyzed: true },
      _count: { id: true },
      _min: { diamondPrice: true },
      _max: { diamondPrice: true },
      _avg: { diamondPrice: true },
    });

    console.log("\n📈 New Price Statistics:");
    console.log(`  Min Price: ${updatedStats._min.diamondPrice} diamonds`);
    console.log(`  Max Price: ${updatedStats._max.diamondPrice} diamonds`);
    console.log(
      `  Avg Price: ${Math.round(updatedStats._avg.diamondPrice || 0)} diamonds`
    );
    console.log(`  Total Cards: ${updatedStats._count.id}`);
  } catch (error) {
    console.error("❌ Error updating card prices:", error);
    process.exit(1);
  }
}

updateCardPrices()
  .catch((e) => {
    console.error("❌ Script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
