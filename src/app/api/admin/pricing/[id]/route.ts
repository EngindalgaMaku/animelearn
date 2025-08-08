import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch single pricing rule
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const rule = await prisma.diamondPackage.findUnique({
      where: { id },
    });

    if (!rule) {
      return NextResponse.json(
        { error: "Diamond package not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      rule,
    });
  } catch (error) {
    console.error("Diamond package fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pricing rule" },
      { status: 500 }
    );
  }
}

// PUT - Update pricing rule
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if rule exists
    const existingRule = await prisma.diamondPackage.findUnique({
      where: { id },
    });

    if (!existingRule) {
      return NextResponse.json(
        { error: "Diamond package not found" },
        { status: 404 }
      );
    }

    // Check if name already exists (excluding current package)
    if (name && name !== existingRule.name) {
      const duplicateName = await prisma.diamondPackage.findFirst({
        where: {
          name,
          id: { not: id }
        },
      });

      if (duplicateName) {
        return NextResponse.json(
          { error: "Diamond package with this name already exists" },
          { status: 400 }
        );
      }
    }

    const rule = await prisma.diamondPackage.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(type !== undefined && { packageType: type }),
        ...(basePrice !== undefined && { price: basePrice }),
        ...(multiplier !== undefined && { diamonds: Math.round((basePrice || 10) * multiplier) }),
        ...(minPrice !== undefined && { originalPrice: minPrice }),
        ...(maxPrice !== undefined && { originalPrice: maxPrice }),
        ...(conditions !== undefined && { features: JSON.stringify(conditions) }),
        ...(isActive !== undefined && { isActive }),
        ...(priority !== undefined && { level: priority, sortOrder: priority }),
      },
    });

    return NextResponse.json({
      success: true,
      rule,
    });
  } catch (error) {
    console.error("Diamond package update error:", error);
    return NextResponse.json(
      { error: "Failed to update pricing rule" },
      { status: 500 }
    );
  }
}

// DELETE - Delete pricing rule
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if rule exists
    const existingRule = await prisma.diamondPackage.findUnique({
      where: { id },
    });

    if (!existingRule) {
      return NextResponse.json(
        { error: "Diamond package not found" },
        { status: 404 }
      );
    }

    // Note: Diamond packages can be safely deleted as they don't have foreign key constraints
    // But we might want to check if it's the only base price rule

    await prisma.diamondPackage.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Diamond package deleted successfully",
    });
  } catch (error) {
    console.error("Diamond package deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete pricing rule" },
      { status: 500 }
    );
  }
}
