"use client";

import { useState, useEffect } from "react";

interface CardStyle {
  id: string;
  name: string;
  targetType: string;
  targetValue: string;
  containerClass?: string;
  imageClass?: string;
  borderClass?: string;
  backgroundClass?: string;
  animationClass?: string;
  glowEffect?: string;
  hoverEffect?: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

interface Rarity {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface Element {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export default function CardStylesManagement() {
  const [styles, setStyles] = useState<CardStyle[]>([]);
  const [rarities, setRarities] = useState<Rarity[]>([]);
  const [elements, setElements] = useState<Element[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState<CardStyle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    targetType: "rarity",
    targetValue: "",
    containerClass: "",
    imageClass: "",
    borderClass: "",
    backgroundClass: "",
    animationClass: "",
    glowEffect: "",
    hoverEffect: "",
    isActive: true,
    priority: 0,
  });

  useEffect(() => {
    fetchStyles();
    fetchRarities();
    fetchElements();
    fetchCategories();
  }, []);

  const fetchStyles = async () => {
    try {
      const response = await fetch("/api/admin/card-styles");
      const data = await response.json();
      if (data.success) {
        setStyles(data.styles);
      }
    } catch (error) {
      console.error("Error fetching styles:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRarities = async () => {
    try {
      const response = await fetch("/api/admin/rarities");
      const data = await response.json();
      if (data.success) {
        setRarities(data.rarities);
      }
    } catch (error) {
      console.error("Error fetching rarities:", error);
    }
  };

  const fetchElements = async () => {
    try {
      const response = await fetch("/api/admin/elements");
      const data = await response.json();
      if (data.success) {
        setElements(data.elements);
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getTargetOptions = () => {
    switch (formData.targetType) {
      case "rarity":
        return rarities.map((r) => ({ value: r.slug, label: r.name }));
      case "element":
        return elements.map((e) => ({
          value: e.slug,
          label: `${e.icon} ${e.name}`,
        }));
      case "category":
        return categories.map((c) => ({ value: c.slug, label: c.name }));
      default:
        return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url =
        isEditing && selectedStyle
          ? `/api/admin/card-styles/${selectedStyle.id}`
          : "/api/admin/card-styles";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchStyles();
        resetForm();
        alert(
          isEditing
            ? "Style updated successfully!"
            : "Style created successfully!"
        );
      } else {
        alert(data.error || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving style:", error);
      alert("Error saving style");
    }
  };

  const handleEdit = (style: CardStyle) => {
    setSelectedStyle(style);
    setFormData({
      name: style.name,
      targetType: style.targetType,
      targetValue: style.targetValue,
      containerClass: style.containerClass || "",
      imageClass: style.imageClass || "",
      borderClass: style.borderClass || "",
      backgroundClass: style.backgroundClass || "",
      animationClass: style.animationClass || "",
      glowEffect: style.glowEffect || "",
      hoverEffect: style.hoverEffect || "",
      isActive: style.isActive,
      priority: style.priority,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this style?")) {
      try {
        const response = await fetch(`/api/admin/card-styles/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          await fetchStyles();
          alert("Style deleted successfully!");
        } else {
          alert(data.error || "Delete failed");
        }
      } catch (error) {
        console.error("Error deleting style:", error);
        alert("Error deleting style");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      targetType: "rarity",
      targetValue: "",
      containerClass: "",
      imageClass: "",
      borderClass: "",
      backgroundClass: "",
      animationClass: "",
      glowEffect: "",
      hoverEffect: "",
      isActive: true,
      priority: 0,
    });
    setSelectedStyle(null);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">
          Card Styles Management
        </h1>
        <div className="text-sm text-gray-400">
          Total: {styles.length} styles
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-6 text-xl font-semibold text-white">
            {isEditing ? "Edit Style" : "Create New Style"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Style Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                placeholder="e.g., Legendary Glow"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Target Type *
                </label>
                <select
                  value={formData.targetType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetType: e.target.value,
                      targetValue: "",
                    })
                  }
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="rarity">Rarity</option>
                  <option value="element">Element</option>
                  <option value="category">Category</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Target Value *
                </label>
                <select
                  value={formData.targetValue}
                  onChange={(e) =>
                    setFormData({ ...formData, targetValue: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select {formData.targetType}</option>
                  {getTargetOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Priority
                </label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Higher priority applies first
                </p>
              </div>

              <div className="flex items-center pt-7">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="mr-2 rounded focus:ring-purple-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-300">
                  Active Style
                </label>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Container CSS Classes
              </label>
              <input
                type="text"
                value={formData.containerClass}
                onChange={(e) =>
                  setFormData({ ...formData, containerClass: e.target.value })
                }
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., legendary-border shadow-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Image CSS Classes
                </label>
                <input
                  type="text"
                  value={formData.imageClass}
                  onChange={(e) =>
                    setFormData({ ...formData, imageClass: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., rounded-lg brightness-110"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Border CSS Classes
                </label>
                <input
                  type="text"
                  value={formData.borderClass}
                  onChange={(e) =>
                    setFormData({ ...formData, borderClass: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., border-4 border-yellow-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Background CSS Classes
              </label>
              <input
                type="text"
                value={formData.backgroundClass}
                onChange={(e) =>
                  setFormData({ ...formData, backgroundClass: e.target.value })
                }
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., bg-gradient-to-br from-yellow-400 to-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Animation Classes
                </label>
                <input
                  type="text"
                  value={formData.animationClass}
                  onChange={(e) =>
                    setFormData({ ...formData, animationClass: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., animate-pulse animate-bounce"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Glow Effect
                </label>
                <input
                  type="text"
                  value={formData.glowEffect}
                  onChange={(e) =>
                    setFormData({ ...formData, glowEffect: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., drop-shadow(0 0 10px #ffd700)"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Hover Effect
              </label>
              <input
                type="text"
                value={formData.hoverEffect}
                onChange={(e) =>
                  setFormData({ ...formData, hoverEffect: e.target.value })
                }
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., hover:scale-105 transition-transform"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 rounded-md bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700"
              >
                {isEditing ? "Update Style" : "Create Style"}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-md bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Live Preview */}
          <div className="mt-6">
            <h3 className="mb-3 text-lg font-medium text-white">
              Style Preview
            </h3>
            <div
              className={`flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-600 text-white ${formData.containerClass} ${formData.borderClass} ${formData.backgroundClass}`}
              style={{
                filter: formData.glowEffect || undefined,
              }}
            >
              <span className={`text-sm font-medium ${formData.imageClass}`}>
                Card Preview ({formData.targetType}:{" "}
                {formData.targetValue || "None"})
              </span>
            </div>
          </div>
        </div>

        {/* Styles List */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-6 text-xl font-semibold text-white">
            Existing Styles
          </h2>

          <div className="max-h-96 space-y-4 overflow-y-auto">
            {styles.length === 0 ? (
              <p className="py-8 text-center text-gray-400">
                No styles created yet
              </p>
            ) : (
              styles.map((style) => (
                <div key={style.id} className="rounded-lg bg-gray-700 p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-white">{style.name}</h3>
                      <p className="text-sm text-gray-400">
                        {style.targetType}: {style.targetValue}
                      </p>
                      <p className="text-xs text-purple-400">
                        Priority: {style.priority}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(style)}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(style.id)}
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded px-2 py-1 text-xs ${
                        style.isActive
                          ? "bg-green-600 text-white"
                          : "bg-gray-600 text-gray-300"
                      }`}
                    >
                      {style.isActive ? "Active" : "Inactive"}
                    </span>

                    {/* Mini preview */}
                    <div
                      className={`flex h-8 w-16 items-center justify-center rounded border text-xs text-white ${style.containerClass || "bg-gray-600"}`}
                    >
                      Preview
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
