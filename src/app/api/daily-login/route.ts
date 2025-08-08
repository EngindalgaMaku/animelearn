import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface AuthUser {
  userId: string;
  username: string;
}

function getUserFromToken(request: NextRequest): AuthUser | null {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Günlük giriş ödül tablosu (7 günlük cycle)
const DEFAULT_LOGIN_REWARDS = [
  { day: 1, diamondReward: 10, experienceReward: 0, isSpecial: false },
  { day: 2, diamondReward: 0, experienceReward: 50, isSpecial: false },
  { day: 3, diamondReward: 15, experienceReward: 0, isSpecial: false },
  { day: 4, diamondReward: 20, experienceReward: 75, isSpecial: false },
  { day: 5, diamondReward: 25, experienceReward: 0, isSpecial: false },
  { day: 6, diamondReward: 0, experienceReward: 100, isSpecial: false },
  { day: 7, diamondReward: 50, experienceReward: 0, isSpecial: true },
];

// GET - Kullanıcının günlük giriş durumunu getir
export async function GET(req: NextRequest) {
  try {
    const authUser = getUserFromToken(req);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Bugünün tarihini al
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Kullanıcının günlük giriş bilgilerini al veya oluştur
    let userDailyLogin = await prisma.userDailyLogin.findUnique({
      where: { userId: authUser.userId },
    });

    if (!userDailyLogin) {
      // İlk defa giriş yapıyor
      userDailyLogin = await prisma.userDailyLogin.create({
        data: {
          userId: authUser.userId,
          consecutiveDays: 0,
          lastLoginDate: null,
          cycleStartDate: todayStart,
          totalDiamondsEarned: 0,
          totalXPEarned: 0,
          packsEarned: 0,
        },
      });
    }

    // Günlük giriş ödüllerini getir veya oluştur
    let loginBonuses = await prisma.dailyLoginBonus.findMany({
      orderBy: { day: "asc" },
    });

    if (loginBonuses.length === 0) {
      // Varsayılan ödülleri oluştur
      const bonusPromises = DEFAULT_LOGIN_REWARDS.map(reward =>
        prisma.dailyLoginBonus.create({
          data: {
            day: reward.day,
            diamondReward: reward.diamondReward,
            experienceReward: reward.experienceReward,
            isSpecial: reward.isSpecial,
          },
        })
      );
      
      loginBonuses = await Promise.all(bonusPromises);
    }

    // Bugün claim edildi mi kontrol et
    const lastLoginDate = userDailyLogin.lastLoginDate ? new Date(userDailyLogin.lastLoginDate) : null;
    const canClaimToday = !lastLoginDate || lastLoginDate.getTime() < todayStart.getTime();

    // Streak durumunu hesapla
    let streakStatus = "active";
    if (!lastLoginDate) {
      streakStatus = "new";
    } else {
      const yesterday = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
      if (lastLoginDate.getTime() < yesterday.getTime()) {
        streakStatus = "broken";
      } else if (lastLoginDate.getTime() === todayStart.getTime()) {
        streakStatus = "claimed_today";
      }
    }

    // Mevcut günü hesapla (consecutiveDays % 7 + 1)
    const currentDay = (userDailyLogin.consecutiveDays % 7) + 1;
    
    // Bugünün ödülünü hesapla
    const todayReward = loginBonuses.find(bonus => bonus.day === currentDay);

    // Sonraki 7 günün ödüllerini göster
    const upcomingRewards = [];
    for (let i = 0; i < 7; i++) {
      const dayNumber = ((currentDay - 1 + i) % 7) + 1;
      const reward = loginBonuses.find(bonus => bonus.day === dayNumber);
      upcomingRewards.push({
        day: i + 1,
        cycleDay: dayNumber,
        reward: reward || null,
        isClaimed: i === 0 && !canClaimToday,
        isToday: i === 0,
      });
    }

    return NextResponse.json({
      success: true,
      loginStatus: {
        currentDay: currentDay,
        consecutiveDays: userDailyLogin.consecutiveDays,
        lastLoginDate: userDailyLogin.lastLoginDate,
        canClaimToday,
        streakStatus,
      },
      todayReward,
      upcomingRewards,
      stats: {
        totalDiamondsEarned: userDailyLogin.totalDiamondsEarned,
        totalXPEarned: userDailyLogin.totalXPEarned,
        packsEarned: userDailyLogin.packsEarned,
        cycleStartDate: userDailyLogin.cycleStartDate,
      },
    });

  } catch (error) {
    console.error("Error fetching daily login status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Günlük giriş bonusunu claim et
export async function POST(req: NextRequest) {
  try {
    const authUser = getUserFromToken(req);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterday = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);

    // Kullanıcının günlük giriş bilgilerini al
    let userDailyLogin = await prisma.userDailyLogin.findUnique({
      where: { userId: authUser.userId },
    });

    if (!userDailyLogin) {
      return NextResponse.json({ error: "Daily login record not found" }, { status: 404 });
    }

    // Bugün claim edildi mi kontrol et
    const lastLoginDate = userDailyLogin.lastLoginDate ? new Date(userDailyLogin.lastLoginDate) : null;
    if (lastLoginDate && lastLoginDate.getTime() >= todayStart.getTime()) {
      return NextResponse.json({
        error: "Bugün zaten günlük bonus aldınız"
      }, { status: 400 });
    }

    // Mevcut günü hesapla
    const currentDay = (userDailyLogin.consecutiveDays % 7) + 1;
    
    // Bugünün ödülünü al
    const todayReward = await prisma.dailyLoginBonus.findUnique({
      where: { day: currentDay },
    });

    if (!todayReward) {
      return NextResponse.json({ error: "Today's reward not found" }, { status: 404 });
    }

    // Streak durumunu kontrol et
    let newConsecutiveDays = userDailyLogin.consecutiveDays;

    if (!lastLoginDate || lastLoginDate.getTime() < yesterday.getTime()) {
      // Streak kopmuş, yeniden başla
      newConsecutiveDays = 1;
    } else if (lastLoginDate.getTime() === yesterday.getTime()) {
      // Streak devam ediyor
      newConsecutiveDays = userDailyLogin.consecutiveDays + 1;
    }

    // Ödülleri kullanıcıya ver
    let diamondsToAdd = 0;
    let experienceToAdd = 0;
    let cardPacksToAdd = 0;

    if (todayReward.diamondReward) {
      diamondsToAdd = todayReward.diamondReward;
    }
    if (todayReward.experienceReward) {
      experienceToAdd = todayReward.experienceReward;
    }
    if (todayReward.cardPackId) {
      cardPacksToAdd = 1;
    }

    // Bonus streak ödülü (her 7 günde bir extra)
    if (newConsecutiveDays > 0 && newConsecutiveDays % 7 === 0) {
      diamondsToAdd += 25; // Bonus diamond
      experienceToAdd += 50; // Bonus experience
    }

    // Database transaction
    await prisma.$transaction(async (tx) => {
      // Kullanıcı ödüllerini güncelle
      await tx.user.update({
        where: { id: authUser.userId },
        data: {
          currentDiamonds: { increment: diamondsToAdd },
          totalDiamonds: { increment: diamondsToAdd },
          experience: { increment: experienceToAdd },
        },
      });

      // Daily login durumunu güncelle
      await tx.userDailyLogin.update({
        where: { userId: authUser.userId },
        data: {
          consecutiveDays: newConsecutiveDays,
          lastLoginDate: todayStart,
          totalDiamondsEarned: { increment: diamondsToAdd },
          totalXPEarned: { increment: experienceToAdd },
          packsEarned: { increment: cardPacksToAdd },
        },
      });

      // Diamond transaction kaydet
      if (diamondsToAdd > 0) {
        await tx.diamondTransaction.create({
          data: {
            userId: authUser.userId,
            amount: diamondsToAdd,
            type: "DAILY_LOGIN",
            description: `Günlük giriş bonusu - Gün ${currentDay}`,
            relatedType: "daily_login",
            relatedId: currentDay.toString(),
          },
        });
      }

      // Eğer card pack ödülü varsa, card pack oluştur veya mevcut birini ver
      if (cardPacksToAdd > 0) {
        // Basit bir card pack oluştur veya varsayılan birini ver
        const defaultCardPack = await tx.cardPack.findFirst({
          where: { packType: "daily_login" },
        });

        if (defaultCardPack) {
          await tx.cardPackOpening.create({
            data: {
              userId: authUser.userId,
              packId: defaultCardPack.id,
              cardsReceived: "[]", // Boş kart listesi, sonra pack açılacak
              sourceType: "daily_login",
              sourceId: `day_${currentDay}`,
            },
          });
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Günlük giriş bonusu alındı! Gün ${currentDay}`,
      rewards: {
        diamonds: diamondsToAdd,
        experience: experienceToAdd,
        cardPacks: cardPacksToAdd,
        streakBonus: newConsecutiveDays > 0 && newConsecutiveDays % 7 === 0,
      },
      newStatus: {
        currentDay: (newConsecutiveDays % 7) + 1,
        consecutiveDays: newConsecutiveDays,
      },
    });

  } catch (error) {
    console.error("Error claiming daily login bonus:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
