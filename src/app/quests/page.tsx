"use client";

import { useState, useEffect } from "react";
import {
  Target,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Diamond,
  Star,
  Zap,
  Trophy,
  Gift,
  RefreshCw,
  TrendingUp,
  Award,
  Book,
  ShoppingBag,
  Code,
  Users,
  ArrowRight,
  Lock,
  Timer,
  Flame,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface DailyQuest {
  id: string;
  name: string;
  description: string;
  category: string;
  targetValue: number;
  progress: number;
  isCompleted: boolean;
  isClaimed: boolean;
  rewardDiamonds: number;
  rewardXp: number;
  difficulty: "easy" | "medium" | "hard";
  expiresAt: string;
  createdAt: string;
}

interface QuestStats {
  todayCompleted: number;
  todayTotal: number;
  streak: number;
  totalCompleted: number;
  totalDiamondsEarned: number;
  totalXpEarned: number;
  averageCompletion: number;
  categories: Array<{
    category: string;
    completed: number;
    total: number;
    percentage: number;
  }>;
}

const DIFFICULTY_COLORS = {
  easy: "bg-green-100 text-green-800 border-green-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  hard: "bg-red-100 text-red-800 border-red-300",
};

const CATEGORY_COLORS = {
  Python: "bg-blue-100 text-blue-800",
  Card: "bg-purple-100 text-purple-800",
  Social: "bg-green-100 text-green-800",
  Daily: "bg-orange-100 text-orange-800",
  Achievement: "bg-yellow-100 text-yellow-800",
  // Keep Turkish versions for backward compatibility
  Kart: "bg-purple-100 text-purple-800",
  Sosyal: "bg-green-100 text-green-800",
  Günlük: "bg-orange-100 text-orange-800",
  Başarı: "bg-yellow-100 text-yellow-800",
};

const CATEGORY_ICONS = {
  Python: Code,
  Card: ShoppingBag,
  Social: Users,
  Daily: Calendar,
  Achievement: Trophy,
  // Keep Turkish versions for backward compatibility
  Kart: ShoppingBag,
  Sosyal: Users,
  Günlük: Calendar,
  Başarı: Trophy,
};

export default function QuestsPage() {
  const [quests, setQuests] = useState<DailyQuest[]>([]);
  const [stats, setStats] = useState<QuestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { isAuthenticated, user, refreshUser } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchQuests();
    }
  }, [isAuthenticated]);

  const fetchQuests = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/daily-quests");
      if (response.ok) {
        const data = await response.json();
        setQuests(data.quests || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Quests fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (questId: string) => {
    setClaiming(questId);
    try {
      const response = await fetch("/api/daily-quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(
          `🎉 Reward successfully claimed! +${data.reward.diamonds} diamonds, +${data.reward.xp} XP`
        );
        fetchQuests(); // Refresh quests
        refreshUser(); // Refresh user information
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error("Claim failed:", error);
      alert("An error occurred while claiming reward!");
    } finally {
      setClaiming(null);
    }
  };

  const generateNewQuests = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/daily-quests", {
        method: "PUT",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("🔄 New daily quests generated!");
        fetchQuests();
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error("Generate failed:", error);
      alert("An error occurred while generating new quests!");
    } finally {
      setRefreshing(false);
    }
  };

  // Filtreleme - Extra defensive
  const safeQuests = Array.isArray(quests) ? quests : [];
  const filteredQuests = safeQuests.filter((quest) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "completed") return quest.isCompleted;
    if (selectedCategory === "pending") return !quest.isCompleted;
    return quest.category === selectedCategory;
  });

  // Kategoriler - Extra defensive
  const categories = Array.from(new Set(safeQuests.map((q) => q.category)));

  // Time remaining calculation
  const getTimeRemaining = (expiresAt: string) => {
    try {
      const now = new Date();
      const expires = new Date(expiresAt);

      // Check if date is valid
      if (isNaN(expires.getTime())) return "Invalid date";

      const diff = expires.getTime() - now.getTime();

      if (diff <= 0) return "Expired";

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      // Ensure values are valid numbers
      if (isNaN(hours) || isNaN(minutes)) return "Invalid time";

      if (hours > 0) {
        return `${hours}h ${minutes}m left`;
      } else {
        return `${minutes}m left`;
      }
    } catch (error) {
      console.error("Time calculation error:", error);
      return "Time error";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Daily Quests
          </h1>
          <p className="text-gray-600 mb-6">
            You need to log in to view daily quests.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Sign In
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading daily quests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🎯 Today's Quests
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete daily quests to earn diamonds and experience points! Quests
            refresh every day at midnight.
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.todayCompleted}/{stats.todayTotal}
              </div>
              <div className="text-gray-600">Completed Today</div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{
                    width: `${
                      stats.todayTotal > 0
                        ? (stats.todayCompleted / stats.todayTotal) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
              <Flame className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.streak}
              </div>
              <div className="text-gray-600">Day Streak</div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
              <Diamond className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalDiamondsEarned}
              </div>
              <div className="text-gray-600">Total Diamonds</div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.averageCompletion?.toFixed(1) || "0.0"}%
              </div>
              <div className="text-gray-600">Average Completion</div>
            </div>
          </div>
        )}

        {/* Category Progress */}
        {stats && stats.categories && stats.categories.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              📊 Category Progress
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(stats.categories || []).map((category) => (
                <div
                  key={category.category}
                  className="bg-white rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        CATEGORY_COLORS[
                          category.category as keyof typeof CATEGORY_COLORS
                        ] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {category.category}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      {category.completed}/{category.total}
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {category.percentage?.toFixed(1) || "0.0"}% completed
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                🎯 All ({safeQuests.length})
              </button>
              <button
                onClick={() => setSelectedCategory("completed")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === "completed"
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                ✅ Completed ({safeQuests.filter((q) => q.isCompleted).length})
              </button>
              <button
                onClick={() => setSelectedCategory("pending")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === "pending"
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                ⏳ Pending ({safeQuests.filter((q) => !q.isCompleted).length})
              </button>

              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? CATEGORY_COLORS[
                          category as keyof typeof CATEGORY_COLORS
                        ] || "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={generateNewQuests}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>{refreshing ? "Refreshing..." : "New Quests"}</span>
            </button>
          </div>
        </div>

        {/* Quests List */}
        {filteredQuests.length === 0 ? (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No Quests Found
            </h3>
            <p className="text-gray-600 mb-4">
              No quests match your selected criteria.
            </p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show All Quests
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuests.map((quest) => {
              const IconComponent =
                CATEGORY_ICONS[quest.category as keyof typeof CATEGORY_ICONS] ||
                Target;
              const progressPercentage =
                quest.targetValue > 0
                  ? (quest.progress / quest.targetValue) * 100
                  : 0;
              const timeRemaining = getTimeRemaining(quest.expiresAt);

              return (
                <div
                  key={quest.id}
                  className={`rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    quest.isCompleted
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
                      : "bg-white/80 backdrop-blur-sm"
                  }`}
                >
                  <div className="p-6">
                    {/* Quest Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            quest.isCompleted
                              ? "bg-green-500"
                              : "bg-gradient-to-r from-blue-500 to-purple-500"
                          }`}
                        >
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              CATEGORY_COLORS[
                                quest.category as keyof typeof CATEGORY_COLORS
                              ]
                            }`}
                          >
                            {quest.category}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            DIFFICULTY_COLORS[quest.difficulty]
                          }`}
                        >
                          {quest.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Quest Info */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg mb-2">
                          {quest.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {quest.description}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Progress
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {quest.progress}/{quest.targetValue}
                          </span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-1000 ${
                              quest.isCompleted
                                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                : "bg-gradient-to-r from-blue-500 to-purple-500"
                            }`}
                            style={{
                              width: `${Math.min(progressPercentage, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {progressPercentage?.toFixed(1) || "0.0"}% completed
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {quest.isCompleted ? (
                            <div className="flex items-center space-x-1 text-green-700">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                Completed!
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-orange-600">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">{timeRemaining}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Rewards */}
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl border border-yellow-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Diamond className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-medium text-yellow-700">
                                +{quest.rewardDiamonds || 0}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Zap className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium text-blue-700">
                                +{quest.rewardXp || 0} XP
                              </span>
                            </div>
                          </div>

                          {quest.isCompleted && !quest.isClaimed && (
                            <button
                              onClick={() => claimReward(quest.id)}
                              disabled={claiming === quest.id}
                              className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all"
                            >
                              {claiming === quest.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                                  <span>Claiming...</span>
                                </>
                              ) : (
                                <>
                                  <Gift className="h-3 w-3" />
                                  <span>Claim Reward</span>
                                </>
                              )}
                            </button>
                          )}

                          {quest.isClaimed && (
                            <div className="flex items-center space-x-1 text-green-700">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                Claimed
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Suggestions */}
                      {!quest.isCompleted && (
                        <div className="text-center pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-600 mb-2">
                            To complete this quest:
                          </p>
                          <div className="flex justify-center space-x-2">
                            {quest.category === "Python" && (
                              <Link
                                href="/code-arena"
                                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700 transition-colors"
                              >
                                <Book className="h-3 w-3 mr-1" />
                                Battle
                              </Link>
                            )}
                            {(quest.category === "Kart" ||
                              quest.category === "Card") && (
                              <Link
                                href="/shop"
                                className="inline-flex items-center px-3 py-1 bg-purple-600 text-white rounded-md text-xs hover:bg-purple-700 transition-colors"
                              >
                                <ShoppingBag className="h-3 w-3 mr-1" />
                                Shop
                              </Link>
                            )}
                            {(quest.category === "Sosyal" ||
                              quest.category === "Social") && (
                              <Link
                                href="/profile"
                                className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700 transition-colors"
                              >
                                <Users className="h-3 w-3 mr-1" />
                                Profile
                              </Link>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <div className="text-center">
            <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              💡 Daily Quest Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <Calendar className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">
                  Check Daily
                </h4>
                <p className="text-gray-600 text-sm">
                  New quests are generated every night at midnight. Keep your
                  daily streak!
                </p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">
                  Progressive Difficulty
                </h4>
                <p className="text-gray-600 text-sm">
                  Maintain your streak to unlock harder and more rewarding
                  quests!
                </p>
              </div>
              <div className="text-center">
                <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">
                  Bonus Rewards
                </h4>
                <p className="text-gray-600 text-sm">
                  Complete all daily quests to earn bonus rewards!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
