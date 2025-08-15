import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helpers
type JsonSettings = {
  slug?: string;
  hasCodeExercise?: boolean;
  starterCode?: string | null;
  solutionCode?: string | null;
  testCases?: string | null;
  hints?: string | null;
  prerequisites?: string | null;
  examples?: any[];
  sections?: any[];
  learningObjectives?: string[];
  resources?: string[];
};

function safeParse<T>(val: string | null | undefined, fallback: T): T {
  try {
    if (!val) return fallback;
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

function parseSettings(settings: string | null | undefined): JsonSettings {
  return safeParse<JsonSettings>(settings, {});
}

function generateSlugFromTitle(title: string): string {
  return (title || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function toJSONString(val: unknown): string {
  try {
    return JSON.stringify(val ?? []);
  } catch {
    return "[]";
  }
}

function mapActivityToAdminLesson(activity: any) {
  const settings = parseSettings(activity.settings);

  // tags are stored as JSON string in LearningActivity.tags
  const tags = safeParse<string[]>(activity.tags, []);

  const slug = settings.slug || generateSlugFromTitle(activity.title);

  return {
    id: activity.id,
    title: activity.title,
    slug,
    description: activity.description || "",
    content: activity.content || "",
    difficulty: activity.difficulty,
    order: activity.sortOrder ?? 1,
    duration: activity.estimatedMinutes ?? 30,
    category: activity.category || "python-basics",
    hasCodeExercise: settings.hasCodeExercise ?? false,
    starterCode: settings.starterCode ?? "",
    solutionCode: settings.solutionCode ?? "",
    testCases: settings.testCases ?? "",
    hints: settings.hints ?? "",
    prerequisites: settings.prerequisites ?? "",
    diamondReward: activity.diamondReward ?? 10,
    experienceReward: activity.experienceReward ?? 50,
    isPublished: activity.isActive ?? false,
    examples: settings.examples ?? [],
    sections: settings.sections ?? [],
    tags,
    learningObjectives: settings.learningObjectives ?? [],
    resources: settings.resources ?? [],
    createdAt: activity.createdAt,
    updatedAt: activity.updatedAt,
    _count: {
      // UI expects progress; map attempts -> progress
      progress: activity._count?.attempts ?? 0,
    },
  };
}

// GET - list lessons with filters/sort
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const difficulty = searchParams.get("difficulty") || "";
    const status = searchParams.get("status") || "";
    const sortBy = searchParams.get("sortBy") || "order";

    // Build where clause for LearningActivity that represent "lessons"
    const where: any = {
      activityType: "lesson",
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (difficulty) {
      where.difficulty = parseInt(difficulty, 10);
    }

    if (status === "published") {
      where.isActive = true;
    } else if (status === "draft") {
      where.isActive = false;
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
      case "title":
        orderBy = { title: "asc" };
        break;
      case "difficulty":
        orderBy = { difficulty: "asc" };
        break;
      case "category":
        orderBy = { category: "asc" };
        break;
      case "date":
        orderBy = { createdAt: "desc" };
        break;
      case "order":
      default:
        orderBy = { sortOrder: "asc" };
        break;
    }

    const activities = await prisma.learningActivity.findMany({
      where,
      include: {
        _count: {
          select: {
            attempts: true,
          },
        },
      },
      orderBy,
    });

    const lessons = activities.map(mapActivityToAdminLesson);

    return NextResponse.json({ lessons });
  } catch (error) {
    console.error("Admin lessons GET API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - create a lesson (stored in LearningActivity with activityType="lesson")
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      description,
      content,
      difficulty = 1,
      order = 1,
      duration = 30,
      category = "python-basics",
      hasCodeExercise = false,
      starterCode,
      solutionCode,
      testCases,
      hints,
      prerequisites,
      diamondReward = 10,
      experienceReward = 50,
      isPublished = false,
      examples = [],
      sections = [],
      tags = [],
      learningObjectives = [],
      resources = [],
    } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Generate or normalize slug
    const finalSlug = (slug || generateSlugFromTitle(title)).trim();

    // Basic (best-effort) uniqueness check for slug across "lesson" activities:
    // Search in settings string where we store slug as JSON, or match title slug
    const existingWithSlug = await prisma.learningActivity.findFirst({
      where: {
        activityType: "lesson",
        OR: [
          { title: finalSlug },
          { settings: { contains: `"slug":"${finalSlug}"` } },
        ],
      },
      select: { id: true },
    });

    if (existingWithSlug) {
      return NextResponse.json(
        { error: "A lesson with this slug already exists" },
        { status: 409 }
      );
    }

    // Persist additional fields into settings JSON
    const settings: JsonSettings = {
      slug: finalSlug,
      hasCodeExercise,
      starterCode: hasCodeExercise ? (starterCode ?? "") : "",
      solutionCode: hasCodeExercise ? (solutionCode ?? "") : "",
      testCases: hasCodeExercise ? (testCases ?? "") : "",
      hints: hints ?? "",
      prerequisites: prerequisites ?? "",
      examples: Array.isArray(examples) ? examples : [],
      sections: Array.isArray(sections) ? sections : [],
      learningObjectives: Array.isArray(learningObjectives)
        ? learningObjectives
        : [],
      resources: Array.isArray(resources) ? resources : [],
    };

    const created = await prisma.learningActivity.create({
      data: {
        title,
        description,
        activityType: "lesson",
        category,
        difficulty,
        diamondReward,
        experienceReward,
        content: content || "",
        settings: JSON.stringify(settings),
        isActive: !!isPublished,
        estimatedMinutes: duration,
        tags: toJSONString(tags),
        sortOrder: order,
        // Keep other defaults as-is
      },
      include: {
        _count: { select: { attempts: true } },
      },
    });

    return NextResponse.json(mapActivityToAdminLesson(created), {
      status: 201,
    });
  } catch (error) {
    console.error("Admin lessons POST API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PATCH - update a lesson (by id)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { lessonId, ...updates } = body;

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    // Load existing "lesson" activity
    const existing = await prisma.learningActivity.findUnique({
      where: { id: lessonId },
    });

    if (!existing || existing.activityType !== "lesson") {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Prepare update data
    const allowedUpdates = [
      "title",
      "slug",
      "description",
      "content",
      "difficulty",
      "order",
      "duration",
      "category",
      "hasCodeExercise",
      "starterCode",
      "solutionCode",
      "testCases",
      "hints",
      "prerequisites",
      "diamondReward",
      "experienceReward",
      "isPublished",
      "examples",
      "sections",
      "tags",
      "learningObjectives",
      "resources",
    ];

    const updateData: any = {};
    const currentSettings = parseSettings(existing.settings);

    // Handle slug uniqueness if changed
    if (
      typeof updates.slug === "string" &&
      updates.slug.trim() &&
      updates.slug.trim() !== (currentSettings.slug || "")
    ) {
      const newSlug = updates.slug.trim();
      const slugExists = await prisma.learningActivity.findFirst({
        where: {
          id: { not: lessonId },
          activityType: "lesson",
          OR: [
            { title: newSlug },
            { settings: { contains: `"slug":"${newSlug}"` } },
          ],
        },
        select: { id: true },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: "A lesson with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // Map scalar fields from UI to LearningActivity fields
    for (const [key, value] of Object.entries(updates)) {
      if (!allowedUpdates.includes(key)) continue;

      switch (key) {
        case "title":
          updateData.title = value;
          break;
        case "description":
          updateData.description = value ?? "";
          break;
        case "content":
          updateData.content = value ?? "";
          break;
        case "difficulty":
          updateData.difficulty = Number(value) || 1;
          break;
        case "order":
          updateData.sortOrder = Number(value) || 1;
          break;
        case "duration":
          updateData.estimatedMinutes = Number(value) || 30;
          break;
        case "category":
          updateData.category = value ?? "python-basics";
          break;
        case "diamondReward":
          updateData.diamondReward = Number(value) || 10;
          break;
        case "experienceReward":
          updateData.experienceReward = Number(value) || 50;
          break;
        case "isPublished":
          updateData.isActive = !!value;
          break;
        case "tags":
          updateData.tags = toJSONString(value);
          break;
        // Settings-backed fields are handled below
        default:
          break;
      }
    }

    // Merge settings-backed fields
    const mergedSettings: JsonSettings = {
      ...currentSettings,
    };

    if (typeof updates.slug === "string") {
      mergedSettings.slug = updates.slug.trim();
    }
    if ("hasCodeExercise" in updates) {
      mergedSettings.hasCodeExercise = !!updates.hasCodeExercise;
    }
    if ("starterCode" in updates) {
      mergedSettings.starterCode = updates.starterCode ?? "";
    }
    if ("solutionCode" in updates) {
      mergedSettings.solutionCode = updates.solutionCode ?? "";
    }
    if ("testCases" in updates) {
      mergedSettings.testCases = updates.testCases ?? "";
    }
    if ("hints" in updates) {
      mergedSettings.hints = updates.hints ?? "";
    }
    if ("prerequisites" in updates) {
      mergedSettings.prerequisites = updates.prerequisites ?? "";
    }
    if ("examples" in updates) {
      mergedSettings.examples = Array.isArray(updates.examples)
        ? updates.examples
        : [];
    }
    if ("sections" in updates) {
      mergedSettings.sections = Array.isArray(updates.sections)
        ? updates.sections
        : [];
    }
    if ("learningObjectives" in updates) {
      mergedSettings.learningObjectives = Array.isArray(
        updates.learningObjectives
      )
        ? updates.learningObjectives
        : [];
    }
    if ("resources" in updates) {
      mergedSettings.resources = Array.isArray(updates.resources)
        ? updates.resources
        : [];
    }

    updateData.settings = JSON.stringify(mergedSettings);

    const updated = await prisma.learningActivity.update({
      where: { id: lessonId },
      data: updateData,
      include: {
        _count: {
          select: { attempts: true },
        },
      },
    });

    return NextResponse.json(mapActivityToAdminLesson(updated));
  } catch (error) {
    console.error("Admin lessons PATCH API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - delete lesson if no attempts
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get("lessonId");

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.learningActivity.findUnique({
      where: { id: lessonId },
      include: {
        _count: {
          select: { attempts: true },
        },
      },
    });

    if (!existing || existing.activityType !== "lesson") {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    if (existing._count.attempts > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete lesson with student progress. Unpublish it instead.",
        },
        { status: 400 }
      );
    }

    await prisma.learningActivity.delete({
      where: { id: lessonId },
    });

    return NextResponse.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Admin lessons DELETE API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
