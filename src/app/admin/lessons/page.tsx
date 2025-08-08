"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Trophy,
  Star,
  Code,
  Play,
  CheckCircle,
  Clock,
  Users,
  Award,
  Target,
  Zap,
  X,
  ChevronDown,
  ChevronRight,
  Eye,
  Copy,
  Layers,
  FileText,
  Palette,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ExamplesManager from "@/components/admin/ExamplesManager";
import LessonSectionsManager from "@/components/admin/LessonSectionsManager";
import CodeBlock from "@/components/ui/CodeBlock";
import { AdminLesson, LessonFormData, LessonStats, LessonsResponse } from '@/types/admin'

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("order");

  // Modal states
  const [selectedLesson, setSelectedLesson] = useState<AdminLesson | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'examples' | 'sections' | 'advanced'>('basic');

  // Form states
  const [lessonForm, setLessonForm] = useState<LessonFormData>({
    title: "",
    slug: "",
    description: "",
    content: "",
    difficulty: 1,
    order: 1,
    duration: 30,
    category: "python-basics",
    hasCodeExercise: false,
    starterCode: "",
    solutionCode: "",
    testCases: "",
    hints: "",
    prerequisites: "",
    diamondReward: 10,
    experienceReward: 50,
    isPublished: false,
    examples: [],
    sections: [],
    tags: [],
    learningObjectives: [],
    resources: [],
  });
  
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);

  // Stats
  const [stats, setStats] = useState<LessonStats>({
    totalCodeArenas: 0,
    publishedCodeArenas: 0,
    draftCodeArenas: 0,
    totalStudents: 0,
    averageCompletion: 0,
    categoryCounts: {},
    difficultyDistribution: {},
  });

  // Categories for Python lessons
  const categories = [
    { value: "python-basics", label: "Python Basics", icon: "🐍" },
    { value: "data-types", label: "Data Types", icon: "📊" },
    { value: "control-flow", label: "Control Flow", icon: "🔄" },
    { value: "functions", label: "Functions", icon: "⚙️" },
    { value: "oop", label: "Object-Oriented Programming", icon: "🏗️" },
    { value: "data-structures", label: "Data Structures", icon: "📋" },
    { value: "algorithms", label: "Algorithms", icon: "🧮" },
    { value: "file-handling", label: "File Handling", icon: "📁" },
    { value: "error-handling", label: "Error Handling", icon: "⚠️" },
    { value: "libraries", label: "Libraries & Modules", icon: "📚" },
    { value: "web-dev", label: "Web Development", icon: "🌐" },
    { value: "data-science", label: "Data Science", icon: "📈" },
    { value: "advanced", label: "Advanced Topics", icon: "🚀" },
  ];

  const difficulties = [
    { value: 1, label: "Beginner", color: "bg-green-100 text-green-800" },
    { value: 2, label: "Easy", color: "bg-blue-100 text-blue-800" },
    { value: 3, label: "Intermediate", color: "bg-yellow-100 text-yellow-800" },
    { value: 4, label: "Hard", color: "bg-orange-100 text-orange-800" },
    { value: 5, label: "Expert", color: "bg-red-100 text-red-800" },
  ];

  useEffect(() => {
    fetchLessons();
    fetchStats();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLessons();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterCategory, filterDifficulty, filterStatus, sortBy]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(filterCategory && { category: filterCategory }),
        ...(filterDifficulty && { difficulty: filterDifficulty }),
        ...(filterStatus && { status: filterStatus }),
        ...(sortBy && { sortBy: sortBy }),
      });

      const response = await fetch(`/api/admin/lessons?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLessons(data.lessons || []);
      }
    } catch (error) {
      console.error("Lessons fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/lessons/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Stats fetch failed:", error);
    }
  };

  const createLesson = async () => {
    if (!lessonForm.title || !lessonForm.description) {
      alert("Title and description are required");
      return;
    }

    setCreating(true);
    try {
      const response = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonForm),
      });

      if (response.ok) {
        setShowCreateModal(false);
        resetForm();
        fetchLessons();
        fetchStats();
        showSuccess("Lesson created successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to create lesson: ${error.error}`);
      }
    } catch (error) {
      console.error("Lesson creation failed:", error);
      alert("Failed to create lesson");
    } finally {
      setCreating(false);
    }
  };

  const updateLesson = async () => {
    if (!selectedLesson) return;

    setEditing(true);
    try {
      const response = await fetch("/api/admin/lessons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: selectedLesson.id,
          ...lessonForm,
        }),
      });

      if (response.ok) {
        setShowEditModal(false);
        setSelectedLesson(null);
        fetchLessons();
        fetchStats();
        showSuccess("Lesson updated successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to update lesson: ${error.error}`);
      }
    } catch (error) {
      console.error("Lesson update failed:", error);
      alert("Failed to update lesson");
    } finally {
      setEditing(false);
    }
  };

  const deleteLesson = async (lessonId: string, lessonTitle: string) => {
    if (!confirm(`Are you sure you want to delete lesson "${lessonTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/lessons?lessonId=${lessonId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchLessons();
        fetchStats();
        showSuccess("Lesson deleted successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to delete lesson: ${error.error}`);
      }
    } catch (error) {
      console.error("Lesson deletion failed:", error);
      alert("Failed to delete lesson");
    }
  };

  const togglePublishStatus = async (lessonId: string, isPublished: boolean) => {
    try {
      const response = await fetch("/api/admin/lessons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          isPublished: !isPublished,
        }),
      });

      if (response.ok) {
        fetchLessons();
        fetchStats();
        showSuccess(`Lesson ${!isPublished ? "published" : "unpublished"} successfully!`);
      } else {
        const error = await response.json();
        alert(`Failed to update lesson status: ${error.error}`);
      }
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Failed to update lesson status");
    }
  };

  const duplicateLesson = async (lesson: AdminLesson) => {
    try {
      const response = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lesson,
          title: `${lesson.title} (Copy)`,
          slug: `${lesson.slug}-copy`,
          isPublished: false,
          order: lesson.order + 1,
        }),
      });

      if (response.ok) {
        fetchLessons();
        fetchStats();
        showSuccess("Lesson duplicated successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to duplicate lesson: ${error.error}`);
      }
    } catch (error) {
      console.error("Lesson duplication failed:", error);
      alert("Failed to duplicate lesson");
    }
  };

  const openEditModal = (lesson: AdminLesson) => {
    setSelectedLesson(lesson);
    setLessonForm({
      title: lesson.title,
      slug: lesson.slug,
      description: lesson.description,
      content: lesson.content,
      difficulty: lesson.difficulty,
      order: lesson.order,
      duration: lesson.duration,
      category: lesson.category,
      hasCodeExercise: lesson.hasCodeExercise,
      starterCode: lesson.starterCode || "",
      solutionCode: lesson.solutionCode || "",
      testCases: lesson.testCases || "",
      hints: lesson.hints || "",
      prerequisites: lesson.prerequisites || "",
      diamondReward: lesson.diamondReward,
      experienceReward: lesson.experienceReward,
      isPublished: lesson.isPublished,
      examples: lesson.examples || [],
      sections: lesson.sections || [],
      tags: lesson.tags || [],
      learningObjectives: lesson.learningObjectives || [],
      resources: lesson.resources || [],
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setLessonForm({
      title: "",
      slug: "",
      description: "",
      content: "",
      difficulty: 1,
      order: 1,
      duration: 30,
      category: "python-basics",
      hasCodeExercise: false,
      starterCode: "",
      solutionCode: "",
      testCases: "",
      hints: "",
      prerequisites: "",
      diamondReward: 10,
      experienceReward: 50,
      isPublished: false,
      examples: [],
      sections: [],
      tags: [],
      learningObjectives: [],
      resources: [],
    });
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };

  const generateSlugFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const getDifficultyInfo = (difficulty: number) => {
    return difficulties.find(d => d.value === difficulty) || difficulties[0];
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category) || categories[0];
  };

  // Content preview and template functions
  const renderContentPreview = (content: string) => {
    if (!content) return null;

    // Handle existing HTML content and code blocks
    const parts = content.split(/(```[\s\S]*?```)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeContent = part.slice(3, -3).trim();
        const lines = codeContent.split('\n');
        const language = lines[0].includes('python') ? 'python' : 'python';
        const code = lines.slice(1).join('\n') || codeContent;
        
        return (
          <div key={index} className="my-4">
            <CodeBlock
              code={code}
              language={language}
              title="Code Preview"
            />
          </div>
        );
      }
      
      // For HTML content that's already in the database, render it safely
      if (part.includes('<') && part.includes('>')) {
        // Clean and format the HTML
        const cleanHTML = part
          .replace(/<h3>/g, '<h3 class="text-lg font-semibold mb-3 text-gray-900">')
          .replace(/<h2>/g, '<h2 class="text-xl font-semibold mb-4 text-gray-900">')
          .replace(/<h1>/g, '<h1 class="text-2xl font-bold mb-4 text-gray-900">')
          .replace(/<div>/g, '<div class="mb-4">')
          .replace(/<p>/g, '<p class="mb-3 text-gray-700 leading-relaxed">')
          .replace(/<br\/>/g, '<br/>')
          .replace(/<br>/g, '<br/>')
          .replace(/⚡/g, '<span class="text-yellow-600">⚡</span>')
          .replace(/🎯/g, '<span class="text-blue-600">🎯</span>')
          .replace(/💡/g, '<span class="text-yellow-500">💡</span>')
          .replace(/🔥/g, '<span class="text-red-500">🔥</span>')
          .replace(/🐍/g, '<span class="text-green-600">🐍</span>')
          .replace(/⭐/g, '<span class="text-yellow-500">⭐</span>')
          .replace(/🚀/g, '<span class="text-purple-600">🚀</span>');
          
        return (
          <div key={index} className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
          </div>
        );
      }
      
      // Fallback for plain text - markdown style
      const lines = part.split('\n').filter(line => line.trim());
      return (
        <div key={index} className="prose prose-lg max-w-none space-y-4">
          {lines.map((line, lineIndex) => {
            // Handle headers
            if (line.startsWith('# ')) {
              return <h1 key={lineIndex} className="text-2xl font-bold mb-4 text-gray-900">{line.slice(2)}</h1>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={lineIndex} className="text-xl font-semibold mb-3 text-gray-900">{line.slice(3)}</h2>;
            }
            if (line.startsWith('### ')) {
              return <h3 key={lineIndex} className="text-lg font-medium mb-2 text-gray-900">{line.slice(4)}</h3>;
            }
            
            // Handle lists
            if (line.startsWith('- ')) {
              return <li key={lineIndex} className="ml-4 text-gray-700 mb-2">• {line.slice(2)}</li>;
            }
            
            // Regular paragraph
            return (
              <p key={lineIndex} className="mb-4 text-gray-700 leading-relaxed">
                {line}
              </p>
            );
          })}
        </div>
      );
    });
  };

  const insertTemplate = (type: 'codeblock' | 'example' | 'tip' | 'exercise') => {
    const templates = {
      codeblock: `\n\`\`\`python
# Write your Python code here
print("Hello, World!")
\`\`\`\n`,
      example: `\n## 💡 Example
Let's see this in action:

\`\`\`python
# Example code
example_variable = "Hello"
print(example_variable)
\`\`\`

This example shows how to...\n`,
      tip: `\n💭 **Tip:** Remember to always test your code with different inputs to make sure it works correctly!\n`,
      exercise: `\n## 🎯 Practice Exercise
Try to write a program that:
1. Does something specific
2. Handles edge cases
3. Produces the expected output

\`\`\`python
# Your code here
pass
\`\`\`\n`
    };

    const template = templates[type];
    setLessonForm({
      ...lessonForm,
      content: lessonForm.content + template
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Python Lessons Management</h1>
          <p className="mt-2 text-gray-600">
            {stats.totalCodeArenas} lessons • {stats.publishedCodeArenas} published • {stats.totalStudents} students
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Stats Cards */}
          <div className="flex space-x-4">
            <div className="rounded-lg bg-blue-50 p-3 text-center">
              <div className="text-sm font-medium text-blue-600">Total</div>
              <div className="text-xl font-bold text-blue-900">{stats.totalCodeArenas}</div>
            </div>
            <div className="rounded-lg bg-green-50 p-3 text-center">
              <div className="text-sm font-medium text-green-600">Published</div>
              <div className="text-xl font-bold text-green-900">{stats.publishedCodeArenas}</div>
            </div>
            <div className="rounded-lg bg-purple-50 p-3 text-center">
              <div className="text-sm font-medium text-purple-600">Students</div>
              <div className="text-xl font-bold text-purple-900">{stats.totalStudents}</div>
            </div>
            <div className="rounded-lg bg-yellow-50 p-3 text-center">
              <div className="text-sm font-medium text-yellow-600">Completion</div>
              <div className="text-xl font-bold text-yellow-900">{stats.averageCompletion}%</div>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-5 w-5" />
            <span>Create Lesson</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Difficulties</option>
              {difficulties.map((diff) => (
                <option key={diff.value} value={diff.value}>
                  {diff.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600">
            Showing {lessons.length} lessons
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="order">Order</option>
              <option value="title">Title</option>
              <option value="difficulty">Difficulty</option>
              <option value="category">Category</option>
              <option value="date">Date Created</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      {lessons.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-gray-400">
            <BookOpen className="mx-auto h-16 w-16" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">No lessons found</h3>
          <p className="text-gray-600">Create your first Python lesson to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson) => {
            const difficultyInfo = getDifficultyInfo(lesson.difficulty);
            const categoryInfo = getCategoryInfo(lesson.category);
            
            return (
              <div
                key={lesson.id}
                className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${difficultyInfo.color}`}>
                        {difficultyInfo.label}
                      </span>
                      <span className="inline-flex items-center space-x-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                        <span>{categoryInfo.icon}</span>
                        <span>{categoryInfo.label}</span>
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          lesson.isPublished
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {lesson.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    
                    <p className="mb-3 text-gray-600">{lesson.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{lesson.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="h-4 w-4" />
                        <span>Order: {lesson.order}</span>
                      </div>
                      {lesson.hasCodeExercise && (
                        <div className="flex items-center space-x-1">
                          <Code className="h-4 w-4" />
                          <span>Code Exercise</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Trophy className="h-4 w-4" />
                        <span>{lesson.diamondReward} 💎</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="h-4 w-4" />
                        <span>{lesson.experienceReward} XP</span>
                      </div>
                      {lesson._count && (
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{lesson._count.progress} students</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedLesson(lesson);
                        setShowPreviewModal(true);
                      }}
                      className="rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => duplicateLesson(lesson)}
                      className="rounded-md bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(lesson)}
                      className="rounded-md bg-green-100 p-2 text-green-600 hover:bg-green-200"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => togglePublishStatus(lesson.id, lesson.isPublished)}
                      className={`rounded-md p-2 ${
                        lesson.isPublished
                          ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      }`}
                      title={lesson.isPublished ? "Unpublish" : "Publish"}
                    >
                      {lesson.isPublished ? <X className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => deleteLesson(lesson.id, lesson.title)}
                      className="rounded-md bg-red-100 p-2 text-red-600 hover:bg-red-200"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="animate-in fade-in zoom-in mx-4 transform rounded-2xl bg-white p-8 shadow-2xl transition-all duration-300">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">Success!</h3>
              <p className="text-gray-600">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold text-gray-900">
                {showCreateModal ? "Create New Lesson" : "Edit Lesson"}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setSelectedLesson(null);
                  resetForm();
                }}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabbed Interface */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {[
                  { id: 'basic', name: 'Basic Info', icon: FileText },
                  { id: 'content', name: 'Rich Content', icon: Palette },
                  { id: 'examples', name: 'Examples', icon: Code },
                  { id: 'sections', name: 'Sections', icon: Layers },
                  { id: 'advanced', name: 'Advanced', icon: Target }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } flex items-center space-x-2 border-b-2 py-4 px-1 text-sm font-medium`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-6 p-6">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setLessonForm({
                        ...lessonForm,
                        title,
                        slug: generateSlugFromTitle(title),
                      });
                    }}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter lesson title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={lessonForm.slug}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, slug: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="lesson-slug"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  value={lessonForm.description}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, description: e.target.value })
                  }
                  rows={3}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Brief description of the lesson"
                />
              </div>

              {/* Lesson Details */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={lessonForm.category}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, category: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Difficulty
                  </label>
                  <select
                    value={lessonForm.difficulty}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, difficulty: parseInt(e.target.value) })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  >
                    {difficulties.map((diff) => (
                      <option key={diff.value} value={diff.value}>
                        {diff.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Order
                  </label>
                  <input
                    type="number"
                    value={lessonForm.order}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, order: parseInt(e.target.value) || 1 })
                    }
                    min="1"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={lessonForm.duration}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, duration: parseInt(e.target.value) || 30 })
                    }
                    min="1"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Rewards */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    💎 Diamond Reward
                  </label>
                  <input
                    type="number"
                    value={lessonForm.diamondReward}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, diamondReward: parseInt(e.target.value) || 10 })
                    }
                    min="0"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ⚡ Experience Reward
                  </label>
                  <input
                    type="number"
                    value={lessonForm.experienceReward}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, experienceReward: parseInt(e.target.value) || 50 })
                    }
                    min="0"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lesson Content
                </label>
                <textarea
                  value={lessonForm.content}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, content: e.target.value })
                  }
                  rows={8}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Write your lesson content here. You can use Markdown formatting."
                />
              </div>

              {/* Code Exercise */}
              <div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasCodeExercise"
                    checked={lessonForm.hasCodeExercise}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, hasCodeExercise: e.target.checked })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="hasCodeExercise" className="text-sm font-medium text-gray-700">
                    This lesson includes a code exercise
                  </label>
                </div>

                {lessonForm.hasCodeExercise && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Starter Code
                      </label>
                      <textarea
                        value={lessonForm.starterCode}
                        onChange={(e) =>
                          setLessonForm({ ...lessonForm, starterCode: e.target.value })
                        }
                        rows={4}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
                        placeholder="# Write starter code here"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Solution Code
                      </label>
                      <textarea
                        value={lessonForm.solutionCode}
                        onChange={(e) =>
                          setLessonForm({ ...lessonForm, solutionCode: e.target.value })
                        }
                        rows={4}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
                        placeholder="# Write solution code here"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Test Cases (JSON)
                      </label>
                      <textarea
                        value={lessonForm.testCases}
                        onChange={(e) =>
                          setLessonForm({ ...lessonForm, testCases: e.target.value })
                        }
                        rows={3}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
                        placeholder='[{"input": [1, 2], "expected": 3}]'
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Prerequisites
                  </label>
                  <textarea
                    value={lessonForm.prerequisites}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, prerequisites: e.target.value })
                    }
                    rows={2}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="List any prerequisites"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hints
                  </label>
                  <textarea
                    value={lessonForm.hints}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, hints: e.target.value })
                    }
                    rows={2}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Add helpful hints"
                  />
                </div>
              </div>

              {/* Publish Status */}
              <div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={lessonForm.isPublished}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, isPublished: e.target.checked })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                    Publish this lesson immediately
                  </label>
                </div>
                  </div>
                </div>
              )}

              {/* Rich Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Content Editor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        📝 Lesson Content Editor
                      </label>
                      <div className="border rounded-lg bg-white">
                        <div className="border-b bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
                          Markdown Editor
                        </div>
                        <textarea
                          value={lessonForm.content}
                          onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                          rows={20}
                          className="w-full border-0 p-4 font-mono text-sm focus:ring-0 resize-none"
                          placeholder={`Write your lesson content here using Markdown...

Examples:
# Heading
This is a paragraph with **bold** and *italic* text.

\`\`\`python
# This is a code block
print("Hello, World!")
x = 10
y = 20
result = x + y
print(f"The sum is: {result}")
\`\`\`

- List item 1
- List item 2`}
                        />
                      </div>
                      
                      {/* Content Guidelines */}
                      <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-4">
                        <h4 className="font-medium text-blue-900 mb-2">📚 Content Guidelines</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Use <code className="bg-blue-100 px-1 rounded">```python</code> for code blocks</li>
                          <li>• Split content into logical sections</li>
                          <li>• Include practical examples</li>
                          <li>• Use headers for organization</li>
                        </ul>
                      </div>
                    </div>
                    
                    {/* Live Preview */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        👁️ Live Preview
                      </label>
                      <div className="border rounded-lg bg-white">
                        <div className="border-b bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
                          How students will see it
                        </div>
                        <div className="p-4 max-h-96 overflow-y-auto">
                          {lessonForm.content ? (
                            <div className="prose prose-sm max-w-none">
                              {renderContentPreview(lessonForm.content)}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">Preview will appear here as you type...</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Quick Insert Templates */}
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => insertTemplate('codeblock')}
                          className="text-left p-3 bg-green-50 border border-green-200 rounded-lg text-sm hover:bg-green-100 transition-colors"
                        >
                          <div className="font-medium text-green-800">🐍 Python Code</div>
                          <div className="text-green-600 text-xs">Insert code block</div>
                        </button>
                        <button
                          onClick={() => insertTemplate('example')}
                          className="text-left p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm hover:bg-purple-100 transition-colors"
                        >
                          <div className="font-medium text-purple-800">💡 Example</div>
                          <div className="text-purple-600 text-xs">Insert example section</div>
                        </button>
                        <button
                          onClick={() => insertTemplate('tip')}
                          className="text-left p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                        >
                          <div className="font-medium text-blue-800">💭 Tip</div>
                          <div className="text-blue-600 text-xs">Insert tip callout</div>
                        </button>
                        <button
                          onClick={() => insertTemplate('exercise')}
                          className="text-left p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm hover:bg-orange-100 transition-colors"
                        >
                          <div className="font-medium text-orange-800">🎯 Exercise</div>
                          <div className="text-orange-600 text-xs">Insert exercise</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Examples Tab */}
              {activeTab === 'examples' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lesson Examples
                    </label>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <p className="text-sm text-gray-600">Examples Manager will be integrated here</p>
                      <div className="mt-2 text-xs text-gray-500">
                        Current examples: {lessonForm.examples.length}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sections Tab */}
              {activeTab === 'sections' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lesson Sections
                    </label>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <p className="text-sm text-gray-600">Sections Manager will be integrated here</p>
                      <div className="mt-2 text-xs text-gray-500">
                        Current sections: {lessonForm.sections.length}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Tab */}
              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={lessonForm.tags.join(', ')}
                      onChange={(e) =>
                        setLessonForm({
                          ...lessonForm,
                          tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                        })
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="python, basics, variables (comma separated)"
                    />
                  </div>

                  {/* Learning Objectives */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Learning Objectives
                    </label>
                    <textarea
                      value={lessonForm.learningObjectives.join('\n')}
                      onChange={(e) =>
                        setLessonForm({
                          ...lessonForm,
                          learningObjectives: e.target.value.split('\n').filter(Boolean)
                        })
                      }
                      rows={4}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="List learning objectives (one per line)"
                    />
                  </div>

                  {/* Resources */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Additional Resources
                    </label>
                    <textarea
                      value={lessonForm.resources.join('\n')}
                      onChange={(e) =>
                        setLessonForm({
                          ...lessonForm,
                          resources: e.target.value.split('\n').filter(Boolean)
                        })
                      }
                      rows={4}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="List additional resources (URLs, books, etc. - one per line)"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3 border-t p-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setSelectedLesson(null);
                  resetForm();
                }}
                disabled={creating || editing}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={showCreateModal ? createLesson : updateLesson}
                disabled={creating || editing}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating || editing ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    {showCreateModal ? "Creating..." : "Updating..."}
                  </div>
                ) : (
                  showCreateModal ? "Create Lesson" : "Update Lesson"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  📖 Lesson Preview
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedLesson.title} • {getCategoryInfo(selectedLesson.category).label}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setSelectedLesson(null);
                }}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-6">
              {/* Lesson Header */}
              <div className="mb-6 rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedLesson.title}
                    </h1>
                    <p className="text-gray-700 mb-4">
                      {selectedLesson.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getDifficultyInfo(selectedLesson.difficulty).color}`}>
                        {getDifficultyInfo(selectedLesson.difficulty).label}
                      </span>
                      <span className="flex items-center space-x-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{selectedLesson.duration} min</span>
                      </span>
                      <span className="flex items-center space-x-1 text-gray-600">
                        <Trophy className="h-4 w-4" />
                        <span>{selectedLesson.diamondReward} 💎</span>
                      </span>
                      <span className="flex items-center space-x-1 text-gray-600">
                        <Zap className="h-4 w-4" />
                        <span>{selectedLesson.experienceReward} XP</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Preview */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Lesson Content
                  </h3>
                  <div className="rounded-lg border bg-white p-6">
                    {selectedLesson.content ? (
                      <div className="prose prose-lg max-w-none">
                        {renderContentPreview(selectedLesson.content)}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No content available</p>
                    )}
                  </div>
                </div>

                {/* Code Exercise Preview */}
                {selectedLesson.hasCodeExercise && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      Code Exercise
                    </h3>
                    <div className="space-y-4">
                      {selectedLesson.starterCode && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Starter Code:</h4>
                          <CodeBlock
                            code={selectedLesson.starterCode}
                            language="python"
                            title="Starter Code"
                          />
                        </div>
                      )}
                      {selectedLesson.solutionCode && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Solution:</h4>
                          <CodeBlock
                            code={selectedLesson.solutionCode}
                            language="python"
                            title="Solution Code"
                          />
                        </div>
                      )}
                      {selectedLesson.hints && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Hints:</h4>
                          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                            <p className="text-yellow-800">{selectedLesson.hints}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedLesson.prerequisites && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Prerequisites:</h4>
                      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                        <p className="text-blue-800 text-sm">{selectedLesson.prerequisites}</p>
                      </div>
                    </div>
                  )}
                  {selectedLesson.tags && selectedLesson.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Tags:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLesson.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t p-6">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    openEditModal(selectedLesson);
                  }}
                  className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Lesson</span>
                </button>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    setSelectedLesson(null);
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}