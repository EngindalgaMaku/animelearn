"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Zap,
  Shield,
  Wind,
  Crown,
  Sparkles,
  Flame,
  CheckCircle,
  ShoppingBag,
  Eye,
  Diamond,
  Trophy,
  Target,
  Heart,
  Lock,
} from "lucide-react";
import { useShopTheme } from "./ShopThemeProvider";

interface Card {
  id: string;
  name: string;
  cardTitle: string;
  series: string;
  category: string;
  character: string;
  rarity: string;
  element: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  secureImageUrl?: string;
  secureThumbnailUrl?: string;
  secureFullImageUrl?: string;
  diamondPrice: number;
  estimatedValue: number;
  rating: number;
  rarityLevel: number;
  attackPower: number;
  defense: number;
  speed: number;
  specialAbility: string;
  currentOwners: number;
  maxOwners: number;
  isOwned: boolean;
  ownersCount: number;
  isLimited: boolean;
}

interface GamifiedCardProps {
  card: Card;
  viewMode: "grid" | "list";
  onCardClick: (card: Card) => void;
  onPurchase: (cardId: string) => void;
  purchasing?: boolean;
  rarities?: any[];
  elements?: any[];
}

const RARITY_EFFECTS = {
  Common: {
    glow: "",
    animation: "",
    particles: 0,
    borderColor: "border-gray-300",
  },
  Uncommon: {
    glow: "shadow-green-200/50",
    animation: "hover:shadow-green-300/60",
    particles: 3,
    borderColor: "border-green-400",
  },
  Rare: {
    glow: "shadow-blue-200/50",
    animation: "animate-pulse-slow hover:shadow-blue-300/60",
    particles: 5,
    borderColor: "border-blue-400",
  },
  "Super Rare": {
    glow: "shadow-purple-300/50",
    animation: "animate-pulse-slow hover:scale-105 hover:shadow-purple-400/60",
    particles: 8,
    borderColor: "border-purple-500",
  },
  "Ultra Rare": {
    glow: "shadow-orange-300/60",
    animation: "animate-pulse-slow hover:scale-105 hover:shadow-orange-400/70",
    particles: 12,
    borderColor: "border-orange-500",
  },
  "Secret Rare": {
    glow: "shadow-red-400/60",
    animation: "animate-pulse hover:scale-105 hover:shadow-red-500/70",
    particles: 15,
    borderColor: "border-red-600",
  },
  Legendary: {
    glow: "shadow-yellow-400/70",
    animation: "animate-pulse hover:scale-110 hover:shadow-yellow-500/80",
    particles: 20,
    borderColor: "border-yellow-500",
  },
};

const RARITY_BADGES = {
  Common: {
    color: "#6B7280",
    icon: <div className="h-3 w-3 rounded bg-gray-500" />,
    bgColor: "#6B728020",
  },
  Uncommon: {
    color: "#16A34A",
    icon: <div className="h-3 w-3 rounded-full bg-green-500" />,
    bgColor: "#16A34A20",
  },
  Rare: {
    color: "#3B82F6",
    icon: <Star className="h-3 w-3 fill-current" />,
    bgColor: "#3B82F620",
  },
  "Super Rare": {
    color: "#8B5CF6",
    icon: <Crown className="h-3 w-3" />,
    bgColor: "#8B5CF620",
  },
  "Ultra Rare": {
    color: "#F59E0B",
    icon: <Trophy className="h-3 w-3" />,
    bgColor: "#F59E0B20",
  },
  "Secret Rare": {
    color: "#EF4444",
    icon: <Target className="h-3 w-3" />,
    bgColor: "#EF444420",
  },
  Legendary: {
    color: "#FBBF24",
    icon: <Sparkles className="h-3 w-3" />,
    bgColor: "#FBBF2420",
  },
};

