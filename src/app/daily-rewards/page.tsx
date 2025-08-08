"use client";

import { useState, useEffect } from "react";
import {
  Gift,
  Calendar,
  Clock,
  Flame,
  Star,
  Diamond,
  Trophy,
  ChevronRight,
  CheckCircle,
  Crown,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import CardPackOpening from "@/components/gamification/card-pack-opening";

interface RewardHistory {
  id: string;
  date: string;
  day: number;
  rewardType: string;
  amount: number;
  claimed: boolean;
}

interface DailyReward {
  day: number;
  type: 'diamonds' | 'xp' | 'card_pack';
  amount: number;
  cardPack?: {
    type: 'common' | 'rare' | 'epic' | 'legendary';
    guaranteed?: boolean;
  };
}

const DAILY_REWARDS: DailyReward[] = [
  { day: 1, type: 'diamonds', amount: 10 },
  { day: 2, type: 'xp', amount: 50 },
  { day: 3, type: 'diamonds', amount: 15 },
  { day: 4, type: 'card_pack', amount: 1, cardPack: { type: 'common' } },
  { day: 5, type: 'diamonds', amount: 25 },
  { day: 6, type: 'xp', amount: 100 },
  { day: 7, type: 'card_pack', amount: 1, cardPack: { type: 'rare', guaranteed: true } },
  { day: 8, type: 'diamonds', amount: 30 },
  { day: 9, type: 'xp', amount: 150 },
  { day: 10, type: 'card_pack', amount: 1, cardPack: { type: 'epic' } },
  { day: 11, type: 'diamonds', amount: 40 },
  { day: 12, type: 'xp', amount: 200 },
  { day: 13, type: 'diamonds', amount: 50 },
  { day: 14, type: 'card_pack', amount: 1, cardPack: { type: 'legendary', guaranteed: true } },
];

export default function DailyRewardsPage() {
  const { user, loading } = useAuth();
  const [claiming, setClaiming] = useState(false);
  const [showCardPack, setShowCardPack] = useState(false);
  const [rewardHistory, setRewardHistory] = useState<RewardHistory[]>([]);
  const [canClaim, setCanClaim] = useState(false);
  const [todayReward, setTodayReward] = useState<DailyReward | null>(null);

  useEffect(() => {
    if (user) {
      checkClaimStatus();
      loadRewardHistory();
    }
  }, [user]);

  const checkClaimStatus = async () => {
    try {
      const response = await fetch('/api/daily-login-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCanClaim(!data.alreadyClaimed);
        
        // Determine today's reward based on current streak
        const streakDay = ((user?.loginStreak || 1) - 1) % DAILY_REWARDS.length;
        setTodayReward(DAILY_REWARDS[streakDay]);
      }
    } catch (error) {
      console.error('Failed to check claim status:', error);
    }
  };

  const loadRewardHistory = async () => {
    try {
      const response = await fetch('/api/daily-login-reward/history');
      if (response.ok) {
        const data = await response.json();
        setRewardHistory(data.history || []);
      }
    } catch (error) {
      console.error('Failed to load reward history:', error);
      // Mock data for development
      setRewardHistory([
        {
          id: '1',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          day: 6,
          rewardType: 'diamonds',
          amount: 25,
          claimed: true
        },
        {
          id: '2',
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          day: 5,
          rewardType: 'xp',
          amount: 100,
          claimed: true
        }
      ]);
    }
  };

  const claimDailyReward = async () => {
    if (!canClaim || claiming) return;
    
    setClaiming(true);
    try {
      const response = await fetch('/api/daily-login-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Show card pack opening if reward is a card pack
        if (todayReward?.type === 'card_pack') {
          setShowCardPack(true);
        }
        
        setCanClaim(false);
        loadRewardHistory();
        
        // Refresh user data
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to claim reward:', error);
    } finally {
      setClaiming(false);
    }
  };

  const getRewardIcon = (reward: DailyReward) => {
    switch (reward.type) {
      case 'diamonds':
        return <Diamond className="h-6 w-6" />;
      case 'xp':
        return <Star className="h-6 w-6" />;
      case 'card_pack':
        return <Gift className="h-6 w-6" />;
      default:
        return <Gift className="h-6 w-6" />;
    }
  };

  const getRewardColor = (reward: DailyReward) => {
    switch (reward.type) {
      case 'diamonds':
        return 'from-yellow-400 to-orange-500';
      case 'xp':
        return 'from-blue-400 to-indigo-500';
      case 'card_pack':
        if (reward.cardPack?.type === 'legendary') return 'from-purple-500 to-pink-500';
        if (reward.cardPack?.type === 'epic') return 'from-indigo-500 to-purple-500';
        if (reward.cardPack?.type === 'rare') return 'from-blue-500 to-indigo-500';
        return 'from-gray-400 to-gray-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getRewardLabel = (reward: DailyReward) => {
    switch (reward.type) {
      case 'diamonds':
        return `${reward.amount} Diamonds`;
      case 'xp':
        return `${reward.amount} XP`;
      case 'card_pack':
        return `${reward.cardPack?.type?.charAt(0).toUpperCase()}${reward.cardPack?.type?.slice(1)} Pack`;
      default:
        return 'Reward';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
          <p className="mt-6 text-lg font-medium text-gray-600">Loading daily rewards...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="text-center">
          <Gift className="mx-auto h-16 w-16 text-orange-500 mb-4" />
          <p className="text-lg font-medium text-gray-600 mb-4">Please log in to claim rewards</p>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50/30 to-rose-50/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      
      <div className="relative z-10 py-6 lg:py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
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
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                    🎁 Daily Rewards
                  </h1>
                  <p className="text-gray-600 mt-1">Claim your daily login rewards and maintain your streak!</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2 text-2xl font-bold text-orange-600">
                  <Flame className="h-6 w-6" />
                  <span>{user.loginStreak} Day Streak</span>
                </div>
                <p className="text-sm text-gray-500">Keep logging in for better rewards!</p>
              </div>
            </div>
          </div>

          {/* Today's Reward */}
          {todayReward && (
            <div className="mb-8">
              <div className="rounded-2xl border border-white/60 bg-white/90 p-6 lg:p-8 shadow-xl backdrop-blur-sm">
                <div className="text-center">
                  <div className="mb-6">
                    <div className={`mx-auto w-20 h-20 rounded-2xl bg-gradient-to-r ${getRewardColor(todayReward)} p-4 shadow-xl`}>
                      <div className="w-full h-full flex items-center justify-center text-white">
                        {getRewardIcon(todayReward)}
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Today's Reward - Day {user.loginStreak}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    {getRewardLabel(todayReward)}
                  </p>
                  
                  {canClaim ? (
                    <button
                      onClick={claimDailyReward}
                      disabled={claiming}
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {claiming ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                          Claiming...
                        </>
                      ) : (
                        <>
                          <Gift className="mr-3 h-6 w-6" />
                          Claim Reward
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="inline-flex items-center px-8 py-4 bg-green-500 text-white rounded-xl font-bold text-lg shadow-lg">
                      <CheckCircle className="mr-3 h-6 w-6" />
                      Already Claimed Today
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Reward Calendar */}
          <div className="mb-8">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 lg:p-8 shadow-xl backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">📅 14-Day Reward Cycle</h2>
                <div className="text-sm text-gray-500">
                  Resets every 14 days
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {DAILY_REWARDS.map((reward, index) => {
                  const isToday = ((user.loginStreak - 1) % DAILY_REWARDS.length) === index;
                  const isPast = ((user.loginStreak - 1) % DAILY_REWARDS.length) > index || user.loginStreak > reward.day;
                  const isFuture = !isToday && !isPast;
                  
                  return (
                    <div
                      key={reward.day}
                      className={`relative rounded-xl border-2 p-4 text-center transition-all duration-200 ${
                        isToday
                          ? 'border-orange-400 bg-gradient-to-b from-orange-50 to-orange-100 shadow-lg scale-105'
                          : isPast
                          ? 'border-green-200 bg-green-50 opacity-75'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      {isPast && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                      
                      {isToday && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                      )}
                      
                      <div className="mb-2">
                        <div className={`mx-auto w-12 h-12 rounded-lg bg-gradient-to-r ${getRewardColor(reward)} p-2 ${
                          isFuture ? 'opacity-50' : ''
                        }`}>
                          <div className="w-full h-full flex items-center justify-center text-white text-sm">
                            {getRewardIcon(reward)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm font-bold text-gray-900 mb-1">Day {reward.day}</div>
                      <div className={`text-xs ${isFuture ? 'text-gray-400' : 'text-gray-600'}`}>
                        {getRewardLabel(reward)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reward History */}
          <div className="mb-8">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 lg:p-8 shadow-xl backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">📈 Recent Claims</h2>
                <Link href="/profile" className="text-sm font-medium text-orange-600 hover:text-orange-700">
                  View All History
                </Link>
              </div>
              
              <div className="space-y-3">
                {rewardHistory.length > 0 ? (
                  rewardHistory.slice(0, 5).map((reward) => (
                    <div key={reward.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-400 to-pink-400 p-2">
                          <Gift className="h-full w-full text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            Day {reward.day} Reward
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(reward.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          +{reward.amount} {reward.rewardType === 'diamonds' ? '💎' : 'XP'}
                        </div>
                        <div className="text-xs text-green-500">Claimed</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No reward history yet</p>
                    <p className="text-sm text-gray-400">Start claiming daily rewards to see your history</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Card Pack Opening Modal */}
      {showCardPack && todayReward?.type === 'card_pack' && (
        <CardPackOpening
          isOpen={showCardPack}
          onClose={() => setShowCardPack(false)}
          cardPack={{
            id: 'daily-reward-pack',
            name: 'Daily Reward Pack',
            packType: todayReward.cardPack?.type || 'common',
            rarity: todayReward.cardPack?.type || 'common'
          }}
          cards={[
            {
              id: 'daily-card-1',
              name: 'Daily Reward Card',
              rarity: todayReward.cardPack?.type || 'common',
              rarityLevel: todayReward.cardPack?.type === 'legendary' ? 6 :
                          todayReward.cardPack?.type === 'epic' ? 5 :
                          todayReward.cardPack?.type === 'rare' ? 4 : 3,
              series: 'Daily Rewards',
              character: 'Special'
            }
          ]}
          celebrationType="pack"
          onOpenComplete={() => {
            setShowCardPack(false);
            loadRewardHistory();
          }}
        />
      )}
    </div>
  );
}