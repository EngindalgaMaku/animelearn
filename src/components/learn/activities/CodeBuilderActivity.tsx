"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Plus,
  X,
  Check,
  Clock,
  Trophy,
  ArrowUp,
  ArrowDown,
  Play,
  RotateCcw,
} from "lucide-react";

interface CodeBlock {
  id: string;
  code: string;
  type: "variable" | "condition" | "loop" | "function" | "operation" | "return";
  category?: string;
  description?: string;
}

interface CodeBuilderActivityProps {
  activity: {
    content: {
      instructions?: string;
      targetOutput: string;
      availableBlocks: CodeBlock[];
      timeLimit?: number;
      language: string;
      hints?: string[];
      solution?: string[];
    };
  };
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function CodeBuilderActivity({
  activity,
  onComplete,
}: CodeBuilderActivityProps) {
  // Validate activity data
  if (!activity?.content) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-lg font-semibold text-red-500">
          Invalid Activity Data
        </div>
        <p className="text-gray-600">
          This code builder activity doesn't have the required content
          configuration.
        </p>
      </div>
    );
  }

  const contentData = activity.content;
  const contentBlocks = contentData.availableBlocks || [];
  const targetOutput = contentData.targetOutput || "";

  if (contentBlocks.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-lg font-semibold text-red-500">
          No Code Blocks Available
        </div>
        <p className="text-gray-600">
          This activity doesn't have any code blocks to work with.
        </p>
      </div>
    );
  }

  const [selectedBlocks, setSelectedBlocks] = useState<CodeBlock[]>([]);
  const [availableBlocks, setAvailableBlocks] =
    useState<CodeBlock[]>(contentBlocks);
  const [output, setOutput] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(contentData.timeLimit || 600);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      handleComplete();
    }
  }, [timeLeft, isCompleted]);

  const addBlock = (block: CodeBlock) => {
    setSelectedBlocks([
      ...selectedBlocks,
      { ...block, id: `${block.id}_${Date.now()}` },
    ]);
    setIsCorrect(null);
    setOutput("");
  };

  const removeBlock = (index: number) => {
    setSelectedBlocks(selectedBlocks.filter((_, i) => i !== index));
    setIsCorrect(null);
    setOutput("");
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newBlocks = [...selectedBlocks];
    if (direction === "up" && index > 0) {
      [newBlocks[index], newBlocks[index - 1]] = [
        newBlocks[index - 1],
        newBlocks[index],
      ];
    } else if (direction === "down" && index < selectedBlocks.length - 1) {
      [newBlocks[index], newBlocks[index + 1]] = [
        newBlocks[index + 1],
        newBlocks[index],
      ];
    }
    setSelectedBlocks(newBlocks);
    setIsCorrect(null);
    setOutput("");
  };

  const runCode = () => {
    if (selectedBlocks.length === 0) {
      setOutput("No code to run!");
      return;
    }

    // Simulate code execution
    const codeString = selectedBlocks.map((block) => block.code).join("\n");

    try {
      // Simple simulation - in reality this would execute the code
      let simulatedOutput = "";

      // Basic pattern matching for common outputs
      if (codeString.includes("print") || codeString.includes("console.log")) {
        // Extract print statements
        const printMatches = codeString.match(
          /(print|console\.log)\s*\(\s*['"`]([^'"`]*)['"`]\s*\)/g
        );
        if (printMatches) {
          simulatedOutput = printMatches
            .map((match) => {
              const content = match.match(/['"`]([^'"`]*)['"`]/);
              return content ? content[1] : "";
            })
            .join("\n");
        } else {
          simulatedOutput = "Hello, World!"; // Default output
        }
      } else if (codeString.includes("return")) {
        simulatedOutput = "Function completed successfully";
      } else {
        simulatedOutput = "Code executed";
      }

      setOutput(simulatedOutput);

      // Check if output matches target
      const isMatch = simulatedOutput.trim() === targetOutput.trim();
      setIsCorrect(isMatch);

      if (isMatch && !isCompleted) {
        setTimeout(() => handleComplete(true), 1000);
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
      setIsCorrect(false);
    }
  };

  const handleComplete = (success: boolean = false) => {
    try {
      setIsCompleted(true);

      let finalScore = 0;
      if (success) {
        // Base score for correctness
        finalScore = 70;

        // Time bonus (30% max)
        const timeBonus = Math.round(
          (timeLeft / (contentData.timeLimit || 600)) * 30
        );
        finalScore += timeBonus;
      } else {
        // Partial credit for effort
        const totalBlocks = contentBlocks.length || 1;
        finalScore = Math.min(50, (selectedBlocks.length / totalBlocks) * 50);
      }

      setScore(finalScore);
      onComplete(finalScore, 100, success);
    } catch (error) {
      console.error("Error completing code builder activity:", error);
      onComplete(0, 100, false);
    }
  };

  const resetActivity = () => {
    try {
      setSelectedBlocks([]);
      setOutput("");
      setIsCorrect(null);
      setIsCompleted(false);
      setScore(0);
      setTimeLeft(contentData.timeLimit || 600);
      setShowHints(false);
      setCurrentHint(0);
    } catch (error) {
      console.error("Error resetting activity:", error);
    }
  };

  const getBlockColor = (type: string) => {
    const colors = {
      variable: "bg-blue-100 border-blue-300 text-blue-800",
      condition: "bg-green-100 border-green-300 text-green-800",
      loop: "bg-purple-100 border-purple-300 text-purple-800",
      function: "bg-orange-100 border-orange-300 text-orange-800",
      operation: "bg-yellow-100 border-yellow-300 text-yellow-800",
      return: "bg-red-100 border-red-300 text-red-800",
    };
    return (
      colors[type as keyof typeof colors] ||
      "bg-gray-100 border-gray-300 text-gray-800"
    );
  };

  if (isCompleted) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <div className="mb-6">
          <Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Code Building Complete!
          </h2>
          <div className="mb-4 text-lg text-gray-600">You scored {score}%</div>

          <div
            className={`mb-6 rounded-lg p-4 font-medium ${
              score >= 70
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {score >= 70
              ? "🎉 Excellent! Your code produces the correct output!"
              : "💪 Good effort! Keep practicing to improve your coding logic."}
          </div>

          {contentData.solution && (
            <div className="mb-6 rounded-lg bg-gray-50 p-6 text-left">
              <h3 className="mb-4 text-lg font-semibold">Example Solution:</h3>
              <pre className="overflow-x-auto rounded bg-gray-900 p-4 font-mono text-sm text-green-400">
                {Array.isArray(contentData.solution)
                  ? contentData.solution.join("\n")
                  : contentData.solution}
              </pre>
            </div>
          )}
        </div>

        <button
          onClick={resetActivity}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">
              Code Builder - {contentData.language || "Code"}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>
                {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <div className="text-sm">Blocks Used: {selectedBlocks.length}</div>
          </div>
        </div>

        {contentData.instructions && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-blue-800">{contentData.instructions}</p>
          </div>
        )}

        {/* Target Output */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <h3 className="mb-2 font-semibold text-green-900">
            🎯 Target Output:
          </h3>
          <pre className="rounded border bg-white p-3 font-mono text-sm text-gray-800">
            {targetOutput || "No target output specified"}
          </pre>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Available Blocks */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Available Code Blocks
          </h3>

          {/* Block Categories */}
          {Object.entries(
            availableBlocks.reduce(
              (acc, block) => {
                const type = block.type;
                if (!acc[type]) acc[type] = [];
                acc[type].push(block);
                return acc;
              },
              {} as Record<string, CodeBlock[]>
            )
          ).map(([type, blocks]) => (
            <div key={type} className="space-y-2">
              <h4 className="text-sm font-medium capitalize text-gray-700">
                {type}s
              </h4>
              {blocks.map((block) => (
                <motion.button
                  key={block.id}
                  onClick={() => addBlock(block)}
                  className={`w-full rounded-lg border-2 p-3 text-left font-mono text-sm transition-all hover:shadow-md ${getBlockColor(block.type)}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span>{block.code}</span>
                    <Plus className="h-4 w-4" />
                  </div>
                  {block.description && (
                    <div className="mt-1 text-xs opacity-75">
                      {block.description}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          ))}

          {/* Hints */}
          {contentData.hints && contentData.hints.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowHints(!showHints)}
                className="w-full rounded-lg border border-yellow-300 bg-yellow-100 p-3 font-medium text-yellow-800 transition-colors hover:bg-yellow-200"
              >
                {showHints ? "Hide Hints" : "Show Hints"} 💡
              </button>

              <AnimatePresence>
                {showHints && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3"
                  >
                    <p className="text-sm text-yellow-800">
                      {contentData.hints?.[currentHint] || "No hint available"}
                    </p>
                    {(contentData.hints?.length || 0) > 1 && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-yellow-700">
                          Hint {currentHint + 1} of{" "}
                          {contentData.hints?.length || 0}
                        </span>
                        <div className="space-x-1">
                          <button
                            onClick={() =>
                              setCurrentHint(Math.max(0, currentHint - 1))
                            }
                            disabled={currentHint === 0}
                            className="rounded bg-yellow-200 px-2 py-1 text-xs text-yellow-800 disabled:opacity-50"
                          >
                            Prev
                          </button>
                          <button
                            onClick={() =>
                              setCurrentHint(
                                Math.min(
                                  (contentData.hints?.length || 1) - 1,
                                  currentHint + 1
                                )
                              )
                            }
                            disabled={
                              currentHint ===
                              (contentData.hints?.length || 1) - 1
                            }
                            className="rounded bg-yellow-200 px-2 py-1 text-xs text-yellow-800 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Code Builder Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Your Code</h3>
            <button
              onClick={resetActivity}
              className="p-2 text-gray-600 transition-colors hover:text-gray-800"
              title="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <div className="min-h-96 rounded-lg bg-gray-900 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex space-x-1">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-sm text-gray-400">
                {contentData.language || "Code"}
              </span>
            </div>

            <div className="space-y-2">
              {selectedBlocks.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  Drag code blocks here to build your program
                </div>
              ) : (
                selectedBlocks.map((block, index) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center justify-between rounded border-2 p-3 font-mono text-sm ${getBlockColor(block.type)}`}
                  >
                    <span>{block.code}</span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => moveBlock(index, "up")}
                        disabled={index === 0}
                        className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => moveBlock(index, "down")}
                        disabled={index === selectedBlocks.length - 1}
                        className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeBlock(index)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="mt-4 border-t border-gray-700 pt-4">
              <button
                onClick={runCode}
                disabled={selectedBlocks.length === 0}
                className="inline-flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <Play className="h-4 w-4" />
                <span>Run Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* Output Area */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Output</h3>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Console Output
              </span>
              {isCorrect !== null && (
                <div
                  className={`flex items-center space-x-1 text-sm ${
                    isCorrect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCorrect ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  <span>{isCorrect ? "Correct!" : "Incorrect"}</span>
                </div>
              )}
            </div>

            <pre className="min-h-24 whitespace-pre-wrap rounded bg-gray-900 p-3 font-mono text-sm text-green-400">
              {output || "Run your code to see output..."}
            </pre>
          </div>

          {/* Quick Reference */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-3 font-semibold text-gray-900">Block Types</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded border border-blue-300 bg-blue-100"></div>
                <span>Variables - Store data</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded border border-green-300 bg-green-100"></div>
                <span>Conditions - Decision making</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded border border-purple-300 bg-purple-100"></div>
                <span>Loops - Repeat actions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded border border-orange-300 bg-orange-100"></div>
                <span>Functions - Reusable code</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
