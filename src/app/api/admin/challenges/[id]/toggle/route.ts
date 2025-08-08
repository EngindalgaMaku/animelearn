import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { isActive } = await request.json();

    if (typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'isActive must be a boolean' }, { status: 400 });
    }

    // Update challenge status
    const challenge = await (prisma as any).weeklyChallenge.update({
      where: { id },
      data: { isActive }
    });

    return NextResponse.json({
      success: true,
      challenge,
      message: `Challenge ${isActive ? 'activated' : 'deactivated'} successfully`
    });

  } catch (error) {
    console.error('Admin challenge toggle error:', error);
    return NextResponse.json({ 
      error: 'Failed to toggle challenge status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}