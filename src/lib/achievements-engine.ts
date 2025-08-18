// NOTE: Temporary compatibility: access newly generated Prisma models as 'any' to avoid type-staleness during dev.
// After Prisma Client refresh in IDE, you can remove 'p as any' casting below.
import { prisma } from "@/lib/prisma";
import type {
  BadgeRuleDefinition,
  RuleEvaluationResult,
  AchievementAggregationResult,
} from "../types/gamification";

// Prisma any-cast for newly added models during type staleness
const p: any = prisma;

/**
 * Achievements Engine
 * - Evaluates Badge rules (BadgeRule) for a user
 * - Aggregates rule progress into percent and current/target sums
 * - Persists UserBadge progress and awards on completion (optional)
 *
 * Important schema models involved:
 * - Badge (with .rules: BadgeRule[])
 * - BadgeRule (ruleType, metric, target, weight, definition JSON)
 * - UserBadge (progress percent, progressData JSON, isUnlocked, isCompleted)
 */

// Utilities

function parseDefinition(def: any): BadgeRuleDefinition {
  if (!def) return {};
  if (typeof def === "string") {
    try {
      return JSON.parse(def);
    } catch {
      return {};
    }
  }
  return def as BadgeRuleDefinition;
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function bounded(val: number, min = 0, max = Number.POSITIVE_INFINITY) {
  return Math.max(min, Math.min(max, val));
}

function pct(n: number) {
  return Math.round(bounded(n, 0, 1) * 100);
}

type BadgeWithRules = {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  color: string;
  condition: string;
  rewardDiamonds: number;
  rewardXp: number;
  isActive: boolean;
  isHidden: boolean;
  targetValue: number;
  sortOrder: number;
  rewardCardPack: string | null;
  specialReward: string | null;
  rules: Array<{
    id: string;
    ruleType: string;
    metric: string;
    target: number | null;
    weight: number;
    definition: any | null;
    isActive: boolean;
  }>;
};

export type ComputedBadgeProgress = {
  badgeId: string;
  progressPercent: number; // 0..100
  isUnlocked: boolean;
  isCompleted: boolean;
  progressCurrentSum: number; // sum of min(current, target) across rules
  progressTargetSum: number; // sum of targets across rules (boolean/no-target rules contribute target=1)
  ruleResults: Array<
    RuleEvaluationResult & {
      ruleId: string;
      weight: number;
      metric: string;
      ruleType: string;
      targetResolved: number;
    }
  >;
};

// Core evaluation

async function evaluateRule(
  userId: string,
  rule: BadgeWithRules["rules"][number]
): Promise<RuleEvaluationResult & { targetResolved: number }> {
  const def = parseDefinition(rule.definition);
  const metric = rule.metric;
  const timeFilter =
    def.timeWindowDays && def.timeWindowDays > 0
      ? { gte: daysAgo(def.timeWindowDays) }
      : undefined;

  // Helper to map activity filters
  const activityFilter: any = {};
  if (def.category) {
    activityFilter.category = def.category;
  }
  if (def.activityType) {
    activityFilter.activityType = def.activityType;
  }
  if (def.difficultyGte || def.difficultyLte) {
    activityFilter.difficulty = {};
    if (def.difficultyGte) activityFilter.difficulty.gte = def.difficultyGte;
    if (def.difficultyLte) activityFilter.difficulty.lte = def.difficultyLte;
  }
  // naive tag filter: 'tags' is a String? field; we match substrings for each tag
  let tagsContainsAND: any[] | undefined;
  if (def.tags && Array.isArray(def.tags) && def.tags.length) {
    tagsContainsAND = (def.tags as string[]).map((t: string) => ({
      tags: { contains: t },
    }));
  }

  // Defaults for targets when not specified
  const defaultTargets: Record<string, number> = {
    activities_completed: 1,
    quizzes_completed: 1,
    quiz_correct: 10,
    login_streak: 1,
    diamonds_earned: 100,
    code_submissions: 1,
    skill_mastery: def.masteryThreshold || 100,
  };

  let current = 0;
  let targetResolved = rule.target ?? defaultTargets[metric] ?? 1;

  switch (metric) {
    case "activities_completed": {
      const where: any = {
        userId,
        completed: true,
        ...(timeFilter ? { completedAt: timeFilter } : {}),
        // relation filter
        activity: Object.keys(activityFilter).length
          ? { is: activityFilter }
          : undefined,
      };
      if (tagsContainsAND) {
        where.AND = where.AND || [];
        where.AND.push({
          activity: { is: { AND: tagsContainsAND } },
        });
      }
      current = await prisma.activityAttempt.count({ where });
      break;
    }

    case "quizzes_completed": {
      const where: any = {
        userId,
        isCompleted: true,
        ...(timeFilter ? { completedAt: timeFilter } : {}),
      };
      if (typeof def.minScore === "number") {
        where.score = { gte: def.minScore };
      }
      current = await prisma.quizAttempt.count({ where });
      break;
    }

    case "quiz_correct": {
      const where: any = {
        userId,
        isCompleted: true,
        ...(timeFilter ? { completedAt: timeFilter } : {}),
      };
      // We use aggregate sum on correctAnswers column
      const agg = await prisma.quizAttempt.aggregate({
        where,
        _sum: { correctAnswers: true },
      });
      current = agg._sum.correctAnswers ?? 0;
      if (!rule.target && typeof def.consecutive === "number") {
        // If rule expects a consecutive streak, we approximate by target from definition
        targetResolved = def.consecutive;
      }
      break;
    }

    case "login_streak": {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { loginStreak: true },
      });
      current = user?.loginStreak ?? 0;
      break;
    }

    case "diamonds_earned": {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { totalDiamonds: true },
      });
      current = user?.totalDiamonds ?? 0;
      // If a time window is specified, fallback to transactions within window
      if (timeFilter) {
        const txAgg = await prisma.diamondTransaction.aggregate({
          where: {
            userId,
            createdAt: timeFilter,
            amount: { gt: 0 },
          },
          _sum: { amount: true },
        });
        current = txAgg._sum.amount ?? 0;
      }
      break;
    }

    case "code_submissions": {
      if (timeFilter) {
        current = await prisma.codeSubmission.count({
          where: { userId, submittedAt: timeFilter },
        });
      } else {
        // Prefer precomputed field for efficiency
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { codeSubmissionCount: true },
        });
        current = user?.codeSubmissionCount ?? 0;
      }
      break;
    }

    case "skill_mastery": {
      const skillKey = def.skillKey;
      if (!skillKey) {
        return {
          current: 0,
          target: targetResolved,
          normalized: 0,
          details: { reason: "Missing skillKey" },
          targetResolved,
        };
      }
      const skill = await p.skill.findUnique({
        where: { key: skillKey },
        select: { id: true },
      });
      if (!skill) {
        return {
          current: 0,
          target: targetResolved,
          normalized: 0,
          details: { reason: "Skill not found for key", skillKey },
          targetResolved,
        };
      }
      const mastery = await p.userSkillMastery.findUnique({
        where: { userId_skillId: { userId, skillId: skill.id } },
        select: { mastery: true },
      });
      current = mastery?.mastery ?? 0;
      // Prefer masteryThreshold if present
      targetResolved = def.masteryThreshold ?? targetResolved ?? 100;
      break;
    }

    default: {
      // Fallback to 0 progress
      current = 0;
      break;
    }
  }

  const normalized =
    targetResolved && targetResolved > 0
      ? bounded(current / targetResolved, 0, 1)
      : current > 0
        ? 1
        : 0;

  return {
    current,
    target: targetResolved,
    normalized,
    details: { metric, def },
    targetResolved,
  };
}

