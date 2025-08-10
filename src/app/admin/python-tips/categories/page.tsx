"use client";

import { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  RefreshCw,
  Palette,
  Hash,
  Save,
  X,
} from "lucide-react";

interface PythonTipCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tips: number;
  };
}

export default function PythonTipCategoriesManagement() {
  const [categories, setCategories] = useState<PythonTipCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<PythonTipCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#3B82F6",
    icon: "",
    sortOrder: 0,
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [searchTerm, selectedStatus]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus === "active") params.set("isActive", "true");
      if (selectedStatus === "inactive") params.set("isActive", "false");
      if (searchTerm) params.set("search", searchTerm);

      const response = await fetch(
        `/api/admin/python-tips/categories?${params}`
      );
      const data = await response.json();

      if (response.ok) {
        setCategories(data.categories || []);
      } else {
        console.error("Failed to fetch categories:", data.error);
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
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.slug.trim()) {
      errors.slug = "Slug is required";
    }

    if (formData.sortOrder < 0) {
      errors.sortOrder = "Sort order must be 0 or greater";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      color: "#3B82F6",
      icon: "",
      sortOrder: 0,
      isActive: true,
    });
    setFormErrors({});
    setEditingCategory(null);
  };

  const openForm = (category?: PythonTipCategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        color: category.color,
        icon: category.icon || "",
        sortOrder: category.sortOrder,
        isActive: category.isActive,
      });
    } else {
      resetForm();
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    try {
      const url = editingCategory
        ? `/api/admin/python-tips/categories/${editingCategory.id}`
        : "/api/admin/python-tips/categories";

      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          `Category ${editingCategory ? "updated" : "created"} successfully!`
        );
        fetchCategories();
        closeForm();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (category: PythonTipCategory) => {
    try {
      const response = await fetch(
        `/api/admin/python-tips/categories/${category.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !category.isActive,
          }),
        }
      );

      if (response.ok) {
        fetchCategories();
      } else {
        alert("Failed to update category status!");
      }
    } catch (error) {
      console.error("Error toggling category status:", error);
      alert("Failed to update category status!");
    }
  };

  const deleteCategory = async (category: PythonTipCategory) => {
    if (category._count?.tips && category._count.tips > 0) {
      alert(
        "Cannot delete category that contains tips. Please move or delete all tips first."
      );
      return;
    }

    if (
      !confirm(`Are you sure you want to delete "${category.name}" category?`)
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/python-tips/categories/${category.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchCategories();
        alert("Category deleted successfully!");
      } else {
        alert("Failed to delete category!");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="relative z-10 py-6 lg:py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm lg:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-xl">
                    <Tag className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                      🏷️ Python Tip Categories
                    </h1>
                    <p className="text-gray-600">
                      Organize your Python tips into categories
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openForm()}
                  className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-600"
                >
                  <Plus className="h-5 w-5" />
                  <span>New Category</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Tag className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{categories.length}</p>
              <p className="text-sm text-blue-100">Total Categories</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Eye className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">
                {categories.filter((c) => c.isActive).length}
              </p>
              <p className="text-sm text-green-100">Active</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <Hash className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">
                {categories.reduce((acc, c) => acc + (c._count?.tips || 0), 0)}
              </p>
              <p className="text-sm text-purple-100">Total Tips</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white shadow-xl">
              <div className="mb-2 w-fit rounded-xl bg-white/20 p-2">
                <EyeOff className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">
                {categories.filter((c) => !c.isActive).length}
              </p>
              <p className="text-sm text-orange-100">Inactive</p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search categories..."
                      className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={fetchCategories}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="h-4 w-4" />
                      <span>Refresh</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Categories List */}
          <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Categories</h2>
              <div className="text-sm text-gray-600">
                Showing {categories.length} categories
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="py-12 text-center">
                <Tag className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                <h3 className="mb-2 text-xl font-medium text-gray-900">
                  No categories found
                </h3>
                <p className="mb-4 text-gray-600">
                  {searchTerm || selectedStatus !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first category to get started"}
                </p>
                <button
                  onClick={() => openForm()}
                  className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-600"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create New Category</span>
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.icon ? (
                            <span className="text-lg">{category.icon}</span>
                          ) : (
                            <Tag className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {category._count?.tips || 0} tips
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          category.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {category.description && (
                      <p className="mb-4 text-sm text-gray-600">
                        {category.description}
                      </p>
                    )}

                    <div className="mb-4 text-xs text-gray-500">
                      <p>Slug: {category.slug}</p>
                      <p>Sort: {category.sortOrder}</p>
                    </div>

                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openForm(category)}
                        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-green-50 hover:text-green-600"
                        title="Edit Category"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => toggleActive(category)}
                        className={`rounded-lg p-2 transition-colors ${
                          category.isActive
                            ? "text-green-600 hover:bg-green-50 hover:text-green-700"
                            : "text-gray-600 hover:bg-green-50 hover:text-green-600"
                        }`}
                        title={category.isActive ? "Deactivate" : "Activate"}
                      >
                        {category.isActive ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        onClick={() => deleteCategory(category)}
                        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Delete Category"
                        disabled={Boolean(
                          category._count?.tips && category._count.tips > 0
                        )}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h2>
              <button
                onClick={closeForm}
                className="rounded-lg p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className={`w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                        formErrors.name ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Category name"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.name}
                      </p>
                    )}
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
                      className={`w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                        formErrors.slug ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="category-slug"
                    />
                    {formErrors.slug && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.slug}
                      </p>
                    )}
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
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of this category"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            color: e.target.value,
                          }))
                        }
                        className="h-10 w-16 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            color: e.target.value,
                          }))
                        }
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Icon (Emoji)
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          icon: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="🐍"
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
                          sortOrder: parseInt(e.target.value) || 0,
                        }))
                      }
                      className={`w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                        formErrors.sortOrder
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      min="0"
                    />
                    {formErrors.sortOrder && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.sortOrder}
                      </p>
                    )}
                  </div>
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
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-medium text-gray-700"
                  >
                    Active (visible to users)
                  </label>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-600 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>
                        {editingCategory ? "Update" : "Create"} Category
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
