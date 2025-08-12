import { z } from "zod";

// Error types for backup operations
export class BackupError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "BackupError";
  }
}

export class RestoreError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "RestoreError";
  }
}

// Validation schemas
export const backupNameSchema = z
  .string()
  .min(1, "Backup name is required")
  .max(100, "Backup name must be less than 100 characters")
  .regex(
    /^[a-zA-Z0-9\s\-_]+$/,
    "Backup name can only contain letters, numbers, spaces, hyphens, and underscores"
  );

export const backupDescriptionSchema = z
  .string()
  .max(500, "Description must be less than 500 characters")
  .optional();

export const restoreOptionsSchema = z.object({
  truncateFirst: z.boolean().default(true),
  skipUsers: z.boolean().default(false),
  skipSessions: z.boolean().default(true),
  skipSensitiveData: z.boolean().default(true),
  selectedTables: z.array(z.string()).optional(),
});

export const backupIdSchema = z
  .string()
  .min(1, "Backup ID is required")
  .regex(/^backup-[\d\-TZ]+$/, "Invalid backup ID format");

// Utility functions
export function validateBackupFile(backupData: any): boolean {
  try {
    // Check if backup has required structure
    if (!backupData || typeof backupData !== "object") {
      throw new RestoreError(
        "Invalid backup file format",
        "INVALID_FORMAT",
        400
      );
    }

    if (!backupData.metadata || !backupData.data) {
      throw new RestoreError(
        "Backup file missing required sections",
        "MISSING_SECTIONS",
        400
      );
    }

    // Validate metadata
    const requiredMetadataFields = ["id", "name", "createdAt", "version"];
    for (const field of requiredMetadataFields) {
      if (!backupData.metadata[field]) {
        throw new RestoreError(
          `Missing metadata field: ${field}`,
          "MISSING_METADATA",
          400
        );
      }
    }

    // Validate data structure
    if (typeof backupData.data !== "object") {
      throw new RestoreError(
        "Invalid data section in backup",
        "INVALID_DATA",
        400
      );
    }

    return true;
  } catch (error) {
    if (error instanceof RestoreError) {
      throw error;
    }
    throw new RestoreError(
      "Failed to validate backup file",
      "VALIDATION_ERROR",
      400
    );
  }
}

export function estimateBackupSize(tableData: any): number {
  try {
    const jsonString = JSON.stringify(tableData);
    return Buffer.byteLength(jsonString, "utf8");
  } catch (error) {
    throw new BackupError(
      "Failed to estimate backup size",
      "SIZE_ESTIMATION_ERROR"
    );
  }
}

export function sanitizeTableData(data: any[], tableName: string): any[] {
  try {
    return data.map((record) => {
      // Remove sensitive fields based on table name
      const sanitized = { ...record };

      if (tableName === "users") {
        delete sanitized.passwordHash;
        delete sanitized.phone;
      }

      if (tableName === "accounts") {
        delete sanitized.refresh_token;
        delete sanitized.access_token;
        delete sanitized.id_token;
      }

      if (tableName === "sessions") {
        delete sanitized.sessionToken;
      }

      return sanitized;
    });
  } catch (error) {
    throw new BackupError(
      `Failed to sanitize ${tableName} data`,
      "SANITIZATION_ERROR"
    );
  }
}

export function validateRestoreConstraints(
  backupData: any,
  options: any
): string[] {
  const warnings: string[] = [];

  try {
    // Check for potential data conflicts
    if (!options.truncateFirst && backupData.data.users?.length > 0) {
      warnings.push(
        "Restoring users without clearing existing data may cause conflicts"
      );
    }

    if (!options.skipSessions && options.skipUsers) {
      warnings.push(
        "Restoring sessions without users may cause orphaned records"
      );
    }

    // Check for large datasets
    const totalRecords = Object.values(backupData.data || {}).reduce(
      (sum: number, table: any) =>
        sum + (Array.isArray(table) ? table.length : 0),
      0
    );

    if (totalRecords > 100000) {
      warnings.push(
        "Large dataset detected - restore may take several minutes"
      );
    }

    // Check for version compatibility
    const backupVersion = backupData.metadata?.version;
    if (backupVersion && backupVersion !== "1.0") {
      warnings.push(
        `Backup version ${backupVersion} may not be fully compatible`
      );
    }

    return warnings;
  } catch (error) {
    throw new RestoreError(
      "Failed to validate restore constraints",
      "CONSTRAINT_VALIDATION_ERROR"
    );
  }
}

