"use client";

import { useState, useEffect } from "react";
import {
  Target,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search,
  ChevronDown,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Diamond,
  Clock,
  Users,
  BarChart3,
  Gamepad2,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

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
  totalAttempts?: number;
  completionRate?: number;
  averageScore?: number;
  createdAt: string;
  updatedAt: string;
}

const activityTypeConfig = {
  algorithm_visualization: {
    name: "Algorithm Visualization",
    icon: "🔄",
    color: "from-purple-500 to-violet-600",
    description: "Step-by-step algorithm learning",
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
    description: "Interactive data analysis",
  },
  interactive_demo: {
    name: "Interactive Demo",
    icon: "🎪",
    color: "from-orange-500 to-red-600",
    description: "Guided tutorials and demos",
  },
  drag_drop: {
    name: "Drag & Drop",
    icon: "🎯",
    color: "from-indigo-500 to-blue-600",
    description: "Visual code organization",
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
    description: "Build complete programs",
  },
  class_builder: {
    name: "Class Builder",
    icon: "🏛️",
    color: "from-purple-500 to-pink-600",
    description: "Object-oriented programming",
  },
  memory_game: {
    name: "Memory Game",
    icon: "🧠",
    color: "from-pink-500 to-rose-600",
    description: "Pattern recognition challenges",
  },
  quiz: {
    name: "Quiz",
    icon: "❓",
    color: "from-emerald-500 to-teal-600",
    description: "Knowledge assessment",
  },
};

const difficultyConfig = {
  1: { label: "Beginner", color: "emerald", icon: "🌱" },
  2: { label: "Basic", color: "blue", icon: "📚" },
  3: { label: "Intermediate", color: "amber", icon: "⚡" },
  4: { label: "Advanced", color: "purple", icon: "🚀" },
  5: { label: "Expert", color: "red", icon: "👑" },
};

