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
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
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
  // Match settings.slug if present
  const direct = await prisma.learningActivity.findFirst({
    where: {
      activityType: "lesson",
      isActive: true,
      settings: { contains: `"slug":"${slug}"` },
    },
  });
  if (direct) return direct;

  // Fallback to slugified title
  const candidates = await prisma.learningActivity.findMany({
    where: { activityType: "lesson", isActive: true },
    select: { id: true, title: true },
  });
  const found = candidates.find((c) => slugify(c.title) === slug);
  if (!found) return null;

  return prisma.learningActivity.findUnique({ where: { id: found.id } });
}

function partitionReward(base: number, ratio = 0.6) {
  const code = Math.floor((base || 0) * ratio);
  const quiz = (base || 0) - code;
  return { code, quiz };
}

// POST - Quiz completion for a lesson (LearningActivity)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authUser = getUserFromToken(req);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await req.json();
    const { score, passingScore } = body as {
      score: number;
      passingScore?: number;
    };

    if (
      typeof score !== "number" ||
      Number.isNaN(score) ||
      score < 0 ||
      score > 100
    ) {
      return NextResponse.json(
        { error: "Invalid score. Must be a number between 0 and 100" },
        { status: 400 }
      );
    }

    // Resolve lesson activity
    const activity = await findLessonBySlug(slug);
    if (!activity) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Load attempt and flags
    const existingAttempt = await prisma.activityAttempt.findUnique({
      where: {
        userId_activityId: {
          userId: authUser.userId,
          activityId: activity.id,
        },
      },
    });

    let answersObj: any = {};
    try {
      if (existingAttempt?.answers)
        answersObj = JSON.parse(existingAttempt.answers as any);
    } catch {
      answersObj = {};
    }
    const flags = answersObj?.flags || {};

    const threshold = Math.max(0, Math.min(100, Number(passingScore ?? 70)));
    const passed = score >= threshold;

    const wasQuizPassed = !!flags.quizPassed;
    const wasQuizRewarded = !!flags.quizRewarded;

    const shouldMarkPassed = passed && !wasQuizPassed;
    const shouldAwardRewards = passed && !wasQuizRewarded;

    // Update answers with quiz info
    const newFlags = {
      ...flags,
      quizPassed: flags.quizPassed || passed,
      quizRewarded: flags.quizRewarded || shouldAwardRewards,
    };
    const newAnswers = {
      ...answersObj,
      quizScore: Math.max(Number(answersObj?.quizScore || 0), score),
      quizThreshold: threshold,
      flags: newFlags,
      quizUpdatedAt: new Date().toISOString(),
    };

    // Always upsert attempt (do not change numeric score that we use for code)
    await prisma.activityAttempt.upsert({
      where: {
        userId_activityId: {
          userId: authUser.userId,
          activityId: activity.id,
        },
      },
      update: {
        answers: JSON.stringify(newAnswers),
      },
      create: {
        userId: authUser.userId,
        activityId: activity.id,
        answers: JSON.stringify(newAnswers),
        startedAt: new Date(),
      },
    });

    if (!shouldAwardRewards) {
      // No new rewards to give; return current status
      return NextResponse.json({
        success: true,
        message: passed
          ? "Quiz passed! (Rewards already earned)"
          : `Quiz completed with ${score}%. You need ${threshold}%+ to pass.`,
        rewards: { diamonds: 0, experience: 0 },
        passed,
        newCompletion: false,
      });
    }

    // Compute quiz share (40%) server-side
    const { quiz: quizDiamonds } = partitionReward(
      activity.diamondReward ?? 0,
      0.6
    );
    const { quiz: quizXP } = partitionReward(
      activity.experienceReward ?? 0,
      0.6
    );

    // Award in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: authUser.userId },
        data: {
          currentDiamonds: { increment: quizDiamonds },
          totalDiamonds: { increment: quizDiamonds },
          experience: { increment: quizXP },
          quizzesCompleted: { increment: 1 },
        },
      });

      await tx.diamondTransaction.create({
        data: {
          userId: authUser.userId,
          amount: quizDiamonds,
          type: "ACTIVITY_COMPLETION",
          description: `Lesson quiz passed: ${activity.title} (${score}%)`,
          relatedType: "lesson",
          relatedId: activity.id,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: `🎉 Quiz passed! +${quizDiamonds} diamonds, +${quizXP} XP`,
      rewards: { diamonds: quizDiamonds, experience: quizXP },
      passed: true,
      newCompletion: true,
    });
  } catch (error) {
    console.error("Error processing lesson quiz completion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
