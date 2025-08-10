"use client";

import { useState, useEffect } from "react";
import {
  Book,
  Diamond,
  Star,
  Award,
  Target,
  TrendingUp,
  Code,
  Trophy,
  Zap,
  Brain,
  Play,
  Calendar,
  Clock,
  Gift,
  Users,
  Activity,
  BarChart3,
  Crown,
  Flame,
  CheckCircle,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  GamepadIcon,
  Home,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import PythonTipWidget from "@/components/python-tips/PythonTipWidget";
import Portal from "@/components/ui/Portal";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardStats {
  totalCards: number;
  totalValue: number;
  weeklyProgress: number;
  dailyGoalProgress: number;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    reward?: number;
  }>;
}

interface SiteSettings {
  siteName: string;
  primaryColor: string;
  secondaryColor: string;
  currencySymbol: string;
  dailyDiamondBonus: string;
  arenaEnabled: string;
  heroTitle: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [authTimeout, setAuthTimeout] = useState(false);
  const [dailyTip, setDailyTip] = useState<any>(null);
  const [tipProgress, setTipProgress] = useState<any>(null);
  const [tipLoading, setTipLoading] = useState(true);
  const [showDailyRewardsModal, setShowDailyRewardsModal] = useState(false);
  const [dailyRewardsData, setDailyRewardsData] = useState<any>(null);
  const [rewardsLoading, setRewardsLoading] = useState(false);
  const [claimingReward, setClaimingReward] = useState(false);
  const [weeklyChallenges, setWeeklyChallenges] = useState<any>(null);
  const [challengesLoading, setChallengesLoading] = useState(true);

