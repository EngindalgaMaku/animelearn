import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  dailyTipAutomation,
  AutomationSettings,
} from "@/lib/daily-tip-automation";

// Admin kontrolü
async function checkAdminAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return false;
  }
  return true;
}

// GET - Automation settings ve status'u getir (Admin only)
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = await dailyTipAutomation.getStatus();

    return NextResponse.json(status);
  } catch (error) {
    console.error("Error fetching automation status:", error);
    return NextResponse.json(
      { error: "Failed to fetch automation status" },
      { status: 500 }
    );
  }
}

// POST - Automation settings'i güncelle (Admin only)
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { settings }: { settings: AutomationSettings } = body;

    // Validate settings
    if (!settings) {
      return NextResponse.json(
        { error: "Settings are required" },
        { status: 400 }
      );
    }

    // Validate rotation time format
    if (settings.rotationTime && !/^\d{2}:\d{2}$/.test(settings.rotationTime)) {
      return NextResponse.json(
        { error: "Invalid rotation time format. Use HH:MM format." },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (
      settings.avoidRecentDays &&
      (settings.avoidRecentDays < 1 || settings.avoidRecentDays > 365)
    ) {
      return NextResponse.json(
        { error: "avoidRecentDays must be between 1 and 365" },
        { status: 400 }
      );
    }

    if (
      settings.maxConsecutiveSameDifficulty &&
      (settings.maxConsecutiveSameDifficulty < 1 ||
        settings.maxConsecutiveSameDifficulty > 10)
    ) {
      return NextResponse.json(
        { error: "maxConsecutiveSameDifficulty must be between 1 and 10" },
        { status: 400 }
      );
    }

    if (
      settings.maxConsecutiveSameCategory &&
      (settings.maxConsecutiveSameCategory < 1 ||
        settings.maxConsecutiveSameCategory > 10)
    ) {
      return NextResponse.json(
        { error: "maxConsecutiveSameCategory must be between 1 and 10" },
        { status: 400 }
      );
    }

    // Save settings
    await dailyTipAutomation.saveSettings(settings);

    // Restart automation if enabled
    if (settings.isEnabled) {
      await dailyTipAutomation.startAutomation();
    } else {
      dailyTipAutomation.stopAutomation();
    }

    const status = await dailyTipAutomation.getStatus();

    return NextResponse.json({
      message: "Automation settings updated successfully",
      status,
    });
  } catch (error) {
    console.error("Error updating automation settings:", error);
    return NextResponse.json(
      { error: "Failed to update automation settings" },
      { status: 500 }
    );
  }
}

// PUT - Specific automation actions (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "start":
        await dailyTipAutomation.startAutomation();
        break;

      case "stop":
        dailyTipAutomation.stopAutomation();
        break;

      case "test_rotation":
        try {
          const newTip = await dailyTipAutomation.selectNextTip();
          return NextResponse.json({
            message: "Test rotation successful",
            dailyTip: newTip,
          });
        } catch (error) {
          return NextResponse.json(
            {
              error:
                error instanceof Error ? error.message : "Test rotation failed",
            },
            { status: 400 }
          );
        }

      default:
        return NextResponse.json(
          { error: "Invalid action. Use 'start', 'stop', or 'test_rotation'" },
          { status: 400 }
        );
    }

    const status = await dailyTipAutomation.getStatus();

    return NextResponse.json({
      message: `Automation ${action} completed successfully`,
      status,
    });
  } catch (error) {
    console.error("Error executing automation action:", error);
    return NextResponse.json(
      { error: "Failed to execute automation action" },
      { status: 500 }
    );
  }
}
