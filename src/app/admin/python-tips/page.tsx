"use client";

import { useState, useEffect } from "react";
import {
  Code,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Calendar,
  User,
  Tag,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  ExternalLink,
  Clock,
  MessageSquare,
  TrendingUp,
  Settings,
  Brain,
  Zap,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface PythonTip {
  id: string;
  title: string;
  content: string;
  codeExample?: string;
  difficulty: string;
  categoryId: string;
  xpReward: number;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  isActive: boolean;
  publishDate?: string;
  tags: string[];
  estimatedMinutes: number;
  slug?: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
    icon?: string;
  };
  _count?: {
    interactions: number;
    feedback: number;
    dailyTips: number;
  };
}

interface PythonTipCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon?: string;
  isActive: boolean;
}

export default function PythonTipsManagement() {
  const [tips, setTips] = useState<PythonTip[]>([]);
  const [categories, setCategories] = useState<PythonTipCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  // Stats state
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchTips();
    fetchCategories();
    fetchStats();
  }, [
    selectedCategory,
    selectedDifficulty,
    selectedStatus,
    searchTerm,
    currentPage,
  ]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [selectedCategory, selectedDifficulty, selectedStatus, searchTerm]);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "all")
        params.set("categoryId", selectedCategory);
      if (selectedDifficulty !== "all")
        params.set("difficulty", selectedDifficulty);
      if (selectedStatus === "active") params.set("isActive", "true");
      if (selectedStatus === "inactive") params.set("isActive", "false");
      if (searchTerm) params.set("search", searchTerm);

      // Add pagination parameters
      params.set("limit", itemsPerPage.toString());
      params.set("offset", ((currentPage - 1) * itemsPerPage).toString());

      const response = await fetch(`/api/admin/python-tips?${params}`);
      const data = await response.json();

      if (response.ok) {
        setTips(data.tips || []);
        setTotalCount(data.totalCount || 0);
        setTotalPages(Math.ceil((data.totalCount || 0) / itemsPerPage));
      } else {
        console.error("Failed to fetch tips:", data.error);
      }
    } catch (error) {
      console.error("Error fetching tips:", error);
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
      } else {
        console.error("Failed to fetch categories:", data.error);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch("/api/admin/python-tips/stats");
      const data = await response.json();

      if (response.ok) {
        setStats(data);
      } else {
        console.error("Failed to fetch stats:", data.error);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const toggleActive = async (tip: PythonTip) => {
    try {
      const response = await fetch(`/api/admin/python-tips/${tip.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !tip.isActive,
        }),
      });

      if (response.ok) {
        fetchTips();
        fetchStats(); // Refresh stats after updating
      } else {
        alert("Error updating status!");
      }
    } catch (error) {
      console.error("Error toggling active status:", error);
      alert("Error updating status!");
    }
  };

  const deleteTip = async (tip: PythonTip) => {
    if (
      !confirm(`Are you sure you want to delete "${tip.title}" Python tip?`)
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/python-tips/${tip.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTips();
        fetchStats(); // Refresh stats after deleting
        alert("Python tip deleted successfully!");
      } else {
        alert("Error deleting Python tip!");
      }
    } catch (error) {
      console.error("Error deleting tip:", error);
      alert("Error deleting Python tip!");
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
        return "Beginner";
      case "intermediate":
        return "Intermediate";
      case "advanced":
        return "Advanced";
      default:
        return difficulty;
    }
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
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 shadow-xl">
                    <Code className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="bg-gradient-to-r from-gray-900 via-yellow-800 to-orange-800 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                      🐍 Python Tips Management
                    </h1>
                    <p className="text-gray-600">
                      Manage Python tips and daily learning content
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Link
                    href="/admin/python-tips/new"
                    className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 font-semibold text-white transition-all hover:from-yellow-600 hover:to-orange-600"
                  >
                    <Plus className="h-5 w-5" />
                    <span>New Tip</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
            <div className="rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Code className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.totals?.total || 0}
              </p>
              <p className="text-sm text-yellow-100">Total Tips</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Eye className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.totals?.active || 0}
              </p>
              <p className="text-sm text-green-100">Active</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Brain className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.difficulties?.beginner || 0}
              </p>
              <p className="text-sm text-blue-100">Beginner</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Zap className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.difficulties?.intermediate || 0}
              </p>
              <p className="text-sm text-purple-100">Intermediate</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.engagement?.totalViews || 0}
              </p>
              <p className="text-sm text-red-100">Total Views</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link
                  href="/admin/python-tips/categories"
                  className="flex items-center space-x-3 rounded-xl border-2 border-blue-200 bg-blue-50 p-4 transition-all hover:border-blue-300 hover:bg-blue-100"
                >
                  <Tag className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">
                      Manage Categories
                    </p>
                    <p className="text-sm text-blue-700">
                      Create and edit tip categories
                    </p>
                  </div>
                </Link>

                <Link
                  href="/admin/python-tips/automation"
                  className="flex items-center space-x-3 rounded-xl border-2 border-purple-200 bg-purple-50 p-4 transition-all hover:border-purple-300 hover:bg-purple-100"
                >
                  <Settings className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="font-semibold text-purple-900">Automation</p>
                    <p className="text-sm text-purple-700">
                      Configure automatic daily tips
                    </p>
                  </div>
                </Link>

                <Link
                  href="/admin/python-tips/daily"
                  className="flex items-center space-x-3 rounded-xl border-2 border-green-200 bg-green-50 p-4 transition-all hover:border-green-300 hover:bg-green-100"
                >
                  <Calendar className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">Daily Tips</p>
                    <p className="text-sm text-green-700">
                      Manual daily tip schedule
                    </p>
                  </div>
                </Link>

                <button
                  onClick={() => {
                    fetchTips();
                    fetchStats();
                  }}
                  className="flex items-center space-x-3 rounded-xl border-2 border-orange-200 bg-orange-50 p-4 transition-all hover:border-orange-300 hover:bg-orange-100"
                >
                  <RefreshCw className="h-6 w-6 text-orange-600" />
                  <div>
                    <p className="font-semibold text-orange-900">
                      Refresh Data
                    </p>
                    <p className="text-sm text-orange-700">
                      Reload tips and statistics
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search tips..."
                      className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Difficulty
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={fetchTips}
                    className="w-full rounded-lg bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tips List */}
          <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Python Tips</h2>
              <div className="text-sm text-gray-600">
                Showing {tips.length} tips
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-600 border-r-transparent"></div>
              </div>
            ) : tips.length === 0 ? (
              <div className="py-12 text-center">
                <Code className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                <h3 className="mb-2 text-xl font-medium text-gray-900">
                  No Python tips found
                </h3>
                <p className="mb-4 text-gray-600">
                  {searchTerm ||
                  selectedCategory !== "all" ||
                  selectedDifficulty !== "all" ||
                  selectedStatus !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first Python tip to get started"}
                </p>
                <Link
                  href="/admin/python-tips/new"
                  className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 font-semibold text-white transition-all hover:from-yellow-600 hover:to-orange-600"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create New Tip</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {tips.map((tip) => (
                  <div
                    key={tip.id}
                    className="rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-yellow-600">
                            {tip.title}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(tip.difficulty)}`}
                          >
                            {getDifficultyText(tip.difficulty)}
                          </span>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              tip.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {tip.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <p className="mb-3 line-clamp-2 text-gray-600">
                          {tip.content.substring(0, 150)}...
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Tag className="h-4 w-4" />
                            <span style={{ color: tip.category.color }}>
                              {tip.category.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{tip.estimatedMinutes} min read</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{tip.viewCount} views</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4" />
                            <span>{tip.likeCount} likes</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BarChart3 className="h-4 w-4" />
                            <span>{tip.xpReward} XP</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(tip.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {tip.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {tip.tags.slice(0, 5).map((tag, index) => (
                              <span
                                key={index}
                                className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800"
                              >
                                #{tag}
                              </span>
                            ))}
                            {tip.tags.length > 5 && (
                              <span className="text-xs text-gray-500">
                                +{tip.tags.length - 5} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="ml-4 flex items-center space-x-2">
                        <Link
                          href={`/admin/python-tips/edit/${tip.id}`}
                          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-green-50 hover:text-green-600"
                          title="Edit Tip"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={() => toggleActive(tip)}
                          className={`rounded-lg p-2 transition-colors ${
                            tip.isActive
                              ? "text-green-600 hover:bg-green-50 hover:text-green-700"
                              : "text-gray-600 hover:bg-green-50 hover:text-green-600"
                          }`}
                          title={tip.isActive ? "Deactivate" : "Activate"}
                        >
                          {tip.isActive ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>

                        <button
                          onClick={() => deleteTip(tip)}
                          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete Tip"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && tips.length > 0 && totalPages > 1 && (
              <div className="mt-6 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
                  {totalCount} tips
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center space-x-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 7) {
                        pageNum = i + 1;
                      } else if (currentPage <= 4) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNum = totalPages - 6 + i;
                      } else {
                        pageNum = currentPage - 3 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-yellow-600 text-white"
                              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center space-x-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      currentPage === totalPages
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
