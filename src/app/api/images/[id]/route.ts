import { NextRequest, NextResponse } from "next/server";
import { verifyImageToken, checkRateLimit } from "@/lib/imageAuth";
import path from "path";
import fs from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const { id: imageId } = await params;

    // Check if token is provided
    if (!token) {
      return new NextResponse("Unauthorized: No token provided", {
        status: 401,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    }

    // Verify JWT token
    const tokenPayload = verifyImageToken(token);
    if (!tokenPayload) {
      return new NextResponse("Unauthorized: Invalid or expired token", {
        status: 401,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    }

    // Verify image ID matches token
    if (tokenPayload.imageId !== imageId) {
      return new NextResponse("Forbidden: Image ID mismatch", {
        status: 403,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    // Rate limiting based on IP address
    const clientIP =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(clientIP, 50)) {
      // Max 50 requests per 15 minutes
      return new NextResponse("Rate limit exceeded", {
        status: 429,
        headers: {
          "Retry-After": "900", // 15 minutes
        },
      });
    }

    // Construct image file path
    // Images are stored in public/uploads/ directory
    let finalImagePath = "";
    let contentType = "image/jpeg";

    // First try with the imageId as full filename (includes extension)
    const directPath = path.join(process.cwd(), "public", "uploads", imageId);
    if (fs.existsSync(directPath)) {
      finalImagePath = directPath;
      const ext = path.extname(imageId).toLowerCase();
      contentType =
        ext === ".png"
          ? "image/png"
          : ext === ".webp"
          ? "image/webp"
          : ext === ".gif"
          ? "image/gif"
          : "image/jpeg";
    } else {
      // Fallback: try different extensions if direct path doesn't work
      const possibleExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
      for (const ext of possibleExtensions) {
        const testPath = path.join(
          process.cwd(),
          "public",
          "uploads",
          `${imageId}${ext}`
        );
        if (fs.existsSync(testPath)) {
          finalImagePath = testPath;
          contentType = `image/${ext.slice(1)}`;
          break;
        }
      }
    }

    // If no image found, return 404
    if (!finalImagePath || !fs.existsSync(finalImagePath)) {
      return new NextResponse("Image not found", {
        status: 404,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    // Read image file
    const imageBuffer = fs.readFileSync(finalImagePath);

    // Security headers to prevent caching and downloading
    const headers = new Headers({
      "Content-Type": contentType,
      "Content-Length": imageBuffer.length.toString(),
      "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
      "Referrer-Policy": "no-referrer",
      "Content-Security-Policy": "default-src 'none'; img-src 'self'",
      // Prevent right-click save
      "Content-Disposition": 'inline; filename="protected-image"',
      // Additional security headers
      "X-Download-Options": "noopen",
      "X-Permitted-Cross-Domain-Policies": "none",
    });

    return new NextResponse(imageBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Image serving error:", error);
    return new NextResponse("Internal server error", {
      status: 500,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }
}

// Disable other HTTP methods
export async function POST() {
  return new NextResponse("Method not allowed", { status: 405 });
}

export async function PUT() {
  return new NextResponse("Method not allowed", { status: 405 });
}

export async function DELETE() {
  return new NextResponse("Method not allowed", { status: 405 });
}

export async function PATCH() {
  return new NextResponse("Method not allowed", { status: 405 });
}
