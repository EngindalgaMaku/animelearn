"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Eye,
  FileText,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  content: string;
  category: string;
  tags: string[];
  featured: boolean;
  readTime: string;
  estimatedMinutes: number;
  author: string;
  seoKeywords?: string;
  metaDescription?: string;
  socialImageUrl?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    excerpt: "",
    content: "",
    category: "",
    tags: [] as string[],
    featured: false,
    readTime: "",
    estimatedMinutes: 0,
    author: "",
    seoKeywords: "",
    metaDescription: "",
    socialImageUrl: "",
    isPublished: false,
  });

  // Load blog post
  useEffect(() => {
    if (!slug) return;

    const loadPost = async () => {
      try {
        const response = await fetch(`/api/admin/blog/${slug}`);
        if (response.ok) {
          const blogPost = await response.json();
          setPost(blogPost);
          setFormData({
            title: blogPost.title || "",
            slug: blogPost.slug || "",
            description: blogPost.description || "",
            excerpt: blogPost.excerpt || "",
            content: blogPost.content || "",
            category: blogPost.category || "",
            tags: blogPost.tags || [],
            featured: blogPost.featured || false,
            readTime: blogPost.readTime || "",
            estimatedMinutes: blogPost.estimatedMinutes || 0,
            author: blogPost.author || "",
            seoKeywords: blogPost.seoKeywords || "",
            metaDescription: blogPost.metaDescription || "",
            socialImageUrl: blogPost.socialImageUrl || "",
            isPublished: blogPost.isPublished || false,
          });
        } else {
          console.error("Failed to load blog post");
          router.push("/admin/blog");
        }
      } catch (error) {
        console.error("Error loading blog post:", error);
        router.push("/admin/blog");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug, router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
  };

  // ReactQuill modules and formats
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["code-block"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "link",
    "image",
    "code-block",
    "align",
  ];

  // Handle image upload for social image
  const handleImageUpload = async (file: File): Promise<string | null> => {
    setUploadingImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    try {
      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formDataUpload,
      });

      if (response.ok) {
        const { url } = await response.json();
        return url;
      } else {
        alert("Failed to upload image");
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSocialImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      const url = await handleImageUpload(file);
      if (url) {
        setFormData((prev) => ({ ...prev, socialImageUrl: url }));
      }
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, socialImageUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/blog/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/blog");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to save blog post"}`);
      }
    } catch (error) {
      console.error("Error saving blog post:", error);
      alert("Error saving blog post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Blog Post Not Found
          </h1>
          <p className="mb-4 text-gray-600">
            The blog post you're looking for doesn't exist.
          </p>
          <Link
            href="/admin/blog"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link
                href="/admin/blog"
                className="mr-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Blog Posts
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Blog Post
              </h1>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Link>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Info */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-medium text-gray-900">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Blog post title"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="blog-post-slug"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Brief description"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Excerpt
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Post excerpt for previews"
                  />
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Content</h2>
                <div className="text-xs text-gray-500">
                  Visual WYSIWYG editor - formats text visually as you type
                </div>
              </div>

              <div className="min-h-[400px]">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, content }))
                  }
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Start writing your blog content..."
                  style={{ height: "300px" }}
                />
              </div>

              <div className="mt-16 text-xs text-gray-500">
                Use the toolbar above to format your text. Content is saved as
                HTML and renders visually.
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Publish Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Published
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Featured Post
                  </label>
                </div>
              </div>
            </div>

            {/* Category & Tags */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Category & Tags
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Python Basics">Python Basics</option>
                    <option value="Python Applications">
                      Python Applications
                    </option>
                    <option value="Data Analysis">Data Analysis</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Career">Career & Tips</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(", ")}
                    onChange={handleTagsChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="python, web development, tutorial"
                  />
                </div>
              </div>
            </div>

            {/* Author & Reading Time */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Author & Reading Time
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="5 min"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Estimated Minutes
                  </label>
                  <input
                    type="number"
                    name="estimatedMinutes"
                    value={formData.estimatedMinutes}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="5"
                  />
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                SEO Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    SEO Keywords
                  </label>
                  <input
                    type="text"
                    name="seoKeywords"
                    value={formData.seoKeywords}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="python, tutorial, programming"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Meta Description
                  </label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Meta description for search engines"
                  />
                </div>

                {/* Social Image Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Social Image
                  </label>

                  {formData.socialImageUrl ? (
                    <div className="relative">
                      <img
                        src={formData.socialImageUrl}
                        alt="Social preview"
                        className="h-32 w-full rounded-lg border border-gray-300 object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-6">
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {uploadingImage ? "Uploading..." : "Upload Image"}
                          </button>
                          <p className="mt-2 text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSocialImageSelect}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
