import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const diamondPackages = [
  {
    packageType: "starter",
    name: "Starter Chest",
    diamonds: 100,
    price: 9.99,
    level: 1,
    badge: "Novice",
    color: "from-green-400 to-emerald-600",
    glow: "shadow-green-500/25",
    icon: "Diamond",
    features: ["100 💎 Diamonds", "Perfect for beginners", "⚡ Instant delivery", "🎁 Welcome bonus"],
    popular: false,
    bestValue: false,
    bonus: null,
    originalPrice: null,
    sortOrder: 1,
  },
  {
    packageType: "popular",
    name: "Hero's Vault",
    diamonds: 500,
    price: 39.99,
    originalPrice: 49.99,
    bonus: 50,
    popular: true,
    level: 2,
    badge: "Hero",
    color: "from-blue-400 to-cyan-600",
    glow: "shadow-blue-500/25",
    icon: "Star",
    features: ["500 💎 Diamonds", "+50 🎁 Bonus Diamonds", "20% Extra Value", "🚀 Priority Support", "⭐ Hero Badge"],
    bestValue: false,
    sortOrder: 2,
  },
  {
    packageType: "premium",
    name: "Legend's Treasury",
    diamonds: 1000,
    price: 69.99,
    originalPrice: 99.99,
    bonus: 200,
    level: 3,
    badge: "Legend",
    color: "from-purple-400 to-pink-600",
    glow: "shadow-purple-500/25",
    icon: "Crown",
    features: ["1000 💎 Diamonds", "+200 🎁 Bonus Diamonds", "30% Extra Value", "👑 VIP Badge", "🎴 Exclusive Cards", "💫 Special Effects"],
    popular: false,
    bestValue: false,
    sortOrder: 3,
  },
  {
    packageType: "ultimate",
    name: "Mythic Strongbox",
    diamonds: 2500,
    price: 149.99,
    originalPrice: 249.99,
    bonus: 750,
    bestValue: true,
    level: 4,
    badge: "Mythic",
    color: "from-orange-400 to-red-600",
    glow: "shadow-orange-500/25",
    icon: "Zap",
    features: ["2500 💎 Diamonds", "+750 🎁 Bonus Diamonds", "40% Extra Value", "🔥 Legendary Badge", "🎁 Rare Card Pack", "⚡ Priority Queue", "🌟 Mythic Aura"],
    popular: false,
    sortOrder: 4,
  },
  {
    packageType: "mega",
    name: "Divine Sanctuary",
    diamonds: 5000,
    price: 249.99,
    originalPrice: 499.99,
    bonus: 2000,
    level: 5,
    badge: "Divine",
    color: "from-yellow-400 to-amber-600",
    glow: "shadow-yellow-500/25",
    icon: "Gift",
    features: ["5000 💎 Diamonds", "+2000 🎁 Bonus Diamonds", "50% Extra Value", "✨ Mythic Badge", "🎴 Epic Card Collection", "👨‍💻 Developer Recognition", "🏆 Hall of Fame", "💫 Divine Powers"],
    popular: false,
    bestValue: false,
    sortOrder: 5,
  },
];

async function seedDiamondPackages() {
  console.log('🌱 Starting diamond packages seeding...');

  try {
    // Önce mevcut paketleri kontrol et
    const existingPackages = await prisma.diamondPackage.findMany();
    console.log(`📦 Found ${existingPackages.length} existing packages`);

    for (const packageData of diamondPackages) {
      const existing = await prisma.diamondPackage.findUnique({
        where: { packageType: packageData.packageType },
      });

      if (existing) {
        console.log(`⚠️  Package ${packageData.packageType} already exists, skipping...`);
        continue;
      }

      const createdPackage = await prisma.diamondPackage.create({
        data: {
          ...packageData,
          features: JSON.stringify(packageData.features),
          isActive: true,
        },
      });

      console.log(`✅ Created package: ${createdPackage.name} (${createdPackage.packageType})`);
    }

    console.log('🎉 Diamond packages seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding diamond packages:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedDiamondPackages();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { seedDiamondPackages };