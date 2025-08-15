import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import {
  BackupError,
  backupNameSchema,
  backupDescriptionSchema,
  backupIdSchema,
  validateBackupFile,
  estimateBackupSize,
  sanitizeTableData,
  createBackupMetadata,
  logBackupOperation,
  formatBackupError,
  backupRateLimiter,
  generateSQLDump,
  validateSQLExport,
  isValidBackupId,
} from "@/lib/backup-utils";

// Backup creation schema
const createBackupSchema = z.object({
  name: backupNameSchema,
  description: backupDescriptionSchema,
  tables: z.array(z.string()).optional(),
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

// Helper function to get all table data with error handling
async function getAllTableData(options?: { sanitize?: boolean }) {
  const startTime = Date.now();

  try {
    logBackupOperation("GET_TABLE_DATA", {
      startTime: new Date().toISOString(),
    });
    const [
      users,
      cards,
      userCards,
      categories,
      rarities,
      elements,
      cardStyles,
      collections,
      animeSeries,
      characters,
      analytics,
      settings,
      aiModels,
      usedCardNames,
      accounts,
      sessions,
      codeArenas,
      codeArenaProgress,
      codeSubmissions,
      quizzes,
      quizAttempts,
      badges,
      userBadges,
      dailyQuests,
      diamondTransactions,
      dailyMiniQuizzes,
      dailyMiniQuizAttempts,
      cardPacks,
      cardPackOpenings,
      userStreaks,
      xpMultiplierEvents,
      xpEventParticipations,
      dailyLoginBonuses,
      userDailyLogins,
      cardAnalysisSettings,
      analysisLogs,
      diamondPurchases,
      diamondPackages,
      learningActivities,
      activityAttempts,
      quizQuestions,
      quizCategories,
      weeklyChallenges,
      userChallengeProgress,
      cardRarities,
      cardDistributionRules,
      cardDistributionLogs,
      userRarityStats,
      loginHistory,
      loginStreaks,
      pythonTipCategories,
      pythonTips,
      userPythonTipInteractions,
      pythonTipStreaks,
      dailyPythonTips,
      pythonTipFeedback,
      blogPosts,
      blogPostInteractions,
      arenaConfigurations,
      arenaDifficultyConfigs,
      arenaCategoryConfigs,
      arenaActivityTypeConfigs,
      arenaUIConfigs,
    ] = await Promise.all([
      db.user.findMany(),
      db.card.findMany(),
      db.userCard.findMany(),
      db.category.findMany(),
      db.rarity.findMany(),
      db.element.findMany(),
      db.cardStyle.findMany(),
      db.collection.findMany(),
      db.animeSeries.findMany(),
      db.character.findMany(),
      db.analytics.findMany(),
      db.settings.findMany(),
      db.aIModel.findMany(),
      db.usedCardNames.findMany(),
      db.account.findMany(),
      db.session.findMany(),
      db.learningActivity.findMany({
        where: { activityType: "lesson" },
      }),
      db.activityAttempt.findMany({
        where: { activity: { activityType: "lesson" } },
      }),
      db.codeSubmission.findMany(),
      db.quiz.findMany(),
      db.quizAttempt.findMany(),
      db.badge.findMany(),
      db.userBadge.findMany(),
      db.dailyQuest.findMany(),
      db.diamondTransaction.findMany(),
      db.dailyMiniQuiz.findMany(),
      db.dailyMiniQuizAttempt.findMany(),
      db.cardPack.findMany(),
      db.cardPackOpening.findMany(),
      db.userStreak.findMany(),
      db.xPMultiplierEvent.findMany(),
      db.xPEventParticipation.findMany(),
      db.dailyLoginBonus.findMany(),
      db.userDailyLogin.findMany(),
      db.cardAnalysisSettings.findMany(),
      db.analysisLog.findMany(),
      db.diamondPurchase.findMany(),
      db.diamondPackage.findMany(),
      db.learningActivity.findMany(),
      db.activityAttempt.findMany(),
      db.quizQuestion.findMany(),
      db.quizCategory.findMany(),
      db.weeklyChallenge.findMany(),
      db.userChallengeProgress.findMany(),
      db.cardRarity.findMany(),
      db.cardDistributionRule.findMany(),
      db.cardDistributionLog.findMany(),
      db.userRarityStats.findMany(),
      db.loginHistory.findMany(),
      db.loginStreak.findMany(),
      db.pythonTipCategory.findMany(),
      db.pythonTip.findMany(),
      db.userPythonTipInteraction.findMany(),
      db.pythonTipStreak.findMany(),
      db.dailyPythonTip.findMany(),
      db.pythonTipFeedback.findMany(),
      db.blogPost.findMany(),
      db.blogPostInteraction.findMany(),
      db.arenaConfiguration.findMany(),
      db.arenaDifficultyConfig.findMany(),
      db.arenaCategoryConfig.findMany(),
      db.arenaActivityTypeConfig.findMany(),
      db.arenaUIConfig.findMany(),
    ]);

    const tableData = {
      users: options?.sanitize ? sanitizeTableData(users, "users") : users,
      cards,
      userCards,
      categories,
      rarities,
      elements,
      cardStyles,
      collections,
      animeSeries,
      characters,
      analytics,
      settings,
      aiModels,
      usedCardNames,
      accounts: options?.sanitize
        ? sanitizeTableData(accounts, "accounts")
        : accounts,
      sessions: options?.sanitize
        ? sanitizeTableData(sessions, "sessions")
        : sessions,
      codeArenas,
      codeArenaProgress,
      codeSubmissions,
      quizzes,
      quizAttempts,
      badges,
      userBadges,
      dailyQuests,
      diamondTransactions,
      dailyMiniQuizzes,
      dailyMiniQuizAttempts,
      cardPacks,
      cardPackOpenings,
      userStreaks,
      xpMultiplierEvents,
      xpEventParticipations,
      dailyLoginBonuses,
      userDailyLogins,
      cardAnalysisSettings,
      analysisLogs,
      diamondPurchases,
      diamondPackages,
      learningActivities,
      activityAttempts,
      quizQuestions,
      quizCategories,
      weeklyChallenges,
      userChallengeProgress,
      cardRarities,
      cardDistributionRules,
      cardDistributionLogs,
      userRarityStats,
      loginHistory,
      loginStreaks,
      pythonTipCategories,
      pythonTips,
      userPythonTipInteractions,
      pythonTipStreaks,
      dailyPythonTips,
      pythonTipFeedback,
      blogPosts,
      blogPostInteractions,
      arenaConfigurations,
      arenaDifficultyConfigs,
      arenaCategoryConfigs,
      arenaActivityTypeConfigs,
      arenaUIConfigs,
    };

    const endTime = Date.now();
    logBackupOperation("GET_TABLE_DATA", {
      duration: endTime - startTime,
      tablesCount: Object.keys(tableData).length,
      totalRecords: Object.values(tableData).reduce(
        (sum: number, table: any) =>
          sum + (Array.isArray(table) ? table.length : 0),
        0
      ),
    });

    return tableData;
  } catch (error) {
    logBackupOperation(
      "GET_TABLE_DATA",
      { duration: Date.now() - startTime },
      error as Error
    );
    throw new BackupError(
      "Failed to retrieve database data",
      "DATA_RETRIEVAL_ERROR"
    );
  }
}

// Helper function to ensure backup directory exists
async function ensureBackupDirectory() {
  const backupDir = path.join(process.cwd(), "backups");
  try {
    await fs.access(backupDir);
  } catch {
    await fs.mkdir(backupDir, { recursive: true });
  }
  return backupDir;
}

// GET - List all backups
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

    const backupDir = await ensureBackupDirectory();

    try {
      const files = await fs.readdir(backupDir);
      const backupFiles = files.filter((file) => file.endsWith(".json"));

      const backups = await Promise.all(
        backupFiles.map(async (file) => {
          try {
            const filePath = path.join(backupDir, file);
            const stats = await fs.stat(filePath);
            const content = await fs.readFile(filePath, "utf-8");
            const backup = JSON.parse(content);

            return {
              id: file.replace(".json", ""),
              name: backup.metadata?.name || file.replace(".json", ""),
              description: backup.metadata?.description || "",
              createdAt:
                backup.metadata?.createdAt || stats.birthtime.toISOString(),
              size: stats.size,
              tableCount: Object.keys(backup.data || {}).length,
              totalRecords: Object.values(backup.data || {}).reduce(
                (total: number, table: any) =>
                  total + (Array.isArray(table) ? table.length : 0),
                0
              ),
            };
          } catch (error) {
            console.error(`Error reading backup file ${file}:`, error);
            return null;
          }
        })
      );

      const validBackups = backups.filter((backup) => backup !== null);
      validBackups.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return NextResponse.json({ backups: validBackups });
    } catch (error) {
      return NextResponse.json({ backups: [] });
    }
  } catch (error) {
    console.error("Backup list error:", error);
    return NextResponse.json(
      { error: "Failed to list backups" },
      { status: 500 }
    );
  }
}

