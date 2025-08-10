"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Code,
  Save,
  ArrowLeft,
  Eye,
  Tag,
  Clock,
  Zap,
  Hash,
  FileText,
  Globe,
  Image,
  Calendar,
  AlertCircle,
  Loader,
} from "lucide-react";
import Link from "next/link";

interface PythonTipCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon?: string;
  isActive: boolean;
}

interface PythonTip {
  id: string;
  title: string;
  content: string;
  codeExample?: string;
  difficulty: string;
  categoryId: string;
  xpReward: number;
  tags: string[];
  estimatedMinutes: number;
  slug?: string;
  metaDescription?: string;
  metaKeywords?: string;
  socialImageUrl?: string;
  isActive: boolean;
  publishDate?: string;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
    icon?: string;
  };
}

export default function EditPythonTip() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [tip, setTip] = useState<PythonTip | null>(null);
  const [categories, setCategories] = useState<PythonTipCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    codeExample: "",
    difficulty: "beginner",
    categoryId: "",
    xpReward: 10,
    tags: [] as string[],
    estimatedMinutes: 2,
    slug: "",
    metaDescription: "",
    metaKeywords: "",
    socialImageUrl: "",
    isActive: true,
    publishDate: new Date().toISOString().split("T")[0],
  });
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchTip();
      fetchCategories();
    }
  }, [id]);

  const fetchTip = async () => {
    try {
      const response = await fetch(`/api/admin/python-tips/${id}`);
      const data = await response.json();

      if (response.ok) {
        setTip(data);
        setFormData({
          title: data.title,
          content: data.content,
          codeExample: data.codeExample || "",
          difficulty: data.difficulty,
          categoryId: data.categoryId,
          xpReward: data.xpReward,
          tags: data.tags || [],
          estimatedMinutes: data.estimatedMinutes,
          slug: data.slug || "",
          metaDescription: data.metaDescription || "",
          metaKeywords: data.metaKeywords || "",
          socialImageUrl: data.socialImageUrl || "",
          isActive: data.isActive,
          publishDate: data.publishDate
            ? new Date(data.publishDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        });
      } else {
        alert("Failed to fetch Python tip");
        router.push("/admin/python-tips");
      }
    } catch (error) {
      console.error("Error fetching tip:", error);
      alert("Failed to fetch Python tip");
      router.push("/admin/python-tips");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/python-tips/categories");
      const data = await response.json();

      if (response.ok) {
        setCategories(
          data.categories.filter((cat: PythonTipCategory) => cat.isActive)
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug:
        prev.slug === generateSlug(tip?.title || "")
          ? generateSlug(title)
          : prev.slug,
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    if (formData.xpReward < 1 || formData.xpReward > 100) {
      newErrors.xpReward = "XP reward must be between 1 and 100";
    }

    if (formData.estimatedMinutes < 1 || formData.estimatedMinutes > 60) {
      newErrors.estimatedMinutes = "Estimated minutes must be between 1 and 60";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/admin/python-tips/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Python tip updated successfully!");
        router.push("/admin/python-tips");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating tip:", error);
      alert("Failed to update Python tip");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="text-center">
          <Loader className="mx-auto h-12 w-12 animate-spin text-yellow-600" />
          <p className="mt-4 text-lg font-medium text-gray-600">
            Loading Python tip...
          </p>
        </div>
      </div>
    );
  }

  if (!tip) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
          <p className="mt-4 text-lg font-medium text-gray-600">
            Python tip not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="relative z-10 py-6 lg:py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link
                    href="/admin/python-tips"
                    className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 shadow-lg">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="bg-gradient-to-r from-gray-900 via-yellow-800 to-orange-800 bg-clip-text text-2xl font-bold text-transparent lg:text-3xl">
                      Edit Python Tip
                    </h1>
                    <p className="text-gray-600">
                      Update your Python knowledge content
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  📝 Basic Information
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className={`w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-yellow-500 ${
                        errors.title ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Enter a descriptive title for your Python tip"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Content *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      rows={8}
                      className={`w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-yellow-500 ${
                        errors.content ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Write your Python tip content here. Explain the concept clearly and provide practical examples."
                    />
                    {errors.content && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.content}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Code Example
                    </label>
                    <textarea
                      value={formData.codeExample}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          codeExample: e.target.value,
                        }))
                      }
                      rows={6}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-yellow-500"
                      placeholder="# Add your Python code example here
def example_function():
    return 'Hello, Python!'"
                    />
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  ⚙️ Settings
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Category *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          categoryId: e.target.value,
                        }))
                      }
                      className={`w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-yellow-500 ${
                        errors.categoryId ? "border-red-300" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.categoryId}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Difficulty Level
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          difficulty: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      XP Reward
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.xpReward}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          xpReward: parseInt(e.target.value) || 10,
                        }))
                      }
                      className={`w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-yellow-500 ${
                        errors.xpReward ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {errors.xpReward && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.xpReward}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Estimated Minutes
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={formData.estimatedMinutes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          estimatedMinutes: parseInt(e.target.value) || 2,
                        }))
                      }
                      className={`w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-yellow-500 ${
                        errors.estimatedMinutes
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.estimatedMinutes && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.estimatedMinutes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-yellow-500"
                        placeholder="Add a tag and press Enter"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="rounded-lg bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
                      >
                        Add
                      </button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-2 text-yellow-600 hover:text-yellow-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SEO & Publishing */}
              <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  🚀 SEO & Publishing
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          slug: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-yellow-500"
                      placeholder="url-friendly-slug"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          metaDescription: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-yellow-500"
                      placeholder="Brief description for search engines"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Publish Date
                      </label>
                      <input
                        type="date"
                        value={formData.publishDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            publishDate: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isActive: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <label
                        htmlFor="isActive"
                        className="text-sm font-medium text-gray-700"
                      >
                        Active (visible to users)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
                <Link
                  href="/admin/python-tips"
                  className="inline-flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Cancel</span>
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-3 font-semibold text-white transition-all hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Update Python Tip</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
