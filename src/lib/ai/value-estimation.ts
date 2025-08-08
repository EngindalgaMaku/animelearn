import { calculateRarityMultiplierSync } from "@/lib/utils";

export interface ValueEstimationData {
  rarity?: string;
  condition?: string;
  series?: string;
  character?: string;
  year?: number;
  ocrConfidence?: number;
  marketData?: {
    averagePrice?: number;
    recentSales?: number[];
    demandLevel?: "low" | "medium" | "high";
  };
}

export interface ValueEstimationResult {
  estimatedValue: number;
  confidence: number;
  factors: {
    baseValue: number;
    rarityMultiplier: number;
    conditionMultiplier: number;
    seriesMultiplier: number;
    marketMultiplier: number;
    confidenceMultiplier: number;
  };
  reasoning: string[];
}

export class ValueEstimationService {
  private baseCardValue = 10; // Base value in TRY

  private conditionMultipliers: Record<string, number> = {
    mint: 1.5,
    "near mint": 1.3,
    excellent: 1.1,
    good: 1.0,
    played: 0.8,
    poor: 0.5,
  };

  private seriesMultipliers: Record<string, number> = {
    pokemon: 1.8,
    "yu-gi-oh!": 1.6,
    "dragon ball": 1.5,
    naruto: 1.4,
    "one piece": 1.4,
    "attack on titan": 1.3,
    "demon slayer": 1.3,
    "my hero academia": 1.2,
  };

  estimateValue(data: ValueEstimationData): ValueEstimationResult {
    const factors = {
      baseValue: this.baseCardValue,
      rarityMultiplier: this.getRarityMultiplier(data.rarity),
      conditionMultiplier: this.getConditionMultiplier(data.condition),
      seriesMultiplier: this.getSeriesMultiplier(data.series),
      marketMultiplier: this.getMarketMultiplier(data.marketData),
      confidenceMultiplier: this.getConfidenceMultiplier(data.ocrConfidence),
    };

    const estimatedValue = Math.round(
      factors.baseValue *
        factors.rarityMultiplier *
        factors.conditionMultiplier *
        factors.seriesMultiplier *
        factors.marketMultiplier *
        factors.confidenceMultiplier
    );

    const confidence = this.calculateConfidence(data, factors);
    const reasoning = this.generateReasoning(data, factors);

    return {
      estimatedValue: Math.max(estimatedValue, 1), // Minimum 1 TRY
      confidence,
      factors,
      reasoning,
    };
  }

  private getRarityMultiplier(rarity?: string): number {
    if (!rarity) return 1;
    return calculateRarityMultiplierSync(rarity);
  }

  private getConditionMultiplier(condition?: string): number {
    if (!condition) return 1;
    const normalizedCondition = condition.toLowerCase();
    return this.conditionMultipliers[normalizedCondition] || 1;
  }

  private getSeriesMultiplier(series?: string): number {
    if (!series) return 1;
    const normalizedSeries = series.toLowerCase();
    return this.seriesMultipliers[normalizedSeries] || 1;
  }

  private getMarketMultiplier(
    marketData?: ValueEstimationData["marketData"]
  ): number {
    if (!marketData) return 1;

    let multiplier = 1;

    // Average price influence
    if (marketData.averagePrice) {
      multiplier *= Math.min(marketData.averagePrice / this.baseCardValue, 5);
    }

    // Demand level influence
    if (marketData.demandLevel) {
      const demandMultipliers = {
        low: 0.8,
        medium: 1.0,
        high: 1.3,
      };
      multiplier *= demandMultipliers[marketData.demandLevel];
    }

    // Recent sales trend
    if (marketData.recentSales && marketData.recentSales.length > 0) {
      const avgRecentPrice =
        marketData.recentSales.reduce((a, b) => a + b, 0) /
        marketData.recentSales.length;
      multiplier *= Math.min(avgRecentPrice / this.baseCardValue, 3);
    }

    return Math.max(multiplier, 0.5); // Minimum 0.5x
  }

