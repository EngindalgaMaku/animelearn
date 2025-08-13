"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit,
  Play,
  Target,
  Diamond,
  Star,
  Clock,
  Users,
  TrendingUp,
  BarChart3,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  Copy,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  activityType: string;
  difficulty: number;
  category: string;
  sortOrder: number;
  isLocked: boolean;
  diamondReward: number;
  experienceReward: number;
  estimatedMinutes: number;
  isActive: boolean;
  tags: string[];
  content: any;
  settings: any;
  createdAt: string;
  updatedAt: string;
  attemptsCount: number;
  attempts: {
    id: string;
    score: number;
    completed: boolean;
    timeSpent: number;
    user: {
      username: string;
    };
  }[];
}

const activityTypeConfig = {
  algorithm_visualization: {
    name: "Algorithm Visualization",
    icon: "🔄",
    color: "from-purple-500 to-violet-600",
    description: "Step-by-step algorithm learning with visual components",
  },
  matching: {
    name: "Matching",
    icon: "🔗",
    color: "from-blue-500 to-cyan-600",
    description: "Connect concepts and build associations",
  },
  data_exploration: {
    name: "Data Explorer",
    icon: "🔍",
    color: "from-green-500 to-emerald-600",
    description: "Interactive data analysis activities",
  },
  interactive_demo: {
    name: "Interactive Demo",
    icon: "🎪",
    color: "from-orange-500 to-red-600",
    description: "Guided tutorials and interactive demonstrations",
  },
  drag_drop: {
    name: "Drag & Drop",
    icon: "🎯",
    color: "from-indigo-500 to-blue-600",
    description: "Visual code organization challenges",
  },
  fill_blanks: {
    name: "Fill Blanks",
    icon: "✏️",
    color: "from-yellow-500 to-orange-600",
    description: "Complete code with missing parts",
  },
  interactive_coding: {
    name: "Code Lab",
    icon: "💻",
    color: "from-cyan-500 to-blue-600",
    description: "Full hands-on coding experience",
  },
  code_builder: {
    name: "Code Builder",
    icon: "🏗️",
    color: "from-teal-500 to-green-600",
    description: "Build complete programs step by step",
  },
  class_builder: {
    name: "Class Builder",
    icon: "🏛️",
    color: "from-purple-500 to-pink-600",
    description: "Object-oriented programming challenges",
  },
  memory_game: {
    name: "Memory Game",
    icon: "🧠",
    color: "from-pink-500 to-rose-600",
    description: "Pattern recognition and memory challenges",
  },
  quiz: {
    name: "Quiz",
    icon: "❓",
    color: "from-emerald-500 to-teal-600",
    description: "Knowledge assessment with multiple choice",
  },
};

const difficultyConfig = {
  1: { label: "Beginner", color: "emerald", icon: "🌱" },
  2: { label: "Basic", color: "blue", icon: "📚" },
  3: { label: "Intermediate", color: "amber", icon: "⚡" },
  4: { label: "Advanced", color: "purple", icon: "🚀" },
  5: { label: "Expert", color: "red", icon: "👑" },
};