function aggregateResults(
  rules: BadgeWithRules["rules"],
  results: Array<RuleEvaluationResult & { targetResolved: number }>
): AchievementAggregationResult & {
  progressCurrentSum: number;
  progressTargetSum: number;
  ruleResults: ComputedBadgeProgress["ruleResults"];
} {
  let weightSum = 0;
  let weightedNormSum = 0;

  let progressCurrentSum = 0;
  let progressTargetSum = 0;

  const ruleResults = results.map((r, idx) => {
    const rule = rules[idx];
    const weight = rule.weight ?? 1;

    const ruleTarget = r.targetResolved ?? r.target ?? 1;
    const boundedCurrent = Math.min(r.current, ruleTarget);
    progressCurrentSum += boundedCurrent;
    progressTargetSum += ruleTarget;

    weightedNormSum += r.normalized * weight;
    weightSum += weight;

    return {
      ruleId: rule.id,
      weight,
      metric: rule.metric,
      ruleType: rule.ruleType,
      targetResolved: ruleTarget,
      current: r.current,
      target: r.target,
      normalized: r.normalized,
      details: r.details,
    };
  });

  const normalized =
    weightSum > 0 ? bounded(weightedNormSum / weightSum, 0, 1) : 0;

  return {
    normalized,
    ruleResults,
    weightSum,
    progressCurrentSum,
    progressTargetSum,
  };
}

// Public API

export async function computeBadgeProgress(
  userId: string,
  badge: BadgeWithRules
): Promise<ComputedBadgeProgress> {
  const activeRules = (badge.rules || []).filter((r) => r.isActive !== false);

  if (!activeRules.length) {
    // Backward compatibility fallback: treat badge.condition as a single boolean/check rule
    const hasLegacyCondition = Boolean(badge.condition);
    const progressPercent = hasLegacyCondition ? 0 : 0;
    return {
      badgeId: badge.id,
      progressPercent,
      isUnlocked: false,
      isCompleted: false,
      progressCurrentSum: 0,
      progressTargetSum: badge.targetValue || 1,
      ruleResults: [],
    };
  }

  const evaluations = await Promise.all(
    activeRules.map((r) => evaluateRule(userId, r))
  );
  const agg = aggregateResults(activeRules, evaluations);

  return {
    badgeId: badge.id,
    progressPercent: pct(agg.normalized),
    isUnlocked: agg.progressCurrentSum > 0,
    isCompleted:
      agg.normalized >= 1 || agg.progressCurrentSum >= agg.progressTargetSum,
    progressCurrentSum: Math.round(agg.progressCurrentSum),
    progressTargetSum: Math.round(agg.progressTargetSum),
    ruleResults: agg.ruleResults,
  };
}

