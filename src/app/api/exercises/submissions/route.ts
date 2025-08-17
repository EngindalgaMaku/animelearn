import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface AuthUser {
  userId: string;
  username: string;
}

// GET - Retrieve submission history for a specific exercise
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const authUser: AuthUser = {
      userId: session.user.id,
      username:
        (session.user as any).username || session.user.email || "Unknown",
    };

    const searchParams = req.nextUrl.searchParams;
    const codeArenaId = searchParams.get("codeArenaId");
    const exerciseId = searchParams.get("exerciseId");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!codeArenaId) {
      return NextResponse.json(
        { error: "Code Arena ID is required" },
        { status: 400 }
      );
    }

    // Build where clause
    const whereClause: any = {
      userId: authUser.userId,
      codeArenaId: codeArenaId,
    };

    // If exerciseId is provided, filter by it (for future exercise-specific filtering)
    if (exerciseId) {
      // For now, we'll use a simple approach since exerciseId isn't in the schema
      // In a more complex system, you'd have an exerciseId field
    }

    const submissions = await prisma.codeSubmission.findMany({
      where: whereClause,
      orderBy: {
        submittedAt: "desc",
      },
      take: limit,
    });

    // Calculate statistics
    const stats = {
      totalSubmissions: submissions.length,
      successfulSubmissions: submissions.filter((s) => s.isCorrect).length,
      averageScore:
        submissions.length > 0
          ? Math.round(
              submissions.reduce((sum, s) => sum + (s.score || 0), 0) /
                submissions.length
            )
          : 0,
      bestScore:
        submissions.length > 0
          ? Math.max(...submissions.map((s) => s.score || 0))
          : 0,
      latestSubmission:
        submissions.length > 0 ? submissions[0].submittedAt : null,
      improvementTrend: calculateImprovementTrend(submissions),
    };

    return NextResponse.json({
      success: true,
      submissions: submissions.map((submission) => ({
        id: submission.id,
        code: submission.code,
        score: submission.score,
        isCorrect: submission.isCorrect,
        testResults: submission.testResults,
        errorMessage: submission.errorMessage,
        feedback: submission.feedback,
        submittedAt: submission.submittedAt,
        executionTime: submission.executionTime,
        codeArenaId: submission.codeArenaId,
      })),
      stats,
    });
  } catch (error) {
    console.error("Error fetching exercise submissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to calculate improvement trend
function calculateImprovementTrend(submissions: any[]): string {
  if (submissions.length < 2) return "insufficient_data";

  // Get the most recent 5 submissions for trend analysis
  const recentSubmissions = submissions.slice(
    0,
    Math.min(5, submissions.length)
  );
  const scores = recentSubmissions.map((s) => s.score || 0).reverse(); // Reverse to get chronological order

  if (scores.length < 2) return "insufficient_data";

  // Calculate trend using simple linear regression slope
  const n = scores.length;
  const sumX = (n * (n + 1)) / 2; // Sum of 1, 2, 3, ... n
  const sumY = scores.reduce((sum, score) => sum + score, 0);
  const sumXY = scores.reduce(
    (sum, score, index) => sum + score * (index + 1),
    0
  );
  const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6; // Sum of 1², 2², 3², ... n²

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  if (slope > 5) return "improving";
  if (slope < -5) return "declining";
  return "stable";
}

// POST - Create a new submission (this would typically be called from the validation endpoint)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const authUser: AuthUser = {
      userId: session.user.id,
      username:
        (session.user as any).username || session.user.email || "Unknown",
    };

    const body = await req.json();
    const {
      code,
      codeArenaId,
      score,
      isCorrect,
      testResults,
      errorMessage,
      feedback,
      executionTime,
    } = body;

    if (!code || !codeArenaId) {
      return NextResponse.json(
        { error: "Code and code arena ID are required" },
        { status: 400 }
      );
    }

    // Verify learning activity (lesson) exists
    const activity = await prisma.learningActivity.findFirst({
      where: { id: codeArenaId, activityType: "lesson" },
    });

    if (!activity) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Create submission
    const submission = await prisma.codeSubmission.create({
      data: {
        userId: authUser.userId,
        codeArenaId: codeArenaId,
        code: code,
        language: "python", // Default to Python for now
        score: score,
        isCorrect: isCorrect || false,
        testResults: testResults ? JSON.stringify(testResults) : null,
        errorMessage: errorMessage,
        feedback: feedback,
        executionTime: executionTime,
      },
    });

    // Update user's code submission count
    await prisma.user.update({
      where: { id: authUser.userId },
      data: {
        codeSubmissionCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        code: submission.code,
        score: submission.score,
        isCorrect: submission.isCorrect,
        submittedAt: submission.submittedAt,
      },
    });
  } catch (error) {
    console.error("Error creating exercise submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
