"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Code2,
  Trophy,
  Users,
  TrendingUp,
  Clock,
  Target,
  Award,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle,
  Brain,
  FileText,
  Lightbulb,
  Star,
  Activity,
  BarChart3,
  Eye,
  Search,
} from "lucide-react";

interface EducationAnalyticsResponse {
  summary: {
    totalUsers: number;
    activeUsers: number;
    totalQuizzes: number;
    totalCodeSubmissions: number;
    totalLearningActivities: number;
    totalBlogViews: number;
    totalPythonTipViews: number;
    totalAchievements: number;
    averageQuizScore: number;
    averageCodeArenaScore: number;
    totalLearningTime: number;
  };
  quiz: {
    stats: {
      _count: { id: number };
      _avg: { score: number; timeSpent: number };
      _sum: { score: number; timeSpent: number };
    };
    recentAttempts: Array<{
      id: string;
      score: number;
      timeSpent: number;
      completedAt: string;
      quiz: { title: string; difficulty: number };
      user: { username: string; level: number };
    }>;
    topQuizzes: Array<{
      quizId: string;
      _count: { id: number };
      _avg: { score: number };
      quiz: { id: string; title: string; difficulty: number };
    }>;
  };
  codeArena: {
    stats: {
      _count: { id: number };
      _avg: { score: number; timeSpent: number };
      _sum: { timeSpent: number };
    };
    recentSubmissions: Array<{
      id: string;
      isCorrect: boolean;
      score: number;
      submittedAt: string;
      user: { username: string; level: number };
    }>;
    topChallenges: Array<{
      codeArenaId: string;
      _count: { id: number };
      _avg: { score: number };
      codeArena: {
        id: string;
        title: string;
        difficulty: number;
        category: string;
      };
    }>;
  };
  learningActivities: {
    stats: {
      _count: { id: number };
      _avg: { score: number; timeSpent: number };
      _sum: { timeSpent: number };
    };
    recentAttempts: Array<{
      id: string;
      score: number;
      timeSpent: number;
      completedAt: string;
      activity: { title: string; activityType: string; difficulty: number };
      user: { username: string; level: number };
    }>;
  };
  blog: {
    stats: {
      _count: { id: number };
      _avg: { timeSpent: number };
      _sum: { timeSpent: number };
    };
    recentViews: Array<{
      id: string;
      timeSpent: number;
      firstViewedAt: string;
      post: { title: string; category: string; estimatedMinutes: number };
      user: { username: string; level: number };
    }>;
    topPosts: Array<{
      postId: string;
      _count: { id: number };
      _avg: { timeSpent: number };
      post: { id: string; title: string; category: string; readTime: string };
    }>;
  };
  pythonTips: {
    stats: {
      _count: { id: number };
      _avg: { timeSpent: number };
      _sum: { timeSpent: number; xpEarned: number };
    };
    recentInteractions: Array<{
      id: string;
      timeSpent: number;
      xpEarned: number;
      firstViewedAt: string;
      tip: { title: string; difficulty: string };
      user: { username: string; level: number };
    }>;
  };
  achievements: {
    stats: {
      _count: { id: number };
    };
    recentEarned: Array<{
      id: string;
      earnedAt: string;
      badge: { name: string; title: string; category: string; rarity: string };
      user: { username: string; level: number };
    }>;
  };
  engagementTimeline: Array<{
    date: string;
    daily_activities: number;
  }>;
  cardAnalytics: {
    available: boolean;
    message: string;
  };
}

