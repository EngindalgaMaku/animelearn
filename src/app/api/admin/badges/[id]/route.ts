import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Admin guard
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId)
    return { ok: false, status: 401, error: "Authentication required" };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, username: true },
  });

  if (!user || (user.role !== "admin" && user.username !== "admin")) {
    return { ok: false, status: 403, error: "Admin access required" };
  }

  return { ok: true, userId };
}

// GET /api/admin/badges/[id] - fetch one badge
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) {
      return NextResponse.json(
        { error: guard.error },
        { status: guard.status }
      );
    }

    const { id } = await context.params;
    const badge = await prisma.badge.findUnique({
      where: { id },
    });

    if (!badge) {
      return NextResponse.json({ error: "Badge not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, badge });
  } catch (error) {
    console.error("Badge GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch badge" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/badges/[id] - update a badge
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) {
      return NextResponse.json(
        { error: guard.error },
        { status: guard.status }
      );
    }

    const { id } = await context.params;
    const existing = await prisma.badge.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Badge not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      title,
      description,
      icon,
      category,
      rarity,
      color,
      conditionType,
      targetValue,
      rewardDiamonds,
      rewardXp,
      rewardCardPack,
      isActive,
      isHidden,
      sortOrder,
      specialReward,
      prerequisiteBadgeId,
    } = body || {};

    const updated = await prisma.badge.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        title: title ?? existing.title,
        description: description ?? existing.description,
        icon: icon ?? existing.icon,
        category: category ?? existing.category,
        rarity: rarity ?? existing.rarity,
        color: color ?? existing.color,
        conditionType: conditionType ?? existing.conditionType,
        targetValue:
          typeof targetValue === "number" ? targetValue : existing.targetValue,
        // keep legacy condition JSON in sync in a minimal way
        condition: JSON.stringify({
          type: conditionType ?? existing.conditionType,
          target:
            typeof targetValue === "number"
              ? targetValue
              : existing.targetValue,
        }),
        rewardDiamonds:
          typeof rewardDiamonds === "number"
            ? rewardDiamonds
            : existing.rewardDiamonds,
        rewardXp: typeof rewardXp === "number" ? rewardXp : existing.rewardXp,
        rewardCardPack: rewardCardPack ?? existing.rewardCardPack,
        isActive: typeof isActive === "boolean" ? isActive : existing.isActive,
        isHidden: typeof isHidden === "boolean" ? isHidden : existing.isHidden,
        sortOrder:
          typeof sortOrder === "number" ? sortOrder : existing.sortOrder,
        specialReward: specialReward ?? existing.specialReward,
        prerequisiteBadgeId:
          prerequisiteBadgeId ?? existing.prerequisiteBadgeId,
      },
    });

    return NextResponse.json({ success: true, badge: updated });
  } catch (error) {
    console.error("Badge PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update badge" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/badges/[id] - delete a badge and its dependencies
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) {
      return NextResponse.json(
        { error: guard.error },
        { status: guard.status }
      );
    }

    const { id } = await context.params;
    const existing = await prisma.badge.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Badge not found" }, { status: 404 });
    }

    // Clean up dependents first to avoid FK constraint issues
    await prisma.userBadge.deleteMany({ where: { badgeId: id } });

    // Delete the badge; if rules exist and block deletion, return a clear error
    try {
      await prisma.badge.delete({ where: { id } });
    } catch (e: any) {
      return NextResponse.json(
        {
          error:
            "Cannot delete badge because it has rules attached. Remove rules first.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Badge DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete badge" },
      { status: 500 }
    );
  }
}
