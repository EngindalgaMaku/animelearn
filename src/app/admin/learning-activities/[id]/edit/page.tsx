"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  Target,
  Diamond,
  Star,
  Clock,
  Hash,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import VisualActivityEditor from "@/components/admin/learning-activities/visual-editors/VisualActivityEditor";

interface ActivityContent {
  [key: string]: any;
}

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  activityType: string;
  difficulty: number;
  category: string;
  sortOrder: number;
  isLocked: boolean;
  diamondReward: number;
  experienceReward: number;
  estimatedMinutes: number;
  isActive: boolean;
  tags: string[];
  content: ActivityContent;
  settings: any;
  createdAt: string;
  updatedAt: string;
}

const activityTypeConfig = {
  algorithm_visualization: {
    name: "Algorithm Visualization",
    icon: "🔄",
    color: "from-purple-500 to-violet-600",
    description: "Step-by-step algorithm learning with visual components",
  },
  matching: {
    name: "Matching",
    icon: "🔗",
    color: "from-blue-500 to-cyan-600",
    description: "Connect concepts and build associations",
  },
  data_exploration: {
    name: "Data Explorer",
    icon: "🔍",
    color: "from-green-500 to-emerald-600",
    description: "Interactive data analysis activities",
  },
  interactive_demo: {
    name: "Interactive Demo",
    icon: "🎪",
    color: "from-orange-500 to-red-600",
    description: "Guided tutorials and interactive demonstrations",
  },
  drag_drop: {
    name: "Drag & Drop",
    icon: "🎯",
    color: "from-indigo-500 to-blue-600",
    description: "Visual code organization challenges",
  },
  fill_blanks: {
    name: "Fill Blanks",
    icon: "✏️",
    color: "from-yellow-500 to-orange-600",
    description: "Complete code with missing parts",
  },
  interactive_coding: {
    name: "Code Lab",
    icon: "💻",
    color: "from-cyan-500 to-blue-600",
    description: "Full hands-on coding experience",
  },
  code_builder: {
    name: "Code Builder",
    icon: "🏗️",
    color: "from-teal-500 to-green-600",
    description: "Build complete programs step by step",
  },
  class_builder: {
    name: "Class Builder",
    icon: "🏛️",
    color: "from-purple-500 to-pink-600",
    description: "Object-oriented programming challenges",
  },
  memory_game: {
    name: "Memory Game",
    icon: "🧠",
    color: "from-pink-500 to-rose-600",
    description: "Pattern recognition and memory challenges",
  },
  quiz: {
    name: "Quiz",
    icon: "❓",
    color: "from-emerald-500 to-teal-600",
    description: "Knowledge assessment with multiple choice",
  },
};

const topicOptions = [
  {
    value: "Python Fundamentals",
    label: "🐍 Python Fundamentals",
    description: "Basic Python concepts and syntax",
  },
  {
    value: "Data Structures",
    label: "📊 Data Structures",
    description: "Lists, dictionaries, and data manipulation",
  },
  {
    value: "Algorithms",
    label: "🧮 Algorithms",
    description: "Sorting, searching, and algorithmic thinking",
  },
  {
    value: "Functions & OOP",
    label: "🏗️ Functions & OOP",
    description: "Functions, classes, and object-oriented programming",
  },
];

const difficultyOptions = [
  { value: 1, label: "🌱 Beginner", color: "emerald" },
  { value: 2, label: "📚 Basic", color: "blue" },
  { value: 3, label: "⚡ Intermediate", color: "amber" },
  { value: 4, label: "🚀 Advanced", color: "purple" },
  { value: 5, label: "👑 Expert", color: "red" },
];