// POST - Create new backup with enhanced error handling
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
      !backupRateLimiter.canPerformOperation(sessionUser.id, "create_backup")
    ) {
      const remainingTime = backupRateLimiter.getRemainingCooldown(
        sessionUser.id,
        "create_backup"
      );
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          details: `Please wait ${remainingTime} seconds before creating another backup`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validatedData = createBackupSchema.parse(body);

    logBackupOperation("CREATE_BACKUP_START", {
      userId: sessionUser.id,
      backupName: validatedData.name,
      description: validatedData.description,
    });

    const backupDir = await ensureBackupDirectory();

    // Create backup metadata
    const metadata = createBackupMetadata(
      validatedData.name,
      validatedData.description,
      sessionUser.id
    );

    // Get all database data with sanitization
    const tableData = await getAllTableData({ sanitize: true });

    // Estimate backup size
    const estimatedSize = estimateBackupSize({ metadata, data: tableData });

    // Check if we have enough disk space (simple check)
    if (estimatedSize > 500 * 1024 * 1024) {
      // 500MB limit
      throw new BackupError(
        "Backup size exceeds limit",
        "SIZE_LIMIT_EXCEEDED",
        413
      );
    }

    // Create backup object
    const backup = {
      metadata,
      data: tableData,
    };

    // Validate backup structure
    validateBackupFile(backup);

    // Save backup to file
    const backupPath = path.join(backupDir, `${metadata.id}.json`);
    await fs.writeFile(backupPath, JSON.stringify(backup, null, 2), "utf-8");

    // Get actual file size
    const stats = await fs.stat(backupPath);

    const result = {
      id: metadata.id,
      name: validatedData.name,
      description: validatedData.description || "",
      createdAt: metadata.createdAt,
      size: stats.size,
      tableCount: Object.keys(tableData).length,
      totalRecords: Object.values(tableData).reduce(
        (total: number, table: any) =>
          total + (Array.isArray(table) ? table.length : 0),
        0
      ),
    };

    logBackupOperation("CREATE_BACKUP_SUCCESS", {
      ...result,
      duration: Date.now() - startTime,
      userId: sessionUser.id,
    });

    return NextResponse.json({
      success: true,
      backup: result,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logBackupOperation(
      "CREATE_BACKUP_ERROR",
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

// DELETE - Delete backup
export async function DELETE(request: NextRequest) {
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

    const backupDir = await ensureBackupDirectory();
    const backupPath = path.join(backupDir, `${backupId}.json`);

    try {
      await fs.access(backupPath);
      await fs.unlink(backupPath);

      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: "Backup not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Backup deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete backup" },
      { status: 500 }
    );
  }
}

// PUT - Download backup as SQL
export async function PUT(request: NextRequest) {
  try {
    const sessionUser = await getUserFromSession();

    if (!sessionUser?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await checkAdminPermissions(sessionUser.id);

    const { searchParams } = new URL(request.url);
    const backupId = searchParams.get("id");
    const format = searchParams.get("format");
    const exportType = searchParams.get("type") || "complete"; // complete, structure, data

    if (!backupId || !isValidBackupId(backupId)) {
      return NextResponse.json({ error: "Invalid backup ID" }, { status: 400 });
    }

    if (format !== "sql") {
      return NextResponse.json(
        { error: "Only SQL format is supported for downloads" },
        { status: 400 }
      );
    }

    if (!["complete", "structure", "data"].includes(exportType)) {
      return NextResponse.json(
        {
          error:
            "Invalid export type. Must be 'complete', 'structure', or 'data'",
        },
        { status: 400 }
      );
    }

    // Rate limiting check
    if (!backupRateLimiter.canPerformOperation(sessionUser.id, "download")) {
      const cooldown = backupRateLimiter.getRemainingCooldown(
        sessionUser.id,
        "download"
      );
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          code: "RATE_LIMITED",
          retryAfter: cooldown,
        },
        { status: 429 }
      );
    }

    // Read backup file
    const backupDir = await ensureBackupDirectory();
    const backupPath = path.join(backupDir, `${backupId}.json`);

    try {
      await fs.access(backupPath);
    } catch {
      return NextResponse.json(
        { error: "Backup file not found" },
        { status: 404 }
      );
    }

    const backupContent = await fs.readFile(backupPath, "utf-8");
    const backupData = JSON.parse(backupContent);

    // Validate backup data for SQL export
    validateSQLExport(backupData);

    // Generate SQL dump with specified export type
    const sqlContent = generateSQLDump(backupData, {
      includeDropStatements: exportType === "data",
      batchSize: 1000,
      includeConstraints: exportType !== "structure",
      exportType: exportType as "complete" | "structure" | "data",
    });

    logBackupOperation("sql_download", {
      backupId,
      userId: sessionUser.id,
      exportType,
      size: sqlContent.length,
    });

    // Determine filename suffix based on export type
    const suffix = exportType === "complete" ? "" : `_${exportType}`;
    const filename = `${backupId}${suffix}.sql`;

    // Return SQL file as download
    return new NextResponse(sqlContent, {
      status: 200,
      headers: {
        "Content-Type": "application/sql",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": sqlContent.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("SQL download error:", error);
    const formattedError = formatBackupError(error);
    return NextResponse.json(formattedError, {
      status:
        formattedError.code === "UNAUTHORIZED"
          ? 401
          : formattedError.code === "INVALID_BACKUP_DATA"
            ? 400
            : 500,
    });
  }
}
