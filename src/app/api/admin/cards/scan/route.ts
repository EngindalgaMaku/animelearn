import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

interface FileInfo {
  filePath: string;
  fileName: string;
  element: string;
  relativePath: string;
  absolutePath: string;
  stats?: {
    size: number;
    birthtime: Date;
    mtime: Date;
  };
}

interface ScanResult {
  totalFiles: number;
  newFiles: number;
  existingFiles: number;
  missingCards: FileInfo[];
  skippedFiles: string[];
  errors: string[];
}

// Helper function to generate file hash
async function generateFileHash(filePath: string): Promise<string> {
  try {
    const fileBuffer = await fs.readFile(filePath);
    return crypto.createHash("md5").update(fileBuffer).digest("hex");
  } catch (error) {
    console.error(`Error generating hash for ${filePath}:`, error);
    return "";
  }
}

// Helper function to scan directory recursively
async function scanCardsDirectory(
  dirPath: string
): Promise<{ files: FileInfo[]; errors: string[] }> {
  const files: FileInfo[] = [];
  const errors: string[] = [];

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Skip thumbnail directories and placeholder files
        if (
          entry.name !== "placeholder.txt" &&
          entry.name !== "thumbs" &&
          !entry.name.includes("thumbnail") &&
          !entry.name.includes("thumb")
        ) {
          const subResult = await scanCardsDirectory(fullPath);
          files.push(...subResult.files);
          errors.push(...subResult.errors);
        }
      } else if (entry.isFile()) {
        // Skip placeholder files, thumbnail files, and non-image files
        if (
          entry.name === "placeholder.jpg" ||
          entry.name === "placeholder.txt" ||
          entry.name.startsWith("thumb_") ||
          entry.name.includes("thumbnail") ||
          entry.name.includes("thumb") ||
          fullPath.includes("/thumbs/") ||
          fullPath.includes("\\thumbs\\")
        ) {
          continue;
        }

        // Only process image files
        const ext = path.extname(entry.name).toLowerCase();
        if (![".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) {
          continue;
        }

        try {
          const stats = await fs.stat(fullPath);
          const relativePath = path.relative(
            path.join(process.cwd(), "public"),
            fullPath
          );
          const urlPath = "/" + relativePath.replace(/\\/g, "/");

          // Determine element from folder structure or filename
          const pathParts = relativePath.split(path.sep);
          let element = "neutral";

          if (pathParts.length >= 2 && pathParts[0] === "cards") {
            // For files in /public/cards structure
            const elementFolder = pathParts[1];
            if (
              [
                "air",
                "earth",
                "fire",
                "light",
                "neutral",
                "shadow",
                "water",
              ].includes(elementFolder)
            ) {
              element = elementFolder;
            }
          } else if (pathParts.length >= 1 && pathParts[0] === "uploads") {
            // For files in /public/uploads, try to detect element from filename
            const fileNameLower = entry.name.toLowerCase();
            if (
              fileNameLower.includes("fire") ||
              fileNameLower.includes("flame")
            ) {
              element = "fire";
            } else if (
              fileNameLower.includes("water") ||
              fileNameLower.includes("aqua")
            ) {
              element = "water";
            } else if (
              fileNameLower.includes("earth") ||
              fileNameLower.includes("ground")
            ) {
              element = "earth";
            } else if (
              fileNameLower.includes("air") ||
              fileNameLower.includes("wind")
            ) {
              element = "air";
            } else if (
              fileNameLower.includes("light") ||
              fileNameLower.includes("holy")
            ) {
              element = "light";
            } else if (
              fileNameLower.includes("shadow") ||
              fileNameLower.includes("dark")
            ) {
              element = "shadow";
            }
            // Default to neutral for uploaded files without element indicators
          }

          files.push({
            filePath: fullPath,
            fileName: entry.name,
            element,
            relativePath: urlPath,
            absolutePath: fullPath,
            stats: {
              size: stats.size,
              birthtime: stats.birthtime,
              mtime: stats.mtime,
            },
          });
        } catch (statError) {
          errors.push(`Failed to get stats for ${fullPath}: ${statError}`);
        }
      }
    }
  } catch (error) {
    errors.push(`Failed to read directory ${dirPath}: ${error}`);
  }

  return { files, errors };
}

