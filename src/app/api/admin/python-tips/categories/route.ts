import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Admin kontrolü
async function checkAdminAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return false;
  }
  return true;
}

// GET - Tüm Python tip kategorilerini getir (Admin only)
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");
    const search = searchParams.get("search");

    const where: any = {};

    if (isActive === "true") {
      where.isActive = true;
    } else if (isActive === "false") {
      where.isActive = false;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const categories = await prisma.pythonTipCategory.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        _count: {
          select: {
            tips: true,
          },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching admin Python tip categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch Python tip categories" },
      { status: 500 }
    );
  }
}

// POST - Yeni Python tip kategorisi oluştur (Admin only)
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, color, icon, sortOrder, isActive } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Generate slug if not provided
    let finalSlug = slug;
    if (!finalSlug) {
      finalSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    }

    // Check if name or slug already exists
    const existingCategory = await prisma.pythonTipCategory.findFirst({
      where: {
        OR: [{ name }, { slug: finalSlug }],
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this name or slug already exists" },
        { status: 400 }
      );
    }

    const newCategory = await prisma.pythonTipCategory.create({
      data: {
        name,
        slug: finalSlug,
        description,
        color: color || "#3B82F6",
        icon,
        sortOrder: sortOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating Python tip category:", error);
    return NextResponse.json(
      { error: "Failed to create Python tip category" },
      { status: 500 }
    );
  }
}
