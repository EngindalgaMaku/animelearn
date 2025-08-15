import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Re-implemented stats endpoint to use current Prisma schema:
 * - Lessons are stored as LearningActivity with activityType = "lesson"
 * - Progress/completions are stored as ActivityAttempt
 */
export async function GET(req: NextRequest) {
  try {
    // Core counts
    const [totalLessons, publishedLessons, draftLessons] = await Promise.all([
      prisma.learningActivity.count({
        where: { activityType: "lesson" },
      }),
      prisma.learningActivity.count({
        where: { activityType: "lesson", isActive: true },
      }),
      prisma.learningActivity.count({
        where: { activityType: "lesson", isActive: false },
      }),
    ]);

    // Distinct students who attempted any lesson
    const distinctStudents = await prisma.activityAttempt.findMany({
      where: { activity: { activityType: "lesson" } },
      distinct: ["userId"],
      select: { userId: true },
    });
    const totalStudents = distinctStudents.length;

    // Average score among completed attempts for lessons
    const avg = await prisma.activityAttempt.aggregate({
      _avg: { score: true },
      where: {
        completed: true,
        activity: { activityType: "lesson" },
      },
    });
    const averageCompletion = Math.round(avg._avg.score || 0);

    // Distribution by category
    const lessonsByCategory = await prisma.learningActivity.groupBy({
      by: ["category"],
      where: { activityType: "lesson" },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });
    const categoryCounts: Record<string, number> = {};
    for (const row of lessonsByCategory) {
      categoryCounts[row.category ?? "general"] = row._count.id;
    }

    // Distribution by difficulty (numeric)
    const lessonsByDifficulty = await prisma.learningActivity.groupBy({
      by: ["difficulty"],
      where: { activityType: "lesson" },
      _count: { id: true },
      orderBy: { difficulty: "asc" },
    });
    const difficultyDistribution: Record<number, number> = {};
    for (const row of lessonsByDifficulty) {
      difficultyDistribution[row.difficulty as number] = row._count.id;
    }

    // Response fields match what the AdminLessonsPage expects
    return NextResponse.json({
      totalCodeArenas: totalLessons,
      publishedCodeArenas: publishedLessons,
      draftCodeArenas: draftLessons,
      totalStudents,
      averageCompletion,
      categoryCounts,
      difficultyDistribution,
    });
  } catch (error) {
    console.error("Admin lessons stats API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