const ELEMENT_THEMES = {
  Fire: {
    color: "#EF4444",
    bg: "from-red-100 to-orange-100",
    icon: <Flame className="h-3 w-3" />,
  },
  Water: {
    color: "#3B82F6",
    bg: "from-blue-100 to-cyan-100",
    icon: <div className="h-3 w-3 rounded-full bg-blue-500" />,
  },
  Earth: {
    color: "#16A34A",
    bg: "from-green-100 to-emerald-100",
    icon: <div className="h-3 w-3 rounded bg-green-500" />,
  },
  Air: {
    color: "#6B7280",
    bg: "from-gray-100 to-slate-100",
    icon: <Wind className="h-3 w-3" />,
  },
  Lightning: {
    color: "#FBBF24",
    bg: "from-yellow-100 to-amber-100",
    icon: <Zap className="h-3 w-3" />,
  },
  Dark: {
    color: "#7C3AED",
    bg: "from-purple-100 to-violet-100",
    icon: <div className="h-3 w-3 rounded-full bg-purple-600" />,
  },
  Light: {
    color: "#F59E0B",
    bg: "from-amber-100 to-yellow-100",
    icon: <div className="h-3 w-3 rounded-full bg-yellow-400" />,
  },
};

export default function GamifiedCard({
  card,
  viewMode,
  onCardClick,
  onPurchase,
  purchasing,
  rarities = [],
  elements = [],
}: GamifiedCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const { themeConfig, currentTheme } = useShopTheme();

  // Get rarity data from database
  const getRarityData = (rarityName: string | null) => {
    if (!rarityName) return null;
    return rarities.find(
      (r) =>
        r.name.toLowerCase() === rarityName.toLowerCase() ||
        r.slug.toLowerCase() === rarityName.toLowerCase()
    );
  };

  // Get element data from database
  const getElementData = (elementName: string | null) => {
    if (!elementName) return null;
    return elements.find(
      (e) =>
        e.name.toLowerCase() === elementName.toLowerCase() ||
        e.slug.toLowerCase() === elementName.toLowerCase()
    );
  };

  // Helper function to get rarity badge with better matching
  const getRarityBadge = (rarityName: string) => {
    // First try exact match
    if (RARITY_BADGES[rarityName as keyof typeof RARITY_BADGES]) {
      return RARITY_BADGES[rarityName as keyof typeof RARITY_BADGES];
    }

    // Try case-insensitive match
    const rarityKey = Object.keys(RARITY_BADGES).find(
      (key) => key.toLowerCase() === rarityName.toLowerCase()
    );
    if (rarityKey) {
      return RARITY_BADGES[rarityKey as keyof typeof RARITY_BADGES];
    }

    // Try partial matching for common variations
    const lowerRarity = rarityName.toLowerCase();
    if (lowerRarity.includes("common") && !lowerRarity.includes("un")) {
      return RARITY_BADGES.Common;
    }
    if (lowerRarity.includes("uncommon")) {
      return RARITY_BADGES.Uncommon;
    }
    if (
      lowerRarity.includes("rare") &&
      !lowerRarity.includes("super") &&
      !lowerRarity.includes("ultra") &&
      !lowerRarity.includes("secret")
    ) {
      return RARITY_BADGES.Rare;
    }
    if (lowerRarity.includes("epic") || lowerRarity.includes("super")) {
      return RARITY_BADGES["Super Rare"];
    }
    if (lowerRarity.includes("legendary") || lowerRarity.includes("legend")) {
      return RARITY_BADGES.Legendary;
    }
    if (lowerRarity.includes("ultra")) {
      return RARITY_BADGES["Ultra Rare"];
    }
    if (lowerRarity.includes("secret")) {
      return RARITY_BADGES["Secret Rare"];
    }

    // Default to Common
    return RARITY_BADGES.Common;
  };

  const rarityData = getRarityData(card.rarity);
  const elementData = getElementData(card.element);
  const rarityBadge = getRarityBadge(card.rarity);
  const rarityEffect =
    RARITY_EFFECTS[card.rarity as keyof typeof RARITY_EFFECTS] ||
    RARITY_EFFECTS.Common;
  const elementTheme =
    ELEMENT_THEMES[card.element as keyof typeof ELEMENT_THEMES];
  const isRare = [
    "Ultra Rare",
    "Secret Rare",
    "Legendary",
    "epic",
    "legendary",
  ].includes(card.rarity);

  const handleCardHover = (hovered: boolean) => {
    setIsHovered(hovered);
    if (hovered && isRare) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 2000);
    }
  };

  if (viewMode === "grid") {
    return (
      <motion.div
        className={`group relative cursor-pointer overflow-hidden rounded-xl transition-all duration-300 sm:rounded-2xl
                   ${rarityEffect.glow} ${rarityEffect.animation} flex h-full flex-col`}
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={() => handleCardHover(true)}
        onMouseLeave={() => handleCardHover(false)}
        onClick={() => onCardClick(card)}
      >
        {/* Animated Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${elementTheme?.bg || "from-gray-50 to-gray-100"} opacity-30`}
        />

        {/* Rarity Border */}
        <div
          className={`absolute inset-0 border sm:border-2 ${rarityEffect.borderColor} rounded-xl sm:rounded-2xl`}
        />

        {/* Particle Effects for Rare Cards */}
        <AnimatePresence>
          {showParticles && isRare && (
            <div className="pointer-events-none absolute inset-0">
              {Array.from({ length: rarityEffect.particles }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{
                    scale: 0,
                    x: Math.random() * 200,
                    y: Math.random() * 300,
                    opacity: 0,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    y: -20,
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        <div className="relative flex h-full flex-col bg-white/80 p-2 backdrop-blur-sm sm:p-3 md:p-4">
          {/* Image Container - Mobile optimized */}
          <div
            className="relative mb-2 aspect-[3/4] flex-shrink-0 overflow-hidden rounded-lg transition-all duration-500
                         group-hover:scale-105 group-hover:shadow-xl sm:mb-3 sm:rounded-xl sm:group-hover:scale-110 md:mb-4"
          >
            <img
              src={
                card.secureThumbnailUrl ||
                card.secureImageUrl ||
                `/api/secure-image?cardId=${card.id}&type=thumbnail`
              }
              alt={card.cardTitle || card.name}
              className="h-full w-full object-contain"
              onError={(e) => {
                // Enhanced fallback chain for production compatibility
                const target = e.target as HTMLImageElement;
                const currentSrc = target.src;

                if (!currentSrc.includes("placeholder")) {
                  // Try direct API call first
                  if (!currentSrc.includes("/api/secure-image")) {
                    target.src = `/api/secure-image?cardId=${card.id}&type=thumbnail`;
                  } else if (!currentSrc.includes("type=preview")) {
                    // Try preview type
                    target.src = `/api/secure-image?cardId=${card.id}&type=preview`;
                  } else {
                    // Final fallback
                    target.src = "/placeholder-card.svg";
                  }
                }
              }}
            />

            {/* Overlay Effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

            {/* Status Badges - Mobile optimized */}
            <div className="absolute left-1 top-1 flex flex-col space-y-1 sm:left-2 sm:top-2">
              {card.isLimited && (
                <motion.div
                  className="rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white shadow-lg sm:px-2 sm:py-1"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="hidden sm:inline">LIMITED!</span>
                  <span className="sm:hidden">LTD</span>
                </motion.div>
              )}
              {isRare && (
                <motion.div
                  className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-1.5 py-0.5 text-xs font-bold text-white shadow-lg sm:px-2 sm:py-1"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(251, 191, 36, 0.7)",
                      "0 0 0 10px rgba(251, 191, 36, 0)",
                      "0 0 0 0 rgba(251, 191, 36, 0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="hidden sm:inline">⭐ RARE</span>
                  <span className="sm:hidden">⭐</span>
                </motion.div>
              )}
            </div>

            {card.isOwned && (
              <div className="absolute right-1 top-1 rounded-full bg-green-500 p-1 text-white shadow-lg sm:right-2 sm:top-2">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            )}

            {/* Touch-Optimized Quick View Button */}
            <motion.div
              className="sm:min-w-auto sm:min-h-auto absolute bottom-1 right-1 flex min-h-[32px] min-w-[32px]
                       items-center justify-center rounded-full bg-black/60 p-1.5 text-white
                       opacity-100 transition-opacity sm:bottom-2 sm:right-2 sm:p-2 md:opacity-0 md:group-hover:opacity-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            </motion.div>
          </div>

          {/* Card Info - Mobile optimized with flex-grow */}
          <div className="flex flex-grow flex-col space-y-2 sm:space-y-3">
            {/* Title */}
            <h3
              className="truncate text-xs font-bold leading-tight text-gray-900 transition-all
                         group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-600
                         group-hover:bg-clip-text group-hover:text-transparent sm:text-sm"
            >
              {card.cardTitle || card.name}
            </h3>

            {/* Badges Row - Responsive */}
            <div className="flex flex-wrap gap-1">
              {/* Rarity Badge - Mobile optimized */}
              <span
                className="inline-flex items-center rounded-full border px-1.5 py-0.5 text-xs font-medium sm:px-2 sm:py-1"
                style={{
                  backgroundColor:
                    rarityData?.bgColor ||
                    (rarityData?.color
                      ? `${rarityData.color}20`
                      : rarityBadge.bgColor),
                  borderColor:
                    rarityData?.borderColor ||
                    rarityData?.color ||
                    rarityBadge.color,
                  color:
                    rarityData?.textColor ||
                    rarityData?.color ||
                    rarityBadge.color,
                }}
              >
                {rarityData?.iconUrl ? (
                  <img
                    src={rarityData.iconUrl}
                    alt={rarityData.name}
                    className="mr-1 h-2 w-2 sm:h-3 sm:w-3"
                  />
                ) : rarityData?.icon ? (
                  <span className="mr-1 text-xs">{rarityData.icon}</span>
                ) : (
                  <span className="mr-1">{rarityBadge.icon}</span>
                )}
                <span className="max-w-[60px] truncate text-xs sm:max-w-none">
                  {rarityData?.name || card.rarity}
                </span>
              </span>

              {/* Element Badge - Mobile optimized */}
              <span
                className="inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium sm:px-2 sm:py-1"
                style={{
                  backgroundColor: elementData?.color
                    ? `${elementData.color}20`
                    : ELEMENT_THEMES[
                          card.element as keyof typeof ELEMENT_THEMES
                        ]?.color
                      ? `${ELEMENT_THEMES[card.element as keyof typeof ELEMENT_THEMES].color}20`
                      : "#3B82F620",
                  color:
                    elementData?.color ||
                    ELEMENT_THEMES[card.element as keyof typeof ELEMENT_THEMES]
                      ?.color ||
                    "#3B82F6",
                }}
              >
                {elementData?.iconUrl ? (
                  <img
                    src={elementData.iconUrl}
                    alt={elementData.name}
                    className="mr-1 h-2 w-2 sm:h-3 sm:w-3"
                  />
                ) : elementData?.icon ? (
                  <span className="mr-1 text-xs">{elementData.icon}</span>
                ) : (
                  <span className="mr-1">
                    {ELEMENT_THEMES[card.element as keyof typeof ELEMENT_THEMES]
                      ?.icon || "✨"}
                  </span>
                )}
                <span className="max-w-[50px] truncate text-xs sm:max-w-none">
                  {elementData?.name || card.element}
                </span>
              </span>
            </div>

            {/* Power Stats - Mobile optimized */}
            <div className="grid flex-shrink-0 grid-cols-3 gap-1 text-xs">
              <div className="flex items-center space-x-0.5 text-red-600 sm:space-x-1">
                <Zap className="h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3" />
                <span className="text-xs font-medium">{card.attackPower}</span>
              </div>
              <div className="flex items-center space-x-0.5 text-blue-600 sm:space-x-1">
                <Shield className="h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3" />
                <span className="text-xs font-medium">{card.defense}</span>
              </div>
              <div className="flex items-center space-x-0.5 text-green-600 sm:space-x-1">
                <Wind className="h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3" />
                <span className="text-xs font-medium">{card.speed}</span>
              </div>
            </div>

            {/* Price - Mobile optimized */}
            <div className="flex flex-shrink-0 justify-end">
              <div
                className="flex items-center space-x-1 text-xs font-bold sm:text-sm"
                style={{ color: themeConfig.primary }}
              >
                <Diamond className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{card.diamondPrice}</span>
              </div>
            </div>

            {/* Quick Purchase Button - Touch optimized */}
            {!card.isOwned && (
              <motion.button
                className="mt-auto min-h-[40px] w-full touch-manipulation rounded-lg py-2.5 text-xs font-medium
                         text-white shadow-lg transition-all sm:py-2"
                style={{ backgroundColor: themeConfig.primary }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: `0 8px 25px ${themeConfig.primary}40`,
                }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onPurchase(card.id);
                }}
                disabled={purchasing}
              >
                {purchasing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span className="hidden sm:inline">Buying...</span>
                    <span className="sm:hidden">...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <ShoppingBag className="h-3 w-3" />
                    <span className="hidden sm:inline">Quick Buy</span>
                    <span className="sm:hidden">Buy</span>
                  </div>
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Hover Glow Effect */}
        {isHovered && isRare && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              boxShadow: `0 0 30px ${elementTheme?.color || themeConfig.primary}60`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </motion.div>
    );
  }

  // List view - Mobile optimized
  return (
    <motion.div
      className={`flex cursor-pointer items-center space-x-2 rounded-lg border bg-white/80 p-2 backdrop-blur-sm transition-all
                 sm:space-x-3 sm:rounded-xl sm:p-3 md:space-x-4 md:p-4 ${rarityEffect.glow}
                 sm:min-h-auto min-h-[80px]`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onCardClick(card)}
    >
      {/* Mobile-optimized Thumbnail */}
      <div className="sm:h-18 relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-md sm:w-14 sm:rounded-lg md:h-20 md:w-16">
        <img
          src={
            card.secureThumbnailUrl ||
            card.secureImageUrl ||
            `/api/secure-image?cardId=${card.id}&type=thumbnail`
          }
          alt={card.cardTitle || card.name}
          className="h-full w-full object-contain"
          onError={(e) => {
            // Enhanced fallback chain for production compatibility
            const target = e.target as HTMLImageElement;
            const currentSrc = target.src;

            if (!currentSrc.includes("placeholder")) {
              // Try direct API call first
              if (!currentSrc.includes("/api/secure-image")) {
                target.src = `/api/secure-image?cardId=${card.id}&type=thumbnail`;
              } else if (!currentSrc.includes("type=preview")) {
                // Try preview type
                target.src = `/api/secure-image?cardId=${card.id}&type=preview`;
              } else {
                // Final fallback
                target.src = "/placeholder-card.svg";
              }
            }
          }}
        />
        {card.isOwned && (
          <CheckCircle className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-white text-green-500 sm:-right-1 sm:-top-1 sm:h-5 sm:w-5" />
        )}
      </div>

      {/* Mobile-optimized Info */}
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="truncate text-sm font-semibold leading-tight text-gray-900 sm:text-base">
          {card.cardTitle || card.name}
        </h3>
        <p className="truncate text-xs text-gray-600 sm:text-sm">
          <span className="hidden sm:inline">
            {card.series} • {card.character}
          </span>
          <span className="sm:hidden">{card.series}</span>
        </p>
        <div className="flex flex-wrap items-center space-x-1 sm:space-x-2">
          <span className="max-w-[60px] truncate rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700 sm:max-w-none sm:px-2 sm:py-1">
            {card.rarity}
          </span>
          <span className="max-w-[50px] truncate rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-800 sm:max-w-none sm:px-2 sm:py-1">
            {card.element}
          </span>
        </div>
      </div>

      {/* Mobile-optimized Price & Stats */}
      <div className="flex-shrink-0 space-y-1 text-right">
        <div
          className="flex items-center justify-end space-x-1 text-sm font-bold sm:text-base md:text-lg"
          style={{ color: themeConfig.primary }}
        >
          <Diamond className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>{card.diamondPrice}</span>
        </div>

        {/* Quick stats on mobile */}
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <span className="flex items-center space-x-0.5">
            <Zap className="h-2.5 w-2.5 text-red-500" />
            <span>{card.attackPower}</span>
          </span>
          <span className="flex items-center space-x-0.5">
            <Shield className="h-2.5 w-2.5 text-blue-500" />
            <span>{card.defense}</span>
          </span>
          <span className="flex items-center space-x-0.5">
            <Wind className="h-2.5 w-2.5 text-green-500" />
            <span>{card.speed}</span>
          </span>
        </div>

        {/* Quick buy button for list view */}
        {!card.isOwned && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPurchase(card.id);
            }}
            disabled={purchasing}
            className="mt-1 flex min-h-[32px] touch-manipulation items-center justify-center rounded px-2 py-1
                     text-xs font-medium text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: themeConfig.primary }}
          >
            {purchasing ? (
              <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
            ) : (
              <ShoppingBag className="h-3 w-3" />
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}
