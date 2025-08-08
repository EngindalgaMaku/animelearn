import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all card styles
export async function GET() {
  try {
    const styles = await prisma.cardStyle.findMany({
      orderBy: [
        { isActive: "desc" },
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      success: true,
      styles,
    });
  } catch (error) {
    console.error("Card styles fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch card styles" },
      { status: 500 }
    );
  }
}

// POST - Create new card style
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      targetType,
      targetValue,
      containerClass,
      imageClass,
      borderClass,
      backgroundClass,
      animationClass,
      glowEffect,
      hoverEffect,
      isActive = true,
      priority = 0,
    } = body;

    // Validate required fields
    if (!name || !targetType || !targetValue) {
      return NextResponse.json(
        { error: "Name, target type, and target value are required" },
        { status: 400 }
      );
    }

    // Validate target type
    if (!["rarity", "element", "category"].includes(targetType)) {
      return NextResponse.json(
        { error: "Target type must be 'rarity', 'element', or 'category'" },
        { status: 400 }
      );
    }

    // Check if name already exists
    const existingName = await prisma.cardStyle.findUnique({
      where: { name },
    });

    if (existingName) {
      return NextResponse.json(
        { error: "Card style with this name already exists" },
        { status: 400 }
      );
    }

    // Validate target value based on target type
    if (targetType === "rarity") {
      const rarity = await prisma.rarity.findUnique({
        where: { slug: targetValue },
      });

      if (!rarity) {
        return NextResponse.json(
          { error: "Invalid rarity slug" },
          { status: 400 }
        );
      }
    } else if (targetType === "element") {
      const element = await prisma.element.findUnique({
        where: { slug: targetValue },
      });

      if (!element) {
        return NextResponse.json(
          { error: "Invalid element slug" },
          { status: 400 }
        );
      }
    } else if (targetType === "category") {
      const category = await prisma.category.findUnique({
        where: { slug: targetValue },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Invalid category slug" },
          { status: 400 }
        );
      }
    }

    const style = await prisma.cardStyle.create({
      data: {
        name,
        targetType,
        targetValue,
        containerClass: containerClass || null,
        imageClass: imageClass || null,
        borderClass: borderClass || null,
        backgroundClass: backgroundClass || null,
        animationClass: animationClass || null,
        glowEffect: glowEffect || null,
        hoverEffect: hoverEffect || null,
        isActive,
        priority,
      },
    });

    return NextResponse.json({
      success: true,
      style,
    });
  } catch (error) {
    console.error("Card style creation error:", error);
    return NextResponse.json(
      { error: "Failed to create card style" },
      { status: 500 }
    );
  }
}
