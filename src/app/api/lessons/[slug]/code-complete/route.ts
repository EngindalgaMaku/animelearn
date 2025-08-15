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
    const { code, score, rewards } = body as {
      code: string;
      score: number;
      rewards: { diamonds: number; experience: number };
    };

    // Validate required fields
    if (!code || typeof score !== "number" || !rewards) {
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

    // Decide reward policy: only if previously not "correct" and now score >= 90
    const previousScore = existingAttempt?.score ?? 0;
    const wasCodeCorrect = previousScore >= 90;
    const isCodeCorrectNow = score >= 90;
    const shouldAwardRewards = !wasCodeCorrect && isCodeCorrectNow;

    // Always upsert attempt with code + best score
    const answers = JSON.stringify({
      lastCode: code,
      updatedAt: new Date().toISOString(),
    });

    await prisma.activityAttempt.upsert({
      where: {
        userId_activityId: {
          userId: authUser.userId,
          activityId: activity.id,
        },
      },
      update: {
        // Keep max score
        score: Math.max(score, previousScore),
        answers,
      },
      create: {
        userId: authUser.userId,
        activityId: activity.id,
        score,
        answers,
        startedAt: new Date(),
      },
    });

    if (shouldAwardRewards) {
      try {
        // Update user balances
        await prisma.user.update({
          where: { id: authUser.userId },
          data: {
            currentDiamonds: { increment: rewards.diamonds },
            totalDiamonds: { increment: rewards.diamonds },
            experience: { increment: rewards.experience },
            codeSubmissionCount: { increment: 1 },
          },
        });

        // Record diamond transaction
        await prisma.diamondTransaction.create({
          data: {
            userId: authUser.userId,
            amount: rewards.diamonds,
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
          message: `🎉 Code exercise completed! +${rewards.diamonds} diamonds, +${rewards.experience} XP`,
          rewards: {
            diamonds: rewards.diamonds,
            experience: rewards.experience,
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
        message: wasCodeCorrect
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
