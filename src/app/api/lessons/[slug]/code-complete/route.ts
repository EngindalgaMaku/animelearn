import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface AuthUser {
  userId: string;
  username: string;
}

// Session helper
async function getUserFromSession(): Promise<AuthUser | null> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;
    return {
      userId: session.user.id,
      username:
        (session.user as any).username || session.user.email || "Unknown",
    };
  } catch (e) {
    console.error("session error:", e);
    return null;
  }
}

// Slug helpers (be tolerant of small wording differences)
function slugify(title: string): string {
  return (title || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function looseNormalize(s: string): string {
  // remove common stopwords that often vary in slugs (e.g., "your")
  const stop = new Set(["your", "and"]);
  return s
    .toLowerCase()
    .split(/-+/)
    .filter((t) => t && !stop.has(t))
    .join("-");
}

async function findLessonBySlug(slug: string) {
  // Try exact settings slug first (active lessons only)
  const bySettings = await prisma.learningActivity.findFirst({
    where: {
      activityType: "lesson",
      isActive: true,
      settings: { contains: `"slug":"${slug}"` },
    },
  });
  if (bySettings) return bySettings;

  // Load active lesson candidates
  const candidates = await prisma.learningActivity.findMany({
    where: { activityType: "lesson", isActive: true },
    select: { id: true, title: true, slug: true },
  });

  // 1) Direct DB slug match if present
  const direct = candidates.find((c) => (c.slug || "").toLowerCase() === slug);
  if (direct)
    return prisma.learningActivity.findUnique({ where: { id: direct.id } });

  // 2) Match on strict slugify of title
  const byStrict = candidates.find((c) => slugify(c.title) === slug);
  if (byStrict)
    return prisma.learningActivity.findUnique({ where: { id: byStrict.id } });

  // 3) Loose match ignoring minor words like "your", "and"
  const looseSlug = looseNormalize(slug);
  const byLoose = candidates.find(
    (c) => looseNormalize(slugify(c.title)) === looseSlug
  );
  if (byLoose)
    return prisma.learningActivity.findUnique({ where: { id: byLoose.id } });

  return null;
}

/**
 * POST /api/lessons/[slug]/code-complete
 * Body: { code: string, score: number }
 *
 * Notes:
 * - This endpoint updates attempt score/code for the lesson.
 * - It does NOT award diamonds/xp here to avoid double-reward with the final "complete" action.
 * - Rewards are granted by POST /api/lessons/[slug] with action:"complete".
 * - We still ensure idempotent score updates and return a helpful message.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const code = typeof body?.code === "string" ? (body.code as string) : "";
    const rawScore = body?.score;

    // Validate score (allow 0..100)
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

    // Resolve lesson record
    const activity = await findLessonBySlug(slug);
    if (!activity) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const authUser = await getUserFromSession();
    const isLoggedIn = !!authUser;

    // Anonymous users: accept and encourage login (no persistence)
    if (!isLoggedIn || !authUser) {
      return NextResponse.json({
        success: true,
        message:
          score >= 90
            ? `🎉 Excellent work! You scored ${score}%! 🔓 Login to save progress and claim rewards when you complete the lesson.`
            : `Great job! You scored ${score}%! 🔓 Login to save progress and claim rewards on completion.`,
        score,
        rewards: { diamonds: 0, experience: 0 },
        newCompletion: false,
        isLoggedIn: false,
        loginPrompt: {
          title: "🚀 Unlock Rewards!",
          message:
            "Login to track your coding journey and claim diamonds/XP when you finish lessons.",
          benefits: [
            "💾 Save your code and progress",
            "💎 Earn diamonds and ⭐ XP on completion",
            "🏆 Unlock achievement badges",
          ],
        },
      });
    }

    // Logged-in path: upsert/update attempt data without marking completed
    const existingAttempt = await prisma.activityAttempt.findUnique({
      where: {
        userId_activityId: {
          userId: authUser.userId,
          activityId: activity.id,
        },
      },
    });

    const wasCodeCorrect = (existingAttempt?.score ?? 0) >= 90;
    const newBest = Math.max(score, existingAttempt?.score ?? 0);
    const nowCodeCorrect = newBest >= 90;
    const newCompletion = nowCodeCorrect && !wasCodeCorrect;

    const answersPayload = JSON.stringify({
      ...(existingAttempt?.answers
        ? (() => {
            try {
              return JSON.parse(existingAttempt.answers);
            } catch {
              return {};
            }
          })()
        : {}),
      lastCode: code || "",
      updatedAt: new Date().toISOString(),
    });

    if (existingAttempt) {
      await prisma.activityAttempt.update({
        where: {
          userId_activityId: {
            userId: authUser.userId,
            activityId: activity.id,
          },
        },
        data: {
          score: newBest,
          // Do NOT set completed here; final reward flow happens in action:"complete"
          answers: answersPayload,
        },
      });
    } else {
      await prisma.activityAttempt.create({
        data: {
          userId: authUser.userId,
          activityId: activity.id,
          score,
          startedAt: new Date(),
          answers: answersPayload,
          // completed: false (default)
        },
      });
    }

    const message =
      score >= 90
        ? `Code exercise completed with ${score}% score! Rewards will be granted when you complete the lesson.`
        : `Code exercise completed with ${score}% score! Get 90%+ and complete the lesson to claim rewards.`;

    return NextResponse.json({
      success: true,
      message,
      rewards: { diamonds: 0, experience: 0 },
      score,
      newCompletion,
      isLoggedIn: true,
    });
  } catch (error) {
    console.error("Lessons code-complete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
