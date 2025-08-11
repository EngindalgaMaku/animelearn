import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET - List all arena configurations
export async function GET(request: NextRequest) {
  try {
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

    const configurations = await prisma.arenaConfiguration.findMany({
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
      orderBy: [
        { isDefault: "desc" },
        { isActive: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      success: true,
      configurations,
    });
  } catch (error) {
    console.error("Arena configurations GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch arena configurations" },
      { status: 500 }
    );
  }
}

// POST - Create new arena configuration
export async function POST(request: NextRequest) {
  try {
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

    // Validation
    if (
      !name ||
      !difficultyConfigs ||
      !categoryConfigs ||
      !activityTypeConfigs ||
      !uiConfig
    ) {
      return NextResponse.json(
        { error: "Name and all configuration sections are required" },
        { status: 400 }
      );
    }

    // If setting as default, remove default from others
    if (isDefault) {
      await prisma.arenaConfiguration.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    // If setting as active, remove active from others
    if (isActive) {
      await prisma.arenaConfiguration.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const newConfiguration = await prisma.arenaConfiguration.create({
      data: {
        name,
        description: description || "",
        isActive: isActive || false,
        isDefault: isDefault || false,
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
      message: "Arena configuration created successfully",
      configuration: newConfiguration,
    });
  } catch (error) {
    console.error("Arena configuration POST error:", error);
    return NextResponse.json(
      { error: "Failed to create arena configuration" },
      { status: 500 }
    );
  }
}
