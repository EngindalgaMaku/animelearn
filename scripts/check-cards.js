const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkCards() {
  try {
    console.log("Checking database cards...\n");

    // Toplam kart sayısı
    const totalCards = await prisma.card.count();
    console.log(`Total cards in database: ${totalCards}`);

    // Son eklenen 10 kartı al
    const recentCards = await prisma.card.findMany({
      orderBy: { uploadDate: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        cardTitle: true,
        imageUrl: true,
        imagePath: true,
        fileName: true,
        uploadDate: true,
        isAnalyzed: true,
      },
    });

    console.log("\nRecent 10 cards:");
    recentCards.forEach((card, index) => {
      console.log(`${index + 1}. ${card.cardTitle || card.name || "Unnamed"}`);
      console.log(`   ID: ${card.id}`);
      console.log(`   Image URL: ${card.imageUrl}`);
      console.log(`   File Name: ${card.fileName}`);
      console.log(`   Upload Date: ${card.uploadDate}`);
      console.log(`   Is Analyzed: ${card.isAnalyzed}`);
      console.log("");
    });

    // Analiz durumu
    const analyzedCount = await prisma.card.count({
      where: { isAnalyzed: true },
    });
    const pendingCount = await prisma.card.count({
      where: { isAnalyzed: false },
    });

    console.log(`Analyzed cards: ${analyzedCount}`);
    console.log(`Pending analysis: ${pendingCount}`);
  } catch (error) {
    console.error("Error checking cards:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCards();
