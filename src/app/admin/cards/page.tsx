"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  Trash2,
  Star,
  X,
  CheckCircle,
  Zap,
  Shield,
  Wind,
  Plus,
  Upload,
  Expand,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import {
  formatCurrency,
  formatDate,
  formatDiamonds,
  calculateDiamondPrice,
  getRarityTier,
  getRarityColor,
} from "@/lib/utils";
import {
  getElementColor,
  getRatingStars,
  getPowerColor,
} from "@/lib/ai/card-generator";
import CardUpload from "@/components/upload/card-upload";

interface Card {
  id: string;
  name: string;
  series: string | null;
  character: string | null;
  rarity: string | null;
  category: string | null;
  condition: string | null;
  estimatedValue: number | null;
  imageUrl: string;
  uploadDate: string;
  isAnalyzed: boolean;
  confidence: number | null;
  // Enhanced properties
  cardTitle: string | null;
  attackPower: number | null;
  defense: number | null;
  speed: number | null;
  specialAbility: string | null;
  element: string | null;
  rarityLevel: number | null;
  rating: number | null;
  diamondPrice: number | null;
  aiTags: string | null;
}

interface RarityAnalysis {
  detectedRarity: string;
  confidence: number;
  factors: {
    textPatterns: number;
    visualComplexity: number;
    seriesPopularity: number;
    characterImportance: number;
    fileNameIndicators: number;
  };
  reasoning: string[];
}

// Enhanced rarity styles for card containers with thicker borders
const RARITY_CARD_STYLES = {
  common: {
    container:
      "bg-white/80 backdrop-blur-sm rounded-lg shadow hover:shadow-lg border-2 border-gray-300",
    imageContainer:
      "bg-gray-100 rounded-md overflow-hidden mb-2 relative group",
    animation: "",
  },
  rare: {
    container:
      "bg-white/80 backdrop-blur-sm rounded-lg shadow hover:shadow-xl border-4 border-blue-400 hover:border-blue-500 hover:shadow-blue-200/50",
    imageContainer:
      "bg-gradient-to-br from-blue-50 to-blue-100 rounded-md overflow-hidden mb-2 relative group ring-3 ring-blue-400",
    animation: "animate-pulse-slow transition-all duration-300",
  },
  epic: {
    container:
      "bg-white/80 backdrop-blur-sm rounded-lg shadow hover:shadow-2xl border-4 border-purple-500 hover:border-purple-600 hover:shadow-purple-300/50",
    imageContainer:
      "bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 rounded-md overflow-hidden mb-2 relative group ring-3 ring-purple-500",
    animation: "animate-pulse-slow hover:scale-105 transition-all duration-300",
  },
  legendary: {
    container:
      "bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 backdrop-blur-sm rounded-lg shadow-2xl border-4 border-yellow-500 hover:border-yellow-600 legendary-glow",
    imageContainer:
      "bg-gradient-to-br from-yellow-100 via-amber-200 to-orange-200 rounded-md overflow-hidden mb-2 relative group ring-4 ring-yellow-500 shadow-xl legendary-shimmer",
    animation:
      "animate-pulse animate-float hover:scale-110 transition-all duration-500",
  },
  "super rare": {
    container:
      "bg-white/80 backdrop-blur-sm rounded-lg shadow hover:shadow-2xl border-4 border-purple-500 hover:border-purple-600 hover:shadow-purple-300/50",
    imageContainer:
      "bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 rounded-md overflow-hidden mb-2 relative group ring-3 ring-purple-500",
    animation: "animate-pulse-slow hover:scale-105 transition-all duration-300",
  },
  "ultra rare": {
    container:
      "bg-white/80 backdrop-blur-sm rounded-lg shadow-xl hover:shadow-2xl border-4 border-orange-500 hover:border-orange-600 ultra-rare-glow",
    imageContainer:
      "bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 rounded-md overflow-hidden mb-2 relative group ring-3 ring-orange-500 shadow-inner",
    animation: "animate-pulse-slow hover:scale-105 transition-all duration-300",
  },
  "secret rare": {
    container:
      "bg-gradient-to-br from-red-50 to-red-100 backdrop-blur-sm rounded-lg shadow-xl hover:shadow-2xl border-4 border-red-600 hover:border-red-700 secret-rare-glow",
    imageContainer:
      "bg-gradient-to-br from-red-100 via-red-200 to-red-300 rounded-md overflow-hidden mb-2 relative group ring-3 ring-red-600 shadow-lg",
    animation: "animate-pulse hover:scale-105 transition-all duration-300",
  },
};

// Get rarity-based styles
const getRarityStyles = (rarity: string | null) => {
  if (!rarity) return RARITY_CARD_STYLES.common;
  const rarityKey = rarity.toLowerCase() as keyof typeof RARITY_CARD_STYLES;
  return RARITY_CARD_STYLES[rarityKey] || RARITY_CARD_STYLES.common;
};

// Card Detail Modal Component Props
interface CardDetailModalProps {
  selectedCard: Card;
  onClose: () => void;
  onAnalyze: () => void;
  onEditCategory: () => void;
  onEditRarity: () => void;
  onDelete: () => void;
  onExpandImage: (imageUrl: string) => void;
  getRarityData: (rarityName: string | null) => any;
  getCategoryDisplayName: (categorySlug: string | null) => string | null;
  getCharacterDisplayName: (
    cardTitle: string | null,
    character: string | null
  ) => string | null;
  getElementColor: (element: string) => string;
  getRarityColor: (rarity: string) => string;
  formatDate: (date: Date) => string;
  formatDiamonds: (value: number) => string;
}

