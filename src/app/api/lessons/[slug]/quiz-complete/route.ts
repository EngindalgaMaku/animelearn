import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface AuthUser {
  userId: string;
  username: string;
}

async function getUserFromSession(): Promise<AuthUser | null> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;
    return {
      userId: session.user.id,
      username:
        (session.user as any).username || session.user.email || "Unknown",
    };
  } catch (error) {
    console.error("Error getting session:", error);
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

function looseNormalize(s: string): string {
  // ignore minor connective words that often vary in slugs
  const stop = new Set(["your", "and", "the", "a", "an"]);
  return s
    .toLowerCase()
    .split(/-+/)
    .filter((t) => t && !stop.has(t))
    .join("-");
}

async function findLessonBySlug(slug: string) {
  // settings.slug exact (active lessons)
  const bySettings = await prisma.learningActivity.findFirst({
    where: {
      activityType: "lesson",
      isActive: true,
      settings: { contains: `"slug":"${slug}"` },
    },
  });
  if (bySettings) return bySettings;

  // DB slug direct
  const byDbSlug = await prisma.learningActivity.findFirst({
    where: { activityType: "lesson", isActive: true, slug },
  });
  if (byDbSlug) return byDbSlug;

  // title based strict/loose
  const candidates = await prisma.learningActivity.findMany({
    where: { activityType: "lesson", isActive: true },
    select: { id: true, title: true },
  });

  let found = candidates.find((c) => slugify(c.title) === slug);
  if (found)
    return prisma.learningActivity.findUnique({ where: { id: found.id } });

  const loose = looseNormalize(slug);
  found = candidates.find((c) => looseNormalize(slugify(c.title)) === loose);
  if (found)
    return prisma.learningActivity.findUnique({ where: { id: found.id } });

  return null;
}

/**
 * POST /api/lessons/[slug]/quiz-complete
 * Body: { score: number, passingScore?: number }
 *
 * Notes:
 * - Updates attempt "answers" JSON with quiz results.
 * - Does NOT award diamonds/XP; rewards are granted by POST /api/lessons/[slug] with action:"complete".
 * - Does NOT modify attempt.score so code exercise correctness stays intact.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const rawScore = body?.score;
    const rawPassing = body?.passingScore;

    if (
      typeof rawScore !== "number" ||
      isNaN(rawScore) ||
      rawScore < 0 ||
      rawScore > 100
    ) {
      return NextResponse.json(
        { error: "Score must be a number between 0 and 100" },
        { status: 400 }
      );
    }
    const score = Math.round(rawScore);
    const passingScore =
      typeof rawPassing === "number" && !isNaN(rawPassing)
        ? Math.round(rawPassing)
        : 50;
    const passed = score >= passingScore;

    // Resolve lesson
    const activity = await findLessonBySlug(slug);
    if (!activity) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Session
    const authUser = await getUserFromSession();
    if (!authUser) {
      // Anonymous: accept and suggest login (no persistence)
      return NextResponse.json({
        success: true,
        passed,
        rewards: { diamonds: 0, experience: 0 },
        isLoggedIn: false,
        message: passed
          ? `🎉 Quiz passed with ${score}%! 🔓 Login to save your progress and claim rewards when you complete the lesson.`
          : `Quiz completed with ${score}%. You need ${passingScore}%+ to pass. 🔓 Login to save progress.`,
        loginPrompt: {
          title: "🚀 Save Progress & Claim Rewards",
          message:
            "Login to track your quiz results and unlock diamonds/XP when you finish lessons.",
          benefits: [
            "💾 Save your quiz attempts",
            "💎 Earn diamonds & ⭐ XP on completion",
            "🏆 Unlock badges",
          ],
        },
      });
    }

    // Ensure attempt exists, but do not mark completed
    const existing = await prisma.activityAttempt.findUnique({
      where: {
        userId_activityId: {
          userId: authUser.userId,
          activityId: activity.id,
        },
      },
    });

    // Merge/update quiz info inside answers JSON
    const prevAnswers = (() => {
      try {
        if (!existing?.answers) return {};
        if (typeof existing.answers === "string")
          return JSON.parse(existing.answers);
        return existing.answers as any;
      } catch {
        return {};
      }
    })();

    const answersPayload = JSON.stringify({
      ...prevAnswers,
      quiz: {
        score,
        passingScore,
        passed,
        updatedAt: new Date().toISOString(),
      },
    });

    if (existing) {
      await prisma.activityAttempt.update({
        where: {
          userId_activityId: {
            userId: authUser.userId,
            activityId: activity.id,
          },
        },
        data: {
          answers: answersPayload,
          // Do not change .score here (reserved for code exercise correctness)
          // Do not set completed here; completion awards happen in action:"complete"
        },
      });
    } else {
      await prisma.activityAttempt.create({
        data: {
          userId: authUser.userId,
          activityId: activity.id,
          startedAt: new Date(),
          answers: answersPayload,
          // score remains default 0
          // completed remains false
        },
      });
    }

    return NextResponse.json({
      success: true,
      passed,
      rewards: { diamonds: 0, experience: 0 },
      message: passed
        ? `🎉 Quiz passed with ${score}%! Complete the lesson to claim rewards.`
        : `Quiz completed with ${score}%. You need ${passingScore}%+ to pass.`,
      isLoggedIn: true,
    });
  } catch (error) {
    console.error("Lessons quiz-complete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
