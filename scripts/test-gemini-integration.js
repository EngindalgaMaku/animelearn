/**
 * Gemini API entegrasyonu test scripti
 * Bu script Gemini API'nin doğru çalışıp çalışmadığını test eder
 */

import { analyzeCardWithGemini } from "./src/lib/ai/gemini-client.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testGeminiIntegration() {
  console.log("🚀 Starting Gemini API integration test...\n");

  // Test 1: API Key kontrolü
  console.log("📋 Test 1: Environment Variables Check");
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey || geminiApiKey === "your_gemini_api_key_here") {
    console.log("❌ GEMINI_API_KEY is not configured properly");
    console.log("🔧 Please set your actual Gemini API key in .env.local");
    console.log("   Get your key from: https://aistudio.google.com/app/apikey");
    return false;
  } else {
    console.log("✅ GEMINI_API_KEY is configured");
  }

  // Test 2: Thumbnail dosya analizi
  console.log("\n📋 Test 2: Thumbnail Image Analysis");
  const thumbnailPath1 = path.join(
    __dirname,
    "public/uploads/thumbs/thumb_07c7bb4c-af3f-4e95-bf2e-54427e2f04d2_1754393274054_2e76.jpg"
  );
  const thumbnailPath2 = path.join(
    __dirname,
    "public/uploads/thumbs/thumb_b36e9814-ec52-41c0-995f-6cf179a00588_1754393172923_rdm5.jpg"
  );

  const testImages = [thumbnailPath1, thumbnailPath2];

  for (let i = 0; i < testImages.length; i++) {
    const imagePath = testImages[i];
    console.log(`\n🖼️  Testing image ${i + 1}: ${path.basename(imagePath)}`);

    try {
      const startTime = Date.now();
      const result = await analyzeCardWithGemini(imagePath);
      const endTime = Date.now();

      console.log("✅ Analysis completed successfully!");
      console.log(`⏱️  Analysis time: ${endTime - startTime}ms`);
      console.log(`🎯 Confidence: ${Math.round(result.confidence * 100)}%`);
      console.log(`🎴 Card Name: ${result.cardInfo.name}`);
      console.log(`📺 Series: ${result.cardInfo.series}`);
      console.log(`👤 Character: ${result.cardInfo.character}`);
      console.log(`💎 Rarity: ${result.cardInfo.rarity}`);
      console.log(`📝 OCR Text: ${result.ocrText.substring(0, 100)}...`);
      console.log(`🧠 Reasoning: ${result.reasoning.join(", ")}`);
    } catch (error) {
      console.log("❌ Analysis failed:", error.message);

      if (error.message.includes("API key")) {
        console.log("🔧 Please check your GEMINI_API_KEY configuration");
        return false;
      } else if (
        error.message.includes("quota") ||
        error.message.includes("limit")
      ) {
        console.log("⚠️  API quota exceeded or rate limit hit");
        console.log("   Please check your Gemini API usage limits");
        return false;
      } else if (error.message.includes("timeout")) {
        console.log("⏰ Request timed out");
        console.log("   This might be a temporary network issue");
      } else {
        console.log("🐛 Unexpected error:", error);
      }
    }
  }

  console.log("\n🎉 Test completed!");
  return true;
}

// Standalone test için async wrapper
async function runTest() {
  try {
    await testGeminiIntegration();
  } catch (error) {
    console.error("💥 Test script failed:", error);
    process.exit(1);
  }
}

// Eğer bu dosya doğrudan çalıştırılıyorsa testi başlat
if (import.meta.url === `file://${process.argv[1]}`) {
  runTest();
}

export { testGeminiIntegration };
