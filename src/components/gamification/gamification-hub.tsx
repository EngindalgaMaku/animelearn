"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Trophy,
  Target,
  Calendar,
  Zap,
  Gift,
  Star,
  TrendingUp,
  Users,
  Award,
  GamepadIcon,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

// Import all gamification components
import DailyMiniQuiz from "./daily-mini-quiz";
import CardPackOpening from "./card-pack-opening";
import StreakDashboard from "./streak-dashboard";
import XPEventsDashboard from "./xp-events-dashboard";
import DailyLoginDashboard from "./daily-login-dashboard";

interface UserGamificationStats {
  level: number;
  experience: number;
  experienceToNext: number;
  diamonds: number;
  totalCards: number;
  currentStreak: number;
  totalAchievements: number;
  weeklyXP: number;
  rank: number;
}

interface TodayQuests {
  dailyQuiz: { completed: boolean; progress: number; total: number };
  lessonComplete: { completed: boolean; progress: number; total: number };
  streakMaintain: { completed: boolean; progress: number; total: number };
  cardPackOpen: { completed: boolean; progress: number; total: number };
}

interface GamificationHubProps {
  className?: string;
}

const GamificationHub: React.FC<GamificationHubProps> = ({
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [stats, setStats] = useState<UserGamificationStats | null>(null);
  const [todayQuests, setTodayQuests] = useState<TodayQuests | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGamificationData();
  }, []);

  const fetchGamificationData = async () => {
    try {
      setLoading(true);
      // Bu API endpoint'i genel gamification verilerini getirecek
      const response = await fetch("/api/gamification/overview");
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setTodayQuests(data.todayQuests);
      } else {
        setError(data.error || "Gamification verileri yüklenirken hata oluştu");
      }
    } catch (err) {
      setError("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <TrendingUp className="h-5 w-5" />,
      description: "Progress summary and daily quests",
    },
    {
      id: "streaks",
      label: "Streaks",
      icon: <Target className="h-5 w-5" />,
      description: "Daily streaks and milestones",
    },
    {
      id: "events",
      label: "XP Events",
      icon: <Zap className="h-5 w-5" />,
      description: "Bonus XP events",
    },
    {
      id: "daily-login",
      label: "Daily Login",
      icon: <Calendar className="h-5 w-5" />,
      description: "Daily login bonuses",
    },
    {
      id: "quiz",
      label: "Mini Quiz",
      icon: <Trophy className="h-5 w-5" />,
      description: "Daily knowledge test",
    },
    {
      id: "cards",
      label: "Card Packs",
      icon: <Gift className="h-5 w-5" />,
      description: "Card pack opening",
    },
  ];

  const getXPProgress = () => {
    if (!stats) return 0;
    return (
      (stats.experience / (stats.experience + stats.experienceToNext)) * 100
    );
  };

  const getQuestProgress = () => {
    if (!todayQuests) return 0;
    const completed = Object.values(todayQuests).filter(
      (quest) => quest.completed
    ).length;
    return (completed / Object.keys(todayQuests).length) * 100;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* User Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-4 text-center"
          >
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500">
              <span className="text-lg font-bold text-white">
                {stats.level}
              </span>
            </div>
            <div className="mb-1 text-sm text-purple-600">Seviye</div>
            <div className="h-2 w-full rounded-full bg-purple-200">
              <motion.div
                className="h-2 rounded-full bg-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${getXPProgress()}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="mt-1 text-xs text-purple-500">
              {stats.experienceToNext} XP kaldı
            </div>
          </motion.div>

          <div className="rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 text-center">
            <Star className="mx-auto mb-2 h-8 w-8 text-yellow-600" />
            <div className="text-lg font-bold text-yellow-700">
              {stats.diamonds}
            </div>
            <div className="text-sm text-yellow-600">Diamond</div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 text-center">
            <Trophy className="mx-auto mb-2 h-8 w-8 text-blue-600" />
            <div className="text-lg font-bold text-blue-700">
              {stats.currentStreak}
            </div>
            <div className="text-sm text-blue-600">Günlük Streak</div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-4 text-center">
            <Award className="mx-auto mb-2 h-8 w-8 text-green-600" />
            <div className="text-lg font-bold text-green-700">
              {stats.totalAchievements}
            </div>
            <div className="text-sm text-green-600">Achievement</div>
          </div>
        </div>
      )}

      {/* Today's Quests */}
      {todayQuests && (
        <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Bugünün Görevleri
            </h3>
            <div className="text-sm text-gray-600">
              {
                Object.values(todayQuests).filter((quest) => quest.completed)
                  .length
              }{" "}
              / {Object.keys(todayQuests).length} tamamlandı
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6 h-3 w-full rounded-full bg-gray-200">
            <motion.div
              className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${getQuestProgress()}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>

          {/* Quest list */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Object.entries(todayQuests).map(([questKey, quest]) => (
              <motion.div
                key={questKey}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`flex items-center justify-between rounded-lg p-3 transition-colors ${
                  quest.completed
                    ? "border border-green-200 bg-green-100"
                    : "border border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      quest.completed ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    {quest.completed ? (
                      <Trophy className="h-4 w-4 text-white" />
                    ) : (
                      <Target className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <div
                      className={`font-medium ${
                        quest.completed ? "text-green-800" : "text-gray-700"
                      }`}
                    >
                      {questKey === "dailyQuiz" && "Günlük Quiz"}
                      {questKey === "lessonComplete" && "Ders Tamamla"}
                      {questKey === "streakMaintain" && "Streak Koru"}
                      {questKey === "cardPackOpen" && "Kart Paketi Aç"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {quest.progress}/{quest.total}
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className={`h-5 w-5 ${
                    quest.completed ? "text-green-600" : "text-gray-400"
                  }`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {tabs.slice(1).map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-purple-300 hover:shadow-md"
          >
            <div className="mb-2 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                {tab.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{tab.label}</div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">{tab.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "streaks":
        return <StreakDashboard />;
      case "events":
        return <XPEventsDashboard />;
      case "daily-login":
        return <DailyLoginDashboard />;
      case "quiz":
        return <DailyMiniQuiz />;
      case "cards":
        return (
          <div className="text-center p-8">
            <Gift className="h-16 w-16 mx-auto mb-4 text-purple-500" />
            <h3 className="text-xl font-semibold mb-2">Card Pack Opening</h3>
            <p className="text-gray-600 mb-4">Open card packs to discover new cards!</p>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Open Card Pack
            </button>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-1/4 rounded bg-gray-200"></div>
          <div className="mb-6 grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-lg bg-gray-200"></div>
            ))}
          </div>
          <div className="h-48 rounded-lg bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
        <div className="text-center">
          <GamepadIcon className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h3 className="mb-2 text-xl font-semibold text-gray-900">Hata</h3>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={fetchGamificationData}
            className="mx-auto flex items-center space-x-2 rounded-lg bg-purple-600 px-6 py-2 text-white transition-colors hover:bg-purple-700"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Tekrar Dene</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl bg-white shadow-lg ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Learning Journey
              </h1>
              <p className="text-gray-600">
                Track your progress, earn rewards, and unlock achievements
              </p>
            </div>
          </div>
          <button
            onClick={fetchGamificationData}
            className="p-2 text-gray-400 transition-colors hover:text-gray-600"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 whitespace-nowrap border-b-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-purple-500 bg-purple-50 text-purple-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GamificationHub;
