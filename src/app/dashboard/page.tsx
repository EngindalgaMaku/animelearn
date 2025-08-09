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
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import PythonTipWidget from "@/components/python-tips/PythonTipWidget";

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
  const [tipLoading, setTipLoading] = useState(true);

  // Load site settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsToLoad = [
          'site_name',
          'primary_color', 
          'secondary_color',
          'currency_symbol',
          'daily_diamond_bonus',
          'arena_enabled',
          'hero_title'
        ];

        const promises = settingsToLoad.map(key => 
          fetch(`/api/settings/${key}`).then(res => res.json())
        );

        const results = await Promise.all(promises);
        const settingsMap: any = {};
        
        settingsToLoad.forEach((key, index) => {
          settingsMap[key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())] = results[index]?.value || '';
        });

        setSettings({
          siteName: settingsMap.siteName || 'Zumenzu',
          primaryColor: settingsMap.primaryColor || '#EF4444',
          secondaryColor: settingsMap.secondaryColor || '#F97316', 
          currencySymbol: settingsMap.currencySymbol || '💎',
          dailyDiamondBonus: settingsMap.dailyDiamondBonus || '25',
          arenaEnabled: settingsMap.arenaEnabled || 'true',
          heroTitle: settingsMap.heroTitle || 'Master Python Programming'
        });
      } catch (error) {
        console.error('Failed to load settings:', error);
        // Use defaults
        setSettings({
          siteName: 'Zumenzu',
          primaryColor: '#EF4444',
          secondaryColor: '#F97316',
          currencySymbol: '💎',
          dailyDiamondBonus: '25',
          arenaEnabled: 'true',
          heroTitle: 'Master Python Programming'
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
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        // Mock data for development
        setStats({
          totalCards: 12,
          totalValue: 2450,
          weeklyProgress: 75,
          dailyGoalProgress: 60,
          recentActivities: [
            {
              id: '1',
              type: 'arena_complete',
              description: 'Completed "Python Variables" arena',
              timestamp: new Date(Date.now() - 30000).toISOString(),
              reward: 25
            },
            {
              id: '2', 
              type: 'card_purchase',
              description: 'Purchased "Naruto Uzumaki" card',
              timestamp: new Date(Date.now() - 300000).toISOString(),
            },
            {
              id: '3',
              type: 'level_up',
              description: 'Reached Level 5!',
              timestamp: new Date(Date.now() - 600000).toISOString(),
              reward: 100
            }
          ]
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
        const response = await fetch('/api/python-tips/daily');
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data); // Debug log
          setDailyTip(data.dailyTip);
        }
      } catch (error) {
        console.error('Failed to load daily tip:', error);
      } finally {
        setTipLoading(false);
      }
    };

    loadDailyTip();
  }, []);

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
          <p className="mt-6 text-lg font-medium text-gray-600">Loading your dashboard...</p>
          <p className="text-sm text-gray-500">Preparing your learning journey</p>
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
          <p className="text-lg font-medium text-gray-600">Loading user information...</p>
          <div className="mt-4">
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:text-blue-700 underline"
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
          <p className="text-lg font-medium text-gray-600">Please log in to continue</p>
          <p className="text-sm text-gray-500 mb-4">Your session may have expired</p>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      
      <div className="relative z-10 py-6 lg:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Enhanced Header with Dynamic Content */}
          <div className="mb-8 lg:mb-12">
            <div className="rounded-2xl border border-white/60 bg-white/80 p-6 lg:p-8 shadow-xl backdrop-blur-sm">
              <div className="flex flex-col items-start space-y-6 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-8">
                <div className="relative">
                  <div className="flex h-20 w-20 lg:h-24 lg:w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-xl ring-4 ring-white/50">
                    <span className="text-2xl lg:text-3xl font-bold text-white">
                      {currentUser.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -right-2 -top-2 h-6 w-6 animate-pulse rounded-full bg-green-500 ring-3 ring-white shadow-lg"></div>
                  {currentUser.isPremium && (
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 p-1.5 shadow-lg">
                      <Crown className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-3">
                    <h1 className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-3xl lg:text-4xl font-bold text-transparent">
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
                    <p className="text-sm font-medium text-gray-500">Next Level</p>
                    <p className="text-lg font-bold text-gray-900">{currentUser.level + 1}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">XP Needed</p>
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

          {/* Enhanced Stats Grid */}
          <div className="mb-8 lg:mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="absolute right-0 top-0 h-20 w-20 -translate-y-8 translate-x-8 rounded-full bg-white/10"></div>
              <div className="relative z-10">
                <div className="mb-4 rounded-xl bg-white/20 p-3 w-fit">
                  <Star className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">{currentUser.level}</p>
                <p className="text-sm font-medium text-blue-100">Current Level</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="absolute right-0 top-0 h-20 w-20 -translate-y-8 translate-x-8 rounded-full bg-white/10"></div>
              <div className="relative z-10">
                <div className="mb-4 rounded-xl bg-white/20 p-3 w-fit">
                  <Diamond className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">{currentUser.currentDiamonds}</p>
                <p className="text-sm font-medium text-yellow-100">Diamonds</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="absolute right-0 top-0 h-20 w-20 -translate-y-8 translate-x-8 rounded-full bg-white/10"></div>
              <div className="relative z-10">
                <div className="mb-4 rounded-xl bg-white/20 p-3 w-fit">
                  <Zap className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">{currentUser.experience}</p>
                <p className="text-sm font-medium text-purple-100">Total XP</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="absolute right-0 top-0 h-20 w-20 -translate-y-8 translate-x-8 rounded-full bg-white/10"></div>
              <div className="relative z-10">
                <div className="mb-4 rounded-xl bg-white/20 p-3 w-fit">
                  <Flame className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">{currentUser.loginStreak}</p>
                <p className="text-sm font-medium text-green-100">Day Streak</p>
              </div>
            </div>
          </div>

          {/* Daily Python Tip Section */}
          <div className="mb-8 lg:mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">🐍 Daily Python Tip</h2>
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Today's Learning
              </div>
            </div>
            {tipLoading ? (
              <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-lg bg-gray-200 h-12 w-12"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ) : dailyTip ? (
              <PythonTipWidget
                tip={dailyTip}
                onInteraction={async (tipId: string, type: string) => {
                  try {
                    const response = await fetch(`/api/python-tips/${tipId}/interact`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ interactionType: type }),
                    });
                    
                    if (response.ok) {
                      const data = await response.json();
                      // Update user stats if XP was awarded
                      if (data.xpAwarded) {
                        // You could update user context here or show a notification
                        console.log(`+${data.xpAwarded} XP for ${type}!`);
                      }
                    }
                  } catch (error) {
                    console.error('Failed to record interaction:', error);
                  }
                }}
              />
            ) : (
              <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm text-center">
                <div className="text-gray-500">
                  <Code className="mx-auto h-12 w-12 mb-4" />
                  <p>No Python tip available today</p>
                  <p className="text-sm mt-2">Check back tomorrow for a new tip!</p>
                </div>
              </div>
            )}
          </div>

          {/* Main Features - Always Prominent */}
          <div className="mb-8 lg:mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Core Features</h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              
              {/* Code Arena - Primary Feature */}
              {settings.arenaEnabled === 'true' && (
                <div className="group rounded-2xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 lg:p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-blue-400">
                  <div className="mb-6 flex items-center">
                    <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-3 shadow-lg">
                      <GamepadIcon className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="ml-4 text-xl font-bold text-gray-900">💻 Code Arena</h2>
                    <div className="ml-auto bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
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
                        <p className="font-semibold text-gray-900">Python Challenges</p>
                        <p className="text-sm text-gray-600">Learn through interactive coding</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-blue-600 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <Link
                      href="/leaderboard"
                      className="group flex items-center rounded-xl border-2 border-purple-200 bg-purple-50/70 p-4 transition-all duration-200 hover:border-purple-400 hover:bg-purple-100 hover:shadow-md"
                    >
                      <div className="rounded-lg bg-purple-500 p-2 shadow-md">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="font-semibold text-gray-900">Leaderboard</p>
                        <p className="text-sm text-gray-600">See top performers</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-purple-600 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Shop & Collection - Important Feature */}
              <div className="group rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 lg:p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-emerald-400">
                <div className="mb-6 flex items-center">
                  <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-3 shadow-lg">
                    <ShoppingBag className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="ml-4 text-xl font-bold text-gray-900">🛍️ Shop & Store</h2>
                  <div className="ml-auto bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                    Popular
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/card-packs"
                    className="group flex items-center rounded-xl border-2 border-purple-200 bg-purple-50/70 p-4 transition-all duration-200 hover:border-purple-400 hover:bg-purple-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-purple-500 p-2 shadow-md">
                      <Gift className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">Card Packs</p>
                      <p className="text-sm text-gray-600">Open packs with advanced rarity system</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-purple-600 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/shop"
                    className="group flex items-center rounded-xl border-2 border-emerald-200 bg-emerald-50/70 p-4 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-emerald-500 p-2 shadow-md">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">Card Shop</p>
                      <p className="text-sm text-gray-600">Buy exclusive anime cards</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-emerald-600 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/store"
                    className="group flex items-center rounded-xl border-2 border-yellow-200 bg-yellow-50/70 p-4 transition-all duration-200 hover:border-yellow-400 hover:bg-yellow-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-yellow-500 p-2 shadow-md">
                      <Diamond className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">Diamond Store</p>
                      <p className="text-sm text-gray-600">Purchase premium currency</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-yellow-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* My Cards Collection */}
              <div className="group rounded-2xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 lg:p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-indigo-400">
                <div className="mb-6 flex items-center">
                  <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 p-3 shadow-lg">
                    <Star className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="ml-4 text-xl font-bold text-gray-900">🎴 My Collection</h2>
                  <div className="ml-auto bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
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
                      <p className="font-semibold text-gray-900">View Collection</p>
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
                      <p className="font-semibold text-gray-900">Profile Settings</p>
                      <p className="text-sm text-gray-600">Edit your information</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Gamification Features - Secondary Section */}
          <div className="mb-8 lg:mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">🎮 Rewards & Challenges</h2>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                New Features
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              
              {/* Daily Login Rewards */}
              <div className="group rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-pink-50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 p-2">
                      <Gift className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="ml-3 text-lg font-bold text-gray-900">Daily Rewards</h3>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Available
                  </div>
                </div>
                
                <div className="text-center mb-3">
                  <div className="text-2xl font-bold text-orange-600">{currentUser.loginStreak} Day Streak</div>
                  <div className="text-sm text-gray-600">Keep logging in for better rewards!</div>
                </div>
                
                <Link
                  href="/daily-rewards"
                  className="w-full py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all shadow-md text-center block"
                >
                  Claim Daily Reward
                </Link>
              </div>

              {/* Python Quiz Arena */}
              <div className="group rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                <div className="mb-4 flex items-center">
                  <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 p-2">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="ml-3 text-lg font-bold text-gray-900">Quiz Arena</h3>
                </div>
                
                <div className="text-center mb-3">
                  <div className="text-2xl font-bold text-blue-600">12 Questions</div>
                  <div className="text-sm text-gray-600">Best Strike Record</div>
                </div>
                
                <Link
                  href="/quiz-arena"
                  className="w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md text-center block"
                >
                  Start Quiz Challenge
                </Link>
              </div>

              {/* Weekly Challenges */}
              <div className="group rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                <div className="mb-4 flex items-center">
                  <div className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 p-2">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="ml-3 text-lg font-bold text-gray-900">Weekly Goals</h3>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span>Code Arenas</span>
                    <span className="font-medium text-emerald-600">2/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                
                <Link
                  href="/weekly-challenges"
                  className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md text-center block"
                >
                  View All Challenges
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Tools */}
          <div className="mb-8 lg:mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🛠️ Tools & Analytics</h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              
              {/* Code Editor */}
              <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                <div className="mb-4 flex items-center">
                  <div className="rounded-lg bg-gradient-to-r from-gray-600 to-slate-700 p-2">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="ml-3 text-lg font-bold text-gray-900">Code Editor</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">Practice Python coding with our interactive editor</p>
                
                <Link
                  href="/code-editor"
                  className="w-full py-2 bg-gradient-to-r from-gray-600 to-slate-700 text-white rounded-lg font-medium hover:from-gray-700 hover:to-slate-800 transition-all shadow-md text-center block"
                >
                  Open Editor
                </Link>
              </div>

              {/* Achievements */}
              <div className="group rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                <div className="mb-4 flex items-center">
                  <div className="rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 p-2">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="ml-3 text-lg font-bold text-gray-900">Achievements</h3>
                </div>
                
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center">
                    <Crown className="h-4 w-4 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center opacity-50">
                    <Star className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center opacity-50">
                    <Brain className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                
                <Link
                  href="/achievements"
                  className="w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all shadow-md text-center block"
                >
                  View All
                </Link>
              </div>

              {/* Analytics */}
              <div className="group rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                <div className="mb-4 flex items-center">
                  <div className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 p-2">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="ml-3 text-lg font-bold text-gray-900">Progress Analytics</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">2.5h</div>
                    <div className="text-xs text-gray-600">This Week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">85%</div>
                    <div className="text-xs text-gray-600">Accuracy</div>
                  </div>
                </div>
                
                <Link
                  href="/analytics"
                  className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-md text-center block"
                >
                  Detailed View
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activities & Progress */}
          <div className="mb-8 lg:mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            
            {/* Recent Activities */}
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 lg:p-8 shadow-xl backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 p-3">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="ml-4 text-xl font-bold text-gray-900">📈 Recent Activity</h2>
                </div>
                <Link href="/activity" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {statsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-3 animate-pulse">
                        <div className="h-10 w-10 rounded-lg bg-gray-200"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : stats?.recentActivities.length ? (
                  stats.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                      <div className="rounded-lg bg-blue-500 p-2">
                        {activity.type === 'arena_complete' && <Trophy className="h-4 w-4 text-white" />}
                        {activity.type === 'card_purchase' && <Diamond className="h-4 w-4 text-white" />}
                        {activity.type === 'level_up' && <Star className="h-4 w-4 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
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
                  <div className="text-center py-8">
                    <Activity className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No recent activities</p>
                  </div>
                )}
              </div>
            </div>

            {/* Learning Stats */}
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 lg:p-8 shadow-xl backdrop-blur-sm">
              <div className="mb-6 flex items-center">
                <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 p-3">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h2 className="ml-4 text-xl font-bold text-gray-900">📊 Learning Stats</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-blue-200/50 bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 text-center">
                  <div className="mx-auto mb-2 w-fit rounded-full bg-blue-500 p-2">
                    <Book className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{currentUser.codeArenasCompleted || 0}</p>
                  <p className="text-xs font-medium text-blue-700">Arenas Completed</p>
                </div>

                <div className="rounded-xl border border-green-200/50 bg-gradient-to-br from-green-50 to-green-100/50 p-4 text-center">
                  <div className="mx-auto mb-2 w-fit rounded-full bg-green-500 p-2">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{currentUser.quizzesCompleted || 0}</p>
                  <p className="text-xs font-medium text-green-700">Quizzes Solved</p>
                </div>

                <div className="rounded-xl border border-purple-200/50 bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 text-center">
                  <div className="mx-auto mb-2 w-fit rounded-full bg-purple-500 p-2">
                    <Code className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{currentUser.codeSubmissionCount || 0}</p>
                  <p className="text-xs font-medium text-purple-700">Code Submissions</p>
                </div>

                <div className="rounded-xl border border-yellow-200/50 bg-gradient-to-br from-yellow-50 to-yellow-100/50 p-4 text-center">
                  <div className="mx-auto mb-2 w-fit rounded-full bg-yellow-500 p-2">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">{currentUser.totalDiamonds || 0}</p>
                  <p className="text-xs font-medium text-yellow-700">Total Earned</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
