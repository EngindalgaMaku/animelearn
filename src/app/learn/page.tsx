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
  Filter,
  Search,
  Award,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Package,
  Gamepad2,
  Trophy,
  Target,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  GamificationHub,
  DailyMiniQuiz,
  StreakDashboard,
  XPEventsDashboard,
  CardPackOpening,
  calculateLevel,
  calculateExperienceToNext,
  DiamondCounter,
  LevelIndicator,
} from "@/components/gamification";
import MemoryGame from "@/components/learn/MemoryGame";

interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: number;
  order: number;
  duration: number;
  category: string;
  diamondReward: number;
  experienceReward: number;
  hasCodeExercise: boolean;
  prerequisites: string | null;
  progress?: {
    isStarted: boolean;
    isCompleted: boolean;
    score: number | null;
    attempts: number;
    timeSpent: number;
    completedAt: string | null;
  };
}

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  activityType: string;
  difficulty: number;
  category: string;
  topicOrder: number;
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

interface LessonsResponse {
  success: boolean;
  lessons: Lesson[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats: {
    totalLessons: number;
    categories: Array<{ name: string; count: number }>;
    difficulties: Array<{ level: number; count: number }>;
  };
}

const DIFFICULTY_COLORS = {
  1: "bg-green-100 text-green-800",
  2: "bg-blue-100 text-blue-800",
  3: "bg-yellow-100 text-yellow-800",
  4: "bg-orange-100 text-orange-800",
  5: "bg-red-100 text-red-800",
};

const DIFFICULTY_LABELS = {
  1: "Beginner",
  2: "Basic",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

export default function LearnPage() {
  const [activities, setActivities] = useState<LearningActivity[]>([]);
  const [groupedActivities, setGroupedActivities] = useState<{[key: string]: LearningActivity[]}>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState("");
  const [showGamificationPanel, setShowGamificationPanel] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<LearningActivity | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<{[key: string]: boolean}>({});
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
        limit: "50", // Increase limit to get all activities for proper grouping
        ...(selectedDifficulty && { difficulty: selectedDifficulty }),
        ...(selectedCategory && { category: selectedCategory }),
      });

