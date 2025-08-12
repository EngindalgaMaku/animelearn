import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const cardId = searchParams.get("cardId");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const skip = (page - 1) * limit;

    // Build where condition
    const where: any = {};

    if (cardId) {
      where.cardId = cardId;
    }

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) {
        where.date.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.date.lte = new Date(dateTo);
      }
    }

    // Get analytics data
    const [analytics, total] = await Promise.all([
      prisma.analytics.findMany({
        where,
        include: {
          card: {
            select: {
              id: true,
              name: true,
              series: true,
              character: true,
              rarity: true,
              category: true,
              diamondPrice: true,
              thumbnailUrl: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.analytics.count({ where }),
    ]);

    // Get summary statistics
    const summaryStats = await prisma.analytics.aggregate({
      where,
      _sum: {
        views: true,
        searches: true,
      },
      _avg: {
        estimatedValue: true,
        marketValue: true,
        priceChange: true,
      },
      _count: {
        id: true,
      },
    });

    // Get top viewed cards
    const topViewedCards = await prisma.analytics.groupBy({
      by: ["cardId"],
      _sum: {
        views: true,
        searches: true,
      },
      orderBy: {
        _sum: {
          views: "desc",
        },
      },
      take: 10,
    });

    // Get card details for top viewed
    const topCardIds = topViewedCards.map((item) => item.cardId);
    const topCards = await prisma.card.findMany({
      where: {
        id: {
          in: topCardIds,
        },
      },
      select: {
        id: true,
        name: true,
        series: true,
        character: true,
        rarity: true,
        thumbnailUrl: true,
      },
    });

    // Combine top viewed data with card details
    const topViewedWithDetails = topViewedCards.map((analytics) => {
      const card = topCards.find((c) => c.id === analytics.cardId);
      return {
        ...analytics,
        card,
      };
    });

    // Get analytics by date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const analyticsTimeline = await prisma.analytics.groupBy({
      by: ["date"],
      where: {
        date: {
          gte: thirtyDaysAgo,
        },
      },
      _sum: {
        views: true,
        searches: true,
      },
      _avg: {
        estimatedValue: true,
        marketValue: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Get rarity distribution in analytics
    const rarityDistribution = await prisma.analytics.groupBy({
      by: ["cardId"],
      _sum: {
        views: true,
      },
    });

    const cardIds = rarityDistribution.map((item) => item.cardId);
    const cardsWithRarity = await prisma.card.findMany({
      where: {
        id: {
          in: cardIds,
        },
      },
      select: {
        id: true,
        rarity: true,
      },
    });

    const rarityStats = cardsWithRarity.reduce((acc: any, card) => {
      if (!acc[card.rarity || "unknown"]) {
        acc[card.rarity || "unknown"] = 0;
      }
      const analyticsData = rarityDistribution.find(
        (a) => a.cardId === card.id
      );
      acc[card.rarity || "unknown"] += analyticsData?._sum?.views || 0;
      return acc;
    }, {});

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      analytics,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      summary: {
        totalViews: summaryStats._sum.views || 0,
        totalSearches: summaryStats._sum.searches || 0,
        averageEstimatedValue: summaryStats._avg.estimatedValue || 0,
        averageMarketValue: summaryStats._avg.marketValue || 0,
        averagePriceChange: summaryStats._avg.priceChange || 0,
        totalRecords: summaryStats._count.id || 0,
      },
      topViewedCards: topViewedWithDetails,
      timeline: analyticsTimeline,
      rarityDistribution: rarityStats,
    });
  } catch (error) {
    console.error("Card Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch card analytics data" },
      { status: 500 }
    );
  }
}
