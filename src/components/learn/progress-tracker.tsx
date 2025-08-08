"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Book,
  Code,
  CheckCircle,
  Star,
  Calendar,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  colors,
  typography,
  typographyPresets,
  spacing,
} from "@/lib/design-system";

export interface LearningProgress {
  userId: string;
  totalLessons: number;
  completedLessons: number;
  totalExercises: number;
  completedExercises: number;
  totalQuizzes: number;
  passedQuizzes: number;
  totalXP: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  timeSpent: number; // in minutes
  averageScore: number;
  weakAreas: string[];
  strongAreas: string[];
  lastActivity: Date;
  weeklyGoal: number;
  weeklyProgress: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  current: number;
  type: "lessons" | "exercises" | "quizzes" | "streak" | "score" | "time";
  reward: {
    diamonds: number;
    xp: number;
    badge?: string;
  };
  isCompleted: boolean;
  unlockedAt?: Date;
}

interface ProgressTrackerProps {
  progress: LearningProgress;
  milestones?: Milestone[];
  showDetailed?: boolean;
  variant?: "compact" | "detailed" | "dashboard";
  className?: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  milestones = [],
  showDetailed = false,
  variant = "detailed",
  className,
}) => {
  const completionRate =
    (progress.completedLessons / progress.totalLessons) * 100;
  const exerciseRate =
    (progress.completedExercises / progress.totalExercises) * 100;
  const quizRate = (progress.passedQuizzes / progress.totalQuizzes) * 100;
  const weeklyGoalRate = (progress.weeklyProgress / progress.weeklyGoal) * 100;

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getDaysAgo = (date: Date): number => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (variant === "compact") {
    return (
      <div
        className={cn("bg-white rounded-lg shadow-sm border p-4", className)}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 style={typographyPresets.heading.h4} className="text-gray-800">
            İlerleme
          </h3>
          <div
            className="px-2 py-1 rounded-full text-xs font-bold"
            style={{
              backgroundColor: colors.primary[100],
              color: colors.primary[700],
            }}
          >
            Level {progress.currentLevel}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Dersler</span>
              <span>
                {progress.completedLessons}/{progress.totalLessons}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full"
                style={{ backgroundColor: colors.primary[500] }}
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <span>{progress.currentStreak} gün seri</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>{progress.totalXP} XP</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
          className
        )}
      >
        {/* Lesson Progress */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <Book className="w-8 h-8 text-blue-500" />
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              DERSLER
            </span>
          </div>
          <div className="mb-2">
            <div style={typographyPresets.heading.h2} className="text-gray-800">
              {progress.completedLessons}/{progress.totalLessons}
            </div>
            <div className="text-sm text-gray-600">Tamamlanan</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            %{completionRate.toFixed(1)} tamamlandı
          </div>
        </div>

        {/* Exercise Progress */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <Code className="w-8 h-8 text-green-500" />
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              EGZERSİZLER
            </span>
          </div>
          <div className="mb-2">
            <div style={typographyPresets.heading.h2} className="text-gray-800">
              {progress.completedExercises}/{progress.totalExercises}
            </div>
            <div className="text-sm text-gray-600">Çözülen</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${exerciseRate}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            %{exerciseRate.toFixed(1)} tamamlandı
          </div>
        </div>

        {/* Streak & XP */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-orange-500" />
            <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              SERİ
            </span>
          </div>
          <div className="mb-2">
            <div style={typographyPresets.heading.h2} className="text-gray-800">
              {progress.currentStreak}
            </div>
            <div className="text-sm text-gray-600">Günlük seri</div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              En uzun: {progress.longestStreak}
            </span>
            <span className="text-orange-600 font-medium">
              {progress.totalXP} XP
            </span>
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-purple-500" />
            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              HAFTALIK
            </span>
          </div>
          <div className="mb-2">
            <div style={typographyPresets.heading.h2} className="text-gray-800">
              {progress.weeklyProgress}/{progress.weeklyGoal}
            </div>
            <div className="text-sm text-gray-600">Dakika</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(weeklyGoalRate, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            %{weeklyGoalRate.toFixed(1)} tamamlandı
          </div>
        </div>
      </div>
    );
  }

  // Detailed variant
  return (
    <div className={cn("space-y-6", className)}>
      {/* Overview Stats */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 style={typographyPresets.heading.h3} className="text-gray-800 mb-6">
          📊 Öğrenme İstatistikleri
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div style={typographyPresets.heading.h2} className="text-blue-600">
              {progress.completedLessons}
            </div>
            <div className="text-sm text-gray-600">Tamamlanan Ders</div>
          </div>
          <div className="text-center">
            <div
              style={typographyPresets.heading.h2}
              className="text-green-600"
            >
              {progress.completedExercises}
            </div>
            <div className="text-sm text-gray-600">Çözülen Egzersiz</div>
          </div>
          <div className="text-center">
            <div
              style={typographyPresets.heading.h2}
              className="text-purple-600"
            >
              {progress.currentStreak}
            </div>
            <div className="text-sm text-gray-600">Günlük Seri</div>
          </div>
          <div className="text-center">
            <div
              style={typographyPresets.heading.h2}
              className="text-orange-600"
            >
              {formatTime(progress.timeSpent)}
            </div>
            <div className="text-sm text-gray-600">Toplam Süre</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Ders İlerlemesi
              </span>
              <span className="text-sm text-gray-500">
                {completionRate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Egzersiz İlerlemesi
              </span>
              <span className="text-sm text-gray-500">
                {exerciseRate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600"
                initial={{ width: 0 }}
                animate={{ width: `${exerciseRate}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Quiz Başarısı
              </span>
              <span className="text-sm text-gray-500">
                {quizRate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${quizRate}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Learning Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong & Weak Areas */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h4
            style={typographyPresets.heading.h4}
            className="text-gray-800 mb-4"
          >
            📈 Güçlü & Zayıf Alanlar
          </h4>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-green-700 mb-2">
                💪 Güçlü Alanlar
              </div>
              <div className="space-y-1">
                {progress.strongAreas.map((area, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-orange-700 mb-2">
                🎯 Gelişim Alanları
              </div>
              <div className="space-y-1">
                {progress.weakAreas.map((area, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-700">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h4
            style={typographyPresets.heading.h4}
            className="text-gray-800 mb-4"
          >
            🕒 Son Aktivite
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Son giriş</span>
              <span className="text-sm font-medium">
                {getDaysAgo(progress.lastActivity)} gün önce
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ortalama puan</span>
              <span className="text-sm font-medium text-blue-600">
                %{progress.averageScore}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">En uzun seri</span>
              <span className="text-sm font-medium text-orange-600">
                {progress.longestStreak} gün
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Haftalık hedef</span>
              <span className="text-sm font-medium text-purple-600">
                {Math.round(weeklyGoalRate)}% tamamlandı
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      {milestones.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h4
            style={typographyPresets.heading.h4}
            className="text-gray-800 mb-4"
          >
            🏆 Kilometre Taşları
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {milestones.slice(0, 6).map((milestone) => (
              <div
                key={milestone.id}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-200",
                  milestone.isCompleted
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{milestone.icon}</span>
                    <div>
                      <div className="font-medium text-gray-800">
                        {milestone.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {milestone.description}
                      </div>
                    </div>
                  </div>
                  {milestone.isCompleted && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>
                      {milestone.current}/{milestone.requirement}
                    </span>
                    <span>
                      {Math.round(
                        (milestone.current / milestone.requirement) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className={cn(
                        "h-2 rounded-full",
                        milestone.isCompleted ? "bg-green-500" : "bg-blue-500"
                      )}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          (milestone.current / milestone.requirement) * 100,
                          100
                        )}%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Ödül: {milestone.reward.diamonds} 💎, {milestone.reward.xp}{" "}
                    XP
                  </span>
                  {milestone.isCompleted && milestone.unlockedAt && (
                    <span className="text-green-600 font-medium">
                      ✅ Kazanıldı
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Hook for progress calculations
export const useProgressCalculations = (progress: LearningProgress) => {
  const calculations = React.useMemo(() => {
    const completionRate =
      (progress.completedLessons / progress.totalLessons) * 100;
    const exerciseRate =
      (progress.completedExercises / progress.totalExercises) * 100;
    const quizRate = (progress.passedQuizzes / progress.totalQuizzes) * 100;
    const overallProgress = (completionRate + exerciseRate + quizRate) / 3;

    const expectedLevel = Math.floor(progress.totalXP / 1000) + 1;
    const xpForNextLevel = expectedLevel * 1000;
    const xpProgress = ((progress.totalXP % 1000) / 1000) * 100;

    return {
      completionRate,
      exerciseRate,
      quizRate,
      overallProgress,
      expectedLevel,
      xpForNextLevel,
      xpProgress,
      isOnTrack: overallProgress >= 70,
      needsImprovement: progress.currentStreak < 3,
      weeklyGoalStatus: (progress.weeklyProgress / progress.weeklyGoal) * 100,
    };
  }, [progress]);

  return calculations;
};

// Sample milestones data
export const sampleMilestones: Milestone[] = [
  {
    id: "1",
    title: "İlk Adımlar",
    description: "5 ders tamamla",
    icon: "🎯",
    requirement: 5,
    current: 3,
    type: "lessons",
    reward: { diamonds: 50, xp: 100 },
    isCompleted: false,
  },
  {
    id: "2",
    title: "Kod Yazarı",
    description: "10 egzersiz çöz",
    icon: "💻",
    requirement: 10,
    current: 10,
    type: "exercises",
    reward: { diamonds: 100, xp: 200, badge: "Coder" },
    isCompleted: true,
    unlockedAt: new Date("2024-01-15"),
  },
  {
    id: "3",
    title: "Seri Yapıcı",
    description: "7 gün üst üste çalış",
    icon: "🔥",
    requirement: 7,
    current: 5,
    type: "streak",
    reward: { diamonds: 150, xp: 300 },
    isCompleted: false,
  },
];
