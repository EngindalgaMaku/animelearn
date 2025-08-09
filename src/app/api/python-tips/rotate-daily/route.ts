import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if we already have a daily tip for today
    const existingDailyTip = await prisma.dailyPythonTip.findFirst({
      where: {
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });

    if (existingDailyTip) {
      return NextResponse.json({
        message: 'Daily tip already exists for today',
        tipId: existingDailyTip.tipId
      });
    }

    // Get all available tips that haven't been used as daily tips recently (last 30 days)
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentlyUsedTipIds = await prisma.dailyPythonTip.findMany({
      where: {
        date: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        tipId: true
      }
    });

    const usedTipIds = recentlyUsedTipIds.map((dt: any) => dt.tipId);

    // Find available tips (excluding recently used ones)
    const availableTips = await prisma.pythonTip.findMany({
      where: {
        isActive: true,
        ...(usedTipIds.length > 0 ? {
          id: {
            notIn: usedTipIds
          }
        } : {})
      },
      include: {
        category: true
      }
    });

    if (availableTips.length === 0) {
      // If no tips available (all have been used recently), reset and use any active tip
      const allActiveTips = await prisma.pythonTip.findMany({
        where: {
          isActive: true
        },
        include: {
          category: true
        }
      });

      if (allActiveTips.length === 0) {
        return NextResponse.json(
          { error: 'No active Python tips available' },
          { status: 404 }
        );
      }

      // Select a random tip from all active tips
      const randomIndex = Math.floor(Math.random() * allActiveTips.length);
      const selectedTip = allActiveTips[randomIndex];

      // Create daily tip entry
      const dailyTip = await prisma.dailyPythonTip.create({
        data: {
          tipId: selectedTip.id,
          date: today
        },
        include: {
          tip: {
            include: {
              category: true
            }
          }
        }
      });

      return NextResponse.json({
        message: 'Daily tip rotated successfully (reset cycle)',
        dailyTip: dailyTip,
        tip: selectedTip
      });
    }

    // Select a random tip from available tips
    const randomIndex = Math.floor(Math.random() * availableTips.length);
    const selectedTip = availableTips[randomIndex];

    // Create daily tip entry
    const dailyTip = await prisma.dailyPythonTip.create({
      data: {
        tipId: selectedTip.id,
        date: today
      },
      include: {
        tip: {
          include: {
            category: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Daily tip rotated successfully',
      dailyTip: dailyTip,
      tip: selectedTip
    });

  } catch (error) {
    console.error('Error rotating daily tip:', error);
    return NextResponse.json(
      { error: 'Failed to rotate daily tip' },
      { status: 500 }
    );
  }
}

// Optional: Allow GET request to manually trigger rotation (for testing)
export async function GET(req: NextRequest) {
  // Check for admin authentication
  const authHeader = req.headers.get('authorization');
  const adminSecret = process.env.ADMIN_SECRET || 'admin-secret';
  
  if (authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Call the same logic as POST
  return POST(req);
}