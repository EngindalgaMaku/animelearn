const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function normalizeCategories() {
  try {
    console.log("Starting category normalization...");

    // Get all cards with categories
    const cards = await prisma.card.findMany({
      where: {
        category: {
          not: null,
        },
      },
      select: {
        id: true,
        category: true,
      },
    });

    console.log(`Found ${cards.length} cards with categories`);

    let updateCount = 0;

    for (const card of cards) {
      const currentCategory = card.category;
      let normalizedCategory = null;

      if (currentCategory) {
        const lowerCategory = currentCategory.toLowerCase().trim();

        // Normalize to standard categories
        if (lowerCategory === "anime" || lowerCategory.includes("anime")) {
          normalizedCategory = "anime";
        } else if (lowerCategory === "cars" || lowerCategory.includes("car")) {
          normalizedCategory = "cars";
        }

        // Only update if the category needs normalization
        if (normalizedCategory && normalizedCategory !== currentCategory) {
          await prisma.card.update({
            where: { id: card.id },
            data: { category: normalizedCategory },
          });

          console.log(
            `Updated card ${card.id}: "${currentCategory}" -> "${normalizedCategory}"`
          );
          updateCount++;
        }
      }
    }

    console.log(`✅ Category normalization completed!`);
    console.log(`📊 Updated ${updateCount} cards`);

    // Show final category distribution
    const finalCategories = await prisma.card.groupBy({
      by: ["category"],
      _count: {
        id: true,
      },
      where: {
        category: {
          not: null,
        },
      },
    });

    console.log("\n📈 Final category distribution:");
    finalCategories.forEach((group) => {
      console.log(`  ${group.category}: ${group._count.id} cards`);
    });
  } catch (error) {
    console.error("❌ Error normalizing categories:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the normalization
normalizeCategories();
