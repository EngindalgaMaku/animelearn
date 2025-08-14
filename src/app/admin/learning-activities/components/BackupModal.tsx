"use client";

import { useState } from "react";
import { Save, Download, Calendar, X, Database } from "lucide-react";

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (backupName: string) => Promise<void>;
  isLoading?: boolean;
}

export default function BackupModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: BackupModalProps) {
  const [backupName, setBackupName] = useState("");
  const [showDataInfo, setShowDataInfo] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!backupName.trim() || isLoading) return;

    await onConfirm(backupName.trim());
    setBackupName("");
  };

  const currentDate = new Date().toLocaleString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleClose = () => {
    if (!isLoading) {
      setBackupName("");
      setShowDataInfo(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Learning Activities Backup
              </h3>
              <p className="text-sm text-gray-600">
                Create a backup of all learning activities
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Backup Name Input */}
          <div>
            <label
              htmlFor="backupName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Backup Name
            </label>
            <input
              type="text"
              id="backupName"
              value={backupName}
              onChange={(e) => setBackupName(e.target.value)}
              placeholder="e.g., Weekly Backup, Before Changes, etc."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              disabled={isLoading}
              required
            />
          </div>

          {/* Backup Date Display */}
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Backup Date:</span>
              <span>{currentDate}</span>
            </div>
          </div>

          {/* Data Information */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <button
              type="button"
              onClick={() => setShowDataInfo(!showDataInfo)}
              className="flex w-full items-center justify-between text-left"
            >
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  What will be backed up?
                </span>
              </div>
              <span className="text-blue-600">{showDataInfo ? "▼" : "▶"}</span>
            </button>
            {showDataInfo && (
              <div className="mt-3 space-y-2 text-sm text-blue-800">
                <div className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                  <span>All learning activities data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                  <span>Activity configurations and settings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                  <span>Category mappings and relationships</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                  <span>Activity statistics and metadata</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !backupName.trim()}
              className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 text-white transition-all hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  <span>Creating Backup...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Create Backup</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Note */}
        <div className="mt-4 text-center text-xs text-gray-500">
          The backup will be saved with timestamp and can be restored later
        </div>
      </div>
    </div>
  );
}
