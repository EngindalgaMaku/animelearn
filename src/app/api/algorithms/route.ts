import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") || "algorithms";

    // Get algorithm challenges from database
    const challenges = await prisma.codeArena.findMany({
      where: {
        category: category,
        isPublished: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    // Get user progress if authenticated
    let userProgress: any = {};
    if (session?.user?.id) {
      const progressRecords = await prisma.codeArenaProgress.findMany({
        where: {
          userId: session.user.id,
          codeArenaId: {
            in: challenges.map((c) => c.id),
          },
        },
      });

      userProgress = progressRecords.reduce((acc, record) => {
        acc[record.codeArenaId] = {
          isStarted: record.isStarted,
          isCompleted: record.isCompleted,
          score: record.score,
          attempts: record.attempts,
          lastVisit: record.lastVisit,
          timeSpent: record.timeSpent,
        };
        return acc;
      }, {} as any);
    }

    // Calculate overall progress
    const totalChallenges = challenges.length;
    const completedChallenges = Object.values(userProgress).filter(
      (p: any) => p?.isCompleted
    ).length;
    const progressPercentage =
      totalChallenges > 0
        ? Math.round((completedChallenges / totalChallenges) * 100)
        : 0;

    // Transform challenges to match frontend format
    const formattedChallenges = challenges.map((challenge) => {
      const progress = userProgress[challenge.id];

      // Parse tags and determine challenge type
      const tags = challenge.tags ? JSON.parse(challenge.tags) : [];
      const isVisualization = tags.includes("Algorithm Viz");
      const isMatching = tags.includes("Matching");

      // Determine difficulty badge
      let difficultyBadge = "Beginner";
      let difficultyColor = "bg-green-500";

      if (challenge.difficulty >= 4) {
        difficultyBadge = "Expert";
        difficultyColor = "bg-red-500";
      } else if (challenge.difficulty >= 3) {
        difficultyBadge = "Advanced";
        difficultyColor = "bg-purple-500";
      } else if (challenge.difficulty >= 2) {
        difficultyBadge = "Intermediate";
        difficultyColor = "bg-blue-500";
      }

      return {
        id: challenge.id,
        title: challenge.title,
        slug: challenge.slug,
        description: challenge.description,
        type: isVisualization
          ? "Algorithm Viz"
          : isMatching
            ? "Matching"
            : "Challenge",
        difficulty: {
          level: challenge.difficulty,
          badge: difficultyBadge,
          color: difficultyColor,
        },
        rewards: {
          diamonds: challenge.diamondReward,
          xp: challenge.experienceReward,
        },
        duration: `${challenge.duration}m`,
        estimatedMinutes: challenge.duration,
        tags: tags,
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
        isLocked: false, // For now, all challenges are unlocked
        order: challenge.order,
        hasCodeExercise: challenge.hasCodeExercise,
        learningObjectives: challenge.learningObjectives
          ? JSON.parse(challenge.learningObjectives)
          : [],
        createdAt: challenge.createdAt,
        updatedAt: challenge.updatedAt,
      };
    });

    // Prepare response data
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

// Update user progress
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
    const { challengeId, action, data } = body;

    if (!challengeId || !action) {
      return NextResponse.json(
        { success: false, error: "Challenge ID and action are required" },
        { status: 400 }
      );
    }

    // Verify challenge exists
    const challenge = await prisma.codeArena.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return NextResponse.json(
        { success: false, error: "Challenge not found" },
        { status: 404 }
      );
    }

    // Update or create progress record
    const updateData: any = {
      lastVisit: new Date(),
    };

    switch (action) {
      case "start":
        updateData.isStarted = true;
        updateData.startedAt = new Date();
        break;

      case "complete":
        updateData.isCompleted = true;
        updateData.completedAt = new Date();
        updateData.score = data?.score || 100;

        // Award rewards
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            currentDiamonds: { increment: challenge.diamondReward },
            totalDiamonds: { increment: challenge.diamondReward },
            experience: { increment: challenge.experienceReward },
            codeArenasCompleted: { increment: 1 },
          },
        });
        break;

      case "update_progress":
        if (data?.timeSpent) updateData.timeSpent = data.timeSpent;
        if (data?.attempts !== undefined) updateData.attempts = data.attempts;
        if (data?.lastCode) updateData.lastCode = data.lastCode;
        break;
    }

    const progress = await prisma.codeArenaProgress.upsert({
      where: {
        userId_codeArenaId: {
          userId: session.user.id,
          codeArenaId: challengeId,
        },
      },
      update: updateData,
      create: {
        userId: session.user.id,
        codeArenaId: challengeId,
        ...updateData,
      },
    });

    return NextResponse.json({
      success: true,
      progress,
      rewards:
        action === "complete"
          ? {
              diamonds: challenge.diamondReward,
              xp: challenge.experienceReward,
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
