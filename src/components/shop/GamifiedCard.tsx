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
  Lock
} from "lucide-react";
import { useShopTheme } from "./ShopThemeProvider";

interface Card {
  id: string;
  name: string;
  cardTitle: string;
  series: string;
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
    borderColor: "border-gray-300"
  },
  Uncommon: {
    glow: "shadow-green-200/50",
    animation: "hover:shadow-green-300/60",
    particles: 3,
    borderColor: "border-green-400"
  },
  Rare: {
    glow: "shadow-blue-200/50",
    animation: "animate-pulse-slow hover:shadow-blue-300/60",
    particles: 5,
    borderColor: "border-blue-400"
  },
  "Super Rare": {
    glow: "shadow-purple-300/50",
    animation: "animate-pulse-slow hover:scale-105 hover:shadow-purple-400/60",
    particles: 8,
    borderColor: "border-purple-500"
  },
  "Ultra Rare": {
    glow: "shadow-orange-300/60",
    animation: "animate-pulse-slow hover:scale-105 hover:shadow-orange-400/70",
    particles: 12,
    borderColor: "border-orange-500"
  },
  "Secret Rare": {
    glow: "shadow-red-400/60",
    animation: "animate-pulse hover:scale-105 hover:shadow-red-500/70",
    particles: 15,
    borderColor: "border-red-600"
  },
  Legendary: {
    glow: "shadow-yellow-400/70",
    animation: "animate-pulse hover:scale-110 hover:shadow-yellow-500/80",
    particles: 20,
    borderColor: "border-yellow-500"
  }
};

const RARITY_BADGES = {
  Common: {
    color: "#6B7280",
    icon: <div className="h-3 w-3 rounded bg-gray-500" />,
    bgColor: "#6B728020"
  },
  Uncommon: {
    color: "#16A34A",
    icon: <div className="h-3 w-3 rounded-full bg-green-500" />,
    bgColor: "#16A34A20"
  },
  Rare: {
    color: "#3B82F6",
    icon: <Star className="h-3 w-3 fill-current" />,
    bgColor: "#3B82F620"
  },
  "Super Rare": {
    color: "#8B5CF6",
    icon: <Crown className="h-3 w-3" />,
    bgColor: "#8B5CF620"
  },
  "Ultra Rare": {
    color: "#F59E0B",
    icon: <Trophy className="h-3 w-3" />,
    bgColor: "#F59E0B20"
  },
  "Secret Rare": {
    color: "#EF4444",
    icon: <Target className="h-3 w-3" />,
    bgColor: "#EF444420"
  },
  Legendary: {
    color: "#FBBF24",
    icon: <Sparkles className="h-3 w-3" />,
    bgColor: "#FBBF2420"
  }
};

const ELEMENT_THEMES = {
  Fire: { color: "#EF4444", bg: "from-red-100 to-orange-100", icon: <Flame className="h-3 w-3" /> },
  Water: { color: "#3B82F6", bg: "from-blue-100 to-cyan-100", icon: <div className="h-3 w-3 rounded-full bg-blue-500" /> },
  Earth: { color: "#16A34A", bg: "from-green-100 to-emerald-100", icon: <div className="h-3 w-3 rounded bg-green-500" /> },
  Air: { color: "#6B7280", bg: "from-gray-100 to-slate-100", icon: <Wind className="h-3 w-3" /> },
  Lightning: { color: "#FBBF24", bg: "from-yellow-100 to-amber-100", icon: <Zap className="h-3 w-3" /> },
  Dark: { color: "#7C3AED", bg: "from-purple-100 to-violet-100", icon: <div className="h-3 w-3 rounded-full bg-purple-600" /> },
  Light: { color: "#F59E0B", bg: "from-amber-100 to-yellow-100", icon: <div className="h-3 w-3 rounded-full bg-yellow-400" /> }
};

