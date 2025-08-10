"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Calendar,
  User,
  Tag,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  ExternalLink,
  Clock,
  MessageSquare,
  TrendingUp,
  Settings,
} from "lucide-react";
import Link from "next/link";

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
  sourceFile?: string;
  authorUser?: {
    username: string;
    firstName?: string;
    lastName?: string;
  };
  _count?: {
    interactions: number;
  };
}

interface SeedStatus {
  markdown: {
    totalFiles: number;
    categories: string[];
    featuredPosts: number;
    totalReadTime: number;
    files: Array<{
      fileName: string;
      slug: string;
      title: string;
      category?: string;
      featured?: boolean;
    }>;
  };
  database: {
    totalPosts: number;
    posts: Array<{
      slug: string;
      title: string;
      sourceFile?: string;
      createdAt: string;
      updatedAt: string;
    }>;
  };
  needsSeeding: boolean;
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [seedStatus, setSeedStatus] = useState<SeedStatus | null>(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchSeedStatus();
  }, [selectedCategory, selectedStatus, searchTerm]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (selectedStatus === "published") params.set("published", "true");
      if (selectedStatus === "draft") params.set("published", "false");
      if (searchTerm) params.set("search", searchTerm);

      const response = await fetch(`/api/admin/blog?${params}`);
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts || []);
      } else {
        console.error("Failed to fetch posts:", data.error);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeedStatus = async () => {
    try {
      const response = await fetch("/api/admin/blog/seed");
      if (response.ok) {
        const data = await response.json();
        setSeedStatus(data);
      }
    } catch (error) {
      console.error("Error fetching seed status:", error);
    }
  };

  const handleSeedPosts = async () => {
    if (
      !confirm(
        "Bu işlem markdown dosyalarını veritabanına aktaracak. Devam etmek istiyor musunuz?"
      )
    ) {
      return;
    }

    try {
      setSeeding(true);
      const response = await fetch("/api/admin/blog/seed", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Blog postları başarıyla seed edildi!");
        fetchPosts();
        fetchSeedStatus();
      } else {
        alert(`Seed işlemi başarısız: ${data.error}`);
      }
    } catch (error) {
      console.error("Error seeding posts:", error);
      alert("Seed işlemi sırasında hata oluştu!");
    } finally {
      setSeeding(false);
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      const response = await fetch(`/api/admin/blog/${post.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublished: !post.isPublished,
          publishedAt: !post.isPublished ? new Date().toISOString() : null,
        }),
      });

      if (response.ok) {
        fetchPosts();
      } else {
        alert("Durum güncellenirken hata oluştu!");
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
      alert("Durum güncellenirken hata oluştu!");
    }
  };

  const toggleFeatured = async (post: BlogPost) => {
    try {
      const response = await fetch(`/api/admin/blog/${post.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          featured: !post.featured,
        }),
      });

      if (response.ok) {
        fetchPosts();
      } else {
        alert("Öne çıkarma durumu güncellenirken hata oluştu!");
      }
    } catch (error) {
      console.error("Error toggling featured status:", error);
      alert("Öne çıkarma durumu güncellenirken hata oluştu!");
    }
  };

  const deletePost = async (post: BlogPost) => {
    if (
      !confirm(`"${post.title}" postunu silmek istediğinizden emin misiniz?`)
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog/${post.slug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPosts();
        alert("Post başarıyla silindi!");
      } else {
        alert("Post silinirken hata oluştu!");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Post silinirken hata oluştu!");
    }
  };

  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="relative z-10 py-6 lg:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm lg:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-xl">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                      📝 Blog Management
                    </h1>
                    <p className="text-gray-600">
                      Manage blog posts and content
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Link
                    href="/admin/blog/new"
                    className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-600"
                  >
                    <Plus className="h-5 w-5" />
                    <span>New Post</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{posts.length}</p>
              <p className="text-sm text-blue-100">Total Posts</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Eye className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">
                {posts.filter((p) => p.isPublished).length}
              </p>
              <p className="text-sm text-green-100">Published</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Star className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">
                {posts.filter((p) => p.featured).length}
              </p>
              <p className="text-sm text-purple-100">Featured</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">
                {posts.reduce((acc, p) => acc + p.viewCount, 0)}
              </p>
              <p className="text-sm text-orange-100">Total Views</p>
            </div>
          </div>

          {/* Seed Section */}
          {seedStatus && (
            <div className="mb-8">
              <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    📁 Markdown Files Seeding
                  </h2>
                  <button
                    onClick={fetchSeedStatus}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <h3 className="mb-2 font-semibold text-blue-900">
                      Markdown Files
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {seedStatus.markdown.totalFiles}
                    </p>
                    <p className="text-sm text-blue-700">files found</p>
                  </div>

                  <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                    <h3 className="mb-2 font-semibold text-green-900">
                      Database Posts
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      {seedStatus.database.totalPosts}
                    </p>
                    <p className="text-sm text-green-700">posts in database</p>
                  </div>

                  <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                    <h3 className="mb-2 font-semibold text-purple-900">
                      Action Needed
                    </h3>
                    {seedStatus.needsSeeding ? (
                      <button
                        onClick={handleSeedPosts}
                        disabled={seeding}
                        className="w-full rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
                      >
                        {seeding ? (
                          <div className="flex items-center justify-center space-x-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Seeding...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <Upload className="h-4 w-4" />
                            <span>Seed Posts</span>
                          </div>
                        )}
                      </button>
                    ) : (
                      <p className="text-sm text-purple-700">
                        All files are synced
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="mb-8">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search posts..."
                      className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={fetchPosts}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Blog Posts</h2>
              <div className="text-sm text-gray-600">
                Showing {posts.length} posts
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="py-12 text-center">
                <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                <h3 className="mb-2 text-xl font-medium text-gray-900">
                  No blog posts found
                </h3>
                <p className="mb-4 text-gray-600">
                  {searchTerm ||
                  selectedCategory !== "all" ||
                  selectedStatus !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first blog post to get started"}
                </p>
                <Link
                  href="/admin/blog/new"
                  className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-600"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create New Post</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              {post.title}
                            </Link>
                          </h3>
                          {post.featured && (
                            <Star className="h-5 w-5 fill-current text-yellow-500" />
                          )}
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              post.isPublished
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {post.isPublished ? "Published" : "Draft"}
                          </span>
                        </div>

                        <p className="mb-3 line-clamp-2 text-gray-600">
                          {post.excerpt || post.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Tag className="h-4 w-4" />
                            <span>{post.category}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.viewCount} views</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {post.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {post.tags.slice(0, 5).map((tag, index) => (
                              <span
                                key={index}
                                className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                              >
                                #{tag}
                              </span>
                            ))}
                            {post.tags.length > 5 && (
                              <span className="text-xs text-gray-500">
                                +{post.tags.length - 5} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="ml-4 flex items-center space-x-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          title="View Post"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>

                        <Link
                          href={`/admin/blog/edit/${post.slug}`}
                          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-green-50 hover:text-green-600"
                          title="Edit Post"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={() => toggleFeatured(post)}
                          className={`rounded-lg p-2 transition-colors ${
                            post.featured
                              ? "text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
                              : "text-gray-600 hover:bg-yellow-50 hover:text-yellow-600"
                          }`}
                          title={
                            post.featured
                              ? "Remove from featured"
                              : "Add to featured"
                          }
                        >
                          {post.featured ? (
                            <Star className="h-4 w-4 fill-current" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </button>

                        <button
                          onClick={() => togglePublished(post)}
                          className={`rounded-lg p-2 transition-colors ${
                            post.isPublished
                              ? "text-green-600 hover:bg-green-50 hover:text-green-700"
                              : "text-gray-600 hover:bg-green-50 hover:text-green-600"
                          }`}
                          title={post.isPublished ? "Unpublish" : "Publish"}
                        >
                          {post.isPublished ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>

                        <button
                          onClick={() => deletePost(post)}
                          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete Post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
