"use client";

import React, { useState, useEffect } from "react";
import {
  Gamepad2,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff,
  Users,
  Clock,
  Star,
  Diamond,
  Play,
  Shuffle,
  Target,
  Brain,
  BookOpen,
  Zap,
  Copy,
  Upload,
  Download,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Wand2,
  Lightbulb,
  Rocket,
  Trophy,
  Settings,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Sparkles,
  FastForward,
} from "lucide-react";
import ActivityFormModal from "@/components/admin/ActivityFormModal";

interface LearningActivity {
  id: string;
  title: string;
  description?: string;
  activityType: string;
  category: string;
  difficulty: number;
  diamondReward: number;
  experienceReward: number;
  content: any;
  settings?: any;
  isActive: boolean;
  estimatedMinutes: number;
  tags: string[];
  sortOrder: number;
  attemptsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ActivityFormData {
  title: string;
  description: string;
  activityType: string;
  category: string;
  difficulty: number;
  diamondReward: number;
  experienceReward: number;
  content: any;
  settings: any;
  estimatedMinutes: number;
  tags: string[];
  isActive: boolean;
  sortOrder: number;
}

const initialFormData: ActivityFormData = {
  title: "",
  description: "",
  activityType: "memory_game",
  category: "general",
  difficulty: 1,
  diamondReward: 10,
  experienceReward: 25,
  content: {},
  settings: {},
  estimatedMinutes: 5,
  tags: [],
  isActive: true,
  sortOrder: 0,
};

const activityTypes = [
  {
    value: "memory_game",
    label: "🧠 Memory Game",
    description: "Card matching & memorization challenges",
    icon: Brain,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700"
  },
  {
    value: "quiz",
    label: "🎯 Smart Quiz",
    description: "Interactive Q&A with instant feedback",
    icon: Target,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700"
  },
  {
    value: "fill_blanks",
    label: "📝 Fill Blanks",
    description: "Complete sentences and learn vocabulary",
    icon: BookOpen,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    textColor: "text-green-700"
  },
  {
    value: "drag_drop",
    label: "🎲 Drag & Drop",
    description: "Organize and categorize elements",
    icon: Zap,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700"
  },
];

// Quick Templates for rapid activity creation
const quickTemplates = {
  memory_game: [
    {
      name: "Anime Characters",
      content: {
        pairs: [
          { id: 1, text: "Naruto", match: "🍜 Ramen lover ninja" },
          { id: 2, text: "Luffy", match: "🏴‍☠️ Straw Hat Captain" },
          { id: 3, text: "Goku", match: "⚡ Super Saiyan warrior" },
          { id: 4, text: "Ichigo", match: "⚔️ Soul Reaper" },
        ],
        timeLimit: 180,
        shuffleCards: true
      }
    },
    {
      name: "Programming Basics",
      content: {
        pairs: [
          { id: 1, text: "if/else", match: "Conditional statements" },
          { id: 2, text: "for loop", match: "Repeat code multiple times" },
          { id: 3, text: "function", match: "Reusable code block" },
          { id: 4, text: "variable", match: "Store data values" },
        ],
        timeLimit: 120,
        shuffleCards: true
      }
    }
  ],
  quiz: [
    {
      name: "Anime Trivia",
      content: {
        questions: [
          {
            id: 1,
            question: "Which anime features a protagonist named Monkey D. Luffy?",
            options: ["Naruto", "One Piece", "Bleach", "Dragon Ball"],
            correctAnswer: 1,
            explanation: "One Piece is the adventure of Monkey D. Luffy and his crew!"
          }
        ],
        timeLimit: 300,
        randomOrder: true
      }
    }
  ]
};

// Smart Content Generator Component
function SmartContentGenerator({ 
  activityType, 
  onGenerate 
}: { 
  activityType: string; 
  onGenerate: (content: any) => void;
}) {
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);

