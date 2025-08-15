import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Get user from NextAuth session
async function getUserFromSession() {
  try {
    const session = await getServerSession(authOptions);
    return session?.user || null;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

// GET - Admin istatistiklerini getir
export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getUserFromSession();

    if (!sessionUser?.id) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekli" },
        { status: 401 }
      );
    }

    // Admin yetkisi kontrol et
    const user = await db.user.findUnique({
      where: { id: sessionUser.id },
      select: { role: true },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Bu işlem için admin yetkisi gerekli" },
        { status: 403 }
      );
    }

    // İstatistikleri topla
    const [
      totalUsers,
      totalQuestions,
      totalCategories,
      totalChallenges,
      activeUsers,
      recentTransactions,
    ] = await Promise.all([
      // Toplam kullanıcı sayısı
      db.user.count(),

      // Toplam öğrenme aktivitesi sayısı (questions equivalent)
      db.learningActivity.count(),

      // Toplam kategori sayısı
      db.category.count(),

      // Toplam challenge sayısı
      db.weeklyChallenge.count(),

      // Son 24 saatte aktif olan kullanıcılar
      db.user.count({
        where: {
          lastLoginDate: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Son işlemler
      db.diamondTransaction.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      }),
    ]);

    // Convert recent transactions to activities format
    const recentActivities = recentTransactions.map((tx, index) => ({
      id: tx.id,
      type: tx.type,
      description: `${tx.description} (${tx.amount} diamonds)`,
      timestamp: tx.createdAt.toISOString(),
      user: tx.user.username,
    }));

    // Return data in expected frontend format
    const stats = {
      totalUsers,
      totalQuestions,
      totalCategories,
      totalChallenges,
      activeUsers,
      pendingReviews: 0, // Mock value for now
      systemHealth: "good" as const,
      recentActivities,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "İstatistikler getirilirken hata oluştu" },
      { status: 500 }
    );
  }
}
