import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAndAwardBadges } from "@/lib/badges";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface AuthUser {
  userId: string;
  username: string;
}

async function getUserFromSession(): Promise<AuthUser | null> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      return {
        userId: session.user.id as string,
        username:
          (session.user as any).username ||
          (session.user.email as string) ||
          "Unknown",
      };
    }
    return null;
  } catch {
    return null;
  }
}

// GET - Rozetleri listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const rarity = searchParams.get("rarity");
    const earned = searchParams.get("earned"); // "true", "false", "all"

    const authUser = await getUserFromSession();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Filtreler
    const where: any = {
      isActive: true,
    };

    if (category) where.category = category;
    if (rarity) where.rarity = rarity;

    // Rozetleri getir
    const badges = await prisma.badge.findMany({
      where,
      orderBy: [{ rarity: "desc" }, { name: "asc" }],
      include: {
        users: {
          where: { userId: authUser.userId },
          select: {
            isCompleted: true,
            isUnlocked: true,
            earnedAt: true,
            unlockedAt: true,
            progress: true, // stored as percent 0..100
          },
        },
      },
    });

    // Prepare badge data for current user (earned = isCompleted or has earnedAt)
    let processedBadges = badges.map((badge: any) => {
      const ub = (badge.users && badge.users[0]) || null;
      const isEarned = !!(ub && (ub.isCompleted || ub.earnedAt));
      const target = badge.targetValue || 1;

      // Convert stored percent (0..100) to absolute progress out of targetValue for UI bar
      const progressPercent =
        typeof ub?.progress === "number" ? ub.progress : 0;
      const progressAbsolute = Math.round((progressPercent / 100) * target);

      return {
        ...badge,
        isEarned,
        earnedAt: ub?.earnedAt || null,
        progress: progressAbsolute,
        users: undefined, // strip relation from payload
      };
    });

    // Earned filtresini uygula
    if (earned === "true") {
      processedBadges = processedBadges.filter((badge) => badge.isEarned);
    } else if (earned === "false") {
      processedBadges = processedBadges.filter((badge) => !badge.isEarned);
    }

    // Stats in the shape expected by the BadgesPage
    const totalBadges = badges.length;
    const earnedBadges = processedBadges.filter((b: any) => b.isEarned).length;
    const completionRate =
      totalBadges > 0 ? Math.round((earnedBadges / totalBadges) * 100) : 0;

    const totalDiamonds = processedBadges
      .filter((b: any) => b.isEarned)
      .reduce((s: number, b: any) => s + (b.rewardDiamonds || 0), 0);

    const totalXp = processedBadges
      .filter((b: any) => b.isEarned)
      .reduce((s: number, b: any) => s + (b.rewardXp || 0), 0);

    // Category breakdown
    const categoryMap = new Map<
      string,
      { category: string; total: number; earned: number; percentage: number }
    >();
    for (const b of processedBadges as any[]) {
      const cat = b.category || "General";
      const row = categoryMap.get(cat) || {
        category: cat,
        total: 0,
        earned: 0,
        percentage: 0,
      };
      row.total += 1;
      if (b.isEarned) row.earned += 1;
      categoryMap.set(cat, row);
    }
    const categories = Array.from(categoryMap.values()).map((c) => ({
      ...c,
      percentage: c.total > 0 ? (c.earned / c.total) * 100 : 0,
    }));

    // Recent earned badges (last 8 by earnedAt)
    const recentBadges = (processedBadges as any[])
      .filter((b) => b.isEarned && b.earnedAt)
      .sort(
        (a, b) =>
          new Date(b.earnedAt as string).getTime() -
          new Date(a.earnedAt as string).getTime()
      )
      .slice(0, 8);

    const stats = {
      totalBadges,
      earnedBadges,
      completionRate,
      totalDiamonds,
      totalXp,
      categories,
      recentBadges,
    };

    return NextResponse.json({
      success: true,
      badges: processedBadges,
      stats,
    });
  } catch (error) {
    console.error("Badges GET error:", error);
    return NextResponse.json(
      { error: "Rozetler getirilirken hata oluştu" },
      { status: 500 }
    );
  }
}

// POST - Rozet kontrol et ve ödüllendir / Yeni rozet oluştur (Admin)
export async function POST(request: NextRequest) {
  try {
    const authUser = await getUserFromSession();

    if (!authUser) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekli" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (action === "check_badges") {
      // Kullanıcının yeni rozetlerini kontrol et
      const newBadges = await checkAndAwardBadges(authUser.userId);

      return NextResponse.json({
        success: true,
        message:
          newBadges.length > 0
            ? `${newBadges.length} yeni rozet kazandınız!`
            : "Yeni rozet yok",
        newBadges,
      });
    } else if (action === "create_badge") {
      // Admin kontrolü
      if (authUser.username !== "admin") {
        return NextResponse.json(
          { error: "Bu işlem için yetkiniz yok" },
          { status: 403 }
        );
      }

      const {
        name,
        title,
        description,
        icon,
        category,
        rarity,
        color,
        condition,
        conditionType,
        isActive,
      } = body;

      if (!name || !title || !description || !condition) {
        return NextResponse.json(
          { error: "Gerekli alanlar eksik" },
          { status: 400 }
        );
      }

      // İsim benzersizlik kontrolü
      const existingBadge = await prisma.badge.findUnique({
        where: { name },
      });

      if (existingBadge) {
        return NextResponse.json(
          { error: "Bu rozet adı zaten kullanılıyor" },
          { status: 400 }
        );
      }

      const badge = await prisma.badge.create({
        data: {
          name,
          title,
          description,
          icon: icon || "🏆",
          category: category || "general",
          rarity: rarity || "common",
          color: color || "#3B82F6",
          conditionType: conditionType || "general",
          condition:
            typeof condition === "string"
              ? condition
              : JSON.stringify(condition),
          isActive: isActive !== false,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Rozet başarıyla oluşturuldu",
        badge,
      });
    } else {
      return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
    }
  } catch (error) {
    console.error("Badges POST error:", error);
    return NextResponse.json(
      { error: "İşlem sırasında hata oluştu" },
      { status: 500 }
    );
  }
}

// PUT - Rozet güncelleme (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getUserFromSession();

    if (!authUser) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekli" },
        { status: 401 }
      );
    }

    // Admin kontrolü
    if (authUser.username !== "admin") {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Rozet ID gerekli" }, { status: 400 });
    }

    // Condition'ı string'e çevir
    if (updateData.condition && typeof updateData.condition !== "string") {
      updateData.condition = JSON.stringify(updateData.condition);
    }

    const updatedBadge = await prisma.badge.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Rozet başarıyla güncellendi",
      badge: updatedBadge,
    });
  } catch (error) {
    console.error("Badges PUT error:", error);
    return NextResponse.json(
      { error: "Rozet güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE - Rozet silme (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getUserFromSession();

    if (!authUser) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekli" },
        { status: 401 }
      );
    }

    // Admin kontrolü
    if (authUser.username !== "admin") {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Rozet ID gerekli" }, { status: 400 });
    }

    await prisma.badge.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Rozet başarıyla silindi",
    });
  } catch (error) {
    console.error("Badges DELETE error:", error);
    return NextResponse.json(
      { error: "Rozet silinirken hata oluştu" },
      { status: 500 }
    );
  }
}
