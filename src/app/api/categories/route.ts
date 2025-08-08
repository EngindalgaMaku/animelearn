import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch only the 3 main categories for public use with real card counts
export async function GET(request: NextRequest) {
  try {
    // Only fetch the 3 main categories we want to show
    const allowedSlugs = ["anime-collection", "star-collection", "car-collection"];
    
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        slug: {
          in: allowedSlugs
        }
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        color: true,
        icon: true,
        sortOrder: true,
        cardCount: true,
      },
    });

    // Her kategori için gerçek kart sayısını hesapla
    const categoriesWithRealCounts = await Promise.all(
      categories.map(async (category) => {
        const realCardCount = await prisma.card.count({
          where: {
            category: category.slug,
            isAnalyzed: true,
            isPurchasable: true,
          },
        });

        return {
          ...category,
          cardCount: realCardCount,
        };
      })
    );

    // Anime kategorisini en başa koy
    const sortedCategories = categoriesWithRealCounts.sort((a, b) => {
      if (a.slug === "anime-collection") return -1;
      if (b.slug === "anime-collection") return 1;
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({
      success: true,
      categories: sortedCategories,
    });
  } catch (error) {
    console.error("Categories fetch failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
