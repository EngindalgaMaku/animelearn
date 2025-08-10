"use client";

import Link from "next/link";
import {
  Calendar,
  Clock,
  ArrowRight,
  Eye,
  Heart,
  Share2,
  Code,
  Brain,
  Zap,
  FileText,
  Globe,
  TrendingUp,
  BookOpen,
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
  viewCount?: number;
  likeCount?: number;
  isPublished?: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
  socialImageUrl?: string;
  content?: string; // Optional for list views
}
import { useState } from "react";

interface BlogPostCardProps {
  post: BlogPost;
  viewMode: "grid" | "list";
  featured?: boolean;
}

export function BlogPostCard({
  post,
  viewMode,
  featured = false,
}: BlogPostCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Python Basics":
      case "Python Temelleri":
        return <Code className="h-4 w-4" />;
      case "Python Applications":
        return <Zap className="h-4 w-4" />;
      case "Data Analysis":
      case "Veri Analizi":
        return <Brain className="h-4 w-4" />;
      case "Web Development":
        return <Globe className="h-4 w-4" />;
      case "Career":
      case "Kariyer":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Python Basics":
      case "Python Temelleri":
        return "bg-blue-500 text-white";
      case "Python Applications":
        return "bg-purple-500 text-white";
      case "Data Analysis":
      case "Veri Analizi":
        return "bg-green-500 text-white";
      case "Web Development":
        return "bg-orange-500 text-white";
      case "Career":
      case "Kariyer":
        return "bg-pink-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/blog/${post.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url);
    }
  };

  if (viewMode === "list") {
    return (
      <article className="group flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-xl md:flex-row">
        {/* Thumbnail placeholder for list view */}
        <div className="flex-shrink-0">
          <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 md:h-32 md:w-32">
            <div className="text-2xl text-white md:text-3xl">
              {getCategoryIcon(post.category)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center space-x-1 rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(post.category)}`}
              >
                {getCategoryIcon(post.category)}
                <span>{post.category}</span>
              </span>
              {featured && (
                <span className="inline-flex items-center space-x-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                  <BookOpen className="h-3 w-3" />
                  <span>Featured</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </div>
            </div>
          </div>

          {/* Title & Excerpt */}
          <div>
            <h3 className="mb-2 line-clamp-2 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
              {post.title}
            </h3>
            <p className="line-clamp-2 text-sm text-slate-600">
              {post.excerpt}
            </p>
          </div>

          {/* Tags & Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-slate-200"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-slate-400">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`rounded-lg p-2 transition-colors ${
                  isLiked
                    ? "bg-red-50 text-red-500"
                    : "text-slate-400 hover:bg-red-50 hover:text-red-500"
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </button>

              <button
                onClick={handleShare}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-500"
              >
                <Share2 className="h-4 w-4" />
              </button>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700"
              >
                <span>Read</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Grid view
  return (
    <article
      className={`group rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 hover:shadow-xl ${featured ? "ring-2 ring-yellow-200" : ""}`}
    >
      {/* Header Image/Icon */}
      <div className="relative">
        <div className="flex h-48 items-center justify-center rounded-t-2xl bg-gradient-to-br from-blue-500 to-purple-600">
          <div className="text-4xl text-white">
            {getCategoryIcon(post.category)}
          </div>
        </div>

        {featured && (
          <div className="absolute right-3 top-3">
            <span className="inline-flex items-center space-x-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
              <BookOpen className="h-3 w-3" />
              <span>Featured</span>
            </span>
          </div>
        )}

        <div className="absolute left-3 top-3">
          <span
            className={`inline-flex items-center space-x-1 rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(post.category)}`}
          >
            {getCategoryIcon(post.category)}
            <span>{post.category}</span>
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Meta Info */}
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{post.readTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(post.createdAt).toLocaleDateString("tr-TR")}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-3 line-clamp-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="mb-4 line-clamp-3 text-sm text-slate-600">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-1">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-slate-200"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-xs text-slate-400">
              +{post.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`rounded-lg p-2 transition-colors ${
                isLiked
                  ? "bg-red-50 text-red-500"
                  : "text-slate-400 hover:bg-red-50 hover:text-red-500"
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </button>

            <button
              onClick={handleShare}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-500"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700"
          >
            <span>Read</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