// Card Detail Modal Component
function CardDetailModal({
  selectedCard,
  onClose,
  onAnalyze,
  onEditCategory,
  onEditRarity,
  onDelete,
  onExpandImage,
  getRarityData,
  getCategoryDisplayName,
  getCharacterDisplayName,
  getElementColor,
  getRarityColor,
  formatDate,
  formatDiamonds,
}: CardDetailModalProps) {
  const rarityData = getRarityData(selectedCard.rarity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-auto rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-6">
          <h2 className="text-xl font-bold text-gray-900">Card Details</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column - Image */}
            <div>
              <div
                className={`relative overflow-hidden rounded-lg ${
                  rarityData?.color
                    ? `ring-4 ring-opacity-50`
                    : "ring-2 ring-gray-200"
                }`}
                style={
                  rarityData?.color
                    ? ({
                        "--tw-ring-color": `${rarityData.color}80`,
                      } as React.CSSProperties)
                    : undefined
                }
              >
                <img
                  src={selectedCard.imageUrl}
                  alt={selectedCard.cardTitle || selectedCard.name || "Card"}
                  className="h-auto w-full cursor-pointer object-cover transition-transform hover:scale-105"
                  onClick={() => onExpandImage(selectedCard.imageUrl)}
                />

                {/* Rarity Badge */}
                {selectedCard.rarity && (
                  <div
                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-sm font-medium shadow-lg ${getRarityColor(
                      selectedCard.rarity
                    )}`}
                  >
                    {selectedCard.rarity}
                  </div>
                )}

                {/* Expand Icon */}
                <button
                  onClick={() => onExpandImage(selectedCard.imageUrl)}
                  className="absolute bottom-3 right-3 rounded-full bg-black/60 p-2 text-white transition-all hover:bg-black/80"
                  title="Full Screen"
                >
                  <Expand className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Card Title */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedCard.cardTitle ||
                    selectedCard.name ||
                    "Unnamed Card"}
                </h3>
                {selectedCard.series && (
                  <p className="text-lg text-gray-600">
                    {getCategoryDisplayName(selectedCard.series)}
                  </p>
                )}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Character
                  </h4>
                  <p className="text-base text-gray-900">
                    {getCharacterDisplayName(
                      selectedCard.cardTitle,
                      selectedCard.character
                    ) || "Unknown"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Category
                  </h4>
                  <p className="text-base text-gray-900">
                    {getCategoryDisplayName(selectedCard.category) ||
                      "Not categorized"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Rarity</h4>
                  {selectedCard.rarity ? (
                    (() => {
                      const rarityData = getRarityData(selectedCard.rarity);
                      return rarityData ? (
                        <span
                          className="inline-flex items-center space-x-2 rounded-full px-3 py-1 text-sm font-medium"
                          style={{
                            backgroundColor:
                              rarityData.bgColor || rarityData.color + "20",
                            color: rarityData.textColor || rarityData.color,
                            border: `2px solid ${rarityData.borderColor || rarityData.color}`,
                          }}
                        >
                          <span className="text-base">{rarityData.icon}</span>
                          <span>{rarityData.name}</span>
                        </span>
                      ) : (
                        <span className="inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800">
                          {selectedCard.rarity}
                        </span>
                      );
                    })()
                  ) : (
                    <p className="text-base text-gray-900">Unknown</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Element</h4>
                  {selectedCard.element ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {selectedCard.element === "fire"
                          ? "🔥"
                          : selectedCard.element === "water"
                            ? "💧"
                            : selectedCard.element === "earth"
                              ? "🌍"
                              : selectedCard.element === "air"
                                ? "💨"
                                : selectedCard.element === "lightning"
                                  ? "⚡"
                                  : selectedCard.element === "ice"
                                    ? "❄️"
                                    : selectedCard.element === "dark"
                                      ? "🌑"
                                      : selectedCard.element === "light"
                                        ? "☀️"
                                        : selectedCard.element === "metal"
                                          ? "⚔️"
                                          : selectedCard.element === "wood"
                                            ? "🌳"
                                            : "🔮"}
                      </span>
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-sm ${getElementColor(
                          selectedCard.element
                        )}`}
                      >
                        {selectedCard.element}
                      </span>
                    </div>
                  ) : (
                    <p className="text-base text-gray-900">Unknown</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Upload Date
                  </h4>
                  <p className="text-base text-gray-900">
                    {formatDate(new Date(selectedCard.uploadDate))}
                  </p>
                </div>
              </div>

              {/* Power Stats */}
              {selectedCard.attackPower &&
                selectedCard.defense &&
                selectedCard.speed && (
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-gray-500">
                      Power Statistics
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Zap className="h-4 w-4 text-red-500" />
                          <span className="text-xs text-gray-600">Attack</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {selectedCard.attackPower}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Shield className="h-4 w-4 text-blue-500" />
                          <span className="text-xs text-gray-600">Defense</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {selectedCard.defense}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Wind className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-gray-600">Speed</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {selectedCard.speed}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Special Ability */}
              {selectedCard.specialAbility && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-500">
                    Special Ability
                  </h4>
                  <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                    {selectedCard.specialAbility}
                  </p>
                </div>
              )}

              {/* Pricing */}
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Diamond Price
                </h4>
                <p className="text-lg font-bold text-purple-600">
                  {selectedCard.diamondPrice && selectedCard.diamondPrice > 0
                    ? `💎 ${selectedCard.diamondPrice}`
                    : "Not priced"}
                </p>
              </div>

              {/* Analysis Status */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-500">
                  Analysis Status
                </h4>
                <div className="flex items-center">
                  {selectedCard.isAnalyzed ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Analyzed
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                      <div className="mr-1 h-4 w-4 rounded-full border-2 border-yellow-600"></div>
                      Pending Analysis
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-3 border-t pt-6">
            {!selectedCard.isAnalyzed && (
              <button
                onClick={onAnalyze}
                className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 text-white transition-all hover:from-yellow-600 hover:to-orange-600"
              >
                <Zap className="h-4 w-4" />
                <span>Analyze Card</span>
              </button>
            )}

            <button
              onClick={onEditCategory}
              className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-white transition-all hover:from-green-600 hover:to-emerald-600"
            >
              <span>🏷️</span>
              <span>Edit Category</span>
            </button>

            <button
              onClick={onEditRarity}
              className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 text-white transition-all hover:from-purple-600 hover:to-indigo-600"
            >
              <Star className="h-4 w-4" />
              <span>Adjust Rarity</span>
            </button>

            <button
              onClick={onDelete}
              className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 px-4 py-2 text-white transition-all hover:from-red-600 hover:to-rose-600"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminCardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "date" | "value" | "series">(
    "date"
  );
  const [filterSeries, setFilterSeries] = useState<string>("");
  const [filterRarity, setFilterRarity] = useState<string>("");
  const [filterAnalyzed, setFilterAnalyzed] = useState<
    "all" | "analyzed" | "pending"
  >("all");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deletedCardName, setDeletedCardName] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [analyzingCards, setAnalyzingCards] = useState<Set<string>>(new Set());
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCards: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [totalUnanalyzedCards, setTotalUnanalyzedCards] = useState(0);
  const [totalAnalyzedCards, setTotalAnalyzedCards] = useState(0);
  const [showBulkAnalyzeModal, setShowBulkAnalyzeModal] = useState(false);
  const [bulkAnalyzing, setBulkAnalyzing] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [showAnalyzingModal, setShowAnalyzingModal] = useState(false);
  const [analyzingMessage, setAnalyzingMessage] = useState("");
  const [analyzingBulkCards, setAnalyzingBulkCards] = useState(false);
  const [showRarityAdjustModal, setShowRarityAdjustModal] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [newRarity, setNewRarity] = useState<string>("");
  const [rarityAnalysis, setRarityAnalysis] = useState<RarityAnalysis | null>(
    null
  );
  const [updatingRarity, setUpdatingRarity] = useState(false);
  const [rarities, setRarities] = useState<any[]>([]);
  const [elements, setElements] = useState<any[]>([]);

  // Scan functionality states
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const [importing, setImporting] = useState(false);
  const [selectedFilesToImport, setSelectedFilesToImport] = useState<
    Set<string>
  >(new Set());

  // Bulk selection states - Gelişmiş seçim sistemi
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [selectedCardDetails, setSelectedCardDetails] = useState<
    Map<string, Card>
  >(new Map());
  const [bulkActionsVisible, setBulkActionsVisible] = useState(false);
  const [showBulkSuccessModal, setShowBulkSuccessModal] = useState(false);
  const [bulkSuccessMessage, setBulkSuccessMessage] = useState("");
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showBulkCategoryModal, setShowBulkCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [updatingCategory, setUpdatingCategory] = useState(false);

  // Single card category editing
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCardCategory, setEditingCardCategory] = useState<Card | null>(
    null
  );
  const [newCategory, setNewCategory] = useState<string>("");

  // Available categories
  const [availableCategories, setAvailableCategories] = useState<
    Array<{ value: string; label: string; color: string; icon: string }>
  >([]);

  // Handle bulk selection
  useEffect(() => {
    setBulkActionsVisible(selectedCards.size > 0);
  }, [selectedCards]);

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
  const getCategoryDisplayName = (categorySlug: string | null) => {
    if (!categorySlug) return null;
    const category = availableCategories.find(
      (cat) => cat.value === categorySlug
    );
    return category ? category.label : categorySlug;
  };

  // Get character display name
  const getCharacterDisplayName = (
    cardTitle: string | null,
    character: string | null
  ) => {
    // Önce cardTitle'ı kontrol et, yoksa character'ı kullan
    return cardTitle || character || null;
  };

  useEffect(() => {
    fetchCards();
    fetchGlobalStats();
    fetchRarities();
    fetchElements();
    fetchCategories();
  }, []);

  // Debounced search - seçimleri temizle
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      console.log("Filters changed, clearing selections");
      setSelectedCards(new Set());
      setSelectedCardDetails(new Map()); // Detay bilgilerini de temizle
      fetchCards(1, false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterSeries, filterRarity, filterAnalyzed, sortBy]);

  const fetchCards = async (page = currentPage, preserveSelection = false) => {
    try {
      setLoading(true);
      console.log(
        `Fetching cards for page ${page}, preserveSelection: ${preserveSelection}, current selections: ${selectedCards.size}`
      );

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
        ...(filterSeries && { category: filterSeries }),
        ...(filterRarity && { rarity: filterRarity }),
        ...(filterAnalyzed !== "all" && { analyzed: filterAnalyzed }),
        ...(sortBy && { sortBy: sortBy }),
      });

      const response = await fetch(`/api/upload?${params}`);
      if (response.ok) {
        const data = await response.json();
        console.log(
          "Fetched cards:",
          data.cards?.length,
          "total pages:",
          data.pagination?.totalPages
        );
        setCards(data.cards || []);
        setPagination(data.pagination || {});

        // Sayfa geçişlerinde seçimleri koru - mevcut sayfadaki kartları selectedCardDetails'e ekle
        if (preserveSelection && selectedCards.size > 0) {
          console.log(
            `Preserving ${selectedCards.size} selections across page change`
          );
          const newDetails = new Map(selectedCardDetails);

          // Mevcut sayfadaki seçili kartların detaylarını ekle
          data.cards?.forEach((card: Card) => {
            if (selectedCards.has(card.id)) {
              newDetails.set(card.id, card);
            }
          });

          setSelectedCardDetails(newDetails);
          console.log(
            `Updated selectedCardDetails, now has ${newDetails.size} entries`
          );
        } else if (!preserveSelection) {
          console.log("Not preserving selections - filters/search changed");
        }
      }
    } catch (error) {
      console.error("Cards fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGlobalStats = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (response.ok) {
        const data = await response.json();
        setTotalAnalyzedCards(data.stats.analyzedCards);
        setTotalUnanalyzedCards(
          data.stats.totalCards - data.stats.analyzedCards
        );
      }
    } catch (error) {
      console.error("Global stats fetch failed:", error);
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

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");

      if (response.ok) {
        const data = await response.json();
        const categories = data.categories.map((cat: any) => ({
          value: cat.slug,
          label: cat.name,
          color: cat.color,
          icon: cat.icon,
        }));
        setAvailableCategories(categories);
      } else {
        // Fallback to default categories
        const defaultCategories = [
          {
            value: "star-collection",
            label: "Star Collection",
            color: "#4ECDC4",
            icon: "⭐",
          },
          {
            value: "car-collection",
            label: "Car Collection",
            color: "#45B7D1",
            icon: "🚗",
          },
          {
            value: "anime-collection",
            label: "Anime Collection",
            color: "#FF6B6B",
            icon: "🎌",
          },
        ];
        setAvailableCategories(defaultCategories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      const defaultCategories = [
        {
          value: "star-collection",
          label: "Star Collection",
          color: "#4ECDC4",
          icon: "⭐",
        },
        {
          value: "car-collection",
          label: "Car Collection",
          color: "#45B7D1",
          icon: "🚗",
        },
        {
          value: "anime-collection",
          label: "Anime Collection",
          color: "#FF6B6B",
          icon: "🎌",
        },
      ];
      setAvailableCategories(defaultCategories);
    }
  };

  // Scan functionality handlers
  const handleScanDirectory = async () => {
    setScanning(true);
    setScanResults(null);
    try {
      const response = await fetch("/api/admin/cards/scan");
      if (response.ok) {
        const responseData = await response.json();
        setScanResults(responseData.data); // Access the nested data property
      } else {
        const errorData = await response.json();
        alert(`Scan failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Scan failed:", error);
      alert("Failed to scan directory");
    } finally {
      setScanning(false);
    }
  };

  const handleImportSelectedCards = async () => {
    if (selectedFilesToImport.size === 0) {
      alert("Please select files to import");
      return;
    }

    setImporting(true);
    try {
      const filesToImport = Array.from(selectedFilesToImport)
        .map((fileName) =>
          scanResults.missingCards.find((f: any) => f.fileName === fileName)
        )
        .filter(Boolean);

      const response = await fetch("/api/admin/cards/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: filesToImport }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(
          `Successfully imported ${result.data.imported.length} cards! ${result.data.skipped.length} files were skipped (duplicates or errors).`
        );
        setShowScanModal(false);
        setScanResults(null);
        setSelectedFilesToImport(new Set());
        fetchCards(); // Refresh the cards list
        fetchGlobalStats();
      } else {
        const errorData = await response.json();
        alert(`Import failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Import failed:", error);
      alert("Failed to import cards");
    } finally {
      setImporting(false);
    }
  };

  const toggleFileSelection = (fileName: string) => {
    const newSelection = new Set(selectedFilesToImport);
    if (newSelection.has(fileName)) {
      newSelection.delete(fileName);
    } else {
      newSelection.add(fileName);
    }
    setSelectedFilesToImport(newSelection);
  };

  // Gelişmiş bulk selection handlers
  const toggleCardSelection = (cardId: string, cardData?: Card) => {
    const newSelection = new Set(selectedCards);
    const newDetails = new Map(selectedCardDetails);

    if (newSelection.has(cardId)) {
      newSelection.delete(cardId);
      newDetails.delete(cardId);
      console.log(`🔲 Deselected card: ${cardId}`);
    } else {
      newSelection.add(cardId);
      if (cardData) {
        newDetails.set(cardId, cardData);
        console.log(
          `✅ Selected card: ${cardId} - ${cardData.name || "Unknown"}`
        );
      }
    }

    setSelectedCards(newSelection);
    setSelectedCardDetails(newDetails);
    console.log(
      `📊 Total selected cards: ${newSelection.size}, IDs: [${Array.from(newSelection).join(", ")}]`
    );
  };

  const selectAllCards = () => {
    console.log("🎯 BEFORE selectAllCards:");
    console.log("🎯 Current selectedCards.size:", selectedCards.size);
    console.log("🎯 Current selectedCards:", Array.from(selectedCards));
    console.log(
      "🎯 Cards on this page:",
      cards.map((c) => c.id)
    );

    const newSelection = new Set([
      ...selectedCards,
      ...cards.map((card) => card.id),
    ]);
    const newDetails = new Map(selectedCardDetails);
    cards.forEach((card) => {
      newDetails.set(card.id, card);
    });

    console.log("🎯 AFTER selectAllCards:");
    console.log("🎯 New selection size:", newSelection.size);
    console.log("🎯 New selection IDs:", Array.from(newSelection));

    setSelectedCards(newSelection);
    setSelectedCardDetails(newDetails);
    console.log(
      `✅ Selected all ${cards.length} cards on current page. Total selections: ${newSelection.size}`
    );
  };

  const clearSelection = () => {
    setSelectedCards(new Set());
    setSelectedCardDetails(new Map());
    console.log("Cleared all selections");
  };

  // Bulk operations
  const handleBulkAnalyzeSelected = async () => {
    if (selectedCards.size === 0) return;

    const cardIds = Array.from(selectedCards);

    // Analysis başlangıç durumu - modal göster
    setAnalyzingBulkCards(true);
    setAnalyzingMessage(`${cardIds.length} kartın analizi başlatılıyor...`);
    setShowAnalyzingModal(true);

    try {
      console.log(
        `🔍 Starting bulk analyze for ${cardIds.length} cards:`,
        cardIds
      );

      const response = await fetch("/api/admin/bulk-reanalyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardIds }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Bulk analyze successful:", result);

        // Success durumu - analyzing modal'ı kapat, success modal'ı aç
        setShowAnalyzingModal(false);
        setBulkSuccessMessage(
          `${cardIds.length} kart başarıyla analiz edildi ve güç istatistikleri güncellendi.`
        );
        setShowBulkSuccessModal(true);
        clearSelection();
        fetchCards(currentPage, false); // Analiz sonrası fresh data al
        fetchGlobalStats();
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("❌ Bulk analyze failed:", errorData);
        setShowAnalyzingModal(false);
        alert(
          `Kartlar analiz edilirken hata oluştu: ${errorData.error || "Bilinmeyen hata"}`
        );
      }
    } catch (error) {
      console.error("💥 Bulk analyze failed:", error);
      setShowAnalyzingModal(false);
      alert(
        `Kartlar analiz edilirken hata oluştu: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`
      );
    } finally {
      setAnalyzingBulkCards(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const cardIds = Array.from(selectedCards);
      console.log(
        `🗑️ Starting bulk delete for ${cardIds.length} cards:`,
        cardIds
      );

      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardIds }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Bulk delete successful:", result);
        setBulkSuccessMessage(`${cardIds.length} kart başarıyla silindi.`);
        setShowBulkSuccessModal(true);
        clearSelection();
        fetchCards(currentPage, false); // Silme sonrası fresh data al
        fetchGlobalStats();
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("❌ Bulk delete failed:", errorData);
        alert(
          `Kartlar silinirken hata oluştu: ${errorData.error || "Bilinmeyen hata"}`
        );
      }
    } catch (error) {
      console.error("💥 Bulk delete failed:", error);
      alert(
        `Kartlar silinirken hata oluştu: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`
      );
    }
    setShowBulkDeleteModal(false);
  };

  const handleBulkCategoryUpdate = async () => {
    if (!selectedCategory || selectedCards.size === 0) return;

    setUpdatingCategory(true);

    // Detaylı debug bilgileri
    const allSelectedIds = Array.from(selectedCards);
    console.log("🔍 BULK CATEGORY UPDATE DEBUG:");
    console.log("📊 selectedCards.size:", selectedCards.size);
    console.log("📋 selectedCards Set:", selectedCards);
    console.log("🎯 All selected IDs:", allSelectedIds);
    console.log("🏷️ Target category:", selectedCategory);
    console.log("📋 selectedCardDetails.size:", selectedCardDetails.size);
    console.log(
      "📋 selectedCardDetails keys:",
      Array.from(selectedCardDetails.keys())
    );

    try {
      const cardIds = Array.from(selectedCards);

      // Critical debugging
      console.log("🚨 CRITICAL DEBUG - BEFORE API CALLS:");
      console.log("🎯 cardIds array length:", cardIds.length);
      console.log("🎯 cardIds array:", cardIds);
      console.log("🎯 typeof cardIds:", typeof cardIds);
      console.log("🎯 Array.isArray(cardIds):", Array.isArray(cardIds));

      let successCount = 0;
      let failedCards: Array<{
        cardId: string;
        success: false;
        error: string;
        httpStatus?: number;
      }> = [];

      type UpdateResult =
        | { cardId: string; success: true; data: any }
        | {
            cardId: string;
            success: false;
            error: string;
            httpStatus?: number;
          };

      // Paralel olarak tüm kartları güncelle - daha hızlı
      const updatePromises = cardIds.map(async (cardId, index) => {
        try {
          console.log(
            `⏳ [${index + 1}/${cardIds.length}] Updating card ${cardId}...`
          );

          const requestBody = {
            category: selectedCategory,
            series: selectedCategory, // Seri bilgisini de aynı değerle güncelle
          };

          console.log(`📤 Request for ${cardId}:`, requestBody);

          const response = await fetch(`/api/cards/${cardId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          });

          console.log(`📥 Response status for ${cardId}:`, response.status);

          if (response.ok) {
            const responseData = await response.json().catch(() => ({}));
            console.log(
              `✅ Card ${cardId} updated successfully:`,
              responseData
            );
            return { cardId, success: true, data: responseData };
          } else {
            const errorData = await response
              .json()
              .catch(() => ({ error: "Unknown error" }));
            console.error(
              `❌ Failed to update card ${cardId}:`,
              response.status,
              errorData
            );
            return {
              cardId,
              success: false,
              error: errorData.error || `HTTP ${response.status}`,
              httpStatus: response.status,
            };
          }
        } catch (error) {
          console.error(`💥 Exception updating card ${cardId}:`, error);
          return {
            cardId,
            success: false,
            error: error instanceof Error ? error.message : "Unknown exception",
          };
        }
      });

      // Tüm promise'ları bekle
      console.log(
        `⏳ Waiting for ${updatePromises.length} promises to complete...`
      );
      const results = await Promise.all(updatePromises);

      console.log("🎯 ALL RESULTS:", results);

      // Sonuçları analiz et
      results.forEach((result, index) => {
        console.log(`📋 Result ${index + 1}:`, result);
        if (result.success) {
          successCount++;
        } else {
          failedCards.push(
            result as {
              cardId: string;
              success: false;
              error: string;
              httpStatus?: number;
            }
          );
        }
      });

      console.log(`📊 FINAL BULK UPDATE SUMMARY:`);
      console.log(`📊 Total attempted: ${cardIds.length}`);
      console.log(`📊 Successful: ${successCount}`);
      console.log(`📊 Failed: ${failedCards.length}`);
      console.log(
        `📊 Success rate: ${((successCount / cardIds.length) * 100).toFixed(1)}%`
      );

      if (failedCards.length > 0) {
        console.error("❌ Failed cards:", failedCards);
      }

      if (successCount > 0) {
        const message =
          failedCards.length > 0
            ? `${successCount} kartın kategorisi güncellendi. ${failedCards.length} kart güncellenemedi.`
            : `${successCount} kartın kategorisi başarıyla güncellendi.`;

        setBulkSuccessMessage(message);
        setShowBulkSuccessModal(true);
        clearSelection();
        console.log("🔄 Refetching cards after bulk category update...");
        await fetchCards(currentPage, false); // Güncellemeden sonra fresh data al
      } else {
        const failureReasons = failedCards
          .map((f) => `${f.cardId}: ${f.error}`)
          .join("\n");
        console.error("💥 All cards failed to update:", failureReasons);
        alert(
          `Hiçbir kartın kategorisi güncellenemedi.\n\nHata detayları:\n${failureReasons}`
        );
      }
    } catch (error) {
      console.error("💥 Bulk category update failed:", error);
      alert(
        `Kategori güncellenirken hata oluştu: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`
      );
    } finally {
      setUpdatingCategory(false);
      setShowBulkCategoryModal(false);
      setSelectedCategory("");
    }
  };

  // Single card category update
  const handleSingleCategoryUpdate = async () => {
    if (!newCategory || !editingCardCategory) return;

    setUpdatingCategory(true);
    try {
      const response = await fetch(`/api/cards/${editingCardCategory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: newCategory,
          series: newCategory, // Seri bilgisini de aynı değerle güncelle
        }),
      });

      const responseData = await response.json();
      console.log("Single category update response:", responseData);

      if (response.ok) {
        console.log(
          "Category updated successfully. New value:",
          responseData.card?.category
        );
        setBulkSuccessMessage("Kartın kategorisi güncellendi.");
        setShowBulkSuccessModal(true);
        console.log("Refetching cards after single category update...");
        await fetchCards(currentPage, true); // Kategori güncelleme sonrası seçimleri koru
      } else {
        console.error("Category update failed:", responseData);
        alert(
          `Kategori güncellenirken hata: ${responseData.error || "Bilinmeyen hata"}`
        );
      }
    } catch (error) {
      console.error("Category update failed:", error);
      alert("Kategori güncellenirken hata oluştu");
    } finally {
      setUpdatingCategory(false);
      setShowCategoryModal(false);
      setEditingCardCategory(null);
      setNewCategory("");
    }
  };

  const analyzeCard = async (cardId: string) => {
    // Loading durumunu başlat
    setAnalyzingCards((prev) => new Set(prev).add(cardId));

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId }),
      });

      if (response.ok) {
        fetchCards(currentPage, true); // Tek kart analizi - seçimleri koru
      } else {
        alert("Analiz sırasında hata oluştu");
      }
    } catch (error) {
      console.error("Card analysis failed:", error);
      alert("Analiz sırasında hata oluştu");
    } finally {
      // Loading durumunu sonlandır
      setAnalyzingCards((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cardId);
        return newSet;
      });
    }
  };

  const handleBulkAnalyze = (forceReAnalysis: boolean = false) => {
    if (!forceReAnalysis && totalUnanalyzedCards === 0) {
      alert("Analiz edilecek kart bulunamadı!");
      return;
    }
    setShowBulkAnalyzeModal(true);
    // Store the force re-analysis flag for later use
    (window as any).forceReAnalysis = forceReAnalysis;
  };

  const confirmBulkAnalyze = async () => {
    setBulkAnalyzing(true);
    setShowBulkAnalyzeModal(false);

    const forceReAnalysis = (window as any).forceReAnalysis || false;

    try {
      const response = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "bulkAnalyze",
          forceReAnalysis,
        }),
      });

      if (response.ok) {
        const message = forceReAnalysis
          ? "Toplu tekrar analiz başlatıldı! Tüm kartlar arka planda yeniden analiz ediliyor."
          : "Toplu analiz başlatıldı! Kartlar arka planda analiz ediliyor.";
        alert(message);
        fetchCards(currentPage, true); // Bulk analiz sonrası seçimleri koru
        fetchGlobalStats(); // Refresh global stats
      } else {
        alert("Toplu analiz başlatılırken bir hata oluştu");
      }
    } catch (error) {
      console.error("Bulk analyze failed:", error);
      alert("Toplu analiz başlatılırken bir hata oluştu");
    } finally {
      setBulkAnalyzing(false);
      delete (window as any).forceReAnalysis;
    }
  };

  const cancelBulkAnalyze = () => {
    setShowBulkAnalyzeModal(false);
  };

  const deleteCard = async (cardId: string, cardName: string) => {
    if (
      !confirm(
        `"${cardName}" kartını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Başarı modalını göster
        setDeletedCardName(cardName);
        setShowSuccessModal(true);

        // 2 saniye sonra modalı kapat
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 2000);

        fetchCards(currentPage, true); // Silme sonrası seçimleri koru
      } else {
        const error = await response.json();
        alert(`Silme hatası: ${error.error}`);
      }
    } catch (error) {
      console.error("Card deletion failed:", error);
      alert("Kart silinirken hata oluştu");
    }
  };

  const openCardModal = (card: Card) => {
    setSelectedCard(card);
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

  const openRarityAdjustModal = (card: Card) => {
    setEditingCard(card);
    setNewRarity(card.rarity || "common");
    setShowRarityAdjustModal(true);

    // Parse AI tags to get rarity analysis
    if (card.aiTags) {
      try {
        const aiData = JSON.parse(card.aiTags);
        if (aiData.rarityAnalysis) {
          setRarityAnalysis(aiData.rarityAnalysis);
        }
      } catch (error) {
        console.warn("Failed to parse AI tags:", error);
      }
    }
  };

  const closeRarityAdjustModal = () => {
    setShowRarityAdjustModal(false);
    setEditingCard(null);
    setNewRarity("");
    setRarityAnalysis(null);
  };

  const updateCardRarity = async () => {
    if (!editingCard || !newRarity) return;

    setUpdatingRarity(true);
    try {
      const response = await fetch(`/api/cards/${editingCard.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rarity: newRarity,
          recalculateDiamonds: true,
        }),
      });

      if (response.ok) {
        const updatedCard = await response.json();
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === editingCard.id ? { ...card, ...updatedCard.card } : card
          )
        );
        closeRarityAdjustModal();

        // Show success message
        alert(
          `Card rarity updated to ${getRarityTier(newRarity)} successfully!`
        );
      } else {
        const error = await response.json();
        alert(`Failed to update rarity: ${error.error}`);
      }
    } catch (error) {
      console.error("Rarity update failed:", error);
      alert("Failed to update card rarity");
    } finally {
      setUpdatingRarity(false);
    }
  };

  const handleUploadSuccess = (cards: any[], duplicates: any[] = []) => {
    setShowUploadModal(false);
    fetchCards(); // Yeni yüklenen kartları göstermek için listeyi yenile

    // Başarı mesajı göster
    if (cards.length > 0 && duplicates.length > 0) {
      alert(
        `${cards.length} yeni kart yüklendi, ${duplicates.length} kart zaten sistemde mevcuttu.`
      );
    } else if (cards.length > 0) {
      // Mevcut başarı modalı zaten var, sadece liste yenilenir
    } else if (duplicates.length > 0) {
      alert(
        `${duplicates.length} kart zaten sistemde mevcut olduğu için yüklenmedi.`
      );
    }

    // Eğer yeni kartlar yüklendiyse otomatik analizi tetikle
    if (cards.length > 0) {
      console.log("Triggering auto analysis for", cards.length, "new cards");

      // Analiz mesajını göster
      setAnalyzingMessage(
        `${cards.length} yeni kart yüklendi. Kartlar analiz ediliyor...`
      );
      setShowAnalyzingModal(true);

      // 3 saniye sonra mesajı kapat
      setTimeout(() => {
        setShowAnalyzingModal(false);
      }, 3000);

      // Yeni yüklenen kartları tek tek analiz et
      setTimeout(async () => {
        try {
          console.log(
            "Starting analysis for cards:",
            cards.map((c) => c.id)
          );

          // Her yeni kart için analiz başlat
          for (const card of cards) {
            if (card.id) {
              try {
                const response = await fetch("/api/analyze", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ cardId: card.id }),
                });

                if (response.ok) {
                  console.log(`Analysis started for card ${card.id}`);
                } else {
                  console.error(`Failed to analyze card ${card.id}`);
                }
              } catch (error) {
                console.error(`Error analyzing card ${card.id}:`, error);
              }
            }
          }

          // Analiz başlatıldıktan sonra liste ve stats'ı yenile
          setTimeout(() => {
            fetchCards();
            fetchGlobalStats();
          }, 2000);
        } catch (error) {
          console.error("Auto analysis failed:", error);
        }
      }, 1000); // Kısa bir gecikme ile analizi başlat
    }
  };

  // Sayfa değiştirme fonksiyonları - seçimleri koru
  const handlePageChange = (newPage: number) => {
    console.log(
      `Changing to page ${newPage}, preserving ${selectedCards.size} selections`
    );
    setCurrentPage(newPage);
    fetchCards(newPage, true); // Sayfa geçişinde seçimleri koru
  };

  const handlePrevPage = () => {
    if (pagination.hasPrev) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      handlePageChange(currentPage + 1);
    }
  };

  // Benzersiz değerler - mevcut kartlardan hesaplıyoruz (sayfalama nedeniyle sınırlı)
  const uniqueCategories = Array.from(
    new Set(cards.map((c) => c.category).filter((c): c is string => Boolean(c)))
  );
  const uniqueRarities = Array.from(
    new Set(cards.map((c) => c.rarity).filter((r): r is string => Boolean(r)))
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Kartlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Card Management</h1>
          <p className="mt-2 text-gray-600">
            {pagination.totalCards} kart • {totalAnalyzedCards} analiz edilmiş
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowActionsDropdown(!showActionsDropdown)}
            className="flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:from-blue-700 hover:to-purple-700"
          >
            <MoreVertical className="h-5 w-5" />
            <span>Actions</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                showActionsDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showActionsDropdown && (
            <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-gray-200 bg-white shadow-xl">
              <div className="py-2">
                <button
                  onClick={() => {
                    handleBulkAnalyze(false);
                    setShowActionsDropdown(false);
                  }}
                  disabled={totalUnanalyzedCards === 0 || bulkAnalyzing}
                  className="flex w-full items-center space-x-3 px-4 py-3 text-left transition-colors hover:bg-yellow-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {bulkAnalyzing ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-yellow-600"></div>
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-yellow-600 to-orange-600">
                      <Zap className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">
                      Analyze All Cards
                    </div>
                    <div className="text-sm text-gray-500">
                      {bulkAnalyzing
                        ? "Analyzing..."
                        : `${totalUnanalyzedCards} pending cards`}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    handleBulkAnalyze(true);
                    setShowActionsDropdown(false);
                  }}
                  disabled={bulkAnalyzing}
                  className="flex w-full items-center space-x-3 px-4 py-3 text-left transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {bulkAnalyzing ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-red-600"></div>
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-pink-600">
                      <Zap className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">
                      Force Re-analyze ALL
                    </div>
                    <div className="text-sm text-gray-500">
                      {bulkAnalyzing
                        ? "Re-analyzing..."
                        : "Re-analyze all cards"}
                    </div>
                  </div>
                </button>

                <div className="my-1 border-t border-gray-100"></div>

                <button
                  onClick={() => {
                    setShowUploadModal(true);
                    setShowActionsDropdown(false);
                  }}
                  className="flex w-full items-center space-x-3 px-4 py-3 text-left transition-colors hover:bg-blue-50"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                    <Plus className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Upload New Card
                    </div>
                    <div className="text-sm text-gray-500">
                      Add cards to collection
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowScanModal(true);
                    setShowActionsDropdown(false);
                  }}
                  className="flex w-full items-center space-x-3 px-4 py-3 text-left transition-colors hover:bg-purple-50"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
                    <Search className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Scan Uploads Directory
                    </div>
                    <div className="text-sm text-gray-500">
                      Find and import uploaded cards
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Dropdown dışında tıklandığında kapatmak için overlay */}
          {showActionsDropdown && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowActionsDropdown(false)}
            ></div>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {bulkActionsVisible && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900">
                  {selectedCards.size} kart seçildi
                  {selectedCards.size >
                    cards.filter((card) => selectedCards.has(card.id)).length &&
                    ` (${cards.filter((card) => selectedCards.has(card.id)).length} bu sayfada)`}
                </span>
                <p className="text-xs text-gray-600">
                  Toplu işlemler için seçenekleri kullanın • Sayfa geçişlerinde
                  seçimler korunur
                  {selectedCards.size >
                    cards.filter((card) => selectedCards.has(card.id)).length &&
                    ` • ${selectedCards.size - cards.filter((card) => selectedCards.has(card.id)).length} kart diğer sayfalarda seçili`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={selectAllCards}
                className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-800 hover:bg-blue-200"
              >
                Bu Sayfayı Seç
              </button>

              <button
                onClick={clearSelection}
                className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
              >
                Temizle
              </button>

              <button
                onClick={handleBulkAnalyzeSelected}
                disabled={analyzingBulkCards}
                className={`rounded-md px-3 py-1.5 text-xs font-medium text-white ${
                  analyzingBulkCards
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                }`}
              >
                {analyzingBulkCards ? (
                  <div className="flex items-center space-x-1">
                    <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  "🔍 Analyze"
                )}
              </button>

              <button
                onClick={() => setShowBulkCategoryModal(true)}
                className="rounded-md bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:from-green-600 hover:to-emerald-600"
              >
                🏷️ Category
              </button>

              <button
                onClick={() => setShowBulkDeleteModal(true)}
                className="rounded-md bg-gradient-to-r from-red-500 to-rose-500 px-3 py-1.5 text-xs font-medium text-white hover:from-red-600 hover:to-rose-600"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Series Filter */}
          <div>
            <select
              value={filterSeries}
              onChange={(e) => setFilterSeries(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {availableCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
              {uniqueCategories
                .filter(
                  (category) =>
                    !availableCategories.some((cat) => cat.value === category)
                )
                .map((category) => (
                  <option key={category} value={category}>
                    {getCategoryDisplayName(category) || category}
                  </option>
                ))}
            </select>
          </div>

          {/* Rarity Filter */}
          <div>
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Rarity Levels</option>
              {rarities.length > 0
                ? rarities.map((rarity) => (
                    <option key={rarity.slug} value={rarity.slug}>
                      {rarity.icon} {rarity.name}
                    </option>
                  ))
                : // Fallback to unique rarities from current cards if rarities not loaded
                  uniqueRarities.map((rarity) => (
                    <option key={rarity} value={rarity}>
                      {rarity}
                    </option>
                  ))}
            </select>
          </div>

          {/* Analysis Filter */}
          <div>
            <select
              value={filterAnalyzed}
              onChange={(e) => setFilterAnalyzed(e.target.value as any)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Cards</option>
              <option value="analyzed">Analyzed</option>
              <option value="pending">Pending Analysis</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="date">By Date</option>
              <option value="name">By Name</option>
              <option value="value">By Value</option>
              <option value="series">By Series</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600"></div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-md p-2 ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-md p-2 ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid/List */}
      {cards.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-gray-400">
            <Search className="mx-auto h-16 w-16" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            Kart bulunamadı
          </h3>
          <p className="text-gray-600">
            Arama kriterlerinizi değiştirin veya yeni kart ekleyin
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4"
              : "space-y-4"
          }
        >
          {cards.map((card) => {
            const rarityStyles = getRarityStyles(card.rarity);
            return (
              <div
                key={card.id}
                className={
                  viewMode === "grid"
                    ? `${rarityStyles.container} ${rarityStyles.animation}`
                    : "flex items-center space-x-4 rounded-lg bg-white p-4 shadow"
                }
              >
                {viewMode === "grid" ? (
                  // Grid View
                  <div className="p-2 md:p-3">
                    {/* Selection Checkbox */}
                    <div className="absolute left-2 top-2 z-10">
                      <input
                        type="checkbox"
                        checked={selectedCards.has(card.id)}
                        onChange={() => toggleCardSelection(card.id, card)}
                        className="h-5 w-5 rounded border-2 border-white bg-white/80 text-blue-600 shadow-lg backdrop-blur-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div
                      className={`aspect-[2/3] ${rarityStyles.imageContainer}`}
                    >
                      <img
                        src={card.imageUrl}
                        alt={card.name || "Anime Card"}
                        className="h-full w-full cursor-pointer object-cover transition-transform hover:scale-105"
                        onClick={() => openCardModal(card)}
                      />

                      {/* Rarity Icon Overlay */}
                      {card.rarity &&
                        (() => {
                          const rarityData = getRarityData(card.rarity);
                          return rarityData?.icon ? (
                            <div
                              className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full shadow-lg backdrop-blur-sm"
                              style={{
                                backgroundColor: `${rarityData.color}CC`,
                              }}
                              title={`${rarityData.name} Rarity`}
                            >
                              <span className="text-lg">
                                {rarityData.iconUrl ? (
                                  <img
                                    src={rarityData.iconUrl}
                                    alt={rarityData.name}
                                    className="h-5 w-5"
                                  />
                                ) : (
                                  rarityData.icon
                                )}
                              </span>
                            </div>
                          ) : null;
                        })()}

                      {/* Element Icon Overlay */}
                      {card.element &&
                        (() => {
                          const elementData = getElementData(card.element);
                          return elementData?.icon ? (
                            <div
                              className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full shadow-lg backdrop-blur-sm"
                              style={{
                                backgroundColor: `${elementData.color}CC`,
                              }}
                              title={`${elementData.name} Element`}
                            >
                              <span className="text-sm">
                                {elementData.iconUrl ? (
                                  <img
                                    src={elementData.iconUrl}
                                    alt={elementData.name}
                                    className="h-4 w-4"
                                  />
                                ) : (
                                  elementData.icon
                                )}
                              </span>
                            </div>
                          ) : null;
                        })()}

                      {/* Delete button - shows on hover */}
                      <button
                        onClick={() =>
                          deleteCard(card.id, card.name || "İsimsiz Kart")
                        }
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                        title="Kartı Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      {/* Re-analyze button - bottom right corner */}
                      <button
                        onClick={() => analyzeCard(card.id)}
                        disabled={analyzingCards.has(card.id)}
                        className={`absolute bottom-2 right-2 rounded-full p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 ${
                          analyzingCards.has(card.id)
                            ? "cursor-not-allowed bg-blue-400"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        }`}
                        title={
                          analyzingCards.has(card.id)
                            ? "Analyzing..."
                            : "Re-analyze Card"
                        }
                      >
                        {analyzingCards.has(card.id) ? (
                          <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-white"></div>
                        ) : (
                          <Zap className="h-3 w-3" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-1 md:space-y-1.5">
                      <h3
                        className="truncate text-xs font-medium leading-tight text-gray-900 md:text-sm"
                        title={card.cardTitle || card.name || "İsimsiz Kart"}
                      >
                        {card.cardTitle || card.name || "İsimsiz Kart"}
                      </h3>

                      {card.category && (
                        <p className="truncate text-xs text-gray-600">
                          {getCategoryDisplayName(card.category)}
                        </p>
                      )}

                      {/* Rarity Badge for Grid View */}
                      {card.rarity &&
                        (() => {
                          const rarityData = getRarityData(card.rarity);
                          return (
                            <div className="flex items-center justify-center">
                              <span
                                className="inline-flex items-center space-x-1 rounded-full px-2 py-1 text-xs font-medium shadow-sm"
                                style={{
                                  backgroundColor:
                                    rarityData?.bgColor ||
                                    rarityData?.color + "20" ||
                                    "#f3f4f6",
                                  color:
                                    rarityData?.textColor ||
                                    rarityData?.color ||
                                    "#374151",
                                  border: `1px solid ${rarityData?.borderColor || rarityData?.color || "#d1d5db"}`,
                                }}
                                title={`${rarityData?.name || card.rarity} Rarity`}
                              >
                                {rarityData?.icon && (
                                  <span className="text-sm">
                                    {rarityData.iconUrl ? (
                                      <img
                                        src={rarityData.iconUrl}
                                        alt={rarityData.name}
                                        className="h-3 w-3"
                                      />
                                    ) : (
                                      rarityData.icon
                                    )}
                                  </span>
                                )}
                                <span className="max-w-16 truncate">
                                  {rarityData?.name || card.rarity}
                                </span>
                              </span>
                            </div>
                          );
                        })()}

                      <div className="flex items-center justify-between">
                        {card.diamondPrice ? (
                          <span className="text-xs font-medium text-purple-600">
                            💎{card.diamondPrice}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}

                        {card.isAnalyzed ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-1 py-0.5 text-xs font-medium text-green-800">
                            ✓
                          </span>
                        ) : (
                          <button
                            onClick={() => analyzeCard(card.id)}
                            disabled={analyzingCards.has(card.id)}
                            className={`inline-flex items-center rounded-full px-1 py-0.5 text-xs font-medium ${
                              analyzingCards.has(card.id)
                                ? "cursor-not-allowed bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            }`}
                          >
                            {analyzingCards.has(card.id) ? (
                              <div className="h-2 w-2 animate-spin rounded-full border-b-2 border-blue-600"></div>
                            ) : (
                              "?"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View
                  <>
                    {/* Selection Checkbox for List View */}
                    <div className="flex flex-shrink-0 items-center">
                      <input
                        type="checkbox"
                        checked={selectedCards.has(card.id)}
                        onChange={() => toggleCardSelection(card.id, card)}
                        className="mr-3 h-5 w-5 rounded border-2 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <img
                        src={card.imageUrl}
                        alt={card.name || "Anime Card"}
                        className="h-20 w-16 cursor-pointer rounded border object-cover transition-opacity hover:opacity-80"
                        onClick={() => openCardModal(card)}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-medium text-gray-900">
                        {card.cardTitle || card.name || "İsimsiz Kart"}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        {card.category && (
                          <p>Series: {getCategoryDisplayName(card.category)}</p>
                        )}
                        {getCharacterDisplayName(
                          card.cardTitle,
                          card.character
                        ) && (
                          <p>
                            Character:{" "}
                            {getCharacterDisplayName(
                              card.cardTitle,
                              card.character
                            )}
                          </p>
                        )}
                        {card.element && (
                          <p className="flex items-center space-x-2">
                            <span>Element:</span>
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${getElementColor(
                                card.element
                              )}`}
                            >
                              {card.element}
                            </span>
                          </p>
                        )}
                        {card.rarity && (
                          <p className="flex items-center space-x-2">
                            <span>Nadir Seviye:</span>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${
                                card.rarity.toLowerCase() === "legendary"
                                  ? "border border-yellow-400 bg-gradient-to-r from-yellow-200 to-orange-200 text-yellow-800"
                                  : card.rarity.toLowerCase() === "epic"
                                    ? "border border-purple-400 bg-gradient-to-r from-purple-200 to-purple-300 text-purple-800"
                                    : card.rarity.toLowerCase() === "rare"
                                      ? "border border-blue-400 bg-gradient-to-r from-blue-200 to-blue-300 text-blue-800"
                                      : card.rarity.toLowerCase() ===
                                          "super rare"
                                        ? "border border-purple-400 bg-gradient-to-r from-purple-200 to-purple-300 text-purple-800"
                                        : card.rarity.toLowerCase() ===
                                            "ultra rare"
                                          ? "border border-orange-400 bg-gradient-to-r from-orange-200 to-orange-300 text-orange-800"
                                          : card.rarity.toLowerCase() ===
                                              "secret rare"
                                            ? "border border-red-400 bg-gradient-to-r from-red-200 to-red-300 text-red-800"
                                            : "border border-gray-300 bg-gray-200 text-gray-800"
                              }`}
                            >
                              {card.rarity}
                            </span>
                          </p>
                        )}

                        {/* Power Stats */}
                        {card.attackPower && card.defense && card.speed && (
                          <div className="mt-1 grid grid-cols-3 gap-2">
                            <div className="flex items-center space-x-1">
                              <Zap className="h-3 w-3 text-red-500" />
                              <span className="text-xs">
                                Güç: {card.attackPower}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Shield className="h-3 w-3 text-blue-500" />
                              <span className="text-xs">
                                Sav: {card.defense}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Wind className="h-3 w-3 text-green-500" />
                              <span className="text-xs">Hız: {card.speed}</span>
                            </div>
                          </div>
                        )}

                        <p>Yükleme: {formatDate(new Date(card.uploadDate))}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {card.diamondPrice ? (
                        <span className="font-medium text-purple-600">
                          💎 {card.diamondPrice}
                        </span>
                      ) : (
                        <span className="text-gray-400">Fiyat yok</span>
                      )}

                      {card.isAnalyzed ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                          Analyzed
                        </span>
                      ) : (
                        <button
                          onClick={() => analyzeCard(card.id)}
                          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                            card.isAnalyzed
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          }`}
                        >
                          {card.isAnalyzed ? "Re-analyze" : "Analyze"}
                        </button>
                      )}

                      {/* Delete button for list view */}
                      <button
                        onClick={() =>
                          deleteCard(card.id, card.name || "İsimsiz Kart")
                        }
                        className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                        title="Kartı Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={!pagination.hasPrev}
            className={`flex items-center rounded-lg px-4 py-2 ${
              pagination.hasPrev
                ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                : "cursor-not-allowed bg-gray-100 text-gray-400"
            }`}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Önceki
          </button>

          <div className="flex space-x-1">
            {(() => {
              const currentPage = pagination.page;
              const totalPages = pagination.totalPages;
              const pages = [];

              if (totalPages <= 7) {
                // 7 sayfa veya daha az ise tümünü göster
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                // Akıllı pagination: 1, 2, ..., current-1, current, current+1, ..., total-1, total
                pages.push(1);

                if (currentPage > 3) {
                  pages.push("...");
                }

                // Mevcut sayfanın etrafındaki sayfalar
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);

                for (let i = start; i <= end; i++) {
                  if (!pages.includes(i)) {
                    pages.push(i);
                  }
                }

                if (currentPage < totalPages - 2) {
                  pages.push("...");
                }

                if (totalPages > 1) {
                  pages.push(totalPages);
                }
              }

              return pages.map((page, index) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex items-center px-3 py-2 text-gray-500"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={`rounded-lg px-3 py-2 ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              });
            })()}
          </div>

          <button
            onClick={handleNextPage}
            disabled={!pagination.hasNext}
            className={`flex items-center rounded-lg px-4 py-2 ${
              pagination.hasNext
                ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                : "cursor-not-allowed bg-gray-100 text-gray-400"
            }`}
          >
            Sonraki
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 max-w-sm rounded-lg bg-white p-6 text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Successfully Deleted
            </h3>
            <p className="text-gray-600">
              "{deletedCardName}" kartı başarıyla silindi.
            </p>
          </div>
        </div>
      )}

      {/* Card Detail Modal - Enhanced Design with Rarity Styling */}
      {selectedCard && (
        <CardDetailModal
          selectedCard={selectedCard}
          onClose={closeCardModal}
          onAnalyze={() => {
            analyzeCard(selectedCard.id);
            closeCardModal();
          }}
          onEditCategory={() => {
            setEditingCardCategory(selectedCard);
            setShowCategoryModal(true);
            closeCardModal();
          }}
          onEditRarity={() => {
            openRarityAdjustModal(selectedCard);
            closeCardModal();
          }}
          onDelete={() => {
            deleteCard(selectedCard.id, selectedCard.name || "İsimsiz Kart");
            closeCardModal();
          }}
          onExpandImage={openFullScreenImage}
          getRarityData={getRarityData}
          getCategoryDisplayName={getCategoryDisplayName}
          getCharacterDisplayName={getCharacterDisplayName}
          getElementColor={getElementColor}
          getRarityColor={(rarity: string) => {
            const rarityData = getRarityData(rarity);
            return rarityData?.color
              ? `bg-${rarityData.color.replace("#", "")}-100 text-${rarityData.color.replace("#", "")}-800`
              : "bg-gray-100 text-gray-800";
          }}
          formatDate={formatDate}
          formatDiamonds={formatDiamonds}
        />
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-auto rounded-lg bg-white">
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Upload New Card
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <CardUpload onUploadComplete={handleUploadSuccess} />
            </div>
          </div>
        </div>
      )}

      {/* Bulk Analyze Confirmation Modal */}
      {showBulkAnalyzeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Bulk Analysis Confirmation
                  </h3>
                  <p className="text-sm text-gray-600">
                    Tüm kartları analiz et
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4 text-center">
                <div className="text-6xl">🤖</div>
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-gray-900">
                    {(window as any).forceReAnalysis
                      ? `${
                          totalAnalyzedCards + totalUnanalyzedCards
                        } Cards Will Be Re-analyzed`
                      : `${totalUnanalyzedCards} Cards Will Be Analyzed`}
                  </h4>
                  <p className="text-gray-600">
                    {(window as any).forceReAnalysis
                      ? "This process may take some time. ALL cards will be re-analyzed by AI and automatically re-categorized with new English names and features."
                      : "This process may take some time. All unanalyzed cards will be examined by AI and automatically categorized."}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                  <div className="text-sm font-medium text-gray-700">
                    ✨ Analiz sonrası elde edeceğiniz:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>• Karakter isimleri</div>
                    <div>• Anime serileri</div>
                    <div>• Nadir seviyeler</div>
                    <div>• Değer tahminleri</div>
                    <div>• Güç istatistikleri</div>
                    <div>• Özel yetenekler</div>
                  </div>
                </div>

                <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-600">
                  ⚠️ İşlem sırasında sayfa kapatılmamalıdır
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 border-t border-gray-200 p-6">
              <button
                onClick={cancelBulkAnalyze}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkAnalyze}
                className={`flex-1 px-4 py-3 ${
                  (window as any).forceReAnalysis
                    ? "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                    : "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                } transform rounded-lg font-medium text-white shadow-lg transition-all hover:scale-105`}
              >
                {(window as any).forceReAnalysis
                  ? "Start Re-analysis"
                  : "Start Analysis"}
              </button>
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
            <img
              src={fullScreenImage}
              alt="Full Screen Card"
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={closeFullScreenImage}
              className="absolute right-4 top-4 rounded-full bg-black/60 p-3 text-white transition-all hover:bg-black/80"
              title="Kapat"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Analyzing Cards Modal */}
      {showAnalyzingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                🔍 Analyzing Cards
              </h3>
              <p className="mb-4 text-gray-600">{analyzingMessage}</p>
              <div className="rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 p-4">
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-yellow-800">
                    🤖 AI şu işlemleri gerçekleştiriyor:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-yellow-700">
                    <div>• Rarity tespiti</div>
                    <div>• Güç hesaplama</div>
                    <div>• Karakter analizi</div>
                    <div>• Değer tahmini</div>
                  </div>
                  <div className="mt-3 rounded-md bg-amber-100 p-2">
                    <p className="text-xs text-amber-700">
                      ⏱️ Analiz tamamlanana kadar lütfen bekleyin...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Success Modal */}
      {showBulkSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl">
            <div className="mb-4 flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              İşlem Başarılı
            </h3>
            <p className="text-gray-600">{bulkSuccessMessage}</p>
            <button
              onClick={() => setShowBulkSuccessModal(false)}
              className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Tamam
            </button>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Delete Cards
                </h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="mb-6 text-gray-700">
              {selectedCards.size} kartı silmek istediğinizden emin misiniz?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowBulkDeleteModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Category Assignment Modal */}
      {showBulkCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="text-2xl">🏷️</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Assign Category
                </h3>
                <p className="text-sm text-gray-600">
                  Select category for {selectedCards.size} cards
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Select Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select category...</option>
                {availableCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowBulkCategoryModal(false);
                  setSelectedCategory("");
                }}
                disabled={updatingCategory}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handleBulkCategoryUpdate}
                disabled={!selectedCategory || updatingCategory}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {updatingCategory ? "Updating..." : "Assign Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Card Category Modal */}
      {showCategoryModal && editingCardCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <span className="text-2xl">🏷️</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Change Category
                </h3>
                <p className="text-sm text-gray-600">
                  {editingCardCategory.cardTitle || editingCardCategory.name}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                New Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select category...</option>
                {availableCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCardCategory(null);
                  setNewCategory("");
                }}
                disabled={updatingCategory}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handleSingleCategoryUpdate}
                disabled={!newCategory || updatingCategory}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {updatingCategory ? "Updating..." : "Change Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rarity Adjustment Modal */}
      {showRarityAdjustModal && editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Adjust Card Rarity
              </h2>
              <button
                onClick={closeRarityAdjustModal}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Card Preview */}
              <div className="flex items-center space-x-4 rounded-lg bg-gray-50 p-4">
                <img
                  src={editingCard.imageUrl}
                  alt={editingCard.name || "Card"}
                  className="h-20 w-16 rounded border object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {editingCard.cardTitle ||
                      editingCard.name ||
                      "Unnamed Card"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Current Rarity:{" "}
                    {getRarityTier(editingCard.rarity || "common")}
                  </p>
                  {editingCard.diamondPrice && (
                    <p className="text-sm font-medium text-purple-600">
                      Current Price: 💎 {editingCard.diamondPrice}
                    </p>
                  )}
                </div>
              </div>

              {/* AI Analysis Results */}
              {rarityAnalysis && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h4 className="mb-3 font-medium text-blue-900">
                    AI Analysis Results
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800">
                        Detected Rarity:
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getRarityColor(
                          rarityAnalysis.detectedRarity
                        )}`}
                      >
                        {getRarityTier(rarityAnalysis.detectedRarity)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800">
                        AI Confidence:
                      </span>
                      <span className="text-sm font-medium text-blue-900">
                        {rarityAnalysis.confidence}%
                      </span>
                    </div>

                    {/* Analysis Factors */}
                    <div className="mt-3">
                      <h5 className="mb-2 text-xs font-medium text-blue-900">
                        Analysis Factors:
                      </h5>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span>Text Patterns:</span>
                          <span className="font-medium">
                            {Math.round(
                              rarityAnalysis.factors.textPatterns * 100
                            )}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Visual Complexity:</span>
                          <span className="font-medium">
                            {Math.round(
                              rarityAnalysis.factors.visualComplexity * 100
                            )}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Series Popularity:</span>
                          <span className="font-medium">
                            {Math.round(
                              rarityAnalysis.factors.seriesPopularity * 100
                            )}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Character Importance:</span>
                          <span className="font-medium">
                            {Math.round(
                              rarityAnalysis.factors.characterImportance * 100
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI Reasoning */}
                    <div className="mt-3">
                      <h5 className="mb-2 text-xs font-medium text-blue-900">
                        AI Reasoning:
                      </h5>
                      <ul className="space-y-1 text-xs text-blue-800">
                        {rarityAnalysis.reasoning.map((reason, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-1 text-blue-500">•</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Rarity Selection */}
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  Select New Rarity
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: "common",
                      label: "Common",
                      description: "10-50 💎",
                    },
                    {
                      value: "uncommon",
                      label: "Uncommon",
                      description: "50-100 💎",
                    },
                    { value: "rare", label: "Rare", description: "100-300 💎" },
                    {
                      value: "super rare",
                      label: "Super Rare",
                      description: "300-600 💎",
                    },
                    {
                      value: "ultra rare",
                      label: "Ultra Rare",
                      description: "600-1200 💎",
                    },
                    {
                      value: "secret rare",
                      label: "Secret Rare",
                      description: "1200-2500 💎",
                    },
                    {
                      value: "legendary",
                      label: "Legendary",
                      description: "2500-5000+ 💎",
                    },
                  ].map((rarity) => (
                    <label
                      key={rarity.value}
                      className={`relative flex cursor-pointer flex-col rounded-lg border-2 p-4 transition-all ${
                        newRarity === rarity.value
                          ? `${getRarityColor(rarity.value)} border-current`
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="rarity"
                        value={rarity.value}
                        checked={newRarity === rarity.value}
                        onChange={(e) => setNewRarity(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">
                        {rarity.label}
                      </span>
                      <span className="mt-1 text-xs text-gray-600">
                        {rarity.description}
                      </span>
                      {newRarity === rarity.value && (
                        <div className="absolute right-2 top-2">
                          <CheckCircle className="h-5 w-5 text-current" />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Preview */}
              {newRarity && editingCard.estimatedValue && (
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <h4 className="mb-2 font-medium text-purple-900">
                    Price Preview
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-800">
                      New Diamond Price ({getRarityTier(newRarity)}):
                    </span>
                    <span className="text-lg font-bold text-purple-900">
                      💎{" "}
                      {calculateDiamondPrice(
                        newRarity,
                        editingCard.estimatedValue,
                        editingCard.confidence || 50
                      )}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-purple-700">
                    Price calculated based on rarity tier, estimated value, and
                    AI confidence
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 border-t p-6">
              <button
                onClick={closeRarityAdjustModal}
                disabled={updatingRarity}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={updateCardRarity}
                disabled={updatingRarity || newRarity === editingCard.rarity}
                className="flex-1 rounded-lg bg-purple-600 px-4 py-3 font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updatingRarity ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Updating...
                  </div>
                ) : (
                  "Update Rarity"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scan Cards Directory Modal */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Scan Uploads Directory
              </h2>
              <button
                onClick={() => {
                  setShowScanModal(false);
                  setScanResults(null);
                  setSelectedFilesToImport(new Set());
                }}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {!scanResults ? (
                /* Initial Scan View */
                <div className="text-center">
                  <div className="mb-6">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                      {scanning ? (
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
                      ) : (
                        <Search className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {scanning
                        ? "Scanning Directory..."
                        : "Scan Cards Directory"}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {scanning
                        ? "Please wait while we scan the /public/uploads directory for new files..."
                        : "Find and import cards from the /public/uploads directory that are not yet in the database."}
                    </p>
                  </div>

                  {!scanning && (
                    <div className="space-y-4">
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <h4 className="mb-2 font-medium text-blue-900">
                          What will be scanned:
                        </h4>
                        <ul className="space-y-1 text-sm text-blue-800">
                          <li>
                            • /public/cards/ directory and all subdirectories
                          </li>
                          <li>
                            • Supported formats: .jpg, .jpeg, .png, .gif, .webp
                          </li>
                          <li>• Files not already in the database</li>
                          <li>
                            • Automatic metadata generation from file paths
                          </li>
                        </ul>
                      </div>

                      <button
                        onClick={handleScanDirectory}
                        disabled={scanning}
                        className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 text-white transition-all hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                      >
                        Start Scanning
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Scan Results View */
                <div className="space-y-6">
                  {/* Results Summary */}
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <h3 className="font-bold text-green-900">
                          Scan Complete!
                        </h3>
                        <p className="text-sm text-green-800">
                          Found {scanResults.missingCards?.length || 0} new
                          files ready for import
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {scanResults.totalFiles || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Files Found
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {scanResults.missingCards?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">New Files</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {scanResults.existingFiles?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        Already in Database
                      </div>
                    </div>
                  </div>

                  {/* File Selection */}
                  {scanResults.missingCards &&
                    scanResults.missingCards.length > 0 && (
                      <div>
                        <div className="mb-4 flex items-center justify-between">
                          <h4 className="text-lg font-bold text-gray-900">
                            Select Files to Import ({selectedFilesToImport.size}{" "}
                            selected)
                          </h4>
                          <div className="space-x-2">
                            <button
                              onClick={() => {
                                const fileNames: string[] =
                                  scanResults.missingCards.map(
                                    (f: any) => f.fileName as string
                                  );
                                const allFiles = new Set<string>(fileNames);
                                setSelectedFilesToImport(allFiles);
                              }}
                              className="rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 hover:bg-blue-200"
                            >
                              Select All
                            </button>
                            <button
                              onClick={() =>
                                setSelectedFilesToImport(new Set())
                              }
                              className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200"
                            >
                              Clear All
                            </button>
                          </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto rounded-lg border border-gray-200">
                          <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-2 lg:grid-cols-3">
                            {scanResults.missingCards.map((file: any) => (
                              <div
                                key={file.fileName}
                                className={`relative rounded-lg border-2 p-3 transition-all ${
                                  selectedFilesToImport.has(file.fileName)
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 bg-white hover:border-gray-300"
                                }`}
                              >
                                <label className="flex cursor-pointer items-start space-x-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedFilesToImport.has(
                                      file.fileName
                                    )}
                                    onChange={() =>
                                      toggleFileSelection(file.fileName)
                                    }
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className="mb-2">
                                      <img
                                        src={file.imageUrl}
                                        alt={file.fileName}
                                        className="h-24 w-full rounded object-cover"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <p className="truncate text-sm font-medium text-gray-900">
                                        {file.generatedName || file.fileName}
                                      </p>
                                      <div className="space-y-1 text-xs text-gray-600">
                                        <p>Element: {file.element}</p>
                                        <p>Rarity: {file.rarity}</p>
                                        <p>Price: 💎{file.diamondPrice}</p>
                                      </div>
                                      <p className="truncate text-xs text-gray-500">
                                        {file.relativePath}
                                      </p>
                                    </div>
                                  </div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                  {/* No New Files */}
                  {scanResults.missingCards &&
                    scanResults.missingCards.length === 0 && (
                      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
                        <div className="mb-3 text-4xl">📂</div>
                        <h3 className="mb-2 text-lg font-bold text-yellow-900">
                          No New Files Found
                        </h3>
                        <p className="text-yellow-800">
                          All files in the cards directory are already in the
                          database.
                        </p>
                      </div>
                    )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3 border-t pt-6">
                    <button
                      onClick={() => {
                        setShowScanModal(false);
                        setScanResults(null);
                        setSelectedFilesToImport(new Set());
                      }}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                    {scanResults.missingCards &&
                      scanResults.missingCards.length > 0 && (
                        <button
                          onClick={handleImportSelectedCards}
                          disabled={
                            selectedFilesToImport.size === 0 || importing
                          }
                          className="flex-1 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 font-medium text-white hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
                        >
                          {importing ? (
                            <div className="flex items-center justify-center">
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                              Importing...
                            </div>
                          ) : (
                            `Import ${selectedFilesToImport.size} Cards`
                          )}
                        </button>
                      )}
                    <button
                      onClick={() => {
                        setScanResults(null);
                        setSelectedFilesToImport(new Set());
                      }}
                      className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-medium text-white hover:from-purple-700 hover:to-pink-700"
                    >
                      Scan Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
