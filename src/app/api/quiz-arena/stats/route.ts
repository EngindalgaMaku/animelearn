import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        quizAttempts: {
          where: { isCompleted: true },
          orderBy: { completedAt: 'desc' },
          take: 50,
          include: { quiz: true }
        },
        diamondTransactions: {
          where: { type: 'QUIZ_COMPLETION' },
          orderBy: { createdAt: 'desc' }
        },
        cardPackOpenings: {
          where: { sourceType: 'QUIZ_REWARD' },
          orderBy: { openedAt: 'desc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate stats
    const completedQuizzes = user.quizAttempts;
    const totalQuestions = completedQuizzes.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
    const totalCorrect = completedQuizzes.reduce((sum, quiz) => sum + quiz.correctAnswers, 0);
    
    // Calculate best streak (longest sequence of correct answers)
    let bestStreak = 0;
    let currentStreak = 0;

    for (const quiz of completedQuizzes) {
      if (quiz.answers) {
        const answers = JSON.parse(quiz.answers);
        for (const answer of answers) {
          if (answer.isCorrect) {
            currentStreak++;
            bestStreak = Math.max(bestStreak, currentStreak);
          } else {
            currentStreak = 0;
          }
        }
      }
    }

    // Calculate average time per question
    const totalTimeSpent = completedQuizzes.reduce((sum, quiz) => sum + quiz.timeSpent, 0);
    const averageTime = totalQuestions > 0 ? totalTimeSpent / totalQuestions : 0;

    // Calculate rewards earned
    const diamondsEarned = user.diamondTransactions
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    const cardsEarned = user.cardPackOpenings.length;
    
    const experienceEarned = completedQuizzes.reduce((sum, quiz) => {
      // Base XP calculation: correct answers * 5
      return sum + (quiz.correctAnswers * 5);
    }, 0);

    // Recent performance (last 10 quizzes)
    const recentQuizzes = completedQuizzes.slice(0, 10);
    const recentAccuracy = recentQuizzes.length > 0 
      ? recentQuizzes.reduce((sum, quiz) => 
          sum + (quiz.correctAnswers / quiz.totalQuestions), 0) / recentQuizzes.length * 100
      : 0;

    // Performance by difficulty
    const performanceByDifficulty = {
      easy: { attempted: 0, correct: 0, accuracy: 0 },
      medium: { attempted: 0, correct: 0, accuracy: 0 },
      hard: { attempted: 0, correct: 0, accuracy: 0 }
    };

    completedQuizzes.forEach(quiz => {
      const difficulty = quiz.quiz?.difficulty || 2;
      const difficultyKey = difficulty === 1 ? 'easy' : difficulty === 3 ? 'hard' : 'medium';
      
      performanceByDifficulty[difficultyKey].attempted += quiz.totalQuestions;
      performanceByDifficulty[difficultyKey].correct += quiz.correctAnswers;
    });

    // Calculate accuracy for each difficulty
    Object.keys(performanceByDifficulty).forEach(key => {
      const diff = performanceByDifficulty[key as keyof typeof performanceByDifficulty];
      diff.accuracy = diff.attempted > 0 ? (diff.correct / diff.attempted) * 100 : 0;
    });

    // Weekly progress (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyQuizzes = completedQuizzes.filter(quiz => 
      quiz.completedAt && quiz.completedAt >= oneWeekAgo
    );
    
    const weeklyStats = {
      quizzesCompleted: weeklyQuizzes.length,
      questionsAnswered: weeklyQuizzes.reduce((sum, quiz) => sum + quiz.totalQuestions, 0),
      correctAnswers: weeklyQuizzes.reduce((sum, quiz) => sum + quiz.correctAnswers, 0),
      accuracy: 0,
      timeSpent: weeklyQuizzes.reduce((sum, quiz) => sum + quiz.timeSpent, 0)
    };
    
    weeklyStats.accuracy = weeklyStats.questionsAnswered > 0 
      ? (weeklyStats.correctAnswers / weeklyStats.questionsAnswered) * 100 
      : 0;

    // Streak milestones
    const streakMilestones = [
      { streak: 5, reached: bestStreak >= 5, reward: 'Common Card' },
      { streak: 10, reached: bestStreak >= 10, reward: 'Rare Card' },
      { streak: 15, reached: bestStreak >= 15, reward: 'Epic Card' },
      { streak: 25, reached: bestStreak >= 25, reward: 'Legendary Card' },
      { streak: 50, reached: bestStreak >= 50, reward: 'Mythic Card' }
    ];

    // Performance trends (last 30 days, grouped by day)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyPerformance = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      
      const dayQuizzes = completedQuizzes.filter(quiz => 
        quiz.completedAt && 
        quiz.completedAt >= dayStart && 
        quiz.completedAt < dayEnd
      );
      
      const dayQuestions = dayQuizzes.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
      const dayCorrect = dayQuizzes.reduce((sum, quiz) => sum + quiz.correctAnswers, 0);
      
      dailyPerformance.push({
        date: dayStart.toISOString().split('T')[0],
        questionsAnswered: dayQuestions,
        accuracy: dayQuestions > 0 ? (dayCorrect / dayQuestions) * 100 : 0,
        quizzesCompleted: dayQuizzes.length
      });
    }

    return NextResponse.json({
      bestStreak,
      currentStreak: 0, // Would need to track active streak separately
      totalQuestions,
      totalCorrect,
      averageTime,
      rewardsEarned: {
        diamonds: diamondsEarned,
        cards: cardsEarned,
        experience: experienceEarned
      },
      recentAccuracy,
      performanceByDifficulty,
      weeklyStats,
      streakMilestones,
      dailyPerformance,
      totalQuizzes: completedQuizzes.length,
      rank: await calculateUserRank(user.id, bestStreak),
      achievements: await getUserQuizAchievements(user.id, {
        bestStreak,
        totalQuizzes: completedQuizzes.length,
        totalCorrect,
        diamondsEarned
      })
    });

  } catch (error) {
    console.error('Quiz stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to calculate user rank based on best streak
async function calculateUserRank(userId: string, bestStreak: number) {
  try {
    // Count users with better streaks
    const betterUsers = await prisma.user.count({
      where: {
        quizAttempts: {
          some: {
            correctAnswers: {
              gt: bestStreak
            }
          }
        }
      }
    });

    return betterUsers + 1;
  } catch (error) {
    console.error('Error calculating rank:', error);
    return null;
  }
}

// Helper function to get quiz-related achievements
async function getUserQuizAchievements(userId: string, stats: any) {
  const achievements = [];

  // Streak achievements
  if (stats.bestStreak >= 5) achievements.push({ 
    name: 'First Strike', 
    description: 'Answered 5 questions correctly in a row',
    icon: '🎯',
    unlockedAt: new Date()
  });
  
  if (stats.bestStreak >= 10) achievements.push({ 
    name: 'Quiz Master', 
    description: 'Answered 10 questions correctly in a row',
    icon: '🧠',
    unlockedAt: new Date()
  });
  
  if (stats.bestStreak >= 25) achievements.push({ 
    name: 'Quiz Legend', 
    description: 'Answered 25 questions correctly in a row',
    icon: '👑',
    unlockedAt: new Date()
  });

  // Volume achievements
  if (stats.totalQuizzes >= 10) achievements.push({
    name: 'Quiz Enthusiast',
    description: 'Completed 10 quiz sessions',
    icon: '📚',
    unlockedAt: new Date()
  });

  if (stats.totalQuizzes >= 50) achievements.push({
    name: 'Quiz Veteran',
    description: 'Completed 50 quiz sessions',
    icon: '🎖️',
    unlockedAt: new Date()
  });

  // Accuracy achievements
  if (stats.totalCorrect >= 100) achievements.push({
    name: 'Century Club',
    description: 'Answered 100 questions correctly',
    icon: '💯',
    unlockedAt: new Date()
  });

  return achievements;
}