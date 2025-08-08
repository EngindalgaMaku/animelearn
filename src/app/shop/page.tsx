"use client";

import { useState, useEffect, useRef } from "react";
import {
  ShoppingBag,
  Diamond,
  Star,
  Filter,
  Search,
  Grid,
  List,
  Eye,
  Lock,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Award,
  X,
  Zap,
  Shield,
  Wind,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Target,
  Gift,
  Flame,
  HelpCircle,
  Info
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { formatDiamonds } from "@/lib/utils";
import {
  getElementColor,
  getRatingStars,
  getPowerColor,
} from "@/lib/ai/card-generator";
import ShopThemeProvider, { useShopTheme, AchievementNotification } from "@/components/shop/ShopThemeProvider";
import CategorySelector from "@/components/shop/CategorySelector";
import GamifiedCard from "@/components/shop/GamifiedCard";

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

interface ShopResponse {
  success: boolean;
  cards: Card[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats: {
    totalCards: number;
    minPrice: number;
    maxPrice: number;
    avgPrice: number;
  };
  categories: Array<{ rarity: string; count: number }>;
}

// Create a separate component for the shop content that can use the theme context
function ShopPageContent() {
  const [cards, setCards] = useState<Card[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<
    Array<{ value: string; label: string; color: string; icon: string }>
  >([]);
  const [pagination, setPagination] = useState<any>(null);
  const [rarities, setRarities] = useState<any[]>([]);
  const [elements, setElements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("anime-collection");
  const [selectedElement, setSelectedElement] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2500);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [expandedImage, setExpandedImage] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementData, setAchievementData] = useState<any>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { isAuthenticated, user, refreshUser } = useAuth();
  const { themeConfig, setTheme } = useShopTheme();
  const cardsRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  // Image protection functions
  const disableImageInteractions = () => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.key === "x") {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.key === "v") {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.shiftKey && e.key === "J") {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.shiftKey && e.key === "C") {
        e.preventDefault();
        return false;
      }
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("selectstart", handleSelectStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("selectstart", handleSelectStart);
    };
  };

  useEffect(() => {
    const cleanup = disableImageInteractions();
    return cleanup;
  }, []);

  useEffect(() => {
    const initializeShop = async () => {
      setInitialLoading(true);
      try {
        await Promise.all([
          fetchCards(),
          fetchRarities(),
          fetchElements(),
          fetchCategories()
        ]);
      } catch (error) {
        console.error("Failed to initialize shop:", error);
      } finally {
        // Small delay to ensure smooth transition
        setTimeout(() => {
          setInitialLoading(false);
        }, 100);
      }
    };

    initializeShop();
  }, []);

  useEffect(() => {
    if (!initialLoading) {
      fetchCards();
    }
  }, [currentPage, selectedRarity, selectedCategory, selectedElement, sortBy, initialLoading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchCards();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, minPrice, maxPrice, selectedCategory]);

  // Scroll to cards section when pagination changes (not on initial load)
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return; // Skip scroll on initial load
    }
    
    if (cardsRef.current) {
      cardsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [currentPage]); // Trigger on page number changes, but skip initial load

  const fetchCards = async () => {
    try {
      if (!initialLoading) {
        setLoading(true);
      }
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(selectedRarity && { rarity: selectedRarity }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedElement && { element: selectedElement }),
        ...(sortBy && { sortBy }),
        minPrice: minPrice.toString(),
        maxPrice: maxPrice.toString(),
      });

      const response = await fetch(`/api/shop?${params}`);
      if (response.ok) {
        const data: ShopResponse = await response.json();
        setCards(data.cards);
        setStats(data.stats);
        setCategories(data.categories);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Shop fetch failed:", error);
    } finally {
      if (!initialLoading) {
        setLoading(false);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        const categories = data.categories.map((cat: any) => ({
          value: cat.slug,
          label: cat.name,
          color: cat.color,
          icon: cat.icon,
        }));
        setAvailableCategories(categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
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

  const purchaseCard = async (cardId: string) => {
    if (!isAuthenticated) {
      alert(
        "🔒 You need to log in to purchase cards! Please create an account or sign in to continue shopping."
      );
      return;
    }

    setPurchasing(cardId);
    try {
      const response = await fetch("/api/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Show achievement notification
        setAchievementData({
          title: "🎉 Card Purchased!",
          description: `Successfully acquired ${data.purchase.cardName}`,
          icon: <Trophy className="h-4 w-4" />
        });
        setShowAchievement(true);
        
        fetchCards(); // Refresh cards
        refreshUser(); // Refresh user information
        
        // Hide achievement after 4 seconds
        setTimeout(() => setShowAchievement(false), 4000);
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("An error occurred during purchase!");
    } finally {
      setPurchasing(null);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setTheme(category as any);
  };

  const handleThemeChange = (theme: any) => {
    // Theme is already applied by CategorySelector
  };

  // Search filter
  const filteredCards = cards.filter(
    (card) =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.cardTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.series.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.character.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueSeries = Array.from(
    new Set(cards.map((c) => c.series).filter(Boolean))
  );

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div
            className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-t-transparent"
            style={{ borderColor: `${themeConfig.primary}40`, borderTopColor: 'transparent' }}
          ></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading shop...</p>
          <p className="mt-2 text-sm text-gray-500">Preparing your collection experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 xl:px-12">
      {/* Category Selector */}
      <div className="mb-6">
        <CategorySelector
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onThemeChange={handleThemeChange}
        />
      </div>

      {/* Welcome Text with Info Guide Button */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <h2
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r"
            style={{
              backgroundImage: `linear-gradient(to right, ${themeConfig.primary}, ${themeConfig.secondary})`
            }}
          >
            ✨ {selectedCategory === 'anime-collection' ? 'Anime Legends' : selectedCategory === 'star-collection' ? 'Celebrity Stars' : 'Supercar Collection'} Shop
          </h2>
          <button
            onClick={() => setShowInfoModal(true)}
            className="ml-4 flex transform items-center space-x-2 rounded-lg bg-slate-600 px-4 py-2 text-white shadow-md transition-all hover:bg-slate-700"
            title="Card Guide"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm">Card Guide</span>
          </button>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {selectedCategory === 'anime-collection'
            ? 'Discover legendary anime characters with magical powers and epic abilities!'
            : selectedCategory === 'star-collection'
            ? 'Collect iconic celebrity stars and famous personalities!'
            : 'Own the world\'s most exclusive supercars and racing legends!'
          }
        </p>
        {selectedCategory === 'star-collection' && (
          <div className="mt-3 mx-auto max-w-2xl">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-amber-800 text-sm flex items-center">
                <span className="mr-2">⚠️</span>
                <span>
                  <strong>Disclaimer:</strong> The celebrity cards in this collection are fictional characters and do not represent real people.
                  All names and characters are created for entertainment purposes only.
                </span>
              </p>
            </div>
          </div>
        )}
      </div>


      {/* Minimized Single Row Filters */}
      <div className="mb-4 rounded-xl bg-white/80 p-3 shadow-md backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Rarity Filter */}
          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Rarity</option>
            {categories.map((cat) => (
              <option key={cat.rarity} value={cat.rarity}>
                {cat.rarity} ({cat.count})
              </option>
            ))}
          </select>

          {/* Element Filter */}
          <select
            value={selectedElement}
            onChange={(e) => setSelectedElement(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Elements</option>
            {['Fire', 'Water', 'Earth', 'Air', 'Lightning', 'Dark', 'Light'].map((element) => (
              <option key={element} value={element}>
                {element}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
          >
            <option value="price">💰 Price</option>
            <option value="rarity">💎 Rarity</option>
            <option value="rating">⭐ Rating</option>
            <option value="name">🔤 Name</option>
            <option value="newest">🆕 Newest</option>
          </select>

          {/* Cards Count */}
          <div className="text-gray-600 text-sm ml-auto">
            <span className="text-base font-bold" style={{ color: themeConfig.primary }}>
              {pagination?.total || 0}
            </span> cards
          </div>

          {/* Clear Button */}
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedRarity("");
              setSelectedElement("");
            }}
            className="rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-700 transition-colors hover:bg-gray-200"
          >
            Clear
          </button>

          {/* View Mode */}
          <div className="flex space-x-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-2 ${
                viewMode === "grid"
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              style={{
                backgroundColor: viewMode === "grid" ? themeConfig.primary : "transparent"
              }}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-2 ${
                viewMode === "list"
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              style={{
                backgroundColor: viewMode === "list" ? themeConfig.primary : "transparent"
              }}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid/List with Loading Overlay */}
      <div className="relative">
        {loading && !initialLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex items-center justify-center rounded-xl">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
              style={{ borderColor: `${themeConfig.primary}40`, borderTopColor: 'transparent' }}
            ></div>
          </div>
        )}
        
        {filteredCards.length === 0 ? (
          <div className="py-12 text-center">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-medium text-gray-900">
              No Cards Found
            </h3>
            <p className="text-gray-600">
              Try changing your search criteria and try again.
            </p>
          </div>
        ) : (
          <div
            ref={cardsRef}
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5"
                : "space-y-4"
            }
          >
            {filteredCards.map((card) => (
              <GamifiedCard
                key={card.id}
                card={card}
                viewMode={viewMode}
                onCardClick={setSelectedCard}
                onPurchase={purchaseCard}
                purchasing={purchasing === card.id}
                rarities={rarities}
                elements={elements}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          {/* First Page Button */}
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="flex items-center space-x-1 rounded-lg border border-gray-200 bg-white/80 px-3 py-2 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>First</span>
          </button>

          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={!pagination.hasPrev}
            className="flex items-center space-x-1 rounded-lg border border-gray-200 bg-white/80 px-3 py-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Prev</span>
          </button>

          <div className="flex items-center space-x-1">
            {/* Show first page if not in range */}
            {currentPage > 3 && (
              <>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="h-10 w-10 rounded-lg border border-gray-200 bg-white/80 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  1
                </button>
                {currentPage > 4 && <span className="text-gray-500">...</span>}
              </>
            )}

            {/* Page numbers around current page */}
            {Array.from({ length: 5 }, (_, index) => {
              const page = Math.max(1, currentPage - 2) + index;
              if (page > pagination.pages) return null;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 w-10 rounded-lg border transition-colors ${
                    currentPage === page
                      ? "text-white shadow-lg"
                      : "border-gray-200 bg-white/80 text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{
                    backgroundColor: currentPage === page ? themeConfig.primary : undefined,
                    borderColor: currentPage === page ? themeConfig.primary : undefined
                  }}
                >
                  {page}
                </button>
              );
            })}

            {/* Show last page if not in range */}
            {currentPage < pagination.pages - 2 && (
              <>
                {currentPage < pagination.pages - 3 && <span className="text-gray-500">...</span>}
                <button
                  onClick={() => setCurrentPage(pagination.pages)}
                  className="h-10 w-10 rounded-lg border border-gray-200 bg-white/80 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  {pagination.pages}
                </button>
              </>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={!pagination.hasNext}
            className="flex items-center space-x-1 rounded-lg border border-gray-200 bg-white/80 px-3 py-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Last Page Button */}
          <button
            onClick={() => setCurrentPage(pagination.pages)}
            disabled={currentPage === pagination.pages}
            className="flex items-center space-x-1 rounded-lg border border-gray-200 bg-white/80 px-3 py-2 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>Last</span>
          </button>
        </div>
      )}

      {/* Achievement Notification */}
      {achievementData && (
        <AchievementNotification
          title={achievementData.title}
          description={achievementData.description}
          icon={achievementData.icon}
          show={showAchievement}
          onClose={() => setShowAchievement(false)}
        />
      )}

      {/* Card Detail Modal - Compact Professional Design */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl bg-white shadow-2xl">
            {/* Compact Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedCard.cardTitle || selectedCard.name}
                  </h2>
                  <p className="text-xs text-gray-600">Card Details</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="rounded-full bg-gray-100 p-2 transition-all hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Side - Image */}
                <div className="relative flex justify-center">
                  <div className="group relative">
                    <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-lg"></div>
                    <img
                      src={(selectedCard as any).secureThumbnailUrl || (selectedCard as any).secureImageUrl || `/api/secure-image?cardId=${selectedCard.id}&type=thumbnail`}
                      alt={selectedCard.cardTitle || selectedCard.name}
                      className="relative h-auto max-w-full rounded-lg shadow-xl transition-transform group-hover:scale-105"
                      style={{ maxHeight: "400px" }}
                      onError={(e) => {
                        // Fallback chain for better production compatibility
                        const target = e.target as HTMLImageElement;
                        const currentSrc = target.src;
                        
                        if (!currentSrc.includes('placeholder')) {
                          // Try direct API call first
                          if (!currentSrc.includes('/api/secure-image')) {
                            target.src = `/api/secure-image?cardId=${selectedCard.id}&type=thumbnail`;
                          } else if (!currentSrc.includes('type=preview')) {
                            // Try preview type
                            target.src = `/api/secure-image?cardId=${selectedCard.id}&type=preview`;
                          } else {
                            // Final fallback
                            target.src = '/placeholder-card.svg';
                          }
                        }
                      }}
                    />
                    {/* Expand Icon */}
                    <button
                      onClick={() => setExpandedImage(true)}
                      className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white opacity-0 transition-all hover:bg-black/80 group-hover:opacity-100"
                      title="View Full Image"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Right Side - Details */}
                <div className="space-y-4">
                  {/* Card Information */}
                  <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                    <h3 className="mb-3 text-lg font-bold text-gray-900 flex items-center">
                      <div className="mr-2 h-6 w-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-xs">📊</span>
                      </div>
                      Information
                    </h3>

                    <div className="grid gap-3 text-sm">
                      {selectedCard.series && (
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-600">Category</span>
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                            {getCategoryDisplayName(selectedCard.series) || selectedCard.series}
                          </span>
                        </div>
                      )}

                      {selectedCard.character &&
                       selectedCard.character !== "Anime Character" &&
                       selectedCard.character !== "Unknown" &&
                       selectedCard.character !== "Unknown Fighter" &&
                       selectedCard.character.trim() !== "" && (
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-600">Character</span>
                          <span className="font-medium text-gray-900">{selectedCard.character}</span>
                        </div>
                      )}

                      {selectedCard.element && (
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-600">Element</span>
                          <span className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-medium text-cyan-800">
                            ❄️ {selectedCard.element}
                          </span>
                        </div>
                      )}

                      {selectedCard.rarity && (
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-600">Rarity</span>
                          <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                            {selectedCard.rarity}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-600">Status</span>
                        {selectedCard.isOwned ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Owned
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                            Available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Power Statistics */}
                  {selectedCard.attackPower && selectedCard.defense && selectedCard.speed && (
                    <div className="rounded-lg bg-gradient-to-r from-red-50 via-blue-50 to-green-50 p-4">
                      <h4 className="mb-3 text-lg font-bold text-gray-900 flex items-center">
                        <span className="mr-2">⚔️</span>
                        Battle Stats
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-lg bg-gradient-to-br from-red-500 to-red-600 p-3 text-center shadow-md">
                          <Zap className="mx-auto mb-1 h-4 w-4 text-white" />
                          <div className="text-xs font-medium text-red-100">ATK</div>
                          <div className="text-xl font-bold text-white">{selectedCard.attackPower}</div>
                        </div>
                        
                        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-3 text-center shadow-md">
                          <Shield className="mx-auto mb-1 h-4 w-4 text-white" />
                          <div className="text-xs font-medium text-blue-100">DEF</div>
                          <div className="text-xl font-bold text-white">{selectedCard.defense}</div>
                        </div>
                        
                        <div className="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-3 text-center shadow-md">
                          <Wind className="mx-auto mb-1 h-4 w-4 text-white" />
                          <div className="text-xs font-medium text-green-100">SPD</div>
                          <div className="text-xl font-bold text-white">{selectedCard.speed}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Special Ability */}
                  {selectedCard.specialAbility && (
                    <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
                      <h4 className="mb-2 text-lg font-bold flex items-center">
                        <span className="mr-2">✨</span>
                        Special Ability
                      </h4>
                      <p className="text-purple-100 text-sm leading-relaxed">
                        {selectedCard.specialAbility}
                      </p>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-4 text-center">
                    <h4 className="mb-2 text-lg font-bold text-gray-900 flex items-center justify-center">
                      <span className="mr-2">💎</span>
                      Price
                    </h4>
                    <div className="text-2xl font-bold" style={{ color: themeConfig.primary }}>
                      {selectedCard.diamondPrice}
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact Action Buttons */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                  <button
                    onClick={() => setExpandedImage(true)}
                    className="flex items-center justify-center space-x-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm font-medium text-white transition-all hover:scale-105"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  
                  <button
                    onClick={() => {/* Add to favorites */}}
                    className="flex items-center justify-center space-x-1 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 px-3 py-2 text-sm font-medium text-white transition-all hover:scale-105"
                  >
                    <span>❤️</span>
                    <span>Like</span>
                  </button>
                  
                  <button
                    onClick={() => {/* Share */}}
                    className="flex items-center justify-center space-x-1 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-3 py-2 text-sm font-medium text-white transition-all hover:scale-105"
                  >
                    <span>📤</span>
                    <span>Share</span>
                  </button>
                  
                  {!selectedCard.isOwned ? (
                    <button
                      onClick={() => {
                        purchaseCard(selectedCard.id);
                        setSelectedCard(null);
                      }}
                      disabled={purchasing === selectedCard.id}
                      className="flex items-center justify-center space-x-1 rounded-lg bg-gradient-to-r from-purple-600 to-violet-600 px-3 py-2 text-sm font-medium text-white transition-all hover:scale-105 disabled:opacity-50"
                    >
                      {purchasing === selectedCard.id ? (
                        <>
                          <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Buy</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4" />
                          <span>Buy</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center justify-center space-x-1 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-3 py-2 text-sm font-medium text-white">
                      <CheckCircle className="h-4 w-4" />
                      <span>Owned</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Professional Card Guide Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-xl bg-white shadow-2xl border border-gray-200 my-8">
            {/* Clean Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-slate-600 rounded-lg p-2">
                    <Info className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Card Collection Guide</h2>
                    <p className="text-gray-600">Understanding card values and statistics</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Card Statistics Section */}
              <div className="mb-8 rounded-lg bg-gray-50 border border-gray-200 p-6">
                <h3 className="mb-6 flex items-center space-x-3 text-xl font-bold text-gray-900">
                  <span className="text-2xl">⚔️</span>
                  <span>Card Statistics</span>
                </h3>
                
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Attack Power */}
                  <div className="rounded-lg bg-white border border-gray-200 p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-red-100 rounded-full p-2">
                        <Zap className="h-5 w-5 text-red-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Attack Power</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Represents the card's offensive capabilities. Higher attack power means more damage output.
                    </p>
                    <div className="bg-red-50 rounded p-2 text-xs text-red-700">
                      <strong>Strategy:</strong> Focus on high attack for quick victories
                    </div>
                  </div>

                  {/* Defense */}
                  <div className="rounded-lg bg-white border border-gray-200 p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-blue-100 rounded-full p-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Defense</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Shows the card's defensive strength. Higher defense reduces incoming damage.
                    </p>
                    <div className="bg-blue-50 rounded p-2 text-xs text-blue-700">
                      <strong>Tactic:</strong> Essential for tank roles and longevity
                    </div>
                  </div>

                  {/* Speed */}
                  <div className="rounded-lg bg-white border border-gray-200 p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-green-100 rounded-full p-2">
                        <Wind className="h-5 w-5 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Speed</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Determines action order. Higher speed gives priority in battles and initiatives.
                    </p>
                    <div className="bg-green-50 rounded p-2 text-xs text-green-700">
                      <strong>Advantage:</strong> Fast cards control battle flow
                    </div>
                  </div>
                </div>

                {/* Value Analysis */}
                <div className="mt-6 rounded-lg bg-slate-50 border border-slate-200 p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <span>💎</span>
                    <span>Value Analysis</span>
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <p className="mb-2"><strong>Price-to-Stats Ratio:</strong></p>
                      <code className="bg-slate-200 px-2 py-1 rounded text-xs">
                        Total Stats ÷ Diamond Price = Value Score
                      </code>
                    </div>
                    <div>
                      <p className="mb-2"><strong>Investment Strategy:</strong></p>
                      <code className="bg-slate-200 px-2 py-1 rounded text-xs">
                        Legendary Cards = Long-term Investment
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Rarity Section */}
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-6">
                  <h3 className="mb-6 flex items-center space-x-3 text-xl font-bold text-gray-900">
                    <span className="text-2xl">💎</span>
                    <span>Rarity Levels</span>
                  </h3>
                  <div className="space-y-3">
                    {rarities.length > 0 ? (
                      rarities.map((rarity, index) => (
                        <div
                          key={rarity.id}
                          className="rounded-lg border border-gray-200 p-4 bg-white"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{rarity.icon}</span>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {rarity.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {rarity.description || "Premium power level"}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    Avg Stats: {Math.floor(65 + (index * 8))}-{Math.floor(75 + (index * 8))}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                💎 {rarity.minDiamonds || 0}-{rarity.maxDiamonds || 0}
                              </p>
                              <p className="text-xs text-gray-500">
                                Drop Rate: {rarity.dropRate || 0}%
                              </p>
                              <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                                <div
                                  className="bg-blue-500 h-2 rounded-full transition-all"
                                  style={{ width: `${Math.min(100, (rarity.dropRate || 0) * 2)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <div className="text-4xl mb-2">💎</div>
                        <p>Loading rarity data...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Elements Section */}
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-6">
                  <h3 className="mb-6 flex items-center space-x-3 text-xl font-bold text-gray-900">
                    <span className="text-2xl">🌟</span>
                    <span>Element Types</span>
                  </h3>
                  <div className="space-y-3">
                    {elements.length > 0 ? (
                      elements.map((element, index) => (
                        <div
                          key={element.id}
                          className="rounded-lg border border-gray-200 p-4 bg-white"
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl">{element.icon || "✨"}</span>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {element.name}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {element.effectDescription || element.description || "Magical element power"}
                              </p>
                              {element.strengths && (
                                <div className="mt-2 bg-gray-50 rounded p-2">
                                  <p className="text-xs font-semibold text-gray-700">Strong Against:</p>
                                  <p className="text-xs text-gray-600">{element.strengths}</p>
                                </div>
                              )}
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  Bonus: +{Math.floor(5 + (index * 3))}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <div className="text-4xl mb-2">🌟</div>
                        <p>Loading element data...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Shopping Tips Section */}
              <div className="mt-6 rounded-lg bg-slate-50 border border-slate-200 p-6">
                <h4 className="mb-4 flex items-center space-x-3 text-lg font-bold text-gray-900">
                  <span className="text-xl">🎯</span>
                  <span>Smart Shopping Tips</span>
                </h4>
                <div className="grid gap-4 md:grid-cols-3 text-sm">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="font-semibold text-gray-900 mb-2">💰 Budget Management</h5>
                    <ul className="space-y-1 text-gray-600 text-xs">
                      <li>• Legendary cards for long-term value</li>
                      <li>• Epic cards for balanced risk-reward</li>
                      <li>• Rare cards ideal for beginners</li>
                      <li>• Diversify your collection</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="font-semibold text-gray-900 mb-2">📊 Value Analysis</h5>
                    <ul className="space-y-1 text-gray-600 text-xs">
                      <li>• Calculate stats-to-price ratio</li>
                      <li>• Consider element advantages</li>
                      <li>• Monitor market trends</li>
                      <li>• Analyze ROI potential</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="font-semibold text-gray-900 mb-2">🎮 Strategy Tips</h5>
                    <ul className="space-y-1 text-gray-600 text-xs">
                      <li>• Build balanced teams</li>
                      <li>• Use element synergies</li>
                      <li>• Balance speed/attack/defense</li>
                      <li>• Value special abilities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 rounded-b-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-xl">💎</div>
                  <div>
                    <p className="text-sm text-gray-700">
                      <strong>Current Balance:</strong> {isAuthenticated ? `${user?.currentDiamonds || 0} Diamonds` : 'Please log in'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Make smart purchases to build your collection
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="rounded-lg bg-slate-600 px-4 py-2 text-white font-medium transition-colors hover:bg-slate-700"
                >
                  Start Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Full Screen Image Modal */}
      {expandedImage && selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <button
              onClick={() => setExpandedImage(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="relative">
              <img
                src={(selectedCard as any).secureFullImageUrl || (selectedCard as any).secureImageUrl || `/api/secure-image?cardId=${selectedCard.id}&type=full`}
                alt={selectedCard.cardTitle || selectedCard.name}
                className="h-auto max-h-[90vh] max-w-full rounded-lg shadow-2xl"
                onError={(e) => {
                  // Enhanced fallback chain for production
                  const target = e.target as HTMLImageElement;
                  const currentSrc = target.src;
                  
                  if (!currentSrc.includes('placeholder')) {
                    // Try different image types
                    if (!currentSrc.includes('/api/secure-image')) {
                      target.src = `/api/secure-image?cardId=${selectedCard.id}&type=full`;
                    } else if (currentSrc.includes('type=full')) {
                      target.src = `/api/secure-image?cardId=${selectedCard.id}&type=preview`;
                    } else if (currentSrc.includes('type=preview')) {
                      target.src = `/api/secure-image?cardId=${selectedCard.id}&type=thumbnail`;
                    } else {
                      // Final fallback
                      target.src = '/placeholder-card.svg';
                    }
                  }
                }}
              />
              
              {/* Diagonal LIMITED Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="text-white text-6xl md:text-8xl font-bold opacity-10 select-none"
                  style={{
                    transform: 'rotate(-45deg)',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    fontFamily: 'Arial Black, sans-serif',
                    letterSpacing: '0.2em'
                  }}
                >
                  LIMITED
                </div>
              </div>
              
              {/* Premium Watermark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 rounded-lg flex items-end justify-center">
                <div className="text-center text-white p-6 w-full">
                  <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 mx-auto max-w-md">
                    <div className="text-2xl font-bold mb-2">🔒 Premium Content</div>
                    <div className="text-sm mb-4">
                      Purchase this card to view the full high-resolution image without watermarks
                    </div>
                    <div className="flex items-center justify-center space-x-4">
                      <span className="text-lg font-bold" style={{ color: themeConfig.primary }}>
                        💎 {selectedCard.diamondPrice} Diamonds
                      </span>
                      {!selectedCard.isOwned && (
                        <button
                          onClick={() => {
                            setExpandedImage(false);
                            purchaseCard(selectedCard.id);
                          }}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 rounded-lg text-white font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
                        >
                          Purchase Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main export component with theme provider
export default function ShopPage() {
  return (
    <ShopThemeProvider initialTheme="anime-collection">
      <ShopPageContent />
    </ShopThemeProvider>
  );
}
