import { prisma } from "../src/lib/prisma";

const moreBadges = [
  // Python Learning Progression Badges
  {
    name: "first_steps",
    title: "First Steps",
    description: "Complete your very first Python lesson",
    icon: "star",
    category: "Python",
    rarity: "common",
    color: "#10B981",
    rewardDiamonds: 25,
    rewardXp: 50,
    condition: JSON.stringify({
      type: "lessons_completed",
      target: 1,
    }),
  },
  {
    name: "python_explorer",
    title: "Python Explorer",
    description: "Complete 3 Python lessons",
    icon: "book",
    category: "Python",
    rarity: "uncommon",
    color: "#3B82F6",
    rewardDiamonds: 50,
    rewardXp: 100,
    condition: JSON.stringify({
      type: "lessons_completed",
      target: 3,
    }),
  },
  {
    name: "coding_enthusiast",
    title: "Coding Enthusiast",
    description: "Complete 5 Python lessons",
    icon: "code",
    category: "Python",
    rarity: "rare",
    color: "#8B5CF6",
    rewardDiamonds: 100,
    rewardXp: 200,
    condition: JSON.stringify({
      type: "lessons_completed",
      target: 5,
    }),
  },
  {
    name: "python_master",
    title: "Python Master",
    description: "Complete 10 Python lessons",
    icon: "crown",
    category: "Python",
    rarity: "epic",
    color: "#F59E0B",
    rewardDiamonds: 250,
    rewardXp: 500,
    condition: JSON.stringify({
      type: "lessons_completed",
      target: 10,
    }),
  },
  {
    name: "python_legend",
    title: "Python Legend",
    description: "Complete 20 Python lessons",
    icon: "trophy",
    category: "Python",
    rarity: "legendary",
    color: "#DC2626",
    rewardDiamonds: 500,
    rewardXp: 1000,
    condition: JSON.stringify({
      type: "lessons_completed",
      target: 20,
    }),
  },

  // Quiz & Achievement Badges
  {
    name: "quiz_champion",
    title: "Quiz Champion",
    description: "Pass your first quiz",
    icon: "target",
    category: "Python",
    rarity: "common",
    color: "#EF4444",
    rewardDiamonds: 30,
    rewardXp: 75,
    condition: JSON.stringify({
      type: "quizzes_completed",
      target: 1,
    }),
  },
  {
    name: "quiz_master",
    title: "Quiz Master",
    description: "Pass 5 quizzes",
    icon: "shield",
    category: "Python",
    rarity: "uncommon",
    color: "#7C3AED",
    rewardDiamonds: 80,
    rewardXp: 150,
    condition: JSON.stringify({
      type: "quizzes_completed",
      target: 5,
    }),
  },
  {
    name: "quiz_legend",
    title: "Quiz Legend",
    description: "Pass 15 quizzes",
    icon: "award",
    category: "Python",
    rarity: "epic",
    color: "#EC4899",
    rewardDiamonds: 300,
    rewardXp: 600,
    condition: JSON.stringify({
      type: "quizzes_completed",
      target: 15,
    }),
  },
  {
    name: "perfect_student",
    title: "Perfect Student",
    description: "Get a perfect score on a lesson",
    icon: "sparkles",
    category: "Python",
    rarity: "rare",
    color: "#F59E0B",
    rewardDiamonds: 75,
    rewardXp: 125,
    condition: JSON.stringify({
      type: "perfect_score",
      target: 1,
    }),
  },
  {
    name: "perfectionist",
    title: "Perfectionist",
    description: "Get perfect scores on 3 lessons",
    icon: "star",
    category: "Python",
    rarity: "epic",
    color: "#EC4899",
    rewardDiamonds: 200,
    rewardXp: 400,
    condition: JSON.stringify({
      type: "perfect_score",
      target: 3,
    }),
  },

  // Daily & Streak Badges
  {
    name: "dedicated_learner",
    title: "Dedicated Learner",
    description: "Login for 3 consecutive days",
    icon: "flame",
    category: "Daily",
    rarity: "uncommon",
    color: "#F97316",
    rewardDiamonds: 60,
    rewardXp: 100,
    condition: JSON.stringify({
      type: "login_streak",
      target: 3,
    }),
  },
  {
    name: "streak_warrior",
    title: "Streak Warrior",
    description: "Login for 7 consecutive days",
    icon: "flame",
    category: "Daily",
    rarity: "rare",
    color: "#DC2626",
    rewardDiamonds: 150,
    rewardXp: 250,
    condition: JSON.stringify({
      type: "login_streak",
      target: 7,
    }),
  },
  {
    name: "streak_master",
    title: "Streak Master",
    description: "Login for 15 consecutive days",
    icon: "flame",
    category: "Daily",
    rarity: "epic",
    color: "#B91C1C",
    rewardDiamonds: 400,
    rewardXp: 800,
    condition: JSON.stringify({
      type: "login_streak",
      target: 15,
    }),
  },
  {
    name: "streak_legend",
    title: "Streak Legend",
    description: "Login for 30 consecutive days",
    icon: "flame",
    category: "Daily",
    rarity: "legendary",
    color: "#7F1D1D",
    rewardDiamonds: 1000,
    rewardXp: 2000,
    condition: JSON.stringify({
      type: "login_streak",
      target: 30,
    }),
  },

  // Level & Progress Badges
  {
    name: "level_up",
    title: "Level Up!",
    description: "Reach level 5",
    icon: "zap",
    category: "Achievement",
    rarity: "rare",
    color: "#8B5CF6",
    rewardDiamonds: 100,
    rewardXp: 200,
    condition: JSON.stringify({
      type: "level_reached",
      target: 5,
    }),
  },
  {
    name: "rising_star",
    title: "Rising Star",
    description: "Reach level 10",
    icon: "star",
    category: "Achievement",
    rarity: "epic",
    color: "#F59E0B",
    rewardDiamonds: 300,
    rewardXp: 500,
    condition: JSON.stringify({
      type: "level_reached",
      target: 10,
    }),
  },
  {
    name: "high_achiever",
    title: "High Achiever",
    description: "Reach level 20",
    icon: "trophy",
    category: "Achievement",
    rarity: "epic",
    color: "#DC2626",
    rewardDiamonds: 600,
    rewardXp: 1000,
    condition: JSON.stringify({
      type: "level_reached",
      target: 20,
    }),
  },
  {
    name: "coding_veteran",
    title: "Coding Veteran",
    description: "Reach level 25",
    icon: "crown",
    category: "Achievement",
    rarity: "legendary",
    color: "#7C2D12",
    rewardDiamonds: 1000,
    rewardXp: 1500,
    condition: JSON.stringify({
      type: "level_reached",
      target: 25,
    }),
  },

  // Code Submission Badges
  {
    name: "code_warrior",
    title: "Code Warrior",
    description: "Submit 10 code solutions",
    icon: "code",
    category: "Python",
    rarity: "uncommon",
    color: "#059669",
    rewardDiamonds: 75,
    rewardXp: 150,
    condition: JSON.stringify({
      type: "code_submissions",
      target: 10,
    }),
  },
  {
    name: "code_ninja",
    title: "Code Ninja",
    description: "Submit 25 code solutions",
    icon: "users",
    category: "Python",
    rarity: "rare",
    color: "#047857",
    rewardDiamonds: 200,
    rewardXp: 350,
    condition: JSON.stringify({
      type: "code_submissions",
      target: 25,
    }),
  },
  {
    name: "coding_machine",
    title: "Coding Machine",
    description: "Submit 50 code solutions",
    icon: "gamepad",
    category: "Python",
    rarity: "epic",
    color: "#7C3AED",
    rewardDiamonds: 400,
    rewardXp: 750,
    condition: JSON.stringify({
      type: "code_submissions",
      target: 50,
    }),
  },

  // Special Achievement Badges
  {
    name: "early_bird",
    title: "Early Bird",
    description: "Complete your first lesson before 8 AM",
    icon: "clock",
    category: "Special",
    rarity: "rare",
    color: "#0EA5E9",
    rewardDiamonds: 150,
    rewardXp: 200,
    condition: JSON.stringify({
      type: "first_lesson",
      target: 1,
    }),
  },
  {
    name: "night_owl",
    title: "Night Owl",
    description: "Complete a lesson after 10 PM",
    icon: "users",
    category: "Special",
    rarity: "uncommon",
    color: "#6366F1",
    rewardDiamonds: 100,
    rewardXp: 150,
    condition: JSON.stringify({
      type: "lessons_completed",
      target: 1,
    }),
  },
  {
    name: "speed_demon",
    title: "Speed Demon",
    description: "Complete a lesson in under 10 minutes",
    icon: "zap",
    category: "Special",
    rarity: "rare",
    color: "#EF4444",
    rewardDiamonds: 125,
    rewardXp: 175,
    condition: JSON.stringify({
      type: "lessons_completed",
      target: 1,
    }),
  },
  {
    name: "knowledge_seeker",
    title: "Knowledge Seeker",
    description: "Complete lessons in 3 different categories",
    icon: "book",
    category: "Special",
    rarity: "epic",
    color: "#7C3AED",
    rewardDiamonds: 300,
    rewardXp: 400,
    condition: JSON.stringify({
      type: "lessons_completed",
      target: 3,
    }),
  },

  // Social & Community Badges
  {
    name: "helpful_coder",
    title: "Helpful Coder",
    description: "Help other students by sharing knowledge",
    icon: "heart",
    category: "Social",
    rarity: "uncommon",
    color: "#EC4899",
    rewardDiamonds: 100,
    rewardXp: 200,
    condition: JSON.stringify({
      type: "lessons_completed",
      target: 5,
    }),
  },
  {
    name: "mentor",
    title: "Mentor",
    description: "Guide and inspire fellow learners",
    icon: "users",
    category: "Social",
    rarity: "epic",
    color: "#10B981",
    rewardDiamonds: 500,
    rewardXp: 750,
    condition: JSON.stringify({
      type: "lessons_completed",
      target: 15,
    }),
  },

  // Diamond & XP Earning Badges
  {
    name: "treasure_hunter",
    title: "Treasure Hunter",
    description: "Earn 1000 total diamonds",
    icon: "diamond",
    category: "Achievement",
    rarity: "rare",
    color: "#FBBF24",
    rewardDiamonds: 200,
    rewardXp: 300,
    condition: JSON.stringify({
      type: "diamonds_earned",
      target: 1000,
    }),
  },
  {
    name: "diamond_collector",
    title: "Diamond Collector",
    description: "Earn 5000 total diamonds",
    icon: "diamond",
    category: "Achievement",
    rarity: "epic",
    color: "#F59E0B",
    rewardDiamonds: 1000,
    rewardXp: 1500,
    condition: JSON.stringify({
      type: "diamonds_earned",
      target: 5000,
    }),
  },
  {
    name: "xp_master",
    title: "XP Master",
    description: "Earn massive amounts of experience",
    icon: "zap",
    category: "Achievement",
    rarity: "legendary",
    color: "#7C3AED",
    rewardDiamonds: 2000,
    rewardXp: 3000,
    condition: JSON.stringify({
      type: "level_reached",
      target: 15,
    }),
  },
];

async function createMoreBadges() {
  console.log("Creating enhanced badge collection...");

  try {
    // First, update existing badges with rewards if they don't have them
    const existingBadges = await prisma.badge.findMany({
      where: {
        OR: [{ rewardDiamonds: { lte: 0 } }, { rewardXp: { lte: 0 } }],
      },
    });

    console.log(`Found ${existingBadges.length} badges without proper rewards`);

    for (const existingBadge of existingBadges) {
      const matchingNewBadge = moreBadges.find(
        (b) => b.name === existingBadge.name
      );
      if (matchingNewBadge) {
        await prisma.badge.update({
          where: { id: existingBadge.id },
          data: {
            rewardDiamonds: matchingNewBadge.rewardDiamonds,
            rewardXp: matchingNewBadge.rewardXp,
            color: matchingNewBadge.color,
          },
        });
        console.log(`✅ Updated existing badge: ${existingBadge.name}`);
      }
    }

    // Create new badges
    for (const badge of moreBadges) {
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
      }
    }

    const totalBadges = await prisma.badge.count();
    console.log(`🏆 Badge system complete! Total badges: ${totalBadges}`);
  } catch (error) {
    console.error("❌ Error creating badges:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createMoreBadges();
