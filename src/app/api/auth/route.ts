import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Admin credentials - gerçek projede environment variables'dan alınmalı
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123", // Demo için basit şifre
};

// Session store (gerçek projede Redis/Database kullanılmalı)
const activeSessions = new Map<
  string,
  { username: string; createdAt: number; expiresAt: number }
>();

// Session temizleme fonksiyonu
const cleanExpiredSessions = () => {
  const now = Date.now();
  for (const [sessionId, session] of activeSessions.entries()) {
    if (session.expiresAt < now) {
      activeSessions.delete(sessionId);
    }
  }
};

// Her çağrıda expired session'ları temizle
setInterval(cleanExpiredSessions, 5 * 60 * 1000); // 5 dakikada bir

export async function POST(request: NextRequest) {
  try {
    cleanExpiredSessions(); // Expired session'ları temizle

    const { username, password, action } = await request.json();

    if (action === "login") {
      // Login işlemi
      if (!username || !password) {
        return NextResponse.json(
          { error: "Kullanıcı adı ve şifre gerekli" },
          { status: 400 }
        );
      }

      // Credentials kontrolü
      if (
        username !== ADMIN_CREDENTIALS.username ||
        password !== ADMIN_CREDENTIALS.password
      ) {
        return NextResponse.json(
          { error: "Geçersiz kullanıcı adı veya şifre" },
          { status: 401 }
        );
      }

      // Session ID oluştur
      const sessionId = crypto.randomBytes(32).toString("hex");
      const now = Date.now();
      const expiresAt = now + 24 * 60 * 60 * 1000; // 24 saat

      // Session'ı kaydet
      activeSessions.set(sessionId, {
        username: username,
        createdAt: now,
        expiresAt: expiresAt,
      });

      // Response oluştur
      const response = NextResponse.json({
        success: true,
        message: "Giriş başarılı",
        user: {
          username: username,
          role: "admin",
        },
      });

      // HTTP-only cookie olarak session ID'yi set et
      response.cookies.set("admin-session", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24 saat
      });

      return response;
    } else if (action === "logout") {
      // Logout işlemi - hem admin session hem JWT token'ı temizle
      const sessionId = request.cookies.get("admin-session")?.value;
      const authToken = request.cookies.get("auth-token")?.value;

      if (sessionId) {
        activeSessions.delete(sessionId);
      }

      const response = NextResponse.json({
        success: true,
        message: "Çıkış başarılı",
      });

      // Her iki cookie'yi de temizle
      response.cookies.delete("admin-session");
      response.cookies.delete("auth-token");

      return response;
    } else if (action === "verify") {
      // Session doğrulama
      const sessionId = request.cookies.get("admin-session")?.value;

      if (!sessionId) {
        return NextResponse.json(
          { error: "Session bulunamadı" },
          { status: 401 }
        );
      }

      const session = activeSessions.get(sessionId);

      if (!session || session.expiresAt < Date.now()) {
        if (session) {
          activeSessions.delete(sessionId);
        }
        return NextResponse.json(
          { error: "Session süresi dolmuş" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          username: session.username,
          role: "admin",
        },
      });
    }

    return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
  } catch (error) {
    console.error("Auth API error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    cleanExpiredSessions(); // Expired session'ları temizle

    // Admin session kontrolü
    const sessionId = request.cookies.get("admin-session")?.value;
    if (sessionId) {
      const session = activeSessions.get(sessionId);
      if (session && session.expiresAt >= Date.now()) {
        return NextResponse.json({
          authenticated: true,
          user: {
            username: session.username,
            role: "admin",
          },
        });
      } else if (session) {
        activeSessions.delete(sessionId);
      }
    }

    // User JWT auth disabled (migrated to NextAuth). Only admin-session is supported here.
    return NextResponse.json({ authenticated: false });
  } catch (error) {
    console.error("Auth verification error:", error);
    return NextResponse.json({ authenticated: false });
  }
}
