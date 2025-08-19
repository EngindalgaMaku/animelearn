import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface AuthUser {
  userId: string;
  username: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: quizId } = await params;
    const body = await req.json();
    const {
      codeArenaId,
      answers,
      timeSpent,
      score,
      correctAnswers,
      totalQuestions,
    } = body;

    // Validate required fields
    if (!codeArenaId || !answers || score === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Resolve lesson activity by slug (codeArenaId stores the slug)
    const activity =
      (await prisma.learningActivity.findFirst({
        where: {
          activityType: "lesson",
          isActive: true,
          settings: { contains: `"slug":"${codeArenaId}"` },
        },
      })) ||
      (await prisma.learningActivity.findFirst({
        where: {
          activityType: "lesson",
          isActive: true,
          title: { equals: codeArenaId, mode: "insensitive" },
        },
      }));

    if (!activity) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Parse activity content to get quiz data
    let quizData = null;
    try {
      if (activity.content && typeof activity.content === "string") {
        const contentObj = JSON.parse(activity.content);
        if (contentObj.quiz) {
          quizData = contentObj.quiz;
        }
      }
    } catch (error) {
      console.error("Error parsing activity content:", error);
      console.error("Activity content:", activity.content);
    }

    // Determine if quiz passed
    const passingScore = quizData?.passingScore || 50;
    const passed = score >= passingScore;

    // Calculate rewards - use lower amounts as backup
    const diamondReward = passed ? quizData?.diamondReward || 30 : 0;
    const experienceReward = passed ? quizData?.experienceReward || 50 : 0;

    console.log("Quiz data:", quizData);
    console.log(
      "Score:",
      score,
      "Passing score:",
      passingScore,
      "Passed:",
      passed
    );
    console.log("Rewards to award:", { diamondReward, experienceReward });

    // Check if user has already completed this quiz successfully
    let hasAlreadyPassed = false;
    try {
      const existingAttempts = await prisma.quizAttempt.findMany({
        where: {
          userId: authUser.userId,
          quizId: quizId,
          score: { gte: passingScore },
        },
        orderBy: { completedAt: "desc" },
        take: 1,
      });
      hasAlreadyPassed = existingAttempts.length > 0;
    } catch (error) {
      console.error("Error checking existing attempts:", error);
    }

    // Create quiz attempt record
    try {
      await prisma.quizAttempt.create({
        data: {
          userId: authUser.userId,
          quizId: quizId,
          score: score,
          correctAnswers: correctAnswers || 0,
          totalQuestions: totalQuestions || 0,
          timeSpent: timeSpent || 0,
          answers: JSON.stringify(answers),
          isCompleted: true,
          startedAt: new Date(Date.now() - (timeSpent || 0) * 1000),
          completedAt: new Date(),
        },
      });
      console.log("Quiz attempt created successfully");
    } catch (error) {
      console.error("Error creating quiz attempt:", error);
      // Continue even if quiz attempt creation fails
    }

    // Award rewards if quiz passed and not already passed before
    if (
      passed &&
      diamondReward > 0 &&
      experienceReward > 0 &&
      !hasAlreadyPassed
    ) {
      try {
        console.log(
          `Awarding rewards to user ${authUser.userId}: ${diamondReward} diamonds, ${experienceReward} XP`
        );

        // Update user stats
        const updatedUser = await prisma.user.update({
          where: { id: authUser.userId },
          data: {
            currentDiamonds: { increment: diamondReward },
            totalDiamonds: { increment: diamondReward },
            experience: { increment: experienceReward },
            quizzesCompleted: { increment: 1 },
          },
        });

        console.log("User updated successfully:", {
          currentDiamonds: updatedUser.currentDiamonds,
          experience: updatedUser.experience,
        });

        // Create diamond transaction
        await prisma.diamondTransaction.create({
          data: {
            userId: authUser.userId,
            amount: diamondReward,
            type: "QUIZ_COMPLETE",
            description: `Quiz completed: ${activity.title} (${score}%)`,
            // keep legacy relatedType for analytics compatibility
            relatedType: "code_arena",
            relatedId: activity.id,
          },
        });

        console.log("Diamond transaction created successfully");
      } catch (error) {
        console.error("Error awarding rewards:", error);
        return NextResponse.json(
          { error: "Failed to award rewards" },
          { status: 500 }
        );
      }
    } else if (passed && hasAlreadyPassed) {
      console.log(
        `User ${authUser.userId} already passed this quiz, no rewards awarded`
      );
    }

    // Update lesson attempt score if quiz passed
    if (passed) {
      try {
        await prisma.activityAttempt.upsert({
          where: {
            userId_activityId: {
              userId: authUser.userId,
              activityId: activity.id,
            },
          },
          update: {
            score: score,
          },
          create: {
            userId: authUser.userId,
            activityId: activity.id,
            score: score,
            startedAt: new Date(),
          },
        });
        console.log(
          `Updated lesson attempt for activity ${activity.id} with score ${score}`
        );
      } catch (error) {
        console.error("Error updating lesson attempt:", error);
      }
    }

    const rewardsAwarded = passed && !hasAlreadyPassed;
    const actualDiamondsAwarded = rewardsAwarded ? diamondReward : 0;
    const actualXPAwarded = rewardsAwarded ? experienceReward : 0;

    return NextResponse.json({
      success: true,
      score,
      passed,
      correctAnswers,
      totalQuestions,
      timeSpent,
      rewards: {
        diamonds: actualDiamondsAwarded,
        experience: actualXPAwarded,
      },
      alreadyPassed: hasAlreadyPassed,
      message: passed
        ? hasAlreadyPassed
          ? `🎉 Quiz passed with ${score}%! (Rewards already earned)`
          : `🎉 Quiz passed! +${actualDiamondsAwarded} diamonds, +${actualXPAwarded} XP`
        : `Quiz completed with ${score}%. You need ${passingScore}% to pass.`,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
