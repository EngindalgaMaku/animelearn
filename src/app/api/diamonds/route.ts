import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface AuthUser {
  userId: string;
  username: string;
}

async function getUserFromSession(): Promise<AuthUser | null> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      return {
        userId: session.user.id as string,
        username:
          (session.user as any).username ||
          (session.user.email as string) ||
          "Unknown",
      };
    }
    return null;
  } catch {
    return null;
  }
}

// Günlük elmas limitini kontrol et
async function checkDailyLimit(
  userId: string,
  amount: number
): Promise<{
  canEarn: boolean;
  limitExceeded: boolean;
  newDailyTotal: number;
  limit: number;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("Kullanıcı bulunamadı");
  }

  const today = new Date();
  const lastReset = new Date(user.lastDailyReset);

  let currentDailyDiamonds = user.dailyDiamonds;

  // Gün değişti mi? Sıfırla
  if (today.toDateString() !== lastReset.toDateString()) {
    currentDailyDiamonds = 0;
    await prisma.user.update({
      where: { id: userId },
      data: {
        dailyDiamonds: 0,
        lastDailyReset: today,
      },
    });
  }

  // Günlük limit hesapla
  let dailyLimit = 300; // Başlangıç limiti
  if (user.level >= 25) dailyLimit = 500;
  else if (user.level >= 10) dailyLimit = 400;

  if (user.isPremium) dailyLimit += 200;

  const newDailyTotal = currentDailyDiamonds + amount;
  const canEarn = newDailyTotal <= dailyLimit;
  const limitExceeded = newDailyTotal > dailyLimit;

  return {
    canEarn,
    limitExceeded,
    newDailyTotal: canEarn ? newDailyTotal : currentDailyDiamonds,
    limit: dailyLimit,
  };
}

// GET - Elmas bakiyesi ve işlem geçmişi
export async function GET(request: NextRequest) {
  try {
    const authUser = await getUserFromSession();

    if (!authUser) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekli" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    if (action === "balance") {
      // Sadece bakiye bilgisi
      const user = await prisma.user.findUnique({
        where: { id: authUser.userId },
        select: {
          currentDiamonds: true,
          totalDiamonds: true,
          dailyDiamonds: true,
          level: true,
          isPremium: true,
          lastDailyReset: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Kullanıcı bulunamadı" },
          { status: 404 }
        );
      }

      // Günlük limit hesapla
      let dailyLimit = 300;
      if (user.level >= 25) dailyLimit = 500;
      else if (user.level >= 10) dailyLimit = 400;
      if (user.isPremium) dailyLimit += 200;

      // Günlük reset kontrol
      const today = new Date();
      const lastReset = new Date(user.lastDailyReset);
      const needsReset = today.toDateString() !== lastReset.toDateString();

      return NextResponse.json({
        success: true,
        balance: {
          current: user.currentDiamonds,
          total: user.totalDiamonds,
          daily: needsReset ? 0 : user.dailyDiamonds,
          dailyLimit,
          canEarn: needsReset || user.dailyDiamonds < dailyLimit,
        },
      });
    }

    // İşlem geçmişi
    const transactions = await prisma.diamondTransaction.findMany({
      where: { userId: authUser.userId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalTransactions = await prisma.diamondTransaction.count({
      where: { userId: authUser.userId },
    });

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        currentDiamonds: true,
        totalDiamonds: true,
        dailyDiamonds: true,
        level: true,
        isPremium: true,
        lastDailyReset: true,
      },
    });

    return NextResponse.json({
      success: true,
      transactions,
      pagination: {
        page,
        limit,
        total: totalTransactions,
        pages: Math.ceil(totalTransactions / limit),
      },
      balance: user
        ? {
            current: user.currentDiamonds,
            total: user.totalDiamonds,
            daily: user.dailyDiamonds,
          }
        : null,
    });
  } catch (error) {
    console.error("Diamonds GET error:", error);
    return NextResponse.json(
      { error: "Elmas bilgileri getirilirken hata oluştu" },
      { status: 500 }
    );
  }
}

