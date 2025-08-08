import { prisma } from "../src/lib/prisma";

interface PowerRange {
  attackPower: { min: number; max: number };
  defense: { min: number; max: number };
  speed: { min: number; max: number };
}

interface RarityPowerConfig {
  [raritySlug: string]: PowerRange;
}

async function updateCardPowerStats() {
  console.log("⚡ Kartların güç değerleri rarity'lere göre güncelleniyor...");

  try {
    // Rarity bazlı güç değeri aralıkları
    const rarityPowerConfig: RarityPowerConfig = {
      "common": {
        attackPower: { min: 100, max: 300 },
        defense: { min: 80, max: 250 },
        speed: { min: 50, max: 200 }
      },
      "uncommon": {
        attackPower: { min: 250, max: 450 },
        defense: { min: 200, max: 400 },
        speed: { min: 150, max: 350 }
      },
      "rare": {
        attackPower: { min: 400, max: 650 },
        defense: { min: 350, max: 600 },
        speed: { min: 300, max: 500 }
      },
      "super-rare": {
        attackPower: { min: 600, max: 850 },
        defense: { min: 550, max: 800 },
        speed: { min: 450, max: 650 }
      },
      "ultra-rare": {
        attackPower: { min: 800, max: 1100 },
        defense: { min: 750, max: 1050 },
        speed: { min: 600, max: 850 }
      },
      "epic": {
        attackPower: { min: 1000, max: 1400 },
        defense: { min: 950, max: 1350 },
        speed: { min: 800, max: 1150 }
      },
      "legendary": {
        attackPower: { min: 1300, max: 2000 },
        defense: { min: 1250, max: 1900 },
        speed: { min: 1100, max: 1600 }
      },
      "mythical": {
        attackPower: { min: 1800, max: 2500 },
        defense: { min: 1700, max: 2400 },
        speed: { min: 1500, max: 2200 }
      },
      "divine": {
        attackPower: { min: 2200, max: 3000 },
        defense: { min: 2100, max: 2900 },
        speed: { min: 1900, max: 2700 }
      }
    };

    console.log("⚙️ Güç Değeri Aralıkları:");
    Object.entries(rarityPowerConfig).forEach(([rarity, config]) => {
      console.log(`  ${rarity}:`);
      console.log(`    Saldırı: ${config.attackPower.min}-${config.attackPower.max}`);
      console.log(`    Savunma: ${config.defense.min}-${config.defense.max}`);
      console.log(`    Hız: ${config.speed.min}-${config.speed.max}`);
    });

    // Tüm kartları al
    const cards = await prisma.card.findMany({
      select: {
        id: true,
        name: true,
        rarity: true,
        attackPower: true,
        defense: true,
        speed: true,
        fileName: true
      }
    });

    console.log(`\n📦 Toplam ${cards.length} kart bulundu.`);

    if (cards.length === 0) {
      console.log("❌ Güncellenecek kart bulunamadı!");
      return;
    }

    let updatedCards = 0;
    let skippedCards = 0;

    // Kartları toplu güncelle
    const updatePromises = cards.map(async (card) => {
      const rarity = card.rarity || 'common';
      const powerConfig = rarityPowerConfig[rarity];

      if (!powerConfig) {
        console.warn(`⚠️ ${card.name}: Bilinmeyen rarity '${rarity}', common olarak işleniyor`);
        const commonConfig = rarityPowerConfig['common'];
        const powers = generateConsistentPowers(card.id, card.fileName, commonConfig);
        
        await prisma.card.update({
          where: { id: card.id },
          data: powers
        });
        return { updated: true, rarity: 'common (fallback)' };
      }

      // Tutarlı güç değerleri üret (aynı kart her zaman aynı değerleri alacak)
      const powers = generateConsistentPowers(card.id, card.fileName, powerConfig);
      
      // Sadece değişiklik varsa güncelle
      const needsUpdate = 
        card.attackPower !== powers.attackPower ||
        card.defense !== powers.defense ||
        card.speed !== powers.speed;

      if (needsUpdate) {
        await prisma.card.update({
          where: { id: card.id },
          data: powers
        });
        return { updated: true, rarity };
      } else {
        return { updated: false, rarity };
      }
    });

    // Paralel olarak güncelle (batch'ler halinde)
    const batchSize = 50;
    for (let i = 0; i < updatePromises.length; i += batchSize) {
      const batch = updatePromises.slice(i, i + batchSize);
      const results = await Promise.all(batch);
      
      results.forEach(result => {
        if (result.updated) {
          updatedCards++;
        } else {
          skippedCards++;
        }
      });

      console.log(`📊 İşlendi: ${Math.min(i + batchSize, cards.length)}/${cards.length}`);
    }

    console.log(`\n✅ Güç değerleri güncelleme tamamlandı!`);
    console.log(`   Güncellenen kartlar: ${updatedCards}`);
    console.log(`   Atlanan kartlar: ${skippedCards}`);

    // Rarity başına istatistikler
    console.log("\n📊 Rarity Başına Güç Ortalamaları:");
    const rarityStats = await prisma.card.groupBy({
      by: ['rarity'],
      _avg: {
        attackPower: true,
        defense: true,
        speed: true
      },
      _count: {
        rarity: true
      },
      where: {
        attackPower: { not: null },
        defense: { not: null },
        speed: { not: null }
      }
    });

    rarityStats
      .sort((a, b) => {
        const aConfig = rarityPowerConfig[a.rarity || 'common'];
        const bConfig = rarityPowerConfig[b.rarity || 'common'];
        const aAvg = aConfig ? (aConfig.attackPower.min + aConfig.attackPower.max) / 2 : 0;
        const bAvg = bConfig ? (bConfig.attackPower.min + bConfig.attackPower.max) / 2 : 0;
        return aAvg - bAvg;
      })
      .forEach(stat => {
        const rarity = stat.rarity || 'undefined';
        const count = stat._count.rarity;
        console.log(`  ${rarity} (${count} kart):`);
        console.log(`    Saldırı Ort: ${Math.round(stat._avg.attackPower || 0)}`);
        console.log(`    Savunma Ort: ${Math.round(stat._avg.defense || 0)}`);
        console.log(`    Hız Ort: ${Math.round(stat._avg.speed || 0)}`);
      });

    // En güçlü 10 kartı göster
    console.log("\n🏆 En Güçlü 10 Kart:");
    const topCards = await prisma.card.findMany({
      select: {
        name: true,
        rarity: true,
        attackPower: true,
        defense: true,
        speed: true
      },
      where: {
        attackPower: { not: null },
        defense: { not: null },
        speed: { not: null }
      },
      orderBy: {
        attackPower: 'desc'
      },
      take: 10
    });

    topCards.forEach((card, index) => {
      const totalPower = (card.attackPower || 0) + (card.defense || 0) + (card.speed || 0);
      console.log(`  ${index + 1}. ${card.name} (${card.rarity})`);
      console.log(`     Saldırı: ${card.attackPower}, Savunma: ${card.defense}, Hız: ${card.speed} = ${totalPower}`);
    });

  } catch (error) {
    console.error("💥 Güç değerleri güncelleme hatası:", error);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Kart ID ve filename'den tutarlı güç değerleri üretir
 */
function generateConsistentPowers(cardId: string, fileName: string, config: PowerRange) {
  // Kart ID ve filename'den deterministik seed oluştur
  const seed = generateSeed(cardId + fileName);
  
  // Seeded random number generator
  const random1 = seededRandom(seed);
  const random2 = seededRandom(seed + 1);
  const random3 = seededRandom(seed + 2);

  // Biraz varyasyon ekle (±10%)
  const variation1 = 0.9 + (random1 * 0.2); // 0.9 - 1.1
  const variation2 = 0.9 + (random2 * 0.2);
  const variation3 = 0.9 + (random3 * 0.2);

  const attackPower = Math.round(
    (config.attackPower.min + (random1 * (config.attackPower.max - config.attackPower.min))) * variation1
  );
  
  const defense = Math.round(
    (config.defense.min + (random2 * (config.defense.max - config.defense.min))) * variation2
  );
  
  const speed = Math.round(
    (config.speed.min + (random3 * (config.speed.max - config.speed.min))) * variation3
  );

  return { attackPower, defense, speed };
}

/**
 * String'den deterministic seed üretir
 */
function generateSeed(str: string): number {
  let seed = 0;
  for (let i = 0; i < str.length; i++) {
    seed += str.charCodeAt(i) * (i + 1);
  }
  return seed % 2147483647; // 32-bit int max
}

/**
 * Seeded random number generator (0-1 arası)
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Script'i çalıştır
updateCardPowerStats().catch(console.error);