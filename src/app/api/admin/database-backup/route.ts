import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { exec } from "child_process";
import { promisify } from "util";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

const execAsync = promisify(exec);

// Database backup creation schema
const createDatabaseBackupSchema = z.object({
  name: z.string().min(1, "Backup name is required").max(100),
  description: z.string().max(500).optional(),
  exportType: z.enum(["complete", "structure", "data"]).default("complete"),
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
  // You'll need to implement this based on your user model
  // For now, checking if user exists and has admin role
  return true; // Placeholder - implement proper admin check
}

// Helper function to ensure backup directory exists
async function ensureBackupDirectory() {
  const backupDir = path.join(process.cwd(), "database-backups");
  try {
    await fs.access(backupDir);
  } catch {
    await fs.mkdir(backupDir, { recursive: true });
  }
  return backupDir;
}

// Get database connection details from environment
function getDatabaseConfig() {
  return {
    host: process.env.DATABASE_HOST || "localhost",
    port: process.env.DATABASE_PORT || "5432",
    database:
      process.env.DATABASE_NAME ||
      process.env.DATABASE_URL?.split("/").pop()?.split("?")[0],
    username: process.env.DATABASE_USER || "postgres",
    password: process.env.DATABASE_PASSWORD,
  };
}

// POST - Create new database backup using pg_dump
export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getUserFromSession();

    if (!sessionUser?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await checkAdminPermissions(sessionUser.id);

    const body = await request.json();
    const validatedData = createDatabaseBackupSchema.parse(body);

    const backupDir = await ensureBackupDirectory();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${validatedData.name}-${timestamp}-${validatedData.exportType}.sql`;
    const backupPath = path.join(backupDir, filename);

    const dbConfig = getDatabaseConfig();

    // Check if pg_dump is available before proceeding
    try {
      const checkCommand =
        process.platform === "win32" ? "where pg_dump" : "which pg_dump";
      await execAsync(checkCommand);
    } catch (checkError) {
      return NextResponse.json(
        {
          error: "PostgreSQL tools not found",
          details:
            "pg_dump command is not available in the system PATH. Please install PostgreSQL client tools.",
          instructions: {
            windows: [
              "1. Download PostgreSQL from https://www.postgresql.org/download/windows/",
              "2. Install PostgreSQL with client tools",
              "3. Add PostgreSQL bin directory to system PATH (usually C:\\Program Files\\PostgreSQL\\{version}\\bin)",
              "4. Restart the application server",
              "Alternative: Use Application Data backups from the other tab for Prisma-based data export",
            ],
            macOS: [
              "1. Install via Homebrew: brew install postgresql",
              "2. Or download from https://www.postgresql.org/download/macosx/",
            ],
            linux: [
              "1. Ubuntu/Debian: sudo apt-get install postgresql-client",
              "2. CentOS/RHEL: sudo yum install postgresql",
            ],
          },
        },
        { status: 422 }
      );
    }

    // Build pg_dump command based on export type
    let pgDumpArgs = [
      "--verbose",
      "--clean",
      "--if-exists",
      "--host",
      dbConfig.host,
      "--port",
      dbConfig.port,
      "--username",
      dbConfig.username,
      "--dbname",
      dbConfig.database || "",
    ];

    // Add specific options based on export type
    switch (validatedData.exportType) {
      case "structure":
        pgDumpArgs.push("--schema-only");
        break;
      case "data":
        pgDumpArgs.push("--data-only");
        break;
      case "complete":
        // Default pg_dump includes both structure and data
        break;
    }

    pgDumpArgs.push("--file", backupPath);

    const pgDumpCommand = `pg_dump ${pgDumpArgs.join(" ")}`;

    console.log(
      "Executing pg_dump command:",
      pgDumpCommand.replace(dbConfig.password || "", "***")
    );

    // Set PGPASSWORD environment variable for authentication
    const env = { ...process.env };
    if (dbConfig.password) {
      env.PGPASSWORD = dbConfig.password;
    }

    try {
      const { stdout, stderr } = await execAsync(pgDumpCommand, {
        env,
        timeout: 300000, // 5 minutes timeout
      });

      console.log("pg_dump stdout:", stdout);
      if (stderr) {
        console.log("pg_dump stderr:", stderr);
      }

      // Check if backup file was created and get its stats
      const stats = await fs.stat(backupPath);

      const result = {
        id: `db-backup-${timestamp}`,
        name: validatedData.name,
        description: validatedData.description || "",
        exportType: validatedData.exportType,
        filename,
        createdAt: new Date().toISOString(),
        size: stats.size,
        path: backupPath,
      };

      return NextResponse.json({
        success: true,
        backup: result,
      });
    } catch (execError: any) {
      console.error("pg_dump execution error:", execError);

      // Clean up failed backup file only if it exists
      try {
        await fs.access(backupPath);
        await fs.unlink(backupPath);
      } catch (cleanupError) {
        // File doesn't exist or couldn't be deleted - this is fine
        console.log("Backup file cleanup skipped (file may not exist)");
      }

      // Provide more specific error messages
      const errorMessage = execError.message || "Unknown error";

      if (
        errorMessage.includes("authentication failed") ||
        errorMessage.includes("password")
      ) {
        return NextResponse.json(
          {
            error: "Database authentication failed",
            details:
              "Could not connect to PostgreSQL database. Please check your database credentials.",
            envVars: [
              "DATABASE_HOST",
              "DATABASE_PORT",
              "DATABASE_USER",
              "DATABASE_PASSWORD",
              "DATABASE_NAME",
            ],
          },
          { status: 401 }
        );
      }

      if (
        errorMessage.includes("connection refused") ||
        errorMessage.includes("could not connect")
      ) {
        return NextResponse.json(
          {
            error: "Database connection failed",
            details:
              "Could not connect to PostgreSQL server. Please check if the database is running.",
            suggestion:
              "Verify DATABASE_HOST and DATABASE_PORT environment variables",
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          error: "Database backup failed",
          details: errorMessage,
          code: "PG_DUMP_ERROR",
          suggestion:
            "Check PostgreSQL installation and database connection settings",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Database backup error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create database backup" },
      { status: 500 }
    );
  }
}

// GET - List all database backups
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
      const backupFiles = files.filter((file) => file.endsWith(".sql"));

      const backups = await Promise.all(
        backupFiles.map(async (file) => {
          try {
            const filePath = path.join(backupDir, file);
            const stats = await fs.stat(filePath);

            // Parse filename to extract metadata
            const parts = file.replace(".sql", "").split("-");
            const exportType = parts[parts.length - 1];
            const timestamp = parts.slice(-7, -1).join("-"); // Extract timestamp part
            const name = parts.slice(0, -7).join("-"); // Extract name part

            return {
              id: `db-backup-${timestamp}`,
              name: name || file.replace(".sql", ""),
              filename: file,
              exportType: ["complete", "structure", "data"].includes(exportType)
                ? exportType
                : "complete",
              createdAt: stats.birthtime.toISOString(),
              size: stats.size,
              path: filePath,
            };
          } catch (error) {
            console.error(`Error reading database backup file ${file}:`, error);
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
    console.error("Database backup list error:", error);
    return NextResponse.json(
      { error: "Failed to list database backups" },
      { status: 500 }
    );
  }
}

// DELETE - Delete database backup
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
    const id = url.searchParams.get("id");
    const filename = url.searchParams.get("filename");

    if (!id && !filename) {
      return NextResponse.json(
        { error: "Backup ID or filename is required" },
        { status: 400 }
      );
    }

    const backupDir = await ensureBackupDirectory();

    let backupPath: string;

    if (filename) {
      backupPath = path.join(backupDir, filename);
    } else {
      // Find file by ID
      const files = await fs.readdir(backupDir);
      const backupFile = files.find(
        (file) => file.includes(id as string) && file.endsWith(".sql")
      );

      if (!backupFile) {
        return NextResponse.json(
          { error: "Backup not found" },
          { status: 404 }
        );
      }

      backupPath = path.join(backupDir, backupFile);
    }

    try {
      await fs.access(backupPath);
      await fs.unlink(backupPath);

      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: "Backup not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Database backup deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete database backup" },
      { status: 500 }
    );
  }
}

// PUT - Download database backup
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
    const id = searchParams.get("id");
    const filename = searchParams.get("filename");

    if (!id && !filename) {
      return NextResponse.json(
        { error: "Backup ID or filename is required" },
        { status: 400 }
      );
    }

    const backupDir = await ensureBackupDirectory();

    let backupPath: string;
    let actualFilename: string;

    if (filename) {
      backupPath = path.join(backupDir, filename);
      actualFilename = filename;
    } else {
      // Find file by ID
      const files = await fs.readdir(backupDir);
      const backupFile = files.find(
        (file) => file.includes(id as string) && file.endsWith(".sql")
      );

      if (!backupFile) {
        return NextResponse.json(
          { error: "Backup not found" },
          { status: 404 }
        );
      }

      backupPath = path.join(backupDir, backupFile);
      actualFilename = backupFile;
    }

    try {
      await fs.access(backupPath);
      const fileContent = await fs.readFile(backupPath, "utf-8");

      return new NextResponse(fileContent, {
        status: 200,
        headers: {
          "Content-Type": "application/sql",
          "Content-Disposition": `attachment; filename="${actualFilename}"`,
          "Content-Length": fileContent.length.toString(),
        },
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Backup file not found" },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error("Database backup download error:", error);
    return NextResponse.json(
      { error: "Failed to download database backup" },
      { status: 500 }
    );
  }
}
