import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/python-tips - Get tips with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured") === "true";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { tags: { contains: search, mode: "insensitive" } },
      ];
    }

    if (featured) {
      where.publishDate = {
        lte: new Date(),
      };
    }

    // Get tips with pagination
    const [tips, totalCount] = await Promise.all([
      db.pythonTip.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: {
              interactions: true,
              feedback: true,
            },
          },
        },
        orderBy: featured
          ? { publishDate: "desc" }
          : { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.pythonTip.count({ where }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      success: true,
      tips,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: totalPages,
        hasNext,
        hasPrev,
      },
    });
  } catch (error) {
    console.error("Python tips fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tips" },
      { status: 500 }
    );
  }
}

// POST /api/python-tips - Create new tip (Admin only)
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
    const {
      title,
      content,
      codeExample,
      difficulty,
      categoryId,
      xpReward,
      tags,
      estimatedMinutes,
      publishDate,
      metaDescription,
      metaKeywords,
      slug,
    } = body;

    // Validate required fields
    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    let finalSlug = slug;
    if (!finalSlug) {
      finalSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      
      // Ensure unique slug
      const existingTip = await db.pythonTip.findUnique({
        where: { slug: finalSlug },
      });
      
      if (existingTip) {
        finalSlug = `${finalSlug}-${Date.now()}`;
      }
    }

    // Create tip
    const tip = await db.pythonTip.create({
      data: {
        title,
        content,
        codeExample,
        difficulty: difficulty || "beginner",
        categoryId,
        xpReward: xpReward || 10,
        tags,
        estimatedMinutes: estimatedMinutes || 2,
        publishDate: publishDate ? new Date(publishDate) : new Date(),
        metaDescription,
        metaKeywords,
        slug: finalSlug,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      tip,
      message: "Tip created successfully",
    });
  } catch (error) {
    console.error("Python tip creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create tip" },
      { status: 500 }
    );
  }
}