export default function LearningActivitiesAdmin() {
  const { user, loading } = useAuth();
  const [activities, setActivities] = useState<LearningActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<
    LearningActivity[]
  >([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user?.role === "admin") {
      loadActivities();
    }
  }, [user]);

  useEffect(() => {
    filterActivities();
  }, [
    activities,
    searchTerm,
    selectedType,
    selectedDifficulty,
    selectedCategory,
  ]);

  const loadActivities = async () => {
    try {
      setActivitiesLoading(true);
      const response = await fetch("/api/admin/learning-activities");

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data); // Debug log

        if (data.success && data.activities) {
          // Format activities to match our interface
          const formattedActivities = data.activities.map((activity: any) => ({
            ...activity,
            totalAttempts: activity.attemptsCount || 0,
            completionRate: calculateCompletionRate(activity.attempts || []),
            averageScore: calculateAverageScore(activity.attempts || []),
          }));
          setActivities(formattedActivities);
        } else {
          console.error("Invalid API response format:", data);
          setActivities([]);
        }
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("API Error:", response.status, errorData);
        alert(
          `Failed to load activities: ${errorData.error || "Unknown error"}`
        );
        setActivities([]);
      }
    } catch (error) {
      console.error("Failed to load activities:", error);
      alert(
        "Failed to connect to the server. Please check your internet connection."
      );
      setActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const calculateCompletionRate = (attempts: any[]): number => {
    if (!attempts || attempts.length === 0) return 0;
    const completed = attempts.filter((a) => a.completed).length;
    return Math.round((completed / attempts.length) * 100);
  };

  const calculateAverageScore = (attempts: any[]): number => {
    if (!attempts || attempts.length === 0) return 0;
    const completedAttempts = attempts.filter((a) => a.completed);
    if (completedAttempts.length === 0) return 0;
    const totalScore = completedAttempts.reduce(
      (sum, a) => sum + (a.score || 0),
      0
    );
    return Math.round(totalScore / completedAttempts.length);
  };

  const filterActivities = () => {
    let filtered = activities;

    if (searchTerm) {
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(
        (activity) => activity.activityType === selectedType
      );
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(
        (activity) => activity.difficulty === parseInt(selectedDifficulty)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (activity) => activity.category === selectedCategory
      );
    }

    setFilteredActivities(filtered);
  };

  const getActivityTypeStats = () => {
    const stats: { [key: string]: number } = {};
    activities.forEach((activity) => {
      stats[activity.activityType] = (stats[activity.activityType] || 0) + 1;
    });
    return stats;
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="mt-4 text-lg text-gray-600">Loading admin panel...</p>
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

  const typeStats = getActivityTypeStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="py-6 lg:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm lg:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                      🎮 Learning Activities Management
                    </h1>
                    <p className="text-gray-600">
                      Manage all 11 interactive challenge types
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    href="/admin/learning-activities/examples"
                    className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <Target className="h-5 w-5" />
                    <span>Examples</span>
                  </Link>
                  <Link
                    href="/admin/learning-activities/topics"
                    className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Manage Topics</span>
                  </Link>
                  <Link
                    href="/admin/learning-activities/create"
                    className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create Activity</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-white shadow-lg">
              <Target className="mb-2 h-6 w-6" />
              <p className="text-2xl font-bold">{activities.length}</p>
              <p className="text-sm text-blue-100">Total Activities</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-4 text-white shadow-lg">
              <Gamepad2 className="mb-2 h-6 w-6" />
              <p className="text-2xl font-bold">
                {Object.keys(typeStats).length}
              </p>
              <p className="text-sm text-green-100">Activity Types</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-4 text-white shadow-lg">
              <CheckCircle className="mb-2 h-6 w-6" />
              <p className="text-2xl font-bold">
                {activities.filter((a) => a.isActive).length}
              </p>
              <p className="text-sm text-purple-100">Active</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-orange-500 to-red-600 p-4 text-white shadow-lg">
              <Users className="mb-2 h-6 w-6" />
              <p className="text-2xl font-bold">
                {activities.reduce((sum, a) => sum + (a.totalAttempts || 0), 0)}
              </p>
              <p className="text-sm text-orange-100">Total Attempts</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 p-4 text-white shadow-lg">
              <Diamond className="mb-2 h-6 w-6" />
              <p className="text-2xl font-bold">
                {activities.reduce((sum, a) => sum + a.diamondReward, 0)}
              </p>
              <p className="text-sm text-teal-100">Total Diamonds</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 p-4 text-white shadow-lg">
              <Star className="mb-2 h-6 w-6" />
              <p className="text-2xl font-bold">
                {activities.reduce((sum, a) => sum + a.experienceReward, 0)}
              </p>
              <p className="text-sm text-yellow-100">Total XP</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-200"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 md:grid-cols-3">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2"
                >
                  <option value="">All Activity Types</option>
                  {Object.entries(activityTypeConfig).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.icon} {config.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2"
                >
                  <option value="">All Difficulties</option>
                  {Object.entries(difficultyConfig).map(([level, config]) => (
                    <option key={level} value={level}>
                      {config.icon} {config.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2"
                >
                  <option value="">All Topics</option>
                  <option value="Python Fundamentals">
                    🐍 Python Fundamentals
                  </option>
                  <option value="Data Structures">📊 Data Structures</option>
                  <option value="Algorithms">🧮 Algorithms</option>
                  <option value="Functions & OOP">🏗️ Functions & OOP</option>
                </select>
              </div>
            )}
          </div>

          {/* Topic-Based Activities Organization */}
          {activitiesLoading ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading activities...</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="py-12 text-center">
              <Target className="mx-auto h-16 w-16 text-gray-400" />
              <p className="mt-4 text-xl font-semibold text-gray-600">
                No activities found
              </p>
              <p className="text-gray-500">
                Try adjusting your search criteria or create a new activity.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Group activities by category (topic) */}
              {Object.entries(
                filteredActivities.reduce(
                  (groups, activity) => {
                    const topic = activity.category || "Uncategorized";
                    if (!groups[topic]) groups[topic] = [];
                    groups[topic].push(activity);
                    return groups;
                  },
                  {} as Record<string, LearningActivity[]>
                )
              )
                .sort(([a], [b]) => {
                  // Custom sort order for topics
                  const order = [
                    "Python Fundamentals",
                    "Data Structures",
                    "Algorithms",
                    "Functions & OOP",
                  ];
                  const aIndex = order.indexOf(a);
                  const bIndex = order.indexOf(b);
                  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                  if (aIndex !== -1) return -1;
                  if (bIndex !== -1) return 1;
                  return a.localeCompare(b);
                })
                .map(([topic, topicActivities]) => (
                  <div
                    key={topic}
                    className="rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm"
                  >
                    {/* Topic Header */}
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
                          <span className="text-2xl">
                            {topic === "Python Fundamentals"
                              ? "🐍"
                              : topic === "Data Structures"
                                ? "📊"
                                : topic === "Algorithms"
                                  ? "🧮"
                                  : topic === "Functions & OOP"
                                    ? "🏗️"
                                    : "📚"}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {topic}
                          </h2>
                          <p className="text-gray-600">
                            {topicActivities.length}{" "}
                            {topicActivities.length === 1
                              ? "activity"
                              : "activities"}
                            •{" "}
                            {topicActivities.reduce(
                              (sum, a) => sum + a.diamondReward,
                              0
                            )}{" "}
                            💎 total •{" "}
                            {topicActivities.reduce(
                              (sum, a) => sum + a.experienceReward,
                              0
                            )}{" "}
                            XP total
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                          {topicActivities.filter((a) => a.isActive).length}{" "}
                          active
                        </span>
                        <button className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200">
                          <ArrowRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Activities in this topic */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      {topicActivities
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map((activity) => {
                          const typeConfig =
                            activityTypeConfig[
                              activity.activityType as keyof typeof activityTypeConfig
                            ];
                          const diffConfig =
                            difficultyConfig[
                              activity.difficulty as keyof typeof difficultyConfig
                            ];

                          return (
                            <div
                              key={activity.id}
                              className="group rounded-lg border border-gray-200 bg-gray-50/50 p-4 transition-all hover:bg-white hover:shadow-md"
                            >
                              {/* Activity Header */}
                              <div className="mb-3 flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r ${typeConfig?.color} text-white shadow-md`}
                                  >
                                    <span className="text-lg">
                                      {typeConfig?.icon}
                                    </span>
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-gray-900">
                                      {activity.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      {typeConfig?.name} • Order:{" "}
                                      {activity.sortOrder}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`rounded-full px-2 py-1 text-xs font-semibold bg-${diffConfig?.color}-100 text-${diffConfig?.color}-700`}
                                  >
                                    {diffConfig?.icon} {diffConfig?.label}
                                  </span>
                                  <div
                                    className={`h-2 w-2 rounded-full ${activity.isActive ? "bg-green-500" : "bg-gray-400"}`}
                                  ></div>
                                </div>
                              </div>

                              {/* Description */}
                              <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                                {activity.description}
                              </p>

                              {/* Stats */}
                              <div className="mb-3 grid grid-cols-3 gap-2 text-xs">
                                <div className="text-center">
                                  <div className="font-semibold text-yellow-600">
                                    {activity.diamondReward} 💎
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="font-semibold text-purple-600">
                                    {activity.experienceReward} XP
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="font-semibold text-blue-600">
                                    {activity.estimatedMinutes}m
                                  </div>
                                </div>
                              </div>

                              {/* Performance Stats */}
                              {activity.totalAttempts && (
                                <div className="mb-3 grid grid-cols-3 gap-2 rounded-md bg-white/80 p-2 text-xs">
                                  <div className="text-center">
                                    <div className="font-semibold text-gray-900">
                                      {activity.totalAttempts}
                                    </div>
                                    <div className="text-gray-500">
                                      Attempts
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-green-600">
                                      {activity.completionRate}%
                                    </div>
                                    <div className="text-gray-500">Success</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-blue-600">
                                      {activity.averageScore}%
                                    </div>
                                    <div className="text-gray-500">Score</div>
                                  </div>
                                </div>
                              )}

                              {/* Actions */}
                              <div className="flex items-center space-x-1">
                                <Link
                                  href={`/admin/learning-activities/${activity.id}`}
                                  className="flex items-center space-x-1 rounded-md bg-indigo-100 px-2 py-1 text-xs text-indigo-700 transition-colors hover:bg-indigo-200"
                                >
                                  <Eye className="h-3 w-3" />
                                  <span>View</span>
                                </Link>
                                <Link
                                  href={`/admin/learning-activities/${activity.id}/edit`}
                                  className="flex items-center space-x-1 rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-700 transition-colors hover:bg-blue-200"
                                >
                                  <Edit className="h-3 w-3" />
                                  <span>Edit</span>
                                </Link>
                                <Link
                                  href={`/code-arena`}
                                  className="flex items-center space-x-1 rounded-md bg-green-100 px-2 py-1 text-xs text-green-700 transition-colors hover:bg-green-200"
                                >
                                  <Play className="h-3 w-3" />
                                  <span>Test</span>
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Activity Type Summary */}
          <div className="mt-8 rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              📊 Challenge Types Overview
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(activityTypeConfig).map(([key, config]) => (
                <div
                  key={key}
                  className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r ${config.color} text-white`}
                  >
                    <span className="text-lg">{config.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {config.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {typeStats[key] || 0} activities
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
