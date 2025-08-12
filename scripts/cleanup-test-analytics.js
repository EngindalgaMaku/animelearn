const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function cleanupTestData() {
  try {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log("Checking analytics data...");

    // Count today's records (test data)
    const todayCount = await prisma.analytics.count({
      where: {
        date: {
          gte: today,
        },
      },
    });

    console.log(`Found ${todayCount} test records created today`);

    if (todayCount > 0) {
      // Delete today's test data
      const deleted = await prisma.analytics.deleteMany({
        where: {
          date: {
            gte: today,
          },
        },
      });

      console.log(`✅ Deleted ${deleted.count} test analytics records`);
    }

    // Show final count
    const finalCount = await prisma.analytics.count();
    console.log(`📊 Remaining analytics records: ${finalCount}`);

    // Show date range of remaining data
    const oldest = await prisma.analytics.findFirst({
      orderBy: { date: "asc" },
      select: { date: true },
    });

    const newest = await prisma.analytics.findFirst({
      orderBy: { date: "desc" },
      select: { date: true },
    });

    if (oldest && newest) {
      console.log(
        `📅 Date range: ${oldest.date.toISOString().split("T")[0]} to ${newest.date.toISOString().split("T")[0]}`
      );
    }
  } catch (error) {
    console.error("Error cleaning up test data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupTestData();
