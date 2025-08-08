const { PrismaClient } = require("@prisma/client");

async function checkCards() {
  const prisma = new PrismaClient();

  try {
    console.log("Checking database cards...\n");

    // Toplam kart sayısı
    const totalCards = await prisma.card.count();
    console.log(`Total cards in database: ${totalCards}`);

    if (totalCards === 0) {
      console.log("No cards found in database!");
      return;
    }

    // Son eklenen kartları al
    const recentCards = await prisma.card.findMany({
      orderBy: { uploadDate: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        cardTitle: true,
        imageUrl: true,
        fileName: true,
        uploadDate: true,
        isAnalyzed: true,
      },
    });

    console.log("\nRecent cards:");
    recentCards.forEach((card, index) => {
      console.log(`${index + 1}. ${card.cardTitle || card.name || "Unnamed"}`);
      console.log(`   File: ${card.fileName}`);
      console.log(`   Date: ${card.uploadDate}`);
      console.log(`   Analyzed: ${card.isAnalyzed}`);
      console.log("");
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCards();
