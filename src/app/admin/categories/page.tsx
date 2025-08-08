"use client";

import { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
  namingPrefixes?: string;
  namingSuffixes?: string;
  namingNames?: string;
  namingFormats?: string;
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#3B82F6",
    icon: "",
    isActive: true,
    sortOrder: 0,
    namingPrefixes: [] as string[],
    namingSuffixes: [] as string[],
    namingNames: [] as string[],
    namingFormats: [] as string[],
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url =
        isEditing && selectedCategory
          ? `/api/admin/categories/${selectedCategory.id}`
          : "/api/admin/categories";

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
        await fetchCategories();
        resetForm();
        alert(
          isEditing
            ? "Category updated successfully!"
            : "Category created successfully!"
        );
      } else {
        alert(data.error || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Error saving category");
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      color: category.color || "#3B82F6",
      icon: category.icon || "",
      isActive: category.isActive ?? true,
      sortOrder: category.sortOrder || 0,
      namingPrefixes: category.namingPrefixes ? JSON.parse(category.namingPrefixes) : [],
      namingSuffixes: category.namingSuffixes ? JSON.parse(category.namingSuffixes) : [],
      namingNames: category.namingNames ? JSON.parse(category.namingNames) : [],
      namingFormats: category.namingFormats ? JSON.parse(category.namingFormats) : [],
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`/api/admin/categories/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          await fetchCategories();
          alert("Category deleted successfully!");
        } else {
          alert(data.error || "Delete failed");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Error deleting category");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      color: "#3B82F6",
      icon: "",
      isActive: true,
      sortOrder: 0,
      namingPrefixes: [],
      namingSuffixes: [],
      namingNames: [],
      namingFormats: [],
    });
    setSelectedCategory(null);
    setIsEditing(false);
  };

  const popularIcons = [
    "🎌",
    "📚",
    "🎮",
    "🎬",
    "🚗",
    "⚡",
    "🔥",
    "💧",
    "🌍",
    "💨",
    "❄️",
    "🌑",
    "✨",
  ];

  // Helper functions for naming arrays
  const addToArray = (arrayType: 'namingPrefixes' | 'namingSuffixes' | 'namingNames' | 'namingFormats', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [arrayType]: [...prev[arrayType], value.trim()]
      }));
    }
  };

  const removeFromArray = (arrayType: 'namingPrefixes' | 'namingSuffixes' | 'namingNames' | 'namingFormats', index: number) => {
    setFormData(prev => ({
      ...prev,
      [arrayType]: prev[arrayType].filter((_, i) => i !== index)
    }));
  };

  const [newPrefix, setNewPrefix] = useState("");
  const [newSuffix, setNewSuffix] = useState("");
  const [newName, setNewName] = useState("");
  const [newFormat, setNewFormat] = useState("");

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
        <h1 className="text-3xl font-bold text-white">Categories Management</h1>
        <div className="text-sm text-gray-400">
          Total: {categories.length} categories
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-6 text-xl font-semibold text-white">
            {isEditing ? "Edit Category" : "Create New Category"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                placeholder="e.g., Anime Cards"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                placeholder="auto-generated from name"
              />
              <p className="mt-1 text-xs text-gray-500">
                URL-friendly identifier
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="Brief description of this category"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="h-10 w-12 rounded-md border border-gray-600 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="flex-1 rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sortOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Icon (Emoji)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="🎌"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {popularIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className="flex h-8 w-8 items-center justify-center rounded border border-gray-600 bg-gray-700 transition-colors hover:bg-gray-600"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Naming Rules Section */}
            <div className="space-y-4 border-t border-gray-600 pt-4">
              <h3 className="text-lg font-medium text-white">Card Naming Rules</h3>
              
              {/* Name Prefixes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Name Prefixes
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newPrefix}
                    onChange={(e) => setNewPrefix(e.target.value)}
                    className="flex-1 rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Dragon, Fire, Thunder"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray('namingPrefixes', newPrefix);
                        setNewPrefix("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addToArray('namingPrefixes', newPrefix);
                      setNewPrefix("");
                    }}
                    className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.namingPrefixes.map((prefix, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded bg-purple-600 px-2 py-1 text-xs text-white"
                    >
                      {prefix}
                      <button
                        type="button"
                        onClick={() => removeFromArray('namingPrefixes', index)}
                        className="text-purple-200 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Name Suffixes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Name Suffixes
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSuffix}
                    onChange={(e) => setNewSuffix(e.target.value)}
                    className="flex-1 rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Master, Lord, Guardian"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray('namingSuffixes', newSuffix);
                        setNewSuffix("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addToArray('namingSuffixes', newSuffix);
                      setNewSuffix("");
                    }}
                    className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.namingSuffixes.map((suffix, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded bg-purple-600 px-2 py-1 text-xs text-white"
                    >
                      {suffix}
                      <button
                        type="button"
                        onClick={() => removeFromArray('namingSuffixes', index)}
                        className="text-purple-200 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Character/Brand Names */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Character/Brand Names
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Naruto, Goku, Pikachu"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray('namingNames', newName);
                        setNewName("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addToArray('namingNames', newName);
                      setNewName("");
                    }}
                    className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.namingNames.map((name, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded bg-purple-600 px-2 py-1 text-xs text-white"
                    >
                      {name}
                      <button
                        type="button"
                        onClick={() => removeFromArray('namingNames', index)}
                        className="text-purple-200 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Naming Formats */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Naming Format Templates
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value)}
                    className="flex-1 rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., {prefix} {name} {suffix}, {name} the {suffix}"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray('namingFormats', newFormat);
                        setNewFormat("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addToArray('namingFormats', newFormat);
                      setNewFormat("");
                    }}
                    className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.namingFormats.map((format, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded bg-purple-600 px-2 py-1 text-xs text-white"
                    >
                      {format}
                      <button
                        type="button"
                        onClick={() => removeFromArray('namingFormats', index)}
                        className="text-purple-200 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Use {"{prefix}"}, {"{name}"}, {"{suffix}"} as placeholders
                </p>
              </div>
            </div>

            <div className="flex items-center">
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
                Active Category
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 rounded-md bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700"
              >
                {isEditing ? "Update Category" : "Create Category"}
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
              Category Preview
            </h3>
            <div
              className="flex items-center space-x-3 rounded-lg border-2 border-dashed border-gray-600 p-4"
              style={{
                borderColor: formData.color + "50",
                backgroundColor: formData.color + "10",
              }}
            >
              {formData.icon && (
                <span className="text-2xl">{formData.icon}</span>
              )}
              <div>
                <h4 className="font-medium text-white">
                  {formData.name || "Category Name"}
                </h4>
                <p className="text-sm text-gray-400">
                  {formData.description || "No description"}
                </p>
                <span
                  className="mt-1 inline-block rounded px-2 py-1 text-xs"
                  style={{ backgroundColor: formData.color, color: "white" }}
                >
                  {formData.slug || "category-slug"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-6 text-xl font-semibold text-white">
            Existing Categories
          </h2>

          <div className="max-h-96 space-y-4 overflow-y-auto">
            {categories.length === 0 ? (
              <p className="py-8 text-center text-gray-400">
                No categories created yet
              </p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="rounded-lg bg-gray-700 p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {category.icon && (
                        <span className="text-xl">{category.icon}</span>
                      )}
                      <div>
                        <h3 className="font-medium text-white">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {category.description}
                        </p>
                        <div className="mt-1 flex items-center space-x-2">
                          <span
                            className="inline-block rounded px-2 py-0.5 text-xs text-white"
                            style={{ backgroundColor: category.color }}
                          >
                            {category.slug}
                          </span>
                          <span className="text-xs text-gray-500">
                            {category.cardCount} cards
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded px-2 py-1 text-xs ${
                        category.isActive
                          ? "bg-green-600 text-white"
                          : "bg-gray-600 text-gray-300"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>

                    <span className="text-xs text-gray-500">
                      Order: {category.sortOrder}
                    </span>
                  </div>

                  {/* Naming Rules Display */}
                  {(category.namingPrefixes || category.namingSuffixes || category.namingNames || category.namingFormats) && (
                    <div className="mt-3 space-y-2 border-t border-gray-600 pt-2">
                      <h4 className="text-xs font-medium text-gray-300">Naming Rules:</h4>
                      
                      {category.namingPrefixes && JSON.parse(category.namingPrefixes).length > 0 && (
                        <div>
                          <span className="text-xs text-gray-400">Prefixes: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {JSON.parse(category.namingPrefixes).map((prefix: string, index: number) => (
                              <span
                                key={index}
                                className="inline-block rounded bg-blue-600 px-1.5 py-0.5 text-xs text-white"
                              >
                                {prefix}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {category.namingSuffixes && JSON.parse(category.namingSuffixes).length > 0 && (
                        <div>
                          <span className="text-xs text-gray-400">Suffixes: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {JSON.parse(category.namingSuffixes).map((suffix: string, index: number) => (
                              <span
                                key={index}
                                className="inline-block rounded bg-green-600 px-1.5 py-0.5 text-xs text-white"
                              >
                                {suffix}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {category.namingNames && JSON.parse(category.namingNames).length > 0 && (
                        <div>
                          <span className="text-xs text-gray-400">Names: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {JSON.parse(category.namingNames).map((name: string, index: number) => (
                              <span
                                key={index}
                                className="inline-block rounded bg-orange-600 px-1.5 py-0.5 text-xs text-white"
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {category.namingFormats && JSON.parse(category.namingFormats).length > 0 && (
                        <div>
                          <span className="text-xs text-gray-400">Formats: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {JSON.parse(category.namingFormats).map((format: string, index: number) => (
                              <span
                                key={index}
                                className="inline-block rounded bg-purple-600 px-1.5 py-0.5 text-xs text-white"
                              >
                                {format}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
