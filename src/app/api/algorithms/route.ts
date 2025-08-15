import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

function parseJson<T>(val: unknown, fallback: T): T {
  try {
    if (!val) return fallback;
    if (typeof val === "string") return JSON.parse(val) as T;
    return val as T;
  } catch {
    return fallback;
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") || "algorithms";

    // Fetch "algorithm" lessons from LearningActivity
    const activities = await prisma.learningActivity.findMany({
      where: {
        activityType: "lesson",
        category,
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    // Map activity IDs
    const activityIds = activities.map((a) => a.id);

    // Fetch user attempts if authenticated
    let userProgress: Record<
      string,
      {
        isStarted: boolean;
        isCompleted: boolean;
        score: number | null;
        attempts: number;
        timeSpent: number;
        lastVisit: Date | null;
      }
    > = {};

    if (session?.user?.id && activityIds.length) {
      const attempts = await prisma.activityAttempt.findMany({
        where: {
          userId: session.user.id,
          activityId: { in: activityIds },
        },
      });

      userProgress = attempts.reduce(
        (acc, at) => {
          acc[at.activityId] = {
            isStarted: !!at.startedAt,
            isCompleted: !!at.completed,
            score: at.score ?? null,
            attempts: at.timeSpent && at.timeSpent > 0 ? 1 : 0, // no attempts field; derive a minimal value
            timeSpent: at.timeSpent || 0,
            lastVisit: at.completedAt || at.startedAt || null,
          };
          return acc;
        },
        {} as Record<string, any>
      );
    }

    // Calculate overall progress
    const totalChallenges = activities.length;
    const completedChallenges = Object.values(userProgress).filter(
      (p: any) => p?.isCompleted
    ).length;
    const progressPercentage =
      totalChallenges > 0
        ? Math.round((completedChallenges / totalChallenges) * 100)
        : 0;

    // Transform to expected frontend format
    const formattedChallenges = activities.map((activity) => {
      const progress = userProgress[activity.id];

      // tags are stored as JSON string
      const tags = parseJson<string[]>(activity.tags, []);
      const isVisualization = tags.includes("Algorithm Viz");
      const isMatching = tags.includes("Matching");

      // Optional legacy fields are in settings JSON
      const settings = parseJson<any>(activity.settings, null);
      const hasCodeExercise = !!settings?.hasCodeExercise;
      const learningObjectives = Array.isArray(settings?.learningObjectives)
        ? settings.learningObjectives
        : [];

      // Difficulty badge/color
      let difficultyBadge = "Beginner";
      let difficultyColor = "bg-green-500";
      if (activity.difficulty >= 4) {
        difficultyBadge = "Expert";
        difficultyColor = "bg-red-500";
      } else if (activity.difficulty >= 3) {
        difficultyBadge = "Advanced";
        difficultyColor = "bg-purple-500";
      } else if (activity.difficulty >= 2) {
        difficultyBadge = "Intermediate";
        difficultyColor = "bg-blue-500";
      }

      return {
        id: activity.id,
        title: activity.title,
        // slug lives in settings JSON if present; fall back to title slug
        slug:
          (typeof settings?.slug === "string" && settings.slug) ||
          activity.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim(),
        description: activity.description || "",
        type: isVisualization
          ? "Algorithm Viz"
          : isMatching
            ? "Matching"
            : "Challenge",
        difficulty: {
          level: activity.difficulty,
          badge: difficultyBadge,
          color: difficultyColor,
        },
        rewards: {
          diamonds: activity.diamondReward ?? 0,
          xp: activity.experienceReward ?? 0,
        },
        duration: `${activity.estimatedMinutes ?? 30}m`,
        estimatedMinutes: activity.estimatedMinutes ?? 30,
        tags,
        progress: progress
          ? {
              isStarted: progress.isStarted,
              isCompleted: progress.isCompleted,
              score: progress.score,
              attempts: progress.attempts,
              timeSpent: progress.timeSpent,
              lastVisit: progress.lastVisit,
            }
          : {
              isStarted: false,
              isCompleted: false,
              score: null,
              attempts: 0,
              timeSpent: 0,
              lastVisit: null,
            },
        isLocked: false,
        order: activity.sortOrder ?? 1,
        hasCodeExercise,
        learningObjectives,
        createdAt: activity.createdAt,
        updatedAt: activity.updatedAt,
      };
    });

    const responseData = {
      success: true,
      category: {
        name: "Algorithms",
        description: "Solve problems with efficient algorithms",
        icon: "🧮",
        color: "#8B5CF6",
        totalChallenges,
        completedChallenges,
        progressPercentage,
      },
      progress: {
        completed: `${completedChallenges}/${totalChallenges}`,
        percentage: progressPercentage,
      },
      challenges: formattedChallenges,
      meta: {
        total: totalChallenges,
        completed: completedChallenges,
        inProgress: Object.values(userProgress).filter(
          (p: any) => p?.isStarted && !p?.isCompleted
        ).length,
        notStarted: totalChallenges - Object.keys(userProgress).length,
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching algorithm challenges:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch challenges" },
      { status: 500 }
    );
  }
}

// Update user progress (mapped to ActivityAttempt)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { challengeId, action, data } = body as {
      challengeId: string;
      action: "start" | "complete" | "update_progress";
      data?: any;
    };

    if (!challengeId || !action) {
      return NextResponse.json(
        { success: false, error: "Challenge ID and action are required" },
        { status: 400 }
      );
    }

    // Verify activity exists
    const activity = await prisma.learningActivity.findUnique({
      where: { id: challengeId },
      select: {
        id: true,
        title: true,
        diamondReward: true,
        experienceReward: true,
        activityType: true,
      },
    });

    if (!activity || activity.activityType !== "lesson") {
      return NextResponse.json(
        { success: false, error: "Challenge not found" },
        { status: 404 }
      );
    }

    // Prepare update data for ActivityAttempt
    const updateData: any = {};

    switch (action) {
      case "start":
        updateData.startedAt = new Date();
        break;

      case "complete":
        updateData.completed = true;
        updateData.completedAt = new Date();
        if (typeof data?.score === "number") {
          updateData.score = data.score;
        }

        // Award rewards
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            currentDiamonds: { increment: activity.diamondReward ?? 0 },
            totalDiamonds: { increment: activity.diamondReward ?? 0 },
            experience: { increment: activity.experienceReward ?? 0 },
            codeArenasCompleted: { increment: 1 }, // legacy counter name retained
          },
        });
        break;

      case "update_progress":
        if (typeof data?.timeSpent === "number")
          updateData.timeSpent = data.timeSpent;
        if (typeof data?.score === "number") updateData.score = data.score;
        break;
    }

    const progress = await prisma.activityAttempt.upsert({
      where: {
        userId_activityId: {
          userId: session.user.id,
          activityId: challengeId,
        },
      },
      update: updateData,
      create: {
        userId: session.user.id,
        activityId: challengeId,
        ...updateData,
      },
    });

    return NextResponse.json({
      success: true,
      progress,
      rewards:
        action === "complete"
          ? {
              diamonds: activity.diamondReward ?? 0,
              xp: activity.experienceReward ?? 0,
            }
          : null,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
