import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface AuthUser {
  userId: string;
  username: string;
}

function getUserFromToken(request: NextRequest): AuthUser | null {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET - Tek learning activity getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = getUserFromToken(request);

    if (!authUser) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekli" },
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
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const activity = await prisma.learningActivity.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            attempts: true,
          },
        },
        attempts: {
          select: {
            id: true,
            score: true,
            completed: true,
            timeSpent: true,
            user: {
              select: {
                username: true,
              },
            },
          },
          orderBy: {
            completedAt: "desc",
          },
          take: 10,
        },
      },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Learning activity bulunamadı" },
        { status: 404 }
      );
    }

    const formattedActivity = {
      ...activity,
      content: JSON.parse(activity.content),
      settings: activity.settings ? JSON.parse(activity.settings) : null,
      tags: activity.tags ? JSON.parse(activity.tags) : [],
      attemptsCount: activity._count.attempts,
    };

    return NextResponse.json({
      success: true,
      activity: formattedActivity,
    });
  } catch (error) {
    console.error("Learning activity GET error:", error);
    return NextResponse.json(
      { error: "Learning activity getirilirken hata oluştu" },
      { status: 500 }
    );
  }
}

// PUT - Learning activity güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = getUserFromToken(request);

    if (!authUser) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekli" },
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
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      activityType,
      category,
      difficulty,
      diamondReward,
      experienceReward,
      content,
      settings,
      estimatedMinutes,
      tags,
      isActive,
      sortOrder,
    } = body;

    const { id } = await params;
    
    // Mevcut activity'yi kontrol et
    const existingActivity = await prisma.learningActivity.findUnique({
      where: { id },
    });

    if (!existingActivity) {
      return NextResponse.json(
        { error: "Learning activity bulunamadı" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (activityType !== undefined) updateData.activityType = activityType;
    if (category !== undefined) updateData.category = category;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (diamondReward !== undefined) updateData.diamondReward = diamondReward;
    if (experienceReward !== undefined) updateData.experienceReward = experienceReward;
    if (content !== undefined) updateData.content = JSON.stringify(content);
    if (settings !== undefined) updateData.settings = settings ? JSON.stringify(settings) : null;
    if (estimatedMinutes !== undefined) updateData.estimatedMinutes = estimatedMinutes;
    if (tags !== undefined) updateData.tags = tags ? JSON.stringify(tags) : null;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    const updatedActivity = await prisma.learningActivity.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Learning activity başarıyla güncellendi",
      activity: {
        ...updatedActivity,
        content: JSON.parse(updatedActivity.content),
        settings: updatedActivity.settings ? JSON.parse(updatedActivity.settings) : null,
        tags: updatedActivity.tags ? JSON.parse(updatedActivity.tags) : [],
      },
    });
  } catch (error) {
    console.error("Learning activity PUT error:", error);
    return NextResponse.json(
      { error: "Learning activity güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE - Learning activity sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = getUserFromToken(request);

    if (!authUser) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekli" },
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
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      );
    }

    const { id } = await params;
    
    // Activity'nin var olup olmadığını kontrol et
    const existingActivity = await prisma.learningActivity.findUnique({
      where: { id },
    });

    if (!existingActivity) {
      return NextResponse.json(
        { error: "Learning activity bulunamadı" },
        { status: 404 }
      );
    }

    await prisma.learningActivity.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Learning activity başarıyla silindi",
    });
  } catch (error) {
    console.error("Learning activity DELETE error:", error);
    return NextResponse.json(
      { error: "Learning activity silinirken hata oluştu" },
      { status: 500 }
    );
  }
}