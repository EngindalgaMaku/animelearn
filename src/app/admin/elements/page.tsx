"use client";

import { useState, useEffect } from "react";
import {
  Zap,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  Palette,
  Settings,
  TrendingUp,
} from "lucide-react";

interface Element {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  iconUrl?: string;
  effectDescription?: string;
  priceModifier: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface ElementFormData {
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  iconUrl: string;
  effectDescription: string;
  priceModifier: number;
  isActive: boolean;
  sortOrder: number;
}

const initialFormData: ElementFormData = {
  name: "",
  slug: "",
  description: "",
  color: "#3B82F6",
  icon: "",
  iconUrl: "",
  effectDescription: "",
  priceModifier: 1.0,
  isActive: true,
  sortOrder: 0,
};

const predefinedIcons = [
  { value: "🔥", label: "Fire" },
  { value: "💧", label: "Water" },
  { value: "🌱", label: "Nature" },
  { value: "⚡", label: "Electric" },
  { value: "🌟", label: "Light" },
  { value: "🌑", label: "Dark" },
  { value: "💎", label: "Crystal" },
  { value: "🌪️", label: "Wind" },
  { value: "🗿", label: "Earth" },
  { value: "❄️", label: "Ice" },
  { value: "☀️", label: "Solar" },
  { value: "🌙", label: "Lunar" },
];

export default function ElementsPage() {
  const [elements, setElements] = useState<Element[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingElement, setEditingElement] = useState<Element | null>(null);
  const [formData, setFormData] = useState<ElementFormData>(initialFormData);

  useEffect(() => {
    fetchElements();
  }, []);

  const fetchElements = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/elements");
      if (response.ok) {
        const data = await response.json();
        setElements(data.elements || []);
      }
    } catch (error) {
      console.error("Failed to fetch elements:", error);
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
    setEditingElement(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (element: Element) => {
    setEditingElement(element);
    setFormData({
      name: element.name,
      slug: element.slug,
      description: element.description || "",
      color: element.color,
      icon: element.icon || "",
      iconUrl: element.iconUrl || "",
      effectDescription: element.effectDescription || "",
      priceModifier: element.priceModifier,
      isActive: element.isActive,
      sortOrder: element.sortOrder,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingElement(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingElement
        ? `/api/admin/elements/${editingElement.id}`
        : "/api/admin/elements";

      const method = editingElement ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchElements();
        closeModal();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to save element"}`);
      }
    } catch (error) {
      console.error("Error saving element:", error);
      alert("Failed to save element");
    }
  };

  const handleDelete = async (element: Element) => {
    if (!confirm(`Are you sure you want to delete "${element.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/elements/${element.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchElements();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to delete element"}`);
      }
    } catch (error) {
      console.error("Error deleting element:", error);
      alert("Failed to delete element");
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
              <Zap className="h-8 w-8 text-blue-600" />
              <span>Element Management</span>
            </h1>
            <p className="mt-2 text-gray-600">
              Configure card elements, effects, and pricing modifiers
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3 font-medium text-white shadow-sm transition-all hover:from-red-700 hover:to-orange-700"
          >
            <Plus className="h-5 w-5" />
            <span>Add Element</span>
          </button>
        </div>
      </div>

      {/* Elements Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {elements.map((element) => (
          <div
            key={element.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            {/* Element Header */}
            <div
              className="relative overflow-hidden p-6 text-white"
              style={{ backgroundColor: element.color }}
            >
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-3xl">{element.icon}</span>
                  <div
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      element.isActive
                        ? "bg-white/20 text-white"
                        : "bg-black/20 text-white/70"
                    }`}
                  >
                    {element.isActive ? "Active" : "Inactive"}
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-bold">{element.name}</h3>

                {element.description && (
                  <p className="text-sm leading-relaxed text-white/90">
                    {element.description}
                  </p>
                )}
              </div>

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              </div>
            </div>

            {/* Element Info */}
            <div className="p-6">
              {element.effectDescription && (
                <div className="mb-4 rounded-lg bg-gray-50 p-3">
                  <h4 className="mb-1 text-sm font-medium text-gray-700">
                    Effect
                  </h4>
                  <p className="text-sm text-gray-600">
                    {element.effectDescription}
                  </p>
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price Modifier:</span>
                  <span className="flex items-center space-x-1 font-medium">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span>{element.priceModifier}x</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sort Order:</span>
                  <span className="font-medium">{element.sortOrder}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Slug:</span>
                  <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                    {element.slug}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end space-x-2 border-t border-gray-200 pt-4">
                <button
                  onClick={() => openEditModal(element)}
                  className="flex items-center space-x-1 rounded-lg px-3 py-2 text-blue-600 transition-colors hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(element)}
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
      {elements.length === 0 && (
        <div className="py-12 text-center">
          <Zap className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-xl font-medium text-gray-900">
            No Elements Found
          </h3>
          <p className="mb-6 text-gray-600">
            Create your first element to get started.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3 font-medium text-white transition-all hover:from-red-700 hover:to-orange-700"
          >
            <Plus className="h-5 w-5" />
            <span>Add First Element</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingElement ? "Edit Element" : "Create New Element"}
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

                <div className="grid gap-4 md:grid-cols-2">
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

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Effect Description
                  </label>
                  <textarea
                    value={formData.effectDescription}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        effectDescription: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                    rows={2}
                    placeholder="Describe what this element does..."
                  />
                </div>
              </div>

              {/* Visual Design */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Visual Design
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Color *
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
                      Icon
                    </label>
                    <select
                      value={formData.icon}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          icon: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select an icon...</option>
                      {predefinedIcons.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.value} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Icon URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.iconUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        iconUrl: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                    placeholder="https://example.com/icon.png"
                  />
                </div>
              </div>

              {/* Game Mechanics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Game Mechanics
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Price Modifier
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.priceModifier}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          priceModifier: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                      min="0.1"
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

              {/* Preview */}
              {(formData.name || formData.icon) && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-3 text-sm font-medium text-gray-700">
                    Preview
                  </h4>
                  <div
                    className="inline-flex items-center space-x-2 rounded-lg px-4 py-2 font-medium text-white"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.icon && (
                      <span className="text-lg">{formData.icon}</span>
                    )}
                    <span>{formData.name || "Element Name"}</span>
                    {formData.priceModifier !== 1 && (
                      <span className="rounded bg-white/20 px-2 py-1 text-xs">
                        {formData.priceModifier}x
                      </span>
                    )}
                  </div>
                </div>
              )}

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
                  <span>{editingElement ? "Update" : "Create"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
