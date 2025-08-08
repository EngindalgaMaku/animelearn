interface Rarity {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  gradient?: string;
  animation?: string;
  level: number;
  minDiamondPrice: number;
  maxDiamondPrice: number;
  dropRate: number;
  iconUrl?: string;
}

interface Element {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  iconUrl?: string;
  effectDescription?: string;
  priceModifier: number;
}

// Cache for database data
let raritiesCache: Rarity[] | null = null;
let elementsCache: Element[] | null = null;
let cacheExpiry = 0;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch rarities from database/API
export async function fetchRarities(): Promise<Rarity[]> {
  if (raritiesCache && Date.now() < cacheExpiry) {
    return raritiesCache;
  }

  // Check if we're on server-side (no window object)
  if (typeof window === "undefined") {
    // Server-side: use shared prisma instance to avoid connection issues
    try {
      const { prisma } = await import("@/lib/prisma");
      
      const rarities = await prisma.rarity.findMany({
        where: { isActive: true },
        orderBy: { level: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          color: true,
          bgColor: true,
          borderColor: true,
          textColor: true,
          gradient: true,
          animation: true,
          level: true,
          dropRate: true,
          icon: true,
          iconUrl: true,
          maxDiamondPrice: true,
          minDiamondPrice: true,
        },
      });
      
      const mappedRarities = rarities.map(r => ({
        ...r,
        description: r.description || undefined,
        bgColor: r.bgColor || undefined,
        borderColor: r.borderColor || undefined,
        textColor: r.textColor || undefined,
        gradient: r.gradient || undefined,
        animation: r.animation || undefined,
        iconUrl: r.iconUrl || undefined,
      }));
      
      raritiesCache = mappedRarities;
      cacheExpiry = Date.now() + CACHE_DURATION;
      return mappedRarities;
    } catch (error) {
      console.error("❌ Failed to fetch rarities from database on server-side:", error);
      throw new Error("Database connection required for rarity data");
    }
  }

  try {
    const response = await fetch("/api/rarities");
    const data = await response.json();

    if (data.success) {
      raritiesCache = data.rarities;
      cacheExpiry = Date.now() + CACHE_DURATION;
      return data.rarities;
    }
  } catch (error) {
    console.error("❌ Failed to fetch rarities from API:", error);
    throw new Error("Unable to fetch rarity data from database");
  }

  throw new Error("No rarity data available");
}

// Fetch elements from database/API
export async function fetchElements(): Promise<Element[]> {
  if (elementsCache && Date.now() < cacheExpiry) {
    return elementsCache;
  }

  // Check if we're on server-side (no window object)
  if (typeof window === "undefined") {
    // Server-side: use shared prisma instance to avoid connection issues
    try {
      const { prisma } = await import("@/lib/prisma");
      
      const elements = await prisma.element.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          color: true,
          icon: true,
          iconUrl: true,
          effectDescription: true,
          priceModifier: true,
        },
      });
      
      const mappedElements = elements.map(e => ({
        ...e,
        description: e.description || undefined,
        icon: e.icon || undefined,
        iconUrl: e.iconUrl || undefined,
        effectDescription: e.effectDescription || undefined,
      }));
      
      elementsCache = mappedElements;
      cacheExpiry = Date.now() + CACHE_DURATION;
      return mappedElements;
    } catch (error) {
      console.error("❌ Failed to fetch elements from database on server-side:", error);
      throw new Error("Database connection required for element data");
    }
  }

  try {
    const response = await fetch("/api/elements");
    const data = await response.json();

    if (data.success) {
      elementsCache = data.elements;
      cacheExpiry = Date.now() + CACHE_DURATION;
      return data.elements;
    }
  } catch (error) {
    console.error("❌ Failed to fetch elements from API:", error);
    throw new Error("Unable to fetch element data from database");
  }

  throw new Error("No element data available");
}

// Get rarity by name/slug
export async function getRarityByName(name: string): Promise<Rarity | null> {
  const rarities = await fetchRarities();
  return (
    rarities.find(
      (r) =>
        r.name.toLowerCase() === name.toLowerCase() ||
        r.slug.toLowerCase() === name.toLowerCase()
    ) || null
  );
}

