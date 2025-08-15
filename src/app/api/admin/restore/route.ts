import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import {
  RestoreError,
  restoreOptionsSchema,
  backupIdSchema,
  validateBackupFile,
  validateRestoreConstraints,
  logBackupOperation,
  formatBackupError,
  backupRateLimiter,
} from "@/lib/backup-utils";

// Restore schema with enhanced validation
const restoreSchema = z.object({
  backupId: backupIdSchema,
  options: restoreOptionsSchema.optional(),
});

// Get user from NextAuth session
async function getUserFromSession() {
  try {
    const session = await getServerSession(authOptions);
    return session?.user || null;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

// Helper function to check admin permissions
async function checkAdminPermissions(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== "admin") {
    throw new Error("Admin permissions required");
  }
}

// Helper function to get backup file path
function getBackupPath(backupId: string) {
  return path.join(process.cwd(), "backups", `${backupId}.json`);
}

// Helper function to truncate all tables (except sensitive ones)
async function truncateDatabase(options: any) {
  const skipTables = ["users", "accounts", "sessions"];

  if (!options.skipUsers) {
    skipTables.splice(skipTables.indexOf("users"), 1);
  }
  if (!options.skipSessions) {
    skipTables.splice(skipTables.indexOf("sessions"), 1);
    skipTables.splice(skipTables.indexOf("accounts"), 1);
  }

  try {
    // Delete in proper order to respect foreign key constraints
    await db.$transaction(async (tx) => {
      // First, delete dependent records
      if (!skipTables.includes("accounts")) await tx.account.deleteMany();
      if (!skipTables.includes("sessions")) await tx.session.deleteMany();

      await tx.userCard.deleteMany();
      await tx.userBadge.deleteMany();
      await tx.userStreak.deleteMany();
      await tx.userDailyLogin.deleteMany();
      await tx.userRarityStats.deleteMany();
      await tx.userChallengeProgress.deleteMany();
      await tx.userPythonTipInteraction.deleteMany();
      await tx.pythonTipStreak.deleteMany();
      await tx.loginHistory.deleteMany();
      await tx.loginStreak.deleteMany();
      await tx.blogPostInteraction.deleteMany();
      await tx.activityAttempt.deleteMany();
      // legacy: codeArenaProgress table removed
      await tx.codeSubmission.deleteMany();
      await tx.quizAttempt.deleteMany();
      await tx.dailyQuest.deleteMany();
      await tx.dailyMiniQuizAttempt.deleteMany();
      await tx.cardPackOpening.deleteMany();
      await tx.xPEventParticipation.deleteMany();
      await tx.cardDistributionLog.deleteMany();
      await tx.diamondTransaction.deleteMany();
      await tx.diamondPurchase.deleteMany();
      await tx.pythonTipFeedback.deleteMany();

      // Then delete main entity records
      await tx.analytics.deleteMany();
      await tx.usedCardNames.deleteMany();
      await tx.card.deleteMany();
      await tx.collection.deleteMany();
      await tx.animeSeries.deleteMany();
      await tx.character.deleteMany();
      // legacy: codeArena model removed
      await tx.quiz.deleteMany();
      await tx.badge.deleteMany();
      await tx.dailyMiniQuiz.deleteMany();
      await tx.cardPack.deleteMany();
      await tx.xPMultiplierEvent.deleteMany();
      await tx.weeklyChallenge.deleteMany();
      await tx.learningActivity.deleteMany();
      await tx.quizQuestion.deleteMany();
      await tx.quizCategory.deleteMany();
      await tx.pythonTip.deleteMany();
      await tx.pythonTipCategory.deleteMany();
      await tx.dailyPythonTip.deleteMany();
      await tx.blogPost.deleteMany();
      await tx.cardDistributionRule.deleteMany();

      // Delete configuration records
      await tx.category.deleteMany();
      await tx.rarity.deleteMany();
      await tx.element.deleteMany();
      await tx.cardStyle.deleteMany();
      await tx.cardAnalysisSettings.deleteMany();
      await tx.analysisLog.deleteMany();
      await tx.diamondPackage.deleteMany();
      await tx.cardRarity.deleteMany();
      await tx.dailyLoginBonus.deleteMany();
      await tx.arenaDifficultyConfig.deleteMany();
      await tx.arenaCategoryConfig.deleteMany();
      await tx.arenaActivityTypeConfig.deleteMany();
      await tx.arenaUIConfig.deleteMany();
      await tx.arenaConfiguration.deleteMany();

      // Settings and AI models
      await tx.settings.deleteMany();
      await tx.aIModel.deleteMany();

      // Finally, users if not skipped
      if (!skipTables.includes("users")) {
        await tx.user.deleteMany();
      }
    });
  } catch (error) {
    console.error("Error truncating database:", error);
    throw new Error("Failed to clear existing data");
  }
}

// Helper function to restore data
async function restoreData(backupData: any, options: any) {
  const skipTables: string[] = [];
  if (options.skipUsers) skipTables.push("users", "accounts", "sessions");
  if (options.skipSessions) skipTables.push("accounts", "sessions");
  if (options.skipSensitiveData)
    skipTables.push("accounts", "sessions", "diamondPurchases");

  try {
    await db.$transaction(async (tx) => {
      // Restore in proper order to respect foreign key constraints

      // 1. Settings and configurations first
      if (backupData.settings && !skipTables.includes("settings")) {
        for (const setting of backupData.settings) {
          await tx.settings.create({ data: setting });
        }
      }

      if (backupData.aiModels && !skipTables.includes("aiModels")) {
        for (const model of backupData.aiModels) {
          await tx.aIModel.create({ data: model });
        }
      }

      // 2. Users (if not skipped)
      if (backupData.users && !skipTables.includes("users")) {
        for (const user of backupData.users) {
          await tx.user.create({ data: user });
        }
      }

      // 3. Categories, Rarities, Elements
      if (backupData.categories) {
        for (const category of backupData.categories) {
          await tx.category.create({ data: category });
        }
      }

      if (backupData.rarities) {
        for (const rarity of backupData.rarities) {
          await tx.rarity.create({ data: rarity });
        }
      }

      if (backupData.elements) {
        for (const element of backupData.elements) {
          await tx.element.create({ data: element });
        }
      }

      if (backupData.cardStyles) {
        for (const style of backupData.cardStyles) {
          await tx.cardStyle.create({ data: style });
        }
      }

      // 4. Collections
      if (backupData.collections) {
        for (const collection of backupData.collections) {
          await tx.collection.create({ data: collection });
        }
      }

      // 5. Anime series and characters
      if (backupData.animeSeries) {
        for (const series of backupData.animeSeries) {
          await tx.animeSeries.create({ data: series });
        }
      }

      if (backupData.characters) {
        for (const character of backupData.characters) {
          await tx.character.create({ data: character });
        }
      }

      // 6. Cards
      if (backupData.cards) {
        for (const card of backupData.cards) {
          await tx.card.create({ data: card });
        }
      }

      // 7. Code Arenas (legacy) -> migrate to LearningActivity "lesson"
      if (backupData.codeArenas) {
        for (const arena of backupData.codeArenas) {
          // Build settings JSON from legacy fields
          const examplesArr = (() => {
            try {
              if (!arena.examples) return [];
              if (Array.isArray(arena.examples)) return arena.examples;
              if (typeof arena.examples === "string")
                return JSON.parse(arena.examples);
              return [];
            } catch {
              return [];
            }
          })();
          const sectionsArr = (() => {
            try {
              if (!arena.sections) return [];
              if (Array.isArray(arena.sections)) return arena.sections;
              if (typeof arena.sections === "string")
                return JSON.parse(arena.sections);
              return [];
            } catch {
              return [];
            }
          })();
          const learningObjectivesArr = (() => {
            try {
              if (!arena.learningObjectives) return [];
              if (Array.isArray(arena.learningObjectives))
                return arena.learningObjectives;
              if (typeof arena.learningObjectives === "string")
                return JSON.parse(arena.learningObjectives);
              return [];
            } catch {
              return [];
            }
          })();
          const resourcesArr = (() => {
            try {
              if (!arena.resources) return [];
              if (Array.isArray(arena.resources)) return arena.resources;
              if (typeof arena.resources === "string")
                return JSON.parse(arena.resources);
              return [];
            } catch {
              return [];
            }
          })();
          const tagsJson = (() => {
            try {
              if (!arena.tags) return "[]";
              if (typeof arena.tags === "string") return arena.tags;
              if (Array.isArray(arena.tags)) return JSON.stringify(arena.tags);
              return "[]";
            } catch {
              return "[]";
            }
          })();

          const settings = {
            slug: arena.slug ?? undefined,
            hasCodeExercise: !!arena.hasCodeExercise,
            starterCode: arena.starterCode ?? "",
            solutionCode: arena.solutionCode ?? "",
            testCases: arena.testCases ?? "",
            hints: arena.hints ?? "",
            prerequisites: arena.prerequisites ?? "",
            examples: examplesArr,
            sections: sectionsArr,
            learningObjectives: learningObjectivesArr,
            resources: resourcesArr,
          };

          await tx.learningActivity.create({
            data: {
              id: arena.id, // preserve id if present
              title: arena.title || "Untitled",
              description: arena.description || "",
              activityType: "lesson",
              category: arena.category || "general",
              difficulty: Number(arena.difficulty) || 1,
              diamondReward: Number(arena.diamondReward) || 10,
              experienceReward: Number(arena.experienceReward) || 25,
              content:
                typeof arena.content === "string"
                  ? arena.content
                  : JSON.stringify(arena.content ?? ""),
              settings: JSON.stringify(settings),
              isActive: !!arena.isPublished,
              estimatedMinutes: Number(arena.duration) || 30,
              tags: tagsJson,
              sortOrder: Number(arena.order) || 1,
              createdAt: arena.createdAt
                ? new Date(arena.createdAt)
                : undefined,
              updatedAt: arena.updatedAt
                ? new Date(arena.updatedAt)
                : undefined,
            },
          });
        }
      }

      // 8. Quizzes
      if (backupData.quizzes) {
        for (const quiz of backupData.quizzes) {
          await tx.quiz.create({ data: quiz });
        }
      }

      if (backupData.quizQuestions) {
        for (const question of backupData.quizQuestions) {
          await tx.quizQuestion.create({ data: question });
        }
      }

      if (backupData.quizCategories) {
        for (const category of backupData.quizCategories) {
          await tx.quizCategory.create({ data: category });
        }
      }

      // 9. Badges
      if (backupData.badges) {
        for (const badge of backupData.badges) {
          await tx.badge.create({ data: badge });
        }
      }

      // 10. Learning Activities
      if (backupData.learningActivities) {
        for (const activity of backupData.learningActivities) {
          await tx.learningActivity.create({ data: activity });
        }
      }

      // 11. Card Packs and Diamond Packages
      if (backupData.cardPacks) {
        for (const pack of backupData.cardPacks) {
          await tx.cardPack.create({ data: pack });
        }
      }

      if (backupData.diamondPackages) {
        for (const pkg of backupData.diamondPackages) {
          await tx.diamondPackage.create({ data: pkg });
        }
      }

      // 12. Weekly Challenges
      if (backupData.weeklyChallenges) {
        for (const challenge of backupData.weeklyChallenges) {
          await tx.weeklyChallenge.create({ data: challenge });
        }
      }

      // 13. Python Tips
      if (backupData.pythonTipCategories) {
        for (const category of backupData.pythonTipCategories) {
          await tx.pythonTipCategory.create({ data: category });
        }
      }

      if (backupData.pythonTips) {
        for (const tip of backupData.pythonTips) {
          await tx.pythonTip.create({ data: tip });
        }
      }

      // 14. Blog Posts
      if (backupData.blogPosts) {
        for (const post of backupData.blogPosts) {
          await tx.blogPost.create({ data: post });
        }
      }

      // 15. Arena Configurations
      if (backupData.arenaConfigurations) {
        for (const config of backupData.arenaConfigurations) {
          await tx.arenaConfiguration.create({ data: config });
        }
      }

      // 16. Analysis and other settings
      if (backupData.cardAnalysisSettings) {
        for (const setting of backupData.cardAnalysisSettings) {
          await tx.cardAnalysisSettings.create({ data: setting });
        }
      }

      // 17. User-related data (if users are not skipped)
      if (!skipTables.includes("users")) {
        if (backupData.userCards) {
          for (const userCard of backupData.userCards) {
            await tx.userCard.create({ data: userCard });
          }
        }

        if (backupData.userBadges) {
          for (const userBadge of backupData.userBadges) {
            await tx.userBadge.create({ data: userBadge });
          }
        }

        if (backupData.diamondTransactions) {
          for (const transaction of backupData.diamondTransactions) {
            await tx.diamondTransaction.create({ data: transaction });
          }
        }
      }
    });
  } catch (error) {
    console.error("Error restoring data:", error);
    throw new Error("Failed to restore backup data");
  }
}

// GET - Get backup info for restore
export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getUserFromSession();

    if (!sessionUser?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await checkAdminPermissions(sessionUser.id);

    const url = new URL(request.url);
    const backupId = url.searchParams.get("id");

    if (!backupId) {
      return NextResponse.json(
        { error: "Backup ID is required" },
        { status: 400 }
      );
    }

    const backupPath = getBackupPath(backupId);

    try {
      const content = await fs.readFile(backupPath, "utf-8");
      const backup = JSON.parse(content);

      // Return backup metadata and table info
      const tableInfo = Object.entries(backup.data || {}).map(
        ([tableName, data]: [string, any]) => ({
          name: tableName,
          recordCount: Array.isArray(data) ? data.length : 0,
        })
      );

      return NextResponse.json({
        metadata: backup.metadata,
        tables: tableInfo,
        totalRecords: tableInfo.reduce(
          (sum, table) => sum + table.recordCount,
          0
        ),
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Backup file not found or corrupted" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Restore info error:", error);
    return NextResponse.json(
      { error: "Failed to get backup information" },
      { status: 500 }
    );
  }
}

// POST - Restore from backup with enhanced error handling
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let sessionUser;

  try {
    sessionUser = await getUserFromSession();

    if (!sessionUser?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await checkAdminPermissions(sessionUser.id);

    // Check rate limiting
    if (
      !backupRateLimiter.canPerformOperation(sessionUser.id, "restore_backup")
    ) {
      const remainingTime = backupRateLimiter.getRemainingCooldown(
        sessionUser.id,
        "restore_backup"
      );
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          details: `Please wait ${remainingTime} seconds before performing another restore`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validatedData = restoreSchema.parse(body);

    logBackupOperation("RESTORE_START", {
      userId: sessionUser.id,
      backupId: validatedData.backupId,
      options: validatedData.options,
    });

    const backupPath = getBackupPath(validatedData.backupId);

    // Check if backup file exists and get stats
    let backupStats;
    try {
      backupStats = await fs.stat(backupPath);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        throw new RestoreError(
          "Backup file not found",
          "BACKUP_NOT_FOUND",
          404
        );
      }
      throw new RestoreError(
        "Cannot access backup file",
        "BACKUP_ACCESS_ERROR",
        500
      );
    }

    // Read and validate backup file
    let backup;
    try {
      const content = await fs.readFile(backupPath, "utf-8");
      backup = JSON.parse(content);
    } catch (error) {
      throw new RestoreError(
        "Corrupted backup file or invalid JSON",
        "BACKUP_CORRUPTED",
        400
      );
    }

    // Validate backup structure
    validateBackupFile(backup);

    const options = validatedData.options || {
      truncateFirst: true,
      skipUsers: false,
      skipSessions: true,
      skipSensitiveData: true,
    };

    // Validate restore constraints and get warnings
    const warnings = validateRestoreConstraints(backup, options);

    logBackupOperation("RESTORE_VALIDATION", {
      userId: sessionUser.id,
      backupId: validatedData.backupId,
      warnings,
      backupSize: backupStats.size,
      tableCount: Object.keys(backup.data).length,
    });

    // Truncate existing data if requested
    if (options.truncateFirst) {
      logBackupOperation("RESTORE_TRUNCATE_START", {
        userId: sessionUser.id,
        backupId: validatedData.backupId,
      });

      await truncateDatabase(options);

      logBackupOperation("RESTORE_TRUNCATE_SUCCESS", {
        userId: sessionUser.id,
        backupId: validatedData.backupId,
      });
    }

    // Restore data
    logBackupOperation("RESTORE_DATA_START", {
      userId: sessionUser.id,
      backupId: validatedData.backupId,
    });

    await restoreData(backup.data, options);

    const duration = Date.now() - startTime;
    const result = {
      success: true,
      message: "Database restored successfully",
      restoredAt: new Date().toISOString(),
      tablesRestored: Object.keys(backup.data).length,
      totalRecords: Object.values(backup.data).reduce(
        (sum: number, table: any) =>
          sum + (Array.isArray(table) ? table.length : 0),
        0
      ),
      duration,
      warnings,
    };

    logBackupOperation("RESTORE_SUCCESS", {
      ...result,
      userId: sessionUser.id,
      backupId: validatedData.backupId,
    });

    return NextResponse.json(result);
  } catch (error) {
    const duration = Date.now() - startTime;
    logBackupOperation(
      "RESTORE_ERROR",
      {
        duration,
        userId: sessionUser?.id,
      },
      error as Error
    );

    const formattedError = formatBackupError(error);
    return NextResponse.json(formattedError, {
      status: (error as any)?.statusCode || 500,
    });
  }
}
