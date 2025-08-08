import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch single element
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const element = await prisma.element.findUnique({
      where: { id },
    });

    if (!element) {
      return NextResponse.json({ error: "Element not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      element,
    });
  } catch (error) {
    console.error("Element fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch element" },
      { status: 500 }
    );
  }
}

// PUT - Update element
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
      icon,
      iconUrl,
      effectDescription,
      priceModifier,
      isActive,
      sortOrder,
    } = body;

    // Check if element exists
    const existingElement = await prisma.element.findUnique({
      where: { id },
    });

    if (!existingElement) {
      return NextResponse.json({ error: "Element not found" }, { status: 404 });
    }

    // Check if slug already exists (excluding current element)
    if (slug && slug !== existingElement.slug) {
      const duplicateSlug = await prisma.element.findUnique({
        where: { slug },
      });

      if (duplicateSlug) {
        return NextResponse.json(
          { error: "Element with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Check if name already exists (excluding current element)
    if (name && name !== existingElement.name) {
      const duplicateName = await prisma.element.findUnique({
        where: { name },
      });

      if (duplicateName) {
        return NextResponse.json(
          { error: "Element with this name already exists" },
          { status: 400 }
        );
      }
    }

    const element = await prisma.element.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
        ...(iconUrl !== undefined && { iconUrl }),
        ...(effectDescription !== undefined && { effectDescription }),
        ...(priceModifier !== undefined && { priceModifier }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json({
      success: true,
      element,
    });
  } catch (error) {
    console.error("Element update error:", error);
    return NextResponse.json(
      { error: "Failed to update element" },
      { status: 500 }
    );
  }
}

// DELETE - Delete element
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if element exists
    const existingElement = await prisma.element.findUnique({
      where: { id },
    });

    if (!existingElement) {
      return NextResponse.json({ error: "Element not found" }, { status: 404 });
    }

    // TODO: Check if element is being used by any cards
    // const cardsUsingElement = await prisma.card.count({
    //   where: { element: existingElement.slug }
    // });

    // if (cardsUsingElement > 0) {
    //   return NextResponse.json(
    //     { error: `Cannot delete element. ${cardsUsingElement} cards are using this element.` },
    //     { status: 400 }
    //   );
    // }

    await prisma.element.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Element deleted successfully",
    });
  } catch (error) {
    console.error("Element deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete element" },
      { status: 500 }
    );
  }
}