  // Load site settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsToLoad = [
          "site_name",
          "primary_color",
          "secondary_color",
          "currency_symbol",
          "daily_diamond_bonus",
          "arena_enabled",
          "hero_title",
        ];

        const promises = settingsToLoad.map((key) =>
          fetch(`/api/settings/${key}`).then((res) => res.json())
        );

        const results = await Promise.all(promises);
        const settingsMap: any = {};

        settingsToLoad.forEach((key, index) => {
          settingsMap[key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())] =
            results[index]?.value || "";
        });

        setSettings({
          siteName: settingsMap.siteName || "Zumenzu",
          primaryColor: settingsMap.primaryColor || "#EF4444",
          secondaryColor: settingsMap.secondaryColor || "#F97316",
          currencySymbol: settingsMap.currencySymbol || "💎",
          dailyDiamondBonus: settingsMap.dailyDiamondBonus || "25",
          arenaEnabled: settingsMap.arenaEnabled || "true",
          heroTitle: settingsMap.heroTitle || "Master Python Programming",
        });
      } catch (error) {
        console.error("Failed to load settings:", error);
        // Use defaults
        setSettings({
          siteName: "Zumenzu",
          primaryColor: "#EF4444",
          secondaryColor: "#F97316",
          currencySymbol: "💎",
          dailyDiamondBonus: "25",
          arenaEnabled: "true",
          heroTitle: "Master Python Programming",
        });
      }
    };

    loadSettings();
  }, []);

  // Auth timeout fallback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn("Auth loading timeout, proceeding without authentication");
        setAuthTimeout(true);
      }
    }, 10000); // 10 saniye timeout

    return () => clearTimeout(timer);
  }, [loading]);

  // Load dashboard stats
  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      try {
        setStatsLoading(true);
        const response = await fetch("/api/dashboard/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
        // Mock data for development
        setStats({
          totalCards: 12,
          totalValue: 2450,
          weeklyProgress: 75,
          dailyGoalProgress: 60,
          recentActivities: [
            {
              id: "1",
              type: "arena_complete",
              description: 'Completed "Python Variables" arena',
              timestamp: new Date(Date.now() - 30000).toISOString(),
              reward: 25,
            },
            {
              id: "2",
              type: "card_purchase",
              description: 'Purchased "Naruto Uzumaki" card',
              timestamp: new Date(Date.now() - 300000).toISOString(),
            },
            {
              id: "3",
              type: "level_up",
              description: "Reached Level 5!",
              timestamp: new Date(Date.now() - 600000).toISOString(),
              reward: 100,
            },
          ],
        });
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [user]);

  // Load daily Python tip
  useEffect(() => {
    const loadDailyTip = async () => {
      try {
        setTipLoading(true);
        const response = await fetch("/api/python-tips/daily");
        if (response.ok) {
          const data = await response.json();
          console.log("API Response:", data); // Debug log
          setDailyTip(data.dailyTip);
          setTipProgress(data.userProgress);
        }
      } catch (error) {
        console.error("Failed to load daily tip:", error);
      } finally {
        setTipLoading(false);
      }
    };

    loadDailyTip();
  }, []);

  const handleTipInteraction = async (action: string, data?: any) => {
    if (!dailyTip || !user) return;

    try {
      const response = await fetch(`/api/python-tips/${dailyTip.id}/interact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, data }),
      });

      if (response.ok) {
        const result = await response.json();
        setTipProgress(result.userProgress);

        // Refresh user data if XP was earned
        if (result.xpEarned && user) {
          // You might want to refresh user context here
        }
      }
    } catch (error) {
      console.error("Tip interaction failed:", error);
    }
  };

  // Load daily rewards data when modal opens
  const loadDailyRewardsData = async () => {
    if (!user) return;

    try {
      setRewardsLoading(true);
      const response = await fetch("/api/daily-login-reward");
      if (response.ok) {
        const data = await response.json();
        setDailyRewardsData(data);
      } else {
        console.error("Failed to load daily rewards data");
      }
    } catch (error) {
      console.error("Error loading daily rewards:", error);
    } finally {
      setRewardsLoading(false);
    }
  };

  // Claim daily reward
  const claimDailyReward = async () => {
    if (!user || claimingReward) return;

    try {
      setClaimingReward(true);
      const response = await fetch("/api/daily-login-reward", {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Reward claimed:", result);

        // Refresh daily rewards data
        await loadDailyRewardsData();

        // Refresh user data by reloading the page data
        window.location.reload();
      } else {
        const error = await response.json();
        if (error.alreadyClaimed) {
          alert("You have already claimed your reward today!");
        } else {
          alert(error.error || "Failed to claim reward");
        }
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
      alert("Failed to claim reward. Please try again.");
    } finally {
      setClaimingReward(false);
    }
  };

  // Load weekly challenges data
  const loadWeeklyChallenges = async () => {
    if (!user) return;

    try {
      setChallengesLoading(true);
      const response = await fetch("/api/weekly-challenges");
      if (response.ok) {
        const data = await response.json();
        setWeeklyChallenges(data);
      } else {
        console.error("Failed to load weekly challenges");
      }
    } catch (error) {
      console.error("Error loading weekly challenges:", error);
    } finally {
      setChallengesLoading(false);
    }
  };

  // Track daily login when component loads
  useEffect(() => {
    const trackDailyLogin = async () => {
      if (!user) return;

      try {
        await fetch("/api/login-streak/track", {
          method: "POST",
        });
      } catch (error) {
        console.error("Error tracking daily login:", error);
      }
    };

    trackDailyLogin();
  }, [user]);

  // Load weekly challenges when component loads
  useEffect(() => {
    if (user) {
      loadWeeklyChallenges();
    }
  }, [user]);

  // Load daily rewards data when modal opens
  useEffect(() => {
    if (showDailyRewardsModal && user) {
      loadDailyRewardsData();
    }
  }, [showDailyRewardsModal, user]);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const calculateNextLevelProgress = () => {
    if (!user) return 0;
    const currentLevelXp = user.experience % 100;
    return (currentLevelXp / 100) * 100;
  };

  const getNextLevelXp = () => {
    if (!user) return 100;
    return (user.level + 1) * 100;
  };

  if ((loading && !authTimeout) || !settings) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="mt-6 text-lg font-medium text-gray-600">
            Loading your dashboard...
          </p>
          <p className="text-sm text-gray-500">
            Preparing your learning journey
          </p>
        </div>
      </div>
    );
  }

  if (!user && !authTimeout) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-medium text-gray-600">
            Loading user information...
          </p>
          <div className="mt-4">
            <Link
              href="/login"
              className="text-sm text-blue-600 underline hover:text-blue-700"
            >
              Continue to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Eğer user yoksa ve timeout olduysa login'e yönlendir
  if (!user && authTimeout) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-red-500 to-pink-500 p-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-medium text-gray-600">
            Please log in to continue
          </p>
          <p className="mb-4 text-sm text-gray-500">
            Your session may have expired
          </p>
          <Link
            href="/login"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // user null kontrolünden sonra kesinlikle var olduğunu bil
  const currentUser = user!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Background Pattern */}
      <div className="bg-grid-pattern absolute inset-0 opacity-[0.02]"></div>

      <div className="relative py-6 lg:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Unified Header with Stats - Combined Layout */}
          <div className="mb-8 lg:mb-12">
            {/* Combined Header Section */}
            <div className="mb-6 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-sm lg:p-8">
              <div className="flex flex-col items-start space-y-6 lg:flex-row lg:items-center lg:space-x-8 lg:space-y-0">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-xl ring-4 ring-white/50 lg:h-24 lg:w-24">
                    <span className="text-2xl font-bold text-white lg:text-3xl">
                      {currentUser.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ring-3 absolute -right-2 -top-2 h-6 w-6 animate-pulse rounded-full bg-green-500 shadow-lg ring-white"></div>
                  {currentUser.isPremium && (
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 p-1.5 shadow-lg">
                      <Crown className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-3">
                    <h1 className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                      {getGreeting()}, {currentUser.username}! 👋
                    </h1>
                  </div>

                  <p className="mb-4 text-lg text-gray-600 lg:text-xl">
                    Continue your Python mastery with {settings.siteName}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <div className="inline-flex items-center rounded-full bg-gradient-to-r from-red-100 to-orange-100 px-4 py-2 text-sm font-semibold text-red-800">
                      <Flame className="mr-2 h-4 w-4" />
                      {currentUser.loginStreak} day streak
                    </div>
                    <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 text-sm font-semibold text-blue-800">
                      <Star className="mr-2 h-4 w-4" />
                      Level {currentUser.level}
                    </div>
                    <div className="inline-flex items-center rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 px-4 py-2 text-sm font-semibold text-yellow-800">
                      <span className="mr-1">{settings.currencySymbol}</span>
                      {currentUser.currentDiamonds}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 lg:flex-col lg:space-x-0 lg:space-y-2">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">
                      Next Level
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {currentUser.level + 1}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">
                      XP Needed
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {getNextLevelXp() - currentUser.experience}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 lg:mt-8">
                <div className="mb-2 flex justify-between text-sm font-medium text-gray-600">
                  <span>Level {currentUser.level} Progress</span>
                  <span>{currentUser.experience % 100}/100 XP</span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out"
                    style={{ width: `${calculateNextLevelProgress()}%` }}
                  >
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Daily Python Tip */}
          <div className="mb-6">
            <div className="mb-2 flex items-center">
              <h2 className="flex items-center text-base font-semibold text-gray-900">
                🐍 Daily Python Tip
                <span className="ml-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 px-2 py-1 text-xs font-medium text-green-800">
                  Today's Learning
                </span>
              </h2>
            </div>
            {tipLoading ? (
              <div className="rounded-lg border border-white/60 bg-white/95 p-3 shadow-sm backdrop-blur-sm">
                <div className="flex animate-pulse space-x-3">
                  <div className="h-6 w-6 rounded bg-gray-200"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-3/4 rounded bg-gray-200"></div>
                    <div className="h-2 w-1/2 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
            ) : dailyTip ? (
              <div className="rounded-lg border border-white/60 bg-white/95 shadow-sm backdrop-blur-sm">
                <PythonTipWidget
                  tip={dailyTip}
                  userProgress={tipProgress}
                  streak={null}
                  compact={true}
                  onInteraction={handleTipInteraction}
                  className="mx-auto"
                />
              </div>
            ) : (
              <div className="rounded-lg border border-white/60 bg-white/95 p-3 text-center shadow-sm backdrop-blur-sm">
                <div className="text-gray-500">
                  <Code className="mx-auto mb-1 h-6 w-6" />
                  <p className="text-xs">No Python tip available today</p>
                </div>
              </div>
            )}
          </div>

          {/* Main Features - Always Prominent */}
          <div className="mb-8 lg:mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              🚀 Core Features
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {/* Code Arena - Primary Feature */}
              {settings.arenaEnabled === "true" && (
                <div className="group rounded-2xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-blue-400 hover:shadow-2xl lg:p-8">
                  <div className="mb-6 flex items-center">
                    <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-3 shadow-lg">
                      <GamepadIcon className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="ml-4 text-xl font-bold text-gray-900">
                      💻 Code Arena
                    </h2>
                    <div className="ml-auto rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      Primary
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href="/code-arena"
                      className="group flex items-center rounded-xl border-2 border-blue-200 bg-blue-50/70 p-4 transition-all duration-200 hover:border-blue-400 hover:bg-blue-100 hover:shadow-md"
                    >
                      <div className="rounded-lg bg-blue-500 p-2 shadow-md">
                        <Book className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="font-semibold text-gray-900">
                          Python Challenges
                        </p>
                        <p className="text-sm text-gray-600">
                          Learn through interactive coding
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-blue-600 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <Link
                      href="/quiz-arena"
                      className="group flex items-center rounded-xl border-2 border-purple-200 bg-purple-50/70 p-4 transition-all duration-200 hover:border-purple-400 hover:bg-purple-100 hover:shadow-md"
                    >
                      <div className="rounded-lg bg-purple-500 p-2 shadow-md">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="font-semibold text-gray-900">
                          Quiz Arena
                        </p>
                        <p className="text-sm text-gray-600">
                          Test your Python knowledge
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-purple-600 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Shop & Store - Simplified */}
              <div className="group rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-emerald-400 hover:shadow-2xl lg:p-8">
                <div className="mb-6 flex items-center">
                  <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-3 shadow-lg">
                    <ShoppingBag className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="ml-4 text-xl font-bold text-gray-900">
                    🛍️ Card Shop
                  </h2>
                  <div className="ml-auto rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                    Popular
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/shop"
                    className="group flex items-center rounded-xl border-2 border-emerald-200 bg-emerald-50/70 p-4 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-emerald-500 p-2 shadow-md">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">
                        Browse Cards
                      </p>
                      <p className="text-sm text-gray-600">
                        Buy exclusive anime & star cards
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-emerald-600 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/leaderboard"
                    className="group flex items-center rounded-xl border-2 border-blue-200 bg-blue-50/70 p-4 transition-all duration-200 hover:border-blue-400 hover:bg-blue-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-blue-500 p-2 shadow-md">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">Leaderboard</p>
                      <p className="text-sm text-gray-600">
                        See top collectors & learners
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-blue-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* My Cards Collection */}
              <div className="group rounded-2xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-indigo-400 hover:shadow-2xl lg:p-8">
                <div className="mb-6 flex items-center">
                  <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 p-3 shadow-lg">
                    <Star className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="ml-4 text-xl font-bold text-gray-900">
                    🎴 My Collection
                  </h2>
                  <div className="ml-auto rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800">
                    127 Cards
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/my-cards"
                    className="group flex items-center rounded-xl border-2 border-indigo-200 bg-indigo-50/70 p-4 transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-indigo-500 p-2 shadow-md">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">
                        View Collection
                      </p>
                      <p className="text-sm text-gray-600">Manage your cards</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-indigo-600 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/profile"
                    className="group flex items-center rounded-xl border-2 border-gray-200 bg-gray-50/70 p-4 transition-all duration-200 hover:border-gray-400 hover:bg-gray-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-gray-500 p-2 shadow-md">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">
                        Profile Settings
                      </p>
                      <p className="text-sm text-gray-600">
                        Edit your information
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Rewards & Challenges - Unified Professional Card */}
          <div className="mb-8 lg:mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                🎮 Rewards & Challenges
              </h2>
              <div className="rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-sm font-medium text-purple-800">
                Active
              </div>
            </div>

            {/* Single Unified Card */}
            <div className="border-gradient rounded-2xl border-2 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-8 shadow-xl backdrop-blur-sm">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Daily Rewards */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 p-3 shadow-lg">
                      <Gift className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Daily Rewards
                      </h3>
                      <div className="w-fit rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        Available
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {currentUser.loginStreak}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      Day Streak
                    </div>
                  </div>

                  <button
                    onClick={() => setShowDailyRewardsModal(true)}
                    className="block w-full rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 py-3 text-center font-semibold text-white shadow-lg transition-all hover:from-orange-600 hover:to-pink-600 hover:shadow-xl"
                  >
                    Claim Reward
                  </button>
                </div>

                {/* Weekly Goals */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-3 shadow-lg">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Weekly Goals
                      </h3>
                      <div className="text-xs text-gray-600">
                        Progress Tracking
                      </div>
                    </div>
                  </div>

                  {challengesLoading ? (
                    <div className="space-y-3">
                      <div className="flex animate-pulse justify-between">
                        <div className="h-4 w-20 rounded bg-gray-200"></div>
                        <div className="h-4 w-12 rounded bg-gray-200"></div>
                      </div>
                      <div className="h-3 w-full rounded-full bg-gray-200"></div>
                    </div>
                  ) : weeklyChallenges?.challenges?.length > 0 ? (
                    <div className="space-y-3">
                      {weeklyChallenges.challenges
                        .slice(0, 2)
                        .map((challenge: any) => {
                          const progress =
                            challenge.userProgress?.currentValue || 0;
                          const target = challenge.targetValue || 1;
                          const progressPercentage = Math.min(
                            (progress / target) * 100,
                            100
                          );

                          return (
                            <div key={challenge.id} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="flex items-center text-gray-700">
                                  <span className="mr-1">{challenge.icon}</span>
                                  {challenge.title}
                                </span>
                                <span className="font-bold text-emerald-600">
                                  {progress}/{target}
                                </span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-gray-200 shadow-inner">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    challenge.userProgress?.isCompleted
                                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                      : "bg-gradient-to-r from-emerald-500 to-teal-500"
                                  }`}
                                  style={{ width: `${progressPercentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="py-4 text-center">
                        <div className="text-sm text-gray-500">
                          No active challenges this week
                        </div>
                      </div>
                    </div>
                  )}

                  <Link
                    href="/weekly-challenges"
                    className="block w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-center font-semibold text-white shadow-lg transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl"
                  >
                    View All Goals
                  </Link>
                </div>

                {/* Achievements */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 p-3 shadow-lg">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Achievements
                      </h3>
                      <div className="text-xs text-gray-600">Unlock Badges</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 shadow-md">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-400 to-indigo-400 shadow-md">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-300 opacity-60 shadow-md">
                      <Star className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-300 opacity-60 shadow-md">
                      <Brain className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>

                  <Link
                    href="/achievements"
                    className="block w-full rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 py-3 text-center font-semibold text-white shadow-lg transition-all hover:from-yellow-600 hover:to-orange-600 hover:shadow-xl"
                  >
                    View All
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities & Progress */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:mb-12 lg:grid-cols-2">
            {/* Recent Activities */}
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm lg:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 p-3">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="ml-4 text-xl font-bold text-gray-900">
                    📈 Recent Activity
                  </h2>
                </div>
                <Link
                  href="/activity"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {statsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex animate-pulse items-center space-x-3"
                      >
                        <div className="h-10 w-10 rounded-lg bg-gray-200"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                          <div className="h-3 w-1/2 rounded bg-gray-200"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : stats?.recentActivities.length ? (
                  stats.recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4 rounded-lg border border-gray-100 bg-gray-50/50 p-3"
                    >
                      <div className="rounded-lg bg-blue-500 p-2">
                        {activity.type === "arena_complete" && (
                          <Trophy className="h-4 w-4 text-white" />
                        )}
                        {activity.type === "card_purchase" && (
                          <Diamond className="h-4 w-4 text-white" />
                        )}
                        {activity.type === "level_up" && (
                          <Star className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      {activity.reward && (
                        <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
                          <span>+{activity.reward}</span>
                          <span>{settings.currencySymbol}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <Activity className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      No recent activities
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Learning Stats */}
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm lg:p-8">
              <div className="mb-6 flex items-center">
                <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 p-3">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h2 className="ml-4 text-xl font-bold text-gray-900">
                  📊 Learning Stats
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-blue-200/50 bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 text-center">
                  <div className="mx-auto mb-2 w-fit rounded-full bg-blue-500 p-2">
                    <Book className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {currentUser.codeArenasCompleted || 0}
                  </p>
                  <p className="text-xs font-medium text-blue-700">
                    Arenas Completed
                  </p>
                </div>

                <div className="rounded-xl border border-green-200/50 bg-gradient-to-br from-green-50 to-green-100/50 p-4 text-center">
                  <div className="mx-auto mb-2 w-fit rounded-full bg-green-500 p-2">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {currentUser.quizzesCompleted || 0}
                  </p>
                  <p className="text-xs font-medium text-green-700">
                    Quizzes Solved
                  </p>
                </div>

                <div className="rounded-xl border border-purple-200/50 bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 text-center">
                  <div className="mx-auto mb-2 w-fit rounded-full bg-purple-500 p-2">
                    <Code className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {currentUser.codeSubmissionCount || 0}
                  </p>
                  <p className="text-xs font-medium text-purple-700">
                    Code Submissions
                  </p>
                </div>

                <div className="rounded-xl border border-yellow-200/50 bg-gradient-to-br from-yellow-50 to-yellow-100/50 p-4 text-center">
                  <div className="mx-auto mb-2 w-fit rounded-full bg-yellow-500 p-2">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {currentUser.totalDiamonds || 0}
                  </p>
                  <p className="text-xs font-medium text-yellow-700">
                    Total Earned
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Rewards Modal */}
      <AnimatePresence>
        {showDailyRewardsModal && (
          <Portal>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
              onClick={() => setShowDailyRewardsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-xl bg-white/20 p-3">
                        <Gift className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Daily Rewards</h2>
                        <p className="text-white/90">
                          Claim your daily login bonus!
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDailyRewardsModal(false)}
                      className="rounded-lg bg-white/20 p-2 transition-colors hover:bg-white/30"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="max-h-[calc(90vh-200px)] overflow-y-auto p-6">
                  {rewardsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
                        <p className="mt-4 text-sm text-gray-600">
                          Loading rewards...
                        </p>
                      </div>
                    </div>
                  ) : dailyRewardsData ? (
                    <>
                      {/* Current Streak */}
                      <div className="mb-6 text-center">
                        <div className="mb-2 inline-flex items-center rounded-full bg-gradient-to-r from-orange-100 to-pink-100 px-4 py-2">
                          <Flame className="mr-2 h-5 w-5 text-orange-500" />
                          <span className="font-semibold text-orange-800">
                            {dailyRewardsData.loginStatus?.consecutiveDays || 0}{" "}
                            Day Streak
                          </span>
                        </div>
                        <p className="text-gray-600">
                          Keep logging in daily to maintain your streak and earn
                          better rewards!
                        </p>
                      </div>

                      {/* Reward Calendar */}
                      <div className="mb-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                          Weekly Rewards
                        </h3>
                        <div className="grid grid-cols-7 gap-2">
                          {dailyRewardsData.upcomingRewards?.map(
                            (dayData: any, index: number) => {
                              const isToday = dayData.isToday;
                              const isClaimed = dayData.isClaimed;
                              const isPast =
                                index <
                                dailyRewardsData.loginStatus?.currentDay - 1;

                              return (
                                <div
                                  key={index}
                                  className={`relative rounded-xl border-2 p-4 text-center transition-all ${
                                    isToday && !isClaimed
                                      ? "border-orange-400 bg-gradient-to-br from-orange-50 to-pink-50 shadow-lg"
                                      : isPast || isClaimed
                                        ? "border-green-300 bg-green-50"
                                        : "border-gray-200 bg-gray-50"
                                  }`}
                                >
                                  {(isPast || isClaimed) && (
                                    <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                                      <CheckCircle className="h-4 w-4 text-white" />
                                    </div>
                                  )}
                                  {isToday && !isClaimed && (
                                    <div className="absolute -right-1 -top-1 flex h-6 w-6 animate-pulse items-center justify-center rounded-full bg-orange-500">
                                      <Star className="h-4 w-4 text-white" />
                                    </div>
                                  )}

                                  <div className="mb-1 text-xs font-medium text-gray-600">
                                    Day {dayData.day}
                                  </div>
                                  <div
                                    className={`text-lg font-bold ${
                                      isToday && !isClaimed
                                        ? "text-orange-600"
                                        : isPast || isClaimed
                                          ? "text-green-600"
                                          : "text-gray-400"
                                    }`}
                                  >
                                    {dayData.reward?.diamondReward || 0}{" "}
                                    {settings.currencySymbol}
                                  </div>
                                  {dayData.reward?.isSpecial && (
                                    <div className="text-xs font-medium text-purple-600">
                                      Special!
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>

                      {/* Today's Reward */}
                      <div className="mb-6 rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-pink-50 p-6">
                        <div className="text-center">
                          <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-pink-500">
                            <Gift className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="mb-2 text-xl font-bold text-gray-900">
                            {dailyRewardsData.loginStatus?.canClaimToday
                              ? "Today's Reward"
                              : "Already Claimed!"}
                          </h3>
                          <div className="mb-2 text-3xl font-bold text-orange-600">
                            {dailyRewardsData.todayReward?.diamondReward || 0}{" "}
                            {settings.currencySymbol}
                          </div>
                          <p className="mb-4 text-gray-600">
                            {dailyRewardsData.todayReward?.isSpecial
                              ? "Special Bonus Reward!"
                              : "Daily Login Reward"}
                          </p>

                          <button
                            onClick={claimDailyReward}
                            disabled={
                              !dailyRewardsData.loginStatus?.canClaimToday ||
                              claimingReward
                            }
                            className={`w-full rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition-all ${
                              dailyRewardsData.loginStatus?.canClaimToday &&
                              !claimingReward
                                ? "cursor-pointer bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 hover:shadow-xl"
                                : "cursor-not-allowed bg-gray-400"
                            }`}
                          >
                            <span className="flex items-center justify-center">
                              {claimingReward ? (
                                <>
                                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                  Claiming...
                                </>
                              ) : dailyRewardsData.loginStatus
                                  ?.canClaimToday ? (
                                <>
                                  <Gift className="mr-2 h-5 w-5" />
                                  Claim{" "}
                                  {dailyRewardsData.todayReward
                                    ?.diamondReward || 0}{" "}
                                  {settings.currencySymbol}
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-5 w-5" />
                                  Claimed Today!
                                </>
                              )}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="rounded-lg bg-purple-500 p-2">
                              <Target className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                Total Rewards
                              </p>
                              <p className="text-sm text-gray-600">
                                Since you started
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-purple-600">
                              {dailyRewardsData.stats?.totalDiamondsEarned || 0}{" "}
                              {settings.currencySymbol}
                            </div>
                            <div className="text-xs text-gray-500">
                              Total Earned
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center">
                      <div className="text-gray-500">
                        <Gift className="mx-auto mb-2 h-12 w-12" />
                        <p>Unable to load rewards data</p>
                        <button
                          onClick={loadDailyRewardsData}
                          className="mt-4 text-sm text-blue-600 hover:text-blue-700"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </div>
  );
}
