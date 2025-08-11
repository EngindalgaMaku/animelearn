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
  {
    value: "algorithm_visualization",
    label: "🔄 Algorithm Viz",
    description: "Interactive algorithm demonstrations",
    icon: Brain,
    color: "from-teal-500 to-teal-600",
  },
  {
    value: "interactive_coding",
    label: "💻 Code Lab",
    description: "Hands-on programming exercises",
    icon: Target,
    color: "from-indigo-500 to-indigo-600",
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
        shuffleCards: true,
      },
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
        shuffleCards: true,
      },
    },
  ],
  quiz: [
    {
      name: "Anime Trivia",
      content: {
        questions: [
          {
            id: 1,
            question:
              "Which anime features a protagonist named Monkey D. Luffy?",
            options: ["Naruto", "One Piece", "Bleach", "Dragon Ball"],
            correctAnswer: 1,
            explanation:
              "One Piece is the adventure of Monkey D. Luffy and his crew!",
          },
        ],
        timeLimit: 300,
        randomOrder: true,
      },
    },
  ],
  algorithm_visualization: [
    {
      name: "Bubble Sort Visualization",
      content: {
        algorithmType: "bubble_sort",
        title: "Bubble Sort Algorithm",
        description:
          "Watch how bubble sort algorithm works step by step with interactive visualization",
        initialArray: [64, 34, 25, 12, 22, 11, 90],
        speed: "medium",
        showCode: true,
        showComplexity: true,
        allowUserInput: true,
        steps: [
          {
            id: 1,
            description: "Compare adjacent elements",
            highlight: [0, 1],
            action: "compare",
          },
          {
            id: 2,
            description: "Swap if left element is greater",
            highlight: [0, 1],
            action: "swap",
          },
        ],
        codeSnippet: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
        complexity: {
          time: "O(n²)",
          space: "O(1)",
        },
      },
    },
    {
      name: "Quick Sort Visualization",
      content: {
        algorithmType: "quick_sort",
        title: "Quick Sort Algorithm",
        description: "Learn divide and conquer with Quick Sort visualization",
        initialArray: [64, 34, 25, 12, 22, 11, 90],
        speed: "medium",
        showCode: true,
        showComplexity: true,
        allowUserInput: true,
      },
    },
  ],
  interactive_coding: [
    {
      name: "Python Basics Challenge",
      content: {
        exerciseType: "code_completion",
        title: "Complete the Function",
        description: "Complete the missing parts of this Python function",
        instructions:
          "Fill in the blanks to make a function that calculates the sum of all numbers in a list",
        starterCode: `def calculate_sum(numbers):
    total = ___
    for num in numbers:
        total ___ num
    return ___`,
        solution: `def calculate_sum(numbers):
    total = 0
    for num in numbers:
        total += num
    return total`,
        testCases: [
          {
            input: "[1, 2, 3, 4, 5]",
            expectedOutput: "15",
            description: "Sum of 1 to 5",
          },
          {
            input: "[10, 20, 30]",
            expectedOutput: "60",
            description: "Sum of 10, 20, 30",
          },
        ],
        hints: [
          "Initialize total to 0",
          "Use += to add to total",
          "Return the total at the end",
        ],
      },
    },
  ],
};

