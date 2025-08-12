import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAndAwardBadges } from "@/lib/badges";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface AuthUser {
  userId: string;
  username: string;
}

interface RewardAnimation {
  type: string;
  amount: any;
  icon: string;
  color: string;
  delay: number;
  badgeData?: any;
}

// Get user from NextAuth session
async function getUserFromSession(): Promise<AuthUser | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return null;
    }

    return {
      userId: session.user.id,
      username: session.user.username || session.user.email || "Unknown",
    };
  } catch (error) {
    console.error("Error getting user from session:", error);
    return null;
  }
}

// Calculate user level from experience
function calculateLevel(experience: number): number {
  return Math.floor(experience / 100) + 1;
}

// Calculate experience needed for next level
function calculateExpToNextLevel(experience: number, level: number): number {
  return level * 100 - experience;
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getUserFromSession();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      activityType,
      activityId,
      score,
      timeSpent,
      diamondReward,
      experienceReward,
      activityTitle,
    } = body;

    // Validate required fields with detailed error messages
    if (
      !activityType ||
      !activityId ||
      diamondReward === undefined ||
      experienceReward === undefined
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: {
            activityType: !activityType ? "Activity type is required" : null,
            activityId: !activityId ? "Activity ID is required" : null,
            diamondReward:
              diamondReward === undefined ? "Diamond reward is required" : null,
            experienceReward:
              experienceReward === undefined
                ? "Experience reward is required"
                : null,
          },
        },
        { status: 400 }
      );
    }

    // Validate data types and ranges
    if (typeof diamondReward !== "number" || diamondReward < 0) {
      return NextResponse.json(
        { error: "Diamond reward must be a non-negative number" },
        { status: 400 }
      );
    }

    if (typeof experienceReward !== "number" || experienceReward < 0) {
      return NextResponse.json(
        { error: "Experience reward must be a non-negative number" },
        { status: 400 }
      );
    }

    if (
      score !== undefined &&
      (typeof score !== "number" || score < 0 || score > 100)
    ) {
      return NextResponse.json(
        { error: "Score must be a number between 0 and 100" },
        { status: 400 }
      );
    }

    // Get user before transaction to check current state
    const userBefore = await prisma.user.findUnique({
      where: { id: authUser!.userId },
      select: {
        id: true,
        experience: true,
        currentDiamonds: true,
        level: true,
        codeArenasCompleted: true,
        quizzesCompleted: true,
        username: true,
      },
    });

    if (!userBefore) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate new values
    const newExperience = userBefore.experience + experienceReward;
    const newDiamonds = userBefore.currentDiamonds + diamondReward;
    const newLevel = calculateLevel(newExperience);
    const leveledUp = newLevel > userBefore.level;

    // Update user stats based on activity type
    let updateData: any = {
      currentDiamonds: newDiamonds,
      totalDiamonds: { increment: diamondReward },
      experience: newExperience,
      level: newLevel,
    };

    // Activity-specific updates
    switch (activityType) {
      case "code_arena":
        updateData.codeArenasCompleted = { increment: 1 };
        break;
      case "quiz":
        updateData.quizzesCompleted = { increment: 1 };
        break;
    }

    // Begin transaction - ALL updates must be atomic
    const result = await prisma.$transaction(async (prisma) => {
      // Update user with main rewards
      let updatedUser = await prisma.user.update({
        where: { id: authUser!.userId },
        data: updateData,
      });

      // Handle level up bonuses within the same transaction
      if (leveledUp) {
        updatedUser = await prisma.user.update({
          where: { id: authUser!.userId },
          data: {
            currentDiamonds: { increment: 50 },
            totalDiamonds: { increment: 50 },
            experience: { increment: 100 },
          },
        });

        // Create level up transaction
        await prisma.diamondTransaction.create({
          data: {
            userId: authUser!.userId,
            amount: 50,
            type: "LEVEL_UP_BONUS",
            description: `Level up bonus! Reached level ${newLevel}`,
            relatedType: "level_up",
            relatedId: newLevel.toString(),
          },
        });
      }

      // Create or update activity attempt record (CRITICAL for progress tracking)
      await prisma.activityAttempt.upsert({
        where: {
          userId_activityId: {
            userId: authUser!.userId,
            activityId: activityId,
          },
        },
        update: {
          score: score || 100,
          maxScore: 100,
          completed: true,
          timeSpent: timeSpent || 0,
          completedAt: new Date(),
        },
        create: {
          userId: authUser!.userId,
          activityId: activityId,
          score: score || 100,
          maxScore: 100,
          completed: true,
          timeSpent: timeSpent || 0,
          startedAt: new Date(),
          completedAt: new Date(),
        },
      });

      // Create main activity diamond transaction
      await prisma.diamondTransaction.create({
        data: {
          userId: authUser!.userId,
          amount: diamondReward,
          type: activityType.toUpperCase() + "_COMPLETE",
          description: `${activityTitle} completed - Score: ${score}%`,
          relatedType: activityType,
          relatedId: activityId,
        },
      });

      // Check for new badges
      let newBadges: any[] = [];
      try {
        newBadges = await checkAndAwardBadges(authUser!.userId);
      } catch (error) {
        console.error("Error checking badges:", error);
        // Don't fail the entire transaction for badge errors
      }

      return { updatedUser, newBadges };
    });

    // Calculate final values including level up bonuses
    const finalExperience = newExperience + (leveledUp ? 100 : 0);
    const finalDiamonds = newDiamonds + (leveledUp ? 50 : 0);
    const finalLevel = calculateLevel(finalExperience);

    // Calculate progression data for animations
    const progressionData = {
      // Previous values for animation starting points
      previous: {
        experience: userBefore.experience,
        diamonds: userBefore.currentDiamonds,
        level: userBefore.level,
        expToNextLevel: calculateExpToNextLevel(
          userBefore.experience,
          userBefore.level
        ),
      },
      // New values for animation end points (including bonuses)
      current: {
        experience: finalExperience,
        diamonds: finalDiamonds,
        level: finalLevel,
        expToNextLevel: calculateExpToNextLevel(finalExperience, finalLevel),
      },
      // Rewards earned (including bonuses)
      earned: {
        experience: experienceReward + (leveledUp ? 100 : 0),
        diamonds: diamondReward + (leveledUp ? 50 : 0),
      },
      // Level up bonus if applicable
      levelUp: leveledUp
        ? {
            newLevel: newLevel,
            bonusDiamonds: 50,
            bonusExperience: 100,
          }
        : null,
    };

    // Prepare reward animation data
    const rewardAnimations: RewardAnimation[] = [
      {
        type: "experience",
        amount: experienceReward,
        icon: "⭐",
        color: "#FFD700",
        delay: 0,
      },
      {
        type: "diamonds",
        amount: diamondReward,
        icon: "💎",
        color: "#00D4FF",
        delay: 500,
      },
    ];

    // Add level up animation if applicable
    if (leveledUp) {
      rewardAnimations.push({
        type: "level_up",
        amount: newLevel,
        icon: "🎉",
        color: "#FF6B6B",
        delay: 1000,
      });
    }

    // Add badge animations if any new badges
    if (result.newBadges.length > 0) {
      result.newBadges.forEach((badge, index) => {
        rewardAnimations.push({
          type: "badge",
          amount: 1,
          icon: badge.icon || "🏆",
          color: badge.color || "#FFD700",
          delay: 1500 + index * 300,
          badgeData: badge,
        });
      });
    }

    return NextResponse.json({
      success: true,
      message: `🎉 Activity completed! +${progressionData.earned.diamonds} diamonds, +${progressionData.earned.experience} XP${leveledUp ? `, Level up to ${finalLevel}!` : ""}`,
      progression: progressionData,
      rewards: {
        diamonds: progressionData.earned.diamonds,
        experience: progressionData.earned.experience,
        levelUp: leveledUp,
        newLevel: leveledUp ? finalLevel : undefined,
        badges: result.newBadges,
      },
      animations: rewardAnimations,
      user: {
        id: authUser!.userId,
        username: userBefore.username,
        level: progressionData.current.level,
        experience: progressionData.current.experience,
        diamonds: progressionData.current.diamonds,
        expToNextLevel: progressionData.current.expToNextLevel,
      },
      activityCompleted: {
        activityId,
        activityType,
        score: score || 100,
        timeSpent: timeSpent || 0,
        completedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error completing activity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
