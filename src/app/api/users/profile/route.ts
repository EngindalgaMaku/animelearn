import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface AuthUser {
  userId: string;
  username: string;
}

// Token'dan kullanıcı bilgilerini çıkart
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

// Seviye hesaplama fonksiyonu
function calculateLevel(experience: number): number {
  // Her seviye için gerekli XP = seviye * 100
  return Math.floor(experience / 100) + 1;
}

// Sonraki seviye için gerekli XP
function getXpForNextLevel(level: number): number {
  return level * 100;
}

// Günlük elmas limitini kontrol et
function checkDailyDiamondLimit(user: any): boolean {
  const today = new Date();
  const lastReset = new Date(user.lastDailyReset);

  // Gün değişti mi?
  if (today.toDateString() !== lastReset.toDateString()) {
    return true; // Reset gerekli
  }

  // Günlük limit kontrolü
  let dailyLimit = 300; // Başlangıç limiti
  if (user.level >= 25) dailyLimit = 500;
  else if (user.level >= 10) dailyLimit = 400;

  if (user.isPremium) dailyLimit += 200;

  return user.dailyDiamonds < dailyLimit;
}

// GET - Kullanıcı profil bilgilerini getir
export async function GET(request: NextRequest) {
  try {
    const authUser = getUserFromToken(request);

    if (!authUser) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekli" },
        { status: 401 }
      );
    }

    // Kullanıcı bilgilerini getir (ilişkili verilerle)
    const user = await db.user.findUnique({
      where: { id: authUser.userId },
      include: {
        userCards: {
          include: {
            card: {
              select: {
                id: true,
                name: true,
                cardTitle: true,
                imageUrl: true,
                estimatedValue: true,
                rarity: true,
                diamondPrice: true,
              },
            },
          },
        },
        badges: {
          include: {
            badge: {
              select: {
                id: true,
                name: true,
                title: true,
                description: true,
                icon: true,
                rarity: true,
                color: true,
              },
            },
          },
        },
        dailyQuests: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        },
        diamondTransactions: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        codeArenaProgress: {
          where: { isCompleted: true },
          include: {
            codeArena: {
              select: {
                id: true,
                title: true,
                difficulty: true,
                diamondReward: true,
                experienceReward: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Seviye hesapla
    const currentLevel = calculateLevel(user.experience);
    const nextLevelXp = getXpForNextLevel(currentLevel);
    const currentLevelXp = user.experience - (currentLevel - 1) * 100;
    const xpProgress = (currentLevelXp / 100) * 100; // Yüzde

    // Günlük elmas limiti hesapla
    let dailyLimit = 300;
    if (user.level >= 25) dailyLimit = 500;
    else if (user.level >= 10) dailyLimit = 400;
    if (user.isPremium) dailyLimit += 200;

    // İstatistikleri hesapla
    const totalCardValue = user.userCards.reduce(
      (sum, userCard) => sum + (userCard.card.estimatedValue || 0),
      0
    );

    const stats = {
      totalCards: user.userCards.length,
      totalCardValue: Math.round(totalCardValue),
      completedLessons: user.codeArenaProgress.length,
      completedQuizzes: user.quizzesCompleted,
      codeSubmissions: user.codeSubmissionCount,
      currentStreak: user.loginStreak,
      maxStreak: user.maxLoginStreak,
      totalBadges: user.badges.length,
    };

    // Günlük görev tamamlanma oranı
    const todayQuests = user.dailyQuests;
    const completedQuests = todayQuests.filter((q) => q.isCompleted).length;
    const questCompletionRate =
      todayQuests.length > 0
        ? Math.round((completedQuests / todayQuests.length) * 100)
        : 0;

    // Response data
    const profileData = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      bio: user.bio,

      // Gamifikasyon verileri
      level: currentLevel,
      experience: user.experience,
      xpProgress,
      nextLevelXp,
      currentLevelXp,

      // Elmas sistemi
      currentDiamonds: user.currentDiamonds,
      totalDiamonds: user.totalDiamonds,
      dailyDiamonds: user.dailyDiamonds,
      dailyLimit,
      canEarnDiamonds: checkDailyDiamondLimit(user),

      // Premium
      isPremium: user.isPremium,
      premiumExpiresAt: user.premiumExpiresAt,

      // İstatistikler
      stats,
      questCompletionRate,

      // Son aktiviteler
      recentTransactions: user.diamondTransactions,
      recentBadges: user.badges.slice(-5).map((ub) => ({
        ...ub.badge,
        earnedAt: ub.earnedAt,
      })),

      // Hesap bilgileri
      createdAt: user.createdAt,
      lastLoginDate: user.lastLoginDate,
      emailVerified: user.emailVerified,
      isActive: user.isActive,
    };

    return NextResponse.json({
      success: true,
      user: profileData,
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Profil bilgileri getirilirken hata oluştu" },
      { status: 500 }
    );
  }
}

// PUT - Kullanıcı profil bilgilerini güncelle
export async function PUT(request: NextRequest) {
  try {
    const authUser = getUserFromToken(request);

    if (!authUser) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekli" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, bio, avatar, username, currentPassword, newPassword, actionType } = body;

    // Kullanıcıyı al
    const user = await db.user.findUnique({
      where: { id: authUser.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Şifre değişikliği
    if (actionType === "change_password") {
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: "Mevcut şifre ve yeni şifre gerekli" },
          { status: 400 }
        );
      }

      // Mevcut şifreyi doğrula
      let isCurrentPasswordValid = false;
      
      // OAuth kullanıcıları şifre değiştiremez
      if (!user.passwordHash) {
        return NextResponse.json(
          { error: "OAuth ile giriş yapan kullanıcılar şifre değiştiremez" },
          { status: 400 }
        );
      }
      
      if (user.passwordHash.includes(":")) {
        // Node.js crypto format: hash:salt
        const { pbkdf2Sync } = require("crypto");
        const [hash, salt] = user.passwordHash.split(":");
        const computedHash = pbkdf2Sync(currentPassword, salt, 1000, 64, "sha512").toString("hex");
        isCurrentPasswordValid = computedHash === hash;
      } else {
        // bcrypt format
        isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
      }

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: "Mevcut şifre yanlış" },
          { status: 400 }
        );
      }

      // Yeni şifre validasyonu
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "Yeni şifre en az 6 karakter olmalı" },
          { status: 400 }
        );
      }

      // Yeni şifreyi hashle
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Şifreyi güncelle
      await db.user.update({
        where: { id: authUser.userId },
        data: {
          passwordHash: hashedNewPassword,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Şifre başarıyla değiştirildi",
      });
    }

    // Kullanıcı adı değişikliği
    if (actionType === "change_username") {
      if (!username) {
        return NextResponse.json(
          { error: "Yeni kullanıcı adı gerekli" },
          { status: 400 }
        );
      }

      // Username validasyonu
      if (username.length < 3) {
        return NextResponse.json(
          { error: "Kullanıcı adı en az 3 karakter olmalı" },
          { status: 400 }
        );
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return NextResponse.json(
          { error: "Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir" },
          { status: 400 }
        );
      }

      // Kullanıcı adı kullanımda mı kontrol et
      const existingUser = await db.user.findFirst({
        where: {
          username: username,
          id: { not: authUser.userId }
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Bu kullanıcı adı zaten kullanılıyor" },
          { status: 400 }
        );
      }

      // Kullanıcı adını güncelle
      const updatedUser = await db.user.update({
        where: { id: authUser.userId },
        data: {
          username: username,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          bio: true,
          avatar: true,
          level: true,
          experience: true,
          currentDiamonds: true,
          totalDiamonds: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Kullanıcı adı başarıyla değiştirildi",
        user: updatedUser,
      });
    }

    // Normal profil güncelleme
    const updateData: any = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar !== undefined) updateData.avatar = avatar;

    // Kullanıcıyı güncelle
    const updatedUser = await db.user.update({
      where: { id: authUser.userId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        bio: true,
        avatar: true,
        level: true,
        experience: true,
        currentDiamonds: true,
        totalDiamonds: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profil başarıyla güncellendi",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json(
      { error: "Profil güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// POST - Günlük elmas sıfırlama ve diğer işlemler
export async function POST(request: NextRequest) {
  try {
    const authUser = getUserFromToken(request);

    if (!authUser) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekli" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body;

    const user = await db.user.findUnique({
      where: { id: authUser.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    switch (action) {
      case "reset_daily_diamonds":
        // Günlük elmas sıfırlama kontrolü
        const today = new Date();
        const lastReset = new Date(user.lastDailyReset);

        if (today.toDateString() !== lastReset.toDateString()) {
          await db.user.update({
            where: { id: authUser.userId },
            data: {
              dailyDiamonds: 0,
              lastDailyReset: today,
            },
          });

          return NextResponse.json({
            success: true,
            message: "Günlük elmas limiti sıfırlandı",
          });
        }

        return NextResponse.json({
          success: false,
          message: "Günlük limit zaten sıfırlanmış",
        });

      case "update_level":
        // Seviye güncelleme
        const newLevel = calculateLevel(user.experience);

        if (newLevel !== user.level) {
          await db.user.update({
            where: { id: authUser.userId },
            data: { level: newLevel },
          });

          // Seviye atlama ödülü
          if (newLevel > user.level) {
            const levelReward = newLevel * 50; // Her seviye için 50 elmas

            await db.user.update({
              where: { id: authUser.userId },
              data: {
                currentDiamonds: { increment: levelReward },
                totalDiamonds: { increment: levelReward },
              },
            });

            // İşlem kaydı
            await db.diamondTransaction.create({
              data: {
                userId: authUser.userId,
                amount: levelReward,
                type: "LEVEL_UP",
                description: `Seviye ${newLevel} ödülü`,
                relatedType: "level",
                relatedId: newLevel.toString(),
              },
            });

            return NextResponse.json({
              success: true,
              message: `Tebrikler! Seviye ${newLevel}'e ulaştınız!`,
              levelReward,
              newLevel,
            });
          }
        }

        return NextResponse.json({
          success: true,
          message: "Seviye kontrol edildi",
          currentLevel: newLevel,
        });

      default:
        return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
    }
  } catch (error) {
    console.error("Profile POST error:", error);
    return NextResponse.json(
      { error: "İşlem sırasında hata oluştu" },
      { status: 500 }
    );
  }
}
