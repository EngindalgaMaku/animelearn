import { prisma } from "../src/lib/prisma";
import { imageProcessor } from "../src/lib/image-processing";
import path from "path";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";

async function regenerateThumbnails() {
  console.log("🔄 Starting thumbnail regeneration...");

  try {
    // Get all cards with image URLs
    const cards = await prisma.card.findMany({
      where: {
        imageUrl: {
          not: null,
        },
      },
      select: {
        id: true,
        imageUrl: true,
        fileName: true,
      },
    });

    console.log(`📊 Found ${cards.length} cards to process`);

    // Create thumbs directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const thumbsDir = path.join(uploadsDir, "thumbs");
    if (!existsSync(thumbsDir)) {
      await mkdir(thumbsDir, { recursive: true });
    }

    let successCount = 0;
    let errorCount = 0;

    for (const card of cards) {
      try {
        console.log(`🖼️  Processing card: ${card.id}`);

        // Get original image path
        const originalImagePath = path.join(uploadsDir, card.fileName || "");

        if (!existsSync(originalImagePath)) {
          console.warn(`⚠️  Original image not found: ${originalImagePath}`);
          errorCount++;
          continue;
        }

        // Generate new thumbnail filename
        const thumbnailFilename =
          imageProcessor.generateSecureThumbnailFilename(card.fileName || "");
        const thumbnailPath = path.join(thumbsDir, thumbnailFilename);
        const thumbnailUrl = `/uploads/thumbs/${thumbnailFilename}`;

        // Create new thumbnail with correct settings (no crop)
        await imageProcessor.createThumbnail(
          originalImagePath,
          thumbnailPath,
          300
        );

        // Update database with new thumbnail URL
        await prisma.card.update({
          where: { id: card.id },
          data: {
            thumbnailUrl: thumbnailUrl,
          },
        });

        console.log(`✅ Generated thumbnail for card: ${card.id}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error processing card ${card.id}:`, error);
        errorCount++;
      }
    }

    console.log(`\n🎉 Thumbnail regeneration completed!`);
    console.log(`✅ Success: ${successCount} thumbnails`);
    console.log(`❌ Errors: ${errorCount} thumbnails`);
  } catch (error) {
    console.error("💥 Fatal error during thumbnail regeneration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
regenerateThumbnails().catch(console.error);
