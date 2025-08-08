"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Plus,
  Trash2,
  Wand2,
  Sparkles,
  Rocket,
  Brain,
  Target,
  BookOpen,
  Zap,
  Clock,
  Diamond,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";

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

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ActivityFormData) => Promise<void>;
  editingActivity?: any;
  initialData: ActivityFormData;
}

const activityTypes = [
  {
    value: "memory_game",
    label: "🧠 Memory Game",
    description: "Card matching & memorization challenges",
    icon: Brain,
    color: "from-purple-500 to-purple-600",
  },
  {
    value: "quiz",
    label: "🎯 Smart Quiz", 
    description: "Interactive Q&A with instant feedback",
    icon: Target,
    color: "from-blue-500 to-blue-600",
  },
  {
    value: "fill_blanks",
    label: "📝 Fill Blanks",
    description: "Complete sentences and learn vocabulary",
    icon: BookOpen,
    color: "from-green-500 to-green-600",
  },
  {
    value: "drag_drop",
    label: "🎲 Drag & Drop",
    description: "Organize and categorize elements",
    icon: Zap,
    color: "from-orange-500 to-orange-600",
  },
];

// Quick Templates
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

// Memory Game Content Editor
function MemoryGameEditor({ content, onChange }: { content: any; onChange: (content: any) => void }) {
  const [pairs, setPairs] = useState(content.pairs || []);
  const [newPair, setNewPair] = useState({ text: "", match: "" });

  useEffect(() => {
    onChange({
      ...content,
      pairs,
      timeLimit: content.timeLimit || 300,
      shuffleCards: content.shuffleCards !== false,
    });
  }, [pairs]);

  const addPair = () => {
    if (newPair.text && newPair.match) {
      setPairs([...pairs, { id: Date.now(), text: newPair.text, match: newPair.match }]);
      setNewPair({ text: "", match: "" });
    }
  };

  const removePair = (index: number) => {
    setPairs(pairs.filter((_: any, i: number) => i !== index));
  };

  const updatePair = (index: number, field: string, value: string) => {
    const updatedPairs = pairs.map((pair: any, i: number) =>
      i === index ? { ...pair, [field]: value } : pair
    );
    setPairs(updatedPairs);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Memory Game Pairs</h3>
        <div className="text-sm text-gray-500">{pairs.length} pairs</div>
      </div>

      {/* Settings */}
      <div className="grid gap-4 md:grid-cols-2 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (seconds)</label>
          <input
            type="number"
            value={content.timeLimit || 300}
            onChange={(e) => onChange({ ...content, timeLimit: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            min="60"
          />
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="shuffleCards"
            checked={content.shuffleCards !== false}
            onChange={(e) => onChange({ ...content, shuffleCards: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-purple-600"
          />
          <label htmlFor="shuffleCards" className="text-sm font-medium text-gray-700">
            Shuffle Cards
          </label>
        </div>
      </div>

      {/* Existing Pairs */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {pairs.map((pair: any, index: number) => (
          <div key={index} className="grid gap-2 md:grid-cols-3 p-3 bg-white border border-gray-200 rounded-lg">
            <input
              type="text"
              value={pair.text}
              onChange={(e) => updatePair(index, "text", e.target.value)}
              placeholder="Card 1 text"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={pair.match}
              onChange={(e) => updatePair(index, "match", e.target.value)}
              placeholder="Card 2 text"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => removePair(index)}
              className="rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add New Pair */}
      <div className="border-t border-gray-200 pt-4">
        <div className="grid gap-2 md:grid-cols-3">
          <input
            type="text"
            value={newPair.text}
            onChange={(e) => setNewPair({ ...newPair, text: e.target.value })}
            placeholder="Card 1 text"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={newPair.match}
            onChange={(e) => setNewPair({ ...newPair, match: e.target.value })}
            placeholder="Card 2 text"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={addPair}
            className="rounded-lg bg-purple-600 px-3 py-2 text-white hover:bg-purple-700 transition-colors flex items-center justify-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Pair</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Quiz Content Editor
function QuizEditor({ content, onChange }: { content: any; onChange: (content: any) => void }) {
  const [questions, setQuestions] = useState(content.questions || []);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
  });

  useEffect(() => {
    onChange({
      ...content,
      questions,
      timeLimit: content.timeLimit || 300,
      randomOrder: content.randomOrder !== false,
    });
  }, [questions]);

  const addQuestion = () => {
    if (newQuestion.question && newQuestion.options.every((opt) => opt.trim())) {
      setQuestions([...questions, { id: Date.now(), ...newQuestion }]);
      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
      });
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Quiz Questions</h3>
        <div className="text-sm text-gray-500">{questions.length} questions</div>
      </div>

      {/* Settings */}
      <div className="grid gap-4 md:grid-cols-2 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (seconds)</label>
          <input
            type="number"
            value={content.timeLimit || 300}
            onChange={(e) => onChange({ ...content, timeLimit: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            min="60"
          />
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="randomOrder"
            checked={content.randomOrder !== false}
            onChange={(e) => onChange({ ...content, randomOrder: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-purple-600"
          />
          <label htmlFor="randomOrder" className="text-sm font-medium text-gray-700">
            Random Question Order
          </label>
        </div>
      </div>

      {/* Existing Questions */}
      <div className="space-y-4 max-h-64 overflow-y-auto">
        {questions.map((question: any, qIndex: number) => (
          <div key={qIndex} className="rounded-lg border border-gray-200 p-4 bg-white">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Question {qIndex + 1}
                </label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => {
                    const updatedQuestions = questions.map((q: any, i: number) =>
                      i === qIndex ? { ...q, question: e.target.value } : q
                    );
                    setQuestions(updatedQuestions);
                  }}
                  placeholder="Question text..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="ml-2 rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-3 grid gap-2 md:grid-cols-2">
              {question.options.map((option: string, oIndex: number) => (
                <div key={oIndex} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={question.correctAnswer === oIndex}
                    onChange={() => {
                      const updatedQuestions = questions.map((q: any, i: number) =>
                        i === qIndex ? { ...q, correctAnswer: oIndex } : q
                      );
                      setQuestions(updatedQuestions);
                    }}
                    className="h-4 w-4 text-purple-600"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const updatedQuestions = questions.map((q: any, i: number) =>
                        i === qIndex
                          ? {
                              ...q,
                              options: q.options.map((opt: string, oi: number) =>
                                oi === oIndex ? e.target.value : opt
                              ),
                            }
                          : q
                      );
                      setQuestions(updatedQuestions);
                    }}
                    placeholder={`Option ${oIndex + 1}`}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>

            <input
              type="text"
              value={question.explanation || ""}
              onChange={(e) => {
                const updatedQuestions = questions.map((q: any, i: number) =>
                  i === qIndex ? { ...q, explanation: e.target.value } : q
                );
                setQuestions(updatedQuestions);
              }}
              placeholder="Explanation (optional)..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        ))}
      </div>

      {/* Add New Question */}
      <div className="border-t border-gray-200 pt-4">
        <div className="space-y-3">
          <input
            type="text"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            placeholder="Question text..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />

          <div className="grid gap-2 md:grid-cols-2">
            {newQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="new-correct"
                  checked={newQuestion.correctAnswer === index}
                  onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                  className="h-4 w-4 text-purple-600"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      options: newQuestion.options.map((opt, i) =>
                        i === index ? e.target.value : opt
                      ),
                    })
                  }
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            ))}
          </div>

          <input
            type="text"
            value={newQuestion.explanation}
            onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
            placeholder="Explanation (optional)..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />

          <button
            type="button"
            onClick={addQuestion}
            className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ActivityFormModal({
  isOpen,
  onClose,
  onSave,
  editingActivity,
  initialData,
}: ActivityFormModalProps) {
  const [formData, setFormData] = useState<ActivityFormData>(initialData);
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (isOpen) {
      setFormData(editingActivity ? {
        title: editingActivity.title,
        description: editingActivity.description || "",
        activityType: editingActivity.activityType,
        category: editingActivity.category,
        difficulty: editingActivity.difficulty,
        diamondReward: editingActivity.diamondReward,
        experienceReward: editingActivity.experienceReward,
        content: editingActivity.content,
        settings: editingActivity.settings || {},
        estimatedMinutes: editingActivity.estimatedMinutes,
        tags: Array.isArray(editingActivity.tags) ? editingActivity.tags : [],
        isActive: editingActivity.isActive,
        sortOrder: editingActivity.sortOrder,
      } : initialData);
    }
  }, [isOpen, editingActivity, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving activity:", error);
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const applyTemplate = (templateContent: any) => {
    setFormData(prev => ({ ...prev, content: templateContent }));
  };

  if (!isOpen) return null;

  const selectedType = activityTypes.find(type => type.value === formData.activityType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center space-x-3">
            {selectedType && (
              <div className={`p-3 rounded-xl bg-gradient-to-r ${selectedType.color}`}>
                <selectedType.icon className="h-6 w-6 text-white" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {editingActivity ? "Edit Activity" : "Create New Activity"}
              </h2>
              <p className="text-gray-600">{selectedType?.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {[
            { id: "basic", label: "Basic Info", icon: Star },
            { id: "content", label: "Content", icon: Brain },
            { id: "settings", label: "Settings", icon: Eye },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-purple-600 bg-white text-purple-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                      required
                      placeholder="Enter activity title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Type *
                    </label>
                    <select
                      value={formData.activityType}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          activityType: e.target.value,
                          content: {},
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      {activityTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe what learners will do in this activity..."
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., anime, programming, math"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty (1-5)
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData(prev => ({ ...prev, difficulty: parseInt(e.target.value) }))}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                    >
                      {[1, 2, 3, 4, 5].map(level => (
                        <option key={level} value={level}>
                          Level {level} {level <= 2 ? "(Beginner)" : level <= 3 ? "(Intermediate)" : "(Advanced)"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Minutes
                    </label>
                    <input
                      type="number"
                      value={formData.estimatedMinutes}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedMinutes: parseInt(e.target.value) }))}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                      min="1"
                      max="120"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diamond Reward
                    </label>
                    <div className="relative">
                      <Diamond className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-600" />
                      <input
                        type="number"
                        value={formData.diamondReward}
                        onChange={(e) => setFormData(prev => ({ ...prev, diamondReward: parseInt(e.target.value) }))}
                        className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Reward
                    </label>
                    <div className="relative">
                      <Star className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-600" />
                      <input
                        type="number"
                        value={formData.experienceReward}
                        onChange={(e) => setFormData(prev => ({ ...prev, experienceReward: parseInt(e.target.value) }))}
                        className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="flex items-center space-x-1 rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        placeholder="Add a tag..."
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === "content" && (
              <div className="space-y-6">
                {/* Quick Templates */}
                {quickTemplates[formData.activityType as keyof typeof quickTemplates] && (
                  <div className="rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Rocket className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Quick Start Templates</h4>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      {quickTemplates[formData.activityType as keyof typeof quickTemplates]?.map((template, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => applyTemplate(template.content)}
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
                )}

                {/* Content Editors */}
                {formData.activityType === "memory_game" && (
                  <MemoryGameEditor
                    content={formData.content}
                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  />
                )}

                {formData.activityType === "quiz" && (
                  <QuizEditor
                    content={formData.content}
                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  />
                )}

                {/* Placeholder for other activity types */}
                {!["memory_game", "quiz"].includes(formData.activityType) && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="text-gray-400 mb-4">
                      <BookOpen className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Content Editor Coming Soon
                    </h3>
                    <p className="text-gray-600">
                      The editor for {formData.activityType} activities is under development.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) }))}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Make activity active and visible to users
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 border-t border-gray-200 p-6 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !formData.title}
              className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-white transition-all hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{editingActivity ? "Update Activity" : "Create Activity"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}