import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { createHash } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(request: NextRequest) {
  try {
    // Auth verification
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = authResult.user.id;

    // Get user's cards with card details (collection bilgisi dahil)
    const userCards = await prisma.userCard.findMany({
      where: {
        userId: userId,
      },
      include: {
        card: {
          include: {
            collection: {
              select: {
                id: true,
                name: true,
                description: true,
                totalCards: true,
              },
            },
          },
        },
      },
      orderBy: {
        purchaseDate: "desc",
      },
    });

    // Process cards to generate thumbnail URLs if needed and normalize category
    const normalizeCategory = (cat?: string | null) => {
      if (!cat) return "anime-collection";
      const c = (cat || "").toLowerCase();
      switch (c) {
        case "anime":
          return "anime-collection";
        case "star":
          return "star-collection";
        case "car":
          return "car-collection";
        default:
          return cat as string;
      }
    };

    const processedUserCards = userCards.map((userCard) => {
      // Generate secure tokens for thumbnail and full images
      const cardId = userCard.card.id;

      const thumbnailToken = jwt.sign(
        {
          cardId,
          type: "thumbnail",
          timestamp: Date.now(),
          hash: createHash("sha256")
            .update(`${cardId}-thumbnail-${Date.now()}`)
            .digest("hex")
            .substring(0, 8),
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      const fullToken = jwt.sign(
        {
          cardId,
          type: "full",
          timestamp: Date.now(),
          hash: createHash("sha256")
            .update(`${cardId}-full-${Date.now()}`)
            .digest("hex")
            .substring(0, 8),
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return {
        ...userCard,
        card: {
          ...userCard.card,
          // Ensure category is present as a normalized slug
          category: normalizeCategory((userCard.card as any).category),
          // Generate thumbnail URL if not exists
          thumbnailUrl:
            userCard.card.thumbnailUrl ||
            (userCard.card.imageUrl
              ? userCard.card.imageUrl.replace(
                  "/uploads/",
                  "/uploads/thumbs/thumb_"
                )
              : null),
          // Provide secure tokenized URLs to avoid rate-limiting on grids
          secureThumbnailUrl: `/api/secure-image?cardId=${cardId}&type=thumbnail&token=${thumbnailToken}`,
          secureFullImageUrl: `/api/secure-image?cardId=${cardId}&type=full&token=${fullToken}`,
        },
      };
    });

    // Calculate stats
    const totalCards = processedUserCards.length;
    const uniqueCards = new Set(processedUserCards.map((uc: any) => uc.cardId))
      .size;
    const totalValue = processedUserCards.reduce(
      (sum: number, uc: any) => sum + (uc.card.estimatedValue || 0),
      0
    );

    // Rarity breakdown
    const rarityBreakdown: Record<string, number> = {};
    processedUserCards.forEach((uc: any) => {
      if (uc.card.rarity) {
        rarityBreakdown[uc.card.rarity] =
          (rarityBreakdown[uc.card.rarity] || 0) + 1;
      }
    });

    // Series breakdown (anime)
    const animeBreakdown: Record<string, number> = {};
    processedUserCards.forEach((uc: any) => {
      if (uc.card.series) {
        animeBreakdown[uc.card.series] =
          (animeBreakdown[uc.card.series] || 0) + 1;
      }
    });

    // Collection breakdown
    const collectionBreakdown: Record<string, number> = {};
    processedUserCards.forEach((uc: any) => {
      const collectionName = uc.card.collection?.name || "No Collection";
      collectionBreakdown[collectionName] =
        (collectionBreakdown[collectionName] || 0) + 1;
    });

    const stats = {
      totalCards,
      uniqueCards,
      totalValue,
      rarityBreakdown,
      animeBreakdown,
      collectionBreakdown,
    };

    return NextResponse.json({
      success: true,
      cards: processedUserCards,
      stats,
    });
  } catch (error) {
    console.error("My Cards API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cards" },
      { status: 500 }
    );
  }
}
