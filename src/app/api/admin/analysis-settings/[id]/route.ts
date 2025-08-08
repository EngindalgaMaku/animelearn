import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/analysis-settings/[id] - Get specific analysis settings
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const settings = await prisma.cardAnalysisSettings.findUnique({
      where: { id },
    });

    if (!settings) {
      return NextResponse.json(
        { error: "Analysis settings not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching analysis settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch analysis settings" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/analysis-settings/[id] - Update analysis settings
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if settings exist
    const existingSettings = await prisma.cardAnalysisSettings.findUnique({
      where: { id },
    });

    if (!existingSettings) {
      return NextResponse.json(
        { error: "Analysis settings not found" },
        { status: 404 }
      );
    }

    // If this is being set as default, unset others
    if (body.isDefault && !existingSettings.isDefault) {
      await prisma.cardAnalysisSettings.updateMany({
        where: {
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    // Update settings
    const settings = await prisma.cardAnalysisSettings.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,

        // AI Analysis Settings
        aiModel: body.aiModel,
        confidenceThreshold: body.confidenceThreshold,
        enableOCR: body.enableOCR,
        enableImageAnalysis: body.enableImageAnalysis,
        enablePriceEstimation: body.enablePriceEstimation,

        // Price Calculation Settings
        basePriceMin: body.basePriceMin,
        basePriceMax: body.basePriceMax,
        rarityWeight: body.rarityWeight,
        elementWeight: body.elementWeight,
        categoryWeight: body.categoryWeight,
        conditionWeight: body.conditionWeight,
        popularityWeight: body.popularityWeight,

        // Market Analysis Settings
        enableMarketAnalysis: body.enableMarketAnalysis,
        marketTrendWeight: body.marketTrendWeight,
        demandFactor: body.demandFactor,
        supplyFactor: body.supplyFactor,

        // Auto-Update Settings
        autoUpdatePrices: body.autoUpdatePrices,
        priceUpdateInterval: body.priceUpdateInterval,
        maxPriceChange: body.maxPriceChange,

        // Analysis Criteria
        analyzeStats: body.analyzeStats,
        analyzeCharacter: body.analyzeCharacter,
        analyzeSeries: body.analyzeSeries,
        analyzeRarity: body.analyzeRarity,
        analyzeCondition: body.analyzeCondition,
        analyzeElements: body.analyzeElements,

        // Quality Thresholds
        minImageQuality: body.minImageQuality,
        maxBlurThreshold: body.maxBlurThreshold,
        minResolution: body.minResolution,

        isActive: body.isActive,
        isDefault: body.isDefault,
        priority: body.priority,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating analysis settings:", error);
    return NextResponse.json(
      { error: "Failed to update analysis settings" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/analysis-settings/[id] - Delete analysis settings
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if settings exist
    const existingSettings = await prisma.cardAnalysisSettings.findUnique({
      where: { id },
    });

    if (!existingSettings) {
      return NextResponse.json(
        { error: "Analysis settings not found" },
        { status: 404 }
      );
    }

    // Prevent deletion of default settings
    if (existingSettings.isDefault) {
      return NextResponse.json(
        { error: "Cannot delete default analysis settings" },
        { status: 400 }
      );
    }

    // Delete settings
    await prisma.cardAnalysisSettings.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Analysis settings deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting analysis settings:", error);
    return NextResponse.json(
      { error: "Failed to delete analysis settings" },
      { status: 500 }
    );
  }
}
