import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;

    const question = await (prisma as any).quizQuestion.findUnique({
      where: { id }
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      question
    });

  } catch (error) {
    console.error('Quiz question fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch quiz question',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;
    const {
      question,
      options,
      correctAnswer,
      explanation,
      difficulty,
      category,
      isActive
    } = await request.json();

    // Get existing question to track category changes
    const existingQuestion = await (prisma as any).quizQuestion.findUnique({
      where: { id }
    });

    if (!existingQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Validation
    if (options && (!Array.isArray(options) || options.length !== 4)) {
      return NextResponse.json({ 
        error: 'Invalid question data',
        details: 'Question must have exactly 4 options'
      }, { status: 400 });
    }

    if (correctAnswer !== undefined && (typeof correctAnswer !== 'number' || correctAnswer < 0 || correctAnswer > 3)) {
      return NextResponse.json({ 
        error: 'Invalid correct answer',
        details: 'Correct answer must be an index between 0 and 3'
      }, { status: 400 });
    }

    const validDifficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
    if (difficulty && !validDifficulties.includes(difficulty)) {
      return NextResponse.json({ 
        error: 'Invalid difficulty',
        details: `Difficulty must be one of: ${validDifficulties.join(', ')}`
      }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {};
    if (question !== undefined) updateData.question = question.trim();
    if (options !== undefined) updateData.options = options.map((opt: string) => opt.trim());
    if (correctAnswer !== undefined) updateData.correctAnswer = correctAnswer;
    if (explanation !== undefined) updateData.explanation = explanation?.trim() || null;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (category !== undefined) updateData.category = category.trim();
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update question
    const updatedQuestion = await (prisma as any).quizQuestion.update({
      where: { id },
      data: updateData
    });

    // Update category counts if category changed
    if (category && category !== existingQuestion.category) {
      await updateCategoryQuestionCount(existingQuestion.category);
      await updateCategoryQuestionCount(category);
    } else if (isActive !== undefined && isActive !== existingQuestion.isActive) {
      await updateCategoryQuestionCount(existingQuestion.category);
    }

    return NextResponse.json({
      success: true,
      question: updatedQuestion,
      message: 'Quiz question updated successfully'
    });

  } catch (error) {
    console.error('Quiz question update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update quiz question',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;

    // Get question to track category for count update
    const question = await (prisma as any).quizQuestion.findUnique({
      where: { id }
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Delete question
    await (prisma as any).quizQuestion.delete({
      where: { id }
    });

    // Update category count
    await updateCategoryQuestionCount(question.category);

    return NextResponse.json({
      success: true,
      message: 'Quiz question deleted successfully'
    });

  } catch (error) {
    console.error('Quiz question deletion error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete quiz question',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
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