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

  if (loading || !settings) {
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

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-medium text-gray-600">Loading user information...</p>
        </div>
      </div>
    );
  }

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
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -right-2 -top-2 h-6 w-6 animate-pulse rounded-full bg-green-500 ring-3 ring-white shadow-lg"></div>
                  {user.isPremium && (
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 p-1.5 shadow-lg">
                      <Crown className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-3">
                    <h1 className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-3xl lg:text-4xl font-bold text-transparent">
                      {getGreeting()}, {user.username}! 👋
                    </h1>
                  </div>
                  
                  <p className="mb-4 text-lg text-gray-600 lg:text-xl">
                    Continue your Python mastery with {settings.siteName}
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <div className="inline-flex items-center rounded-full bg-gradient-to-r from-red-100 to-orange-100 px-4 py-2 text-sm font-semibold text-red-800">
                      <Flame className="mr-2 h-4 w-4" />
                      {user.loginStreak} day streak
                    </div>
                    <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 text-sm font-semibold text-blue-800">
                      <Star className="mr-2 h-4 w-4" />
                      Level {user.level}
                    </div>
                    <div className="inline-flex items-center rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 px-4 py-2 text-sm font-semibold text-yellow-800">
                      <span className="mr-1">{settings.currencySymbol}</span>
                      {user.currentDiamonds}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 lg:flex-col lg:space-x-0 lg:space-y-2">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Next Level</p>
                    <p className="text-lg font-bold text-gray-900">{user.level + 1}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">XP Needed</p>
                    <p className="text-lg font-bold text-blue-600">
                      {getNextLevelXp() - user.experience}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 lg:mt-8">
                <div className="mb-2 flex justify-between text-sm font-medium text-gray-600">
                  <span>Level {user.level} Progress</span>
                  <span>{user.experience % 100}/100 XP</span>
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
                <p className="text-3xl font-bold">{user.level}</p>
                <p className="text-sm font-medium text-blue-100">Current Level</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="absolute right-0 top-0 h-20 w-20 -translate-y-8 translate-x-8 rounded-full bg-white/10"></div>
              <div className="relative z-10">
                <div className="mb-4 rounded-xl bg-white/20 p-3 w-fit">
                  <Diamond className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">{user.currentDiamonds}</p>
                <p className="text-sm font-medium text-yellow-100">Diamonds</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="absolute right-0 top-0 h-20 w-20 -translate-y-8 translate-x-8 rounded-full bg-white/10"></div>
              <div className="relative z-10">
                <div className="mb-4 rounded-xl bg-white/20 p-3 w-fit">
                  <Zap className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">{user.experience}</p>
                <p className="text-sm font-medium text-purple-100">Total XP</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="absolute right-0 top-0 h-20 w-20 -translate-y-8 translate-x-8 rounded-full bg-white/10"></div>
              <div className="relative z-10">
                <div className="mb-4 rounded-xl bg-white/20 p-3 w-fit">
                  <Flame className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">{user.loginStreak}</p>
                <p className="text-sm font-medium text-green-100">Day Streak</p>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="mb-8 lg:mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            
            {/* Code Arena Section */}
            {settings.arenaEnabled === 'true' && (
              <div className="group rounded-2xl border border-white/60 bg-white/90 p-6 lg:p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                <div className="mb-6 flex items-center">
                  <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-3">
                    <GamepadIcon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="ml-4 text-xl font-bold text-gray-900">⚔️ Code Arena</h2>
                </div>
                
                <div className="space-y-3">
                  <Link
                    href="/code-arena"
                    className="group flex items-center rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4 transition-all duration-200 hover:border-blue-400 hover:bg-blue-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-blue-500 p-2">
                      <Book className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">Enter Arena</p>
                      <p className="text-sm text-gray-600">Battle with Python challenges</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-blue-600 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/leaderboard"
                    className="group flex items-center rounded-xl border-2 border-purple-200 bg-purple-50/50 p-4 transition-all duration-200 hover:border-purple-400 hover:bg-purple-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-purple-500 p-2">
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

            {/* Collection & Shop */}
            <div className="group rounded-2xl border border-white/60 bg-white/90 p-6 lg:p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
              <div className="mb-6 flex items-center">
                <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-3">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <h2 className="ml-4 text-xl font-bold text-gray-900">🛍️ Collection</h2>
              </div>

              <div className="space-y-3">
                <Link
                  href="/shop"
                  className="group flex items-center rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-4 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-100 hover:shadow-md"
                >
                  <div className="rounded-lg bg-emerald-500 p-2">
                    <Diamond className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="font-semibold text-gray-900">Card Shop</p>
                    <p className="text-sm text-gray-600">Buy exclusive anime cards</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-emerald-600 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/my-cards"
                  className="group flex items-center rounded-xl border-2 border-teal-200 bg-teal-50/50 p-4 transition-all duration-200 hover:border-teal-400 hover:bg-teal-100 hover:shadow-md"
                >
                  <div className="rounded-lg bg-teal-500 p-2">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="font-semibold text-gray-900">My Cards</p>
                    <p className="text-sm text-gray-600">View your collection</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-teal-600 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Profile & Settings */}
            <div className="group rounded-2xl border border-white/60 bg-white/90 p-6 lg:p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl lg:col-span-2 xl:col-span-1">
              <div className="mb-6 flex items-center">
                <div className="rounded-xl bg-gradient-to-r from-gray-500 to-slate-600 p-3">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <h2 className="ml-4 text-xl font-bold text-gray-900">⚙️ Account</h2>
              </div>

              <div className="space-y-3">
                <Link
                  href="/profile"
                  className="group flex items-center rounded-xl border-2 border-gray-200 bg-gray-50/50 p-4 transition-all duration-200 hover:border-gray-400 hover:bg-gray-100 hover:shadow-md"
                >
                  <div className="rounded-lg bg-gray-500 p-2">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="font-semibold text-gray-900">Profile</p>
                    <p className="text-sm text-gray-600">Edit your information</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-600 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/code-editor"
                  className="group flex items-center rounded-xl border-2 border-indigo-200 bg-indigo-50/50 p-4 transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-100 hover:shadow-md"
                >
                  <div className="rounded-lg bg-indigo-500 p-2">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="font-semibold text-gray-900">Code Editor</p>
                    <p className="text-sm text-gray-600">Practice Python coding</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-indigo-600 transition-transform group-hover:translate-x-1" />
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
                  <p className="text-2xl font-bold text-blue-600">{user.codeArenasCompleted || 0}</p>
                  <p className="text-xs font-medium text-blue-700">Arenas Completed</p>
                </div>

                <div className="rounded-xl border border-green-200/50 bg-gradient-to-br from-green-50 to-green-100/50 p-4 text-center">
                  <div className="mx-auto mb-2 w-fit rounded-full bg-green-500 p-2">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{user.quizzesCompleted || 0}</p>
                  <p className="text-xs font-medium text-green-700">Quizzes Solved</p>
                </div>

                <div className="rounded-xl border border-purple-200/50 bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 text-center">
                  <div className="mx-auto mb-2 w-fit rounded-full bg-purple-500 p-2">
                    <Code className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{user.codeSubmissionCount || 0}</p>
                  <p className="text-xs font-medium text-purple-700">Code Submissions</p>
                </div>

                <div className="rounded-xl border border-yellow-200/50 bg-gradient-to-br from-yellow-50 to-yellow-100/50 p-4 text-center">
                  <div className="mx-auto mb-2 w-fit rounded-full bg-yellow-500 p-2">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">{user.totalDiamonds || 0}</p>
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
