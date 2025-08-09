"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  BookOpen,
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
  ChevronRight,
  Gamepad2,
} from "lucide-react";
import Link from "next/link";
import PythonTipWidget from "@/components/python-tips/PythonTipWidget";

interface SiteSettings {
  siteName: string;
  primaryColor: string;
  secondaryColor: string;
  currencySymbol: string;
  dailyDiamondBonus: string;
  arenaEnabled: string;
  heroTitle: string;
}

export default function EnhancedHomepage() {
  const { user, loading } = useAuth();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
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

  // Load daily Python tip
  useEffect(() => {
    const loadDailyTip = async () => {
      try {
        setTipLoading(true);
        const response = await fetch('/api/python-tips/daily');
        if (response.ok) {
          const data = await response.json();
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

  if (loading || !settings) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="mt-6 text-lg font-medium text-gray-600">Loading your enhanced experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      
      <div className="relative z-10">
        
        {/* Enhanced Hero Section - More organized but still vibrant */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-16 lg:py-24">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              
              {/* User greeting for authenticated users */}
              {user && (
                <div className="mb-8 inline-flex items-center rounded-full bg-white/10 px-6 py-3 backdrop-blur-sm">
                  <div className="mr-3 h-8 w-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 p-1">
                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-900">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <span className="text-lg font-medium">
                    {getGreeting()}, {user.username}! 🎮
                  </span>
                </div>
              )}

              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block">{settings.heroTitle}</span>
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Through Gaming & Anime Cards
                </span>
              </h1>
              
              <p className="mx-auto mb-8 max-w-3xl text-lg text-blue-100 sm:text-xl">
                Level up your coding skills with interactive challenges, collect rare anime cards,
                and join a community of passionate developers. Make learning Python an adventure!
              </p>
              
              {/* Enhanced CTA buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
                <Link
                  href={user ? "/dashboard" : "/register"}
                  className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 text-lg font-bold text-gray-900 shadow-xl transition-all hover:from-yellow-500 hover:to-orange-600 hover:shadow-2xl hover:scale-105"
                >
                  <Gamepad2 className="mr-2 h-6 w-6" />
                  {user ? "Continue Your Journey" : "Start Your Adventure"}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                
                <Link
                  href="/code-arena"
                  className="group inline-flex items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Link>
              </div>

              {/* Quick stats with animations */}
              <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm animate-float">
                  <div className="text-3xl font-bold">5,000+</div>
                  <div className="text-sm text-blue-200">Active Coders</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm animate-float" style={{animationDelay: '0.5s'}}>
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-sm text-blue-200">Challenges</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm animate-float" style={{animationDelay: '1s'}}>
                  <div className="text-3xl font-bold">200+</div>
                  <div className="text-sm text-blue-200">Anime Cards</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm animate-float" style={{animationDelay: '1.5s'}}>
                  <div className="text-3xl font-bold">89%</div>
                  <div className="text-sm text-blue-200">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced User Dashboard Section - Only for authenticated users */}
        {user && (
          <section className="py-12 lg:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl border border-white/60 bg-white/80 p-6 lg:p-8 shadow-xl backdrop-blur-sm">
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
                      <h2 className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-3xl lg:text-4xl font-bold text-transparent">
                        Welcome back, {user.username}! 👋
                      </h2>
                    </div>
                    
                    <p className="mb-4 text-lg text-gray-600 lg:text-xl">
                      Continue your Python mastery journey
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
                        {((user.level + 1) * 100) - user.experience}
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
                      style={{ width: `${(user.experience % 100)}%` }}
                    >
                      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Daily Python Tip Section - Enhanced with better spacing */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="mr-3 text-4xl">🐍</span>
                Daily Python Tip
              </h2>
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                Today's Learning
              </div>
            </div>
            
            {tipLoading ? (
              <div className="rounded-2xl border border-white/60 bg-white/90 p-8 shadow-xl backdrop-blur-sm">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-lg bg-gray-200 h-16 w-16"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
                      if (data.xpAwarded) {
                        console.log(`+${data.xpAwarded} XP for ${type}!`);
                      }
                    }
                  } catch (error) {
                    console.error('Failed to record interaction:', error);
                  }
                }}
              />
            ) : (
              <div className="rounded-2xl border border-white/60 bg-white/90 p-8 shadow-xl backdrop-blur-sm text-center">
                <div className="text-gray-500">
                  <Code className="mx-auto h-16 w-16 mb-4" />
                  <p className="text-lg">No Python tip available today</p>
                  <p className="text-sm mt-2">Check back tomorrow for a new tip!</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Enhanced Features Section - Better organized but still rich */}
        <section className="py-12 lg:py-16 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">🚀 Core Gaming Features</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to master Python through gamification
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
              
              {/* Code Arena */}
              {settings.arenaEnabled === 'true' && (
                <div className="group rounded-3xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-blue-400 hover:scale-105">
                  <div className="mb-6 flex items-center">
                    <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-4 shadow-lg">
                      <GamepadIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="ml-4 text-2xl font-bold text-gray-900">💻 Code Arena</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Battle through Python challenges with real-time feedback, multiplayer competitions, and instant rewards.
                  </p>
                  
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
                        <p className="text-sm text-gray-600">50+ Interactive coding battles</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-blue-600 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center">
                        <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                        Leaderboards
                      </span>
                      <span className="flex items-center">
                        <Diamond className="h-4 w-4 mr-1 text-blue-500" />
                        Instant Rewards
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Shop & Collection */}
              <div className="group rounded-3xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-emerald-400 hover:scale-105">
                <div className="mb-6 flex items-center">
                  <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 shadow-lg">
                    <ShoppingBag className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="ml-4 text-2xl font-bold text-gray-900">🛍️ Anime Shop</h3>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Collect rare anime cards, build your deck, and trade with other players in our marketplace.
                </p>

                <div className="space-y-3">
                  <Link
                    href="/shop"
                    className="group flex items-center rounded-xl border-2 border-emerald-200 bg-emerald-50/70 p-4 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-emerald-500 p-2 shadow-md">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">Card Collection</p>
                      <p className="text-sm text-gray-600">200+ unique anime cards</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-emerald-600 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-purple-500" />
                      Rare Cards
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-green-500" />
                      Trading
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Tracking */}
              <div className="group rounded-3xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-indigo-400 hover:scale-105">
                <div className="mb-6 flex items-center">
                  <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 p-4 shadow-lg">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="ml-4 text-2xl font-bold text-gray-900">📈 Progress Hub</h3>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Track your coding journey with detailed analytics, achievements, and personalized learning paths.
                </p>

                <div className="space-y-3">
                  <Link
                    href="/dashboard"
                    className="group flex items-center rounded-xl border-2 border-indigo-200 bg-indigo-50/70 p-4 transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-100 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-indigo-500 p-2 shadow-md">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">Analytics Dashboard</p>
                      <p className="text-sm text-gray-600">Real-time progress tracking</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-indigo-600 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <Award className="h-4 w-4 mr-1 text-yellow-500" />
                      Achievements
                    </span>
                    <span className="flex items-center">
                      <Target className="h-4 w-4 mr-1 text-red-500" />
                      Goals
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section - Enhanced with gaming elements */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                Ready to Level Up Your Python Skills? 🎮
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-blue-100 mb-8">
                Join thousands of developers who are mastering Python through our gamified platform. 
                Start your coding adventure today!
              </p>

              {/* Gaming benefits */}
              <div className="flex flex-wrap justify-center gap-8 text-white mb-10">
                <div className="flex items-center">
                  <GamepadIcon className="mr-3 h-6 w-6" />
                  <span className="text-lg">Interactive Challenges</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="mr-3 h-6 w-6" />
                  <span className="text-lg">Earn Rewards</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-3 h-6 w-6" />
                  <span className="text-lg">Gaming Community</span>
                </div>
                <div className="flex items-center">
                  <Star className="mr-3 h-6 w-6" />
                  <span className="text-lg">Collect Cards</span>
                </div>
              </div>

              {/* Enhanced CTA */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
                <Link
                  href={user ? "/dashboard" : "/register"}
                  className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-10 py-5 text-xl font-bold text-gray-900 shadow-2xl transition-all hover:from-yellow-500 hover:to-orange-600 hover:shadow-2xl hover:scale-105"
                >
                  <Gamepad2 className="mr-3 h-6 w-6" />
                  {user ? "Continue Your Adventure" : "Start Your Coding Adventure"}
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Link>
                
                {!user && (
                  <Link
                    href="/code-arena"
                    className="group inline-flex items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 px-8 py-5 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Try Demo First
                  </Link>
                )}
              </div>

              {/* Trust indicators */}
              <p className="mt-8 text-blue-200">
                Free to start • No credit card required • 5,000+ active learners • 89% success rate
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}