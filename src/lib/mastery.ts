import { prisma } from "@/lib/prisma";
// Temporary any-cast to avoid IDE type staleness after new Prisma models
const p: any = prisma;

/**
 * Mastery update parameters for an activity completion.
 */
export type ActivityCompletionInput = {
  userId: string;
  activityId: string;
  // Score 0..100
  score?: number;
  completed?: boolean;
  // Optional evidence counts to adjust mastery signals
  correctCount?: number;
  incorrectCount?: number;
  timeSpent?: number;
};

/**
 * Update skill mastery for a user based on activity completion.
 * Uses ActivitySkill mappings to distribute mastery deltas per skill.
 *
 * Mastery algorithm:
 * - Base delta = (score or completion) * weight * difficultyFactor
 * - difficultyFactor = 0.6 for diff=1, 1.0 for diff=2, 1.2 for diff=3
 * - Evidence increments: +correctCount, +streak on high-score completion, reset on low-score
 * - Caps mastery in [0, 100]
 */
export async function updateMasteryForActivityCompletion(
  input: ActivityCompletionInput
) {
  const {
    userId,
    activityId,
    score = 0,
    completed = false,
    correctCount = 0,
    incorrectCount = 0,
  } = input;

  // Load activity skills
  const activitySkills = await p.activitySkill.findMany({
    where: { activityId },
    select: {
      skillId: true,
      weight: true,
      difficulty: true,
    },
  });

  if (activitySkills.length === 0) {
    return { updated: 0 };
  }

  // Determine base strength from score or completion
  const normalized = Math.max(0, Math.min(1, score / 100));
  const completionBoost = completed ? 0.2 : 0; // small boost on completion
  const evidenceBonus = Math.max(0, correctCount - incorrectCount) * 0.02; // cap small extra bonus

  let count = 0;
  const now = new Date();

  for (const as of activitySkills) {
    const difficultyFactor =
      as.difficulty >= 3 ? 1.2 : as.difficulty === 2 ? 1.0 : 0.6;
    const baseDelta =
      (normalized + completionBoost + evidenceBonus) *
      as.weight *
      difficultyFactor;

    // Fetch current mastery
    const existing = await p.userSkillMastery.findUnique({
      where: { userId_skillId: { userId, skillId: as.skillId } },
      select: { id: true, mastery: true, streak: true, lastPracticedAt: true },
    });

    // Decide streak update
    let newStreak = existing?.streak ?? 0;
    if (completed && score >= 85) {
      newStreak += 1;
    } else if (completed && score < 50) {
      newStreak = 0;
    }

    const delta = Math.max(0, baseDelta) * 10; // scale to 0..10 per learning step
    const newMastery = Math.max(
      0,
      Math.min(100, (existing?.mastery ?? 0) + delta)
    );

    if (existing) {
      await p.userSkillMastery.update({
        where: { id: existing.id },
        data: {
          mastery: newMastery,
          evidenceCount: { increment: 1 },
          correctCount: { increment: correctCount },
          incorrectCount: { increment: incorrectCount },
          streak: newStreak,
          lastPracticedAt: now,
          updatedAt: now,
        },
      });
    } else {
      await p.userSkillMastery.create({
        data: {
          userId,
          skillId: as.skillId,
          mastery: newMastery,
          proficiency:
            newMastery >= 80
              ? 3
              : newMastery >= 50
                ? 2
                : newMastery >= 20
                  ? 1
                  : 0,
          evidenceCount: 1,
          correctCount,
          incorrectCount,
          streak: newStreak,
          lastPracticedAt: now,
          lastDecayAt: null,
        },
      });
    }
    count++;
  }

  return { updated: count };
}

/**
 * Apply spaced repetition style decay.
 * - If lastDecayAt is older than 'days', apply mastery *= decayFactor^days.
 * - Default decayFactor per record is used; fallback 0.99/day.
 */
export async function decayUserMastery(userId: string, maxDays = 7) {
  const masteries = await p.userSkillMastery.findMany({
    where: { userId },
    select: {
      id: true,
      mastery: true,
      decayFactor: true,
      lastDecayAt: true,
      updatedAt: true,
    },
  });

  const now = new Date();
  let updated = 0;

  for (const m of masteries) {
    const last = m.lastDecayAt ?? m.updatedAt ?? now;
    const days = Math.min(
      maxDays,
      Math.floor(
        (now.getTime() - new Date(last).getTime()) / (24 * 3600 * 1000)
      )
    );

    if (days <= 0) continue;

    const df = m.decayFactor || 0.99;
    const factor = Math.pow(df, days);
    const newMastery = Math.max(0, Math.min(100, m.mastery * factor));

    if (newMastery !== m.mastery) {
      await p.userSkillMastery.update({
        where: { id: m.id },
        data: { mastery: newMastery, lastDecayAt: now, updatedAt: now },
      });
      updated++;
    }
  }

  return { updated };
}
