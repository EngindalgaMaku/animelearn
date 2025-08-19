import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Small helper for admin guard (same pattern used in other admin APIs)
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

/**
 * GET /api/admin/badges
 * Pagination: ?page=1&limit=10
 * Optional filters (future-safe):
 *   ?q=... (search in title/name/description)
 *   ?category=...
 *   ?rarity=common|rare|epic|legendary
 */
export async function GET(request: NextRequest) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) {
      return NextResponse.json(
        { error: guard.error },
        { status: guard.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10))
    );
    const q = (searchParams.get("q") || "").trim();
    const category = (searchParams.get("category") || "").trim();
    const rarity = (searchParams.get("rarity") || "").trim();

    const where: any = {};
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }
    if (category) where.category = category;
    if (rarity) where.rarity = rarity;

    const [total, badges] = await Promise.all([
      prisma.badge.count({ where }),
      prisma.badge.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { rarity: "desc" }, { name: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      success: true,
      badges,
      page,
      pageSize: limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("Badges GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch badges" },
      { status: 500 }
    );
  }
}

// POST /api/admin/badges - create a new badge
export async function POST(request: NextRequest) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) {
      return NextResponse.json(
        { error: guard.error },
        { status: guard.status }
      );
    }

    const body = await request.json();

    const {
      name,
      title,
      description,
      icon,
      category,
      rarity = "common",
      color = "#3B82F6",
      conditionType = "count", // legacy condition mapping
      targetValue = 1, // legacy condition mapping
      rewardDiamonds = 25,
      rewardXp = 50,
      rewardCardPack,
      isActive = true,
      isHidden = false,
      sortOrder = 0,
      specialReward,
      prerequisiteBadgeId,
    } = body || {};

    // Validate required fields
    if (!name || !title || !description || !icon || !category) {
      return NextResponse.json(
        { error: "name, title, description, icon, and category are required" },
        { status: 400 }
      );
    }

    // Ensure unique name
    const existing = await prisma.badge.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json(
        { error: "A badge with this name already exists" },
        { status: 400 }
      );
    }

    // The legacy 'condition' (string) is still required by schema. Keep it minimal JSON.
    const condition = JSON.stringify({
      type: conditionType,
      target: targetValue,
    });

    const badge = await prisma.badge.create({
      data: {
        name,
        title,
        description,
        icon,
        category,
        rarity,
        color,
        condition,
        conditionType,
        targetValue,
        rewardDiamonds,
        rewardXp,
        rewardCardPack: rewardCardPack || null,
        isActive,
        isHidden,
        sortOrder,
        specialReward: specialReward || null,
        prerequisiteBadgeId: prerequisiteBadgeId || null,
      },
    });

    return NextResponse.json({ success: true, badge }, { status: 201 });
  } catch (error) {
    console.error("Badges POST error:", error);
    return NextResponse.json(
      { error: "Failed to create badge" },
      { status: 500 }
    );
  }
}
