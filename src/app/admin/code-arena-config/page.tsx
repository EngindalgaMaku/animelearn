"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff,
  Gamepad2,
  Palette,
  Type,
  Layout,
  Target,
  Sparkles,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  Copy,
  Download,
  Upload,
  Check,
  AlertCircle,
  Wand2,
  Rocket,
  Crown,
  Star,
} from "lucide-react";

interface DifficultyConfig {
  id?: string;
  level: number;
  label: string;
  color: string;
  icon: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  sortOrder: number;
  isActive: boolean;
}

interface CategoryConfig {
  id?: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  bgGradient: string;
  iconBg: string;
  sortOrder: number;
  isActive: boolean;
}

interface ActivityTypeConfig {
  id?: string;
  type: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}

interface UIConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  headerGradient: string;
  customCSS?: string;
  showStats: boolean;
  showFilters: boolean;
  enableAnimations: boolean;
}

interface ArenaConfiguration {
  id?: string;
  name: string;
  description?: string;
  isActive: boolean;
  isDefault: boolean;
  difficultyConfigs: DifficultyConfig[];
  categoryConfigs: CategoryConfig[];
  activityTypeConfigs: ActivityTypeConfig[];
  uiConfig: UIConfig;
}

const defaultDifficulties: DifficultyConfig[] = [
  {
    level: 1,
    label: "Beginner",
    color: "from-emerald-400 to-emerald-600",
    icon: "🌱",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    sortOrder: 1,
    isActive: true,
  },
  {
    level: 2,
    label: "Basic",
    color: "from-blue-400 to-blue-600",
    icon: "📚",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    sortOrder: 2,
    isActive: true,
  },
  {
    level: 3,
    label: "Intermediate",
    color: "from-amber-400 to-amber-600",
    icon: "⚡",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    sortOrder: 3,
    isActive: true,
  },
  {
    level: 4,
    label: "Advanced",
    color: "from-purple-400 to-purple-600",
    icon: "🚀",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    sortOrder: 4,
    isActive: true,
  },
  {
    level: 5,
    label: "Expert",
    color: "from-red-400 to-red-600",
    icon: "👑",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
    sortOrder: 5,
    isActive: true,
  },
];

const defaultCategories: CategoryConfig[] = [
  {
    key: "Python Basics",
    title: "Python Fundamentals",
    description: "Master the building blocks of Python programming",
    icon: "🐍",
    gradient: "from-green-500 to-emerald-600",
    bgGradient: "from-green-50 to-emerald-50",
    iconBg: "bg-green-500",
    sortOrder: 1,
    isActive: true,
  },
  {
    key: "Data Structures",
    title: "Data Structures",
    description: "Learn essential data organization techniques",
    icon: "📊",
    gradient: "from-blue-500 to-cyan-600",
    bgGradient: "from-blue-50 to-cyan-50",
    iconBg: "bg-blue-500",
    sortOrder: 2,
    isActive: true,
  },
  {
    key: "Algorithms",
    title: "Algorithms",
    description: "Solve problems with efficient algorithms",
    icon: "🧮",
    gradient: "from-purple-500 to-violet-600",
    bgGradient: "from-purple-50 to-violet-50",
    iconBg: "bg-purple-500",
    sortOrder: 3,
    isActive: true,
  },
];

const defaultActivityTypes: ActivityTypeConfig[] = [
  {
    type: "drag_drop",
    name: "Drag & Drop",
    icon: "🎯",
    color: "text-blue-600",
    description: "Interactive drag and drop exercises",
    sortOrder: 1,
    isActive: true,
  },
  {
    type: "memory_game",
    name: "Memory Game",
    icon: "🧠",
    color: "text-purple-600",
    description: "Memory and pattern recognition games",
    sortOrder: 2,
    isActive: true,
  },
  {
    type: "quiz",
    name: "Quiz",
    icon: "❓",
    color: "text-green-600",
    description: "Interactive quiz questions",
    sortOrder: 3,
    isActive: true,
  },
  {
    type: "fill_blanks",
    name: "Fill Blanks",
    icon: "✏️",
    color: "text-orange-600",
    description: "Fill in the missing code or text",
    sortOrder: 4,
    isActive: true,
  },
];