// Get element by name/slug
export async function getElementByName(name: string): Promise<Element | null> {
  const elements = await fetchElements();
  return (
    elements.find(
      (e) =>
        e.name.toLowerCase() === name.toLowerCase() ||
        e.slug.toLowerCase() === name.toLowerCase()
    ) || null
  );
}

// Calculate dynamic diamond price using rarity ranges
export async function calculateDynamicDiamondPrice(
  rarity: string,
  element?: string,
  category?: string,
  estimatedValue: number = 1,
  confidence: number = 50,
  cardId?: string
): Promise<number> {
  const rarityData = await getRarityByName(rarity);

  // If we have rarity data with min/max diamond prices, use those
  if (rarityData && rarityData.minDiamondPrice && rarityData.maxDiamondPrice) {
    // Create controlled randomness within min/max bounds
    let cardSpecificSeed = 1;
    if (cardId) {
      cardSpecificSeed = cardId
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    }

    const range = rarityData.maxDiamondPrice - rarityData.minDiamondPrice;
    const normalizedSeed = (cardSpecificSeed % 1000) / 1000; // 0-1
    const baseVariation = normalizedSeed * range;

    // Add small time-based variation (max 10% of range)
    const timeVariation = Math.sin(Date.now() / 10000000) * range * 0.1;

    // Apply confidence influence (small effect within bounds)
    const safeConfidence = isNaN(confidence) ? 50 : confidence;
    const confidenceEffect = ((safeConfidence - 50) / 100) * range * 0.15;

    // Apply estimated value influence (small effect within bounds)
    const safeEstimatedValue = isNaN(estimatedValue) ? 1 : estimatedValue;
    const valueEffect = ((safeEstimatedValue - 1) / 10) * range * 0.1;

    let finalPrice =
      rarityData.minDiamondPrice +
      (isNaN(baseVariation) ? 0 : baseVariation) +
      (isNaN(timeVariation) ? 0 : timeVariation) +
      (isNaN(confidenceEffect) ? 0 : confidenceEffect) +
      (isNaN(valueEffect) ? 0 : valueEffect);

    // Ensure we stay within bounds
    finalPrice = Math.max(
      rarityData.minDiamondPrice,
      Math.min(rarityData.maxDiamondPrice, finalPrice)
    );

    return Math.round(finalPrice);
  }

  // No fallback - throw error if rarity data not found
  console.error(`💎 No rarity data found for "${rarity}" in database`);
  throw new Error(`Rarity "${rarity}" not found in database. Available rarities should be fetched from database.`);
}

// Get rarity display name
export async function getRarityDisplayName(rarity: string): Promise<string> {
  const rarityData = await getRarityByName(rarity);
  return rarityData?.name || rarity;
}

// Get rarity CSS classes
export async function getRarityClasses(rarity: string): Promise<string> {
  const rarityData = await getRarityByName(rarity);

  if (!rarityData) {
    return "bg-gray-100 text-gray-800 border-gray-300";
  }

  // Use custom colors if available
  if (rarityData.bgColor && rarityData.textColor && rarityData.borderColor) {
    return `text-white border-2`;
  }

  // Use gradient if available
  if (rarityData.gradient) {
    return `bg-gradient-to-r ${rarityData.gradient} text-white border-2`;
  }

  // Fallback to basic color
  return `text-white border-2`;
}

// Get rarity style object for inline styles
export async function getRarityStyle(
  rarity: string
): Promise<React.CSSProperties> {
  const rarityData = await getRarityByName(rarity);

  if (!rarityData) {
    return {
      backgroundColor: "#f3f4f6",
      color: "#1f2937",
      borderColor: "#d1d5db",
    };
  }

  const style: React.CSSProperties = {};

  if (rarityData.bgColor) {
    style.backgroundColor = rarityData.bgColor;
  }
  if (rarityData.textColor) {
    style.color = rarityData.textColor;
  }
  if (rarityData.borderColor) {
    style.borderColor = rarityData.borderColor;
  }

  return style;
}

// Database-driven system - no fallback data
// All rarity and element data must come from database

// Clear cache (useful for admin operations)
export function clearCache(): void {
  raritiesCache = null;
  elementsCache = null;
  cacheExpiry = 0;
}