export default function EducationAnalyticsPage() {
  const [analyticsData, setAnalyticsData] =
    useState<EducationAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Notification state
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const showNotification = (
    type: "success" | "error" | "warning",
    message: string
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);

      const response = await fetch(`/api/admin/analytics?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      showNotification("error", "Error loading education analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateFrom, dateTo]);

  const handleRefresh = () => {
    fetchAnalytics();
  };

  const handleClearFilters = () => {
    setDateFrom("");
    setDateTo("");
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} minutes`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDifficultyColor = (difficulty: number) => {
    const colors = {
      1: "bg-green-100 text-green-800",
      2: "bg-yellow-100 text-yellow-800",
      3: "bg-orange-100 text-orange-800",
      4: "bg-red-100 text-red-800",
      5: "bg-purple-100 text-purple-800",
    };
    return (
      colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: "bg-gray-100 text-gray-800",
      rare: "bg-blue-100 text-blue-800",
      epic: "bg-purple-100 text-purple-800",
      legendary: "bg-yellow-100 text-yellow-800",
      mythic: "bg-red-100 text-red-800",
    };
    return colors[rarity?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  if (loading && !analyticsData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">
            Loading education analytics data...
          </p>
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
                📊 Education Analytics
              </h1>
              <p className="mt-2 text-gray-600">
                Student performance and platform usage statistics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500">
                <Download className="mr-2 h-4 w-4" />
                Download Report
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

      <div className="p-6">
        {/* Filters */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Filter className="h-5 w-5" />
              Filters
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleClearFilters}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", name: "Overview", icon: BarChart3 },
                { id: "quiz", name: "Quiz Performance", icon: Brain },
                { id: "code", name: "Code Arena", icon: Code2 },
                {
                  id: "learning",
                  name: "Learning Activities",
                  icon: BookOpen,
                },
                { id: "content", name: "Content Interaction", icon: FileText },
                { id: "achievements", name: "Achievements", icon: Trophy },
                { id: "cards", name: "Card Analytics", icon: Search },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Summary Stats */}
        {analyticsData && activeTab === "overview" && (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(analyticsData.summary.totalUsers)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-green-100 p-2">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Active Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(analyticsData.summary.activeUsers)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Quizzes
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(analyticsData.summary.totalQuizzes)}
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
                      Total Learning Time
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatTime(analyticsData.summary.totalLearningTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-cyan-100 p-2">
                    <Code2 className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Code Submissions
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(analyticsData.summary.totalCodeSubmissions)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-pink-100 p-2">
                    <BookOpen className="h-6 w-6 text-pink-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Learning Activities
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(
                        analyticsData.summary.totalLearningActivities
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-indigo-100 p-2">
                    <FileText className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Blog Views
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(analyticsData.summary.totalBlogViews)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-yellow-100 p-2">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Achievements Earned
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(analyticsData.summary.totalAchievements)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Quiz Analytics */}
        {analyticsData && activeTab === "quiz" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Average Score
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.quiz.stats._avg.score?.toFixed(1) || 0}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-green-100 p-2">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Average Duration
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatTime(analyticsData.quiz.stats._avg.timeSpent || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Attempts
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(analyticsData.quiz.stats._count.id)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Quizzes */}
            {analyticsData.quiz.topQuizzes.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <TrendingUp className="h-5 w-5" />
                    Most Popular Quizzes
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {analyticsData.quiz.topQuizzes
                      .slice(0, 5)
                      .map((item, index) => (
                        <div
                          key={item.quizId}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                              #{index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {item.quiz?.title || "Unknown Quiz"}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Difficulty:
                                <span
                                  className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(item.quiz?.difficulty || 1)}`}
                                >
                                  {item.quiz?.difficulty || 1}/5
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {formatNumber(item._count.id)} attempts
                            </div>
                            <div className="text-sm text-gray-600">
                              Avg. Score: {item._avg.score?.toFixed(1) || 0}%
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Quiz Attempts */}
            {analyticsData.quiz.recentAttempts.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Activity className="h-5 w-5" />
                    Recent Quiz Attempts
                  </h2>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="p-3 text-left font-medium">User</th>
                          <th className="p-3 text-left font-medium">Quiz</th>
                          <th className="p-3 text-left font-medium">Score</th>
                          <th className="p-3 text-left font-medium">
                            Duration
                          </th>
                          <th className="p-3 text-left font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.quiz.recentAttempts.map((attempt) => (
                          <tr
                            key={attempt.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-3">
                              <div>
                                <div className="font-medium">
                                  {attempt.user.username}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Level {attempt.user.level}
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <div>
                                <div className="font-medium">
                                  {attempt.quiz.title}
                                </div>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(attempt.quiz.difficulty)}`}
                                >
                                  Difficulty {attempt.quiz.difficulty}/5
                                </span>
                              </div>
                            </td>
                            <td className="p-3">
                              <span
                                className={`font-medium ${
                                  attempt.score >= 80
                                    ? "text-green-600"
                                    : attempt.score >= 60
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }`}
                              >
                                {attempt.score}%
                              </span>
                            </td>
                            <td className="p-3 text-sm">
                              {formatTime(attempt.timeSpent)}
                            </td>
                            <td className="p-3 text-sm">
                              {formatDate(attempt.completedAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Code Arena Analytics */}
        {analyticsData && activeTab === "code" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-cyan-100 p-2">
                    <Target className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Average Score
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.codeArena.stats._avg.score?.toFixed(1) ||
                        0}
                      %
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-green-100 p-2">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Average Duration
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatTime(
                        analyticsData.codeArena.stats._avg.timeSpent || 0
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <Code2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Solutions
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(analyticsData.codeArena.stats._count.id)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Code Challenges */}
            {analyticsData.codeArena.topChallenges.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <TrendingUp className="h-5 w-5" />
                    Most Popular Code Arena Challenges
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {analyticsData.codeArena.topChallenges
                      .slice(0, 5)
                      .map((item, index) => (
                        <div
                          key={item.codeArenaId}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-600">
                              #{index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {item.codeArena?.title || "Unknown Challenge"}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(item.codeArena?.difficulty || 1)}`}
                                >
                                  Difficulty {item.codeArena?.difficulty || 1}/5
                                </span>
                                <span className="text-gray-400">•</span>
                                <span>
                                  {item.codeArena?.category || "General"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {formatNumber(item._count.id)} solutions
                            </div>
                            <div className="text-sm text-gray-600">
                              Avg. Score: {item._avg.score?.toFixed(1) || 0}%
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Code Submissions */}
            {analyticsData.codeArena.recentSubmissions.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Activity className="h-5 w-5" />
                    Recent Code Submissions
                  </h2>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="p-3 text-left font-medium">User</th>
                          <th className="p-3 text-left font-medium">Status</th>
                          <th className="p-3 text-left font-medium">Score</th>
                          <th className="p-3 text-left font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.codeArena.recentSubmissions.map(
                          (submission) => (
                            <tr
                              key={submission.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-3">
                                <div>
                                  <div className="font-medium">
                                    {submission.user.username}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Level {submission.user.level}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    submission.isCorrect
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {submission.isCorrect
                                    ? "✓ Correct"
                                    : "✗ Incorrect"}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="font-medium">
                                  {submission.score || 0}%
                                </span>
                              </td>
                              <td className="p-3 text-sm">
                                {formatDate(submission.submittedAt)}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Learning Activities Analytics */}
        {analyticsData && activeTab === "learning" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-pink-100 p-2">
                    <Target className="h-6 w-6 text-pink-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Average Score
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.learningActivities.stats._avg.score?.toFixed(
                        1
                      ) || 0}
                      %
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-green-100 p-2">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Average Duration
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatTime(
                        analyticsData.learningActivities.stats._avg.timeSpent ||
                          0
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(
                        analyticsData.learningActivities.stats._count.id
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Learning Activities */}
            {analyticsData.learningActivities.recentAttempts.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Activity className="h-5 w-5" />
                    Recent Learning Activities
                  </h2>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="p-3 text-left font-medium">User</th>
                          <th className="p-3 text-left font-medium">
                            Activity
                          </th>
                          <th className="p-3 text-left font-medium">Score</th>
                          <th className="p-3 text-left font-medium">
                            Duration
                          </th>
                          <th className="p-3 text-left font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.learningActivities.recentAttempts.map(
                          (attempt) => (
                            <tr
                              key={attempt.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-3">
                                <div>
                                  <div className="font-medium">
                                    {attempt.user.username}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Level {attempt.user.level}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <div>
                                  <div className="font-medium">
                                    {attempt.activity.title}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="capitalize">
                                      {attempt.activity.activityType}
                                    </span>
                                    <span className="text-gray-400">•</span>
                                    <span
                                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(attempt.activity.difficulty)}`}
                                    >
                                      Difficulty {attempt.activity.difficulty}/5
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <span
                                  className={`font-medium ${
                                    attempt.score >= 80
                                      ? "text-green-600"
                                      : attempt.score >= 60
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                  }`}
                                >
                                  {attempt.score}%
                                </span>
                              </td>
                              <td className="p-3 text-sm">
                                {formatTime(attempt.timeSpent)}
                              </td>
                              <td className="p-3 text-sm">
                                {formatDate(attempt.completedAt)}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content Interaction Analytics */}
        {analyticsData && activeTab === "content" && (
          <div className="space-y-8">
            {/* Blog Analytics */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <FileText className="h-5 w-5" />
                  Blog Post Analytics
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(analyticsData.blog.stats._count.id)}
                    </div>
                    <div className="text-sm text-gray-600">Total Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatTime(analyticsData.blog.stats._avg.timeSpent || 0)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Average Reading Time
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatTime(analyticsData.blog.stats._sum.timeSpent || 0)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Total Reading Time
                    </div>
                  </div>
                </div>

                {/* Top Blog Posts */}
                {analyticsData.blog.topPosts.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-lg font-medium">
                      Most Popular Blog Posts
                    </h3>
                    <div className="space-y-3">
                      {analyticsData.blog.topPosts
                        .slice(0, 5)
                        .map((item, index) => (
                          <div
                            key={item.postId}
                            className="flex items-center justify-between rounded-lg border p-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                                #{index + 1}
                              </div>
                              <div>
                                <h4 className="font-medium">
                                  {item.post?.title || "Unknown Post"}
                                </h4>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <span>
                                    {item.post?.category || "General"}
                                  </span>
                                  <span className="text-gray-400">•</span>
                                  <span>{item.post?.readTime || "5 min"}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">
                                {formatNumber(item._count.id)} views
                              </div>
                              <div className="text-sm text-gray-600">
                                Avg. Time:{" "}
                                {formatTime(item._avg.timeSpent || 0)}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Python Tips Analytics */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Lightbulb className="h-5 w-5" />
                  Python Tips Analytics
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(analyticsData.pythonTips.stats._count.id)}
                    </div>
                    <div className="text-sm text-gray-600">Tip Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatTime(
                        analyticsData.pythonTips.stats._avg.timeSpent || 0
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Average Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(
                        analyticsData.pythonTips.stats._sum.xpEarned || 0
                      )}
                    </div>
                    <div className="text-sm text-gray-600">XP Earned</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Analytics */}
        {analyticsData && activeTab === "achievements" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-yellow-100 p-2">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Achievements Earned
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(analyticsData.achievements.stats._count.id)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            {analyticsData.achievements.recentEarned.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Activity className="h-5 w-5" />
                    Recently Earned Achievements
                  </h2>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="p-3 text-left font-medium">User</th>
                          <th className="p-3 text-left font-medium">
                            Achievement
                          </th>
                          <th className="p-3 text-left font-medium">
                            Category
                          </th>
                          <th className="p-3 text-left font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.achievements.recentEarned.map(
                          (achievement) => (
                            <tr
                              key={achievement.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-3">
                                <div>
                                  <div className="font-medium">
                                    {achievement.user.username}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Level {achievement.user.level}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <div>
                                  <div className="font-medium">
                                    {achievement.badge.title}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRarityColor(achievement.badge.rarity)}`}
                                    >
                                      {achievement.badge.rarity}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-sm capitalize">
                                {achievement.badge.category}
                              </td>
                              <td className="p-3 text-sm">
                                {formatDate(achievement.earnedAt)}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Card Analytics */}
        {analyticsData && activeTab === "cards" && (
          <div className="space-y-8">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-blue-900">Card Analytics</h3>
                  <p className="text-sm text-blue-700">
                    {analyticsData.cardAnalytics.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Search className="h-5 w-5" />
                  Card Analytics Dashboard
                </h2>
              </div>
              <div className="p-6">
                <div className="py-12 text-center">
                  <Search className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    Card Analytics Available
                  </h3>
                  <p className="mb-4 text-gray-600">
                    Card analytics functionality has been moved to a dedicated
                    endpoint for better performance.
                  </p>
                  <button
                    onClick={() =>
                      window.open("/api/admin/analytics/cards", "_blank")
                    }
                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Card Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card Analytics Notice for other tabs */}
        {analyticsData &&
          activeTab !== "cards" &&
          analyticsData.cardAnalytics.available && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-blue-900">Card Analytics</h3>
                  <p className="text-sm text-blue-700">
                    {analyticsData.cardAnalytics.message}. Check the "Card
                    Analytics" tab for detailed card statistics.
                  </p>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