// POST - Elmas kazanma/harcama
export async function POST(request: NextRequest) {
  try {
    const authUser = await getUserFromSession();

    if (!authUser) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekli" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, amount, type, description, relatedId, relatedType } = body;

    if (!action || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Geçersiz parametreler" },
        { status: 400 }
      );
    }

    if (action === "earn") {
      // Elmas kazanma
      const limitCheck = await checkDailyLimit(authUser.userId, amount);

      if (!limitCheck.canEarn) {
        return NextResponse.json(
          {
            success: false,
            error: "Günlük elmas limitine ulaştınız",
            limit: limitCheck.limit,
            current: limitCheck.newDailyTotal,
          },
          { status: 400 }
        );
      }

      // Kullanıcıyı güncelle
      const updatedUser = await prisma.user.update({
        where: { id: authUser.userId },
        data: {
          currentDiamonds: { increment: amount },
          totalDiamonds: { increment: amount },
          dailyDiamonds: limitCheck.newDailyTotal,
        },
        select: {
          currentDiamonds: true,
          totalDiamonds: true,
          dailyDiamonds: true,
        },
      });

      // İşlem kaydı oluştur
      const transaction = await prisma.diamondTransaction.create({
        data: {
          userId: authUser.userId,
          amount: amount,
          type: type || "EARNED",
          description: description || "Elmas kazanıldı",
          relatedId,
          relatedType,
        },
      });

      return NextResponse.json({
        success: true,
        message: `${amount} elmas kazandınız!`,
        transaction,
        balance: updatedUser,
        dailyProgress: {
          current: limitCheck.newDailyTotal,
          limit: limitCheck.limit,
          remaining: limitCheck.limit - limitCheck.newDailyTotal,
        },
      });
    } else if (action === "spend") {
      // Elmas harcama
      const user = await prisma.user.findUnique({
        where: { id: authUser.userId },
        select: { currentDiamonds: true },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Kullanıcı bulunamadı" },
          { status: 404 }
        );
      }

      if (user.currentDiamonds < amount) {
        return NextResponse.json(
          {
            success: false,
            error: "Yetersiz elmas bakiyesi",
            required: amount,
            current: user.currentDiamonds,
            needed: amount - user.currentDiamonds,
          },
          { status: 400 }
        );
      }

      // Kullanıcıyı güncelle
      const updatedUser = await prisma.user.update({
        where: { id: authUser.userId },
        data: {
          currentDiamonds: { decrement: amount },
        },
        select: {
          currentDiamonds: true,
          totalDiamonds: true,
        },
      });

      // İşlem kaydı oluştur
      const transaction = await prisma.diamondTransaction.create({
        data: {
          userId: authUser.userId,
          amount: -amount, // Negatif değer harcama için
          type: type || "SPENT",
          description: description || "Elmas harcandı",
          relatedId,
          relatedType,
        },
      });

      return NextResponse.json({
        success: true,
        message: `${amount} elmas harcandı`,
        transaction,
        balance: updatedUser,
      });
    } else {
      return NextResponse.json(
        { error: "Geçersiz işlem türü" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Diamonds POST error:", error);
    return NextResponse.json(
      { error: "Elmas işlemi sırasında hata oluştu" },
      { status: 500 }
    );
  }
}

// PUT - Elmas bakiyesi düzeltme (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getUserFromSession();

    if (!authUser) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekli" },
        { status: 401 }
      );
    }

    // Admin kontrolü (basit username kontrolü, daha sonra role tabanlı yapılabilir)
    if (authUser.username !== "admin") {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, newBalance, reason } = body;

    if (!userId || newBalance < 0) {
      return NextResponse.json(
        { error: "Geçersiz parametreler" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentDiamonds: true, username: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    const difference = newBalance - user.currentDiamonds;

    // Kullanıcı bakiyesini güncelle
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        currentDiamonds: newBalance,
        ...(difference > 0 && { totalDiamonds: { increment: difference } }),
      },
      select: {
        currentDiamonds: true,
        totalDiamonds: true,
        username: true,
      },
    });

    // Admin işlem kaydı
    await prisma.diamondTransaction.create({
      data: {
        userId: userId,
        amount: difference,
        type: "ADMIN_ADJUSTMENT",
        description:
          reason ||
          `Admin tarafından bakiye düzeltmesi: ${user.currentDiamonds} → ${newBalance}`,
        relatedType: "admin",
        relatedId: authUser.userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: `${updatedUser.username} kullanıcısının bakiyesi güncellendi`,
      user: updatedUser,
      adjustment: difference,
    });
  } catch (error) {
    console.error("Diamonds PUT error:", error);
    return NextResponse.json(
      { error: "Bakiye güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}
