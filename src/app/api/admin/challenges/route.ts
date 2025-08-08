import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get challenges with user progress stats
    const challenges = await (prisma as any).weeklyChallenge.findMany({
      include: {
        userProgress: {
          select: {
            id: true,
            currentValue: true,
            isCompleted: true,
            rewardsClaimed: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate stats for each challenge
    const challengesWithStats = challenges.map((challenge: any) => {
      const participantCount = challenge.userProgress.length;
      const completionCount = challenge.userProgress.filter((p: any) => p.isCompleted).length;
      const averageProgress = participantCount > 0
        ? challenge.userProgress.reduce((sum: number, p: any) => sum + (p.currentValue / challenge.targetValue * 100), 0) / participantCount
        : 0;

      return {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        challengeType: challenge.challengeType,
        difficulty: challenge.difficulty,
        startDate: challenge.startDate,
        endDate: challenge.endDate,
        isActive: challenge.isActive,
        requirements: challenge.requirements,
        targetValue: challenge.targetValue,
        diamondReward: challenge.diamondReward,
        experienceReward: challenge.experienceReward,
        cardPackReward: challenge.cardPackReward,
        badgeReward: challenge.badgeReward,
        specialReward: challenge.specialReward,
        category: challenge.category,
        tags: challenge.tags,
        imageUrl: challenge.imageUrl,
        icon: challenge.icon,
        priority: challenge.priority,
        participantCount,
        completionCount,
        averageProgress: Math.round(averageProgress),
        createdAt: challenge.createdAt,
        updatedAt: challenge.updatedAt
      };
    });

    return NextResponse.json({
      success: true,
      challenges: challengesWithStats
    });

  } catch (error) {
    console.error('Admin challenges fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch challenges',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const {
      title,
      description,
      challengeType,
      difficulty = 'intermediate',
      startDate,
      endDate,
      requirements = '{}',
      targetValue,
      diamondReward = 100,
      experienceReward = 200,
      cardPackReward,
      badgeReward,
      specialReward,
      category = 'general',
      tags,
      imageUrl,
      icon = '🏆',
      priority = 0
    } = await request.json();

    // Validation
    if (!title || !description || !challengeType || !startDate || !endDate || !targetValue) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        required: ['title', 'description', 'challengeType', 'startDate', 'endDate', 'targetValue']
      }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
      return NextResponse.json({ 
        error: 'End date must be after start date'
      }, { status: 400 });
    }

    // Create challenge
    const challenge = await (prisma as any).weeklyChallenge.create({
      data: {
        title,
        description,
        challengeType,
        difficulty,
        startDate: start,
        endDate: end,
        isActive: true,
        requirements: typeof requirements === 'string' ? requirements : JSON.stringify(requirements),
        targetValue: parseInt(targetValue),
        diamondReward: parseInt(diamondReward),
        experienceReward: parseInt(experienceReward),
        cardPackReward: cardPackReward ? (typeof cardPackReward === 'string' ? cardPackReward : JSON.stringify(cardPackReward)) : null,
        badgeReward,
        specialReward: specialReward ? (typeof specialReward === 'string' ? specialReward : JSON.stringify(specialReward)) : null,
        category,
        tags: tags ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : null,
        imageUrl,
        icon,
        priority: parseInt(priority)
      }
    });

    return NextResponse.json({
      success: true,
      challenge: {
        ...challenge,
        participantCount: 0,
        completionCount: 0,
        averageProgress: 0
      }
    });

  } catch (error) {
    console.error('Admin challenge creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create challenge',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}