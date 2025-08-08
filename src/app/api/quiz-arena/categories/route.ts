import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all categories that have active questions
    const categories = await (prisma as any).quizQuestion.groupBy({
      by: ['category'],
      where: {
        isActive: true
      },
      _count: {
        id: true
      }
    });

    const categoriesWithCounts = categories.map((cat: any) => ({
      name: cat.category,
      questionCount: cat._count.id
    }));

    return NextResponse.json({
      success: true,
      categories: categoriesWithCounts
    });

  } catch (error) {
    console.error('Error fetching quiz categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}