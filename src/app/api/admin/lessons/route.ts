import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const searchParams = url.searchParams
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const difficulty = searchParams.get('difficulty') || ''
    const status = searchParams.get('status') || ''
    const sortBy = searchParams.get('sortBy') || 'order'

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.category = category
    }

    if (difficulty) {
      where.difficulty = parseInt(difficulty)
    }

    if (status === 'published') {
      where.isPublished = true
    } else if (status === 'draft') {
      where.isPublished = false
    }

    // Build orderBy clause
    let orderBy: any = {}
    switch (sortBy) {
      case 'title':
        orderBy = { title: 'asc' }
        break
      case 'difficulty':
        orderBy = { difficulty: 'asc' }
        break
      case 'category':
        orderBy = { category: 'asc' }
        break
      case 'date':
        orderBy = { createdAt: 'desc' }
        break
      case 'order':
      default:
        orderBy = { order: 'asc' }
        break
    }

    const lessons = await prisma.codeArena.findMany({
      where,
      include: {
        _count: {
          select: {
            progress: true
          }
        }
      },
      orderBy
    })

    // Parse JSON fields for frontend
    const parsedLessons = lessons.map(lesson => ({
      ...lesson,
      examples: lesson.examples ? JSON.parse(lesson.examples) : [],
      sections: lesson.sections ? JSON.parse(lesson.sections) : [],
      tags: lesson.tags ? JSON.parse(lesson.tags) : [],
      learningObjectives: lesson.learningObjectives ? JSON.parse(lesson.learningObjectives) : [],
      resources: lesson.resources ? JSON.parse(lesson.resources) : []
    }))

    return NextResponse.json({ lessons: parsedLessons })
  } catch (error) {
    console.error('Admin lessons GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      title,
      slug,
      description,
      content,
      difficulty = 1,
      order = 1,
      duration = 30,
      category = 'python-basics',
      hasCodeExercise = false,
      starterCode,
      solutionCode,
      testCases,
      hints,
      prerequisites,
      diamondReward = 10,
      experienceReward = 50,
      isPublished = false,
      examples = [],
      sections = [],
      tags = [],
      learningObjectives = [],
      resources = []
    } = body

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    if (slug) {
      const existingLesson = await prisma.codeArena.findUnique({
        where: { slug }
      })

      if (existingLesson) {
        return NextResponse.json(
          { error: 'A lesson with this slug already exists' },
          { status: 409 }
        )
      }
    }

    // Generate slug if not provided
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const newLesson = await prisma.codeArena.create({
      data: {
        title,
        slug: finalSlug,
        description,
        content: content || '',
        difficulty,
        order,
        duration,
        category,
        hasCodeExercise,
        starterCode: hasCodeExercise ? starterCode : null,
        solutionCode: hasCodeExercise ? solutionCode : null,
        testCases: hasCodeExercise ? testCases : null,
        hints: hints || null,
        prerequisites: prerequisites || null,
        diamondReward,
        experienceReward,
        isPublished,
        examples: JSON.stringify(examples),
        sections: JSON.stringify(sections),
        tags: JSON.stringify(tags),
        learningObjectives: JSON.stringify(learningObjectives),
        resources: JSON.stringify(resources)
      },
      include: {
        _count: {
          select: {
            progress: true
          }
        }
      }
    })

    // Parse JSON fields for frontend
    const parsedLesson = {
      ...newLesson,
      examples: newLesson.examples ? JSON.parse(newLesson.examples) : [],
      sections: newLesson.sections ? JSON.parse(newLesson.sections) : [],
      tags: newLesson.tags ? JSON.parse(newLesson.tags) : [],
      learningObjectives: newLesson.learningObjectives ? JSON.parse(newLesson.learningObjectives) : [],
      resources: newLesson.resources ? JSON.parse(newLesson.resources) : []
    }

    return NextResponse.json(parsedLesson, { status: 201 })
  } catch (error) {
    console.error('Admin lessons POST API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { lessonId, ...updates } = body

    if (!lessonId) {
      return NextResponse.json(
        { error: 'Lesson ID is required' },
        { status: 400 }
      )
    }

    // Check if lesson exists
    const existingLesson = await prisma.codeArena.findUnique({
      where: { id: lessonId }
    })

    if (!existingLesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Check if slug is being updated and already exists
    if (updates.slug && updates.slug !== existingLesson.slug) {
      const slugExists = await prisma.codeArena.findUnique({
        where: { slug: updates.slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'A lesson with this slug already exists' },
          { status: 409 }
        )
      }
    }

    // Remove fields that shouldn't be updated directly
    const allowedUpdates = [
      'title', 'slug', 'description', 'content', 'difficulty', 'order',
      'duration', 'category', 'hasCodeExercise', 'starterCode', 'solutionCode',
      'testCases', 'hints', 'prerequisites', 'diamondReward', 'experienceReward',
      'isPublished', 'examples', 'sections', 'tags', 'learningObjectives', 'resources'
    ]
    
    const updateData: any = {}
    for (const [key, value] of Object.entries(updates)) {
      if (allowedUpdates.includes(key)) {
        // Handle code exercise fields
        if (key === 'starterCode' || key === 'solutionCode' || key === 'testCases') {
          updateData[key] = updates.hasCodeExercise ? value : null
        }
        // Handle JSON fields
        else if (key === 'examples' || key === 'sections' || key === 'tags' || key === 'learningObjectives' || key === 'resources') {
          updateData[key] = JSON.stringify(value || [])
        }
        else {
          updateData[key] = value
        }
      }
    }

    const updatedLesson = await prisma.codeArena.update({
      where: { id: lessonId },
      data: updateData,
      include: {
        _count: {
          select: {
            progress: true
          }
        }
      }
    })

    // Parse JSON fields for frontend
    const parsedLesson = {
      ...updatedLesson,
      examples: updatedLesson.examples ? JSON.parse(updatedLesson.examples) : [],
      sections: updatedLesson.sections ? JSON.parse(updatedLesson.sections) : [],
      tags: updatedLesson.tags ? JSON.parse(updatedLesson.tags) : [],
      learningObjectives: updatedLesson.learningObjectives ? JSON.parse(updatedLesson.learningObjectives) : [],
      resources: updatedLesson.resources ? JSON.parse(updatedLesson.resources) : []
    }

    return NextResponse.json(parsedLesson)
  } catch (error) {
    console.error('Admin lessons PATCH API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const lessonId = searchParams.get('lessonId')

    if (!lessonId) {
      return NextResponse.json(
        { error: 'Lesson ID is required' },
        { status: 400 }
      )
    }

    // Check if lesson exists
    const existingLesson = await prisma.codeArena.findUnique({
      where: { id: lessonId },
      include: {
        _count: {
          select: {
            progress: true
          }
        }
      }
    })

    if (!existingLesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Check if lesson has student progress
    if (existingLesson._count.progress > 0) {
      return NextResponse.json(
        { error: 'Cannot delete lesson with student progress. Unpublish it instead.' },
        { status: 400 }
      )
    }

    await prisma.codeArena.delete({
      where: { id: lessonId }
    })

    return NextResponse.json({ message: 'Lesson deleted successfully' })
  } catch (error) {
    console.error('Admin lessons DELETE API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
