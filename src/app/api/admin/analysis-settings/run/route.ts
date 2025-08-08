import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateRarityAwareCardProperties } from "@/lib/ai/power-calculation";

// POST /api/admin/analysis-settings/run - Run analysis with specific settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { settingsId, cardIds, analysisType = "manual" } = body;

    // Get analysis settings
    const settings = await prisma.cardAnalysisSettings.findUnique({
      where: { id: settingsId },
    });

    if (!settings) {
      return NextResponse.json(
        { error: "Analysis settings not found" },
        { status: 404 }
      );
    }

    if (!settings.isActive) {
      return NextResponse.json(
        { error: "Analysis settings is not active" },
        { status: 400 }
      );
    }

    // Get cards to analyze
    let cardsToAnalyze;
    if (cardIds && cardIds.length > 0) {
      // Analyze specific cards
      cardsToAnalyze = await prisma.card.findMany({
        where: {
          id: { in: cardIds },
          isAnalyzed: false, // Only analyze unanalyzed cards
        },
      });
    } else {
      // Analyze all unanalyzed cards (limit to prevent overload)
      cardsToAnalyze = await prisma.card.findMany({
        where: { isAnalyzed: false },
        take: 50, // Process in batches
        orderBy: { uploadDate: "desc" },
      });
    }

    if (cardsToAnalyze.length === 0) {
      return NextResponse.json({
        message: "No cards found to analyze",
        processedCards: 0,
      });
    }

    // Process cards in batches to avoid timeout
    const batchSize = 10;
    let processedCount = 0;
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < cardsToAnalyze.length; i += batchSize) {
      const batch = cardsToAnalyze.slice(i, i + batchSize);

      // Process each card in the batch
      for (const card of batch) {
        try {
          // Create analysis log entry
          const analysisLog = await prisma.analysisLog.create({
            data: {
              cardId: card.id,
              settingsId: settings.id,
              analysisType,
              originalData: JSON.stringify({
                name: card.name,
                series: card.series,
                character: card.character,
                rarity: card.rarity,
                category: card.category,
                condition: card.condition,
                estimatedValue: card.estimatedValue,
              }),
              status: "processing",
              settingsUsed: JSON.stringify(settings),
            },
          });

          // Simulate analysis processing
          const analysisResults = await performCardAnalysis(card, settings);

          // Update card with analysis results
          await prisma.card.update({
            where: { id: card.id },
            data: {
              ...analysisResults.cardUpdates,
              isAnalyzed: true,
              confidence: analysisResults.confidence,
            },
          });

          // Update analysis log
          await prisma.analysisLog.update({
            where: { id: analysisLog.id },
            data: {
              status: "completed",
              confidence: analysisResults.confidence,
              oldPrice: card.diamondPrice,
              newPrice: analysisResults.cardUpdates.diamondPrice,
              priceReason: analysisResults.priceReason,
              detectedSeries: analysisResults.cardUpdates.series,
              detectedCharacter: analysisResults.cardUpdates.character,
              detectedRarity: analysisResults.cardUpdates.rarity,
              detectedElement: analysisResults.cardUpdates.element,
              detectedCondition: analysisResults.cardUpdates.condition,
              ocrResults: analysisResults.ocrResults,
              aiTags: analysisResults.aiTags,
              imageQuality: analysisResults.imageQuality,
              processingTime: analysisResults.processingTime,
            },
          });

          successCount++;
        } catch (error) {
          console.error(`Error analyzing card ${card.id}:`, error);

          // Log the failure
          await prisma.analysisLog.create({
            data: {
              cardId: card.id,
              settingsId: settings.id,
              analysisType,
              status: "failed",
              errorMessage:
                error instanceof Error ? error.message : "Unknown error",
              settingsUsed: JSON.stringify(settings),
            },
          });

          failureCount++;
        }

        processedCount++;
      }
    }

    return NextResponse.json({
      message: "Analysis completed",
      processedCards: processedCount,
      successCount,
      failureCount,
      settingsUsed: settings.name,
    });
  } catch (error) {
    console.error("Error running analysis:", error);
    return NextResponse.json(
      { error: "Failed to run analysis" },
      { status: 500 }
    );
  }
}

// Simulated analysis function - in real implementation this would use AI services
async function performCardAnalysis(card: any, settings: any) {
  const startTime = Date.now();

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Calculate new price based on settings
  let newPrice = Math.max(
    settings.basePriceMin,
    Math.min(
      settings.basePriceMax,
      Math.floor(
        Math.random() * (settings.basePriceMax - settings.basePriceMin) +
          settings.basePriceMin
      )
    )
  );

  // Apply rarity multiplier if rarity is detected
  if (card.rarity) {
    const rarityMultipliers: Record<string, number> = {
      common: 1.0,
      uncommon: 1.3,
      rare: 1.8,
      epic: 2.5,
      legendary: 4.0,
    };
    const multiplier = rarityMultipliers[card.rarity.toLowerCase()] || 1.0;
    newPrice = Math.floor(newPrice * multiplier * settings.rarityWeight);
  }

  // Apply category multiplier
  if (card.category) {
    const categoryMultipliers: Record<string, number> = {
      anime: 1.0,
      cars: 1.5,
      sports: 1.2,
    };
    const multiplier = categoryMultipliers[card.category.toLowerCase()] || 1.0;
    newPrice = Math.floor(newPrice * multiplier * settings.categoryWeight);
  }

  // Determine final rarity
  const finalRarity = card.rarity ||
    ["common", "uncommon", "rare", "epic", "legendary"][
      Math.floor(Math.random() * 5)
    ];

  // Generate rarity-aware card properties
  const cardProperties = await generateRarityAwareCardProperties(
    newPrice,
    finalRarity,
    card.id,
    card.fileName || `analysis_${card.id}`
  );

  console.log(
    `🎮 Admin analysis - Generated powers for ${finalRarity}: Attack=${cardProperties.attackPower}, Defense=${cardProperties.defense}, Speed=${cardProperties.speed}`
  );

  // Generate mock analysis results
  const confidence = 0.7 + Math.random() * 0.3; // 0.7 to 1.0
  const processingTime = Date.now() - startTime;

  return {
    cardUpdates: {
      diamondPrice: newPrice,
      series: card.series || `Detected Series ${Math.floor(Math.random() * 100)}`,
      character: card.character || `Character ${Math.floor(Math.random() * 100)}`,
      rarity: finalRarity,
      element: cardProperties.element,
      condition: card.condition ||
        ["Poor", "Fair", "Good", "Excellent", "Mint"][
          Math.floor(Math.random() * 5)
        ],
      // Add rarity-based power stats
      attackPower: cardProperties.attackPower,
      defense: cardProperties.defense,
      speed: cardProperties.speed,
      specialAbility: cardProperties.specialAbility,
      rarityLevel: cardProperties.rarityLevel,
      rating: cardProperties.rating,
      cardTitle: cardProperties.cardTitle,
    },
    confidence,
    priceReason: `Price calculated using ${settings.name} settings with rarity weight ${settings.rarityWeight}x and category weight ${settings.categoryWeight}x`,
    ocrResults: "Sample OCR text extracted from card",
    aiTags: "action, character, special_ability, fantasy",
    imageQuality: 0.8 + Math.random() * 0.2,
    processingTime,
  };
}
