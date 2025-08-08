import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      aiService: {
        status: "disabled",
        message: "AI service disabled for build stability",
      },
      nodeEnv: process.env.NODE_ENV,
      allEnvKeys: Object.keys(process.env).filter(
        (key) => key.includes("DATABASE") || key.includes("NEXT")
      ),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug endpoint failed",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
