// Removed unused fs and path imports
import { assignRarityByDropRate } from "./drop-rate-system";

export interface RarityAnalysis {
  detectedRarity: string;
  confidence: number;
  factors: {
    textPatterns: number;
    visualComplexity: number;
    seriesPopularity: number;
    characterImportance: number;
    fileNameIndicators: number;
    dropRateAssignment?: number; // Add drop rate factor
  };
  reasoning: string[];
  usedDropRates?: boolean; // Indicate if drop rates were used
}

export interface ImageAnalysisData {
  fileName: string;
  fileSize: number;
  imagePath: string;
  ocrText?: string;
  detectedSeries?: string;
  detectedCharacter?: string;
}

export class IntelligentRarityDetector {
  private rarityKeywords = {
    common: ["common", "basic", "normal", "regular", "standard", "base"],
    uncommon: ["uncommon", "enhanced", "improved", "better", "upgraded"],
    rare: ["rare", "special", "limited", "premium", "advanced"],
    "super-rare": ["super rare", "super", "sr", "super-rare"],
    epic: ["epic", "exclusive", "enhanced"],
    "ultra-rare": ["ultra rare", "ultra", "ur", "supreme", "ultimate", "max", "very rare", "elite", "ultra-rare"],
    "secret-rare": ["secret rare", "secret", "scr", "hidden", "mysterious", "secret-rare"],
    legendary: [
      "legendary",
      "legend",
      "mythical",
      "godly",
      "divine",
      "artifact",
    ],
  };

  private seriesPopularity = {
    pokemon: 0.9,
    "yu-gi-oh!": 0.85,
    "dragon ball": 0.8,
    naruto: 0.75,
    "one piece": 0.75,
    "attack on titan": 0.7,
    "demon slayer": 0.7,
    "my hero academia": 0.65,
    "jujutsu kaisen": 0.65,
    bleach: 0.6,
    "hunter x hunter": 0.6,
    "death note": 0.55,
    evangelion: 0.55,
    "sailor moon": 0.5,
  };

  private characterImportance = {
    // Main protagonists
    goku: 0.95,
    "naruto uzumaki": 0.9,
    luffy: 0.9,
    pikachu: 0.95,
    "ichigo kurosaki": 0.85,
    "yugi muto": 0.9,
    "eren yeager": 0.8,
    "tanjiro kamado": 0.8,
    "izuku midoriya": 0.75,
    "yuji itadori": 0.75,

    // Major antagonists
    vegeta: 0.85,
    "sasuke uchiha": 0.8,
    frieza: 0.8,
    "kaiba seto": 0.8,
    aizen: 0.75,
    "levi ackerman": 0.8,
    muzan: 0.75,

    // Supporting characters
    "sakura haruno": 0.5,
    gohan: 0.6,
    zoro: 0.7,
    sanji: 0.65,
    nami: 0.6,
  };

  private visualComplexityIndicators = [
    "holographic",
    "foil",
    "shiny",
    "metallic",
    "rainbow",
    "prismatic",
    "gold",
    "silver",
    "chrome",
    "crystal",
    "diamond",
    "platinum",
    "glowing",
    "sparkle",
    "shine",
    "mirror",
    "reflection",
  ];

  async detectRarity(analysisData: ImageAnalysisData): Promise<RarityAnalysis> {
    const factors: {
      textPatterns: number;
      visualComplexity: number;
      seriesPopularity: number;
      characterImportance: number;
      fileNameIndicators: number;
      dropRateAssignment?: number;
    } = {
      textPatterns: this.analyzeTextPatterns(analysisData),
      visualComplexity: this.analyzeVisualComplexity(analysisData),
      seriesPopularity: this.analyzeSeriesPopularity(
        analysisData.detectedSeries
      ),
      characterImportance: this.analyzeCharacterImportance(
        analysisData.detectedCharacter
      ),
      fileNameIndicators: this.analyzeFileNameIndicators(analysisData.fileName),
    };

    const rarityScore = this.calculateRarityScore(factors);
    const traditionalRarity = this.mapScoreToRarity(rarityScore);

    // NEW: Use drop rate system for probabilistic assignment
    try {
      const qualityScore = rarityScore * 100; // Convert to 0-100 scale
      console.log(`🎲 Calling assignRarityByDropRate with qualityScore: ${qualityScore}, seed: ${analysisData.fileName}`);
      const dropRateRarity = await assignRarityByDropRate(
        qualityScore,
        analysisData.fileName // Use filename as seed for consistency
      );
      console.log(`🎲 Drop rate rarity result: ${dropRateRarity}`);

      // Calculate confidence - higher if both methods agree
      const methodsAgree = traditionalRarity === dropRateRarity;
      const baseConfidence = this.calculateConfidence(factors, rarityScore);
      const finalConfidence = methodsAgree
        ? baseConfidence + 15
        : baseConfidence;

      // Add drop rate factor to factors
      factors.dropRateAssignment = qualityScore;

      const reasoning = this.generateReasoning(
        factors,
        dropRateRarity,
        true,
        methodsAgree
      );

      console.log(
        `🎲 Rarity assignment: Traditional=${traditionalRarity}, DropRate=${dropRateRarity}, Final=${dropRateRarity}`
      );

      return {
        detectedRarity: dropRateRarity,
        confidence: Math.min(95, finalConfidence),
        factors,
        reasoning,
        usedDropRates: true,
      };
    } catch (error) {
      console.warn(
        "⚠️ Drop rate assignment failed, using traditional method:",
        error
      );

      // Fallback to traditional method
      const confidence = this.calculateConfidence(factors, rarityScore);
      const reasoning = this.generateReasoning(
        factors,
        traditionalRarity,
        false
      );

      return {
        detectedRarity: traditionalRarity,
        confidence,
        factors,
        reasoning,
        usedDropRates: false,
      };
    }
  }