export default function GamifiedCard({
  card,
  viewMode,
  onCardClick,
  onPurchase,
  purchasing,
  rarities = [],
  elements = []
}: GamifiedCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const { themeConfig, currentTheme } = useShopTheme();

  // Get rarity data from database
  const getRarityData = (rarityName: string | null) => {
    if (!rarityName) return null;
    return rarities.find(
      (r) => r.name.toLowerCase() === rarityName.toLowerCase() ||
             r.slug.toLowerCase() === rarityName.toLowerCase()
    );
  };

  // Get element data from database
  const getElementData = (elementName: string | null) => {
    if (!elementName) return null;
    return elements.find(
      (e) => e.name.toLowerCase() === elementName.toLowerCase() ||
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
      key => key.toLowerCase() === rarityName.toLowerCase()
    );
    if (rarityKey) {
      return RARITY_BADGES[rarityKey as keyof typeof RARITY_BADGES];
    }
    
    // Try partial matching for common variations
    const lowerRarity = rarityName.toLowerCase();
    if (lowerRarity.includes('common') && !lowerRarity.includes('un')) {
      return RARITY_BADGES.Common;
    }
    if (lowerRarity.includes('uncommon')) {
      return RARITY_BADGES.Uncommon;
    }
    if (lowerRarity.includes('rare') && !lowerRarity.includes('super') && !lowerRarity.includes('ultra') && !lowerRarity.includes('secret')) {
      return RARITY_BADGES.Rare;
    }
    if (lowerRarity.includes('epic') || lowerRarity.includes('super')) {
      return RARITY_BADGES["Super Rare"];
    }
    if (lowerRarity.includes('legendary') || lowerRarity.includes('legend')) {
      return RARITY_BADGES.Legendary;
    }
    if (lowerRarity.includes('ultra')) {
      return RARITY_BADGES["Ultra Rare"];
    }
    if (lowerRarity.includes('secret')) {
      return RARITY_BADGES["Secret Rare"];
    }
    
    // Default to Common
    return RARITY_BADGES.Common;
  };

  const rarityData = getRarityData(card.rarity);
  const elementData = getElementData(card.element);
  const rarityBadge = getRarityBadge(card.rarity);
  const rarityEffect = RARITY_EFFECTS[card.rarity as keyof typeof RARITY_EFFECTS] || RARITY_EFFECTS.Common;
  const elementTheme = ELEMENT_THEMES[card.element as keyof typeof ELEMENT_THEMES];
  const isRare = ["Ultra Rare", "Secret Rare", "Legendary", "epic", "legendary"].includes(card.rarity);

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
        className={`group relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${rarityEffect.glow} ${rarityEffect.animation}`}
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={() => handleCardHover(true)}
        onMouseLeave={() => handleCardHover(false)}
        onClick={() => onCardClick(card)}
      >
        {/* Animated Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${elementTheme?.bg || 'from-gray-50 to-gray-100'} opacity-30`} />
        
        {/* Rarity Border */}
        <div className={`absolute inset-0 border-2 ${rarityEffect.borderColor} rounded-2xl`} />

        {/* Particle Effects for Rare Cards */}
        <AnimatePresence>
          {showParticles && isRare && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: rarityEffect.particles }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ 
                    scale: 0, 
                    x: Math.random() * 200, 
                    y: Math.random() * 300,
                    opacity: 0 
                  }}
                  animate={{ 
                    scale: [0, 1, 0], 
                    y: -20,
                    opacity: [0, 1, 0] 
                  }}
                  transition={{ 
                    duration: 1.5, 
                    delay: i * 0.1,
                    ease: "easeOut" 
                  }}
                >
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        <div className="relative p-4 bg-white/80 backdrop-blur-sm h-full">
          {/* Image Container */}
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
            <img
              src={card.secureThumbnailUrl || card.secureImageUrl || `/api/secure-image?cardId=${card.id}&type=thumbnail`}
              alt={card.cardTitle || card.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                // Enhanced fallback chain for production compatibility
                const target = e.target as HTMLImageElement;
                const currentSrc = target.src;
                
                if (!currentSrc.includes('placeholder')) {
                  // Try direct API call first
                  if (!currentSrc.includes('/api/secure-image')) {
                    target.src = `/api/secure-image?cardId=${card.id}&type=thumbnail`;
                  } else if (!currentSrc.includes('type=preview')) {
                    // Try preview type
                    target.src = `/api/secure-image?cardId=${card.id}&type=preview`;
                  } else {
                    // Final fallback
                    target.src = '/placeholder-card.svg';
                  }
                }
              }}
            />
            
            {/* Overlay Effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            
            {/* Status Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              {card.isLimited && (
                <motion.div
                  className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  LIMITED!
                </motion.div>
              )}
              {isRare && (
                <motion.div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                  animate={{ 
                    boxShadow: ["0 0 0 0 rgba(251, 191, 36, 0.7)", "0 0 0 10px rgba(251, 191, 36, 0)", "0 0 0 0 rgba(251, 191, 36, 0)"] 
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⭐ RARE
                </motion.div>
              )}
            </div>

            {card.isOwned && (
              <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-lg">
                <CheckCircle className="h-4 w-4" />
              </div>
            )}

            {/* Quick View Button */}
            <motion.div 
              className="absolute bottom-2 right-2 bg-black/60 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Eye className="h-4 w-4" />
            </motion.div>
          </div>

          {/* Card Info */}
          <div className="space-y-3">
            {/* Title */}
            <h3 className="font-bold text-gray-900 truncate text-sm group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-600 transition-all">
              {card.cardTitle || card.name}
            </h3>

            {/* Badges Row */}
            <div className="flex flex-wrap gap-1">
              {/* Rarity Badge - Using Database Data with Fallback */}
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border"
                style={{
                  backgroundColor: rarityData?.bgColor || (rarityData?.color ? `${rarityData.color}20` : rarityBadge.bgColor),
                  borderColor: rarityData?.borderColor || rarityData?.color || rarityBadge.color,
                  color: rarityData?.textColor || rarityData?.color || rarityBadge.color
                }}
              >
                {rarityData?.iconUrl ? (
                  <img
                    src={rarityData.iconUrl}
                    alt={rarityData.name}
                    className="h-3 w-3 mr-1"
                  />
                ) : rarityData?.icon ? (
                  <span className="mr-1">{rarityData.icon}</span>
                ) : (
                  <span className="mr-1">{rarityBadge.icon}</span>
                )}
                {rarityData?.name || card.rarity}
              </span>

              {/* Element Badge - Using Database Data with Fallback */}
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: elementData?.color ? `${elementData.color}20` : ELEMENT_THEMES[card.element as keyof typeof ELEMENT_THEMES]?.color ? `${ELEMENT_THEMES[card.element as keyof typeof ELEMENT_THEMES].color}20` : "#3B82F620",
                  color: elementData?.color || ELEMENT_THEMES[card.element as keyof typeof ELEMENT_THEMES]?.color || "#3B82F6"
                }}
              >
                {elementData?.iconUrl ? (
                  <img
                    src={elementData.iconUrl}
                    alt={elementData.name}
                    className="h-3 w-3 mr-1"
                  />
                ) : elementData?.icon ? (
                  <span className="mr-1">{elementData.icon}</span>
                ) : (
                  <span className="mr-1">{ELEMENT_THEMES[card.element as keyof typeof ELEMENT_THEMES]?.icon || "✨"}</span>
                )}
                <span>{elementData?.name || card.element}</span>
              </span>
            </div>

            {/* Power Stats */}
            <div className="grid grid-cols-3 gap-1 text-xs">
              <div className="flex items-center space-x-1 text-red-600">
                <Zap className="h-3 w-3" />
                <span className="font-medium">{card.attackPower}</span>
              </div>
              <div className="flex items-center space-x-1 text-blue-600">
                <Shield className="h-3 w-3" />
                <span className="font-medium">{card.defense}</span>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <Wind className="h-3 w-3" />
                <span className="font-medium">{card.speed}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex justify-end">
              <div
                className="text-sm font-bold flex items-center space-x-1"
                style={{ color: themeConfig.primary }}
              >
                <Diamond className="h-4 w-4" />
                <span>{card.diamondPrice}</span>
              </div>
            </div>

            {/* Quick Purchase Button */}
            {!card.isOwned && (
              <motion.button
                className="w-full py-2 rounded-lg text-white text-xs font-medium shadow-lg transition-all"
                style={{ backgroundColor: themeConfig.primary }}
                whileHover={{ scale: 1.05, boxShadow: `0 8px 25px ${themeConfig.primary}40` }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onPurchase(card.id);
                }}
                disabled={purchasing}
              >
                {purchasing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Buying...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <ShoppingBag className="h-3 w-3" />
                    <span>Quick Buy</span>
                  </div>
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Hover Glow Effect */}
        {isHovered && isRare && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ 
              boxShadow: `0 0 30px ${elementTheme?.color || themeConfig.primary}60` 
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </motion.div>
    );
  }

  // List view (simplified version)
  return (
    <motion.div
      className={`flex items-center space-x-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border cursor-pointer transition-all ${rarityEffect.glow}`}
      whileHover={{ scale: 1.02 }}
      onClick={() => onCardClick(card)}
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden">
        <img
          src={card.secureThumbnailUrl || card.secureImageUrl || `/api/secure-image?cardId=${card.id}&type=thumbnail`}
          alt={card.cardTitle || card.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            // Enhanced fallback chain for production compatibility
            const target = e.target as HTMLImageElement;
            const currentSrc = target.src;
            
            if (!currentSrc.includes('placeholder')) {
              // Try direct API call first
              if (!currentSrc.includes('/api/secure-image')) {
                target.src = `/api/secure-image?cardId=${card.id}&type=thumbnail`;
              } else if (!currentSrc.includes('type=preview')) {
                // Try preview type
                target.src = `/api/secure-image?cardId=${card.id}&type=preview`;
              } else {
                // Final fallback
                target.src = '/placeholder-card.svg';
              }
            }
          }}
        />
        {card.isOwned && (
          <CheckCircle className="absolute -top-1 -right-1 h-5 w-5 text-green-500 bg-white rounded-full" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{card.cardTitle || card.name}</h3>
        <p className="text-sm text-gray-600">{card.series} • {card.character}</p>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">{card.rarity}</span>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">{card.element}</span>
        </div>
      </div>

      {/* Price & Action */}
      <div className="text-right">
        <div className="text-lg font-bold" style={{ color: themeConfig.primary }}>
          💎 {card.diamondPrice}
        </div>
      </div>
    </motion.div>
  );
}