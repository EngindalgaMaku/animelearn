import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all elements
export async function GET() {
  try {
    const elements = await prisma.element.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
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

// POST - Create new element
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      slug,
      description,
      color,
      icon,
      iconUrl,
      effectDescription,
      priceModifier,
      isActive,
      sortOrder,
    } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingElement = await prisma.element.findUnique({
      where: { slug },
    });

    if (existingElement) {
      return NextResponse.json(
        { error: "Element with this slug already exists" },
        { status: 400 }
      );
    }

    // Check if name already exists
    const existingName = await prisma.element.findUnique({
      where: { name },
    });

    if (existingName) {
      return NextResponse.json(
        { error: "Element with this name already exists" },
        { status: 400 }
      );
    }

    const element = await prisma.element.create({
      data: {
        name,
        slug,
        description: description || undefined,
        color: color || "#3B82F6",
        icon: icon || undefined,
        iconUrl: iconUrl || undefined,
        effectDescription: effectDescription || undefined,
        priceModifier: priceModifier || 1.0,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        element,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Element creation error:", error);
    return NextResponse.json(
      { error: "Failed to create element" },
      { status: 500 }
    );
  }
}
