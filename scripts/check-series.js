const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function checkCardSeries() {
  try {
    const cards = await prisma.card.findMany({
      select: {
        id: true,
        name: true,
        series: true,
        category: true
      },
      take: 15
    });
    
    console.log('Card series data:');
    cards.forEach(card => {
      console.log(`- ${card.name}: series="${card.series}", category="${card.category}"`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCardSeries();