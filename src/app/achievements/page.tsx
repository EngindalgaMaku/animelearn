"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Star,
  Lock,
  Check,
  Diamond,
  Gift,
  ArrowLeft,
  Filter,
  Search,
  RefreshCw,
  Crown,
  Zap,
  Target,
  Award,
  Activity,
  Clock,
  Users,
  TrendingUp,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import CardPackOpening from "@/components/gamification/card-pack-opening";

interface Achievement {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  color: string;
  conditionType: string;
  targetValue: number;
  rewardDiamonds: number;
  rewardXp: number;
  rewardCardPack?: string;
  specialReward?: string;
  isActive: boolean;
  isHidden: boolean;
  totalEarned: number;
  userProgress: {
    progress: number;
    isUnlocked: boolean;
    isCompleted: boolean;
    earnedAt?: string;
    progressData?: string;
  };
}

interface AchievementStats {
  total: number;
  completed: number;
  inProgress: number;
  locked: number;
  totalRewardsEarned: {
    diamonds: number;
    xp: number;
  };
  categories: Record<string, number>;
}

export default function AchievementsPage() {
  const { user, loading } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [achievementsLoading, setAchievementsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const [showCardPack, setShowCardPack] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user, selectedCategory, selectedStatus]);

  const loadAchievements = async () => {
    try {
      setAchievementsLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);

      const response = await fetch(`/api/achievements?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setAchievements(data.achievements || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
    } finally {
      setAchievementsLoading(false);
    }
  };

  const claimAchievementReward = async (achievementId: string) => {
    try {
      const response = await fetch(`/api/achievements/${achievementId}/claim`, {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        
        // Show card pack opening if there's a card pack reward
        const achievement = achievements.find(a => a.id === achievementId);
        if (achievement?.rewardCardPack) {
          const cardPackData = JSON.parse(achievement.rewardCardPack);
          setSelectedReward(cardPackData);
          setShowCardPack(true);
        }
        
        // Refresh achievements
        await loadAchievements();
      }
    } catch (error) {
      console.error('Failed to claim achievement reward:', error);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-indigo-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'legendary': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return '📚';
      case 'knowledge': return '🧠';
      case 'engagement': return '🔥';
      case 'mastery': return '🥷';
      case 'collection': return '🎴';
      case 'performance': return '⚡';
      default: return '🏆';
    }
  };

  // Filter achievements
  const filteredAchievements = achievements.filter(achievement => {
    if (!showHidden && achievement.isHidden && !achievement.userProgress.isUnlocked) {
      return false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return achievement.title.toLowerCase().includes(searchLower) ||
             achievement.description.toLowerCase().includes(searchLower);
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-yellow-200 border-t-yellow-600"></div>
          <p className="mt-6 text-lg font-medium text-gray-600">Loading achievements...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="text-center">
          <Trophy className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
          <p className="text-lg font-medium text-gray-600 mb-4">Please log in to view achievements</p>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50/30 to-red-50/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      
      <div className="relative z-10 py-6 lg:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                    🏆 Achievements
                  </h1>
                  <p className="text-gray-600 mt-1">Track your progress and earn amazing rewards!</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowHidden(!showHidden)}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all ${
                    showHidden 
                      ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                >
                  {showHidden ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                  Hidden
                </button>
                
                <button
                  onClick={loadAchievements}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-white transition-all"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          {stats && (
            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-6">
              <div className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-100">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Trophy className="h-6 w-6 text-blue-200" />
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-100">Completed</p>
                    <p className="text-2xl font-bold">{stats.completed}</p>
                  </div>
                  <Check className="h-6 w-6 text-green-200" />
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-100">In Progress</p>
                    <p className="text-2xl font-bold">{stats.inProgress}</p>
                  </div>
                  <Target className="h-6 w-6 text-yellow-200" />
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-gray-500 to-slate-500 p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-100">Locked</p>
                    <p className="text-2xl font-bold">{stats.locked}</p>
                  </div>
                  <Lock className="h-6 w-6 text-gray-200" />
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-100">Diamonds</p>
                    <p className="text-2xl font-bold">{stats.totalRewardsEarned.diamonds}</p>
                  </div>
                  <Diamond className="h-6 w-6 text-purple-200" />
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-indigo-100">XP Earned</p>
                    <p className="text-2xl font-bold">{stats.totalRewardsEarned.xp}</p>
                  </div>
                  <Star className="h-6 w-6 text-indigo-200" />
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="mb-8 rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search achievements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-colors"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-colors"
              >
                <option value="all">All Categories</option>
                <option value="learning">📚 Learning</option>
                <option value="knowledge">🧠 Knowledge</option>
                <option value="engagement">🔥 Engagement</option>
                <option value="mastery">🥷 Mastery</option>
                <option value="collection">🎴 Collection</option>
                <option value="performance">⚡ Performance</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="completed">✅ Completed</option>
                <option value="in_progress">🎯 In Progress</option>
                <option value="locked">🔒 Locked</option>
              </select>

              <div className="text-sm text-gray-600 flex items-center">
                Showing {filteredAchievements.length} of {achievements.length} achievements
              </div>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="space-y-6">
            {achievementsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="rounded-2xl border border-gray-200 p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAchievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAchievements.map((achievement) => {
                  const progressPercent = getProgressPercentage(achievement.userProgress.progress, achievement.targetValue);
                  const isLocked = !achievement.userProgress.isUnlocked;
                  const isCompleted = achievement.userProgress.isCompleted;
                  
                  return (
                    <div
                      key={achievement.id}
                      className={`rounded-2xl border-2 p-6 shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl ${
                        isLocked 
                          ? 'border-gray-200 bg-gray-50/80 opacity-60' 
                          : isCompleted
                          ? `${getRarityBorder(achievement.rarity)} bg-gradient-to-br from-white via-white to-gray-50/50`
                          : `${getRarityBorder(achievement.rarity)} bg-white/90 hover:bg-white`
                      }`}
                    >
                      {/* Achievement Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div 
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md ${
                              isLocked ? 'bg-gray-400' : `bg-gradient-to-r ${getRarityColor(achievement.rarity)}`
                            }`}
                          >
                            {isLocked ? <Lock className="h-6 w-6" /> : <span className="text-xl">{achievement.icon}</span>}
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-bold ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
                              {isLocked ? '???' : achievement.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                achievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                                achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                                achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {achievement.rarity}
                              </span>
                              <span className="text-xs text-gray-500">
                                {getCategoryIcon(achievement.category)} {achievement.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {isCompleted && (
                          <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        )}
                        
                        {achievement.isHidden && achievement.userProgress.isUnlocked && (
                          <div className="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full">
                            <Crown className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className={`text-sm mb-4 ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                        {isLocked ? 'Complete previous achievements to unlock' : achievement.description}
                      </p>

                      {!isLocked && (
                        <>
                          {/* Progress */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-gray-700">Progress</span>
                              <span className="text-xs font-bold text-gray-900">
                                {achievement.userProgress.progress} / {achievement.targetValue}
                              </span>
                            </div>
                            
                            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                              <div
                                className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getRarityColor(achievement.rarity)} transition-all duration-700 ease-out`}
                                style={{ width: `${progressPercent}%` }}
                              >
                                {!isCompleted && (
                                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-1 text-xs text-gray-500">
                              {progressPercent.toFixed(1)}% complete
                            </div>
                          </div>

                          {/* Rewards */}
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                                <Diamond className="h-3 w-3" />
                                <span>{achievement.rewardDiamonds}</span>
                              </div>
                              
                              <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                <Star className="h-3 w-3" />
                                <span>{achievement.rewardXp} XP</span>
                              </div>
                              
                              {achievement.rewardCardPack && (
                                <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                  <Gift className="h-3 w-3" />
                                  <span>Card Pack</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Action Button */}
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {achievement.totalEarned} players earned
                        </div>
                        
                        {isCompleted && (
                          <button
                            onClick={() => claimAchievementReward(achievement.id)}
                            className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded text-xs font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
                          >
                            Claimed ✓
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg mb-2">No achievements found</p>
                <p className="text-gray-400">Try adjusting your filters or start completing activities!</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Card Pack Opening Modal */}
      {showCardPack && selectedReward && (
        <CardPackOpening
          isOpen={showCardPack}
          onClose={() => setShowCardPack(false)}
          cardPack={{
            id: 'achievement-reward-pack',
            name: 'Achievement Reward Pack',
            packType: selectedReward.type,
            rarity: selectedReward.type
          }}
          cards={[
            {
              id: 'achievement-card-1',
              name: 'Achievement Completion Card',
              rarity: selectedReward.type,
              rarityLevel: selectedReward.type === 'legendary' ? 6 : 
                          selectedReward.type === 'epic' ? 5 :
                          selectedReward.type === 'rare' ? 4 : 3,
              series: 'Achievement Rewards',
              character: 'Champion'
            }
          ]}
          celebrationType="big"
          onOpenComplete={() => {
            setShowCardPack(false);
            loadAchievements();
          }}
        />
      )}
    </div>
  );
}