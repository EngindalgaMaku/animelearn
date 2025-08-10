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

// GET - Daily Python tips'leri getir (Admin only)
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = searchParams.get("limit");

    const where: any = {};

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.date = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      where.date = {
        lte: new Date(endDate),
      };
    }

    const dailyTips = await prisma.dailyPythonTip.findMany({
      where,
      orderBy: { date: "desc" },
      take: limit ? parseInt(limit) : 30,
      include: {
        tip: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            estimatedMinutes: true,
            category: {
              select: {
                name: true,
                color: true,
                icon: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ dailyTips });
  } catch (error) {
    console.error("Error fetching admin daily Python tips:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily Python tips" },
      { status: 500 }
    );
  }
}

// POST - Yeni daily Python tip ataması yap (Admin only)
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tipId, date, variant, testingActive } = body;

    // Validate required fields
    if (!tipId || !date) {
      return NextResponse.json(
        { error: "Tip ID and date are required" },
        { status: 400 }
      );
    }

    // Verify tip exists and is active
    const tip = await prisma.pythonTip.findUnique({
      where: { id: tipId },
    });

    if (!tip) {
      return NextResponse.json(
        { error: "Python tip not found" },
        { status: 400 }
      );
    }

    if (!tip.isActive) {
      return NextResponse.json(
        { error: "Cannot assign inactive tip as daily tip" },
        { status: 400 }
      );
    }

    // Check if daily tip already exists for this date and variant
    const existingDailyTip = await prisma.dailyPythonTip.findUnique({
      where: {
        date_variant: {
          date: new Date(date),
          variant: variant || "A",
        },
      },
    });

    if (existingDailyTip) {
      return NextResponse.json(
        { error: "Daily tip already exists for this date and variant" },
        { status: 400 }
      );
    }

    const newDailyTip = await prisma.dailyPythonTip.create({
      data: {
        tipId,
        date: new Date(date),
        variant: variant || "A",
        testingActive: testingActive || false,
        isActive: true,
      },
      include: {
        tip: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            estimatedMinutes: true,
            category: {
              select: {
                name: true,
                color: true,
                icon: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(newDailyTip, { status: 201 });
  } catch (error) {
    console.error("Error creating daily Python tip:", error);
    return NextResponse.json(
      { error: "Failed to create daily Python tip" },
      { status: 500 }
    );
  }
}

// PUT - Daily tip rotation - otomatik olarak bir sonraki gün için tip ata
export async function PUT(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === "rotate") {
      // Get tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      // Check if tomorrow already has a daily tip
      const existingDailyTip = await prisma.dailyPythonTip.findFirst({
        where: {
          date: tomorrow,
          variant: "A",
        },
      });

      if (existingDailyTip) {
        return NextResponse.json(
          { error: "Tomorrow already has a daily tip assigned" },
          { status: 400 }
        );
      }

      // Get recently used tips (last 30 days) to avoid repetition
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentlyUsedTipIds = await prisma.dailyPythonTip.findMany({
        where: {
          date: {
            gte: thirtyDaysAgo,
          },
        },
        select: {
          tipId: true,
        },
      });

      const usedTipIds = recentlyUsedTipIds.map((dt) => dt.tipId);

      // Find active tips that haven't been used recently
      const availableTips = await prisma.pythonTip.findMany({
        where: {
          isActive: true,
          id: {
            notIn: usedTipIds,
          },
        },
        include: {
          category: true,
        },
      });

      if (availableTips.length === 0) {
        // If no tips available, use all active tips
        const allActiveTips = await prisma.pythonTip.findMany({
          where: {
            isActive: true,
          },
          include: {
            category: true,
          },
        });

        if (allActiveTips.length === 0) {
          return NextResponse.json(
            { error: "No active tips available for rotation" },
            { status: 400 }
          );
        }

        // Select random tip from all active tips
        const selectedTip =
          allActiveTips[Math.floor(Math.random() * allActiveTips.length)];

        const newDailyTip = await prisma.dailyPythonTip.create({
          data: {
            tipId: selectedTip.id,
            date: tomorrow,
            variant: "A",
            isActive: true,
          },
          include: {
            tip: {
              select: {
                id: true,
                title: true,
                difficulty: true,
                estimatedMinutes: true,
                category: {
                  select: {
                    name: true,
                    color: true,
                    icon: true,
                  },
                },
              },
            },
          },
        });

        return NextResponse.json({
          message: "Daily tip rotated successfully (from all active tips)",
          dailyTip: newDailyTip,
        });
      }

      // Select random tip from available tips
      const selectedTip =
        availableTips[Math.floor(Math.random() * availableTips.length)];

      const newDailyTip = await prisma.dailyPythonTip.create({
        data: {
          tipId: selectedTip.id,
          date: tomorrow,
          variant: "A",
          isActive: true,
        },
        include: {
          tip: {
            select: {
              id: true,
              title: true,
              difficulty: true,
              estimatedMinutes: true,
              category: {
                select: {
                  name: true,
                  color: true,
                  icon: true,
                },
              },
            },
          },
        },
      });

      return NextResponse.json({
        message: "Daily tip rotated successfully",
        dailyTip: newDailyTip,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error rotating daily Python tip:", error);
    return NextResponse.json(
      { error: "Failed to rotate daily Python tip" },
      { status: 500 }
    );
  }
}
