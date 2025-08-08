const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

const categories = [
  {
    name: "Anime Collection",
    slug: "anime-collection",
    description: "Collectible anime and manga character cards",
    color: "#FF6B6B",
    icon: "🎌",
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Star Collection",
    slug: "star-collection",
    description: "Celebrity and famous personality trading cards",
    color: "#4ECDC4",
    icon: "⭐",
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "Car Collection",
    slug: "car-collection",
    description: "Luxury and sports car trading cards",
    color: "#45B7D1",
    icon: "🚗",
    isActive: true,
    sortOrder: 3,
  },
];

async function main() {
  console.log("🌱 Seeding categories...");

  // Clear existing categories
  await prisma.category.deleteMany({});
  console.log("🗑️ Cleared existing categories");

  // Create new categories
  for (const category of categories) {
    const created = await prisma.category.create({
      data: category,
    });
    console.log(`✅ Created category: ${created.name} (${created.slug})`);
  }

  console.log("🎉 Categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding categories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });