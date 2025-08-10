"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Clock,
  Diamond,
  Star,
  Play,
  CheckCircle,
  Lock,
  Search,
  Filter,
  ArrowRight,
  Trophy,
  Target,
  Brain,
  Users,
  Zap,
  Award,
  Home,
  User,
  Settings,
  ChevronDown,
  ChevronRight,
  Code,
  Sparkles,
  Flame,
  Shield,
  TrendingUp,
  BarChart3,
  Gamepad2,
  ArrowLeft,
  X,
  Map,
  Compass,
  Rocket,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import ActivityRenderer from "@/components/learn/ActivityRenderer";

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  activityType: string;
  difficulty: number;
  category: string;
  sortOrder: number;
  isLocked: boolean;
  prerequisiteId?: string;
  diamondReward: number;
  experienceReward: number;
  estimatedMinutes: number;
  isActive: boolean;
  content: any;
  settings?: any;
  tags: string[];
  totalAttempts: number;
  userProgress?: {
    score: number;
    maxScore: number;
    completed: boolean;
    timeSpent: number;
    hintsUsed: number;
    mistakes: number;
    startedAt: string;
    completedAt?: string;
    percentage: number;
  };
}

interface ActivitiesResponse {
  success: boolean;
  activities: LearningActivity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const DIFFICULTY_CONFIG = {
  1: {
    label: "Beginner",
    color: "from-emerald-400 to-emerald-600",
    icon: "🌱",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
  },
  2: {
    label: "Basic",
    color: "from-blue-400 to-blue-600",
    icon: "📚",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
  },
  3: {
    label: "Intermediate",
    color: "from-amber-400 to-amber-600",
    icon: "⚡",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
  },
  4: {
    label: "Advanced",
    color: "from-purple-400 to-purple-600",
    icon: "🚀",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
  },
  5: {
    label: "Expert",
    color: "from-red-400 to-red-600",
    icon: "👑",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
  },
};

const CATEGORY_CONFIG = {
  "Python Basics": {
    title: "Python Fundamentals",
    description: "Master the building blocks of Python programming",
    icon: "🐍",
    gradient: "from-green-500 to-emerald-600",
    bgGradient: "from-green-50 to-emerald-50",
    iconBg: "bg-green-500",
  },
  "Data Structures": {
    title: "Data Structures",
    description: "Learn essential data organization techniques",
    icon: "📊",
    gradient: "from-blue-500 to-cyan-600",
    bgGradient: "from-blue-50 to-cyan-50",
    iconBg: "bg-blue-500",
  },
  Algorithms: {
    title: "Algorithms",
    description: "Solve problems with efficient algorithms",
    icon: "🧮",
    gradient: "from-purple-500 to-violet-600",
    bgGradient: "from-purple-50 to-violet-50",
    iconBg: "bg-purple-500",
  },
  "Functions & OOP": {
    title: "Functions & OOP",
    description: "Object-oriented programming concepts",
    icon: "🏗️",
    gradient: "from-indigo-500 to-blue-600",
    bgGradient: "from-indigo-50 to-blue-50",
    iconBg: "bg-indigo-500",
  },
  "Web Development": {
    title: "Web Development",
    description: "Build modern web applications",
    icon: "🌐",
    gradient: "from-orange-500 to-red-600",
    bgGradient: "from-orange-50 to-red-50",
    iconBg: "bg-orange-500",
  },
  "Data Science": {
    title: "Data Science",
    description: "Analyze and visualize data",
    icon: "📈",
    gradient: "from-pink-500 to-rose-600",
    bgGradient: "from-pink-50 to-rose-50",
    iconBg: "bg-pink-500",
  },
};

const ACTIVITY_TYPE_CONFIG = {
  drag_drop: { name: "Drag & Drop", icon: "🎯", color: "text-blue-600" },
  memory_game: { name: "Memory Game", icon: "🧠", color: "text-purple-600" },
  quiz: { name: "Quiz", icon: "❓", color: "text-green-600" },
  fill_blanks: { name: "Fill Blanks", icon: "✏️", color: "text-orange-600" },
  interactive_coding: {
    name: "Code Lab",
    icon: "💻",
    color: "text-indigo-600",
  },
  algorithm_visualization: {
    name: "Algorithm Viz",
    icon: "🔄",
    color: "text-teal-600",
  },
  matching: { name: "Matching", icon: "🔗", color: "text-pink-600" },
  code_builder: { name: "Code Builder", icon: "🏗️", color: "text-cyan-600" },
  class_builder: {
    name: "Class Builder",
    icon: "🏛️",
    color: "text-violet-600",
  },
  interactive_demo: { name: "Demo", icon: "🎪", color: "text-emerald-600" },
  data_exploration: {
    name: "Data Explorer",
    icon: "🔍",
    color: "text-amber-600",
  },
};

export default function CodeArenaPage() {
  // Core states
  const [activities, setActivities] = useState<LearningActivity[]>([]);
  const [groupedActivities, setGroupedActivities] = useState<{
    [key: string]: LearningActivity[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] =
    useState<LearningActivity | null>(null);

  // UI states
  const [viewMode, setViewMode] = useState<"path" | "grid" | "categories">(
    "path"
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<{
    [key: string]: boolean;
  }>({});

  // Notification states
  const [showSuccessMessage, setShowSuccessMessage] = useState("");

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchActivities();
  }, [selectedCategory, selectedDifficulty]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchActivities();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: "50",
        ...(selectedDifficulty && { difficulty: selectedDifficulty }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/learning-activities?${params}`);
      if (response.ok) {
        const data: ActivitiesResponse = await response.json();
        setActivities(data.activities);

        // Group activities by category
        const grouped = data.activities.reduce(
          (acc, activity) => {
            if (!acc[activity.category]) {
              acc[activity.category] = [];
            }
            acc[activity.category].push(activity);
            return acc;
          },
          {} as { [key: string]: LearningActivity[] }
        );

        // Sort activities within each category
        Object.keys(grouped).forEach((category) => {
          grouped[category].sort((a, b) => a.sortOrder - b.sortOrder);
        });

        setGroupedActivities(grouped);

        // Auto-expand first category in path view
        if (viewMode === "path" && Object.keys(grouped).length > 0) {
          const firstCategory = Object.keys(grouped)[0];
          setExpandedCategories({ [firstCategory]: true });
        }
      }
    } catch (error) {
      console.error("Activities fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const launchActivity = (activity: LearningActivity) => {
    if (!isAuthenticated) {
      setShowSuccessMessage("🔐 Please sign in to start learning!");
      setTimeout(() => setShowSuccessMessage(""), 3000);
      return;
    }

    setSelectedActivity(activity);
  };

  const closeActivity = () => {
    setSelectedActivity(null);
    fetchActivities();
  };

  const getActivityStats = () => {
    const total = activities.length;
    const completed = activities.filter(
      (a) => a.userProgress?.completed
    ).length;
    const totalDiamonds = activities.reduce(
      (sum, a) => sum + a.diamondReward,
      0
    );
    const earnedDiamonds = activities
      .filter((a) => a.userProgress?.completed)
      .reduce((sum, a) => sum + a.diamondReward, 0);

    return {
      total,
      completed,
      totalDiamonds,
      earnedDiamonds,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const getCategoryProgress = (category: string) => {
    const categoryActivities = groupedActivities[category] || [];
    const completed = categoryActivities.filter(
      (a) => a.userProgress?.completed
    ).length;
    const total = categoryActivities.length;

    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const stats = getActivityStats();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-lg text-slate-600">
            Loading your coding adventure...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* View Mode Toggle Bar */}
      <div className="sticky top-16 z-30 border-b border-indigo-200/50 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 p-1 shadow-inner">
              <button
                onClick={() => setViewMode("path")}
                className={`flex items-center space-x-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  viewMode === "path"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                    : "text-slate-600 hover:bg-white hover:text-indigo-600 hover:shadow-md"
                }`}
              >
                <Map className="h-4 w-4" />
                <span className="hidden sm:inline">Learning Path</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center space-x-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                    : "text-slate-600 hover:bg-white hover:text-indigo-600 hover:shadow-md"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">All Activities</span>
              </button>
              <button
                onClick={() => setViewMode("categories")}
                className={`flex items-center space-x-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  viewMode === "categories"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                    : "text-slate-600 hover:bg-white hover:text-indigo-600 hover:shadow-md"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Categories</span>
              </button>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 p-3 text-slate-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30"></div>
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-cyan-400/30 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-pink-400/30 blur-3xl"></div>
          <div className="absolute left-1/2 top-1/2 h-64 w-64 animate-bounce rounded-full bg-yellow-400/20 blur-2xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 text-center text-white sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 flex justify-center">
              <div className="rounded-3xl bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-2 text-sm font-black text-purple-900 shadow-2xl">
                🚀 INTERACTIVE CODING CHALLENGES
              </div>
            </div>
            <h1 className="mb-8 text-5xl font-black md:text-7xl">
              <span className="block bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent drop-shadow-2xl">
                Master Programming
              </span>
              <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent drop-shadow-2xl">
                Through Epic Learning
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl font-medium text-indigo-100">
              🎯 Embark on an epic coding adventure with {stats.total}{" "}
              interactive challenges, unlock achievements, and build world-class
              programming skills!
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4"
          >
            <div className="rounded-3xl border border-white/30 bg-gradient-to-br from-white/20 to-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <div className="text-4xl font-black text-yellow-300">
                {stats.total}
              </div>
              <div className="text-sm font-bold text-cyan-200">
                Epic Challenges
              </div>
            </div>
            <div className="rounded-3xl border border-white/30 bg-gradient-to-br from-white/20 to-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <div className="text-4xl font-black text-green-300">
                {isAuthenticated ? stats.completed : 0}
              </div>
              <div className="text-sm font-bold text-cyan-200">Conquered</div>
            </div>
            <div className="rounded-3xl border border-white/30 bg-gradient-to-br from-white/20 to-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <div className="text-4xl font-black text-orange-300">
                {stats.percentage}%
              </div>
              <div className="text-sm font-bold text-cyan-200">Mastery</div>
            </div>
            <div className="rounded-3xl border border-white/30 bg-gradient-to-br from-white/20 to-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <div className="text-4xl font-black text-pink-300">
                {Object.keys(groupedActivities).length}
              </div>
              <div className="text-sm font-bold text-cyan-200">Domains</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.section
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-slate-200 bg-white"
          >
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">All Categories</option>
                  {Object.keys(groupedActivities).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">All Difficulties</option>
                  {Object.entries(DIFFICULTY_CONFIG).map(([level, config]) => (
                    <option key={level} value={level}>
                      {config.icon} {config.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                    setSelectedDifficulty("");
                  }}
                  className="rounded-xl bg-slate-100 px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed left-1/2 top-20 z-50 -translate-x-1/2 transform rounded-xl bg-green-500 px-6 py-3 text-white shadow-lg"
          >
            {showSuccessMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Learning Path View */}
        {viewMode === "path" && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="mb-2 text-3xl font-bold text-slate-900">
                Your Learning Journey
              </h2>
              <p className="text-lg text-slate-600">
                Follow the structured path to master programming concepts
              </p>
            </div>

            {Object.entries(groupedActivities).map(
              ([category, categoryActivities], categoryIndex) => {
                const progress = getCategoryProgress(category);
                const config = CATEGORY_CONFIG[
                  category as keyof typeof CATEGORY_CONFIG
                ] || {
                  title: category,
                  description: "Programming challenges",
                  icon: "💻",
                  gradient: "from-slate-500 to-slate-600",
                  bgGradient: "from-slate-50 to-slate-50",
                  iconBg: "bg-slate-500",
                };

                return (
                  <motion.section
                    key={category}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: categoryIndex * 0.1 }}
                    className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-8 shadow-2xl"
                  >
                    {/* Category Header */}
                    <div
                      className="group mb-6 flex cursor-pointer items-center justify-between"
                      onClick={() =>
                        setExpandedCategories((prev) => ({
                          ...prev,
                          [category]: !prev[category],
                        }))
                      }
                    >
                      <div className="flex items-center space-x-6">
                        <div
                          className={`h-20 w-20 rounded-3xl ${config.iconBg} flex items-center justify-center text-3xl text-white shadow-2xl transition-transform duration-300 group-hover:scale-110`}
                        >
                          {config.icon}
                        </div>
                        <div>
                          <h3 className="text-3xl font-black text-slate-900 transition-colors group-hover:text-indigo-600">
                            {config.title}
                          </h3>
                          <p className="text-lg font-medium text-slate-600">
                            {config.description}
                          </p>
                          <div className="mt-3 flex items-center space-x-6">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                              {progress.completed}/{progress.total} completed
                            </span>
                            <div className="h-3 w-40 rounded-full bg-slate-200 shadow-inner">
                              <div
                                className={`h-3 rounded-full bg-gradient-to-r ${config.gradient} shadow-lg transition-all duration-500`}
                                style={{ width: `${progress.percentage}%` }}
                              />
                            </div>
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-lg font-black text-slate-900 text-transparent">
                              {progress.percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 p-3">
                        <ChevronDown
                          className={`h-6 w-6 text-indigo-600 transition-transform ${expandedCategories[category] ? "rotate-180" : ""}`}
                        />
                      </div>
                    </div>

                    {/* Activities */}
                    <AnimatePresence>
                      {expandedCategories[category] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                        >
                          {categoryActivities.map((activity, index) => {
                            const difficultyConfig =
                              DIFFICULTY_CONFIG[
                                activity.difficulty as keyof typeof DIFFICULTY_CONFIG
                              ];
                            const activityTypeConfig =
                              ACTIVITY_TYPE_CONFIG[
                                activity.activityType as keyof typeof ACTIVITY_TYPE_CONFIG
                              ];

                            return (
                              <motion.div
                                key={activity.id}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="group rounded-3xl border-2 border-transparent bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-6 transition-all duration-300 hover:scale-105 hover:border-indigo-300 hover:shadow-2xl"
                              >
                                {/* Activity Header */}
                                <div className="mb-4 flex items-start justify-between">
                                  <div
                                    className={`h-16 w-16 rounded-2xl ${difficultyConfig.bgColor} flex items-center justify-center text-2xl shadow-xl transition-transform group-hover:scale-110`}
                                  >
                                    {difficultyConfig.icon}
                                  </div>
                                  {activity.userProgress?.completed && (
                                    <div className="rounded-full bg-gradient-to-r from-green-400 to-emerald-500 p-2 text-white shadow-lg">
                                      <CheckCircle className="h-5 w-5" />
                                    </div>
                                  )}
                                </div>

                                <h4 className="mb-3 text-xl font-black text-slate-900 transition-colors group-hover:text-indigo-600">
                                  {activity.title}
                                </h4>

                                <p className="mb-5 line-clamp-2 text-base font-medium text-slate-600">
                                  {activity.description}
                                </p>

                                {/* Activity Meta */}
                                <div className="mb-5 flex items-center justify-between">
                                  <span
                                    className={`rounded-2xl px-4 py-2 text-sm font-bold ${activityTypeConfig.color} bg-gradient-to-r from-slate-100 to-slate-200 shadow-md`}
                                  >
                                    {activityTypeConfig.icon}{" "}
                                    {activityTypeConfig.name}
                                  </span>
                                  <span
                                    className={`rounded-2xl px-4 py-2 text-sm font-bold ${difficultyConfig.textColor} ${difficultyConfig.bgColor} ${difficultyConfig.borderColor} border-2 shadow-md`}
                                  >
                                    {difficultyConfig.label}
                                  </span>
                                </div>

                                {/* Rewards */}
                                <div className="mb-5 grid grid-cols-3 gap-3 text-sm">
                                  <div className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-yellow-100 to-orange-100 p-2">
                                    <Diamond className="h-5 w-5 text-yellow-600" />
                                    <span className="font-black text-yellow-700">
                                      +{activity.diamondReward}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 p-2">
                                    <Star className="h-5 w-5 text-purple-600" />
                                    <span className="font-black text-purple-700">
                                      +{activity.experienceReward} XP
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 p-2">
                                    <Clock className="h-5 w-5 text-slate-600" />
                                    <span className="font-black text-slate-700">
                                      {activity.estimatedMinutes}m
                                    </span>
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                {activity.userProgress && (
                                  <div className="mb-5">
                                    <div className="h-3 rounded-full bg-slate-200 shadow-inner">
                                      <div
                                        className={`h-3 rounded-full shadow-lg transition-all duration-500 ${
                                          activity.userProgress.completed
                                            ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                            : "bg-gradient-to-r from-blue-400 to-indigo-500"
                                        }`}
                                        style={{
                                          width: `${activity.userProgress.percentage}%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Action Button */}
                                <button
                                  onClick={() => launchActivity(activity)}
                                  className={`flex w-full transform items-center justify-center space-x-3 rounded-2xl py-4 text-lg font-black transition-all hover:scale-105 ${
                                    activity.userProgress?.completed
                                      ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-xl hover:shadow-2xl"
                                      : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl hover:shadow-2xl"
                                  }`}
                                >
                                  {activity.userProgress?.completed ? (
                                    <>
                                      <Trophy className="h-5 w-5" />
                                      <span>🏆 REVIEW</span>
                                    </>
                                  ) : activity.userProgress ? (
                                    <>
                                      <Play className="h-5 w-5" />
                                      <span>⚡ CONTINUE</span>
                                    </>
                                  ) : (
                                    <>
                                      <Rocket className="h-5 w-5" />
                                      <span>🚀 START CHALLENGE</span>
                                    </>
                                  )}
                                </button>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.section>
                );
              }
            )}
          </div>
        )}

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="mb-2 text-3xl font-bold text-slate-900">
                All Activities
              </h2>
              <p className="text-lg text-slate-600">
                Browse all available coding challenges
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activities
                .filter(
                  (activity) =>
                    activity.title
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    activity.description
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .map((activity, index) => {
                  const difficultyConfig =
                    DIFFICULTY_CONFIG[
                      activity.difficulty as keyof typeof DIFFICULTY_CONFIG
                    ];
                  const activityTypeConfig =
                    ACTIVITY_TYPE_CONFIG[
                      activity.activityType as keyof typeof ACTIVITY_TYPE_CONFIG
                    ];

                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="group rounded-3xl border-2 border-transparent bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-6 transition-all duration-300 hover:scale-105 hover:border-indigo-300 hover:shadow-2xl"
                    >
                      {/* Enhanced activity card content */}
                      <div className="mb-4 flex items-start justify-between">
                        <div
                          className={`h-16 w-16 rounded-2xl ${difficultyConfig.bgColor} flex items-center justify-center text-2xl shadow-xl transition-transform group-hover:scale-110`}
                        >
                          {difficultyConfig.icon}
                        </div>
                        {activity.userProgress?.completed && (
                          <div className="rounded-full bg-gradient-to-r from-green-400 to-emerald-500 p-2 text-white shadow-lg">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                        )}
                      </div>

                      <h4 className="mb-3 text-xl font-black text-slate-900 transition-colors group-hover:text-indigo-600">
                        {activity.title}
                      </h4>

                      <p className="mb-5 line-clamp-2 text-base font-medium text-slate-600">
                        {activity.description}
                      </p>

                      <div className="mb-5 flex items-center justify-between">
                        <span
                          className={`rounded-2xl px-4 py-2 text-sm font-bold ${activityTypeConfig.color} bg-gradient-to-r from-slate-100 to-slate-200 shadow-md`}
                        >
                          {activityTypeConfig.icon} {activityTypeConfig.name}
                        </span>
                        <span
                          className={`rounded-2xl px-4 py-2 text-sm font-bold ${difficultyConfig.textColor} ${difficultyConfig.bgColor} ${difficultyConfig.borderColor} border-2 shadow-md`}
                        >
                          {difficultyConfig.label}
                        </span>
                      </div>

                      <div className="mb-5 grid grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-yellow-100 to-orange-100 p-2">
                          <Diamond className="h-5 w-5 text-yellow-600" />
                          <span className="font-black text-yellow-700">
                            +{activity.diamondReward}
                          </span>
                        </div>
                        <div className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 p-2">
                          <Star className="h-5 w-5 text-purple-600" />
                          <span className="font-black text-purple-700">
                            +{activity.experienceReward} XP
                          </span>
                        </div>
                        <div className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 p-2">
                          <Clock className="h-5 w-5 text-slate-600" />
                          <span className="font-black text-slate-700">
                            {activity.estimatedMinutes}m
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => launchActivity(activity)}
                        className={`flex w-full transform items-center justify-center space-x-3 rounded-2xl py-4 text-lg font-black transition-all hover:scale-105 ${
                          activity.userProgress?.completed
                            ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-xl hover:shadow-2xl"
                            : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl hover:shadow-2xl"
                        }`}
                      >
                        {activity.userProgress?.completed ? (
                          <>
                            <Trophy className="h-5 w-5" />
                            <span>🏆 REVIEW</span>
                          </>
                        ) : (
                          <>
                            <Rocket className="h-5 w-5" />
                            <span>🚀 START CHALLENGE</span>
                          </>
                        )}
                      </button>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Categories View */}
        {viewMode === "categories" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="mb-2 text-3xl font-bold text-slate-900">
                Learning Categories
              </h2>
              <p className="text-lg text-slate-600">
                Explore different programming topics
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(groupedActivities).map(
                ([category, categoryActivities], index) => {
                  const progress = getCategoryProgress(category);
                  const config = CATEGORY_CONFIG[
                    category as keyof typeof CATEGORY_CONFIG
                  ] || {
                    title: category,
                    description: "Programming challenges",
                    icon: "💻",
                    gradient: "from-slate-500 to-slate-600",
                    bgGradient: "from-slate-50 to-slate-50",
                    iconBg: "bg-slate-500",
                  };

                  return (
                    <motion.div
                      key={category}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br p-8 ${config.bgGradient} group cursor-pointer border-2 border-indigo-200 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      <div className="mb-6 flex items-start justify-between">
                        <div
                          className={`h-20 w-20 rounded-3xl ${config.iconBg} flex items-center justify-center text-3xl text-white shadow-2xl transition-transform group-hover:rotate-12 group-hover:scale-110`}
                        >
                          {config.icon}
                        </div>
                        <div className="text-right">
                          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-black text-transparent">
                            {progress.percentage}%
                          </div>
                          <div className="rounded-full bg-slate-100 px-2 py-1 text-sm font-bold text-slate-700">
                            Complete
                          </div>
                        </div>
                      </div>

                      <h3 className="mb-3 text-3xl font-black text-slate-900 transition-colors group-hover:text-indigo-600">
                        {config.title}
                      </h3>
                      <p className="mb-6 text-lg font-medium text-slate-600">
                        {config.description}
                      </p>

                      <div className="space-y-5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="rounded-full bg-slate-100 px-3 py-1 font-bold text-slate-700">
                            {progress.completed}/{progress.total} activities
                          </span>
                          <div className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-1">
                            <Diamond className="h-5 w-5 text-yellow-600" />
                            <span className="font-black text-yellow-700">
                              {categoryActivities.reduce(
                                (sum, a) => sum + a.diamondReward,
                                0
                              )}{" "}
                              diamonds
                            </span>
                          </div>
                        </div>

                        <div className="h-4 w-full rounded-full bg-white/70 shadow-inner">
                          <div
                            className={`h-4 rounded-full bg-gradient-to-r ${config.gradient} shadow-lg transition-all duration-500`}
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>

                        <button className="flex w-full items-center justify-center space-x-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 py-4 text-lg font-black text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
                          <span>
                            🎯 Explore {categoryActivities.length} Activities
                          </span>
                          <ArrowRight className="h-5 w-5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                }
              )}
            </div>
          </div>
        )}
      </main>

      {/* Activity Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <header className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {selectedActivity.title}
                  </h2>
                  <p className="text-slate-600">
                    {selectedActivity.description}
                  </p>
                </div>
                <button
                  onClick={closeActivity}
                  className="rounded-xl bg-white p-2 shadow-sm transition-shadow hover:shadow-md"
                >
                  <X className="h-5 w-5 text-slate-600" />
                </button>
              </header>

              <div className="max-h-[calc(90vh-100px)] overflow-y-auto">
                <ActivityRenderer
                  activity={selectedActivity}
                  onComplete={(score, timeSpent, success) => {
                    // Handle activity completion
                    console.log("Activity completed:", {
                      score,
                      timeSpent,
                      success,
                    });

                    // Show success message
                    if (success) {
                      setShowSuccessMessage(
                        `🎉 Great job! You scored ${score}% and earned ${selectedActivity.diamondReward} diamonds!`
                      );
                    } else {
                      setShowSuccessMessage(
                        `Good effort! You scored ${score}%. Keep practicing to improve!`
                      );
                    }

                    // Close the activity after a delay
                    setTimeout(() => {
                      closeActivity();
                      setShowSuccessMessage("");
                    }, 3000);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
