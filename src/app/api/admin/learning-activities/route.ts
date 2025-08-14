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

// GET - Learning activities listele
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const activityType = searchParams.get("activityType");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const difficulty = searchParams.get("difficulty");

    const where: any = {};
    if (activityType) where.activityType = activityType;
    if (category) where.category = category;
    if (difficulty) where.difficulty = parseInt(difficulty);

    // Add search functionality
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const activities = await prisma.learningActivity.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: {
          select: {
            attempts: true,
          },
        },
      },
    });

    const totalCount = await prisma.learningActivity.count({ where });

    // Parse JSON fields
    const formattedActivities = activities.map((activity) => {
      let tags = [];
      try {
        if (activity.tags) {
          // Eğer string ise JSON parse et, array ise olduğu gibi kullan
          tags =
            typeof activity.tags === "string"
              ? JSON.parse(activity.tags)
              : activity.tags;
        }
      } catch (error) {
        // JSON parse hatasında boş array kullan
        tags = [];
      }

      return {
        ...activity,
        content: JSON.parse(activity.content),
        settings: activity.settings ? JSON.parse(activity.settings) : null,
        tags: Array.isArray(tags) ? tags : [],
        attemptsCount: activity._count.attempts,
      };
    });

    return NextResponse.json({
      success: true,
      activities: formattedActivities,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Learning activities GET error:", error);
    return NextResponse.json(
      { error: "Learning activities getirilirken hata oluştu" },
      { status: 500 }
    );
  }
}

// POST - Yeni learning activity oluştur
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
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

    // Validation
    if (!title || !activityType || !content) {
      return NextResponse.json(
        { error: "Title, activityType ve content gerekli" },
        { status: 400 }
      );
    }

    const newActivity = await prisma.learningActivity.create({
      data: {
        title,
        description: description || "",
        activityType,
        category: category || "general",
        difficulty: difficulty || 1,
        diamondReward: diamondReward || 10,
        experienceReward: experienceReward || 25,
        content: JSON.stringify(content),
        settings: settings ? JSON.stringify(settings) : null,
        estimatedMinutes: estimatedMinutes || 5,
        tags: tags ? JSON.stringify(tags) : null,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Learning activity başarıyla oluşturuldu",
      activity: {
        ...newActivity,
        content: JSON.parse(newActivity.content),
        settings: newActivity.settings
          ? JSON.parse(newActivity.settings)
          : null,
        tags: newActivity.tags ? JSON.parse(newActivity.tags) : [],
      },
    });
  } catch (error) {
    console.error("Learning activity POST error:", error);
    return NextResponse.json(
      { error: "Learning activity oluşturulurken hata oluştu" },
      { status: 500 }
    );
  }
}
