"use client";

import { useState, useEffect } from "react";
import {
  Award,
  Star,
  Trophy,
  Crown,
  Zap,
  Target,
  Calendar,
  Users,
  Book,
  Diamond,
  ShoppingBag,
  Code,
  CheckCircle,
  Clock,
  TrendingUp,
  Gift,
  Flame,
  Shield,
  Sparkles,
  Heart,
  ThumbsUp,
  Gamepad2,
  X,
  Lock,
  ArrowRight,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  condition: string;
  targetValue: number;
  isEarned: boolean;
  earnedAt?: string;
  progress?: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  rewardDiamonds: number;
  rewardXp: number;
}

interface BadgeStats {
  totalBadges: number;
  earnedBadges: number;
  completionRate: number;
  totalDiamonds: number;
  totalXp: number;
  categories: Array<{
    category: string;
    total: number;
    earned: number;
    percentage: number;
  }>;
  recentBadges: Badge[];
}

const BADGE_ICONS: { [key: string]: any } = {
  trophy: Trophy,
  star: Star,
  crown: Crown,
  award: Award,
  zap: Zap,
  target: Target,
  calendar: Calendar,
  users: Users,
  book: Book,
  diamond: Diamond,
  shopping: ShoppingBag,
  code: Code,
  check: CheckCircle,
  clock: Clock,
  trending: TrendingUp,
  gift: Gift,
  flame: Flame,
  shield: Shield,
  sparkles: Sparkles,
  heart: Heart,
  thumbs: ThumbsUp,
  gamepad: Gamepad2,
};

const RARITY_COLORS = {
  common: "bg-gray-100 text-gray-800 border-gray-300",
  uncommon: "bg-green-100 text-green-800 border-green-300",
  rare: "bg-blue-100 text-blue-800 border-blue-300",
  epic: "bg-purple-100 text-purple-800 border-purple-300",
  legendary:
    "bg-gradient-to-r from-yellow-100 to-orange-200 text-orange-800 border-orange-300",
};

const CATEGORY_COLORS = {
  Python: "bg-blue-100 text-blue-800",
  Kart: "bg-purple-100 text-purple-800",
  Sosyal: "bg-green-100 text-green-800",
  Özel: "bg-red-100 text-red-800",
  Günlük: "bg-yellow-100 text-yellow-800",
  Başarı: "bg-orange-100 text-orange-800",
};

// Badge icon colors based on category
const BADGE_ICON_COLORS = {
  Python: {
    earned: "bg-gradient-to-r from-blue-500 to-blue-600",
    unearned: "bg-gradient-to-r from-blue-300 to-blue-400",
    iconColor: "text-white",
  },
  Kart: {
    earned: "bg-gradient-to-r from-purple-500 to-purple-600",
    unearned: "bg-gradient-to-r from-purple-300 to-purple-400",
    iconColor: "text-white",
  },
  Sosyal: {
    earned: "bg-gradient-to-r from-green-500 to-green-600",
    unearned: "bg-gradient-to-r from-green-300 to-green-400",
    iconColor: "text-white",
  },
  Özel: {
    earned: "bg-gradient-to-r from-red-500 to-red-600",
    unearned: "bg-gradient-to-r from-red-300 to-red-400",
    iconColor: "text-white",
  },
  Günlük: {
    earned: "bg-gradient-to-r from-yellow-500 to-orange-500",
    unearned: "bg-gradient-to-r from-yellow-300 to-orange-300",
    iconColor: "text-white",
  },
  Başarı: {
    earned: "bg-gradient-to-r from-orange-500 to-red-500",
    unearned: "bg-gradient-to-r from-orange-300 to-red-300",
    iconColor: "text-white",
  },
};

// Fallback colors for unknown categories
const DEFAULT_BADGE_COLORS = {
  earned: "bg-gradient-to-r from-gray-500 to-gray-600",
  unearned: "bg-gradient-to-r from-gray-300 to-gray-400",
  iconColor: "text-white",
};
// Helper: robust icon rendering (URL images, emoji, or mapped Lucide icons)
function isUrlIcon(icon?: string): boolean {
  if (!icon) return false;
  return (
    /^(https?:\/\/|\/)/i.test(icon) || /\.(svg|png|jpe?g|webp)$/i.test(icon)
  );
}

