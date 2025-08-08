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

// GET - Tek diamond package getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = getUserFromToken(request);

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

    const packageData = await prisma.diamondPackage.findUnique({
      where: { id },
    });

    if (!packageData) {
      return NextResponse.json(
        { error: "Diamond package bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      package: packageData,
    });
  } catch (error) {
    console.error("Diamond package GET error:", error);
    return NextResponse.json(
      { error: "Diamond package getirilirken hata oluştu" },
      { status: 500 }
    );
  }
}

// PUT - Diamond package güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = getUserFromToken(request);

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

    // Mevcut package'ı kontrol et
    const existingPackage = await prisma.diamondPackage.findUnique({
      where: { id },
    });

    if (!existingPackage) {
      return NextResponse.json(
        { error: "Diamond package bulunamadı" },
        { status: 404 }
      );
    }

    // PackageType benzersizlik kontrolü (eğer değişiyorsa)
    if (packageType && packageType !== existingPackage.packageType) {
      const packageTypeExists = await prisma.diamondPackage.findFirst({
        where: {
          packageType,
          id: { not: id },
        },
      });

      if (packageTypeExists) {
        return NextResponse.json(
          { error: "Bu package type zaten kullanımda" },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (packageType !== undefined) updateData.packageType = packageType;
    if (diamonds !== undefined) updateData.diamonds = diamonds;
    if (price !== undefined) updateData.price = price;
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice;
    if (bonus !== undefined) updateData.bonus = bonus;
    if (popular !== undefined) updateData.popular = popular;
    if (bestValue !== undefined) updateData.bestValue = bestValue;
    if (level !== undefined) updateData.level = level;
    if (badge !== undefined) updateData.badge = badge;
    if (color !== undefined) updateData.color = color;
    if (glow !== undefined) updateData.glow = glow;
    if (icon !== undefined) updateData.icon = icon;
    if (features !== undefined) updateData.features = JSON.stringify(features);
    if (isActive !== undefined) updateData.isActive = isActive;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    const updatedPackage = await prisma.diamondPackage.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Diamond package başarıyla güncellendi",
      package: updatedPackage,
    });
  } catch (error) {
    console.error("Diamond package PUT error:", error);
    return NextResponse.json(
      { error: "Diamond package güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE - Diamond package sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = getUserFromToken(request);

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

    // Package'ın var olup olmadığını kontrol et
    const existingPackage = await prisma.diamondPackage.findUnique({
      where: { id },
    });

    if (!existingPackage) {
      return NextResponse.json(
        { error: "Diamond package bulunamadı" },
        { status: 404 }
      );
    }

    await prisma.diamondPackage.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Diamond package başarıyla silindi",
    });
  } catch (error) {
    console.error("Diamond package DELETE error:", error);
    return NextResponse.json(
      { error: "Diamond package silinirken hata oluştu" },
      { status: 500 }
    );
  }
}