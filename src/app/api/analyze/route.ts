import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processCardImage } from "@/lib/ai/ocr";
import { estimateCardValue } from "@/lib/ai/value-estimation";
import {
  generateRandomCardProperties,
  saveUsedCardName,
} from "@/lib/ai/card-generator";
import { generateRarityAwareCardProperties } from "@/lib/ai/power-calculation";
import { detectCardRarity } from "@/lib/ai/rarity-detection";
import { calculateDiamondPrice } from "@/lib/utils";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardId, cardIds, bulkAnalysis, forceReAnalysis } = body;

    // Toplu analiz
    if (bulkAnalysis && cardIds && Array.isArray(cardIds)) {
      return await handleBulkAnalysis(cardIds, forceReAnalysis);
    }

    // Tekli analiz
    if (!cardId) {
      return NextResponse.json(
        { error: "Kart ID gereklidir" },
        { status: 400 }
      );
    }

    return await handleSingleAnalysis(cardId, forceReAnalysis);
  } catch (error) {
    console.error("Analyze API error:", error);
    return NextResponse.json(
      { error: "Analiz sırasında hata oluştu" },
      { status: 500 }
    );
  }
}

async function handleSingleAnalysis(
  cardId: string,
  forceReAnalysis: boolean = false
) {
  try {
    // Kartı veritabanından getir
    const card = await prisma.card.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      return NextResponse.json({ error: "Kart bulunamadı" }, { status: 404 });
    }

    if (card.isAnalyzed && !forceReAnalysis) {
      return NextResponse.json({
        message: "Kart zaten analiz edilmiş",
        card,
      });
    }

    const result = await analyzeCard(card, forceReAnalysis);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Single analysis error:", error);
    return NextResponse.json(
      { error: "Tekli analiz sırasında hata oluştu" },
      { status: 500 }
    );
  }
}

