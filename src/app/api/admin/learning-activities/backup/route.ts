import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

// Learning Activities Backup schema
const learningActivitiesBackupSchema = z.object({
  name: z.string().min(1, "Backup name is required").max(100),
  description: z.string().optional().default(""),
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
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== "admin") {
    throw new Error("Admin permissions required");
  }
}

// Helper function to get learning activities data
async function getLearningActivitiesData() {
  try {
    const [learningActivities, activityAttempts, relatedCodeArenas] =
      await Promise.all([
        // Core learning activities data
        prisma.learningActivity.findMany({
          orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
          include: {
            _count: {
              select: {
                attempts: true,
              },
            },
          },
        }),

        // Activity attempts and progress
        prisma.activityAttempt.findMany({
          orderBy: { id: "desc" },
        }),

        // Code arena activities
        prisma.codeArena.findMany({
          orderBy: { updatedAt: "desc" },
        }),
      ]);

    // Calculate statistics
    const stats = {
      totalActivities: learningActivities.length,
      activeActivities: learningActivities.filter((a: any) => a.isActive)
        .length,
      totalAttempts: activityAttempts.length,
      totalCategories: [
        ...new Set(learningActivities.map((a: any) => a.category)),
      ].length,
      activityTypes: [
        ...new Set(learningActivities.map((a: any) => a.activityType)),
      ].length,
      totalDiamonds: learningActivities.reduce(
        (sum: number, a: any) => sum + a.diamondReward,
        0
      ),
      totalXP: learningActivities.reduce(
        (sum: number, a: any) => sum + a.experienceReward,
        0
      ),
      averageDifficulty:
        learningActivities.length > 0
          ? Math.round(
              (learningActivities.reduce(
                (sum: number, a: any) => sum + a.difficulty,
                0
              ) /
                learningActivities.length) *
                10
            ) / 10
          : 0,
    };

    // Format activities with parsed JSON fields
    const formattedActivities = learningActivities.map((activity: any) => {
      let tags = [];
      try {
        if (activity.tags) {
          tags =
            typeof activity.tags === "string"
              ? JSON.parse(activity.tags)
              : activity.tags;
        }
      } catch (error) {
        tags = [];
      }

      return {
        ...activity,
        content: JSON.parse(activity.content),
        settings: activity.settings ? JSON.parse(activity.settings) : null,
        tags: Array.isArray(tags) ? tags : [],
        attemptsCount: activity._count.attempts,
      };
    });

    return {
      learningActivities: formattedActivities,
      activityAttempts,
      relatedCodeArenas,
      statistics: stats,
    };
  } catch (error) {
    console.error("Error fetching learning activities data:", error);
    throw new Error("Failed to retrieve learning activities data");
  }
}

// Helper function to ensure backup directory exists
async function ensureBackupDirectory() {
  const backupDir = path.join(process.cwd(), "backups", "learning-activities");
  try {
    await fs.access(backupDir);
  } catch {
    await fs.mkdir(backupDir, { recursive: true });
  }
  return backupDir;
}

// POST - Create learning activities backup
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

    const body = await request.json();
    const validatedData = learningActivitiesBackupSchema.parse(body);

    const backupDir = await ensureBackupDirectory();

    // Create backup metadata
    const metadata = {
      id: `learning-activities-${Date.now()}`,
      name: validatedData.name,
      description: validatedData.description,
      type: "learning_activities",
      createdAt: new Date().toISOString(),
      createdBy: sessionUser.id,
      version: "1.0",
    };

    // Get learning activities data
    const learningData = await getLearningActivitiesData();

    // Create backup object
    const backup = {
      metadata,
      data: learningData,
      summary: {
        totalActivities: learningData.statistics.totalActivities,
        activeActivities: learningData.statistics.activeActivities,
        totalAttempts: learningData.statistics.totalAttempts,
        categories: learningData.statistics.totalCategories,
        backupSize: JSON.stringify(learningData).length,
        createdAt: metadata.createdAt,
      },
    };

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
      type: "learning_activities",
      statistics: learningData.statistics,
      duration: Date.now() - startTime,
    };

    return NextResponse.json({
      success: true,
      backup: result,
      message: "Learning activities backup created successfully",
    });
  } catch (error) {
    console.error("Learning activities backup error:", error);

    return NextResponse.json(
      {
        error: "Failed to create learning activities backup",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET - List learning activities backups
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
              id: backup.metadata?.id || file.replace(".json", ""),
              name: backup.metadata?.name || file.replace(".json", ""),
              description: backup.metadata?.description || "",
              createdAt:
                backup.metadata?.createdAt || stats.birthtime.toISOString(),
              size: stats.size,
              type: backup.metadata?.type || "learning_activities",
              statistics: backup.summary || backup.data?.statistics || {},
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

      return NextResponse.json({
        success: true,
        backups: validBackups,
      });
    } catch (error) {
      return NextResponse.json({
        success: true,
        backups: [],
      });
    }
  } catch (error) {
    console.error("Learning activities backup list error:", error);
    return NextResponse.json(
      { error: "Failed to list learning activities backups" },
      { status: 500 }
    );
  }
}

// DELETE - Delete learning activities backup
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

      return NextResponse.json({
        success: true,
        message: "Learning activities backup deleted successfully",
      });
    } catch (error) {
      return NextResponse.json({ error: "Backup not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Learning activities backup deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete learning activities backup" },
      { status: 500 }
    );
  }
}
