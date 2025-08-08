const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function checkAllCategoriesCards() {
  try {
    // Tüm kategorileri kontrol et
    const allCards = await prisma.card.findMany({
      select: {
        id: true,
        name: true,
        series: true,
        category: true
      }
    });
    
    console.log('All cards by category:');
    console.log('======================');
    
    // Kategorilere göre grupla
    const cardsByCategory = {};
    allCards.forEach(card => {
      if (!cardsByCategory[card.category]) {
        cardsByCategory[card.category] = [];
      }
      cardsByCategory[card.category].push(card);
    });
    
    // Her kategoriyi göster
    Object.keys(cardsByCategory).forEach(category => {
      console.log(`\n${category.toUpperCase()} (${cardsByCategory[category].length} cards):`);
      cardsByCategory[category].forEach(card => {
        console.log(`  - ${card.name}: series="${card.series}"`);
      });
    });
    
    // Yanlış series olan kartları bul
    console.log('\n======================');
    console.log('Checking for wrong series...');
    
    let wrongSeriesCards = [];
    
    allCards.forEach(card => {
      const expectedSeries = getExpectedSeries(card.category);
      if (card.series !== expectedSeries) {
        wrongSeriesCards.push({
          id: card.id,
          name: card.name,
          category: card.category,
          currentSeries: card.series,
          expectedSeries: expectedSeries
        });
      }
    });
    
    if (wrongSeriesCards.length > 0) {
      console.log(`Found ${wrongSeriesCards.length} cards with wrong series:`);
      wrongSeriesCards.forEach(card => {
        console.log(`  - ${card.name} (${card.category}): "${card.currentSeries}" should be "${card.expectedSeries}"`);
      });
    } else {
      console.log('All cards have correct series! ✅');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function getExpectedSeries(category) {
  switch (category) {
    case 'anime':
    case 'anime-collection':
      return 'Anime Collection';
    case 'star-collection':
      return 'Star Collection';
    case 'car-collection':
      return 'Car Collection';
    case 'movie-collection':
      return 'Movie Collection';
    case 'game-collection':
      return 'Game Collection';
    case 'sport-collection':
      return 'Sport Collection';
    default:
      return `${category.charAt(0).toUpperCase() + category.slice(1)} Collection`;
  }
}

checkAllCategoriesCards();