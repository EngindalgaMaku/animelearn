import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch single rarity
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const rarity = await prisma.rarity.findUnique({
      where: { id },
    });

    if (!rarity) {
      return NextResponse.json({ error: "Rarity not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      rarity,
    });
  } catch (error) {
    console.error("Rarity fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rarity" },
      { status: 500 }
    );
  }
}

// PUT - Update rarity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      name,
      slug,
      description,
      color,
      bgColor,
      borderColor,
      textColor,
      gradient,
      animation,
      level,
      minDiamondPrice,
      maxDiamondPrice,
      dropRate,
      iconUrl,
      isActive,
      sortOrder,
    } = body;

    // Check if rarity exists
    const existingRarity = await prisma.rarity.findUnique({
      where: { id },
    });

    if (!existingRarity) {
      return NextResponse.json({ error: "Rarity not found" }, { status: 404 });
    }

    // Check if slug already exists (excluding current rarity)
    if (slug && slug !== existingRarity.slug) {
      const duplicateSlug = await prisma.rarity.findUnique({
        where: { slug },
      });

      if (duplicateSlug) {
        return NextResponse.json(
          { error: "Rarity with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Check if level already exists (excluding current rarity)
    if (level !== undefined && level !== existingRarity.level) {
      const duplicateLevel = await prisma.rarity.findUnique({
        where: { level },
      });

      if (duplicateLevel) {
        return NextResponse.json(
          { error: "Rarity with this level already exists" },
          { status: 400 }
        );
      }
    }

    const rarity = await prisma.rarity.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color }),
        ...(bgColor !== undefined && { bgColor }),
        ...(borderColor !== undefined && { borderColor }),
        ...(textColor !== undefined && { textColor }),
        ...(gradient !== undefined && { gradient }),
        ...(animation !== undefined && { animation }),
        ...(level !== undefined && { level }),
        ...(minDiamondPrice !== undefined && { minDiamondPrice }),
        ...(maxDiamondPrice !== undefined && { maxDiamondPrice }),
        ...(dropRate !== undefined && { dropRate }),
        ...(iconUrl !== undefined && { iconUrl }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json({
      success: true,
      rarity,
    });
  } catch (error) {
    console.error("Rarity update error:", error);
    return NextResponse.json(
      { error: "Failed to update rarity" },
      { status: 500 }
    );
  }
}

// DELETE - Delete rarity
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if rarity exists
    const existingRarity = await prisma.rarity.findUnique({
      where: { id },
    });

    if (!existingRarity) {
      return NextResponse.json({ error: "Rarity not found" }, { status: 404 });
    }

    // TODO: Check if rarity is being used by any cards
    // const cardsUsingRarity = await prisma.card.count({
    //   where: { rarity: existingRarity.slug }
    // });

    // if (cardsUsingRarity > 0) {
    //   return NextResponse.json(
    //     { error: `Cannot delete rarity. ${cardsUsingRarity} cards are using this rarity.` },
    //     { status: 400 }
    //   );
    // }

    await prisma.rarity.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Rarity deleted successfully",
    });
  } catch (error) {
    console.error("Rarity deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete rarity" },
      { status: 500 }
    );
  }
}
