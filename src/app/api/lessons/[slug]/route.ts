import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAndAwardBadges } from "@/lib/badges";
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

function parseJSON<T>(val: unknown, fallback: T): T {
  try {
    if (!val) return fallback;
    if (typeof val === "string") return JSON.parse(val) as T;
    return val as T;
  } catch {
    return fallback;
  }
}

async function findLessonBySlug(slug: string) {
  // First try matching settings.slug exactly
  const bySettings = await prisma.learningActivity.findFirst({
    where: {
      activityType: "lesson",
      isActive: true,
      settings: { contains: `"slug":"${slug}"` },
    },
  });
  if (bySettings) return bySettings;

  // Fallback: scan active lessons and match slugified title
  const candidates = await prisma.learningActivity.findMany({
    where: { activityType: "lesson", isActive: true },
    select: {
      id: true,
      title: true,
    },
  });

  const found = candidates.find((c) => slugify(c.title) === slug);
  if (!found) return null;

  return prisma.learningActivity.findUnique({
    where: { id: found.id },
  });
}

function getDifficultyString(
  numDifficulty: number
): "beginner" | "intermediate" | "advanced" {
  switch (numDifficulty) {
    case 1:
      return "beginner";
    case 2:
      return "intermediate";
    case 3:
    default:
      return "advanced";
  }
}

