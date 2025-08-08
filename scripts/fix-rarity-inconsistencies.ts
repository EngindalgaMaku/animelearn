import { prisma } from "../src/lib/prisma";

async function fixRarityInconsistencies() {
  console.log("🔧 Rarity tutarsızlıkları düzeltiliyor...");

  try {
    // Mevcut rarity dağılımını kontrol et
    console.log("\n📊 Mevcut Rarity Dağılımı:");
    const currentDistribution = await prisma.card.groupBy({
      by: ['rarity'],
      _count: {
        rarity: true,
      },
    });

    currentDistribution.forEach(group => {
      const rarity = group.rarity || 'null';
      const count = group._count.rarity;
      console.log(`  "${rarity}": ${count} kart`);
    });

    // Rarity eşlemeleri - eski -> yeni
    const rarityMappings: { [key: string]: string } = {
      // Case sensitivity düzeltmeleri
      "Common": "common",
      "Uncommon": "uncommon", 
      "Rare": "rare",
      "Epic": "epic",
      "Legendary": "legendary",
      
      // Eski format düzeltmeleri
      "super rare": "uncommon",
      "Super Rare": "uncommon",
      "ultra rare": "rare", 
      "Ultra Rare": "rare",
      "secret rare": "epic",
      "Secret Rare": "epic",
      
      // Diğer varyasyonlar
      "Super": "uncommon",
      "Ultra": "rare",
      "Secret": "epic",
      "Mythical": "legendary",
      "Divine": "legendary",
      
      // Null/undefined düzeltmesi
      "": "common",
      null: "common"
    };

    console.log("\n🔄 Rarity düzeltmeleri uygulanıyor...");
    
    let totalUpdated = 0;
    
    for (const [oldRarity, newRarity] of Object.entries(rarityMappings)) {
      const whereCondition = oldRarity === null ? 
        { rarity: null } : 
        { rarity: oldRarity };
      
      // Bu rarity'ye sahip kartları bul
      const cardsToUpdate = await prisma.card.findMany({
        where: whereCondition,
        select: { id: true, name: true, rarity: true }
      });

      if (cardsToUpdate.length > 0) {
        console.log(`📝 "${oldRarity}" → "${newRarity}": ${cardsToUpdate.length} kart güncelleniyor`);
        
        // Toplu güncelleme
        const updateResult = await prisma.card.updateMany({
          where: whereCondition,
          data: { rarity: newRarity }
        });

        totalUpdated += updateResult.count;
        console.log(`   ✅ ${updateResult.count} kart güncellendi`);
      }
    }

    console.log(`\n✅ Toplam ${totalUpdated} kart güncellendi!`);

    // Güncellenmiş dağılımı göster
    console.log("\n🎉 Güncellenmiş Rarity Dağılımı:");
    const updatedDistribution = await prisma.card.groupBy({
      by: ['rarity'],
      _count: {
        rarity: true,
      },
      orderBy: {
        _count: {
          rarity: 'desc'
        }
      }
    });

    const totalCards = await prisma.card.count();
    
    updatedDistribution.forEach(group => {
      const rarity = group.rarity || 'null';
      const count = group._count.rarity;
      const percentage = ((count / totalCards) * 100).toFixed(1);
      console.log(`  ${rarity}: ${count} kart (${percentage}%)`);
    });

    // Hedef dağılım ile karşılaştır
    console.log("\n📊 Hedef Dağılım Karşılaştırması:");
    const targetDistribution = {
      "common": 54.7,
      "uncommon": 19.3,
      "rare": 10.5,
      "ultra-rare": 6.8,
      "epic": 4.9,
      "legendary": 3.7
    };

    const currentRarityStats: { [key: string]: number } = {};
    updatedDistribution.forEach(group => {
      const rarity = group.rarity || 'null';
      const percentage = (group._count.rarity / totalCards) * 100;
      currentRarityStats[rarity] = percentage;
    });

    Object.entries(targetDistribution).forEach(([rarity, target]) => {
      const current = currentRarityStats[rarity] || 0;
      const deviation = Math.abs(current - target);
      const status = deviation < 5 ? "✅" : "⚠️";
      console.log(`  ${status} ${rarity}: ${current.toFixed(1)}% (hedef: ${target}%, sapma: ${deviation.toFixed(1)}%)`);
    });

    // Fazladan rarity'ler varsa uyar
    const extraRarities = Object.keys(currentRarityStats).filter(
      rarity => !Object.keys(targetDistribution).includes(rarity) && rarity !== 'null'
    );

    if (extraRarities.length > 0) {
      console.log("\n⚠️ Beklenmeyen rarity'ler bulundu:");
      extraRarities.forEach(rarity => {
        const count = updatedDistribution.find(g => g.rarity === rarity)?._count.rarity || 0;
        console.log(`  ${rarity}: ${count} kart - Manual olarak kontrol edin`);
      });
    }

  } catch (error) {
    console.error("💥 Rarity düzeltme hatası:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Script'i çalıştır
fixRarityInconsistencies().catch(console.error);