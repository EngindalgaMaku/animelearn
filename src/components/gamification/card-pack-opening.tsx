"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Diamond,
  Star,
  Sparkles,
  Gift,
  Lock,
  ShoppingCart,
  Trophy,
  Zap,
  Crown,
} from "lucide-react";

interface Card {
  id: string;
  name: string;
  rarity: string;
  character: string;
  imageUrl?: string;
  isNew: boolean;
  alreadyOwned: boolean;
}

interface CardPack {
  id: string;
  name: string;
  description: string;
  packType: string;
  cardCount: number;
  guaranteedRarity: string | null;
  diamondPrice: number | null;
  requiredLevel: number;
  imageUrl: string | null;
  rarity: string;
  canAfford: boolean;
  canOpen: boolean;
}

interface UserInfo {
  level: number;
  diamonds: number;
}

interface CardPackOpeningProps {
  className?: string;
}

const CardPackOpening: React.FC<CardPackOpeningProps> = ({
  className = "",
}) => {
  const [cardPacks, setCardPacks] = useState<CardPack[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Opening state
  const [selectedPack, setSelectedPack] = useState<CardPack | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [openingStage, setOpeningStage] = useState<
    "selecting" | "opening" | "revealing" | "summary"
  >("selecting");
  const [revealedCards, setRevealedCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    fetchCardPacks();
  }, []);

  const fetchCardPacks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/card-packs");
      const data = await response.json();

      if (data.success) {
        setCardPacks(data.cardPacks);
        setUserInfo(data.userInfo);
      } else {
        setError(data.error || "Kart paketleri yüklenirken hata oluştu");
      }
    } catch (err) {
      setError("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPack = async (pack: CardPack) => {
    if (!pack.canAfford || !pack.canOpen) return;

    try {
      setSelectedPack(pack);
      setIsOpening(true);
      setOpeningStage("opening");

      const response = await fetch("/api/card-packs/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packId: pack.id,
          sourceType: "purchase",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRevealedCards(data.cards);
        setUserInfo(data.userInfo);

        // Animasyon için kısa bir bekleme
        setTimeout(() => {
          setOpeningStage("revealing");
          startCardRevealAnimation();
        }, 1500);
      } else {
        setError(data.error || "Kart paketi açılırken hata oluştu");
        setIsOpening(false);
        setSelectedPack(null);
      }
    } catch (err) {
      setError("Bağlantı hatası");
      setIsOpening(false);
      setSelectedPack(null);
    }
  };

  const startCardRevealAnimation = () => {
    setCurrentCardIndex(0);
    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => {
        if (prev >= revealedCards.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setOpeningStage("summary");
            setShowSummary(true);
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
  };

  const resetOpening = () => {
    setSelectedPack(null);
    setIsOpening(false);
    setOpeningStage("selecting");
    setRevealedCards([]);
    setCurrentCardIndex(0);
    setShowSummary(false);
    fetchCardPacks(); // Refresh pack list
  };

  const getRarityColor = (rarity: string) => {
    const rarityColors: { [key: string]: string } = {
      common: "from-gray-400 to-gray-600",
      uncommon: "from-green-400 to-green-600",
      rare: "from-blue-400 to-blue-600",
      epic: "from-purple-400 to-purple-600",
      legendary: "from-yellow-400 to-yellow-600",
    };
    return rarityColors[rarity.toLowerCase()] || rarityColors.common;
  };

  const getRarityIcon = (rarity: string) => {
    const rarityIcons: { [key: string]: React.ReactNode } = {
      common: <Star className="h-4 w-4" />,
      uncommon: <Sparkles className="h-4 w-4" />,
      rare: <Zap className="h-4 w-4" />,
      epic: <Trophy className="h-4 w-4" />,
      legendary: <Crown className="h-4 w-4" />,
    };
    return rarityIcons[rarity.toLowerCase()] || rarityIcons.common;
  };

  const getPackTypeIcon = (packType: string) => {
    switch (packType) {
      case "lesson_reward":
        return <Trophy className="h-5 w-5" />;
      case "daily_login":
        return <Gift className="h-5 w-5" />;
      case "achievement":
        return <Star className="h-5 w-5" />;
      case "purchase":
        return <ShoppingCart className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
        <div className="animate-pulse">
          <div className="mb-6 h-6 w-1/3 rounded bg-gray-200"></div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-lg bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
        <div className="text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Hata</h3>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={fetchCardPacks}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  // Pack opening animation
  if (isOpening && openingStage === "opening") {
    return (
      <div
        className={`flex min-h-96 items-center justify-center rounded-xl bg-gradient-to-br from-purple-900 to-blue-900 p-6 shadow-lg ${className}`}
      >
        <div className="text-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mx-auto mb-6 h-24 w-24"
          >
            <div
              className={`h-full w-full bg-gradient-to-br ${getRarityColor(selectedPack?.rarity || "common")} flex items-center justify-center rounded-lg`}
            >
              <Package className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          <motion.h2
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mb-2 text-2xl font-bold text-white"
          >
            {selectedPack?.name} Açılıyor...
          </motion.h2>

          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
                className="h-2 w-2 rounded-full bg-white"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Card revealing animation
  if (isOpening && openingStage === "revealing") {
    return (
      <div
        className={`min-h-96 rounded-xl bg-gradient-to-br from-purple-900 to-blue-900 p-6 shadow-lg ${className}`}
      >
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-2xl font-bold text-white">
            Kartların Açılıyor!
          </h2>
          <p className="text-purple-200">
            {currentCardIndex + 1} / {revealedCards.length}
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {revealedCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{
                scale: 0,
                rotateY: 180,
                opacity: 0,
              }}
              animate={
                index <= currentCardIndex
                  ? {
                      scale: 1,
                      rotateY: 0,
                      opacity: 1,
                    }
                  : {}
              }
              transition={{
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <div
                className={`bg-gradient-to-br ${getRarityColor(card.rarity)} rounded-lg p-1`}
              >
                <div className="relative overflow-hidden rounded-lg bg-white p-4">
                  {/* New badge */}
                  {card.isNew && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute right-2 top-2 rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white"
                    >
                      YENİ!
                    </motion.div>
                  )}

                  {/* Card image placeholder */}
                  <div className="mb-3 flex h-32 w-full items-center justify-center rounded-lg bg-gray-100">
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div
                        className={`h-16 w-16 bg-gradient-to-br ${getRarityColor(card.rarity)} flex items-center justify-center rounded-full text-white`}
                      >
                        {getRarityIcon(card.rarity)}
                      </div>
                    )}
                  </div>

                  {/* Card info */}
                  <div className="text-center">
                    <h3 className="mb-1 text-sm font-bold text-gray-900">
                      {card.name}
                    </h3>
                    <p className="mb-2 text-xs text-gray-600">
                      {card.character}
                    </p>
                    <div className="flex items-center justify-center space-x-1">
                      {getRarityIcon(card.rarity)}
                      <span className="text-xs font-medium capitalize">
                        {card.rarity}
                      </span>
                    </div>
                  </div>

                  {/* Rarity glow effect */}
                  <motion.div
                    animate={
                      index === currentCardIndex
                        ? {
                            opacity: [0, 0.7, 0],
                            scale: [1, 1.1, 1],
                          }
                        : {}
                    }
                    transition={{ duration: 1, repeat: 2 }}
                    className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(card.rarity)} rounded-lg opacity-0`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Summary screen
  if (isOpening && openingStage === "summary" && showSummary) {
    const newCards = revealedCards.filter((card) => card.isNew);
    const duplicateCards = revealedCards.filter((card) => !card.isNew);

    return (
      <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
        <div className="mb-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
          >
            <Trophy className="h-8 w-8 text-green-600" />
          </motion.div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Paket Açıldı!
          </h2>
          <p className="text-gray-600">{selectedPack?.name}</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {newCards.length}
            </div>
            <div className="text-sm text-green-700">Yeni Kart</div>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {duplicateCards.length}
            </div>
            <div className="text-sm text-blue-700">Duplicate</div>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          {revealedCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-3 rounded-lg border-l-4 p-3 ${
                card.isNew
                  ? "border-green-500 bg-green-50"
                  : "border-blue-500 bg-blue-50"
              }`}
            >
              <div
                className={`h-8 w-8 bg-gradient-to-br ${getRarityColor(card.rarity)} flex items-center justify-center rounded-full text-white`}
              >
                {getRarityIcon(card.rarity)}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{card.name}</div>
                <div className="text-sm capitalize text-gray-600">
                  {card.rarity} • {card.character}
                </div>
              </div>
              {card.isNew && (
                <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white">
                  YENİ
                </span>
              )}
            </motion.div>
          ))}
        </div>

        <button
          onClick={resetOpening}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Yeni Paket Aç
        </button>
      </div>
    );
  }

  // Main pack selection screen
  return (
    <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Kart Paketleri</h2>
        {userInfo && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Diamond className="h-5 w-5 text-amber-600" />
              <span className="font-semibold text-gray-900">
                {userInfo.diamonds}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-gray-900">
                Seviye {userInfo.level}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {cardPacks.map((pack) => (
          <motion.div
            key={pack.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-gradient-to-br ${getRarityColor(pack.rarity)} rounded-lg p-1`}
          >
            <div className="flex h-full flex-col rounded-lg bg-white p-4">
              {/* Pack image placeholder */}
              <div className="mb-4 flex h-32 w-full items-center justify-center rounded-lg bg-gray-100">
                {pack.imageUrl ? (
                  <img
                    src={pack.imageUrl}
                    alt={pack.name}
                    className="h-full w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="text-gray-400">
                    {getPackTypeIcon(pack.packType)}
                  </div>
                )}
              </div>

              {/* Pack info */}
              <div className="flex-1">
                <h3 className="mb-2 font-bold text-gray-900">{pack.name}</h3>
                <p className="mb-3 text-sm text-gray-600">{pack.description}</p>

                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kart Sayısı:</span>
                    <span className="font-medium">{pack.cardCount}</span>
                  </div>
                  {pack.guaranteedRarity && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Garanti:</span>
                      <span className="font-medium capitalize">
                        {pack.guaranteedRarity}+
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gerekli Seviye:</span>
                    <span className="font-medium">{pack.requiredLevel}</span>
                  </div>
                </div>
              </div>

              {/* Action button */}
              <button
                onClick={() => handleOpenPack(pack)}
                disabled={!pack.canAfford || !pack.canOpen}
                className={`w-full rounded-lg px-4 py-2 font-medium transition-colors ${
                  !pack.canAfford || !pack.canOpen
                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                    : pack.diamondPrice
                      ? "bg-amber-600 text-white hover:bg-amber-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {!pack.canOpen ? (
                  <span className="flex items-center justify-center">
                    <Lock className="mr-1 h-4 w-4" />
                    Seviye {pack.requiredLevel} Gerekli
                  </span>
                ) : !pack.canAfford && pack.diamondPrice ? (
                  <span className="flex items-center justify-center">
                    <Diamond className="mr-1 h-4 w-4" />
                    {pack.diamondPrice} Diamond
                  </span>
                ) : pack.diamondPrice ? (
                  <span className="flex items-center justify-center">
                    <Diamond className="mr-1 h-4 w-4" />
                    {pack.diamondPrice} Diamond - Aç
                  </span>
                ) : (
                  "Ücretsiz Aç"
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {cardPacks.length === 0 && (
        <div className="py-12 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Kart Paketi Bulunamadı
          </h3>
          <p className="text-gray-600">
            Şu anda mevcut kart paketi bulunmuyor.
          </p>
        </div>
      )}
    </div>
  );
};

export default CardPackOpening;
