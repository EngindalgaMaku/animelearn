import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Legacy alias for lessons listing
 * Maps to LearningActivity (Code Arena) and returns a lessons[] array.
 * Supports:
 * - ?order=number to fetch lesson by sort order (used for next/prev nav)
 * - category, difficulty, search passthroughs for convenience
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id ?? null;
    const { searchParams } = new URL(request.url);
    const orderParam = searchParams.get("order");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const category = searchParams.get("category") || undefined;
    const difficulty = searchParams.get("difficulty");
    const search = searchParams.get("search") || undefined;

    const baseWhere: any = {
      isActive: true,
      activityType: "lesson",
    };
    if (category) baseWhere.category = category;
    if (difficulty) baseWhere.difficulty = parseInt(difficulty, 10);
    if (search) {
      baseWhere.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // If order is provided, fetch the specific next/prev item by sortOrder
    if (orderParam) {
      const order = parseInt(orderParam, 10);
      const single = await prisma.learningActivity.findFirst({
        where: { ...baseWhere, sortOrder: order },
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      });

      const normalize = (a: any | null) =>
        !a
          ? null
          : {
              id: a.id,
              title: a.title,
              slug:
                (a.slug as string | null) ||
                (() =>
                  (a.title || "")
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/-+/g, "-")
                    .trim())(),
              description: a.description || "",
              category: a.category || "general",
              difficulty:
                a.difficulty === 1
                  ? "beginner"
                  : a.difficulty === 2
                    ? "intermediate"
                    : "advanced",
              order: a.sortOrder ?? 1,
              estimatedTime: a.estimatedMinutes ?? 30,
              diamondReward: a.diamondReward ?? 0,
              experienceReward: a.experienceReward ?? 0,
            };

      // Compute isCompleted for the logged-in user (if any)
      let isCompleted = false;
      if (userId && single) {
        const attempt = await prisma.activityAttempt.findUnique({
          where: {
            userId_activityId: { userId, activityId: single.id },
          },
          select: { completed: true },
        });
        isCompleted = !!attempt?.completed;
      }

      const normalized = single ? normalize(single) : null;
      return NextResponse.json({
        lessons: normalized ? [{ ...normalized, isCompleted }] : [],
      });
    }

    // Paginated listing
    const [items, total] = await Promise.all([
      prisma.learningActivity.findMany({
        where: baseWhere,
        orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { title: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.learningActivity.count({ where: baseWhere }),
    ]);

    // Build completion map for logged-in user
    let completedSet = new Set<string>();
    if (userId && items.length > 0) {
      const attempts = await prisma.activityAttempt.findMany({
        where: {
          userId,
          activityId: { in: items.map((i) => i.id) },
          completed: true,
        },
        select: { activityId: true },
      });
      completedSet = new Set(attempts.map((a) => a.activityId));
    }

    const lessons = items.map((a) => ({
      id: a.id,
      title: a.title,
      slug:
        (a.slug as string | null) ||
        (() =>
          (a.title || "")
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim())(),
      description: a.description || "",
      category: a.category || "general",
      difficulty:
        a.difficulty === 1
          ? "beginner"
          : a.difficulty === 2
            ? "intermediate"
            : "advanced",
      order: a.sortOrder ?? 1,
      estimatedTime: a.estimatedMinutes ?? 30,
      diamondReward: a.diamondReward ?? 0,
      experienceReward: a.experienceReward ?? 0,
      isCompleted: completedSet.has(a.id),
    }));

    return NextResponse.json({
      lessons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Lessons alias GET error:", error);
    return NextResponse.json(
      { error: "Lessons could not be fetched" },
      { status: 500 }
    );
  }
}