// Memory Game Content Editor
function MemoryGameEditor({
  content,
  onChange,
}: {
  content: any;
  onChange: (content: any) => void;
}) {
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
      setPairs([
        ...pairs,
        { id: Date.now(), text: newPair.text, match: newPair.match },
      ]);
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
        <h3 className="text-lg font-semibold text-gray-900">
          Memory Game Pairs
        </h3>
        <div className="text-sm text-gray-500">{pairs.length} pairs</div>
      </div>

      {/* Settings */}
      <div className="grid gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Time Limit (seconds)
          </label>
          <input
            type="number"
            value={content.timeLimit || 300}
            onChange={(e) =>
              onChange({ ...content, timeLimit: parseInt(e.target.value) })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            min="60"
          />
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="shuffleCards"
            checked={content.shuffleCards !== false}
            onChange={(e) =>
              onChange({ ...content, shuffleCards: e.target.checked })
            }
            className="h-4 w-4 rounded border-gray-300 text-purple-600"
          />
          <label
            htmlFor="shuffleCards"
            className="text-sm font-medium text-gray-700"
          >
            Shuffle Cards
          </label>
        </div>
      </div>

      {/* Existing Pairs */}
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {pairs.map((pair: any, index: number) => (
          <div
            key={index}
            className="grid gap-2 rounded-lg border border-gray-200 bg-white p-3 md:grid-cols-3"
          >
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
              className="rounded-lg bg-red-100 px-3 py-2 text-red-600 transition-colors hover:bg-red-200"
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
            className="flex items-center justify-center space-x-1 rounded-lg bg-purple-600 px-3 py-2 text-white transition-colors hover:bg-purple-700"
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
function QuizEditor({
  content,
  onChange,
}: {
  content: any;
  onChange: (content: any) => void;
}) {
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
    if (
      newQuestion.question &&
      newQuestion.options.every((opt) => opt.trim())
    ) {
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
        <div className="text-sm text-gray-500">
          {questions.length} questions
        </div>
      </div>

      {/* Settings */}
      <div className="grid gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Time Limit (seconds)
          </label>
          <input
            type="number"
            value={content.timeLimit || 300}
            onChange={(e) =>
              onChange({ ...content, timeLimit: parseInt(e.target.value) })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            min="60"
          />
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="randomOrder"
            checked={content.randomOrder !== false}
            onChange={(e) =>
              onChange({ ...content, randomOrder: e.target.checked })
            }
            className="h-4 w-4 rounded border-gray-300 text-purple-600"
          />
          <label
            htmlFor="randomOrder"
            className="text-sm font-medium text-gray-700"
          >
            Random Question Order
          </label>
        </div>
      </div>

      {/* Existing Questions */}
      <div className="max-h-64 space-y-4 overflow-y-auto">
        {questions.map((question: any, qIndex: number) => (
          <div
            key={qIndex}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Question {qIndex + 1}
                </label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => {
                    const updatedQuestions = questions.map(
                      (q: any, i: number) =>
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
                      const updatedQuestions = questions.map(
                        (q: any, i: number) =>
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
                      const updatedQuestions = questions.map(
                        (q: any, i: number) =>
                          i === qIndex
                            ? {
                                ...q,
                                options: q.options.map(
                                  (opt: string, oi: number) =>
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
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, question: e.target.value })
            }
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
                  onChange={() =>
                    setNewQuestion({ ...newQuestion, correctAnswer: index })
                  }
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
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, explanation: e.target.value })
            }
            placeholder="Explanation (optional)..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />

          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Algorithm Visualization Content Editor
function AlgorithmVisualizationEditor({
  content,
  onChange,
}: {
  content: any;
  onChange: (content: any) => void;
}) {
  const algorithmTypes = [
    { value: "bubble_sort", label: "Bubble Sort" },
    { value: "quick_sort", label: "Quick Sort" },
    { value: "merge_sort", label: "Merge Sort" },
    { value: "insertion_sort", label: "Insertion Sort" },
    { value: "selection_sort", label: "Selection Sort" },
    { value: "binary_search", label: "Binary Search" },
    { value: "linear_search", label: "Linear Search" },
    { value: "dfs", label: "Depth-First Search" },
    { value: "bfs", label: "Breadth-First Search" },
  ];

  const speeds = [
    { value: "slow", label: "Slow (2s per step)" },
    { value: "medium", label: "Medium (1s per step)" },
    { value: "fast", label: "Fast (0.5s per step)" },
  ];

  const updateContent = (field: string, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const updateArrayElement = (index: number, value: string) => {
    const newArray = [...(content.initialArray || [])];
    newArray[index] = parseInt(value) || 0;
    updateContent("initialArray", newArray);
  };

  const addArrayElement = () => {
    const newArray = [...(content.initialArray || []), 0];
    updateContent("initialArray", newArray);
  };

  const removeArrayElement = (index: number) => {
    const newArray = (content.initialArray || []).filter(
      (_: any, i: number) => i !== index
    );
    updateContent("initialArray", newArray);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Algorithm Visualization
        </h3>
        <div className="text-sm text-gray-500">
          {content.algorithmType || "No algorithm selected"}
        </div>
      </div>

      {/* Basic Settings */}
      <div className="grid gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Algorithm Type
          </label>
          <select
            value={content.algorithmType || ""}
            onChange={(e) => updateContent("algorithmType", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select Algorithm</option>
            {algorithmTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Animation Speed
          </label>
          <select
            value={content.speed || "medium"}
            onChange={(e) => updateContent("speed", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {speeds.map((speed) => (
              <option key={speed.value} value={speed.value}>
                {speed.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Title and Description */}
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Visualization Title
          </label>
          <input
            type="text"
            value={content.title || ""}
            onChange={(e) => updateContent("title", e.target.value)}
            placeholder="e.g., Bubble Sort Visualization"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={content.description || ""}
            onChange={(e) => updateContent("description", e.target.value)}
            placeholder="Explain what this visualization demonstrates..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Initial Array */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Initial Array
        </label>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {(content.initialArray || []).map(
              (value: number, index: number) => (
                <div key={index} className="flex items-center space-x-1">
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => updateArrayElement(index, e.target.value)}
                    className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayElement(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )
            )}
            <button
              type="button"
              onClick={addArrayElement}
              className="rounded border border-dashed border-gray-300 px-3 py-1 text-sm text-gray-600 hover:border-gray-400"
            >
              <Plus className="mr-1 inline h-4 w-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="grid gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-3">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="showCode"
            checked={content.showCode !== false}
            onChange={(e) => updateContent("showCode", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-purple-600"
          />
          <label
            htmlFor="showCode"
            className="text-sm font-medium text-gray-700"
          >
            Show Code
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="showComplexity"
            checked={content.showComplexity !== false}
            onChange={(e) => updateContent("showComplexity", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-purple-600"
          />
          <label
            htmlFor="showComplexity"
            className="text-sm font-medium text-gray-700"
          >
            Show Complexity
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="allowUserInput"
            checked={content.allowUserInput !== false}
            onChange={(e) => updateContent("allowUserInput", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-purple-600"
          />
          <label
            htmlFor="allowUserInput"
            className="text-sm font-medium text-gray-700"
          >
            Allow User Input
          </label>
        </div>
      </div>

      {/* Code Snippet */}
      {content.showCode && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Code Snippet (Optional)
          </label>
          <textarea
            value={content.codeSnippet || ""}
            onChange={(e) => updateContent("codeSnippet", e.target.value)}
            placeholder="def algorithm():\n    # Your code here\n    pass"
            rows={6}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm"
          />
        </div>
      )}

      {/* Complexity Info */}
      {content.showComplexity && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Time Complexity
            </label>
            <input
              type="text"
              value={content.complexity?.time || ""}
              onChange={(e) =>
                updateContent("complexity", {
                  ...content.complexity,
                  time: e.target.value,
                })
              }
              placeholder="e.g., O(n²)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Space Complexity
            </label>
            <input
              type="text"
              value={content.complexity?.space || ""}
              onChange={(e) =>
                updateContent("complexity", {
                  ...content.complexity,
                  space: e.target.value,
                })
              }
              placeholder="e.g., O(1)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Interactive Coding Content Editor
function InteractiveCodingEditor({
  content,
  onChange,
}: {
  content: any;
  onChange: (content: any) => void;
}) {
  const exerciseTypes = [
    { value: "code_completion", label: "Code Completion" },
    { value: "bug_fixing", label: "Bug Fixing" },
    { value: "function_writing", label: "Function Writing" },
    { value: "algorithm_implementation", label: "Algorithm Implementation" },
  ];

  const [newTestCase, setNewTestCase] = useState({
    input: "",
    expectedOutput: "",
    description: "",
  });
  const [newHint, setNewHint] = useState("");

  const updateContent = (field: string, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const addTestCase = () => {
    if (newTestCase.input && newTestCase.expectedOutput) {
      const testCases = [
        ...(content.testCases || []),
        { ...newTestCase, id: Date.now() },
      ];
      updateContent("testCases", testCases);
      setNewTestCase({ input: "", expectedOutput: "", description: "" });
    }
  };

  const removeTestCase = (index: number) => {
    const testCases = (content.testCases || []).filter(
      (_: any, i: number) => i !== index
    );
    updateContent("testCases", testCases);
  };

  const addHint = () => {
    if (newHint.trim()) {
      const hints = [...(content.hints || []), newHint.trim()];
      updateContent("hints", hints);
      setNewHint("");
    }
  };

  const removeHint = (index: number) => {
    const hints = (content.hints || []).filter(
      (_: any, i: number) => i !== index
    );
    updateContent("hints", hints);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Interactive Coding Exercise
        </h3>
        <div className="text-sm text-gray-500">
          {content.exerciseType || "No type selected"}
        </div>
      </div>

      {/* Basic Settings */}
      <div className="grid gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Exercise Type
          </label>
          <select
            value={content.exerciseType || ""}
            onChange={(e) => updateContent("exerciseType", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select Type</option>
            {exerciseTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Title and Instructions */}
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Exercise Title
          </label>
          <input
            type="text"
            value={content.title || ""}
            onChange={(e) => updateContent("title", e.target.value)}
            placeholder="e.g., Complete the Function"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={content.description || ""}
            onChange={(e) => updateContent("description", e.target.value)}
            placeholder="Describe what the student needs to do..."
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Instructions
          </label>
          <textarea
            value={content.instructions || ""}
            onChange={(e) => updateContent("instructions", e.target.value)}
            placeholder="Provide detailed instructions..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Code Sections */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Starter Code
          </label>
          <textarea
            value={content.starterCode || ""}
            onChange={(e) => updateContent("starterCode", e.target.value)}
            placeholder="def function_name():\n    # Your code here\n    pass"
            rows={8}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Solution Code
          </label>
          <textarea
            value={content.solution || ""}
            onChange={(e) => updateContent("solution", e.target.value)}
            placeholder="def function_name():\n    # Complete solution\n    return result"
            rows={8}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm"
          />
        </div>
      </div>

      {/* Test Cases */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Test Cases
        </label>
        <div className="space-y-3">
          {(content.testCases || []).map((testCase: any, index: number) => (
            <div
              key={index}
              className="grid gap-2 rounded-lg border border-gray-200 bg-white p-3 md:grid-cols-4"
            >
              <input
                type="text"
                value={testCase.input}
                onChange={(e) => {
                  const testCases = [...content.testCases];
                  testCases[index].input = e.target.value;
                  updateContent("testCases", testCases);
                }}
                placeholder="Input"
                className="rounded border border-gray-300 px-2 py-1 font-mono text-sm"
              />
              <input
                type="text"
                value={testCase.expectedOutput}
                onChange={(e) => {
                  const testCases = [...content.testCases];
                  testCases[index].expectedOutput = e.target.value;
                  updateContent("testCases", testCases);
                }}
                placeholder="Expected Output"
                className="rounded border border-gray-300 px-2 py-1 font-mono text-sm"
              />
              <input
                type="text"
                value={testCase.description}
                onChange={(e) => {
                  const testCases = [...content.testCases];
                  testCases[index].description = e.target.value;
                  updateContent("testCases", testCases);
                }}
                placeholder="Description"
                className="rounded border border-gray-300 px-2 py-1 text-sm"
              />
              <button
                type="button"
                onClick={() => removeTestCase(index)}
                className="rounded bg-red-100 px-2 py-1 text-red-600 hover:bg-red-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* Add New Test Case */}
          <div className="border-t pt-3">
            <div className="grid gap-2 md:grid-cols-4">
              <input
                type="text"
                value={newTestCase.input}
                onChange={(e) =>
                  setNewTestCase({ ...newTestCase, input: e.target.value })
                }
                placeholder="Input"
                className="rounded border border-gray-300 px-2 py-1 font-mono text-sm"
              />
              <input
                type="text"
                value={newTestCase.expectedOutput}
                onChange={(e) =>
                  setNewTestCase({
                    ...newTestCase,
                    expectedOutput: e.target.value,
                  })
                }
                placeholder="Expected Output"
                className="rounded border border-gray-300 px-2 py-1 font-mono text-sm"
              />
              <input
                type="text"
                value={newTestCase.description}
                onChange={(e) =>
                  setNewTestCase({
                    ...newTestCase,
                    description: e.target.value,
                  })
                }
                placeholder="Description"
                className="rounded border border-gray-300 px-2 py-1 text-sm"
              />
              <button
                type="button"
                onClick={addTestCase}
                className="flex items-center justify-center rounded bg-purple-600 px-2 py-1 text-white hover:bg-purple-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hints */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Hints
        </label>
        <div className="space-y-2">
          {(content.hints || []).map((hint: string, index: number) => (
            <div
              key={index}
              className="flex items-center space-x-2 rounded border border-gray-200 bg-white p-2"
            >
              <span className="rounded bg-blue-100 px-2 py-1 text-sm text-xs font-medium text-blue-800">
                Hint {index + 1}
              </span>
              <input
                type="text"
                value={hint}
                onChange={(e) => {
                  const hints = [...content.hints];
                  hints[index] = e.target.value;
                  updateContent("hints", hints);
                }}
                className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
              />
              <button
                type="button"
                onClick={() => removeHint(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* Add New Hint */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newHint}
              onChange={(e) => setNewHint(e.target.value)}
              placeholder="Add a helpful hint..."
              className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addHint())
              }
            />
            <button
              type="button"
              onClick={addHint}
              className="flex items-center space-x-1 rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
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
      setFormData(
        editingActivity
          ? {
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
              tags: Array.isArray(editingActivity.tags)
                ? editingActivity.tags
                : [],
              isActive: editingActivity.isActive,
              sortOrder: editingActivity.sortOrder,
            }
          : initialData
      );
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
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const applyTemplate = (templateContent: any) => {
    setFormData((prev) => ({ ...prev, content: templateContent }));
  };

  if (!isOpen) return null;

  const selectedType = activityTypes.find(
    (type) => type.value === formData.activityType
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 p-6">
          <div className="flex items-center space-x-3">
            {selectedType && (
              <div
                className={`rounded-xl bg-gradient-to-r p-3 ${selectedType.color}`}
              >
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
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
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

        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Activity Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                      required
                      placeholder="Enter activity title..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Activity Type *
                    </label>
                    <select
                      value={formData.activityType}
                      onChange={(e) =>
                        setFormData((prev) => ({
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe what learners will do in this activity..."
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., anime, programming, math"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Difficulty (1-5)
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          difficulty: parseInt(e.target.value),
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                    >
                      {[1, 2, 3, 4, 5].map((level) => (
                        <option key={level} value={level}>
                          Level {level}{" "}
                          {level <= 2
                            ? "(Beginner)"
                            : level <= 3
                              ? "(Intermediate)"
                              : "(Advanced)"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Estimated Minutes
                    </label>
                    <input
                      type="number"
                      value={formData.estimatedMinutes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          estimatedMinutes: parseInt(e.target.value),
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                      min="1"
                      max="120"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Diamond Reward
                    </label>
                    <div className="relative">
                      <Diamond className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-600" />
                      <input
                        type="number"
                        value={formData.diamondReward}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            diamondReward: parseInt(e.target.value),
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Experience Reward
                    </label>
                    <div className="relative">
                      <Star className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-600" />
                      <input
                        type="number"
                        value={formData.experienceReward}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            experienceReward: parseInt(e.target.value),
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Tags
                  </label>
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
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                        placeholder="Add a tag..."
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
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
                {quickTemplates[
                  formData.activityType as keyof typeof quickTemplates
                ] && (
                  <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-4">
                    <div className="mb-3 flex items-center space-x-2">
                      <Rocket className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">
                        Quick Start Templates
                      </h4>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      {quickTemplates[
                        formData.activityType as keyof typeof quickTemplates
                      ]?.map((template, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => applyTemplate(template.content)}
                          className="rounded-lg border border-blue-200 bg-white p-3 text-left transition-all hover:border-blue-300 hover:shadow-sm"
                        >
                          <div className="text-sm font-medium text-blue-900">
                            {template.name}
                          </div>
                          <div className="mt-1 text-xs text-blue-600">
                            {(template.content as any).pairs?.length ||
                              (template.content as any).questions?.length ||
                              0}{" "}
                            items
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
                    onChange={(content) =>
                      setFormData((prev) => ({ ...prev, content }))
                    }
                  />
                )}

                {formData.activityType === "quiz" && (
                  <QuizEditor
                    content={formData.content}
                    onChange={(content) =>
                      setFormData((prev) => ({ ...prev, content }))
                    }
                  />
                )}

                {formData.activityType === "algorithm_visualization" && (
                  <AlgorithmVisualizationEditor
                    content={formData.content}
                    onChange={(content) =>
                      setFormData((prev) => ({ ...prev, content }))
                    }
                  />
                )}

                {formData.activityType === "interactive_coding" && (
                  <InteractiveCodingEditor
                    content={formData.content}
                    onChange={(content) =>
                      setFormData((prev) => ({ ...prev, content }))
                    }
                  />
                )}

                {/* Placeholder for other activity types */}
                {![
                  "memory_game",
                  "quiz",
                  "algorithm_visualization",
                  "interactive_coding",
                ].includes(formData.activityType) && (
                  <div className="rounded-lg bg-gray-50 py-12 text-center">
                    <div className="mb-4 text-gray-400">
                      <BookOpen className="mx-auto h-12 w-12" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                      Content Editor Coming Soon
                    </h3>
                    <p className="text-gray-600">
                      The editor for {formData.activityType} activities is under
                      development.
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                      min="0"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Lower numbers appear first
                    </p>
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
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label
                      htmlFor="isActive"
                      className="text-sm font-medium text-gray-700"
                    >
                      Make activity active and visible to users
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 border-t border-gray-200 bg-gray-50 p-6">
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
                  <span>
                    {editingActivity ? "Update Activity" : "Create Activity"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
