import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface AuthUser {
  userId: string;
  username: string;
}

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

// GET - Tek learning activity getir (content dahil)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = getUserFromToken(request);

    const activity = await prisma.learningActivity.findFirst({
      where: {
        id,
        isActive: true,
      },
      include: {
        prerequisite: {
          select: {
            id: true,
            title: true,
            category: true,
            topicOrder: true,
          },
        },
        _count: {
          select: {
            attempts: true,
          },
        },
      },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activity bulunamadı" },
        { status: 404 }
      );
    }

    // Get user's attempt if authenticated
    let userAttempt = null;
    if (authUser) {
      userAttempt = await prisma.activityAttempt.findUnique({
        where: {
          userId_activityId: {
            userId: authUser.userId,
            activityId: activity.id,
          },
        },
      });
    }

    // Check if prerequisite is completed (if any)
    let isUnlocked = !activity.isLocked;

    if (authUser && activity.prerequisiteId && activity.isLocked) {
      const prerequisiteCompletion = await prisma.activityAttempt.findUnique({
        where: {
          userId_activityId: {
            userId: authUser.userId,
            activityId: activity.prerequisiteId,
          },
        },
        select: { completed: true },
      });

      isUnlocked = prerequisiteCompletion?.completed || false;
    }

    const formattedActivity = {
      ...activity,
      content: JSON.parse(activity.content),
      settings: activity.settings ? JSON.parse(activity.settings) : null,
      tags: activity.tags ? JSON.parse(activity.tags) : [],
      totalAttempts: activity._count.attempts,
      isUnlocked,
      userProgress: userAttempt
        ? {
            score: userAttempt.score,
            maxScore: userAttempt.maxScore,
            completed: userAttempt.completed,
            timeSpent: userAttempt.timeSpent,
            hintsUsed: userAttempt.hintsUsed,
            mistakes: userAttempt.mistakes,
            startedAt: userAttempt.startedAt,
            completedAt: userAttempt.completedAt,
            percentage: Math.round(
              (userAttempt.score / userAttempt.maxScore) * 100
            ),
          }
        : null,
    };

    return NextResponse.json({
      success: true,
      activity: formattedActivity,
    });
  } catch (error) {
    console.error("Learning activity GET error:", error);
    return NextResponse.json(
      { error: "Activity getirilirken hata oluştu" },
      { status: 500 }
    );
  }
}

// POST - Activity başlat (attempt oluştur)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = getUserFromToken(request);

    if (!authUser) {
      return NextResponse.json(
        { error: "Bu işlem için giriş yapmanız gerekli" },
        { status: 401 }
      );
    }

    const activity = await prisma.learningActivity.findFirst({
      where: {
        id,
        isActive: true,
      },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activity bulunamadı" },
        { status: 404 }
      );
    }

    // Check if activity is locked and prerequisites are met
    if (activity.isLocked && activity.prerequisiteId) {
      const prerequisiteCompletion = await prisma.activityAttempt.findUnique({
        where: {
          userId_activityId: {
            userId: authUser.userId,
            activityId: activity.prerequisiteId,
          },
        },
        select: { completed: true },
      });

      if (!prerequisiteCompletion?.completed) {
        return NextResponse.json(
          {
            error:
              "Bu aktiviteyi oynamak için önce prerequisite aktiviteleri tamamlamalısınız",
          },
          { status: 403 }
        );
      }
    }

    // Check if user already has an attempt
    const existingAttempt = await prisma.activityAttempt.findUnique({
      where: {
        userId_activityId: {
          userId: authUser.userId,
          activityId: activity.id,
        },
      },
    });

    if (existingAttempt) {
      return NextResponse.json({
        success: true,
        attempt: existingAttempt,
        message: "Activity zaten başlatılmış",
      });
    }

    // Create new attempt
    const newAttempt = await prisma.activityAttempt.create({
      data: {
        userId: authUser.userId,
        activityId: activity.id,
        maxScore: 100, // Default max score
      },
    });

    return NextResponse.json({
      success: true,
      attempt: newAttempt,
      message: "Activity başarıyla başlatıldı",
    });
  } catch (error) {
    console.error("Activity start error:", error);
    return NextResponse.json(
      { error: "Activity başlatılırken hata oluştu" },
      { status: 500 }
    );
  }
}

