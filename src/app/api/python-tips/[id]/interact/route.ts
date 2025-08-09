import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/python-tips/[id]/interact - Record user interaction with a tip
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, timeSpent, completionScore, deviceType, sourceType } = body;
    const resolvedParams = await params;
    const tipId = resolvedParams.id;
    const userId = session.user.id as string;

    // Validate action
    const validActions = ["view", "like", "unlike", "share", "complete"];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      );
    }

    // Check if tip exists
    const tip = await db.pythonTip.findUnique({
      where: { id: tipId },
      include: { category: true },
    });

    if (!tip || !tip.isActive) {
      return NextResponse.json(
        { success: false, error: "Tip not found" },
        { status: 404 }
      );
    }

    // Get or create user interaction
    let interaction = await db.userPythonTipInteraction.findUnique({
      where: {
        userId_tipId: { userId, tipId },
      },
    });

    const now = new Date();
    let xpEarned = 0;
    let diamondsEarned = 0;

    // Process different actions
    switch (action) {
      case "view":
        if (!interaction) {
          // First view - create interaction
          interaction = await db.userPythonTipInteraction.create({
            data: {
              userId,
              tipId,
              hasViewed: true,
              firstViewedAt: now,
              lastViewedAt: now,
              timeSpent: timeSpent || 0,
              deviceType,
              sourceType,
              xpEarned: 5, // Base XP for viewing
            },
          });
          xpEarned = 5;
          
          // Update tip view count
          await db.pythonTip.update({
            where: { id: tipId },
            data: { viewCount: { increment: 1 } },
          });
        } else if (!interaction.hasViewed) {
          // Mark as viewed if not already
          await db.userPythonTipInteraction.update({
            where: { userId_tipId: { userId, tipId } },
            data: {
              hasViewed: true,
              firstViewedAt: now,
              lastViewedAt: now,
              timeSpent: (interaction.timeSpent || 0) + (timeSpent || 0),
              xpEarned: interaction.xpEarned + 5,
            },
          });
          xpEarned = 5;
          
          await db.pythonTip.update({
            where: { id: tipId },
            data: { viewCount: { increment: 1 } },
          });
        } else {
          // Update time spent for existing view
          await db.userPythonTipInteraction.update({
            where: { userId_tipId: { userId, tipId } },
            data: {
              lastViewedAt: now,
              timeSpent: (interaction.timeSpent || 0) + (timeSpent || 0),
            },
          });
        }
        break;

      case "like":
        if (!interaction) {
          return NextResponse.json(
            { success: false, error: "Must view tip first" },
            { status: 400 }
          );
        }

        if (!interaction.hasLiked) {
          await db.userPythonTipInteraction.update({
            where: { userId_tipId: { userId, tipId } },
            data: {
              hasLiked: true,
              likedAt: now,
              xpEarned: interaction.xpEarned + 2,
            },
          });
          
          await db.pythonTip.update({
            where: { id: tipId },
            data: { likeCount: { increment: 1 } },
          });
          
          xpEarned = 2;
        }
        break;

      case "unlike":
        if (interaction?.hasLiked) {
          await db.userPythonTipInteraction.update({
            where: { userId_tipId: { userId, tipId } },
            data: {
              hasLiked: false,
              likedAt: null,
              xpEarned: Math.max(0, interaction.xpEarned - 2),
            },
          });
          
          await db.pythonTip.update({
            where: { id: tipId },
            data: { likeCount: { decrement: 1 } },
          });
        }
        break;

      case "share":
        if (!interaction) {
          return NextResponse.json(
            { success: false, error: "Must view tip first" },
            { status: 400 }
          );
        }

        await db.userPythonTipInteraction.update({
          where: { userId_tipId: { userId, tipId } },
          data: {
            hasShared: true,
            sharedAt: now,
            xpEarned: interaction.xpEarned + 10,
          },
        });
        
        await db.pythonTip.update({
          where: { id: tipId },
          data: { shareCount: { increment: 1 } },
        });
        
        xpEarned = 10;
        break;

      case "complete":
        if (!interaction) {
          return NextResponse.json(
            { success: false, error: "Must view tip first" },
            { status: 400 }
          );
        }

        if (!interaction.hasCompleted) {
          const baseXP = tip.xpReward || 25;
          const bonusXP = completionScore ? Math.floor((completionScore / 100) * 10) : 0;
          const totalXP = baseXP + bonusXP;

          await db.userPythonTipInteraction.update({
            where: { userId_tipId: { userId, tipId } },
            data: {
              hasCompleted: true,
              completedAt: now,
              completionScore: completionScore || 100,
              attemptCount: (interaction.attemptCount || 0) + 1,
              xpEarned: interaction.xpEarned + totalXP,
            },
          });
          
          xpEarned = totalXP;
        }
        break;
    }

    // Update user XP and streak if XP was earned
    if (xpEarned > 0) {
      await db.user.update({
        where: { id: userId },
        data: {
          experience: { increment: xpEarned },
          currentDiamonds: { increment: diamondsEarned },
        },
      });

      // Update or create Python tip streak
      await updatePythonTipStreak(userId, action === "complete");
    }

    return NextResponse.json({
      success: true,
      xpEarned,
      diamondsEarned,
      message: `${action} recorded successfully`,
    });
  } catch (error) {
    console.error("Tip interaction error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record interaction" },
      { status: 500 }
    );
  }
}

// Helper function to update Python tip streak
async function updatePythonTipStreak(userId: string, isCompletion: boolean) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = await db.pythonTipStreak.findUnique({
    where: { userId },
  });

  if (!streak) {
    // Create new streak
    streak = await db.pythonTipStreak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastTipDate: today,
        streakStartDate: today,
        totalTipsViewed: 1,
        totalTipsCompleted: isCompletion ? 1 : 0,
        totalXPEarned: 0,
      },
    });
  } else {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const updates: any = {
      totalTipsViewed: { increment: 1 },
      totalXPEarned: { increment: 0 }, // Will be updated by caller
    };

    if (isCompletion) {
      updates.totalTipsCompleted = { increment: 1 };
    }

    // Check streak continuation
    if (streak.lastTipDate) {
      const lastDate = new Date(streak.lastTipDate);
      lastDate.setHours(0, 0, 0, 0);

      if (lastDate.getTime() === yesterday.getTime()) {
        // Streak continues
        const newStreak = streak.currentStreak + 1;
        updates.currentStreak = newStreak;
        updates.longestStreak = Math.max(streak.longestStreak, newStreak);
        updates.lastTipDate = today;
      } else if (lastDate.getTime() !== today.getTime()) {
        // Streak broken
        updates.currentStreak = 1;
        updates.lastTipDate = today;
        updates.streakStartDate = today;
      }
      // If lastDate === today, don't update streak (same day)
    }

    await db.pythonTipStreak.update({
      where: { userId },
      data: updates,
    });
  }
}