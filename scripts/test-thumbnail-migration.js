const { PrismaClient } = require("@prisma/client");
const fs = require("fs").promises;
const path = require("path");

const prisma = new PrismaClient();

async function testThumbnailMigration() {
  console.log("🧪 Testing thumbnail migration results...\n");

  try {
    // Check category thumbs directories
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const categoriesDir = path.join(uploadsDir, "categories");

    const categories = [
      "anime-collection",
      "star-collection",
      "car-collection",
    ];

    for (const category of categories) {
      const thumbsDir = path.join(categoriesDir, category, "thumbs");

      try {
        const thumbFiles = await fs.readdir(thumbsDir);
        console.log(
          `📁 ${category}/thumbs/: ${thumbFiles.length} thumbnail files`
        );
      } catch (error) {
        console.log(`❌ Could not read ${category}/thumbs/ directory`);
      }
    }

    // Check remaining files in old thumbs directory
    const oldThumbsDir = path.join(uploadsDir, "thumbs");
    try {
      const remainingThumbs = await fs.readdir(oldThumbsDir);
      console.log(
        `\n📁 Old /uploads/thumbs/: ${remainingThumbs.length} remaining files`
      );

      if (remainingThumbs.length > 0) {
        console.log("First 10 remaining files:");
        remainingThumbs.slice(0, 10).forEach((file) => {
          console.log(`  - ${file}`);
        });
      }
    } catch (error) {
      console.log("\n✅ Old thumbs directory is empty or removed");
    }

    // Check database thumbnail URLs
    const cardsWithThumbnails = await prisma.card.findMany({
      where: {
        thumbnailUrl: { not: null },
      },
      select: {
        id: true,
        name: true,
        category: true,
        thumbnailUrl: true,
      },
    });

    let categoryBasedThumbnails = 0;
    let oldFormatThumbnails = 0;

    cardsWithThumbnails.forEach((card) => {
      if (
        card.thumbnailUrl &&
        card.thumbnailUrl.includes("/uploads/categories/")
      ) {
        categoryBasedThumbnails++;
      } else if (
        card.thumbnailUrl &&
        card.thumbnailUrl.includes("/uploads/thumbs/")
      ) {
        oldFormatThumbnails++;
      }
    });

    console.log(`\n📊 Database thumbnail URL analysis:`);
    console.log(`✅ Category-based thumbnails: ${categoryBasedThumbnails}`);
    console.log(`⚠️  Old format thumbnails: ${oldFormatThumbnails}`);
    console.log(
      `📁 Total cards with thumbnails: ${cardsWithThumbnails.length}`
    );

    if (oldFormatThumbnails > 0) {
      console.log("\nCards still using old thumbnail format:");
      cardsWithThumbnails
        .filter(
          (card) =>
            card.thumbnailUrl && card.thumbnailUrl.includes("/uploads/thumbs/")
        )
        .slice(0, 5)
        .forEach((card) => {
          console.log(`  - ${card.name}: ${card.thumbnailUrl}`);
        });
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  testThumbnailMigration();
}

module.exports = { testThumbnailMigration };
