const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function fixAnimeCategory() {
  try {
    console.log('🔍 Searching for cards with "anime" category...');
    
    // Find all cards with category "anime"
    const cardsToUpdate = await prisma.card.findMany({
      where: {
        category: 'anime'
      },
      select: {
        id: true,
        name: true,
        category: true
      }
    });

    console.log(`📊 Found ${cardsToUpdate.length} cards with "anime" category`);

    if (cardsToUpdate.length === 0) {
      console.log('✅ No cards need to be updated');
      return;
    }

    // Update all cards from "anime" to "anime-collection"
    const updateResult = await prisma.card.updateMany({
      where: {
        category: 'anime'
      },
      data: {
        category: 'anime-collection'
      }
    });

    console.log(`✅ Successfully updated ${updateResult.count} cards from "anime" to "anime-collection"`);

    // Verify the update
    const remainingAnimeCards = await prisma.card.count({
      where: {
        category: 'anime'
      }
    });

    console.log(`🔍 Remaining cards with "anime" category: ${remainingAnimeCards}`);

    // Show current category distribution
    const categoryStats = await prisma.card.groupBy({
      by: ['category'],
      _count: {
        id: true
      }
    });

    console.log('\n📈 Updated category distribution:');
    categoryStats.forEach(stat => {
      console.log(`  - ${stat.category}: ${stat._count.id} cards`);
    });

  } catch (error) {
    console.error('❌ Error fixing anime category:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
fixAnimeCategory();