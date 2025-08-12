const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    // Get some existing cards
    const cards = await prisma.card.findMany({
      take: 10,
      select: { id: true, name: true },
    });

    if (cards.length === 0) {
      console.log("No cards found in database. Please add some cards first.");
      return;
    }

    console.log(`Found ${cards.length} cards. Creating analytics data...`);

    // Create analytics data for the last 30 days
    const today = new Date();
    const analyticsData = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      for (const card of cards) {
        // Generate random analytics data
        const views = Math.floor(Math.random() * 100) + 1;
        const searches = Math.floor(Math.random() * 50) + 1;
        const estimatedValue = Math.random() * 500 + 50;
        const marketValue = estimatedValue + (Math.random() - 0.5) * 100;
        const priceChange = (Math.random() - 0.5) * 20; // -10% to +10%

        analyticsData.push({
          cardId: card.id,
          date: date,
          estimatedValue: Math.round(estimatedValue * 100) / 100,
          marketValue: Math.round(marketValue * 100) / 100,
          priceChange: Math.round(priceChange * 100) / 100,
          views: views,
          searches: searches,
        });
      }
    }

    // Insert analytics data in batches
    const batchSize = 100;
    for (let i = 0; i < analyticsData.length; i += batchSize) {
      const batch = analyticsData.slice(i, i + batchSize);
      await prisma.analytics.createMany({
        data: batch,
        skipDuplicates: true,
      });
      console.log(
        `Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(analyticsData.length / batchSize)}`
      );
    }

    console.log(
      `✅ Successfully created ${analyticsData.length} analytics records`
    );

    // Show summary
    const totalAnalytics = await prisma.analytics.count();
    const totalViews = await prisma.analytics.aggregate({
      _sum: { views: true, searches: true },
    });

    console.log(`📊 Analytics Summary:`);
    console.log(`   Total Records: ${totalAnalytics}`);
    console.log(`   Total Views: ${totalViews._sum.views || 0}`);
    console.log(`   Total Searches: ${totalViews._sum.searches || 0}`);
  } catch (error) {
    console.error("Error seeding analytics:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
