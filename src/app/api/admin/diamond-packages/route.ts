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

// GET - Diamond packages listele
export async function GET(request: NextRequest) {
  try {
    const authUser = await getUserFromSession();

    if (!authUser) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekli" },
        { status: 401 }
      );
    }

    // Admin kontrolü
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: { role: true, username: true },
    });

    if (!user || (user.role !== "admin" && user.username !== "admin")) {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      );
    }

    const packages = await prisma.diamondPackage.findMany({
      orderBy: [{ sortOrder: "asc" }, { level: "asc" }],
    });

    return NextResponse.json({
      success: true,
      packages,
    });
  } catch (error) {
    console.error("Diamond packages GET error:", error);
    return NextResponse.json(
      { error: "Diamond packages getirilirken hata oluştu" },
      { status: 500 }
    );
  }
}

// POST - Yeni diamond package oluştur
export async function POST(request: NextRequest) {
  try {
    const authUser = await getUserFromSession();

    if (!authUser) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekli" },
        { status: 401 }
      );
    }

    // Admin kontrolü
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: { role: true, username: true },
    });

    if (!user || (user.role !== "admin" && user.username !== "admin")) {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      packageType,
      diamonds,
      price,
      originalPrice,
      bonus,
      popular,
      bestValue,
      level,
      badge,
      color,
      glow,
      icon,
      features,
      isActive,
      sortOrder,
    } = body;

    // Validation
    if (!name || !packageType || !diamonds || !price || level === undefined) {
      return NextResponse.json(
        { error: "Name, packageType, diamonds, price ve level gerekli" },
        { status: 400 }
      );
    }

    // PackageType benzersiz olmalı
    const existingPackage = await prisma.diamondPackage.findUnique({
      where: { packageType },
    });

    if (existingPackage) {
      return NextResponse.json(
        { error: "Bu package type zaten mevcut" },
        { status: 400 }
      );
    }

    const newPackage = await prisma.diamondPackage.create({
      data: {
        name,
        packageType,
        diamonds,
        price,
        originalPrice: originalPrice || null,
        bonus: bonus || null,
        popular: popular || false,
        bestValue: bestValue || false,
        level,
        badge: badge || "Novice",
        color: color || "from-green-400 to-emerald-600",
        glow: glow || "shadow-green-500/25",
        icon: icon || "Diamond",
        features: JSON.stringify(features || []),
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Diamond package başarıyla oluşturuldu",
      package: newPackage,
    });
  } catch (error) {
    console.error("Diamond package POST error:", error);
    return NextResponse.json(
      { error: "Diamond package oluşturulurken hata oluştu" },
      { status: 500 }
    );
  }
}
