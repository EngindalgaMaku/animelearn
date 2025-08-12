const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkAnalytics() {
  const count = await prisma.analytics.count();
  console.log("Total analytics records:", count);

  const oldest = await prisma.analytics.findFirst({
    orderBy: { date: "asc" },
    select: { date: true, cardId: true },
  });

  const newest = await prisma.analytics.findFirst({
    orderBy: { date: "desc" },
    select: { date: true, cardId: true },
  });

  console.log("Oldest record:", oldest?.date);
  console.log("Newest record:", newest?.date);

  // Check how many records were created today (likely test data)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayCount = await prisma.analytics.count({
    where: {
      date: {
        gte: today,
      },
    },
  });

  console.log("Records created today:", todayCount);

  await prisma.$disconnect();
}

checkAnalytics();
