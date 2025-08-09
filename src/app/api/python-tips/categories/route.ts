import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/python-tips/categories - Get all Python tip categories
export async function GET(request: NextRequest) {
  try {
    const categories = await db.pythonTipCategory.findMany({
      where: {
        isActive: true,
      },
      include: {
        _count: {
          select: {
            tips: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
      orderBy: [
        { sortOrder: "asc" },
        { name: "asc" },
      ],
    });

    return NextResponse.json({
      success: true,
      categories: categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        color: category.color,
        icon: category.icon,
        tipCount: category._count.tips,
      })),
    });
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/python-tips/categories - Create new category (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, color, icon, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingCategory = await db.pythonTipCategory.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    const category = await db.pythonTipCategory.create({
      data: {
        name,
        slug,
        description,
        color: color || "#3B82F6",
        icon: icon || "📚",
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json({
      success: true,
      category,
      message: "Category created successfully",
    });
  } catch (error) {
    console.error("Category creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}