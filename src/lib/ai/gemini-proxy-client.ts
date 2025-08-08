import fs from "fs";
import path from "path";

export interface GeminiAnalysisResult {
  cardInfo: {
    name?: string;
    series?: string;
    character?: string;
    rarity?: string;
    stats?: {
      attack: number;
      defense: number;
      speed: number;
      hp: number;
    };
  };
  confidence: number;
  ocrText: string;
  reasoning: string[];
  story?: string; // AI-generated story based on card image
}

export class GeminiProxyClient {
  private proxyUrl: string = "";
  private apiKey: string = "";
  private readonly maxRetries = 3;
  private readonly requestTimeout = 90000; // 90 saniye timeout (proxy için daha uzun)
  private isAvailable = false;

  constructor() {
    try {
      this.apiKey = process.env.GEMINI_API_KEY || "";
      this.proxyUrl = process.env.GEMINI_PROXY_URL || "";

      if (!this.apiKey || this.apiKey === "your_gemini_api_key_here") {
        console.warn(
          "⚠️ GEMINI_API_KEY is not configured. Falling back to quality analysis."
        );
        this.isAvailable = false;
        return;
      }

      if (!this.proxyUrl) {
        console.warn(
          "⚠️ GEMINI_PROXY_URL is not configured. Falling back to quality analysis."
        );
        this.isAvailable = false;
        return;
      }

      this.isAvailable = true;
      console.log("✅ Gemini Proxy client initialized successfully");
      console.log(`🔗 Using proxy: ${this.proxyUrl}`);
    } catch (error) {
      console.error("❌ Failed to initialize Gemini Proxy client:", error);
      this.isAvailable = false;
    }
  }

  public checkAvailability(): boolean {
    return this.isAvailable && !!this.apiKey && !!this.proxyUrl;
  }

  async analyzeCardImage(
    imagePath: string,
    category?: string
  ): Promise<GeminiAnalysisResult> {
    // API kullanılabilirlik kontrolü
    if (!this.checkAvailability()) {
      throw new Error(
        "Gemini Proxy API is not available. Please check your configuration."
      );
    }

    try {
      console.log(
        "🚀 Starting Gemini Proxy image analysis for:",
        path.basename(imagePath),
        category ? `(Category: ${category})` : ""
      );

      // Dosya varlığını kontrol et
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Image file not found: ${imagePath}`);
      }

      // Dosya boyutu kontrolü (maksimum 20MB)
      const stats = fs.statSync(imagePath);
      if (stats.size > 20 * 1024 * 1024) {
        throw new Error("Image file too large (max 20MB)");
      }

      // Image'ı base64'e çevir
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString("base64");
      const mimeType = this.getMimeType(imagePath);

      console.log(
        `📁 Image loaded: ${(stats.size / 1024).toFixed(1)}KB, type: ${mimeType}`
      );

      // Proxy'e request yap
      const result = await this.callProxyWithRetry(
        base64Image,
        mimeType,
        category
      );

      // Sonucu parse et
      const analysisResult = this.parseResponse(result);

      console.log(
        `✅ Gemini Proxy analysis completed with ${Math.round(analysisResult.confidence * 100)}% confidence`
      );
      return analysisResult;
    } catch (error) {
      console.error("❌ Gemini Proxy analysis error:", error);
      throw error;
    }
  }

  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".bmp": "image/bmp",
    };
    return mimeTypes[ext] || "image/jpeg";
  }

  private async callProxyWithRetry(
    base64Image: string,
    mimeType: string,
    category?: string
  ): Promise<any> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`Gemini Proxy API attempt ${attempt}/${this.maxRetries}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log(
            `⏰ Request timeout after ${this.requestTimeout / 1000}s, aborting...`
          );
          controller.abort();
        }, this.requestTimeout);

