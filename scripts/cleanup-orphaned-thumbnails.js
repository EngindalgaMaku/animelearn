const { PrismaClient } = require("@prisma/client");
const fs = require("fs").promises;
const path = require("path");

const prisma = new PrismaClient();

async function cleanupOrphanedThumbnails() {
  console.log("🧹 Starting cleanup of orphaned thumbnails...\n");

  try {
    // Get all current cards with their file information
    const cards = await prisma.card.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        thumbnailUrl: true,
        imageUrl: true,
        imagePath: true,
        fileName: true,
      },
    });

    console.log(`📊 Found ${cards.length} cards in database\n`);

    // Get all thumbnail files in old directory
    const oldThumbsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "thumbs"
    );
    let thumbnailFiles = [];

    try {
      thumbnailFiles = await fs.readdir(oldThumbsDir);
      console.log(
        `📁 Found ${thumbnailFiles.length} thumbnail files in old directory\n`
      );
    } catch (error) {
      console.log("❌ Could not read old thumbs directory:", error.message);
      return;
    }

    // Create sets for quick lookup
    const cardFileNames = new Set();
    const cardThumbnailNames = new Set();

    cards.forEach((card) => {
      if (card.fileName) {
        cardFileNames.add(card.fileName);
        // Also add potential thumbnail name
        const thumbName = `thumb_${card.fileName}`;
        cardThumbnailNames.add(thumbName);
      }
      if (card.thumbnailUrl) {
        const thumbFileName = path.basename(card.thumbnailUrl);
        cardThumbnailNames.add(thumbFileName);
      }
      if (card.imageUrl) {
        const imageFileName = path.basename(card.imageUrl);
        cardFileNames.add(imageFileName);
        // Also add potential thumbnail name
        const thumbName = `thumb_${imageFileName}`;
        cardThumbnailNames.add(thumbName);
      }
    });

    let moved = 0;
    let orphaned = 0;
    let errors = 0;

    // Process each thumbnail file
    for (const thumbnailFile of thumbnailFiles) {
      try {
        const fullThumbnailPath = path.join(oldThumbsDir, thumbnailFile);

        // Check if this thumbnail belongs to an existing card
        let belongsToCard = null;

        // Method 1: Direct thumbnail name match
        if (cardThumbnailNames.has(thumbnailFile)) {
          belongsToCard = cards.find(
            (card) =>
              card.thumbnailUrl &&
              path.basename(card.thumbnailUrl) === thumbnailFile
          );
        }

        // Method 2: Extract original filename from thumbnail name
        if (!belongsToCard && thumbnailFile.startsWith("thumb_")) {
          const originalFileName = thumbnailFile.replace("thumb_", "");
          belongsToCard = cards.find(
            (card) =>
              card.fileName === originalFileName ||
              (card.imageUrl &&
                path.basename(card.imageUrl) === originalFileName)
          );
        }

        // Method 3: Try to match by UUID pattern
        if (!belongsToCard) {
          const uuidMatch = thumbnailFile.match(/([a-f0-9-]{36})/);
          if (uuidMatch) {
            const uuid = uuidMatch[1];
            belongsToCard = cards.find(
              (card) =>
                (card.fileName && card.fileName.includes(uuid)) ||
                (card.imageUrl && card.imageUrl.includes(uuid)) ||
                (card.imagePath && card.imagePath.includes(uuid))
            );
          }
        }

        if (belongsToCard) {
          // Map category names to slugs
          const categoryMapping = {
            anime: "anime-collection",
            "anime-collection": "anime-collection",
            car: "car-collection",
            "car-collection": "car-collection",
            star: "star-collection",
            "star-collection": "star-collection",
          };

          const categorySlug =
            categoryMapping[belongsToCard.category] ||
            belongsToCard.category ||
            "anime-collection";

          // Create new thumbnail path
          const newThumbnailDir = path.join(
            process.cwd(),
            "public",
            "uploads",
            "categories",
            categorySlug,
            "thumbs"
          );
          const newThumbnailPath = path.join(newThumbnailDir, thumbnailFile);
          const newThumbnailUrl = `/uploads/categories/${categorySlug}/thumbs/${thumbnailFile}`;

          // Create directory if it doesn't exist
          await fs.mkdir(newThumbnailDir, { recursive: true });

          // Check if file already exists in destination
          try {
            await fs.access(newThumbnailPath);
            console.log(
              `⚠️  Thumbnail already exists in category: ${thumbnailFile}`
            );
            // Remove old file
            await fs.unlink(fullThumbnailPath);
          } catch (error) {
            // File doesn't exist, move it
            await fs.rename(fullThumbnailPath, newThumbnailPath);
          }

          // Update database if needed
          if (
            !belongsToCard.thumbnailUrl ||
            belongsToCard.thumbnailUrl.includes("/uploads/thumbs/")
          ) {
            await prisma.card.update({
              where: { id: belongsToCard.id },
              data: { thumbnailUrl: newThumbnailUrl },
            });
          }

          console.log(`✅ Moved thumbnail for card: ${belongsToCard.name}`);
          console.log(`   File: ${thumbnailFile} -> ${categorySlug}/thumbs/`);
          moved++;
        } else {
          console.log(`🗑️  Orphaned thumbnail: ${thumbnailFile}`);

          // Remove orphaned file
          await fs.unlink(fullThumbnailPath);
          orphaned++;
        }
      } catch (error) {
        console.error(`❌ Error processing ${thumbnailFile}:`, error.message);
        errors++;
      }
    }

    // Try to remove old thumbs directory if empty
    try {
      const remainingFiles = await fs.readdir(oldThumbsDir);
      if (remainingFiles.length === 0) {
        await fs.rmdir(oldThumbsDir);
        console.log("\n🗑️  Removed empty old thumbs directory");
      } else {
        console.log(
          `\n⚠️  ${remainingFiles.length} files still remain in old thumbs directory`
        );
      }
    } catch (error) {
      console.log(
        "\n⚠️  Could not remove old thumbs directory:",
        error.message
      );
    }

    console.log("\n📊 Cleanup Summary:");
    console.log(`✅ Moved to categories: ${moved} thumbnails`);
    console.log(`🗑️  Removed orphaned: ${orphaned} thumbnails`);
    console.log(`❌ Errors: ${errors} thumbnails`);
    console.log(`📁 Total processed: ${thumbnailFiles.length} files`);

    console.log("\n🎉 Thumbnail cleanup completed!");
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  cleanupOrphanedThumbnails();
}

module.exports = { cleanupOrphanedThumbnails };
