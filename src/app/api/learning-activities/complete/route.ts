import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAndAwardBadges } from "@/lib/badges";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

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

// Calculate user level from experience
function calculateLevel(experience: number): number {
  return Math.floor(experience / 1000) + 1;
}

// Calculate experience needed for next level
function calculateExpToNextLevel(experience: number, level: number): number {
  return level * 1000 - experience;
}

export async function POST(req: NextRequest) {
  try {
    const authUser = getUserFromToken(req);

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

    // Validate required fields
    if (!activityType || !activityId || !diamondReward || !experienceReward) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user before transaction to check current state
    const userBefore = await prisma.user.findUnique({
      where: { id: authUser.userId },
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

    // Begin transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: authUser.userId },
        data: updateData,
      });

      // Create diamond transaction
      await prisma.diamondTransaction.create({
        data: {
          userId: authUser.userId,
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
        newBadges = await checkAndAwardBadges(authUser.userId);
      } catch (error) {
        console.error("Error checking badges:", error);
      }

      return { updatedUser, newBadges };
    });

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
      // New values for animation end points
      current: {
        experience: newExperience,
        diamonds: newDiamonds,
        level: newLevel,
        expToNextLevel: calculateExpToNextLevel(newExperience, newLevel),
      },
      // Rewards earned
      earned: {
        experience: experienceReward,
        diamonds: diamondReward,
      },
      // Level up bonus if applicable
      levelUp: leveledUp
        ? {
            newLevel: newLevel,
            bonusDiamonds: 50, // Bonus diamonds for leveling up
            bonusExperience: 100, // Bonus XP for leveling up
          }
        : null,
    };

    // Add level up bonuses if leveled up
    if (leveledUp) {
      await prisma.user.update({
        where: { id: authUser.userId },
        data: {
          currentDiamonds: { increment: 50 },
          totalDiamonds: { increment: 50 },
          experience: { increment: 100 },
        },
      });

      // Create level up transaction
      await prisma.diamondTransaction.create({
        data: {
          userId: authUser.userId,
          amount: 50,
          type: "LEVEL_UP_BONUS",
          description: `Level up bonus! Reached level ${newLevel}`,
          relatedType: "level_up",
          relatedId: newLevel.toString(),
        },
      });

      // Update progression data with bonuses
      progressionData.current.diamonds += 50;
      progressionData.current.experience += 100;
      progressionData.earned.diamonds += 50;
      progressionData.earned.experience += 100;
    }

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
      message: `🎉 Activity completed! +${diamondReward} diamonds, +${experienceReward} XP${leveledUp ? `, Level up to ${newLevel}!` : ""}`,
      progression: progressionData,
      rewards: {
        diamonds: diamondReward + (leveledUp ? 50 : 0),
        experience: experienceReward + (leveledUp ? 100 : 0),
        levelUp: leveledUp,
        newLevel: leveledUp ? newLevel : undefined,
        badges: result.newBadges,
      },
      animations: rewardAnimations,
      user: {
        id: authUser.userId,
        username: userBefore.username,
        level: progressionData.current.level,
        experience: progressionData.current.experience,
        diamonds: progressionData.current.diamonds,
        expToNextLevel: progressionData.current.expToNextLevel,
      },
      score,
      timeSpent,
    });
  } catch (error) {
    console.error("Error completing activity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