  private analyzeTextPatterns(data: ImageAnalysisData): number {
    const text = (data.ocrText || data.fileName || "").toLowerCase();
    let score = 0.2 + Math.random() * 0.6; // Random base score between 0.2-0.8 for better distribution

    // Check for explicit rarity keywords
    for (const [rarity, keywords] of Object.entries(this.rarityKeywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          // Higher rarity keywords give higher scores (based on database levels)
          const rarityValues = {
            common: 0.15,
            uncommon: 0.35,
            rare: 0.55,
            "super-rare": 0.70,
            epic: 0.80,
            "ultra-rare": 0.88,
            "secret-rare": 0.93,
            legendary: 0.98,
          };
          score = Math.max(
            score,
            rarityValues[rarity as keyof typeof rarityValues] || 0.3
          );
        }
      }
    }

    // Check for numbers that might indicate rarity (like edition numbers)
    const editionMatch = text.match(/(\d+)\/(\d+)/);
    if (editionMatch) {
      const cardNumber = parseInt(editionMatch[1]);
      const totalCards = parseInt(editionMatch[2]);
      // Lower numbers in a set are often rarer
      if (cardNumber <= totalCards * 0.1) score += 0.3;
      else if (cardNumber <= totalCards * 0.25) score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  private analyzeVisualComplexity(data: ImageAnalysisData): number {
    let score = 0.2 + Math.random() * 0.6; // Random base score between 0.2-0.8 for better distribution

    // File size analysis (larger files might indicate more complex artwork)
    if (data.fileSize > 5 * 1024 * 1024)
      score += 0.2; // >5MB
    else if (data.fileSize > 2 * 1024 * 1024) score += 0.1; // >2MB

    // Check filename for visual effect indicators
    const fileName = data.fileName.toLowerCase();
    for (const indicator of this.visualComplexityIndicators) {
      if (fileName.includes(indicator)) {
        score += 0.15;
      }
    }

    // Special effect patterns in filename
    if (fileName.includes("alt") || fileName.includes("alternative"))
      score += 0.1;
    if (fileName.includes("promo") || fileName.includes("promotional"))
      score += 0.2;
    if (fileName.includes("first") || fileName.includes("1st")) score += 0.15;

    return Math.min(score, 1.0);
  }

  private analyzeSeriesPopularity(series?: string): number {
    if (!series) return 0.3 + Math.random() * 0.5; // Random between 0.3-0.8 if no series detected

    const normalizedSeries = series.toLowerCase();
    const popularity =
      this.seriesPopularity[
        normalizedSeries as keyof typeof this.seriesPopularity
      ] || 0.3;

    // Popular series have higher chance of rare cards
    return popularity;
  }

  private analyzeCharacterImportance(character?: string): number {
    if (!character) return 0.25 + Math.random() * 0.55; // Random between 0.25-0.8 if no character detected

    const normalizedCharacter = character.toLowerCase();
    const importance =
      this.characterImportance[
        normalizedCharacter as keyof typeof this.characterImportance
      ] || 0.3;

    // Important characters are more likely to be rare
    return importance;
  }

  private analyzeFileNameIndicators(fileName: string): number {
    const name = fileName.toLowerCase();
    let score = 0.2 + Math.random() * 0.4; // Random base between 0.2-0.6 for better distribution

    // Special editions and variants
    if (name.includes("special")) score += 0.2;
    if (name.includes("limited")) score += 0.25;
    if (name.includes("exclusive")) score += 0.3;
    if (name.includes("promo")) score += 0.2;
    if (name.includes("tournament")) score += 0.15;
    if (name.includes("championship")) score += 0.25;

    // Anniversary and milestone cards
    if (name.includes("anniversary")) score += 0.2;
    if (name.includes("milestone")) score += 0.15;
    if (name.includes("commemorative")) score += 0.2;

    return Math.min(score, 1.0);
  }

  private calculateRarityScore(factors: {
    textPatterns: number;
    visualComplexity: number;
    seriesPopularity: number;
    characterImportance: number;
    fileNameIndicators: number;
  }): number {
    // Weighted average of all factors
    const weights = {
      textPatterns: 0.3,
      visualComplexity: 0.2,
      seriesPopularity: 0.2,
      characterImportance: 0.2,
      fileNameIndicators: 0.1,
    };

    let score = 0;
    for (const [factor, value] of Object.entries(factors)) {
      score += (value as number) * weights[factor as keyof typeof weights];
    }

    return Math.min(score, 1.0);
  }

  private mapScoreToRarity(score: number): string {
    // Updated to match database rarity system (8 levels)
    if (score >= 0.9) return "legendary";        // Level 8 (0.5%)
    if (score >= 0.8) return "secret-rare";      // Level 7 (1%)
    if (score >= 0.7) return "ultra-rare";       // Level 6 (2%)
    if (score >= 0.6) return "epic";             // Level 5 (4%)
    if (score >= 0.5) return "super-rare";       // Level 4 (7%)
    if (score >= 0.35) return "rare";            // Level 3 (15%)
    if (score >= 0.2) return "uncommon";         // Level 2 (25%)
    return "common";                             // Level 1 (45%)
  }

  private calculateConfidence(
    factors: {
      textPatterns: number;
      visualComplexity: number;
      seriesPopularity: number;
      characterImportance: number;
      fileNameIndicators: number;
    },
    _rarityScore: number
  ): number {
    let confidence = 50; // Base confidence

    // Text pattern confidence boost
    if (factors.textPatterns > 0.7) confidence += 25;
    else if (factors.textPatterns > 0.5) confidence += 15;
    else if (factors.textPatterns > 0.3) confidence += 10;

    // Series and character data boost
    if (factors.seriesPopularity > 0.6 && factors.characterImportance > 0.6) {
      confidence += 20;
    } else if (
      factors.seriesPopularity > 0.4 ||
      factors.characterImportance > 0.4
    ) {
      confidence += 10;
    }

    // Visual complexity indicators
    if (factors.visualComplexity > 0.6) confidence += 15;

    // Consistency bonus (if multiple factors agree)
    const factorValues = Object.values(factors) as number[];
    const variance = this.calculateVariance(factorValues);
    if (variance < 0.1) confidence += 10; // Low variance = high consistency

    return Math.min(Math.round(confidence), 95);
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map((value) => Math.pow(value - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  private generateReasoning(
    factors: {
      textPatterns: number;
      visualComplexity: number;
      seriesPopularity: number;
      characterImportance: number;
      fileNameIndicators: number;
      dropRateAssignment?: number;
    },
    rarity: string,
    usedDropRates: boolean = false,
    methodsAgree?: boolean
  ): string[] {
    const reasoning: string[] = [];

    if (usedDropRates) {
      reasoning.push(
        `🎲 Assigned rarity: ${rarity.charAt(0).toUpperCase() + rarity.slice(1)} (using drop rate system)`
      );

      if (methodsAgree === true) {
        reasoning.push("✅ Traditional and drop rate methods agree");
      } else if (methodsAgree === false) {
        reasoning.push(
          "⚖️ Drop rate system overrode traditional analysis for better balance"
        );
      }

      if (factors.dropRateAssignment) {
        reasoning.push(
          `📊 Quality score: ${factors.dropRateAssignment.toFixed(1)}/100`
        );
      }
    } else {
      reasoning.push(
        `⚙️ Detected rarity: ${rarity.charAt(0).toUpperCase() + rarity.slice(1)} (traditional method)`
      );
    }

    if (factors.textPatterns > 0.7) {
      reasoning.push("Strong rarity indicators found in text/filename");
    } else if (factors.textPatterns > 0.5) {
      reasoning.push("Moderate rarity indicators found in text");
    }

    if (factors.seriesPopularity > 0.7) {
      reasoning.push("High-popularity series increases rarity potential");
    }

    if (factors.characterImportance > 0.7) {
      reasoning.push("Important character increases rarity likelihood");
    }

    if (factors.visualComplexity > 0.6) {
      reasoning.push("Visual complexity indicators suggest higher rarity");
    }

    if (factors.fileNameIndicators > 0.5) {
      reasoning.push("Special edition indicators found in filename");
    }

    return reasoning;
  }
}

// Export singleton instance
export const intelligentRarityDetector = new IntelligentRarityDetector();

// Helper function for easy usage
export async function detectCardRarity(
  analysisData: ImageAnalysisData
): Promise<RarityAnalysis> {
  return intelligentRarityDetector.detectRarity(analysisData);
}
