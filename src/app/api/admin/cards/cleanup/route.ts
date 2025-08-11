import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

interface DeletionResult {
  category: string;
  deleted: number;
  cardNames: string[];
}

// Get user from session
async function getUserFromSession() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return null;
    }

    return {
      userId: session.user.id,
      username:
        session.user.username || session.user.email?.split("@")[0] || "User",
    };
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
}

// GET - Identify bad cards
export async function GET(request: NextRequest) {
  try {
    const authUser = await getUserFromSession();

    if (!authUser || authUser.username !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    console.log("🔍 Scanning for bad card data...");

    // Define criteria for bad cards
    const badCardQueries = [
      // Cards with null essential fields
      {
        name: "Null essential fields",
        where: {
          OR: [
            { name: null },
            { cardTitle: null },
            { series: null },
            { character: null },
            { rarity: null },
          ],
        },
      },

      // Cards with empty essential fields
      {
        name: "Empty essential fields",
        where: {
          OR: [
            { name: "" },
            { cardTitle: "" },
            { series: "" },
            { character: "" },
            { rarity: "" },
          ],
        },
      },

      // Cards with placeholder/generic names
      {
        name: "Generic placeholder names",
        where: {
          OR: [
            {
              name: {
                contains: "Anime Card",
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              cardTitle: {
                contains: "Anime Card",
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              name: {
                contains: "İsimsiz Kart",
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              cardTitle: {
                contains: "İsimsiz Kart",
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              name: {
                contains: "Unnamed Card",
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              cardTitle: {
                contains: "Unnamed Card",
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              name: {
                contains: "Default Card",
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              cardTitle: {
                contains: "Default Card",
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              character: {
                contains: "Unknown",
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              character: {
                contains: "Anime Character",
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        },
      },

      // Cards not analyzed
      {
        name: "Unanalyzed cards",
        where: {
          isAnalyzed: false,
        },
      },

      // Cards with null or zero diamond price
      {
        name: "Invalid pricing",
        where: {
          OR: [{ diamondPrice: null }, { diamondPrice: 0 }],
        },
      },
    ];

    const results = [];
    let totalBadCards = 0;

    for (const query of badCardQueries) {
      const cards = await prisma.card.findMany({
        where: query.where,
        select: {
          id: true,
          name: true,
          cardTitle: true,
          series: true,
          character: true,
          rarity: true,
          diamondPrice: true,
          isAnalyzed: true,
          imagePath: true,
          fileName: true,
        },
      });

      results.push({
        category: query.name,
        count: cards.length,
        cards: cards,
      });

      totalBadCards += cards.length;
    }

    // Get total card count for reference
    const totalCards = await prisma.card.count();

    console.log(
      `📊 Found ${totalBadCards} bad cards out of ${totalCards} total cards`
    );

    return NextResponse.json({
      success: true,
      message: `Found ${totalBadCards} bad cards out of ${totalCards} total cards`,
      data: {
        totalCards,
        totalBadCards,
        badCardPercentage: Math.round((totalBadCards / totalCards) * 100),
        categories: results,
      },
    });
  } catch (error) {
    console.error("❌ Card cleanup scan failed:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove bad cards
export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getUserFromSession();

    if (!authUser || authUser.username !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { categories = [], confirm = false } = body;

    if (!confirm) {
      return NextResponse.json(
        { error: "Confirmation required. Set confirm: true to proceed." },
        { status: 400 }
      );
    }

    console.log("🧹 Starting bad card cleanup...");

    const deletionResults: DeletionResult[] = [];
    let totalDeleted = 0;

    // Define the same criteria for deletion
    const deletionQueries = [
      {
        name: "Null essential fields",
        where: {
          OR: [
            { name: null },
            { cardTitle: null },
            { series: null },
            { character: null },
            { rarity: null },
          ],
        },
        enabled:
          categories.includes("Null essential fields") ||
          categories.length === 0,
      },

      {
        name: "Empty essential fields",
        where: {
          OR: [
            { name: "" },
            { cardTitle: "" },
            { series: "" },
            { character: "" },
            { rarity: "" },
          ],
        },
        enabled:
          categories.includes("Empty essential fields") ||
          categories.length === 0,
      },

      {
        name: "Generic placeholder names",
        where: {
          OR: [
            {
              name: {
                contains: "Anime Card",
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              cardTitle: {
                contains: "Anime Card",
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              name: {
                contains: "İsimsiz Kart",
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              cardTitle: {
                contains: "İsimsiz Kart",
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              name: {
                contains: "Unnamed Card",
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              cardTitle: {
                contains: "Unnamed Card",
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              name: {
                contains: "Default Card",
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              cardTitle: {
                contains: "Default Card",
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              character: {
                contains: "Unknown",
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              character: {
                contains: "Anime Character",
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        },
        enabled:
          categories.includes("Generic placeholder names") ||
          categories.length === 0,
      },

      {
        name: "Unanalyzed cards",
        where: {
          isAnalyzed: false,
        },
        enabled:
          categories.includes("Unanalyzed cards") || categories.length === 0,
      },

      {
        name: "Invalid pricing",
        where: {
          OR: [{ diamondPrice: null }, { diamondPrice: 0 }],
        },
        enabled:
          categories.includes("Invalid pricing") || categories.length === 0,
      },
    ];

    // Execute deletions in transaction
    await prisma.$transaction(async (tx) => {
      for (const query of deletionQueries) {
        if (!query.enabled) continue;

        // First get the cards to be deleted for logging
        const cardsToDelete = await tx.card.findMany({
          where: query.where,
          select: { id: true, name: true, cardTitle: true, fileName: true },
        });

        if (cardsToDelete.length > 0) {
          // Delete related records first
          await tx.userCard.deleteMany({
            where: { cardId: { in: cardsToDelete.map((c) => c.id) } },
          });

          await tx.analytics.deleteMany({
            where: { cardId: { in: cardsToDelete.map((c) => c.id) } },
          });

          await tx.usedCardNames.deleteMany({
            where: { cardId: { in: cardsToDelete.map((c) => c.id) } },
          });

          // Delete the cards
          const deleteResult = await tx.card.deleteMany({
            where: query.where,
          });

          deletionResults.push({
            category: query.name,
            deleted: deleteResult.count,
            cardNames: cardsToDelete
              .map((c) => c.name || c.cardTitle || c.fileName)
              .slice(0, 10), // Show first 10
          });

          totalDeleted += deleteResult.count;
          console.log(
            `✅ Deleted ${deleteResult.count} cards from category: ${query.name}`
          );
        }
      }
    });

    console.log(`🎯 Cleanup completed. Total deleted: ${totalDeleted} cards`);

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${totalDeleted} bad cards`,
      data: {
        totalDeleted,
        categories: deletionResults,
      },
    });
  } catch (error) {
    console.error("❌ Card cleanup failed:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
