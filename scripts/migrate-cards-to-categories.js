const { PrismaClient } = require("@prisma/client");
const fs = require("fs").promises;
const path = require("path");

const prisma = new PrismaClient();

async function migrateCardsToCategories(dryRun = true) {
  try {
    console.log(
      dryRun
        ? "🔍 DRY RUN - Kartların taşınması simüle ediliyor..."
        : "🚀 Kartlar kategorilerine taşınıyor..."
    );

    // Tüm kartları getir
    const cards = await prisma.card.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        imagePath: true,
        imageUrl: true,
        fileName: true,
        thumbnailUrl: true,
      },
      orderBy: { category: "asc" },
    });

    console.log(`\n💾 Toplam ${cards.length} kart taşınacak`);

    const results = {
      moved: 0,
      failed: 0,
      skipped: 0,
      errors: [],
    };

    for (const card of cards) {
      try {
        // Kategori slug'ını belirle
        let categorySlug = card.category;
        if (!categorySlug || categorySlug === "anime") {
          categorySlug = "anime-collection"; // Default kategori
        }

        // Mevcut dosya yolu
        const currentImagePath = card.imagePath || card.imageUrl;
        if (!currentImagePath) {
          console.log(`⚠️ ${card.name} - Dosya yolu bulunamadı`);
          results.skipped++;
          continue;
        }

        // Tam dosya yolu
        const fullCurrentPath = path.join(
          process.cwd(),
          "public",
          currentImagePath.replace(/^\//, "")
        );

        // Dosya mevcut mu kontrol et
        try {
          await fs.access(fullCurrentPath);
        } catch {
          console.log(`⚠️ ${card.name} - Dosya bulunamadı: ${fullCurrentPath}`);
          results.skipped++;
          continue;
        }

        // Yeni dosya yolu
        const newImagePath = `/uploads/categories/${categorySlug}/${card.fileName}`;
        const fullNewPath = path.join(
          process.cwd(),
          "public",
          newImagePath.replace(/^\//, "")
        );

        // Eğer dosya zaten doğru yerdeyse atla
        if (currentImagePath === newImagePath) {
          results.skipped++;
          continue;
        }

        console.log(`📁 ${card.name}: ${currentImagePath} -> ${newImagePath}`);

        if (!dryRun) {
          // Dosyayı taşı
          try {
            await fs.copyFile(fullCurrentPath, fullNewPath);

            // Thumbnail varsa onu da taşı
            if (card.thumbnailUrl) {
              const currentThumbPath = path.join(
                process.cwd(),
                "public",
                card.thumbnailUrl.replace(/^\//, "")
              );
              const newThumbPath = path.join(
                process.cwd(),
                "public",
                card.thumbnailUrl
                  .replace(/^\//, "")
                  .replace("/thumbs/", `/categories/${categorySlug}/thumbs/`)
              );

              // Thumb dizini oluştur
              await fs.mkdir(path.dirname(newThumbPath), { recursive: true });

              try {
                await fs.access(currentThumbPath);
                await fs.copyFile(currentThumbPath, newThumbPath);
              } catch {
                // Thumbnail yoksa sorun değil
              }
            }

            // Veritabanını güncelle
            await prisma.card.update({
              where: { id: card.id },
              data: {
                imagePath: newImagePath,
                imageUrl: newImagePath,
                thumbnailUrl: card.thumbnailUrl
                  ? card.thumbnailUrl.replace(
                      "/thumbs/",
                      `/categories/${categorySlug}/thumbs/`
                    )
                  : null,
              },
            });

            // Eski dosyayı sil
            try {
              await fs.unlink(fullCurrentPath);
              if (card.thumbnailUrl) {
                const currentThumbPath = path.join(
                  process.cwd(),
                  "public",
                  card.thumbnailUrl.replace(/^\//, "")
                );
                await fs.unlink(currentThumbPath);
              }
            } catch {
              // Eski dosya silinemezse sorun değil
            }

            console.log(`✅ ${card.name} başarıyla taşındı`);
          } catch (error) {
            console.error(`❌ ${card.name} taşınamadı:`, error.message);
            results.errors.push(`${card.name}: ${error.message}`);
            results.failed++;
            continue;
          }
        }

        results.moved++;
      } catch (error) {
        console.error(`❌ ${card.name} işlenemedi:`, error.message);
        results.errors.push(`${card.name}: ${error.message}`);
        results.failed++;
      }
    }

    console.log("\n📊 Taşıma Özeti:");
    console.log(`✅ Taşındı: ${results.moved}`);
    console.log(`⚠️ Atlandı: ${results.skipped}`);
    console.log(`❌ Başarısız: ${results.failed}`);

    if (results.errors.length > 0) {
      console.log("\n❌ Hatalar:");
      results.errors.forEach((error) => console.log(`  - ${error}`));
    }

    if (dryRun) {
      console.log(
        "\n⚠️ Bu bir DRY RUN idi. Gerçek taşıma için scripts/migrate-cards-to-categories.js dosyasını dryRun=false ile çalıştırın."
      );
    } else {
      console.log("\n🎉 Kart taşıma işlemi tamamlandı!");
    }

    return results;
  } catch (error) {
    console.error("❌ Ana taşıma hatası:", error);
    throw error;
  }
}

async function createThumbDirectories() {
  try {
    console.log("📁 Thumbnail dizinleri oluşturuluyor...");

    const categories = [
      "anime-collection",
      "car-collection",
      "star-collection",
    ];

    for (const category of categories) {
      const thumbDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "categories",
        category,
        "thumbs"
      );
      await fs.mkdir(thumbDir, { recursive: true });
      console.log(
        `✅ Thumbnail dizini: /uploads/categories/${category}/thumbs`
      );
    }
  } catch (error) {
    console.error("❌ Thumbnail dizini oluşturma hatası:", error);
  }
}

async function main() {
  try {
    await createThumbDirectories();

    // Önce dry run yap
    console.log("\n=== DRY RUN ===");
    await migrateCardsToCategories(true);

    console.log("\n🤔 Gerçek taşıma işlemini başlatmak istiyor musunuz?");
    console.log(
      "Devam etmek için: node scripts/migrate-cards-to-categories.js --execute"
    );

    // Eğer --execute parametresi varsa gerçek taşımayı yap
    if (process.argv.includes("--execute")) {
      console.log("\n=== GERÇEK TAŞIMA ===");
      await migrateCardsToCategories(false);
    }
  } catch (error) {
    console.error("❌ Ana süreç hatası:", error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = { migrateCardsToCategories, createThumbDirectories };
