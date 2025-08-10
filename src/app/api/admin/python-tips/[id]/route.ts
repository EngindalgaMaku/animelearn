import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface AdminPythonTipPageProps {
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

// GET - Belirli bir Python tip'ini getir (Admin only)
export async function GET(
  request: NextRequest,
  context: AdminPythonTipPageProps
) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const tip = await prisma.pythonTip.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            color: true,
            icon: true,
          },
        },
        interactions: {
          select: {
            hasViewed: true,
            hasLiked: true,
            hasCompleted: true,
            xpEarned: true,
            timeSpent: true,
          },
        },
        feedback: {
          select: {
            rating: true,
            difficulty: true,
            helpfulness: true,
            comment: true,
            createdAt: true,
          },
        },
        dailyTips: {
          select: {
            date: true,
            isActive: true,
            viewCount: true,
            likeCount: true,
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

    if (!tip) {
      return NextResponse.json(
        { error: "Python tip not found" },
        { status: 404 }
      );
    }

    // Transform JSON fields
    const transformedTip = {
      ...tip,
      tags: tip.tags ? JSON.parse(tip.tags) : [],
      prerequisites: tip.prerequisites ? JSON.parse(tip.prerequisites) : [],
      relatedTips: tip.relatedTips ? JSON.parse(tip.relatedTips) : [],
    };

    return NextResponse.json(transformedTip);
  } catch (error) {
    console.error("Error fetching admin Python tip:", error);
    return NextResponse.json(
      { error: "Failed to fetch Python tip" },
      { status: 500 }
    );
  }
}

// PUT - Python tip'ini güncelle (Admin only)
export async function PUT(
  request: NextRequest,
  context: AdminPythonTipPageProps
) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
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

    // Check if tip exists
    const existingTip = await prisma.pythonTip.findUnique({
      where: { id },
    });

    if (!existingTip) {
      return NextResponse.json(
        { error: "Python tip not found" },
        { status: 404 }
      );
    }

    // Check if new slug already exists (if slug is being changed)
    if (slug && slug !== existingTip.slug) {
      const slugExists = await prisma.pythonTip.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A tip with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Verify category exists if being changed
    if (categoryId && categoryId !== existingTip.categoryId) {
      const category = await prisma.pythonTipCategory.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 400 }
        );
      }
    }

    const updatedTip = await prisma.pythonTip.update({
      where: { id },
      data: {
        title: title || existingTip.title,
        content: content || existingTip.content,
        codeExample:
          codeExample !== undefined ? codeExample : existingTip.codeExample,
        difficulty: difficulty || existingTip.difficulty,
        categoryId: categoryId || existingTip.categoryId,
        xpReward: xpReward !== undefined ? xpReward : existingTip.xpReward,
        tags: tags ? JSON.stringify(tags) : existingTip.tags,
        estimatedMinutes:
          estimatedMinutes !== undefined
            ? estimatedMinutes
            : existingTip.estimatedMinutes,
        prerequisites: prerequisites
          ? JSON.stringify(prerequisites)
          : existingTip.prerequisites,
        relatedTips: relatedTips
          ? JSON.stringify(relatedTips)
          : existingTip.relatedTips,
        slug: slug || existingTip.slug,
        metaDescription:
          metaDescription !== undefined
            ? metaDescription
            : existingTip.metaDescription,
        metaKeywords:
          metaKeywords !== undefined ? metaKeywords : existingTip.metaKeywords,
        socialImageUrl:
          socialImageUrl !== undefined
            ? socialImageUrl
            : existingTip.socialImageUrl,
        isActive: isActive !== undefined ? isActive : existingTip.isActive,
        publishDate: publishDate
          ? new Date(publishDate)
          : existingTip.publishDate,
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
      ...updatedTip,
      tags: JSON.parse(updatedTip.tags || "[]"),
      prerequisites: JSON.parse(updatedTip.prerequisites || "[]"),
      relatedTips: JSON.parse(updatedTip.relatedTips || "[]"),
    };

    return NextResponse.json(transformedTip);
  } catch (error) {
    console.error("Error updating admin Python tip:", error);
    return NextResponse.json(
      { error: "Failed to update Python tip" },
      { status: 500 }
    );
  }
}

// DELETE - Python tip'ini sil (Admin only)
export async function DELETE(
  request: NextRequest,
  context: AdminPythonTipPageProps
) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    // Check if tip exists
    const existingTip = await prisma.pythonTip.findUnique({
      where: { id },
    });

    if (!existingTip) {
      return NextResponse.json(
        { error: "Python tip not found" },
        { status: 404 }
      );
    }

    // Delete all related records first
    await prisma.userPythonTipInteraction.deleteMany({
      where: { tipId: id },
    });

    await prisma.pythonTipFeedback.deleteMany({
      where: { tipId: id },
    });

    await prisma.dailyPythonTip.deleteMany({
      where: { tipId: id },
    });

    // Delete the Python tip
    await prisma.pythonTip.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Python tip deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting admin Python tip:", error);
    return NextResponse.json(
      { error: "Failed to delete Python tip" },
      { status: 500 }
    );
  }
}
