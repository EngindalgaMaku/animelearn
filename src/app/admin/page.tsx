"use client";

import { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  Settings,
  BarChart3,
  Shield,
  Trophy,
  Gift,
  Target,
  Clock,
  Database,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowRight,
  Activity,
  Star,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Crown,
  Diamond,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface AdminStats {
  totalUsers: number;
  totalQuestions: number;
  totalCategories: number;
  totalChallenges: number;
  activeUsers: number;
  pendingReviews: number;
  systemHealth: "good" | "warning" | "critical";
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user?: string;
  }>;
}

export default function AdminPanel() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAdminStats();
    }
  }, [user]);

  const loadAdminStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to load admin stats:", error);
      // Mock data for development
      setStats({
        totalUsers: 1247,
        totalQuestions: 156,
        totalCategories: 8,
        totalChallenges: 24,
        activeUsers: 89,
        pendingReviews: 12,
        systemHealth: "good",
        recentActivities: [
          {
            id: "1",
            type: "question_added",
            description: 'New Python question added to "Functions" category',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            user: "admin",
          },
          {
            id: "2",
            type: "user_registered",
            description: "New user registered: johnsmith",
            timestamp: new Date(Date.now() - 600000).toISOString(),
          },
          {
            id: "3",
            type: "challenge_completed",
            description:
              'Weekly challenge "Python Basics" completed by 45 users',
            timestamp: new Date(Date.now() - 900000).toISOString(),
          },
        ],
      });
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="mt-6 text-lg font-medium text-gray-600">
            Loading admin panel...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <Shield className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <p className="mb-4 text-lg font-medium text-gray-600">
            Access Denied
          </p>
          <p className="mb-4 text-sm text-gray-500">
            Please log in with admin credentials
          </p>
          <Link
            href="/login"
            className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Check if user is admin
  const isAdmin = user.role === "admin";

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <Shield className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <p className="mb-4 text-lg font-medium text-gray-600">
            Insufficient Permissions
          </p>
          <p className="mb-4 text-sm text-gray-500">
            You need admin access to view this panel
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Background Pattern */}
      <div className="bg-grid-pattern absolute inset-0 opacity-[0.02]"></div>

      <div className="relative z-10 py-3 lg:py-4">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          {/* Header */}
          <div className="mb-8">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur-sm lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 via-purple-500 to-pink-500 shadow-xl">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="bg-gradient-to-r from-gray-900 via-red-800 to-purple-800 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                      🛡️ Admin Panel
                    </h1>
                    <p className="text-gray-600">
                      System management and configuration
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="mb-2 flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-gray-600">
                      System Online
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-6 lg:gap-6">
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-xl lg:col-span-1">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
              <p className="text-sm text-blue-100">Total Users</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white shadow-xl lg:col-span-1">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{stats?.totalQuestions || 0}</p>
              <p className="text-sm text-green-100">Questions</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white shadow-xl lg:col-span-1">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Database className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">
                {stats?.totalCategories || 0}
              </p>
              <p className="text-sm text-purple-100">Categories</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white shadow-xl lg:col-span-1">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Target className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">
                {stats?.totalChallenges || 0}
              </p>
              <p className="text-sm text-orange-100">Challenges</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 p-6 text-white shadow-xl lg:col-span-1">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Activity className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{stats?.activeUsers || 0}</p>
              <p className="text-sm text-teal-100">Active Users</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 p-6 text-white shadow-xl lg:col-span-1">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Clock className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{stats?.pendingReviews || 0}</p>
              <p className="text-sm text-yellow-100">Pending Reviews</p>
            </div>
          </div>

          {/* Main Actions */}
          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              🚀 Management Tools
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
              {/* Learning Activities Management */}
              <div className="group rounded-2xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-indigo-400 hover:shadow-2xl">
                <div className="mb-6 flex items-center">
                  <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 p-3 shadow-lg">
                    <Target className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="ml-4 text-xl font-bold text-gray-900">
                    🎮 Learning Activities
                  </h2>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/admin/learning-activities"
                    className="group flex items-center rounded-xl border-2 border-indigo-200 bg-indigo-50/70 p-4 transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-indigo-500 p-2 shadow-md">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">
                        All Challenge Types
                      </p>
                      <p className="text-sm text-gray-600">
                        Manage 11 interactive challenge types
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-indigo-600 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/admin/learning-activities/stats"
                    className="group flex items-center rounded-xl border-2 border-blue-200 bg-blue-50/70 p-4 transition-all duration-200 hover:border-blue-400 hover:bg-blue-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-blue-500 p-2 shadow-md">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">
                        Activity Stats
                      </p>
                      <p className="text-sm text-gray-600">
                        Performance and completion data
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-blue-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
              {/* Quiz Management */}
              <div className="group rounded-2xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-blue-400 hover:shadow-2xl">
                <div className="mb-6 flex items-center">
                  <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-3 shadow-lg">
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="ml-4 text-xl font-bold text-gray-900">
                    📝 Quiz Management
                  </h2>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/admin/quiz"
                    className="group flex items-center rounded-xl border-2 border-blue-200 bg-blue-50/70 p-4 transition-all duration-200 hover:border-blue-400 hover:bg-blue-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-blue-500 p-2 shadow-md">
                      <Edit className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">
                        Manage Questions
                      </p>
                      <p className="text-sm text-gray-600">
                        Add, edit, delete quiz questions
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-blue-600 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/admin/quiz/categories"
                    className="group flex items-center rounded-xl border-2 border-purple-200 bg-purple-50/70 p-4 transition-all duration-200 hover:border-purple-400 hover:bg-purple-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-purple-500 p-2 shadow-md">
                      <Database className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">Categories</p>
                      <p className="text-sm text-gray-600">
                        Manage question categories
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-purple-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Blog Management */}
              <div className="group rounded-2xl border-2 border-pink-300 bg-gradient-to-br from-pink-50 to-rose-50 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-pink-400 hover:shadow-2xl">
                <div className="mb-6 flex items-center">
                  <div className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 p-3 shadow-lg">
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="ml-4 text-xl font-bold text-gray-900">
                    📝 Blog Management
                  </h2>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/admin/blog"
                    className="group flex items-center rounded-xl border-2 border-pink-200 bg-pink-50/70 p-4 transition-all duration-200 hover:border-pink-400 hover:bg-pink-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-pink-500 p-2 shadow-md">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">
                        Manage Posts
                      </p>
                      <p className="text-sm text-gray-600">
                        Create, edit, and publish blog posts
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-pink-600 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/admin/blog"
                    className="group flex items-center rounded-xl border-2 border-rose-200 bg-rose-50/70 p-4 transition-all duration-200 hover:border-rose-400 hover:bg-rose-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-rose-500 p-2 shadow-md">
                      <Settings className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">
                        Blog Settings
                      </p>
                      <p className="text-sm text-gray-600">
                        Manage categories and settings
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-rose-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* User Management */}
              <div className="group rounded-2xl border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-green-400 hover:shadow-2xl">
                <div className="mb-6 flex items-center">
                  <div className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 p-3 shadow-lg">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="ml-4 text-xl font-bold text-gray-900">
                    👥 User Management
                  </h2>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/admin/users"
                    className="group flex items-center rounded-xl border-2 border-green-200 bg-green-50/70 p-4 transition-all duration-200 hover:border-green-400 hover:bg-green-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-green-500 p-2 shadow-md">
                      <Eye className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">View Users</p>
                      <p className="text-sm text-gray-600">
                        Manage user accounts
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-green-600 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/admin/users/roles"
                    className="group flex items-center rounded-xl border-2 border-teal-200 bg-teal-50/70 p-4 transition-all duration-200 hover:border-teal-400 hover:bg-teal-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-teal-500 p-2 shadow-md">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">
                        Roles & Permissions
                      </p>
                      <p className="text-sm text-gray-600">Manage user roles</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-teal-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* System Settings */}
              <div className="group rounded-2xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-red-50 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-orange-400 hover:shadow-2xl">
                <div className="mb-6 flex items-center">
                  <div className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 p-3 shadow-lg">
                    <Settings className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="ml-4 text-xl font-bold text-gray-900">
                    ⚙️ System Settings
                  </h2>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/admin/settings/general"
                    className="group flex items-center rounded-xl border-2 border-orange-200 bg-orange-50/70 p-4 transition-all duration-200 hover:border-orange-400 hover:bg-orange-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-orange-500 p-2 shadow-md">
                      <Settings className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">
                        General Settings
                      </p>
                      <p className="text-sm text-gray-600">
                        Site configuration
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-orange-600 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/admin/analytics"
                    className="group flex items-center rounded-xl border-2 border-red-200 bg-red-50/70 p-4 transition-all duration-200 hover:border-red-400 hover:bg-red-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-red-500 p-2 shadow-md">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">Analytics</p>
                      <p className="text-sm text-gray-600">System analytics</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-red-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur-sm lg:p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  📈 Recent Activities
                </h2>
                <Link
                  href="/admin/logs"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View All Logs
                </Link>
              </div>

              <div className="space-y-4">
                {stats?.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 rounded-lg border border-gray-100 bg-gray-50/50 p-3"
                  >
                    <div className="rounded-lg bg-blue-500 p-2">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                        {activity.user && ` • by ${activity.user}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur-sm lg:p-6">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                📊 Quick Stats
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">
                      Daily Active Users
                    </span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">89</span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">
                      Completed Quizzes
                    </span>
                  </div>
                  <span className="text-xl font-bold text-green-600">234</span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500">
                      <AlertTriangle className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">
                      Pending Reviews
                    </span>
                  </div>
                  <span className="text-xl font-bold text-yellow-600">12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