function getExerciseDifficulty(
  numDifficulty: number
): "easy" | "medium" | "hard" {
  switch (numDifficulty) {
    case 1:
      return "easy";
    case 2:
      return "medium";
    default:
      return "hard";
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authUser = getUserFromToken(req);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;

    // Find lesson (LearningActivity)
    const activity = await findLessonBySlug(slug);
    if (!activity) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Parse content/settings and related fields
    const contentObj = parseJSON<any>(activity.content, {});
    const settings = parseJSON<any>(activity.settings, null);
    const starterCode = settings?.starterCode || "";
    const hints = Array.isArray(settings?.hints)
      ? settings.hints
      : parseJSON<any[]>(settings?.hints, []);
    const testCases = Array.isArray(settings?.testCases)
      ? settings.testCases
      : parseJSON<any[]>(settings?.testCases, []);
    const prerequisites = Array.isArray(settings?.prerequisites)
      ? settings.prerequisites
      : parseJSON<any[]>(settings?.prerequisites, []);

    // Load user's attempt
    const attempt =
      (await prisma.activityAttempt.findUnique({
        where: {
          userId_activityId: {
            userId: authUser.userId,
            activityId: activity.id,
          },
        },
      })) || null;

    // Build transformed object compatible with existing UI
    const difficultyLabel = getDifficultyString(activity.difficulty);
    const transformed = {
      id: activity.id,
      title: activity.title,
      slug:
        (typeof settings?.slug === "string" && settings.slug) ||
        slugify(activity.title),
      description: activity.description || "",
      category: activity.category || "general",
      difficulty: difficultyLabel,
      order: activity.sortOrder ?? 1,
      estimatedTime: activity.estimatedMinutes ?? 30,
      diamondReward: activity.diamondReward ?? 0,
      experienceReward: activity.experienceReward ?? 0,

      content: {
        introduction:
          contentObj?.introduction ||
          (contentObj?.sections
            ? Object.values(contentObj.sections)
                .map(
                  (section: any) =>
                    `<h3>${section.title}</h3><div>${String(
                      section.content || ""
                    )
                      .replace(/\n/g, "<br>")
                      .toString()}</div>`
                )
                .join("<br><br>")
            : ""),
        syntax:
          contentObj?.syntax ||
          (contentObj?.sections
            ? Object.values(contentObj.sections)
                .filter((section: any) =>
                  String(section.title || "")
                    .toLowerCase()
                    .match(/syntax|concept|defining/)
                )
                .map(
                  (section: any) =>
                    `<h3>${section.title}</h3><div>${String(
                      section.content || ""
                    )
                      .replace(/\n/g, "<br>")
                      .toString()}</div>`
                )
                .join("<br><br>")
            : ""),
        examples:
          contentObj?.examples ||
          (contentObj?.sections
            ? Object.values(contentObj.sections)
                .filter((section: any) =>
                  String(section.title || "")
                    .toLowerCase()
                    .match(/example|practice|games|arena|interactive/)
                )
                .map(
                  (section: any) =>
                    `<h3>${section.title}</h3><div>${String(
                      section.content || ""
                    )
                      .replace(/\n/g, "<br>")
                      .toString()}</div>`
                )
                .join("<br><br>")
            : ""),
      },

      exercise: {
        id: `${activity.id}-exercise`,
        title: `${activity.title} - Exercise`,
        description: "Practice what you learned",
        starterCode,
        testCases,
        hints,
        difficulty: getExerciseDifficulty(activity.difficulty),
      },

      // Use embedded quiz if present in content; otherwise null-like stub
      quiz: contentObj?.quiz
        ? contentObj.quiz
        : {
            id: `${activity.id}-quiz`,
            title: `${activity.title} - Quiz`,
            description: "Test your knowledge",
            questions: [],
            timeLimit: 10,
            passingScore: 70,
            diamondReward: 0,
            experienceReward: 0,
          },

      isCompleted: !!attempt?.completed,
      isStarted: !!attempt?.startedAt,

      progress: {
        startedAt: attempt?.startedAt?.toISOString() || null,
        completedAt: attempt?.completedAt?.toISOString() || null,
        lastVisit: (
          attempt?.completedAt ||
          attempt?.startedAt ||
          new Date()
        ).toISOString(),
        timeSpent: attempt?.timeSpent || 0,
        isCodeCorrect: (attempt?.score ?? 0) >= 90,
        // We store last code inside answers JSON (if used by other endpoints)
        lastCode: null,
        bestCode: null,
        score: attempt?.score ?? null,
      },

      hasCodeExercise: !!settings?.hasCodeExercise,
      solutionCode: settings?.solutionCode || "",
      prerequisites,

      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
    };

    return NextResponse.json({ success: true, lesson: transformed });
  } catch (error) {
    console.error("Error fetching lesson by slug:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Start/save/complete lesson progress
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
    const { action, code, timeSpent } = body as {
      action: "start" | "save_code" | "complete";
      code?: string;
      timeSpent?: number;
    };

    // Resolve activity by slug
    const activity = await findLessonBySlug(slug);
    if (!activity) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    if (action === "start") {
      // Upsert attempt
      const progress = await prisma.activityAttempt.upsert({
        where: {
          userId_activityId: {
            userId: authUser.userId,
            activityId: activity.id,
          },
        },
        update: {
          startedAt: { set: new Date() },
        },
        create: {
          userId: authUser.userId,
          activityId: activity.id,
          startedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Lesson started",
        progress,
      });
    }

    if (action === "save_code") {
      // Store user's latest code inside answers JSON; bump time
      const increment = Math.max(0, Number(timeSpent || 0));
      const answers = JSON.stringify({
        lastCode: code || "",
        updatedAt: new Date().toISOString(),
      });

      const progress = await prisma.activityAttempt.upsert({
        where: {
          userId_activityId: {
            userId: authUser.userId,
            activityId: activity.id,
          },
        },
        update: {
          answers,
          timeSpent: { increment },
        },
        create: {
          userId: authUser.userId,
          activityId: activity.id,
          answers,
          timeSpent: increment,
          startedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Code saved",
        progress,
      });
    }

    if (action === "complete") {
      // Load current attempt
      const existing = await prisma.activityAttempt.findUnique({
        where: {
          userId_activityId: {
            userId: authUser.userId,
            activityId: activity.id,
          },
        },
      });

      const alreadyCompleted = !!existing?.completed;

      // Parse existing answers/flags
      let answersObj: any = {};
      try {
        if (existing?.answers) answersObj = JSON.parse(existing.answers as any);
      } catch {
        answersObj = {};
      }
      const flags = answersObj?.flags || {};
      const prevScore = existing?.score ?? 0;
      const quizPassed = !!flags.quizPassed;
      const codeRewarded = !!flags.codeRewarded;
      const quizRewarded = !!flags.quizRewarded;

      // Compute reward partition (60% code, 40% quiz)
      const baseDiamonds = activity.diamondReward ?? 0;
      const baseXP = activity.experienceReward ?? 0;
      const codeDiamonds = Math.floor(baseDiamonds * 0.6);
      const quizDiamonds = baseDiamonds - codeDiamonds;
      const codeXP = Math.floor(baseXP * 0.6);
      const quizXP = baseXP - codeXP;

      // Determine catch-up awards (only if not rewarded yet)
      const awardCode = !codeRewarded && prevScore >= 90;
      const awardQuiz = !quizRewarded && quizPassed;

      const awardDiamonds =
        (awardCode ? codeDiamonds : 0) + (awardQuiz ? quizDiamonds : 0);
      const awardExperience =
        (awardCode ? codeXP : 0) + (awardQuiz ? quizXP : 0);

      // Update flags to reflect any catch-up being awarded
      const updatedFlags = {
        ...flags,
        codeRewarded: flags.codeRewarded || awardCode,
        quizRewarded: flags.quizRewarded || awardQuiz,
      };

      const updatedAnswers = {
        ...answersObj,
        flags: updatedFlags,
        completedAt: new Date().toISOString(),
      };

      // Perform atomic updates
      const txResult = await prisma.$transaction(async (tx) => {
        // Upsert attempt completion and flags
        const updatedAttempt = await tx.activityAttempt.upsert({
          where: {
            userId_activityId: {
              userId: authUser.userId,
              activityId: activity.id,
            },
          },
          update: {
            completed: true,
            completedAt: new Date(),
            timeSpent: { increment: Math.max(0, Number(timeSpent || 0)) },
            answers: JSON.stringify(updatedAnswers),
          },
          create: {
            userId: authUser.userId,
            activityId: activity.id,
            completed: true,
            completedAt: new Date(),
            startedAt: new Date(),
            timeSpent: Math.max(0, Number(timeSpent || 0)),
            answers: JSON.stringify(updatedAnswers),
          },
        });

        // Increment legacy completion counter only once
        if (!alreadyCompleted) {
          await tx.user.update({
            where: { id: authUser.userId },
            data: { codeArenasCompleted: { increment: 1 } },
          });
        }

        // Apply catch-up rewards if any
        if (awardDiamonds > 0 || awardExperience > 0) {
          await tx.user.update({
            where: { id: authUser.userId },
            data: {
              currentDiamonds: { increment: awardDiamonds },
              totalDiamonds: { increment: awardDiamonds },
              experience: { increment: awardExperience },
            },
          });

          // Record transactions per share for clarity
          if (awardCode) {
            await tx.diamondTransaction.create({
              data: {
                userId: authUser.userId,
                amount: codeDiamonds,
                type: "ACTIVITY_COMPLETION",
                description: `Lesson completion catch-up (code share): ${activity.title}`,
                relatedType: "lesson",
                relatedId: activity.id,
              },
            });
          }
          if (awardQuiz) {
            await tx.diamondTransaction.create({
              data: {
                userId: authUser.userId,
                amount: quizDiamonds,
                type: "ACTIVITY_COMPLETION",
                description: `Lesson completion catch-up (quiz share): ${activity.title}`,
                relatedType: "lesson",
                relatedId: activity.id,
              },
            });
          }
        }

        return { updatedAttempt };
      });

      // Badge awarding after transactional updates
      let newBadges: any[] = [];
      try {
        newBadges = await checkAndAwardBadges(authUser.userId);
      } catch (e) {
        console.error("Badge check error:", e);
      }

      return NextResponse.json({
        success: true,
        message: "Lesson completed",
        progress: txResult.updatedAttempt,
        rewards:
          awardDiamonds > 0 || awardExperience > 0
            ? {
                diamonds: awardDiamonds,
                experience: awardExperience,
              }
            : null,
        alreadyCompleted,
        newBadges: newBadges.length ? newBadges : undefined,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating lesson progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