const defaultUIConfig: UIConfig = {
  heroTitle: "Master Programming",
  heroSubtitle: "Through Epic Learning",
  heroDescription:
    "🎯 Embark on an epic coding adventure with interactive challenges, unlock achievements, and build world-class programming skills!",
  primaryColor: "#6366f1",
  secondaryColor: "#ec4899",
  accentColor: "#06b6d4",
  backgroundColor: "from-indigo-50 via-white to-cyan-50",
  headerGradient: "from-indigo-600 via-purple-600 to-pink-600",
  showStats: true,
  showFilters: true,
  enableAnimations: true,
};

export default function CodeArenaConfigPage() {
  const [configurations, setConfigurations] = useState<ArenaConfiguration[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [editingConfig, setEditingConfig] = useState<ArenaConfiguration | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "difficulties" | "categories" | "activities" | "ui"
  >("difficulties");
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/arena-config");
      if (response.ok) {
        const data = await response.json();
        setConfigurations(data.configurations || []);
      }
    } catch (error) {
      console.error("Failed to fetch configurations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    const newConfig: ArenaConfiguration = {
      name: "New Configuration",
      description: "Custom arena configuration",
      isActive: false,
      isDefault: false,
      difficultyConfigs: defaultDifficulties,
      categoryConfigs: defaultCategories,
      activityTypeConfigs: defaultActivityTypes,
      uiConfig: defaultUIConfig,
    };
    setEditingConfig(newConfig);
    setIsCreating(true);
    setShowModal(true);
  };

  const handleEdit = (config: ArenaConfiguration) => {
    setEditingConfig({ ...config });
    setIsCreating(false);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingConfig) return;

    try {
      setSaveStatus("saving");
      const url = isCreating
        ? "/api/admin/arena-config"
        : `/api/admin/arena-config/${editingConfig.id}`;
      const method = isCreating ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingConfig),
      });

      if (response.ok) {
        setSaveStatus("saved");
        await fetchConfigurations();
        setTimeout(() => {
          setShowModal(false);
          setSaveStatus("idle");
        }, 1000);
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Save error:", error);
      setSaveStatus("error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this configuration?")) return;

    try {
      const response = await fetch(`/api/admin/arena-config/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchConfigurations();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/arena-config/${id}/activate`, {
        method: "POST",
      });

      if (response.ok) {
        await fetchConfigurations();
      }
    } catch (error) {
      console.error("Activate error:", error);
    }
  };

  const renderConfigurationCard = (config: ArenaConfiguration) => (
    <div
      key={config.id}
      className={`rounded-xl border-2 p-6 transition-all ${
        config.isActive
          ? "border-green-300 bg-green-50 shadow-lg"
          : config.isDefault
            ? "border-blue-300 bg-blue-50 shadow-md"
            : "border-gray-200 bg-white shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-bold text-gray-900">{config.name}</h3>
            {config.isActive && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                <Eye className="mr-1 inline h-4 w-4" />
                Active
              </span>
            )}
            {config.isDefault && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                <Star className="mr-1 inline h-4 w-4" />
                Default
              </span>
            )}
          </div>
          {config.description && (
            <p className="mt-2 text-gray-600">{config.description}</p>
          )}
          <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
            <span>{config.difficultyConfigs.length} Difficulties</span>
            <span>{config.categoryConfigs.length} Categories</span>
            <span>{config.activityTypeConfigs.length} Activity Types</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(config)}
            className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
          >
            <Edit className="h-4 w-4" />
          </button>
          {!config.isActive && (
            <button
              onClick={() => handleActivate(config.id!)}
              className="rounded-lg bg-green-600 px-3 py-2 text-white hover:bg-green-700"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          {!config.isDefault && (
            <button
              onClick={() => handleDelete(config.id!)}
              className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal || !editingConfig) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isCreating ? "Create New Configuration" : "Edit Configuration"}
              </h2>
              <p className="text-gray-600">
                Customize the appearance and behavior of your code arena
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {saveStatus === "saving" && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              )}
              {saveStatus === "saved" && (
                <div className="flex items-center space-x-2 text-green-600">
                  <Check className="h-4 w-4" />
                  <span>Saved!</span>
                </div>
              )}
              {saveStatus === "error" && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>Error saving</span>
                </div>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex max-h-[calc(90vh-120px)]">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("difficulties")}
                  className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    activeTab === "difficulties"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Target className="h-5 w-5" />
                  <span>Difficulties</span>
                </button>
                <button
                  onClick={() => setActiveTab("categories")}
                  className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    activeTab === "categories"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Layout className="h-5 w-5" />
                  <span>Categories</span>
                </button>
                <button
                  onClick={() => setActiveTab("activities")}
                  className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    activeTab === "activities"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Gamepad2 className="h-5 w-5" />
                  <span>Activity Types</span>
                </button>
                <button
                  onClick={() => setActiveTab("ui")}
                  className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    activeTab === "ui"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Palette className="h-5 w-5" />
                  <span>UI & Styling</span>
                </button>
              </div>

              {/* Preview Mode Selector */}
              <div className="mt-6">
                <h4 className="mb-2 text-sm font-medium text-gray-700">
                  Preview Mode
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setPreviewMode("desktop")}
                    className={`flex w-full items-center space-x-2 rounded px-2 py-1 text-sm ${
                      previewMode === "desktop"
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <Monitor className="h-4 w-4" />
                    <span>Desktop</span>
                  </button>
                  <button
                    onClick={() => setPreviewMode("tablet")}
                    className={`flex w-full items-center space-x-2 rounded px-2 py-1 text-sm ${
                      previewMode === "tablet"
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <Tablet className="h-4 w-4" />
                    <span>Tablet</span>
                  </button>
                  <button
                    onClick={() => setPreviewMode("mobile")}
                    className={`flex w-full items-center space-x-2 rounded px-2 py-1 text-sm ${
                      previewMode === "mobile"
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <Smartphone className="h-4 w-4" />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Basic Info */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Configuration Name
                    </label>
                    <input
                      type="text"
                      value={editingConfig.name}
                      onChange={(e) =>
                        setEditingConfig({
                          ...editingConfig,
                          name: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <input
                      type="text"
                      value={editingConfig.description || ""}
                      onChange={(e) =>
                        setEditingConfig({
                          ...editingConfig,
                          description: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === "difficulties" && (
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Difficulty Levels
                  </h3>
                  <div className="space-y-4">
                    {editingConfig.difficultyConfigs.map(
                      (difficulty, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-gray-200 p-4"
                        >
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">
                                Label
                              </label>
                              <input
                                type="text"
                                value={difficulty.label}
                                onChange={(e) => {
                                  const updated = [
                                    ...editingConfig.difficultyConfigs,
                                  ];
                                  updated[index] = {
                                    ...difficulty,
                                    label: e.target.value,
                                  };
                                  setEditingConfig({
                                    ...editingConfig,
                                    difficultyConfigs: updated,
                                  });
                                }}
                                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">
                                Icon
                              </label>
                              <input
                                type="text"
                                value={difficulty.icon}
                                onChange={(e) => {
                                  const updated = [
                                    ...editingConfig.difficultyConfigs,
                                  ];
                                  updated[index] = {
                                    ...difficulty,
                                    icon: e.target.value,
                                  };
                                  setEditingConfig({
                                    ...editingConfig,
                                    difficultyConfigs: updated,
                                  });
                                }}
                                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">
                                Level
                              </label>
                              <input
                                type="number"
                                value={difficulty.level}
                                onChange={(e) => {
                                  const updated = [
                                    ...editingConfig.difficultyConfigs,
                                  ];
                                  updated[index] = {
                                    ...difficulty,
                                    level: parseInt(e.target.value),
                                  };
                                  setEditingConfig({
                                    ...editingConfig,
                                    difficultyConfigs: updated,
                                  });
                                }}
                                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {activeTab === "ui" && (
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    UI Configuration
                  </h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Hero Title
                        </label>
                        <input
                          type="text"
                          value={editingConfig.uiConfig.heroTitle}
                          onChange={(e) =>
                            setEditingConfig({
                              ...editingConfig,
                              uiConfig: {
                                ...editingConfig.uiConfig,
                                heroTitle: e.target.value,
                              },
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Hero Subtitle
                        </label>
                        <input
                          type="text"
                          value={editingConfig.uiConfig.heroSubtitle}
                          onChange={(e) =>
                            setEditingConfig({
                              ...editingConfig,
                              uiConfig: {
                                ...editingConfig.uiConfig,
                                heroSubtitle: e.target.value,
                              },
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Hero Description
                      </label>
                      <textarea
                        value={editingConfig.uiConfig.heroDescription}
                        onChange={(e) =>
                          setEditingConfig({
                            ...editingConfig,
                            uiConfig: {
                              ...editingConfig.uiConfig,
                              heroDescription: e.target.value,
                            },
                          })
                        }
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Primary Color
                        </label>
                        <input
                          type="color"
                          value={editingConfig.uiConfig.primaryColor}
                          onChange={(e) =>
                            setEditingConfig({
                              ...editingConfig,
                              uiConfig: {
                                ...editingConfig.uiConfig,
                                primaryColor: e.target.value,
                              },
                            })
                          }
                          className="h-10 w-full rounded-lg border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Secondary Color
                        </label>
                        <input
                          type="color"
                          value={editingConfig.uiConfig.secondaryColor}
                          onChange={(e) =>
                            setEditingConfig({
                              ...editingConfig,
                              uiConfig: {
                                ...editingConfig.uiConfig,
                                secondaryColor: e.target.value,
                              },
                            })
                          }
                          className="h-10 w-full rounded-lg border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Accent Color
                        </label>
                        <input
                          type="color"
                          value={editingConfig.uiConfig.accentColor}
                          onChange={(e) =>
                            setEditingConfig({
                              ...editingConfig,
                              uiConfig: {
                                ...editingConfig.uiConfig,
                                accentColor: e.target.value,
                              },
                            })
                          }
                          className="h-10 w-full rounded-lg border border-gray-300"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editingConfig.uiConfig.showStats}
                          onChange={(e) =>
                            setEditingConfig({
                              ...editingConfig,
                              uiConfig: {
                                ...editingConfig.uiConfig,
                                showStats: e.target.checked,
                              },
                            })
                          }
                          className="rounded"
                        />
                        <span>Show Statistics</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editingConfig.uiConfig.showFilters}
                          onChange={(e) =>
                            setEditingConfig({
                              ...editingConfig,
                              uiConfig: {
                                ...editingConfig.uiConfig,
                                showFilters: e.target.checked,
                              },
                            })
                          }
                          className="rounded"
                        />
                        <span>Show Filters</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editingConfig.uiConfig.enableAnimations}
                          onChange={(e) =>
                            setEditingConfig({
                              ...editingConfig,
                              uiConfig: {
                                ...editingConfig.uiConfig,
                                enableAnimations: e.target.checked,
                              },
                            })
                          }
                          className="rounded"
                        />
                        <span>Enable Animations</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between border-t border-gray-200 p-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={saveStatus === "saving"}
                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>
                  {saveStatus === "saving" ? "Saving..." : "Save Configuration"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-lg text-gray-600">
            Loading configurations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="flex items-center space-x-3 text-4xl font-bold text-gray-900">
                <div className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-3">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <span>Code Arena Configuration</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Manager
                </span>
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Configure the appearance and behavior of your code arena
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCreateNew}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Create Configuration</span>
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Configurations List */}
        <div className="space-y-6">
          {configurations.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
                <Settings className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-medium text-gray-900">
                No Configurations Found
              </h3>
              <p className="mb-6 text-gray-600">
                Create your first configuration to get started
              </p>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="h-5 w-5" />
                <span>Create First Configuration</span>
              </button>
            </div>
          ) : (
            configurations.map(renderConfigurationCard)
          )}
        </div>

        {/* Modal */}
        {renderModal()}
      </div>
    </div>
  );
}
