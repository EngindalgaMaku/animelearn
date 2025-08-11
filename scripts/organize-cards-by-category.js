const { PrismaClient } = require("@prisma/client");
const fs = require("fs").promises;
const path = require("path");

const prisma = new PrismaClient();

async function getCurrentCategoriesAndCards() {
  try {
    console.log("🔍 Mevcut kategorileri ve kartları analiz ediliyor...");

    // Tüm kategorileri getir
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    console.log("\n📋 Mevcut Kategoriler:");
    categories.forEach((cat) => {
      console.log(`- ${cat.name} (slug: ${cat.slug})`);
    });

    // Tüm kartları getir ve kategorilerine göre gruplandır
    const cards = await prisma.card.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        imagePath: true,
        imageUrl: true,
        fileName: true,
      },
      orderBy: { category: "asc" },
    });

    console.log(`\n💾 Toplam Kart Sayısı: ${cards.length}`);

    // Kategorilere göre gruplandır
    const cardsByCategory = cards.reduce((acc, card) => {
      const category = card.category || "uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(card);
      return acc;
    }, {});

    console.log("\n📊 Kategorilere Göre Kart Dağılımı:");
    Object.entries(cardsByCategory).forEach(([category, cards]) => {
      console.log(`- ${category}: ${cards.length} kart`);
    });

    return { categories, cards, cardsByCategory };
  } catch (error) {
    console.error("❌ Hata:", error);
    throw error;
  }
}

async function createCategoryDirectories(categories, cardsByCategory) {
  try {
    console.log("\n🗂️ Kategori dizinleri oluşturuluyor...");

    const baseDir = path.join(process.cwd(), "public", "uploads", "categories");

    // Ana categories dizini zaten oluşturulmuş

    // Her kategori için dizin oluştur
    for (const category of categories) {
      const categoryDir = path.join(baseDir, category.slug);
      try {
        await fs.mkdir(categoryDir, { recursive: true });
        console.log(
          `✅ Dizin oluşturuldu: /uploads/categories/${category.slug}`
        );
      } catch (error) {
        console.log(
          `⚠️ Dizin zaten mevcut: /uploads/categories/${category.slug}`
        );
      }
    }

    // Kategorisi olmayan kartlar için 'uncategorized' dizini
    const uncategorizedCards =
      cardsByCategory["uncategorized"] ||
      cardsByCategory[""] ||
      cardsByCategory[null];
    if (uncategorizedCards && uncategorizedCards.length > 0) {
      const uncategorizedDir = path.join(baseDir, "uncategorized");
      try {
        await fs.mkdir(uncategorizedDir, { recursive: true });
        console.log(`✅ Dizin oluşturuldu: /uploads/categories/uncategorized`);
      } catch (error) {
        console.log(`⚠️ Dizin zaten mevcut: /uploads/categories/uncategorized`);
      }
    }

    console.log("\n📁 Tüm kategori dizinleri hazır!");
  } catch (error) {
    console.error("❌ Dizin oluşturma hatası:", error);
    throw error;
  }
}

async function main() {
  try {
    const { categories, cards, cardsByCategory } =
      await getCurrentCategoriesAndCards();

    await createCategoryDirectories(categories, cardsByCategory);

    console.log("\n🎯 Sonraki adımlar:");
    console.log("1. Mevcut kartları kategorilerine göre taşı");
    console.log("2. Veritabanı şemasını güncelle");
    console.log("3. Upload API'sini güncelle");
    console.log("4. Frontend'i güncelle");
  } catch (error) {
    console.error("❌ Ana süreç hatası:", error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = { getCurrentCategoriesAndCards, createCategoryDirectories };
