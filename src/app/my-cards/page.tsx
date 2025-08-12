"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Filter,
  Search,
  Star,
  Diamond,
  Grid3X3,
  List,
  Eye,
  Heart,
  Package,
  Award,
  TrendingUp,
  Calendar,
  ShoppingBag,
  X,
  Expand,
  BookOpen,
  HelpCircle,
  Info,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
  cardCount: number;
}

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
  priceMultiplier: number;
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

interface UserCard {
  id: string;
  cardId: string;
  userId: string;
  purchaseDate: string;
  card: {
    id: string;
    name?: string;
    imagePath: string;
    imageUrl?: string;
    thumbnailUrl?: string; // Add thumbnail URL for performance
    rarity?: "common" | "rare" | "epic" | "legendary";
    series?: string;
    character?: string;
    estimatedValue?: number;
    story?: string; // AI-generated story
  };
}

interface MyCardsResponse {
  success: boolean;
  cards: UserCard[];
  stats: {
    totalCards: number;
    uniqueCards: number;
    totalValue: number;
    rarityBreakdown: Record<string, number>;
    animeBreakdown: Record<string, number>;
  };
}

// Enhanced rarity styles for card containers (same as shop)
const RARITY_CARD_STYLES = {
  common: {
    container:
      "bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer",
    imageContainer: "relative aspect-[3/4] overflow-hidden",
    animation: "",
  },
  rare: {
    container:
      "bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border-2 border-blue-300 hover:border-blue-400 hover:shadow-blue-200/50",
    imageContainer:
      "relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 ring-2 ring-blue-300",
    animation: "animate-pulse-slow",
  },
  epic: {
    container:
      "bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border-2 border-purple-400 hover:border-purple-500 hover:shadow-purple-300/50",
    imageContainer:
      "relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 ring-2 ring-purple-400",
    animation: "animate-pulse-slow hover:scale-105",
  },
  legendary: {
    container:
      "bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border-2 border-yellow-400 hover:border-yellow-500 legendary-glow",
    imageContainer:
      "relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-yellow-100 via-amber-200 to-orange-200 ring-4 ring-yellow-400 shadow-xl legendary-shimmer",
    animation: "animate-pulse animate-float hover:scale-110",
  },
  "super rare": {
    container:
      "bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border-2 border-purple-400 hover:border-purple-500 hover:shadow-purple-300/50",
    imageContainer:
      "relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 ring-2 ring-purple-400",
    animation: "animate-pulse-slow hover:scale-105",
  },
  "ultra rare": {
    container:
      "bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border-2 border-orange-400 hover:border-orange-500 ultra-rare-glow",
    imageContainer:
      "relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 ring-2 ring-orange-400 shadow-inner",
    animation: "animate-pulse-slow hover:scale-105",
  },
  "secret rare": {
    container:
      "bg-gradient-to-br from-red-50 to-red-100 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border-2 border-red-500 hover:border-red-600 secret-rare-glow",
    imageContainer:
      "relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-red-100 via-red-200 to-red-300 ring-2 ring-red-500 shadow-lg",
    animation: "animate-pulse hover:scale-105",
  },
};

// Get rarity-based styles
const getRarityStyles = (rarity: string | null) => {
  if (!rarity) return RARITY_CARD_STYLES.common;
  const rarityKey = rarity.toLowerCase() as keyof typeof RARITY_CARD_STYLES;
  return RARITY_CARD_STYLES[rarityKey] || RARITY_CARD_STYLES.common;
};

const RARITY_COLORS = {
  common: "bg-gray-200 text-gray-800 border border-gray-300",
  rare: "bg-gradient-to-r from-blue-200 to-blue-300 text-blue-800 border border-blue-400",
  epic: "bg-gradient-to-r from-purple-200 to-purple-300 text-purple-800 border border-purple-400",
  legendary:
    "bg-gradient-to-r from-yellow-200 to-orange-200 text-yellow-800 border border-yellow-400",
  "super rare":
    "bg-gradient-to-r from-purple-200 to-purple-300 text-purple-800 border border-purple-400",
  "ultra rare":
    "bg-gradient-to-r from-orange-200 to-orange-300 text-orange-800 border border-orange-400",
  "secret rare":
    "bg-gradient-to-r from-red-200 to-red-300 text-red-800 border border-red-400",
};

