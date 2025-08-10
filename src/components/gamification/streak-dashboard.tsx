"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Trophy,
  Star,
  Diamond,
  Calendar,
  Book,
  Brain,
  Target,
  CheckCircle,
  Circle,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  loginStreak: number;
  lessonStreak: number;
  quizStreak: number;
  totalRewardsEarned: number;
  lastActivityDate: string | null;
  streakStartDate: string | null;
  status: "active" | "inactive" | "broken" | "completed_today";
}

interface Milestone {
  day: number;
  reward: {
    diamonds: number;
    experience: number;
    title: string;
  };
  daysLeft?: number;
}

interface TodayActivities {
  lesson: boolean;
  quiz: boolean;
  dailyQuest: boolean;
  dailyMiniQuiz: boolean;
  login: boolean;
}

interface StreakDashboardProps {
  className?: string;
}

const StreakDashboard: React.FC<StreakDashboardProps> = ({
  className = "",
}) => {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [milestones, setMilestones] = useState<{
    next: Milestone | null;
    completed: Milestone[];
  }>({ next: null, completed: [] });
  const [todayActivities, setTodayActivities] = useState<TodayActivities>({
    lesson: false,
    quiz: false,
    dailyQuest: false,
    dailyMiniQuiz: false,
    login: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStreakData();
  }, []);

  const fetchStreakData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user-streak");
      const data = await response.json();

      if (data.success) {
        setStreakData(data.streak);
        setMilestones(data.milestones);
        setTodayActivities(data.todayActivities);
      } else {
        setError(data.error || "Error loading streak data");
      }
    } catch (err) {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const updateStreakActivity = async (activityType: string) => {
    try {
      const response = await fetch("/api/user-streak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityType }),
      });

      const data = await response.json();

      if (data.success) {
        fetchStreakData(); // Refresh data
      }
    } catch (err) {
      console.error("Error updating streak activity:", err);
    }
  };

  const getStreakStatus = () => {
    if (!streakData) return { color: "text-gray-500", text: "Unknown" };

    switch (streakData.status) {
      case "active":
        return { color: "text-green-600", text: "Active" };
      case "completed_today":
        return { color: "text-blue-600", text: "Completed Today" };
      case "broken":
        return { color: "text-red-600", text: "Broken" };
      case "inactive":
        return { color: "text-gray-600", text: "Inactive" };
      default:
        return { color: "text-gray-500", text: "Unknown" };
    }
  };

  const getActivityIcon = (activity: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      lesson: <Book className="h-5 w-5" />,
      quiz: <Brain className="h-5 w-5" />,
      dailyQuest: <Target className="h-5 w-5" />,
      dailyMiniQuiz: <Zap className="h-5 w-5" />,
      login: <Calendar className="h-5 w-5" />,
    };
    return iconMap[activity] || <Circle className="h-5 w-5" />;
  };

  const getActivityLabel = (activity: string) => {
    const labelMap: { [key: string]: string } = {
      lesson: "Complete Lesson",
      quiz: "Take Quiz",
      dailyQuest: "Daily Quest",
      dailyMiniQuiz: "Mini Quiz",
      login: "Login",
    };
    return labelMap[activity] || activity;
  };

  const completedActivitiesCount =
    Object.values(todayActivities).filter(Boolean).length;
  const totalActivities = Object.keys(todayActivities).length;
  const progressPercentage = (completedActivitiesCount / totalActivities) * 100;

  if (loading) {
    return (
      <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
        <div className="animate-pulse">
          <div className="mb-6 h-6 w-1/3 rounded bg-gray-200"></div>
          <div className="space-y-4">
            <div className="h-24 rounded-lg bg-gray-200"></div>
            <div className="h-32 rounded-lg bg-gray-200"></div>
            <div className="h-40 rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
        <div className="text-center">
          <Flame className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Error</h3>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={fetchStreakData}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!streakData) {
    return (
      <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
        <div className="text-center">
          <Flame className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Streak Not Found
          </h3>
          <p className="text-gray-600">Your streak data could not be loaded.</p>
        </div>
      </div>
    );
  }

  const status = getStreakStatus();

  return (
    <div className={`space-y-6 rounded-xl bg-white p-6 shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Streak Dashboard</h2>
        <div className={`flex items-center space-x-2 ${status.color}`}>
          <Flame className="h-5 w-5" />
          <span className="font-medium">{status.text}</span>
        </div>
      </div>

      {/* Main Streak Display */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-xl bg-gradient-to-br from-orange-50 to-red-50 p-6"
      >
        <div className="text-center">
          <motion.div
            animate={{
              scale: streakData.currentStreak > 0 ? [1, 1.1, 1] : 1,
              rotate: streakData.currentStreak > 0 ? [0, 5, -5, 0] : 0,
            }}
            transition={{
              duration: 2,
              repeat: streakData.currentStreak > 0 ? Infinity : 0,
              repeatDelay: 3,
            }}
            className="mx-auto mb-4 h-20 w-20"
          >
            <div
              className={`flex h-full w-full items-center justify-center rounded-full ${
                streakData.currentStreak > 0
                  ? "bg-gradient-to-br from-orange-500 to-red-500"
                  : "bg-gray-300"
              }`}
            >
              <Flame
                className={`h-10 w-10 ${
                  streakData.currentStreak > 0 ? "text-white" : "text-gray-500"
                }`}
              />
            </div>
          </motion.div>

          <div className="mb-2 text-4xl font-bold text-orange-600">
            {streakData.currentStreak}
          </div>
          <div className="text-lg font-medium text-gray-700">Daily Streak</div>

          {streakData.longestStreak > streakData.currentStreak && (
            <div className="mt-2 text-sm text-gray-500">
              Longest: {streakData.longestStreak} days
            </div>
          )}
        </div>
      </motion.div>

      {/* Today's Activities */}
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Today's Activities
          </h3>
          <div className="text-sm text-gray-600">
            {completedActivitiesCount} / {totalActivities}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-2 w-full rounded-full bg-gray-200">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* Activity list */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.entries(todayActivities).map(([activity, completed]) => (
            <motion.div
              key={activity}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`flex items-center space-x-3 rounded-lg p-3 transition-colors ${
                completed
                  ? "border border-green-200 bg-green-100"
                  : "border border-gray-200 bg-white"
              }`}
            >
              <div
                className={`flex-shrink-0 ${
                  completed ? "text-green-600" : "text-gray-400"
                }`}
              >
                {completed ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  getActivityIcon(activity)
                )}
              </div>
              <div className="flex-1">
                <div
                  className={`font-medium ${
                    completed ? "text-green-800" : "text-gray-700"
                  }`}
                >
                  {getActivityLabel(activity)}
                </div>
              </div>
              {completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-600"
                >
                  <CheckCircle className="h-4 w-4" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <Book className="mx-auto mb-2 h-6 w-6 text-blue-600" />
          <div className="text-lg font-bold text-blue-700">
            {streakData.lessonStreak}
          </div>
          <div className="text-sm text-blue-600">Lesson Streak</div>
        </div>
        <div className="rounded-lg bg-purple-50 p-4 text-center">
          <Brain className="mx-auto mb-2 h-6 w-6 text-purple-600" />
          <div className="text-lg font-bold text-purple-700">
            {streakData.quizStreak}
          </div>
          <div className="text-sm text-purple-600">Quiz Streak</div>
        </div>
        <div className="rounded-lg bg-green-50 p-4 text-center">
          <Calendar className="mx-auto mb-2 h-6 w-6 text-green-600" />
          <div className="text-lg font-bold text-green-700">
            {streakData.loginStreak}
          </div>
          <div className="text-sm text-green-600">Login Streak</div>
        </div>
      </div>

      {/* Next Milestone */}
      {milestones.next && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1 text-lg font-semibold text-gray-900">
                Next Milestone
              </h3>
              <p className="text-gray-600">
                {milestones.next.daysLeft} days left
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600">
                {milestones.next.day} Days
              </div>
              <div className="text-sm text-gray-600">
                {milestones.next.reward.title}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-1">
              <Diamond className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium">
                +{milestones.next.reward.diamonds}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">
                +{milestones.next.reward.experience} XP
              </span>
            </div>
          </div>

          {/* Progress to next milestone */}
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>
                {streakData.currentStreak} / {milestones.next.day}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((streakData.currentStreak / milestones.next.day) * 100, 100)}%`,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Completed Milestones */}
      {milestones.completed.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-gray-900">
            Tamamlanan Milestone'lar
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {milestones.completed.slice(-4).map((milestone, index) => (
              <motion.div
                key={milestone.day}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg border border-green-200 bg-green-50 p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      {milestone.day} Gün
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-green-600">
                      {milestone.reward.title}
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span>+{milestone.reward.diamonds}💎</span>
                      <span>+{milestone.reward.experience}⭐</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Total Rewards */}
      <div className="rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 p-4 text-center">
        <div className="flex items-center justify-center space-x-4">
          <div>
            <Award className="mx-auto mb-1 h-6 w-6 text-purple-600" />
            <div className="text-lg font-bold text-purple-700">
              {streakData.totalRewardsEarned}
            </div>
            <div className="text-sm text-purple-600">Toplam Ödül</div>
          </div>
          <div className="h-12 w-px bg-purple-200"></div>
          <div>
            <TrendingUp className="mx-auto mb-1 h-6 w-6 text-blue-600" />
            <div className="text-lg font-bold text-blue-700">
              {streakData.longestStreak}
            </div>
            <div className="text-sm text-blue-600">En Uzun Streak</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakDashboard;
