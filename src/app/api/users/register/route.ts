import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Kullanıcı adı, email ve şifre gerekli" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalı" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu kullanıcı adı veya email zaten kullanılıyor" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with starting diamonds and level
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        currentDiamonds: 100, // Starting diamonds
        level: 1,
        experience: 0,
      },
      select: {
        id: true,
        username: true,
        email: true,
        currentDiamonds: true,
        level: true,
        experience: true,
      },
    });

    // Create welcome diamond transaction
    await prisma.diamondTransaction.create({
      data: {
        userId: user.id,
        amount: 100,
        type: "EARNED",
        description: "Hoşgeldin bonusu",
        createdAt: new Date(),
      },
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Kayıt başarılı",
      user: user,
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