export default function MyCardsPage() {
  const [cards, setCards] = useState<UserCard[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedCard, setSelectedCard] = useState<UserCard | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState<string>("");
  const [selectedStoryCardName, setSelectedStoryCardName] =
    useState<string>("");
  const [rarities, setRarities] = useState<Rarity[]>([]);
  const [elements, setElements] = useState<Element[]>([]);
  const [pricingRules, setPricingRules] = useState<any[]>([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyCards();
    }
    fetchCategories();
    fetchRarities();
    fetchElements();
    fetchPricingRules();
  }, [isAuthenticated]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchRarities = async () => {
    try {
      const response = await fetch("/api/rarities");
      if (response.ok) {
        const data = await response.json();
        setRarities(data.rarities || []);
      }
    } catch (error) {
      console.error("Failed to fetch rarities:", error);
    }
  };

  const fetchElements = async () => {
    try {
      const response = await fetch("/api/elements");
      if (response.ok) {
        const data = await response.json();
        setElements(data.elements || []);
      }
    } catch (error) {
      console.error("Failed to fetch elements:", error);
    }
  };

  const fetchPricingRules = async () => {
    try {
      const response = await fetch("/api/admin/pricing");
      if (response.ok) {
        const data = await response.json();
        setPricingRules(data.rules || []);
      }
    } catch (error) {
      console.error("Failed to fetch pricing rules:", error);
    }
  };

  const fetchMyCards = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/my-cards");
      if (response.ok) {
        const data: MyCardsResponse = await response.json();
        setCards(data.cards);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCardModal = (userCard: UserCard) => {
    setSelectedCard(userCard);
  };

  const closeCardModal = () => {
    setSelectedCard(null);
  };

  const openFullScreenImage = (imageUrl: string) => {
    setFullScreenImage(imageUrl);
  };

  const closeFullScreenImage = () => {
    setFullScreenImage(null);
  };

  // Utility functions to get rarity and element styling
  const getRarityData = (rarityName: string | null) => {
    if (!rarityName) return null;
    return rarities.find(
      (r) =>
        r.name.toLowerCase() === rarityName.toLowerCase() ||
        r.slug.toLowerCase() === rarityName.toLowerCase()
    );
  };

  const getElementData = (elementName: string | null) => {
    if (!elementName) return null;
    return elements.find(
      (e) =>
        e.name.toLowerCase() === elementName.toLowerCase() ||
        e.slug.toLowerCase() === elementName.toLowerCase()
    );
  };

  // Get category display name
  const getCategoryDisplayName = (categorySlug: string | null | undefined) => {
    if (!categorySlug) return null;
    const category = categories.find((cat) => cat.slug === categorySlug);
    return category ? category.name : categorySlug;
  };

  // Calculate diamond price using pricing rules
  const calculateDiamondPriceFromRules = (
    rarity: string | null,
    estimatedValue?: number,
    confidence?: number
  ): number => {
    if (!rarity || pricingRules.length === 0) {
      // Fallback to basic calculation if no rules
      return parseInt(
        rarity === "rare"
          ? "180"
          : rarity === "epic"
            ? "250"
            : rarity === "legendary"
              ? "500"
              : rarity === "super rare"
                ? "300"
                : rarity === "ultra rare"
                  ? "400"
                  : rarity === "secret rare"
                    ? "600"
                    : "150"
      );
    }

    // Find the best matching pricing rule
    const applicableRules = pricingRules
      .filter((rule) => rule.isActive)
      .filter((rule) => {
        if (rule.type === "rarity-based") {
          return rule.targetValue?.toLowerCase() === rarity.toLowerCase();
        }
        return false;
      })
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    if (applicableRules.length === 0) {
      // No specific rule found, use fallback
      return parseInt(
        rarity === "rare"
          ? "180"
          : rarity === "epic"
            ? "250"
            : rarity === "legendary"
              ? "500"
              : rarity === "super rare"
                ? "300"
                : rarity === "ultra rare"
                  ? "400"
                  : rarity === "secret rare"
                    ? "600"
                    : "150"
      );
    }

    const rule = applicableRules[0];
    let price = rule.basePrice * (rule.multiplier || 1);

    // Apply confidence modifier if available
    if (confidence && confidence < 100) {
      const confidenceMultiplier = 0.5 + (confidence / 100) * 0.5; // 50% to 100% based on confidence
      price *= confidenceMultiplier;
    }

    // Apply min/max constraints
    if (rule.minPrice && price < rule.minPrice) {
      price = rule.minPrice;
    }
    if (rule.maxPrice && price > rule.maxPrice) {
      price = rule.maxPrice;
    }

    return Math.round(price);
  };

  // Get primary category for description
  const primaryCategory =
    categories.find((cat) => cat.slug === "anime") || categories[0];

  // Filter and sort cards
  const filteredAndSortedCards = cards
    .filter((userCard) => {
      const card = userCard.card;
      const matchesSearch =
        (card.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.character || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (card.series || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRarity = !selectedRarity || card.rarity === selectedRarity;
      const matchesCategory =
        !selectedCategory || card.series === selectedCategory;

      return matchesSearch && matchesRarity && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.purchaseDate).getTime() -
            new Date(a.purchaseDate).getTime()
          );
        case "name":
          return (a.card.name || "").localeCompare(b.card.name || "");
        case "rarity":
          const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
          return (
            (rarityOrder[b.card.rarity || "common"] || 1) -
            (rarityOrder[a.card.rarity || "common"] || 1)
          );
        case "value":
          return (b.card.estimatedValue || 0) - (a.card.estimatedValue || 0);
        default:
          return 0;
      }
    });

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="mx-auto max-w-md px-6 text-center">
          <CreditCard className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Please Sign In
          </h2>
          <p className="mb-6 text-gray-600">
            You need to sign in to view your card collection.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-lg text-gray-600">
            Loading your collection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with Info Guide Button */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-gray-900">
              {primaryCategory?.icon || "🎴"} My Card Collection
            </h1>
            <button
              onClick={() => setShowInfoModal(true)}
              className="ml-4 flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-white shadow-lg transition-all hover:scale-105 hover:from-indigo-700 hover:to-blue-700"
              title="İkon Rehberi"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm">İkon Rehberi</span>
            </button>
          </div>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            {primaryCategory
              ? `Your amazing ${primaryCategory.name.toLowerCase()} card collection! Browse, filter, and admire the cards you've collected on your learning journey.`
              : "Your amazing card collection! Browse, filter, and admire the cards you've collected on your learning journey."}
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalCards}
                  </p>
                  <p className="text-gray-600">Total Cards</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <Award className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.uniqueCards}
                  </p>
                  <p className="text-gray-600">Unique Cards</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <Diamond className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalValue}
                  </p>
                  <p className="text-gray-600">Total Value</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round((stats.uniqueCards / stats.totalCards) * 100) ||
                      0}
                    %
                  </p>
                  <p className="text-gray-600">Collection Rate</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="mb-8 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
          <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-6">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Search Cards
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, character, anime..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Rarity Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Rarity
              </label>
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Rarities</option>
                <option value="common">Common</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {stats?.animeBreakdown &&
                  Object.keys(stats.animeBreakdown).map((series) => (
                    <option key={series} value={series}>
                      {series} ({stats.animeBreakdown[series]})
                    </option>
                  ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Recently Acquired</option>
                <option value="name">Name A-Z</option>
                <option value="rarity">Rarity</option>
                <option value="value">Value</option>
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                View
              </label>
              <div className="flex overflow-hidden rounded-xl border border-gray-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 text-right">
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedRarity("");
                setSelectedCategory("");
                setSortBy("recent");
              }}
              className="rounded-lg px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredAndSortedCards.length} of {cards.length} cards
          </p>
        </div>

        {/* Cards Grid/List */}
        {filteredAndSortedCards.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAndSortedCards.map((userCard) => {
                const rarityStyles = getRarityStyles(
                  userCard.card.rarity || null
                );
                return (
                  <div
                    key={userCard.id}
                    className={`${rarityStyles.container} ${rarityStyles.animation}`}
                    onClick={() => openCardModal(userCard)}
                  >
                    {/* Card Image */}
                    <div
                      className={`${rarityStyles.imageContainer} aspect-[2/3]`}
                    >
                      <img
                        src={`/api/secure-image?cardId=${userCard.card.id}&type=thumbnail`}
                        alt={userCard.card.name || "Card"}
                        className="h-full w-full object-cover object-[center_top] transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          // Fallback to direct URL if secure API fails
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes("placeholder")) {
                            target.src =
                              userCard.card.thumbnailUrl ||
                              userCard.card.imageUrl ||
                              userCard.card.imagePath ||
                              "/placeholder-card.jpg";
                          }
                        }}
                      />
                      <div
                        className={`absolute left-2 top-2 rounded-full px-2 py-1 text-xs font-medium ${
                          RARITY_COLORS[userCard.card.rarity || "common"]
                        }`}
                      >
                        {userCard.card.rarity || "common"}
                      </div>
                    </div>

                    {/* Card Info */}
                    <div className="p-4">
                      <h3 className="mb-1 line-clamp-1 font-semibold text-gray-900">
                        {userCard.card.name || "Unnamed Card"}
                      </h3>
                      <p className="mb-2 text-sm text-gray-600">
                        {userCard.card.character || "Unknown"} •{" "}
                        {getCategoryDisplayName(userCard.card.series) ||
                          "Unknown Series"}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Acquired</span>
                        <span>
                          {new Date(userCard.purchaseDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedCards.map((userCard) => (
                <div
                  key={userCard.id}
                  className="cursor-pointer rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                  onClick={() => openCardModal(userCard)}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={`/api/secure-image?cardId=${userCard.card.id}&type=thumbnail`}
                      alt={userCard.card.name || "Card"}
                      className="h-20 w-16 rounded-lg object-contain"
                      onError={(e) => {
                        // Fallback to direct URL if secure API fails
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes("placeholder")) {
                          target.src =
                            userCard.card.thumbnailUrl ||
                            userCard.card.imageUrl ||
                            userCard.card.imagePath ||
                            "/placeholder-card.jpg";
                        }
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="mb-1 font-semibold text-gray-900">
                            {userCard.card.name || "Unnamed Card"}
                          </h3>
                          <p className="mb-2 text-gray-600">
                            {userCard.card.character || "Unknown"} •{" "}
                            {getCategoryDisplayName(userCard.card.series) ||
                              "Unknown Series"}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${
                                RARITY_COLORS[userCard.card.rarity || "common"]
                              }`}
                            >
                              {userCard.card.rarity || "common"}
                            </span>
                            <span>
                              💎{" "}
                              {userCard.card.estimatedValue ||
                                calculateDiamondPriceFromRules(
                                  userCard.card.rarity || null,
                                  userCard.card.estimatedValue,
                                  (userCard.card as any).confidence
                                )}
                            </span>
                            <span>
                              Acquired:{" "}
                              {new Date(
                                userCard.purchaseDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="py-12 text-center">
            <CreditCard className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-medium text-gray-900">
              {cards.length === 0 ? "No Cards Yet" : "No Cards Found"}
            </h3>
            <p className="mb-6 text-gray-600">
              {cards.length === 0
                ? "Start your collection by purchasing cards from the shop!"
                : "Try adjusting your search filters to find the cards you're looking for."}
            </p>
            {cards.length === 0 && (
              <Link
                href="/shop"
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Visit Card Shop
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCard.card.name || "Unnamed Card"}
              </h2>
              <button
                onClick={closeCardModal}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Image */}
                <div className="flex flex-col items-center justify-center">
                  <div className="group relative">
                    <img
                      src={`/api/secure-image?cardId=${selectedCard.card.id}&type=full`}
                      alt={selectedCard.card.name || "Anime Card"}
                      className="max-h-96 max-w-full rounded-xl object-contain shadow-lg"
                      onError={(e) => {
                        // Fallback to direct URL if secure API fails
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes("placeholder")) {
                          target.src =
                            selectedCard.card.imageUrl ||
                            selectedCard.card.imagePath ||
                            "/placeholder-card.svg";
                        }
                      }}
                    />
                    {/* Expand Icon */}
                    <button
                      onClick={() =>
                        openFullScreenImage(
                          `/api/secure-image?cardId=${selectedCard.card.id}&type=full`
                        )
                      }
                      className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white opacity-0 transition-all hover:bg-black/80 group-hover:opacity-100"
                      title="View image in full screen"
                    >
                      <Expand className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Diamond Price - Below Image */}
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 shadow-lg">
                      <Diamond className="h-5 w-5 text-white" />
                      <span className="text-lg font-bold text-white">
                        {selectedCard.card.estimatedValue ||
                          calculateDiamondPriceFromRules(
                            selectedCard.card.rarity || null,
                            selectedCard.card.estimatedValue,
                            (selectedCard.card as any).confidence
                          )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details - Kompakt */}
                <div className="space-y-2">
                  {/* Series and Character */}
                  <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-medium text-blue-700">Seri:</span>
                        <p className="truncate font-medium text-blue-900">
                          {(() => {
                            const category = categories.find(
                              (cat) => cat.slug === selectedCard.card.series
                            );
                            return category
                              ? category.name
                              : selectedCard.card.series || "Bilinmiyor";
                          })()}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-blue-700">
                          Karakter:
                        </span>
                        <p className="truncate font-medium text-blue-900">
                          {(() => {
                            const character = selectedCard.card.character;
                            if (
                              !character ||
                              character === "Unknown" ||
                              character === "Unknown Fighter" ||
                              character === "Anime Character" ||
                              character.trim() === ""
                            ) {
                              return "Gizemli Karakter";
                            }
                            return character;
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Rarity Display */}
                  {selectedCard.card.rarity &&
                    (() => {
                      const rarityData = getRarityData(
                        selectedCard.card.rarity
                      );
                      return (
                        <div
                          className={`rounded-lg border-2 p-3 transition-all ${rarityData?.animation || ""}`}
                          style={{
                            backgroundColor:
                              rarityData?.bgColor ||
                              (rarityData?.color
                                ? rarityData.color + "1A"
                                : "#F3F4F6"),
                            borderColor:
                              rarityData?.borderColor ||
                              rarityData?.color ||
                              "#D1D5DB",
                            background:
                              rarityData?.gradient ||
                              (rarityData?.color
                                ? `linear-gradient(135deg, ${rarityData.color}20, ${rarityData.color}10)`
                                : ""),
                          }}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span
                              className="text-xs font-medium"
                              style={{
                                color:
                                  rarityData?.textColor ||
                                  rarityData?.color ||
                                  "#374151",
                              }}
                            >
                              Rarity Level:
                            </span>
                            {rarityData?.iconUrl && (
                              <img
                                src={rarityData.iconUrl}
                                alt=""
                                className="h-4 w-4"
                              />
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div
                              className="inline-flex items-center rounded-full px-3 py-1 text-sm font-bold shadow-sm"
                              style={{
                                backgroundColor: rarityData?.color || "#6B7280",
                                color: "white",
                              }}
                            >
                              ⭐ {rarityData?.name || selectedCard.card.rarity}
                            </div>
                            <span
                              className="text-xs opacity-75"
                              style={{
                                color:
                                  rarityData?.textColor ||
                                  rarityData?.color ||
                                  "#6B7280",
                              }}
                            >
                              Level {rarityData?.level || 1}
                            </span>
                          </div>
                          {rarityData?.description && (
                            <p
                              className="mt-2 text-xs opacity-80"
                              style={{
                                color:
                                  rarityData?.textColor ||
                                  rarityData?.color ||
                                  "#6B7280",
                              }}
                            >
                              {rarityData.description}
                            </p>
                          )}
                        </div>
                      );
                    })()}

                  {/* Enhanced Element Display */}
                  {(selectedCard.card as any).element &&
                    (() => {
                      const cardElement = (selectedCard.card as any).element;
                      const elementData = getElementData(cardElement);
                      return (
                        <div
                          className="rounded-lg border-2 p-3"
                          style={{
                            backgroundColor: elementData?.color
                              ? elementData.color + "1A"
                              : "#F0FDF4",
                            borderColor: elementData?.color || "#22C55E",
                          }}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span
                              className="text-xs font-medium"
                              style={{ color: elementData?.color || "#15803D" }}
                            >
                              Element:
                            </span>
                            {elementData?.iconUrl && (
                              <img
                                src={elementData.iconUrl}
                                alt=""
                                className="h-4 w-4"
                              />
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div
                              className="inline-flex items-center rounded-full px-3 py-1 text-sm font-bold text-white shadow-sm"
                              style={{
                                backgroundColor:
                                  elementData?.color || "#22C55E",
                              }}
                            >
                              {elementData?.icon || "🌟"}{" "}
                              {elementData?.name || cardElement}
                            </div>
                            {elementData?.priceModifier &&
                              elementData.priceModifier !== 1 && (
                                <span
                                  className="text-xs opacity-75"
                                  style={{
                                    color: elementData?.color || "#15803D",
                                  }}
                                >
                                  {elementData.priceModifier}x değer
                                </span>
                              )}
                          </div>
                          {elementData?.effectDescription && (
                            <p
                              className="mt-2 text-xs opacity-80"
                              style={{ color: elementData?.color || "#15803D" }}
                            >
                              {elementData.effectDescription}
                            </p>
                          )}
                        </div>
                      );
                    })()}

                  {/* Category */}
                  {(selectedCard.card as any).category && (
                    <div className="rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50 p-2">
                      <span className="text-xs font-medium text-teal-700">
                        Kategori:
                      </span>
                      <div className="mt-1 flex items-center space-x-1">
                        <span className="text-xs">🏷️</span>
                        <p className="text-xs font-medium text-teal-900">
                          {(selectedCard.card as any).category}
                        </p>
                      </div>
                    </div>
                  )}
                  {/* Power Stats - Ayrıntılı */}
                  {(selectedCard.card as any).attackPower &&
                    (selectedCard.card as any).defense &&
                    (selectedCard.card as any).speed && (
                      <div className="rounded-lg bg-gradient-to-r from-orange-50 to-red-50 p-2">
                        <span className="mb-1 block text-xs font-medium text-orange-700">
                          Power Statistics:
                        </span>
                        <div className="grid grid-cols-3 gap-1 text-xs">
                          <div className="rounded bg-red-100 p-1 text-center">
                            <div className="font-bold text-red-600">
                              ⚡ {(selectedCard.card as any).attackPower}
                            </div>
                            <div className="text-xs text-red-500">Attack</div>
                          </div>
                          <div className="rounded bg-blue-100 p-1 text-center">
                            <div className="font-bold text-blue-600">
                              🛡️ {(selectedCard.card as any).defense}
                            </div>
                            <div className="text-xs text-blue-500">Defense</div>
                          </div>
                          <div className="rounded bg-green-100 p-1 text-center">
                            <div className="font-bold text-green-600">
                              💨 {(selectedCard.card as any).speed}
                            </div>
                            <div className="text-xs text-green-500">Speed</div>
                          </div>
                        </div>
                      </div>
                    )}

                  {selectedCard.card.estimatedValue && (
                    <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-2">
                      <span className="text-xs font-medium text-purple-700">
                        Değer:
                      </span>
                      <p className="font-bold text-purple-900">
                        💎{" "}
                        {selectedCard.card.estimatedValue ||
                          calculateDiamondPriceFromRules(
                            selectedCard.card.rarity || null,
                            selectedCard.card.estimatedValue,
                            (selectedCard.card as any).confidence
                          )}
                      </p>
                    </div>
                  )}

                  {/* Koleksiyon Bilgisi */}
                  <div className="rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-amber-700">
                        Koleksiyonda:
                      </span>
                      <span className="font-bold text-amber-900">
                        {new Date(selectedCard.purchaseDate).toLocaleDateString(
                          "tr-TR"
                        )}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center space-x-1">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-green-700">
                        Doğrulanmış Koleksiyon
                      </span>
                    </div>
                  </div>

                  {/* Hikaye Butonu */}
                  {selectedCard.card.story && (
                    <button
                      onClick={() => {
                        setSelectedStory(selectedCard.card.story || "");
                        setSelectedStoryCardName(
                          selectedCard.card.name || "Card"
                        );
                        setShowStoryModal(true);
                      }}
                      className="mt-2 flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 text-sm text-white shadow-lg hover:from-purple-700 hover:to-purple-800"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      <Heart className="mr-1 h-3 w-3" />
                      Hikayeyi Oku
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Image Modal */}
      {fullScreenImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={closeFullScreenImage}
        >
          <div className="relative max-h-[95vh] max-w-[95vw]">
            <div className="relative">
              <img
                src={fullScreenImage}
                alt="Full Screen Card"
                className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              {/* No watermark - user already owns this card */}
            </div>
            <button
              onClick={closeFullScreenImage}
              className="absolute right-4 top-4 rounded-full bg-black/60 p-3 text-white transition-all hover:bg-black/80"
              title="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Story Modal */}
      {showStoryModal && selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowStoryModal(false)}
        >
          <div
            className="relative w-full max-w-md transform rounded-2xl bg-white shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Rarity Header with Gradient */}
            <div
              className={`relative rounded-t-2xl p-4 ${
                selectedCard.card.rarity?.toLowerCase() === "legendary"
                  ? "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500"
                  : selectedCard.card.rarity?.toLowerCase() === "epic"
                    ? "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700"
                    : selectedCard.card.rarity?.toLowerCase() === "rare"
                      ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"
                      : selectedCard.card.rarity?.toLowerCase() === "ultra rare"
                        ? "bg-gradient-to-r from-orange-500 via-orange-600 to-red-500"
                        : selectedCard.card.rarity?.toLowerCase() ===
                            "secret rare"
                          ? "bg-gradient-to-r from-red-500 via-red-600 to-pink-600"
                          : "bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <div className="mb-1 flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 drop-shadow-lg" />
                    <h3 className="text-base font-bold drop-shadow-lg">
                      Kart Hikayesi
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                      {selectedCard.card.rarity || "Common"}
                    </span>
                    <div className="flex items-center space-x-1 text-xs opacity-90">
                      <Heart className="h-3 w-3" />
                      <span>Koleksiyonunda</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowStoryModal(false)}
                  className="rounded-full p-1.5 text-white transition-colors hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Story Content */}
            <div className="p-4">
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-800">
                  {selectedStoryCardName}
                </h4>
              </div>

              <div className="rounded-xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 shadow-inner">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                      <span className="text-sm text-white">📖</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="custom-scrollbar max-h-48 overflow-y-auto pr-2">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
                        {selectedStory}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 pt-0">
              <button
                onClick={() => setShowStoryModal(false)}
                className={`w-full rounded-lg px-4 py-2.5 font-medium text-white shadow-lg transition-all hover:scale-105 ${
                  selectedCard.card.rarity?.toLowerCase() === "legendary"
                    ? "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                    : selectedCard.card.rarity?.toLowerCase() === "epic"
                      ? "bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
                      : selectedCard.card.rarity?.toLowerCase() === "rare"
                        ? "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                        : selectedCard.card.rarity?.toLowerCase() ===
                            "ultra rare"
                          ? "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                          : selectedCard.card.rarity?.toLowerCase() ===
                              "secret rare"
                            ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                            : "bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800"
                }`}
              >
                Hikayeyi Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gamified Collection Guide Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-h-[95vh] w-full max-w-6xl overflow-auto rounded-3xl border border-purple-500/30 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl">
            {/* Animated Header */}
            <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-r from-amber-400 via-purple-500 to-pink-600 p-6">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute left-0 top-0 h-20 w-20 animate-pulse rounded-full bg-white"></div>
                <div className="absolute right-10 top-5 h-8 w-8 animate-bounce rounded-full bg-amber-200 delay-300"></div>
                <div className="absolute bottom-0 right-0 h-16 w-16 animate-pulse rounded-full bg-purple-200 delay-500"></div>
              </div>

              <div className="relative flex items-center justify-between">
                <div className="text-white">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 animate-ping rounded-full bg-white/20"></div>
                      <div className="relative rounded-full bg-white/10 p-3 backdrop-blur-sm">
                        <CreditCard className="h-10 w-10 animate-pulse drop-shadow-lg" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold drop-shadow-lg">
                        🎴 Koleksiyon Rehberi
                      </h2>
                      <p className="text-lg text-amber-100 opacity-90">
                        Kartlarınızın gücünü ve değerini keşfedin!
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="group rounded-full p-3 text-white transition-all hover:scale-110 hover:bg-white/20"
                >
                  <X className="h-6 w-6 transition-transform group-hover:rotate-90" />
                </button>
              </div>
            </div>

            {/* Content with Gaming Theme */}
            <div className="bg-gradient-to-br from-slate-800 to-purple-800 p-8">
              {/* Collection Stats Section - NEW for My Cards */}
              <div className="mb-8 rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6">
                <h3 className="mb-6 flex items-center space-x-3 text-2xl font-bold text-green-300">
                  <span className="text-3xl">🏆</span>
                  <span>Koleksiyon İstatistikleri</span>
                  <span className="rounded-full bg-green-500/20 px-2 py-1 text-lg">
                    COLLECTION
                  </span>
                </h3>

                <div className="grid gap-6 md:grid-cols-4">
                  {/* Total Cards */}
                  <div className="group relative overflow-hidden rounded-xl border border-blue-500/40 bg-gradient-to-br from-blue-600/30 to-blue-800/30 p-4 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
                    <div className="relative text-center">
                      <div className="mb-2 flex items-center justify-center space-x-2">
                        <Package className="h-6 w-6 text-blue-400" />
                        <h4 className="font-bold text-blue-300">Toplam Kart</h4>
                      </div>
                      <div className="text-3xl font-bold text-blue-200">
                        {stats?.totalCards || 0}
                      </div>
                      <p className="mt-1 text-xs text-blue-300">
                        Koleksiyonunuzda
                      </p>
                    </div>
                  </div>

                  {/* Unique Cards */}
                  <div className="group relative overflow-hidden rounded-xl border border-purple-500/40 bg-gradient-to-br from-purple-600/30 to-purple-800/30 p-4 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
                    <div className="relative text-center">
                      <div className="mb-2 flex items-center justify-center space-x-2">
                        <Award className="h-6 w-6 text-purple-400" />
                        <h4 className="font-bold text-purple-300">Benzersiz</h4>
                      </div>
                      <div className="text-3xl font-bold text-purple-200">
                        {stats?.uniqueCards || 0}
                      </div>
                      <p className="mt-1 text-xs text-purple-300">
                        Farklı kart türü
                      </p>
                    </div>
                  </div>

                  {/* Total Value */}
                  <div className="group relative overflow-hidden rounded-xl border border-yellow-500/40 bg-gradient-to-br from-yellow-600/30 to-orange-600/30 p-4 transition-all hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20">
                    <div className="absolute inset-0 bg-yellow-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
                    <div className="relative text-center">
                      <div className="mb-2 flex items-center justify-center space-x-2">
                        <Diamond className="h-6 w-6 text-yellow-400" />
                        <h4 className="font-bold text-yellow-300">
                          Toplam Değer
                        </h4>
                      </div>
                      <div className="text-3xl font-bold text-yellow-200">
                        💎{stats?.totalValue || 0}
                      </div>
                      <p className="mt-1 text-xs text-yellow-300">
                        Diamond değeri
                      </p>
                    </div>
                  </div>

                  {/* Collection Rate */}
                  <div className="group relative overflow-hidden rounded-xl border border-green-500/40 bg-gradient-to-br from-green-600/30 to-emerald-600/30 p-4 transition-all hover:scale-105 hover:shadow-xl hover:shadow-green-500/20">
                    <div className="absolute inset-0 bg-green-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
                    <div className="relative text-center">
                      <div className="mb-2 flex items-center justify-center space-x-2">
                        <TrendingUp className="h-6 w-6 text-green-400" />
                        <h4 className="font-bold text-green-300">Çeşitlilik</h4>
                      </div>
                      <div className="text-3xl font-bold text-green-200">
                        {Math.round(
                          (stats?.uniqueCards / stats?.totalCards) * 100
                        ) || 0}
                        %
                      </div>
                      <p className="mt-1 text-xs text-green-300">
                        Unique oranı
                      </p>
                    </div>
                  </div>
                </div>

                {/* Collection Achievement Badges */}
                <div className="mt-6 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-4">
                  <h4 className="mb-3 flex items-center space-x-2 font-bold text-indigo-300">
                    <span>🏅</span>
                    <span>Koleksiyon Başarıları</span>
                  </h4>
                  <div className="grid gap-4 text-sm md:grid-cols-3">
                    <div className="rounded bg-indigo-800/30 p-3">
                      <p className="font-medium text-indigo-200">
                        📚 Collector Status:
                      </p>
                      <div className="mt-1 text-xs text-indigo-100">
                        {(stats?.totalCards || 0) < 5
                          ? "🥉 Yeni Koleksiyoncu"
                          : (stats?.totalCards || 0) < 20
                            ? "🥈 Deneyimli Koleksiyoncu"
                            : "🥇 Usta Koleksiyoncu"}
                      </div>
                    </div>
                    <div className="rounded bg-purple-800/30 p-3">
                      <p className="font-medium text-purple-200">
                        ⭐ Rarity Master:
                      </p>
                      <div className="mt-1 text-xs text-purple-100">
                        {stats?.rarityBreakdown?.legendary
                          ? `${Object.keys(stats.rarityBreakdown).length} farklı rarity`
                          : "Legendary arıyorsun!"}
                      </div>
                    </div>
                    <div className="rounded bg-pink-800/30 p-3">
                      <p className="font-medium text-pink-200">
                        💎 Value Rank:
                      </p>
                      <div className="mt-1 text-xs text-pink-100">
                        {(stats?.totalValue || 0) < 1000
                          ? "💎 Rising Collector"
                          : (stats?.totalValue || 0) < 5000
                            ? "💎💎 Premium Collector"
                            : "💎💎💎 Elite Collector"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                {/* Rarity Section - Enhanced for Collection */}
                <div className="rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-6">
                  <h3 className="mb-6 flex items-center space-x-3 text-2xl font-bold text-yellow-300">
                    <span className="text-3xl">💎</span>
                    <span>Nadir Seviyeler</span>
                    <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-lg">
                      OWNED
                    </span>
                  </h3>
                  <div className="space-y-4">
                    {rarities.length > 0 ? (
                      rarities.map((rarity, index) => {
                        const ownedCount =
                          stats?.rarityBreakdown?.[rarity.name.toLowerCase()] ||
                          0;
                        const isOwned = ownedCount > 0;

                        return (
                          <div
                            key={rarity.id}
                            className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 p-4 transition-all hover:scale-105 hover:shadow-xl ${isOwned ? "opacity-100" : "opacity-50"}`}
                            style={{
                              backgroundColor: rarity.bgColor
                                ? `${rarity.bgColor}40`
                                : "#1F2937",
                              borderColor: rarity.borderColor || "#374151",
                              boxShadow:
                                rarity.color && isOwned
                                  ? `0 0 20px ${rarity.color}20`
                                  : "none",
                            }}
                          >
                            {/* Collection status indicator */}
                            <div
                              className={`absolute right-2 top-2 rounded-full px-2 py-1 text-xs font-bold ${isOwned ? "bg-green-500/80 text-white" : "bg-gray-500/80 text-white"}`}
                            >
                              {isOwned ? `${ownedCount} Adet` : "Henüz Yok"}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="relative">
                                  <div
                                    className={`absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 ${isOwned ? "opacity-30" : "opacity-10"}`}
                                  ></div>
                                  <span className="relative text-4xl drop-shadow-lg">
                                    {rarity.iconUrl ? "🎯" : "💎"}
                                  </span>
                                </div>
                                <div>
                                  <p
                                    className="text-xl font-bold"
                                    style={{ color: rarity.color || "#F3F4F6" }}
                                  >
                                    {rarity.name}
                                  </p>
                                  <p
                                    className="text-sm opacity-80"
                                    style={{
                                      color: rarity.textColor || "#D1D5DB",
                                    }}
                                  >
                                    {rarity.description ||
                                      "Efsanevi güç seviyesi"}
                                  </p>
                                  <div className="mt-1 flex items-center space-x-2">
                                    <span className="rounded bg-black/30 px-2 py-1 text-xs">
                                      Level {rarity.level}
                                    </span>
                                    {isOwned && (
                                      <span className="rounded bg-green-500/30 px-2 py-1 text-xs text-green-200">
                                        ✅ Koleksiyonda
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                {isOwned ? (
                                  <div>
                                    <p className="text-lg font-bold text-green-300">
                                      🏆 Sahibi
                                    </p>
                                    <p className="text-xs text-green-400">
                                      Drop: %{rarity.dropRate}
                                    </p>
                                  </div>
                                ) : (
                                  <div>
                                    <p className="text-lg font-bold text-gray-400">
                                      🔍 Arıyor
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Drop: %{rarity.dropRate}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-12 text-center text-gray-400">
                        <div className="mb-4 animate-spin text-6xl">💎</div>
                        <p className="text-lg">Nadir veriler yükleniyor...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Elements Section - Enhanced for Collection */}
                <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-6">
                  <h3 className="mb-6 flex items-center space-x-3 text-2xl font-bold text-blue-300">
                    <span className="text-3xl">🌟</span>
                    <span>Element Güçleri</span>
                    <span className="rounded-full bg-blue-500/20 px-2 py-1 text-lg">
                      POWER
                    </span>
                  </h3>
                  <div className="space-y-4">
                    {elements.length > 0 ? (
                      elements.map((element, index) => (
                        <div
                          key={element.id}
                          className="group relative cursor-pointer overflow-hidden rounded-xl border-2 p-4 transition-all hover:scale-105 hover:shadow-xl"
                          style={{
                            backgroundColor: element.color
                              ? `${element.color}20`
                              : "#1F2937",
                            borderColor: element.color || "#374151",
                            boxShadow: element.color
                              ? `0 0 15px ${element.color}30`
                              : "none",
                          }}
                        >
                          {/* Element mastery level */}
                          <div className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                            Master Lv.{index + 1}
                          </div>

                          <div className="flex items-start space-x-4">
                            <div className="relative">
                              <div
                                className="absolute inset-0 animate-pulse rounded-full opacity-50"
                                style={{
                                  backgroundColor: element.color || "#3B82F6",
                                }}
                              ></div>
                              <span className="relative text-4xl drop-shadow-lg">
                                {element.icon || "✨"}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p
                                className="text-xl font-bold"
                                style={{ color: element.color || "#60A5FA" }}
                              >
                                {element.name}
                              </p>
                              <p
                                className="mt-1 text-sm opacity-90"
                                style={{ color: element.color || "#93C5FD" }}
                              >
                                {element.effectDescription ||
                                  element.description ||
                                  "Büyülü element gücü"}
                              </p>
                              {element.priceModifier !== 1 && (
                                <div className="mt-3 rounded-lg bg-black/20 p-2">
                                  <p className="text-xs font-bold text-amber-300">
                                    💰 Değer Çarpanı:
                                  </p>
                                  <p className="text-xs text-amber-200">
                                    {element.priceModifier}x fiyat etkisi
                                  </p>
                                </div>
                              )}
                              <div className="mt-2 flex items-center space-x-2">
                                <span className="rounded bg-black/30 px-2 py-1 text-xs">
                                  Element Bonusu: +{Math.floor(5 + index * 3)}%
                                </span>
                                <span className="rounded bg-black/30 px-2 py-1 text-xs">
                                  Koleksiyon Değeri: +
                                  {Math.floor(2 + index * 2)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center text-gray-400">
                        <div className="mb-4 animate-bounce text-6xl">🌟</div>
                        <p className="text-lg">
                          Element büyüleri yükleniyor...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Collection Management Section */}
              <div className="mt-8 rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 p-6">
                <h4 className="mb-4 flex items-center space-x-3 text-xl font-bold text-teal-300">
                  <span className="text-2xl">📋</span>
                  <span>Koleksiyon Yönetimi</span>
                </h4>
                <div className="grid gap-4 text-sm md:grid-cols-3">
                  <div className="rounded-lg bg-teal-800/30 p-4">
                    <h5 className="mb-2 font-bold text-teal-200">
                      🔍 Keşif Stratejisi
                    </h5>
                    <ul className="space-y-1 text-xs text-teal-100">
                      <li>• Eksik rarity seviyelerini belirle</li>
                      <li>• Element çeşitliliğini artır</li>
                      <li>• Düşük drop rate'li kartları hedefle</li>
                      <li>• Özel etkinlikleri takip et</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-blue-800/30 p-4">
                    <h5 className="mb-2 font-bold text-blue-200">
                      💎 Değer Optimizasyonu
                    </h5>
                    <ul className="space-y-1 text-xs text-blue-100">
                      <li>• Yüksek value/card oranını hedefle</li>
                      <li>• Legendary kartları prioritize et</li>
                      <li>• Element bonuslarını değerlendir</li>
                      <li>• Market trendlerini analiz et</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-purple-800/30 p-4">
                    <h5 className="mb-2 font-bold text-purple-200">
                      🏆 Başarı Takibi
                    </h5>
                    <ul className="space-y-1 text-xs text-purple-100">
                      <li>• Koleksiyon hedeflerini belirle</li>
                      <li>• Progress tracking yap</li>
                      <li>• Milestone rewards'ları kovala</li>
                      <li>• Community ile kartlarını paylaş</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Gamified Footer */}
            <div className="rounded-b-3xl border-t border-purple-500/30 bg-gradient-to-r from-slate-800 to-purple-800 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="animate-bounce text-2xl">🎴</div>
                  <div>
                    <p className="text-sm text-purple-200">
                      <strong>Collector Status:</strong> 💎{" "}
                      {user?.currentDiamonds || 0} Diamonds | 🏆{" "}
                      {stats?.totalCards || 0} Cards
                    </p>
                    <p className="text-xs text-purple-300">
                      Koleksiyonunuzu büyütmeye devam edin!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="rounded-xl bg-gradient-to-r from-amber-600 to-purple-600 px-6 py-3 font-bold text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-amber-500/50"
                >
                  Koleksiyona Dön 🎴
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
