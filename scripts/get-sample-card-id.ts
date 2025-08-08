import { prisma } from '../src/lib/prisma';

async function getSampleCardId() {
  try {
    console.log('🔍 Getting sample card ID from database...');
    
    const card = await prisma.card.findFirst({
      orderBy: { updatedAt: 'desc' }
    });

    if (card) {
      console.log(`✅ Found card ID: ${card.id}`);
      console.log(`📝 Card name: ${card.name}`);
      console.log(`🎨 Card category: ${card.category}`);
      console.log(`🏷️ Rarity: ${card.rarity || 'Not determined'}`);
      console.log(`📊 Analysis status: ${card.isAnalyzed ? 'Analyzed' : 'Not analyzed'}`);
      return card.id;
    } else {
      console.log('❌ No cards found in database');
      return null;
    }
  } catch (error) {
    console.error('Database error:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

getSampleCardId().then(cardId => {
  if (cardId) {
    console.log(`\n🎯 Available card ID for testing: ${cardId}`);
  }
}).catch(console.error);