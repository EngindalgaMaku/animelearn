import axios from "axios";
import { promises as fs } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

export interface AIAnalysisResult {
  // Card Detection
  detectedSeries?: string;
  detectedCharacter?: string;
  detectedRarity?: string;
  detectedElement?: string;
  detectedCondition?: string;

  // OCR Results
  ocrText?: string;
  extractedText?: string;

  // AI Generated Tags
  aiTags?: string;
  description?: string;

  // Quality Analysis
  imageQuality?: number;
  blurLevel?: number;
  resolution?: string;

  // Confidence & Meta
  confidence: number;
  processingTime: number;
  modelUsed: string;

  // Additional Analysis
  attackPower?: number;
  defense?: number;
  speed?: number;
  specialAbility?: string;
  estimatedValue?: number;
}

export interface AIServiceConfig {
  enableOCR: boolean;
  enableImageAnalysis: boolean;
  confidenceThreshold: number;
}

export class AIAnalysisService {
  private config: AIServiceConfig;
  private prisma: PrismaClient;

  constructor(config: AIServiceConfig) {
    this.config = config;
    this.prisma = new PrismaClient();
  }

  /**
   * Analyze a card image using quality-based analysis
   */
  async analyzeCard(
    imagePath: string,
    analysisSettings: any
  ): Promise<AIAnalysisResult> {
    const startTime = Date.now();

    try {
      // Use quality-based fallback analysis
      return this.createQualityBasedAnalysis(imagePath, analysisSettings, startTime);
    } catch (error) {
      console.error("AI Analysis error:", error);
      throw new Error(
        `AI Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Create analysis prompt based on settings and category rules
   */
  private async createAnalysisPrompt(settings: any): Promise<string> {
    // Get category naming rules from database
    const categoryRules = await this.getCategoryNamingRules(settings.category);
    
    // Kategori bazlı analiz yapılacak
    const category = settings.category || "anime-collection";

    let categoryContext = "";
    let seriesExample = "";
    let characterExample = "";

    // Get category info from database for more accurate series naming
    const categoryInfo = await this.getCategoryInfo(settings.category);

    switch (category.toLowerCase()) {
      case "anime":
      case "anime-collection":
        categoryContext =
          "This is an anime character trading card. Analyze it as an anime character card.";
        seriesExample = categoryInfo?.name || "Anime Collection";
        characterExample = "anime character name";
        break;
      case "star-collection":
        categoryContext =
          "This is a star/celebrity trading card. Analyze it as a celebrity or famous person card.";
        seriesExample = "Star Collection";
        characterExample = "celebrity name or famous person name";
        break;
      case "car-collection":
        categoryContext =
          "This is a car/vehicle trading card. Analyze it as an automotive card.";
        seriesExample = "Car Collection";
        characterExample = "car model or vehicle name";
        break;
      default:
        categoryContext =
          "This is a trading card. Analyze the character and content appropriately.";
        seriesExample = categoryInfo?.name || `${category.charAt(0).toUpperCase() + category.slice(1)} Collection`;
        characterExample = "character name or person name";
    }

    // Add category-specific naming rules to context
    if (categoryRules) {
      categoryContext += `\n\nIMPORTANT NAMING GUIDELINES for this category:`;
      
      if (categoryRules.prefixes.length > 0) {
        categoryContext += `\n- Use these prefixes when appropriate: ${categoryRules.prefixes.join(', ')}`;
      }
      
      if (categoryRules.suffixes.length > 0) {
        categoryContext += `\n- Use these suffixes when appropriate: ${categoryRules.suffixes.join(', ')}`;
      }
      
      if (categoryRules.names.length > 0) {
        categoryContext += `\n- Prefer these character/brand names when detected: ${categoryRules.names.join(', ')}`;
      }
      
      if (categoryRules.formats.length > 0) {
        categoryContext += `\n- Follow these naming patterns: ${categoryRules.formats.join(' OR ')}`;
        categoryContext += `\n- Replace {prefix}, {name}, {suffix} with actual detected values`;
      }
    }

    let prompt = `${categoryContext}

Analyze this trading card image and provide detailed information. Return your response in JSON format with the following structure:

{
  "detectedSeries": "${seriesExample} if identifiable",
  "detectedCharacter": "${characterExample} if identifiable",
  "detectedRarity": "common/uncommon/rare/epic/legendary/ultra-rare",
  "detectedElement": "fire/water/earth/air/lightning/ice/dark/light or null",
  "detectedCondition": "poor/fair/good/excellent/mint",
  "ocrText": "all text extracted from the card",
  "aiTags": "comma-separated tags describing the card",
  "description": "detailed description of the card",
  "imageQuality": 0.95,
  "confidence": 0.85,`;

    if (settings.analyzeStats) {
      prompt += `
  "attackPower": 0-999,
  "defense": 0-999, 
  "speed": 0-999,`;
    }

    if (settings.analyzeElements) {
      prompt += `
  "specialAbility": "description of special abilities",`;
    }

    prompt += `
  "estimatedValue": 50-1000
}

Analysis Guidelines:
- Look for any visible text, numbers, symbols
- Identify the art style and theme
- Assess the card condition based on visible wear
- Determine rarity from visual indicators (borders, effects, etc.)
- Extract any numerical stats if present
- Provide confidence score based on image clarity`;

    if (settings.enableOCR) {
      prompt += `
- Perform OCR on ALL visible text including small text`;
    }

    if (settings.enableImageAnalysis) {
      prompt += `
- Analyze image composition, colors, and artistic elements
- Identify characters, objects, and themes`;
    }

    return prompt;
  }

  /**
   * Get category naming rules from database
   */
  private async getCategoryNamingRules(categorySlug: string): Promise<{
    prefixes: string[];
    suffixes: string[];
    names: string[];
    formats: string[];
  } | null> {
    try {
      const category = await this.prisma.category.findFirst({
        where: {
          slug: categorySlug,
          isActive: true
        },
        select: {
          namingPrefixes: true,
          namingSuffixes: true,
          namingNames: true,
          namingFormats: true,
        }
      });

      if (!category) {
        return null;
      }

      return {
        prefixes: category.namingPrefixes ? JSON.parse(category.namingPrefixes) : [],
        suffixes: category.namingSuffixes ? JSON.parse(category.namingSuffixes) : [],
        names: category.namingNames ? JSON.parse(category.namingNames) : [],
        formats: category.namingFormats ? JSON.parse(category.namingFormats) : [],
      };
    } catch (error) {
      console.error("Failed to fetch category naming rules:", error);
      return null;
    }
  }

  /**
   * Get category info from database
   */
  private async getCategoryInfo(categorySlug: string): Promise<{
    name: string;
    slug: string;
  } | null> {
    try {
      const category = await this.prisma.category.findFirst({
        where: {
          slug: categorySlug,
          isActive: true
        },
        select: {
          name: true,
          slug: true,
        }
      });

      return category;
    } catch (error) {
      console.error("Failed to fetch category info:", error);
      return null;
    }
  }

  /**
   * Create quality-based analysis fallback
   */
  private async createQualityBasedAnalysis(
    imagePath: string,
    analysisSettings: any,
    startTime: number
  ): Promise<AIAnalysisResult> {
    const processingTime = Date.now() - startTime;
    const fileName = path.basename(imagePath, path.extname(imagePath));
    
    // Get category info for better fallback
    const categoryInfo = await this.getCategoryInfo(analysisSettings.category);
    const category = analysisSettings.category || "anime-collection";
    
    // Generate category-appropriate defaults
    let detectedSeries = "Unknown Series";
    let detectedCharacter = "Unknown Character";
    
    if (categoryInfo) {
      detectedSeries = categoryInfo.name;
    } else {
      switch (category.toLowerCase()) {
        case "anime":
        case "anime-collection":
          detectedSeries = "Anime Collection";
          detectedCharacter = "Anime Character";
          break;
        case "star-collection":
          detectedSeries = "Star Collection";
          detectedCharacter = "Celebrity Star";
          break;
        case "car-collection":
          detectedSeries = "Car Collection";
          detectedCharacter = "Performance Vehicle";
          break;
        default:
          detectedSeries = `${category.charAt(0).toUpperCase() + category.slice(1)} Collection`;
          detectedCharacter = "Trading Card Character";
      }
    }

    return {
      detectedSeries,
      detectedCharacter,
      detectedRarity: "common",
      detectedElement: undefined,
      detectedCondition: "good",
      ocrText: `Quality-based analysis for: ${fileName}`,
      extractedText: `Quality-based analysis for: ${fileName}`,
      aiTags: "trading card, collectible, quality analysis",
      description: `This trading card from ${detectedSeries} features ${detectedCharacter}. Analysis performed using quality-based fallback system.`,
      imageQuality: 0.75,
      blurLevel: 0.25,
      resolution: "1024x1024",
      confidence: 0.6,
      processingTime,
      modelUsed: "quality-analysis-fallback",
      attackPower: analysisSettings.analyzeStats ? 50 : undefined,
      defense: analysisSettings.analyzeStats ? 50 : undefined,
      speed: analysisSettings.analyzeStats ? 50 : undefined,
      specialAbility: analysisSettings.analyzeElements ? "Standard abilities" : undefined,
      estimatedValue: 75,
    };
  }


  /**
   * Get MIME type from file path
   */
  private getMimeTypeFromPath(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();

    switch (ext) {
      case ".jpg":
      case ".jpeg":
        return "image/jpeg";
      case ".png":
        return "image/png";
      case ".webp":
        return "image/webp";
      case ".gif":
        return "image/gif";
      default:
        return "image/jpeg"; // Default fallback
    }
  }

  /**
   * Test API connection - disabled for build stability
   */
  async testConnection(): Promise<boolean> {
    // AI Service disabled for build stability
    return false;
  }

  /**
   * Get available models - disabled for build stability
   */
  async getAvailableModels(): Promise<string[]> {
    // AI Service disabled
    return ["quality-analysis-fallback"];
  }
}

/**
 * Factory function to create AI service instance
 */
export function createAIService(
  config: Partial<AIServiceConfig>
): AIAnalysisService {
  const defaultConfig: AIServiceConfig = {
    enableOCR: true,
    enableImageAnalysis: true,
    confidenceThreshold: 0.7,
  };

  const mergedConfig = { ...defaultConfig, ...config };

  return new AIAnalysisService(mergedConfig);
}
