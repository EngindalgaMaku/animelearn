import { prisma } from "../src/lib/prisma";

async function checkRarityDatabase() {
  console.log("🔍 Rarity database kontrolü...");

  try {
    // Mevcut rarity tablosunu kontrol et
    const rarities = await prisma.rarity.findMany({
      orderBy: { level: "asc" },
    });

    console.log("\n📊 Database'deki Rarities:");
    rarities.forEach(rarity => {
      console.log(`  ID: ${rarity.id}`);
      console.log(`  Name: ${rarity.name}`);
      console.log(`  Slug: ${rarity.slug}`);
      console.log(`  Level: ${rarity.level}`);
      console.log(`  Drop Rate: ${rarity.dropRate}%`);
      console.log(`  Min Diamond: ${rarity.minDiamondPrice}`);
      console.log(`  Max Diamond: ${rarity.maxDiamondPrice}`);
      console.log(`  ---`);
    });

    // Expected rarities
    const expectedRarities = [
      { slug: "common", name: "Common", level: 1, dropRate: 54.7 },
      { slug: "uncommon", name: "Uncommon", level: 2, dropRate: 19.3 },
      { slug: "rare", name: "Rare", level: 3, dropRate: 10.5 },
      { slug: "ultra-rare", name: "Ultra Rare", level: 4, dropRate: 6.8 },
      { slug: "epic", name: "Epic", level: 5, dropRate: 4.9 },
      { slug: "legendary", name: "Legendary", level: 6, dropRate: 3.7 },
    ];

    console.log("\n🎯 Beklenen Rarities:");
    expectedRarities.forEach(expected => {
      const found = rarities.find(r => r.slug === expected.slug);
      if (found) {
        const dropRateMatch = Math.abs(found.dropRate - expected.dropRate) < 0.1;
        const levelMatch = found.level === expected.level;
        const status = dropRateMatch && levelMatch ? "✅" : "⚠️";
        console.log(`  ${status} ${expected.slug}: ${found ? "FOUND" : "MISSING"}`);
        if (!dropRateMatch) console.log(`    Drop rate mismatch: ${found.dropRate}% vs ${expected.dropRate}%`);
        if (!levelMatch) console.log(`    Level mismatch: ${found.level} vs ${expected.level}`);
      } else {
        console.log(`  ❌ ${expected.slug}: MISSING`);
      }
    });

    // Check for unexpected rarities
    console.log("\n🚨 Beklenmeyen Rarities:");
    const expectedSlugs = expectedRarities.map(r => r.slug);
    const unexpectedRarities = rarities.filter(r => !expectedSlugs.includes(r.slug));
    
    if (unexpectedRarities.length === 0) {
      console.log("  ✅ Beklenmeyen rarity yok");
    } else {
      unexpectedRarities.forEach(rarity => {
        console.log(`  ⚠️ ${rarity.slug} (${rarity.name}) - Level ${rarity.level}`);
      });
    }

    // Create missing rarities
    console.log("\n🔧 Eksik rarities oluşturuluyor...");
    for (const expected of expectedRarities) {
      const found = rarities.find(r => r.slug === expected.slug);
      if (!found) {
        console.log(`📝 Oluşturuluyor: ${expected.slug}`);
        await prisma.rarity.create({
          data: {
            name: expected.name,
            slug: expected.slug,
            level: expected.level,
            dropRate: expected.dropRate,
            minDiamondPrice: 50 + (expected.level - 1) * 50,
            maxDiamondPrice: 100 + (expected.level - 1) * 150,
            color: "#3B82F6",
          },
        });
      }
    }

    // Final check
    console.log("\n✅ Final kontrol:");
    const updatedRarities = await prisma.rarity.findMany({
      orderBy: { level: "asc" },
    });

    console.log(`📊 Toplam rarity sayısı: ${updatedRarities.length}`);
    let totalDropRate = 0;
    updatedRarities.forEach(rarity => {
      totalDropRate += rarity.dropRate;
      console.log(`  ${rarity.slug}: ${rarity.dropRate}%`);
    });
    
    console.log(`🎯 Toplam drop rate: ${totalDropRate.toFixed(1)}%`);
    
    if (Math.abs(totalDropRate - 100) < 0.1) {
      console.log("✅ Drop rate toplamı doğru!");
    } else {
      console.log("⚠️ Drop rate toplamı 100% değil!");
    }

  } catch (error) {
    console.error("💥 Rarity database kontrol hatası:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Script'i çalıştır
checkRarityDatabase().catch(console.error);