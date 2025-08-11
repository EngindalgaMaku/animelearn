import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// POST - Activate arena configuration
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check admin permissions
    if (session.user.role !== "admin" && session.user.username !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Check if configuration exists
    const existingConfig = await prisma.arenaConfiguration.findUnique({
      where: { id },
    });

    if (!existingConfig) {
      return NextResponse.json(
        { error: "Configuration not found" },
        { status: 404 }
      );
    }

    // Deactivate all other configurations
    await prisma.arenaConfiguration.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Activate this configuration
    const activatedConfig = await prisma.arenaConfiguration.update({
      where: { id },
      data: { isActive: true },
      include: {
        difficultyConfigs: true,
        categoryConfigs: true,
        activityTypeConfigs: true,
        uiConfig: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Arena configuration activated successfully",
      configuration: activatedConfig,
    });
  } catch (error) {
    console.error("Arena configuration activation error:", error);
    return NextResponse.json(
      { error: "Failed to activate arena configuration" },
      { status: 500 }
    );
  }
}
