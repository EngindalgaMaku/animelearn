import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all active rarities for public use
export async function GET() {
  try {
    const rarities = await prisma.rarity.findMany({
      where: { isActive: true },
      orderBy: { level: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        color: true,
        bgColor: true,
        borderColor: true,
        textColor: true,
        gradient: true,
        animation: true,
        level: true,
        dropRate: true,
        icon: true,
        iconUrl: true,
        maxDiamondPrice: true,
        minDiamondPrice: true,
      },
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