      const response = await fetch(`/api/learning-activities?${params}`);
      if (response.ok) {
        const data: ActivitiesResponse = await response.json();
        setActivities(data.activities);
        
        // Group activities by category and sort by topicOrder
        const grouped = data.activities.reduce((acc, activity) => {
          if (!acc[activity.category]) {
            acc[activity.category] = [];
          }
          acc[activity.category].push(activity);
          return acc;
        }, {} as {[key: string]: LearningActivity[]});
        
        // Sort activities within each category by topicOrder
        Object.keys(grouped).forEach(category => {
          grouped[category].sort((a, b) => a.topicOrder - b.topicOrder);
        });
        
        setGroupedActivities(grouped);
        
        // Auto-expand first topic
        const categories = Object.keys(grouped);
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
      // Submit the activity completion to the API
      const response = await fetch(`/api/learning-activities/${selectedActivity.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score,
          timeSpent,
          hintsUsed: 0, // Will be updated by MemoryGame if needed
          mistakes: 0,  // Will be updated by MemoryGame if needed
          answers: {},  // Will be updated by MemoryGame if needed
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.rewards && data.rewards.diamonds > 0) {
          setShowSuccessMessage(
            `🎉 Activity completed! +${data.rewards.diamonds} diamonds, +${data.rewards.experience} XP earned!`
          );
        } else if (success) {
          setShowSuccessMessage("🎉 Activity completed successfully!");
        } else {
          setShowSuccessMessage("Activity attempted. Try again to improve your score!");
        }
        
        setTimeout(() => setShowSuccessMessage(""), 4000);
        
        // Refresh activities to update progress
        fetchActivities();

        // Close modal after a short delay
        setTimeout(() => {
          setSelectedActivity(null);
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to submit activity completion:", error);
      setShowSuccessMessage("❌ Failed to save progress. Please try again.");
      setTimeout(() => setShowSuccessMessage(""), 4000);
    }
  };

  const launchActivity = (activity: LearningActivity) => {
    // Check if activity is locked
    if (activity.isLocked && !isActivityUnlocked(activity)) {
      setShowSuccessMessage("🔒 Bu aktiviteyi oynamak için önce prerequisite aktiviteleri tamamlamalısınız!");
      setTimeout(() => setShowSuccessMessage(""), 4000);
      return;
    }
    setSelectedActivity(activity);
  };

  const closeActivity = () => {
    setSelectedActivity(null);
    fetchActivities(); // Refresh to get updated progress
  };

  // Check if an activity is unlocked based on prerequisites
  const isActivityUnlocked = (activity: LearningActivity): boolean => {
    if (!activity.isLocked) return true;
    if (!isAuthenticated) return false;
    
    // If has prerequisite, check if it's completed
    if (activity.prerequisiteId) {
      const prerequisite = activities.find(a => a.id === activity.prerequisiteId);
      return prerequisite?.userProgress?.completed || false;
    }
    
    return true;
  };

  // Get category progress
  const getCategoryProgress = (category: string) => {
    const categoryActivities = groupedActivities[category] || [];
    const completed = categoryActivities.filter(a => a.userProgress?.completed).length;
    const total = categoryActivities.length;
    const unlockedCount = categoryActivities.filter(a => isActivityUnlocked(a)).length;
    
    return { completed, total, unlockedCount, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  // Toggle topic expansion
  const toggleTopic = (category: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Get categories for filter
  const getCategories = () => {
    return Object.keys(groupedActivities);
  };

  // Calculate activity stats
  const getActivityStats = () => {
    const total = activities.length;
    const completed = activities.filter(a => a.userProgress?.completed).length;
    const inProgress = activities.filter(a => a.userProgress && !a.userProgress.completed).length;
    const totalDiamonds = activities.reduce((sum, a) => sum + a.diamondReward, 0);
    const totalXP = activities.reduce((sum, a) => sum + a.experienceReward, 0);
    
    return { total, completed, inProgress, totalDiamonds, totalXP };
  };

  const activityStats = getActivityStats();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-lg text-gray-600">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative mb-8 overflow-hidden rounded-3xl py-16 text-center">
          {/* Background Images */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="/hero/hero4.jpg"
              alt="Learning Hero"
              className="absolute left-4 top-4 h-20 w-20 rotate-12 rounded-2xl object-cover opacity-20 md:h-28 md:w-28"
            />
            <img
              src="/features/features1.jpg"
              alt="Python Learning"
              className="absolute right-8 top-8 h-24 w-24 -rotate-12 rounded-2xl object-cover opacity-15 md:h-32 md:w-32"
            />
            <img
              src="/features/features2.jpg"
              alt="Coding"
              className="absolute bottom-4 left-1/4 h-16 w-16 rotate-45 rounded-2xl object-cover opacity-10 md:h-24 md:w-24"
            />
            <img
              src="/features/features3.jpg"
              alt="Achievement"
              className="w-18 h-18 md:w-26 md:h-26 absolute bottom-8 right-1/3 -rotate-45 rounded-2xl object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-green-600/5"></div>
          </div>

          <div className="relative z-10">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              🎯 Interactive Learning Hub
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Master programming concepts through interactive activities and comprehensive lessons.
              Play games, solve puzzles, and earn diamonds while learning!
            </p>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <Gamepad2 className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {activityStats.total}
                </p>
                <p className="text-gray-600">Total Activities</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {isAuthenticated ? activityStats.completed : 0}
                </p>
                <p className="text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <Diamond className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {activityStats.totalDiamonds}
                </p>
                <p className="text-gray-600">Total Diamonds</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {isAuthenticated && activityStats.total > 0
                    ? Math.round((activityStats.completed / activityStats.total) * 100)
                    : 0}
                  %
                </p>
                <p className="text-gray-600">Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gamification Panel */}
        {isAuthenticated && showGamificationPanel && (
          <div className="mb-8 rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                🎮 Your Learning Journey
              </h3>
              <button
                onClick={() => setShowGamificationPanel(false)}
                className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200"
              >
                Hide Panel
              </button>
            </div>

            {/* User Stats Bar */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Your Level</p>
                    <div className="text-2xl font-bold">
                      Level {user?.level || 1}
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-400 font-bold text-white">
                      {user?.level || 1}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100">Your Diamonds</p>
                    <div className="text-2xl font-bold">
                      💎 {user?.currentDiamonds || 0}
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <Diamond className="h-8 w-8 animate-pulse text-yellow-200" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Total XP</p>
                    <div className="text-2xl font-bold">
                      ⭐ {user?.experience || 0}
                    </div>
                  </div>
                  <Star className="h-8 w-8 text-purple-200" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show Gamification Panel Button */}
        {isAuthenticated && !showGamificationPanel && (
          <div className="mb-8 text-center">
            <button
              onClick={() => setShowGamificationPanel(true)}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-purple-600"
            >
              🎮 Show Your Learning Dashboard
            </button>
          </div>
        )}

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-8 animate-pulse rounded-2xl border border-green-200 bg-green-100 p-4 text-center">
            <p className="text-lg font-medium text-green-800">
              {showSuccessMessage}
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Topics</option>
              {getCategories().map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedDifficulty("");
                setSelectedCategory("");
              }}
              className="w-full rounded-xl bg-gray-100 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Topic-Based Progressive Learning */}
        <div className="space-y-6">
          {Object.keys(groupedActivities).length > 0 ? (
            <div className="space-y-6">
              {/* Learning Path Overview */}
              <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <h3 className="mb-4 text-2xl font-bold">📚 Your Learning Path</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  {Object.entries(groupedActivities).map(([category, categoryActivities]) => {
                    const progress = getCategoryProgress(category);
                    return (
                      <div key={category} className="rounded-xl bg-white/20 p-4 backdrop-blur-sm">
                        <h4 className="mb-2 font-semibold">{category}</h4>
                        <div className="mb-2 text-2xl font-bold">{progress.percentage}%</div>
                        <div className="mb-2 h-2 rounded-full bg-white/30">
                          <div
                            className="h-2 rounded-full bg-white"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                        <p className="text-sm text-white/80">
                          {progress.completed}/{progress.total} completed
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Topic Categories */}
              {Object.entries(groupedActivities)
                .filter(([category]) => !selectedCategory || category === selectedCategory)
                .map(([category, categoryActivities]) => {
                  const progress = getCategoryProgress(category);
                  const isExpanded = expandedTopics[category];
                  
                  return (
                    <div key={category} className="rounded-2xl bg-white/80 shadow-lg backdrop-blur-sm">
                      {/* Topic Header */}
                      <div
                        className="cursor-pointer px-6 py-4"
                        onClick={() => toggleTopic(category)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                              <BookOpen className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{category}</h3>
                              <p className="text-gray-600">
                                {progress.completed}/{progress.total} activities completed • {progress.unlockedCount}/{progress.total} unlocked
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            {/* Total Rewards for Topic */}
                            <div className="flex items-center space-x-4 rounded-xl bg-gradient-to-r from-yellow-100 to-purple-100 px-4 py-2">
                              <div className="flex items-center space-x-1">
                                <Diamond className="h-5 w-5 text-yellow-500" />
                                <span className="font-bold text-yellow-600">
                                  {categoryActivities.reduce((sum, a) => sum + a.diamondReward, 0)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-5 w-5 text-purple-500" />
                                <span className="font-bold text-purple-600">
                                  {categoryActivities.reduce((sum, a) => sum + a.experienceReward, 0)}
                                </span>
                              </div>
                            </div>
                            
                            {/* Progress Circle */}
                            <div className="relative h-12 w-12">
                              <svg className="h-12 w-12 -rotate-90 transform" viewBox="0 0 36 36">
                                <path
                                  className="stroke-current text-gray-200"
                                  strokeWidth="3"
                                  fill="none"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                  className="stroke-current text-green-500"
                                  strokeWidth="3"
                                  strokeDasharray={`${progress.percentage}, 100`}
                                  strokeLinecap="round"
                                  fill="none"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-700">{progress.percentage}%</span>
                              </div>
                            </div>
                            
                            {isExpanded ? (
                              <ChevronDown className="h-6 w-6 text-gray-400" />
                            ) : (
                              <ChevronRight className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Topic Activities */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 p-6">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {categoryActivities
                              .filter((activity) =>
                                activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                activity.description.toLowerCase().includes(searchTerm.toLowerCase())
                              )
                              .filter((activity) =>
                                selectedDifficulty ? activity.difficulty.toString() === selectedDifficulty : true
                              )
                              .map((activity) => {
                                const isUnlocked = isActivityUnlocked(activity);
                                
                                return (
                                  <div
                                    key={activity.id}
                                    className={`group overflow-hidden rounded-xl transition-all duration-300 ${
                                      isUnlocked
                                        ? 'bg-white shadow-lg hover:shadow-xl'
                                        : 'bg-gray-100 opacity-75'
                                    }`}
                                  >
                                    <div className="p-4">
                                      {/* Activity Header */}
                                      <div className="mb-3 flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                            isUnlocked
                                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                              : 'bg-gray-300 text-gray-500'
                                          }`}>
                                            {isUnlocked ? (
                                              activity.activityType === 'memory_game' ? (
                                                <Brain className="h-5 w-5" />
                                              ) : (
                                                <Gamepad2 className="h-5 w-5" />
                                              )
                                            ) : (
                                              <Lock className="h-5 w-5" />
                                            )}
                                          </div>
                                          <div>
                                            <span
                                              className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                DIFFICULTY_COLORS[
                                                  activity.difficulty as keyof typeof DIFFICULTY_COLORS
                                                ]
                                              }`}
                                            >
                                              {DIFFICULTY_LABELS[activity.difficulty as keyof typeof DIFFICULTY_LABELS]}
                                            </span>
                                          </div>
                                        </div>
                                        
                                        {/* Status Badge */}
                                        {isUnlocked ? (
                                          activity.userProgress?.completed ? (
                                            <div className="flex items-center space-x-1 text-green-600">
                                              <Trophy className="h-4 w-4" />
                                              <span className="text-xs font-medium">Complete</span>
                                            </div>
                                          ) : activity.userProgress ? (
                                            <div className="flex items-center space-x-1 text-blue-600">
                                              <Target className="h-4 w-4" />
                                              <span className="text-xs font-medium">Progress</span>
                                            </div>
                                          ) : (
                                            <div className="rounded-full bg-blue-100 px-2 py-1">
                                              <span className="text-xs font-medium text-blue-800">Ready</span>
                                            </div>
                                          )
                                        ) : (
                                          <div className="rounded-full bg-gray-200 px-2 py-1">
                                            <span className="text-xs font-medium text-gray-600">Locked</span>
                                          </div>
                                        )}
                                      </div>

                                      <h4 className={`mb-2 text-lg font-bold ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {activity.title}
                                      </h4>

