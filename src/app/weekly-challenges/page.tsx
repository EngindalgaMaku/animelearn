"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Target,
  Clock,
  Users,
  Star,
  Gift,
  CheckCircle,
  Calendar,
  TrendingUp,
  Zap,
  Diamond,
  ArrowLeft,
  RefreshCw,
  Award,
  Activity,
  Crown,
  Flame,
  BookOpen,
  Code,
  Brain,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import CardPackOpening from "@/components/gamification/card-pack-opening";

interface Challenge {
  id: string;
  title: string;
  description: string;
  challengeType: string;
  difficulty: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  requirements: string;
  targetValue: number;
  diamondReward: number;
  experienceReward: number;
  cardPackReward?: string;
  category: string;
  icon: string;
  priority: number;
  participantCount: number;
  completionCount: number;
  averageProgress: number;
  userProgress: {
    currentValue: number;
    isCompleted: boolean;
    rewardsClaimed: boolean;
    progressData?: string;
  };
}

interface WeekInfo {
  weekNumber: number;
  startDate: string;
  endDate: string;
}

export default function WeeklyChallengesPage() {
  const { user, loading } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [weekInfo, setWeekInfo] = useState<WeekInfo | null>(null);
  const [challengesLoading, setChallengesLoading] = useState(true);
  const [showCardPack, setShowCardPack] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadChallenges();
    }
  }, [user]);

  const loadChallenges = async () => {
    try {
      setChallengesLoading(true);
      const response = await fetch('/api/weekly-challenges');
      if (response.ok) {
        const data = await response.json();
        setChallenges(data.challenges || []);
        setWeekInfo(data.weekInfo);
      }
    } catch (error) {
      console.error('Failed to load challenges:', error);
    } finally {
      setChallengesLoading(false);
    }
  };

  const claimRewards = async (challengeId: string) => {
    try {
      const response = await fetch(`/api/weekly-challenges/${challengeId}/claim`, {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        
        // Show card pack opening if there's a card pack reward
        const challenge = challenges.find(c => c.id === challengeId);
        if (challenge?.cardPackReward) {
          const cardPackData = JSON.parse(challenge.cardPackReward);
          setSelectedReward(cardPackData);
          setShowCardPack(true);
        }
        
        // Refresh challenges to update status
        await loadChallenges();
      }
    } catch (error) {
      console.error('Failed to claim rewards:', error);
    }
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-blue-500 to-indigo-500';
      case 'advanced': return 'from-orange-500 to-red-500';
      case 'expert': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'code_arena': return <Code className="h-6 w-6" />;
      case 'quiz': return <Brain className="h-6 w-6" />;
      case 'daily_login': return <Flame className="h-6 w-6" />;
      case 'card_collection': return <CreditCard className="h-6 w-6" />;
      default: return <Target className="h-6 w-6" />;
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
          <p className="mt-6 text-lg font-medium text-gray-600">Loading weekly challenges...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <Trophy className="mx-auto h-16 w-16 text-purple-500 mb-4" />
          <p className="text-lg font-medium text-gray-600 mb-4">Please log in to view challenges</p>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50/30 to-indigo-50/50">
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
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                    🏆 Weekly Challenges
                  </h1>
                  <p className="text-gray-600 mt-1">Complete challenges to earn amazing rewards!</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={loadChallenges}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-white transition-all"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Week Info Card */}
          {weekInfo && (
            <div className="mb-8">
              <div className="rounded-2xl border border-white/60 bg-white/90 p-6 lg:p-8 shadow-xl backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-xl">
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Week {weekInfo.weekNumber}</h2>
                      <p className="text-gray-600">
                        {new Date(weekInfo.startDate).toLocaleDateString()} - {new Date(weekInfo.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {getTimeRemaining(weekInfo.endDate)}
                    </div>
                    <p className="text-sm text-gray-500">Time remaining</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Overview */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">Active Challenges</p>
                  <p className="text-3xl font-bold">{challenges.filter(c => c.isActive).length}</p>
                </div>
                <Target className="h-8 w-8 text-blue-200" />
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-100">Completed</p>
                  <p className="text-3xl font-bold">{challenges.filter(c => c.userProgress.isCompleted).length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-100">Total Participants</p>
                  <p className="text-3xl font-bold">{challenges.reduce((sum, c) => sum + c.participantCount, 0)}</p>
                </div>
                <Users className="h-8 w-8 text-yellow-200" />
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-100">Available Rewards</p>
                  <p className="text-3xl font-bold">{challenges.filter(c => c.userProgress.isCompleted && !c.userProgress.rewardsClaimed).length}</p>
                </div>
                <Gift className="h-8 w-8 text-purple-200" />
              </div>
            </div>
          </div>

          {/* Challenges Grid */}
          <div className="space-y-6">
            {challengesLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="rounded-2xl border border-white/60 bg-white/90 p-6 lg:p-8 shadow-xl backdrop-blur-sm">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                      <div className="w-20 h-8 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="flex space-x-4">
                      <div className="h-10 bg-gray-200 rounded w-32"></div>
                      <div className="h-10 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : challenges.length > 0 ? (
              challenges.map((challenge) => {
                const progressPercent = getProgressPercentage(challenge.userProgress.currentValue, challenge.targetValue);
                const completionRate = challenge.participantCount > 0 ? (challenge.completionCount / challenge.participantCount) * 100 : 0;
                
                return (
                  <div key={challenge.id} className="rounded-2xl border border-white/60 bg-white/90 shadow-xl backdrop-blur-sm overflow-hidden">
                    {/* Challenge Header */}
                    <div className={`bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} p-6 text-white`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            {getChallengeIcon(challenge.challengeType)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{challenge.title}</h3>
                            <p className="text-white/80 capitalize">{challenge.difficulty} • {challenge.category}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">{getTimeRemaining(challenge.endDate)}</span>
                          </div>
                          <p className="text-white/80 text-sm">Ends {new Date(challenge.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Description */}
                      <p className="text-gray-600 mb-6">{challenge.description}</p>

                      {/* Progress */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className="text-sm font-bold text-gray-900">
                            {challenge.userProgress.currentValue} / {challenge.targetValue}
                          </span>
                        </div>
                        
                        <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} transition-all duration-700 ease-out`}
                            style={{ width: `${progressPercent}%` }}
                          >
                            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-500">
                          {progressPercent.toFixed(1)}% complete
                        </div>
                      </div>

                      {/* Rewards */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Rewards</h4>
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
                            <Diamond className="h-4 w-4" />
                            <span className="font-medium">{challenge.diamondReward}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg">
                            <Star className="h-4 w-4" />
                            <span className="font-medium">{challenge.experienceReward} XP</span>
                          </div>
                          
                          {challenge.cardPackReward && (
                            <div className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-800 rounded-lg">
                              <Gift className="h-4 w-4" />
                              <span className="font-medium capitalize">
                                {JSON.parse(challenge.cardPackReward).type} Pack
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stats and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{challenge.participantCount} participants</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>{completionRate.toFixed(1)}% completion rate</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {challenge.userProgress.isCompleted ? (
                            challenge.userProgress.rewardsClaimed ? (
                              <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                                <CheckCircle className="h-4 w-4" />
                                <span className="font-medium">Rewards Claimed</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => claimRewards(challenge.id)}
                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-md"
                              >
                                <Gift className="h-4 w-4" />
                                <span className="font-medium">Claim Rewards</span>
                              </button>
                            )
                          ) : (
                            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                              <Activity className="h-4 w-4" />
                              <span className="font-medium">In Progress</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Trophy className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg mb-2">No active challenges this week</p>
                <p className="text-gray-400">Check back later for new challenges!</p>
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
            id: 'challenge-reward-pack',
            name: 'Challenge Reward Pack',
            packType: selectedReward.type,
            rarity: selectedReward.type
          }}
          cards={[
            {
              id: 'challenge-card-1',
              name: 'Challenge Completion Card',
              rarity: selectedReward.type,
              rarityLevel: selectedReward.type === 'legendary' ? 6 : 
                          selectedReward.type === 'epic' ? 5 :
                          selectedReward.type === 'rare' ? 4 : 3,
              series: 'Weekly Challenge',
              character: 'Challenger'
            }
          ]}
          celebrationType="weekly"
          onOpenComplete={() => {
            setShowCardPack(false);
            loadChallenges();
          }}
        />
      )}
    </div>
  );
}