export function createBackupMetadata(
  name: string,
  description?: string,
  createdBy?: string
) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return {
    id: `backup-${timestamp}`,
    name,
    description: description || "",
    createdAt: new Date().toISOString(),
    createdBy: createdBy || "system",
    version: "1.0",
    databaseSchema: "postgresql",
  };
}

export function logBackupOperation(
  operation: string,
  details: any,
  error?: Error
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    operation,
    details,
    ...(error && {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    }),
  };

  console.log(
    `[BACKUP-${operation.toUpperCase()}]`,
    JSON.stringify(logEntry, null, 2)
  );
}

export function isValidBackupId(id: string): boolean {
  return backupIdSchema.safeParse(id).success;
}

export function formatBackupError(error: any): {
  error: string;
  code?: string;
  details?: any;
} {
  if (error instanceof BackupError || error instanceof RestoreError) {
    return {
      error: error.message,
      code: error.code,
    };
  }

  if (error instanceof z.ZodError) {
    return {
      error: "Validation failed",
      code: "VALIDATION_ERROR",
      details: error.issues,
    };
  }

  // Database errors
  if (error.code === "P2002") {
    return {
      error: "Database constraint violation",
      code: "CONSTRAINT_ERROR",
    };
  }

  if (error.code === "P2025") {
    return {
      error: "Record not found",
      code: "NOT_FOUND",
    };
  }

  // File system errors
  if (error.code === "ENOENT") {
    return {
      error: "File not found",
      code: "FILE_NOT_FOUND",
    };
  }

  if (error.code === "ENOSPC") {
    return {
      error: "Insufficient disk space",
      code: "DISK_FULL",
    };
  }

  if (error.code === "EMFILE" || error.code === "ENFILE") {
    return {
      error: "Too many open files",
      code: "FILE_LIMIT",
    };
  }

  // Generic error
  return {
    error: "An unexpected error occurred",
    code: "INTERNAL_ERROR",
  };
}

// Rate limiting for backup operations
export class BackupRateLimiter {
  private lastOperation: Map<string, number> = new Map();
  private readonly cooldownMs: number;

  constructor(cooldownMinutes: number = 5) {
    this.cooldownMs = cooldownMinutes * 60 * 1000;
  }

  canPerformOperation(userId: string, operation: string): boolean {
    const key = `${userId}:${operation}`;
    const lastTime = this.lastOperation.get(key);
    const now = Date.now();

    if (!lastTime || now - lastTime >= this.cooldownMs) {
      this.lastOperation.set(key, now);
      return true;
    }

    return false;
  }

  getRemainingCooldown(userId: string, operation: string): number {
    const key = `${userId}:${operation}`;
    const lastTime = this.lastOperation.get(key);

    if (!lastTime) return 0;

    const elapsed = Date.now() - lastTime;
    const remaining = this.cooldownMs - elapsed;

    return Math.max(0, Math.ceil(remaining / 1000));
  }
}

// Export singleton rate limiter
export const backupRateLimiter = new BackupRateLimiter(5); // 5 minute cooldown

// SQL Export functionality
const POSTGRESQL_TABLE_ORDER = [
  "verificationtokens",
  "accounts",
  "sessions",
  "users",
  "animecharacters",
  "animecards",
  "deckbuilder",
  "collections",
  "trades",
  "tradeoffers",
  "cardpacks",
  "tournaments",
  "matches",
  "leaderboard",
];

