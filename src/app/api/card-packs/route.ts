import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

// GET - Mevcut kart paketlerini listele
export async function GET(req: NextRequest) {
  try {
    const authUser = await getUserFromSession();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Kullanıcı bilgilerini al
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        level: true,
        currentDiamonds: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Aktif kart paketlerini getir
    const cardPacks = await prisma.cardPack.findMany({
      where: {
        isActive: true,
        requiredLevel: {
          lte: user.level, // Kullanıcının seviyesine uygun paketler
        },
      },
      orderBy: [
        { diamondPrice: "asc" }, // Ücretsizler önce
        { requiredLevel: "asc" },
      ],
    });

    // Kullanıcının satın alabileceği paketleri işaretle
    const packsWithAvailability = cardPacks.map((pack) => ({
      id: pack.id,
      name: pack.name,
      description: pack.description,
      packType: pack.packType,
      cardCount: pack.cardCount,
      guaranteedRarity: pack.guaranteedRarity,
      diamondPrice: pack.diamondPrice,
      requiredLevel: pack.requiredLevel,
      imageUrl: pack.imageUrl,
      rarity: pack.rarity,
      canAfford:
        pack.diamondPrice === null || user.currentDiamonds >= pack.diamondPrice,
      canOpen: user.level >= pack.requiredLevel,
    }));

    return NextResponse.json({
      success: true,
      cardPacks: packsWithAvailability,
      userInfo: {
        level: user.level,
        diamonds: user.currentDiamonds,
      },
    });
  } catch (error) {
    console.error("Error fetching card packs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Yeni kart paketi oluştur (Admin only)
export async function POST(req: NextRequest) {
  try {
    const authUser = await getUserFromSession();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin kontrolü (şimdilik basit)
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      name,
      description,
      packType,
      cardCount,
      guaranteedRarity,
      diamondPrice,
      requiredLevel,
      imageUrl,
      rarity,
    } = body;

    // Validation
    if (!name || !packType) {
      return NextResponse.json(
        { error: "Name ve packType gerekli" },
        { status: 400 }
      );
    }

    // Kart paketi oluştur
    const newPack = await prisma.cardPack.create({
      data: {
        name,
        description: description || "",
        packType,
        cardCount: cardCount || 3,
        guaranteedRarity,
        diamondPrice,
        requiredLevel: requiredLevel || 1,
        imageUrl,
        rarity: rarity || "common",
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Kart paketi başarıyla oluşturuldu",
      cardPack: {
        id: newPack.id,
        name: newPack.name,
        packType: newPack.packType,
        cardCount: newPack.cardCount,
        diamondPrice: newPack.diamondPrice,
      },
    });
  } catch (error) {
    console.error("Error creating card pack:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