export type RecomputeOptions = {
  persist?: boolean; // default true
  awardOnComplete?: boolean; // default false
};

export async function recomputeAndPersistBadgeProgress(
  userId: string,
  badgeId: string,
  options: RecomputeOptions = {}
): Promise<ComputedBadgeProgress> {
  const { persist = true, awardOnComplete = false } = options;

  const badge = await prisma.badge.findUnique({
    where: { id: badgeId },
  });

  if (!badge) {
    throw new Error(`Badge not found: ${badgeId}`);
  }

  const rules = await p.badgeRule.findMany({
    where: { badgeId },
  });

  const computed = await computeBadgeProgress(userId, {
    ...(badge as any),
    rules,
  } as any);

  if (!persist) return computed;

  const existing = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId } },
  });

  const now = new Date();
  const justCompleted = computed.isCompleted && !existing?.isCompleted;

  // Persist UserBadge
  if (existing) {
    await prisma.userBadge.update({
      where: { id: existing.id },
      data: {
        progress: computed.progressPercent,
        isUnlocked: computed.isUnlocked || existing.isUnlocked,
        isCompleted: computed.isCompleted || existing.isCompleted,
        unlockedAt:
          computed.isUnlocked && !existing.unlockedAt
            ? now
            : existing.unlockedAt,
        earnedAt:
          computed.isCompleted && !existing.earnedAt ? now : existing.earnedAt,
        progressData: JSON.stringify({
          progressCurrentSum: computed.progressCurrentSum,
          progressTargetSum: computed.progressTargetSum,
          ruleResults: computed.ruleResults,
          updatedAt: now.toISOString(),
        }),
      },
    });
  } else {
    await prisma.userBadge.create({
      data: {
        userId,
        badgeId,
        progress: computed.progressPercent,
        isUnlocked: computed.isUnlocked,
        isCompleted: computed.isCompleted,
        unlockedAt: computed.isUnlocked ? now : null,
        earnedAt: computed.isCompleted ? now : null,
        progressData: JSON.stringify({
          progressCurrentSum: computed.progressCurrentSum,
          progressTargetSum: computed.progressTargetSum,
          ruleResults: computed.ruleResults,
          updatedAt: now.toISOString(),
        }),
      },
    });
  }

  // Award rewards if newly completed
  if (awardOnComplete && justCompleted) {
    const diamondReward = badge.rewardDiamonds ?? 0;
    const xpReward = badge.rewardXp ?? 0;

    if (diamondReward || xpReward) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          currentDiamonds: diamondReward
            ? { increment: diamondReward }
            : undefined,
          totalDiamonds: diamondReward
            ? { increment: diamondReward }
            : undefined,
          experience: xpReward ? { increment: xpReward } : undefined,
        },
      });

      if (diamondReward) {
        await prisma.diamondTransaction.create({
          data: {
            userId,
            amount: diamondReward,
            type: "ACHIEVEMENT_REWARD",
            description: `Achievement completed: ${badge.title}`,
            relatedId: badgeId,
            relatedType: "badge",
          },
        });
      }
    }

    // TODO: rewardCardPack, specialReward handling
  }

  return computed;
}

export async function recomputeAllBadges(
  userId: string,
  options: RecomputeOptions = {}
): Promise<{
  results: ComputedBadgeProgress[];
  newlyCompletedBadgeIds: string[];
}> {
  const { awardOnComplete = false } = options;

  const badges = await prisma.badge.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { rarity: "desc" }, { name: "asc" }],
  });

  const existingUserBadges = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true, isCompleted: true },
  });
  const completedSet = new Set(
    existingUserBadges.filter((b) => b.isCompleted).map((b) => b.badgeId)
  );

  const results: ComputedBadgeProgress[] = [];
  const newlyCompletedBadgeIds: string[] = [];

  for (const badge of badges) {
    const computed = await recomputeAndPersistBadgeProgress(userId, badge.id, {
      persist: true,
      awardOnComplete,
    });
    results.push(computed);
    if (computed.isCompleted && !completedSet.has(badge.id)) {
      newlyCompletedBadgeIds.push(badge.id);
    }
  }

  return { results, newlyCompletedBadgeIds };
}

export async function getUserAchievementsSummary(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { level: true, experience: true },
  });

  const [total, completed] = await Promise.all([
    prisma.badge.count({ where: { isActive: true } }),
    prisma.userBadge.count({
      where: { userId, isCompleted: true },
    }),
  ]);

  return {
    total,
    completed,
    inProgress: total - completed,
    level: user?.level ?? 1,
    xp: user?.experience ?? 0,
  };
}
