import { prisma } from "@/lib/prisma";

/**
 * Adaptive Recommendations Service
 * - Scores LearningActivity records based on user's Skill Mastery gaps, recency, and diversity
 * - Persists a ranked queue in RecommendationQueue to avoid frequent recomputation
 *
 * Models used:
 * - Skill, ActivitySkill, UserSkillMastery
 * - LearningActivity, ActivityAttempt
 * - RecommendationQueue
 */

// Temporary any-cast to avoid IDE type staleness right after Prisma schema changes
const p: any = prisma;

export type RecommendationItem = {
  activityId: string;
  score: number;
  reasons: string[];
  category?: string;
  difficulty?: number;
  estimatedMinutes?: number;
};

export type RecommendationResult = {
  items: RecommendationItem[];
  generatedAt: string;
  expiresAt?: string | null;
};

type GenerateOptions = {
  limit?: number; // default 10
  ttlHours?: number; // default 6
};

function nowIso() {
  return new Date().toISOString();
}

function addHours(date: Date, hours: number) {
  const d = new Date(date);
  d.setHours(d.getHours() + hours);
  return d;
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

/**
 * Compute preferred difficulty based on user's current mastery distribution (simple heuristic).
 */
function preferredDifficultyFromMasteries(
  masteries: Array<{ mastery: number }>
) {
  if (!masteries.length) return 1;
  const avg =
    masteries.reduce((s, m) => s + (m.mastery ?? 0), 0) / masteries.length;
  if (avg < 40) return 1;
  if (avg < 70) return 2;
  return 3;
}

/**
 * Generate recommendations fresh and persist in RecommendationQueue.
 */
export async function generateRecommendationQueue(
  userId: string,
  options: GenerateOptions = {}
): Promise<RecommendationResult> {
  const limit = options.limit ?? 10;
  const ttl = options.ttlHours ?? 6;
  const now = new Date();

  // Load user mastery
  const userMasteries = await p.userSkillMastery.findMany({
    where: { userId },
    select: { skillId: true, mastery: true },
  });
  const masteryMap = new Map<string, number>(
    userMasteries.map((m: { skillId: string; mastery: number | null }) => [
      m.skillId,
      m.mastery ?? 0,
    ])
  );
  const prefDiff = preferredDifficultyFromMasteries(userMasteries);

  // Recent activity attempts for recency/diversity and completion
  const recentAttempts = await p.activityAttempt.findMany({
    where: { userId },
    orderBy: { startedAt: "desc" },
    take: 100,
    select: {
      activityId: true,
      completed: true,
      score: true,
      startedAt: true,
      completedAt: true,
      activity: {
        select: { id: true, category: true },
      },
    },
  });
  const completedSet = new Set<string>(
    recentAttempts
      .filter((a: { completed: boolean; activityId: string }) => a.completed)
      .map((a: { activityId: string }) => a.activityId)
  );
  const recentByActivity = new Map<string, number>();
  const categoryCount = new Map<string, number>();
  for (const a of recentAttempts) {
    recentByActivity.set(
      a.activityId as string,
      (recentByActivity.get(a.activityId as string) ?? 0) + 1
    );
    const cat = a.activity?.category ?? "general";
    categoryCount.set(cat, (categoryCount.get(cat) ?? 0) + 1);
  }
  const maxCatCount = Array.from(categoryCount.values()).reduce(
    (m, v) => Math.max(m, v),
    1
  );

  // Load activities with skill mappings
  const activities = await p.learningActivity.findMany({
    where: { isActive: true, isLocked: false },
    select: {
      id: true,
      title: true,
      category: true,
      difficulty: true,
      estimatedMinutes: true,
      sortOrder: true,
      activitySkills: {
        select: { skillId: true, weight: true, difficulty: true },
      },
    },
    orderBy: [{ sortOrder: "asc" }],
  });

  const items: RecommendationItem[] = [];

  for (const act of activities) {
    // Mastery gap score
    let gapSum = 0;
    let maxSum = 0;
    const reasons: string[] = [];

    if (!act.activitySkills || act.activitySkills.length === 0) {
      // If no skill mapping exists, skip scoring by mastery; give minimal base score
      gapSum = 20;
      maxSum = 100;
      reasons.push("No skill mapping; using base score");
    } else {
      for (const as of act.activitySkills) {
        const mastery = masteryMap.get(as.skillId) ?? 0; // unknown skill -> 0 mastery => prioritize
        const need = Math.max(0, 100 - mastery); // more need => higher score
        const weight = as.weight ?? 1;
        gapSum += need * weight;
        maxSum += 100 * weight;
      }
      if (gapSum > 0) reasons.push("Addresses low-mastery skills");
    }

    const masteryScore = clamp01(maxSum > 0 ? gapSum / maxSum : 0); // 0..1

    // Difficulty alignment: closer to preferred difficulty => better
    const diff = act.difficulty ?? 1;
    const diffAlignment = clamp01(1 - Math.abs(diff - prefDiff) / 3); // simple alignment in 0..1
    if (diffAlignment >= 0.66) reasons.push("Matches your current difficulty");

    // Diversity boost: categories seen less often recently are prioritized
    const cat = act.category ?? "general";
    const catSeen = categoryCount.get(cat) ?? 0;
    const diversityScore = clamp01(1 - catSeen / maxCatCount); // if unseen => closer to 1
    if (diversityScore > 0.5) reasons.push("Improves topic diversity");

    // Recency penalty: discourage repeating the same very recent activity
    const recentCount = recentByActivity.get(act.id) ?? 0;
    const recencyPenalty = clamp01(Math.min(0.5, recentCount * 0.2)); // up to -0.5

    // Completion penalty: if already completed, de-prioritize strongly
    const completedPenalty = completedSet.has(act.id) ? 0.6 : 0;

    // Final score
    let score = 0.6 * masteryScore + 0.2 * diffAlignment + 0.2 * diversityScore;
    score = score * (1 - recencyPenalty);
    score = score * (1 - completedPenalty);

    items.push({
      activityId: act.id,
      score,
      reasons,
      category: act.category ?? undefined,
      difficulty: act.difficulty ?? undefined,
      estimatedMinutes: act.estimatedMinutes ?? undefined,
    });
  }

  // Rank and slice
  items.sort((a, b) => b.score - a.score);
  const topItems = items.slice(0, limit);

  // Persist queue
  const expiresAt = addHours(now, ttl);
  await p.recommendationQueue.create({
    data: {
      userId,
      items: topItems,
      generatedAt: now,
      expiresAt,
    },
  });

  return {
    items: topItems,
    generatedAt: nowIso(),
    expiresAt: expiresAt.toISOString(),
  };
}

/**
 * Get existing queue if not expired; otherwise generate a fresh one.
 */
export async function getOrGenerateRecommendationQueue(
  userId: string,
  options: GenerateOptions = {}
): Promise<RecommendationResult> {
  const ttl = options.ttlHours ?? 6;
  const latest = await p.recommendationQueue.findFirst({
    where: { userId },
    orderBy: { generatedAt: "desc" },
  });

  const now = new Date();
  if (latest && latest.items && latest.generatedAt) {
    const exp = latest.expiresAt
      ? new Date(latest.expiresAt)
      : addHours(new Date(latest.generatedAt), ttl);
    if (exp > now) {
      return {
        items: latest.items as RecommendationItem[],
        generatedAt: (latest.generatedAt as Date).toISOString(),
        expiresAt: latest.expiresAt
          ? (latest.expiresAt as Date).toISOString()
          : undefined,
      };
    }
  }

  // Otherwise generate new
  return generateRecommendationQueue(userId, options);
}
