import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAndAwardBadges } from "@/lib/badges";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface AuthUser {
  userId: string;
  username: string;
}

// Token'dan kullanıcı bilgilerini çıkart
function getUserFromToken(request: NextRequest): AuthUser | null {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
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

    const authUser = getUserFromToken(request);

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
          where: authUser ? { userId: authUser.userId } : undefined,
          select: {
            earnedAt: true,
            progress: true,
          },
        },
      },
    });

    // Rozet verilerini hazırla
    let processedBadges = badges.map((badge) => ({
      ...badge,
      isEarned: badge.users.length > 0,
      earnedAt: badge.users[0]?.earnedAt || null,
      progress: badge.users[0]?.progress || 0,
      users: undefined, // Güvenlik için kaldır
    }));

    // Earned filtresini uygula
    if (earned === "true") {
      processedBadges = processedBadges.filter((badge) => badge.isEarned);
    } else if (earned === "false") {
      processedBadges = processedBadges.filter((badge) => !badge.isEarned);
    }

    // İstatistikler
    const stats = {
      total: badges.length,
      earned: authUser ? processedBadges.filter((b) => b.isEarned).length : 0,
      remaining: authUser
        ? processedBadges.filter((b) => !b.isEarned).length
        : badges.length,
      categories: await prisma.badge.groupBy({
        by: ["category"],
        where: { isActive: true },
        _count: { category: true },
      }),
      rarities: await prisma.badge.groupBy({
        by: ["rarity"],
        where: { isActive: true },
        _count: { rarity: true },
      }),
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
    const authUser = getUserFromToken(request);

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
    const authUser = getUserFromToken(request);

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
    const authUser = getUserFromToken(request);

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
