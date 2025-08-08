import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Gemini functionality disabled for build stability
    const status = {
      available: false,
      apiKeyConfigured: false,
      timestamp: new Date().toISOString(),
      message: "Gemini API disabled - quality analysis system active",
    };

    return NextResponse.json(status);
  } catch (error) {
    console.error("Status check error:", error);

    return NextResponse.json(
      {
        available: false,
        apiKeyConfigured: false,
        message: "Status check failed",
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
