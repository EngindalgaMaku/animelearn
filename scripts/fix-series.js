const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function fixCardSeries() {
  try {
    // Star Collection kartlarını bul ve düzelt
    const starCards = await prisma.card.findMany({
      where: {
        category: 'star-collection'
      }
    });
    
    console.log(`Found ${starCards.length} star collection cards to fix`);
    
    // Kartları güncelle
    const updateResult = await prisma.card.updateMany({
      where: {
        category: 'star-collection'
      },
      data: {
        series: 'Star Collection'
      }
    });
    
    console.log(`Updated ${updateResult.count} cards`);
    
    // Other categories too
    await prisma.card.updateMany({
      where: {
        category: 'car-collection'
      },
      data: {
        series: 'Car Collection'
      }
    });
    
    await prisma.card.updateMany({
      where: {
        category: 'movie-collection'
      },
      data: {
        series: 'Movie Collection'
      }
    });
    
    await prisma.card.updateMany({
      where: {
        category: 'game-collection'
      },
      data: {
        series: 'Game Collection'
      }
    });
    
    console.log('Series data fixed for all categories');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCardSeries();