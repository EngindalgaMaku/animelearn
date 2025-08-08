import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all rarities
export async function GET() {
  try {
    const rarities = await prisma.rarity.findMany({
      orderBy: [{ level: "asc" }, { sortOrder: "asc" }],
    });

    return NextResponse.json({
      success: true,
      rarities,
    });
  } catch (error) {
    console.error("Rarities fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rarities" },
      { status: 500 }
    );
  }
}

// POST - Create new rarity
export async function POST(request: NextRequest) {
  try {
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

    // Validate required fields
    if (!name || !slug || level === undefined) {
      return NextResponse.json(
        { error: "Name, slug, and level are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingRarity = await prisma.rarity.findUnique({
      where: { slug },
    });

    if (existingRarity) {
      return NextResponse.json(
        { error: "Rarity with this slug already exists" },
        { status: 400 }
      );
    }

    // Check if level already exists
    const existingLevel = await prisma.rarity.findUnique({
      where: { level },
    });

    if (existingLevel) {
      return NextResponse.json(
        { error: "Rarity with this level already exists" },
        { status: 400 }
      );
    }

    const rarity = await prisma.rarity.create({
      data: {
        name,
        slug,
        description: description || undefined,
        color: color || "#3B82F6",
        bgColor: bgColor || undefined,
        borderColor: borderColor || undefined,
        textColor: textColor || undefined,
        gradient: gradient || undefined,
        animation: animation || undefined,
        level,
        minDiamondPrice: minDiamondPrice || 50,
        maxDiamondPrice: maxDiamondPrice || 100,
        dropRate: dropRate || 100.0,
        iconUrl: iconUrl || undefined,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        rarity,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Rarity creation error:", error);
    return NextResponse.json(
      { error: "Failed to create rarity" },
      { status: 500 }
    );
  }
}
