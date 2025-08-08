import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get("cardId");
    const type = searchParams.get("type"); // 'thumbnail' or 'full'
    
    if (!cardId) {
      return NextResponse.json({ error: "Card ID required" }, { status: 400 });
    }

    // Get card from database to verify ownership if needed
    const { prisma } = await import("@/lib/prisma");
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      select: {
        id: true,
        imageUrl: true,
        thumbnailUrl: true,
        imagePath: true,
        isPurchasable: true,
        isPublic: true,
      },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    let imagePath: string;

    if (type === "full") {
      // For full image, check if user owns the card (implement ownership check later)
      // For now, we'll return a watermarked version or show preview message
      imagePath = card.imagePath;
    } else {
      // For thumbnail, use thumbnail path or fallback to main image
      if (card.thumbnailUrl && existsSync(path.join(process.cwd(), "public", card.thumbnailUrl))) {
        imagePath = path.join(process.cwd(), "public", card.thumbnailUrl);
      } else {
        imagePath = card.imagePath;
      }
    }

    if (!existsSync(imagePath)) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const imageBuffer = await readFile(imagePath);
    const mimeType = getImageMimeType(imagePath);

    // Set headers to prevent caching and make it harder to save
    const headers = new Headers({
      "Content-Type": mimeType,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
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
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    default:
      return 'image/jpeg';
  }
}
