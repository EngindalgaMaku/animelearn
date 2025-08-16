import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateCategories() {
  console.log("Starting category migration...");

  try {
    // First, let's create the default categories
    const defaultCategories = [
      {
        name: "Anime",
        slug: "anime",
        description:
          "Japanese animation trading cards featuring characters from popular anime series",
        color: "#EC4899", // Pink
        icon: "🎌",
        isActive: true,
        sortOrder: 1,
      },
      {
        name: "Cars",
        slug: "cars",
        description:
          "Automotive trading cards featuring various car models and racing themes",
        color: "#F97316", // Orange
        icon: "🚗",
        isActive: true,
        sortOrder: 2,
      },
      {
        name: "Gaming",
        slug: "gaming",
        description: "Video game themed trading cards",
        color: "#8B5CF6", // Purple
        icon: "🎮",
        isActive: true,
        sortOrder: 3,
      },
      {
        name: "Sports",
        slug: "sports",
        description: "Sports themed trading cards",
        color: "#10B981", // Green
        icon: "⚽",
        isActive: true,
        sortOrder: 4,
      },
    ];

    // Create categories if they don't exist
    for (const categoryData of defaultCategories) {
      const existingCategory = await prisma.category.findUnique({
        where: { slug: categoryData.slug },
      });

      if (!existingCategory) {
        await prisma.category.create({
          data: categoryData,
        });
        console.log(`✅ Created category: ${categoryData.name}`);
      } else {
        console.log(`ℹ️  Category already exists: ${categoryData.name}`);
      }
    }

    // Update card counts for each category
    const categories = await prisma.category.findMany();

    for (const category of categories) {
      const cardCount = await prisma.card.count({
        where: {
          category: {
            in: [category.slug, category.name.toLowerCase()],
          },
        },
      });

      await prisma.category.update({
        where: { id: category.id },
        data: { cardCount },
      });

      console.log(`📊 Updated ${category.name} card count: ${cardCount}`);
    }

    console.log("✅ Category migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
if (require.main === module) {
  migrateCategories()
    .then(() => {
      console.log("Migration completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}

export default migrateCategories;
