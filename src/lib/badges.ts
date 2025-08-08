import { prisma } from "@/lib/prisma";

// Rozet koşulunu kontrol et
async function checkBadgeCondition(
  userId: string,
  condition: string
): Promise<boolean> {
  try {
    const conditionObj = JSON.parse(condition);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userCards: true,
        codeArenaProgress: { where: { isCompleted: true } },
        quizAttempts: { where: { isCompleted: true } },
        diamondTransactions: true,
      },
    });

    if (!user) return false;

    switch (conditionObj.type) {
      case "lessons_completed":
        return user.codeArenasCompleted >= conditionObj.target;

      case "quizzes_completed":
        return user.quizzesCompleted >= conditionObj.target;

      case "cards_owned":
        return user.userCards.length >= conditionObj.target;

      case "login_streak":
        return user.loginStreak >= conditionObj.target;

      case "level_reached":
        return user.level >= conditionObj.target;

      case "diamonds_earned":
        return user.totalDiamonds >= conditionObj.target;

      case "code_submissions":
        return user.codeSubmissionCount >= conditionObj.target;

      case "rare_cards":
        const rareCards = user.userCards.filter(
          (_uc: any) =>
            // Bu bilgiyi almak için Card tablosunu join etmek gerekir
            // Şimdilik basit kontrol
            true
        );
        return rareCards.length >= conditionObj.target;

      case "first_lesson":
        return user.codeArenaProgress.length > 0;

      case "perfect_score":
        // Mükemmel skor kontrolü
        const perfectLessons = user.codeArenaProgress.filter(
          (cap: any) => cap.score === 100
        );
        return perfectLessons.length >= conditionObj.target;

      default:
        return false;
    }
  } catch (error) {
    console.error("Badge condition check error:", error);
    return false;
  }
}

// Kullanıcının yeni rozetlerini kontrol et ve ver
export async function checkAndAwardBadges(userId: string): Promise<any[]> {
  const newBadges = [];

  try {
    // Aktif tüm rozetleri getir
    const allBadges = await prisma.badge.findMany({
      where: { isActive: true },
    });

    // Kullanıcının mevcut rozetlerini getir
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      select: { badgeId: true },
    });

    const userBadgeIds = new Set(userBadges.map((ub: any) => ub.badgeId));

    // Her rozet için kontrol yap
    for (const badge of allBadges) {
      // Kullanıcı zaten bu rozete sahip mi?
      if (userBadgeIds.has(badge.id)) continue;

      // Koşulu kontrol et
      const conditionMet = await checkBadgeCondition(userId, badge.condition);

      if (conditionMet) {
        // Rozeti kullanıcıya ver
        const userBadge = await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
          },
          include: {
            badge: true,
          },
        });

        // Badge totalEarned sayısını artır
        await prisma.badge.update({
          where: { id: badge.id },
          data: { totalEarned: { increment: 1 } },
        });

        newBadges.push(userBadge);
      }
    }
  } catch (error) {
    console.error("Check and award badges error:", error);
  }

  return newBadges;
}
