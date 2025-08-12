const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkUserCards() {
  try {
    // Check for anime cards
    const animeCards = await prisma.card.findMany({
      where: {
        OR: [
          { series: { contains: "anime", mode: "insensitive" } },
          { category: { contains: "anime", mode: "insensitive" } },
          { imageUrl: { contains: "anime-collection" } },
        ],
      },
      take: 5,
    });

    console.log("Anime cards found:", animeCards.length);
    animeCards.forEach((card) => {
      console.log("- Name:", card.name || card.cardTitle);
      console.log("  Image URL:", card.imageUrl);
      console.log("  Series:", card.series);
      console.log("  Category:", card.category);
      console.log("");
    });

    // Check user cards
    const userCards = await prisma.userCard.findMany({
      include: { card: true },
      take: 5,
    });

    console.log("User cards found:", userCards.length);
    userCards.forEach((uc) => {
      console.log("- Card:", uc.card.name || uc.card.cardTitle);
      console.log("  Image URL:", uc.card.imageUrl);
      console.log("  User ID:", uc.userId);
      console.log("");
    });

    // Check if files exist
    if (userCards.length > 0) {
      const fs = require("fs");
      const path = require("path");

      console.log("Checking if image files exist:");
      for (const uc of userCards.slice(0, 3)) {
        const imageUrl = uc.card.imageUrl;
        if (imageUrl) {
          const filePath = path.join(process.cwd(), "public", imageUrl);
          const exists = fs.existsSync(filePath);
          console.log(`- ${imageUrl}: ${exists ? "EXISTS" : "MISSING"}`);
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserCards();