  const generateContent = () => {
    setGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      if (activityType === "memory_game") {
        const pairs = [
          { id: 1, text: `${topic} Term 1`, match: `Definition for ${topic} 1` },
          { id: 2, text: `${topic} Term 2`, match: `Definition for ${topic} 2` },
          { id: 3, text: `${topic} Term 3`, match: `Definition for ${topic} 3` },
        ];
        onGenerate({
          pairs,
          timeLimit: 180,
          shuffleCards: true
        });
      }
      setGenerating(false);
      setTopic("");
    }, 1500);
  };

  return (
    <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Wand2 className="h-5 w-5 text-purple-600" />
        <h4 className="font-semibold text-purple-900">AI Content Generator</h4>
        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">BETA</span>
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic (e.g., 'Animals', 'History', 'Programming')"
          className="flex-1 rounded-lg border border-purple-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
          onKeyPress={(e) => e.key === "Enter" && topic && generateContent()}
        />
        <button
          onClick={generateContent}
          disabled={!topic || generating}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 flex items-center space-x-1"
        >
          {generating ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Generate</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Quick Template Selector
function QuickTemplateSelector({ 
  activityType, 
  onSelectTemplate 
}: { 
  activityType: string; 
  onSelectTemplate: (content: any) => void;
}) {
  const templates = quickTemplates[activityType as keyof typeof quickTemplates] || [];

  if (templates.length === 0) return null;

  return (
    <div className="rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Rocket className="h-5 w-5 text-blue-600" />
        <h4 className="font-semibold text-blue-900">Quick Start Templates</h4>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {templates.map((template, index) => (
          <button
            key={index}
            onClick={() => onSelectTemplate(template.content)}
            className="text-left p-3 rounded-lg bg-white border border-blue-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="font-medium text-blue-900 text-sm">{template.name}</div>
            <div className="text-xs text-blue-600 mt-1">
              {(template.content as any).pairs?.length || (template.content as any).questions?.length || 0} items
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Bulk Operations Panel
function BulkOperationsPanel({ 
  selectedActivities,
  onBulkAction,
  onDeselectAll 
}: {
  selectedActivities: string[];
  onBulkAction: (action: string) => void;
  onDeselectAll: () => void;
}) {
  if (selectedActivities.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 flex items-center space-x-4 z-50">
      <div className="flex items-center space-x-2">
        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
          {selectedActivities.length} selected
        </div>
        <button
          onClick={onDeselectAll}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onBulkAction('activate')}
          className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700"
        >
          <Eye className="h-4 w-4 inline mr-1" />
          Activate
        </button>
        <button
          onClick={() => onBulkAction('deactivate')}
          className="bg-orange-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-700"
        >
          <EyeOff className="h-4 w-4 inline mr-1" />
          Deactivate
        </button>
        <button
          onClick={() => onBulkAction('delete')}
          className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700"
        >
          <Trash2 className="h-4 w-4 inline mr-1" />
          Delete
        </button>
        <button
          onClick={() => onBulkAction('export')}
          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
        >
          <Download className="h-4 w-4 inline mr-1" />
          Export
        </button>
      </div>
    </div>
  );
}

// Enhanced Activity Card Component
function ActivityCard({ 
  activity, 
  onEdit, 
  onDelete, 
  onToggleActive, 
  onDuplicate,
  isSelected,
  onSelect
}: {
  activity: LearningActivity;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onDuplicate: () => void;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
}) {
  const typeInfo = activityTypes.find(t => t.value === activity.activityType) || activityTypes[0];
  const [showActions, setShowActions] = useState(false);

  return (
    <div className={`group relative rounded-xl border transition-all hover:shadow-lg ${
      activity.isActive 
        ? "border-gray-200 bg-white hover:border-gray-300" 
        : "border-gray-300 bg-gray-50 hover:border-gray-400"
    } ${isSelected ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}>
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
        />
      </div>

      <div className="p-6 pt-12">
        <div className="flex items-start justify-between">
          {/* Left: Main Info */}
          <div className="flex-1 pr-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`p-2 rounded-lg ${typeInfo.bgColor}`}>
                <typeInfo.icon className={`h-5 w-5 ${typeInfo.textColor}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{activity.title}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.difficulty <= 2 ? 'bg-green-100 text-green-800' :
                    activity.difficulty <= 3 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Level {activity.difficulty}
                  </span>
                  <span>{typeInfo.label}</span>
                </div>
              </div>
            </div>

            {activity.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{activity.description}</p>
            )}

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{activity.attemptsCount}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{activity.estimatedMinutes}m</span>
              </span>
              <span className="flex items-center space-x-1">
                <Diamond className="h-4 w-4" />
                <span>{activity.diamondReward}💎</span>
              </span>
              <span className="flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span>{activity.experienceReward}XP</span>
              </span>
            </div>

            {/* Tags */}
            {activity.tags && activity.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {activity.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
                {activity.tags.length > 3 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    +{activity.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right: Status & Actions */}
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={onToggleActive}
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                activity.isActive
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              {activity.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              <span>{activity.isActive ? "Active" : "Inactive"}</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </button>

              {showActions && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20 min-w-[150px]">
                  <button
                    onClick={() => { onEdit(); setShowActions(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center space-x-2 text-sm"
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => { onDuplicate(); setShowActions(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center space-x-2 text-sm"
                  >
                    <Copy className="h-4 w-4 text-green-600" />
                    <span>Duplicate</span>
                  </button>
                  <button
                    onClick={() => { onDelete(); setShowActions(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center space-x-2 text-sm"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LearningActivitiesAdminPage() {
  const [activities, setActivities] = useState<LearningActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<ActivityFormData>(initialFormData);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/learning-activities");
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error("Failed to fetch learning activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingActivityId(null);
    setIsCreating(true);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const handleEdit = (activity: LearningActivity) => {
    setEditingActivityId(activity.id);
    setIsCreating(false);
    setFormData({
      title: activity.title,
      description: activity.description || "",
      activityType: activity.activityType,
      category: activity.category,
      difficulty: activity.difficulty,
      diamondReward: activity.diamondReward,
      experienceReward: activity.experienceReward,
      content: activity.content,
      settings: activity.settings || {},
      estimatedMinutes: activity.estimatedMinutes,
      tags: Array.isArray(activity.tags) ? activity.tags : [],
      isActive: activity.isActive,
      sortOrder: activity.sortOrder,
    });
    setShowModal(true);
  };

  const handleDuplicate = async (activity: LearningActivity) => {
    const duplicateData = {
      ...activity,
      title: `${activity.title} (Copy)`,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };
    
    try {
      const response = await fetch("/api/admin/learning-activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicateData),
      });

      if (response.ok) {
        await fetchActivities();
      }
    } catch (error) {
      console.error("Error duplicating activity:", error);
    }
  };

  const handleDelete = async (activity: LearningActivity) => {
    if (!confirm(`Delete "${activity.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/learning-activities/${activity.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchActivities();
      } else {
        console.error("Failed to delete activity");
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  const handleToggleActive = async (activity: LearningActivity) => {
    try {
      const response = await fetch(`/api/admin/learning-activities/${activity.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !activity.isActive }),
      });

      if (response.ok) {
        await fetchActivities();
      } else {
        console.error("Failed to toggle activity status");
      }
    } catch (error) {
      console.error("Error toggling activity status:", error);
    }
  };

  const handleSaveActivity = async (activityData: ActivityFormData) => {
    try {
      const url = editingActivityId
        ? `/api/admin/learning-activities/${editingActivityId}`
        : "/api/admin/learning-activities";
      
      const method = editingActivityId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData),
      });

      if (response.ok) {
        await fetchActivities();
        setShowModal(false);
        setEditingActivityId(null);
        setIsCreating(false);
      } else {
        console.error("Failed to save activity");
      }
    } catch (error) {
      console.error("Error saving activity:", error);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedActivities.length === 0) return;

    if (action === 'delete' && !confirm(`Delete ${selectedActivities.length} activities?`)) {
      return;
    }

    try {
      const promises = selectedActivities.map(id => {
        if (action === 'delete') {
          return fetch(`/api/admin/learning-activities/${id}`, { method: 'DELETE' });
        } else if (action === 'activate' || action === 'deactivate') {
          return fetch(`/api/admin/learning-activities/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: action === 'activate' })
          });
        }
      });

      await Promise.all(promises);
      await fetchActivities();
      setSelectedActivities([]);
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
    }
  };

  // Filter and sort activities
  const filteredActivities = activities
    .filter(activity => {
      const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || activity.activityType === filterType;
      const matchesCategory = !filterCategory || activity.category === filterCategory;
      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title': return a.title.localeCompare(b.title);
        case 'difficulty': return a.difficulty - b.difficulty;
        case 'attempts': return b.attemptsCount - a.attemptsCount;
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default: return 0;
      }
    });

  const categories = [...new Set(activities.map(a => a.category))];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-lg text-gray-600">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="flex items-center space-x-3 text-4xl font-bold text-gray-900">
                <div className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-3">
                  <Gamepad2 className="h-8 w-8 text-white" />
                </div>
                <span>Learning Activities</span>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Pro</span>
              </h1>
              <p className="mt-2 text-gray-600 text-lg">
                Create engaging activities with our award-winning tools
              </p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span>{activities.length} Total Activities</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Eye className="h-4 w-4 text-green-500" />
                  <span>{activities.filter(a => a.isActive).length} Active</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>{activities.reduce((sum, a) => sum + a.attemptsCount, 0)} Total Attempts</span>
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 rounded-xl px-4 py-2 font-medium transition-all ${
                  showFilters ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-200 shadow-sm`}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
              <button
                onClick={handleCreateNew}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white shadow-sm transition-all hover:from-purple-700 hover:to-pink-700 hover:shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Create Activity</span>
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search activities..."
                    className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Types</option>
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="attempts">Most Attempts</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Bar */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedActivities.length === filteredActivities.length && filteredActivities.length > 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedActivities(filteredActivities.map(a => a.id));
                  } else {
                    setSelectedActivities([]);
                  }
                }}
                className="h-4 w-4 text-purple-600 rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>
            <div className="text-sm text-gray-500">
              {filteredActivities.length} activities found
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
            >
              {viewMode === 'grid' ? <BookOpen className="h-4 w-4" /> : <Gamepad2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Activities Grid */}
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
              <Gamepad2 className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Activities Found</h3>
            <p className="text-gray-600 mb-6">Create your first activity to get started</p>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white transition-all hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="h-5 w-5" />
              <span>Create First Activity</span>
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
            : "space-y-4"
          }>
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onEdit={() => handleEdit(activity)}
                onDelete={() => handleDelete(activity)}
                onToggleActive={() => handleToggleActive(activity)}
                onDuplicate={() => handleDuplicate(activity)}
                isSelected={selectedActivities.includes(activity.id)}
                onSelect={(selected) => {
                  if (selected) {
                    setSelectedActivities([...selectedActivities, activity.id]);
                  } else {
                    setSelectedActivities(selectedActivities.filter(id => id !== activity.id));
                  }
                }}
              />
            ))}
          </div>
        )}

        {/* Bulk Operations Panel */}
        <BulkOperationsPanel
          selectedActivities={selectedActivities}
          onBulkAction={handleBulkAction}
          onDeselectAll={() => setSelectedActivities([])}
        />

        {/* Activity Form Modal */}
        {showModal && (
          <ActivityFormModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingActivityId(null);
              setIsCreating(false);
            }}
            onSave={handleSaveActivity}
            initialData={formData}
            editingActivity={editingActivityId ? activities.find(a => a.id === editingActivityId) : undefined}
          />
        )}
      </div>
    </div>
  );
}
