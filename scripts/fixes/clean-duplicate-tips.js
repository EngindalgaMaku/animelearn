const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function cleanDuplicateTips() {
  try {
    console.log("🧹 Duplicate Python Tips Temizliği Başlıyor...\n");

    // Tüm tips'leri title'a göre grupla
    const allTips = await prisma.pythonTip.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    console.log(`📊 Temizlik Öncesi: ${allTips.length} tips\n`);

    // Title bazlı gruplar oluştur
    const titleGroups = new Map();

    allTips.forEach((tip) => {
      if (!titleGroups.has(tip.title)) {
        titleGroups.set(tip.title, []);
      }
      titleGroups.get(tip.title).push(tip);
    });

    // Duplicate'leri bul ve sil
    let duplicatesFound = 0;
    let duplicatesDeleted = 0;
    const toDelete = [];

    for (const [title, tips] of titleGroups) {
      if (tips.length > 1) {
        duplicatesFound += tips.length - 1;

        console.log(`🔍 "${title}" için ${tips.length} kopya bulundu:`);

        // En eskisini koru, diğerlerini sil
        const [keepTip, ...deleteTips] = tips;
        console.log(
          `   ✅ Korunacak: ${keepTip.id} (${new Date(keepTip.createdAt).toLocaleString()})`
        );

        deleteTips.forEach((tip) => {
          console.log(
            `   ❌ Silinecek: ${tip.id} (${new Date(tip.createdAt).toLocaleString()})`
          );
          toDelete.push(tip.id);
        });
        console.log();
      }
    }

    console.log(`📋 Özet:`);
    console.log(`   - Toplam duplicate: ${duplicatesFound}`);
    console.log(`   - Silinecek: ${toDelete.length}`);
    console.log(`   - Kalacak: ${allTips.length - toDelete.length}\n`);

    if (toDelete.length > 0) {
      console.log("🗑️ Duplicateler siliniyor...");

      // Batch delete
      const deleteResult = await prisma.pythonTip.deleteMany({
        where: {
          id: {
            in: toDelete,
          },
        },
      });

      duplicatesDeleted = deleteResult.count;
      console.log(`✅ ${duplicatesDeleted} duplicate tip silindi\n`);
    }

    // Final count
    const finalCount = await prisma.pythonTip.count();
    console.log(`📊 Temizlik Sonrası: ${finalCount} tips`);
    console.log(`🎉 Temizlik tamamlandı!`);

    // Kategori dağılımı
    const categoryStats = await prisma.pythonTipCategory.findMany({
      select: {
        name: true,
        _count: {
          select: {
            tips: true,
          },
        },
      },
    });

    console.log("\n📊 Temizlik Sonrası Kategori Dağılımı:");
    categoryStats.forEach((cat) => {
      console.log(`   ${cat.name}: ${cat._count.tips} tips`);
    });
  } catch (error) {
    console.error("❌ Hata:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDuplicateTips();
