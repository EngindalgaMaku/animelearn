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
    const category = url.searchParams.get('category');
    const difficulty = url.searchParams.get('difficulty');
    const isActive = url.searchParams.get('isActive');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '1000'); // Tüm soruları göstermek için limit artırıldı
    const search = url.searchParams.get('search');

    // Build filter conditions
    const where: any = {};
    
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (isActive !== null) where.isActive = isActive === 'true';
    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { explanation: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count for pagination
    const totalCount = await (prisma as any).quizQuestion.count({ where });
    
    // Get questions with pagination
    const questions = await (prisma as any).quizQuestion.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    // Get category stats
    const categoryStats = await (prisma as any).quizQuestion.groupBy({
      by: ['category'],
      _count: { id: true },
      where: { isActive: true }
    });

    // Get difficulty stats
    const difficultyStats = await (prisma as any).quizQuestion.groupBy({
      by: ['difficulty'],
      _count: { id: true },
      where: { isActive: true }
    });

    console.log('📊 Quiz Questions API Debug:');
    console.log('Total Count:', totalCount);
    console.log('Questions Found:', questions.length);
    console.log('First Question:', questions[0]);

    return NextResponse.json({
      success: true,
      questions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit
      },
      stats: {
        categories: categoryStats.reduce((acc: any, stat: any) => {
          acc[stat.category] = stat._count.id;
          return acc;
        }, {}),
        difficulties: difficultyStats.reduce((acc: any, stat: any) => {
          acc[stat.difficulty] = stat._count.id;
          return acc;
        }, {}),
        totalActive: await (prisma as any).quizQuestion.count({ where: { isActive: true } }),
        totalInactive: await (prisma as any).quizQuestion.count({ where: { isActive: false } })
      }
    });

  } catch (error) {
    console.error('Quiz questions fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch quiz questions',
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
      question,
      options,
      correctAnswer,
      explanation,
      difficulty = 'intermediate',
      category,
      isActive = true
    } = await request.json();

    // Validation
    if (!question || !options || !Array.isArray(options) || options.length !== 4) {
      return NextResponse.json({ 
        error: 'Invalid question data',
        details: 'Question must have exactly 4 options'
      }, { status: 400 });
    }

    if (typeof correctAnswer !== 'number' || correctAnswer < 0 || correctAnswer > 3) {
      return NextResponse.json({ 
        error: 'Invalid correct answer',
        details: 'Correct answer must be an index between 0 and 3'
      }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ 
        error: 'Category is required'
      }, { status: 400 });
    }

    const validDifficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json({ 
        error: 'Invalid difficulty',
        details: `Difficulty must be one of: ${validDifficulties.join(', ')}`
      }, { status: 400 });
    }

    // Create question
    const newQuestion = await (prisma as any).quizQuestion.create({
      data: {
        question: question.trim(),
        options: options.map((opt: string) => opt.trim()),
        correctAnswer,
        explanation: explanation?.trim() || null,
        difficulty,
        category: category.trim(),
        isActive,
        createdBy: user.id
      }
    });

    // Update category question count
    await updateCategoryQuestionCount(category);

    return NextResponse.json({
      success: true,
      question: newQuestion,
      message: 'Quiz question created successfully'
    });

  } catch (error) {
    console.error('Quiz question creation error:', error);
    return NextResponse.json({
      error: 'Failed to create quiz question',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PATCH - Bulk operations for questions
export async function PATCH(request: NextRequest) {
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

    const { action, questionIds } = await request.json();

    if (!action || !Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request. Action and questionIds are required.' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'delete':
        result = await (prisma as any).quizQuestion.deleteMany({
          where: {
            id: {
              in: questionIds
            }
          }
        });
        break;

      case 'activate':
        result = await (prisma as any).quizQuestion.updateMany({
          where: {
            id: {
              in: questionIds
            }
          },
          data: {
            isActive: true
          }
        });
        break;

      case 'deactivate':
        result = await (prisma as any).quizQuestion.updateMany({
          where: {
            id: {
              in: questionIds
            }
          },
          data: {
            isActive: false
          }
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: delete, activate, deactivate' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      affectedCount: result.count,
      message: `Successfully ${action}d ${result.count} question(s)`
    });

  } catch (error) {
    console.error('Error performing bulk operation:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    );
  }
}

// Helper function to update category question count
async function updateCategoryQuestionCount(categoryName: string) {
  try {
    const count = await (prisma as any).quizQuestion.count({
      where: {
        category: categoryName,
        isActive: true
      }
    });

    await (prisma as any).quizCategory.upsert({
      where: { name: categoryName },
      update: { questionCount: count },
      create: {
        name: categoryName,
        questionCount: count,
        description: `Auto-created category for ${categoryName}`,
        color: getRandomColor(),
        isActive: true,
        sortOrder: 0
      }
    });
  } catch (error) {
    console.error('Failed to update category count:', error);
  }
}

function getRandomColor() {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}