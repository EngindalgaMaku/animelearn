"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  BookOpen,
  Target,
  Users,
  Star,
  Diamond,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  sortOrder: number;
  activityCount: number;
  totalDiamonds: number;
  totalXP: number;
  isActive: boolean;
}

interface LearningActivity {
  id: string;
  title: string;
  category: string;
  diamondReward: number;
  experienceReward: number;
  sortOrder: number;
  isActive: boolean;
}

const predefinedTopics = [
  {
    name: "Python Fundamentals",
    description: "Basic Python concepts and syntax",
    icon: "🐍",
    sortOrder: 1,
  },
  {
    name: "Data Structures",
    description: "Lists, dictionaries, and data manipulation",
    icon: "📊",
    sortOrder: 2,
  },
  {
    name: "Algorithms",
    description: "Sorting, searching, and algorithmic thinking",
    icon: "🧮",
    sortOrder: 3,
  },
  {
    name: "Functions & OOP",
    description: "Functions, classes, and object-oriented programming",
    icon: "🏗️",
    sortOrder: 4,
  },
  {
    name: "Web Development",
    description: "HTML, CSS, JavaScript, and web frameworks",
    icon: "🌐",
    sortOrder: 5,
  },
  {
    name: "Database & SQL",
    description: "Database design and SQL queries",
    icon: "🗃️",
    sortOrder: 6,
  },
];

