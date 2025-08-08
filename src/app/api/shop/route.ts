import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { createHash } from "crypto";

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

// GET - Mağaza kartlarını listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const rarity = searchParams.get("rarity");
    const series = searchParams.get("series");
    const category = searchParams.get("category");
    const element = searchParams.get("element");
    const minPrice = parseInt(searchParams.get("minPrice") || "0");
    const maxPrice = parseInt(searchParams.get("maxPrice") || "2500");
    const sortBy = searchParams.get("sortBy") || "newest"; // price, name, rarity, rating, newest

    // Filtreler
    const where: any = {
      isPurchasable: true,
      isAnalyzed: true,
      diamondPrice: {
        gte: minPrice,
        lte: maxPrice,
        not: null,
      },
    };

    if (rarity) where.rarity = rarity;
    if (series) where.series = { contains: series, mode: "insensitive" };
    if (category) {
      // Map category slugs to include both full and short versions
      const categoryMappings = {
        "anime-collection": ["anime-collection", "anime"],
        "star-collection": ["star-collection", "star"],
        "car-collection": ["car-collection", "car"]
      };
      
      const mappedCategories = categoryMappings[category as keyof typeof categoryMappings];
      if (mappedCategories) {
        where.category = { in: mappedCategories };
      } else {
        where.category = category;
      }
    }
    if (element) where.element = element;

    // Sıralama
    let orderBy: any = {};
    switch (sortBy) {
      case "name":
        orderBy = { name: "asc" };
        break;
      case "rarity":
        orderBy = { rarityLevel: "desc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "newest":
        orderBy = { uploadDate: "desc" };
        break;
      default:
        orderBy = { diamondPrice: "asc" };
    }

    // Kartları getir (collection bilgisi dahil)
    const cards = await prisma.card.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        cardTitle: true,
        series: true,
        character: true,
        rarity: true,
        element: true,
        imageUrl: true,
        thumbnailUrl: true,
        diamondPrice: true,
        estimatedValue: true,
        rating: true,
        rarityLevel: true,
        attackPower: true,
        defense: true,
        speed: true,
        specialAbility: true,
        currentOwners: true,
        maxOwners: true,
        collectionId: true,
        collection: {
          select: {
            id: true,
            name: true,
            description: true,
            totalCards: true,
          },
        },
        userCards: {
          select: {
            userId: true,
          },
        },
      },
    });

    const totalCards = await prisma.card.count({ where });

    // Güvenli resim token'ları oluştur
    const generateSecureImageToken = (cardId: string, type: 'preview' | 'thumbnail' = 'preview') => {
      const tokenData = {
        cardId,
        type,
        timestamp: Date.now(),
        hash: createHash('sha256').update(`${cardId}-${type}-${Date.now()}`).digest('hex').substring(0, 8)
      };
      return jwt.sign(tokenData, JWT_SECRET, { expiresIn: "1h" });
    };

    // Kart verilerini hazırla - GÜVENLİ URL'lerle
    const cardsWithOwnership = cards.map((card) => {
      const previewToken = generateSecureImageToken(card.id, 'preview');
      const thumbnailToken = generateSecureImageToken(card.id, 'thumbnail');
      
      return {
        ...card,
        // GÜVENLİ TOKEN-BASED URL'ler
        secureImageUrl: `/api/secure-image?cardId=${card.id}&type=preview&token=${previewToken}`,
        secureThumbnailUrl: `/api/secure-image?cardId=${card.id}&type=thumbnail&token=${thumbnailToken}`,
        // ESKİ URL'leri tamamen kaldır
        imageUrl: undefined,
        thumbnailUrl: undefined,
        isOwned: false, // Auth olmayan kullanıcılar için
        ownersCount: card.currentOwners,
        isLimited: card.maxOwners ? card.currentOwners >= card.maxOwners : false,
        userCards: undefined, // Güvenlik için kaldır
      };
    });

    // Kullanıcı girişi varsa sahiplik bilgilerini ekle
    const authUser = getUserFromToken(request);
    if (authUser) {
      const userCards = await prisma.userCard.findMany({
        where: {
          userId: authUser.userId,
          cardId: { in: cards.map((c) => c.id) },
        },
        select: { cardId: true },
      });

      const ownedCardIds = new Set(userCards.map((uc) => uc.cardId));

      cardsWithOwnership.forEach((card) => {
        card.isOwned = ownedCardIds.has(card.id);
        
        // Sahip olunan kartlar için full resolution token'ı da ekle
        if (card.isOwned) {
          const fullToken = jwt.sign({
            cardId: card.id,
            type: 'full',
            userId: authUser.userId,
            timestamp: Date.now(),
            hash: createHash('sha256').update(`${card.id}-full-${authUser.userId}-${Date.now()}`).digest('hex').substring(0, 8)
          }, JWT_SECRET, { expiresIn: "1h" });
          
          (card as any).secureFullImageUrl = `/api/secure-image?cardId=${card.id}&type=full&token=${fullToken}`;
        }
      });
    }

    // Mağaza istatistikleri
    const stats = await prisma.card.aggregate({
      where: { isPurchasable: true, isAnalyzed: true },
      _count: { id: true },
      _min: { diamondPrice: true },
      _max: { diamondPrice: true },
      _avg: { diamondPrice: true },
    });

    // Popüler kategoriler
    const categories = await prisma.card.groupBy({
      by: ["rarity"],
      where: { isPurchasable: true, isAnalyzed: true },
      _count: { rarity: true },
      orderBy: { _count: { rarity: "desc" } },
    });

    return NextResponse.json({
      success: true,
      cards: cardsWithOwnership,
      pagination: {
        page,
        limit,
        total: totalCards,
        pages: Math.ceil(totalCards / limit),
        hasNext: page < Math.ceil(totalCards / limit),
        hasPrev: page > 1,
      },
      stats: {
        totalCards: stats._count.id,
        minPrice: stats._min.diamondPrice || 0,
        maxPrice: stats._max.diamondPrice || 2500,
        avgPrice: Math.round(stats._avg.diamondPrice || 0),
      },
      categories: categories.map((cat) => ({
        rarity: cat.rarity,
        count: cat._count.rarity,
      })),
    });
  } catch (error) {
    console.error("Shop GET error:", error);
    return NextResponse.json(
      { error: "Mağaza verileri getirilirken hata oluştu" },
      { status: 500 }
    );
  }
}

