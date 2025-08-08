"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Clock,
  Diamond,
  Star,
  Play,
  CheckCircle,
  Lock,
  Search,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Gamepad2,
  Trophy,
  Target,
  Brain,
  Users,
  Zap,
  Award,
  ArrowRight,
  BarChart3,
  Flame,
  Shield,
  Code,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import ImprovedMemoryGame from "@/components/learn/ImprovedMemoryGame";
import MultiplayerArena from "@/components/learn/MultiplayerArena";
import { GameRoom } from "@/components/learn/MultiplayerEngine";
import Head from "next/head";

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  activityType: string;
  difficulty: number;
  category: string;
  sortOrder: number;
  isLocked: boolean;
  prerequisiteId?: string;
  diamondReward: number;
  experienceReward: number;
  estimatedMinutes: number;
  isActive: boolean;
  content: any;
  settings?: any;
  tags: string[];
  totalAttempts: number;
  userProgress?: {
    score: number;
    maxScore: number;
    completed: boolean;
    timeSpent: number;
    hintsUsed: number;
    mistakes: number;
    startedAt: string;
    completedAt?: string;
    percentage: number;
  };
  prerequisite?: LearningActivity;
}

interface ActivitiesResponse {
  success: boolean;
  activities: LearningActivity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const DIFFICULTY_CONFIG = {
  1: { label: "Beginner", color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: "🌱" },
  2: { label: "Basic", color: "bg-blue-100 text-blue-800 border-blue-200", icon: "📚" },
  3: { label: "Intermediate", color: "bg-amber-100 text-amber-800 border-amber-200", icon: "⚡" },
  4: { label: "Advanced", color: "bg-purple-100 text-purple-800 border-purple-200", icon: "🚀" },
  5: { label: "Expert", color: "bg-red-100 text-red-800 border-red-200", icon: "👑" },
};

const CATEGORY_CONFIG = {
  "python_basics": {
    title: "Python Fundamentals",
    description: "Master the building blocks of Python programming",
    icon: "🐍",
    gradient: "from-green-500 to-emerald-600",
    bgGradient: "from-green-50 to-emerald-50"
  },
  "data_structures": {
    title: "Data Structures",
    description: "Learn essential data organization techniques",
    icon: "📊",
    gradient: "from-blue-500 to-cyan-600",
    bgGradient: "from-blue-50 to-cyan-50"
  },
  "algorithms": {
    title: "Algorithms",
    description: "Solve problems with efficient algorithms",
    icon: "🧮",
    gradient: "from-purple-500 to-violet-600",
    bgGradient: "from-purple-50 to-violet-50"
  },
  "web_development": {
    title: "Web Development",
    description: "Build modern web applications",
    icon: "🌐",
    gradient: "from-orange-500 to-red-600",
    bgGradient: "from-orange-50 to-red-50"
  }
};

export default function CodeArenaPage() {
  // Core learning states
  const [activities, setActivities] = useState<LearningActivity[]>([]);
  const [groupedActivities, setGroupedActivities] = useState<{[key: string]: LearningActivity[]}>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<LearningActivity | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<{[key: string]: boolean}>({});
  const [totalPages, setTotalPages] = useState(1);
  const [totalActivities, setTotalActivities] = useState(0);
  
  // Multiplayer states
  const [activeMode, setActiveMode] = useState<'learning' | 'multiplayer'>('learning');
  const [multiplayerRoom, setMultiplayerRoom] = useState<GameRoom | null>(null);
  
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchActivities();
  }, [currentPage, selectedDifficulty, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchActivities();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "50", // Get more to show comprehensive learning path
        ...(selectedDifficulty && { difficulty: selectedDifficulty }),
        ...(selectedCategory && { category: selectedCategory }),
      });

      const response = await fetch(`/api/learning-activities?${params}`);
      if (response.ok) {
        const data: ActivitiesResponse = await response.json();
        setActivities(data.activities);
        setTotalPages(data.pagination.pages);
        setTotalActivities(data.pagination.total);
        
        // Group activities by category and sort by sortOrder
        const grouped = data.activities.reduce((acc, activity) => {
          if (!acc[activity.category]) {
            acc[activity.category] = [];
          }
          acc[activity.category].push(activity);
          return acc;
        }, {} as {[key: string]: LearningActivity[]});
        
        // Sort activities within each category by sortOrder
        Object.keys(grouped).forEach(category => {
          grouped[category].sort((a, b) => a.sortOrder - b.sortOrder);
        });
        
        // Sort categories by their first activity's sortOrder
        const sortedCategoryKeys = Object.keys(grouped).sort((a, b) => {
          const aFirstOrder = grouped[a][0]?.sortOrder || 0;
          const bFirstOrder = grouped[b][0]?.sortOrder || 0;
          return aFirstOrder - bFirstOrder;
        });
        
        const sortedGrouped: {[key: string]: LearningActivity[]} = {};
        sortedCategoryKeys.forEach(category => {
          sortedGrouped[category] = grouped[category];
        });
        
        setGroupedActivities(sortedGrouped);
        
        // Auto-expand first available topic
        const categories = Object.keys(sortedGrouped);
        if (categories.length > 0 && Object.keys(expandedTopics).length === 0) {
          setExpandedTopics({ [categories[0]]: true });
        }
      }
    } catch (error) {
      console.error("Activities fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivityComplete = async (score: number, timeSpent: number, success: boolean) => {
    if (!selectedActivity) return;

    try {
      const response = await fetch(`/api/learning-activities/${selectedActivity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score,
          timeSpent,
          hintsUsed: 0,
          mistakes: 0,
          answers: {},
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.rewards && data.rewards.diamonds > 0) {
          setShowSuccessMessage(
            `🎉 Challenge Completed! +${data.rewards.diamonds} diamonds, +${data.rewards.experience} XP earned!`
          );
        } else if (success) {
          setShowSuccessMessage("🎉 Challenge completed successfully!");
        } else {
          setShowSuccessMessage("Challenge attempted. Try again to improve your score!");
        }
        
        setTimeout(() => setShowSuccessMessage(""), 4000);
        fetchActivities();
        setTimeout(() => setSelectedActivity(null), 2000);
      }
    } catch (error) {
      console.error("Failed to submit activity completion:", error);
      setShowSuccessMessage("❌ Failed to save progress. Please try again.");
      setTimeout(() => setShowSuccessMessage(""), 4000);
    }
  };

  const handleMultiplayerGameStart = (room: GameRoom) => {
    setMultiplayerRoom(room);
    // Create a multiplayer memory game activity
    const multiplayerActivity: LearningActivity = {
      id: `multiplayer_${room.id}`,
      title: `PvP Battle: ${room.name}`,
      description: `Real-time memory battle with ${room.currentPlayers.length} players`,
      activityType: "memory_game",
      difficulty: room.settings.difficulty === 'easy' ? 1 : room.settings.difficulty === 'medium' ? 2 : room.settings.difficulty === 'hard' ? 3 : 4,
      category: "multiplayer",
      sortOrder: 0,
      isLocked: false,
      diamondReward: 200,
      experienceReward: 400,
      estimatedMinutes: 10,
      isActive: true,
      tags: ["multiplayer", "pvp", "memory"],
      totalAttempts: 0,
      content: {
        pairs: [
          { id: 1, text: "Python Variable", match: "x = 5" },
          { id: 2, text: "For Loop", match: "for i in range(10):" },
          { id: 3, text: "Function Definition", match: "def my_function():" },
          { id: 4, text: "List Creation", match: "[1, 2, 3, 4, 5]" },
          { id: 5, text: "Dictionary", match: "{'key': 'value'}" },
          { id: 6, text: "If Statement", match: "if condition:" },
          { id: 7, text: "Class Definition", match: "class MyClass:" },
          { id: 8, text: "Import Statement", match: "import pandas as pd" },
        ],
        timeLimit: room.settings.timeLimit,
        shuffleCards: true,
        difficulty: room.settings.difficulty,
      },
    };
    
    setSelectedActivity(multiplayerActivity);
    setActiveMode('learning'); // Switch to game view
  };

  const launchActivity = (activity: LearningActivity) => {
    if (activity.isLocked && !isActivityUnlocked(activity)) {
      setShowSuccessMessage("🔒 Complete previous challenges to unlock this one!");
      setTimeout(() => setShowSuccessMessage(""), 4000);
      return;
    }
    setSelectedActivity(activity);
  };

  const closeActivity = () => {
    setSelectedActivity(null);
    fetchActivities();
  };

  const isActivityUnlocked = (activity: LearningActivity): boolean => {
    if (!activity.isLocked) return true;
    if (!isAuthenticated) return false;
    
    if (activity.prerequisiteId) {
      const prerequisite = activities.find(a => a.id === activity.prerequisiteId);
      return prerequisite?.userProgress?.completed || false;
    }
    
    return true;
  };

  const getCategoryProgress = (category: string) => {
    const categoryActivities = groupedActivities[category] || [];
    const completed = categoryActivities.filter(a => a.userProgress?.completed).length;
    const total = categoryActivities.length;
    const unlockedCount = categoryActivities.filter(a => isActivityUnlocked(a)).length;
    
    return { completed, total, unlockedCount, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  // Check if a category/topic is unlocked based on previous topic completion
  const isCategoryUnlocked = (category: string): boolean => {
    if (!isAuthenticated) return false;
    
    // Get all categories sorted by their first activity's sortOrder
    const sortedCategories = Object.keys(groupedActivities).sort((a, b) => {
      const aFirstOrder = groupedActivities[a][0]?.sortOrder || 0;
      const bFirstOrder = groupedActivities[b][0]?.sortOrder || 0;
      return aFirstOrder - bFirstOrder;
    });
    
    const currentIndex = sortedCategories.indexOf(category);
    
    // First topic is always unlocked
    if (currentIndex === 0) return true;
    
    // Check if previous topic is completed enough (at least 80%)
    if (currentIndex > 0) {
      const previousCategory = sortedCategories[currentIndex - 1];
      const previousProgress = getCategoryProgress(previousCategory);
      return previousProgress.percentage >= 80; // Unlock when previous topic is 80% complete
    }
    
    return false;
  };

  const toggleTopic = (category: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getActivityStats = () => {
    const total = activities.length;
    const completed = activities.filter(a => a.userProgress?.completed).length;
    const totalDiamonds = activities.reduce((sum, a) => sum + a.diamondReward, 0);
    const earnedDiamonds = activities.filter(a => a.userProgress?.completed).reduce((sum, a) => sum + a.diamondReward, 0);
    
    return { total, completed, totalDiamonds, earnedDiamonds };
  };

  const activityStats = getActivityStats();

  if (loading) {
    return (
      <>
        <Head>
          <title>Code Arena - Interactive Programming Challenges</title>
          <meta name="description" content="Master programming through interactive challenges, memory games, and progressive learning paths. Earn rewards while learning Python, algorithms, and web development." />
        </Head>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-lg text-slate-600">Loading your learning journey...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Code Arena - Interactive Programming Challenges</title>
        <meta name="description" content="Master programming through interactive challenges, memory games, and progressive learning paths. Earn rewards while learning Python, algorithms, and web development." />
        <meta name="keywords" content="programming challenges, coding practice, Python learning, algorithms, web development, interactive learning" />
        <meta property="og:title" content="Code Arena - Interactive Programming Challenges" />
        <meta property="og:description" content="Master programming through interactive challenges and earn rewards!" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-12 lg:py-16">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block">Code Arena</span>
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Master Programming
                </span>
              </h1>
              <p className="mx-auto mb-8 max-w-3xl text-lg text-blue-100 sm:text-xl">
                Transform your coding skills through interactive challenges, progressive learning paths,
                and gamified experiences. Compete with players worldwide, learn, and earn rewards!
              </p>
              
              {/* Quick Stats */}
              <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{activityStats.total}</div>
                  <div className="text-sm text-blue-200">Challenges</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{isAuthenticated ? activityStats.completed : 0}</div>
                  <div className="text-sm text-blue-200">Completed</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{activityStats.totalDiamonds}</div>
                  <div className="text-sm text-blue-200">💎 Available</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">
                    {isAuthenticated && activityStats.total > 0
                      ? Math.round((activityStats.completed / activityStats.total) * 100)
                      : 0}%
                  </div>
                  <div className="text-sm text-blue-200">Progress</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mode Selection */}
        <section className="bg-white border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <div className="flex space-x-2 bg-slate-100 rounded-xl p-2">
                <button
                  onClick={() => setActiveMode('learning')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeMode === 'learning'
                      ? 'bg-white text-purple-600 shadow-md'
                      : 'text-slate-600 hover:text-purple-600'
                  }`}
                >
                  <Brain className="h-5 w-5" />
                  <span>Learning Journey</span>
                </button>
                <button
                  onClick={() => setActiveMode('multiplayer')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeMode === 'multiplayer'
                      ? 'bg-white text-purple-600 shadow-md'
                      : 'text-slate-600 hover:text-purple-600'
                  }`}
                >
                  <Gamepad2 className="h-5 w-5" />
                  <span>Multiplayer Arena</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* User Dashboard */}
          {isAuthenticated && (
            <section className="mb-8 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white lg:p-8">
              <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-2xl font-bold">
                    {user?.level || 1}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Welcome back, Coder!</h2>
                    <p className="text-slate-300">Level {user?.level || 1} • {user?.experience || 0} XP</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                  <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm">
                    <Diamond className="mx-auto mb-2 h-8 w-8 text-yellow-400" />
                    <div className="text-xl font-bold">{user?.currentDiamonds || 0}</div>
                    <div className="text-xs text-slate-300">Diamonds</div>
                  </div>
                  <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm">
                    <Flame className="mx-auto mb-2 h-8 w-8 text-orange-400" />
                    <div className="text-xl font-bold">3</div>
                    <div className="text-xs text-slate-300">Day Streak</div>
                  </div>
                  <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm lg:block hidden">
                    <Trophy className="mx-auto mb-2 h-8 w-8 text-purple-400" />
                    <div className="text-xl font-bold">{activityStats.completed}</div>
                    <div className="text-xs text-slate-300">Victories</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-8 animate-bounce rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
              <p className="text-lg font-semibold text-emerald-800">{showSuccessMessage}</p>
            </div>
          )}

          {/* Search & Filters */}
          <section className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Topics</option>
                {Object.keys(groupedActivities).map((category) => (
                  <option key={category} value={category}>
                    {CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG]?.title || category}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDifficulty("");
                  setSelectedCategory("");
                }}
                className="rounded-xl bg-slate-100 px-4 py-3 text-slate-700 transition-colors hover:bg-slate-200"
              >
                Clear Filters
              </button>
            </div>
          </section>

          {/* Content based on active mode */}
          {activeMode === 'multiplayer' ? (
            <MultiplayerArena
              onGameStart={handleMultiplayerGameStart}
              userId={user?.id || "guest_user"}
              username={user?.username || "Guest Player"}
            />
          ) : (
            <>
              {/* Learning Path */}
              <main className="space-y-8">
                <header className="text-center">
                  <h2 className="mb-2 text-3xl font-bold text-slate-900">Your Learning Journey</h2>
                  <p className="text-lg text-slate-600">Progress through structured learning paths and unlock new challenges</p>
                </header>

            {Object.keys(groupedActivities).length > 0 ? (
              <div className="space-y-8">
                {/* Learning Path Overview */}
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
                  {Object.entries(groupedActivities)
                    .filter(([category]) => !selectedCategory || category === selectedCategory)
                    // Sort categories by their first activity's sortOrder to maintain proper sequence
                    .sort(([categoryA], [categoryB]) => {
                      const aFirstOrder = groupedActivities[categoryA][0]?.sortOrder || 0;
                      const bFirstOrder = groupedActivities[categoryB][0]?.sortOrder || 0;
                      return aFirstOrder - bFirstOrder;
                    })
                    .map(([category, categoryActivities], categoryIndex) => {
                      const progress = getCategoryProgress(category);
                      const isUnlocked = isCategoryUnlocked(category);
                      const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG] || {
                        title: category,
                        description: "Programming challenges",
                        icon: "💻",
                        gradient: "from-slate-500 to-slate-600",
                        bgGradient: "from-slate-50 to-slate-50"
                      };
                      
                      return (
                        <div
                          key={category}
                          className={`relative rounded-2xl p-6 shadow-lg bg-gradient-to-br border-2 transition-all duration-300 overflow-hidden group ${
                            isUnlocked
                              ? `${config.bgGradient} cursor-pointer hover:scale-[1.02] ${
                                  expandedTopics[category]
                                    ? 'border-blue-500 shadow-xl ring-2 ring-blue-200'
                                    : 'border-slate-200 hover:border-blue-300 hover:shadow-xl'
                                }`
                              : 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 opacity-70 cursor-not-allowed'
                          }`}
                          onClick={() => isUnlocked ? toggleTopic(category) : null}
                        >
                          {/* Lock watermark for locked topics */}
                          {!isUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <Lock className="h-32 w-32 text-slate-400/30 group-hover:text-slate-500/40 transition-colors" />
                            </div>
                          )}

                          {/* Sequential number badge */}
                          <div className={`absolute top-3 left-3 h-8 w-8 rounded-full text-sm font-bold flex items-center justify-center ${
                            isUnlocked ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-400 text-slate-200'
                          }`}>
                            {categoryIndex + 1}
                          </div>

                          {/* Click indicator - only show if unlocked */}
                          {isUnlocked && (
                            <div className="absolute top-3 right-3 opacity-60 group-hover:opacity-100 transition-opacity z-10">
                              <div className="flex items-center space-x-1 text-xs font-medium text-slate-500">
                                <span>Click to {expandedTopics[category] ? 'collapse' : 'expand'}</span>
                                {expandedTopics[category] ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </div>
                            </div>
                          )}

                          {/* Locked indicator */}
                          {!isUnlocked && (
                            <div className="absolute top-3 right-3 z-10">
                              <div className="flex items-center space-x-1 text-xs font-medium text-slate-500 bg-slate-200/80 px-2 py-1 rounded-full">
                                <Lock className="h-3 w-3" />
                                <span>Locked</span>
                              </div>
                            </div>
                          )}

                          <div className="mb-4 flex items-center justify-between relative z-10">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white text-2xl shadow-lg ${
                              isUnlocked
                                ? `bg-gradient-to-r ${config.gradient}`
                                : 'bg-slate-400'
                            }`}>
                              {config.icon}
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                                {progress.percentage}%
                              </div>
                              <div className={`text-sm ${isUnlocked ? 'text-slate-600' : 'text-slate-400'}`}>
                                Complete
                              </div>
                            </div>
                          </div>
                          
                          <h3 className={`mb-2 text-lg font-bold relative z-10 ${
                            isUnlocked ? 'text-slate-900' : 'text-slate-500'
                          }`}>
                            {config.title}
                          </h3>
                          <p className={`mb-4 text-sm pr-20 relative z-10 ${
                            isUnlocked ? 'text-slate-600' : 'text-slate-400'
                          }`}>
                            {config.description}
                          </p>

                          {/* Unlock requirement message */}
                          {!isUnlocked && categoryIndex > 0 && (
                            <div className="mb-4 relative z-10">
                              <div className="bg-amber-100 border border-amber-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2 text-amber-800">
                                  <Lock className="h-4 w-4" />
                                  <span className="text-sm font-medium">
                                    Complete 80% of the previous topic to unlock
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Sequential Progress Indicator */}
                          <div className="mb-4 relative z-10">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-xs font-medium ${isUnlocked ? 'text-slate-500' : 'text-slate-400'}`}>
                                Topic Progress
                              </span>
                              {isUnlocked && progress.completed < progress.total && (
                                <div className="flex items-center space-x-1 text-xs text-amber-600">
                                  <Target className="h-3 w-3" />
                                  <span>Complete challenges</span>
                                </div>
                              )}
                            </div>
                            <div className="h-2 rounded-full bg-slate-200">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 relative ${
                                  isUnlocked
                                    ? `bg-gradient-to-r ${config.gradient}`
                                    : 'bg-slate-300'
                                }`}
                                style={{ width: `${progress.percentage}%` }}
                              >
                                {progress.percentage > 0 && progress.percentage < 100 && (
                                  <div className="absolute right-0 top-0 h-2 w-1 bg-white/80 rounded-full"></div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm relative z-10">
                            <span className={isUnlocked ? 'text-slate-600' : 'text-slate-400'}>
                              {progress.completed}/{progress.total} challenges
                            </span>
                            <div className="flex items-center space-x-2">
                              <Diamond className={`h-4 w-4 ${isUnlocked ? 'text-yellow-500' : 'text-slate-400'}`} />
                              <span className={`font-semibold ${isUnlocked ? 'text-slate-700' : 'text-slate-500'}`}>
                                {categoryActivities.reduce((sum, a) => sum + a.diamondReward, 0)}
                              </span>
                            </div>
                          </div>

                          {/* Expansion indicator */}
                          {isUnlocked && (
                            <div className="mt-3 pt-3 border-t border-slate-200/50 relative z-10">
                              <div className="flex items-center justify-center text-xs text-slate-500">
                                {expandedTopics[category] ? (
                                  <span className="flex items-center space-x-1">
                                    <span>Showing challenges below</span>
                                    <ChevronDown className="h-3 w-3" />
                                  </span>
                                ) : (
                                  <span className="flex items-center space-x-1">
                                    <span>Click to view {progress.total} challenges</span>
                                    <ChevronRight className="h-3 w-3" />
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </section>

                {/* Detailed Learning Tracks */}
                {Object.entries(groupedActivities)
                  .filter(([category]) => !selectedCategory || category === selectedCategory)
                  .map(([category, categoryActivities]) => {
                    const progress = getCategoryProgress(category);
                    const isExpanded = expandedTopics[category];
                    const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG] || {
                      title: category,
                      description: "Programming challenges",
                      icon: "💻",
                      gradient: "from-slate-500 to-slate-600",
                      bgGradient: "from-slate-50 to-slate-50"
                    };
                    
                    if (!isExpanded) return null;
                    
                    return (
                      <section key={category} className="rounded-3xl bg-white p-8 shadow-xl">
                        <header className="mb-8 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${config.gradient} text-white text-3xl`}>
                              {config.icon}
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-slate-900">{config.title}</h3>
                              <p className="text-slate-600">{config.description}</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => toggleTopic(category)}
                            className="rounded-xl bg-slate-100 p-3 transition-colors hover:bg-slate-200"
                          >
                            <ChevronDown className="h-6 w-6 text-slate-600" />
                          </button>
                        </header>

                        {/* Activities Grid */}
                        <div className="space-y-4">
                          {categoryActivities
                            .filter((activity) =>
                              activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              activity.description.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((activity, index) => {
                              const isUnlocked = isActivityUnlocked(activity);
                              const difficultyConfig = DIFFICULTY_CONFIG[activity.difficulty as keyof typeof DIFFICULTY_CONFIG] || DIFFICULTY_CONFIG[1];
                              
                              return (
                                <article
                                  key={activity.id}
                                  className={`group rounded-2xl border-2 p-6 transition-all duration-300 relative ${
                                    isUnlocked
                                      ? 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg'
                                      : 'border-red-200 bg-red-50/30 opacity-75'
                                  }`}
                                >
                                  {/* Sequential Lock Indicator */}
                                  {!isUnlocked && (
                                    <div className="absolute top-3 right-3 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                                      <Lock className="h-3 w-3" />
                                      <span>Complete #{String(index).padStart(2, '0')} first</span>
                                    </div>
                                  )}

                                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                                    {/* Activity Number & Icon with Sequential Indicator */}
                                    <div className="flex items-center space-x-4">
                                      <div className="relative">
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-xl font-bold transition-all ${
                                          isUnlocked
                                            ? activity.userProgress?.completed
                                              ? 'border-emerald-300 bg-emerald-100 text-emerald-700 shadow-lg'
                                              : 'border-blue-300 bg-blue-100 text-blue-700 shadow-md'
                                            : 'border-red-300 bg-red-100 text-red-500'
                                        }`}>
                                          {isUnlocked ? (
                                            activity.userProgress?.completed ? (
                                              <CheckCircle className="h-6 w-6" />
                                            ) : activity.activityType === 'memory_game' ? (
                                              <Brain className="h-6 w-6" />
                                            ) : (
                                              <Code className="h-6 w-6" />
                                            )
                                          ) : (
                                            <Lock className="h-6 w-6" />
                                          )}
                                        </div>
                                        
                                        {/* Sequential number badge */}
                                        <div className={`absolute -top-2 -right-2 h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center ${
                                          isUnlocked ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
                                        }`}>
                                          {index + 1}
                                        </div>
                                      </div>
                                      
                                      {/* Sequential connection line */}
                                      {index < categoryActivities.length - 1 && (
                                        <div className="hidden lg:flex items-center">
                                          <div className={`w-8 h-0.5 ${
                                            activity.userProgress?.completed ? 'bg-emerald-300' : 'bg-slate-300'
                                          }`}></div>
                                          <ChevronRight className={`h-4 w-4 ${
                                            activity.userProgress?.completed ? 'text-emerald-500' : 'text-slate-400'
                                          }`} />
                                        </div>
                                      )}
                                    </div>

                                    {/* Activity Content */}
                                    <div className="flex-1">
                                      <div className="mb-3 flex flex-wrap items-center gap-3">
                                        <h4 className={`text-xl font-bold ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                                          {activity.title}
                                        </h4>
                                        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${difficultyConfig.color}`}>
                                          {difficultyConfig.icon} {difficultyConfig.label}
                                        </span>
                                        {activity.userProgress?.completed && (
                                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 border border-emerald-200">
                                            ✓ Completed
                                          </span>
                                        )}
                                      </div>
                                      
                                      <p className={`mb-4 text-sm ${isUnlocked ? 'text-slate-600' : 'text-slate-400'}`}>
                                        {activity.description}
                                      </p>

                                      {/* Progress Bar */}
                                      {activity.userProgress && isUnlocked && (
                                        <div className="mb-4">
                                          <div className="h-2 w-full rounded-full bg-slate-200">
                                            <div
                                              className={`h-2 rounded-full transition-all duration-500 ${
                                                activity.userProgress.completed
                                                  ? 'bg-emerald-500'
                                                  : 'bg-blue-500'
                                              }`}
                                              style={{ width: `${activity.userProgress.percentage}%` }}
                                            />
                                          </div>
                                        </div>
                                      )}

                                      {/* Rewards & Time */}
                                      <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <div className="flex items-center space-x-1">
                                          <Diamond className="h-4 w-4 text-yellow-500" />
                                          <span className="font-semibold text-yellow-600">+{activity.diamondReward}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Star className="h-4 w-4 text-purple-500" />
                                          <span className="font-semibold text-purple-600">+{activity.experienceReward} XP</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Clock className="h-4 w-4 text-slate-500" />
                                          <span className="text-slate-600">{activity.estimatedMinutes} min</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex-shrink-0">
                                      {isAuthenticated ? (
                                        <button
                                          onClick={() => launchActivity(activity)}
                                          disabled={!isUnlocked}
                                          className={`flex items-center space-x-2 rounded-xl px-6 py-3 font-semibold transition-all ${
                                            !isUnlocked
                                              ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                                              : activity.userProgress?.completed
                                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 hover:shadow-xl'
                                          }`}
                                        >
                                          {!isUnlocked ? (
                                            <>
                                              <Lock className="h-5 w-5" />
                                              <span>Locked</span>
                                            </>
                                          ) : activity.userProgress?.completed ? (
                                            <>
                                              <Trophy className="h-5 w-5" />
                                              <span>Retry</span>
                                            </>
                                          ) : activity.userProgress ? (
                                            <>
                                              <Play className="h-5 w-5" />
                                              <span>Continue</span>
                                            </>
                                          ) : (
                                            <>
                                              <Sparkles className="h-5 w-5" />
                                              <span>Start</span>
                                            </>
                                          )}
                                        </button>
                                      ) : (
                                        <Link
                                          href="/login"
                                          className="flex items-center space-x-2 rounded-xl bg-slate-100 px-6 py-3 font-semibold text-slate-600 transition-colors hover:bg-slate-200"
                                        >
                                          <Shield className="h-5 w-5" />
                                          <span>Sign In</span>
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                </article>
                              );
                            })}
                        </div>
                      </section>
                    );
                  })}
              </div>
            ) : (
              <div className="py-16 text-center">
                <Target className="mx-auto mb-6 h-20 w-20 text-slate-400" />
                <h3 className="mb-4 text-2xl font-bold text-slate-900">No Challenges Found</h3>
                <p className="text-lg text-slate-600">Check back soon for new coding adventures!</p>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <nav className="flex justify-center pt-8">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`flex items-center space-x-1 rounded-lg px-4 py-2 font-medium transition-colors ${
                      currentPage === 1
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-white text-slate-700 hover:bg-slate-50 shadow-sm"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`h-10 w-10 rounded-lg font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                              : "bg-white text-slate-700 hover:bg-slate-50 shadow-sm"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`flex items-center space-x-1 rounded-lg px-4 py-2 font-medium transition-colors ${
                      currentPage === totalPages
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-white text-slate-700 hover:bg-slate-50 shadow-sm"
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </nav>
              )}
            </main>
          </>
          )}
        </div>

        {/* Activity Modal */}
        {selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
              <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">{selectedActivity.title}</h2>
                      <p className="text-slate-600">{selectedActivity.description}</p>
                    </div>
                    {multiplayerRoom && (
                      <div className="flex items-center space-x-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                        <Users className="h-4 w-4" />
                        <span>Multiplayer Battle</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={closeActivity}
                    className="rounded-xl bg-slate-100 p-3 text-slate-600 transition-colors hover:bg-slate-200"
                  >
                    ✕
                  </button>
                </div>
              </header>
              
              <div className="overflow-y-auto max-h-[calc(95vh-140px)] p-8">
                {selectedActivity.activityType === 'memory_game' && (
                  <ImprovedMemoryGame
                    activityId={selectedActivity.id}
                    content={selectedActivity.content}
                    diamondReward={selectedActivity.diamondReward}
                    experienceReward={selectedActivity.experienceReward}
                    onComplete={handleActivityComplete}
                    isCompleted={selectedActivity.userProgress?.completed || false}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}