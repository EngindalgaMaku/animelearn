"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Film,
  Car,
  Star,
  Zap,
  Crown,
  Flame,
  Heart,
  Trophy
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  description: string;
  cardCount: number;
  rarity: string;
  featured: string;
}

interface DatabaseCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  cardCount: number;
}

// Theme configurations for different categories
const categoryThemes: Record<string, {
  icon: React.ReactNode;
  color: string;
  gradient: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  rarity: string;
  featured: string;
}> = {
  "anime-collection": {
    icon: <Sparkles className="h-6 w-6" />,
    color: "from-pink-500 to-purple-600",
    gradient: "bg-gradient-to-r from-pink-500/20 to-purple-600/20",
    theme: {
      primary: "#FF6B6B",
      secondary: "#9333EA",
      accent: "#F59E0B",
      background: "from-pink-50 via-purple-50 to-indigo-50"
    },
    rarity: "Legendary",
    featured: "Legendary Anime"
  },
  "star-collection": {
    icon: <Star className="h-6 w-6" />,
    color: "from-cyan-500 to-teal-600",
    gradient: "bg-gradient-to-r from-cyan-500/20 to-teal-600/20",
    theme: {
      primary: "#4ECDC4",
      secondary: "#0891B2",
      accent: "#10B981",
      background: "from-cyan-50 via-teal-50 to-blue-50"
    },
    rarity: "Epic",
    featured: "Celebrity Stars"
  },
  "car-collection": {
    icon: <Car className="h-6 w-6" />,
    color: "from-blue-500 to-indigo-600",
    gradient: "bg-gradient-to-r from-blue-500/20 to-indigo-600/20",
    theme: {
      primary: "#45B7D1",
      secondary: "#DC2626",
      accent: "#FBBF24",
      background: "from-blue-50 via-indigo-50 to-cyan-50"
    },
    rarity: "Ultra Rare",
    featured: "Supercars"
  }
};

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onThemeChange: (theme: any) => void;
}

export default function CategorySelector({
  selectedCategory,
  onCategoryChange,
  onThemeChange
}: CategorySelectorProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        const processedCategories = data.categories.map((dbCategory: DatabaseCategory) => {
          const themeConfig = categoryThemes[dbCategory.slug] || categoryThemes["anime-collection"];
          return {
            id: dbCategory.slug,
            name: dbCategory.name,
            slug: dbCategory.slug,
            icon: themeConfig.icon,
            color: themeConfig.color,
            gradient: themeConfig.gradient,
            theme: themeConfig.theme,
            description: dbCategory.description || getDefaultDescription(dbCategory.slug),
            cardCount: dbCategory.cardCount,
            rarity: themeConfig.rarity,
            featured: themeConfig.featured
          };
        });
        setCategories(processedCategories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Fallback to default categories if API fails
      setCategories([
        {
          id: "anime-collection",
          name: "Anime Collection",
          slug: "anime-collection",
          icon: <Sparkles className="h-6 w-6" />,
          color: "from-pink-500 to-purple-600",
          gradient: "bg-gradient-to-r from-pink-500/20 to-purple-600/20",
          theme: categoryThemes["anime-collection"].theme,
          description: "Discover legendary anime characters and their magical powers",
          cardCount: 150,
          rarity: "Legendary",
          featured: "Legendary Anime"
        },
        {
          id: "star-collection",
          name: "Star Collection",
          slug: "star-collection",
          icon: <Star className="h-6 w-6" />,
          color: "from-cyan-500 to-teal-600",
          gradient: "bg-gradient-to-r from-cyan-500/20 to-teal-600/20",
          theme: categoryThemes["star-collection"].theme,
          description: "Celebrity and famous personality trading cards",
          cardCount: 120,
          rarity: "Epic",
          featured: "Celebrity Stars"
        },
        {
          id: "car-collection",
          name: "Car Collection",
          slug: "car-collection",
          icon: <Car className="h-6 w-6" />,
          color: "from-blue-500 to-indigo-600",
          gradient: "bg-gradient-to-r from-blue-500/20 to-indigo-600/20",
          theme: categoryThemes["car-collection"].theme,
          description: "Luxury and sports car trading cards",
          cardCount: 80,
          rarity: "Ultra Rare",
          featured: "Supercars"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultDescription = (slug: string): string => {
    const descriptions: Record<string, string> = {
      "anime-collection": "Discover legendary anime characters and their magical powers",
      "star-collection": "Celebrity and famous personality trading cards",
      "car-collection": "Luxury and sports car trading cards"
    };
    return descriptions[slug] || "Premium collectible cards";
  };

  const handleCategorySelect = (category: Category) => {
    onCategoryChange(category.id);
    onThemeChange(category.theme);
  };

  if (loading) {
    return (
      <div className="mb-8 flex justify-center">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
          <span className="text-gray-600">Loading categories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      {/* Compact Header */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          🎯 Choose Collection
        </h2>
      </div>

      {/* Compact Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const isHovered = hoveredCategory === category.id;
          
          return (
            <motion.div
              key={category.id}
              className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-300 ${
                isSelected 
                  ? `border-${category.theme.primary} shadow-xl scale-105` 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
              }`}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => handleCategorySelect(category)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 rounded-2xl ${category.gradient} opacity-50`} />
              
              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-2 shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <Crown className="h-4 w-4" />
                </motion.div>
              )}

              <div className="relative p-5">
                {/* Category Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${category.color} mb-4 shadow-lg`}>
                  <div className="text-white">
                    {category.icon}
                  </div>
                </div>

                {/* Category Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {category.cardCount}
                    </div>
                    <div className="text-xs text-gray-500">Cards</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Zap className="h-4 w-4 text-purple-500" />
                      <span className="text-lg font-bold text-gray-900">
                        {category.rarity}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">Top Rarity</div>
                  </div>
                </div>

                {/* Featured Badge */}
                <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${category.color} text-white`}>
                  <Trophy className="h-3 w-3" />
                  <span>{category.featured}</span>
                </div>

                {/* Hover Effects */}
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </div>

              {/* Selection Animation */}
              {isSelected && (
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${category.color} opacity-20`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.2 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Quick Switch Bar */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category)}
              className={`p-3 rounded-full transition-all duration-200 ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-110`
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title={category.name}
            >
              {category.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}