function isEmojiIcon(icon?: string): boolean {
  if (!icon) return false;
  // Basic emoji range detection
  try {
    return /[\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}]/u.test(icon);
  } catch {
    // Fallback heuristic: short non-alphanumeric string
    return icon.length <= 4 && !/^[a-z0-9]+$/i.test(icon);
  }
}

function renderBadgeIcon(icon: string, className: string, alt?: string) {
  if (isUrlIcon(icon)) {
    return <img src={icon} alt={alt || "badge icon"} className={className} />;
  }
  if (isEmojiIcon(icon)) {
    // Use larger font size if not already provided by className
    return (
      <span
        className={className}
        role="img"
        aria-label={alt || "badge emoji"}
        aria-hidden={alt ? "false" : "true"}
      >
        {icon}
      </span>
    );
  }
  const IconComp = BADGE_ICONS[icon] || Award;
  return <IconComp className={className} />;
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState<BadgeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [viewMode, setViewMode] = useState<"earned" | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [badgesPerPage] = useState(12);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchBadges();
    }
  }, [isAuthenticated]);

  // Close modal on ESC key when open
  useEffect(() => {
    if (!selectedBadge) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedBadge(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedBadge]);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/badges");
      if (response.ok) {
        const data = await response.json();
        setBadges(data.badges || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Badges fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtreleme
  const filteredBadges = (badges || []).filter((badge) => {
    const categoryMatch =
      selectedCategory === "all" || badge.category === selectedCategory;
    const viewMatch =
      viewMode === "all" || (viewMode === "earned" && badge.isEarned);
    return categoryMatch && viewMatch;
  });

  // Sayfalama hesaplamaları
  const totalPages = Math.ceil(filteredBadges.length / badgesPerPage);
  const startIndex = (currentPage - 1) * badgesPerPage;
  const endIndex = startIndex + badgesPerPage;
  const currentBadges = filteredBadges.slice(startIndex, endIndex);

  // Kategoriler
  const categories = Array.from(new Set((badges || []).map((b) => b.category)));

  // Filter değiştiğinde sayfa 1'e dön
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, viewMode]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="rounded-2xl bg-white/80 p-8 text-center shadow-lg backdrop-blur-sm">
          <Lock className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Badge Collection
          </h1>
          <p className="mb-6 text-gray-600">
            You need to log in to view badges.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700"
          >
            Sign In
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-lg text-gray-600">Loading badges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative mb-8 overflow-hidden rounded-3xl py-12 text-center">
          {/* Background Images */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="/features/features3.jpg"
              alt="Badge Hero"
              className="absolute left-4 top-2 h-20 w-20 rotate-12 rounded-2xl object-cover opacity-15 md:h-28 md:w-28"
            />
            <img
              src="/features/features4.jpg"
              alt="Achievement"
              className="absolute right-8 top-4 h-24 w-24 -rotate-12 rounded-2xl object-cover opacity-20 md:h-32 md:w-32"
            />
            <img
              src="/hero/hero3.jpg"
              alt="Trophy Hero"
              className="absolute bottom-2 left-1/4 h-16 w-16 rotate-45 rounded-2xl object-cover opacity-10 md:h-24 md:w-24"
            />
            <img
              src="/features/features7.jpg"
              alt="Badge Collection"
              className="w-18 h-18 md:w-26 md:h-26 absolute bottom-4 right-1/3 -rotate-45 rounded-2xl object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/5 via-orange-600/5 to-red-600/5"></div>
          </div>

          <div className="relative z-10">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              🏆 My Badge Collection
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Earn badges by learning Python, collecting cards, and completing
              daily quests!
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="rounded-2xl bg-white/70 p-6 text-center shadow-lg backdrop-blur-sm">
              <Award className="mx-auto mb-2 h-8 w-8 text-orange-600" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.earnedBadges}/{stats.totalBadges}
              </div>
              <div className="text-gray-600">Earned Badges</div>
              <div className="mt-2 h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-orange-500 transition-all duration-1000"
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/70 p-6 text-center shadow-lg backdrop-blur-sm">
              <Diamond className="mx-auto mb-2 h-8 w-8 text-yellow-600" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalDiamonds}
              </div>
              <div className="text-gray-600">Badge Reward Diamonds</div>
            </div>

            <div className="rounded-2xl bg-white/70 p-6 text-center shadow-lg backdrop-blur-sm">
              <Zap className="mx-auto mb-2 h-8 w-8 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalXp}
              </div>
              <div className="text-gray-600">Badge Reward XP</div>
            </div>

            <div className="rounded-2xl bg-white/70 p-6 text-center shadow-lg backdrop-blur-sm">
              <BarChart3 className="mx-auto mb-2 h-8 w-8 text-green-600" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.completionRate?.toFixed(1) || "0.0"}%
              </div>
              <div className="text-gray-600">Completion Rate</div>
            </div>
          </div>
        )}

        {/* Category Progress */}
        {stats && stats.categories && stats.categories.length > 0 && (
          <div className="mb-8 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              📊 Category Progress
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stats.categories.map((category) => (
                <div
                  key={category.category}
                  className="rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        CATEGORY_COLORS[
                          category.category as keyof typeof CATEGORY_COLORS
                        ] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {category.category}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      {category.earned}/{category.total}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    %{category.percentage?.toFixed(1) || "0.0"} tamamlandı
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Badges */}
        {stats && stats.recentBadges && stats.recentBadges.length > 0 && (
          <div className="mb-8 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              🆕 Recently Earned Badges
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {stats.recentBadges.map((badge) => {
                return (
                  <div
                    key={badge.id}
                    className="cursor-pointer rounded-xl border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-4 transition-all hover:shadow-lg"
                    onClick={() => setSelectedBadge(badge)}
                  >
                    <div className="text-center">
                      <div
                        className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full shadow-lg ${
                          BADGE_ICON_COLORS[
                            badge.category as keyof typeof BADGE_ICON_COLORS
                          ]?.earned || DEFAULT_BADGE_COLORS.earned
                        }`}
                      >
                        {renderBadgeIcon(
                          badge.icon,
                          `h-6 w-6 ${
                            BADGE_ICON_COLORS[
                              badge.category as keyof typeof BADGE_ICON_COLORS
                            ]?.iconColor || DEFAULT_BADGE_COLORS.iconColor
                          }`,
                          badge.name
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {badge.name}
                      </h4>
                      <p className="mt-1 text-xs text-gray-600">
                        {badge.earnedAt &&
                          new Date(badge.earnedAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* View Mode */}
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode("all")}
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                  viewMode === "all"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                🏆 All Badges ({badges?.length || 0})
              </button>
              <button
                onClick={() => setViewMode("earned")}
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                  viewMode === "earned"
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                ✅ Earned ({(badges || []).filter((b) => b.isEarned).length})
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
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
          </div>
        </div>

        {/* Badges Grid */}
        {filteredBadges.length === 0 ? (
          <div className="py-12 text-center">
            <Award className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-medium text-gray-900">
              No Badges Found
            </h3>
            <p className="text-gray-600">
              No badges match your selected criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {currentBadges.map((badge) => {
                const progressPercentage =
                  badge.progress && badge.targetValue
                    ? (badge.progress / badge.targetValue) * 100
                    : 0;

                return (
                  <div
                    key={badge.id}
                    className={`cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                      badge.isEarned
                        ? "border-2 border-yellow-200 bg-gradient-to-br from-white to-yellow-50"
                        : "bg-white/80 backdrop-blur-sm"
                    }`}
                    onClick={() => setSelectedBadge(badge)}
                  >
                    <div className="p-6">
                      {/* Badge Icon */}
                      <div className="mb-4 text-center">
                        <div
                          className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${
                            badge.isEarned
                              ? BADGE_ICON_COLORS[
                                  badge.category as keyof typeof BADGE_ICON_COLORS
                                ]?.earned || DEFAULT_BADGE_COLORS.earned
                              : BADGE_ICON_COLORS[
                                  badge.category as keyof typeof BADGE_ICON_COLORS
                                ]?.unearned || DEFAULT_BADGE_COLORS.unearned
                          }`}
                        >
                          {renderBadgeIcon(
                            badge.icon,
                            `h-8 w-8 ${
                              BADGE_ICON_COLORS[
                                badge.category as keyof typeof BADGE_ICON_COLORS
                              ]?.iconColor || DEFAULT_BADGE_COLORS.iconColor
                            }`,
                            badge.name
                          )}
                        </div>

                        {badge.isEarned && (
                          <div className="mb-2 flex items-center justify-center space-x-1">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-green-700">
                              Earned!
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Badge Info */}
                      <div className="space-y-3">
                        <h3 className="text-center text-lg font-semibold text-gray-900">
                          {badge.name}
                        </h3>

                        <p className="line-clamp-2 text-center text-sm text-gray-600">
                          {badge.description}
                        </p>

                        {/* Category and Rarity */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              CATEGORY_COLORS[
                                badge.category as keyof typeof CATEGORY_COLORS
                              ] || "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {badge.category}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-1 text-xs font-medium ${
                              RARITY_COLORS[badge.rarity]
                            }`}
                          >
                            {badge.rarity}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        {!badge.isEarned &&
                          badge.progress !== undefined &&
                          badge.targetValue > 0 && (
                            <div>
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-xs text-gray-600">
                                  Progress
                                </span>
                                <span className="text-xs font-medium text-gray-900">
                                  {badge.progress}/{badge.targetValue}
                                </span>
                              </div>
                              <div className="h-2 rounded-full bg-gray-200">
                                <div
                                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                                  style={{
                                    width: `${Math.min(
                                      progressPercentage,
                                      100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                {progressPercentage?.toFixed(1) || "0.0"}%
                                completed
                              </div>
                            </div>
                          )}

                        {/* Rewards */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1">
                            <Diamond className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium text-yellow-700">
                              +{badge.rewardDiamonds}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Zap className="h-4 w-4 text-blue-500" />
                            <span className="font-medium text-blue-700">
                              +{badge.rewardXp} XP
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  {/* Page Info */}
                  <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, filteredBadges.length)} of{" "}
                    {filteredBadges.length} badges
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
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

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => {
                          // Show first, last, current, and pages around current
                          const showPage =
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 1;

                          if (!showPage) {
                            // Show ellipsis
                            if (
                              page === currentPage - 2 ||
                              page === currentPage + 2
                            ) {
                              return (
                                <span key={page} className="px-2 text-gray-400">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          }

                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                currentPage === page
                                  ? "bg-blue-600 text-white"
                                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                      )}
                    </div>

                    {/* Next Button */}
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

                {/* Page Size Info */}
                <div className="mt-4 text-center text-xs text-gray-500">
                  Displaying {badgesPerPage} badges per page
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedBadge(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Badge details"
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedBadge.name}
              </h2>
              <button
                onClick={() => setSelectedBadge(null)}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
                aria-label="Close"
                title="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 text-center">
                {/* Large Badge Icon */}
                <div
                  className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full shadow-xl transition-all duration-300 hover:scale-105 ${
                    selectedBadge.isEarned
                      ? BADGE_ICON_COLORS[
                          selectedBadge.category as keyof typeof BADGE_ICON_COLORS
                        ]?.earned || DEFAULT_BADGE_COLORS.earned
                      : BADGE_ICON_COLORS[
                          selectedBadge.category as keyof typeof BADGE_ICON_COLORS
                        ]?.unearned || DEFAULT_BADGE_COLORS.unearned
                  }`}
                >
                  {renderBadgeIcon(
                    selectedBadge.icon,
                    `h-12 w-12 ${
                      BADGE_ICON_COLORS[
                        selectedBadge.category as keyof typeof BADGE_ICON_COLORS
                      ]?.iconColor || DEFAULT_BADGE_COLORS.iconColor
                    }`,
                    selectedBadge.name
                  )}
                </div>

                {selectedBadge.isEarned && (
                  <div className="mb-4 flex items-center justify-center space-x-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <span className="text-lg font-medium text-green-700">
                      Badge Earned!
                    </span>
                  </div>
                )}
              </div>

              {/* Badge Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    📋 Description
                  </h3>
                  <p className="text-gray-700">{selectedBadge.description}</p>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    🎯 Earning Condition
                  </h3>
                  <p className="text-gray-700">{selectedBadge.condition}</p>
                </div>

                {/* Progress */}
                {!selectedBadge.isEarned &&
                  selectedBadge.progress !== undefined &&
                  selectedBadge.targetValue > 0 && (
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        📊 Progress
                      </h3>
                      <div className="rounded-xl bg-gray-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-gray-600">
                            Current Progress
                          </span>
                          <span className="font-bold text-gray-900">
                            {selectedBadge.progress}/{selectedBadge.targetValue}
                          </span>
                        </div>
                        <div className="h-3 rounded-full bg-gray-200">
                          <div
                            className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                            style={{
                              width: `${Math.min(
                                (selectedBadge.progress /
                                  selectedBadge.targetValue) *
                                  100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          %
                          {selectedBadge.progress && selectedBadge.targetValue
                            ? (
                                (selectedBadge.progress /
                                  selectedBadge.targetValue) *
                                100
                              ).toFixed(1)
                            : "0.0"}
                          % completed
                        </div>
                      </div>
                    </div>
                  )}

                {/* Category and Rarity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-gray-600">
                      Category
                    </h4>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                        CATEGORY_COLORS[
                          selectedBadge.category as keyof typeof CATEGORY_COLORS
                        ]
                      }`}
                    >
                      {selectedBadge.category}
                    </span>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-gray-600">
                      Rarity Level
                    </h4>
                    <span
                      className={`inline-block rounded-full border px-3 py-1 text-sm font-medium ${
                        RARITY_COLORS[selectedBadge.rarity]
                      }`}
                    >
                      {selectedBadge.rarity}
                    </span>
                  </div>
                </div>

                {/* Rewards */}
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    🎁 Rewards
                  </h3>
                  <div className="rounded-xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <Diamond className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
                        <div className="text-xl font-bold text-yellow-700">
                          +{selectedBadge.rewardDiamonds}
                        </div>
                        <div className="text-sm text-yellow-600">Diamonds</div>
                      </div>
                      <div className="text-center">
                        <Zap className="mx-auto mb-2 h-8 w-8 text-blue-500" />
                        <div className="text-xl font-bold text-blue-700">
                          +{selectedBadge.rewardXp}
                        </div>
                        <div className="text-sm text-blue-600">
                          Experience Points
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Earned Date */}
                {selectedBadge.isEarned && selectedBadge.earnedAt && (
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      📅 Date Earned
                    </h3>
                    <p className="text-gray-700">
                      {new Date(selectedBadge.earnedAt).toLocaleDateString(
                        "tr-TR",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                {!selectedBadge.isEarned && (
                  <div className="border-t border-gray-200 pt-4 text-center">
                    <p className="mb-4 text-gray-600">
                      How can you make progress to earn this badge?
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {selectedBadge.category === "Python" && (
                        <Link
                          href="/learn"
                          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                        >
                          <Book className="mr-2 h-4 w-4" />
                          Python Lessons
                        </Link>
                      )}
                      {selectedBadge.category === "Kart" && (
                        <Link
                          href="/shop"
                          className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
                        >
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Card Shop
                        </Link>
                      )}
                      {selectedBadge.category === "Günlük" && (
                        <Link
                          href="/quests"
                          className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                        >
                          <Target className="mr-2 h-4 w-4" />
                          Daily Quests
                        </Link>
                      )}
                      <button
                        onClick={() => setSelectedBadge(null)}
                        className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 transition-colors hover:bg-gray-50"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
