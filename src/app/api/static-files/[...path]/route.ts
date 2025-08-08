import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = params.path.join('/');
    
    // Security check - prevent directory traversal
    if (filePath.includes('..') || filePath.includes('\\')) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    // Try multiple possible paths for production compatibility
    const possiblePaths = [
      path.join(process.cwd(), "public", "uploads", filePath),
      path.join(process.cwd(), "uploads", filePath),
      path.join("/app/public/uploads", filePath), // Common Docker path
      path.join("/app/uploads", filePath), // Alternative Docker path
    ];

    let actualPath: string | null = null;
    for (const testPath of possiblePaths) {
      if (existsSync(testPath)) {
        actualPath = testPath;
        break;
      }
    }

    if (!actualPath) {
      console.error(`File not found in any of these paths:`, possiblePaths);
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = await readFile(actualPath);
    const mimeType = getImageMimeType(actualPath);

    return new NextResponse(fileBuffer as any, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      }
    });
  } catch (error) {
    console.error("Static file serve error:", error);
    return NextResponse.json({ error: "File serve failed" }, { status: 500 });
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