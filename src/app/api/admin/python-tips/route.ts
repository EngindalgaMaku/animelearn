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

// GET - Tüm Python tiplerini getir (Admin only)
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const difficulty = searchParams.get("difficulty");
    const isActive = searchParams.get("isActive");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const search = searchParams.get("search");

    const where: any = {};

    if (categoryId && categoryId !== "all") {
      where.categoryId = categoryId;
    }

    if (difficulty && difficulty !== "all") {
      where.difficulty = difficulty;
    }

    if (isActive === "true") {
      where.isActive = true;
    } else if (isActive === "false") {
      where.isActive = false;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const tips = await prisma.pythonTip.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      take: limit ? parseInt(limit) : undefined,
      skip: offset ? parseInt(offset) : undefined,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          },
        },
        _count: {
          select: {
            interactions: true,
            feedback: true,
            dailyTips: true,
          },
        },
      },
    });

    // Transform tags and other JSON fields
    const transformedTips = tips.map((tip) => ({
      ...tip,
      tags: tip.tags ? JSON.parse(tip.tags) : [],
      prerequisites: tip.prerequisites ? JSON.parse(tip.prerequisites) : [],
      relatedTips: tip.relatedTips ? JSON.parse(tip.relatedTips) : [],
    }));

    // Get total count for pagination
    const totalCount = await prisma.pythonTip.count({ where });

    return NextResponse.json({
      tips: transformedTips,
      totalCount,
      pagination: {
        limit: limit ? parseInt(limit) : tips.length,
        offset: offset ? parseInt(offset) : 0,
        hasMore: totalCount > (offset ? parseInt(offset) : 0) + tips.length,
      },
    });
  } catch (error) {
    console.error("Error fetching admin Python tips:", error);
    return NextResponse.json(
      { error: "Failed to fetch Python tips" },
      { status: 500 }
    );
  }
}

// POST - Yeni Python tip oluştur (Admin only)
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      prerequisites,
      relatedTips,
      slug,
      metaDescription,
      metaKeywords,
      socialImageUrl,
      isActive,
      publishDate,
    } = body;

    // Validate required fields
    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    let finalSlug = slug;
    if (!finalSlug) {
      finalSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    }

    // Check if slug already exists
    if (finalSlug) {
      const existingTip = await prisma.pythonTip.findUnique({
        where: { slug: finalSlug },
      });

      if (existingTip) {
        return NextResponse.json(
          { error: "A tip with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Verify category exists
    const category = await prisma.pythonTipCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 400 }
      );
    }

    const newTip = await prisma.pythonTip.create({
      data: {
        title,
        content,
        codeExample,
        difficulty: difficulty || "beginner",
        categoryId,
        xpReward: xpReward || 10,
        tags: JSON.stringify(tags || []),
        estimatedMinutes: estimatedMinutes || 2,
        prerequisites: JSON.stringify(prerequisites || []),
        relatedTips: JSON.stringify(relatedTips || []),
        slug: finalSlug,
        metaDescription,
        metaKeywords,
        socialImageUrl,
        isActive: isActive !== undefined ? isActive : true,
        publishDate: publishDate ? new Date(publishDate) : new Date(),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    // Transform JSON fields for response
    const transformedTip = {
      ...newTip,
      tags: JSON.parse(newTip.tags || "[]"),
      prerequisites: JSON.parse(newTip.prerequisites || "[]"),
      relatedTips: JSON.parse(newTip.relatedTips || "[]"),
    };

    return NextResponse.json(transformedTip, { status: 201 });
  } catch (error) {
    console.error("Error creating Python tip:", error);
    return NextResponse.json(
      { error: "Failed to create Python tip" },
      { status: 500 }
    );
  }
}
