import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get the active or default configuration
    const config = await prisma.arenaConfiguration.findFirst({
      where: {
        OR: [{ isDefault: true }, { isActive: true }],
      },
      include: {
        difficultyConfigs: {
          where: { isActive: true },
          orderBy: { level: "asc" },
        },
        categoryConfigs: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
        activityTypeConfigs: {
          where: { isActive: true },
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

    if (!config) {
      return NextResponse.json(
        {
          success: false,
          message: "No configuration found",
        },
        { status: 404 }
      );
    }

    // Format the response for frontend consumption
    const formattedConfig = {
      id: config.id,
      name: config.name,
      description: config.description,
      difficultyConfigs: config.difficultyConfigs.reduce((acc, diff) => {
        acc[diff.level] = {
          label: diff.label,
          color: diff.color,
          icon: diff.icon,
          bgColor: diff.bgColor,
          textColor: diff.textColor,
          borderColor: diff.borderColor,
        };
        return acc;
      }, {} as any),
      categoryConfigs: config.categoryConfigs.reduce((acc, cat) => {
        acc[cat.key] = {
          title: cat.title,
          description: cat.description,
          icon: cat.icon,
          gradient: cat.gradient,
          bgGradient: cat.bgGradient,
          iconBg: cat.iconBg,
        };
        return acc;
      }, {} as any),
      activityTypeConfigs: config.activityTypeConfigs.reduce((acc, type) => {
        acc[type.type] = {
          name: type.name,
          icon: type.icon,
          color: type.color,
        };
        return acc;
      }, {} as any),
      uiConfig: config.uiConfig
        ? {
            heroTitle: config.uiConfig.heroTitle,
            heroSubtitle: config.uiConfig.heroSubtitle,
            heroDescription: config.uiConfig.heroDescription,
            primaryColor: config.uiConfig.primaryColor,
            secondaryColor: config.uiConfig.secondaryColor,
            accentColor: config.uiConfig.accentColor,
            backgroundColor: config.uiConfig.backgroundColor,
            headerGradient: config.uiConfig.headerGradient,
            showStats: config.uiConfig.showStats,
            showFilters: config.uiConfig.showFilters,
            enableAnimations: config.uiConfig.enableAnimations,
          }
        : null,
    };

    return NextResponse.json({
      success: true,
      config: formattedConfig,
    });
  } catch (error) {
    console.error("Arena config GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch arena configuration" },
      { status: 500 }
    );
  }
}
