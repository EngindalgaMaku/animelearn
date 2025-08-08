import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes, pbkdf2Sync } from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, role = "admin" } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Username, email ve password gerekli" },
        { status: 400 }
      );
    }

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Bu username veya email zaten kullanılıyor" },
        { status: 400 }
      );
    }

    // Şifreyi hashle (Node.js crypto ile)
    const salt = randomBytes(16).toString("hex");
    const hashedPassword =
      pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex") +
      ":" +
      salt;

    // Kullanıcıyı oluştur
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        role,
        level: 1,
        experience: 0,
        currentDiamonds: 1000, // Admin'e başlangıç elması
        totalDiamonds: 1000,
        dailyDiamonds: 0,
        codeArenasCompleted: 0,
        quizzesCompleted: 0,
        loginStreak: 1,
        isPremium: true, // Admin premium
      },
    });

    // Şifreyi response'dan çıkar
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: "Admin kullanıcısı başarıyla oluşturuldu",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Admin user creation failed:", error);
    return NextResponse.json(
      { success: false, error: "Kullanıcı oluşturma hatası" },
      { status: 500 }
    );
  }
}
