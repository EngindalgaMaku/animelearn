"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  Palette,
  Zap,
  TrendingUp,
  Settings,
} from "lucide-react";

interface Rarity {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  gradient?: string;
  animation?: string;
  level: number;
  minDiamondPrice: number;
  maxDiamondPrice: number;
  dropRate: number;
  iconUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface RarityFormData {
  name: string;
  slug: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  gradient: string;
  animation: string;
  level: number;
  minDiamondPrice: number;
  maxDiamondPrice: number;
  dropRate: number;
  iconUrl: string;
  isActive: boolean;
  sortOrder: number;
}

const initialFormData: RarityFormData = {
  name: "",
  slug: "",
  description: "",
  color: "#3B82F6",
  bgColor: "",
  borderColor: "",
  textColor: "",
  gradient: "",
  animation: "",
  level: 1,
  minDiamondPrice: 50,
  maxDiamondPrice: 100,
  dropRate: 100.0,
  iconUrl: "",
  isActive: true,
  sortOrder: 0,
};

const predefinedAnimations = [
  { value: "", label: "None" },
  { value: "animate-pulse", label: "Pulse" },
  { value: "animate-pulse-slow", label: "Slow Pulse" },
  { value: "animate-bounce", label: "Bounce" },
  { value: "animate-float", label: "Float" },
  { value: "hover:scale-105", label: "Hover Scale" },
  { value: "hover:scale-110", label: "Hover Scale Large" },
];

const predefinedGradients = [
  { value: "", label: "None" },
  {
    value: "bg-gradient-to-r from-blue-200 to-blue-300",
    label: "Blue Gradient",
  },
  {
    value: "bg-gradient-to-r from-purple-200 to-purple-300",
    label: "Purple Gradient",
  },
  {
    value: "bg-gradient-to-r from-yellow-200 to-orange-200",
    label: "Golden Gradient",
  },
  { value: "bg-gradient-to-r from-red-200 to-red-300", label: "Red Gradient" },
  {
    value: "bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50",
    label: "Legendary Gold",
  },
];

export default function RaritiesPage() {
  const [rarities, setRarities] = useState<Rarity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRarity, setEditingRarity] = useState<Rarity | null>(null);
  const [formData, setFormData] = useState<RarityFormData>(initialFormData);
  const [previewMode, setPreviewMode] = useState(false);
  const [dropRateWarning, setDropRateWarning] = useState("");

  useEffect(() => {
    fetchRarities();
  }, []);

  // Calculate total drop rate
  const calculateTotalDropRate = () => {
    let total = 0;
    rarities.forEach((rarity) => {
      if (editingRarity && rarity.id === editingRarity.id) {
        total += formData.dropRate;
      } else {
        total += rarity.dropRate;
      }
    });
    if (!editingRarity) {
      total += formData.dropRate;
    }
    return total;
  };

  // Check drop rate validity
  useEffect(() => {
    const total = calculateTotalDropRate();
    if (total > 100) {
      setDropRateWarning(
        `⚠️ Total drop rate is ${total.toFixed(1)}%. Must be 100% or less.`
      );
    } else if (total < 100 && rarities.length > 0) {
      setDropRateWarning(
        `💡 Total drop rate is ${total.toFixed(1)}%. ${(100 - total).toFixed(1)}% remaining.`
      );
    } else {
      setDropRateWarning("");
    }
  }, [formData.dropRate, rarities, editingRarity]);

  // Auto-balance drop rates function
  const autoBalanceDropRates = () => {
    if (rarities.length === 0) return;

    const activeRarities = editingRarity
      ? rarities.filter((r) => r.id !== editingRarity.id)
      : rarities;

    if (activeRarities.length === 0) {
      setFormData((prev) => ({ ...prev, dropRate: 100 }));
      return;
    }

    const remainingRate = 100 - formData.dropRate;
    const avgRate = remainingRate / activeRarities.length;

    // This would update other rarities - for now just show suggestion
    const suggestion = `Suggestion: Set other rarities to ~${avgRate.toFixed(1)}% each`;
    setDropRateWarning(suggestion);
  };

