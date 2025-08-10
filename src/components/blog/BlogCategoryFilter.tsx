"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Grid,
  List,
  BookOpen,
  Code,
  Brain,
  Zap,
  Globe,
  TrendingUp,
  User,
} from "lucide-react";
// Database BlogPost interface
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  category: string;
  tags: string[];
  featured: boolean;
  readTime: string;
  estimatedMinutes: number;
  author: string;
  viewCount: number;
  likeCount: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  socialImageUrl?: string;
  content?: string; // Optional for list views
}

interface BlogCategoryFilterProps {
  posts: BlogPost[];
  onFilteredPostsChange: (posts: BlogPost[]) => void;
}

interface CategoryInfo {
  name: string;
  icon: any;
  color: string;
  description: string;
  count: number;
}

export function BlogCategoryFilter({
  posts,
  onFilteredPostsChange,
}: BlogCategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "readTime">("date");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Calculate categories and their counts
  const categories = useMemo(() => {
    const categoryMap: Record<string, CategoryInfo> = {
      All: {
        name: "All Articles",
        icon: BookOpen,
        color:
          "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200",
        description: "All Python blog articles",
        count: posts.length,
      },
      "Python Basics": {
        name: "Python Basics",
        icon: Code,
        color: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
        description: "Python programming fundamentals",
        count: posts.filter(
          (p) => p.category === "Python Basics" || p.category === "Basics"
        ).length,
      },
      "Python Applications": {
        name: "Python Applications",
        icon: Zap,
        color:
          "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
        description: "Projects you can build with Python",
        count: posts.filter((p) => p.category === "Python Applications").length,
      },
      "Data Analysis": {
        name: "Data Analysis",
        icon: Brain,
        color:
          "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
        description: "Pandas, NumPy and data science",
        count: posts.filter(
          (p) => p.category === "Data Analysis" || p.category === "Intermediate"
        ).length,
      },
      "Web Development": {
        name: "Web Development",
        icon: Globe,
        color:
          "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
        description: "Django, Flask web frameworks",
        count: posts.filter((p) => p.category === "Web Development").length,
      },
      Career: {
        name: "Career & Tips",
        icon: TrendingUp,
        color: "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200",
        description: "Python developer career guide",
        count: posts.filter(
          (p) => p.category === "Career" || p.category === "Kariyer"
        ).length,
      },
    };

    return Object.entries(categoryMap).map(([key, info]) => ({
      key,
      ...info,
    }));
  }, [posts]);

  // Etiketleri hesapla
  const allTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20); // Top 20 most popular tags
  }, [posts]);

  // Filtering and sorting
  const filteredPosts = useMemo(() => {
    console.log("🔍 BlogCategoryFilter - Starting with posts:", posts.length);
    console.log("🔍 BlogCategoryFilter - Selected category:", selectedCategory);
    console.log("🔍 BlogCategoryFilter - Selected tag:", selectedTag);
    console.log("🔍 BlogCategoryFilter - Search query:", searchQuery);

    let filtered = posts;

    // Kategori filtresi
    if (selectedCategory !== "All") {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(
        (post) =>
          post.category === selectedCategory ||
          (selectedCategory === "Python Basics" &&
            post.category === "Python Temelleri") ||
          (selectedCategory === "Data Analysis" &&
            post.category === "Veri Analizi")
      );
      console.log(
        `🔍 After category filter: ${beforeFilter} → ${filtered.length}`
      );
    }

    // Tag filtresi
    if (selectedTag) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter((post) => post.tags.includes(selectedTag));
      console.log(`🔍 After tag filter: ${beforeFilter} → ${filtered.length}`);
    }

    // Arama filtresi
    if (searchQuery) {
      const beforeFilter = filtered.length;
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          false ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
      console.log(
        `🔍 After search filter: ${beforeFilter} → ${filtered.length}`
      );
    }

    console.log(
      "🔍 Before sorting - posts:",
      filtered.length,
      filtered.map((p) => p.title)
    );

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title, "tr");
        case "readTime":
          return parseInt(a.readTime) - parseInt(b.readTime);
        case "date":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    console.log(
      "🔍 After sorting - posts:",
      filtered.length,
      filtered.map((p) => p.title)
    );
    console.log(
      "🔍 BlogCategoryFilter - Final filtered posts:",
      filtered.length
    );
    return filtered;
  }, [posts, selectedCategory, selectedTag, searchQuery, sortBy]);

  // Send filtered posts to parent component
  useEffect(() => {
    onFilteredPostsChange(filteredPosts);
  }, [filteredPosts, onFilteredPostsChange]);

  return (
    <div className="mb-8 space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search in blog posts... (title, content, tags)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Category Filters */}
      <div>
        <h3 className="mb-4 flex items-center text-lg font-semibold text-slate-900">
          <Filter className="mr-2 h-5 w-5" />
          Categories
        </h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.key;

            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`
                  group relative flex items-center space-x-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all
                  ${
                    isActive
                      ? category.color
                          .replace("hover:bg-", "bg-")
                          .replace("100", "200")
                      : category.color
                  }
                `}
                title={category.description}
              >
                <Icon className="h-4 w-4" />
                <span>{category.name}</span>
                <span className="ml-2 rounded-full bg-white/80 px-2 py-0.5 text-xs font-bold">
                  {category.count}
                </span>

                {/* Tooltip */}
                <div className="absolute -top-2 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full rounded-lg bg-slate-900 px-3 py-2 text-xs text-white group-hover:block">
                  {category.description}
                  <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div>
          <h3 className="mb-4 flex items-center text-lg font-semibold text-slate-900">
            <span className="mr-2">#</span>
            Popular Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag("")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                !selectedTag
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            {allTags.map(([tag, count]) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  selectedTag === tag
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                #{tag} ({count})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Sort */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="date">Newest</option>
            <option value="title">Alphabetical</option>
            <option value="readTime">Reading Time</option>
          </select>
        </div>

        {/* View Mode */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-700">View:</span>
          <div className="flex rounded-lg border border-slate-200 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded px-3 py-1 text-sm transition-all ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded px-3 py-1 text-sm transition-all ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-slate-600">
          <span className="font-medium">{filteredPosts.length}</span> articles
          found
          {searchQuery && (
            <span className="ml-1">
              for "<strong>{searchQuery}</strong>"
            </span>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCategory !== "All" || selectedTag || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-700">
            Active filters:
          </span>

          {selectedCategory !== "All" && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
              {categories.find((c) => c.key === selectedCategory)?.name}
              <button
                onClick={() => setSelectedCategory("All")}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}

          {selectedTag && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              #{selectedTag}
              <button
                onClick={() => setSelectedTag("")}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
              "{searchQuery}"
              <button
                onClick={() => setSearchQuery("")}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          )}

          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedTag("");
              setSearchQuery("");
            }}
            className="text-xs text-slate-500 underline hover:text-slate-700"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Export view mode for parent */}
      <input type="hidden" data-view-mode={viewMode} />
    </div>
  );
}
