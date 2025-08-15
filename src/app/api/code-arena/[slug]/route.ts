import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAndAwardBadges } from "@/lib/badges";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface AuthUser {
  userId: string;
  username: string;
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

// Helpers to migrate from legacy CodeArena to LearningActivity "lesson"
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
  // Try exact match in settings JSON first
  const bySettings = await prisma.learningActivity.findFirst({
    where: {
      activityType: "lesson",
      isActive: true,
      settings: { contains: `"slug":"${slug}"` },
    },
  });
  if (bySettings) return bySettings;

  // Fallback to slugified title match
  const candidates = await prisma.learningActivity.findMany({
    where: { activityType: "lesson", isActive: true },
    select: { id: true, title: true },
  });

  const found = candidates.find((c) => slugify(c.title) === slug);
  if (!found) return null;

  return prisma.learningActivity.findUnique({ where: { id: found.id } });
}

function getDifficultyString(
  numDifficulty: number
): "beginner" | "intermediate" | "advanced" {
  switch (numDifficulty) {
    case 1:
      return "beginner";
    case 2:
      return "intermediate";
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
    const authUser = await getUserFromSession();
    const isLoggedIn = !!authUser;

    const { slug } = await params;

    // Resolve lesson (LearningActivity)
    const activity = await findLessonBySlug(slug);
    if (!activity) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Parse content/settings
    const contentObj = parseJSON<any>(activity.content, {});
    const settings = parseJSON<any>(activity.settings, null);

    const parsedHints = parseJSON<any[]>(settings?.hints, []);
    const parsedTestCases = parseJSON<any[]>(settings?.testCases, []);
    const parsedPrerequisites = parseJSON<any[]>(settings?.prerequisites, []);

    // Load attempt for logged-in user
    const attempt =
      isLoggedIn && authUser
        ? await prisma.activityAttempt.findUnique({
            where: {
              userId_activityId: {
                userId: authUser.userId,
                activityId: activity.id,
              },
            },
          })
        : null;

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
        starterCode: settings?.starterCode || "",
        testCases: parsedTestCases,
        hints: parsedHints,
        difficulty: getExerciseDifficulty(activity.difficulty),
      },

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

      // Status flags
      isCompleted: !!attempt?.completed,
      isStarted: !!attempt?.startedAt,

      // Progress mapping (no lastVisit in ActivityAttempt schema)
      progress: {
        startedAt: attempt?.startedAt?.toISOString() || null,
        completedAt: attempt?.completedAt?.toISOString() || null,
        lastVisit:
          (
            attempt?.completedAt ||
            attempt?.startedAt ||
            null
          )?.toISOString?.() || null,
        timeSpent: attempt?.timeSpent || 0,
        isCodeCorrect: (attempt?.score ?? 0) >= 90,
        lastCode: null,
        bestCode: null,
        score: attempt?.score ?? null,
      },

      hasCodeExercise: !!settings?.hasCodeExercise,
      solutionCode: settings?.solutionCode || "",
      prerequisites: parsedPrerequisites,

      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
    };

    return NextResponse.json({
      success: true,
      codeArena: transformed,
      isLoggedIn,
      loginPrompt: !isLoggedIn
        ? {
            title: "🚀 Track Your Progress!",
            message:
              "Login to save your progress, earn rewards, and unlock achievements!",
            benefits: [
              `💎 Earn ${activity.diamondReward ?? 0} diamonds when you complete this challenge`,
              `⭐ Gain ${activity.experienceReward ?? 0} XP for leveling up`,
              "🏆 Unlock achievement badges",
              "📊 Save and track your code progress",
              "🎯 Build up your coding streak",
            ],
          }
        : undefined,
    });
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Start "lesson" or update progress
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authUser = await getUserFromSession();
    const isLoggedIn = !!authUser;

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

    if (isLoggedIn && authUser) {
      // Logged in user - track via ActivityAttempt
      const attempt = await prisma.activityAttempt.findUnique({
        where: {
          userId_activityId: {
            userId: authUser.userId,
            activityId: activity.id,
          },
        },
      });

      switch (action) {
        case "start": {
          const progress = await prisma.activityAttempt.upsert({
            where: {
              userId_activityId: {
                userId: authUser.userId,
                activityId: activity.id,
              },
            },
            update: {
              startedAt: { set: attempt?.startedAt || new Date() },
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
            isLoggedIn: true,
          });
        }

        case "save_code": {
          if (!attempt) {
            return NextResponse.json(
              { error: "Lesson not started" },
              { status: 400 }
            );
          }

          const increment = Math.max(0, Number(timeSpent || 0));
          const answers = JSON.stringify({
            lastCode: code || "",
            updatedAt: new Date().toISOString(),
          });

          const progress = await prisma.activityAttempt.update({
            where: {
              userId_activityId: {
                userId: authUser.userId,
                activityId: activity.id,
              },
            },
            data: {
              answers,
              timeSpent: { increment },
            },
          });

          return NextResponse.json({
            success: true,
            message: "Code saved",
            progress,
            isLoggedIn: true,
          });
        }

        case "complete": {
          if (!attempt) {
            return NextResponse.json(
              { error: "Lesson not started" },
              { status: 400 }
            );
          }

          const wasAlreadyCompleted = !!attempt.completed;

          const progress = await prisma.activityAttempt.update({
            where: {
              userId_activityId: {
                userId: authUser.userId,
                activityId: activity.id,
              },
            },
            data: {
              completed: true,
              completedAt: new Date(),
              timeSpent: { increment: Math.max(0, Number(timeSpent || 0)) },
            },
          });

          // Award diamonds and experience if first completion
          let newBadges: any[] = [];
          if (!wasAlreadyCompleted) {
            await prisma.user.update({
              where: { id: authUser.userId },
              data: {
                currentDiamonds: { increment: activity.diamondReward ?? 0 },
                totalDiamonds: { increment: activity.diamondReward ?? 0 },
                experience: { increment: activity.experienceReward ?? 0 },
                // legacy field retained for counters
                codeArenasCompleted: { increment: 1 },
              },
            });

            // Create diamond transaction
            await prisma.diamondTransaction.create({
              data: {
                userId: authUser.userId,
                amount: activity.diamondReward ?? 0,
                type: "LESSON_COMPLETE",
                description: `Lesson completed: ${activity.title}`,
                relatedType: "lesson",
                relatedId: activity.id,
              },
            });

            // Try awarding badges
            try {
              newBadges = await checkAndAwardBadges(authUser.userId);
            } catch (error) {
              console.error("Error checking badges:", error);
            }
          }

          // Prepare reward animations
          let rewardAnimations: any[] = [];
          if (!wasAlreadyCompleted) {
            rewardAnimations = [
              {
                type: "experience",
                amount: activity.experienceReward ?? 0,
                icon: "⭐",
                color: "#FFD700",
                delay: 0,
              },
              {
                type: "diamonds",
                amount: activity.diamondReward ?? 0,
                icon: "💎",
                color: "#00D4FF",
                delay: 500,
              },
            ];

            if (newBadges.length > 0) {
              newBadges.forEach((badge: any, index: number) => {
                rewardAnimations.push({
                  type: "badge",
                  amount: 1,
                  icon: badge.icon || "🏆",
                  color: badge.color || "#FFD700",
                  delay: 1000 + index * 300,
                  badgeData: badge,
                });
              });
            }
          }

          return NextResponse.json({
            success: true,
            message: "Lesson completed",
            progress,
            rewards: !wasAlreadyCompleted
              ? {
                  diamonds: activity.diamondReward ?? 0,
                  experience: activity.experienceReward ?? 0,
                }
              : null,
            alreadyCompleted: wasAlreadyCompleted,
            newBadges: newBadges.length > 0 ? newBadges : undefined,
            animations: rewardAnimations,
            isLoggedIn: true,
          });
        }

        default:
          return NextResponse.json(
            { error: "Invalid action" },
            { status: 400 }
          );
      }
    } else {
      // Anonymous user - incentive messages
      switch (action) {
        case "start":
          return NextResponse.json({
            success: true,
            message:
              "🎯 Lesson started! Login to save your progress and earn rewards.",
            isLoggedIn: false,
            loginPrompt: {
              title: "🚀 Save Your Progress!",
              message:
                "Login now to track your coding journey and earn rewards!",
              benefits: [
                `💎 Earn ${activity.diamondReward ?? 0} diamonds when you complete this`,
                `⭐ Gain ${activity.experienceReward ?? 0} XP for leveling up`,
                "🏆 Unlock achievement badges",
                "📊 Save your code and track progress over time",
                "🔥 Build up your coding streak",
              ],
            },
          });

        case "save_code":
          return NextResponse.json({
            success: true,
            message: "🔓 Login to save your code progress permanently!",
            isLoggedIn: false,
            loginPrompt: {
              title: "💾 Your Code Won't Be Saved!",
              message:
                "Login to save your progress and continue where you left off.",
              benefits: [
                "💾 Save your code automatically",
                "📈 Track your coding improvement",
                "🎯 Resume challenges anytime",
                "🏆 Earn rewards for completed lessons",
              ],
            },
          });

        case "complete":
          return NextResponse.json({
            success: true,
            message: `🎉 Lesson completed! 🔓 Login to earn ${activity.diamondReward ?? 0} diamonds and ${activity.experienceReward ?? 0} XP!`,
            isLoggedIn: false,
            potentialRewards: {
              diamonds: activity.diamondReward ?? 0,
              experience: activity.experienceReward ?? 0,
              message: "🔓 Login now to claim these rewards!",
            },
            loginPrompt: {
              title: "🏆 Claim Your Rewards!",
              message:
                "You've completed the lesson! Login to get your rewards and achievements.",
              benefits: [
                `💎 Claim ${activity.diamondReward ?? 0} diamonds`,
                `⭐ Gain ${activity.experienceReward ?? 0} experience points`,
                "🏆 Unlock achievement badges",
                "📊 Add this completion to your profile",
                "🎯 Continue your coding journey",
              ],
            },
          });

        default:
          return NextResponse.json(
            { error: "Invalid action" },
            { status: 400 }
          );
      }
    }
  } catch (error) {
    console.error("Error updating lesson progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
