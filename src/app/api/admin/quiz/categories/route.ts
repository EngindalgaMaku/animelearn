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

    const url = new URL(request.url);
    const isActive = url.searchParams.get('isActive');

    // Build filter conditions
    const where: any = {};
    if (isActive !== null) where.isActive = isActive === 'true';

    // Get categories
    const categories = await (prisma as any).quizCategory.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    // Update question counts for all categories
    for (const category of categories) {
      const questionCount = await (prisma as any).quizQuestion.count({
        where: {
          category: category.name,
          isActive: true
        }
      });

      if (questionCount !== category.questionCount) {
        await (prisma as any).quizCategory.update({
          where: { id: category.id },
          data: { questionCount }
        });
        category.questionCount = questionCount;
      }
    }

    console.log('📁 Quiz Categories API Debug:');
    console.log('Categories Found:', categories.length);
    console.log('First Category:', categories[0]);

    return NextResponse.json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Quiz categories fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch quiz categories',
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
      name,
      description,
      color = '#3B82F6',
      icon,
      isActive = true,
      sortOrder = 0
    } = await request.json();

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Category name is required'
      }, { status: 400 });
    }

    const trimmedName = name.trim();

    // Check if category already exists
    const existingCategory = await (prisma as any).quizCategory.findUnique({
      where: { name: trimmedName }
    });

    if (existingCategory) {
      return NextResponse.json({ 
        error: 'Category already exists',
        details: `A category with the name "${trimmedName}" already exists`
      }, { status: 400 });
    }

    // Count existing questions in this category
    const questionCount = await (prisma as any).quizQuestion.count({
      where: {
        category: trimmedName,
        isActive: true
      }
    });

    // Create category
    const newCategory = await (prisma as any).quizCategory.create({
      data: {
        name: trimmedName,
        description: description?.trim() || null,
        color: color || '#3B82F6',
        icon: icon?.trim() || null,
        questionCount,
        isActive,
        sortOrder: parseInt(sortOrder) || 0
      }
    });

    return NextResponse.json({
      success: true,
      category: newCategory,
      message: 'Quiz category created successfully'
    });

  } catch (error) {
    console.error('Quiz category creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create quiz category',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}