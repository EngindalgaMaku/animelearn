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

// GET - Aktif XP multiplier etkinliklerini listele
export async function GET(req: NextRequest) {
  try {
    const authUser = getUserFromToken(req);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // Aktif etkinlikleri getir
    const activeEvents = await prisma.xPMultiplierEvent.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { startDate: "asc" },
    });

    // Yaklaşan etkinlikleri getir
    const upcomingEvents = await prisma.xPMultiplierEvent.findMany({
      where: {
        isActive: true,
        startDate: { gt: now },
      },
      orderBy: { startDate: "asc" },
      take: 3, // Sadece en yakın 3 etkinlik
    });

    // Kullanıcının katıldığı etkinliklerden kazandığı toplam bonus XP
    const totalBonusXP = await prisma.xPEventParticipation.aggregate({
      where: {
        userId: authUser.userId,
      },
      _sum: {
        bonusXPEarned: true,
      },
    });

    // Kullanıcı participationlarını ayrıca çek
    const userParticipations = await prisma.xPEventParticipation.findMany({
      where: { userId: authUser.userId },
    });

    const allEvents = [...activeEvents, ...upcomingEvents].map((event) => {
      const userParticipation = userParticipations.find(
        (p) => p.eventId === event.id
      );
      const timeRemaining = Math.max(
        0,
        event.endDate.getTime() - now.getTime()
      );
      const isActive = event.startDate <= now && event.endDate >= now;

      return {
        id: event.id,
        name: event.name,
        description: event.description,
        multiplier: event.multiplier,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate.toISOString(),
        isActive: isActive,
        participantCount: 0, // Mock data for now
        maxParticipants: 100, // Mock data
        requirements: event.targetCategory ? [event.targetCategory] : [],
        rewards: {
          bonusXP: Math.floor(event.multiplier * 50), // Calculate based on multiplier
          specialRewards:
            event.multiplier >= 3 ? ["Special Badge", "Rare Card"] : undefined,
        },
      };
    });

    // Format user participations to match frontend expectations
    const formattedParticipations = userParticipations.map((p) => ({
      eventId: p.eventId,
      joinedAt: p.joinedAt.toISOString(),
      earnedXP: p.bonusXPEarned || 0,
      isActive: true,
      progress: {
        completed: Math.floor(Math.random() * 5), // Mock progress
        total: 5,
      },
    }));

    return NextResponse.json({
      success: true,
      events: allEvents,
      userParticipations: formattedParticipations,
      stats: {
        totalEventsParticipated: userParticipations.length,
        totalBonusXPEarned: totalBonusXP._sum.bonusXPEarned || 0,
        currentActiveEvents: activeEvents.length,
        completedEvents: userParticipations.filter((p) => p.bonusXPEarned > 0)
          .length,
      },
    });
  } catch (error) {
    console.error("Error fetching XP events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Yeni XP multiplier etkinliği oluştur (Admin)
export async function POST(req: NextRequest) {
  try {
    const authUser = getUserFromToken(req);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin kontrolü (şimdilik basit)
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      name,
      description,
      multiplier,
      startDate,
      endDate,
      eventType,
      targetCategory,
      minLevel,
    } = body;

    // Validation
    if (!name || !multiplier || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Name, multiplier, startDate ve endDate gerekli" },
        { status: 400 }
      );
    }

    if (multiplier < 1.1 || multiplier > 10) {
      return NextResponse.json(
        { error: "Multiplier 1.1 ile 10 arasında olmalı" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return NextResponse.json(
        { error: "Başlangıç tarihi bitiş tarihinden önce olmalı" },
        { status: 400 }
      );
    }

    // XP Event oluştur
    const newEvent = await prisma.xPMultiplierEvent.create({
      data: {
        name,
        description: description || "",
        multiplier,
        startDate: start,
        endDate: end,
        eventType: eventType || "general",
        targetCategory,
        minLevel,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "XP Multiplier etkinliği başarıyla oluşturuldu",
      event: {
        id: newEvent.id,
        name: newEvent.name,
        multiplier: newEvent.multiplier,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate,
        eventType: newEvent.eventType,
      },
    });
  } catch (error) {
    console.error("Error creating XP event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
