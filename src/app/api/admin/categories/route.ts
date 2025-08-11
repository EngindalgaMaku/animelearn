import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

interface AuthUser {
  userId: string;
  username: string;
}

async function getUserFromSession(): Promise<AuthUser | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return null;
    }

    return {
      userId: session.user.id,
      username:
        session.user.username || session.user.email?.split("@")[0] || "User",
    };
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
}

// GET - List all categories
export async function GET(request: NextRequest) {
  try {
    const authUser = await getUserFromSession();

    if (!authUser) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Admin kontrolü
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: { role: true, username: true },
    });

    if (!user || (user.role !== "admin" && user.username !== "admin")) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    console.log("Categories API response:", {
      categories,
      count: categories.length,
    });

    return NextResponse.json({
      success: true,
      categories,
      total: categories.length,
    });
  } catch (error) {
    console.error("Categories GET API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        color: data.color || "#8B5CF6",
        icon: data.icon || null,
        isActive: data.isActive !== false,
        sortOrder: data.sortOrder || 0,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Categories POST API error:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
