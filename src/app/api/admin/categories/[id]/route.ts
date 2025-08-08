import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Get specific category
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Category GET API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    const data = await request.json();

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Generate new slug if name changed
    let slug = existingCategory.slug;
    if (data.name && data.name !== existingCategory.name) {
      slug = data.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

      // Check if new slug conflicts with existing categories
      const slugConflict = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: id }
        }
      });

      if (slugConflict) {
        return NextResponse.json(
          { error: "Category name already exists" },
          { status: 400 }
        );
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name || existingCategory.name,
        slug,
        description: data.description !== undefined ? data.description : existingCategory.description,
        color: data.color || existingCategory.color,
        icon: data.icon !== undefined ? data.icon : existingCategory.icon,
        isActive: data.isActive !== undefined ? data.isActive : existingCategory.isActive,
        sortOrder: data.sortOrder !== undefined ? data.sortOrder : existingCategory.sortOrder
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Category PUT API error:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category is being used by learning activities
    const activitiesCount = await prisma.learningActivity.count({
      where: { category: existingCategory.slug }
    });

    if (activitiesCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category. It is used by ${activitiesCount} learning activities.` },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Category DELETE API error:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
