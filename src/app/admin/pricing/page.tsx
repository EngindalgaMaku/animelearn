"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  TrendingUp,
  Target,
  Settings,
  AlertCircle,
} from "lucide-react";

interface PricingRule {
  id: string;
  name: string;
  type: string;
  targetValue?: string;
  basePrice: number;
  multiplier: number;
  minPrice?: number;
  maxPrice?: number;
  conditions?: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

interface PricingRuleFormData {
  name: string;
  type: string;
  targetValue: string;
  basePrice: number;
  multiplier: number;
  minPrice: string;
  maxPrice: string;
  conditions: string;
  isActive: boolean;
  priority: number;
}

const initialFormData: PricingRuleFormData = {
  name: "",
  type: "base",
  targetValue: "",
  basePrice: 100,
  multiplier: 1.0,
  minPrice: "",
  maxPrice: "",
  conditions: "",
  isActive: true,
  priority: 0,
};

const ruleTypes = [
  {
    value: "base",
    label: "Base Price",
    description: "Default pricing for all cards",
  },
  {
    value: "rarity",
    label: "Rarity-based",
    description: "Price based on card rarity",
  },
  {
    value: "element",
    label: "Element-based",
    description: "Price based on card element",
  },
  {
    value: "category",
    label: "Category-based",
    description: "Price based on card category",
  },
  {
    value: "special",
    label: "Special Rule",
    description: "Custom pricing logic",
  },
];

export default function PricingPage() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [formData, setFormData] =
    useState<PricingRuleFormData>(initialFormData);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/pricing");
      if (response.ok) {
        const data = await response.json();
        setRules(data.rules || []);
      }
    } catch (error) {
      console.error("Failed to fetch pricing rules:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingRule(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (rule: PricingRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      type: rule.type,
      targetValue: rule.targetValue || "",
      basePrice: rule.basePrice,
      multiplier: rule.multiplier,
      minPrice: rule.minPrice?.toString() || "",
      maxPrice: rule.maxPrice?.toString() || "",
      conditions: rule.conditions || "",
      isActive: rule.isActive,
      priority: rule.priority,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRule(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingRule
        ? `/api/admin/pricing/${editingRule.id}`
        : "/api/admin/pricing";

      const method = editingRule ? "PUT" : "POST";

      const payload = {
        ...formData,
        minPrice: formData.minPrice ? parseInt(formData.minPrice) : undefined,
        maxPrice: formData.maxPrice ? parseInt(formData.maxPrice) : undefined,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchRules();
        closeModal();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to save pricing rule"}`);
      }
    } catch (error) {
      console.error("Error saving pricing rule:", error);
      alert("Failed to save pricing rule");
    }
  };

  const handleDelete = async (rule: PricingRule) => {
    if (!confirm(`Are you sure you want to delete "${rule.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/pricing/${rule.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchRules();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to delete pricing rule"}`);
      }
    } catch (error) {
      console.error("Error deleting pricing rule:", error);
      alert("Failed to delete pricing rule");
    }
  };

  const getRuleTypeLabel = (type: string) => {
    const ruleType = ruleTypes.find((rt) => rt.value === type);
    return ruleType ? ruleType.label : type;
  };

  const calculateExamplePrice = (rule: PricingRule, basePrice = 100) => {
    let price = rule.basePrice || basePrice;
    price *= rule.multiplier;

    if (rule.minPrice && price < rule.minPrice) price = rule.minPrice;
    if (rule.maxPrice && price > rule.maxPrice) price = rule.maxPrice;

    return Math.round(price);
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
              <DollarSign className="h-8 w-8 text-green-600" />
              <span>Pricing Rules</span>
            </h1>
            <p className="mt-2 text-gray-600">
              Configure dynamic pricing rules and multipliers for cards
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3 font-medium text-white shadow-sm transition-all hover:from-red-700 hover:to-orange-700"
          >
            <Plus className="h-5 w-5" />
            <span>Add Rule</span>
          </button>
        </div>
      </div>

      {/* Pricing Rules List */}
      <div className="space-y-6">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
          >
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {rule.name}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        rule.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {rule.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                      Priority: {rule.priority}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    {getRuleTypeLabel(rule.type)}
                    {rule.targetValue && ` • Target: ${rule.targetValue}`}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(rule)}
                    className="flex items-center space-x-1 rounded-lg px-3 py-2 text-blue-600 transition-colors hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(rule)}
                    className="flex items-center space-x-1 rounded-lg px-3 py-2 text-red-600 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Rule Details */}
              <div className="grid gap-6 md:grid-cols-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="mb-2 flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Base Price
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {rule.basePrice}💎
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="mb-2 flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Multiplier
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {rule.multiplier}x
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="mb-2 flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Price Range
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {rule.minPrice || "No min"} - {rule.maxPrice || "No max"}💎
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="mb-2 flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Example Result
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {calculateExamplePrice(rule)}💎
                  </p>
                </div>
              </div>

              {rule.conditions && (
                <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <h4 className="mb-1 text-sm font-medium text-yellow-800">
                    Conditions
                  </h4>
                  <p className="text-sm text-yellow-700">{rule.conditions}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {rules.length === 0 && (
        <div className="py-12 text-center">
          <DollarSign className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-xl font-medium text-gray-900">
            No Pricing Rules Found
          </h3>
          <p className="mb-6 text-gray-600">
            Create your first pricing rule to get started.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3 font-medium text-white transition-all hover:from-red-700 hover:to-orange-700"
          >
            <Plus className="h-5 w-5" />
            <span>Add First Rule</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingRule ? "Edit Pricing Rule" : "Create New Pricing Rule"}
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
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Basic Information
                </h3>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Rule Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Rule Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                      required
                    >
                      {ruleTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Target Value
                    </label>
                    <input
                      type="text"
                      value={formData.targetValue}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          targetValue: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                      placeholder="e.g., legendary, fire, anime"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Pricing Settings
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Base Price (Diamonds) *
                    </label>
                    <input
                      type="number"
                      value={formData.basePrice}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          basePrice: parseInt(e.target.value),
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Multiplier *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.multiplier}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          multiplier: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                      min="0.1"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Minimum Price (optional)
                    </label>
                    <input
                      type="number"
                      value={formData.minPrice}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          minPrice: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Maximum Price (optional)
                    </label>
                    <input
                      type="number"
                      value={formData.maxPrice}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          maxPrice: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Priority (higher numbers apply first)
                  </label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        priority: parseInt(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                    min="0"
                  />
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Advanced Settings
                </h3>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Conditions (JSON format, optional)
                  </label>
                  <textarea
                    value={formData.conditions}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        conditions: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                    rows={3}
                    placeholder='{"minLevel": 5, "category": "special"}'
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
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-medium text-gray-700"
                  >
                    Active
                  </label>
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-3 text-sm font-medium text-gray-700">
                  Price Calculation Preview
                </h4>
                <div className="text-sm text-gray-600">
                  Base: {formData.basePrice}💎 × {formData.multiplier} ={" "}
                  <span className="font-bold text-green-600">
                    {Math.round(formData.basePrice * formData.multiplier)}💎
                  </span>
                  {(formData.minPrice || formData.maxPrice) && (
                    <div className="mt-1">
                      Clamped to: {formData.minPrice || "no min"} -{" "}
                      {formData.maxPrice || "no max"}💎
                    </div>
                  )}
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
                  className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-6 py-2 text-white transition-all hover:from-red-700 hover:to-orange-700"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingRule ? "Update" : "Create"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