export default function EditLearningActivity({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const user = session?.user;
  const router = useRouter();
  const [activityId, setActivityId] = useState<string>("");
  const [activity, setActivity] = useState<LearningActivity | null>(null);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    activityType: "",
    category: "",
    difficulty: 1,
    diamondReward: 10,
    experienceReward: 25,
    estimatedMinutes: 5,
    sortOrder: 1,
    isActive: true,
    tags: [] as string[],
    content: {} as ActivityContent,
    settings: {} as any,
  });

  const [newTag, setNewTag] = useState("");
  const [contentJson, setContentJson] = useState("");
  const [useVisualEditor, setUseVisualEditor] = useState(true);

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setActivityId(resolvedParams.id);
    }
    getParams();
  }, [params]);

  useEffect(() => {
    if (activityId) {
      loadActivity();
    }
  }, [activityId]);

  const loadActivity = async () => {
    try {
      setLoadingActivity(true);
      const response = await fetch(
        `/api/admin/learning-activities/${activityId}`
      );

      if (response.ok) {
        const data = await response.json();
        const activityData = data.activity;

        setActivity(activityData);
        setFormData({
          title: activityData.title,
          description: activityData.description || "",
          activityType: activityData.activityType,
          category: activityData.category,
          difficulty: activityData.difficulty,
          diamondReward: activityData.diamondReward,
          experienceReward: activityData.experienceReward,
          estimatedMinutes: activityData.estimatedMinutes,
          sortOrder: activityData.sortOrder,
          isActive: activityData.isActive,
          tags: activityData.tags || [],
          content: activityData.content || {},
          settings: activityData.settings || {},
        });
        setContentJson(JSON.stringify(activityData.content || {}, null, 2));
      } else {
        alert("Failed to load activity");
        router.push("/admin/learning-activities");
      }
    } catch (error) {
      console.error("Error loading activity:", error);
      alert("Failed to load activity");
      router.push("/admin/learning-activities");
    } finally {
      setLoadingActivity(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleContentChange = (value: string) => {
    setContentJson(value);
    try {
      const parsed = JSON.parse(value);
      setFormData((prev) => ({
        ...prev,
        content: parsed,
      }));
    } catch (error) {
      // Invalid JSON, keep the string but don't update content
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.activityType || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate JSON content
    try {
      if (contentJson.trim()) {
        JSON.parse(contentJson);
      }
    } catch (error) {
      alert("Invalid JSON in content field. Please fix the JSON syntax.");
      return;
    }

    setSaving(true);
    try {
      // Parse content JSON before sending
      const contentData = contentJson.trim() ? JSON.parse(contentJson) : {};

      const submitData = {
        ...formData,
        content: contentData,
      };

      const response = await fetch(
        `/api/admin/learning-activities/${activityId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert("Activity updated successfully!");
        router.push("/admin/learning-activities");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to update activity"}`);
      }
    } catch (error) {
      console.error("Error updating activity:", error);
      alert("Failed to update activity. Please check your input.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this activity? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/learning-activities/${activityId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Activity deleted successfully!");
        router.push("/admin/learning-activities");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to delete activity"}`);
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      alert("Failed to delete activity");
    } finally {
      setDeleting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 text-gray-600">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (loadingActivity) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-16 w-16 animate-spin text-blue-600" />
          <p className="mt-4 text-lg text-gray-600">Loading activity...</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Activity Not Found
          </h1>
          <p className="mt-2 text-gray-600">
            The requested activity could not be found.
          </p>
          <Link
            href="/admin/learning-activities"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Activities
          </Link>
        </div>
      </div>
    );
  }

  const selectedTypeConfig = formData.activityType
    ? activityTypeConfig[
        formData.activityType as keyof typeof activityTypeConfig
      ]
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="py-6 lg:py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm lg:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link
                    href="/admin/learning-activities"
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </Link>
                  <div>
                    <h1 className="bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                      ✏️ Edit Activity
                    </h1>
                    <p className="text-gray-600">
                      Modify learning activity settings and content
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center space-x-2 rounded-xl bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    {showPreview ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                    <span>{showPreview ? "Hide" : "Show"} Preview</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center space-x-2 rounded-xl bg-red-100 px-4 py-2 text-red-700 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deleting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                    <span>{deleting ? "Deleting..." : "Delete"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                📋 Basic Information
              </h2>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g., Python Variables & Data Types"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Topic/Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">Select a topic...</option>
                    {topicOptions.map((topic) => (
                      <option key={topic.value} value={topic.value}>
                        {topic.label}
                      </option>
                    ))}
                  </select>
                  {formData.category && (
                    <p className="mt-1 text-sm text-gray-600">
                      {
                        topicOptions.find((t) => t.value === formData.category)
                          ?.description
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Describe what students will learn..."
                />
              </div>
            </div>

            {/* Activity Type Selection */}
            <div className="rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                🎮 Activity Type
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(activityTypeConfig).map(([key, config]) => (
                  <div
                    key={key}
                    onClick={() => handleInputChange("activityType", key)}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      formData.activityType === key
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r ${config.color} text-white`}
                      >
                        <span className="text-lg">{config.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {config.name}
                        </h3>
                        <p className="line-clamp-2 text-sm text-gray-600">
                          {config.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedTypeConfig && (
                <div className="mt-6 rounded-lg bg-indigo-50 p-4">
                  <div className="mb-2 flex items-center space-x-2">
                    <Info className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-semibold text-indigo-900">
                      Selected: {selectedTypeConfig.name}
                    </h3>
                  </div>
                  <p className="text-indigo-800">
                    {selectedTypeConfig.description}
                  </p>
                </div>
              )}
            </div>

            {/* Configuration */}
            <div className="rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                ⚙️ Configuration
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    <Hash className="mr-1 inline h-4 w-4" />
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      handleInputChange("sortOrder", parseInt(e.target.value))
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      handleInputChange("difficulty", parseInt(e.target.value))
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {difficultyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    <Clock className="mr-1 inline h-4 w-4" />
                    Estimated Minutes
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.estimatedMinutes}
                    onChange={(e) =>
                      handleInputChange(
                        "estimatedMinutes",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    <Diamond className="mr-1 inline h-4 w-4" />
                    Diamond Reward
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.diamondReward}
                    onChange={(e) =>
                      handleInputChange(
                        "diamondReward",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    <Star className="mr-1 inline h-4 w-4" />
                    XP Reward
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={formData.experienceReward}
                    onChange={(e) =>
                      handleInputChange(
                        "experienceReward",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Status
                  </label>
                  <select
                    value={formData.isActive.toString()}
                    onChange={(e) =>
                      handleInputChange("isActive", e.target.value === "true")
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="true">🟢 Active</option>
                    <option value="false">🔴 Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-bold text-gray-900">🏷️ Tags</h2>

              <div className="mb-4 flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center space-x-1 rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-indigo-500 hover:text-indigo-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="rounded-lg bg-indigo-100 px-4 py-2 text-indigo-700 transition-colors hover:bg-indigo-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content Configuration */}
            <div className="rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  📝 Activity Content
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Editor Mode:</span>
                  <button
                    onClick={() => setUseVisualEditor(!useVisualEditor)}
                    className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                      useVisualEditor
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {useVisualEditor ? "Visual" : "JSON"}
                  </button>
                </div>
              </div>

              {useVisualEditor && formData.activityType ? (
                <VisualActivityEditor
                  activityType={formData.activityType}
                  initialContent={formData.content}
                  onChange={(content) => {
                    setFormData((prev) => ({ ...prev, content }));
                  }}
                  onJsonChange={(json) => setContentJson(json)}
                />
              ) : (
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Content JSON
                  </label>
                  <textarea
                    value={contentJson}
                    onChange={(e) => handleContentChange(e.target.value)}
                    rows={12}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 font-mono text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="Activity content in JSON format..."
                  />
                  <p className="text-sm text-gray-600">
                    💡 Tip: The content structure varies by activity type.
                    Switch to Visual mode for a user-friendly editor, or edit
                    the JSON directly.
                  </p>
                </div>
              )}
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  👁️ Preview
                </h2>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-4 flex items-center space-x-3">
                    {selectedTypeConfig && (
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${selectedTypeConfig.color} text-white`}
                      >
                        <span className="text-xl">
                          {selectedTypeConfig.icon}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {formData.title || "Untitled Activity"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formData.category} • {selectedTypeConfig?.name}
                      </p>
                    </div>
                  </div>

                  {formData.description && (
                    <p className="mb-4 text-gray-700">{formData.description}</p>
                  )}

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-yellow-600">
                        {formData.diamondReward} 💎
                      </div>
                      <div className="text-gray-500">Diamonds</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-purple-600">
                        {formData.experienceReward} XP
                      </div>
                      <div className="text-gray-500">Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">
                        {formData.estimatedMinutes}m
                      </div>
                      <div className="text-gray-500">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">
                        #{formData.sortOrder}
                      </div>
                      <div className="text-gray-500">Order</div>
                    </div>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/learning-activities"
                className="rounded-xl bg-gray-100 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                <span>{saving ? "Updating..." : "Update Activity"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
