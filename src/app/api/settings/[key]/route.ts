import { NextRequest, NextResponse } from "next/server";
import { getSetting } from "@/lib/settings";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    
    if (!key) {
      return NextResponse.json(
        { error: "Setting key is required" },
        { status: 400 }
      );
    }

    const value = await getSetting(key);
    
    return NextResponse.json({
      key,
      value,
    });
  } catch (error) {
    console.error("Failed to fetch setting:", error);
    return NextResponse.json(
      { error: "Failed to fetch setting" },
      { status: 500 }
    );
  }
}