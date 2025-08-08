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

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user rarity statistics
    let rarityStats;
    try {
      rarityStats = await (prisma as any).userRarityStats.findUnique({
        where: { userId: user.id }
      });
    } catch (error) {
      console.log('Rarity stats temporarily unavailable');
      rarityStats = null;
    }

    // Get recent distribution logs for pity tracking
    let recentLogs: any[] = [];
    let pityCounters = {
      packsSinceRare: 0,
      packsSinceEpic: 0,
      packsSinceLegendary: 0
    };

    try {
      recentLogs = await (prisma as any).cardDistributionLog.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 200
      });

      // Calculate pity counters
      for (const log of recentLogs) {
        if (log.rarity === 'LEGENDARY') break;
        pityCounters.packsSinceLegendary++;
        
        if (log.rarity === 'EPIC') {
          if (pityCounters.packsSinceEpic === 0) {
            pityCounters.packsSinceEpic = pityCounters.packsSinceLegendary;
          }
        } else if (log.rarity === 'RARE') {
          if (pityCounters.packsSinceRare === 0) {
            pityCounters.packsSinceRare = pityCounters.packsSinceLegendary;
          }
        }
      }
    } catch (error) {
      console.log('Distribution logs temporarily unavailable');
    }

    // Calculate collection progress
    const defaultStats = {
      totalCards: 0,
      commonCards: 0,
      uncommonCards: 0,
      rareCards: 0,
      epicCards: 0,
      legendaryCards: 0,
      totalValue: 0
    };

    const stats = rarityStats || defaultStats;
    
    const collectionProgress = {
      totalCards: stats.totalCards,
      rarityBreakdown: {
        COMMON: stats.commonCards,
        UNCOMMON: stats.uncommonCards,
        RARE: stats.rareCards,
        EPIC: stats.epicCards,
        LEGENDARY: stats.legendaryCards
      },
      rarityPercentages: stats.totalCards > 0 ? {
        COMMON: Math.round((stats.commonCards / stats.totalCards) * 100),
        UNCOMMON: Math.round((stats.uncommonCards / stats.totalCards) * 100),
        RARE: Math.round((stats.rareCards / stats.totalCards) * 100),
        EPIC: Math.round((stats.epicCards / stats.totalCards) * 100),
        LEGENDARY: Math.round((stats.legendaryCards / stats.totalCards) * 100)
      } : { COMMON: 0, UNCOMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 },
      totalValue: stats.totalValue,
      averageValue: stats.totalCards > 0 ? Math.round(stats.totalValue / stats.totalCards) : 0
    };

    // Calculate pity protection status
    const pitySystem = {
      RARE: { threshold: 15, guaranteedAfter: 20 },
      EPIC: { threshold: 50, guaranteedAfter: 100 },
      LEGENDARY: { threshold: 100, guaranteedAfter: 200 }
    };

    const pityStatus = {
      rare: {
        current: pityCounters.packsSinceRare,
        threshold: pitySystem.RARE.threshold,
        guaranteed: pitySystem.RARE.guaranteedAfter,
        bonusActive: pityCounters.packsSinceRare >= pitySystem.RARE.threshold,
        guaranteedNext: pityCounters.packsSinceRare >= pitySystem.RARE.guaranteedAfter
      },
      epic: {
        current: pityCounters.packsSinceEpic,
        threshold: pitySystem.EPIC.threshold,
        guaranteed: pitySystem.EPIC.guaranteedAfter,
        bonusActive: pityCounters.packsSinceEpic >= pitySystem.EPIC.threshold,
        guaranteedNext: pityCounters.packsSinceEpic >= pitySystem.EPIC.guaranteedAfter
      },
      legendary: {
        current: pityCounters.packsSinceLegendary,
        threshold: pitySystem.LEGENDARY.threshold,
        guaranteed: pitySystem.LEGENDARY.guaranteedAfter,
        bonusActive: pityCounters.packsSinceLegendary >= pitySystem.LEGENDARY.threshold,
        guaranteedNext: pityCounters.packsSinceLegendary >= pitySystem.LEGENDARY.guaranteedAfter
      }
    };

    return NextResponse.json({
      success: true,
      collectionProgress,
      pityStatus,
      recentPulls: recentLogs.slice(0, 10).map(log => ({
        rarity: log.rarity,
        cardName: log.cardName,
        cardSeries: log.cardSeries,
        timestamp: log.createdAt
      }))
    });

  } catch (error) {
    console.error('Card stats error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch card statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}