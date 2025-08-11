import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Admin kontrolü
async function checkAdminAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return false;
  }
  return true;
}

// GET - Python Tips Dashboard İstatistikleri (Admin only)
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Toplam sayılar
    const totalTips = await prisma.pythonTip.count();
    const activeTips = await prisma.pythonTip.count({
      where: { isActive: true },
    });
    const inactiveTips = await prisma.pythonTip.count({
      where: { isActive: false },
    });

    // Zorluk seviyelerine göre dağılım
    const beginnerTips = await prisma.pythonTip.count({
      where: { difficulty: "beginner" },
    });
    const intermediateTips = await prisma.pythonTip.count({
      where: { difficulty: "intermediate" },
    });
    const advancedTips = await prisma.pythonTip.count({
      where: { difficulty: "advanced" },
    });

    // Kategori bazlı sayılar
    const categoryStats = await prisma.pythonTipCategory.findMany({
      select: {
        id: true,
        name: true,
        color: true,
        _count: {
          select: {
            tips: true,
          },
        },
      },
    });

    // Toplam görüntülenme ve etkileşim sayıları
    const allTips = await prisma.pythonTip.findMany({
      select: {
        viewCount: true,
        likeCount: true,
        shareCount: true,
        xpReward: true,
      },
    });

    const totalViews = allTips.reduce((sum, tip) => sum + tip.viewCount, 0);
    const totalLikes = allTips.reduce((sum, tip) => sum + tip.likeCount, 0);
    const totalShares = allTips.reduce((sum, tip) => sum + tip.shareCount, 0);
    const totalXpRewards = allTips.reduce((sum, tip) => sum + tip.xpReward, 0);

    // Son eklenen tipler (5 adet)
    const recentTips = await prisma.pythonTip.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        category: {
          select: {
            name: true,
            color: true,
          },
        },
      },
    });

    // En popüler tipler (görüntülenme bazlı, 5 adet)
    const popularTips = await prisma.pythonTip.findMany({
      take: 5,
      orderBy: { viewCount: "desc" },
      include: {
        category: {
          select: {
            name: true,
            color: true,
          },
        },
      },
    });

    return NextResponse.json({
      totals: {
        total: totalTips,
        active: activeTips,
        inactive: inactiveTips,
      },
      difficulties: {
        beginner: beginnerTips,
        intermediate: intermediateTips,
        advanced: advancedTips,
      },
      engagement: {
        totalViews,
        totalLikes,
        totalShares,
        totalXpRewards,
      },
      categories: categoryStats,
      recent: recentTips.map((tip) => ({
        ...tip,
        tags: tip.tags ? JSON.parse(tip.tags) : [],
      })),
      popular: popularTips.map((tip) => ({
        ...tip,
        tags: tip.tags ? JSON.parse(tip.tags) : [],
      })),
    });
  } catch (error) {
    console.error("Error fetching Python tips stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch Python tips statistics" },
      { status: 500 }
    );
  }
}
