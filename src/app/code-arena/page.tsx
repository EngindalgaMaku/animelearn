"use client";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import {
  BookOpen,
  Diamond,
  Star,
  Search,
  Filter,
  ArrowRight,
  BarChart3,
  X,
  Map,
  CheckCircle,
  Clock,
  Trophy,
  Rocket,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  RewardNotificationProvider,
  useRewardHelpers,
} from "@/contexts/RewardNotificationContext";
import {
  AnimatedProfileStats,
  useAnimatedStats,
} from "@/components/gamification/animated-profile-stats";
import { RewardClaimButton } from "@/components/gamification/reward-claim-button";
import {
  LearningActivity,
  ArenaConfig,
  ActivitiesResponse,
} from "@/types/learning-activity";

// Lazy load heavy components for better performance
const ActivityRenderer = lazy(
  () => import("@/components/learn/ActivityRenderer")
);
const ActivityCard = lazy(() => import("@/components/code-arena/ActivityCard"));
const CategorySection = lazy(
  () => import("@/components/code-arena/CategorySection")
);

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
  const [selectedTopic, setSelectedTopic] = useState("Python Fundamentals");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<{
    [key: string]: boolean;
  }>({
    "Python Fundamentals": true,
  });

  // Notification states
  const [showSuccessMessage, setShowSuccessMessage] = useState("");

  // Reward claim states
  const [showRewardButton, setShowRewardButton] = useState(false);
  const [rewardClaimData, setRewardClaimData] = useState<any>(null);

  const { isAuthenticated, user } = useAuth();
  const { showCodeArenaComplete } = useRewardHelpers();

  // Performance optimizations
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect user preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    setEnableAnimations(!mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      setEnableAnimations(!e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

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
  }, [user]);

  // Optimize initial data fetching - combine API calls
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchConfig(),
        fetchAllActivities(),
        fetchActivities(),
      ]);
    };
    initializeData();
  }, []);

  useEffect(() => {
    fetchActivities(); // Re-fetch when filters change
    // Auto-expand the selected topic's accordion
    setExpandedCategories((prev) => ({
      ...prev,
      [selectedTopic]: true,
    }));
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
    // Show login incentive for anonymous users but allow them to proceed
    if (!isAuthenticated) {
      setShowSuccessMessage(
        "🎯 Try this challenge! Sign in to save your progress and earn rewards!"
      );
      setTimeout(() => setShowSuccessMessage(""), 4000);
    }

    // Scroll to top before opening modal
    window.scrollTo({ top: 0, behavior: "smooth" });

    setSelectedActivity(activity);
  };

  const closeActivity = () => {
    setSelectedActivity(null);
    fetchActivities();
  };

  // Memoize heavy calculations to prevent re-computation on every render
  const activityStats = useMemo(() => {
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
  }, [activities]);

  const getCategoryProgress = useCallback(
    (category: string) => {
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
    },
    [groupedActivities]
  );

  if (loading || configLoading || !config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-lg text-slate-600">
            Loading your coding adventure...
          </p>
        </div>
      </div>
    );
  }

  const stats = activityStats;
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

      {/* Enhanced Hero Section with Integrated Topic Selection */}
      <section
        className={`relative overflow-hidden bg-gradient-to-br ${uiConfig.headerGradient} py-20`}
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30"></div>
        {enableAnimations && uiConfig.enableAnimations && (
          <div className="absolute inset-0">
            <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-cyan-400/20 blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-pink-400/20 blur-3xl"></div>
          </div>
        )}

        <div className="relative mx-auto max-w-7xl px-4 text-center text-white sm:px-6 lg:px-8">
          {enableAnimations ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="mb-6 flex justify-center">
                <div className="rounded-3xl bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-2 text-sm font-black text-purple-900 shadow-2xl">
                  🚀 INTERACTIVE CODING CHALLENGES
                </div>
              </div>
              <h1 className="mb-8 text-5xl font-black md:text-7xl">
                <span className="block bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent drop-shadow-2xl">
                  {uiConfig.heroTitle}
                </span>
                <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent drop-shadow-2xl">
                  {uiConfig.heroSubtitle}
                </span>
              </h1>

              {/* Integrated Topic Selection */}
              <div className="mb-8 flex flex-col items-center space-y-6 md:flex-row md:justify-center md:space-x-8 md:space-y-0">
                {/* Topic Selector */}
                <div className="flex items-center space-x-4">
                  <span className="text-xl font-bold text-white">
                    Choose Your Path:
                  </span>
                  <div className="relative">
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="hover:shadow-3xl appearance-none rounded-3xl border-2 border-white/30 bg-slate-800 px-8 py-4 pr-16 text-xl font-bold text-white shadow-2xl backdrop-blur-xl transition-all hover:border-white/50 focus:border-white/70 focus:outline-none focus:ring-4 focus:ring-white/30"
                    >
                      <option
                        value="Python Fundamentals"
                        style={{ backgroundColor: "#1e293b", color: "white" }}
                      >
                        🐍 Python Fundamentals
                      </option>
                      <option
                        value="Data Structures"
                        style={{ backgroundColor: "#1e293b", color: "white" }}
                      >
                        📊 Data Structures
                      </option>
                      <option
                        value="Algorithms"
                        style={{ backgroundColor: "#1e293b", color: "white" }}
                      >
                        🧮 Algorithms
                      </option>
                      <option
                        value="Functions & OOP"
                        style={{ backgroundColor: "#1e293b", color: "white" }}
                      >
                        🏗️ Functions & OOP
                      </option>
                      <option
                        value="Web Development"
                        style={{ backgroundColor: "#1e293b", color: "white" }}
                      >
                        🌐 Web Development
                      </option>
                      <option
                        value="Data Science"
                        style={{ backgroundColor: "#1e293b", color: "white" }}
                      >
                        📈 Data Science
                      </option>
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Activity count and Filter */}
                <div className="flex items-center space-x-4">
                  <div className="rounded-3xl border border-white/30 bg-gradient-to-r from-white/20 to-white/10 px-6 py-3 text-white shadow-2xl backdrop-blur-xl">
                    <span className="text-xl font-black">
                      {activities.length}
                    </span>
                    <span className="ml-2 text-sm font-medium opacity-90">
                      challenges
                    </span>
                  </div>

                  {uiConfig.showFilters && (
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`hover:shadow-3xl rounded-3xl p-4 shadow-2xl transition-all hover:scale-105 ${
                        showFilters
                          ? "border-2 border-white/50 bg-gradient-to-r from-white/30 to-white/20 text-white"
                          : "border-2 border-white/20 bg-gradient-to-r from-white/10 to-white/5 text-white/80"
                      } backdrop-blur-xl`}
                    >
                      <Filter className="h-6 w-6" />
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic description based on selected topic */}
              <p className="mx-auto mb-10 max-w-3xl text-xl font-medium text-indigo-100">
                {categoryConfigs[selectedTopic]
                  ? `${categoryConfigs[selectedTopic].description} - ${uiConfig.heroDescription}`
                  : uiConfig.heroDescription.replace(
                      "{stats.total}",
                      stats.total.toString()
                    )}
              </p>
            </motion.div>
          ) : (
            <div>
              <div className="mb-6 flex justify-center">
                <div className="rounded-3xl bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-2 text-sm font-black text-purple-900 shadow-2xl">
                  🚀 INTERACTIVE CODING CHALLENGES
                </div>
              </div>
              <h1 className="mb-8 text-5xl font-black md:text-7xl">
                <span className="block bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent drop-shadow-2xl">
                  {uiConfig.heroTitle}
                </span>
                <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent drop-shadow-2xl">
                  {uiConfig.heroSubtitle}
                </span>
              </h1>

              {/* Integrated Topic Selection - Non-animated */}
              <div className="mb-8 flex flex-col items-center space-y-6 md:flex-row md:justify-center md:space-x-8 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <span className="text-xl font-bold text-white">
                    Choose Your Path:
                  </span>
                  <div className="relative">
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="hover:shadow-3xl appearance-none rounded-3xl border-2 border-white/30 bg-slate-800 px-8 py-4 pr-16 text-xl font-bold text-white shadow-2xl backdrop-blur-xl transition-all hover:border-white/50 focus:border-white/70 focus:outline-none focus:ring-4 focus:ring-white/30"
                    >
                      <option
                        value="Python Fundamentals"
                        style={{ backgroundColor: "#1e293b", color: "white" }}
                      >
                        🐍 Python Fundamentals
                      </option>
                      <option
                        value="Data Structures"
                        style={{ backgroundColor: "#1e293b", color: "white" }}
                      >
                        📊 Data Structures
                      </option>
                      <option
                        value="Algorithms"
                        style={{ backgroundColor: "#1e293b", color: "white" }}
                      >
                        🧮 Algorithms
                      </option>
                      <option
                        value="Functions & OOP"
                        style={{ backgroundColor: "#1e293b", color: "white" }}
                      >
                        🏗️ Functions & OOP
                      </option>
                      <option
                        value="Web Development"
                        style={{ backgroundColor: "#1e293b", color: "white" }}
                      >
                        🌐 Web Development
                      </option>
                      <option
                        value="Data Science"
                        style={{ backgroundColor: "#1e293b", color: "white" }}
                      >
                        📈 Data Science
                      </option>
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="rounded-3xl border border-white/30 bg-gradient-to-r from-white/20 to-white/10 px-6 py-3 text-white shadow-2xl backdrop-blur-xl">
                    <span className="text-xl font-black">
                      {activities.length}
                    </span>
                    <span className="ml-2 text-sm font-medium opacity-90">
                      challenges
                    </span>
                  </div>

                  {uiConfig.showFilters && (
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`hover:shadow-3xl rounded-3xl p-4 shadow-2xl transition-all hover:scale-105 ${
                        showFilters
                          ? "border-2 border-white/50 bg-gradient-to-r from-white/30 to-white/20 text-white"
                          : "border-2 border-white/20 bg-gradient-to-r from-white/10 to-white/5 text-white/80"
                      } backdrop-blur-xl`}
                    >
                      <Filter className="h-6 w-6" />
                    </button>
                  )}
                </div>
              </div>

              <p className="mx-auto mb-10 max-w-3xl text-xl font-medium text-indigo-100">
                {categoryConfigs[selectedTopic]
                  ? `${categoryConfigs[selectedTopic].description} - ${uiConfig.heroDescription}`
                  : uiConfig.heroDescription.replace(
                      "{stats.total}",
                      stats.total.toString()
                    )}
              </p>
            </div>
          )}

          {/* Topic-Specific Stats */}
          {uiConfig.showStats && (
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
              <div className="rounded-3xl border border-white/30 bg-gradient-to-br from-white/20 to-white/5 p-6 shadow-2xl backdrop-blur-xl">
                <div className="text-4xl font-black text-yellow-300">
                  {stats.total}
                </div>
                <div className="text-sm font-bold text-cyan-200">
                  Epic Challenges
                </div>
              </div>
              <div className="rounded-3xl border border-white/30 bg-gradient-to-br from-white/20 to-white/5 p-6 shadow-2xl backdrop-blur-xl">
                <div className="text-4xl font-black text-green-300">
                  {isAuthenticated ? stats.completed : 0}
                </div>
                <div className="text-sm font-bold text-cyan-200">Conquered</div>
              </div>
              <div className="rounded-3xl border border-white/30 bg-gradient-to-br from-white/20 to-white/5 p-6 shadow-2xl backdrop-blur-xl">
                <div className="text-4xl font-black text-orange-300">
                  {stats.percentage}%
                </div>
                <div className="text-sm font-bold text-cyan-200">Mastery</div>
              </div>
              <div className="rounded-3xl border border-white/30 bg-gradient-to-br from-white/20 to-white/5 p-6 shadow-2xl backdrop-blur-xl">
                <div className="text-4xl font-black text-pink-300">
                  {Object.keys(groupedActivities).length}
                </div>
                <div className="text-sm font-bold text-cyan-200">Domains</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Filters Section */}
      <AnimatePresence mode="wait">
        {showFilters && uiConfig.showFilters && (
          <motion.section
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-b border-slate-200 bg-white"
          >
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">All Categories</option>
                  <option value="Python Fundamentals">
                    🐍 Python Fundamentals
                  </option>
                  <option value="Data Structures">📊 Data Structures</option>
                  <option value="Algorithms">🧮 Algorithms</option>
                  <option value="Functions & OOP">🏗️ Functions & OOP</option>
                  <option value="Web Development">🌐 Web Development</option>
                  <option value="Data Science">📈 Data Science</option>
                </select>

                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">All Difficulties</option>
                  {Object.entries(difficultyConfigs).map(([level, config]) => (
                    <option key={level} value={level}>
                      {config.icon} {config.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedTopic("Python Fundamentals");
                    setSelectedDifficulty("");
                  }}
                  className="rounded-xl bg-slate-100 px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

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
        {showRewardButton && rewardClaimData && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform"
          >
            <RewardClaimButton
              rewards={rewardClaimData}
              onClaimRewards={() => {
                // Handle reward claiming with animations
                const completionData = (window as any)._pendingCompletionData;

                if (completionData) {
                  console.log("🎁 Claiming rewards with data:", completionData);

                  // Update profile stats with correct property mapping
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
                    console.log("📊 Updating stats:", {
                      old: userStats,
                      new: newStats,
                    });
                    setUserStats(newStats);
                    updateStats(newStats);
                  }

                  // Show animated rewards using the API response
                  console.log("🎭 Showing animated rewards...");
                  showCodeArenaComplete(completionData);
                } else {
                  console.warn(
                    "⚠️ No completion data found for reward claiming"
                  );
                }

                // Hide the claim button and success message
                setShowRewardButton(false);
                setRewardClaimData(null);
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
        <Suspense
          fallback={
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-2xl bg-slate-200"
                ></div>
              ))}
            </div>
          }
        >
          <div className="space-y-4">
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
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    difficultyConfig={difficultyConfig}
                    activityTypeConfig={activityTypeConfig}
                    onLaunch={launchActivity}
                    index={index}
                    enableAnimations={enableAnimations}
                    layout="horizontal"
                  />
                );
              })}
          </div>
        </Suspense>

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
      </main>

      {/* Activity Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "1rem",
              paddingTop: "5rem",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
              style={{
                maxHeight: "90vh",
              }}
            >
              <header className="flex items-center justify-end border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6">
                <button
                  onClick={closeActivity}
                  className="rounded-xl bg-white p-2 shadow-sm transition-shadow hover:shadow-md"
                >
                  <X className="h-5 w-5 text-slate-600" />
                </button>
              </header>

              <div className="max-h-[calc(90vh-100px)] overflow-y-auto">
                <Suspense
                  fallback={
                    <div className="flex h-64 items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    </div>
                  }
                >
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
                              experienceReward:
                                selectedActivity.experienceReward,
                              activityTitle: selectedActivity.title,
                            }),
                          }
                        );

                        if (response.ok) {
                          const completionData = await response.json();
                          console.log(
                            "✅ Activity completion response:",
                            completionData
                          );

                          // Prepare reward data for claim button - fix response mapping
                          const rewardData = {
                            diamonds:
                              completionData.rewards?.diamonds ||
                              selectedActivity.diamondReward,
                            experience:
                              completionData.rewards?.experience ||
                              selectedActivity.experienceReward,
                            levelUp: completionData.rewards?.levelUp || false,
                            newLevel: completionData.rewards?.newLevel,
                            badges: completionData.rewards?.badges || [],
                            activityTitle: selectedActivity.title,
                            score: score,
                          };

                          console.log("🎁 Prepared reward data:", rewardData);
                          console.log(
                            "🔍 showRewardButton state before:",
                            showRewardButton
                          );

                          // Show reward claim button - direct state update
                          setRewardClaimData(rewardData);
                          setShowRewardButton(true);

                          // Check state after React state update
                          setTimeout(() => {
                            console.log(
                              "🔍 showRewardButton state after timeout:",
                              showRewardButton
                            );
                            console.log(
                              "🔍 rewardClaimData after timeout:",
                              rewardClaimData
                            );
                          }, 100);

                          // Store completion data for later use when claiming rewards
                          (window as any)._pendingCompletionData =
                            completionData;

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
                </Suspense>
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