export default function ViewLearningActivity({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activityId, setActivityId] = useState<string>("");
  const [activity, setActivity] = useState<LearningActivity | null>(null);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setActivityId(resolvedParams.id);
    }
    getParams();
  }, [params]);

  useEffect(() => {
    if (activityId) {
      loadActivity();
    }
  }, [activityId]);

  const loadActivity = async () => {
    try {
      setLoadingActivity(true);
      const response = await fetch(
        `/api/admin/learning-activities/${activityId}`
      );

      if (response.ok) {
        const data = await response.json();
        setActivity(data.activity);
      } else {
        alert("Failed to load activity");
        router.push("/admin/learning-activities");
      }
    } catch (error) {
      console.error("Error loading activity:", error);
      alert("Failed to load activity");
      router.push("/admin/learning-activities");
    } finally {
      setLoadingActivity(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 text-gray-600">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (loadingActivity) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-16 w-16 animate-spin text-blue-600" />
          <p className="mt-4 text-lg text-gray-600">Loading activity...</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Activity Not Found
          </h1>
          <p className="mt-2 text-gray-600">
            The requested activity could not be found.
          </p>
          <Link
            href="/admin/learning-activities"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Activities
          </Link>
        </div>
      </div>
    );
  }

  const typeConfig =
    activityTypeConfig[
      activity.activityType as keyof typeof activityTypeConfig
    ];
  const diffConfig =
    difficultyConfig[activity.difficulty as keyof typeof difficultyConfig];

  // Calculate analytics
  const completedAttempts = activity.attempts?.filter((a) => a.completed) || [];
  const completionRate =
    activity.attemptsCount > 0
      ? (completedAttempts.length / activity.attemptsCount) * 100
      : 0;
  const averageScore =
    completedAttempts.length > 0
      ? completedAttempts.reduce((sum, a) => sum + a.score, 0) /
        completedAttempts.length
      : 0;
  const averageTime =
    completedAttempts.length > 0
      ? completedAttempts.reduce((sum, a) => sum + a.timeSpent, 0) /
        completedAttempts.length
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="py-6 lg:py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm lg:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link
                    href="/admin/learning-activities"
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </Link>
                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${typeConfig?.color} text-white shadow-lg`}
                    >
                      <span className="text-2xl">{typeConfig?.icon}</span>
                    </div>
                    <div>
                      <h1 className="bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                        {activity.title}
                      </h1>
                      <p className="text-gray-600">
                        {activity.category} • {typeConfig?.name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/learning-activities/${activity.id}/edit`}
                    className="flex items-center space-x-2 rounded-xl bg-blue-100 px-4 py-2 text-blue-700 transition-colors hover:bg-blue-200"
                  >
                    <Edit className="h-5 w-5" />
                    <span>Edit</span>
                  </Link>
                  <Link
                    href="/code-arena"
                    className="flex items-center space-x-2 rounded-xl bg-green-100 px-4 py-2 text-green-700 transition-colors hover:bg-green-200"
                  >
                    <Play className="h-5 w-5" />
                    <span>Test</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Activity Overview */}
              <div className="rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  📋 Activity Overview
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-700">
                      Description
                    </h3>
                    <p className="text-gray-600">
                      {activity.description || "No description provided."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="mb-2 font-semibold text-gray-700">
                        Activity Type
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{typeConfig?.icon}</span>
                        <span className="text-gray-600">
                          {typeConfig?.name}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 font-semibold text-gray-700">
                        Difficulty
                      </h3>
                      <span
                        className={`inline-flex items-center space-x-1 rounded-full px-3 py-1 text-sm font-semibold bg-${diffConfig?.color}-100 text-${diffConfig?.color}-700`}
                      >
                        <span>{diffConfig?.icon}</span>
                        <span>{diffConfig?.label}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="mb-2 font-semibold text-gray-700">
                        Sort Order
                      </h3>
                      <p className="text-gray-600">#{activity.sortOrder}</p>
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-gray-700">
                        Status
                      </h3>
                      <span
                        className={`inline-flex items-center space-x-1 rounded-full px-3 py-1 text-sm font-semibold ${
                          activity.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {activity.isActive ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        <span>{activity.isActive ? "Active" : "Inactive"}</span>
                      </span>
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-gray-700">
                        Estimated Time
                      </h3>
                      <p className="text-gray-600">
                        {activity.estimatedMinutes} minutes
                      </p>
                    </div>
                  </div>

                  {activity.tags && activity.tags.length > 0 && (
                    <div>
                      <h3 className="mb-2 font-semibold text-gray-700">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {activity.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                    <div>
                      <h3 className="mb-2 font-semibold text-gray-700">
                        Created
                      </h3>
                      <p className="text-gray-600">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-gray-700">
                        Last Updated
                      </h3>
                      <p className="text-gray-600">
                        {new Date(activity.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Content */}
              <div className="rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    📝 Activity Content
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          JSON.stringify(activity.content, null, 2)
                        )
                      }
                      className="flex items-center space-x-1 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy JSON</span>
                    </button>
                    <button
                      onClick={() => setShowContent(!showContent)}
                      className="flex items-center space-x-1 rounded-lg bg-indigo-100 px-3 py-2 text-sm text-indigo-700 transition-colors hover:bg-indigo-200"
                    >
                      <Eye className="h-4 w-4" />
                      <span>{showContent ? "Hide" : "Show"} Content</span>
                    </button>
                  </div>
                </div>

                {showContent && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <pre className="max-h-96 overflow-auto whitespace-pre-wrap text-sm text-gray-700">
                      {JSON.stringify(activity.content, null, 2)}
                    </pre>
                  </div>
                )}

                {!showContent && (
                  <div className="py-8 text-center">
                    <Eye className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                    <p className="text-gray-500">
                      Click "Show Content" to view activity configuration
                    </p>
                  </div>
                )}
              </div>

              {/* Recent Attempts */}
              <div className="rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  📊 Recent Attempts
                </h2>

                {activity.attempts && activity.attempts.length > 0 ? (
                  <div className="space-y-3">
                    {activity.attempts.map((attempt, index) => (
                      <div
                        key={attempt.id}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              attempt.completed
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {attempt.completed ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {attempt.user.username}
                            </p>
                            <p className="text-sm text-gray-600">
                              {attempt.completed ? "Completed" : "Incomplete"} •{" "}
                              {Math.round(attempt.timeSpent / 60)} minutes
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {attempt.score}%
                          </p>
                          <p className="text-sm text-gray-600">Score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Users className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                    <p className="text-gray-500">No attempts yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Rewards */}
              <div className="rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  🎁 Rewards
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-4">
                    <div className="flex items-center space-x-3">
                      <Diamond className="h-8 w-8 text-yellow-600" />
                      <div>
                        <p className="font-semibold text-yellow-900">
                          Diamonds
                        </p>
                        <p className="text-sm text-yellow-700">
                          Completion reward
                        </p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {activity.diamondReward}
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-purple-50 p-4">
                    <div className="flex items-center space-x-3">
                      <Star className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="font-semibold text-purple-900">
                          Experience
                        </p>
                        <p className="text-sm text-purple-700">XP gained</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      {activity.experienceReward}
                    </p>
                  </div>
                </div>
              </div>

              {/* Analytics */}
              <div className="rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  📈 Analytics
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">Total Attempts</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {activity.attemptsCount || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Completion Rate</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {completionRate.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      <span className="text-gray-700">Average Score</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {averageScore.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <span className="text-gray-700">Average Time</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {Math.round(averageTime / 60)}m
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Completion Progress
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {completionRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
                      style={{ width: `${Math.min(completionRate, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  ⚡ Quick Actions
                </h2>

                <div className="space-y-3">
                  <Link
                    href={`/admin/learning-activities/${activity.id}/edit`}
                    className="flex items-center justify-between rounded-lg bg-blue-50 p-3 text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    <div className="flex items-center space-x-2">
                      <Edit className="h-4 w-4" />
                      <span>Edit Activity</span>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/code-arena"
                    className="flex items-center justify-between rounded-lg bg-green-50 p-3 text-green-700 transition-colors hover:bg-green-100"
                  >
                    <div className="flex items-center space-x-2">
                      <Play className="h-4 w-4" />
                      <span>Test Activity</span>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </Link>

                  <button
                    onClick={() =>
                      copyToClipboard(`${window.location.origin}/code-arena`)
                    }
                    className="flex w-full items-center justify-between rounded-lg bg-gray-50 p-3 text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-2">
                      <Copy className="h-4 w-4" />
                      <span>Copy Link</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
