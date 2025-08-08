import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { pbkdf2Sync } from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    const { usernameOrEmail, password } = await request.json();

    // Validation
    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { error: "Kullanıcı adı/email ve şifre gerekli" },
        { status: 400 }
      );
    }

    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 401 }
      );
    }

    // Check password - support both bcrypt and crypto hashing
    let isPasswordValid = false;

    // Handle users without password (OAuth users)
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "Bu hesap için şifre girişi kullanılamaz. OAuth ile giriş yapın." },
        { status: 401 }
      );
    }

    if (user.passwordHash.includes(":")) {
      // Node.js crypto format: hash:salt
      const [hash, salt] = user.passwordHash.split(":");
      const computedHash = pbkdf2Sync(
        password,
        salt,
        1000,
        64,
        "sha512"
      ).toString("hex");
      isPasswordValid = computedHash === hash;
    } else {
      // bcrypt format
      isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    }

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Geçersiz şifre" }, { status: 401 });
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json({ error: "Hesap devre dışı" }, { status: 403 });
    }

    // Update login streak and last login date
    const now = new Date();
    const lastLogin = user.lastLoginDate;
    let newLoginStreak = user.loginStreak;

    if (lastLogin) {
      const daysDiff = Math.floor(
        (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 1) {
        // Consecutive day
        newLoginStreak += 1;
      } else if (daysDiff > 1) {
        // Streak broken
        newLoginStreak = 1;
      }
      // If daysDiff === 0, it's the same day, keep the streak
    } else {
      // First login
      newLoginStreak = 1;
    }

    // Update max streak if needed
    const newMaxStreak = Math.max(user.maxLoginStreak, newLoginStreak);

    // Update user login data
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginDate: now,
        loginStreak: newLoginStreak,
        maxLoginStreak: newMaxStreak,
      },
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Prepare user data (exclude sensitive info)
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      level: user.level,
      experience: user.experience,
      currentDiamonds: user.currentDiamonds,
      totalDiamonds: user.totalDiamonds,
      loginStreak: newLoginStreak,
      maxLoginStreak: newMaxStreak,
      codeArenasCompleted: user.codeArenasCompleted,
      quizzesCompleted: user.quizzesCompleted,
      isPremium: user.isPremium,
    };

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Giriş başarılı",
      user: userData,
    });

    // Set JWT token as httpOnly cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
