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

    // Get challenge with user progress stats
    const challenge = await (prisma as any).weeklyChallenge.findUnique({
      where: { id },
      include: {
        userProgress: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    // Calculate stats
    const participantCount = challenge.userProgress.length;
    const completionCount = challenge.userProgress.filter((p: any) => p.isCompleted).length;
    const averageProgress = participantCount > 0 
      ? challenge.userProgress.reduce((sum: number, p: any) => sum + (p.currentValue / challenge.targetValue * 100), 0) / participantCount
      : 0;

    const challengeWithStats = {
      ...challenge,
      participantCount,
      completionCount,
      averageProgress: Math.round(averageProgress)
    };

    return NextResponse.json({
      success: true,
      challenge: challengeWithStats
    });

  } catch (error) {
    console.error('Admin challenge fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch challenge',
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
    const updateData = await request.json();

    // Validate dates if provided
    if (updateData.startDate && updateData.endDate) {
      const start = new Date(updateData.startDate);
      const end = new Date(updateData.endDate);
      
      if (end <= start) {
        return NextResponse.json({ 
          error: 'End date must be after start date'
        }, { status: 400 });
      }
    }

    // Prepare update data
    const processedData: any = { ...updateData };
    
    if (updateData.startDate) {
      processedData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      processedData.endDate = new Date(updateData.endDate);
    }
    if (updateData.targetValue) {
      processedData.targetValue = parseInt(updateData.targetValue);
    }
    if (updateData.diamondReward) {
      processedData.diamondReward = parseInt(updateData.diamondReward);
    }
    if (updateData.experienceReward) {
      processedData.experienceReward = parseInt(updateData.experienceReward);
    }
    if (updateData.priority) {
      processedData.priority = parseInt(updateData.priority);
    }

    // Handle JSON fields
    if (updateData.requirements && typeof updateData.requirements !== 'string') {
      processedData.requirements = JSON.stringify(updateData.requirements);
    }
    if (updateData.cardPackReward && typeof updateData.cardPackReward !== 'string') {
      processedData.cardPackReward = JSON.stringify(updateData.cardPackReward);
    }
    if (updateData.specialReward && typeof updateData.specialReward !== 'string') {
      processedData.specialReward = JSON.stringify(updateData.specialReward);
    }
    if (updateData.tags && typeof updateData.tags !== 'string') {
      processedData.tags = JSON.stringify(updateData.tags);
    }

    // Update challenge
    const challenge = await (prisma as any).weeklyChallenge.update({
      where: { id },
      data: processedData
    });

    return NextResponse.json({
      success: true,
      challenge,
      message: 'Challenge updated successfully'
    });

  } catch (error) {
    console.error('Admin challenge update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update challenge',
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

    // Check if challenge exists
    const challenge = await (prisma as any).weeklyChallenge.findUnique({
      where: { id },
      include: {
        userProgress: true
      }
    });

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    // Check if challenge has active participants
    const activeParticipants = challenge.userProgress.length;
    if (activeParticipants > 0) {
      // Instead of preventing deletion, we could warn the admin
      console.warn(`Deleting challenge with ${activeParticipants} participants`);
    }

    // Delete challenge (this will cascade delete user progress due to foreign key constraints)
    await (prisma as any).weeklyChallenge.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Challenge deleted successfully',
      deletedParticipants: activeParticipants
    });

  } catch (error) {
    console.error('Admin challenge deletion error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete challenge',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}