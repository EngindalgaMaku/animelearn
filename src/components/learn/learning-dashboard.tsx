"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Target,
  Trophy,
  TrendingUp,
  Calendar,
  BookOpen,
  Code,
  Brain,
  Zap,
  Award,
  Users,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { colors, typographyPresets, spacing } from "@/lib/design-system";
import { ProgressTracker, type LearningProgress } from "./progress-tracker";
import { LessonCard, type Lesson } from "./lesson-card";

interface DashboardStats {
  todayStudyTime: number; // minutes
  weeklyStudyTime: number; // minutes
  currentStreak: number; // days
  totalXP: number;
  completedLessons: number;
  totalLessons: number;
  nextMilestone: {
    title: string;
    progress: number;
    total: number;
  };
}

interface StudySession {
  id: string;
  lessonId: string;
  lessonTitle: string;
  duration: number; // minutes
  xpEarned: number;
  completedAt: Date;
  accuracy: number; // percentage
}

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  category: "time" | "lessons" | "xp" | "streak";
  isCompleted: boolean;
}

interface LearningDashboardProps {
  progress: LearningProgress;
  stats: DashboardStats;
  recentSessions: StudySession[];
  upcomingLessons: Lesson[];
  learningGoals: LearningGoal[];
  className?: string;
}

