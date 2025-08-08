import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        dailyLogin: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Get or create user daily login record
    let userDailyLogin = await prisma.userDailyLogin.findUnique({
      where: { userId: user.id }
    });

    if (!userDailyLogin) {
      userDailyLogin = await prisma.userDailyLogin.create({
        data: {
          userId: user.id,
          consecutiveDays: 0,
          lastLoginDate: null,
          cycleStartDate: today,
          totalDiamondsEarned: 0,
          totalXPEarned: 0,
          packsEarned: 0
        }
      });
    }

    // Check if user already claimed today
    const lastLoginDate = userDailyLogin.lastLoginDate;
    if (lastLoginDate) {
      const lastLoginDay = new Date(lastLoginDate.getFullYear(), lastLoginDate.getMonth(), lastLoginDate.getDate());
      if (lastLoginDay.getTime() === today.getTime()) {
        return NextResponse.json({ 
          error: 'Already claimed today',
          alreadyClaimed: true,
          nextClaimIn: getTimeUntilNextClaim()
        }, { status: 400 });
      }
    }

    // Calculate new streak
    let newStreak = 1;
    if (lastLoginDate) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastLoginDay = new Date(lastLoginDate.getFullYear(), lastLoginDate.getMonth(), lastLoginDate.getDate());
      
      if (lastLoginDay.getTime() === yesterday.getTime()) {
        // Consecutive day
        newStreak = userDailyLogin.consecutiveDays + 1;
      }
      // If gap is more than 1 day, streak resets to 1
    }

    // Reset cycle if needed (after 7 days or streak break)
    if (newStreak > 7 || (lastLoginDate && userDailyLogin.consecutiveDays === 7)) {
      newStreak = 1;
    }

    // Get daily login bonus for this day
    const dailyBonus = await prisma.dailyLoginBonus.findUnique({
      where: { day: newStreak },
      include: { cardPack: true }
    });

    if (!dailyBonus) {
      return NextResponse.json({ error: 'No bonus configured for this day' }, { status: 500 });
    }

    // Award rewards in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update user daily login
      const updatedUserDailyLogin = await tx.userDailyLogin.update({
        where: { userId: user.id },
        data: {
          consecutiveDays: newStreak,
          lastLoginDate: now,
          totalDiamondsEarned: userDailyLogin.totalDiamondsEarned + dailyBonus.diamondReward,
          totalXPEarned: userDailyLogin.totalXPEarned + dailyBonus.experienceReward,
          packsEarned: dailyBonus.cardPackId ? userDailyLogin.packsEarned + 1 : userDailyLogin.packsEarned,
          cycleStartDate: newStreak === 1 ? today : userDailyLogin.cycleStartDate
        }
      });

      // Update user stats
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          currentDiamonds: user.currentDiamonds + dailyBonus.diamondReward,
          totalDiamonds: user.totalDiamonds + dailyBonus.diamondReward,
          experience: user.experience + dailyBonus.experienceReward,
          loginStreak: newStreak,
          maxLoginStreak: Math.max(user.maxLoginStreak, newStreak),
          lastLoginDate: now
        }
      });

      // Create diamond transaction record
      await tx.diamondTransaction.create({
        data: {
          userId: user.id,
          amount: dailyBonus.diamondReward,
          type: 'DAILY_LOGIN',
          description: `Daily Login Reward Day ${newStreak}`,
          relatedType: 'DAILY_LOGIN',
          relatedId: dailyBonus.id
        }
      });

      // Handle card pack reward
      let cardPackOpening = null;
      let cardsReceived = [];
      
      if (dailyBonus.cardPackId && dailyBonus.cardPack) {
        // Generate cards based on pack type
        cardsReceived = await generateCardsFromPack(dailyBonus.cardPack, tx);
        
        // Create pack opening record
        cardPackOpening = await tx.cardPackOpening.create({
          data: {
            userId: user.id,
            packId: dailyBonus.cardPackId,
            cardsReceived: JSON.stringify(cardsReceived.map(card => card.id)),
            sourceType: 'DAILY_LOGIN',
            sourceId: dailyBonus.id
          }
        });

        // Award cards to user
        for (const card of cardsReceived) {
          await tx.userCard.upsert({
            where: {
              userId_cardId: {
                userId: user.id,
                cardId: card.id
              }
            },
            update: {},
            create: {
              userId: user.id,
              cardId: card.id,
              purchasePrice: 0,
              purchaseDate: now
            }
          });
        }
      }

      return {
        user: updatedUser,
        dailyLogin: updatedUserDailyLogin,
        bonus: dailyBonus,
        cardPackOpening,
        cardsReceived
      };
    });

    return NextResponse.json({
      success: true,
      streakDay: newStreak,
      rewards: {
        diamonds: dailyBonus.diamondReward,
        experience: dailyBonus.experienceReward,
        cardPack: dailyBonus.cardPack,
        cardsReceived: result.cardsReceived,
        specialReward: dailyBonus.specialReward
      },
      user: {
        currentDiamonds: result.user.currentDiamonds,
        experience: result.user.experience,
        loginStreak: result.user.loginStreak
      },
      cardPackOpeningId: result.cardPackOpening?.id,
      nextRewardPreview: await getNextRewardPreview(newStreak + 1),
      celebrationType: getCelebrationType(newStreak, dailyBonus)
    });

  } catch (error) {
    console.error('Daily login reward error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        dailyLogin: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let canClaim = true;
    let nextClaimIn = 0;
    let currentStreak = 0;

    if (user.dailyLogin?.lastLoginDate) {
      const lastLoginDay = new Date(
        user.dailyLogin.lastLoginDate.getFullYear(), 
        user.dailyLogin.lastLoginDate.getMonth(), 
        user.dailyLogin.lastLoginDate.getDate()
      );
      
      if (lastLoginDay.getTime() === today.getTime()) {
        canClaim = false;
        nextClaimIn = getTimeUntilNextClaim();
      }
      
      currentStreak = user.dailyLogin.consecutiveDays;
    }

    // Get all daily bonuses for preview
    const allBonuses = await prisma.dailyLoginBonus.findMany({
      orderBy: { day: 'asc' },
      include: { cardPack: true }
    });

    // Predict next streak day
    const nextStreakDay = canClaim ? 
      (currentStreak >= 7 ? 1 : currentStreak + 1) : 
      (currentStreak >= 7 ? 1 : currentStreak);

    return NextResponse.json({
      canClaim,
      nextClaimIn,
      currentStreak,
      nextStreakDay,
      totalStats: {
        totalDiamondsEarned: user.dailyLogin?.totalDiamondsEarned || 0,
        totalXPEarned: user.dailyLogin?.totalXPEarned || 0,
        packsEarned: user.dailyLogin?.packsEarned || 0,
        maxStreak: user.maxLoginStreak
      },
      bonusPreview: allBonuses,
      nextReward: allBonuses.find(b => b.day === nextStreakDay)
    });

  } catch (error) {
    console.error('Daily login status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions
function getTimeUntilNextClaim(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime() - now.getTime();
}

async function getNextRewardPreview(day: number) {
  const nextDay = day > 7 ? 1 : day;
  return await prisma.dailyLoginBonus.findUnique({
    where: { day: nextDay },
    include: { cardPack: true }
  });
}

function getCelebrationType(streakDay: number, bonus: any): string {
  if (bonus.isSpecial) return 'special';
  if (streakDay === 7) return 'weekly';
  if (bonus.cardPackId) return 'pack';
  if (bonus.diamondReward >= 50) return 'big';
  return 'normal';
}

async function generateCardsFromPack(cardPack: any, tx: any) {
  // Get available cards based on pack rarity requirements
  const whereClause: any = {
    isPublic: true,
    isPurchasable: true
  };

  // Apply rarity filter if pack has guaranteed rarity
  if (cardPack.guaranteedRarity) {
    whereClause.rarity = cardPack.guaranteedRarity;
  }

  const availableCards = await tx.card.findMany({
    where: whereClause,
    take: cardPack.cardCount * 3 // Get more cards to randomize selection
  });

  if (availableCards.length === 0) {
    throw new Error('No cards available for this pack type');
  }

  // Randomly select cards
  const selectedCards = [];
  const cardCount = Math.min(cardPack.cardCount, availableCards.length);
  
  for (let i = 0; i < cardCount; i++) {
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const selectedCard = availableCards.splice(randomIndex, 1)[0];
    selectedCards.push(selectedCard);
  }

  return selectedCards;
}