interface SQLGenerationOptions {
  includeDropStatements?: boolean;
  batchSize?: number;
  includeConstraints?: boolean;
  exportType?: "complete" | "structure" | "data";
}

export function escapeSQL(value: any): string {
  if (value === null || value === undefined) {
    return "NULL";
  }

  if (typeof value === "string") {
    // Escape single quotes and backslashes
    return `'${value.replace(/'/g, "''").replace(/\\/g, "\\\\")}'`;
  }

  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }

  if (typeof value === "number") {
    return value.toString();
  }

  if (value instanceof Date) {
    return `'${value.toISOString()}'`;
  }

  if (typeof value === "object") {
    // Handle JSON fields
    return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
  }

  return `'${String(value).replace(/'/g, "''")}'`;
}

export function generateTableSQL(
  tableName: string,
  records: any[],
  options: SQLGenerationOptions = {}
): string[] {
  const { includeDropStatements = true, batchSize = 1000 } = options;
  const sqlStatements: string[] = [];

  if (records.length === 0) {
    return sqlStatements;
  }

  // Add table drop statement if requested
  if (includeDropStatements) {
    sqlStatements.push(`-- Truncate ${tableName} table`);
    sqlStatements.push(
      `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`
    );
    sqlStatements.push("");
  }

  // Get column names from first record
  const columns = Object.keys(records[0]);
  const columnList = columns.map((col) => `"${col}"`).join(", ");

  // Process records in batches
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const values = batch
      .map((record) => {
        const valueList = columns
          .map((col) => escapeSQL(record[col]))
          .join(", ");
        return `(${valueList})`;
      })
      .join(",\n  ");

    sqlStatements.push(
      `-- Insert batch ${Math.floor(i / batchSize) + 1} for ${tableName}`
    );
    sqlStatements.push(
      `INSERT INTO "${tableName}" (${columnList}) VALUES\n  ${values};`
    );
    sqlStatements.push("");
  }

  return sqlStatements;
}

export function generateTableStructureSQL(
  tableName: string,
  sampleRecord: any
): string[] {
  const sqlStatements: string[] = [];

  if (!sampleRecord) {
    return sqlStatements;
  }

  // Generate CREATE TABLE statement based on sample data
  const columns = Object.keys(sampleRecord);
  const columnDefinitions = columns
    .map((col) => {
      const value = sampleRecord[col];
      let type = "TEXT"; // Default type

      // Infer PostgreSQL types from sample data
      if (value === null || value === undefined) {
        type = "TEXT";
      } else if (typeof value === "string") {
        if (value.includes("T") && value.includes("Z") && value.length >= 20) {
          // Looks like ISO timestamp
          type = "TIMESTAMPTZ";
        } else if (col.toLowerCase().includes("id")) {
          type = "VARCHAR(255)";
        } else if (value.length > 255) {
          type = "TEXT";
        } else {
          type = "VARCHAR(255)";
        }
      } else if (typeof value === "number") {
        if (Number.isInteger(value)) {
          type = "INTEGER";
        } else {
          type = "DECIMAL";
        }
      } else if (typeof value === "boolean") {
        type = "BOOLEAN";
      } else if (value instanceof Date) {
        type = "TIMESTAMPTZ";
      } else if (typeof value === "object") {
        type = "JSONB";
      }

      return `  "${col}" ${type}`;
    })
    .join(",\n");

  sqlStatements.push(`-- Table structure for ${tableName}`);
  sqlStatements.push(`DROP TABLE IF EXISTS "${tableName}" CASCADE;`);
  sqlStatements.push(`CREATE TABLE "${tableName}" (`);
  sqlStatements.push(columnDefinitions);
  sqlStatements.push(`);`);
  sqlStatements.push("");

  return sqlStatements;
}

