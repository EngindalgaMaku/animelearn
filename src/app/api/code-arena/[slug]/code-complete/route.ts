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
      username:
        (session.user as any).username || session.user.email || "Unknown",
    };
  } catch (error) {
    console.error("Error getting user from session:", error);
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

function slugify(title: string): string {
  return (title || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function findLessonBySlug(slug: string) {
  // Try exact settings.slug match first
  const bySettings = await prisma.learningActivity.findFirst({
    where: {
      activityType: "lesson",
      isActive: true,
      settings: { contains: `"slug":"${slug}"` },
    },
  });
  if (bySettings) return bySettings;

  // Fallback to slugified title match among active lessons
  const candidates = await prisma.learningActivity.findMany({
    where: { activityType: "lesson", isActive: true },
    select: { id: true, title: true },
  });

  const found = candidates.find((c) => slugify(c.title) === slug);
  if (!found) return null;

  return prisma.learningActivity.findUnique({ where: { id: found.id } });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authUser = await getUserFromSession();
    const isLoggedIn = !!authUser;

    const { slug } = await params;
    const body = await req.json();
    const { code, score, rewards } = body;

    // Validate required fields with better error handling
    if (!code || score === undefined || !rewards) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: {
            code: !code ? "Code is required" : null,
            score: score === undefined ? "Score is required" : null,
            rewards: !rewards ? "Rewards are required" : null,
          },
        },
        { status: 400 }
      );
    }

    // Validate score range
    if (typeof score !== "number" || score < 0 || score > 100) {
      return NextResponse.json(
        { error: "Score must be a number between 0 and 100" },
        { status: 400 }
      );
    }

    // Validate rewards structure
    if (
      !rewards.diamonds ||
      !rewards.experience ||
      typeof rewards.diamonds !== "number" ||
      typeof rewards.experience !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid rewards structure" },
        { status: 400 }
      );
    }

    // Resolve the lesson activity by slug (migration from CodeArena)
    const activity = await findLessonBySlug(slug);

    if (!activity) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check if user has already completed this exercise (only for logged in users)
    let existingAttempt: any = null;
    if (isLoggedIn && authUser) {
      existingAttempt = await prisma.activityAttempt.findUnique({
        where: {
          userId_activityId: {
            userId: authUser.userId,
            activityId: activity.id,
          },
        },
      });
    }

    // Only award rewards if user is logged in, hasn't been correct before, and score >= 90%
    const wasCodeCorrect = (existingAttempt?.score ?? 0) >= 90;
    const shouldAwardRewards =
      isLoggedIn && authUser && !wasCodeCorrect && score >= 90;

    if (shouldAwardRewards) {
      // Get user before transaction to check current state
      const userBefore = await prisma.user.findUnique({
        where: { id: authUser!.userId },
        select: {
          id: true,
          experience: true,
          currentDiamonds: true,
          level: true,
          codeArenasCompleted: true,
          codeSubmissionCount: true,
          username: true,
        },
      });

      if (!userBefore) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Calculate new values
      const newExperience = userBefore.experience + rewards.experience;
      const newDiamonds = userBefore.currentDiamonds + rewards.diamonds;
      const newLevel = calculateLevel(newExperience);
      const leveledUp = newLevel > userBefore.level;

      try {
        // Begin transaction - ALL updates must be atomic
        const result = await prisma.$transaction(async (prismaTx) => {
          // Update user with main rewards
          let updatedUser = await prismaTx.user.update({
            where: { id: authUser!.userId },
            data: {
              currentDiamonds: newDiamonds,
              totalDiamonds: { increment: rewards.diamonds },
              experience: newExperience,
              level: newLevel,
              codeSubmissionCount: { increment: 1 },
              // legacy counter name retained
              codeArenasCompleted: { increment: 1 },
            },
          });

          // Handle level up bonuses within the same transaction
          if (leveledUp) {
            updatedUser = await prismaTx.user.update({
              where: { id: authUser!.userId },
              data: {
                currentDiamonds: { increment: 50 },
                totalDiamonds: { increment: 50 },
                experience: { increment: 100 },
              },
            });

            // Create level up transaction
            await prismaTx.diamondTransaction.create({
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

          // Create main diamond transaction
          await prismaTx.diamondTransaction.create({
            data: {
              userId: authUser!.userId,
              amount: rewards.diamonds,
              type: "CODE_COMPLETE",
              description: `Code exercise completed: ${activity.title} (${score}%)`,
              // keep legacy relatedType to avoid breaking dashboards
              relatedType: "code_arena",
              relatedId: activity.id,
            },
          });

          // Create code submission record (reuse codeArenaId field to store activity id)
          await prismaTx.codeSubmission.create({
            data: {
              userId: authUser!.userId,
              codeArenaId: activity.id,
              code: code,
              language: "python",
              isCorrect: score >= 90,
              score: score,
              feedback:
                score >= 90 ? "Excellent work!" : "Good effort, try for 100%!",
            },
          });

          // Update attempt (mark completed and update best score)
          if (existingAttempt) {
            await prismaTx.activityAttempt.update({
              where: {
                userId_activityId: {
                  userId: authUser!.userId,
                  activityId: activity.id,
                },
              },
              data: {
                score: Math.max(score, existingAttempt.score || 0),
                completed: true,
                completedAt: new Date(),
                answers: JSON.stringify({
                  lastCode: code,
                  updatedAt: new Date().toISOString(),
                }),
              },
            });
          } else {
            await prismaTx.activityAttempt.create({
              data: {
                userId: authUser!.userId,
                activityId: activity.id,
                score: score,
                completed: true,
                completedAt: new Date(),
                startedAt: new Date(),
                answers: JSON.stringify({
                  lastCode: code,
                  updatedAt: new Date().toISOString(),
                }),
              },
            });
          }

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

        // Prepare reward animation data
        const rewardAnimations: RewardAnimation[] = [
          {
            type: "experience",
            amount: rewards.experience + (leveledUp ? 100 : 0),
            icon: "⭐",
            color: "#FFD700",
            delay: 0,
          },
          {
            type: "diamonds",
            amount: rewards.diamonds + (leveledUp ? 50 : 0),
            icon: "💎",
            color: "#00D4FF",
            delay: 500,
          },
        ];

        // Add level up animation if applicable
        if (leveledUp) {
          rewardAnimations.push({
            type: "level_up",
            amount: finalLevel,
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
              icon: badge.badge?.icon || "🏆",
              color: badge.badge?.color || "#FFD700",
              delay: 1500 + index * 300,
              badgeData: badge.badge,
            });
          });
        }

        return NextResponse.json({
          success: true,
          message: `🎉 Code exercise completed! +${
            finalDiamonds - userBefore.currentDiamonds
          } diamonds, +${
            finalExperience - userBefore.experience
          } XP${leveledUp ? `, Level up to ${finalLevel}!` : ""}`,
          rewards: {
            diamonds: finalDiamonds - userBefore.currentDiamonds,
            experience: finalExperience - userBefore.experience,
            levelUp: leveledUp,
            newLevel: leveledUp ? finalLevel : undefined,
            badges: result.newBadges,
          },
          animations: rewardAnimations,
          user: {
            id: authUser!.userId,
            username: userBefore.username,
            level: finalLevel,
            experience: finalExperience,
            diamonds: finalDiamonds,
            expToNextLevel: calculateExpToNextLevel(
              finalExperience,
              finalLevel
            ),
          },
          score,
          newCompletion: true,
        });
      } catch (error) {
        console.error("Error awarding code completion rewards:", error);
        return NextResponse.json(
          { error: "Failed to award rewards" },
          { status: 500 }
        );
      }
    } else {
      // Handle non-logged users and users without rewards
      if (isLoggedIn && authUser) {
        // Update attempt for logged in users but don't award rewards
        if (existingAttempt) {
          await prisma.activityAttempt.update({
            where: {
              userId_activityId: {
                userId: authUser.userId,
                activityId: activity.id,
              },
            },
            data: {
              score: Math.max(score, existingAttempt.score || 0),
              answers: JSON.stringify({
                lastCode: code,
                updatedAt: new Date().toISOString(),
              }),
            },
          });
        } else {
          await prisma.activityAttempt.create({
            data: {
              userId: authUser.userId,
              activityId: activity.id,
              score: score,
              startedAt: new Date(),
              answers: JSON.stringify({
                lastCode: code,
                updatedAt: new Date().toISOString(),
              }),
            },
          });
        }

        return NextResponse.json({
          success: true,
          message: wasCodeCorrect
            ? `Code exercise completed with ${score}% score! (Rewards already earned)`
            : `Code exercise completed with ${score}% score! Get 90%+ for rewards.`,
          rewards: { diamonds: 0, experience: 0 },
          score,
          newCompletion: false,
          isLoggedIn: true,
        });
      } else {
        // Anonymous user - show potential rewards and encourage login
        return NextResponse.json({
          success: true,
          message:
            score >= 90
              ? `🎉 Excellent work! You scored ${score}%! 🔓 Login to earn ${rewards.diamonds} diamonds and ${rewards.experience} XP!`
              : `Great job! You scored ${score}%! 🔓 Login to track your progress and earn rewards when you score 90%+!`,
          score,
          isLoggedIn: false,
          potentialRewards:
            score >= 90
              ? {
                  diamonds: rewards.diamonds,
                  experience: rewards.experience,
                  message:
                    "🔓 Login now to claim these rewards and track your progress!",
                }
              : {
                  diamonds: rewards.diamonds,
                  experience: rewards.experience,
                  message:
                    "🔓 Login to track progress and earn rewards when you score 90%+!",
                },
          loginPrompt: {
            title: "🚀 Unlock Your Full Potential!",
            message:
              "Login to earn diamonds, gain experience, level up, unlock badges, and track your coding journey!",
            benefits: [
              `💎 Earn ${rewards.diamonds} diamonds per completion`,
              `⭐ Gain ${rewards.experience} XP for leveling up`,
              "🏆 Unlock achievement badges",
              "📊 Track your progress over time",
              "🎯 Set and achieve coding goals",
            ],
          },
        });
      }
    }
  } catch (error) {
    console.error("Error processing code completion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
