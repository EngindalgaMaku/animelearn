import { prisma } from "../src/lib/prisma";

const additionalBadges = [
  // Advanced Python Learning Badges (5)
  {
    name: "python_function_master",
    title: "Function Master",
    description: "Demonstrate advanced function usage and best practices",
    icon: "code",
    category: "Python",
    rarity: "rare",
    color: "#3B82F6",
    rewardDiamonds: 300,
    rewardXp: 500,
    condition: JSON.stringify({
      type: "lessons_completed",
      target: 20,
    }),
  },
  {
    name: "python_class_architect",
    title: "Class Architect",
    description: "Master object-oriented programming concepts",
    icon: "shield",
    category: "Python",
    rarity: "epic",
    color: "#8B5CF6",
    rewardDiamonds: 500,
    rewardXp: 800,
    condition: JSON.stringify({
      type: "lessons_completed",
      target: 15,
    }),
  },
  {
    name: "python_library_explorer",
    title: "Library Explorer",
    description: "Use multiple Python libraries effectively",
    icon: "book",
    category: "Python",
    rarity: "rare",
    color: "#059669",
    rewardDiamonds: 250,
    rewardXp: 400,
    condition: JSON.stringify({
      type: "lessons_completed",
      target: 10,
    }),
  },
  {
    name: "python_debugging_ninja",
    title: "Debugging Ninja",
    description: "Successfully fix complex code errors",
    icon: "target",
    category: "Python",
    rarity: "epic",
    color: "#DC2626",
    rewardDiamonds: 400,
    rewardXp: 600,
    condition: JSON.stringify({
      type: "code_submissions",
      target: 25,
    }),
  },
  {
    name: "python_algorithm_genius",
    title: "Algorithm Genius",
    description: "Implement advanced algorithms and data structures",
    icon: "trending",
    category: "Python",
    rarity: "legendary",
    color: "#F59E0B",
    rewardDiamonds: 1000,
    rewardXp: 1500,
    condition: JSON.stringify({
      type: "lessons_completed",
      target: 12,
    }),
  },

  // Extended Daily/Streak Badges (4)
  {
    name: "mega_streak_master",
    title: "Mega Streak Master",
    description: "Maintain a 100-day learning streak",
    icon: "flame",
    category: "Günlük",
    rarity: "legendary",
    color: "#DC2626",
    rewardDiamonds: 2000,
    rewardXp: 3000,
    condition: JSON.stringify({
      type: "login_streak",
      target: 100,
    }),
  },
  {
    name: "weekend_warrior",
    title: "Weekend Warrior",
    description: "Learn consistently on weekends for a month",
    icon: "calendar",
    category: "Günlük",
    rarity: "rare",
    color: "#059669",
    rewardDiamonds: 200,
    rewardXp: 350,
    condition: JSON.stringify({
      type: "weekend_learning",
      target: 8,
    }),
  },
  {
    name: "morning_scholar",
    title: "Morning Scholar",
    description: "Complete lessons before 9 AM for 14 days",
    icon: "clock",
    category: "Günlük",
    rarity: "uncommon",
    color: "#0EA5E9",
    rewardDiamonds: 150,
    rewardXp: 250,
    condition: JSON.stringify({
      type: "morning_learning",
      target: 14,
    }),
  },
  {
    name: "midnight_coder",
    title: "Midnight Coder",
    description: "Code after midnight for 10 sessions",
    icon: "clock",
    category: "Özel",
    rarity: "rare",
    color: "#6366F1",
    rewardDiamonds: 300,
    rewardXp: 400,
    condition: JSON.stringify({
      type: "midnight_coding",
      target: 10,
    }),
  },

  // Advanced Social Badges (3)
  {
    name: "community_leader",
    title: "Community Leader",
    description: "Help 50 other students with their questions",
    icon: "users",
    category: "Sosyal",
    rarity: "epic",
    color: "#10B981",
    rewardDiamonds: 600,
    rewardXp: 800,
    condition: JSON.stringify({
      type: "help_others",
      target: 50,
    }),
  },
  {
    name: "mentor_master",
    title: "Mentor Master",
    description: "Successfully mentor 10 junior developers",
    icon: "crown",
    category: "Sosyal",
    rarity: "legendary",
    color: "#F59E0B",
    rewardDiamonds: 1500,
    rewardXp: 2000,
    condition: JSON.stringify({
      type: "mentor_students",
      target: 10,
    }),
  },
  {
    name: "collaboration_champion",
    title: "Collaboration Champion",
    description: "Work on group projects with other students",
    icon: "heart",
    category: "Sosyal",
    rarity: "rare",
    color: "#EC4899",
    rewardDiamonds: 250,
    rewardXp: 400,
    condition: JSON.stringify({
      type: "group_projects",
      target: 5,
    }),
  },

  // Special Achievement Badges (4)
  {
    name: "speed_demon_advanced",
    title: "Speed Demon",
    description: "Complete a lesson in under 2 minutes",
    icon: "zap",
    category: "Başarı",
    rarity: "rare",
    color: "#EF4444",
    rewardDiamonds: 200,
    rewardXp: 300,
    condition: JSON.stringify({
      type: "speed_completion",
      target: 1,
    }),
  },
  {
    name: "perfectionist_advanced",
    title: "Perfectionist",
    description: "Get 100% score on 20 different quizzes",
    icon: "star",
    category: "Başarı",
    rarity: "epic",
    color: "#FBBF24",
    rewardDiamonds: 500,
    rewardXp: 700,
    condition: JSON.stringify({
      type: "perfect_scores",
      target: 20,
    }),
  },
  {
    name: "comeback_king",
    title: "Comeback King",
    description: "Return to learning after 30 days break",
    icon: "trending",
    category: "Özel",
    rarity: "uncommon",
    color: "#6366F1",
    rewardDiamonds: 100,
    rewardXp: 200,
    condition: JSON.stringify({
      type: "comeback",
      target: 1,
    }),
  },
  {
    name: "innovation_pioneer",
    title: "Innovation Pioneer",
    description: "Create unique solutions to coding challenges",
    icon: "sparkles",
    category: "Başarı",
    rarity: "epic",
    color: "#7C3AED",
    rewardDiamonds: 400,
    rewardXp: 600,
    condition: JSON.stringify({
      type: "creative_solutions",
      target: 15,
    }),
  },

  // Extended Card Collection Badges (4)
  {
    name: "rare_card_hunter",
    title: "Rare Card Hunter",
    description: "Collect 50 rare or higher rarity cards",
    icon: "diamond",
    category: "Kart",
    rarity: "epic",
    color: "#FBBF24",
    rewardDiamonds: 800,
    rewardXp: 1000,
    condition: JSON.stringify({
      type: "rare_cards",
      target: 50,
    }),
  },
  {
    name: "legendary_collector",
    title: "Legendary Collector",
    description: "Own 10 legendary cards",
    icon: "crown",
    category: "Kart",
    rarity: "legendary",
    color: "#F59E0B",
    rewardDiamonds: 2000,
    rewardXp: 2500,
    condition: JSON.stringify({
      type: "legendary_cards",
      target: 10,
    }),
  },
  {
    name: "pack_opener_supreme",
    title: "Pack Opener Supreme",
    description: "Open 500 card packs",
    icon: "gift",
    category: "Kart",
    rarity: "epic",
    color: "#8B5CF6",
    rewardDiamonds: 600,
    rewardXp: 900,
    condition: JSON.stringify({
      type: "packs_opened",
      target: 500,
    }),
  },
  {
    name: "trading_tycoon",
    title: "Trading Tycoon",
    description: "Successfully trade cards 100 times",
    icon: "shopping",
    category: "Kart",
    rarity: "rare",
    color: "#059669",
    rewardDiamonds: 400,
    rewardXp: 500,
    condition: JSON.stringify({
      type: "successful_trades",
      target: 100,
    }),
  },
];

async function createAdditionalBadges() {
  console.log("🎯 Creating additional 20 badges for total of 50...");

  try {
    // Create new badges
    for (const badge of additionalBadges) {
      const existing = await prisma.badge.findUnique({
        where: { name: badge.name },
      });

      if (!existing) {
        await prisma.badge.create({
          data: badge,
        });
        console.log(
          `✅ Created new badge: ${badge.title} (${badge.rewardDiamonds} 💎, ${badge.rewardXp} XP)`
        );
      } else {
        console.log(`⚠️  Badge ${badge.title} already exists, skipping...`);
      }
    }

    const totalBadges = await prisma.badge.count();
    console.log(`🏆 Badge system expanded! Total badges: ${totalBadges}`);
  } catch (error) {
    console.error("❌ Error creating badges:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdditionalBadges();
