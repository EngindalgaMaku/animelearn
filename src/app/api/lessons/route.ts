import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface AuthUser {
  userId: string;
  username: string;
}

// Token'dan kullanıcı bilgilerini çıkart
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

export async function GET(req: NextRequest) {
  try {
    const authUser = getUserFromToken(req);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const order = searchParams.get("order");
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {
      isPublished: true,
    };

    if (category && category !== "all") {
      where.category = category;
    }

    if (difficulty) {
      where.difficulty = parseInt(difficulty);
    }

    if (order) {
      where.order = parseInt(order);
    }

    // Get code arenas with user progress
    const codeArenas = await prisma.codeArena.findMany({
      where,
      include: {
        progress: {
          where: {
            userId: authUser.userId,
          },
          select: {
            id: true,
            isCompleted: true,
            score: true,
            timeSpent: true,
            completedAt: true,
          },
        },
        quizzes: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            diamondReward: true,
            experienceReward: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await prisma.codeArena.count({
      where,
    });

    // Transform code arenas data
    const transformedCodeArenas = codeArenas.map((codeArena) => {
      const progress = codeArena.progress[0];

      return {
        id: codeArena.id,
        title: codeArena.title,
        slug: codeArena.slug,
        description: codeArena.description,
        difficulty: codeArena.difficulty,
        duration: codeArena.duration,
        category: codeArena.category,
        diamondReward: codeArena.diamondReward,
        experienceReward: codeArena.experienceReward,
        order: codeArena.order,
        hasCodeExercise: codeArena.hasCodeExercise,
        isCompleted: progress?.isCompleted || false,
        progress: progress
          ? {
              isCompleted: progress.isCompleted,
              score: progress.score,
              timeSpent: progress.timeSpent,
              completedAt: progress.completedAt,
            }
          : null,
        quiz: codeArena.quizzes[0]
          ? {
              id: codeArena.quizzes[0].id,
              title: codeArena.quizzes[0].title,
              difficulty: codeArena.quizzes[0].difficulty,
              diamondReward: codeArena.quizzes[0].diamondReward,
              experienceReward: codeArena.quizzes[0].experienceReward,
            }
          : null,
      };
    });

    return NextResponse.json({
      codeArenas: transformedCodeArenas,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching code arenas:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
