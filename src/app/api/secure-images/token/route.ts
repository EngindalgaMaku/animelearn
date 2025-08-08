import { NextRequest, NextResponse } from "next/server";
import { generateImageToken } from "@/lib/imageAuth";

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, userId } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Extract filename from URL
    const filename = imageUrl.split("/").pop() || "";

    // Generate JWT token
    const token = generateImageToken(filename, userId);

    // Return secure URL
    const secureUrl = `/api/images/${filename}?token=${token}`;

    return NextResponse.json({
      success: true,
      secureUrl,
      token,
      imageId: filename,
    });
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate secure token" },
      { status: 500 }
    );
  }
}