  private getConfidenceMultiplier(ocrConfidence?: number): number {
    if (!ocrConfidence) return 0.8; // Lower confidence for unanalyzed cards

    // OCR confidence affects value reliability
    if (ocrConfidence >= 90) return 1.0;
    if (ocrConfidence >= 70) return 0.95;
    if (ocrConfidence >= 50) return 0.9;
    return 0.8;
  }

  private calculateConfidence(data: ValueEstimationData, factors: any): number {
    let confidence = 50; // Base confidence

    // OCR confidence contribution (30%)
    if (data.ocrConfidence) {
      confidence += data.ocrConfidence * 0.3;
    }

    // Data completeness (40%)
    let completeness = 0;
    if (data.rarity) completeness += 25;
    if (data.condition) completeness += 25;
    if (data.series) completeness += 25;
    if (data.character) completeness += 25;

    confidence += completeness * 0.4;

    // Market data availability (20%)
    if (data.marketData?.averagePrice) confidence += 10;
    if (data.marketData?.recentSales?.length) confidence += 10;

    // Rarity clarity (10%)
    if (
      data.rarity &&
      ["ultra rare", "super rare", "rare"].includes(data.rarity.toLowerCase())
    ) {
      confidence += 10;
    }

    return Math.min(Math.round(confidence), 95); // Max 95% confidence
  }

  private generateReasoning(data: ValueEstimationData, factors: any): string[] {
    const reasoning: string[] = [];

    reasoning.push(`Base değer: ₺${factors.baseValue}`);

    if (factors.rarityMultiplier > 1) {
      reasoning.push(
        `Nadir seviye (${data.rarity}): ${factors.rarityMultiplier}x artış`
      );
    }

    if (factors.conditionMultiplier !== 1) {
      const change = factors.conditionMultiplier > 1 ? "artış" : "azalış";
      reasoning.push(
        `Durum (${data.condition}): ${factors.conditionMultiplier}x ${change}`
      );
    }

    if (factors.seriesMultiplier > 1) {
      reasoning.push(
        `Popüler seri (${data.series}): ${factors.seriesMultiplier}x artış`
      );
    }

    if (factors.marketMultiplier > 1) {
      reasoning.push(`Piyasa verisi: ${factors.marketMultiplier}x artış`);
    }

    if (factors.confidenceMultiplier < 1) {
      reasoning.push(
        `OCR güvenilirliği: ${factors.confidenceMultiplier}x düzeltme`
      );
    }

    return reasoning;
  }

  // Batch estimation for multiple cards
  estimateMultipleValues(
    cards: ValueEstimationData[]
  ): ValueEstimationResult[] {
    return cards.map((card) => this.estimateValue(card));
  }

  // Get market trends for a series
  getSeriesTrends(series: string): {
    averageValue: number;
    volatility: number;
    trend: "rising" | "stable" | "falling";
  } {
    // Mock implementation - in real app this would query market data
    const seriesMultiplier = this.getSeriesMultiplier(series);

    return {
      averageValue: this.baseCardValue * seriesMultiplier,
      volatility: Math.random() * 0.3, // 0-30% volatility
      trend:
        seriesMultiplier > 1.3
          ? "rising"
          : seriesMultiplier > 1.1
          ? "stable"
          : "falling",
    };
  }

  // Suggest similar cards for comparison
  findSimilarCards(
    targetCard: ValueEstimationData,
    allCards: ValueEstimationData[]
  ): ValueEstimationData[] {
    return allCards
      .filter(
        (card) =>
          card.series === targetCard.series ||
          card.rarity === targetCard.rarity ||
          card.character === targetCard.character
      )
      .slice(0, 5); // Return top 5 similar cards
  }
}

// Singleton instance
export const valueEstimationService = new ValueEstimationService();

// Helper function for API usage
export async function estimateCardValue(
  cardData: ValueEstimationData
): Promise<ValueEstimationResult> {
  return valueEstimationService.estimateValue(cardData);
}

export async function batchEstimateValues(
  cardsData: ValueEstimationData[]
): Promise<ValueEstimationResult[]> {
  return valueEstimationService.estimateMultipleValues(cardsData);
}
