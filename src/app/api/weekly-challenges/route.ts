import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/weekly-challenges - Get active weekly challenges for user
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

    const now = new Date();

    // For now, return mock data since Prisma hasn't been regenerated yet
    const mockChallenges = [
      {
        id: '1',
        title: 'Code Arena Master',
        description: 'Complete 5 code arenas this week to master your Python skills!',
        challengeType: 'code_arena',
        difficulty: 'intermediate',
        startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        isActive: true,
        requirements: JSON.stringify({
          type: 'code_arena_completion',
          count: 5,
          category: 'any'
        }),
        targetValue: 5,
        diamondReward: 150,
        experienceReward: 300,
        cardPackReward: JSON.stringify({
          type: 'rare',
          count: 1
        }),
        category: 'learning',
        icon: '💻',
        priority: 1,
        participantCount: 234,
        completionCount: 67,
        averageProgress: 2.3,
        userProgress: {
          currentValue: 2,
          isCompleted: false,
          rewardsClaimed: false,
          progressData: JSON.stringify({
            completedArenas: ['python-basics', 'functions-intro']
          })
        }
      },
      {
        id: '2',
        title: 'Quiz Champion',
        description: 'Answer 25 quiz questions correctly to become this week\'s quiz champion!',
        challengeType: 'quiz',
        difficulty: 'advanced',
        startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        requirements: JSON.stringify({
          type: 'quiz_correct_answers',
          count: 25,
          difficulty: 'any'
        }),
        targetValue: 25,
        diamondReward: 200,
        experienceReward: 400,
        cardPackReward: JSON.stringify({
          type: 'epic',
          count: 1
        }),
        category: 'knowledge',
        icon: '🧠',
        priority: 2,
        participantCount: 189,
        completionCount: 23,
        averageProgress: 12.7,
        userProgress: {
          currentValue: 12,
          isCompleted: false,
          rewardsClaimed: false,
          progressData: JSON.stringify({
            correctAnswers: 12,
            categoriesCompleted: ['Functions', 'Variables']
          })
        }
      },
      {
        id: '3',
        title: 'Streak Keeper',
        description: 'Maintain your daily login streak for 7 consecutive days!',
        challengeType: 'daily_login',
        difficulty: 'beginner',
        startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        requirements: JSON.stringify({
          type: 'consecutive_login',
          count: 7
        }),
        targetValue: 7,
        diamondReward: 100,
        experienceReward: 150,
        cardPackReward: JSON.stringify({
          type: 'common',
          count: 2
        }),
        category: 'engagement',
        icon: '🔥',
        priority: 3,
        participantCount: 456,
        completionCount: 234,
        averageProgress: 4.2,
        userProgress: {
          currentValue: user.loginStreak >= 7 ? 7 : user.loginStreak,
          isCompleted: user.loginStreak >= 7,
          rewardsClaimed: false,
          progressData: JSON.stringify({
            currentStreak: user.loginStreak,
            startDate: new Date(now.getTime() - user.loginStreak * 24 * 60 * 60 * 1000).toISOString()
          })
        }
      },
      {
        id: '4',
        title: 'Card Collector',
        description: 'Collect 10 new cards this week through various activities!',
        challengeType: 'card_collection',
        difficulty: 'intermediate',
        startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        requirements: JSON.stringify({
          type: 'card_collection',
          count: 10,
          rarity: 'any'
        }),
        targetValue: 10,
        diamondReward: 300,
        experienceReward: 250,
        cardPackReward: JSON.stringify({
          type: 'legendary',
          count: 1
        }),
        category: 'collection',
        icon: '🎴',
        priority: 4,
        participantCount: 167,
        completionCount: 34,
        averageProgress: 3.8,
        userProgress: {
          currentValue: 3,
          isCompleted: false,
          rewardsClaimed: false,
          progressData: JSON.stringify({
            cardsCollected: ['card1', 'card2', 'card3'],
            sources: ['quiz_reward', 'daily_login', 'pack_opening']
          })
        }
      }
    ];

    return NextResponse.json({
      challenges: mockChallenges,
      weekInfo: {
        weekNumber: Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)),
        startDate: new Date(now.getTime() - (now.getDay() * 24 * 60 * 60 * 1000)).toISOString(),
        endDate: new Date(now.getTime() + ((6 - now.getDay()) * 24 * 60 * 60 * 1000)).toISOString()
      }
    });

  } catch (error) {
    console.error('Failed to fetch weekly challenges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}