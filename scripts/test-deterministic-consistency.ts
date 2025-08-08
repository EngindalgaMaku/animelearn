import { detectCardRarity, ImageAnalysisData } from '../src/lib/ai/rarity-detection';
import { generateRarityAwareCardProperties } from '../src/lib/ai/power-calculation';

async function main() {
  console.log('🔄 Testing deterministic consistency...\n');

  const testCardId = 'consistency-test-card-123';
  const testImageUrl = 'naruto_special_card.jpg';

  // Test the same card multiple times
  const testResults = [];

  for (let i = 0; i < 5; i++) {
    console.log(`\n--- Test Run ${i + 1} ---`);
    
    // Create analysis data structure
    const analysisData: ImageAnalysisData = {
      fileName: testImageUrl,
      fileSize: 1024 * 1024, // 1MB placeholder
      imagePath: testImageUrl,
      ocrText: 'naruto special card test',
      detectedSeries: 'naruto',
      detectedCharacter: 'naruto uzumaki'
    };

    // Detect rarity
    const rarityResult = await detectCardRarity(analysisData);
    
    // Calculate powers using the rarity-aware function
    const cardProperties = await generateRarityAwareCardProperties(
      75, // estimated value
      rarityResult.detectedRarity,
      testCardId,
      testImageUrl
    );
    
    const result = {
      rarity: rarityResult.detectedRarity,
      powers: {
        attack: cardProperties.attackPower,
        defense: cardProperties.defense,
        speed: cardProperties.speed,
        element: cardProperties.element,
        specialAbility: cardProperties.specialAbility
      }
    };
    
    console.log(`🎯 Rarity: ${result.rarity}`);
    console.log(`⚡ Attack: ${result.powers.attack}`);
    console.log(`🛡️ Defense: ${result.powers.defense}`);
    console.log(`⚡ Speed: ${result.powers.speed}`);
    console.log(`🔮 Element: ${result.powers.element}`);
    console.log(`✨ Special: ${result.powers.specialAbility}`);
    
    testResults.push({
      rarity: result.rarity,
      attack: result.powers.attack,
      defense: result.powers.defense,
      speed: result.powers.speed,
      element: result.powers.element,
      specialAbility: result.powers.specialAbility
    });
  }

  // Check consistency
  console.log('\n🔍 Consistency Analysis:');
  const firstResult = testResults[0];
  let isConsistent = true;

  for (let i = 1; i < testResults.length; i++) {
    const current = testResults[i];
    
    if (
      current.rarity !== firstResult.rarity ||
      current.attack !== firstResult.attack ||
      current.defense !== firstResult.defense ||
      current.speed !== firstResult.speed ||
      current.element !== firstResult.element ||
      current.specialAbility !== firstResult.specialAbility
    ) {
      isConsistent = false;
      console.log(`❌ Inconsistency found in run ${i + 1}`);
      break;
    }
  }

  if (isConsistent) {
    console.log('✅ PERFECT CONSISTENCY: All runs produced identical results');
    console.log('🎯 Final Result:');
    console.log(`   Rarity: ${firstResult.rarity}`);
    console.log(`   Attack: ${firstResult.attack}`);
    console.log(`   Defense: ${firstResult.defense}`);
    console.log(`   Speed: ${firstResult.speed}`);
    console.log(`   Element: ${firstResult.element}`);
    console.log(`   Special: ${firstResult.specialAbility}`);
  } else {
    console.log('❌ INCONSISTENCY DETECTED: Results varied between runs');
    console.log('📊 All Results:');
    testResults.forEach((result, index) => {
      console.log(`   Run ${index + 1}: ${result.rarity}, ATK:${result.attack}, DEF:${result.defense}, SPD:${result.speed}, ${result.element}, ${result.specialAbility}`);
    });
  }

  console.log('\n🏁 Test completed!');
}

// Run the main function
main().catch(console.error);