async function handleBulkAnalysis(
  cardIds: string[],
  forceReAnalysis: boolean = false
) {
  try {
    const results = [];
    const errors = [];

    console.log(
      `Toplu analiz başlatılıyor: ${cardIds.length} kart${
        forceReAnalysis ? " (tekrar analiz dahil)" : ""
      }`
    );

    for (const cardId of cardIds) {
      try {
        const card = await prisma.card.findUnique({
          where: { id: cardId },
        });

        if (!card) {
          errors.push({ cardId, error: "Kart bulunamadı" });
          continue;
        }

        if (card.isAnalyzed && !forceReAnalysis) {
          results.push({ cardId, message: "Zaten analiz edilmiş", card });
          continue;
        }

        const result = await analyzeCard(card, forceReAnalysis);
        results.push({ cardId, success: true, result });

        // Her analiz arasında kısa bir bekleme
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Kart ${cardId} analiz hatası:`, error);
        errors.push({
          cardId,
          error: (error as Error).message || "Analiz hatası",
        });
      }
    }

    return NextResponse.json({
      message: `Toplu analiz tamamlandı${
        forceReAnalysis ? " (tekrar analiz dahil)" : ""
      }`,
      total: cardIds.length,
      successful: results.length,
      failed: errors.length,
      results,
      errors,
    });
  } catch (error) {
    console.error("Bulk analysis error:", error);
    return NextResponse.json(
      { error: "Toplu analiz sırasında hata oluştu" },
      { status: 500 }
    );
  }
}

async function analyzeCard(card: any, forceReAnalysis: boolean = false) {
  // Kart görüntüsünü al ve analiz et
  const imagePath = card.imagePath;

  try {
    // OCR ve AI analizi - kategori bilgisini geç
    const analysisResult = await processCardImage(
      imagePath as any,
      card.category
    );

    // Get file stats for intelligent rarity detection
    let fileSize = 0;
    try {
      let fullImagePath;

      // Check if imagePath is already an absolute path
      if (path.isAbsolute(imagePath)) {
        fullImagePath = imagePath;
      } else {
        // If it's a relative path, join with public directory
        fullImagePath = imagePath.startsWith("/uploads/")
          ? path.join(process.cwd(), "public", imagePath)
          : path.join(process.cwd(), "public", "uploads", imagePath);
      }

      const stats = fs.statSync(fullImagePath);
      fileSize = stats.size;
    } catch (error) {
      console.warn("Could not get file stats:", error);
      console.warn("Failed imagePath:", imagePath);
      // Set default file size if we can't get stats
      fileSize = 0;
    }

    // Intelligent rarity detection
    const rarityAnalysis = await detectCardRarity({
      fileName: card.name || path.basename(imagePath),
      fileSize,
      imagePath,
      ocrText: analysisResult.ocrText,
      detectedSeries: analysisResult.cardInfo.series,
      detectedCharacter: analysisResult.cardInfo.character,
    });

    // Use intelligent rarity detection result with higher confidence
    const finalRarity =
      rarityAnalysis.confidence > 70
        ? rarityAnalysis.detectedRarity
        : analysisResult.cardInfo.rarity ||
          card.rarity ||
          rarityAnalysis.detectedRarity;

    // Değer hesaplama with AI estimation
    const valueEstimation = await estimateCardValue({
      rarity: finalRarity,
      condition: card.condition || undefined,
      series: analysisResult.cardInfo.series || card.series || undefined,
      character:
        analysisResult.cardInfo.character || card.character || undefined,
      ocrConfidence: analysisResult.confidence,
    });

    const estimatedValue = valueEstimation.estimatedValue;

    // AI tag'lerini JSON string olarak hazırla
    const aiTags = JSON.stringify({
      series: analysisResult.cardInfo.series,
      character: analysisResult.cardInfo.character,
      rarity: analysisResult.cardInfo.rarity,
      stats: analysisResult.cardInfo.stats,
      extractedAt: new Date().toISOString(),
    });

    // AI analizi sonrası akıllı isimlendirme
    let updatedName = card.name;
    if (analysisResult.cardInfo.name && analysisResult.confidence > 70) {
      // Yüksek güvenilirlik varsa AI'dan gelen ismi kullan
      updatedName = analysisResult.cardInfo.name;
    } else if (
      analysisResult.cardInfo.series &&
      analysisResult.cardInfo.character
    ) {
      // Seri ve karakter bilgisi varsa bunları birleştir
      updatedName = `${analysisResult.cardInfo.series} - ${analysisResult.cardInfo.character}`;
    } else if (analysisResult.cardInfo.series) {
      // Sadece seri bilgisi varsa
      updatedName = analysisResult.cardInfo.series;
    }

    // Generate rarity-aware card properties (NEW SYSTEM) with category
    const cardProperties = await generateRarityAwareCardProperties(
      estimatedValue,
      finalRarity,
      card.id,
      card.fileName || path.basename(imagePath),
      card.category
    );

    // Use OCR-generated stats if available, otherwise use rarity-based properties
    const finalStats = analysisResult.cardInfo.stats || {};
    const finalAttackPower =
      (finalStats as any).attack || cardProperties.attackPower;
    const finalDefense = (finalStats as any).defense || cardProperties.defense;
    const finalSpeed = (finalStats as any).speed || cardProperties.speed;

    console.log(
      `🎮 Generated powers for ${finalRarity}: Attack=${finalAttackPower}, Defense=${finalDefense}, Speed=${finalSpeed}`
    );

    // Calculate proper diamond price using exponential algorithm with card ID for uniqueness
    const diamondPrice = await calculateDiamondPrice(
      finalRarity,
      estimatedValue,
      Math.max(analysisResult.confidence, rarityAnalysis.confidence),
      card.id
    );

    // Enhanced AI tags with rarity analysis
    const enhancedAiTags = JSON.stringify({
      series: analysisResult.cardInfo.series,
      character: analysisResult.cardInfo.character,
      rarity: finalRarity,
      stats: analysisResult.cardInfo.stats,
      rarityAnalysis: {
        detectedRarity: rarityAnalysis.detectedRarity,
        confidence: rarityAnalysis.confidence,
        factors: rarityAnalysis.factors,
        reasoning: rarityAnalysis.reasoning,
      },
      extractedAt: new Date().toISOString(),
    });

    // Veritabanını güncelle
    const updatedCard = await prisma.card.update({
      where: { id: card.id },
      data: {
        name: updatedName,
        series: analysisResult.cardInfo.series || card.series,
        character: analysisResult.cardInfo.character || card.character,
        rarity: finalRarity,
        ocrText: analysisResult.ocrText,
        aiTags: enhancedAiTags,
        story: analysisResult.story, // AI-generated story
        confidence: Math.max(
          analysisResult.confidence,
          rarityAnalysis.confidence
        ),
        estimatedValue: estimatedValue,
        isAnalyzed: true,
        updatedAt: new Date(),
        // Enhanced properties
        cardTitle: cardProperties.cardTitle,
        attackPower: finalAttackPower,
        defense: finalDefense,
        speed: finalSpeed,
        specialAbility: cardProperties.specialAbility,
        element: cardProperties.element,
        rarityLevel: cardProperties.rarityLevel,
        rating: cardProperties.rating,
        // Proper diamond pricing
        diamondPrice: diamondPrice,
      },
    });

    // Analytics kaydı oluştur
    await prisma.analytics.create({
      data: {
        cardId: card.id,
        estimatedValue: estimatedValue,
        views: 1,
      },
    });

    // Kullanılmış ismi kaydet
    await saveUsedCardName(card.id, cardProperties.cardTitle);

    return {
      message: forceReAnalysis
        ? "Kart başarıyla tekrar analiz edildi"
        : "Kart başarıyla analiz edildi",
      card: updatedCard,
      analysis: {
        ocrText: analysisResult.ocrText,
        cardInfo: analysisResult.cardInfo,
        confidence: Math.max(
          analysisResult.confidence,
          rarityAnalysis.confidence
        ),
        estimatedValue: estimatedValue,
        rarityAnalysis: {
          detectedRarity: rarityAnalysis.detectedRarity,
          confidence: rarityAnalysis.confidence,
          factors: rarityAnalysis.factors,
          reasoning: rarityAnalysis.reasoning,
        },
        diamondPrice: diamondPrice,
      },
    };
  } catch (analysisError) {
    console.error("Analysis error:", analysisError);

    // Analiz hatası durumunda kartı hata durumu ile işaretle
    await prisma.card.update({
      where: { id: card.id },
      data: {
        confidence: 0,
        isAnalyzed: true, // Analiz denendi ama başarısız
        updatedAt: new Date(),
      },
    });

    throw new Error("OCR veya AI analizi sırasında hata oluştu");
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get("cardId");

    if (!cardId) {
      return NextResponse.json(
        { error: "Kart ID gereklidir" },
        { status: 400 }
      );
    }

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        analytics: {
          orderBy: { date: "desc" },
          take: 10,
        },
      },
    });

    if (!card) {
      return NextResponse.json({ error: "Kart bulunamadı" }, { status: 404 });
    }

    let parsedAiTags = null;
    if (card.aiTags) {
      try {
        parsedAiTags = JSON.parse(card.aiTags);
      } catch (e) {
        console.warn("Failed to parse AI tags:", e);
      }
    }

    return NextResponse.json({
      card: {
        ...card,
        aiTags: parsedAiTags,
      },
    });
  } catch (error) {
    console.error("Get analysis error:", error);
    return NextResponse.json(
      { error: "Analiz bilgileri getirilirken hata oluştu" },
      { status: 500 }
    );
  }
}
