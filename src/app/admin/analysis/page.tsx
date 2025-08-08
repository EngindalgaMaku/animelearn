"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Settings,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Eye,
  DollarSign,
  TrendingUp,
  Zap,
  Target,
  Clock,
  Plus,
  Edit,
  Trash2,
  PlayCircle,
  BarChart3,
  Wifi,
  WifiOff,
} from "lucide-react";

interface AnalysisSettings {
  id: string;
  name: string;
  description?: string;

  // AI Analysis Settings
  aiModel: string;
  confidenceThreshold: number;
  enableOCR: boolean;
  enableImageAnalysis: boolean;
  enablePriceEstimation: boolean;

  // Price Calculation Settings
  basePriceMin: number;
  basePriceMax: number;
  rarityWeight: number;
  elementWeight: number;
  categoryWeight: number;
  conditionWeight: number;
  popularityWeight: number;

  // Market Analysis Settings
  enableMarketAnalysis: boolean;
  marketTrendWeight: number;
  demandFactor: number;
  supplyFactor: number;

  // Auto-Update Settings
  autoUpdatePrices: boolean;
  priceUpdateInterval: number;
  maxPriceChange: number;

  // Analysis Criteria
  analyzeStats: boolean;
  analyzeCharacter: boolean;
  analyzeSeries: boolean;
  analyzeRarity: boolean;
  analyzeCondition: boolean;
  analyzeElements: boolean;

  // Quality Thresholds
  minImageQuality: number;
  maxBlurThreshold: number;
  minResolution: number;

  isActive: boolean;
  isDefault: boolean;
  priority: number;
}

const defaultSettings: Partial<AnalysisSettings> = {
  name: "Default Configuration",
  description: "Default card analysis configuration",
  aiModel: "quality-analysis",
  confidenceThreshold: 0.7,
  enableOCR: false,
  enableImageAnalysis: true,
  enablePriceEstimation: true,
  basePriceMin: 10,
  basePriceMax: 100,
  rarityWeight: 1.5,
  elementWeight: 1.2,
  categoryWeight: 1.1,
  conditionWeight: 1.3,
  popularityWeight: 1.4,
  enableMarketAnalysis: false,
  marketTrendWeight: 1.0,
  demandFactor: 1.2,
  supplyFactor: 0.8,
  autoUpdatePrices: false,
  priceUpdateInterval: 24,
  maxPriceChange: 0.3,
  analyzeStats: true,
  analyzeCharacter: true,
  analyzeSeries: true,
  analyzeRarity: true,
  analyzeCondition: true,
  analyzeElements: true,
  minImageQuality: 0.3,
  maxBlurThreshold: 0.5,
  minResolution: 100,
  isActive: true,
  isDefault: false,
  priority: 0,
};

