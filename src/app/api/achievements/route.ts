import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/achievements - Get user's achievements and progress
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const status = searchParams.get('status'); // 'all', 'completed', 'in_progress', 'locked'

    // For now, return mock data since Prisma hasn't been regenerated yet
    const mockAchievements = [
      {
        id: '1',
        name: 'first_steps',
        title: 'First Steps',
        description: 'Complete your first code arena challenge',
        icon: '🚀',
        category: 'learning',
        rarity: 'common',
        color: '#10B981',
        conditionType: 'count',
        targetValue: 1,
        rewardDiamonds: 50,
        rewardXp: 100,
        isActive: true,
        isHidden: false,
        totalEarned: 1247,
        userProgress: {
          progress: 1,
          isUnlocked: true,
          isCompleted: true,
          earnedAt: new Date(Date.now() - 86400000).toISOString(),
          progressData: JSON.stringify({
            completedArena: 'python-basics'
          })
        }
      },
      {
        id: '2',
        name: 'quiz_master',
        title: 'Quiz Master',
        description: 'Answer 100 quiz questions correctly',
        icon: '🧠',
        category: 'knowledge',
        rarity: 'rare',
        color: '#3B82F6',
        conditionType: 'count',
        targetValue: 100,
        rewardDiamonds: 200,
        rewardXp: 300,
        rewardCardPack: JSON.stringify({ type: 'rare', count: 1 }),
        isActive: true,
        isHidden: false,
        totalEarned: 234,
        userProgress: {
          progress: 67,
          isUnlocked: true,
          isCompleted: false,
          progressData: JSON.stringify({
            correctAnswers: 67,
            categories: ['Functions', 'Variables', 'Loops']
          })
        }
      },
      {
        id: '3',
        name: 'streak_champion',
        title: 'Streak Champion',
        description: 'Maintain a 30-day login streak',
        icon: '🔥',
        category: 'engagement',
        rarity: 'epic',
        color: '#F59E0B',
        conditionType: 'streak',
        targetValue: 30,
        rewardDiamonds: 500,
        rewardXp: 750,
        rewardCardPack: JSON.stringify({ type: 'epic', count: 1 }),
        isActive: true,
        isHidden: false,
        totalEarned: 89,
        userProgress: {
          progress: user.loginStreak,
          isUnlocked: true,
          isCompleted: user.loginStreak >= 30,
          earnedAt: user.loginStreak >= 30 ? new Date().toISOString() : null,
          progressData: JSON.stringify({
            currentStreak: user.loginStreak,
            maxStreak: user.maxLoginStreak
          })
        }
      },
      {
        id: '4',
        name: 'code_ninja',
        title: 'Code Ninja',
        description: 'Complete 25 code arenas with perfect scores',
        icon: '🥷',
        category: 'mastery',
        rarity: 'legendary',
        color: '#8B5CF6',
        conditionType: 'count',
        targetValue: 25,
        rewardDiamonds: 1000,
        rewardXp: 1500,
        rewardCardPack: JSON.stringify({ type: 'legendary', count: 2 }),
        specialReward: JSON.stringify({ 
          type: 'badge', 
          name: 'Code Master Badge',
          icon: '👑'
        }),
        isActive: true,
        isHidden: false,
        totalEarned: 12,
        userProgress: {
          progress: 8,
          isUnlocked: true,
          isCompleted: false,
          progressData: JSON.stringify({
            perfectScores: 8,
            categories: ['Functions', 'Classes', 'Error Handling']
          })
        }
      },
      {
        id: '5',
        name: 'diamond_collector',
        title: 'Diamond Collector',
        description: 'Earn 10,000 total diamonds',
        icon: '💎',
        category: 'collection',
        rarity: 'epic',
        color: '#06B6D4',
        conditionType: 'milestone',
        targetValue: 10000,
        rewardDiamonds: 1000,
        rewardXp: 500,
        isActive: true,
        isHidden: false,
        totalEarned: 156,
        userProgress: {
          progress: user.totalDiamonds,
          isUnlocked: true,
          isCompleted: user.totalDiamonds >= 10000,
          earnedAt: user.totalDiamonds >= 10000 ? new Date().toISOString() : null,
          progressData: JSON.stringify({
            totalEarned: user.totalDiamonds,
            currentBalance: user.currentDiamonds
          })
        }
      },
      {
        id: '6',
        name: 'speed_demon',
        title: 'Speed Demon',
        description: 'Complete a quiz in under 30 seconds',
        icon: '⚡',
        category: 'performance',
        rarity: 'rare',
        color: '#EF4444',
        conditionType: 'time_based',
        targetValue: 30,
        rewardDiamonds: 300,
        rewardXp: 200,
        isActive: true,
        isHidden: false,
        totalEarned: 67,
        userProgress: {
          progress: 0,
          isUnlocked: true,
          isCompleted: false,
          progressData: JSON.stringify({
            bestTime: 45,
            attempts: 12
          })
        }
      },
      {
        id: '7',
        name: 'perfectionist',
        title: 'Perfectionist',
        description: 'Get 100% accuracy on 10 consecutive quizzes',
        icon: '🎯',
        category: 'mastery',
        rarity: 'legendary',
        color: '#EC4899',
        conditionType: 'combo',
        targetValue: 10,
        rewardDiamonds: 2000,
        rewardXp: 2000,
        rewardCardPack: JSON.stringify({ type: 'legendary', count: 3 }),
        isActive: true,
        isHidden: true, // Hidden achievement
        totalEarned: 3,
        userProgress: {
          progress: 3,
          isUnlocked: user.quizzesCompleted >= 5, // Unlock after 5 quizzes
          isCompleted: false,
          progressData: JSON.stringify({
            consecutivePerfect: 3,
            currentStreak: 3
          })
        }
      },
      {
        id: '8',
        name: 'card_master',
        title: 'Card Master',
        description: 'Collect 500 unique cards',
        icon: '🎴',
        category: 'collection',
        rarity: 'epic',
        color: '#F97316',
        conditionType: 'count',
        targetValue: 500,
        rewardDiamonds: 750,
        rewardXp: 1000,
        rewardCardPack: JSON.stringify({ type: 'legendary', count: 1 }),
        isActive: true,
        isHidden: false,
        totalEarned: 45,
        userProgress: {
          progress: 127,
          isUnlocked: true,
          isCompleted: false,
          progressData: JSON.stringify({
            uniqueCards: 127,
            rareCards: 23,
            epicCards: 8,
            legendaryCards: 2
          })
        }
      }
    ];

    // Filter achievements based on query parameters
    let filteredAchievements = mockAchievements;

    if (category && category !== 'all') {
      filteredAchievements = filteredAchievements.filter(a => a.category === category);
    }

    if (status && status !== 'all') {
      filteredAchievements = filteredAchievements.filter(a => {
        switch (status) {
          case 'completed':
            return a.userProgress.isCompleted;
          case 'in_progress':
            return a.userProgress.isUnlocked && !a.userProgress.isCompleted;
          case 'locked':
            return !a.userProgress.isUnlocked;
          default:
            return true;
        }
      });
    }

    // Calculate summary stats
    const stats = {
      total: mockAchievements.length,
      completed: mockAchievements.filter(a => a.userProgress.isCompleted).length,
      inProgress: mockAchievements.filter(a => a.userProgress.isUnlocked && !a.userProgress.isCompleted).length,
      locked: mockAchievements.filter(a => !a.userProgress.isUnlocked).length,
      totalRewardsEarned: {
        diamonds: mockAchievements
          .filter(a => a.userProgress.isCompleted)
          .reduce((sum, a) => sum + a.rewardDiamonds, 0),
        xp: mockAchievements
          .filter(a => a.userProgress.isCompleted)
          .reduce((sum, a) => sum + a.rewardXp, 0)
      },
      categories: {
        learning: mockAchievements.filter(a => a.category === 'learning').length,
        knowledge: mockAchievements.filter(a => a.category === 'knowledge').length,
        engagement: mockAchievements.filter(a => a.category === 'engagement').length,
        mastery: mockAchievements.filter(a => a.category === 'mastery').length,
        collection: mockAchievements.filter(a => a.category === 'collection').length,
        performance: mockAchievements.filter(a => a.category === 'performance').length,
      }
    };

    return NextResponse.json({
      achievements: filteredAchievements,
      stats,
      userLevel: user.level,
      userXp: user.experience
    });

  } catch (error) {
    console.error('Failed to fetch achievements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}