export default function TopicsManagement() {
  const { user, loading } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activities, setActivities] = useState<LearningActivity[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  const [newTopic, setNewTopic] = useState({
    name: "",
    description: "",
    icon: "📚",
    sortOrder: 1,
  });

  useEffect(() => {
    if (user?.role === "admin") {
      loadTopicsAndActivities();
    }
  }, [user]);

  const loadTopicsAndActivities = async () => {
    try {
      setLoadingTopics(true);

      // Load activities first to calculate topic statistics
      const activitiesResponse = await fetch("/api/admin/learning-activities");
      let activitiesList: LearningActivity[] = [];

      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        if (activitiesData.success) {
          activitiesList = activitiesData.activities;
          setActivities(activitiesList);
        }
      }

      // Get unique topics from activities and create topic objects
      const topicMap = new Map<string, Topic>();

      // Initialize with predefined topics
      predefinedTopics.forEach((predefined) => {
        const topicActivities = activitiesList.filter(
          (a) => a.category === predefined.name
        );
        const totalDiamonds = topicActivities.reduce(
          (sum, a) => sum + a.diamondReward,
          0
        );
        const totalXP = topicActivities.reduce(
          (sum, a) => sum + a.experienceReward,
          0
        );

        topicMap.set(predefined.name, {
          id: predefined.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          name: predefined.name,
          description: predefined.description,
          icon: predefined.icon,
          sortOrder: predefined.sortOrder,
          activityCount: topicActivities.length,
          totalDiamonds,
          totalXP,
          isActive: topicActivities.some((a) => a.isActive),
        });
      });

      // Add any additional topics found in activities
      activitiesList.forEach((activity) => {
        if (!topicMap.has(activity.category)) {
          const topicActivities = activitiesList.filter(
            (a) => a.category === activity.category
          );
          const totalDiamonds = topicActivities.reduce(
            (sum, a) => sum + a.diamondReward,
            0
          );
          const totalXP = topicActivities.reduce(
            (sum, a) => sum + a.experienceReward,
            0
          );

          topicMap.set(activity.category, {
            id: activity.category.toLowerCase().replace(/[^a-z0-9]/g, "-"),
            name: activity.category,
            description: "Custom topic",
            icon: "📚",
            sortOrder: 999,
            activityCount: topicActivities.length,
            totalDiamonds,
            totalXP,
            isActive: topicActivities.some((a) => a.isActive),
          });
        }
      });

      const topicsList = Array.from(topicMap.values()).sort(
        (a, b) => a.sortOrder - b.sortOrder
      );
      setTopics(topicsList);
    } catch (error) {
      console.error("Failed to load topics:", error);
      alert("Failed to load topics");
    } finally {
      setLoadingTopics(false);
    }
  };

  const handleAddTopic = async () => {
    if (!newTopic.name.trim()) {
      alert("Topic name is required");
      return;
    }

    // For now, just add to local state (would normally save to database)
    const topic: Topic = {
      id: newTopic.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      name: newTopic.name,
      description: newTopic.description,
      icon: newTopic.icon,
      sortOrder: newTopic.sortOrder,
      activityCount: 0,
      totalDiamonds: 0,
      totalXP: 0,
      isActive: false,
    };

    setTopics([...topics, topic].sort((a, b) => a.sortOrder - b.sortOrder));
    setNewTopic({
      name: "",
      description: "",
      icon: "📚",
      sortOrder: topics.length + 1,
    });
    setShowAddForm(false);

    alert(
      "Topic added successfully! Note: This is a demo - full database integration needed."
    );
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic);
    setNewTopic({
      name: topic.name,
      description: topic.description,
      icon: topic.icon,
      sortOrder: topic.sortOrder,
    });
  };

  const handleUpdateTopic = async () => {
    if (!editingTopic || !newTopic.name.trim()) return;

    const updatedTopics = topics
      .map((topic) =>
        topic.id === editingTopic.id ? { ...topic, ...newTopic } : topic
      )
      .sort((a, b) => a.sortOrder - b.sortOrder);

    setTopics(updatedTopics);
    setEditingTopic(null);
    setNewTopic({ name: "", description: "", icon: "📚", sortOrder: 1 });

    alert(
      "Topic updated successfully! Note: This is a demo - full database integration needed."
    );
  };

  const handleDeleteTopic = async (topic: Topic) => {
    if (topic.activityCount > 0) {
      alert(
        `Cannot delete "${topic.name}" because it contains ${topic.activityCount} activities. Please move or delete the activities first.`
      );
      return;
    }

    if (
      !confirm(`Are you sure you want to delete the topic "${topic.name}"?`)
    ) {
      return;
    }

    setTopics(topics.filter((t) => t.id !== topic.id));
    alert(
      "Topic deleted successfully! Note: This is a demo - full database integration needed."
    );
  };

  const moveTopicUp = (topic: Topic) => {
    const currentIndex = topics.findIndex((t) => t.id === topic.id);
    if (currentIndex > 0) {
      const newTopics = [...topics];
      [newTopics[currentIndex], newTopics[currentIndex - 1]] = [
        newTopics[currentIndex - 1],
        newTopics[currentIndex],
      ];

      // Update sort orders
      newTopics.forEach((t, index) => {
        t.sortOrder = index + 1;
      });

      setTopics(newTopics);
    }
  };

  const moveTopicDown = (topic: Topic) => {
    const currentIndex = topics.findIndex((t) => t.id === topic.id);
    if (currentIndex < topics.length - 1) {
      const newTopics = [...topics];
      [newTopics[currentIndex], newTopics[currentIndex + 1]] = [
        newTopics[currentIndex + 1],
        newTopics[currentIndex],
      ];

      // Update sort orders
      newTopics.forEach((t, index) => {
        t.sortOrder = index + 1;
      });

      setTopics(newTopics);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 text-gray-600">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="py-6 lg:py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm lg:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link
                    href="/admin/learning-activities"
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </Link>
                  <div>
                    <h1 className="bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                      📚 Topics Management
                    </h1>
                    <p className="text-gray-600">
                      Organize learning activities into topics and manage the
                      curriculum structure
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Topic</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-white shadow-lg">
              <BookOpen className="mb-2 h-6 w-6" />
              <p className="text-2xl font-bold">{topics.length}</p>
              <p className="text-sm text-blue-100">Total Topics</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-4 text-white shadow-lg">
              <Target className="mb-2 h-6 w-6" />
              <p className="text-2xl font-bold">{activities.length}</p>
              <p className="text-sm text-green-100">Total Activities</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 p-4 text-white shadow-lg">
              <Diamond className="mb-2 h-6 w-6" />
              <p className="text-2xl font-bold">
                {topics.reduce((sum, t) => sum + t.totalDiamonds, 0)}
              </p>
              <p className="text-sm text-yellow-100">Total Diamonds</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-4 text-white shadow-lg">
              <Star className="mb-2 h-6 w-6" />
              <p className="text-2xl font-bold">
                {topics.reduce((sum, t) => sum + t.totalXP, 0)}
              </p>
              <p className="text-sm text-purple-100">Total XP</p>
            </div>
          </div>

          {/* Add/Edit Topic Form */}
          {(showAddForm || editingTopic) && (
            <div className="mb-8 rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingTopic ? "✏️ Edit Topic" : "➕ Add New Topic"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingTopic(null);
                    setNewTopic({
                      name: "",
                      description: "",
                      icon: "📚",
                      sortOrder: 1,
                    });
                  }}
                  className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Topic Name *
                  </label>
                  <input
                    type="text"
                    value={newTopic.name}
                    onChange={(e) =>
                      setNewTopic((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g., Advanced Algorithms"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Icon
                  </label>
                  <input
                    type="text"
                    value={newTopic.icon}
                    onChange={(e) =>
                      setNewTopic((prev) => ({ ...prev, icon: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="🎯"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={newTopic.description}
                    onChange={(e) =>
                      setNewTopic((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="Describe what this topic covers..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newTopic.sortOrder}
                    onChange={(e) =>
                      setNewTopic((prev) => ({
                        ...prev,
                        sortOrder: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingTopic(null);
                    setNewTopic({
                      name: "",
                      description: "",
                      icon: "📚",
                      sortOrder: 1,
                    });
                  }}
                  className="rounded-xl bg-gray-100 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={editingTopic ? handleUpdateTopic : handleAddTopic}
                  className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  <Save className="h-5 w-5" />
                  <span>{editingTopic ? "Update Topic" : "Add Topic"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Topics List */}
          <div className="space-y-4">
            {loadingTopics ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
                <p className="mt-4 text-gray-600">Loading topics...</p>
              </div>
            ) : topics.length === 0 ? (
              <div className="py-12 text-center">
                <BookOpen className="mx-auto h-16 w-16 text-gray-400" />
                <p className="mt-4 text-xl font-semibold text-gray-600">
                  No topics found
                </p>
                <p className="text-gray-500">
                  Create your first topic to organize learning activities.
                </p>
              </div>
            ) : (
              topics.map((topic, index) => (
                <div
                  key={topic.id}
                  className="rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
                        <span className="text-2xl">{topic.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {topic.name}
                        </h3>
                        <p className="text-gray-600">{topic.description}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm">
                          <span className="flex items-center space-x-1 text-blue-600">
                            <Target className="h-4 w-4" />
                            <span>{topic.activityCount} activities</span>
                          </span>
                          <span className="flex items-center space-x-1 text-yellow-600">
                            <Diamond className="h-4 w-4" />
                            <span>{topic.totalDiamonds} diamonds</span>
                          </span>
                          <span className="flex items-center space-x-1 text-purple-600">
                            <Star className="h-4 w-4" />
                            <span>{topic.totalXP} XP</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Order Controls */}
                      <div className="flex flex-col">
                        <button
                          onClick={() => moveTopicUp(topic)}
                          disabled={index === 0}
                          className="rounded-t-lg bg-gray-100 p-1 text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveTopicDown(topic)}
                          disabled={index === topics.length - 1}
                          className="rounded-b-lg bg-gray-100 p-1 text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Actions */}
                      <button
                        onClick={() => handleEditTopic(topic)}
                        className="rounded-lg bg-blue-100 p-2 text-blue-700 transition-colors hover:bg-blue-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteTopic(topic)}
                        className="rounded-lg bg-red-100 p-2 text-red-700 transition-colors hover:bg-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <Link
                        href={`/admin/learning-activities?category=${encodeURIComponent(topic.name)}`}
                        className="rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700 transition-colors hover:bg-green-200"
                      >
                        Manage Activities
                      </Link>
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
