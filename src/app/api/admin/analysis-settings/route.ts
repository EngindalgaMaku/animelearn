import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/analysis-settings - List all analysis settings
export async function GET() {
  try {
    const settings = await prisma.cardAnalysisSettings.findMany({
      orderBy: [
        { isDefault: "desc" },
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching analysis settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch analysis settings" },
      { status: 500 }
    );
  }
}

// POST /api/admin/analysis-settings - Create new analysis settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // If this is being set as default, unset others
    if (body.isDefault) {
      await prisma.cardAnalysisSettings.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    // Create new settings
    const settings = await prisma.cardAnalysisSettings.create({
      data: {
        name: body.name,
        description: body.description,

        // AI Analysis Settings
        aiModel: body.aiModel || "gpt-4o-mini",
        confidenceThreshold: body.confidenceThreshold || 0.7,
        enableOCR: body.enableOCR !== undefined ? body.enableOCR : true,
        enableImageAnalysis:
          body.enableImageAnalysis !== undefined
            ? body.enableImageAnalysis
            : true,
        enablePriceEstimation:
          body.enablePriceEstimation !== undefined
            ? body.enablePriceEstimation
            : true,

        // Price Calculation Settings
        basePriceMin: body.basePriceMin || 50,
        basePriceMax: body.basePriceMax || 500,
        rarityWeight: body.rarityWeight || 1.5,
        elementWeight: body.elementWeight || 1.2,
        categoryWeight: body.categoryWeight || 1.1,
        conditionWeight: body.conditionWeight || 1.3,
        popularityWeight: body.popularityWeight || 1.4,

        // Market Analysis Settings
        enableMarketAnalysis:
          body.enableMarketAnalysis !== undefined
            ? body.enableMarketAnalysis
            : true,
        marketTrendWeight: body.marketTrendWeight || 1.0,
        demandFactor: body.demandFactor || 1.2,
        supplyFactor: body.supplyFactor || 0.8,

        // Auto-Update Settings
        autoUpdatePrices:
          body.autoUpdatePrices !== undefined ? body.autoUpdatePrices : false,
        priceUpdateInterval: body.priceUpdateInterval || 24,
        maxPriceChange: body.maxPriceChange || 0.3,

        // Analysis Criteria
        analyzeStats:
          body.analyzeStats !== undefined ? body.analyzeStats : true,
        analyzeCharacter:
          body.analyzeCharacter !== undefined ? body.analyzeCharacter : true,
        analyzeSeries:
          body.analyzeSeries !== undefined ? body.analyzeSeries : true,
        analyzeRarity:
          body.analyzeRarity !== undefined ? body.analyzeRarity : true,
        analyzeCondition:
          body.analyzeCondition !== undefined ? body.analyzeCondition : true,
        analyzeElements:
          body.analyzeElements !== undefined ? body.analyzeElements : true,

        // Quality Thresholds
        minImageQuality: body.minImageQuality || 0.5,
        maxBlurThreshold: body.maxBlurThreshold || 0.3,
        minResolution: body.minResolution || 200,

        isActive: body.isActive !== undefined ? body.isActive : true,
        isDefault: body.isDefault !== undefined ? body.isDefault : false,
        priority: body.priority || 0,
      },
    });

    return NextResponse.json(settings, { status: 201 });
  } catch (error) {
    console.error("Error creating analysis settings:", error);
    return NextResponse.json(
      { error: "Failed to create analysis settings" },
      { status: 500 }
    );
  }
}
