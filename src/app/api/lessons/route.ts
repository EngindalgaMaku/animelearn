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
  } catch {
    return null;
  }
}

function parseJSON<T>(val: string | null | undefined, fallback: T): T {
  try {
    if (!val) return fallback;
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

function slugify(title: string): string {
  return (title || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Seed a minimal set of "lesson" activities if DB is empty.
 * Returns number of records created.
 */
async function seedDefaultLessons() {
  const now = new Date();
  const samples = [
    {
      title: "Python Basics & Your First Program",
      description:
        "Start your Python journey with hello world and fundamentals",
      category: "Python Fundamentals",
      activityType: "lesson" as const,
      isActive: true,
      difficulty: 1,
      diamondReward: 25,
      experienceReward: 50,
      estimatedMinutes: 12,
      sortOrder: 1,
      settings: JSON.stringify({
        slug: "python-basics-first-program",
        hasCodeExercise: true,
      }),
      content: JSON.stringify({
        introduction: "Welcome to Python programming!",
        syntax: "",
        examples: "",
      }),
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "Variables & Data Types",
      description: "Store and work with different kinds of data in Python",
      category: "Python Fundamentals",
      activityType: "lesson" as const,
      isActive: true,
      difficulty: 1,
      diamondReward: 25,
      experienceReward: 50,
      estimatedMinutes: 15,
      sortOrder: 2,
      settings: JSON.stringify({
        slug: "variables-data-types",
        hasCodeExercise: true,
      }),
      content: JSON.stringify({
        introduction: "Understanding variables and core data types.",
        syntax: "",
        examples: "",
      }),
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "If Statements & Decisions",
      description: "Make your code react to conditions",
      category: "Python Fundamentals",
      activityType: "lesson" as const,
      isActive: true,
      difficulty: 1,
      diamondReward: 25,
      experienceReward: 50,
      estimatedMinutes: 15,
      sortOrder: 3,
      settings: JSON.stringify({
        slug: "if-statements-decisions",
        hasCodeExercise: true,
      }),
      content: JSON.stringify({
        introduction: "Conditional logic with if/elif/else.",
        syntax: "",
        examples: "",
      }),
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "Loops: Repeating Actions",
      description: "Automate repetition with for/while loops",
      category: "Python Fundamentals",
      activityType: "lesson" as const,
      isActive: true,
      difficulty: 1,
      diamondReward: 25,
      experienceReward: 50,
      estimatedMinutes: 15,
      sortOrder: 4,
      settings: JSON.stringify({
        slug: "loops-repetition",
        hasCodeExercise: true,
      }),
      content: JSON.stringify({
        introduction: "Use loops to iterate efficiently.",
        syntax: "",
        examples: "",
      }),
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "Functions: Reusable Code",
      description: "Write functions to organize your logic",
      category: "Python Fundamentals",
      activityType: "lesson" as const,
      isActive: true,
      difficulty: 2,
      diamondReward: 30,
      experienceReward: 60,
      estimatedMinutes: 18,
      sortOrder: 5,
      settings: JSON.stringify({
        slug: "functions-basics",
        hasCodeExercise: true,
      }),
      content: JSON.stringify({
        introduction: "Build reusable blocks of code.",
        syntax: "",
        examples: "",
      }),
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "Lists & Collections",
      description: "Manage multiple values with lists",
      category: "Data Structures",
      activityType: "lesson" as const,
      isActive: true,
      difficulty: 2,
      diamondReward: 30,
      experienceReward: 60,
      estimatedMinutes: 18,
      sortOrder: 6,
      settings: JSON.stringify({
        slug: "lists-collections",
        hasCodeExercise: true,
      }),
      content: JSON.stringify({
        introduction: "Lists are versatile containers.",
        syntax: "",
        examples: "",
      }),
      createdAt: now,
      updatedAt: now,
    },
  ];

  await prisma.learningActivity.createMany({
    data: samples,
    skipDuplicates: true,
  });

  return samples.length;
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
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Ensure minimal "learn" lessons exist in DB
    const existingLessonCount = await prisma.learningActivity.count({
      where: { activityType: "lesson" },
    });
    if (existingLessonCount === 0) {
      await seedDefaultLessons();
    }

    // Build filter conditions for LearningActivity "lesson"
    const where: any = {
      activityType: "lesson",
      isActive: true,
    };

    if (category && category !== "all") {
      where.category = category;
    }

    if (difficulty) {
      where.difficulty = parseInt(difficulty, 10);
    }

    // Fetch lessons
    const activities = await prisma.learningActivity.findMany({
      where,
      orderBy: {
        sortOrder: "asc",
      },
      skip,
      take: limit,
    });

    // Total count for pagination
    const totalCount = await prisma.learningActivity.count({
      where,
    });

    // Fetch user attempts for these activities
    const activityIds = activities.map((a) => a.id);
    const attempts =
      activityIds.length > 0
        ? await prisma.activityAttempt.findMany({
            where: {
              userId: authUser.userId,
              activityId: { in: activityIds },
            },
          })
        : [];

    const attemptMap = attempts.reduce<
      Record<string, (typeof attempts)[number]>
    >((acc, at) => {
      acc[at.activityId] = at;
      return acc;
    }, {});

    // Transform to legacy "codeArena" list shape used by frontend
    const transformedCodeArenas = activities.map((a) => {
      const settings = parseJSON<any>(a.settings, null);
      const userAttempt = attemptMap[a.id] || null;
      const tags = parseJSON<string[]>(a.tags, []);
      return {
        id: a.id,
        title: a.title,
        slug:
          (settings?.slug &&
            typeof settings.slug === "string" &&
            settings.slug) ||
          slugify(a.title),
        description: a.description || "",
        difficulty: a.difficulty,
        duration: a.estimatedMinutes ?? 30,
        category: a.category,
        diamondReward: a.diamondReward ?? 0,
        experienceReward: a.experienceReward ?? 0,
        order: a.sortOrder ?? 1,
        hasCodeExercise: !!settings?.hasCodeExercise,
        isCompleted: !!userAttempt?.completed,
        progress: userAttempt
          ? {
              isCompleted: !!userAttempt.completed,
              score: userAttempt.score ?? null,
              timeSpent: userAttempt.timeSpent ?? 0,
              completedAt: userAttempt.completedAt ?? null,
            }
          : null,
        // No direct quiz relation in current schema; keep null or infer from content elsewhere
        quiz: null as any,
        // Additional fields occasionally referenced by UI
        tags,
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
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
