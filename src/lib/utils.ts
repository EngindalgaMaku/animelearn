import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  calculateDynamicDiamondPrice,
  getRarityDisplayName,
  getRarityClasses,
  fetchRarities,
} from "./database-utils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop();
  return `card_${timestamp}_${random}.${extension}`;
}

export function validateImageFile(file: File): string | null {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return "Sadece JPEG, PNG, WebP ve GIF dosyaları desteklenmektedir.";
  }

  if (file.size > maxSize) {
    return "Dosya boyutu 10MB'dan küçük olmalıdır.";
  }

  return null;
}

export function extractCardInfoFromFilename(filename: string): {
  series?: string;
  character?: string;
  rarity?: string;
} {
  const name = filename.toLowerCase();

  // Basit pattern matching ile dosya adından bilgi çıkarma
  const patterns = {
    series: [
      "naruto",
      "onepiece",
      "dragonball",
      "pokemon",
      "yugioh",
      "attack_on_titan",
      "demon_slayer",
      "my_hero_academia",
    ],
    rarity: ["rare", "common", "uncommon", "legendary", "epic", "ultra"],
  };

  const result: {
    series?: string;
    character?: string;
    rarity?: string;
  } = {};

  // Seri tespiti
  for (const series of patterns.series) {
    if (name.includes(series)) {
      result.series = series.replace(/_/g, " ");
      break;
    }
  }

  // Nadir seviyesi tespiti
  for (const rarity of patterns.rarity) {
    if (name.includes(rarity)) {
      result.rarity = rarity;
      break;
    }
  }

  return result;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(amount);
}

export function formatDiamonds(amount: number): string {
  return `💎 ${amount.toLocaleString("tr-TR")} Elmas`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Database-driven rarity multiplier - async version
export async function calculateRarityMultiplier(
  rarity: string
): Promise<number> {
  try {
    const rarities = await fetchRarities();
    const rarityData = rarities.find(
      (r) =>
        r.name.toLowerCase() === rarity.toLowerCase() ||
        r.slug.toLowerCase() === rarity.toLowerCase()
    );

    // Use minDiamondPrice and maxDiamondPrice to calculate multiplier
    const basePrice = 50; // Common baseline
    const avgPrice = rarityData ? (rarityData.minDiamondPrice + rarityData.maxDiamondPrice) / 2 : basePrice;
    return avgPrice / basePrice;
  } catch (error) {
    console.error("❌ Failed to fetch dynamic rarity multiplier:", error);
    throw new Error("Database connection required for rarity multiplier calculation");
  }
}

// Enhanced diamond price calculation using database-driven logic
export async function calculateDiamondPrice(
  rarity: string,
  estimatedValue: number,
  confidence: number = 50,
  cardId?: string,
  element?: string,
  category?: string
): Promise<number> {
  console.log(`💎 calculateDiamondPrice called with rarity: ${rarity}, estimatedValue: ${estimatedValue}, confidence: ${confidence}, cardId: ${cardId}`);
  
  try {
    // Try database-driven calculation first
    const result = await calculateDynamicDiamondPrice(
      rarity,
      element,
      category,
      estimatedValue,
      confidence,
      cardId
    );
    console.log(`💎 Database-driven calculation successful: ${result}`);
    return result;
  } catch (error) {
    console.error("❌ Failed to calculate dynamic diamond price:", error);
    throw new Error("Database connection required for diamond price calculation");
  }
}

// Database-driven rarity tier display
export async function getRarityTier(rarity: string): Promise<string> {
  try {
    return await getRarityDisplayName(rarity);
  } catch (error) {
    console.error("❌ Failed to get dynamic rarity tier:", error);
    throw new Error("Database connection required for rarity tier information");
  }
}

// Database-driven rarity color classes
export async function getRarityColor(rarity: string): Promise<string> {
  try {
    return await getRarityClasses(rarity);
  } catch (error) {
    console.error("❌ Failed to get dynamic rarity color:", error);
    throw new Error("Database connection required for rarity color information");
  }
}

// Synchronous versions for backwards compatibility (using cached data)
export function calculateRarityMultiplierSync(rarity: string): number {
  const multipliers: Record<string, number> = {
    common: 1,
    uncommon: 1.5,
    rare: 3,
    "super rare": 5,
    "ultra rare": 8,
    "secret rare": 12,
    epic: 15,
    legendary: 25,
    ultra: 8,
  };
  return multipliers[rarity.toLowerCase()] || 1;
}

export function getRarityTierSync(rarity: string): string {
  const tiers: Record<string, string> = {
    common: "Common",
    uncommon: "Uncommon",
    rare: "Rare",
    "super rare": "Super Rare",
    "ultra rare": "Ultra Rare",
    "secret rare": "Secret Rare",
    epic: "Epic",
    legendary: "Legendary",
    ultra: "Ultra Rare",
  };
  return tiers[rarity.toLowerCase()] || "Common";
}

export function getRarityColorSync(rarity: string): string {
  const colors: Record<string, string> = {
    common: "bg-gray-100 text-gray-800 border-gray-300",
    uncommon: "bg-green-100 text-green-800 border-green-300",
    rare: "bg-blue-100 text-blue-800 border-blue-300",
    "super rare": "bg-purple-100 text-purple-800 border-purple-300",
    "ultra rare": "bg-orange-100 text-orange-800 border-orange-300",
    "secret rare": "bg-red-100 text-red-800 border-red-300",
    epic: "bg-yellow-100 text-yellow-800 border-yellow-300",
    legendary:
      "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-500",
    ultra: "bg-orange-100 text-orange-800 border-orange-300",
  };
  return colors[rarity.toLowerCase()] || colors.common;
}