export const LearningDashboard: React.FC<LearningDashboardProps> = ({
  progress,
  stats,
  recentSessions,
  upcomingLessons,
  learningGoals,
  className,
}) => {
  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}dk`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours}s`;
    return `${hours}s ${remainingMinutes}dk`;
  };

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Günaydın";
    if (hour < 18) return "İyi öğleden sonra";
    return "İyi akşamlar";
  };

  const getMotivationalMessage = (): string => {
    if (stats.currentStreak >= 7) return "Harika bir seri yakalayın! 🔥";
    if (stats.todayStudyTime >= 60) return "Bugün çok produktif geçiyor! 💪";
    if (progress.completedLessons >= 10)
      return "Python yolculuğunuz harika ilerliyor! 🐍";
    return "Hedeflerinize bir adım daha yaklaşın! 🎯";
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={typographyPresets.display.small} className="mb-2">
            {getGreeting()} 👋
          </h1>
          <p className="text-xl opacity-90 mb-4">{getMotivationalMessage()}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm">Bugün</span>
              </div>
              <div style={typographyPresets.heading.h3}>
                {formatTime(stats.todayStudyTime)}
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm">Seri</span>
              </div>
              <div style={typographyPresets.heading.h3}>
                {stats.currentStreak} gün
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Trophy className="w-5 h-5" />
                <span className="text-sm">Toplam XP</span>
              </div>
              <div style={typographyPresets.heading.h3}>
                {stats.totalXP.toLocaleString()}
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="w-5 h-5" />
                <span className="text-sm">Dersler</span>
              </div>
              <div style={typographyPresets.heading.h3}>
                {stats.completedLessons}/{stats.totalLessons}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2
              style={typographyPresets.heading.h3}
              className="text-gray-800 mb-4"
            >
              📊 İlerleme Özeti
            </h2>
            <ProgressTracker
              progress={progress}
              variant="dashboard"
              className="mb-0"
            />
          </div>

          {/* Recent Sessions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2
                style={typographyPresets.heading.h3}
                className="text-gray-800"
              >
                📚 Son Çalışma Seansları
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                <span>Tümünü Gör</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {recentSessions.slice(0, 4).map((session, index) => (
                <motion.div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: colors.primary[100] }}
                    >
                      📖
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {session.lessonTitle}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(session.duration)} • {session.accuracy}%
                        doğruluk
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-600">
                      +{session.xpEarned} XP
                    </div>
                    <div className="text-xs text-gray-500">
                      {session.completedAt.toLocaleDateString("tr-TR")}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Learning Goals */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2
              style={typographyPresets.heading.h3}
              className="text-gray-800 mb-4"
            >
              🎯 Öğrenme Hedefleri
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningGoals.slice(0, 4).map((goal, index) => (
                <motion.div
                  key={goal.id}
                  className={cn(
                    "p-4 rounded-lg border-2",
                    goal.isCompleted
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-800">{goal.title}</h3>
                    {goal.isCompleted && (
                      <Award className="w-5 h-5 text-green-500" />
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {goal.description}
                  </p>

                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>
                        {goal.currentValue}/{goal.targetValue} {goal.unit}
                      </span>
                      <span>
                        {Math.round(
                          (goal.currentValue / goal.targetValue) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={cn(
                          "h-2 rounded-full",
                          goal.isCompleted ? "bg-green-500" : "bg-blue-500"
                        )}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(
                            (goal.currentValue / goal.targetValue) * 100,
                            100
                          )}%`,
                        }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Hedef: {goal.deadline.toLocaleDateString("tr-TR")}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Next Milestone */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-6 h-6 text-yellow-600" />
              <h3
                style={typographyPresets.heading.h4}
                className="text-yellow-800"
              >
                Sonraki Hedef
              </h3>
            </div>

            <p className="text-yellow-700 mb-4">{stats.nextMilestone.title}</p>

            <div className="mb-2">
              <div className="flex justify-between text-sm text-yellow-700 mb-1">
                <span>
                  {stats.nextMilestone.progress}/{stats.nextMilestone.total}
                </span>
                <span>
                  {Math.round(
                    (stats.nextMilestone.progress / stats.nextMilestone.total) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-yellow-200 rounded-full h-3">
                <motion.div
                  className="h-3 rounded-full bg-yellow-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (stats.nextMilestone.progress /
                        stats.nextMilestone.total) *
                      100
                    }%`,
                  }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>

          {/* Upcoming Lessons */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3
              style={typographyPresets.heading.h4}
              className="text-gray-800 mb-4"
            >
              📅 Sonraki Dersler
            </h3>

            <div className="space-y-3">
              {upcomingLessons.slice(0, 3).map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <LessonCard
                    lesson={lesson}
                    variant="compact"
                    showProgress={false}
                  />
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center space-x-1">
              <span>Tüm Dersleri Gör</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3
              style={typographyPresets.heading.h4}
              className="text-gray-800 mb-4"
            >
              📈 Bu Hafta
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Çalışma Süresi</span>
                </div>
                <span className="font-medium">
                  {formatTime(stats.weeklyStudyTime)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Tamamlanan Ders</span>
                </div>
                <span className="font-medium">{stats.completedLessons}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600">
                    Çözülen Egzersiz
                  </span>
                </div>
                <span className="font-medium">
                  {progress.completedExercises}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-600">Ortalama Puan</span>
                </div>
                <span className="font-medium">%{progress.averageScore}</span>
              </div>
            </div>
          </div>

          {/* Study Reminder */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3
                style={typographyPresets.heading.h5}
                className="text-blue-800"
              >
                Çalışma Hatırlatması
              </h3>
            </div>

            <p className="text-sm text-blue-700 mb-4">
              Düzenli çalışma alışkanlığı geliştirmek için günde en az 30 dakika
              ayırın.
            </p>

            <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
              Hatırlatıcı Kur
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sample data for testing
export const sampleDashboardData = {
  stats: {
    todayStudyTime: 75,
    weeklyStudyTime: 420,
    currentStreak: 12,
    totalXP: 2350,
    completedLessons: 8,
    totalLessons: 25,
    nextMilestone: {
      title: "Python Temelleri Ustası",
      progress: 8,
      total: 15,
    },
  },
  recentSessions: [
    {
      id: "1",
      lessonId: "lesson-1",
      lessonTitle: "Python Temelleri",
      duration: 45,
      xpEarned: 100,
      completedAt: new Date(),
      accuracy: 92,
    },
    {
      id: "2",
      lessonId: "lesson-2",
      lessonTitle: "Değişkenler ve Veri Tipleri",
      duration: 35,
      xpEarned: 75,
      completedAt: new Date(Date.now() - 86400000),
      accuracy: 88,
    },
  ],
  learningGoals: [
    {
      id: "1",
      title: "Haftalık Hedef",
      description: "Bu hafta 5 saat çalış",
      targetValue: 300,
      currentValue: 210,
      unit: "dakika",
      deadline: new Date(Date.now() + 7 * 86400000),
      category: "time" as const,
      isCompleted: false,
    },
    {
      id: "2",
      title: "Ders Hedefi",
      description: "10 ders tamamla",
      targetValue: 10,
      currentValue: 8,
      unit: "ders",
      deadline: new Date(Date.now() + 14 * 86400000),
      category: "lessons" as const,
      isCompleted: false,
    },
  ],
};