// POST - Kart satın alma
export async function POST(request: NextRequest) {
  try {
    const authUser = getUserFromToken(request);

    if (!authUser) {
      return NextResponse.json(
        { error: "Kart satın almak için giriş yapmanız gerekli" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { cardId } = body;

    if (!cardId) {
      return NextResponse.json({ error: "Kart ID gerekli" }, { status: 400 });
    }

    // Kartı kontrol et
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      select: {
        id: true,
        name: true,
        cardTitle: true,
        diamondPrice: true,
        isPurchasable: true,
        isAnalyzed: true,
        currentOwners: true,
        maxOwners: true,
        userCards: {
          where: { userId: authUser.userId },
          select: { id: true },
        },
      },
    });

    if (!card) {
      return NextResponse.json({ error: "Kart bulunamadı" }, { status: 404 });
    }

    if (!card.isPurchasable) {
      return NextResponse.json(
        { error: "Bu kart satın alınamaz" },
        { status: 400 }
      );
    }

    if (!card.isAnalyzed) {
      return NextResponse.json(
        { error: "Bu kart henüz analiz edilmemiş" },
        { status: 400 }
      );
    }

    if (!card.diamondPrice) {
      return NextResponse.json(
        { error: "Bu kartın fiyatı belirlenmemiş" },
        { status: 400 }
      );
    }

    // Zaten sahip mi?
    if (card.userCards.length > 0) {
      return NextResponse.json(
        { error: "Bu karta zaten sahipsiniz" },
        { status: 400 }
      );
    }

    // Sınırlı kart kontrolü
    if (card.maxOwners && card.currentOwners >= card.maxOwners) {
      return NextResponse.json(
        { error: "Bu kartın maksimum sahip sayısına ulaşılmış" },
        { status: 400 }
      );
    }

    // Kullanıcının elmas bakiyesini kontrol et
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        currentDiamonds: true,
        username: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    if (user.currentDiamonds < card.diamondPrice) {
      return NextResponse.json(
        {
          success: false,
          error: "Yetersiz elmas bakiyesi",
          required: card.diamondPrice,
          current: user.currentDiamonds,
          needed: card.diamondPrice - user.currentDiamonds,
        },
        { status: 400 }
      );
    }

    // Transaction başlat
    const result = await prisma.$transaction(async (tx) => {
      // Kullanıcının elmasını düş
      const updatedUser = await tx.user.update({
        where: { id: authUser.userId },
        data: {
          currentDiamonds: { decrement: card.diamondPrice! },
        },
        select: {
          currentDiamonds: true,
          totalDiamonds: true,
        },
      });

      // Kart sahipliği ekle
      const userCard = await tx.userCard.create({
        data: {
          userId: authUser.userId,
          cardId: cardId,
          purchasePrice: card.diamondPrice!,
        },
      });

      // Kartın sahip sayısını artır
      await tx.card.update({
        where: { id: cardId },
        data: {
          currentOwners: { increment: 1 },
        },
      });

      // Elmas işlem kaydı
      const transaction = await tx.diamondTransaction.create({
        data: {
          userId: authUser.userId,
          amount: -card.diamondPrice!,
          type: "CARD_PURCHASE",
          description: `${card.cardTitle || card.name} kartı satın alındı`,
          relatedId: cardId,
          relatedType: "card",
        },
      });

      return {
        userCard,
        updatedUser,
        transaction,
      };
    });

    return NextResponse.json({
      success: true,
      message: `${
        card.cardTitle || card.name
      } kartını başarıyla satın aldınız!`,
      purchase: {
        cardId,
        cardName: card.cardTitle || card.name,
        price: card.diamondPrice,
        purchaseDate: new Date(),
      },
      balance: result.updatedUser,
      transaction: result.transaction,
    });
  } catch (error) {
    console.error("Shop POST error:", error);
    return NextResponse.json(
      { error: "Kart satın alınırken hata oluştu" },
      { status: 500 }
    );
  }
}

// PUT - Kart fiyatı güncelleme (Admin only)
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
    const { cardId, diamondPrice, isPurchasable, maxOwners } = body;

    if (!cardId) {
      return NextResponse.json({ error: "Kart ID gerekli" }, { status: 400 });
    }

    const updateData: any = {};
    if (diamondPrice !== undefined) updateData.diamondPrice = diamondPrice;
    if (isPurchasable !== undefined) updateData.isPurchasable = isPurchasable;
    if (maxOwners !== undefined) updateData.maxOwners = maxOwners;

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: updateData,
      select: {
        id: true,
        name: true,
        cardTitle: true,
        diamondPrice: true,
        isPurchasable: true,
        maxOwners: true,
        currentOwners: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Kart başarıyla güncellendi",
      card: updatedCard,
    });
  } catch (error) {
    console.error("Shop PUT error:", error);
    return NextResponse.json(
      { error: "Kart güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}
