import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const searchParams = url.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'date'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (role) {
      where.role = role
    }

    if (status === 'active') {
      where.isActive = true
    } else if (status === 'inactive') {
      where.isActive = false
    }

    // Build orderBy clause
    let orderBy: any = {}
    switch (sortBy) {
      case 'username':
        orderBy = { username: sortOrder }
        break
      case 'email':
        orderBy = { email: sortOrder }
        break
      case 'role':
        orderBy = { role: sortOrder }
        break
      case 'level':
        orderBy = { level: sortOrder }
        break
      case 'diamonds':
        orderBy = { currentDiamonds: sortOrder }
        break
      case 'date':
      default:
        orderBy = { createdAt: sortOrder }
        break
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
          role: true,
          level: true,
          experience: true,
          currentDiamonds: true,
          totalDiamonds: true,
          isActive: true,
          isPremium: true,
          premiumExpiresAt: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          lastLoginDate: true,
          loginStreak: true,
          _count: {
            select: {
              userCards: true,
              badges: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      db.user.count({ where })
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Admin users GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      role = 'user',
      isActive = true
    } = body

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      )
    }

    // Prevent creating multiple admins
    if (role === 'admin') {
      const existingAdmin = await db.user.findFirst({
        where: { role: 'admin' }
      })
      
      if (existingAdmin) {
        return NextResponse.json(
          { error: 'Only one admin user is allowed' },
          { status: 400 }
        )
      }
    }

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this username or email already exists' },
        { status: 409 }
      )
    }

    // Hash password (you should implement proper password hashing)
    const passwordHash = password // TODO: Implement proper hashing

    const newUser = await db.user.create({
      data: {
        username,
        email,
        passwordHash,
        firstName,
        lastName,
        role,
        isActive
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        level: true,
        currentDiamonds: true,
        isActive: true,
        createdAt: true
      }
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Admin users POST API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, ...updates } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get the user to check current role
    const currentUser = await db.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent changing admin role
    if (currentUser.role === 'admin' && updates.role && updates.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin role cannot be changed' },
        { status: 400 }
      )
    }

    // Prevent creating multiple admins
    if (updates.role === 'admin' && currentUser.role !== 'admin') {
      const existingAdmin = await db.user.findFirst({
        where: {
          role: 'admin',
          id: { not: userId }
        }
      })
      
      if (existingAdmin) {
        return NextResponse.json(
          { error: 'Only one admin user is allowed' },
          { status: 400 }
        )
      }
    }

    // Remove fields that shouldn't be updated directly
    const allowedUpdates = [
      'firstName', 'lastName', 'role', 'isActive', 'isPremium',
      'premiumExpiresAt', 'emailVerified', 'level', 'experience',
      'currentDiamonds', 'totalDiamonds'
    ]
    
    const updateData: any = {}
    for (const [key, value] of Object.entries(updates)) {
      if (allowedUpdates.includes(key)) {
        updateData[key] = value
      }
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        level: true,
        experience: true,
        currentDiamonds: true,
        totalDiamonds: true,
        isActive: true,
        isPremium: true,
        premiumExpiresAt: true,
        emailVerified: true,
        updatedAt: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Admin users PATCH API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if user is admin
    const userToDelete = await db.user.findUnique({
      where: { id: userId },
      select: { role: true, email: true }
    })

    if (!userToDelete) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent deleting admin
    if (userToDelete.role === 'admin') {
      return NextResponse.json(
        { error: 'Admin user cannot be deleted' },
        { status: 400 }
      )
    }

    await db.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Admin users DELETE API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
