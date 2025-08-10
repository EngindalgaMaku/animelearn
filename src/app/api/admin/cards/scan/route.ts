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
        // Skip placeholder.txt, thumbs directory and scan subdirectories
        if (entry.name !== "placeholder.txt" && entry.name !== "thumbs") {
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
          entry.name.includes("thumbnail")
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
} {
  const { fileName, element } = fileInfo;
  const baseName = path.parse(fileName).name;

  // Extract number from filename (e.g., fire_001 -> 001)
  const numberMatch = baseName.match(/(\d+)$/);
  const cardNumber = numberMatch ? numberMatch[1] : "001";

  // Generate card details based on element and naming conventions
  const elementConfig = {
    fire: {
      series: "Fire Elemental Collection",
      category: "anime-collection",
      namePrefix: "Flame",
      characters: [
        "Pyro Master",
        "Fire Dragon",
        "Flame Guardian",
        "Inferno Warrior",
      ],
    },
    water: {
      series: "Water Elemental Collection",
      category: "anime-collection",
      namePrefix: "Aqua",
      characters: [
        "Hydro Master",
        "Water Spirit",
        "Ocean Guardian",
        "Tidal Warrior",
      ],
    },
    earth: {
      series: "Earth Elemental Collection",
      category: "anime-collection",
      namePrefix: "Terra",
      characters: [
        "Earth Shaker",
        "Stone Guardian",
        "Rock Master",
        "Geo Warrior",
      ],
    },
    air: {
      series: "Air Elemental Collection",
      category: "anime-collection",
      namePrefix: "Wind",
      characters: [
        "Sky Master",
        "Wind Spirit",
        "Storm Guardian",
        "Aerial Warrior",
      ],
    },
    light: {
      series: "Light Elemental Collection",
      category: "anime-collection",
      namePrefix: "Radiant",
      characters: [
        "Light Bringer",
        "Solar Guardian",
        "Divine Warrior",
        "Luminous Master",
      ],
    },
    shadow: {
      series: "Shadow Elemental Collection",
      category: "anime-collection",
      namePrefix: "Dark",
      characters: [
        "Shadow Master",
        "Void Guardian",
        "Dark Warrior",
        "Umbral Spirit",
      ],
    },
    neutral: {
      series: "Neutral Collection",
      category: "anime-collection",
      namePrefix: "Balanced",
      characters: [
        "Neutral Guardian",
        "Harmony Master",
        "Balance Keeper",
        "Unity Warrior",
      ],
    },
  };

  const config =
    elementConfig[element as keyof typeof elementConfig] ||
    elementConfig.neutral;
  const characterIndex = parseInt(cardNumber) % config.characters.length;

  // Determine rarity based on card number
  const num = parseInt(cardNumber);
  let rarity = "common";
  if (num <= 2) rarity = "legendary";
  else if (num <= 4) rarity = "epic";
  else if (num <= 8) rarity = "rare";
  else if (num <= 12) rarity = "uncommon";

  return {
    name: `${config.namePrefix} ${config.characters[characterIndex]}`,
    series: config.series,
    character: config.characters[characterIndex],
    category: config.category,
    rarity,
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

    // Scan the uploads directory
    const { files, errors } = await scanCardsDirectory(uploadsDir);
    console.log(`📁 Found ${files.length} card files`);

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
    const missingCards: FileInfo[] = [];
    const skippedFiles: string[] = [];

    for (const file of files) {
      // Check if card already exists by filename or path
      const existingCard = existingCards.find(
        (card) =>
          card.fileName === file.fileName ||
          card.imagePath === file.relativePath ||
          card.imageUrl === file.relativePath
      );

      if (!existingCard) {
        missingCards.push(file);
      } else {
        skippedFiles.push(file.fileName);
      }
    }

    console.log(`✨ Found ${missingCards.length} missing cards`);

    const result: ScanResult = {
      totalFiles: files.length,
      newFiles: missingCards.length,
      existingFiles: skippedFiles.length,
      missingCards,
      skippedFiles,
      errors,
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

        // Generate card details
        const cardDetails = generateCardDetails(fileInfo);

        // Calculate diamond price based on rarity
        const rarityPriceMap = {
          common: 50,
          uncommon: 80,
          rare: 150,
          "super-rare": 300,
          epic: 400,
          "ultra-rare": 800,
          "secret-rare": 1500,
          legendary: 2500,
        };

        const diamondPrice =
          rarityPriceMap[cardDetails.rarity as keyof typeof rarityPriceMap] ||
          50;

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
            estimatedValue: diamondPrice,
            diamondPrice,
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
          diamondPrice,
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

    return NextResponse.json({
      success: true,
      message: `Import completed. ${results.imported.length} cards imported successfully.`,
      data: results,
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
