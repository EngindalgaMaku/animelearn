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

// Reward partition helper: deterministically split base into 60% (code) + remainder (quiz)
function partitionReward(base: number, ratio = 0.6) {
  const code = Math.floor((base || 0) * ratio);
  const quiz = (base || 0) - code;
  return { code, quiz };
}

// POST - Code exercise completion for a lesson (LearningActivity)
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
    const { code, score } = body as {
      code: string;
      score: number;
    };

    // Validate required fields
    if (!code || typeof score !== "number") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Resolve lesson activity
    const activity = await findLessonBySlug(slug);
    if (!activity) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check existing attempt
    const existingAttempt = await prisma.activityAttempt.findUnique({
      where: {
        userId_activityId: {
          userId: authUser.userId,
          activityId: activity.id,
        },
      },
    });

    const previousScore = existingAttempt?.score ?? 0;

    // Parse existing answers to track flags
    let answersObj: any = {};
    try {
      if (existingAttempt?.answers)
        answersObj = JSON.parse(existingAttempt.answers as any);
    } catch {
      answersObj = {};
    }
    const flags = answersObj?.flags || {};
    const wasCodeRewarded = !!flags.codeRewarded;

    const isCodeCorrectNow = score >= 90;
    const shouldAwardRewards = isCodeCorrectNow && !wasCodeRewarded;

    // Prepare updated answers payload
    const updatedFlags = {
      ...flags,
      codeRewarded: flags.codeRewarded || shouldAwardRewards,
    };
    const newAnswers = {
      ...answersObj,
      lastCode: code,
      updatedAt: new Date().toISOString(),
      flags: updatedFlags,
    };

    // Upsert attempt with best score and updated answers
    await prisma.activityAttempt.upsert({
      where: {
        userId_activityId: {
          userId: authUser.userId,
          activityId: activity.id,
        },
      },
      update: {
        score: Math.max(score, previousScore),
        answers: JSON.stringify(newAnswers),
      },
      create: {
        userId: authUser.userId,
        activityId: activity.id,
        score,
        answers: JSON.stringify(newAnswers),
        startedAt: new Date(),
      },
    });

    if (shouldAwardRewards) {
      try {
        // Compute server-side rewards (ignore client-provided values)
        const { code: codeDiamonds } = partitionReward(
          activity.diamondReward ?? 0,
          0.6
        );
        const { code: codeXP } = partitionReward(
          activity.experienceReward ?? 0,
          0.6
        );

        // Update user balances
        await prisma.user.update({
          where: { id: authUser.userId },
          data: {
            currentDiamonds: { increment: codeDiamonds },
            totalDiamonds: { increment: codeDiamonds },
            experience: { increment: codeXP },
            codeSubmissionCount: { increment: 1 },
          },
        });

        // Record diamond transaction
        await prisma.diamondTransaction.create({
          data: {
            userId: authUser.userId,
            amount: codeDiamonds,
            type: "CODE_COMPLETE",
            description: `Code exercise completed: ${activity.title} (${score}%)`,
            relatedType: "lesson",
            relatedId: activity.id,
          },
        });

        // Record code submission (legacy field name codeArenaId reused to hold activity id)
        await prisma.codeSubmission.create({
          data: {
            userId: authUser.userId,
            codeArenaId: activity.id,
            code,
            language: "python",
            isCorrect: isCodeCorrectNow,
            score,
            feedback: isCodeCorrectNow
              ? "Excellent work!"
              : "Good effort, try for 100%!",
          },
        });

        return NextResponse.json({
          success: true,
          message: `🎉 Code exercise completed! +${codeDiamonds} diamonds, +${codeXP} XP`,
          rewards: {
            diamonds: codeDiamonds,
            experience: codeXP,
          },
          score,
          newCompletion: true,
        });
      } catch (e) {
        console.error("Error awarding code completion rewards:", e);
        return NextResponse.json(
          { error: "Failed to award rewards" },
          { status: 500 }
        );
      }
    } else {
      // No reward this time, but return success with zero rewards
      return NextResponse.json({
        success: true,
        message: wasCodeRewarded
          ? `Code exercise completed with ${score}% score! (Rewards already earned)`
          : `Code exercise completed with ${score}% score! Get 90%+ for rewards.`,
        rewards: { diamonds: 0, experience: 0 },
        score,
        newCompletion: false,
      });
    }
  } catch (error) {
    console.error("Error processing lesson code completion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