        const response = await fetch(`${this.proxyUrl}/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: "gemini-1.5-flash",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: this.buildAnalysisPrompt(category),
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:${mimeType};base64,${base64Image}`,
                    },
                  },
                ],
              },
            ],
            max_tokens: 2048,
            temperature: 0.4,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Proxy API error ${response.status}: ${errorText}`);
        }

        const result = await response.json();

        if (
          !result ||
          !result.choices ||
          !result.choices[0]?.message?.content
        ) {
          throw new Error("Invalid response format from proxy");
        }

        return result.choices[0].message.content;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Gemini Proxy API attempt ${attempt} failed:`, error);

        if (attempt < this.maxRetries) {
          // Longer delay for proxy issues
          const delay = Math.min(3000 * Math.pow(2, attempt - 1), 15000);
          console.log(`Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(
      `Gemini Proxy API failed after ${this.maxRetries} attempts. Last error: ${lastError?.message}`
    );
  }

  private buildAnalysisPrompt(category?: string): string {
    const categoryContext = this.getCategoryContext(category);

    return `
Analyze this ${categoryContext.cardType} trading card image and extract the following information in JSON format:

{
  "cardInfo": {
    "name": "Card name or ${categoryContext.characterType} name",
    "series": "${categoryContext.seriesExample}",
    "character": "Main ${categoryContext.characterType} featured",
    "rarity": "Card rarity (Common, Uncommon, Rare, Super Rare, Ultra Rare, Secret Rare, Legendary)",
    "stats": {
      "attack": number (1-100),
      "defense": number (1-100),
      "speed": number (1-100),
      "hp": number (50-500)
    }
  },
  "confidence": number (0.0-1.0),
  "ocrText": "Any text visible on the card",
  "reasoning": ["Reason 1", "Reason 2", "Reason 3"],
  "story": "A creative and engaging story (150-250 words) based on the ${categoryContext.characterType} and scene in the card image. Write in English language. Include the ${categoryContext.characterType}'s background, their special abilities, and an exciting ${categoryContext.storyContext} scenario that reflects the card's artwork and power level."
}

Instructions:
- Carefully examine all visual elements including artwork, text, borders, and effects
- ${categoryContext.identificationTip}
- Determine rarity based on visual effects (holographic, foil, special borders, etc.)
- Extract any readable text from the card
- Generate reasonable stats based on ${categoryContext.characterType} power level and rarity
- Create an engaging story in English that captures the ${categoryContext.characterType}'s essence and the scene depicted
- The story should be immersive, exciting, and appropriate for the ${categoryContext.characterType}'s power level
- Include details about the ${categoryContext.characterType}'s abilities, personality, and a dramatic scenario
- Provide confidence score based on image clarity and recognizable elements
- Give reasoning for your analysis decisions
- If uncertain about any field, make educated guesses based on visual cues
- Translate any non-English text to English including ${categoryContext.seriesType}/${categoryContext.characterType} names

Return only valid JSON without any additional text or formatting.
`;
  }

  private getCategoryContext(category?: string) {
    const categoryLower = (category || "anime-collection").toLowerCase();

    switch (categoryLower) {
      case "star-collection":
        return {
          cardType: "celebrity star",
          characterType: "celebrity or famous person",
          seriesType: "celebrity collection",
          seriesExample:
            "Star Collection (fictional celebrity cards)",
          identificationTip:
            "Identify fictional celebrity characteristics from appearance and style",
          storyContext: "entertainment or celebrity lifestyle",
        };
      case "car-collection":
        return {
          cardType: "supercar",
          characterType: "vehicle or car model",
          seriesType: "automotive collection",
          seriesExample:
            "Car Collection (supercar and racing vehicle collection)",
          identificationTip:
            "Identify car model, brand, and automotive features",
          storyContext: "racing or automotive excellence",
        };
      case "anime":
      case "anime-collection":
      default:
        return {
          cardType: "anime character",
          characterType: "character",
          seriesType: "anime series",
          seriesExample:
            "Anime series name (e.g., Naruto, Dragon Ball, Pokemon, One Piece, etc.)",
          identificationTip:
            "Identify the anime series from characters, art style, or text",
          storyContext: "adventure or battle",
        };
    }
  }

  private parseResponse(response: string): GeminiAnalysisResult {
    try {
      // JSON'u extract et
      let jsonStr = response.trim();

      // Markdown code block wrapper'larını temizle
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      const parsed = JSON.parse(jsonStr);

      // Validation ve normalization
      return {
        cardInfo: {
          name: parsed.cardInfo?.name || "Unknown Card",
          series: parsed.cardInfo?.series || "Unknown Series",
          character: parsed.cardInfo?.character || "Unknown Character",
          rarity: this.normalizeRarity(parsed.cardInfo?.rarity) || "Common",
          stats: {
            attack: Math.max(
              1,
              Math.min(100, parsed.cardInfo?.stats?.attack || 50)
            ),
            defense: Math.max(
              1,
              Math.min(100, parsed.cardInfo?.stats?.defense || 50)
            ),
            speed: Math.max(
              1,
              Math.min(100, parsed.cardInfo?.stats?.speed || 50)
            ),
            hp: Math.max(50, Math.min(500, parsed.cardInfo?.stats?.hp || 100)),
          },
        },
        confidence: Math.max(0, Math.min(1, parsed.confidence || 0.5)),
        ocrText: parsed.ocrText || "No text detected",
        reasoning: Array.isArray(parsed.reasoning)
          ? parsed.reasoning
          : ["AI analysis completed"],
        story: parsed.story || "This card's story has not been generated yet.",
      };
    } catch (error) {
      console.error("Failed to parse Gemini Proxy response:", error);
      console.log("Raw response:", response);

      // Fallback parsing
      return this.createFallbackFromResponse(response);
    }
  }

  private normalizeRarity(rarity?: string): string {
    if (!rarity) return "Common";

    const normalized = rarity.toLowerCase();
    const rarityMap: Record<string, string> = {
      common: "Common",
      uncommon: "Uncommon",
      rare: "Rare",
      "super rare": "Super Rare",
      sr: "Super Rare",
      "ultra rare": "Ultra Rare",
      ur: "Ultra Rare",
      "secret rare": "Secret Rare",
      scr: "Secret Rare",
      legendary: "Legendary",
      legend: "Legendary",
      mythic: "Legendary",
      epic: "Ultra Rare",
    };

    return rarityMap[normalized] || "Common";
  }

  private createFallbackFromResponse(response: string): GeminiAnalysisResult {
    const extractedText = response.substring(0, 200);

    return {
      cardInfo: {
        name: "Analyzed Card",
        series: "Unknown Series",
        character: "Unknown Character",
        rarity: "Common",
        stats: {
          attack: 40,
          defense: 40,
          speed: 40,
          hp: 80,
        },
      },
      confidence: 0.3,
      ocrText: extractedText,
      reasoning: ["Partial analysis from response text"],
      story:
        "This mysterious card's story is yet to be discovered. Analysis could not be completed, so no story was generated.",
    };
  }

  async testConnection(): Promise<boolean> {
    if (!this.checkAvailability()) {
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(`${this.proxyUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gemini-1.5-flash",
          messages: [
            {
              role: "user",
              content: "Hello, respond with 'OK' if you can hear me.",
            },
          ],
          max_tokens: 100,
          temperature: 0.1,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        const text = result.choices?.[0]?.message?.content || "";
        return text.toLowerCase().includes("ok");
      }

      return false;
    } catch (error) {
      console.error("Gemini Proxy connection test failed:", error);
      return false;
    }
  }
}

// Singleton instance - disabled for deployment
let geminiProxyClient: GeminiProxyClient | null = null;

// Gemini functionality disabled for build stability
export { geminiProxyClient };

// Helper function with availability check - always throws error
export async function analyzeCardWithGeminiProxy(
  imagePath: string,
  category?: string
): Promise<GeminiAnalysisResult> {
  throw new Error("Gemini Proxy API is disabled");
}

// Check if Gemini Proxy is available - always returns false
export function isGeminiProxyAvailable(): boolean {
  return false;
}
