"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Save,
  X,
  Palette,
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
  Database,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  questionCount: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function CategoryManagement() {
  const { user, loading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state for adding/editing categories
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    icon: "📂",
  });

  // Predefined colors for categories
  const predefinedColors = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444",
    "#8B5CF6", "#EC4899", "#06B6D4", "#F97316",
    "#84CC16", "#6366F1", "#F43F5E", "#14B8A6"
  ];

  // Popular icons for categories
  const predefinedIcons = [
    "📂", "📝", "⚡", "🔢", "🏗️", "🔄", "🚦", "⚠️",
    "🚀", "💡", "🎯", "🔧", "📊", "🎨", "🧩", "🎮"
  ];

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user]);

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('/api/admin/quiz/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleSaveCategory = async () => {
    try {
      const method = editingCategory ? 'PUT' : 'POST';
      const url = editingCategory 
        ? `/api/admin/quiz/categories/${editingCategory.id}`
        : '/api/admin/quiz/categories';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadCategories();
        setShowAddModal(false);
        setEditingCategory(null);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This will affect all questions in this category.')) return;

    try {
      const response = await fetch(`/api/admin/quiz/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadCategories();
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const toggleCategoryStatus = async (categoryId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/quiz/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        await loadCategories();
      }
    } catch (error) {
      console.error('Failed to toggle category status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "#3B82F6",
      icon: "📂",
    });
  };

  const openEditModal = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color,
      icon: category.icon || "📂",
    });
    setEditingCategory(category);
    setShowAddModal(true);
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="mt-6 text-lg font-medium text-gray-600">Loading category management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      
      <div className="relative z-10 py-6 lg:py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/quiz"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                    📂 Category Management
                  </h1>
                  <p className="text-gray-600 mt-1">Organize quiz questions into categories</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-100">Total Categories</p>
                  <p className="text-3xl font-bold">{categories.length}</p>
                </div>
                <Database className="h-8 w-8 text-purple-200" />
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-100">Active Categories</p>
                  <p className="text-3xl font-bold">{categories.filter(c => c.isActive).length}</p>
                </div>
                <Eye className="h-8 w-8 text-green-200" />
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">Total Questions</p>
                  <p className="text-3xl font-bold">{categories.reduce((sum, c) => sum + c.questionCount, 0)}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-200" />
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-100">Average per Category</p>
                  <p className="text-3xl font-bold">
                    {categories.length > 0 ? Math.round(categories.reduce((sum, c) => sum + c.questionCount, 0) / categories.length) : 0}
                  </p>
                </div>
                <Settings className="h-8 w-8 text-orange-200" />
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="rounded-2xl border border-white/60 bg-white/90 shadow-xl backdrop-blur-sm p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">📋 Categories</h2>
              <button
                onClick={loadCategories}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>

            {categoriesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="rounded-xl border-2 border-gray-200 p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                      category.isActive 
                        ? 'border-gray-200 bg-white hover:border-gray-300' 
                        : 'border-gray-100 bg-gray-50 opacity-60'
                    }`}
                    style={{ borderColor: category.isActive ? category.color + '40' : undefined }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-md"
                          style={{ backgroundColor: category.color }}
                        >
                          <span className="text-lg">{category.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-500">{category.questionCount} questions</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleCategoryStatus(category.id, category.isActive)}
                          className={`p-2 rounded-lg transition-colors ${
                            category.isActive 
                              ? 'text-green-600 hover:bg-green-100' 
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={category.isActive ? 'Deactivate Category' : 'Activate Category'}
                        >
                          {category.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {category.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        Created {new Date(category.createdAt).toLocaleDateString()}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Category"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">No categories found</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Create your first category
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCategory(null);
                    resetForm();
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                  placeholder="Enter category name..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                  placeholder="Describe what this category covers..."
                />
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Color
                </label>
                <div className="flex items-center space-x-3 mb-3">
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-gray-300"
                    style={{ backgroundColor: formData.color }}
                  ></div>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-16 h-8 rounded border border-gray-300"
                  />
                  <span className="text-sm text-gray-500">{formData.color}</span>
                </div>
                
                <div className="grid grid-cols-6 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        formData.color === color ? 'border-gray-600 scale-110' : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Icon
                </label>
                <div className="flex items-center space-x-3 mb-3">
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center"
                    style={{ backgroundColor: formData.color }}
                  >
                    <span className="text-lg">{formData.icon}</span>
                  </div>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-20 h-8 text-center rounded border border-gray-300"
                    maxLength={2}
                  />
                </div>
                
                <div className="grid grid-cols-8 gap-2">
                  {predefinedIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center ${
                        formData.icon === icon ? 'border-gray-600 bg-gray-100 scale-110' : 'border-gray-300 hover:scale-105 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-md"
                      style={{ backgroundColor: formData.color }}
                    >
                      <span className="text-lg">{formData.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{formData.name || 'Category Name'}</h3>
                      <p className="text-sm text-gray-500">{formData.description || 'Category description...'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCategory(null);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                disabled={!formData.name.trim()}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{editingCategory ? 'Update Category' : 'Save Category'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}