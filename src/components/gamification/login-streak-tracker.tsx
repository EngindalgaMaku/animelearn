"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Trophy, 
  Calendar, 
  Star, 
  Diamond, 
  Zap, 
  Target,
  TrendingUp,
  Award,
  Clock,
  RefreshCw
} from 'lucide-react';

interface LoginStreakData {
  currentStreak: number;
  longestStreak: number;
  totalLogins: number;
  lastLoginDate: string;
  streakStartDate: string;
  milestones: number[];
  nextMilestone: {
    days: number;
    remaining: number;
    reward: {
      diamonds: number;
      experience: number;
    };
  } | null;
  recentLogins: Array<{
    date: string;
    timestamp: string;
    streakCount: number;
    isConsecutive: boolean;
    platform: string;
  }>;
}

interface LoginStreakTrackerProps {
  onStreakUpdate?: (streakData: LoginStreakData) => void;
  showFullStats?: boolean;
  autoTrackLogin?: boolean;
}

export default function LoginStreakTracker({
  onStreakUpdate,
  showFullStats = false,
  autoTrackLogin = true
}: LoginStreakTrackerProps) {
  const [streakData, setStreakData] = useState<LoginStreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(false);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [lastReward, setLastReward] = useState<any>(null);

  // Load streak data
  useEffect(() => {
    loadStreakData();
    if (autoTrackLogin) {
      trackLogin();
    }
  }, []);

  const loadStreakData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/login-streak/track');
      if (response.ok) {
        const data = await response.json();
        setStreakData(data);
        onStreakUpdate?.(data);
      }
    } catch (error) {
      console.error('Failed to load streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackLogin = async () => {
    try {
      setTracking(true);
      const response = await fetch('/api/login-streak/track', {
        method: 'POST'
      });
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.rewards && (result.rewards.diamonds > 0 || result.rewards.experience > 0)) {
          setLastReward(result.rewards);
          setShowRewardAnimation(true);
          setTimeout(() => setShowRewardAnimation(false), 3000);
        }
        
        // Reload data to get updated stats
        await loadStreakData();
      }
    } catch (error) {
      console.error('Failed to track login:', error);
    } finally {
      setTracking(false);
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 100) return 'from-purple-500 to-pink-500';
    if (streak >= 50) return 'from-yellow-500 to-orange-500';
    if (streak >= 30) return 'from-blue-500 to-indigo-500';
    if (streak >= 14) return 'from-green-500 to-emerald-500';
    if (streak >= 7) return 'from-orange-500 to-red-500';
    return 'from-gray-500 to-gray-600';
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 100) return <Trophy className="h-8 w-8" />;
    if (streak >= 50) return <Award className="h-8 w-8" />;
    if (streak >= 30) return <Star className="h-8 w-8" />;
    if (streak >= 7) return <Flame className="h-8 w-8" />;
    return <Calendar className="h-8 w-8" />;
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
        <div className="animate-pulse flex items-center space-x-4">
          <div className="rounded-full bg-gray-300 h-12 w-12"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!streakData) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
        <Flame className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-white">Unable to load streak data</p>
        <button
          onClick={loadStreakData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4 inline mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reward Animation */}
      <AnimatePresence>
        {showRewardAnimation && lastReward && (
          <motion.div
            initial={{ scale: 0, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-2xl shadow-2xl"
          >
            <div className="text-center">
              <Star className="h-8 w-8 mx-auto mb-2" />
              <p className="font-bold">Login Streak Reward!</p>
              <div className="flex items-center justify-center space-x-4 mt-2">
                {lastReward.diamonds > 0 && (
                  <div className="flex items-center space-x-1">
                    <Diamond className="h-4 w-4" />
                    <span>+{lastReward.diamonds}</span>
                  </div>
                )}
                {lastReward.experience > 0 && (
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4" />
                    <span>+{lastReward.experience} XP</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Streak Display */}
      <div className={`bg-gradient-to-r ${getStreakColor(streakData.currentStreak)} rounded-2xl p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: streakData.currentStreak > 0 ? [0, 10, -10, 0] : 0 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-3 bg-white/20 rounded-xl"
            >
              {getStreakIcon(streakData.currentStreak)}
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold">{streakData.currentStreak} Days</h3>
              <p className="text-white/80">Current Streak</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xl font-bold">{streakData.longestStreak}</p>
            <p className="text-white/80 text-sm">Best Streak</p>
          </div>
        </div>

        {/* Progress to Next Milestone */}
        {streakData.nextMilestone && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Next Milestone: {streakData.nextMilestone.days} days</span>
              <span>{streakData.nextMilestone.remaining} days remaining</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="bg-white h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((streakData.nextMilestone.days - streakData.nextMilestone.remaining) / streakData.nextMilestone.days) * 100}%` 
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center justify-center mt-2 space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Diamond className="h-3 w-3" />
                <span>+{streakData.nextMilestone.reward.diamonds}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-3 w-3" />
                <span>+{streakData.nextMilestone.reward.experience} XP</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Stats */}
      {showFullStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Milestones Achieved */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h4 className="text-white font-bold mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Milestones Achieved
            </h4>
            
            <div className="grid grid-cols-4 gap-2">
              {[3, 7, 14, 30, 50, 100, 200, 365].map((milestone) => (
                <div
                  key={milestone}
                  className={`text-center p-2 rounded-lg ${
                    streakData.milestones.includes(milestone)
                      ? 'bg-green-500/20 border border-green-500'
                      : 'bg-gray-500/20 border border-gray-500'
                  }`}
                >
                  <div className="text-sm font-bold text-white">{milestone}</div>
                  <div className="text-xs text-gray-300">days</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h4 className="text-white font-bold mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Login Statistics
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Logins</span>
                <span className="text-white font-bold">{streakData.totalLogins}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Streak Started</span>
                <span className="text-white font-bold">
                  {new Date(streakData.streakStartDate).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Last Login</span>
                <span className="text-white font-bold">
                  {new Date(streakData.lastLoginDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Login History */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:col-span-2">
            <h4 className="text-white font-bold mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Login History
            </h4>
            
            <div className="grid grid-cols-7 gap-2">
              {streakData.recentLogins.slice(0, 14).map((login, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-2 rounded-lg text-center ${
                    login.isConsecutive
                      ? 'bg-green-500/20 border border-green-500'
                      : 'bg-yellow-500/20 border border-yellow-500'
                  }`}
                >
                  <div className="text-xs text-white font-bold">
                    {new Date(login.date).getDate()}
                  </div>
                  <div className="text-xs text-gray-300">
                    {login.streakCount}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex items-center justify-center mt-4 space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-300">Consecutive</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-gray-300">New Streak</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Track Button (for testing) */}
      {!autoTrackLogin && (
        <button
          onClick={trackLogin}
          disabled={tracking}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50"
        >
          {tracking ? (
            <div className="flex items-center justify-center">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Tracking...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Flame className="h-4 w-4 mr-2" />
              Track Today's Login
            </div>
          )}
        </button>
      )}
    </div>
  );
}