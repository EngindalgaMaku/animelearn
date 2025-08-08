import { NextResponse } from "next/server";
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Filter parameters
    const search = searchParams.get("search") || "";
    const series = searchParams.get("series") || "";
    const rarity = searchParams.get("rarity") || "";
    const category = searchParams.get("category") || "";
    const element = searchParams.get("element") || "";
    const analyzed = searchParams.get("analyzed") || "";

    // Build where condition based on filters
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { cardTitle: { contains: search, mode: "insensitive" } },
        { series: { contains: search, mode: "insensitive" } },
        { character: { contains: search, mode: "insensitive" } },
        { specialAbility: { contains: search, mode: "insensitive" } },
      ];
    }

    if (series) where.series = series;
    if (rarity) where.rarity = rarity;
    if (category) where.category = category;
    if (element) where.element = element;
    if (analyzed === "analyzed") where.isAnalyzed = true;
    if (analyzed === "pending") where.isAnalyzed = false;

    // Temel istatistikleri hesapla (filtered)
    const totalCards = await prisma.card.count({ where });

    const analyzedCards = await prisma.card.count({
      where: { ...where, isAnalyzed: true },
    });

    // Toplam değer hesaplama
    const valueAggregation = await prisma.card.aggregate({
      _sum: {
        estimatedValue: true,
      },
      _avg: {
        estimatedValue: true,
      },
      where: {
        estimatedValue: { gt: 0 },
      },
    });

    // Benzersiz anime serisi sayısı
    const uniqueSeries = await prisma.card.findMany({
      select: { series: true },
      where: {
        series: { not: null },
        isAnalyzed: true,
      },
      distinct: ["series"],
    });

    // Son yüklenen kartlar
    const recentUploads = await prisma.card.findMany({
      orderBy: { uploadDate: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        series: true,
        character: true,
        imageUrl: true,
        uploadDate: true,
        isAnalyzed: true,
        estimatedValue: true,
      },
    });

    // Rarity dağılımı
    const rarityDistribution = await prisma.card.groupBy({
      by: ["rarity"],
      _count: {
        rarity: true,
      },
      where: {
        rarity: { not: null },
        isAnalyzed: true,
      },
    });

    // Haftalık yükleme trendi
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyUploads = await prisma.card.count({
      where: {
        uploadDate: { gte: oneWeekAgo },
      },
    });

    // En değerli kartlar
    const topValueCards = await prisma.card.findMany({
      where: {
        estimatedValue: { gt: 0 },
      },
      orderBy: { estimatedValue: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        series: true,
        estimatedValue: true,
        imageUrl: true,
      },
    });

    const stats = {
      totalCards,
      analyzedCards,
      totalValue: valueAggregation._sum.estimatedValue || 0,
      averageValue: valueAggregation._avg.estimatedValue || 0,
      seriesCount: uniqueSeries.length,
      recentUploads,
      weeklyUploads,
      rarityDistribution: rarityDistribution.map((item) => ({
        rarity: item.rarity,
        count: item._count.rarity,
      })),
      topValueCards,
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Dashboard verileri getirilirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Action parameter kontrolü
    if (body.action !== "bulkAnalyze") {
      return NextResponse.json(
        { error: "Geçersiz action parametresi" },
        { status: 400 }
      );
    }

    const { forceReAnalysis } = body;

    // Tüm kartları analiz etme endpoint'i
    const cardsToAnalyze = await prisma.card.findMany({
      where: forceReAnalysis ? {} : { isAnalyzed: false },
      select: { id: true },
    });

    if (cardsToAnalyze.length === 0) {
      return NextResponse.json({
        message: "Analiz edilecek kart bulunamadı",
        analyzedCount: 0,
      });
    }

    // Her kartı doğrudan analiz et
    const results = [];
    const totalCards = cardsToAnalyze.length;

    console.log(
      `${
        forceReAnalysis
          ? "Tüm kartları tekrar analiz ediliyor"
          : "Analiz edilmemiş kartlar analiz ediliyor"
      }: ${totalCards} kart`
    );

    for (const cardData of cardsToAnalyze) {
      try {
        // Tam kart bilgisini al
        const card = await prisma.card.findUnique({
          where: { id: cardData.id },
        });

        if (!card) {
          results.push({
            cardId: cardData.id,
            status: "failed",
            error: "Kart bulunamadı",
          });
          continue;
        }

        // Kartı analyze et
        const analysisResult = await analyzeCardDirect(card, forceReAnalysis);
        results.push({
          cardId: card.id,
          status: "success",
          analysis: analysisResult,
        });

        // Her analiz arasında kısa bekleme
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        results.push({
          cardId: cardData.id,
          status: "error",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Direct analysis function (copied from analyze route)
    async function analyzeCardDirect(
      card: any,
      forceReAnalysis: boolean = false
    ) {
      const imagePath = card.imagePath;

      try {
        // OCR ve AI analizi
        const analysisResult = await processCardImage(imagePath as any);

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

        // AI analizi sonrası akıllı isimlendirme
        let updatedName = card.name;
        if (analysisResult.cardInfo.name && analysisResult.confidence > 70) {
          updatedName = analysisResult.cardInfo.name;
        } else if (
          analysisResult.cardInfo.series &&
          analysisResult.cardInfo.character
        ) {
          updatedName = `${analysisResult.cardInfo.series} - ${analysisResult.cardInfo.character}`;
        } else if (analysisResult.cardInfo.series) {
          updatedName = analysisResult.cardInfo.series;
        }

        // Generate rarity-aware card properties (NEW SYSTEM)
        const cardProperties = await generateRarityAwareCardProperties(
          estimatedValue,
          finalRarity,
          card.id,
          card.fileName || path.basename(imagePath)
        );

        console.log(
          `🎮 Dashboard bulk analysis - Generated powers for ${finalRarity}: Attack=${cardProperties.attackPower}, Defense=${cardProperties.defense}, Speed=${cardProperties.speed}`
        );

        // Calculate proper diamond price using exponential algorithm with card ID for uniqueness
        const diamondPrice = await calculateDiamondPrice(
          finalRarity,
          estimatedValue,
          Math.max(analysisResult.confidence, rarityAnalysis.confidence),
          card.id
        );

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
            confidence: Math.max(
              analysisResult.confidence,
              rarityAnalysis.confidence
            ),
            estimatedValue: estimatedValue,
            isAnalyzed: true,
            updatedAt: new Date(),
            // Enhanced properties
            cardTitle: cardProperties.cardTitle,
            attackPower: cardProperties.attackPower,
            defense: cardProperties.defense,
            speed: cardProperties.speed,
            specialAbility: cardProperties.specialAbility,
            element: cardProperties.element,
            rarityLevel: cardProperties.rarityLevel,
            rating: cardProperties.rating,
            // Proper diamond pricing using exponential algorithm
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
            confidence: analysisResult.confidence,
            estimatedValue: estimatedValue,
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

    const successCount = results.filter((r) => r.status === "success").length;

    return NextResponse.json({
      message: forceReAnalysis
        ? `${successCount} kart başarıyla tekrar analiz edildi`
        : `${successCount} kart başarıyla analiz edildi`,
      analyzedCount: successCount,
      totalAttempted: results.length,
      forceReAnalysis,
      results,
    });
  } catch (error) {
    console.error("Bulk analyze error:", error);
    return NextResponse.json(
      { error: "Toplu analiz sırasında hata oluştu" },
      { status: 500 }
    );
  }
}