// PUT - Activity tamamla ve reward ver
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = getUserFromToken(request);

    if (!authUser) {
      return NextResponse.json(
        { error: "Bu işlem için giriş yapmanız gerekli" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { score, timeSpent, hintsUsed, mistakes, answers } = body;

    const activity = await prisma.learningActivity.findFirst({
      where: {
        id,
        isActive: true,
      },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activity bulunamadı" },
        { status: 404 }
      );
    }

    // Check if activity is locked and prerequisites are met
    if (activity.isLocked && activity.prerequisiteId) {
      const prerequisiteCompletion = await prisma.activityAttempt.findUnique({
        where: {
          userId_activityId: {
            userId: authUser.userId,
            activityId: activity.prerequisiteId,
          },
        },
        select: { completed: true },
      });

      if (!prerequisiteCompletion?.completed) {
        return NextResponse.json(
          {
            error:
              "Bu aktiviteyi tamamlamak için önce prerequisite aktiviteleri tamamlamalısınız",
          },
          { status: 403 }
        );
      }
    }

    // Get existing attempt
    const existingAttempt = await prisma.activityAttempt.findUnique({
      where: {
        userId_activityId: {
          userId: authUser.userId,
          activityId: activity.id,
        },
      },
    });

    if (!existingAttempt) {
      return NextResponse.json(
        { error: "Activity henüz başlatılmamış" },
        { status: 400 }
      );
    }

    // Check if already completed (prevent duplicate rewards)
    const isFirstCompletion = !existingAttempt.completed;
    const scoreImproved = score > existingAttempt.score;

    // Calculate rewards (only for first completion or score improvement)
    let rewards = { diamonds: 0, experience: 0 };
    let shouldGiveRewards = false;

    if (isFirstCompletion && score >= 70) {
      // First time completion with passing score
      shouldGiveRewards = true;
      rewards.diamonds = activity.diamondReward;
      rewards.experience = activity.experienceReward;
    } else if (!isFirstCompletion && scoreImproved && score >= 70) {
      // Score improvement bonus (smaller reward)
      shouldGiveRewards = true;
      rewards.diamonds = Math.floor(activity.diamondReward * 0.5);
      rewards.experience = Math.floor(activity.experienceReward * 0.5);
    }

    // Transaction to update attempt and give rewards
    const result = await prisma.$transaction(async (tx) => {
      // Update attempt
      const updatedAttempt = await tx.activityAttempt.update({
        where: {
          userId_activityId: {
            userId: authUser.userId,
            activityId: activity.id,
          },
        },
        data: {
          score: Math.max(score, existingAttempt.score), // Keep best score
          timeSpent: existingAttempt.timeSpent + (timeSpent || 0),
          hintsUsed: Math.max(hintsUsed || 0, existingAttempt.hintsUsed),
          mistakes: Math.max(mistakes || 0, existingAttempt.mistakes),
          answers: answers ? JSON.stringify(answers) : existingAttempt.answers,
          completed: score >= 70 ? true : existingAttempt.completed,
          completedAt:
            score >= 70 && !existingAttempt.completed
              ? new Date()
              : existingAttempt.completedAt,
        },
      });

      let updatedUser = null;
      let transaction = null;

      // Give rewards if applicable
      if (shouldGiveRewards && rewards.diamonds > 0) {
        // Update user diamonds and experience
        updatedUser = await tx.user.update({
          where: { id: authUser.userId },
          data: {
            currentDiamonds: { increment: rewards.diamonds },
            totalDiamonds: { increment: rewards.diamonds },
            experience: { increment: rewards.experience },
          },
          select: {
            currentDiamonds: true,
            totalDiamonds: true,
            experience: true,
            level: true,
          },
        });

        // Create diamond transaction record
        transaction = await tx.diamondTransaction.create({
          data: {
            userId: authUser.userId,
            amount: rewards.diamonds,
            type: "ACTIVITY_COMPLETION",
            description: `${activity.title} activity completed`,
            relatedId: activity.id,
            relatedType: "learning_activity",
          },
        });
      }

      return {
        attempt: updatedAttempt,
        user: updatedUser,
        transaction,
        rewards: shouldGiveRewards ? rewards : null,
      };
    });

    return NextResponse.json({
      success: true,
      attempt: result.attempt,
      rewards: result.rewards,
      newCompletion: isFirstCompletion && score >= 70,
      scoreImproved: scoreImproved,
      message: result.rewards
        ? `Activity tamamlandı! +${result.rewards.diamonds} elmas, +${result.rewards.experience} XP kazandınız!`
        : score >= 70
          ? "Activity tamamlandı!"
          : "Activity denendi, geçmek için en az %70 puan gerekli.",
    });
  } catch (error) {
    console.error("Activity completion error:", error);
    return NextResponse.json(
      { error: "Activity tamamlanırken hata oluştu" },
      { status: 500 }
    );
  }
}
