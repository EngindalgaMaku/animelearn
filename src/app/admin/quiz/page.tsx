"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ArrowLeft,
  Save,
  X,
  Eye,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Square,
  CheckSquare,
  Play,
  Pause,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  questionCount: number;
}

export default function QuizManagement() {
  const { user, loading } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;
  
  // Bulk selection state
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Form state for adding/editing questions
  const [formData, setFormData] = useState<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category: string;
    isActive: boolean;
  }>({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    difficulty: "beginner",
    category: "",
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      loadQuestions();
      loadCategories();
    }
  }, [user, currentPage, searchTerm, selectedCategory, selectedDifficulty]);

  const loadQuestions = async () => {
    try {
      setQuestionsLoading(true);
      
      // Build query parameters for server-side pagination and filtering
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: questionsPerPage.toString()
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);
      
      const response = await fetch(`/api/admin/quiz/questions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions || []);
        
        // Update pagination state from server response
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
          setTotalCount(data.pagination.totalCount);
        }
        
        // Update stats from server response
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Failed to load questions:', error);
      setQuestions([]);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/quiz/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Mock data for development
      setCategories([
        { id: '1', name: 'Variables', description: 'Python variables and data types', questionCount: 12 },
        { id: '2', name: 'Functions', description: 'Python functions and scope', questionCount: 8 },
        { id: '3', name: 'Data Types', description: 'Python built-in data types', questionCount: 15 },
        { id: '4', name: 'Classes', description: 'Object-oriented programming', questionCount: 10 },
        { id: '5', name: 'Loops', description: 'For and while loops', questionCount: 7 },
      ]);
    }
  };

  const handleSaveQuestion = async () => {
    try {
      const method = editingQuestion ? 'PUT' : 'POST';
      const url = editingQuestion 
        ? `/api/admin/quiz/questions/${editingQuestion.id}`
        : '/api/admin/quiz/questions';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadQuestions();
        setShowAddModal(false);
        setEditingQuestion(null);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const response = await fetch(`/api/admin/quiz/questions/${questionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadQuestions();
      }
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  // Bulk action handlers
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedQuestions(new Set());
      setIsAllSelected(false);
    } else {
      const allIds = new Set(paginatedQuestions.map(q => q.id));
      setSelectedQuestions(allIds);
      setIsAllSelected(true);
    }
  };

  const handleSelectQuestion = (questionId: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
    setIsAllSelected(newSelected.size === paginatedQuestions.length && paginatedQuestions.length > 0);
  };

  const handleBulkAction = async (action: 'delete' | 'activate' | 'deactivate') => {
    if (selectedQuestions.size === 0) return;

    const actionText = action === 'delete' ? 'delete' : action === 'activate' ? 'activate' : 'deactivate';
    if (!confirm(`Are you sure you want to ${actionText} ${selectedQuestions.size} question(s)?`)) return;

    setBulkActionLoading(true);
    try {
      const response = await fetch('/api/admin/quiz/questions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          questionIds: Array.from(selectedQuestions)
        })
      });

      if (response.ok) {
        await loadQuestions();
        setSelectedQuestions(new Set());
        setIsAllSelected(false);
      } else {
        const error = await response.json();
        alert(`Failed to ${actionText} questions: ${error.error}`);
      }
    } catch (error) {
      console.error(`Failed to ${actionText} questions:`, error);
      alert(`Failed to ${actionText} questions. Please try again.`);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      difficulty: "beginner",
      category: "",
      isActive: true,
    });
  };

  const openEditModal = (question: Question) => {
    setFormData({
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || "",
      difficulty: question.difficulty,
      category: question.category,
      isActive: question.isActive,
    });
    setEditingQuestion(question);
    setShowAddModal(true);
  };

  // Server-side pagination - no client-side filtering needed
  const paginatedQuestions = questions;
  
  // Calculate total pages from API response (we'll get this from the API)
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState<any>(null);

  // Update selection state when page changes
  useEffect(() => {
    setSelectedQuestions(new Set());
    setIsAllSelected(false);
  }, [currentPage, searchTerm, selectedCategory, selectedDifficulty]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="mt-6 text-lg font-medium text-gray-600">Loading quiz management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      
      <div className="relative z-10 py-6 lg:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    📝 Quiz Management
                  </h1>
                  <p className="text-gray-600 mt-1">Manage quiz questions and categories</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </button>
                
                <Link
                  href="/admin/quiz/categories"
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Categories
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">Total Questions</p>
                  <p className="text-3xl font-bold">{totalCount}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-200" />
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-100">Active Questions</p>
                  <p className="text-3xl font-bold">{stats?.totalActive || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-100">Categories</p>
                  <p className="text-3xl font-bold">{categories.length}</p>
                </div>
                <Filter className="h-8 w-8 text-purple-200" />
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-100">Needs Review</p>
                  <p className="text-3xl font-bold">{stats?.totalInactive || 0}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-200" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>

              <button
                onClick={() => {
                  setCurrentPage(1);
                  loadQuestions();
                }}
                className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedQuestions.size > 0 && (
            <div className="mb-6 rounded-2xl border border-white/60 bg-gradient-to-r from-blue-50 to-purple-50 p-4 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">
                    {selectedQuestions.size} question(s) selected
                  </span>
                  <button
                    onClick={() => {
                      setSelectedQuestions(new Set());
                      setIsAllSelected(false);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear selection
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    disabled={bulkActionLoading}
                    className="flex items-center px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 text-sm"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Activate
                  </button>
                  
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    disabled={bulkActionLoading}
                    className="flex items-center px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 text-sm"
                  >
                    <Pause className="h-3 w-3 mr-1" />
                    Deactivate
                  </button>
                  
                  <button
                    onClick={() => handleBulkAction('delete')}
                    disabled={bulkActionLoading}
                    className="flex items-center px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 text-sm"
                  >
                    <Trash className="h-3 w-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Questions Table */}
          <div className="rounded-2xl border border-white/60 bg-white/90 shadow-xl backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleSelectAll}
                          className="p-1 rounded hover:bg-blue-600 transition-colors"
                        >
                          {isAllSelected ? (
                            <CheckSquare className="h-4 w-4" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                        <span>Select</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Question</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Difficulty</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Created</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {questionsLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-4"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/3"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/3"></div></td>
                      </tr>
                    ))
                  ) : paginatedQuestions.length > 0 ? (
                    paginatedQuestions.map((question) => (
                      <tr key={question.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleSelectQuestion(question.id)}
                            className="p-1 rounded hover:bg-gray-200 transition-colors"
                          >
                            {selectedQuestions.has(question.id) ? (
                              <CheckSquare className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Square className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-md">
                            <p className="font-medium text-gray-900 truncate">{question.question}</p>
                            <p className="text-sm text-gray-500">{question.options.length} options</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {question.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            question.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {question.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(question.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openEditModal(question)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Edit Question"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete Question"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">No questions found</p>
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Add your first question
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * questionsPerPage) + 1} to {Math.min(currentPage * questionsPerPage, totalCount)} of {totalCount} questions
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm rounded ${
                          currentPage === page
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Add/Edit Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingQuestion ? 'Edit Question' : 'Add New Question'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingQuestion(null);
                    resetForm();
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text *
                </label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  placeholder="Enter your question..."
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer Options *
                </label>
                <div className="space-y-3">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={formData.correctAnswer === index}
                        onChange={() => setFormData({ ...formData, correctAnswer: index })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...formData.options];
                          newOptions[index] = e.target.value;
                          setFormData({ ...formData, options: newOptions });
                        }}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                        placeholder={`Option ${index + 1}...`}
                      />
                      <span className="text-sm text-gray-500 w-16">
                        {formData.correctAnswer === index ? 'Correct' : ''}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Select the radio button next to the correct answer
                </p>
              </div>

              {/* Category and Difficulty */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Explanation (Optional)
                </label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  placeholder="Explain why this is the correct answer..."
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Question is active and can be used in quizzes
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingQuestion(null);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuestion}
                disabled={!formData.question || !formData.category || formData.options.some(opt => !opt.trim())}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{editingQuestion ? 'Update Question' : 'Save Question'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}