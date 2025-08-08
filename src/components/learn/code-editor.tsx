"use client";

import { useState, useEffect } from "react";
import {
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Lightbulb,
  Loader2,
  Zap,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { usePyodide } from "@/hooks/usePyodide";
import Editor from "@monaco-editor/react";

interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  testCases: TestCase[];
  hints: string[];
  difficulty: "easy" | "medium" | "hard";
}

interface CodeEditorProps {
  lessonId: string;
  exercise: Exercise;
  onCodeSubmit: (code: string, isCorrect: boolean, score: number) => void;
}

export default function CodeEditor({
  lessonId,
  exercise,
  onCodeSubmit,
}: CodeEditorProps) {
  const [code, setCode] = useState(exercise.starterCode || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<
    Array<{
      testCase: TestCase;
      passed: boolean;
      actualOutput: string;
      error?: string;
      executionTime?: number;
    }>
  >([]);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "light">(
    "vs-dark"
  );

  // Pyodide hook for real Python execution
  const {
    isReady: pyodideReady,
    loading: pyodideLoading,
    runPython,
    runTests,
  } = usePyodide();

  // Reset code to starter code
  const resetCode = () => {
    setCode(exercise.starterCode || "");
    setOutput("");
    setTestResults([]);
  };

  // Run code with Pyodide
  const runCode = async () => {
    if (!pyodideReady) {
      setOutput("⚠️ Python interpreter is still loading. Please wait...");
      return;
    }

    setIsRunning(true);
    setOutput("");
    setTestResults([]);

    try {
      // If there are test cases, run them
      if (exercise.testCases && exercise.testCases.length > 0) {
        const results = await runTests(code, exercise.testCases);
        // Transform results to match interface
        const transformedResults = results.map((result) => ({
          ...result,
          error: result.error || undefined, // Convert null to undefined
        }));
        setTestResults(transformedResults);

        const passedTests = results.filter((r) => r.passed).length;
        const score = Math.round((passedTests / results.length) * 100);
        const isCorrect = passedTests === results.length;
        const avgTime = Math.round(
          results.reduce((sum, r) => sum + r.executionTime, 0) / results.length
        );

        setExecutionTime(avgTime);
        setOutput(
          `✅ Tests completed: ${passedTests}/${results.length} passed (${score}%)\n⚡ Execution time: ${avgTime}ms`
        );

        // Call parent callback
        onCodeSubmit(code, isCorrect, score);
      } else {
        // Just run the code without tests
        const result = await runPython(code);
        setExecutionTime(result.executionTime);

        if (result.isSuccess) {
          setOutput(
            `✅ Code executed successfully!\n${
              result.output || "(No output)"
            }\n⚡ Execution time: ${result.executionTime}ms`
          );
          onCodeSubmit(code, true, 100);
        } else {
          setOutput(
            `❌ Error occurred:\n${result.error}\n⚡ Execution time: ${result.executionTime}ms`
          );
          onCodeSubmit(code, false, 0);
        }
      }
    } catch (error) {
      setOutput(`💥 Unexpected error: ${error}`);
      onCodeSubmit(code, false, 0);
    } finally {
      setIsRunning(false);
    }
  };

  // Quick run without tests (for testing code snippets)
  const quickRun = async () => {
    if (!pyodideReady) {
      setOutput("⚠️ Python interpreter is still loading. Please wait...");
      return;
    }

    setIsRunning(true);
    try {
      const result = await runPython(code);
      setExecutionTime(result.executionTime);

      if (result.isSuccess) {
        setOutput(
          `${result.output || "(No output)"}\n⚡ ${result.executionTime}ms`
        );
      } else {
        setOutput(`❌ ${result.error}\n⚡ ${result.executionTime}ms`);
      }
    } catch (error) {
      setOutput(`💥 ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Save code progress
  const saveProgress = async () => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "save_code",
          code: code,
          timeSpent: 5, // Mock time spent
        }),
      });

      if (response.ok) {
        console.log("Progress saved");
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(saveProgress, 30000);
    return () => clearInterval(interval);
  }, [code]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "hard":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Exercise Header */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{exercise.title}</h2>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${getDifficultyColor(
              exercise.difficulty
            )}`}
          >
            {exercise.difficulty.toUpperCase()}
          </span>
        </div>
        <p className="mb-4 text-gray-700">{exercise.description}</p>

        {/* Test Cases */}
        {exercise.testCases && exercise.testCases.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 font-semibold">Test Cases:</h3>
            <div className="space-y-2">
              {exercise.testCases.map((testCase, index) => (
                <div key={index} className="rounded bg-gray-50 p-3 text-sm">
                  <div className="font-medium text-gray-700">
                    {testCase.description}
                  </div>
                  <div className="text-gray-600">
                    Input: <code>{testCase.input}</code>
                  </div>
                  <div className="text-gray-600">
                    Expected: <code>{testCase.expectedOutput}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Code Editor */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold">Code Editor</h3>
            {pyodideLoading && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading Python...
              </div>
            )}
            {pyodideReady && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <Zap className="h-4 w-4" />
                Python Ready
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-2 rounded bg-yellow-100 px-3 py-2 text-sm text-yellow-700 hover:bg-yellow-200"
            >
              <Lightbulb className="h-4 w-4" />
              Hints ({exercise.hints?.length || 0})
            </button>
            <button
              onClick={resetCode}
              className="flex items-center gap-2 rounded bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            {exercise.testCases && exercise.testCases.length > 0 && (
              <button
                onClick={quickRun}
                disabled={isRunning || !pyodideReady}
                className="flex items-center gap-2 rounded bg-blue-100 px-3 py-2 text-sm text-blue-700 hover:bg-blue-200 disabled:opacity-50"
              >
                <Zap className="h-4 w-4" />
                Quick Run
              </button>
            )}
            <button
              onClick={runCode}
              disabled={isRunning || !pyodideReady}
              className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  {exercise.testCases && exercise.testCases.length > 0
                    ? "Run Tests"
                    : "Run Code"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hints Panel */}
        {showHints && exercise.hints && exercise.hints.length > 0 && (
          <div className="border-b bg-yellow-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-medium text-yellow-800">
                Hint {currentHint + 1} of {exercise.hints.length}
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentHint(Math.max(0, currentHint - 1))}
                  disabled={currentHint === 0}
                  className="rounded bg-yellow-200 px-2 py-1 text-sm text-yellow-800 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentHint(
                      Math.min(exercise.hints.length - 1, currentHint + 1)
                    )
                  }
                  disabled={currentHint === exercise.hints.length - 1}
                  className="rounded bg-yellow-200 px-2 py-1 text-sm text-yellow-800 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
            <p className="text-yellow-700">{exercise.hints[currentHint]}</p>
          </div>
        )}

        {/* Monaco Editor */}
        <div
          className={`${
            isFullscreen ? "fixed inset-0 z-50 bg-white" : "relative"
          }`}
        >
          {isFullscreen && (
            <div className="flex items-center justify-between border-b bg-gray-50 p-4">
              <h3 className="font-semibold">Code Editor - Fullscreen</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setEditorTheme(
                      editorTheme === "vs-dark" ? "light" : "vs-dark"
                    )
                  }
                  className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
                >
                  {editorTheme === "vs-dark" ? "☀️ Light" : "🌙 Dark"}
                </button>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="flex items-center gap-1 rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
                >
                  <Minimize2 className="h-4 w-4" />
                  Exit Fullscreen
                </button>
              </div>
            </div>
          )}

          <div className="relative">
            {!isFullscreen && (
              <div className="absolute right-2 top-2 z-10 flex gap-1">
                <button
                  onClick={() =>
                    setEditorTheme(
                      editorTheme === "vs-dark" ? "light" : "vs-dark"
                    )
                  }
                  className="rounded bg-black/20 p-1 text-xs text-white hover:bg-black/40"
                  title="Toggle theme"
                >
                  {editorTheme === "vs-dark" ? "☀️" : "🌙"}
                </button>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="rounded bg-black/20 p-1 text-white hover:bg-black/40"
                  title="Fullscreen"
                >
                  <Maximize2 className="h-3 w-3" />
                </button>
              </div>
            )}

            <div className={isFullscreen ? "h-[calc(100vh-80px)]" : "h-96"}>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`h-full w-full resize-none border-0 p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  editorTheme === "vs-dark"
                    ? "bg-gray-900 text-green-400"
                    : "bg-white text-gray-800"
                }`}
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  tabSize: 4,
                }}
                placeholder="# Write your Python code here..."
                spellCheck={false}
                onKeyDown={(e) => {
                  // Handle Tab key for indentation
                  if (e.key === "Tab") {
                    e.preventDefault();
                    const start = e.currentTarget.selectionStart;
                    const end = e.currentTarget.selectionEnd;
                    const newValue =
                      code.substring(0, start) + "    " + code.substring(end);
                    setCode(newValue);
                    // Set cursor position after the inserted tab
                    setTimeout(() => {
                      e.currentTarget.selectionStart =
                        e.currentTarget.selectionEnd = start + 4;
                    }, 0);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Output */}
      {output && (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Output</h3>
            {executionTime > 0 && (
              <span className="text-sm text-gray-500">
                ⚡ {executionTime}ms
              </span>
            )}
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-gray-900 p-4 text-sm text-green-400">
            {output}
          </pre>
        </div>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="mb-4 font-semibold">Test Results</h3>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`rounded-lg border p-3 ${
                  result.passed
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  {result.passed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span
                    className={`font-medium ${
                      result.passed ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    Test {index + 1}: {result.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>Description: {result.testCase.description}</div>
                  <div>
                    Input: <code>{result.testCase.input}</code>
                  </div>
                  <div>
                    Expected: <code>{result.testCase.expectedOutput}</code>
                  </div>
                  <div>
                    Actual: <code>{result.actualOutput}</code>
                  </div>
                  {result.error && (
                    <div className="mt-1 text-red-600">
                      <strong>Error:</strong> {result.error}
                    </div>
                  )}
                  {result.executionTime && (
                    <div className="mt-1 text-xs text-gray-500">
                      ⚡ {result.executionTime}ms
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
