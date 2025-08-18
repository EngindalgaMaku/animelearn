import { prisma } from "@/lib/prisma";
import { recomputeAllBadges } from "@/lib/achievements-engine";

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
        activityAttempts: { where: { completed: true } },
        quizAttempts: { where: { isCompleted: true } },
        diamondTransactions: true,
      },
    });

    if (!user) return false;

    switch (conditionObj.type) {
      case "lessons_completed":
        return (
          user.activityAttempts.filter((a: any) => a.completed).length >=
          conditionObj.target
        );

      case "quizzes_completed":
        return user.quizzesCompleted >= conditionObj.target;

      case "quiz_streak":
        // Quiz streak kontrolü - kullanıcının en yüksek quiz streak'i
        const quizAttempts = user.quizAttempts.filter(
          (qa: any) => qa.isCompleted
        );
        if (quizAttempts.length === 0) return false;

        // En yüksek streak'i bul
        let maxStreak = 0;
        let currentStreak = 0;

        // Quiz attempts'leri tarihe göre sırala
        const sortedAttempts = quizAttempts.sort(
          (a: any, b: any) =>
            new Date(a.completedAt).getTime() -
            new Date(b.completedAt).getTime()
        );

        for (const attempt of sortedAttempts) {
          // Quiz Arena streak'i - her doğru cevap streak'i artırır, yanlış streak'i sıfırlar
          const answers = JSON.parse(attempt.answers || "[]");
          for (const answer of answers) {
            if (answer.isCorrect) {
              currentStreak++;
              maxStreak = Math.max(maxStreak, currentStreak);
            } else {
              currentStreak = 0;
              break; // Bu quiz'de yanlış cevap verildi, streak bitti
            }
          }
        }

        return maxStreak >= conditionObj.target;

      case "perfect_quizzes":
        // Perfect quiz sayısı kontrolü (hiç yanlış cevap vermeden tamamlanan quiz'ler)
        const perfectQuizzes = user.quizAttempts.filter((qa: any) => {
          if (!qa.isCompleted) return false;
          const answers = JSON.parse(qa.answers || "[]");
          return (
            answers.length > 0 &&
            answers.every((answer: any) => answer.isCorrect)
          );
        });
        return perfectQuizzes.length >= conditionObj.target;

      case "fast_answers":
        // Hızlı cevap kontrolü (5 saniyeden az sürede verilen doğru cevaplar)
        let fastAnswerCount = 0;
        for (const attempt of user.quizAttempts) {
          if (!attempt.isCompleted) continue;
          const answers = JSON.parse(attempt.answers || "[]");
          for (const answer of answers) {
            if (
              answer.isCorrect &&
              answer.timeSpent &&
              answer.timeSpent < 5000
            ) {
              fastAnswerCount++;
            }
          }
        }
        return fastAnswerCount >= conditionObj.target;

      case "daily_quiz_sessions":
        // Günlük quiz oturumu kontrolü (aynı gün içinde tamamlanan quiz sayısı)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayQuizzes = user.quizAttempts.filter((qa: any) => {
          if (!qa.isCompleted) return false;
          const completedAt = new Date(qa.completedAt);
          return completedAt >= today && completedAt < tomorrow;
        });
        return todayQuizzes.length >= conditionObj.target;

      case "comeback_streak":
        // Geri dönüş streak'i kontrolü (hata yaptıktan sonra art arda doğru cevaplar)
        let maxComebackStreak = 0;
        for (const attempt of user.quizAttempts) {
          if (!attempt.isCompleted) continue;
          const answers = JSON.parse(attempt.answers || "[]");
          let hadMistake = false;
          let currentComebackStreak = 0;

          for (const answer of answers) {
            if (!answer.isCorrect) {
              hadMistake = true;
              currentComebackStreak = 0;
            } else if (hadMistake) {
              currentComebackStreak++;
              maxComebackStreak = Math.max(
                maxComebackStreak,
                currentComebackStreak
              );
            }
          }
        }
        return maxComebackStreak >= conditionObj.target;

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
        return user.activityAttempts.length > 0;

      case "perfect_score":
        // Mükemmel skor kontrolü
        const perfectLessons = user.activityAttempts.filter(
          (attempt: any) => attempt.score === 100
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

/**
 * Kullanıcının rozet ilerlemelerini kurallara göre yeniden hesaplar ve
 * tamamlananları ödüllendirir. Eski 'condition' tabanlı rozetler için
 * geriye dönük uyumluluk sağlanır.
 */
export async function checkAndAwardBadges(userId: string): Promise<any[]> {
  try {
    // 1) Yeni BadgeRule tabanlı motoru çalıştır
    const { newlyCompletedBadgeIds } = await recomputeAllBadges(userId, {
      awardOnComplete: true,
    });

    // 2) Geriye dönük uyumluluk: 'condition' string'ine sahip, fakat kural tanımı olmayan rozetleri kontrol et
    const legacyBadges = await prisma.badge.findMany({
      where: {
        isActive: true,
        // BadgeRule ilişkisi olmayan (veya boş) rozetler için basic condition kontrolü
        // Prisma tarafında direkt "empty relation" filtrelemek zor olduğundan basit yaklaşım:
      },
    });

    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      select: { badgeId: true },
    });
    const userBadgeIds = new Set(userBadges.map((ub: any) => ub.badgeId));

    const legacyNewIds: string[] = [];
    for (const badge of legacyBadges) {
      if (!badge.condition) continue; // condition yoksa atla
      if (userBadgeIds.has(badge.id)) continue; // zaten alınmış

      const met = await checkBadgeCondition(userId, badge.condition);
      if (met) {
        await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
            isUnlocked: true,
            isCompleted: true,
            earnedAt: new Date(),
            unlockedAt: new Date(),
            progress: 100,
          },
        });
        await prisma.badge.update({
          where: { id: badge.id },
          data: { totalEarned: { increment: 1 } },
        });
        legacyNewIds.push(badge.id);
      }
    }

    const allNew = [...newlyCompletedBadgeIds, ...legacyNewIds];
    if (allNew.length === 0) return [];

    // 3) Yeni kazanılan rozet kayıtlarını badge ile birlikte döndür
    const newBadges = await prisma.userBadge.findMany({
      where: { userId, badgeId: { in: allNew } },
      include: { badge: true },
    });

    return newBadges;
  } catch (error) {
    console.error("Check and award badges error:", error);
    return [];
  }
}
