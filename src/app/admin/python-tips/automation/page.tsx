"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Play,
  Pause,
  TestTube,
  Clock,
  Shield,
  Brain,
  Target,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Zap,
  Save,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface AutomationSettings {
  isEnabled: boolean;
  rotationTime: string;
  avoidRecentDays: number;
  preferredDifficulties: string[];
  categoryWeights: Record<string, number>;
  maxConsecutiveSameDifficulty: number;
  maxConsecutiveSameCategory: number;
}

interface AutomationStatus {
  isRunning: boolean;
  settings: AutomationSettings;
  nextRotation?: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export default function AutomationSettings() {
  const [status, setStatus] = useState<AutomationStatus | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<AutomationSettings>({
    isEnabled: false,
    rotationTime: "09:00",
    avoidRecentDays: 30,
    preferredDifficulties: ["beginner", "intermediate", "advanced"],
    categoryWeights: {},
    maxConsecutiveSameDifficulty: 3,
    maxConsecutiveSameCategory: 2,
  });

  useEffect(() => {
    fetchStatus();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (status) {
      setFormData(status.settings);
    }
  }, [status]);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/admin/python-tips/automation");
      const data = await response.json();

      if (response.ok) {
        setStatus(data);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to fetch status",
        });
      }
    } catch (error) {
      console.error("Error fetching automation status:", error);
      setMessage({ type: "error", text: "Error fetching automation status" });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/python-tips/categories");
      const data = await response.json();

      if (response.ok) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/admin/python-tips/automation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings: formData }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(data.status);
        setMessage({ type: "success", text: "Settings saved successfully!" });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to save settings",
        });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({ type: "error", text: "Error saving settings" });
    } finally {
      setSaving(false);
    }
  };

  const executeAction = async (action: string) => {
    try {
      if (action === "test_rotation") {
        setTesting(true);
      }

      const response = await fetch("/api/admin/python-tips/automation", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(data.status);
        if (action === "test_rotation") {
          setMessage({
            type: "success",
            text: `Test successful! Selected tip: ${data.dailyTip?.tip?.title}`,
          });
        } else {
          setMessage({ type: "success", text: data.message });
        }
      } else {
        setMessage({ type: "error", text: data.error || "Action failed" });
      }
    } catch (error) {
      console.error("Error executing action:", error);
      setMessage({ type: "error", text: "Error executing action" });
    } finally {
      if (action === "test_rotation") {
        setTesting(false);
      }
    }
  };

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      preferredDifficulties: checked
        ? [...prev.preferredDifficulties, difficulty]
        : prev.preferredDifficulties.filter((d) => d !== difficulty),
    }));
  };

  const handleCategoryWeightChange = (categoryId: string, weight: number) => {
    setFormData((prev) => ({
      ...prev,
      categoryWeights: {
        ...prev.categoryWeights,
        [categoryId]: weight,
      },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-600 border-r-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="relative z-10 py-6 lg:py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm lg:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link
                    href="/admin/python-tips"
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 shadow-xl">
                    <Settings className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                      🤖 Daily Tip Automation
                    </h1>
                    <p className="text-gray-600">
                      Configure automatic daily Python tip rotation
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {status?.isRunning ? (
                    <div className="flex items-center space-x-2 rounded-xl bg-green-100 px-4 py-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Running</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 rounded-xl bg-red-100 px-4 py-2 text-red-800">
                      <XCircle className="h-5 w-5" />
                      <span className="font-medium">Stopped</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`mt-4 rounded-lg p-4 ${
                    message.type === "success"
                      ? "bg-green-100 text-green-800"
                      : message.type === "error"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {message.type === "success" && (
                      <CheckCircle className="h-5 w-5" />
                    )}
                    {message.type === "error" && (
                      <XCircle className="h-5 w-5" />
                    )}
                    {message.type === "info" && (
                      <AlertCircle className="h-5 w-5" />
                    )}
                    <span>{message.text}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Overview */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Zap className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">
                {status?.settings.isEnabled ? "Enabled" : "Disabled"}
              </p>
              <p className="text-sm text-green-100">Automation Status</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Clock className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{formData.rotationTime}</p>
              <p className="text-sm text-blue-100">Rotation Time</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Calendar className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">
                {status?.nextRotation
                  ? new Date(status.nextRotation).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-sm text-purple-100">Next Rotation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Basic Settings */}
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Basic Settings
              </h2>

              <div className="space-y-6">
                {/* Enable/Disable */}
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.isEnabled}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isEnabled: e.target.checked,
                        }))
                      }
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Enable Automatic Daily Tip Rotation
                    </span>
                  </label>
                </div>

                {/* Rotation Time */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Rotation Time (24-hour format)
                  </label>
                  <input
                    type="time"
                    value={formData.rotationTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        rotationTime: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Avoid Recent Days */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Avoid Recent Tips (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={formData.avoidRecentDays}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        avoidRecentDays: parseInt(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Tips used in the last X days will be avoided
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Advanced Settings
              </h2>

              <div className="space-y-6">
                {/* Max Consecutive Same Difficulty */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Max Consecutive Same Difficulty
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.maxConsecutiveSameDifficulty}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxConsecutiveSameDifficulty: parseInt(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Max Consecutive Same Category */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Max Consecutive Same Category
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.maxConsecutiveSameCategory}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxConsecutiveSameCategory: parseInt(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Difficulty Preferences */}
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Difficulty Preferences
              </h2>

              <div className="space-y-4">
                {["beginner", "intermediate", "advanced"].map((difficulty) => (
                  <label
                    key={difficulty}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="checkbox"
                      checked={formData.preferredDifficulties.includes(
                        difficulty
                      )}
                      onChange={(e) =>
                        handleDifficultyChange(difficulty, e.target.checked)
                      }
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium capitalize text-gray-700">
                      {difficulty}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Weights */}
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Category Weights
              </h2>

              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id}>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {category.name}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.categoryWeights[category.id] || 1}
                      onChange={(e) =>
                        handleCategoryWeightChange(
                          category.id,
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <p className="text-xs text-gray-500">
                  Higher weights increase the chance of selection (0 = never
                  select)
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? "Saving..." : "Save Settings"}</span>
            </button>

            <button
              onClick={() =>
                executeAction(status?.isRunning ? "stop" : "start")
              }
              className={`inline-flex items-center space-x-2 rounded-xl px-6 py-3 font-semibold text-white transition-all ${
                status?.isRunning
                  ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                  : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              }`}
            >
              {status?.isRunning ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
              <span>
                {status?.isRunning ? "Stop Automation" : "Start Automation"}
              </span>
            </button>

            <button
              onClick={() => executeAction("test_rotation")}
              disabled={testing}
              className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white transition-all hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
            >
              <TestTube className="h-5 w-5" />
              <span>{testing ? "Testing..." : "Test Rotation"}</span>
            </button>

            <button
              onClick={fetchStatus}
              className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-gray-500 to-slate-500 px-6 py-3 font-semibold text-white transition-all hover:from-gray-600 hover:to-slate-600"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Refresh Status</span>
            </button>

            {/* Current System Status */}
            <div className="mt-8 rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                System Status & Information
              </h2>

              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50 p-4">
                  <h3 className="mb-2 font-semibold text-blue-900">
                    How the Automation Works:
                  </h3>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>
                      • The system automatically selects and schedules Python
                      tips for future dates
                    </li>
                    <li>
                      • It avoids repeating tips from the last{" "}
                      {formData.avoidRecentDays} days
                    </li>
                    <li>
                      • Smart selection based on difficulty and category
                      preferences
                    </li>
                    <li>
                      • Runs daily at {formData.rotationTime} to prepare
                      tomorrow's tip
                    </li>
                    <li>• Will NOT override manually assigned daily tips</li>
                  </ul>
                </div>

                <div className="rounded-lg bg-yellow-50 p-4">
                  <h3 className="mb-2 font-semibold text-yellow-900">
                    Important Notes:
                  </h3>
                  <ul className="space-y-1 text-sm text-yellow-800">
                    <li>• Manual daily tips take priority over automation</li>
                    <li>
                      • If a date already has a tip assigned, automation will
                      skip that date
                    </li>
                    <li>
                      • Test the rotation to see which tip would be selected for
                      tomorrow
                    </li>
                    <li>
                      • The system automatically starts when the app launches
                      (if enabled)
                    </li>
                    <li>
                      • Today ({new Date().toLocaleDateString("tr-TR")}) already
                      has manual tips - automation will start from tomorrow
                    </li>
                  </ul>
                </div>

                {status?.nextRotation && (
                  <div className="rounded-lg bg-green-50 p-4">
                    <h3 className="mb-2 font-semibold text-green-900">
                      Next Scheduled Rotation:
                    </h3>
                    <p className="text-sm text-green-800">
                      {new Date(status.nextRotation).toLocaleString("tr-TR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
