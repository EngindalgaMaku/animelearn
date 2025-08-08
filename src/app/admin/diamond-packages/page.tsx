"use client";

import { useState, useEffect } from "react";
import {
  Diamond,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Package,
  DollarSign,
  Star,
  Crown,
  Gift,
  Zap,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface DiamondPackage {
  id: string;
  name: string;
  packageType: string;
  diamonds: number;
  price: number;
  originalPrice?: number;
  bonus?: number;
  popular: boolean;
  bestValue: boolean;
  level: number;
  badge: string;
  color: string;
  glow: string;
  icon: string;
  features: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface PackageFormData {
  name: string;
  packageType: string;
  diamonds: number;
  price: number;
  originalPrice: string;
  bonus: string;
  popular: boolean;
  bestValue: boolean;
  level: number;
  badge: string;
  color: string;
  glow: string;
  icon: string;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

const initialFormData: PackageFormData = {
  name: "",
  packageType: "",
  diamonds: 100,
  price: 9.99,
  originalPrice: "",
  bonus: "",
  popular: false,
  bestValue: false,
  level: 1,
  badge: "Novice",
  color: "from-green-400 to-emerald-600",
  glow: "shadow-green-500/25",
  icon: "Diamond",
  features: [],
  isActive: true,
  sortOrder: 0,
};

const iconOptions = ["Diamond", "Star", "Crown", "Zap", "Gift"];
const colorOptions = [
  { value: "from-green-400 to-emerald-600", label: "Green" },
  { value: "from-blue-400 to-cyan-600", label: "Blue" },
  { value: "from-purple-400 to-pink-600", label: "Purple" },
  { value: "from-orange-400 to-red-600", label: "Orange" },
  { value: "from-yellow-400 to-amber-600", label: "Yellow" },
];

const glowOptions = [
  { value: "shadow-green-500/25", label: "Green Glow" },
  { value: "shadow-blue-500/25", label: "Blue Glow" },
  { value: "shadow-purple-500/25", label: "Purple Glow" },
  { value: "shadow-orange-500/25", label: "Orange Glow" },
  { value: "shadow-yellow-500/25", label: "Yellow Glow" },
];

export default function DiamondPackagesAdminPage() {
  const [packages, setPackages] = useState<DiamondPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<DiamondPackage | null>(null);
  const [formData, setFormData] = useState<PackageFormData>(initialFormData);
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/diamond-packages");
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages || []);
      }
    } catch (error) {
      console.error("Failed to fetch diamond packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingPackage(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: DiamondPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      packageType: pkg.packageType,
      diamonds: pkg.diamonds,
      price: pkg.price,
      originalPrice: pkg.originalPrice?.toString() || "",
      bonus: pkg.bonus?.toString() || "",
      popular: pkg.popular,
      bestValue: pkg.bestValue,
      level: pkg.level,
      badge: pkg.badge,
      color: pkg.color,
      glow: pkg.glow,
      icon: pkg.icon,
      features: typeof pkg.features === 'string' ? JSON.parse(pkg.features) : [...pkg.features],
      isActive: pkg.isActive,
      sortOrder: pkg.sortOrder,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPackage(null);
    setFormData(initialFormData);
    setNewFeature("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingPackage
        ? `/api/admin/diamond-packages/${editingPackage.id}`
        : "/api/admin/diamond-packages";

      const method = editingPackage ? "PUT" : "POST";

      const payload = {
        ...formData,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        bonus: formData.bonus ? parseInt(formData.bonus) : null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchPackages();
        closeModal();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to save diamond package"}`);
      }
    } catch (error) {
      console.error("Error saving diamond package:", error);
      alert("Failed to save diamond package");
    }
  };

  const handleDelete = async (pkg: DiamondPackage) => {
    if (!confirm(`Are you sure you want to delete "${pkg.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/diamond-packages/${pkg.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchPackages();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to delete diamond package"}`);
      }
    } catch (error) {
      console.error("Error deleting diamond package:", error);
      alert("Failed to delete diamond package");
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const toggleActive = async (pkg: DiamondPackage) => {
    try {
      const response = await fetch(`/api/admin/diamond-packages/${pkg.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !pkg.isActive,
        }),
      });

      if (response.ok) {
        await fetchPackages();
      }
    } catch (error) {
      console.error("Error toggling package status:", error);
    }
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
              <Package className="h-8 w-8 text-purple-600" />
              <span>Diamond Packages</span>
            </h1>
            <p className="mt-2 text-gray-600">
              Manage diamond packages for the store
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white shadow-sm transition-all hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="h-5 w-5" />
            <span>Add Package</span>
          </button>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative overflow-hidden rounded-xl border ${
              pkg.isActive ? "border-gray-200 bg-white" : "border-gray-300 bg-gray-50"
            } shadow-lg transition-all hover:shadow-xl`}
          >
            {/* Status Badge */}
            <div className="absolute right-4 top-4 z-10">
              <button
                onClick={() => toggleActive(pkg)}
                className={`flex items-center space-x-1 rounded-full px-3 py-1 text-sm font-medium ${
                  pkg.isActive
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
              >
                {pkg.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                <span>{pkg.isActive ? "Active" : "Inactive"}</span>
              </button>
            </div>

            {/* Package Preview */}
            <div className={`bg-gradient-to-br ${pkg.color} p-6 text-white`}>
              <div className="mb-4 flex items-center justify-between">
                <div className="text-xs font-medium opacity-75">LVL {pkg.level}</div>
                <div className="text-2xl">
                  {pkg.icon === "Diamond" && "💎"}
                  {pkg.icon === "Star" && "⭐"}
                  {pkg.icon === "Crown" && "👑"}
                  {pkg.icon === "Zap" && "⚡"}
                  {pkg.icon === "Gift" && "🎁"}
                </div>
              </div>

              <h3 className="mb-2 text-xl font-bold">{pkg.name}</h3>
              <p className="mb-4 text-sm opacity-90">{pkg.badge} Package</p>

              <div className="mb-4 text-center">
                <div className="text-2xl font-bold">💎 {pkg.diamonds.toLocaleString()}</div>
                {pkg.bonus && (
                  <div className="text-sm font-medium text-yellow-300">
                    +{pkg.bonus} Bonus!
                  </div>
                )}
              </div>

              <div className="text-center">
                {pkg.originalPrice && (
                  <div className="text-sm line-through opacity-75">
                    ${pkg.originalPrice}
                  </div>
                )}
                <div className="text-xl font-bold">${pkg.price}</div>
              </div>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {pkg.popular && (
                  <span className="rounded-full bg-orange-500 px-2 py-1 text-xs font-medium">
                    🔥 Popular
                  </span>
                )}
                {pkg.bestValue && (
                  <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-medium">
                    💰 Best Value
                  </span>
                )}
              </div>
            </div>

            {/* Package Info */}
            <div className="p-6">
              <div className="mb-4">
                <h4 className="mb-2 font-medium text-gray-900">Features</h4>
                <div className="space-y-1">
                  {(typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features).slice(0, 3).map((feature: string, i: number) => (
                    <div key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                  {(typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features).length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{(typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features).length - 3} more features
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Package Type:</span>
                  <div className="font-mono text-xs">{pkg.packageType}</div>
                </div>
                <div>
                  <span className="font-medium">Sort Order:</span>
                  <div>{pkg.sortOrder}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(pkg)}
                  className="flex items-center space-x-1 rounded-lg px-3 py-2 text-blue-600 transition-colors hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(pkg)}
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
      {packages.length === 0 && (
        <div className="py-12 text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-xl font-medium text-gray-900">
            No Diamond Packages Found
          </h3>
          <p className="mb-6 text-gray-600">
            Create your first diamond package to get started.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white transition-all hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="h-5 w-5" />
            <span>Add First Package</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPackage ? "Edit Diamond Package" : "Create New Diamond Package"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {/* Basic Info */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Package Type *
                  </label>
                  <input
                    type="text"
                    value={formData.packageType}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, packageType: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., starter, premium, ultimate"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Diamonds *
                  </label>
                  <input
                    type="number"
                    value={formData.diamonds}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, diamonds: parseInt(e.target.value) }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, price: parseFloat(e.target.value) }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, originalPrice: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Bonus Diamonds
                  </label>
                  <input
                    type="number"
                    value={formData.bonus}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, bonus: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Level *
                  </label>
                  <input
                    type="number"
                    value={formData.level}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, level: parseInt(e.target.value) }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Badge Text *
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, badge: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, icon: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Color Gradient
                  </label>
                  <select
                    value={formData.color}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, color: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  >
                    {colorOptions.map((color) => (
                      <option key={color.value} value={color.value}>
                        {color.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Glow Effect
                  </label>
                  <select
                    value={formData.glow}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, glow: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  >
                    {glowOptions.map((glow) => (
                      <option key={glow.value} value={glow.value}>
                        {glow.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                    min="0"
                  />
                </div>
              </div>

              {/* Flags */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="popular"
                    checked={formData.popular}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, popular: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="popular" className="text-sm font-medium text-gray-700">
                    Popular Package
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="bestValue"
                    checked={formData.bestValue}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, bestValue: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="bestValue" className="text-sm font-medium text-gray-700">
                    Best Value
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Features
                </label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...formData.features];
                          newFeatures[index] = e.target.value;
                          setFormData((prev) => ({ ...prev, features: newFeatures }));
                        }}
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add new feature..."
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="rounded-lg bg-purple-600 p-2 text-white transition-colors hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
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
                  className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 text-white transition-all hover:from-purple-700 hover:to-pink-700"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingPackage ? "Update" : "Create"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}