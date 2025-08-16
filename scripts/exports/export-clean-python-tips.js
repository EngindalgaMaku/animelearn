const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function exportCleanPythonTips() {
  try {
    console.log("📤 Temiz Python Tips Export Ediliyor...\n");

    // Tüm temiz tips'leri getir
    const tips = await prisma.pythonTip.findMany({
      include: {
        category: {
          select: {
            name: true,
            slug: true,
            color: true,
          },
        },
      },
      orderBy: [{ createdAt: "asc" }],
    });

    console.log(`📊 Export Edilen Tip Sayısı: ${tips.length}\n`);

    // Kategorileri de getir
    const categories = await prisma.pythonTipCategory.findMany({
      orderBy: { createdAt: "asc" },
    });

    console.log(`📊 Export Edilen Kategori Sayısı: ${categories.length}\n`);

    // Tips'leri transform et
    const transformedTips = tips.map((tip) => ({
      title: tip.title,
      content: tip.content,
      codeExample: tip.codeExample,
      difficulty: tip.difficulty,
      categorySlug: tip.category.slug,
      xpReward: tip.xpReward,
      tags: tip.tags ? JSON.parse(tip.tags) : [],
      estimatedMinutes: tip.estimatedMinutes,
      prerequisites: tip.prerequisites ? JSON.parse(tip.prerequisites) : [],
      relatedTips: tip.relatedTips ? JSON.parse(tip.relatedTips) : [],
      slug: tip.slug,
      metaDescription: tip.metaDescription,
      metaKeywords: tip.metaKeywords,
      socialImageUrl: tip.socialImageUrl,
      isActive: tip.isActive,
      publishDate: tip.publishDate,
    }));

    // Export data'yı oluştur
    const exportData = {
      categories: categories.map((cat) => ({
        name: cat.name,
        slug: cat.slug,
        color: cat.color,
        icon: cat.icon,
        description: cat.description,
        isActive: cat.isActive,
      })),
      tips: transformedTips,
    };

    // JSON string'e çevir (güzel formatla)
    const jsonString = JSON.stringify(exportData, null, 2);

    console.log("📄 Export Edilen Data Özeti:");
    console.log(`   - Kategoriler: ${exportData.categories.length}`);
    console.log(`   - Tips: ${exportData.tips.length}`);

    // Kategori dağılımı
    const categoryCount = {};
    transformedTips.forEach((tip) => {
      const cat = tip.categorySlug;
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    console.log("\n📊 Kategori Dağılımı:");
    Object.entries(categoryCount).forEach(([slug, count]) => {
      const category = categories.find((c) => c.slug === slug);
      console.log(`   ${category?.name || slug}: ${count} tips`);
    });

    // Data'yı dosyaya yaz
    const fs = require("fs");
    fs.writeFileSync("clean-python-tips-export.json", jsonString);

    console.log("\n✅ Export tamamlandı: clean-python-tips-export.json");
    console.log("\n🔧 Bu data kurtarma seed için hazır!");
  } catch (error) {
    console.error("❌ Export Hatası:", error);
  } finally {
    await prisma.$disconnect();
  }
}

exportCleanPythonTips();