export function generateSQLDump(
  backupData: any,
  options: SQLGenerationOptions = {}
): string {
  const { includeConstraints = true, exportType = "complete" } = options;
  const sqlLines: string[] = [];

  // Add header
  sqlLines.push("-- PostgreSQL Database Backup");
  sqlLines.push(`-- Generated on: ${new Date().toISOString()}`);
  sqlLines.push(`-- Backup ID: ${backupData.metadata?.id || "unknown"}`);
  sqlLines.push(`-- Backup Name: ${backupData.metadata?.name || "unnamed"}`);
  sqlLines.push(`-- Export Type: ${exportType.toUpperCase()}`);
  sqlLines.push("");

  // Add transaction start
  sqlLines.push("BEGIN;");
  sqlLines.push("");

  // Disable foreign key checks during restore (only for data operations)
  if (includeConstraints && exportType !== "structure") {
    sqlLines.push("-- Disable foreign key checks");
    sqlLines.push("SET session_replication_role = replica;");
    sqlLines.push("");
  }

  try {
    // Process tables in correct order to respect foreign key constraints
    const tableData = backupData.data || {};
    const orderedTables = POSTGRESQL_TABLE_ORDER.filter(
      (table) =>
        tableData[table] &&
        Array.isArray(tableData[table]) &&
        tableData[table].length > 0
    );

    // Add any additional tables not in the predefined order
    const additionalTables = Object.keys(tableData).filter(
      (table) =>
        !POSTGRESQL_TABLE_ORDER.includes(table) &&
        Array.isArray(tableData[table]) &&
        tableData[table].length > 0
    );

    const allTables = [...orderedTables, ...additionalTables];

    for (const tableName of allTables) {
      const records = tableData[tableName];

      sqlLines.push(`-- ===========================`);
      sqlLines.push(`-- Table: ${tableName}`);
      sqlLines.push(`-- Records: ${records.length}`);
      sqlLines.push(`-- ===========================`);
      sqlLines.push("");

      // Generate structure if needed
      if (exportType === "structure" || exportType === "complete") {
        const structureSQL = generateTableStructureSQL(tableName, records[0]);
        sqlLines.push(...structureSQL);
      }

      // Generate data if needed
      if (exportType === "data" || exportType === "complete") {
        const dataSQL = generateTableSQL(tableName, records, {
          ...options,
          includeDropStatements: exportType === "data", // Only truncate for data-only exports
        });
        sqlLines.push(...dataSQL);
      }
    }

    // Re-enable foreign key checks (only for data operations)
    if (includeConstraints && exportType !== "structure") {
      sqlLines.push("-- Re-enable foreign key checks");
      sqlLines.push("SET session_replication_role = DEFAULT;");
      sqlLines.push("");
    }

    // Commit transaction
    sqlLines.push("COMMIT;");
    sqlLines.push("");
    sqlLines.push(
      `-- ${exportType.charAt(0).toUpperCase() + exportType.slice(1)} export completed successfully`
    );
  } catch (error) {
    sqlLines.push("");
    sqlLines.push("ROLLBACK;");
    sqlLines.push("-- Error occurred during backup generation");
    throw new BackupError(
      "Failed to generate SQL dump",
      "SQL_GENERATION_ERROR"
    );
  }

  return sqlLines.join("\n");
}

export function validateSQLExport(backupData: any): void {
  if (!backupData || !backupData.data) {
    throw new BackupError(
      "Invalid backup data for SQL export",
      "INVALID_BACKUP_DATA",
      400
    );
  }

  const tableData = backupData.data;
  let totalRecords = 0;

  for (const [tableName, records] of Object.entries(tableData)) {
    if (!Array.isArray(records)) {
      throw new BackupError(
        `Invalid table data for ${tableName}: expected array`,
        "INVALID_TABLE_DATA",
        400
      );
    }

    totalRecords += records.length;
  }

  // Check for reasonable size limits
  if (totalRecords > 1000000) {
    throw new BackupError(
      "Backup too large for SQL export (>1M records)",
      "BACKUP_TOO_LARGE",
      400
    );
  }
}
