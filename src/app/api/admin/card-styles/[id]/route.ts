import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch single card style
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const style = await prisma.cardStyle.findUnique({
      where: { id },
    });

    if (!style) {
      return NextResponse.json(
        { error: "Card style not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      style,
    });
  } catch (error) {
    console.error("Card style fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch card style" },
      { status: 500 }
    );
  }
}

// PUT - Update card style
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      isActive,
      priority,
    } = body;

    // Check if style exists
    const existingStyle = await prisma.cardStyle.findUnique({
      where: { id },
    });

    if (!existingStyle) {
      return NextResponse.json(
        { error: "Card style not found" },
        { status: 404 }
      );
    }

    // Check if name already exists (excluding current style)
    if (name && name !== existingStyle.name) {
      const duplicateName = await prisma.cardStyle.findUnique({
        where: { name },
      });

      if (duplicateName) {
        return NextResponse.json(
          { error: "Card style with this name already exists" },
          { status: 400 }
        );
      }
    }

    // Validate target type if provided
    if (targetType && !["rarity", "element", "category"].includes(targetType)) {
      return NextResponse.json(
        { error: "Target type must be 'rarity', 'element', or 'category'" },
        { status: 400 }
      );
    }

    // Validate target value if targetType and targetValue are provided
    if (targetType && targetValue) {
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
    }

    const style = await prisma.cardStyle.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(targetType !== undefined && { targetType }),
        ...(targetValue !== undefined && { targetValue }),
        ...(containerClass !== undefined && { containerClass }),
        ...(imageClass !== undefined && { imageClass }),
        ...(borderClass !== undefined && { borderClass }),
        ...(backgroundClass !== undefined && { backgroundClass }),
        ...(animationClass !== undefined && { animationClass }),
        ...(glowEffect !== undefined && { glowEffect }),
        ...(hoverEffect !== undefined && { hoverEffect }),
        ...(isActive !== undefined && { isActive }),
        ...(priority !== undefined && { priority }),
      },
    });

    return NextResponse.json({
      success: true,
      style,
    });
  } catch (error) {
    console.error("Card style update error:", error);
    return NextResponse.json(
      { error: "Failed to update card style" },
      { status: 500 }
    );
  }
}

// DELETE - Delete card style
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if style exists
    const existingStyle = await prisma.cardStyle.findUnique({
      where: { id },
    });

    if (!existingStyle) {
      return NextResponse.json(
        { error: "Card style not found" },
        { status: 404 }
      );
    }

    // Card styles can be safely deleted as they don't have foreign key constraints
    await prisma.cardStyle.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Card style deleted successfully",
    });
  } catch (error) {
    console.error("Card style deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete card style" },
      { status: 500 }
    );
  }
}
