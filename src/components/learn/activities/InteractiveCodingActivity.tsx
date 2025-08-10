"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  CheckCircle,
  X,
  Clock,
  Trophy,
  Code,
  ArrowRight,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";

interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

interface InteractiveCodingActivityProps {
  activity: {
    content: {
      instructions?: string;
      problem: string;
      starterCode: string;
      solution: string;
      testCases: TestCase[];
      timeLimit?: number;
      language: string;
      hints?: string[];
    };
  };
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function InteractiveCodingActivity({
  activity,
  onComplete,
}: InteractiveCodingActivityProps) {
  // Validate activity data
  if (!activity?.content) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-lg font-semibold text-red-500">
          Invalid Activity Data
        </div>
        <p className="text-gray-600">
          This coding challenge doesn't have the required content configuration.
        </p>
      </div>
    );
  }

  const contentData = activity.content;
  const starterCode = contentData.starterCode || "// Write your code here...";
  const testCases = contentData.testCases || [];

  if (!contentData.problem) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-lg font-semibold text-red-500">
          Missing Problem Statement
        </div>
        <p className="text-gray-600">
          This coding challenge doesn't have a problem to solve.
        </p>
      </div>
    );
  }

  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState<string>("");
  const [testResults, setTestResults] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [isRunning, setIsRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(contentData.timeLimit || 1800);
  const [currentHint, setCurrentHint] = useState(0);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      handleComplete();
    }
  }, [timeLeft, isCompleted]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput("");

    try {
      // Simulate code execution - in a real implementation, this would send to a code execution API
      const results: { [key: number]: boolean } = {};
      let allPassed = true;

      // Simulate test case evaluation
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];

        if (!testCase) {
          results[i] = false;
          allPassed = false;
          continue;
        }

        // Mock evaluation - in reality, this would execute the code with test inputs
        const mockResult =
          code.includes("return") && code.length > starterCode.length;
        results[i] = mockResult;

        if (!mockResult) {
          allPassed = false;
        }
      }

      setTestResults(results);

      if (allPassed) {
        setOutput("✅ All test cases passed! Great job!");
        handleComplete(true);
      } else {
        setOutput("❌ Some test cases failed. Check your code and try again.");
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleComplete = (success: boolean = false) => {
    try {
      setIsCompleted(true);
      const passedTests = Object.values(testResults).filter(Boolean).length;
      const totalTests = testCases.length || 1;
      const finalScore = Math.round((passedTests / totalTests) * 100);
      setScore(finalScore);

      onComplete(finalScore, 100, success || finalScore >= 70);
    } catch (error) {
      console.error("Error completing coding activity:", error);
      onComplete(0, 100, false);
    }
  };

  const resetCode = () => {
    try {
      setCode(starterCode);
      setOutput("");
      setTestResults({});
      setShowSolution(false);
    } catch (error) {
      console.error("Error resetting code:", error);
    }
  };

  const restartActivity = () => {
    try {
      setCode(starterCode);
      setOutput("");
      setTestResults({});
      setShowSolution(false);
      setIsCompleted(false);
      setScore(0);
      setTimeLeft(contentData.timeLimit || 1800);
      setCurrentHint(0);
      setShowHints(false);
    } catch (error) {
      console.error("Error restarting activity:", error);
    }
  };

  const toggleHints = () => {
    setShowHints(!showHints);
  };

  const nextHint = () => {
    const hints = contentData.hints || [];
    if (hints.length > 0 && currentHint < hints.length - 1) {
      setCurrentHint(currentHint + 1);
    }
  };

  const prevHint = () => {
    if (currentHint > 0) {
      setCurrentHint(currentHint - 1);
    }
  };

  if (isCompleted) {
    const passedTests = Object.values(testResults).filter(Boolean).length;

    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <div className="mb-6">
          <Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Coding Challenge Complete!
          </h2>
          <div className="mb-4 text-lg text-gray-600">
            You passed {passedTests}/{testCases.length} test cases ({score}%)
          </div>

          <div
            className={`mb-6 rounded-lg p-4 font-medium ${
              score >= 70
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {score >= 70
              ? "🎉 Excellent! Your solution works correctly!"
              : "💪 Good effort! Keep practicing to improve your coding skills."}
          </div>
        </div>

        <button
          onClick={restartActivity}
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
              Interactive Coding Challenge
            </span>
            <span className="rounded bg-gray-100 px-2 py-1 text-sm">
              {contentData.language || "Code"}
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
            <div className="text-sm">
              Tests Passed: {Object.values(testResults).filter(Boolean).length}/
              {testCases.length}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Problem Description */}
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Problem</h3>
            {contentData.instructions && (
              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  {contentData.instructions}
                </p>
              </div>
            )}
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-line text-gray-700">
                {contentData.problem}
              </p>
            </div>
          </div>

          {/* Test Cases */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Test Cases</h3>
            <div className="space-y-3">
              {testCases.map((testCase, index) => (
                <div
                  key={index}
                  className={`rounded-lg border p-3 ${
                    testResults[index] === true
                      ? "border-green-300 bg-green-50"
                      : testResults[index] === false
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Test Case {index + 1}
                    </span>
                    {testResults[index] === true && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    {testResults[index] === false && (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  {testCase.description && (
                    <p className="mb-2 text-xs text-gray-600">
                      {testCase.description}
                    </p>
                  )}
                  <div className="font-mono text-xs">
                    <div>
                      Input:{" "}
                      <span className="text-blue-600">{testCase.input}</span>
                    </div>
                    <div>
                      Expected:{" "}
                      <span className="text-green-600">
                        {testCase.expectedOutput}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hints */}
          {contentData.hints && contentData.hints.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Hints</h3>
                <button
                  onClick={toggleHints}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                >
                  {showHints ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="text-sm">{showHints ? "Hide" : "Show"}</span>
                </button>
              </div>

              <AnimatePresence>
                {showHints && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                      <p className="mb-3 text-sm text-yellow-800">
                        {contentData.hints?.[currentHint] ||
                          "No hint available"}
                      </p>
                      {(contentData.hints?.length || 0) > 1 && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-yellow-700">
                            Hint {currentHint + 1} of{" "}
                            {contentData.hints?.length || 0}
                          </span>
                          <div className="space-x-2">
                            <button
                              onClick={prevHint}
                              disabled={currentHint === 0}
                              className="rounded bg-yellow-200 px-2 py-1 text-xs text-yellow-800 disabled:opacity-50"
                            >
                              Prev
                            </button>
                            <button
                              onClick={nextHint}
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
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm font-medium text-gray-300">
                  {contentData.language || "Code"} Editor
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetCode}
                  className="p-1 text-gray-400 transition-colors hover:text-white"
                  title="Reset to starter code"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="p-1 text-gray-400 transition-colors hover:text-white"
                  title="Toggle solution"
                >
                  {showSolution ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={
                  showSolution
                    ? contentData.solution || "// Solution not available"
                    : code
                }
                onChange={(e) => setCode(e.target.value)}
                disabled={showSolution}
                className="h-96 w-full resize-none bg-gray-900 p-4 font-mono text-sm text-green-400 focus:outline-none"
                placeholder="Write your code here..."
              />
              {showSolution && (
                <div className="absolute right-2 top-2 rounded bg-yellow-500 px-2 py-1 text-xs font-medium text-yellow-900">
                  Solution Preview
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 bg-gray-50 p-4">
              <button
                onClick={runCode}
                disabled={isRunning || showSolution}
                className="inline-flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isRunning ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Run Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output */}
          {output && (
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h4 className="mb-2 font-semibold text-gray-900">Output</h4>
              <pre className="whitespace-pre-wrap rounded bg-gray-900 p-3 font-mono text-sm text-green-400">
                {output}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
