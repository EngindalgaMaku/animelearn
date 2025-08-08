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

    const category = await (prisma as any).quizCategory.findUnique({
      where: { id }
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Update question count
    const questionCount = await (prisma as any).quizQuestion.count({
      where: { 
        category: category.name,
        isActive: true
      }
    });

    if (questionCount !== category.questionCount) {
      await (prisma as any).quizCategory.update({
        where: { id },
        data: { questionCount }
      });
      category.questionCount = questionCount;
    }

    return NextResponse.json({
      success: true,
      category
    });

  } catch (error) {
    console.error('Quiz category fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch quiz category',
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
      name,
      description,
      color,
      icon,
      isActive,
      sortOrder
    } = await request.json();

    // Get existing category
    const existingCategory = await (prisma as any).quizCategory.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if name is being changed and if new name already exists
    if (name && name.trim() !== existingCategory.name) {
      const nameExists = await (prisma as any).quizCategory.findUnique({
        where: { name: name.trim() }
      });

      if (nameExists) {
        return NextResponse.json({ 
          error: 'Category name already exists',
          details: `A category with the name "${name.trim()}" already exists`
        }, { status: 400 });
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (color !== undefined) updateData.color = color;
    if (icon !== undefined) updateData.icon = icon?.trim() || null;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (sortOrder !== undefined) updateData.sortOrder = parseInt(sortOrder) || 0;

    // Update category
    const updatedCategory = await (prisma as any).quizCategory.update({
      where: { id },
      data: updateData
    });

    // If name changed, update all questions in this category
    if (name && name.trim() !== existingCategory.name) {
      await (prisma as any).quizQuestion.updateMany({
        where: { category: existingCategory.name },
        data: { category: name.trim() }
      });

      // Update question count
      const questionCount = await (prisma as any).quizQuestion.count({
        where: { 
          category: name.trim(),
          isActive: true
        }
      });

      await (prisma as any).quizCategory.update({
        where: { id },
        data: { questionCount }
      });

      updatedCategory.questionCount = questionCount;
    }

    return NextResponse.json({
      success: true,
      category: updatedCategory,
      message: 'Quiz category updated successfully'
    });

  } catch (error) {
    console.error('Quiz category update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update quiz category',
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

    // Get category to check for existing questions
    const category = await (prisma as any).quizCategory.findUnique({
      where: { id }
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if there are questions in this category
    const questionCount = await (prisma as any).quizQuestion.count({
      where: { category: category.name }
    });

    if (questionCount > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete category with existing questions',
        details: `This category has ${questionCount} questions. Please delete or move the questions first.`
      }, { status: 400 });
    }

    // Delete category
    await (prisma as any).quizCategory.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Quiz category deleted successfully'
    });

  } catch (error) {
    console.error('Quiz category deletion error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete quiz category',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}