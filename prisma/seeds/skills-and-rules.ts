import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Skills, ActivitySkill mappings, and Badge Rules...");

  const skills = [
    {
      key: "python.fundamentals.variables",
      name: "Variables",
      category: "Python Fundamentals",
      difficulty: 1,
      description: "Understanding variables, assignment, and basic types",
    },
    {
      key: "python.fundamentals.control_flow",
      name: "Control Flow",
      category: "Python Fundamentals",
      difficulty: 1,
      description: "If/else, boolean logic, and branching",
    },
    {
      key: "python.fundamentals.loops",
      name: "Loops",
      category: "Python Fundamentals",
      difficulty: 1,
      description: "For/while loops, iteration patterns",
    },
    {
      key: "python.fundamentals.functions",
      name: "Functions",
      category: "Python Fundamentals",
      difficulty: 1,
      description: "Defining and calling functions, parameters and returns",
    },
    {
      key: "python.fundamentals.data_structures",
      name: "Data Structures",
      category: "Python Fundamentals",
      difficulty: 2,
      description: "Lists, tuples, dicts, sets and common operations",
    },
    {
      key: "python.fundamentals.error_handling",
      name: "Error Handling",
      category: "Python Fundamentals",
      difficulty: 2,
      description: "Exceptions, try/except, and defensive programming",
    },
    {
      key: "python.fundamentals.files",
      name: "Files and I/O",
      category: "Python Fundamentals",
      difficulty: 2,
      description: "Reading and writing files, I/O patterns",
    },
    {
      key: "python.fundamentals.oop",
      name: "OOP Basics",
      category: "Python Fundamentals",
      difficulty: 2,
      description: "Classes, objects, methods, and encapsulation",
    },
  ];

  // Upsert skills
  const skillMap: Record<string, string> = {}; // key -> id
  for (const s of skills) {
    const up = await prisma.skill.upsert({
      where: { key: s.key },
      update: {
        name: s.name,
        description: s.description,
        category: s.category,
        difficulty: s.difficulty,
        isActive: true,
      },
      create: {
        key: s.key,
        name: s.name,
        description: s.description,
        category: s.category,
        difficulty: s.difficulty,
        isActive: true,
      },
      select: { id: true, key: true },
    });
    skillMap[up.key] = up.id;
  }
  console.log(`Upserted ${Object.keys(skillMap).length} skills`);

  // Build simple ActivitySkill mappings by heuristics on titles/categories
  // We will try to map by category "Python Fundamentals"
  const fundamentalsActivities = await prisma.learningActivity.findMany({
    where: { isActive: true, category: "Python Fundamentals" },
    select: { id: true, title: true, difficulty: true },
  });

  type MapRule = { skillKey: string; includes: string[] };
  const mapRules: MapRule[] = [
    {
      skillKey: "python.fundamentals.variables",
      includes: ["variable", "assignment", "type", "data type"],
    },
    {
      skillKey: "python.fundamentals.control_flow",
      includes: ["if", "else", "elif", "control flow", "conditional"],
    },
    {
      skillKey: "python.fundamentals.loops",
      includes: ["loop", "for", "while", "iterate", "iteration"],
    },
    {
      skillKey: "python.fundamentals.functions",
      includes: ["function", "def", "parameter", "return"],
    },
    {
      skillKey: "python.fundamentals.data_structures",
      includes: [
        "list",
        "tuple",
        "dict",
        "dictionary",
        "set",
        "stack",
        "queue",
      ],
    },
    {
      skillKey: "python.fundamentals.error_handling",
      includes: ["exception", "error", "try", "except", "raise"],
    },
    {
      skillKey: "python.fundamentals.files",
      includes: ["file", "read", "write", "io", "i/o"],
    },
    {
      skillKey: "python.fundamentals.oop",
      includes: ["class", "object", "method", "oop", "inheritance"],
    },
  ];

  const toCreate: {
    activityId: string;
    skillId: string;
    weight: number;
    difficulty: number;
  }[] = [];

  for (const act of fundamentalsActivities) {
    const titleLc = (act.title || "").toLowerCase();
    for (const rule of mapRules) {
      const match = rule.includes.some((token) => titleLc.includes(token));
      if (match) {
        const skillId = skillMap[rule.skillKey];
        if (skillId) {
          toCreate.push({
            activityId: act.id,
            skillId,
            weight: 1.0,
            difficulty: Math.max(1, Math.min(3, act.difficulty ?? 1)),
          });
        }
      }
    }
  }

  if (toCreate.length > 0) {
    // Remove duplicates: unique by (activityId, skillId)
    const uniq = new Map<
      string,
      {
        activityId: string;
        skillId: string;
        weight: number;
        difficulty: number;
      }
    >();
    for (const r of toCreate) {
      uniq.set(`${r.activityId}:${r.skillId}`, r);
    }
    const rows = Array.from(uniq.values());
    // createMany supports skipDuplicates with unique constraint on (activityId, skillId)
    await prisma.activitySkill.createMany({
      data: rows,
      skipDuplicates: true,
    });
    console.log(`ActivitySkill mappings upserted: ${rows.length}`);
  } else {
    console.log(
      "No ActivitySkill mappings to create (heuristics found no matches)."
    );
  }

  // Seed some example Badges with BadgeRules
  // 1) Fundamentals Apprentice: activities completed + skill mastery
  const fundamentalsApprentice = await prisma.badge.upsert({
    where: { name: "fundamentals_apprentice" },
    update: {
      title: "Fundamentals Apprentice",
      description: "Learn Python fundamentals and reach basic mastery.",
      icon: "📘",
      category: "learning",
      rarity: "common",
      color: "#10B981",
      conditionType: "rules",
      condition: JSON.stringify({ seeded: true }),
      rewardDiamonds: 50,
      rewardXp: 100,
      isActive: true,
      isHidden: false,
      targetValue: 1,
    },
    create: {
      name: "fundamentals_apprentice",
      title: "Fundamentals Apprentice",
      description: "Learn Python fundamentals and reach basic mastery.",
      icon: "📘",
      category: "learning",
      rarity: "common",
      color: "#10B981",
      conditionType: "rules",
      condition: JSON.stringify({ seeded: true }),
      rewardDiamonds: 50,
      rewardXp: 100,
      isActive: true,
      isHidden: false,
      targetValue: 1,
    },
    select: { id: true },
  });

  // Clear existing rules for idempotency
  await prisma.badgeRule.deleteMany({
    where: { badgeId: fundamentalsApprentice.id },
  });
  await prisma.badgeRule.createMany({
    data: [
      {
        badgeId: fundamentalsApprentice.id,
        ruleType: "count",
        metric: "activities_completed",
        target: 5,
        weight: 0.4,
        definition: {
          category: "Python Fundamentals",
          difficultyGte: 1,
          difficultyLte: 3,
        },
        isActive: true,
      } as any,
      {
        badgeId: fundamentalsApprentice.id,
        ruleType: "skill_mastery",
        metric: "skill_mastery",
        target: 60,
        weight: 0.6,
        definition: {
          skillKey: "python.fundamentals.variables",
          masteryThreshold: 60,
        },
        isActive: true,
      } as any,
    ],
  });

  // 2) Quiz Master: answer 100 quiz questions correctly
  const quizMaster = await prisma.badge.upsert({
    where: { name: "quiz_master_rule" },
    update: {
      title: "Quiz Master",
      description: "Answer 100 quiz questions correctly.",
      icon: "🧠",
      category: "knowledge",
      rarity: "rare",
      color: "#3B82F6",
      conditionType: "rules",
      condition: JSON.stringify({ seeded: true }),
      rewardDiamonds: 200,
      rewardXp: 300,
      isActive: true,
      isHidden: false,
      targetValue: 1,
    },
    create: {
      name: "quiz_master_rule",
      title: "Quiz Master",
      description: "Answer 100 quiz questions correctly.",
      icon: "🧠",
      category: "knowledge",
      rarity: "rare",
      color: "#3B82F6",
      conditionType: "rules",
      condition: JSON.stringify({ seeded: true }),
      rewardDiamonds: 200,
      rewardXp: 300,
      isActive: true,
      isHidden: false,
      targetValue: 1,
    },
    select: { id: true },
  });
  await prisma.badgeRule.deleteMany({ where: { badgeId: quizMaster.id } });
  await prisma.badgeRule.create({
    data: {
      badgeId: quizMaster.id,
      ruleType: "count",
      metric: "quiz_correct",
      target: 100,
      weight: 1,
      definition: { timeWindowDays: null },
      isActive: true,
    } as any,
  });

  // 3) Streak Champion: maintain 30-day login streak
  const streakChampion = await prisma.badge.upsert({
    where: { name: "streak_champion_rule" },
    update: {
      title: "Streak Champion",
      description: "Maintain a 30-day login streak.",
      icon: "🔥",
      category: "engagement",
      rarity: "epic",
      color: "#F59E0B",
      conditionType: "rules",
      condition: JSON.stringify({ seeded: true }),
      rewardDiamonds: 500,
      rewardXp: 750,
      isActive: true,
      isHidden: false,
      targetValue: 1,
    },
    create: {
      name: "streak_champion_rule",
      title: "Streak Champion",
      description: "Maintain a 30-day login streak.",
      icon: "🔥",
      category: "engagement",
      rarity: "epic",
      color: "#F59E0B",
      conditionType: "rules",
      condition: JSON.stringify({ seeded: true }),
      rewardDiamonds: 500,
      rewardXp: 750,
      isActive: true,
      isHidden: false,
      targetValue: 1,
    },
    select: { id: true },
  });
  await prisma.badgeRule.deleteMany({ where: { badgeId: streakChampion.id } });
  await prisma.badgeRule.create({
    data: {
      badgeId: streakChampion.id,
      ruleType: "streak",
      metric: "login_streak",
      target: 30,
      weight: 1,
      definition: {},
      isActive: true,
    } as any,
  });

  console.log("Seeding complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("Seed failed", e);
    await prisma.$disconnect();
    process.exit(1);
  });
