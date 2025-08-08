'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Zap
} from 'lucide-react';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  loginStreak: number;
  lessonStreak: number;
  quizStreak: number;
  totalRewardsEarned: number;
  lastActivityDate: string | null;
  streakStartDate: string | null;
  status: 'active' | 'inactive' | 'broken' | 'completed_today';
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

const StreakDashboard: React.FC<StreakDashboardProps> = ({ className = '' }) => {
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
      const response = await fetch('/api/user-streak');
      const data = await response.json();

      if (data.success) {
        setStreakData(data.streak);
        setMilestones(data.milestones);
        setTodayActivities(data.todayActivities);
      } else {
        setError(data.error || 'Streak verileri yüklenirken hata oluştu');
      }
    } catch (err) {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const updateStreakActivity = async (activityType: string) => {
    try {
      const response = await fetch('/api/user-streak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityType }),
      });

      const data = await response.json();

      if (data.success) {
        fetchStreakData(); // Refresh data
      }
    } catch (err) {
      console.error('Error updating streak activity:', err);
    }
  };

  const getStreakStatus = () => {
    if (!streakData) return { color: 'text-gray-500', text: 'Bilinmiyor' };
    
    switch (streakData.status) {
      case 'active':
        return { color: 'text-green-600', text: 'Aktif' };
      case 'completed_today':
        return { color: 'text-blue-600', text: 'Bugün Tamamlandı' };
      case 'broken':
        return { color: 'text-red-600', text: 'Koptu' };
      case 'inactive':
        return { color: 'text-gray-600', text: 'İnaktif' };
      default:
        return { color: 'text-gray-500', text: 'Bilinmiyor' };
    }
  };

  const getActivityIcon = (activity: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      lesson: <Book className="w-5 h-5" />,
      quiz: <Brain className="w-5 h-5" />,
      dailyQuest: <Target className="w-5 h-5" />,
      dailyMiniQuiz: <Zap className="w-5 h-5" />,
      login: <Calendar className="w-5 h-5" />,
    };
    return iconMap[activity] || <Circle className="w-5 h-5" />;
  };

  const getActivityLabel = (activity: string) => {
    const labelMap: { [key: string]: string } = {
      lesson: 'Ders Tamamla',
      quiz: 'Quiz Çöz',
      dailyQuest: 'Günlük Görev',
      dailyMiniQuiz: 'Mini Quiz',
      login: 'Giriş Yap',
    };
    return labelMap[activity] || activity;
  };

  const completedActivitiesCount = Object.values(todayActivities).filter(Boolean).length;
  const totalActivities = Object.keys(todayActivities).length;
  const progressPercentage = (completedActivitiesCount / totalActivities) * 100;

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-40 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="text-center">
          <Flame className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Hata</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchStreakData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!streakData) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="text-center">
          <Flame className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Streak Bulunamadı</h3>
          <p className="text-gray-600">Streak verileriniz yüklenemedi.</p>
        </div>
      </div>
    );
  }

  const status = getStreakStatus();

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Streak Dashboard</h2>
        <div className={`flex items-center space-x-2 ${status.color}`}>
          <Flame className="w-5 h-5" />
          <span className="font-medium">{status.text}</span>
        </div>
      </div>

      {/* Main Streak Display */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6"
      >
        <div className="text-center">
          <motion.div
            animate={{ 
              scale: streakData.currentStreak > 0 ? [1, 1.1, 1] : 1,
              rotate: streakData.currentStreak > 0 ? [0, 5, -5, 0] : 0
            }}
            transition={{ 
              duration: 2,
              repeat: streakData.currentStreak > 0 ? Infinity : 0,
              repeatDelay: 3
            }}
            className="w-20 h-20 mx-auto mb-4"
          >
            <div className={`w-full h-full rounded-full flex items-center justify-center ${
              streakData.currentStreak > 0 
                ? 'bg-gradient-to-br from-orange-500 to-red-500' 
                : 'bg-gray-300'
            }`}>
              <Flame className={`w-10 h-10 ${
                streakData.currentStreak > 0 ? 'text-white' : 'text-gray-500'
              }`} />
            </div>
          </motion.div>
          
          <div className="text-4xl font-bold text-orange-600 mb-2">
            {streakData.currentStreak}
          </div>
          <div className="text-lg font-medium text-gray-700">Günlük Streak</div>
          
          {streakData.longestStreak > streakData.currentStreak && (
            <div className="text-sm text-gray-500 mt-2">
              En uzun: {streakData.longestStreak} gün
            </div>
          )}
        </div>
      </motion.div>

      {/* Today's Activities */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Bugünün Aktiviteleri</h3>
          <div className="text-sm text-gray-600">
            {completedActivitiesCount} / {totalActivities}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* Activity list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(todayActivities).map(([activity, completed]) => (
            <motion.div
              key={activity}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                completed 
                  ? 'bg-green-100 border border-green-200' 
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className={`flex-shrink-0 ${
                completed ? 'text-green-600' : 'text-gray-400'
              }`}>
                {completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  getActivityIcon(activity)
                )}
              </div>
              <div className="flex-1">
                <div className={`font-medium ${
                  completed ? 'text-green-800' : 'text-gray-700'
                }`}>
                  {getActivityLabel(activity)}
                </div>
              </div>
              {completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-600"
                >
                  <CheckCircle className="w-4 h-4" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <Book className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-blue-700">{streakData.lessonStreak}</div>
          <div className="text-sm text-blue-600">Ders Streak</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <Brain className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-purple-700">{streakData.quizStreak}</div>
          <div className="text-sm text-purple-600">Quiz Streak</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-green-700">{streakData.loginStreak}</div>
          <div className="text-sm text-green-600">Login Streak</div>
        </div>
      </div>

      {/* Next Milestone */}
      {milestones.next && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Sonraki Milestone
              </h3>
              <p className="text-gray-600">
                {milestones.next.daysLeft} gün kaldı
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600">
                {milestones.next.day} Gün
              </div>
              <div className="text-sm text-gray-600">
                {milestones.next.reward.title}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-1">
              <Diamond className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium">+{milestones.next.reward.diamonds}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">+{milestones.next.reward.experience} XP</span>
            </div>
          </div>

          {/* Progress to next milestone */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>İlerleme</span>
              <span>{streakData.currentStreak} / {milestones.next.day}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${Math.min((streakData.currentStreak / milestones.next.day) * 100, 100)}%` 
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Tamamlanan Milestone'lar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {milestones.completed.slice(-4).map((milestone, index) => (
              <motion.div
                key={milestone.day}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-green-50 border border-green-200 rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-green-600" />
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
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 text-center">
        <div className="flex items-center justify-center space-x-4">
          <div>
            <Award className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-purple-700">
              {streakData.totalRewardsEarned}
            </div>
            <div className="text-sm text-purple-600">Toplam Ödül</div>
          </div>
          <div className="w-px h-12 bg-purple-200"></div>
          <div>
            <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-1" />
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