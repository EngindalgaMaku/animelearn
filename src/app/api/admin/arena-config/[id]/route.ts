import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET - Get specific arena configuration
export async function GET(
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

    const configuration = await prisma.arenaConfiguration.findUnique({
      where: { id },
      include: {
        difficultyConfigs: {
          orderBy: { level: "asc" },
        },
        categoryConfigs: {
          orderBy: { sortOrder: "asc" },
        },
        activityTypeConfigs: {
          orderBy: { sortOrder: "asc" },
        },
        uiConfig: true,
      },
    });

    if (!configuration) {
      return NextResponse.json(
        { error: "Configuration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      configuration,
    });
  } catch (error) {
    console.error("Arena configuration GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch arena configuration" },
      { status: 500 }
    );
  }
}

// PUT - Update arena configuration
export async function PUT(
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

    const body = await request.json();
    const {
      name,
      description,
      isActive,
      isDefault,
      difficultyConfigs,
      categoryConfigs,
      activityTypeConfigs,
      uiConfig,
    } = body;

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

    // If setting as default, remove default from others
    if (isDefault && !existingConfig.isDefault) {
      await prisma.arenaConfiguration.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    // If setting as active, remove active from others
    if (isActive && !existingConfig.isActive) {
      await prisma.arenaConfiguration.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    // Delete existing related configs
    await prisma.arenaDifficultyConfig.deleteMany({
      where: { configId: id },
    });
    await prisma.arenaCategoryConfig.deleteMany({
      where: { configId: id },
    });
    await prisma.arenaActivityTypeConfig.deleteMany({
      where: { configId: id },
    });
    await prisma.arenaUIConfig.deleteMany({
      where: { configId: id },
    });

    // Update configuration with new data
    const updatedConfiguration = await prisma.arenaConfiguration.update({
      where: { id },
      data: {
        name,
        description: description || "",
        isActive: isActive !== undefined ? isActive : existingConfig.isActive,
        isDefault:
          isDefault !== undefined ? isDefault : existingConfig.isDefault,
        difficultyConfigs: {
          create: difficultyConfigs.map((config: any) => ({
            level: config.level,
            label: config.label,
            color: config.color,
            icon: config.icon,
            bgColor: config.bgColor,
            textColor: config.textColor,
            borderColor: config.borderColor,
            sortOrder: config.sortOrder || config.level,
            isActive: config.isActive !== undefined ? config.isActive : true,
          })),
        },
        categoryConfigs: {
          create: categoryConfigs.map((config: any, index: number) => ({
            key: config.key,
            title: config.title,
            description: config.description,
            icon: config.icon,
            gradient: config.gradient,
            bgGradient: config.bgGradient,
            iconBg: config.iconBg,
            sortOrder: config.sortOrder || index,
            isActive: config.isActive !== undefined ? config.isActive : true,
          })),
        },
        activityTypeConfigs: {
          create: activityTypeConfigs.map((config: any, index: number) => ({
            type: config.type,
            name: config.name,
            icon: config.icon,
            color: config.color,
            description: config.description || "",
            sortOrder: config.sortOrder || index,
            isActive: config.isActive !== undefined ? config.isActive : true,
          })),
        },
        uiConfig: {
          create: {
            heroTitle: uiConfig.heroTitle,
            heroSubtitle: uiConfig.heroSubtitle,
            heroDescription: uiConfig.heroDescription,
            primaryColor: uiConfig.primaryColor,
            secondaryColor: uiConfig.secondaryColor,
            accentColor: uiConfig.accentColor,
            backgroundColor: uiConfig.backgroundColor,
            headerGradient: uiConfig.headerGradient,
            customCSS: uiConfig.customCSS || "",
            showStats:
              uiConfig.showStats !== undefined ? uiConfig.showStats : true,
            showFilters:
              uiConfig.showFilters !== undefined ? uiConfig.showFilters : true,
            enableAnimations:
              uiConfig.enableAnimations !== undefined
                ? uiConfig.enableAnimations
                : true,
          },
        },
      },
      include: {
        difficultyConfigs: true,
        categoryConfigs: true,
        activityTypeConfigs: true,
        uiConfig: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Arena configuration updated successfully",
      configuration: updatedConfiguration,
    });
  } catch (error) {
    console.error("Arena configuration PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update arena configuration" },
      { status: 500 }
    );
  }
}

// DELETE - Delete arena configuration
export async function DELETE(
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

    // Prevent deletion of default configuration
    if (existingConfig.isDefault) {
      return NextResponse.json(
        { error: "Cannot delete default configuration" },
        { status: 400 }
      );
    }

    // Delete configuration (cascade will handle related configs)
    await prisma.arenaConfiguration.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Arena configuration deleted successfully",
    });
  } catch (error) {
    console.error("Arena configuration DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete arena configuration" },
      { status: 500 }
    );
  }
}