                                      <p className={`mb-3 text-sm line-clamp-2 ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                                        {activity.description}
                                      </p>

                                      {/* Enhanced Reward Display */}
                                      <div className="mb-3 rounded-lg bg-gradient-to-r from-yellow-50 to-purple-50 p-3">
                                        <div className="flex items-center justify-center space-x-4">
                                          <div className="flex items-center space-x-1">
                                            <Diamond className="h-5 w-5 text-yellow-500" />
                                            <span className="font-bold text-yellow-600">+{activity.diamondReward}</span>
                                          </div>
                                          <div className="flex items-center space-x-1">
                                            <Star className="h-5 w-5 text-purple-500" />
                                            <span className="font-bold text-purple-600">+{activity.experienceReward}</span>
                                          </div>
                                          <div className="flex items-center space-x-1">
                                            <Clock className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">{activity.estimatedMinutes}min</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Progress Bar */}
                                      {activity.userProgress && isUnlocked && (
                                        <div className="mb-3">
                                          <div className="h-2 w-full rounded-full bg-gray-200">
                                            <div
                                              className={`h-2 rounded-full transition-all duration-300 ${
                                                activity.userProgress.completed
                                                  ? 'bg-green-500'
                                                  : 'bg-blue-500'
                                              }`}
                                              style={{ width: `${activity.userProgress.percentage}%` }}
                                            />
                                          </div>
                                        </div>
                                      )}

                                      {/* Action Button */}
                                      {isAuthenticated ? (
                                        <button
                                          onClick={() => launchActivity(activity)}
                                          disabled={!isUnlocked}
                                          className={`flex w-full items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                            !isUnlocked
                                              ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                                              : activity.userProgress?.completed
                                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:from-purple-700 hover:to-pink-700 hover:shadow-xl'
                                          }`}
                                        >
                                          {!isUnlocked ? (
                                            <>
                                              <Lock className="mr-2 h-4 w-4" />
                                              Locked
                                            </>
                                          ) : activity.userProgress?.completed ? (
                                            <>
                                              <Trophy className="mr-2 h-4 w-4" />
                                              Play Again
                                            </>
                                          ) : activity.userProgress ? (
                                            <>
                                              <Play className="mr-2 h-4 w-4" />
                                              Continue
                                            </>
                                          ) : (
                                            <>
                                              <Gamepad2 className="mr-2 h-4 w-4" />
                                              Start
                                            </>
                                          )}
                                        </button>
                                      ) : (
                                        <Link
                                          href="/login"
                                          className="flex w-full items-center justify-center rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                                        >
                                          <Lock className="mr-2 h-4 w-4" />
                                          Sign In to Play
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-xl font-medium text-gray-900">
                No Learning Topics Found
              </h3>
              <p className="text-gray-600">
                Check back soon for new progressive learning topics!
              </p>
            </div>
          )}
        </div>

        {/* Activity Modal */}
        {selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedActivity.title}
                  </h2>
                  <button
                    onClick={closeActivity}
                    className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                {selectedActivity.activityType === 'memory_game' && (
                  <MemoryGame
                    activityId={selectedActivity.id}
                    content={selectedActivity.content}
                    diamondReward={selectedActivity.diamondReward}
                    experienceReward={selectedActivity.experienceReward}
                    onComplete={handleActivityComplete}
                  />
                )}
                {/* Add other activity types here as they're implemented */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