  const fetchRarities = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/rarities");
      if (response.ok) {
        const data = await response.json();
        setRarities(data.rarities || []);
      }
    } catch (error) {
      console.error("Failed to fetch rarities:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  const openCreateModal = () => {
    setEditingRarity(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
    setPreviewMode(false);
  };

  const openEditModal = (rarity: Rarity) => {
    setEditingRarity(rarity);
    setFormData({
      name: rarity.name,
      slug: rarity.slug,
      description: rarity.description || "",
      color: rarity.color,
      bgColor: rarity.bgColor || "",
      borderColor: rarity.borderColor || "",
      textColor: rarity.textColor || "",
      gradient: rarity.gradient || "",
      animation: rarity.animation || "",
      level: rarity.level,
      minDiamondPrice: rarity.minDiamondPrice,
      maxDiamondPrice: rarity.maxDiamondPrice,
      dropRate: rarity.dropRate,
      iconUrl: rarity.iconUrl || "",
      isActive: rarity.isActive,
      sortOrder: rarity.sortOrder,
    });
    setIsModalOpen(true);
    setPreviewMode(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRarity(null);
    setFormData(initialFormData);
    setPreviewMode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check total drop rate
    const totalDropRate = calculateTotalDropRate();
    if (totalDropRate > 100) {
      alert(
        `❌ Cannot save: Total drop rate would be ${totalDropRate.toFixed(1)}%. Please adjust drop rates so the total is 100% or less.`
      );
      return;
    }

    try {
      const url = editingRarity
        ? `/api/admin/rarities/${editingRarity.id}`
        : "/api/admin/rarities";

      const method = editingRarity ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchRarities();
        closeModal();

        // Show success message with drop rate info
        const newTotal = calculateTotalDropRate();
        if (newTotal === 100) {
          alert(
            "✅ Rarity saved successfully! Drop rates are perfectly balanced at 100%."
          );
        } else {
          alert(
            `✅ Rarity saved successfully! Total drop rate: ${newTotal.toFixed(1)}%`
          );
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to save rarity"}`);
      }
    } catch (error) {
      console.error("Error saving rarity:", error);
      alert("Failed to save rarity");
    }
  };

  const handleDelete = async (rarity: Rarity) => {
    if (!confirm(`Are you sure you want to delete "${rarity.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/rarities/${rarity.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchRarities();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to delete rarity"}`);
      }
    } catch (error) {
      console.error("Error deleting rarity:", error);
      alert("Failed to delete rarity");
    }
  };

  const getPreviewCardStyle = () => {
    const styles = [];
    if (formData.bgColor) styles.push(formData.bgColor);
    if (formData.borderColor) styles.push(`border-2 ${formData.borderColor}`);
    if (formData.gradient) styles.push(formData.gradient);
    if (formData.animation) styles.push(formData.animation);

    return styles.join(" ") + " rounded-lg p-4 min-h-[120px] border";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center space-x-3 text-3xl font-bold text-gray-900">
              <Star className="h-8 w-8 text-yellow-600" />
              <span>Rarity Management</span>
            </h1>
            <p className="mt-2 text-gray-600">
              Configure rarity levels, styling, pricing, and drop rates
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3 font-medium text-white shadow-sm transition-all hover:from-red-700 hover:to-orange-700"
          >
            <Plus className="h-5 w-5" />
            <span>Add Rarity</span>
          </button>
        </div>
      </div>

      {/* Rarities Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rarities.map((rarity) => (
          <div
            key={rarity.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            {/* Preview Card */}
            <div className="bg-gray-50 p-4">
              <div
                className={`min-h-[100px] rounded-lg border-2 p-4 transition-all ${
                  rarity.bgColor || "bg-white"
                } ${rarity.borderColor || "border-gray-300"} ${
                  rarity.gradient || ""
                } ${rarity.animation || ""}`}
                style={{ color: rarity.textColor || "#1F2937" }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Preview Card</span>
                  <div
                    className="rounded px-2 py-1 text-xs"
                    style={{ backgroundColor: rarity.color, color: "white" }}
                  >
                    {rarity.name}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Level {rarity.level}
                </div>
              </div>
            </div>

            {/* Rarity Info */}
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {rarity.name}
                </h3>
                <div
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    rarity.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {rarity.isActive ? "Active" : "Inactive"}
                </div>
              </div>

              {rarity.description && (
                <p className="mb-4 text-sm text-gray-600">
                  {rarity.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-gray-600">Level: {rarity.level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-600">{rarity.dropRate}% Drop</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-purple-600" />
                  <span className="text-gray-600">
                    💎 {rarity.minDiamondPrice}-{rarity.maxDiamondPrice}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Palette className="h-4 w-4 text-pink-600" />
                  <div
                    className="h-4 w-4 rounded border"
                    style={{ backgroundColor: rarity.color }}
                  ></div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end space-x-2 border-t border-gray-200 pt-4">
                <button
                  onClick={() => openEditModal(rarity)}
                  className="flex items-center space-x-1 rounded-lg px-3 py-2 text-blue-600 transition-colors hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(rarity)}
                  className="flex items-center space-x-1 rounded-lg px-3 py-2 text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {rarities.length === 0 && (
        <div className="py-12 text-center">
          <Star className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-xl font-medium text-gray-900">
            No Rarities Found
          </h3>
          <p className="mb-6 text-gray-600">
            Create your first rarity level to get started.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3 font-medium text-white transition-all hover:from-red-700 hover:to-orange-700"
          >
            <Plus className="h-5 w-5" />
            <span>Add First Rarity</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingRarity ? "Edit Rarity" : "Create New Rarity"}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-colors ${
                    previewMode
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={closeModal}
                  className="rounded-full p-2 transition-colors hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Basic Information
                    </h3>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Slug *
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
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Styling */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Styling
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Primary Color *
                        </label>
                        <input
                          type="color"
                          value={formData.color}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              color: e.target.value,
                            }))
                          }
                          className="h-10 w-full rounded-lg border border-gray-300"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Text Color
                        </label>
                        <input
                          type="color"
                          value={formData.textColor}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              textColor: e.target.value,
                            }))
                          }
                          className="h-10 w-full rounded-lg border border-gray-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Background Gradient
                      </label>
                      <select
                        value={formData.gradient}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            gradient: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                      >
                        {predefinedGradients.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Animation
                      </label>
                      <select
                        value={formData.animation}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            animation: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                      >
                        {predefinedAnimations.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Game Mechanics */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Game Mechanics
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Level (Priority) *
                        </label>
                        <input
                          type="number"
                          value={formData.level}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              level: parseInt(e.target.value),
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                          min="1"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Sort Order
                        </label>
                        <input
                          type="number"
                          value={formData.sortOrder}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              sortOrder: parseInt(e.target.value),
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Min Diamond Price
                        </label>
                        <input
                          type="number"
                          value={formData.minDiamondPrice}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              minDiamondPrice: parseInt(e.target.value),
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                          min="1"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Max Diamond Price
                        </label>
                        <input
                          type="number"
                          value={formData.maxDiamondPrice}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              maxDiamondPrice: parseInt(e.target.value),
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                          min={formData.minDiamondPrice + 1}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Drop Rate (%)
                        </label>
                        <div className="space-y-2">
                          <input
                            type="number"
                            step="0.1"
                            value={formData.dropRate}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                dropRate: parseFloat(e.target.value),
                              }))
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                            min="0"
                            max="100"
                          />
                          {dropRateWarning && (
                            <div
                              className={`rounded p-2 text-xs ${
                                dropRateWarning.startsWith("⚠️")
                                  ? "border border-red-200 bg-red-50 text-red-700"
                                  : "border border-blue-200 bg-blue-50 text-blue-700"
                              }`}
                            >
                              {dropRateWarning}
                            </div>
                          )}
                          {calculateTotalDropRate() !== 100 && (
                            <button
                              type="button"
                              onClick={autoBalanceDropRates}
                              className="text-xs text-blue-600 underline hover:text-blue-800"
                            >
                              💡 Get balance suggestions
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
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
                      className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <label
                      htmlFor="isActive"
                      className="text-sm font-medium text-gray-700"
                    >
                      Active
                    </label>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex items-center justify-end space-x-4 border-t border-gray-200 pt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-6 py-2 text-white transition-all hover:from-red-700 hover:to-orange-700"
                    >
                      <Save className="h-4 w-4" />
                      <span>{editingRarity ? "Update" : "Create"}</span>
                    </button>
                  </div>
                </form>

                {/* Preview */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Live Preview
                  </h3>

                  <div className="space-y-4">
                    {/* Card Preview */}
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="mb-3 text-sm font-medium text-gray-700">
                        Card Style Preview
                      </h4>
                      <div className={getPreviewCardStyle()}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Sample Card
                          </span>
                          <div
                            className="rounded px-2 py-1 text-xs text-white"
                            style={{ backgroundColor: formData.color }}
                          >
                            {formData.name || "Rarity"}
                          </div>
                        </div>
                        <div className="text-xs opacity-70">
                          Level {formData.level}
                        </div>
                        <div className="text-xs opacity-70">
                          Drop Rate: {formData.dropRate}%
                        </div>
                        <div className="text-xs opacity-70">
                          Price: 💎 {formData.minDiamondPrice}-
                          {formData.maxDiamondPrice}
                        </div>
                      </div>
                    </div>

                    {/* Stats Preview */}
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="mb-3 text-sm font-medium text-gray-700">
                        Statistics
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Rarity Level:</span>
                          <span className="font-medium">{formData.level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Diamond Range:</span>
                          <span className="font-medium">
                            💎 {formData.minDiamondPrice}-
                            {formData.maxDiamondPrice}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Drop Rate:</span>
                          <span className="font-medium">
                            {formData.dropRate}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span
                            className={`font-medium ${formData.isActive ? "text-green-600" : "text-red-600"}`}
                          >
                            {formData.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Color Palette */}
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="mb-3 text-sm font-medium text-gray-700">
                        Color Palette
                      </h4>
                      <div className="flex space-x-2">
                        <div className="flex-1 text-center">
                          <div
                            className="mb-1 h-8 w-full rounded border"
                            style={{ backgroundColor: formData.color }}
                          ></div>
                          <div className="text-xs text-gray-600">Primary</div>
                        </div>
                        {formData.textColor && (
                          <div className="flex-1 text-center">
                            <div
                              className="mb-1 h-8 w-full rounded border"
                              style={{ backgroundColor: formData.textColor }}
                            ></div>
                            <div className="text-xs text-gray-600">Text</div>
                          </div>
                        )}
                      </div>
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
