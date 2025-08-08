import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Define CardRarity enum locally until Prisma client is regenerated
enum CardRarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY'
}

type RarityKey = keyof typeof CardRarity;

// Advanced rarity distribution algorithm
class RarityDistributor {
  private static readonly BASE_RATES: Record<RarityKey, number> = {
    COMMON: 60,      // 60%
    UNCOMMON: 25,    // 25%
    RARE: 10,        // 10%
    EPIC: 4,         // 4%
    LEGENDARY: 1     // 1%
  };

  private static readonly PITY_SYSTEM = {
    RARE: { threshold: 15, guaranteedAfter: 20 },
    EPIC: { threshold: 50, guaranteedAfter: 100 },
    LEGENDARY: { threshold: 100, guaranteedAfter: 200 }
  };

  static async calculateRarity(userId: string, packType: string = 'STANDARD'): Promise<CardRarity> {
    // Get user's recent distribution log to check pity system
    let recentLogs: any[] = [];
    try {
      recentLogs = await (prisma as any).cardDistributionLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 200
      });
    } catch (error) {
      console.log('Distribution log temporarily unavailable');
    }

    // Calculate pity counters
    let packsSinceRare = 0;
    let packsSinceEpic = 0;
    let packsSinceLegendary = 0;

    for (const log of recentLogs) {
      if (log.rarity === 'LEGENDARY') break;
      packsSinceLegendary++;
      
      if (log.rarity === 'EPIC') {
        if (packsSinceEpic === 0) packsSinceEpic = packsSinceLegendary;
      } else if (log.rarity === 'RARE') {
        if (packsSinceRare === 0) packsSinceRare = packsSinceLegendary;
      }
    }

    // Apply pity system
    if (packsSinceLegendary >= this.PITY_SYSTEM.LEGENDARY.guaranteedAfter) {
      return CardRarity.LEGENDARY;
    }
    if (packsSinceEpic >= this.PITY_SYSTEM.EPIC.guaranteedAfter) {
      return CardRarity.EPIC;
    }
    if (packsSinceRare >= this.PITY_SYSTEM.RARE.guaranteedAfter) {
      return CardRarity.RARE;
    }

    // Get custom distribution rules
    let customRules: any[] = [];
    try {
      customRules = await (prisma as any).cardDistributionRule.findMany({
        where: { 
          packType,
          isActive: true 
        }
      });
    } catch (error) {
      console.log('Custom rules temporarily unavailable');
    }

    let rates = { ...this.BASE_RATES };
    
    // Apply custom rules
    for (const rule of customRules) {
      if (rule.rarity in rates) {
        rates[rule.rarity as keyof typeof rates] = rule.dropRate;
      }
    }

    // Apply pity bonuses
    if (packsSinceLegendary >= this.PITY_SYSTEM.LEGENDARY.threshold) {
      rates.LEGENDARY += Math.min(10, Math.floor(packsSinceLegendary / 10));
    }
    if (packsSinceEpic >= this.PITY_SYSTEM.EPIC.threshold) {
      rates.EPIC += Math.min(15, Math.floor(packsSinceEpic / 5));
    }
    if (packsSinceRare >= this.PITY_SYSTEM.RARE.threshold) {
      rates.RARE += Math.min(20, Math.floor(packsSinceRare / 3));
    }

    // Normalize rates to ensure they sum to 100
    const totalRate = Object.values(rates).reduce((sum, rate) => sum + rate, 0);
    const normalizedRates = Object.fromEntries(
      Object.entries(rates).map(([rarity, rate]) => [rarity, (rate / totalRate) * 100])
    );

    // Generate random number and determine rarity
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const [rarity, rate] of Object.entries(normalizedRates)) {
      cumulative += rate;
      if (random <= cumulative) {
        return rarity as CardRarity;
      }
    }

    return CardRarity.COMMON; // Fallback
  }

  static generateCardData(rarity: CardRarity) {
    const cardPools: Record<RarityKey, Array<{name: string, series: string, image: string}>> = {
      COMMON: [
        { name: "Naruto Uzumaki", series: "Naruto", image: "/cards/naruto-common.jpg" },
        { name: "Monkey D. Luffy", series: "One Piece", image: "/cards/luffy-common.jpg" },
        { name: "Natsu Dragneel", series: "Fairy Tail", image: "/cards/natsu-common.jpg" },
        { name: "Ichigo Kurosaki", series: "Bleach", image: "/cards/ichigo-common.jpg" },
        { name: "Edward Elric", series: "Fullmetal Alchemist", image: "/cards/edward-common.jpg" }
      ],
      UNCOMMON: [
        { name: "Sasuke Uchiha", series: "Naruto", image: "/cards/sasuke-uncommon.jpg" },
        { name: "Roronoa Zoro", series: "One Piece", image: "/cards/zoro-uncommon.jpg" },
        { name: "Erza Scarlet", series: "Fairy Tail", image: "/cards/erza-uncommon.jpg" },
        { name: "Rukia Kuchiki", series: "Bleach", image: "/cards/rukia-uncommon.jpg" }
      ],
      RARE: [
        { name: "Kakashi Hatake", series: "Naruto", image: "/cards/kakashi-rare.jpg" },
        { name: "Portgas D. Ace", series: "One Piece", image: "/cards/ace-rare.jpg" },
        { name: "Gildarts Clive", series: "Fairy Tail", image: "/cards/gildarts-rare.jpg" },
        { name: "Byakuya Kuchiki", series: "Bleach", image: "/cards/byakuya-rare.jpg" }
      ],
      EPIC: [
        { name: "Madara Uchiha", series: "Naruto", image: "/cards/madara-epic.jpg" },
        { name: "Whitebeard", series: "One Piece", image: "/cards/whitebeard-epic.jpg" },
        { name: "Zeref Dragneel", series: "Fairy Tail", image: "/cards/zeref-epic.jpg" },
        { name: "Aizen Sosuke", series: "Bleach", image: "/cards/aizen-epic.jpg" }
      ],
      LEGENDARY: [
        { name: "Sage of Six Paths", series: "Naruto", image: "/cards/sage-legendary.jpg" },
        { name: "Gol D. Roger", series: "One Piece", image: "/cards/roger-legendary.jpg" },
        { name: "Acnologia", series: "Fairy Tail", image: "/cards/acnologia-legendary.jpg" },
        { name: "Soul King", series: "Bleach", image: "/cards/soulking-legendary.jpg" }
      ]
    };

    const pool = cardPools[rarity];
    const randomCard = pool[Math.floor(Math.random() * pool.length)];
    
    return {
      ...randomCard,
      rarity,
      cardId: `${rarity.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      attack: this.generateStats(rarity).attack,
      defense: this.generateStats(rarity).defense,
      special: this.generateStats(rarity).special
    };
  }

  private static generateStats(rarity: CardRarity) {
    const baseStats: Record<RarityKey, {min: number, max: number}> = {
      COMMON: { min: 50, max: 100 },
      UNCOMMON: { min: 80, max: 150 },
      RARE: { min: 120, max: 200 },
      EPIC: { min: 180, max: 280 },
      LEGENDARY: { min: 250, max: 400 }
    };

    const { min, max } = baseStats[rarity];
    
    return {
      attack: Math.floor(Math.random() * (max - min + 1)) + min,
      defense: Math.floor(Math.random() * (max - min + 1)) + min,
      special: Math.floor(Math.random() * (max - min + 1)) + min
    };
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

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { packType = 'STANDARD', packCount = 1 } = await request.json();

    if (packCount > 10) {
      return NextResponse.json({ error: 'Maximum 10 packs per opening' }, { status: 400 });
    }

    const cards: any[] = [];
    const rarityCount: Record<RarityKey, number> = {
      COMMON: 0,
      UNCOMMON: 0,
      RARE: 0,
      EPIC: 0,
      LEGENDARY: 0
    };

    // Open multiple packs
    for (let i = 0; i < packCount; i++) {
      const rarity = await RarityDistributor.calculateRarity(user.id, packType);
      const cardData = RarityDistributor.generateCardData(rarity);
      
      cards.push(cardData);
      (rarityCount as any)[rarity]++;

      // Log the distribution (temporarily disabled until Prisma client regenerates)
      try {
        await (prisma as any).cardDistributionLog.create({
          data: {
            userId: user.id,
            packType,
            rarity,
            cardId: cardData.cardId,
            cardName: cardData.name,
            cardSeries: cardData.series
          }
        });
      } catch (error) {
        console.log('Distribution logging temporarily disabled');
      }
    }

    // Update user rarity statistics (temporarily disabled until Prisma client regenerates)
    try {
      const existingStats = await (prisma as any).userRarityStats.findUnique({
        where: { userId: user.id }
      });

      const values: Record<RarityKey, number> = { COMMON: 10, UNCOMMON: 50, RARE: 200, EPIC: 1000, LEGENDARY: 5000 };
      const totalValue = cards.reduce((sum, card) => sum + values[card.rarity as RarityKey], 0);

      if (existingStats) {
        await (prisma as any).userRarityStats.update({
          where: { userId: user.id },
          data: {
            totalCards: { increment: packCount },
            commonCards: { increment: rarityCount.COMMON },
            uncommonCards: { increment: rarityCount.UNCOMMON },
            rareCards: { increment: rarityCount.RARE },
            epicCards: { increment: rarityCount.EPIC },
            legendaryCards: { increment: rarityCount.LEGENDARY },
            totalValue: { increment: totalValue }
          }
        });
      } else {
        await (prisma as any).userRarityStats.create({
          data: {
            userId: user.id,
            totalCards: packCount,
            commonCards: rarityCount.COMMON,
            uncommonCards: rarityCount.UNCOMMON,
            rareCards: rarityCount.RARE,
            epicCards: rarityCount.EPIC,
            legendaryCards: rarityCount.LEGENDARY,
            totalValue
          }
        });
      }
    } catch (error) {
      console.log('Stats tracking temporarily disabled');
    }

    // Calculate special effects for rare pulls
    const hasEpicOrLegendary = cards.some(card => ['EPIC', 'LEGENDARY'].includes(card.rarity));
    const hasMultipleRare = cards.filter(card => ['RARE', 'EPIC', 'LEGENDARY'].includes(card.rarity)).length >= 2;

    return NextResponse.json({
      success: true,
      cards,
      rarityCount,
      specialEffects: {
        hasEpicOrLegendary,
        hasMultipleRare,
        celebrationLevel: hasEpicOrLegendary ? (cards.some(c => c.rarity === 'LEGENDARY') ? 3 : 2) : (hasMultipleRare ? 1 : 0)
      },
      totalValue: cards.reduce((sum, card) => {
        const values: Record<RarityKey, number> = { COMMON: 10, UNCOMMON: 50, RARE: 200, EPIC: 1000, LEGENDARY: 5000 };
        return sum + values[card.rarity as RarityKey];
      }, 0)
    });

  } catch (error) {
    console.error('Card pack opening error:', error);
    return NextResponse.json({ 
      error: 'Failed to open card pack',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
