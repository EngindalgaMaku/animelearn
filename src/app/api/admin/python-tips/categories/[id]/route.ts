import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface AdminPythonTipCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Admin kontrolü
async function checkAdminAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return false;
  }
  return true;
}

// GET - Belirli bir Python tip kategorisini getir (Admin only)
export async function GET(
  request: NextRequest,
  context: AdminPythonTipCategoryPageProps
) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const category = await prisma.pythonTipCategory.findUnique({
      where: { id },
      include: {
        tips: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            isActive: true,
            viewCount: true,
            likeCount: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            tips: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Python tip category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching admin Python tip category:", error);
    return NextResponse.json(
      { error: "Failed to fetch Python tip category" },
      { status: 500 }
    );
  }
}

// PUT - Python tip kategorisini güncelle (Admin only)
export async function PUT(
  request: NextRequest,
  context: AdminPythonTipCategoryPageProps
) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const { name, slug, description, color, icon, sortOrder, isActive } = body;

    // Check if category exists
    const existingCategory = await prisma.pythonTipCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Python tip category not found" },
        { status: 404 }
      );
    }

    // Check if new name or slug already exists (if being changed)
    if (
      (name && name !== existingCategory.name) ||
      (slug && slug !== existingCategory.slug)
    ) {
      const duplicateCategory = await prisma.pythonTipCategory.findFirst({
        where: {
          id: { not: id },
          OR: [
            ...(name && name !== existingCategory.name ? [{ name }] : []),
            ...(slug && slug !== existingCategory.slug ? [{ slug }] : []),
          ],
        },
      });

      if (duplicateCategory) {
        return NextResponse.json(
          { error: "A category with this name or slug already exists" },
          { status: 400 }
        );
      }
    }

    const updatedCategory = await prisma.pythonTipCategory.update({
      where: { id },
      data: {
        name: name || existingCategory.name,
        slug: slug || existingCategory.slug,
        description:
          description !== undefined
            ? description
            : existingCategory.description,
        color: color || existingCategory.color,
        icon: icon !== undefined ? icon : existingCategory.icon,
        sortOrder:
          sortOrder !== undefined ? sortOrder : existingCategory.sortOrder,
        isActive: isActive !== undefined ? isActive : existingCategory.isActive,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating admin Python tip category:", error);
    return NextResponse.json(
      { error: "Failed to update Python tip category" },
      { status: 500 }
    );
  }
}

// DELETE - Python tip kategorisini sil (Admin only)
export async function DELETE(
  request: NextRequest,
  context: AdminPythonTipCategoryPageProps
) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    // Check if category exists
    const existingCategory = await prisma.pythonTipCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            tips: true,
          },
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Python tip category not found" },
        { status: 404 }
      );
    }

    // Check if category has tips
    if (existingCategory._count.tips > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete category that contains tips. Please move or delete all tips first.",
        },
        { status: 400 }
      );
    }

    // Delete the category
    await prisma.pythonTipCategory.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Python tip category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting admin Python tip category:", error);
    return NextResponse.json(
      { error: "Failed to delete Python tip category" },
      { status: 500 }
    );
  }
}
