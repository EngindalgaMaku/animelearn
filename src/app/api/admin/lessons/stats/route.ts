import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    // Get lesson statistics
    const [
      totalLessons,
      publishedLessons,
      draftLessons,
      totalStudents,
      averageCompletion,
      lessonsByCategory,
      lessonsByDifficulty,
      recentActivity
    ] = await Promise.all([
      // Total lessons
      prisma.codeArena.count(),
      
      // Published lessons
      prisma.codeArena.count({
        where: { isPublished: true }
      }),
      
      // Draft lessons
      prisma.codeArena.count({
        where: { isPublished: false }
      }),
      
      // Total unique students who started any lesson
      prisma.codeArenaProgress.groupBy({
        by: ['userId'],
        _count: {
          userId: true
        }
      }).then(results => results.length),
      
      // Average completion rate
      prisma.codeArenaProgress.aggregate({
        _avg: {
          score: true
        },
        where: {
          isCompleted: true
        }
      }).then(result => Math.round(result._avg.score || 0)),
      
      // Lessons by category
      prisma.codeArena.groupBy({
        by: ['category'],
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        }
      }),
      
      // Lessons by difficulty
      prisma.codeArena.groupBy({
        by: ['difficulty'],
        _count: {
          id: true
        },
        orderBy: {
          difficulty: 'asc'
        }
      }),
      
      // Recent lesson activity (last 30 days)
      prisma.codeArenaProgress.findMany({
        where: {
          lastVisit: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        include: {
          codeArena: {
            select: {
              title: true,
              category: true
            }
          },
          user: {
            select: {
              username: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          lastVisit: 'desc'
        },
        take: 10
      })
    ])

    // Calculate additional metrics
    const completionRate = totalLessons > 0 
      ? Math.round((publishedLessons / totalLessons) * 100)
      : 0

    // Format category distribution
    const categoryDistribution = lessonsByCategory.map(cat => ({
      category: cat.category,
      count: cat._count.id,
      percentage: totalLessons > 0 ? Math.round((cat._count.id / totalLessons) * 100) : 0
    }))

    // Format difficulty distribution
    const difficultyLabels = {
      1: 'Beginner',
      2: 'Easy', 
      3: 'Intermediate',
      4: 'Hard',
      5: 'Expert'
    }

    const difficultyDistribution = lessonsByDifficulty.map(diff => ({
      difficulty: diff.difficulty,
      label: difficultyLabels[diff.difficulty as keyof typeof difficultyLabels] || 'Unknown',
      count: diff._count.id,
      percentage: totalLessons > 0 ? Math.round((diff._count.id / totalLessons) * 100) : 0
    }))

    // Get popular lessons (most started)
    const popularLessons = await prisma.codeArena.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        difficulty: true,
        _count: {
          select: {
            progress: true
          }
        }
      },
      orderBy: {
        progress: {
          _count: 'desc'
        }
      },
      take: 5
    })

    // Get completion stats by lesson
    const completionStats = await prisma.codeArena.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            progress: {
              where: {
                isCompleted: true
              }
            }
          }
        }
      },
      orderBy: {
        progress: {
          _count: 'desc'
        }
      },
      take: 5
    })

    return NextResponse.json({
      totalLessons,
      publishedLessons,
      draftLessons,
      totalStudents,
      completionRate: averageCompletion,
      overview: {
        totalLessons,
        publishedLessons,
        draftLessons,
        totalStudents,
        completionRate: averageCompletion
      },
      distribution: {
        categories: categoryDistribution,
        difficulties: difficultyDistribution,
        publishing: {
          published: publishedLessons,
          draft: draftLessons,
          publishedPercentage: completionRate,
          draftPercentage: 100 - completionRate
        }
      },
      popular: {
        lessons: popularLessons,
        completions: completionStats
      },
      activity: {
        recent: recentActivity.map(activity => ({
          id: activity.id,
          lessonTitle: activity.codeArena.title,
          lessonCategory: activity.codeArena.category,
          userName: activity.user.username || `${activity.user.firstName} ${activity.user.lastName}`.trim() || 'Anonymous',
          isCompleted: activity.isCompleted,
          score: activity.score,
          lastVisit: activity.lastVisit,
          timeSpent: activity.timeSpent
        }))
      }
    })
  } catch (error) {
    console.error('Admin lessons stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
