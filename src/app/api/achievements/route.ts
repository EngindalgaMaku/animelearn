import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  recomputeAndPersistBadgeProgress,
  getUserAchievementsSummary,
} from "@/lib/achievements-engine";

type UserSession = {
  id?: string;
  email?: string | null;
};

async function getAuthUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const sUser = session?.user as UserSession | undefined;
  if (!sUser) return null;

  // Prefer id if present
  if (sUser.id) return sUser.id;

  // Fallback by email lookup
  if (sUser.email) {
    const user = await prisma.user.findUnique({
      where: { email: sUser.email },
      select: { id: true },
    });
    return user?.id ?? null;
  }
  return null;
}

// GET /api/achievements - Real achievements list with live progress (wired to Badge/BadgeRule/UserBadge)
export async function GET(request: NextRequest) {
  try {
    const authUserId = await getAuthUserId();
    if (!authUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const categoryFilter = searchParams.get("category"); // e.g. "learning" | "knowledge" | "all"
    const statusFilter = searchParams.get("status"); // 'all' | 'completed' | 'in_progress' | 'locked'
    const requestedUserId = searchParams.get("userId"); // admin override target user

    // Determine target user (allow override only for admin)
    const authUser = await prisma.user.findUnique({
      where: { id: authUserId },
      select: { id: true, role: true },
    });
    const isAdmin = authUser?.role === "admin";
    const targetUserId =
      isAdmin && requestedUserId ? requestedUserId : authUserId;

    // Fetch active badges (no include to avoid stale client typing issues)
    const badges = await prisma.badge.findMany({
      where: {
        isActive: true,
        ...(categoryFilter && categoryFilter !== "all"
          ? { category: categoryFilter }
          : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { rarity: "desc" }, { name: "asc" }],
    });

    const badgeIds = badges.map((b) => b.id);

    // Fetch user badges for target user in a single query
    const userBadges = await prisma.userBadge.findMany({
      where: { userId: targetUserId, badgeId: { in: badgeIds } },
      select: {
        badgeId: true,
        isUnlocked: true,
        isCompleted: true,
        progress: true,
        earnedAt: true,
        unlockedAt: true,
        progressData: true,
        updatedAt: true,
      },
    });
    const ubMap = new Map(userBadges.map((ub) => [ub.badgeId, ub]));

    // Recompute and persist each badge's progress for target user without awarding
    const computedList = await Promise.all(
      badges.map(async (b) => {
        const computed = await recomputeAndPersistBadgeProgress(
          targetUserId,
          b.id,
          {
            persist: true,
            awardOnComplete: false,
          }
        );

        const ub = ubMap.get(b.id);
        return {
          id: b.id,
          name: b.name,
          title: b.title,
          description: b.description,
          icon: b.icon,
          category: b.category,
          rarity: b.rarity,
          color: b.color,
          conditionType: b.conditionType,
          targetValue: b.targetValue,
          rewardDiamonds: b.rewardDiamonds,
          rewardXp: b.rewardXp,
          rewardCardPack: b.rewardCardPack,
          isActive: b.isActive,
          isHidden: b.isHidden,
          totalEarned: b.totalEarned,
          userProgress: {
            progress: computed.progressPercent,
            isUnlocked: computed.isUnlocked || Boolean(ub?.isUnlocked),
            isCompleted: computed.isCompleted || Boolean(ub?.isCompleted),
            earnedAt:
              ub?.earnedAt ??
              (computed.isCompleted ? new Date().toISOString() : null),
            unlockedAt:
              ub?.unlockedAt ??
              (computed.isUnlocked ? new Date().toISOString() : null),
            progressData: JSON.stringify({
              progressCurrentSum: computed.progressCurrentSum,
              progressTargetSum: computed.progressTargetSum,
              ruleResults: computed.ruleResults,
            }),
          },
        };
      })
    );

    // Apply status filtering if requested
    const filtered =
      statusFilter && statusFilter !== "all"
        ? computedList.filter((a) => {
            const p = a.userProgress;
            switch (statusFilter) {
              case "completed":
                return p.isCompleted;
              case "in_progress":
                return p.isUnlocked && !p.isCompleted;
              case "locked":
                return !p.isUnlocked;
              default:
                return true;
            }
          })
        : computedList;

    // Aggregate stats and user summary
    const summary = await getUserAchievementsSummary(targetUserId);
    const stats = {
      total: computedList.length,
      completed: computedList.filter((a) => a.userProgress.isCompleted).length,
      inProgress: computedList.filter(
        (a) => a.userProgress.isUnlocked && !a.userProgress.isCompleted
      ).length,
      locked: computedList.filter((a) => !a.userProgress.isUnlocked).length,
      totalRewardsEarned: {
        // Sum only for currently completed; historically earned sums would need a separate ledger for accuracy
        diamonds: computedList
          .filter((a) => a.userProgress.isCompleted)
          .reduce((sum, a) => sum + (a.rewardDiamonds || 0), 0),
        xp: computedList
          .filter((a) => a.userProgress.isCompleted)
          .reduce((sum, a) => sum + (a.rewardXp || 0), 0),
      },
      categories: Object.fromEntries(
        Object.entries(
          computedList.reduce<Record<string, number>>((acc, a) => {
            acc[a.category] = (acc[a.category] || 0) + 1;
            return acc;
          }, {})
        )
      ),
    };

    return NextResponse.json({
      achievements: filtered,
      stats,
      userLevel: summary.level,
      userXp: summary.xp,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to fetch achievements:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
