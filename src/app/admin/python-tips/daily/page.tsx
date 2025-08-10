"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  RefreshCw,
  Clock,
  BarChart3,
  Star,
  TrendingUp,
  Shuffle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface DailyPythonTip {
  id: string;
  tipId: string;
  date: string;
  isActive: boolean;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  completionRate: number;
  variant?: string;
  testingActive: boolean;
  createdAt: string;
  updatedAt: string;
  tip: {
    id: string;
    title: string;
    difficulty: string;
    estimatedMinutes: number;
    category: {
      name: string;
      color: string;
      icon?: string;
    };
  };
}

interface PythonTip {
  id: string;
  title: string;
  difficulty: string;
  estimatedMinutes: number;
  category: {
    name: string;
    color: string;
  };
}

export default function DailyPythonTipsManagement() {
  const [dailyTips, setDailyTips] = useState<DailyPythonTip[]>([]);
  const [availableTips, setAvailableTips] = useState<PythonTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignFormData, setAssignFormData] = useState({
    tipId: "",
    date: new Date().toISOString().split("T")[0],
    variant: "A",
    testingActive: false,
  });
  const [rotating, setRotating] = useState(false);

  useEffect(() => {
    fetchDailyTips();
    fetchAvailableTips();
  }, [selectedMonth]);

  const fetchDailyTips = async () => {
    try {
      setLoading(true);
      const startDate = new Date(selectedMonth + "-01");
      const endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0
      );

      const params = new URLSearchParams({
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        limit: "31",
      });

      const response = await fetch(`/api/admin/python-tips/daily?${params}`);
      const data = await response.json();

      if (response.ok) {
        setDailyTips(data.dailyTips || []);
      } else {
        console.error("Failed to fetch daily tips:", data.error);
      }
    } catch (error) {
      console.error("Error fetching daily tips:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTips = async () => {
    try {
      const response = await fetch(
        "/api/admin/python-tips?isActive=true&limit=100"
      );
      const data = await response.json();

      if (response.ok) {
        setAvailableTips(data.tips || []);
      }
    } catch (error) {
      console.error("Error fetching available tips:", error);
    }
  };

  const handleRotateDaily = async () => {
    if (
      !confirm("This will automatically assign a tip for tomorrow. Continue?")
    ) {
      return;
    }

    setRotating(true);

    try {
      const response = await fetch("/api/admin/python-tips/daily", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "rotate" }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Daily tip rotated successfully!");
        fetchDailyTips();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error rotating daily tip:", error);
      alert("Failed to rotate daily tip");
    } finally {
      setRotating(false);
    }
  };

  const handleAssignTip = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assignFormData.tipId || !assignFormData.date) {
      alert("Please select a tip and date");
      return;
    }

    try {
      const response = await fetch("/api/admin/python-tips/daily", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignFormData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Daily tip assigned successfully!");
        fetchDailyTips();
        setShowAssignForm(false);
        setAssignFormData({
          tipId: "",
          date: new Date().toISOString().split("T")[0],
          variant: "A",
          testingActive: false,
        });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error assigning daily tip:", error);
      alert("Failed to assign daily tip");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "Başlangıç";
      case "intermediate":
        return "Orta";
      case "advanced":
        return "İleri";
      default:
        return difficulty;
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const currentDate = new Date(selectedMonth + "-01");
    if (direction === "prev") {
      currentDate.setMonth(currentDate.getMonth() - 1);
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    setSelectedMonth(currentDate.toISOString().slice(0, 7));
  };

  const getCurrentMonthName = () => {
    const date = new Date(selectedMonth + "-01");
    return date.toLocaleDateString("tr-TR", { year: "numeric", month: "long" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="relative z-10 py-6 lg:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm lg:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 shadow-xl">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="bg-gradient-to-r from-gray-900 via-green-800 to-teal-800 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                      📅 Daily Python Tips
                    </h1>
                    <p className="text-gray-600">
                      Schedule and manage daily tip rotations
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleRotateDaily}
                    disabled={rotating}
                    className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-semibold text-white transition-all hover:from-orange-600 hover:to-red-600 disabled:opacity-50"
                  >
                    {rotating ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Shuffle className="h-5 w-5" />
                    )}
                    <span>Auto Rotate</span>
                  </button>

                  <button
                    onClick={() => setShowAssignForm(true)}
                    className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-semibold text-white transition-all hover:from-green-600 hover:to-emerald-600"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Assign Tip</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Calendar className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{dailyTips.length}</p>
              <p className="text-sm text-green-100">Scheduled Tips</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Eye className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">
                {dailyTips.reduce((acc, tip) => acc + tip.viewCount, 0)}
              </p>
              <p className="text-sm text-blue-100">Total Views</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Star className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">
                {dailyTips.reduce((acc, tip) => acc + tip.likeCount, 0)}
              </p>
              <p className="text-sm text-purple-100">Total Likes</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <BarChart3 className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">
                {dailyTips.length > 0
                  ? Math.round(
                      dailyTips.reduce(
                        (acc, tip) => acc + tip.completionRate,
                        0
                      ) / dailyTips.length
                    )
                  : 0}
                %
              </p>
              <p className="text-sm text-orange-100">Avg Completion</p>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="mb-8">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateMonth("prev")}
                  className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <h2 className="text-xl font-bold text-gray-900">
                  {getCurrentMonthName()}
                </h2>

                <button
                  onClick={() => navigateMonth("next")}
                  className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Daily Tips List */}
          <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Daily Tips Schedule
              </h2>
              <button
                onClick={fetchDailyTips}
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-r-transparent"></div>
              </div>
            ) : dailyTips.length === 0 ? (
              <div className="py-12 text-center">
                <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                <h3 className="mb-2 text-xl font-medium text-gray-900">
                  No tips scheduled for this month
                </h3>
                <p className="mb-4 text-gray-600">
                  Start by assigning tips to specific dates
                </p>
                <button
                  onClick={() => setShowAssignForm(true)}
                  className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-semibold text-white transition-all hover:from-green-600 hover:to-emerald-600"
                >
                  <Plus className="h-5 w-5" />
                  <span>Assign First Tip</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {dailyTips.map((dailyTip) => (
                  <div
                    key={dailyTip.id}
                    className="rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="font-semibold text-gray-900">
                              {new Date(dailyTip.date).toLocaleDateString(
                                "tr-TR",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          {dailyTip.variant && (
                            <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                              Variant {dailyTip.variant}
                            </span>
                          )}
                          {dailyTip.testingActive && (
                            <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-800">
                              A/B Testing
                            </span>
                          )}
                        </div>

                        <h3 className="mb-2 text-lg font-semibold text-gray-900">
                          {dailyTip.tip.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <div
                              className="h-3 w-3 rounded"
                              style={{
                                backgroundColor: dailyTip.tip.category.color,
                              }}
                            />
                            <span>{dailyTip.tip.category.name}</span>
                          </div>

                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(dailyTip.tip.difficulty)}`}
                          >
                            {getDifficultyText(dailyTip.tip.difficulty)}
                          </span>

                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{dailyTip.tip.estimatedMinutes} min</span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{dailyTip.viewCount} views</span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4" />
                            <span>{dailyTip.likeCount} likes</span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>
                              {Math.round(dailyTip.completionRate)}% completion
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-4 flex items-center space-x-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            dailyTip.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {dailyTip.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assign Form Modal */}
      {showAssignForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Assign Daily Tip
              </h2>
              <button
                onClick={() => setShowAssignForm(false)}
                className="rounded-lg p-2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAssignTip}>
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Select Tip *
                  </label>
                  <select
                    value={assignFormData.tipId}
                    onChange={(e) =>
                      setAssignFormData((prev) => ({
                        ...prev,
                        tipId: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Choose a Python tip</option>
                    {availableTips.map((tip) => (
                      <option key={tip.id} value={tip.id}>
                        {tip.title} ({tip.category.name} -{" "}
                        {getDifficultyText(tip.difficulty)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={assignFormData.date}
                      onChange={(e) =>
                        setAssignFormData((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Variant
                    </label>
                    <select
                      value={assignFormData.variant}
                      onChange={(e) =>
                        setAssignFormData((prev) => ({
                          ...prev,
                          variant: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-green-500"
                    >
                      <option value="A">Variant A</option>
                      <option value="B">Variant B</option>
                      <option value="C">Variant C</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="testingActive"
                    checked={assignFormData.testingActive}
                    onChange={(e) =>
                      setAssignFormData((prev) => ({
                        ...prev,
                        testingActive: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label
                    htmlFor="testingActive"
                    className="text-sm font-medium text-gray-700"
                  >
                    Enable A/B Testing
                  </label>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAssignForm(false)}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-semibold text-white transition-all hover:from-green-600 hover:to-emerald-600"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Assign Tip</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
