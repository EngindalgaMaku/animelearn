import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    // Process cards to generate thumbnail URLs if needed
    const processedUserCards = userCards.map((userCard) => ({
      ...userCard,
      card: {
        ...userCard.card,
        // Generate thumbnail URL if not exists
        thumbnailUrl:
          userCard.card.thumbnailUrl ||
          (userCard.card.imageUrl
            ? userCard.card.imageUrl.replace(
                "/uploads/",
                "/uploads/thumbs/thumb_"
              )
            : null),
      },
    }));

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
