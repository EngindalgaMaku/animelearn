import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { createHash } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const IMAGE_CACHE = new Map<
  string,
  { buffer: Buffer; mimeType: string; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT = new Map<string, { count: number; resetTime: number }>();
const BASE_MAX_REQUESTS = 600; // per minute default (higher for thumbnails)

interface AuthUser {
  userId: string;
  username: string;
}

// Token'dan kullanıcı bilgilerini çıkart
function getUserFromToken(request: NextRequest): AuthUser | null {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Rate limiting kontrolü
function checkRateLimit(
  ip: string,
  limit: number = BASE_MAX_REQUESTS
): boolean {
  const now = Date.now();
  const userLimit = RATE_LIMIT.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    RATE_LIMIT.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }

  if (userLimit.count >= limit) {
    return false;
  }

  userLimit.count++;
  return true;
}

// Cache temizleme
function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, value] of IMAGE_CACHE.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      IMAGE_CACHE.delete(key);
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get("cardId");
    const type = (searchParams.get("type") || "preview").toLowerCase(); // preview, thumbnail, full
    const token = searchParams.get("token");

    if (!cardId) {
      return NextResponse.json({ error: "Card ID required" }, { status: 400 });
    }

    // Validate token if provided (tokened requests can bypass rate limit)
    let hasValidToken = false;
    if (token) {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        hasValidToken = decoded?.cardId === cardId && decoded?.type === type;
      } catch {
        hasValidToken = false;
      }
    }

    // Cache key (do not include client IP so we can serve cached responses broadly)
    const cacheKey = `${cardId}-${type}`;

    // Cache kontrolü (serve without touching rate limit)
    cleanExpiredCache();
    const cached = IMAGE_CACHE.get(cacheKey);
    if (cached) {
      const headers = new Headers({
        "Content-Type": cached.mimeType,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "no-referrer",
      });

      return new NextResponse(cached.buffer as any, { headers });
    }

    // Rate limiting (skip if token is valid)
    if (!hasValidToken) {
      // Allow generous limit (e.g., grids) especially for thumbnails
      const limit =
        type === "thumbnail" ? BASE_MAX_REQUESTS : BASE_MAX_REQUESTS;
      if (!checkRateLimit(clientIp, limit)) {
        return NextResponse.json(
          { error: "Too many requests" },
          { status: 429 }
        );
      }
    }

    // Veritabanından kart bilgilerini al
    const { prisma } = await import("@/lib/prisma");
    const authUser = getUserFromToken(request);

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      select: {
        id: true,
        imageUrl: true,
        thumbnailUrl: true,
        imagePath: true,
        isPurchasable: true,
        diamondPrice: true,
        userCards: authUser
          ? {
              where: { userId: authUser.userId },
              select: { id: true },
            }
          : false,
      },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const isOwned = authUser && card.userCards && card.userCards.length > 0;
    let imagePath: string;
    let shouldWatermark = false;

    // Production-compatible file path resolution with category support
    const resolveImagePath = (relativeUrl: string | null): string | null => {
      if (!relativeUrl) return null;

      // Clean the URL path
      const cleanPath = relativeUrl.startsWith("/")
        ? relativeUrl.substring(1)
        : relativeUrl;

      // Try multiple possible paths for production compatibility
      // Now includes category-based paths that we migrated to
      const possiblePaths = [
        // New category-based structure paths
        path.join(process.cwd(), "public", cleanPath),
        path.join(process.cwd(), cleanPath),

        // Docker paths with category support
        path.join("/app/public", cleanPath),
        path.join("/app", cleanPath),

        // Direct path from database (should now contain category paths)
        card.imagePath,

        // Legacy fallback paths (for any remaining non-migrated files)
        cleanPath.includes("/uploads/categories/")
          ? null
          : path.join(process.cwd(), "public", "uploads", cleanPath),

        // Handle potential double-slash issues
        cleanPath.replace(/\/+/g, "/"), // Normalize multiple slashes
      ].filter(Boolean);

      for (const testPath of possiblePaths) {
        if (testPath && existsSync(testPath)) {
          console.log(`✅ Found image at: ${testPath}`);
          return testPath;
        }
      }

      // Enhanced debugging for missing files
      console.warn(`❌ Image not found for card ${cardId}. Searched paths:`, {
        relativeUrl,
        cleanPath,
        cardImagePath: card.imagePath,
        searchedPaths: possiblePaths,
      });

      return null;
    };

    // Resim yolu belirleme
    if (type === "full") {
      if (!isOwned) {
        shouldWatermark = true;
      }
      imagePath = resolveImagePath(card.imageUrl) || "";
    } else if (type === "thumbnail") {
      imagePath =
        resolveImagePath(card.thumbnailUrl) ||
        resolveImagePath(card.imageUrl) ||
        "";
    } else {
      // preview
      shouldWatermark = true;
      imagePath = resolveImagePath(card.imageUrl) || "";
    }

    if (!imagePath || !existsSync(imagePath)) {
      // Try fallback images in multiple locations
      const fallbackPaths = [
        path.join(process.cwd(), "public", "placeholder-card.jpg"),
        path.join(process.cwd(), "public", "placeholder-card.svg"),
        path.join("/app/public", "placeholder-card.jpg"),
        path.join("/app/public", "placeholder-card.svg"),
      ];

      for (const fallbackPath of fallbackPaths) {
        if (existsSync(fallbackPath)) {
          const fallbackBuffer = await readFile(fallbackPath);
          const mimeType = fallbackPath.endsWith(".svg")
            ? "image/svg+xml"
            : "image/jpeg";
          return new NextResponse(fallbackBuffer as any, {
            headers: {
              "Content-Type": mimeType,
              "Cache-Control": "private, no-cache",
            },
          });
        }
      }

      // If no fallback exists, return error with detailed info for debugging
      console.error(`Image not found. Tried paths:`, {
        cardId,
        type,
        cardImageUrl: card.imageUrl,
        cardThumbnailUrl: card.thumbnailUrl,
        cardImagePath: card.imagePath,
        cwd: process.cwd(),
      });

      return NextResponse.json(
        {
          error: "Image not found",
          cardId,
          type,
          debug:
            process.env.NODE_ENV === "development"
              ? {
                  cardImageUrl: card.imageUrl,
                  cardImagePath: card.imagePath,
                  cwd: process.cwd(),
                }
              : undefined,
        },
        { status: 404 }
      );
    }

    let imageBuffer = await readFile(imagePath);
    const mimeType = getImageMimeType(imagePath);

    // Watermark ekleme (gerekirse)
    if (shouldWatermark && !isOwned) {
      imageBuffer = await addWatermark(
        imageBuffer,
        mimeType,
        card.diamondPrice || undefined
      );
    }

    // Cache'e ekle
    IMAGE_CACHE.set(cacheKey, {
      buffer: imageBuffer,
      mimeType,
      timestamp: Date.now(),
    });

    // Güvenlik header'ları
    const headers = new Headers({
      "Content-Type": mimeType,
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Content-Security-Policy": "default-src 'none'",
      "Referrer-Policy": "no-referrer",
      "X-Download-Options": "noopen",
      "X-Permitted-Cross-Domain-Policies": "none",
    });

    return new NextResponse(imageBuffer as any, { headers });
  } catch (error) {
    console.error("Secure image error:", error);
    return NextResponse.json({ error: "Image load failed" }, { status: 500 });
  }
}

function getImageMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    default:
      return "image/jpeg";
  }
}

// Basit watermark ekleme (Canvas API Server-side için)
async function addWatermark(
  buffer: Buffer,
  mimeType: string,
  price?: number
): Promise<Buffer> {
  try {
    // Bu örnekte basit bir overlay header ekleyelim
    // Gerçek production'da Sharp veya Canvas kütüphanesi kullanılabilir

    // Şimdilik orijinal buffer'ı döndürüyoruz
    // Production'da burada watermark overlay eklenecek
    return buffer;
  } catch (error) {
    console.error("Watermark error:", error);
    return buffer;
  }
}

// POST - Secure image token oluşturma
export async function POST(request: NextRequest) {
  try {
    const authUser = getUserFromToken(request);
    const body = await request.json();
    const { cardId, type = "preview" } = body;

    if (!cardId) {
      return NextResponse.json({ error: "Card ID required" }, { status: 400 });
    }

    // Token oluştur (1 saat geçerli)
    const tokenData = {
      cardId,
      type,
      userId: authUser?.userId,
      timestamp: Date.now(),
      hash: createHash("sha256")
        .update(`${cardId}-${type}-${Date.now()}`)
        .digest("hex")
        .substring(0, 16),
    };

    const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: "1h" });

    return NextResponse.json({
      success: true,
      token,
      url: `/api/secure-image?cardId=${cardId}&type=${type}&token=${token}`,
    });
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json(
      { error: "Token generation failed" },
      { status: 500 }
    );
  }
}