// Helper function to determine card details from filename and path
function generateCardDetails(fileInfo: FileInfo): {
  name: string;
  series: string;
  character: string;
  category: string;
  rarity: string;
  diamondPrice: number;
} {
  const { fileName, relativePath, element } = fileInfo;
  const baseName = path.parse(fileName).name;

  // Extract category from path for new category-based structure
  const pathParts = relativePath.split("/");
  let detectedCategory = "anime-collection"; // default
  let categoryFromPath = "";

  // Check if it's in the new category-based structure: /uploads/categories/{category-slug}/
  if (pathParts.includes("categories") && pathParts.length >= 4) {
    const categoryIndex = pathParts.indexOf("categories");
    if (categoryIndex >= 0 && pathParts[categoryIndex + 1]) {
      categoryFromPath = pathParts[categoryIndex + 1];
      detectedCategory = categoryFromPath;
    }
  }

  // Extract number from filename for unique naming
  const numberMatch = baseName.match(/(\d+)$/);
  const cardNumber = numberMatch
    ? numberMatch[1]
    : Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");

  // Category-based card generation
  const categoryConfigs = {
    "anime-collection": {
      series: "Anime Collection",
      names: [
        "Akira",
        "Yuki",
        "Sakura",
        "Hiro",
        "Rei",
        "Sora",
        "Kyo",
        "Rin",
        "Natsu",
        "Lucy",
      ],
      prefixes: [
        "Guardian",
        "Master",
        "Champion",
        "Hero",
        "Warrior",
        "Knight",
        "Spirit",
        "Dragon",
      ],
      suffixes: [
        "Guardian",
        "Master",
        "Champion",
        "Hero",
        "Warrior",
        "Spirit",
        "Soul",
        "Heart",
      ],
    },
    "star-collection": {
      series: "Star Collection",
      names: [
        "Leo",
        "Brad",
        "Tom",
        "Will",
        "Denzel",
        "Robert",
        "Chris",
        "Ryan",
        "Johnny",
        "Morgan",
      ],
      prefixes: [
        "Legend",
        "Icon",
        "Superstar",
        "Celebrity",
        "Famous",
        "Renowned",
        "Acclaimed",
      ],
      suffixes: [
        "Legend",
        "Icon",
        "Superstar",
        "Celebrity",
        "Star",
        "Fame",
        "Glory",
      ],
    },
    "car-collection": {
      series: "Car Collection",
      names: [
        "GT",
        "RS",
        "R",
        "S",
        "M",
        "AMG",
        "Type R",
        "STI",
        "Evo",
        "Turbo",
      ],
      prefixes: [
        "Ferrari",
        "Lamborghini",
        "Porsche",
        "McLaren",
        "BMW",
        "Mercedes",
        "Audi",
      ],
      suffixes: [
        "GT",
        "RS",
        "R",
        "S",
        "Edition",
        "Special",
        "Performance",
        "Ultimate",
      ],
    },
  };

  // Use detected category or fallback to anime-collection
  const config =
    categoryConfigs[detectedCategory as keyof typeof categoryConfigs] ||
    categoryConfigs["anime-collection"];

  // Generate unique character name
  const nameIndex = parseInt(cardNumber) % config.names.length;
  const prefixIndex = parseInt(cardNumber) % config.prefixes.length;
  const suffixIndex = (parseInt(cardNumber) + 1) % config.suffixes.length;

  const characterName = config.names[nameIndex];
  const prefix = config.prefixes[prefixIndex];
  const suffix = config.suffixes[suffixIndex];

  // Generate card name with variety
  const nameFormats = [
    `${prefix} ${characterName}`,
    `${characterName} the ${suffix}`,
    `${characterName} ${suffix}`,
    `${prefix} of ${characterName}`,
  ];
  const nameFormat = nameFormats[parseInt(cardNumber) % nameFormats.length];

  // Determine rarity based on card number and some randomness
  const num = parseInt(cardNumber);
  let rarity = "common";
  const rarityRoll = num % 100;

  if (rarityRoll <= 1)
    rarity = "legendary"; // 1%
  else if (rarityRoll <= 3)
    rarity = "secret rare"; // 2%
  else if (rarityRoll <= 6)
    rarity = "ultra rare"; // 3%
  else if (rarityRoll <= 11)
    rarity = "super rare"; // 5%
  else if (rarityRoll <= 21)
    rarity = "epic"; // 10%
  else if (rarityRoll <= 36)
    rarity = "rare"; // 15%
  else if (rarityRoll <= 56) rarity = "uncommon"; // 20%
  // else common (44%)

  // Calculate diamond price based on rarity
  const rarityPriceMap = {
    common: 25,
    uncommon: 65,
    rare: 150,
    epic: 350,
    "super rare": 650,
    "ultra rare": 1200,
    "secret rare": 2200,
    legendary: 4500,
  };

  const baseDiamondPrice =
    rarityPriceMap[rarity as keyof typeof rarityPriceMap] || 25;
  // Add some variation (±20%)
  const variation = 0.8 + Math.random() * 0.4;
  const diamondPrice = Math.round(baseDiamondPrice * variation);

  return {
    name: nameFormat,
    series: config.series,
    character: characterName,
    category: detectedCategory,
    rarity,
    diamondPrice,
  };
}

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Starting card directory scan...");

    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Check if uploads directory exists
    try {
      await fs.access(uploadsDir);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Uploads directory not found at /public/uploads",
        },
        { status: 404 }
      );
    }

    // Scan the uploads directory (this includes categories subdirectory automatically)
    const { files, errors } = await scanCardsDirectory(uploadsDir);

    // Remove any duplicate files that might have been found
    const uniqueFiles = files.filter(
      (file, index, self) =>
        index === self.findIndex((f) => f.absolutePath === file.absolutePath)
    );

    console.log(
      `📁 Found ${uniqueFiles.length} unique card files after deduplication`
    );

    const allFiles = uniqueFiles;
    const allErrors = errors;

    console.log(`📁 Total found ${allFiles.length} card files`);

    // Get existing cards from database
    const existingCards = await prisma.card.findMany({
      select: {
        id: true,
        fileName: true,
        imagePath: true,
        imageUrl: true,
        fileHash: true,
        name: true,
      },
    });

    console.log(`💾 Found ${existingCards.length} cards in database`);

    // Find missing cards (files that exist but not in database)
    const missingCards: any[] = [];
    const skippedFiles: string[] = [];

    for (const file of allFiles) {
      // Check if card already exists by filename or path
      const existingCard = existingCards.find(
        (card) =>
          card.fileName === file.fileName ||
          card.imagePath === file.relativePath ||
          card.imageUrl === file.relativePath
      );

      if (!existingCard) {
        // Generate card details for preview in frontend
        const cardDetails = generateCardDetails(file);
        missingCards.push({
          ...file,
          generatedName: cardDetails.name,
          rarity: cardDetails.rarity,
          diamondPrice: cardDetails.diamondPrice,
          category: cardDetails.category,
          series: cardDetails.series,
          character: cardDetails.character,
          imageUrl: file.relativePath, // Frontend expects this for preview
        });
      } else {
        skippedFiles.push(file.fileName);
      }
    }

    console.log(`✨ Found ${missingCards.length} missing cards`);

    const result: ScanResult = {
      totalFiles: allFiles.length,
      newFiles: missingCards.length,
      existingFiles: skippedFiles.length,
      missingCards,
      skippedFiles,
      errors: allErrors,
    };

    return NextResponse.json({
      success: true,
      message: `Scan completed. Found ${result.newFiles} new cards out of ${result.totalFiles} total files.`,
      data: result,
    });
  } catch (error) {
    console.error("❌ Card scan failed:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { files, options = {} } = body;

    if (!files || !Array.isArray(files)) {
      return NextResponse.json(
        {
          success: false,
          error: "Files array is required",
        },
        { status: 400 }
      );
    }

    console.log(`🚀 Starting import of ${files.length} cards...`);

    const results = {
      imported: [] as any[],
      failed: [] as any[],
      skipped: [] as any[],
    };

    for (const fileInfo of files) {
      try {
        // Check if card already exists
        const existingCard = await prisma.card.findFirst({
          where: {
            OR: [
              { fileName: fileInfo.fileName },
              { imagePath: fileInfo.relativePath },
              { imageUrl: fileInfo.relativePath },
            ],
          },
        });

        if (existingCard) {
          results.skipped.push({
            fileName: fileInfo.fileName,
            reason: "Card already exists in database",
          });
          continue;
        }

        // Generate file hash
        const fileHash = await generateFileHash(fileInfo.absolutePath);

        // Generate card details (now includes diamondPrice)
        const cardDetails = generateCardDetails(fileInfo);

        // Create card in database
        const newCard = await prisma.card.create({
          data: {
            name: cardDetails.name,
            series: cardDetails.series,
            character: cardDetails.character,
            category: cardDetails.category,
            rarity: cardDetails.rarity,
            element: fileInfo.element,
            condition: "Good",
            estimatedValue: cardDetails.diamondPrice,
            diamondPrice: cardDetails.diamondPrice,
            imagePath: fileInfo.relativePath,
            imageUrl: fileInfo.relativePath,
            fileName: fileInfo.fileName,
            fileSize: fileInfo.stats?.size || 0,
            fileHash,
            isAnalyzed: false,
            isVerified: false,
            confidence: 80.0,
            isPublic: true,
            isPurchasable: true,
            uploadDate: fileInfo.stats?.birthtime || new Date(),
          },
        });

        results.imported.push({
          id: newCard.id,
          fileName: fileInfo.fileName,
          name: cardDetails.name,
          element: fileInfo.element,
          rarity: cardDetails.rarity,
          diamondPrice: cardDetails.diamondPrice,
        });

        console.log(`✅ Imported: ${cardDetails.name} (${fileInfo.fileName})`);
      } catch (error) {
        console.error(`❌ Failed to import ${fileInfo.fileName}:`, error);
        results.failed.push({
          fileName: fileInfo.fileName,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    console.log(
      `🎯 Import completed. Success: ${results.imported.length}, Failed: ${results.failed.length}, Skipped: ${results.skipped.length}`
    );

    // Auto-trigger bulk analysis for system recovery after successful import
    if (results.imported.length > 0) {
      console.log(
        `🚀 Auto-triggering bulk analysis for ${results.imported.length} newly imported cards...`
      );

      try {
        // Trigger bulk analysis for unanalyzed cards
        const response = await fetch(
          `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/dashboard`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "bulkAnalyze",
              forceReAnalysis: false,
            }),
          }
        );

        if (response.ok) {
          const analysisResult = await response.json();
          console.log(
            `✅ Auto bulk analysis completed: ${analysisResult.analyzedCount} cards analyzed`
          );

          return NextResponse.json({
            success: true,
            message: `Import completed. ${results.imported.length} cards imported and ${analysisResult.analyzedCount} cards auto-analyzed for system recovery.`,
            data: {
              ...results,
              autoAnalysis: {
                triggered: true,
                analyzedCount: analysisResult.analyzedCount,
                totalAttempted: analysisResult.totalAttempted,
              },
            },
          });
        } else {
          console.warn(
            `⚠️ Auto bulk analysis failed with status: ${response.status}`
          );
        }
      } catch (analysisError) {
        console.error(`❌ Auto bulk analysis error:`, analysisError);
        // Continue with normal response even if auto-analysis fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import completed. ${results.imported.length} cards imported successfully.`,
      data: {
        ...results,
        autoAnalysis: {
          triggered: false,
          reason:
            results.imported.length === 0
              ? "No new cards imported"
              : "Auto-analysis failed",
        },
      },
    });
  } catch (error) {
    console.error("❌ Card import failed:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
