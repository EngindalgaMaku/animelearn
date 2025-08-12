"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Upload,
  Database,
  Save,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Settings,
  Eye,
  X,
  FileText,
  Shield,
  Users,
  Lock,
  Plus,
  ChevronDown,
  Server,
  Layers,
} from "lucide-react";

interface Backup {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  size: number;
  tableCount: number;
  totalRecords: number;
}

interface DatabaseBackup {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  size: number;
  type: "complete" | "structure" | "data";
}

interface BackupInfo {
  metadata: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    createdBy: string;
    version: string;
  };
  tables: Array<{
    name: string;
    recordCount: number;
  }>;
  totalRecords: number;
}

interface RestoreOptions {
  truncateFirst: boolean;
  skipUsers: boolean;
  skipSessions: boolean;
  skipSensitiveData: boolean;
}

export default function AdminBackupPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [databaseBackups, setDatabaseBackups] = useState<DatabaseBackup[]>([]);
  const [loading, setLoading] = useState(true);
  const [databaseLoading, setDatabaseLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [databaseCreating, setDatabaseCreating] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [databaseDeleting, setDatabaseDeleting] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [databaseDownloading, setDatabaseDownloading] = useState<string | null>(
    null
  );

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDatabaseCreateModal, setShowDatabaseCreateModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [backupInfo, setBackupInfo] = useState<BackupInfo | null>(null);

  // Form states
  const [backupName, setBackupName] = useState("");
  const [backupDescription, setBackupDescription] = useState("");
  const [databaseBackupName, setDatabaseBackupName] = useState("");
  const [databaseBackupDescription, setDatabaseBackupDescription] =
    useState("");
  const [databaseBackupType, setDatabaseBackupType] = useState<
    "complete" | "structure" | "data"
  >("complete");
  const [restoreOptions, setRestoreOptions] = useState<RestoreOptions>({
    truncateFirst: true,
    skipUsers: false,
    skipSessions: true,
    skipSensitiveData: true,
  });

  // Tab state
  const [activeTab, setActiveTab] = useState<"application" | "database">(
    "application"
  );

  // Notification state
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchBackups();
    fetchDatabaseBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/backup");
      if (response.ok) {
        const data = await response.json();
        setBackups(data.backups || []);
      } else {
        showNotification("error", "Failed to load backups");
      }
    } catch (error) {
      console.error("Fetch backups error:", error);
      showNotification("error", "Failed to load backups");
    } finally {
      setLoading(false);
    }
  };

  const fetchDatabaseBackups = async () => {
    try {
      setDatabaseLoading(true);
      const response = await fetch("/api/admin/database-backup");
      if (response.ok) {
        const data = await response.json();
        setDatabaseBackups(data.backups || []);
      } else {
        showNotification("error", "Failed to load database backups");
      }
    } catch (error) {
      console.error("Fetch database backups error:", error);
      showNotification("error", "Failed to load database backups");
    } finally {
      setDatabaseLoading(false);
    }
  };

  const createBackup = async () => {
    if (!backupName.trim()) {
      showNotification("error", "Backup name is required");
      return;
    }

    try {
      setCreating(true);
      const response = await fetch("/api/admin/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: backupName,
          description: backupDescription,
        }),
      });

      if (response.ok) {
        showNotification("success", "Backup created successfully!");
        setShowCreateModal(false);
        setBackupName("");
        setBackupDescription("");
        fetchBackups();
      } else {
        const error = await response.json();
        showNotification("error", error.error || "Failed to create backup");
      }
    } catch (error) {
      console.error("Create backup error:", error);
      showNotification("error", "Failed to create backup");
    } finally {
      setCreating(false);
    }
  };

  const createDatabaseBackup = async () => {
    if (!databaseBackupName.trim()) {
      showNotification("error", "Database backup name is required");
      return;
    }

    try {
      setDatabaseCreating(true);
      const response = await fetch("/api/admin/database-backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: databaseBackupName,
          description: databaseBackupDescription,
          type: databaseBackupType,
        }),
      });

      if (response.ok) {
        showNotification("success", "Database backup created successfully!");
        setShowDatabaseCreateModal(false);
        setDatabaseBackupName("");
        setDatabaseBackupDescription("");
        setDatabaseBackupType("complete");
        fetchDatabaseBackups();
      } else {
        const error = await response.json();

        if (
          response.status === 422 &&
          error.error === "PostgreSQL tools not found"
        ) {
          // Show detailed PostgreSQL installation instructions
          const instructions = error.instructions?.windows || [];
          const instructionText = instructions.slice(0, 3).join("\n");

          showNotification(
            "error",
            `PostgreSQL tools not found!\n\n${instructionText}\n\nAlternatively, use Application Data backups for Prisma-based exports.`
          );
        } else {
          showNotification(
            "error",
            error.error || "Failed to create database backup"
          );
        }
      }
    } catch (error) {
      console.error("Create database backup error:", error);
      showNotification("error", "Failed to create database backup");
    } finally {
      setDatabaseCreating(false);
    }
  };

  const deleteBackup = async (backupId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this backup? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeleting(backupId);
      const response = await fetch(`/api/admin/backup?id=${backupId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showNotification("success", "Backup deleted successfully!");
        fetchBackups();
      } else {
        const error = await response.json();
        showNotification("error", error.error || "Failed to delete backup");
      }
    } catch (error) {
      console.error("Delete backup error:", error);
      showNotification("error", "Failed to delete backup");
    } finally {
      setDeleting(null);
    }
  };

  const deleteDatabaseBackup = async (backupId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this database backup? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDatabaseDeleting(backupId);
      const response = await fetch(
        `/api/admin/database-backup?id=${backupId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        showNotification("success", "Database backup deleted successfully!");
        fetchDatabaseBackups();
      } else {
        const error = await response.json();
        showNotification(
          "error",
          error.error || "Failed to delete database backup"
        );
      }
    } catch (error) {
      console.error("Delete database backup error:", error);
      showNotification("error", "Failed to delete database backup");
    } finally {
      setDatabaseDeleting(null);
    }
  };

  const fetchBackupInfo = async (backupId: string) => {
    try {
      const response = await fetch(`/api/admin/restore?id=${backupId}`);
      if (response.ok) {
        const info = await response.json();
        setBackupInfo(info);
        setShowInfoModal(true);
      } else {
        showNotification("error", "Failed to load backup information");
      }
    } catch (error) {
      console.error("Fetch backup info error:", error);
      showNotification("error", "Failed to load backup information");
    }
  };

  const restoreBackup = async () => {
    if (!selectedBackup) return;

    const confirmMessage =
      `Are you sure you want to restore from "${selectedBackup.name}"?\n\n` +
      `This will ${restoreOptions.truncateFirst ? "DELETE ALL existing data and " : ""}restore data from the backup.\n\n` +
      `Options:\n` +
      `- Skip Users: ${restoreOptions.skipUsers ? "Yes" : "No"}\n` +
      `- Skip Sessions: ${restoreOptions.skipSessions ? "Yes" : "No"}\n` +
      `- Skip Sensitive Data: ${restoreOptions.skipSensitiveData ? "Yes" : "No"}\n\n` +
      `This action cannot be undone!`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setRestoring(true);
      const response = await fetch("/api/admin/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          backupId: selectedBackup.id,
          options: restoreOptions,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        showNotification(
          "success",
          `Database restored successfully! ${result.tablesRestored} tables restored.`
        );
        setShowRestoreModal(false);
        setSelectedBackup(null);
      } else {
        const error = await response.json();
        showNotification("error", error.error || "Failed to restore backup");
      }
    } catch (error) {
      console.error("Restore backup error:", error);
      showNotification("error", "Failed to restore backup");
    } finally {
      setRestoring(false);
    }
  };

  const downloadBackupAsSQL = async (
    backupId: string,
    backupName: string,
    exportType: "complete" | "structure" | "data"
  ) => {
    try {
      setDownloading(backupId);
      const response = await fetch(
        `/api/admin/backup?id=${backupId}&format=sql&type=${exportType}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        // Create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const suffix = exportType === "complete" ? "" : `_${exportType}`;
        link.download = `${backupId}${suffix}.sql`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        const typeLabel =
          exportType === "complete"
            ? "Complete"
            : exportType === "structure"
              ? "Structure"
              : "Data";
        showNotification(
          "success",
          `${typeLabel} SQL backup downloaded successfully!`
        );
      } else {
        const error = await response.json();
        showNotification(
          "error",
          error.error || "Failed to download SQL backup"
        );
      }
    } catch (error) {
      console.error("Download SQL backup error:", error);
      showNotification("error", "Failed to download SQL backup");
    } finally {
      setDownloading(null);
    }
  };

  const downloadDatabaseBackup = async (
    backupId: string,
    backupName: string
  ) => {
    try {
      setDatabaseDownloading(backupId);
      const response = await fetch(
        `/api/admin/database-backup?id=${backupId}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        // Create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${backupId}.sql`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showNotification("success", "Database backup downloaded successfully!");
      } else {
        const error = await response.json();
        showNotification(
          "error",
          error.error || "Failed to download database backup"
        );
      }
    } catch (error) {
      console.error("Download database backup error:", error);
      showNotification("error", "Failed to download database backup");
    } finally {
      setDatabaseDownloading(null);
    }
  };

  const showNotification = (
    type: "success" | "error" | "warning",
    message: string
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("tr-TR");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading backup management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Backup & Restore
              </h1>
              <p className="mt-2 text-gray-600">
                Manage database backups and restore points for your system
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  if (activeTab === "application") {
                    fetchBackups();
                  } else {
                    fetchDatabaseBackups();
                  }
                }}
                disabled={loading || databaseLoading}
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${loading || databaseLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button
                onClick={() => {
                  if (activeTab === "application") {
                    setShowCreateModal(true);
                  } else {
                    setShowDatabaseCreateModal(true);
                  }
                }}
                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create{" "}
                {activeTab === "application" ? "Backup" : "Database Backup"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed right-4 top-4 z-50 rounded-lg p-4 shadow-lg ${
            notification.type === "success"
              ? "border border-green-200 bg-green-50"
              : notification.type === "error"
                ? "border border-red-200 bg-red-50"
                : "border border-yellow-200 bg-yellow-50"
          }`}
        >
          <div className="flex items-center space-x-3">
            {notification.type === "success" && (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
            {notification.type === "error" && (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            {notification.type === "warning" && (
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            )}
            <p
              className={`text-sm font-medium ${
                notification.type === "success"
                  ? "text-green-800"
                  : notification.type === "error"
                    ? "text-red-800"
                    : "text-yellow-800"
              }`}
            >
              {notification.message}
            </p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("application")}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === "application"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Layers className="h-4 w-4" />
                <span>Application Data</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("database")}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === "database"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4" />
                <span>Database Backup</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      <div className="p-6">
        {activeTab === "application" && (
          <>
            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Backups
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {backups.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-green-100 p-2">
                    <HardDrive className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Size
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatFileSize(
                        backups.reduce((sum, backup) => sum + backup.size, 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Latest Backup
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {backups.length > 0
                        ? formatDate(backups[0].createdAt)
                        : "None"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-orange-100 p-2">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Avg Records
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {backups.length > 0
                        ? Math.round(
                            backups.reduce(
                              (sum, backup) => sum + backup.totalRecords,
                              0
                            ) / backups.length
                          ).toLocaleString()
                        : "0"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Backups List */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Available Backups
                </h2>
              </div>

              <div className="p-6">
                {backups.length === 0 ? (
                  <div className="py-12 text-center">
                    <Database className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No backups found
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Create your first backup to get started with data
                      protection
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Backup
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {backups.map((backup) => (
                      <div
                        key={backup.id}
                        className="rounded-lg border border-gray-200 p-6 transition-colors hover:border-gray-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="rounded-lg bg-blue-100 p-2">
                                <Save className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {backup.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {backup.description || "No description"}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                              <div>
                                <span className="text-gray-500">Created:</span>
                                <p className="font-medium">
                                  {formatDate(backup.createdAt)}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">Size:</span>
                                <p className="font-medium">
                                  {formatFileSize(backup.size)}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">Tables:</span>
                                <p className="font-medium">
                                  {backup.tableCount}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">Records:</span>
                                <p className="font-medium">
                                  {backup.totalRecords.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="ml-6 flex items-center space-x-2">
                            <button
                              onClick={() => fetchBackupInfo(backup.id)}
                              className="inline-flex items-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <div className="relative inline-flex">
                              <button
                                onClick={() =>
                                  downloadBackupAsSQL(
                                    backup.id,
                                    backup.name,
                                    "complete"
                                  )
                                }
                                disabled={downloading === backup.id}
                                className="inline-flex items-center rounded-l-lg border-r border-purple-500 bg-purple-600 px-3 py-2 text-sm text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                                title="Download Complete SQL"
                              >
                                {downloading === backup.id ? (
                                  <RefreshCw className="mr-1 h-4 w-4 animate-spin" />
                                ) : (
                                  <Download className="mr-1 h-4 w-4" />
                                )}
                                SQL
                              </button>

                              <div className="group relative">
                                <button
                                  className="inline-flex items-center justify-center rounded-r-lg bg-purple-600 px-2 py-2 text-white transition-colors hover:bg-purple-700"
                                  title="More SQL Export Options"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full z-20 mt-1 hidden w-56 rounded-lg border border-gray-200 bg-white shadow-lg group-hover:block">
                                  <div className="py-1">
                                    <button
                                      onClick={() =>
                                        downloadBackupAsSQL(
                                          backup.id,
                                          backup.name,
                                          "complete"
                                        )
                                      }
                                      disabled={downloading === backup.id}
                                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                      <Database className="mr-3 h-4 w-4 text-blue-600" />
                                      <div className="text-left">
                                        <div className="font-medium">
                                          Complete
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          Structure + Data
                                        </div>
                                      </div>
                                    </button>
                                    <button
                                      onClick={() =>
                                        downloadBackupAsSQL(
                                          backup.id,
                                          backup.name,
                                          "structure"
                                        )
                                      }
                                      disabled={downloading === backup.id}
                                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                      <Settings className="mr-3 h-4 w-4 text-green-600" />
                                      <div className="text-left">
                                        <div className="font-medium">
                                          Structure Only
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          CREATE TABLE statements
                                        </div>
                                      </div>
                                    </button>
                                    <button
                                      onClick={() =>
                                        downloadBackupAsSQL(
                                          backup.id,
                                          backup.name,
                                          "data"
                                        )
                                      }
                                      disabled={downloading === backup.id}
                                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                      <FileText className="mr-3 h-4 w-4 text-orange-600" />
                                      <div className="text-left">
                                        <div className="font-medium">
                                          Data Only
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          INSERT statements
                                        </div>
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedBackup(backup);
                                setShowRestoreModal(true);
                              }}
                              className="inline-flex items-center rounded-lg bg-green-600 px-3 py-2 text-sm text-white transition-colors hover:bg-green-700"
                            >
                              <Upload className="mr-1 h-4 w-4" />
                              Restore
                            </button>

                            <button
                              onClick={() => deleteBackup(backup.id)}
                              disabled={deleting === backup.id}
                              className="inline-flex items-center rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                              title="Delete Backup"
                            >
                              {deleting === backup.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "database" && (
          <>
            {/* Database Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <Server className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Database Backups
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {databaseBackups.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-green-100 p-2">
                    <HardDrive className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Size
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatFileSize(
                        databaseBackups.reduce(
                          (sum, backup) => sum + backup.size,
                          0
                        )
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Latest Backup
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {databaseBackups.length > 0
                        ? formatDate(databaseBackups[0].createdAt)
                        : "None"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-orange-100 p-2">
                    <Shield className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Backup Types
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Set(databaseBackups.map((b) => b.type)).size}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Database Backups List */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Database Backups (pg_dump)
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Complete PostgreSQL database backups including functions,
                  procedures, triggers, and constraints
                </p>
              </div>

              <div className="p-6">
                {databaseLoading ? (
                  <div className="py-12 text-center">
                    <RefreshCw className="mx-auto h-8 w-8 animate-spin text-gray-400" />
                    <p className="mt-4 text-gray-600">
                      Loading database backups...
                    </p>
                  </div>
                ) : databaseBackups.length === 0 ? (
                  <div className="py-12 text-center">
                    <Server className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No database backups found
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Create your first database backup using pg_dump for
                      complete database protection
                    </p>
                    <button
                      onClick={() => setShowDatabaseCreateModal(true)}
                      className="mt-4 inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Database Backup
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {databaseBackups.map((backup) => (
                      <div
                        key={backup.id}
                        className="rounded-lg border border-gray-200 p-6 transition-colors hover:border-gray-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="rounded-lg bg-purple-100 p-2">
                                <Server className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {backup.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {backup.description || "No description"}
                                </p>
                                <div className="mt-1 flex items-center space-x-4">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                      backup.type === "complete"
                                        ? "bg-blue-100 text-blue-800"
                                        : backup.type === "structure"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-orange-100 text-orange-800"
                                    }`}
                                  >
                                    {backup.type === "complete" && (
                                      <Database className="mr-1 h-3 w-3" />
                                    )}
                                    {backup.type === "structure" && (
                                      <Settings className="mr-1 h-3 w-3" />
                                    )}
                                    {backup.type === "data" && (
                                      <FileText className="mr-1 h-3 w-3" />
                                    )}
                                    {backup.type.charAt(0).toUpperCase() +
                                      backup.type.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
                              <div>
                                <span className="text-gray-500">Created:</span>
                                <p className="font-medium">
                                  {formatDate(backup.createdAt)}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">Size:</span>
                                <p className="font-medium">
                                  {formatFileSize(backup.size)}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">Type:</span>
                                <p className="font-medium capitalize">
                                  {backup.type} Backup
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="ml-6 flex items-center space-x-2">
                            <button
                              onClick={() =>
                                downloadDatabaseBackup(backup.id, backup.name)
                              }
                              disabled={databaseDownloading === backup.id}
                              className="inline-flex items-center rounded-lg bg-purple-600 px-3 py-2 text-sm text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                              title="Download Database Backup"
                            >
                              {databaseDownloading === backup.id ? (
                                <RefreshCw className="mr-1 h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="mr-1 h-4 w-4" />
                              )}
                              Download
                            </button>

                            <button
                              onClick={() => deleteDatabaseBackup(backup.id)}
                              disabled={databaseDeleting === backup.id}
                              className="inline-flex items-center rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                              title="Delete Database Backup"
                            >
                              {databaseDeleting === backup.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create Backup Modal */}
      {activeTab === "application" && showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Create New Backup
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Backup Name *
                </label>
                <input
                  type="text"
                  value={backupName}
                  onChange={(e) => setBackupName(e.target.value)}
                  placeholder="Enter backup name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={backupDescription}
                  onChange={(e) => setBackupDescription(e.target.value)}
                  placeholder="Optional description"
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 border-t p-6">
              <button
                onClick={() => setShowCreateModal(false)}
                disabled={creating}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={createBackup}
                disabled={creating || !backupName.trim()}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </div>
                ) : (
                  "Create Backup"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Database Backup Modal */}
      {activeTab === "database" && showDatabaseCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Create Database Backup
              </h2>
              <button
                onClick={() => setShowDatabaseCreateModal(false)}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Backup Name *
                </label>
                <input
                  type="text"
                  value={databaseBackupName}
                  onChange={(e) => setDatabaseBackupName(e.target.value)}
                  placeholder="Enter database backup name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={databaseBackupDescription}
                  onChange={(e) => setDatabaseBackupDescription(e.target.value)}
                  placeholder="Optional description"
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Backup Type
                </label>
                <select
                  value={databaseBackupType}
                  onChange={(e) =>
                    setDatabaseBackupType(
                      e.target.value as "complete" | "structure" | "data"
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="complete">Complete (Structure + Data)</option>
                  <option value="structure">Structure Only</option>
                  <option value="data">Data Only</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {databaseBackupType === "complete" &&
                    "Full database backup including schema and data"}
                  {databaseBackupType === "structure" &&
                    "Database schema only (tables, functions, procedures)"}
                  {databaseBackupType === "data" &&
                    "Data only (INSERT statements)"}
                </p>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="flex">
                  <Database className="mr-2 mt-0.5 h-4 w-4 text-blue-600" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">
                      Database Backup (pg_dump)
                    </h4>
                    <p className="mt-1 text-xs text-blue-700">
                      Creates a complete PostgreSQL backup including functions,
                      procedures, triggers, and constraints that
                      application-level backups cannot capture.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 border-t p-6">
              <button
                onClick={() => setShowDatabaseCreateModal(false)}
                disabled={databaseCreating}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={createDatabaseBackup}
                disabled={databaseCreating || !databaseBackupName.trim()}
                className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
              >
                {databaseCreating ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </div>
                ) : (
                  "Create Database Backup"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Modal */}
      {activeTab === "application" && showRestoreModal && selectedBackup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Restore Database
              </h2>
              <button
                onClick={() => setShowRestoreModal(false)}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex">
                  <AlertTriangle className="mr-2 mt-0.5 h-5 w-5 text-yellow-600" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">
                      Warning
                    </h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      This action will modify your database. Make sure you
                      understand the implications.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-900">
                  Selected Backup
                </h3>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="font-medium">{selectedBackup.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedBackup.description}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Created: {formatDate(selectedBackup.createdAt)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-900">
                  Restore Options
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={restoreOptions.truncateFirst}
                      onChange={(e) =>
                        setRestoreOptions((prev) => ({
                          ...prev,
                          truncateFirst: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Clear existing data first
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={restoreOptions.skipUsers}
                      onChange={(e) =>
                        setRestoreOptions((prev) => ({
                          ...prev,
                          skipUsers: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Skip user data
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={restoreOptions.skipSessions}
                      onChange={(e) =>
                        setRestoreOptions((prev) => ({
                          ...prev,
                          skipSessions: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Skip session data
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={restoreOptions.skipSensitiveData}
                      onChange={(e) =>
                        setRestoreOptions((prev) => ({
                          ...prev,
                          skipSensitiveData: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Skip sensitive data
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 border-t p-6">
              <button
                onClick={() => setShowRestoreModal(false)}
                disabled={restoring}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={restoreBackup}
                disabled={restoring}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              >
                {restoring ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Restoring...
                  </div>
                ) : (
                  "Restore Backup"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup Info Modal */}
      {activeTab === "application" && showInfoModal && backupInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Backup Information
              </h2>
              <button
                onClick={() => setShowInfoModal(false)}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-sm font-medium text-gray-900">
                    Metadata
                  </h3>
                  <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Name:</span>
                      <span className="text-sm font-medium">
                        {backupInfo.metadata.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Description:
                      </span>
                      <span className="text-sm font-medium">
                        {backupInfo.metadata.description || "None"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Created:</span>
                      <span className="text-sm font-medium">
                        {formatDate(backupInfo.metadata.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Version:</span>
                      <span className="text-sm font-medium">
                        {backupInfo.metadata.version}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Total Records:
                      </span>
                      <span className="text-sm font-medium">
                        {backupInfo.totalRecords.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-gray-900">
                    Tables ({backupInfo.tables.length})
                  </h3>
                  <div className="max-h-64 space-y-2 overflow-y-auto">
                    {backupInfo.tables.map((table) => (
                      <div
                        key={table.name}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {table.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {table.recordCount.toLocaleString()} records
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t p-6">
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
