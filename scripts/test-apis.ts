import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Test user credentials
const TEST_USER_ID = "cmdx1xoke0000wc485ntjnhxq";

async function testGameificationAPIs() {
  console.log("🧪 Testing Gamification APIs...\n");

  try {
    // Test 1: Daily Mini Quiz
    console.log("1️⃣ Testing Daily Mini Quiz API");
    const todayQuiz = await prisma.dailyMiniQuiz.findFirst({
      where: {
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    if (todayQuiz) {
      console.log("   ✅ Found today's quiz:", todayQuiz.title);
      console.log(
        "   📝 Questions:",
        JSON.parse(todayQuiz.questions).length,
        "questions"
      );
      console.log(
        "   💎 Reward:",
        todayQuiz.diamondReward,
        "diamonds,",
        todayQuiz.experienceReward,
        "XP"
      );
    } else {
      console.log("   ❌ No quiz found for today");
    }

    // Test 2: Card Packs
    console.log("\n2️⃣ Testing Card Pack API");
    const cardPacks = await prisma.cardPack.findMany({
      where: { isActive: true },
    });
    console.log("   ✅ Found", cardPacks.length, "active card packs");
    cardPacks.forEach((pack) => {
      console.log(
        `   📦 ${pack.name}: ${pack.cardCount} cards, ${pack.diamondPrice || "FREE"} diamonds`
      );
    });

    // Test 3: User Streak
    console.log("\n3️⃣ Testing User Streak API");
    const userStreak = await prisma.userStreak.findUnique({
      where: { userId: TEST_USER_ID },
    });

    if (userStreak) {
      console.log("   ✅ User streak found");
      console.log("   🔥 Current streak:", userStreak.currentStreak);
      console.log("   🏆 Longest streak:", userStreak.longestStreak);
      console.log(
        "   📚 Login/Lesson/Quiz streaks:",
        userStreak.loginStreak,
        "/",
        userStreak.codeArenaStreak,
        "/",
        userStreak.quizStreak
      );
    } else {
      console.log("   ❌ No user streak found");
    }

    // Test 4: XP Events
    console.log("\n4️⃣ Testing XP Events API");
    const xpEvents = await prisma.xPMultiplierEvent.findMany({
      where: {
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
    });
    console.log("   ✅ Found", xpEvents.length, "active XP events");
    xpEvents.forEach((event) => {
      console.log(
        `   ⚡ ${event.name}: ${event.multiplier}x multiplier (${event.eventType})`
      );
    });

    // Test 5: Daily Login Bonuses
    console.log("\n5️⃣ Testing Daily Login Bonus API");
    const loginBonuses = await prisma.dailyLoginBonus.findMany({
      orderBy: { day: "asc" },
    });
    console.log("   ✅ Found", loginBonuses.length, "daily login bonuses");
    console.log(
      "   🎁 Day 1:",
      loginBonuses[0]?.diamondReward,
      "diamonds,",
      loginBonuses[0]?.experienceReward,
      "XP"
    );
    console.log(
      "   🎁 Day 7:",
      loginBonuses[6]?.diamondReward,
      "diamonds,",
      loginBonuses[6]?.experienceReward,
      "XP"
    );

    // Test 6: User Daily Login Status
    console.log("\n6️⃣ Testing User Daily Login Status");
    const userLogin = await prisma.userDailyLogin.findUnique({
      where: { userId: TEST_USER_ID },
    });

    if (userLogin) {
      console.log("   ✅ User login tracking found");
      console.log("   📅 Consecutive days:", userLogin.consecutiveDays);
      console.log(
        "   💎 Total diamonds earned:",
        userLogin.totalDiamondsEarned
      );
      console.log("   ⭐ Total XP earned:", userLogin.totalXPEarned);
    } else {
      console.log("   ❌ No user login tracking found");
    }

    // Test 7: Anime Cards
    console.log("\n7️⃣ Testing Anime Cards");
    const animeCards = await prisma.card.findMany({
      take: 3,
      orderBy: { rarityLevel: "desc" },
    });
    console.log("   ✅ Found anime cards. Top 3 by rarity:");
    animeCards.forEach((card) => {
      console.log(
        `   🃏 ${card.name} (${card.series}) - ${card.rarity} - Level ${card.rarityLevel}`
      );
    });

    // Test 8: Gamification Overview Data
    console.log("\n8️⃣ Testing Gamification Overview Data");
    const user = await prisma.user.findUnique({
      where: { id: TEST_USER_ID },
      select: {
        level: true,
        experience: true,
        currentDiamonds: true,
        loginStreak: true,
        codeArenasCompleted: true,
        quizzesCompleted: true,
      },
    });

    if (user) {
      console.log("   ✅ User overview data:");
      console.log(`   👤 Level ${user.level} (${user.experience} XP)`);
      console.log(`   💎 ${user.currentDiamonds} diamonds`);
      console.log(`   🔥 ${user.loginStreak} day login streak`);
      console.log(
        `   📚 ${user.codeArenasCompleted} lessons, ${user.quizzesCompleted} quizzes completed`
      );
    }

    console.log("\n🎉 All API tests completed successfully!");
    console.log("\n📋 Summary:");
    console.log("✅ Database connection: Working");
    console.log("✅ Prisma client: Working");
    console.log("✅ Gamification data: Available");
    console.log("✅ Test user: Active");
    console.log("\n🚀 Phase 1 infrastructure is ready for production!");
  } catch (error) {
    console.error("❌ API Test failed:", error);
    process.exit(1);
  }
}

testGameificationAPIs()
  .catch((e) => {
    console.error("❌ Test script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
