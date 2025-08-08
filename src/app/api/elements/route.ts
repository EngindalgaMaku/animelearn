import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all active elements for public use
export async function GET() {
  try {
    const elements = await prisma.element.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        color: true,
        icon: true,
        iconUrl: true,
        effectDescription: true,
        priceModifier: true,
      },
    });

    return NextResponse.json({
      success: true,
      elements,
    });
  } catch (error) {
    console.error("Elements fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch elements" },
      { status: 500 }
    );
  }
}
