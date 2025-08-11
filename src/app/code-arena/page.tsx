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
  Filter,
  ArrowRight,
  Trophy,
  Target,
  Brain,
  Users,
  Zap,
  Award,
  Home,
  User,
  Settings,
  ChevronDown,
  ChevronRight,
  Code,
  Sparkles,
  Flame,
  Shield,
  TrendingUp,
  BarChart3,
  Gamepad2,
  ArrowLeft,
  X,
  Map,
  Compass,
  Rocket,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import ActivityRenderer from "@/components/learn/ActivityRenderer";
import {
  RewardNotificationProvider,
  useRewardHelpers,
} from "@/contexts/RewardNotificationContext";
import {
  AnimatedProfileStats,
  useAnimatedStats,
} from "@/components/gamification/animated-profile-stats";
import {
  RewardClaimButton,
  useRewardClaim,
} from "@/components/gamification/reward-claim-button";

interface ArenaConfig {
  difficultyConfigs: {
    [key: number]: {
      label: string;
      color: string;
      icon: string;
      bgColor: string;
      textColor: string;
      borderColor: string;
    };
  };
  categoryConfigs: {
    [key: string]: {
      title: string;
      description: string;
      icon: string;
      gradient: string;
      bgGradient: string;
      iconBg: string;
    };
  };
  activityTypeConfigs: {
    [key: string]: {
      name: string;
      icon: string;
      color: string;
    };
  };
  uiConfig: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    headerGradient: string;
    showStats: boolean;
    showFilters: boolean;
    enableAnimations: boolean;
  };
}

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