export default function CardAnalysisPage() {
  const [settings, setSettings] = useState<AnalysisSettings[]>([]);
  const [selectedSettings, setSelectedSettings] =
    useState<AnalysisSettings | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("statistics");
  const [analysisStats, setAnalysisStats] = useState<{
    totalCards: number;
    analyzedCards: number;
    pendingCards: number;
    averageQuality: number;
  }>({ totalCards: 0, analyzedCards: 0, pendingCards: 0, averageQuality: 0 });

  // Fetch analysis settings
  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/analysis-settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        if (data.length > 0 && !selectedSettings) {
          setSelectedSettings(data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setMessage({ type: "error", text: "Failed to load analysis settings" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchAnalysisStats();
  }, []);

  // Analysis istatistiklerini getir
  const fetchAnalysisStats = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (response.ok) {
        const data = await response.json();
        setAnalysisStats({
          totalCards: data.stats.totalCards || 0,
          analyzedCards: data.stats.analyzedCards || 0,
          pendingCards:
            (data.stats.totalCards || 0) - (data.stats.analyzedCards || 0),
          averageQuality: data.stats.averageQuality || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching analysis stats:", error);
    }
  };

  const createNewSettings = () => {
    const newSettings = {
      ...defaultSettings,
      id: "new",
      name: "New Analysis Configuration",
    } as AnalysisSettings;
    setSelectedSettings(newSettings);
    setIsEditing(true);
  };

  const saveSettings = async () => {
    if (!selectedSettings) return;

    try {
      setIsSaving(true);
      const isNew = selectedSettings.id === "new";
      const url = isNew
        ? "/api/admin/analysis-settings"
        : `/api/admin/analysis-settings/${selectedSettings.id}`;

      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedSettings),
      });

      if (response.ok) {
        const savedSettings = await response.json();
        setMessage({
          type: "success",
          text: "Analysis settings saved successfully",
        });
        setIsEditing(false);
        await fetchSettings();
        setSelectedSettings(savedSettings);
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({ type: "error", text: "Failed to save analysis settings" });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSettings = async (id: string) => {
    if (
      !confirm("Are you sure you want to delete this analysis configuration?")
    )
      return;

    try {
      const response = await fetch(`/api/admin/analysis-settings/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Analysis settings deleted successfully",
        });
        await fetchSettings();
        if (selectedSettings?.id === id) {
          setSelectedSettings(
            settings.length > 1
              ? settings.find((s) => s.id !== id) || null
              : null
          );
        }
      } else {
        throw new Error("Failed to delete settings");
      }
    } catch (error) {
      console.error("Error deleting settings:", error);
      setMessage({ type: "error", text: "Failed to delete analysis settings" });
    }
  };

  const runAnalysis = async () => {
    if (!selectedSettings) return;

    try {
      const response = await fetch("/api/admin/analysis-settings/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settingsId: selectedSettings.id }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Analysis started with current settings",
        });
      } else {
        throw new Error("Failed to start analysis");
      }
    } catch (error) {
      console.error("Error running analysis:", error);
      setMessage({ type: "error", text: "Failed to start analysis" });
    }
  };

  const updateField = (field: keyof AnalysisSettings, value: any) => {
    if (!selectedSettings) return;
    setSelectedSettings({
      ...selectedSettings,
      [field]: value,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading analysis settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
            <Search className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Analysis & Settings Management
            </h1>
            <p className="text-gray-600">
              Configure analysis parameters, view statistics and manage settings
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* System Status */}
          <div className="flex items-center space-x-2 rounded-lg border px-3 py-2">
            <BarChart3 className="h-4 w-4 text-blue-500" />
            <div className="text-sm">
              <div className="text-blue-700">
                Analysis System: Quality-Based
              </div>
              <div className="text-xs text-gray-500">
                {analysisStats.analyzedCards}/{analysisStats.totalCards} cards
                processed
              </div>
            </div>
            <button
              onClick={fetchAnalysisStats}
              className="text-gray-400 hover:text-gray-600"
              title="Refresh statistics"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          </div>

          <button
            onClick={createNewSettings}
            className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>New Configuration</span>
          </button>
          {selectedSettings && (
            <button
              onClick={runAnalysis}
              className="flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Run Analysis</span>
            </button>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`rounded-lg border p-4 ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <div className="flex items-center space-x-2">
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Configuration List */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Analysis Configurations
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {settings.map((config) => (
                <div
                  key={config.id}
                  className={`cursor-pointer p-4 hover:bg-gray-50 ${
                    selectedSettings?.id === config.id
                      ? "border-l-4 border-blue-600 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedSettings(config);
                    setIsEditing(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {config.name}
                      </h3>
                      <p className="truncate text-sm text-gray-500">
                        {config.description}
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-xs">
                        <span
                          className={`rounded-full px-2 py-1 ${
                            config.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {config.isActive ? "Active" : "Inactive"}
                        </span>
                        {config.isDefault && (
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-800">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSettings(config);
                          setIsEditing(true);
                        }}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSettings(config.id);
                        }}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {settings.length === 0 && (
                <div className="p-8 text-center">
                  <Search className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No configurations found
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Get started by creating your first analysis configuration.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Configuration Editor */}
        {selectedSettings && (
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {isEditing ? "Edit Configuration" : "Configuration Details"}
                  </h2>
                  <div className="flex items-center space-x-3">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveSettings}
                          disabled={isSaving}
                          className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isSaving ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          <span>Save</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-200 px-4">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: "statistics", name: "Statistics", icon: BarChart3 },
                    { id: "pricing", name: "Pricing", icon: DollarSign },
                    { id: "automation", name: "Automation", icon: Clock },
                    { id: "criteria", name: "Criteria", icon: Target },
                    { id: "quality", name: "Quality", icon: Eye },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 border-b-2 py-4 text-sm font-medium ${
                        activeTab === tab.id
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Basic Info */}
                <div className="mb-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Configuration Name
                      </label>
                      <input
                        type="text"
                        value={selectedSettings.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Priority
                      </label>
                      <input
                        type="number"
                        value={selectedSettings.priority}
                        onChange={(e) =>
                          updateField("priority", parseInt(e.target.value))
                        }
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={selectedSettings.description || ""}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      disabled={!isEditing}
                      rows={2}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSettings.isActive}
                        onChange={(e) =>
                          updateField("isActive", e.target.checked)
                        }
                        disabled={!isEditing}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSettings.isDefault}
                        onChange={(e) =>
                          updateField("isDefault", e.target.checked)
                        }
                        disabled={!isEditing}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Default Configuration
                      </span>
                    </label>
                  </div>
                </div>

                {/* Statistics Tab */}
                {activeTab === "statistics" && (
                  <div className="space-y-6">
                    {/* Analysis Statistics */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <div className="flex items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                            <BarChart3 className="h-4 w-4 text-white" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-blue-900">
                              Total Cards
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                              {analysisStats.totalCards}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                        <div className="flex items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-900">
                              Analyzed
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                              {analysisStats.analyzedCards}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                        <div className="flex items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
                            <Clock className="h-4 w-4 text-white" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-orange-900">
                              Pending
                            </p>
                            <p className="text-2xl font-bold text-orange-600">
                              {analysisStats.pendingCards}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                        <div className="flex items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500">
                            <TrendingUp className="h-4 w-4 text-white" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-purple-900">
                              Avg Quality
                            </p>
                            <p className="text-2xl font-bold text-purple-600">
                              {analysisStats.averageQuality.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Analysis Methods */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h3 className="mb-3 text-lg font-medium text-gray-900">
                        Current Analysis Method
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                            <Eye className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Quality-Based Analysis
                            </p>
                            <p className="text-sm text-gray-600">
                              Image quality analysis with smart category
                              detection
                            </p>
                          </div>
                        </div>
                        <div className="ml-11 space-y-1 text-sm text-gray-600">
                          <p>• Sharp.js powered image quality analysis</p>
                          <p>• Filename-based series and character detection</p>
                          <p>• Category-aware content generation</p>
                          <p>• Quality-based rarity and power statistics</p>
                        </div>
                      </div>
                    </div>

                    {/* System Features */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSettings.enableImageAnalysis}
                          onChange={(e) =>
                            updateField("enableImageAnalysis", e.target.checked)
                          }
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Image Quality Analysis
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSettings.enablePriceEstimation}
                          onChange={(e) =>
                            updateField(
                              "enablePriceEstimation",
                              e.target.checked
                            )
                          }
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Price Estimation
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={true}
                          disabled={true}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Category Detection
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Pricing Tab */}
                {activeTab === "pricing" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Base Price Min
                        </label>
                        <input
                          type="number"
                          value={selectedSettings.basePriceMin}
                          onChange={(e) =>
                            updateField(
                              "basePriceMin",
                              parseInt(e.target.value)
                            )
                          }
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Base Price Max
                        </label>
                        <input
                          type="number"
                          value={selectedSettings.basePriceMax}
                          onChange={(e) =>
                            updateField(
                              "basePriceMax",
                              parseInt(e.target.value)
                            )
                          }
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {[
                        { field: "rarityWeight", label: "Rarity Weight" },
                        { field: "elementWeight", label: "Element Weight" },
                        { field: "categoryWeight", label: "Category Weight" },
                        { field: "conditionWeight", label: "Condition Weight" },
                        {
                          field: "popularityWeight",
                          label: "Popularity Weight",
                        },
                      ].map(({ field, label }) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-gray-700">
                            {label} ({(selectedSettings as any)[field]})
                          </label>
                          <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.1"
                            value={(selectedSettings as any)[field]}
                            onChange={(e) =>
                              updateField(
                                field as keyof AnalysisSettings,
                                parseFloat(e.target.value)
                              )
                            }
                            disabled={!isEditing}
                            className="mt-1 block w-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Automation Tab */}
                {activeTab === "automation" && (
                  <div className="space-y-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSettings.autoUpdatePrices}
                        onChange={(e) =>
                          updateField("autoUpdatePrices", e.target.checked)
                        }
                        disabled={!isEditing}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Auto Update Prices
                      </span>
                    </label>

                    {selectedSettings.autoUpdatePrices && (
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Update Interval (hours)
                          </label>
                          <input
                            type="number"
                            value={selectedSettings.priceUpdateInterval}
                            onChange={(e) =>
                              updateField(
                                "priceUpdateInterval",
                                parseInt(e.target.value)
                              )
                            }
                            disabled={!isEditing}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Max Price Change (
                            {Math.round(selectedSettings.maxPriceChange * 100)}
                            %)
                          </label>
                          <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.1"
                            value={selectedSettings.maxPriceChange}
                            onChange={(e) =>
                              updateField(
                                "maxPriceChange",
                                parseFloat(e.target.value)
                              )
                            }
                            disabled={!isEditing}
                            className="mt-1 block w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Analysis Criteria Tab */}
                {activeTab === "criteria" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {[
                        { field: "analyzeStats", label: "Analyze Stats" },
                        {
                          field: "analyzeCharacter",
                          label: "Analyze Character",
                        },
                        { field: "analyzeSeries", label: "Analyze Series" },
                        { field: "analyzeRarity", label: "Analyze Rarity" },
                        {
                          field: "analyzeCondition",
                          label: "Analyze Condition",
                        },
                        { field: "analyzeElements", label: "Analyze Elements" },
                      ].map(({ field, label }) => (
                        <label key={field} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(selectedSettings as any)[field]}
                            onChange={(e) =>
                              updateField(
                                field as keyof AnalysisSettings,
                                e.target.checked
                              )
                            }
                            disabled={!isEditing}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quality Thresholds Tab */}
                {activeTab === "quality" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Min Image Quality ({selectedSettings.minImageQuality})
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={selectedSettings.minImageQuality}
                          onChange={(e) =>
                            updateField(
                              "minImageQuality",
                              parseFloat(e.target.value)
                            )
                          }
                          disabled={!isEditing}
                          className="mt-1 block w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Max Blur Threshold (
                          {selectedSettings.maxBlurThreshold})
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={selectedSettings.maxBlurThreshold}
                          onChange={(e) =>
                            updateField(
                              "maxBlurThreshold",
                              parseFloat(e.target.value)
                            )
                          }
                          disabled={!isEditing}
                          className="mt-1 block w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Min Resolution (px)
                        </label>
                        <input
                          type="number"
                          value={selectedSettings.minResolution}
                          onChange={(e) =>
                            updateField(
                              "minResolution",
                              parseInt(e.target.value)
                            )
                          }
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
