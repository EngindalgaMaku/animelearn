"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Code, Play, RotateCcw, Trophy } from "lucide-react";

interface Module {
  name: string;
  code: string;
  explanation: string;
}

interface CodeBuilderContent {
  project: string;
  description: string;
  modules: Module[];
  testGraph?: { [key: string]: string[] };
}

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  content: CodeBuilderContent;
}

interface CodeBuilderActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function CodeBuilderActivity({
  activity,
  onComplete,
}: CodeBuilderActivityProps) {
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<number>>(
    new Set()
  );
  const [builtCode, setBuiltCode] = useState<string[]>([]);
  const [showOutput, setShowOutput] = useState(false);
  const [projectCompleted, setProjectCompleted] = useState(false);

  const { project, description, modules, testGraph } = activity.content;

  useEffect(() => {
    // Auto-complete when all modules are built
    if (completedModules.size === modules.length && !projectCompleted) {
      setProjectCompleted(true);
      const score = 90 + completedModules.size * 2; // High score for completing all modules
      onComplete(Math.min(100, score), 100, true);
    }
  }, [completedModules, modules.length, projectCompleted, onComplete]);

  const addModule = (moduleIndex: number) => {
    const module = modules[moduleIndex];
    setBuiltCode((prev) => [...prev, module.code]);
    setCompletedModules((prev) => new Set([...prev, moduleIndex]));

    // Move to next module if available
    if (moduleIndex < modules.length - 1) {
      setCurrentModule(moduleIndex + 1);
    }
  };

  const removeModule = (codeIndex: number) => {
    setBuiltCode((prev) => prev.filter((_, index) => index !== codeIndex));
    // Reset completed modules that come after this one
    const moduleIndex = codeIndex;
    const newCompleted = new Set([...completedModules]);
    for (let i = moduleIndex; i < modules.length; i++) {
      newCompleted.delete(i);
    }
    setCompletedModules(newCompleted);
  };

  const testCode = () => {
    setShowOutput(true);
    // Simulate testing the built project
    setTimeout(() => {
      // Mark as completed if all modules are included
      if (builtCode.length === modules.length) {
        setCompletedModules(new Set(modules.map((_, index) => index)));
      }
    }, 1000);
  };

  const resetProject = () => {
    setCurrentModule(0);
    setCompletedModules(new Set());
    setBuiltCode([]);
    setShowOutput(false);
    setProjectCompleted(false);
  };

  const simulateOutput = () => {
    if (testGraph) {
      return `Graph Traversal Results:
DFS from A: A B D E F C
BFS from A: A B C D E F

Graph structure loaded successfully!
All nodes visited: ${Object.keys(testGraph).join(", ")}`;
    }

    return `Project built successfully!
All modules integrated correctly.
Code is ready for execution.`;
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {activity.title}
        </h2>
        <p className="mb-6 text-lg text-gray-600">{activity.description}</p>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 font-semibold text-blue-900">
            Project: {project}
          </h3>
          <p className="text-blue-800">{description}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Project Progress
          </span>
          <span className="text-sm text-gray-500">
            {completedModules.size}/{modules.length} modules built
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-green-600 transition-all duration-300"
            style={{
              width: `${(completedModules.size / modules.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Panel - Module Selection */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Available Modules
            </h3>

            <div className="space-y-4">
              {modules.map((module, index) => (
                <div
                  key={index}
                  className={`rounded-lg border-2 p-4 transition-all ${
                    completedModules.has(index)
                      ? "border-green-500 bg-green-50"
                      : index === currentModule
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">
                      {module.name}
                    </h4>
                    {completedModules.has(index) ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <button
                        onClick={() => addModule(index)}
                        disabled={index > currentModule}
                        className="rounded bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        Add Module
                      </button>
                    )}
                  </div>

                  <p className="mb-3 text-sm text-gray-600">
                    {module.explanation}
                  </p>

                  <div className="rounded bg-gray-900 p-3">
                    <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs text-green-300">
                      {module.code}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Built Project */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Built Project
              </h3>
              <div className="flex space-x-2">
                {builtCode.length > 0 && (
                  <button
                    onClick={testCode}
                    className="flex items-center space-x-2 rounded bg-green-600 px-4 py-2 text-sm text-white transition-colors hover:bg-green-700"
                  >
                    <Play className="h-4 w-4" />
                    <span>Test Code</span>
                  </button>
                )}
                <button
                  onClick={resetProject}
                  className="flex items-center space-x-2 rounded bg-gray-600 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-700"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="min-h-96 overflow-hidden rounded-lg bg-gray-900">
              <div className="flex items-center space-x-2 border-b border-gray-700 p-4">
                <Code className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-400">
                  {project}.py
                </span>
              </div>

              <div className="p-4">
                {builtCode.length > 0 ? (
                  <div className="space-y-4">
                    {builtCode.map((code, index) => (
                      <div key={index} className="group relative">
                        <button
                          onClick={() => removeModule(index)}
                          className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                        >
                          ×
                        </button>
                        <pre className="whitespace-pre-wrap font-mono text-sm text-green-300">
                          {code}
                        </pre>
                        {index < builtCode.length - 1 && (
                          <div className="my-4 border-t border-gray-700"></div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Code className="mx-auto mb-4 h-12 w-12 text-gray-600" />
                    <p className="text-gray-400">
                      Add modules to build your project
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Start with the first module and work your way down
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Output Panel */}
          {showOutput && (
            <div className="rounded-lg bg-black p-4">
              <div className="mb-3 flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span className="text-sm font-medium text-green-400">
                  Output
                </span>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-sm text-green-300">
                {simulateOutput()}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Module Flow Diagram */}
      <div className="mt-8 rounded-lg bg-gray-50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Module Build Order
        </h3>
        <div className="flex items-center justify-center space-x-4">
          {modules.map((module, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  completedModules.has(index)
                    ? "bg-green-500 text-white"
                    : index === currentModule
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-sm font-medium ${
                  completedModules.has(index)
                    ? "text-green-700"
                    : "text-gray-600"
                }`}
              >
                {module.name}
              </span>
              {index < modules.length - 1 && (
                <div className="h-0.5 w-8 bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Completion Message */}
      {projectCompleted && (
        <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6 text-center">
          <div className="mb-4 flex items-center justify-center space-x-2">
            <Trophy className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">
              Project Complete!
            </span>
          </div>
          <p className="mb-4 text-green-800">
            Congratulations! You've successfully built the {project} project by
            assembling all the required modules.
          </p>
          <div className="rounded-lg border border-green-200 bg-white p-4">
            <h4 className="mb-2 font-semibold text-green-900">
              What you learned:
            </h4>
            <ul className="space-y-1 text-sm text-green-800">
              <li>• How to structure complex code into modular components</li>
              <li>• The importance of proper code organization</li>
              <li>
                • How different modules work together in a complete system
              </li>
              <li>
                • Building projects step-by-step from individual components
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="mb-2 font-semibold text-blue-900">🏗️ How to Build:</h3>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• Add modules in the recommended order for best results</li>
          <li>• Read each module's explanation to understand its purpose</li>
          <li>• Test your code after adding modules to see it in action</li>
          <li>• Remove modules if you want to try a different approach</li>
          <li>• Complete all modules to finish the project</li>
        </ul>
      </div>
    </div>
  );
}
