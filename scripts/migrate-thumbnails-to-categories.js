const { PrismaClient } = require("@prisma/client");
const fs = require("fs").promises;
const path = require("path");

const prisma = new PrismaClient();

async function migrateThumbnailsToCategories() {
  console.log("🔄 Starting thumbnail migration to category directories...\n");

  try {
    // Get all cards with thumbnailUrl
    const cards = await prisma.card.findMany({
      where: {
        thumbnailUrl: {
          not: null,
        },
        category: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
        category: true,
        thumbnailUrl: true,
      },
    });

    console.log(`📊 Found ${cards.length} cards with thumbnails to migrate\n`);

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const card of cards) {
      try {
        // Check if thumbnail is still in old format (/uploads/thumbs/)
        if (!card.thumbnailUrl.includes("/uploads/thumbs/")) {
          console.log(`⏭️  Skipping ${card.name} - already in category format`);
          skipped++;
          continue;
        }

        // Map category names to slugs
        const categoryMapping = {
          anime: "anime-collection",
          "anime-collection": "anime-collection",
          car: "car-collection",
          "car-collection": "car-collection",
          star: "star-collection",
          "star-collection": "star-collection",
        };

        const categorySlug = categoryMapping[card.category] || card.category;

        // Current thumbnail path
        const currentThumbnailPath = path.join(
          process.cwd(),
          "public",
          card.thumbnailUrl
        );

        // Extract thumbnail filename
        const thumbnailFilename = path.basename(card.thumbnailUrl);

        // New thumbnail path in category directory
        const newThumbnailDir = path.join(
          process.cwd(),
          "public",
          "uploads",
          "categories",
          categorySlug,
          "thumbs"
        );
        const newThumbnailPath = path.join(newThumbnailDir, thumbnailFilename);

        // New thumbnail URL
        const newThumbnailUrl = `/uploads/categories/${categorySlug}/thumbs/${thumbnailFilename}`;

        // Check if source file exists
        try {
          await fs.access(currentThumbnailPath);
        } catch (error) {
          console.log(`❌ Thumbnail file not found: ${currentThumbnailPath}`);
          errors++;
          continue;
        }

        // Create category thumbs directory if it doesn't exist
        await fs.mkdir(newThumbnailDir, { recursive: true });

        // Check if destination file already exists
        try {
          await fs.access(newThumbnailPath);
          console.log(
            `⚠️  Thumbnail already exists in category dir: ${newThumbnailPath}`
          );

          // Update database even if file exists
          await prisma.card.update({
            where: { id: card.id },
            data: { thumbnailUrl: newThumbnailUrl },
          });

          // Remove old file
          try {
            await fs.unlink(currentThumbnailPath);
            console.log(`🗑️  Removed old thumbnail: ${currentThumbnailPath}`);
          } catch (error) {
            console.log(
              `⚠️  Could not remove old thumbnail: ${currentThumbnailPath}`
            );
          }

          migrated++;
          continue;
        } catch (error) {
          // File doesn't exist in destination, proceed with move
        }

        // Move thumbnail file
        await fs.rename(currentThumbnailPath, newThumbnailPath);

        // Update database with new thumbnail URL
        await prisma.card.update({
          where: { id: card.id },
          data: { thumbnailUrl: newThumbnailUrl },
        });

        console.log(`✅ Migrated thumbnail: ${card.name}`);
        console.log(`   From: ${card.thumbnailUrl}`);
        console.log(`   To: ${newThumbnailUrl}\n`);

        migrated++;
      } catch (error) {
        console.error(
          `❌ Error migrating thumbnail for card ${card.name}:`,
          error.message
        );
        errors++;
      }
    }

    // Check for leftover thumbnails in old directory
    console.log("\n🔍 Checking for leftover thumbnails in /uploads/thumbs/...");
    const oldThumbsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "thumbs"
    );

    try {
      const leftoverThumbs = await fs.readdir(oldThumbsDir);
      if (leftoverThumbs.length > 0) {
        console.log(
          `⚠️  Found ${leftoverThumbs.length} leftover thumbnails in old directory`
        );
        console.log(
          "These might be orphaned files or from cards not in database"
        );
      } else {
        console.log("✅ No leftover thumbnails found");
      }
    } catch (error) {
      console.log("📁 Old thumbs directory might not exist or is empty");
    }

    console.log("\n📊 Migration Summary:");
    console.log(`✅ Successfully migrated: ${migrated} thumbnails`);
    console.log(`⏭️  Skipped (already migrated): ${skipped} thumbnails`);
    console.log(`❌ Errors: ${errors} thumbnails`);
    console.log(`📁 Total processed: ${cards.length} cards`);

    if (migrated > 0) {
      console.log("\n🎉 Thumbnail migration completed successfully!");
      console.log(
        "All thumbnails are now organized in category-based directories."
      );
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  migrateThumbnailsToCategories();
}

module.exports = { migrateThumbnailsToCategories };
