import { prisma } from "../src/lib/prisma";

const quizStreakBadges = [
  {
    name: "quiz_streak_starter",
    title: "Quiz Streak Starter",
    description: "Get 5 correct answers in a row in Quiz Arena",
    icon: "🔥",
    category: "Quiz Arena",
    rarity: "common",
    color: "#10B981",
    rewardDiamonds: 50,
    rewardXp: 100,
    conditionType: "quiz_streak",
    condition: JSON.stringify({
      type: "quiz_streak",
      target: 5,
    }),
  },
  {
    name: "quiz_streak_warrior",
    title: "Quiz Streak Warrior", 
    description: "Get 10 correct answers in a row in Quiz Arena",
    icon: "⚔️",
    category: "Quiz Arena",
    rarity: "uncommon",
    color: "#3B82F6",
    rewardDiamonds: 100,
    rewardXp: 200,
    conditionType: "quiz_streak",
    condition: JSON.stringify({
      type: "quiz_streak",
      target: 10,
    }),
  },
  {
    name: "quiz_streak_master",
    title: "Quiz Streak Master",
    description: "Get 15 correct answers in a row in Quiz Arena",
    icon: "🏆",
    category: "Quiz Arena", 
    rarity: "rare",
    color: "#8B5CF6",
    rewardDiamonds: 200,
    rewardXp: 400,
    conditionType: "quiz_streak",
    condition: JSON.stringify({
      type: "quiz_streak",
      target: 15,
    }),
  },
  {
    name: "quiz_streak_legend",
    title: "Quiz Streak Legend",
    description: "Get 20 correct answers in a row in Quiz Arena",
    icon: "⭐",
    category: "Quiz Arena",
    rarity: "epic",
    color: "#F59E0B",
    rewardDiamonds: 400,
    rewardXp: 800,
    conditionType: "quiz_streak",
    condition: JSON.stringify({
      type: "quiz_streak",
      target: 20,
    }),
  },
  {
    name: "quiz_streak_god",
    title: "Quiz Streak God",
    description: "Get 25 correct answers in a row in Quiz Arena",
    icon: "👑",
    category: "Quiz Arena",
    rarity: "epic",
    color: "#DC2626",
    rewardDiamonds: 600,
    rewardXp: 1200,
    conditionType: "quiz_streak",
    condition: JSON.stringify({
      type: "quiz_streak",
      target: 25,
    }),
  },
  {
    name: "quiz_streak_immortal",
    title: "Quiz Streak Immortal",
    description: "Get 50 correct answers in a row in Quiz Arena - Ultimate Achievement!",
    icon: "💎",
    category: "Quiz Arena",
    rarity: "legendary",
    color: "#7C2D12",
    rewardDiamonds: 1500,
    rewardXp: 3000,
    conditionType: "quiz_streak",
    condition: JSON.stringify({
      type: "quiz_streak",
      target: 50,
    }),
  },
  {
    name: "quiz_perfectionist",
    title: "Quiz Perfectionist",
    description: "Complete 5 quizzes without any wrong answers",
    icon: "✨",
    category: "Quiz Arena",
    rarity: "rare",
    color: "#EC4899",
    rewardDiamonds: 300,
    rewardXp: 500,
    conditionType: "perfect_quizzes",
    condition: JSON.stringify({
      type: "perfect_quizzes",
      target: 5,
    }),
  },
  {
    name: "quiz_speed_demon",
    title: "Quiz Speed Demon",
    description: "Answer 10 questions correctly in under 5 seconds each",
    icon: "⚡",
    category: "Quiz Arena",
    rarity: "epic",
    color: "#EF4444",
    rewardDiamonds: 500,
    rewardXp: 1000,
    conditionType: "fast_answers",
    condition: JSON.stringify({
      type: "fast_answers",
      target: 10,
    }),
  },
  {
    name: "quiz_marathon_runner",
    title: "Quiz Marathon Runner",
    description: "Complete 10 quiz sessions in a single day",
    icon: "🏃‍♂️",
    category: "Quiz Arena",
    rarity: "epic",
    color: "#059669",
    rewardDiamonds: 400,
    rewardXp: 750,
    conditionType: "daily_quiz_sessions",
    condition: JSON.stringify({
      type: "daily_quiz_sessions",
      target: 10,
    }),
  },
  {
    name: "quiz_comeback_king",
    title: "Quiz Comeback King",
    description: "Get a 10+ streak after making a mistake",
    icon: "🔄",
    category: "Quiz Arena",
    rarity: "rare",
    color: "#6366F1",
    rewardDiamonds: 250,
    rewardXp: 400,
    conditionType: "comeback_streak",
    condition: JSON.stringify({
      type: "comeback_streak",
      target: 10,
    }),
  }
];

async function createQuizStreakBadges() {
  console.log("🎯 Creating Quiz Arena Streak Badges...");

  try {
    for (const badge of quizStreakBadges) {
      const existing = await prisma.badge.findUnique({
        where: { name: badge.name },
      });

      if (!existing) {
        await prisma.badge.create({
          data: badge,
        });
        console.log(
          `✅ Created quiz streak badge: ${badge.title} (${badge.rewardDiamonds} 💎, ${badge.rewardXp} XP)`
        );
      } else {
        console.log(`⚠️  Quiz streak badge ${badge.title} already exists, skipping...`);
      }
    }

    const totalBadges = await prisma.badge.count();
    console.log(`🏆 Quiz Arena badges created! Total badges: ${totalBadges}`);
    
    // Quiz Arena kategorisindeki badge sayısını göster
    const quizArenaBadges = await prisma.badge.count({
      where: { category: "Quiz Arena" }
    });
    console.log(`🎮 Quiz Arena category badges: ${quizArenaBadges}`);
    
  } catch (error) {
    console.error("❌ Error creating quiz streak badges:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createQuizStreakBadges();