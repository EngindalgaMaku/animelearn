import { prisma } from "../src/lib/prisma";

const initialBadges = [
  {
    name: "first_steps",
    title: "First Steps",
    description: "Complete your very first Python lesson",
    icon: "star",
    category: "Python",
    rarity: "common",
    color: "#10B981",
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
    condition: JSON.stringify({
      type: "lessons_completed",
      target: 10,
    }),
  },
  {
    name: "quiz_champion",
    title: "Quiz Champion",
    description: "Pass your first quiz",
    icon: "target",
    category: "Python",
    rarity: "common",
    color: "#EF4444",
    condition: JSON.stringify({
      type: "quizzes_completed",
      target: 1,
    }),
  },
  {
    name: "perfect_student",
    title: "Perfect Student",
    description: "Get a perfect score on a lesson",
    icon: "trophy",
    category: "Python",
    rarity: "rare",
    color: "#F59E0B",
    condition: JSON.stringify({
      type: "perfect_score",
      target: 1,
    }),
  },
  {
    name: "dedicated_learner",
    title: "Dedicated Learner",
    description: "Login for 3 consecutive days",
    icon: "flame",
    category: "Daily",
    rarity: "uncommon",
    color: "#F97316",
    condition: JSON.stringify({
      type: "login_streak",
      target: 3,
    }),
  },
  {
    name: "level_up",
    title: "Level Up!",
    description: "Reach level 5",
    icon: "zap",
    category: "Achievement",
    rarity: "rare",
    color: "#8B5CF6",
    condition: JSON.stringify({
      type: "level_reached",
      target: 5,
    }),
  },
];

async function createInitialBadges() {
  console.log("Creating initial badges...");

  try {
    for (const badge of initialBadges) {
      const existing = await prisma.badge.findUnique({
        where: { name: badge.name },
      });

      if (!existing) {
        await prisma.badge.create({
          data: badge,
        });
        console.log(`✅ Created badge: ${badge.title}`);
      } else {
        console.log(`⏭️  Badge already exists: ${badge.title}`);
      }
    }

    console.log("✅ Initial badges created successfully!");
  } catch (error) {
    console.error("❌ Error creating badges:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createInitialBadges();
