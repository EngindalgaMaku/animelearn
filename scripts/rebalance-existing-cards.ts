import { prisma } from "../src/lib/prisma";
import { dropRateSystem } from "../src/lib/ai/drop-rate-system";

async function rebalanceExistingCards() {
  console.log("🎯 Mevcut kartların rarity balance işlemi başlatılıyor...");

  try {
    // Önce drop rate config'i al
    const dropRateConfig = await dropRateSystem.getDropRateConfig();
    
    if (dropRateConfig.length === 0) {
      console.log("❌ Drop rate config bulunamadı!");
      return;
    }

    console.log("📊 Drop Rate Konfigürasyonu:");
    dropRateConfig.forEach(config => {
      console.log(`  ${config.rarityName}: ${config.dropRate}% (Level ${config.level})`);
    });

    // Toplam kart sayısını al
    const totalCards = await prisma.card.count();
    console.log(`\n📦 Toplam kart sayısı: ${totalCards}`);

    if (totalCards === 0) {
      console.log("❌ Sistemde kart bulunamadı!");
      return;
    }

    // Mevcut dağılımı analiz et
    console.log("\n📈 Mevcut Rarity Dağılımı:");
    const currentDistribution = await prisma.card.groupBy({
      by: ['rarity'],
      _count: {
        rarity: true,
      },
    });

    const currentStats: { [key: string]: { count: number; percentage: number; target: number } } = {};
    
    currentDistribution.forEach(group => {
      const rarity = group.rarity || 'undefined';
      const count = group._count.rarity;
      const percentage = (count / totalCards) * 100;
      const config = dropRateConfig.find(c => c.raritySlug === rarity);
      const target = config?.dropRate || 0;
      
      currentStats[rarity] = { count, percentage, target };
      console.log(`  ${rarity}: ${count} kart (${percentage.toFixed(1)}%) - Hedef: ${target}%`);
    });

    // Hangi rarity'lerin fazla/az olduğunu belirle
    const rebalancePlan: Array<{
      fromRarity: string;
      toRarity: string;
      count: number;
      reason: string;
    }> = [];

    // Her rarity için hedef kart sayısını hesapla
    const targetCounts: { [key: string]: number } = {};
    dropRateConfig.forEach(config => {
      targetCounts[config.raritySlug] = Math.round((totalCards * config.dropRate) / 100);
    });

    console.log("\n🎯 Hedef Dağılımlar:");
    Object.entries(targetCounts).forEach(([rarity, target]) => {
      const current = currentStats[rarity]?.count || 0;
      const diff = target - current;
      console.log(`  ${rarity}: ${current} → ${target} (${diff > 0 ? '+' : ''}${diff})`);
    });

    // Rebalance planı oluştur
    const overrepresented: Array<{ rarity: string; excess: number; level: number }> = [];
    const underrepresented: Array<{ rarity: string; needed: number; level: number }> = [];

    Object.entries(targetCounts).forEach(([rarity, target]) => {
      const current = currentStats[rarity]?.count || 0;
      const diff = current - target;
      const config = dropRateConfig.find(c => c.raritySlug === rarity);
      
      if (diff > 5) { // 5+ fazla varsa
        overrepresented.push({ 
          rarity, 
          excess: diff, 
          level: config?.level || 0 
        });
      } else if (diff < -5) { // 5+ eksikse
        underrepresented.push({ 
          rarity, 
          needed: Math.abs(diff), 
          level: config?.level || 0 
        });
      }
    });

    console.log("\n⚖️ Rebalance Planı:");
    console.log(`Fazla olan rarities: ${overrepresented.length}`);
    console.log(`Eksik olan rarities: ${underrepresented.length}`);

    if (overrepresented.length === 0 && underrepresented.length === 0) {
      console.log("✅ Sistem zaten dengeli! Rebalance gerekmedi.");
      return;
    }

    // Rebalance işlemi
    let totalRebalanced = 0;
    const maxRebalancePerRun = 500; // Güvenlik limiti

    for (const over of overrepresented) {
      if (totalRebalanced >= maxRebalancePerRun) break;

      // Bu rarity'den alınacak kartları bul (en düşük confidence'dan başla)
      const cardsToRebalance = await prisma.card.findMany({
        where: { rarity: over.rarity },
        orderBy: { confidence: 'asc' },
        take: Math.min(over.excess, 100), // Batch halinde işle
        select: { id: true, name: true, confidence: true }
      });

      for (const card of cardsToRebalance) {
        if (totalRebalanced >= maxRebalancePerRun) break;

        // Uygun hedef rarity bul
        const suitableTarget = underrepresented.find(under => {
          return under.needed > 0 && 
                 Math.abs(under.level - over.level) <= 2; // Max 2 level fark
        });

        if (suitableTarget) {
          console.log(`🔄 ${card.name} (${over.rarity} → ${suitableTarget.rarity})`);
          
          // Kartı güncelle
          await prisma.card.update({
            where: { id: card.id },
            data: { rarity: suitableTarget.rarity }
          });

          // Sayaçları güncelle
          over.excess--;
          suitableTarget.needed--;
          totalRebalanced++;

          rebalancePlan.push({
            fromRarity: over.rarity,
            toRarity: suitableTarget.rarity,
            count: 1,
            reason: `Confidence: ${card.confidence}, Level transition: ${over.level}→${suitableTarget.level}`
          });
        }
      }
    }

    // Sonuçları raporla
    console.log(`\n✅ Rebalance tamamlandı! ${totalRebalanced} kart güncellendi.`);

    // Özet rapor
    const summary: { [key: string]: number } = {};
    rebalancePlan.forEach(plan => {
      const key = `${plan.fromRarity} → ${plan.toRarity}`;
      summary[key] = (summary[key] || 0) + plan.count;
    });

    console.log("\n📋 Rebalance Özeti:");
    Object.entries(summary).forEach(([transition, count]) => {
      console.log(`  ${transition}: ${count} kart`);
    });

    // Final dağılımı göster
    console.log("\n🎉 Son Dağılım:");
    const finalDistribution = await prisma.card.groupBy({
      by: ['rarity'],
      _count: {
        rarity: true,
      },
    });

    finalDistribution.forEach(group => {
      const rarity = group.rarity || 'undefined';
      const count = group._count.rarity;
      const percentage = (count / totalCards) * 100;
      const target = dropRateConfig.find(c => c.raritySlug === rarity)?.dropRate || 0;
      const deviation = Math.abs(percentage - target);
      
      console.log(`  ${rarity}: ${count} kart (${percentage.toFixed(1)}%) - Hedef: ${target}% - Sapma: ${deviation.toFixed(1)}%`);
    });

  } catch (error) {
    console.error("💥 Rebalance hatası:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Script'i çalıştır
rebalanceExistingCards().catch(console.error);