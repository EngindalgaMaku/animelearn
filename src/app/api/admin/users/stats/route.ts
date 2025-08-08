import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    // Get user statistics
    const [
      totalUsers,
      activeUsers,
      premiumUsers,
      newUsersThisMonth,
      usersByRole,
      topUsersByDiamonds,
      topUsersByLevel,
      userRegistrationTrends
    ] = await Promise.all([
      // Total users
      db.user.count(),
      
      // Active users
      db.user.count({
        where: { isActive: true }
      }),
      
      // Premium users
      db.user.count({
        where: { isPremium: true }
      }),
      
      // New users this month
      db.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      
      // Users by role
      db.user.groupBy({
        by: ['role'],
        _count: {
          id: true
        }
      }),
      
      // Top users by diamonds
      db.user.findMany({
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          currentDiamonds: true,
          totalDiamonds: true,
          level: true
        },
        orderBy: {
          totalDiamonds: 'desc'
        },
        take: 10
      }),
      
      // Top users by level
      db.user.findMany({
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          level: true,
          experience: true,
          currentDiamonds: true
        },
        orderBy: {
          level: 'desc'
        },
        take: 10
      }),
      
      // User registration trends (last 12 months)
      db.$queryRaw`
        SELECT
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*)::int as count
        FROM "users"
        WHERE "createdAt" >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
      `
    ])

    // Calculate additional metrics
    const inactiveUsers = totalUsers - activeUsers
    const freeUsers = totalUsers - premiumUsers
    const averageDiamonds = topUsersByDiamonds.length > 0 
      ? Math.round(topUsersByDiamonds.reduce((sum, user) => sum + (user.currentDiamonds || 0), 0) / topUsersByDiamonds.length)
      : 0
    const averageLevel = topUsersByLevel.length > 0
      ? Math.round(topUsersByLevel.reduce((sum, user) => sum + user.level, 0) / topUsersByLevel.length)
      : 1

    // Format role distribution
    const roleDistribution = usersByRole.map(role => ({
      role: role.role,
      count: role._count.id,
      percentage: Math.round((role._count.id / totalUsers) * 100)
    }))

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        premiumUsers,
        freeUsers,
        newUsersThisMonth,
        averageDiamonds,
        averageLevel
      },
      distribution: {
        roles: roleDistribution,
        activity: {
          active: activeUsers,
          inactive: inactiveUsers,
          activePercentage: Math.round((activeUsers / totalUsers) * 100),
          inactivePercentage: Math.round((inactiveUsers / totalUsers) * 100)
        },
        subscription: {
          premium: premiumUsers,
          free: freeUsers,
          premiumPercentage: Math.round((premiumUsers / totalUsers) * 100),
          freePercentage: Math.round((freeUsers / totalUsers) * 100)
        }
      },
      topUsers: {
        byDiamonds: topUsersByDiamonds,
        byLevel: topUsersByLevel
      },
      trends: {
        registrations: userRegistrationTrends
      }
    })
  } catch (error) {
    console.error('Admin users stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
