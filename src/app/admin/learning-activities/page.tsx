"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
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
  ChevronLeft,
  ChevronRight,
  Database,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import BackupModal from "./components/BackupModal";

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
  attemptsCount: number;
}

interface Lesson {
  name: string;
  icon: string;
  color: string;
  description: string;
  totalActivities: number;
  activeActivities: number;
  totalDiamonds: number;
  totalXP: number;
  totalAttempts: number;
  averageCompletion: number;
  activities: LearningActivity[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
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

const lessonConfig = {
  "Python Fundamentals": {
    icon: "🐍",
    color: "from-green-500 to-emerald-600",
    description:
      "Master Python basics, variables, conditions, loops, and functions",
  },
  "Data Structures": {
    icon: "📊",
    color: "from-blue-500 to-cyan-600",
    description: "Learn arrays, lists, dictionaries, stacks, and queues",
  },
  Algorithms: {
    icon: "🧮",
    color: "from-purple-500 to-violet-600",
    description: "Explore sorting, searching, and optimization algorithms",
  },
  "Functions & OOP": {
    icon: "🏗️",
    color: "from-orange-500 to-red-600",
    description: "Advanced functions, classes, and object-oriented programming",
  },
  "Machine Learning": {
    icon: "🤖",
    color: "from-pink-500 to-rose-600",
    description: "Introduction to ML concepts and practical applications",
  },
  "Web Development": {
    icon: "🌐",
    color: "from-indigo-500 to-purple-600",
    description: "Build modern web applications with Python frameworks",
  },
};

export default function LearningActivitiesAdmin() {
  const { user, loading } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [lessonActivities, setLessonActivities] = useState<LearningActivity[]>(
    []
  );
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    activity: LearningActivity | null;
  }>({ show: false, activity: null });
  const [deleting, setDeleting] = useState(false);
  const [backupModal, setBackupModal] = useState({
    show: false,
    loading: false,
  });

  useEffect(() => {
    if (user?.role === "admin") {
      loadLessons();
    }
  }, [user]);

  useEffect(() => {
    if (selectedLesson) {
      loadLessonActivities();
    }
  }, [
    selectedLesson,
    currentPage,
    searchTerm,
    selectedType,
    selectedDifficulty,
  ]);

  const loadLessons = async () => {
    try {
      setLessonsLoading(true);
      const response = await fetch("/api/admin/learning-activities?limit=1000");

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.activities) {
          // Group activities by category to create lessons
          const activityGroups = data.activities.reduce(
            (groups: any, activity: any) => {
              const category = activity.category || "Other";
              if (!groups[category]) groups[category] = [];
              groups[category].push({
                ...activity,
                totalAttempts: activity.attemptsCount || 0,
              });
              return groups;
            },
            {}
          );

          // Convert to lesson format
          const lessonsList: Lesson[] = Object.entries(activityGroups).map(
            ([name, activities]: [string, any]) => {
              const lessonActivities = activities as LearningActivity[];
              return {
                name,
                icon:
                  lessonConfig[name as keyof typeof lessonConfig]?.icon || "📚",
                color:
                  lessonConfig[name as keyof typeof lessonConfig]?.color ||
                  "from-gray-500 to-gray-600",
                description:
                  lessonConfig[name as keyof typeof lessonConfig]
                    ?.description || "Learning activities",
                totalActivities: lessonActivities.length,
                activeActivities: lessonActivities.filter((a) => a.isActive)
                  .length,
                totalDiamonds: lessonActivities.reduce(
                  (sum, a) => sum + a.diamondReward,
                  0
                ),
                totalXP: lessonActivities.reduce(
                  (sum, a) => sum + a.experienceReward,
                  0
                ),
                totalAttempts: lessonActivities.reduce(
                  (sum, a) => sum + (a.attemptsCount || 0),
                  0
                ),
                averageCompletion:
                  lessonActivities.length > 0
                    ? Math.round(
                        (lessonActivities.filter((a) => a.isActive).length /
                          lessonActivities.length) *
                          100
                      )
                    : 0,
                activities: lessonActivities,
              };
            }
          );

          // Sort lessons by predefined order
          const lessonOrder = [
            "Python Fundamentals",
            "Data Structures",
            "Algorithms",
            "Functions & OOP",
            "Machine Learning",
            "Web Development",
          ];
          lessonsList.sort((a, b) => {
            const aIndex = lessonOrder.indexOf(a.name);
            const bIndex = lessonOrder.indexOf(b.name);
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
            return a.name.localeCompare(b.name);
          });

          setLessons(lessonsList);
        }
      }
    } catch (error) {
      console.error("Failed to load lessons:", error);
    } finally {
      setLessonsLoading(false);
    }
  };

  const loadLessonActivities = async () => {
    if (!selectedLesson) return;

    try {
      setActivitiesLoading(true);
      const params = new URLSearchParams({
        category: selectedLesson,
        page: currentPage.toString(),
        limit: "10",
      });

      if (searchTerm) params.append("search", searchTerm);
      if (selectedType) params.append("activityType", selectedType);
      if (selectedDifficulty) params.append("difficulty", selectedDifficulty);

      const response = await fetch(`/api/admin/learning-activities?${params}`);

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          setLessonActivities(data.activities || []);
          setPagination(
            data.pagination || {
              page: 1,
              limit: 10,
              total: 0,
              pages: 0,
              hasNext: false,
              hasPrev: false,
            }
          );
        }
      }
    } catch (error) {
      console.error("Failed to load lesson activities:", error);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const handleLessonSelect = (lessonName: string) => {
    setSelectedLesson(lessonName);
    setCurrentPage(1);
    setSearchTerm("");
    setSelectedType("");
    setSelectedDifficulty("");
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (activity: LearningActivity) => {
    setDeleteConfirm({ show: true, activity });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.activity) return;

    setDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/learning-activities/${deleteConfirm.activity.id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setLessonActivities((prev) =>
          prev.filter((a) => a.id !== deleteConfirm.activity!.id)
        );
        setDeleteConfirm({ show: false, activity: null });
        // Refresh lessons data
        loadLessons();
        alert("Activity deleted successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(
          `Failed to delete activity: ${errorData.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete activity. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, activity: null });
  };

  const handleBackupClick = () => {
    setBackupModal({ show: true, loading: false });
  };

  const handleBackupConfirm = async (backupName: string) => {
    setBackupModal({ show: true, loading: true });

    try {
      const response = await fetch("/api/admin/learning-activities/backup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: backupName,
          description: `Backup created on ${new Date().toLocaleString("tr-TR")}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(
          `Backup created successfully!\n\nBackup Details:\n- Name: ${data.backup.name}\n- Size: ${(data.backup.size / 1024).toFixed(2)} KB\n- Activities: ${data.backup.statistics.totalActivities}\n- Duration: ${data.backup.duration}ms`
        );
        setBackupModal({ show: false, loading: false });
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to create backup: ${errorData.error || "Unknown error"}`);
        setBackupModal({ show: true, loading: false });
      }
    } catch (error) {
      console.error("Backup error:", error);
      alert("Failed to create backup. Please try again.");
      setBackupModal({ show: true, loading: false });
    }
  };

  const handleBackupCancel = () => {
    if (!backupModal.loading) {
      setBackupModal({ show: false, loading: false });
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="py-6 lg:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm lg:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {selectedLesson && (
                    <button
                      onClick={handleBackToLessons}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                  )}
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                      {selectedLesson
                        ? `📚 ${selectedLesson}`
                        : "📚 Learning Lessons Management"}
                    </h1>
                    <p className="text-gray-600">
                      {selectedLesson
                        ? `Manage activities in ${selectedLesson}`
                        : "Organize learning content by lessons"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleBackupClick}
                    className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <Database className="h-5 w-5" />
                    <span>Backup</span>
                  </button>
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

          {!selectedLesson ? (
            // Lessons Overview
            <>
              {/* Stats Overview */}
              <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-white shadow-lg">
                  <BookOpen className="mb-2 h-6 w-6" />
                  <p className="text-2xl font-bold">{lessons.length}</p>
                  <p className="text-sm text-blue-100">Total Lessons</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-4 text-white shadow-lg">
                  <Gamepad2 className="mb-2 h-6 w-6" />
                  <p className="text-2xl font-bold">
                    {lessons.reduce((sum, l) => sum + l.totalActivities, 0)}
                  </p>
                  <p className="text-sm text-green-100">Total Activities</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-4 text-white shadow-lg">
                  <CheckCircle className="mb-2 h-6 w-6" />
                  <p className="text-2xl font-bold">
                    {lessons.reduce((sum, l) => sum + l.activeActivities, 0)}
                  </p>
                  <p className="text-sm text-purple-100">Active</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-orange-500 to-red-600 p-4 text-white shadow-lg">
                  <Users className="mb-2 h-6 w-6" />
                  <p className="text-2xl font-bold">
                    {lessons.reduce((sum, l) => sum + l.totalAttempts, 0)}
                  </p>
                  <p className="text-sm text-orange-100">Total Attempts</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 p-4 text-white shadow-lg">
                  <Diamond className="mb-2 h-6 w-6" />
                  <p className="text-2xl font-bold">
                    {lessons.reduce((sum, l) => sum + l.totalDiamonds, 0)}
                  </p>
                  <p className="text-sm text-teal-100">Total Diamonds</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 p-4 text-white shadow-lg">
                  <Star className="mb-2 h-6 w-6" />
                  <p className="text-2xl font-bold">
                    {lessons.reduce((sum, l) => sum + l.totalXP, 0)}
                  </p>
                  <p className="text-sm text-yellow-100">Total XP</p>
                </div>
              </div>

              {/* Lessons Grid */}
              {lessonsLoading ? (
                <div className="py-12 text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
                  <p className="mt-4 text-gray-600">Loading lessons...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson.name}
                      onClick={() => handleLessonSelect(lesson.name)}
                      className="group cursor-pointer rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:shadow-xl"
                    >
                      {/* Lesson Header */}
                      <div className="mb-4 flex items-center space-x-4">
                        <div
                          className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r ${lesson.color} shadow-lg`}
                        >
                          <span className="text-3xl">{lesson.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600">
                            {lesson.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {lesson.totalActivities} activities
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
                      </div>

                      {/* Description */}
                      <p className="mb-4 text-sm text-gray-600">
                        {lesson.description}
                      </p>

                      {/* Stats Grid */}
                      <div className="mb-4 grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-green-50 p-3 text-center">
                          <div className="text-lg font-bold text-green-600">
                            {lesson.activeActivities}
                          </div>
                          <div className="text-xs text-green-500">Active</div>
                        </div>
                        <div className="rounded-lg bg-blue-50 p-3 text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {lesson.totalAttempts}
                          </div>
                          <div className="text-xs text-blue-500">Attempts</div>
                        </div>
                        <div className="rounded-lg bg-yellow-50 p-3 text-center">
                          <div className="text-lg font-bold text-yellow-600">
                            {lesson.totalDiamonds} 💎
                          </div>
                          <div className="text-xs text-yellow-500">
                            Diamonds
                          </div>
                        </div>
                        <div className="rounded-lg bg-purple-50 p-3 text-center">
                          <div className="text-lg font-bold text-purple-600">
                            {lesson.totalXP} XP
                          </div>
                          <div className="text-xs text-purple-500">
                            Experience
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-gray-600">Completion</span>
                        <span className="font-semibold text-gray-800">
                          {lesson.averageCompletion}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${lesson.color}`}
                          style={{ width: `${lesson.averageCompletion}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            // Selected Lesson Activities
            <>
              {/* Filters for Activities */}
              <div className="mb-6 rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
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
                  <div className="flex items-center text-sm text-gray-600">
                    Page {pagination.page} of {pagination.pages} (
                    {pagination.total} total)
                  </div>
                </div>
              </div>

              {/* Activities List */}
              {activitiesLoading ? (
                <div className="py-12 text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
                  <p className="mt-4 text-gray-600">Loading activities...</p>
                </div>
              ) : lessonActivities.length === 0 ? (
                <div className="py-12 text-center">
                  <BookOpen className="mx-auto h-16 w-16 text-gray-400" />
                  <p className="mt-4 text-xl font-semibold text-gray-600">
                    No activities found
                  </p>
                  <p className="text-gray-500">
                    Try adjusting your search criteria or create a new activity.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {lessonActivities.map((activity) => {
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
                          className="rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex flex-1 items-start space-x-4">
                              <div
                                className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${typeConfig?.color} text-white shadow-md`}
                              >
                                <span className="text-xl">
                                  {typeConfig?.icon}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="mb-2 flex items-center space-x-3">
                                  <h3 className="text-xl font-bold text-gray-900">
                                    {activity.title}
                                  </h3>
                                  <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold bg-${diffConfig?.color}-100 text-${diffConfig?.color}-700`}
                                  >
                                    {diffConfig?.icon} {diffConfig?.label}
                                  </span>
                                  <div
                                    className={`h-2 w-2 rounded-full ${activity.isActive ? "bg-green-500" : "bg-gray-400"}`}
                                  ></div>
                                </div>
                                <p className="mb-3 text-gray-600">
                                  {activity.description}
                                </p>
                                <div className="grid grid-cols-5 gap-4 text-sm">
                                  <div className="text-center">
                                    <div className="font-semibold text-blue-600">
                                      #{activity.sortOrder}
                                    </div>
                                    <div className="text-gray-500">Order</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-yellow-600">
                                      {activity.diamondReward} 💎
                                    </div>
                                    <div className="text-gray-500">
                                      Diamonds
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-purple-600">
                                      {activity.experienceReward} XP
                                    </div>
                                    <div className="text-gray-500">
                                      Experience
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-green-600">
                                      {activity.estimatedMinutes}m
                                    </div>
                                    <div className="text-gray-500">
                                      Duration
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-orange-600">
                                      {activity.attemptsCount}
                                    </div>
                                    <div className="text-gray-500">
                                      Attempts
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Link
                                href={`/admin/learning-activities/${activity.id}`}
                                className="flex items-center space-x-1 rounded-md bg-indigo-100 px-3 py-2 text-sm text-indigo-700 transition-colors hover:bg-indigo-200"
                              >
                                <Eye className="h-4 w-4" />
                                <span>View</span>
                              </Link>
                              <Link
                                href={`/admin/learning-activities/${activity.id}/edit`}
                                className="flex items-center space-x-1 rounded-md bg-blue-100 px-3 py-2 text-sm text-blue-700 transition-colors hover:bg-blue-200"
                              >
                                <Edit className="h-4 w-4" />
                                <span>Edit</span>
                              </Link>
                              <Link
                                href={`/code-arena`}
                                className="flex items-center space-x-1 rounded-md bg-green-100 px-3 py-2 text-sm text-green-700 transition-colors hover:bg-green-200"
                              >
                                <Play className="h-4 w-4" />
                                <span>Test</span>
                              </Link>
                              <button
                                onClick={() => handleDeleteClick(activity)}
                                className="flex items-center space-x-1 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700 transition-colors hover:bg-red-200"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="mt-8 flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!pagination.hasPrev}
                        className="flex items-center space-x-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </button>

                      {Array.from(
                        { length: pagination.pages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`rounded-lg px-3 py-2 text-sm ${
                            page === pagination.page
                              ? "bg-indigo-600 text-white"
                              : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={!pagination.hasNext}
                        className="flex items-center space-x-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Activity
                </h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  "{deleteConfirm.activity?.title}"
                </span>
                ?
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup Modal */}
      <BackupModal
        isOpen={backupModal.show}
        onClose={handleBackupCancel}
        onConfirm={handleBackupConfirm}
        isLoading={backupModal.loading}
      />
    </div>
  );
}