function CodeArenaContent() {
  // Core states
  const [config, setConfig] = useState<ArenaConfig | null>(null);
  const [activities, setActivities] = useState<LearningActivity[]>([]);
  const [allActivities, setAllActivities] = useState<LearningActivity[]>([]);
  const [groupedActivities, setGroupedActivities] = useState<{
    [key: string]: LearningActivity[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [configLoading, setConfigLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] =
    useState<LearningActivity | null>(null);

  // UI states
  const [selectedTopic, setSelectedTopic] = useState("Python Fundamentals"); // Default to Python Fundamentals
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Notification states
  const [showSuccessMessage, setShowSuccessMessage] = useState("");

  const { isAuthenticated, user } = useAuth();
  const { showCodeArenaComplete } = useRewardHelpers();
  const { pendingRewards, showClaimButton, showRewardClaim, hideRewardClaim } =
    useRewardClaim();

  // Profile stats management
  const [userStats, setUserStats] = useState({
    level: user?.level || 1,
    experience: user?.experience || 0,
    diamonds: user?.currentDiamonds || 0,
    expToNextLevel: user?.level
      ? (user.level + 1) * 1000 - (user.experience || 0)
      : 1000,
    totalXP: user?.experience || 0,
    codeArenasCompleted: user?.codeArenasCompleted || 0,
    quizzesCompleted: user?.quizzesCompleted || 0,
  });

  const {
    stats: animatedStats,
    updateStats,
    isUpdating,
  } = useAnimatedStats(userStats);

  // Update user stats when user data changes
  useEffect(() => {
    if (user) {
      const newStats = {
        level: user.level || 1,
        experience: user.experience || 0,
        diamonds: user.currentDiamonds || 0,
        expToNextLevel: (user.level + 1) * 1000 - (user.experience || 0),
        totalXP: user.experience || 0,
        codeArenasCompleted: user.codeArenasCompleted || 0,
        quizzesCompleted: user.quizzesCompleted || 0,
      };
      setUserStats(newStats);
      updateStats(newStats);
    }
  }, [user, updateStats]);

  useEffect(() => {
    fetchConfig();
    fetchAllActivities(); // Fetch all activities for card counts
    fetchActivities(); // Fetch filtered activities for display
  }, []);

  useEffect(() => {
    fetchActivities(); // Re-fetch when filters change
  }, [selectedTopic, selectedDifficulty]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchActivities();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchConfig = async () => {
    try {
      setConfigLoading(true);
      const response = await fetch("/api/arena-config");
      if (response.ok) {
        const data = await response.json();
        setConfig(data.config);
      } else {
        // Fallback to default config if no config found
        setConfig(getDefaultConfig());
      }
    } catch (error) {
      console.error("Config fetch failed:", error);
      setConfig(getDefaultConfig());
    } finally {
      setConfigLoading(false);
    }
  };

  const getDefaultConfig = (): ArenaConfig => {
    return {
      difficultyConfigs: {
        1: {
          label: "Beginner",
          color: "from-emerald-400 to-emerald-600",
          icon: "🌱",
          bgColor: "bg-emerald-50",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-200",
        },
        2: {
          label: "Basic",
          color: "from-blue-400 to-blue-600",
          icon: "📚",
          bgColor: "bg-blue-50",
          textColor: "text-blue-700",
          borderColor: "border-blue-200",
        },
        3: {
          label: "Intermediate",
          color: "from-amber-400 to-amber-600",
          icon: "⚡",
          bgColor: "bg-amber-50",
          textColor: "text-amber-700",
          borderColor: "border-amber-200",
        },
        4: {
          label: "Advanced",
          color: "from-purple-400 to-purple-600",
          icon: "🚀",
          bgColor: "bg-purple-50",
          textColor: "text-purple-700",
          borderColor: "border-purple-200",
        },
        5: {
          label: "Expert",
          color: "from-red-400 to-red-600",
          icon: "👑",
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-200",
        },
      },
      categoryConfigs: {
        "Python Fundamentals": {
          title: "Python Fundamentals",
          description: "Master the building blocks of Python programming",
          icon: "🐍",
          gradient: "from-green-500 to-emerald-600",
          bgGradient: "from-green-50 to-emerald-50",
          iconBg: "bg-green-500",
        },
        "Data Structures": {
          title: "Data Structures",
          description: "Learn essential data organization techniques",
          icon: "📊",
          gradient: "from-blue-500 to-cyan-600",
          bgGradient: "from-blue-50 to-cyan-50",
          iconBg: "bg-blue-500",
        },
        Algorithms: {
          title: "Algorithms",
          description: "Solve problems with efficient algorithms",
          icon: "🧮",
          gradient: "from-purple-500 to-violet-600",
          bgGradient: "from-purple-50 to-violet-50",
          iconBg: "bg-purple-500",
        },
        "Functions & OOP": {
          title: "Functions & OOP",
          description: "Object-oriented programming concepts",
          icon: "🏗️",
          gradient: "from-indigo-500 to-blue-600",
          bgGradient: "from-indigo-50 to-blue-50",
          iconBg: "bg-indigo-500",
        },
        "Web Development": {
          title: "Web Development",
          description: "Build modern web applications",
          icon: "🌐",
          gradient: "from-orange-500 to-red-600",
          bgGradient: "from-orange-50 to-red-50",
          iconBg: "bg-orange-500",
        },
        "Data Science": {
          title: "Data Science",
          description: "Analyze and visualize data",
          icon: "📈",
          gradient: "from-pink-500 to-rose-600",
          bgGradient: "from-pink-50 to-rose-50",
          iconBg: "bg-pink-500",
        },
      },
      activityTypeConfigs: {
        drag_drop: { name: "Drag & Drop", icon: "🎯", color: "text-blue-600" },
        memory_game: {
          name: "Memory Game",
          icon: "🧠",
          color: "text-purple-600",
        },
        quiz: { name: "Quiz", icon: "❓", color: "text-green-600" },
        fill_blanks: {
          name: "Fill Blanks",
          icon: "✏️",
          color: "text-orange-600",
        },
        interactive_coding: {
          name: "Code Lab",
          icon: "💻",
          color: "text-indigo-600",
        },
        algorithm_visualization: {
          name: "Algorithm Viz",
          icon: "🔄",
          color: "text-teal-600",
        },
        matching: { name: "Matching", icon: "🔗", color: "text-pink-600" },
        code_builder: {
          name: "Code Builder",
          icon: "🏗️",
          color: "text-cyan-600",
        },
        class_builder: {
          name: "Class Builder",
          icon: "🏛️",
          color: "text-violet-600",
        },
        interactive_demo: {
          name: "Demo",
          icon: "🎪",
          color: "text-emerald-600",
        },
        data_exploration: {
          name: "Data Explorer",
          icon: "🔍",
          color: "text-amber-600",
        },
      },
      uiConfig: {
        heroTitle: "Master Programming",
        heroSubtitle: "Through Epic Learning",
        heroDescription:
          "🎯 Embark on an epic coding adventure with interactive challenges, unlock achievements, and build world-class programming skills!",
        primaryColor: "#6366f1",
        secondaryColor: "#ec4899",
        accentColor: "#06b6d4",
        backgroundColor: "from-indigo-50 via-white to-cyan-50",
        headerGradient: "from-indigo-600 via-purple-600 to-pink-600",
        showStats: true,
        showFilters: true,
        enableAnimations: true,
      },
    };
  };

  const fetchAllActivities = async () => {
    try {
      const response = await fetch(`/api/learning-activities?limit=100`);
      if (response.ok) {
        const data: ActivitiesResponse = await response.json();
        setAllActivities(data.activities);
      }
    } catch (error) {
      console.error("All activities fetch failed:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: "50",
        category: selectedTopic, // Only fetch activities for selected topic
        ...(selectedDifficulty && { difficulty: selectedDifficulty }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/learning-activities?${params}`);
      if (response.ok) {
        const data: ActivitiesResponse = await response.json();
        setActivities(data.activities);

        // Group activities by category (just for consistency, will only have one category)
        const grouped = data.activities.reduce(
          (acc, activity) => {
            if (!acc[activity.category]) {
              acc[activity.category] = [];
            }
            acc[activity.category].push(activity);
            return acc;
          },
          {} as { [key: string]: LearningActivity[] }
        );

        // Sort activities within each category
        Object.keys(grouped).forEach((category) => {
          grouped[category].sort((a, b) => a.sortOrder - b.sortOrder);
        });

        setGroupedActivities(grouped);
      }
    } catch (error) {
      console.error("Activities fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const launchActivity = (activity: LearningActivity) => {
    if (!isAuthenticated) {
      setShowSuccessMessage("🔐 Please sign in to start learning!");
      setTimeout(() => setShowSuccessMessage(""), 3000);
      return;
    }

    setSelectedActivity(activity);
  };

  const closeActivity = () => {
    setSelectedActivity(null);
    fetchActivities();
  };

  const getActivityStats = () => {
    const total = activities.length;
    const completed = activities.filter(
      (a) => a.userProgress?.completed
    ).length;
    const totalDiamonds = activities.reduce(
      (sum, a) => sum + a.diamondReward,
      0
    );
    const earnedDiamonds = activities
      .filter((a) => a.userProgress?.completed)
      .reduce((sum, a) => sum + a.diamondReward, 0);

    return {
      total,
      completed,
      totalDiamonds,
      earnedDiamonds,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const getCategoryProgress = (category: string) => {
    const categoryActivities = groupedActivities[category] || [];
    const completed = categoryActivities.filter(
      (a) => a.userProgress?.completed
    ).length;
    const total = categoryActivities.length;

    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  if (loading || configLoading || !config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-lg text-slate-600">
            Loading your coding adventure...
          </p>
        </motion.div>
      </div>
    );
  }

  const stats = getActivityStats();
  const { difficultyConfigs, categoryConfigs, activityTypeConfigs, uiConfig } =
    config;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${uiConfig.backgroundColor}`}
    >
      {/* Profile Stats Header */}
      {isAuthenticated && (
        <div className="sticky top-16 z-40 border-b border-indigo-200/30 bg-gradient-to-r from-white/95 to-indigo-50/95 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <AnimatedProfileStats
              stats={animatedStats}
              variant="header"
              animated={true}
              className="mx-auto max-w-2xl"
            />
          </div>
        </div>
      )}

      {/* Simple Topic Selector */}
      <section className="relative border-b border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Code Arena</h2>
              <p className="text-slate-600">
                Choose a topic and start learning
              </p>
            </div>

            {/* Topic Selector */}
            <div className="flex items-center space-x-4">
              <label
                htmlFor="topic-select"
                className="text-sm font-medium text-slate-700"
              >
                Topic:
              </label>
              <select
                id="topic-select"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Python Fundamentals">
                  🐍 Python Fundamentals
                </option>
                <option value="Data Structures">📊 Data Structures</option>
                <option value="Algorithms">🧮 Algorithms</option>
                <option value="Functions & OOP">🏗️ Functions & OOP</option>
                <option value="Web Development">🌐 Web Development</option>
                <option value="Data Science">📈 Data Science</option>
              </select>

              {/* Activity count */}
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                {activities.length} activities
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed left-1/2 top-20 z-50 -translate-x-1/2 transform rounded-xl bg-green-500 px-6 py-3 text-white shadow-lg"
          >
            {showSuccessMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Claim Button */}
      <AnimatePresence>
        {showClaimButton && pendingRewards && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform"
          >
            <RewardClaimButton
              rewards={pendingRewards}
              onClaimRewards={() => {
                // Handle reward claiming with animations
                const completionData = (window as any)._pendingCompletionData;

                if (completionData) {
                  // Update profile stats
                  if (completionData.user) {
                    const newStats = {
                      level: completionData.user.level,
                      experience: completionData.user.experience,
                      diamonds: completionData.user.diamonds,
                      expToNextLevel: completionData.user.expToNextLevel,
                      totalXP: completionData.user.experience,
                      codeArenasCompleted: userStats.codeArenasCompleted + 1,
                      quizzesCompleted: userStats.quizzesCompleted,
                    };
                    setUserStats(newStats);
                    updateStats(newStats);
                  }

                  // Show animated rewards
                  showCodeArenaComplete(completionData);
                }

                // Hide the claim button and success message
                hideRewardClaim();
                setShowSuccessMessage("");

                // Clean up
                delete (window as any)._pendingCompletionData;
              }}
              className="shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Activities Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activities
              .filter(
                (activity) =>
                  activity.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  activity.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .map((activity, index) => {
                const difficultyConfig =
                  difficultyConfigs[activity.difficulty] ||
                  difficultyConfigs[1];
                const activityTypeConfig =
                  activityTypeConfigs[activity.activityType] ||
                  activityTypeConfigs.quiz;

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group rounded-3xl border-2 border-transparent bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-6 transition-all duration-300 hover:scale-105 hover:border-indigo-300 hover:shadow-2xl"
                  >
                    {/* Activity Header */}
                    <div className="mb-4 flex items-start justify-between">
                      <div
                        className={`h-16 w-16 rounded-2xl ${difficultyConfig.bgColor} flex items-center justify-center text-2xl shadow-xl transition-transform group-hover:scale-110`}
                      >
                        {difficultyConfig.icon}
                      </div>
                      {activity.userProgress?.completed && (
                        <div className="rounded-full bg-gradient-to-r from-green-400 to-emerald-500 p-2 text-white shadow-lg">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    <h4 className="mb-3 text-xl font-black text-slate-900 transition-colors group-hover:text-indigo-600">
                      {activity.title}
                    </h4>

                    <p className="mb-5 line-clamp-2 text-base font-medium text-slate-600">
                      {activity.description}
                    </p>

                    {/* Activity Meta */}
                    <div className="mb-5 flex items-center justify-between">
                      <span
                        className={`rounded-2xl px-4 py-2 text-sm font-bold ${activityTypeConfig.color} bg-gradient-to-r from-slate-100 to-slate-200 shadow-md`}
                      >
                        {activityTypeConfig.icon} {activityTypeConfig.name}
                      </span>
                      <span
                        className={`rounded-2xl px-4 py-2 text-sm font-bold ${difficultyConfig.textColor} ${difficultyConfig.bgColor} ${difficultyConfig.borderColor} border-2 shadow-md`}
                      >
                        {difficultyConfig.label}
                      </span>
                    </div>

                    {/* Rewards */}
                    <div className="mb-5 grid grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-yellow-100 to-orange-100 p-2">
                        <Diamond className="h-5 w-5 text-yellow-600" />
                        <span className="font-black text-yellow-700">
                          +{activity.diamondReward}
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 p-2">
                        <Star className="h-5 w-5 text-purple-600" />
                        <span className="font-black text-purple-700">
                          +{activity.experienceReward} XP
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 p-2">
                        <Clock className="h-5 w-5 text-slate-600" />
                        <span className="font-black text-slate-700">
                          {activity.estimatedMinutes}m
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {activity.userProgress && (
                      <div className="mb-5">
                        <div className="h-3 rounded-full bg-slate-200 shadow-inner">
                          <div
                            className={`h-3 rounded-full shadow-lg transition-all duration-500 ${
                              activity.userProgress.completed
                                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                : "bg-gradient-to-r from-blue-400 to-indigo-500"
                            }`}
                            style={{
                              width: `${activity.userProgress.percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={() => launchActivity(activity)}
                      className={`flex w-full transform items-center justify-center space-x-3 rounded-2xl py-4 text-lg font-black transition-all hover:scale-105 ${
                        activity.userProgress?.completed
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-xl hover:shadow-2xl"
                          : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl hover:shadow-2xl"
                      }`}
                    >
                      {activity.userProgress?.completed ? (
                        <>
                          <Trophy className="h-5 w-5" />
                          <span>🏆 REVIEW</span>
                        </>
                      ) : activity.userProgress ? (
                        <>
                          <Play className="h-5 w-5" />
                          <span>⚡ CONTINUE</span>
                        </>
                      ) : (
                        <>
                          <Rocket className="h-5 w-5" />
                          <span>🚀 START CHALLENGE</span>
                        </>
                      )}
                    </button>
                  </motion.div>
                );
              })}
          </div>

          {/* No activities message */}
          {activities.length === 0 && !loading && (
            <div className="py-16 text-center">
              <div className="mb-4 text-6xl">🔍</div>
              <h3 className="mb-2 text-2xl font-bold text-slate-900">
                No Activities Found
              </h3>
              <p className="text-lg text-slate-600">
                No activities available for this topic yet. Try selecting a
                different topic!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Activity Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <header className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {selectedActivity.title}
                  </h2>
                  <p className="text-slate-600">
                    {selectedActivity.description}
                  </p>
                </div>
                <button
                  onClick={closeActivity}
                  className="rounded-xl bg-white p-2 shadow-sm transition-shadow hover:shadow-md"
                >
                  <X className="h-5 w-5 text-slate-600" />
                </button>
              </header>

              <div className="max-h-[calc(90vh-100px)] overflow-y-auto">
                <ActivityRenderer
                  activity={selectedActivity}
                  onComplete={async (score, timeSpent, success) => {
                    // Handle activity completion with enhanced API
                    console.log("Activity completed:", {
                      score,
                      timeSpent,
                      success,
                    });

                    try {
                      // Call enhanced completion API
                      const response = await fetch(
                        "/api/learning-activities/complete",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            activityType: "learning_activity",
                            activityId: selectedActivity.id,
                            score: score,
                            timeSpent: timeSpent,
                            diamondReward: selectedActivity.diamondReward,
                            experienceReward: selectedActivity.experienceReward,
                            activityTitle: selectedActivity.title,
                          }),
                        }
                      );

                      if (response.ok) {
                        const completionData = await response.json();

                        // Prepare reward data for claim button
                        const rewardData = {
                          diamonds:
                            completionData.diamonds ||
                            selectedActivity.diamondReward,
                          experience:
                            completionData.experience ||
                            selectedActivity.experienceReward,
                          levelUp: completionData.levelUp || false,
                          newLevel: completionData.newLevel,
                          badges: completionData.badges || [],
                          activityTitle: selectedActivity.title,
                          score: score,
                        };

                        // Show reward claim button instead of immediate animations
                        showRewardClaim(rewardData);

                        // Store completion data for later use when claiming rewards
                        (window as any)._pendingCompletionData = completionData;

                        // Show completion message
                        if (success) {
                          setShowSuccessMessage(
                            `🎉 Great job! You scored ${score}%! Click the reward button to claim your rewards!`
                          );
                        } else {
                          setShowSuccessMessage(
                            `Good effort! You scored ${score}%. Click the reward button to claim your rewards!`
                          );
                        }

                        // Close the activity but keep reward claim visible
                        setTimeout(() => {
                          closeActivity();
                        }, 2000);
                      } else {
                        // Fallback to basic message if API fails
                        setShowSuccessMessage(
                          `Activity completed with ${score}% score!`
                        );
                        setTimeout(() => {
                          closeActivity();
                          setShowSuccessMessage("");
                        }, 3000);
                      }
                    } catch (error) {
                      console.error("Error completing activity:", error);
                      // Fallback to basic message
                      setShowSuccessMessage(
                        `Activity completed with ${score}% score!`
                      );
                      setTimeout(() => {
                        closeActivity();
                        setShowSuccessMessage("");
                      }, 3000);
                    }
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main component wrapped with RewardNotificationProvider
export default function CodeArenaPage() {
  return (
    <RewardNotificationProvider>
      <CodeArenaContent />
    </RewardNotificationProvider>
  );
}
