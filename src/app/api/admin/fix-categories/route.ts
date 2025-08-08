import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Searching for cards with "anime" category...');
    
    // Find all cards with category "anime"
    const cardsToUpdate = await prisma.card.findMany({
      where: {
        category: 'anime'
      },
      select: {
        id: true,
        name: true,
        category: true
      }
    });

    console.log(`📊 Found ${cardsToUpdate.length} cards with "anime" category`);

    if (cardsToUpdate.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No cards need to be updated',
        updated: 0
      });
    }

    // Update all cards from "anime" to "anime-collection"
    const updateResult = await prisma.card.updateMany({
      where: {
        category: 'anime'
      },
      data: {
        category: 'anime-collection'
      }
    });

    console.log(`✅ Successfully updated ${updateResult.count} cards from "anime" to "anime-collection"`);

    // Verify the update
    const remainingAnimeCards = await prisma.card.count({
      where: {
        category: 'anime'
      }
    });

    // Show current category distribution
    const categoryStats = await prisma.card.groupBy({
      by: ['category'],
      _count: {
        id: true
      }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updateResult.count} cards from "anime" to "anime-collection"`,
      updated: updateResult.count,
      remainingAnimeCards,
      categoryDistribution: categoryStats.map(stat => ({
        category: stat.category,
        count: stat._count.id
      }))
    });

  } catch (error) {
    console.error('❌ Error fixing anime category:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fix categories",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
