const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkDuplicateTips() {
  try {
    console.log("🔍 Python Tips Duplicate Kontrolü Başlıyor...\n");

    // Tüm tips'leri getir
    const allTips = await prisma.pythonTip.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        categoryId: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    console.log(`📊 Toplam Tip Sayısı: ${allTips.length}\n`);

    // Title bazlı duplicate kontrol
    const titleMap = new Map();
    const duplicatesByTitle = [];

    allTips.forEach((tip) => {
      if (titleMap.has(tip.title)) {
        duplicatesByTitle.push({
          original: titleMap.get(tip.title),
          duplicate: tip,
        });
      } else {
        titleMap.set(tip.title, tip);
      }
    });

    // Slug bazlı duplicate kontrol
    const slugMap = new Map();
    const duplicatesBySlug = [];

    allTips.forEach((tip) => {
      if (tip.slug && slugMap.has(tip.slug)) {
        duplicatesBySlug.push({
          original: slugMap.get(tip.slug),
          duplicate: tip,
        });
      } else if (tip.slug) {
        slugMap.set(tip.slug, tip);
      }
    });

    // Sonuçları göster
    console.log(`🔄 Title Duplicate'leri: ${duplicatesByTitle.length}`);
    if (duplicatesByTitle.length > 0) {
      console.log("\n📋 Title Duplicate Detayları:");
      duplicatesByTitle.forEach((pair, index) => {
        console.log(`\n${index + 1}. "${pair.duplicate.title}"`);
        console.log(
          `   Original: ${pair.original.id} (${new Date(pair.original.createdAt).toLocaleString()})`
        );
        console.log(
          `   Duplicate: ${pair.duplicate.id} (${new Date(pair.duplicate.createdAt).toLocaleString()})`
        );
      });
    }

    console.log(`\n🔄 Slug Duplicate'leri: ${duplicatesBySlug.length}`);
    if (duplicatesBySlug.length > 0) {
      console.log("\n📋 Slug Duplicate Detayları:");
      duplicatesBySlug.forEach((pair, index) => {
        console.log(`\n${index + 1}. Slug: "${pair.duplicate.slug}"`);
        console.log(
          `   Original: ${pair.original.id} (${new Date(pair.original.createdAt).toLocaleString()})`
        );
        console.log(
          `   Duplicate: ${pair.duplicate.id} (${new Date(pair.duplicate.createdAt).toLocaleString()})`
        );
      });
    }

    // Kategori bazlı dağılım
    const categoryCount = {};
    allTips.forEach((tip) => {
      const categoryName = tip.category?.name || "Unknown";
      categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
    });

    console.log("\n📊 Kategori Dağılımı:");
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} tips`);
    });

    // Tarih bazlı analiz
    const dateGroups = {};
    allTips.forEach((tip) => {
      const date = new Date(tip.createdAt).toDateString();
      dateGroups[date] = (dateGroups[date] || 0) + 1;
    });

    console.log("\n📅 Tarih Bazlı Dağılım:");
    Object.entries(dateGroups)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .forEach(([date, count]) => {
        console.log(`   ${date}: ${count} tips`);
      });

    // Temizlik önerisi
    if (duplicatesByTitle.length > 0 || duplicatesBySlug.length > 0) {
      console.log("\n🧹 Temizlik Önerisi:");
      console.log(
        `   - ${duplicatesByTitle.length} title duplicate'i silinebilir`
      );
      console.log(
        `   - ${duplicatesBySlug.length} slug duplicate'i silinebilir`
      );
      console.log(
        `   - Temizlik sonrası beklenen sayı: ~${allTips.length - Math.max(duplicatesByTitle.length, duplicatesBySlug.length)}`
      );
    }
  } catch (error) {
    console.error("❌ Hata:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDuplicateTips();
