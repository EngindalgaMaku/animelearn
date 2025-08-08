import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all pricing rules
export async function GET() {
  try {
    const rules = await prisma.diamondPackage.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({
      success: true,
      rules,
    });
  } catch (error) {
    console.error("Pricing rules fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pricing rules" },
      { status: 500 }
    );
  }
}

// POST - Create new pricing rule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      type,
      targetValue,
      basePrice,
      multiplier,
      minPrice,
      maxPrice,
      conditions,
      isActive,
      priority,
    } = body;

    // Validate required fields
    if (!name || !type || basePrice === undefined || multiplier === undefined) {
      return NextResponse.json(
        { error: "Name, type, base price, and multiplier are required" },
        { status: 400 }
      );
    }

    // Check if name already exists
    const existingRule = await prisma.diamondPackage.findFirst({
      where: { name },
    });

    if (existingRule) {
      return NextResponse.json(
        { error: "Pricing rule with this name already exists" },
        { status: 400 }
      );
    }

    const rule = await prisma.diamondPackage.create({
      data: {
        name,
        packageType: type || "custom",
        diamonds: Math.round(basePrice * multiplier) || 100,
        price: basePrice || 10.0,
        originalPrice: maxPrice || undefined,
        bonus: 0,
        popular: false,
        bestValue: false,
        level: priority || 1,
        badge: "Custom",
        color: "#3B82F6",
        glow: "#60A5FA",
        icon: "💎",
        features: JSON.stringify(conditions || []),
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: priority || 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        rule,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Pricing rule creation error:", error);
    return NextResponse.json(
      { error: "Failed to create pricing rule" },
      { status: 500 }
    );
  }
}
