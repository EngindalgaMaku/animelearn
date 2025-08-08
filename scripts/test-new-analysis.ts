import { prisma } from "../src/lib/prisma";
import { detectCardRarity } from "../src/lib/ai/rarity-detection";
import { generateRarityAwareCardProperties } from "../src/lib/ai/power-calculation";

async function testNewAnalysis() {
  console.log("🧪 Yeni analiz sistemi test ediliyor...");

  try {
    // Test data'ları oluştur
    const testCases = [
      {
        fileName: "naruto_special_card.jpg",
        fileSize: 2500000,
        imagePath: "/test/naruto.jpg",
        ocrText: "Naruto Uzumaki special rare card",
        detectedSeries: "Naruto",
        detectedCharacter: "Naruto Uzumaki"
      },
      {
        fileName: "pokemon_pikachu_normal.jpg", 
        fileSize: 1200000,
        imagePath: "/test/pikachu.jpg",
        ocrText: "Pikachu common pokemon card",
        detectedSeries: "Pokemon",
        detectedCharacter: "Pikachu"
      },
      {
        fileName: "onepiece_luffy_legendary.jpg",
        fileSize: 4800000, 
        imagePath: "/test/luffy.jpg",
        ocrText: "Monkey D. Luffy legendary ultimate card",
        detectedSeries: "One Piece",
        detectedCharacter: "Luffy"
      }
    ];

    console.log("\n🎲 Rarity Detection Test:");
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`\n--- Test ${i + 1}: ${testCase.fileName} ---`);
      
      // Rarity detection test
      const rarityResult = await detectCardRarity(testCase);
      
      console.log(`🎯 Detected Rarity: ${rarityResult.detectedRarity}`);
      console.log(`📊 Confidence: ${rarityResult.confidence}%`);
      console.log(`🎲 Used Drop Rates: ${rarityResult.usedDropRates ? 'Yes' : 'No'}`);
      console.log(`📝 Reasoning:`);
      rarityResult.reasoning.forEach(reason => {
        console.log(`   ${reason}`);
      });

      // Power calculation test
      const cardId = `test_card_${i + 1}`;
      const powers = await generateRarityAwareCardProperties(
        200, // estimatedValue
        rarityResult.detectedRarity,
        cardId,
        testCase.fileName
      );

      console.log(`⚡ Generated Powers:`);
      console.log(`   Attack: ${powers.attackPower}`);
      console.log(`   Defense: ${powers.defense}`);
      console.log(`   Speed: ${powers.speed}`);
      console.log(`   Element: ${powers.element}`);
      console.log(`   Special Ability: ${powers.specialAbility}`);
      console.log(`   Rarity Level: ${powers.rarityLevel}`);

      // Verify rarity is in expected list
      const expectedRarities = ["common", "uncommon", "rare", "ultra-rare", "epic", "legendary"];
      if (expectedRarities.includes(rarityResult.detectedRarity)) {
        console.log(`✅ Rarity "${rarityResult.detectedRarity}" is valid`);
      } else {
        console.log(`❌ Rarity "${rarityResult.detectedRarity}" is INVALID!`);
      }
    }

    // Multiple runs test for consistency
    console.log("\n🔄 Consistency Test (same input, multiple runs):");
    const consistencyTest = testCases[0];
    const results: string[] = [];
    
    for (let i = 0; i < 5; i++) {
      const result = await detectCardRarity({
        ...consistencyTest,
        fileName: `${consistencyTest.fileName}_consistent_test` // Aynı seed için
      });
      results.push(result.detectedRarity);
    }
    
    console.log(`Results: [${results.join(', ')}]`);
    const isConsistent = results.every(r => r === results[0]);
    console.log(`🎯 Consistency: ${isConsistent ? 'PASS' : 'FAIL'}`);

    // Database drop rate verification
    console.log("\n📊 Database Drop Rate Verification:");
    const allRarities = await prisma.rarity.findMany({
      orderBy: { level: "asc" }
    });

    let totalDropRate = 0;
    allRarities.forEach(rarity => {
      totalDropRate += rarity.dropRate;
      console.log(`  ${rarity.slug}: ${rarity.dropRate}% (Level ${rarity.level})`);
    });
    
    console.log(`Total Drop Rate: ${totalDropRate.toFixed(1)}%`);
    console.log(`✅ Drop rates are ${Math.abs(totalDropRate - 100) < 1 ? 'correct' : 'INCORRECT'}`);

  } catch (error) {
    console.error("💥 Test hatası:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Script'i çalıştır
testNewAnalysis().catch(console.error);