"use client";

import { useState, useEffect } from "react";
import { Play, Database, TrendingUp, Eye, RotateCcw } from "lucide-react";

interface Exploration {
  method: string;
  code: string;
  result: string;
  explanation: string;
}

interface DataExplorationContent {
  dataset?: string;
  explorations?: Exploration[];
  structures?: Array<{
    name: string;
    module: string;
    usage: string;
    advantages: string;
    complexity: string;
  }>;
  interactiveExamples?: boolean;
  practiceExercises?: string[];
}

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  content: DataExplorationContent;
}

interface DataExplorationActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function DataExplorationActivity({
  activity,
  onComplete,
}: DataExplorationActivityProps) {
  const [currentExploration, setCurrentExploration] = useState(0);
  const [exploredItems, setExploredItems] = useState<Set<number>>(new Set());
  const [showResult, setShowResult] = useState<{ [key: number]: boolean }>({});
  const [activeTab, setActiveTab] = useState<"explorations" | "structures">(
    "explorations"
  );

  const {
    dataset,
    explorations = [],
    structures = [],
    interactiveExamples,
    practiceExercises = [],
  } = activity.content;

  // Removed auto-completion - users should manually complete via button
  // This prevents the modal from closing automatically without user interaction

  const runExploration = (index: number) => {
    setShowResult((prev) => ({ ...prev, [index]: true }));
    setExploredItems((prev) => new Set([...prev, index]));

    // Simulate execution delay
    setTimeout(() => {
      // Result is already shown, this is just for effect
    }, 1000);
  };

  const resetExploration = (index: number) => {
    setShowResult((prev) => ({ ...prev, [index]: false }));
  };

  const completeActivity = () => {
    const completionRate =
      exploredItems.size / Math.max(explorations.length, structures.length);
    const score = Math.round(70 + completionRate * 30);
    onComplete(score, 100, true);
  };

  // Render explorations tab
  const renderExplorations = () => (
    <div className="space-y-6">
      {dataset && (
        <div className="mb-6 rounded-lg bg-gray-900 p-4">
          <div className="mb-3 flex items-center space-x-2">
            <Database className="h-5 w-5 text-green-400" />
            <span className="text-sm font-medium text-green-400">Dataset</span>
          </div>
          <pre className="font-mono text-sm text-green-300">{dataset}</pre>
        </div>
      )}

      <div className="grid gap-6">
        {explorations.map((exploration, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white"
          >
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {exploration.method}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => runExploration(index)}
                    disabled={showResult[index]}
                    className="flex items-center space-x-2 rounded bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    <Play className="h-4 w-4" />
                    <span>{showResult[index] ? "Executed" : "Run Code"}</span>
                  </button>
                  {showResult[index] && (
                    <button
                      onClick={() => resetExploration(index)}
                      className="flex items-center space-x-2 rounded bg-gray-500 px-3 py-2 text-sm text-white transition-colors hover:bg-gray-600"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4 rounded-lg bg-gray-900 p-4">
                <pre className="font-mono text-sm text-green-300">
                  {exploration.code}
                </pre>
              </div>

              {showResult[index] && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="mb-2 flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Output
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-sm text-blue-800">
                      {exploration.result}
                    </pre>
                  </div>

                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="mb-2 flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">
                        Explanation
                      </span>
                    </div>
                    <p className="text-sm text-green-800">
                      {exploration.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render data structures tab
  const renderStructures = () => (
    <div className="space-y-6">
      <div className="grid gap-6">
        {structures.map((structure, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white"
          >
            <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {structure.name}
                </h3>
                <button
                  onClick={() => {
                    setExploredItems((prev) => new Set([...prev, index]));
                    setShowResult((prev) => ({ ...prev, [index]: true }));
                  }}
                  disabled={showResult[index]}
                  className="flex items-center space-x-2 rounded bg-purple-600 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-700 disabled:bg-gray-400"
                >
                  <Eye className="h-4 w-4" />
                  <span>{showResult[index] ? "Explored" : "Explore"}</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h4 className="mb-2 font-medium text-gray-900">
                  Import & Basic Usage
                </h4>
                <div className="rounded-lg bg-gray-900 p-4">
                  <pre className="font-mono text-sm text-green-300">
                    {structure.module}
                    {"\n\n"}
                    {structure.usage}
                  </pre>
                </div>
              </div>

              {showResult[index] && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <h4 className="mb-2 font-medium text-blue-900">
                        Advantages
                      </h4>
                      <p className="text-sm text-blue-800">
                        {structure.advantages}
                      </p>
                    </div>

                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                      <h4 className="mb-2 font-medium text-orange-900">
                        Time Complexity
                      </h4>
                      <p className="text-sm text-orange-800">
                        {structure.complexity}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const totalItems = Math.max(explorations.length, structures.length);
  const progressPercentage =
    totalItems > 0 ? (exploredItems.size / totalItems) * 100 : 0;

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {activity.title}
        </h2>
        <p className="text-lg text-gray-600">{activity.description}</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Exploration Progress
          </span>
          <span className="text-sm text-gray-500">
            {exploredItems.size}/{totalItems} explored
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-purple-600 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Tabs */}
      {explorations.length > 0 && structures.length > 0 && (
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("explorations")}
                className={`border-b-2 px-1 py-2 text-sm font-medium ${
                  activeTab === "explorations"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Data Explorations ({explorations.length})
              </button>
              <button
                onClick={() => setActiveTab("structures")}
                className={`border-b-2 px-1 py-2 text-sm font-medium ${
                  activeTab === "structures"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Data Structures ({structures.length})
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Content */}
      {explorations.length > 0 &&
        (activeTab === "explorations" || structures.length === 0) &&
        renderExplorations()}
      {structures.length > 0 &&
        (activeTab === "structures" || explorations.length === 0) &&
        renderStructures()}

      {/* Practice Exercises */}
      {practiceExercises.length > 0 && (
        <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-yellow-900">
            Practice Exercises
          </h3>
          <ul className="space-y-2">
            {practiceExercises.map((exercise, index) => (
              <li
                key={index}
                className="flex items-center space-x-2 text-yellow-800"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-200 text-xs font-bold">
                  {index + 1}
                </span>
                <span>{exercise}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Completion Button */}
      {exploredItems.size >= Math.ceil(totalItems * 0.5) && (
        <div className="mt-8 text-center">
          <button
            onClick={completeActivity}
            className="rounded-lg bg-purple-600 px-8 py-3 font-bold text-white transition-colors hover:bg-purple-700"
          >
            Complete Exploration
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-2 font-semibold text-gray-900">💡 How to Explore:</h3>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>
            • Click "Run Code" or "Explore" buttons to see examples in action
          </li>
          <li>
            • Read the explanations to understand what each operation does
          </li>
          <li>• Explore at least half the items to complete the activity</li>
          {interactiveExamples && (
            <li>• Try modifying the code examples to experiment</li>
          )}
        </ul>
      </div>
    </div>
  );
}
